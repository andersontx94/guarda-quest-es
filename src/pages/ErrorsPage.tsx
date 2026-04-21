import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";
import { Subject } from "@/types/database";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/LoadingSkeleton";
import { sanitizeText } from "@/lib/textUtils";

interface ErrorQuestion {
  id: string;
  enunciado: string;
  subject_id: string;
}

const ErrorsPage: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<ErrorQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [attRes, subRes] = await Promise.all([
        supabase
          .from("question_attempts")
          .select("question_id, is_correct, questions(id, enunciado, subject_id)")
          .eq("user_id", user.id)
          .eq("is_correct", false),
        supabase.from("subjects").select("*").order("order_num"),
      ]);

      if (attRes.data) {
        const unique = new Map<string, ErrorQuestion>();
        (attRes.data as any[]).forEach((a) => {
          if (a.questions && !unique.has(a.questions.id)) {
            unique.set(a.questions.id, a.questions);
          }
        });
        setQuestions(Array.from(unique.values()));
      }
      if (subRes.data) setSubjects(subRes.data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "";

  return (
    <div className="page-container animate-slide-up">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <XCircle className="w-5 h-5 text-destructive" /> Meus Erros
        </h1>
        {!loading && questions.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">{questions.length} questões para revisar</p>
        )}
      </div>

      {loading ? (
        <ListSkeleton count={4} />
      ) : questions.length === 0 ? (
        <EmptyState
          icon={XCircle}
          title="Nenhum erro ainda!"
          description="Suas questões erradas aparecerão aqui para que você possa revisá-las."
          actionLabel="Resolver questões"
          actionTo="/questoes"
        />
      ) : (
        <div className="space-y-2">
          {questions.map((q) => (
            <Link
              key={q.id}
              to={`/questoes?status=erradas`}
              className="stat-card block hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-primary mb-1">{subjectName(q.subject_id)}</p>
                  <p className="text-sm text-foreground line-clamp-2 sanitized-text">{sanitizeText(q.enunciado)}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorsPage;
