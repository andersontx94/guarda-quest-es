import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Subject, Topic } from "@/types/database";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

const AdminSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newTopic, setNewTopic] = useState<Record<string, string>>({});
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const fetchData = async () => {
    const [sRes, tRes] = await Promise.all([
      supabase.from("subjects").select("*").order("order_num"),
      supabase.from("topics").select("*"),
    ]);
    if (sRes.data) setSubjects(sRes.data);
    if (tRes.data) setTopics(tRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const addSubject = async () => {
    if (!newSubject.trim()) return;
    const { error } = await supabase.from("subjects").insert({ name: newSubject.trim(), order_num: subjects.length });
    if (error) { toast.error("Erro ao criar matéria"); return; }
    setNewSubject("");
    toast.success("Matéria criada");
    fetchData();
  };

  const updateSubject = async (id: string) => {
    if (!editName.trim()) return;
    await supabase.from("subjects").update({ name: editName.trim() }).eq("id", id);
    setEditingSubject(null);
    toast.success("Matéria atualizada");
    fetchData();
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Excluir matéria e todos os assuntos/questões vinculadas?")) return;
    await supabase.from("subjects").delete().eq("id", id);
    toast.success("Matéria excluída");
    fetchData();
  };

  const addTopic = async (subjectId: string) => {
    const name = newTopic[subjectId]?.trim();
    if (!name) return;
    const { error } = await supabase.from("topics").insert({ name, subject_id: subjectId });
    if (error) { toast.error("Erro ao criar assunto"); return; }
    setNewTopic((prev) => ({ ...prev, [subjectId]: "" }));
    toast.success("Assunto criado");
    fetchData();
  };

  const deleteTopic = async (id: string) => {
    if (!confirm("Excluir assunto?")) return;
    await supabase.from("topics").delete().eq("id", id);
    toast.success("Assunto excluído");
    fetchData();
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-xl font-bold text-foreground mb-6">Matérias e Assuntos</h1>

      {/* Add Subject */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Nova matéria..."
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubject()}
        />
        <Button onClick={addSubject} size="icon"><Plus className="w-4 h-4" /></Button>
      </div>

      <div className="space-y-3">
        {subjects.map((s) => (
          <div key={s.id} className="stat-card">
            <div className="flex items-center justify-between">
              {editingSubject === s.id ? (
                <div className="flex gap-2 flex-1">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => updateSubject(s.id)}><Check className="w-3 h-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingSubject(null)}><X className="w-3 h-3" /></Button>
                </div>
              ) : (
                <>
                  <button
                    className="text-sm font-medium text-foreground text-left flex-1"
                    onClick={() => setExpandedSubject(expandedSubject === s.id ? null : s.id)}
                  >
                    {s.name}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({topics.filter((t) => t.subject_id === s.id).length} assuntos)
                    </span>
                  </button>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingSubject(s.id); setEditName(s.name); }}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteSubject(s.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            {expandedSubject === s.id && (
              <div className="mt-3 pl-4 border-l-2 border-border space-y-2">
                {topics
                  .filter((t) => t.subject_id === s.id)
                  .map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-sm text-foreground">
                      <span>{t.name}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => deleteTopic(t.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Novo assunto..."
                    className="h-8 text-sm"
                    value={newTopic[s.id] || ""}
                    onChange={(e) => setNewTopic((prev) => ({ ...prev, [s.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addTopic(s.id)}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => addTopic(s.id)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSubjects;
