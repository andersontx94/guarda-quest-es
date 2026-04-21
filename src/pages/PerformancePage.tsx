import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Subject } from "@/types/database";
import { BarChart3, BookOpen, Target, XCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/EmptyState";
import { StatCardSkeleton } from "@/components/LoadingSkeleton";

interface SubjectPerformance {
  subject_id: string;
  subject_name: string;
  total: number;
  correct: number;
  percentage: number;
}

const PerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [subjectPerf, setSubjectPerf] = useState<SubjectPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [attRes, subRes] = await Promise.all([
        supabase
          .from("question_attempts")
          .select("is_correct, question_id, questions(subject_id)")
          .eq("user_id", user.id),
        supabase.from("subjects").select("*").order("order_num"),
      ]);

      if (attRes.data) {
        const attempts = attRes.data as any[];
        setTotal(attempts.length);
        setCorrect(attempts.filter((a) => a.is_correct).length);
        setIncorrect(attempts.filter((a) => !a.is_correct).length);

        if (subRes.data) {
          const perfMap: Record<string, { total: number; correct: number }> = {};
          attempts.forEach((a) => {
            const sid = a.questions?.subject_id;
            if (sid) {
              if (!perfMap[sid]) perfMap[sid] = { total: 0, correct: 0 };
              perfMap[sid].total++;
              if (a.is_correct) perfMap[sid].correct++;
            }
          });

          setSubjectPerf(
            subRes.data
              .filter((s) => perfMap[s.id])
              .map((s) => ({
                subject_id: s.id,
                subject_name: s.name,
                total: perfMap[s.id].total,
                correct: perfMap[s.id].correct,
                percentage: Math.round((perfMap[s.id].correct / perfMap[s.id].total) * 100),
              }))
          );
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="page-container animate-slide-up">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Desempenho
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Acompanhe sua evolução</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : total === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Sem dados ainda"
          description="Responda questões para acompanhar seu desempenho e evolução por matéria."
          actionLabel="Começar agora"
          actionTo="/questoes"
        />
      ) : (
        <>
          {/* Overview */}
          <div className="stat-card mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Aproveitamento geral</p>
                <p className="text-3xl font-bold text-primary mt-1">{percentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="stat-card text-center">
              <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{total}</p>
              <p className="text-[11px] text-muted-foreground">Total</p>
            </div>
            <div className="stat-card text-center">
              <Target className="w-4 h-4 text-success mx-auto mb-1" />
              <p className="text-lg font-bold text-success">{correct}</p>
              <p className="text-[11px] text-muted-foreground">Acertos</p>
            </div>
            <div className="stat-card text-center">
              <XCircle className="w-4 h-4 text-destructive mx-auto mb-1" />
              <p className="text-lg font-bold text-destructive">{incorrect}</p>
              <p className="text-[11px] text-muted-foreground">Erros</p>
            </div>
          </div>

          {/* Per Subject */}
          {subjectPerf.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Por matéria</h2>
              <div className="space-y-3">
                {subjectPerf.map((sp) => (
                  <div key={sp.subject_id} className="stat-card">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{sp.subject_name}</p>
                      <span className="text-sm font-bold text-primary">{sp.percentage}%</span>
                    </div>
                    <Progress value={sp.percentage} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {sp.correct}/{sp.total} acertos
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PerformancePage;
