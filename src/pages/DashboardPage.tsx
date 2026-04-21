import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { BookOpen, Target, XCircle, TrendingUp, ArrowRight, Bell, Bookmark, Sparkles, Clock, GraduationCap, BookMarked, BarChart3, Shield, CheckCircle2, FileText, Zap, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCardSkeleton } from "@/components/LoadingSkeleton";
import { Subject } from "@/types/database";

interface Stats {
  total: number;
  correct: number;
  incorrect: number;
}

interface Update {
  id: string;
  titulo: string;
  descricao: string;
  data_publicacao: string;
}

interface LastAttempt {
  question_id: string;
  answered_at: string;
  is_correct: boolean;
  subject_name: string;
}

const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, correct: 0, incorrect: 0 });
  const [updates, setUpdates] = useState<Update[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectStats, setSubjectStats] = useState<Record<string, { total: number; correct: number }>>({});
  const [lastAttempt, setLastAttempt] = useState<LastAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      const [attRes, updRes, bkRes, subRes] = await Promise.all([
        supabase.from("question_attempts").select("is_correct, question_id, answered_at, questions(subject_id)").eq("user_id", user.id).order("answered_at", { ascending: false }),
        supabase.from("content_updates").select("*").order("data_publicacao", { ascending: false }).limit(3),
        supabase.from("bookmarks").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("subjects").select("*").order("order_num"),
      ]);

      if (attRes.data) {
        const incorrect = attRes.data.filter((a) => !a.is_correct);
        setStats({
          total: attRes.data.length,
          correct: attRes.data.filter((a) => a.is_correct).length,
          incorrect: incorrect.length,
        });
        setErrorCount(incorrect.length);

        const sStats: Record<string, { total: number; correct: number }> = {};
        attRes.data.forEach((a: any) => {
          const sid = a.questions?.subject_id;
          if (sid) {
            if (!sStats[sid]) sStats[sid] = { total: 0, correct: 0 };
            sStats[sid].total++;
            if (a.is_correct) sStats[sid].correct++;
          }
        });
        setSubjectStats(sStats);

        if (attRes.data.length > 0) {
          const last = attRes.data[0] as any;
          const subName = subRes.data?.find((s) => s.id === last.questions?.subject_id)?.name || "Geral";
          setLastAttempt({
            question_id: last.question_id,
            answered_at: last.answered_at,
            is_correct: last.is_correct,
            subject_name: subName,
          });
        }
      }
      if (updRes.data) setUpdates(updRes.data);
      if (bkRes.count !== null) setBookmarkCount(bkRes.count);
      if (subRes.data) setSubjects(subRes.data);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const firstName = profile?.name?.split(" ")[0] || "Estudante";

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora mesmo";
    if (mins < 60) return `há ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
  };

  return (
    <div className="page-container animate-slide-up">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 mb-8" style={{ background: 'var(--gradient-hero)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20">
              Edital 2026
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-primary-foreground font-display leading-tight">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-sm text-primary-foreground/80 mt-1.5 max-w-md leading-relaxed">
            Preparação completa para a <span className="font-bold text-primary-foreground">Guarda Municipal de Manaus</span>. Comece antes da maioria.
          </p>
          <p className="text-xs text-primary-foreground/60 mt-2">
            ✓ ✓ Prova: 24/mai/2026 · 60 questões · Nota mínima: 60pts
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 right-12 w-20 h-20 bg-primary-foreground/5 rounded-full translate-y-6" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : stats.total === 0 ? (
        /* ---- EMPTY STATE ---- */
        <div className="mb-8">
          <div className="premium-card text-center py-12 mb-6">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-display">Comece sua preparação</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Responda sua primeira questão e acompanhe sua evolução rumo à aprovação na GM Manaus.
            </p>
            <Link to="/questoes" className="mt-6 inline-block">
              <Button className="gap-2 h-12 px-8 font-bold text-sm" style={{ background: 'var(--gradient-hero)' }}>
                <BookOpen className="w-4 h-4" />
                Resolver questões
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link to="/erros" className="premium-card hover:border-primary/20 transition-colors">
              <XCircle className="w-5 h-5 text-destructive mb-2" />
              <p className="text-sm font-semibold text-foreground">Meus erros</p>
              <p className="text-xs text-muted-foreground mt-0.5">Seus erros aparecerão aqui</p>
            </Link>
            <Link to="/favoritas" className="premium-card hover:border-primary/20 transition-colors">
              <Bookmark className="w-5 h-5 text-warning mb-2" />
              <p className="text-sm font-semibold text-foreground">Favoritas</p>
              <p className="text-xs text-muted-foreground mt-0.5">Salve questões para revisar</p>
            </Link>
          </div>

          {subjects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 font-display">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Matérias disponíveis
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {subjects.slice(0, 6).map((s) => (
                  <Link key={s.id} to="/questoes" className="premium-card hover:border-primary/20 transition-colors py-3">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                  </Link>
                ))}
              </div>
              {subjects.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  + {subjects.length - 6} matérias
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ---- WITH DATA ---- */
        <div className="mb-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="premium-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-foreground font-display">{stats.total}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Respondidas</p>
            </div>
            <div className="premium-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-success font-display">{stats.correct}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Acertos</p>
            </div>
            <div className="premium-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-destructive font-display">{stats.incorrect}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Erros</p>
            </div>
            <div className="premium-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-primary font-display">{percentage}%</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Aproveitamento</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="premium-card mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progresso geral</p>
              <p className="text-lg font-extrabold text-primary font-display">{percentage}%</p>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2.5 font-medium">{stats.correct} acertos em {stats.total} questões</p>
          </div>

          {/* Continue from where you left off */}
          {lastAttempt && (
            <Link to="/questoes" className="premium-card flex items-center gap-4 hover:border-primary/30 transition-all mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Continue de onde parou</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground">{lastAttempt.subject_name}</span> · {lastAttempt.is_correct ? "✅ Acertou" : "❌ Errou"} · {timeAgo(lastAttempt.answered_at)}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mb-8">
        <Link to="/questoes">
          <Button className="w-full justify-between h-14 text-sm font-bold rounded-xl" size="lg" style={{ background: 'var(--gradient-hero)' }}>
            <span className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5" />
              Continuar estudando
            </span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/simulados">
          <Button variant="outline" className="w-full justify-between h-14 text-sm font-bold rounded-xl border-2 hover:border-primary/40 hover:bg-primary/5" size="lg">
            <span className="flex items-center gap-2.5">
              <Target className="w-5 h-5" />
              Fazer simulado
            </span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Benefits block */}
      <div className="premium-card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider font-display">Por que estudar aqui?</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: BookOpen, text: "Questões organizadas por matéria" },
            { icon: FileText, text: "Simulados personalizados" },
            { icon: BarChart3, text: "Acompanhamento de desempenho" },
            { icon: CheckCircle2, text: "Atualização pós-edital inclusa" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop 2-col layout */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 mb-8">
        {/* Quick access */}
        <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-0">
          <Link to="/erros" className="premium-card hover:border-destructive/20 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              {errorCount > 0 && (
                <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                  {errorCount}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-foreground">Meus erros</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {errorCount > 0 ? `${errorCount} questões para revisar` : "Seus erros aparecerão aqui"}
            </p>
          </Link>
          <Link to="/favoritas" className="premium-card hover:border-warning/20 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-warning" />
              </div>
              {bookmarkCount > 0 && (
                <span className="text-[10px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                  {bookmarkCount}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-foreground">Favoritas</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {bookmarkCount > 0 ? `${bookmarkCount} questões salvas` : "Salve questões para revisar"}
            </p>
          </Link>
        </div>

        {/* Subjects with progress */}
        {subjects.length > 0 && stats.total > 0 && (
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 font-display">
              <BookMarked className="w-4 h-4 text-muted-foreground" />
              Desempenho por matéria
            </h2>
            <div className="space-y-2">
              {subjects.slice(0, 5).map((s) => {
                const ss = subjectStats[s.id];
                const pct = ss ? Math.round((ss.correct / ss.total) * 100) : 0;
                return (
                  <div key={s.id} className="premium-card py-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-foreground">{s.name}</p>
                      <p className="text-sm font-extrabold text-primary font-display">{ss ? `${pct}%` : "—"}</p>
                    </div>
                    <Progress value={pct} className="h-2" />
                    {ss && <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{ss.correct}/{ss.total} acertos</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Updates */}
      {updates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 font-display">
              <Bell className="w-4 h-4 text-muted-foreground" />
              Atualizações
            </h2>
            <Link to="/atualizacoes" className="text-xs text-primary font-bold hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="space-y-2">
            {updates.map((u) => (
              <div key={u.id} className="premium-card">
                <p className="text-sm font-bold text-foreground">{u.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{u.descricao}</p>
                <p className="text-[10px] text-muted-foreground mt-2 font-semibold">
                  {new Date(u.data_publicacao).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;