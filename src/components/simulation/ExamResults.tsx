import React, { useState, useEffect } from "react";
import { SimSession } from "@/pages/SimulationsPage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Eye,
  TrendingUp,
  Medal,
} from "lucide-react";
import { sanitizeText } from "@/lib/textUtils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  results: {
    correct: number;
    total: number;
    timeUsed: number;
    bySubject: Record<string, { total: number; correct: number }>;
  };
  session: SimSession;
  subjectName: (id: string) => string;
  onNewExam: () => void;
}

interface RankingInfo {
  posicao_ranking: number;
  aprovado: boolean;
  melhor_pontuacao: number;
  total_simulados: number;
  streak: number;
}

const getPerformanceMessage = (pct: number) => {
  if (pct >= 90)
    return {
      emoji: "🏆",
      title: "Desempenho excelente!",
      desc: "Você está no caminho certo para a aprovação. Continue mantendo esse nível!",
    };
  if (pct >= 70)
    return {
      emoji: "🎯",
      title: "Bom desempenho!",
      desc: "Você demonstrou bom conhecimento, mas ainda há pontos para reforçar.",
    };
  if (pct >= 60)
    return {
      emoji: "✅",
      title: "Aprovado na nota de corte!",
      desc: "Você atingiu os 60 pontos da GCM Manaus! Mantenha o foco para garantir a aprovação.",
    };
  if (pct >= 50)
    return {
      emoji: "📈",
      title: "Desempenho regular",
      desc: "Você identificou suas fraquezas. Foque nas matérias com menor acerto.",
    };
  return {
    emoji: "💪",
    title: "Continue praticando!",
    desc: "Cada simulado é uma oportunidade de aprender. Revise suas respostas e volte mais forte.",
  };
};

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
};

const ExamResults: React.FC<Props> = ({
  results,
  session,
  subjectName,
  onNewExam,
}) => {
  const [reviewing, setReviewing] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [rankingInfo, setRankingInfo] = useState<RankingInfo | null>(null);

  const { user } = useAuth();
  const pct = Math.round((results.correct / results.total) * 100);
  const perf = getPerformanceMessage(pct);

  // Registrar simulado no ranking ao montar o componente
  useEffect(() => {
    const registrar = async () => {
      if (!user || !session?.simulationId) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any).rpc(
          "registrar_simulado_concluido",
          {
            p_simulation_id: session.simulationId,
            p_user_id: user.id,
            p_total_questoes: results.total,
            p_total_acertos: results.correct,
            p_tempo_segundos: results.timeUsed,
          }
        );
        if (data) {
          setRankingInfo(data as RankingInfo);
        }
      } catch (e) {
        console.error("Erro ao registrar simulado no ranking:", e);
      }
    };
    registrar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reviewing) {
    const q = session.questions[reviewIndex];
    const selectedId = session.answers[q.id];

    return (
      <div className="page-container animate-slide-up max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReviewing(false)}
          >
            ← Voltar ao resultado
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Revisão {reviewIndex + 1}/{session.questions.length}
          </span>
        </div>

        <div className="premium-card p-5 mb-4">
          <p className="text-sm leading-relaxed text-foreground sanitized-text">
            {sanitizeText(q.enunciado)}
          </p>
        </div>

        <div className="space-y-2.5 mb-5">
          {q.question_options
            .sort((a, b) => a.letter.localeCompare(b.letter))
            .map((opt) => {
              const isSelected = selectedId === opt.id;
              const isCorrect = opt.is_correct;
              let classes = "question-option";
              if (isCorrect) classes += " correct";
              else if (isSelected && !isCorrect) classes += " incorrect";

              return (
                <div key={opt.id} className={classes}>
                  <span
                    className={`option-letter ${
                      isCorrect
                        ? "bg-success text-success-foreground"
                        : isSelected
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-sm sanitized-text flex-1">
                    {sanitizeText(opt.text)}
                  </span>
                  {isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-success ml-auto shrink-0" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-destructive ml-auto shrink-0" />
                  )}
                </div>
              );
            })}
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={reviewIndex === 0}
            onClick={() => setReviewIndex(reviewIndex - 1)}
          >
            ← Anterior
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={reviewIndex === session.questions.length - 1}
            onClick={() => setReviewIndex(reviewIndex + 1)}
          >
            Próxima →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Trophy className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground font-display">
          Prova finalizada!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Confira seu resultado
        </p>
      </div>

      {/* Score */}
      <div className="premium-card text-center p-8 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
          Sua nota
        </p>
        <p
          className="text-6xl font-black font-display"
          style={{
            color:
              pct >= 60
                ? "hsl(var(--success))"
                : pct >= 50
                ? "hsl(var(--warning))"
                : "hsl(var(--destructive))",
          }}
        >
          {pct}%
        </p>
        <Progress
          value={pct}
          className="h-3 mt-4 max-w-[220px] mx-auto"
        />
        {pct >= 60 ? (
          <p className="text-xs text-success font-bold mt-2">
            ✅ Acima da nota de corte (60%)
          </p>
        ) : (
          <p className="text-xs text-destructive font-bold mt-2">
            Nota de corte: 60% — faltaram {60 - pct}%
          </p>
        )}
      </div>

      {/* Mensagem de desempenho */}
      <div className="premium-card p-5 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{perf.emoji}</span>
          <div>
            <p className="text-sm font-bold text-foreground">{perf.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {perf.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Card do Ranking */}
      {rankingInfo && (
        <div className="premium-card p-4 mb-4 border border-yellow-400/30 bg-yellow-400/5">
          <div className="flex items-center gap-2 mb-3">
            <Medal className="w-4 h-4 text-yellow-500" />
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
              Ranking atualizado!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-extrabold font-display">
                #{rankingInfo.posicao_ranking}
              </p>
              <p className="text-[10px] text-muted-foreground">Sua posição</p>
            </div>
            <div>
              <p className="text-lg font-extrabold font-display">
                {Number(rankingInfo.melhor_pontuacao).toFixed(0)}%
              </p>
              <p className="text-[10px] text-muted-foreground">Melhor nota</p>
            </div>
            <div>
              <p className="text-lg font-extrabold font-display">
                🔥{rankingInfo.streak}
              </p>
              <p className="text-[10px] text-muted-foreground">Streak</p>
            </div>
          </div>
          {rankingInfo.aprovado && (
            <p className="text-center text-xs text-success font-bold mt-2">
              ✅ Simulado aprovado! Acima de 60%
            </p>
          )}
        </div>
      )}

      {/* Stats acertos/erros/tempo */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="premium-card text-center p-4">
          <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1.5" />
          <p className="text-2xl font-extrabold text-success font-display">
            {results.correct}
          </p>
          <p className="text-[11px] text-muted-foreground font-semibold">
            Acertos
          </p>
        </div>
        <div className="premium-card text-center p-4">
          <XCircle className="w-5 h-5 text-destructive mx-auto mb-1.5" />
          <p className="text-2xl font-extrabold text-destructive font-display">
            {results.total - results.correct}
          </p>
          <p className="text-[11px] text-muted-foreground font-semibold">
            Erros
          </p>
        </div>
        <div className="premium-card text-center p-4">
          <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
          <p className="text-lg font-extrabold text-foreground font-display">
            {formatTime(results.timeUsed)}
          </p>
          <p className="text-[11px] text-muted-foreground font-semibold">
            Tempo
          </p>
        </div>
      </div>

      {/* Desempenho por matéria */}
      {Object.keys(results.bySubject).length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 font-display">
            <TrendingUp className="w-4 h-4 text-primary" />
            Desempenho por matéria
          </h2>
          <div className="space-y-2">
            {Object.entries(results.bySubject).map(([sid, data]) => {
              const p = Math.round((data.correct / data.total) * 100);
              return (
                <div key={sid} className="premium-card p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-foreground">
                      {subjectName(sid)}
                    </p>
                    <p
                      className="text-sm font-extrabold font-display"
                      style={{
                        color:
                          p >= 70
                            ? "hsl(var(--success))"
                            : p >= 50
                            ? "hsl(var(--warning))"
                            : "hsl(var(--destructive))",
                      }}
                    >
                      {p}%
                    </p>
                  </div>
                  <Progress value={p} className="h-2" />
                  <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                    {data.correct}/{data.total} acertos
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="space-y-3">
        <Button
          className="w-full h-12 gap-2 rounded-xl font-bold"
          variant="outline"
          onClick={() => {
            setReviewIndex(0);
            setReviewing(true);
          }}
        >
          <Eye className="w-4 h-4" /> Revisar gabarito
        </Button>
        <Button
          className="w-full h-12 gap-2 rounded-xl font-bold"
          onClick={onNewExam}
          style={{ background: "var(--gradient-hero)" }}
        >
          <RotateCcw className="w-4 h-4" /> Novo simulado
        </Button>
      </div>
    </div>
  );
};

export default ExamResults;