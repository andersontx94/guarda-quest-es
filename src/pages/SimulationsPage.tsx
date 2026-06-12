import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useConcurso } from "@/contexts/ConcursoContext";
import { Subject, QuestionOption } from "@/types/database";
import { toast } from "sonner";
import ExamSetup from "@/components/simulation/ExamSetup";
import ExamRunning from "@/components/simulation/ExamRunning";
import ExamConfirmFinish from "@/components/simulation/ExamConfirmFinish";
import ExamResults from "@/components/simulation/ExamResults";

export type SimState = "setup" | "running" | "confirm" | "finished";

export interface SimQuestion {
  id: string;
  enunciado: string;
  banca: string;
  ano: number;
  subject_id: string;
  question_options: QuestionOption[];
}

export interface SimSession {
  simulationId: string;
  questions: SimQuestion[];
  answers: Record<string, string>;
  markedForReview: Set<string>;
  currentIndex: number;
  timeRemaining: number;
  totalTime: number;
  selectedSubject: string;
  questionCount: number;
  startedAt: number;
  /** true = simulado oficial fiel ao edital (distribuição, peso, corte e eliminação) */
  oficial?: boolean;
}

export interface SimResults {
  correct: number;
  total: number;
  timeUsed: number;
  bySubject: Record<string, { total: number; correct: number }>;
  /** Campos do simulado oficial (placar ponderado pelo peso de cada disciplina) */
  oficial?: boolean;
  pontos?: number;        // pontos ponderados obtidos
  pontosMax?: number;     // pontos máximos (ex.: 110 em Aracaju)
  notaCorte?: number;     // pontos mínimos para aprovação (ex.: 55)
  eliminado?: boolean;    // zerou alguma disciplina
  bySubjectPontos?: Record<string, { pontos: number; pontosMax: number; peso: number }>;
}

const MINUTES_PER_QUESTION = 3;
const LOCAL_KEY = (uid: string, concursoId: string | null) => `sim_session_${uid}_${concursoId ?? "default"}`;

const SimulationsPage: React.FC = () => {
  const { user } = useAuth();
  const { concursoId, concursoAtual } = useConcurso();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [state, setState] = useState<SimState>("setup");
  const [session, setSession] = useState<SimSession | null>(null);
  const [results, setResults] = useState<SimResults | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Load subjects do concurso ativo
  useEffect(() => {
    if (!concursoId) return;
    supabase.from("subjects").select("*").eq("concurso_id", concursoId).order("order_num").then(({ data }) => {
      if (data) setSubjects(data);
    });
  }, [concursoId]);

  // Restore session from localStorage on mount
  useEffect(() => {
    if (!user || !concursoId) return;
    const saved = localStorage.getItem(LOCAL_KEY(user.id, concursoId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Recalculate remaining time based on elapsed
        const elapsed = Math.floor((Date.now() - parsed.startedAt) / 1000);
        const remaining = Math.max(0, parsed.totalTime - elapsed);
        if (remaining > 0 && parsed.questions?.length > 0) {
          setSession({
            ...parsed,
            markedForReview: new Set(parsed.markedForReview || []),
            timeRemaining: remaining,
          });
          setState("running");
          toast("Prova restaurada! Continue de onde parou.", { duration: 2000 });
        } else {
          localStorage.removeItem(LOCAL_KEY(user.id, concursoId));
        }
      } catch {
        localStorage.removeItem(LOCAL_KEY(user.id, concursoId));
      }
    }
  }, [user, concursoId]);

  // Persist session to localStorage
  const persistSession = useCallback((s: SimSession) => {
    if (!user) return;
    const toSave = {
      ...s,
      markedForReview: Array.from(s.markedForReview),
    };
    localStorage.setItem(LOCAL_KEY(user.id, concursoId), JSON.stringify(toSave));
  }, [user, concursoId]);

  // Timer
  useEffect(() => {
    if (state !== "running" || !session) return;
    timerRef.current = setInterval(() => {
      setSession(prev => {
        if (!prev) return prev;
        const next = { ...prev, timeRemaining: prev.timeRemaining - 1 };
        if (next.timeRemaining <= 0) {
          clearInterval(timerRef.current!);
          finishExam();
          return { ...next, timeRemaining: 0 };
        }
        // Persist every 5 seconds
        if (next.timeRemaining % 5 === 0) persistSession(next);
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state, session?.simulationId]);

  // Save on visibility change / unload
  useEffect(() => {
    const save = () => { if (sessionRef.current && user) persistSession(sessionRef.current); };
    const onVis = () => { if (document.hidden) save(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", save);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", save);
    };
  }, [user, persistSession]);

  const startSimulation = async (selectedSubject: string, questionCount: number) => {
    if (!user) return;

    if (!concursoId) return;
    let query = supabase
      .from("questions")
      .select("id, enunciado, banca, ano, subject_id, question_options(*)")
      .eq("status", "publicado")
      .eq("concurso_id", concursoId);
    if (selectedSubject !== "all") query = query.eq("subject_id", selectedSubject);

    const { data } = await query;
    if (!data || data.length < questionCount) {
      toast.error(`Apenas ${data?.length || 0} questões disponíveis.`);
      return;
    }

    const shuffled = data.sort(() => Math.random() - 0.5).slice(0, questionCount);
    const totalTime = questionCount * MINUTES_PER_QUESTION * 60;

    const { data: sim } = await supabase.from("simulations").insert({
      user_id: user.id,
      concurso_id: concursoId,
      titulo: selectedSubject === "all" ? "Simulado Geral" : `Simulado - ${subjects.find(s => s.id === selectedSubject)?.name}`,
      subject_id: selectedSubject === "all" ? null : selectedSubject,
      total_questions: shuffled.length,
    }).select().single();

    if (!sim) { toast.error("Erro ao criar simulado"); return; }

    await supabase.from("simulation_results").insert(
      shuffled.map(q => ({ simulation_id: sim.id, question_id: q.id }))
    );

    const newSession: SimSession = {
      simulationId: sim.id,
      questions: shuffled,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      timeRemaining: totalTime,
      totalTime,
      selectedSubject,
      questionCount,
      startedAt: Date.now(),
    };

    setSession(newSession);
    persistSession(newSession);
    setState("running");
    toast("Prova iniciada! Boa sorte! 🎯", { duration: 2000 });
  };

  // ── Simulado OFICIAL: fiel ao edital (distribuição por disciplina, peso, 4h) ──
  const startOfficialSimulation = async () => {
    if (!user || !concursoId) return;

    const subs = subjects.filter((s) => (s.num_questoes_prova ?? 0) > 0);
    if (subs.length === 0) {
      toast.error("Este concurso não tem distribuição de questões definida.");
      return;
    }

    const { data, error } = await supabase
      .from("questions")
      .select("id, enunciado, banca, ano, subject_id, question_options(*)")
      .eq("status", "publicado")
      .eq("concurso_id", concursoId);
    if (error || !data) { toast.error("Erro ao carregar questões."); return; }

    const bySub: Record<string, SimQuestion[]> = {};
    (data as SimQuestion[]).forEach((q) => {
      (bySub[q.subject_id] ||= []).push(q);
    });

    const exam: SimQuestion[] = [];
    const faltas: string[] = [];
    for (const s of subs) {
      const need = s.num_questoes_prova ?? 0;
      const pool = (bySub[s.id] ?? []).slice().sort(() => Math.random() - 0.5);
      if (pool.length < need) faltas.push(`${s.name} (${pool.length}/${need})`);
      exam.push(...pool.slice(0, need));
    }

    if (faltas.length > 0) {
      toast.error(
        `Questões insuficientes para montar o simulado oficial: ${faltas.join(", ")}. Publique mais questões no admin.`,
        { duration: 7000 },
      );
      return;
    }

    const shuffled = exam.slice().sort(() => Math.random() - 0.5);
    const totalTime = 4 * 60 * 60; // 4 horas, conforme edital

    const { data: sim } = await supabase.from("simulations").insert({
      user_id: user.id,
      concurso_id: concursoId,
      titulo: `Simulado Oficial — ${concursoAtual?.nome ?? "Edital"}`,
      subject_id: null,
      total_questions: shuffled.length,
    }).select().single();

    if (!sim) { toast.error("Erro ao criar simulado"); return; }

    await supabase.from("simulation_results").insert(
      shuffled.map((q) => ({ simulation_id: sim.id, question_id: q.id }))
    );

    const newSession: SimSession = {
      simulationId: sim.id,
      questions: shuffled,
      answers: {},
      markedForReview: new Set(),
      currentIndex: 0,
      timeRemaining: totalTime,
      totalTime,
      selectedSubject: "all",
      questionCount: shuffled.length,
      startedAt: Date.now(),
      oficial: true,
    };

    setSession(newSession);
    persistSession(newSession);
    setState("running");
    toast(`Simulado oficial iniciado! ${shuffled.length} questões · 4 horas 🎯`, { duration: 2500 });
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      const next = { ...prev, answers: { ...prev.answers, [questionId]: optionId } };
      persistSession(next);
      return next;
    });
  };

  const toggleReview = (questionId: string) => {
    setSession(prev => {
      if (!prev) return prev;
      const next = { ...prev, markedForReview: new Set(prev.markedForReview) };
      if (next.markedForReview.has(questionId)) next.markedForReview.delete(questionId);
      else next.markedForReview.add(questionId);
      persistSession(next);
      return next;
    });
  };

  const goToQuestion = (index: number) => {
    setSession(prev => {
      if (!prev) return prev;
      const next = { ...prev, currentIndex: index };
      persistSession(next);
      return next;
    });
  };

  const requestFinish = () => setState("confirm");
  const cancelFinish = () => setState("running");

  const finishExam = async () => {
    if (!user || !sessionRef.current) return;
    const s = sessionRef.current;
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    const bySubject: Record<string, { total: number; correct: number }> = {};

    for (const q of s.questions) {
      const selectedId = s.answers[q.id];
      const isCorrect = selectedId ? q.question_options.find(o => o.id === selectedId)?.is_correct || false : false;
      if (isCorrect) correctCount++;

      if (!bySubject[q.subject_id]) bySubject[q.subject_id] = { total: 0, correct: 0 };
      bySubject[q.subject_id].total++;
      if (isCorrect) bySubject[q.subject_id].correct++;

      if (selectedId) {
        await supabase.from("simulation_results")
          .update({ selected_option_id: selectedId, is_correct: isCorrect })
          .eq("simulation_id", s.simulationId)
          .eq("question_id", q.id);
      }
    }

    await supabase.from("simulations")
      .update({ finished_at: new Date().toISOString() })
      .eq("id", s.simulationId);

    const timeUsed = s.totalTime - s.timeRemaining;

    let resultsObj: SimResults = { correct: correctCount, total: s.questions.length, timeUsed, bySubject };

    if (s.oficial) {
      const pesoBy: Record<string, number> = {};
      subjects.forEach((sub) => { pesoBy[sub.id] = sub.peso_prova ?? 0; });

      const bySubjectPontos: Record<string, { pontos: number; pontosMax: number; peso: number }> = {};
      let pontos = 0, pontosMax = 0, eliminado = false;
      for (const [sid, d] of Object.entries(bySubject)) {
        const peso = pesoBy[sid] ?? 0;
        const p = d.correct * peso;
        const pmax = d.total * peso;
        bySubjectPontos[sid] = {
          pontos: Math.round(p * 10) / 10,
          pontosMax: Math.round(pmax * 10) / 10,
          peso,
        };
        pontos += p;
        pontosMax += pmax;
        if (d.correct === 0) eliminado = true; // zerar disciplina = eliminado
      }
      pontos = Math.round(pontos * 10) / 10;
      pontosMax = Math.round(pontosMax * 10) / 10;
      const notaCorte = Math.round((pontosMax / 2) * 10) / 10; // 50% dos pontos

      resultsObj = { ...resultsObj, oficial: true, pontos, pontosMax, notaCorte, eliminado, bySubjectPontos };
    }

    setResults(resultsObj);
    localStorage.removeItem(LOCAL_KEY(user.id, concursoId));
    setState("finished");
    toast("Prova finalizada! 🏆", { duration: 2000 });
  };

  const resetToSetup = () => {
    setState("setup");
    setSession(null);
    setResults(null);
  };

  const subjectName = (id: string) => subjects.find(s => s.id === id)?.name || "Geral";

  if (state === "setup") {
    const oficialTotal = subjects.reduce((acc, s) => acc + (s.num_questoes_prova ?? 0), 0);
    return (
      <ExamSetup
        subjects={subjects}
        onStart={startSimulation}
        onStartOficial={startOfficialSimulation}
        oficialTotal={oficialTotal}
        minutesPerQuestion={MINUTES_PER_QUESTION}
      />
    );
  }

  if (state === "confirm" && session) {
    return (
      <ExamConfirmFinish
        session={session}
        onConfirm={finishExam}
        onCancel={cancelFinish}
      />
    );
  }

  if (state === "finished" && results && session) {
    return (
      <ExamResults
        results={results}
        session={session}
        subjectName={subjectName}
        onNewExam={resetToSetup}
      />
    );
  }

  if (state === "running" && session) {
    return (
      <ExamRunning
        session={session}
        subjects={subjects}
        onSelectAnswer={selectAnswer}
        onToggleReview={toggleReview}
        onGoToQuestion={goToQuestion}
        onRequestFinish={requestFinish}
        subjectName={subjectName}
      />
    );
  }

  return null;
};

export default SimulationsPage;
