import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  PenLine, Save, Send, Plus, FileText, Clock, CheckCircle2,
  AlertTriangle, ChevronRight, Loader2, ArrowLeft, Star, Lightbulb,
  XCircle, RefreshCw, Info, Download, Copy, Eye
} from "lucide-react";
import { jsPDF } from "jspdf";

interface EssayCorrection {
  nota_geral: number;
  notas_por_criterio: Record<string, number>;
  feedback_geral: string;
  pontos_fortes: string[];
  pontos_fracos: string[];
  erros_gramaticais: { trecho: string; erro: string; correcao: string }[];
  sugestoes_melhoria: string[];
  trechos_reescrever: { original: string; sugestao: string }[];
}

interface Essay {
  id: string;
  tema: string;
  titulo: string;
  conteudo: string;
  status: "rascunho" | "enviada" | "corrigida";
  nota_geral: number | null;
  notas_por_criterio: any;
  feedback_geral: string | null;
  feedback_detalhado: any;
  erros_encontrados: any;
  sugestoes_melhoria: any;
  created_at: string;
  updated_at: string;
}

const TEMAS = [
  "Tema livre",
  "Desafios da educação pública no Brasil",
  "Os impactos das redes sociais na saúde mental",
  "Segurança pública e cidadania",
  "Meio ambiente e desenvolvimento sustentável",
  "Violência contra a mulher no Brasil",
  "Desigualdade social e acesso à saúde",
  "O papel da tecnologia na sociedade moderna",
  "Mobilidade urbana nas grandes cidades",
  "Saúde mental dos jovens na era digital",
  "Combate à corrupção no serviço público",
];

const COMPETENCIAS: Record<string, string> = {
  competencia_1: "Domínio da norma culta",
  competencia_2: "Compreensão da proposta",
  competencia_3: "Argumentação",
  competencia_4: "Coesão textual",
  competencia_5: "Proposta de intervenção",
};

const LOCAL_KEY = (userId: string) => `essay_draft_${userId}`;

// ── Utility: generate PDF ──
function generatePDF(essay: Essay) {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  const addText = (text: string, size: number, bold = false, color: [number, number, number] = [30, 30, 30]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, pageWidth);
    for (const line of lines) {
      if (y > 275) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += size * 0.45;
    }
    y += 2;
  };

  const addSep = () => { y += 4; doc.setDrawColor(200); doc.line(margin, y, margin + pageWidth, y); y += 8; };

  // Header
  addText("Correção de Redação", 18, true, [50, 50, 180]);
  addText(`Data: ${new Date(essay.updated_at).toLocaleDateString("pt-BR")}`, 10, false, [120, 120, 120]);
  addSep();

  // Theme & title
  addText(`Tema: ${essay.tema}`, 12, true);
  if (essay.titulo) addText(`Título: ${essay.titulo}`, 12, true);
  addSep();

  // Full text
  addText("Redação", 14, true);
  addText(essay.conteudo, 10);
  addSep();

  // Overall score
  if (essay.nota_geral != null) {
    addText(`Nota Geral: ${essay.nota_geral} / 1000`, 14, true, [50, 50, 180]);
    y += 2;
  }

  // Scores per competency
  const notas = essay.notas_por_criterio || {};
  if (Object.keys(notas).length > 0) {
    addText("Notas por Competência", 12, true);
    Object.entries(COMPETENCIAS).forEach(([key, label]) => {
      addText(`  ${label}: ${notas[key] ?? "-"} / 200`, 10);
    });
    addSep();
  }

  // General feedback
  if (essay.feedback_geral) {
    addText("Resumo do Desempenho", 12, true);
    addText(essay.feedback_geral, 10);
    addSep();
  }

  // Strengths / weaknesses
  const fb = essay.feedback_detalhado || {};
  if (fb.pontos_fortes?.length) {
    addText("Pontos Fortes", 12, true, [0, 130, 0]);
    fb.pontos_fortes.forEach((p: string) => addText(`• ${p}`, 10));
    y += 4;
  }
  if (fb.pontos_fracos?.length) {
    addText("Pontos Fracos", 12, true, [200, 0, 0]);
    fb.pontos_fracos.forEach((p: string) => addText(`• ${p}`, 10));
    addSep();
  }

  // Suggestions
  const sug = essay.sugestoes_melhoria || [];
  if (sug.length) {
    addText("Sugestões de Melhoria", 12, true);
    sug.forEach((s: string) => addText(`→ ${s}`, 10));
    addSep();
  }

  // Disclaimer
  y += 4;
  addText("Esta correção é orientativa, gerada por inteligência artificial. Não substitui a avaliação oficial de bancas examinadoras.", 8, false, [150, 150, 150]);

  doc.save(`redacao-${essay.id.slice(0, 8)}.pdf`);
}

function downloadTXT(essay: Essay) {
  const notas = essay.notas_por_criterio || {};
  const fb = essay.feedback_detalhado || {};
  const sug = essay.sugestoes_melhoria || [];
  const erros = essay.erros_encontrados || [];

  let txt = `CORREÇÃO DE REDAÇÃO\n`;
  txt += `Data: ${new Date(essay.updated_at).toLocaleDateString("pt-BR")}\n`;
  txt += `Tema: ${essay.tema}\n`;
  if (essay.titulo) txt += `Título: ${essay.titulo}\n`;
  txt += `\n${"=".repeat(60)}\nREDAÇÃO\n${"=".repeat(60)}\n\n${essay.conteudo}\n`;

  if (essay.nota_geral != null) {
    txt += `\n${"=".repeat(60)}\nNOTA GERAL: ${essay.nota_geral} / 1000\n`;
    Object.entries(COMPETENCIAS).forEach(([k, l]) => { txt += `  ${l}: ${notas[k] ?? "-"} / 200\n`; });
  }

  if (essay.feedback_geral) txt += `\nRESUMO DO DESEMPENHO\n${essay.feedback_geral}\n`;
  if (fb.pontos_fortes?.length) { txt += `\nPONTOS FORTES\n`; fb.pontos_fortes.forEach((p: string) => txt += `• ${p}\n`); }
  if (fb.pontos_fracos?.length) { txt += `\nPONTOS FRACOS\n`; fb.pontos_fracos.forEach((p: string) => txt += `• ${p}\n`); }
  if (erros.length) { txt += `\nERROS GRAMATICAIS\n`; erros.forEach((e: any) => txt += `Trecho: "${e.trecho}" | Erro: ${e.erro} | Correção: ${e.correcao}\n`); }
  if (sug.length) { txt += `\nSUGESTÕES DE MELHORIA\n`; sug.forEach((s: string) => txt += `→ ${s}\n`); }
  txt += `\n---\nEsta correção é orientativa, gerada por inteligência artificial.\n`;

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `redacao-${essay.id.slice(0, 8)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyEssayText(essay: Essay) {
  navigator.clipboard.writeText(essay.conteudo).then(
    () => toast.success("Texto copiado!"),
    () => toast.error("Erro ao copiar.")
  );
}

// ── Main component ──
const EssayPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<"editor" | "history" | "result">("editor");
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null);
  const [tema, setTema] = useState("Tema livre");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [saving, setSaving] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string>("todos");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordCount = conteudo.trim() ? conteudo.trim().split(/\s+/).length : 0;
  const charCount = conteudo.length;

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(LOCAL_KEY(user.id));
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setTema(draft.tema || "Tema livre");
        setTitulo(draft.titulo || "");
        setConteudo(draft.conteudo || "");
      } catch { /* ignore */ }
    }
  }, [user]);

  useEffect(() => {
    if (!user || !conteudo) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(LOCAL_KEY(user.id), JSON.stringify({ tema, titulo, conteudo }));
    }, 1000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [tema, titulo, conteudo, user]);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoadingHistory(true);
    let query = supabase.from("essays").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (historyFilter !== "todos") {
      query = query.eq("status", historyFilter as "rascunho" | "enviada" | "corrigida");
    }
    const { data } = await query;
    setEssays((data as Essay[]) || []);
    setLoadingHistory(false);
  }, [user, historyFilter]);

  useEffect(() => {
    if (view === "history") fetchHistory();
  }, [view, fetchHistory]);

  const saveDraft = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (currentEssay && currentEssay.status === "rascunho") {
        await supabase.from("essays").update({
          tema, titulo, conteudo, updated_at: new Date().toISOString(),
        }).eq("id", currentEssay.id);
        toast.success("Rascunho atualizado!");
      } else {
        const { data } = await supabase.from("essays").insert({
          user_id: user.id, tema, titulo, conteudo, status: "rascunho" as const,
        }).select().single();
        if (data) setCurrentEssay(data as Essay);
        toast.success("Rascunho salvo!");
      }
      localStorage.removeItem(LOCAL_KEY(user.id));
    } catch {
      toast.error("Erro ao salvar rascunho.");
    }
    setSaving(false);
  };

  const submitForCorrection = async () => {
    if (!user) return;
    if (conteudo.trim().length < 50) {
      toast.error("A redação precisa ter pelo menos 50 caracteres.");
      return;
    }
    setCorrecting(true);
    try {
      let essayId = currentEssay?.id;
      if (!essayId) {
        const { data } = await supabase.from("essays").insert({
          user_id: user.id, tema, titulo, conteudo, status: "enviada" as const,
        }).select().single();
        essayId = data?.id;
        if (data) setCurrentEssay(data as Essay);
      } else {
        await supabase.from("essays").update({
          tema, titulo, conteudo, status: "enviada" as const, updated_at: new Date().toISOString(),
        }).eq("id", essayId);
      }

      const { data: correctionData, error } = await supabase.functions.invoke("correct-essay", {
        body: { tema, titulo, conteudo },
      });

      if (error) throw error;
      if (correctionData?.error) throw new Error(correctionData.error);

      const correction = correctionData as EssayCorrection;

      const { data: updated } = await supabase.from("essays").update({
        status: "corrigida" as const,
        nota_geral: correction.nota_geral,
        notas_por_criterio: correction.notas_por_criterio,
        feedback_geral: correction.feedback_geral,
        feedback_detalhado: {
          pontos_fortes: correction.pontos_fortes,
          pontos_fracos: correction.pontos_fracos,
          trechos_reescrever: correction.trechos_reescrever,
        },
        erros_encontrados: correction.erros_gramaticais,
        sugestoes_melhoria: correction.sugestoes_melhoria,
        updated_at: new Date().toISOString(),
      }).eq("id", essayId).select().single();

      if (updated) {
        setCurrentEssay(updated as Essay);
        localStorage.removeItem(LOCAL_KEY(user.id));
        setView("result");
        toast.success("Correção concluída!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro ao corrigir redação.");
    }
    setCorrecting(false);
  };

  const startNew = () => {
    setCurrentEssay(null);
    setTema("Tema livre");
    setTitulo("");
    setConteudo("");
    if (user) localStorage.removeItem(LOCAL_KEY(user.id));
    setView("editor");
  };

  const openEssay = (essay: Essay) => {
    setCurrentEssay(essay);
    setTema(essay.tema);
    setTitulo(essay.titulo);
    setConteudo(essay.conteudo);
    if (essay.status === "corrigida") {
      setView("result");
    } else {
      setView("editor");
    }
  };

  const getScoreColor = (score: number, max: number = 200) => {
    const pct = score / max;
    if (pct >= 0.8) return "text-green-600";
    if (pct >= 0.6) return "text-yellow-600";
    return "text-red-500";
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "rascunho": return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Rascunho</Badge>;
      case "enviada": return <Badge className="gap-1 bg-yellow-500/10 text-yellow-700 border-yellow-200"><Send className="w-3 h-3" /> Enviada</Badge>;
      case "corrigida": return <Badge className="gap-1 bg-green-500/10 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3" /> Corrigida</Badge>;
    }
  };

  // ── Action buttons for result/history ──
  const ActionButtons = ({ essay }: { essay: Essay }) => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => copyEssayText(essay)}>
        <Copy className="w-4 h-4 mr-1" /> Copiar texto
      </Button>
      <Button variant="outline" size="sm" onClick={() => generatePDF(essay)}>
        <Download className="w-4 h-4 mr-1" /> Baixar PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => downloadTXT(essay)}>
        <FileText className="w-4 h-4 mr-1" /> Baixar TXT
      </Button>
    </div>
  );

  // ── EDITOR VIEW ──
  const renderEditor = () => (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <PenLine className="w-5 h-5 text-primary" />
          {currentEssay ? "Editar redação" : "Nova redação"}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("history")}>
            <FileText className="w-4 h-4 mr-1" /> Histórico
          </Button>
          <Button variant="outline" size="sm" onClick={startNew}>
            <Plus className="w-4 h-4 mr-1" /> Nova
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Tema</label>
          <Select value={tema} onValueChange={setTema}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TEMAS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Título (opcional)</label>
          <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título da redação" />
        </div>
      </div>

      <div>
        <Textarea
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          placeholder="Escreva sua redação aqui..."
          className="min-h-[350px] resize-y text-sm leading-relaxed"
        />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{wordCount} palavras · {charCount} caracteres</span>
          <span className="flex items-center gap-1"><Save className="w-3 h-3" /> Salvamento automático ativo</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={saveDraft} disabled={saving || !conteudo.trim()}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Salvar rascunho
        </Button>
        <Button onClick={submitForCorrection} disabled={correcting || conteudo.trim().length < 50}>
          {correcting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
          {correcting ? "Corrigindo..." : "Enviar para correção"}
        </Button>
      </div>

      {correcting && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <div>
              <p className="text-sm font-medium text-foreground">Analisando sua redação...</p>
              <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          A correção automática é orientativa e não substitui a avaliação oficial de bancas examinadoras.
        </p>
      </div>
    </div>
  );

  // ── HISTORY VIEW ──
  const renderHistory = () => (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Minhas redações
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("editor")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button size="sm" onClick={startNew}>
            <Plus className="w-4 h-4 mr-1" /> Nova
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["todos", "rascunho", "enviada", "corrigida"].map(f => (
          <Button
            key={f}
            size="sm"
            variant={historyFilter === f ? "default" : "outline"}
            onClick={() => setHistoryFilter(f)}
            className="text-xs capitalize"
          >
            {f === "todos" ? "Todos" : f === "rascunho" ? "Rascunhos" : f === "enviada" ? "Enviadas" : "Corrigidas"}
          </Button>
        ))}
      </div>

      {loadingHistory ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : essays.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FileText className="w-7 h-7 text-muted-foreground" /></div>
          <p className="text-sm text-muted-foreground">Nenhuma redação encontrada.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {essays.map(essay => (
            <Card
              key={essay.id}
              className="p-4 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => openEssay(essay)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {essay.titulo || essay.tema || "Sem título"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(essay.updated_at).toLocaleDateString("pt-BR")} · {essay.conteudo.trim().split(/\s+/).length} palavras
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {essay.status === "corrigida" && essay.nota_geral != null && (
                    <span className={`text-sm font-bold ${getScoreColor(essay.nota_geral, 1000)}`}>
                      {essay.nota_geral}/1000
                    </span>
                  )}
                  {statusBadge(essay.status)}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              {/* Quick action buttons for corrected essays */}
              {essay.status === "corrigida" && (
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => openEssay(essay)}>
                    <Eye className="w-3 h-3 mr-1" /> Ver correção
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => generatePDF(essay)}>
                    <Download className="w-3 h-3 mr-1" /> PDF
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => downloadTXT(essay)}>
                    <FileText className="w-3 h-3 mr-1" /> TXT
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => copyEssayText(essay)}>
                    <Copy className="w-3 h-3 mr-1" /> Copiar
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // ── RESULT VIEW ──
  const renderResult = () => {
    if (!currentEssay) return null;
    const isCorrigida = currentEssay.status === "corrigida";
    const notas = currentEssay.notas_por_criterio || {};
    const feedback = currentEssay.feedback_detalhado || {};
    const erros = currentEssay.erros_encontrados || [];
    const sugestoes = currentEssay.sugestoes_melhoria || [];

    return (
      <div className="space-y-5 animate-slide-up">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            {isCorrigida ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Eye className="w-5 h-5 text-primary" />}
            {isCorrigida ? "Resultado da correção" : "Redação enviada"}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView("history")}>
              <FileText className="w-4 h-4 mr-1" /> Histórico
            </Button>
            <Button size="sm" onClick={startNew}>
              <Plus className="w-4 h-4 mr-1" /> Nova redação
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <ActionButtons essay={currentEssay} />

        {/* ── Original essay text ── */}
        <Card className="p-4 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PenLine className="w-4 h-4 text-primary" /> Redação enviada
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{currentEssay.conteudo.trim().split(/\s+/).length} palavras</span>
              <span>·</span>
              <span>{new Date(currentEssay.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
          <div className="mb-2 space-y-1">
            <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Tema:</span> {currentEssay.tema}</p>
            {currentEssay.titulo && (
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Título:</span> {currentEssay.titulo}</p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{currentEssay.conteudo}</p>
          </div>
        </Card>

        {/* Only show correction details for corrected essays */}
        {isCorrigida && (
          <>
            {/* Nota geral */}
            <Card className="p-6 text-center border-primary/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nota geral</p>
              <p className={`text-5xl font-extrabold ${getScoreColor(currentEssay.nota_geral || 0, 1000)}`}>
                {currentEssay.nota_geral}
              </p>
              <p className="text-sm text-muted-foreground mt-1">de 1000 pontos</p>
            </Card>

            {/* Notas por competência */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Notas por competência</h3>
              <div className="space-y-3">
                {Object.entries(COMPETENCIAS).map(([key, label]) => {
                  const nota = notas[key] ?? 0;
                  return (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{label}</p>
                        <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${(nota / 200) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-sm font-bold w-12 text-right ${getScoreColor(nota)}`}>{nota}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Feedback geral */}
            {currentEssay.feedback_geral && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" /> Resumo do desempenho
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{currentEssay.feedback_geral}</p>
              </Card>
            )}

            {/* Pontos fortes e fracos */}
            <div className="grid gap-3 sm:grid-cols-2">
              {feedback.pontos_fortes?.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Pontos fortes
                  </h3>
                  <ul className="space-y-1">
                    {feedback.pontos_fortes.map((p: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
              {feedback.pontos_fracos?.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Pontos fracos
                  </h3>
                  <ul className="space-y-1">
                    {feedback.pontos_fracos.map((p: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Erros gramaticais */}
            {erros.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" /> Erros gramaticais identificados
                </h3>
                <div className="space-y-3">
                  {erros.map((e: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border text-xs space-y-1">
                      <p className="text-foreground"><span className="font-medium">Trecho:</span> "{e.trecho}"</p>
                      <p className="text-red-600"><span className="font-medium text-foreground">Erro:</span> {e.erro}</p>
                      <p className="text-green-700"><span className="font-medium text-foreground">Correção:</span> {e.correcao}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Sugestões */}
            {sugestoes.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" /> Sugestões de melhoria
                </h3>
                <ul className="space-y-1">
                  {sugestoes.map((s: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Trechos para reescrever */}
            {feedback.trechos_reescrever?.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-primary" /> Trechos que podem ser reescritos
                </h3>
                <div className="space-y-3">
                  {feedback.trechos_reescrever.map((t: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border text-xs space-y-1">
                      <p className="text-red-600 line-through">"{t.original}"</p>
                      <p className="text-green-700">→ "{t.sugestao}"</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Esta é uma correção orientativa gerada por inteligência artificial. Não substitui a avaliação oficial de bancas examinadoras.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      {view === "editor" && renderEditor()}
      {view === "history" && renderHistory()}
      {view === "result" && renderResult()}
    </div>
  );
};

export default EssayPage;
