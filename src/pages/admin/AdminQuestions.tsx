import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Subject, Topic, Question, QuestionOption } from "@/types/database";
import { Plus, Pencil, Trash2, Search, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type ViewMode = "list" | "edit";

const AdminQuestions: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<(Question & { question_options: QuestionOption[] })[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState<{
    banca: string; orgao: string; cargo: string; ano: number; localidade: string;
    subject_id: string; topic_id: string; enunciado: string; explicacao: string;
    explanation_main: string; correct_option_comment: string; wrong_option_comment: string;
    option_a_comment: string; option_b_comment: string; option_c_comment: string;
    option_d_comment: string; option_e_comment: string;
    legal_basis: string; exam_tip: string;
    dificuldade: "facil" | "medio" | "dificil"; origem: string;
    tipo: "oficial" | "autoral"; status: "rascunho" | "publicado";
  }>({
    banca: "", orgao: "", cargo: "", ano: 2024, localidade: "",
    subject_id: "", topic_id: "", enunciado: "", explicacao: "",
    explanation_main: "", correct_option_comment: "", wrong_option_comment: "",
    option_a_comment: "", option_b_comment: "", option_c_comment: "",
    option_d_comment: "", option_e_comment: "",
    legal_basis: "", exam_tip: "",
    dificuldade: "medio", origem: "", tipo: "autoral", status: "rascunho",
  });
  const [options, setOptions] = useState([
    { letter: "A", text: "", is_correct: false },
    { letter: "B", text: "", is_correct: false },
    { letter: "C", text: "", is_correct: false },
    { letter: "D", text: "", is_correct: false },
    { letter: "E", text: "", is_correct: false },
  ]);

  const fetchData = async () => {
    setLoading(true);
    const [sRes, tRes, qRes] = await Promise.all([
      supabase.from("subjects").select("*").order("order_num"),
      supabase.from("topics").select("*"),
      supabase.from("questions").select("*, question_options(*)").order("created_at", { ascending: false }),
    ]);
    if (sRes.data) setSubjects(sRes.data);
    if (tRes.data) setTopics(tRes.data);
    if (qRes.data) setQuestions(qRes.data as any);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({
      banca: "", orgao: "", cargo: "", ano: 2024, localidade: "",
      subject_id: "", topic_id: "", enunciado: "", explicacao: "",
      explanation_main: "", correct_option_comment: "", wrong_option_comment: "",
      option_a_comment: "", option_b_comment: "", option_c_comment: "",
      option_d_comment: "", option_e_comment: "",
      legal_basis: "", exam_tip: "",
      dificuldade: "medio", origem: "", tipo: "autoral", status: "rascunho",
    });
    setOptions([
      { letter: "A", text: "", is_correct: false },
      { letter: "B", text: "", is_correct: false },
      { letter: "C", text: "", is_correct: false },
      { letter: "D", text: "", is_correct: false },
      { letter: "E", text: "", is_correct: false },
    ]);
    setEditingId(null);
  };

  const startEdit = (q: Question & { question_options: QuestionOption[] }) => {
    setForm({
      banca: q.banca, orgao: q.orgao, cargo: q.cargo, ano: q.ano, localidade: q.localidade,
      subject_id: q.subject_id, topic_id: q.topic_id, enunciado: q.enunciado, explicacao: q.explicacao,
      explanation_main: (q as any).explanation_main || '', correct_option_comment: (q as any).correct_option_comment || '',
      wrong_option_comment: (q as any).wrong_option_comment || '',
      option_a_comment: (q as any).option_a_comment || '', option_b_comment: (q as any).option_b_comment || '',
      option_c_comment: (q as any).option_c_comment || '', option_d_comment: (q as any).option_d_comment || '',
      option_e_comment: (q as any).option_e_comment || '',
      legal_basis: (q as any).legal_basis || '', exam_tip: (q as any).exam_tip || '',
      dificuldade: q.dificuldade, origem: q.origem, tipo: q.tipo, status: q.status,
    });
    setOptions(
      q.question_options
        .sort((a, b) => a.letter.localeCompare(b.letter))
        .map((o) => ({ letter: o.letter, text: o.text, is_correct: o.is_correct }))
    );
    setEditingId(q.id);
    setViewMode("edit");
  };

  const saveQuestion = async () => {
    if (!form.subject_id || !form.topic_id || !form.enunciado.trim()) {
      toast.error("Preencha matéria, assunto e enunciado");
      return;
    }
    if (!options.some((o) => o.is_correct)) {
      toast.error("Marque uma alternativa como correta");
      return;
    }
    if (options.some((o) => !o.text.trim())) {
      toast.error("Preencha todas as alternativas");
      return;
    }

    if (editingId) {
      const { error } = await supabase.from("questions").update(form).eq("id", editingId);
      if (error) { toast.error("Erro ao atualizar"); return; }
      // Delete old options and insert new
      await supabase.from("question_options").delete().eq("question_id", editingId);
      await supabase.from("question_options").insert(
        options.map((o) => ({ question_id: editingId, letter: o.letter, text: o.text, is_correct: o.is_correct }))
      );
      toast.success("Questão atualizada");
    } else {
      const { data, error } = await supabase.from("questions").insert(form).select().single();
      if (error || !data) { toast.error("Erro ao criar"); return; }
      await supabase.from("question_options").insert(
        options.map((o) => ({ question_id: data.id, letter: o.letter, text: o.text, is_correct: o.is_correct }))
      );
      toast.success("Questão criada");
    }

    resetForm();
    setViewMode("list");
    fetchData();
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Excluir questão?")) return;
    await supabase.from("questions").delete().eq("id", id);
    toast.success("Questão excluída");
    fetchData();
  };

  const toggleStatus = async (q: Question) => {
    const newStatus = q.status === "publicado" ? "rascunho" : "publicado";
    await supabase.from("questions").update({ status: newStatus }).eq("id", q.id);
    toast.success(newStatus === "publicado" ? "Publicada" : "Despublicada");
    fetchData();
  };

  const filteredTopics = form.subject_id ? topics.filter((t) => t.subject_id === form.subject_id) : topics;

  const filteredQuestions = questions.filter((q) => {
    if (filterSubject !== "all" && q.subject_id !== filterSubject) return false;
    if (filterStatus !== "all" && q.status !== filterStatus) return false;
    if (searchTerm && !q.enunciado.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "";

  if (viewMode === "edit") {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => { setViewMode("list"); resetForm(); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-lg font-bold text-foreground">{editingId ? "Editar" : "Nova"} Questão</h1>
        </div>

        <div className="space-y-4">
          {/* Metadata row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Banca</Label>
              <Input value={form.banca} onChange={(e) => setForm({ ...form, banca: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Ano</Label>
              <Input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: parseInt(e.target.value) || 2024 })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Órgão</Label>
              <Input value={form.orgao} onChange={(e) => setForm({ ...form, orgao: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Cargo</Label>
              <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Localidade</Label>
              <Input value={form.localidade} onChange={(e) => setForm({ ...form, localidade: e.target.value })} className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Origem</Label>
              <Input value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })} className="h-9" />
            </div>
          </div>

          {/* Subject & Topic */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Matéria *</Label>
              <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v, topic_id: "" })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Assunto *</Label>
              <Select value={form.topic_id} onValueChange={(v) => setForm({ ...form, topic_id: v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {filteredTopics.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty, type, status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Dificuldade</Label>
              <Select value={form.dificuldade} onValueChange={(v) => setForm({ ...form, dificuldade: v as "facil" | "medio" | "dificil" })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as "oficial" | "autoral" })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="oficial">Oficial</SelectItem>
                  <SelectItem value="autoral">Autoral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "rascunho" | "publicado" })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enunciado */}
          <div>
            <Label className="text-xs">Enunciado *</Label>
            <Textarea
              value={form.enunciado}
              onChange={(e) => setForm({ ...form, enunciado: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label className="text-xs">Alternativas *</Label>
            {options.map((opt, i) => (
              <div key={opt.letter} className="flex gap-2 items-start">
                <button
                  type="button"
                  onClick={() => setOptions(options.map((o, j) => ({ ...o, is_correct: i === j })))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 transition-colors ${
                    opt.is_correct
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {opt.letter}
                </button>
                <Textarea
                  value={opt.text}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = { ...newOpts[i], text: e.target.value };
                    setOptions(newOpts);
                  }}
                  rows={1}
                  className="resize-none flex-1"
                  placeholder={`Alternativa ${opt.letter}`}
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Clique na letra para marcar a correta (verde)</p>
          </div>

          {/* Explicação */}
          <div>
            <Label className="text-xs">Explicação / Comentário (legado)</Label>
            <Textarea
              value={form.explicacao}
              onChange={(e) => setForm({ ...form, explicacao: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* New explanation fields */}
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm font-bold text-foreground mb-3">📝 Explicação detalhada</p>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Explicação principal</Label>
                <Textarea
                  value={form.explanation_main}
                  onChange={(e) => setForm({ ...form, explanation_main: e.target.value })}
                  rows={3}
                  className="resize-none"
                  placeholder="Explique por que a alternativa correta é a certa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Comentário da correta</Label>
                  <Textarea
                    value={form.correct_option_comment}
                    onChange={(e) => setForm({ ...form, correct_option_comment: e.target.value })}
                    rows={2}
                    className="resize-none"
                  />
                </div>
                <div>
                  <Label className="text-xs">Comentário da errada</Label>
                  <Textarea
                    value={form.wrong_option_comment}
                    onChange={(e) => setForm({ ...form, wrong_option_comment: e.target.value })}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground mt-2">Comentário por alternativa (opcional)</p>
              <div className="grid grid-cols-2 gap-3">
                {(['A', 'B', 'C', 'D', 'E'] as const).map((letter) => {
                  const key = `option_${letter.toLowerCase()}_comment` as keyof typeof form;
                  return (
                    <div key={letter}>
                      <Label className="text-xs">Alternativa {letter}</Label>
                      <Textarea
                        value={form[key] as string}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        rows={2}
                        className="resize-none"
                        placeholder={`Comentário da ${letter}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div>
                <Label className="text-xs">Fundamento legal / Base teórica</Label>
                <Textarea
                  value={form.legal_basis}
                  onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}
                  rows={2}
                  className="resize-none"
                  placeholder="Ex: Art. 5º, CF/88"
                />
              </div>
              <div>
                <Label className="text-xs">Dica de prova</Label>
                <Textarea
                  value={form.exam_tip}
                  onChange={(e) => setForm({ ...form, exam_tip: e.target.value })}
                  rows={2}
                  className="resize-none"
                  placeholder="Dica rápida para lembrar na hora da prova"
                />
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={saveQuestion}>
            {editingId ? "Salvar alterações" : "Criar questão"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Questões</h1>
        <Button size="sm" onClick={() => { resetForm(); setViewMode("edit"); }}>
          <Plus className="w-4 h-4 mr-1" /> Nova
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar questão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Matéria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{filteredQuestions.length} questões</p>
          {filteredQuestions.map((q) => (
            <div key={q.id} className="stat-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{subjectName(q.subject_id)}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      q.status === "publicado" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{q.enunciado}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleStatus(q)}>
                    {q.status === "publicado" ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(q)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteQuestion(q.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
