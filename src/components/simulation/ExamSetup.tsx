import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useConcurso } from "@/contexts/ConcursoContext";
import { Subject } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FileText, Clock, Play, BookOpen, Shield, CheckCircle2 } from "lucide-react";

interface Props {
  subjects: Subject[];
  onStart: (subject: string, count: number) => void;
  onStartOficial?: () => void;
  oficialTotal?: number;
  minutesPerQuestion: number;
}

const ExamSetup: React.FC<Props> = ({ subjects, onStart, onStartOficial, oficialTotal = 0, minutesPerQuestion }) => {
  const { concursoId, concursoAtual } = useConcurso();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [questionCount, setQuestionCount] = useState(20);
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingOficial, setLoadingOficial] = useState(false);

  useEffect(() => {
    if (!concursoId) return;
    const fetch = async () => {
      let query = supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "publicado").eq("concurso_id", concursoId);
      if (selectedSubject !== "all") query = query.eq("subject_id", selectedSubject);
      const { count } = await query;
      setAvailableCount(count);
    };
    fetch();
  }, [selectedSubject, concursoId]);

  const totalMinutes = questionCount * minutesPerQuestion;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}min` : `${mins} minutos`;
  const canStart = availableCount !== null && availableCount >= questionCount;

  const handleStart = async () => {
    setLoading(true);
    await onStart(selectedSubject, questionCount);
    setLoading(false);
  };

  return (
    <div className="page-container animate-slide-up max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--gradient-hero)' }}>
          <FileText className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground font-display">Simulado</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Configure sua prova e inicie quando estiver pronto</p>
        {concursoAtual && <span className="badge-pre-edital mt-3 inline-block">{concursoAtual.nome}</span>}
      </div>

      {/* ── Simulado oficial do edital ── */}
      {onStartOficial && oficialTotal > 0 && (
        <button
          onClick={async () => { setLoadingOficial(true); await onStartOficial(); setLoadingOficial(false); }}
          disabled={loadingOficial}
          className="w-full mb-5 rounded-2xl p-5 text-left transition-all border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-hero)" }}>
              {loadingOficial
                ? <span className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                : <FileText className="w-5 h-5 text-primary-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold text-foreground">🎯 Simulado Oficial do Edital</p>
                <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full">RECOMENDADO</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {oficialTotal} questões na distribuição exata da prova · 4 horas · pontuação ponderada · regra de eliminação
              </p>
            </div>
            <Play className="w-5 h-5 text-primary shrink-0" />
          </div>
        </button>
      )}

      <div className="premium-card p-6 space-y-6">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ou monte um simulado personalizado</p>
        {/* Subject */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 block">
            <BookOpen className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Matéria
          </label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as matérias</SelectItem>
              {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Question count slider */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
            Quantidade de questões
          </label>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-4xl font-extrabold text-primary font-display">{questionCount}</span>
            <span className="text-sm text-muted-foreground font-medium">questões</span>
          </div>
          <Slider
            value={[questionCount]}
            onValueChange={v => setQuestionCount(v[0])}
            min={10}
            max={50}
            step={5}
            className="my-4"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
            <span>50</span>
          </div>
          {availableCount !== null && (
            <p className="text-xs text-muted-foreground mt-3 font-medium">
              <span className="font-bold text-foreground">{availableCount}</span> questões disponíveis
              {!canStart && <span className="text-destructive font-bold"> — insuficiente</span>}
            </p>
          )}
        </div>

        {/* Time estimate */}
        <div className="bg-accent rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Duração estimada da prova</p>
            <p className="text-xl font-extrabold text-foreground font-display">{timeLabel}</p>
            <p className="text-[11px] text-muted-foreground">{minutesPerQuestion} min por questão · cronômetro regressivo</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Shield, text: "Ambiente de prova" },
            { icon: Clock, text: "Tempo calculado" },
            { icon: CheckCircle2, text: "Correção automática" },
            { icon: BookOpen, text: "Revisão completa" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Start */}
        <Button
          className="w-full h-14 text-base font-bold gap-2.5 rounded-xl"
          size="lg"
          onClick={handleStart}
          disabled={!canStart || loading}
          style={{ background: 'var(--gradient-hero)' }}
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          Iniciar prova
        </Button>
      </div>
    </div>
  );
};

export default ExamSetup;
