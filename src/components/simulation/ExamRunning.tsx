import React, { useState } from "react";
import { SimSession, SimQuestion } from "@/pages/SimulationsPage";
import { Subject } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowLeft, ArrowRight, Flag, FlagOff, StopCircle, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { sanitizeText } from "@/lib/textUtils";

interface Props {
  session: SimSession;
  subjects: Subject[];
  onSelectAnswer: (qId: string, optId: string) => void;
  onToggleReview: (qId: string) => void;
  onGoToQuestion: (index: number) => void;
  onRequestFinish: () => void;
  subjectName: (id: string) => string;
}

const formatCountdown = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

const ExamRunning: React.FC<Props> = ({
  session, subjects, onSelectAnswer, onToggleReview, onGoToQuestion, onRequestFinish, subjectName,
}) => {
  const [gridOpen, setGridOpen] = useState(false);
  const q = session.questions[session.currentIndex];
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const answered = Object.keys(session.answers).length;
  const isLowTime = session.timeRemaining < 300;
  const isCritical = session.timeRemaining < 60;
  const isReviewed = session.markedForReview.has(q?.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-20" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Prova em andamento</p>
                <p className="text-sm font-bold text-foreground font-display">
                  {session.selectedSubject === "all" ? "Simulado Geral" : subjectName(session.selectedSubject)}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-extrabold ${
              isCritical ? "bg-destructive/15 text-destructive animate-pulse" :
              isLowTime ? "bg-warning/15 text-warning" :
              "bg-muted text-foreground"
            }`}>
              <Clock className="w-4 h-4" />
              {formatCountdown(session.timeRemaining)}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-muted-foreground font-medium">
            <span>Questão {session.currentIndex + 1} de {session.questions.length}</span>
            <span>{answered}/{session.questions.length} respondidas</span>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {q && (
          <>
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs text-muted-foreground font-medium">{q.banca} • {q.ano}</span>
              <button
                onClick={() => onToggleReview(q.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  isReviewed ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {isReviewed ? <FlagOff className="w-3.5 h-3.5" /> : <Flag className="w-3.5 h-3.5" />}
                {isReviewed ? "Desmarcar" : "Revisar depois"}
              </button>
            </div>

            <div className="premium-card p-6 mb-6">
              <p className="text-sm lg:text-[15px] leading-relaxed text-foreground sanitized-text">{sanitizeText(q.enunciado)}</p>
            </div>

            <div className="space-y-2.5">
              {q.question_options
                .sort((a, b) => a.letter.localeCompare(b.letter))
                .map(opt => {
                  const selected = session.answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className={selected ? "question-option selected" : "question-option"}
                      onClick={() => onSelectAnswer(q.id, opt.id)}
                    >
                      <span className={selected
                        ? "option-letter bg-primary text-primary-foreground"
                        : "option-letter bg-muted text-muted-foreground"
                      }>{opt.letter}</span>
                      <span className="text-sm sanitized-text">{sanitizeText(opt.text)}</span>
                    </button>
                  );
                })}
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => onGoToQuestion(session.currentIndex - 1)} disabled={session.currentIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
          {session.currentIndex < session.questions.length - 1 ? (
            <Button variant="ghost" size="sm" onClick={() => onGoToQuestion(session.currentIndex + 1)}>
              Próxima <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="destructive" size="sm" className="gap-1.5 font-bold" onClick={onRequestFinish}>
              <StopCircle className="w-4 h-4" /> Finalizar prova
            </Button>
          )}
        </div>

        {/* Question grid toggle */}
        <div className="mt-4">
          <button
            onClick={() => setGridOpen(!gridOpen)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground py-2.5 font-semibold"
          >
            Grade de questões {gridOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {gridOpen && (
            <div className="grid grid-cols-10 gap-1.5 mt-2 pb-4">
              {session.questions.map((sq, i) => {
                const isAnswered = !!session.answers[sq.id];
                const isCurrent = i === session.currentIndex;
                const isMarked = session.markedForReview.has(sq.id);
                return (
                  <button
                    key={sq.id}
                    onClick={() => onGoToQuestion(i)}
                    className={`w-full aspect-square rounded-lg text-[11px] font-bold transition-all border ${
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : isMarked
                        ? "bg-warning/15 text-warning border-warning/30"
                        : isAnswered
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Finish button always visible */}
        <div className="mt-2 pb-8">
          <Button variant="outline" className="w-full gap-2 h-12 rounded-xl font-bold border-2" onClick={onRequestFinish}>
            <StopCircle className="w-4 h-4" /> Finalizar prova
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamRunning;
