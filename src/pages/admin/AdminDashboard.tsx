import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, Layers, FileText, Users } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({ questions: 0, subjects: 0, topics: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [qRes, sRes, tRes] = await Promise.all([
        supabase.from("questions").select("id", { count: "exact", head: true }),
        supabase.from("subjects").select("id", { count: "exact", head: true }),
        supabase.from("topics").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        questions: qRes.count || 0,
        subjects: sRes.count || 0,
        topics: tRes.count || 0,
      });
    };
    fetch();
  }, []);

  return (
    <div className="animate-slide-up">
      <h1 className="text-xl font-bold text-foreground mb-6">Dashboard Admin</h1>
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
