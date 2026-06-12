import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useConcurso } from "@/contexts/ConcursoContext";
import { BookOpen, Layers, FileText, Users } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { concursoId, concursoAtual } = useConcurso();
  const [counts, setCounts] = useState({ questions: 0, subjects: 0, topics: 0 });

  useEffect(() => {
    if (!concursoId) return;
    const fetch = async () => {
      const [qRes, sRes, tRes] = await Promise.all([
        supabase.from("questions").select("id", { count: "exact", head: true }).eq("concurso_id", concursoId),
        supabase.from("subjects").select("id", { count: "exact", head: true }).eq("concurso_id", concursoId),
        supabase.from("topics").select("id, subjects!inner(concurso_id)", { count: "exact", head: true }).eq("subjects.concurso_id", concursoId),
      ]);
      setCounts({
        questions: qRes.count || 0,
        subjects: sRes.count || 0,
        topics: tRes.count || 0,
      });
    };
    fetch();
  }, [concursoId]);

  return (
    <div className="animate-slide-up">
      <h1 className="text-xl font-bold text-foreground mb-1">Dashboard Admin</h1>
      <p className="text-xs text-muted-foreground mb-6">Concurso: <span className="font-semibold text-foreground">{concursoAtual?.nome ?? "—"}</span></p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <BookOpen className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{counts.questions}</p>
          <p className="text-xs text-muted-foreground">Questões</p>
        </div>
        <div className="stat-card">
          <Layers className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{counts.subjects}</p>
          <p className="text-xs text-muted-foreground">Matérias</p>
        </div>
        <div className="stat-card">
          <FileText className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{counts.topics}</p>
          <p className="text-xs text-muted-foreground">Assuntos</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
