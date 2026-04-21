import React from "react";
import { SimSession } from "@/pages/SimulationsPage";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, Flag, Send } from "lucide-react";

interface Props {
  session: SimSession;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExamConfirmFinish: React.FC<Props> = ({ session, onConfirm, onCancel }) => {
  const answered = Object.keys(session.answers).length;
  const unanswered = session.questions.length - answered;
  const reviewed = session.markedForReview.size;
  const timeUsed = session.totalTime - session.timeRemaining;
  const mins = Math.floor(timeUsed / 60);

  return (
    <div className="page-container animate-slide-up max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Finalizar prova?</h1>
        <p className="text-sm text-muted-foreground mt-1">Revise o resumo antes de enviar</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-success" /> Respondidas
          </span>
          <span className="text-sm font-bold text-foreground">{answered}/{session.questions.length}</span>
        </div>
        {unanswered > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4" /> Não respondidas
            </span>
            <span className="text-sm font-bold text-destructive">{unanswered}</span>
          </div>
        )}
        {reviewed > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-warning">
              <Flag className="w-4 h-4" /> Marcadas para revisão
            </span>
            <span className="text-sm font-bold text-warning">{reviewed}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" /> Tempo utilizado
          </span>
          <span className="text-sm font-bold text-foreground">{mins} min</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full h-12 gap-2" onClick={onConfirm}>
          <Send className="w-4 h-4" /> Enviar prova
        </Button>
        <Button variant="ghost" className="w-full h-12 gap-2" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" /> Voltar à prova
        </Button>
      </div>
    </div>
  );
};

export default ExamConfirmFinish;
