import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
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
}

const MINUTES_PER_QUESTION = 3;
const LOCAL_KEY = (uid: string) => `sim_session_${uid}`;

const SimulationsPage: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [state, setState] = useState<SimState>("setup");
  const [session, setSession] = useState<SimSession | null>(null);
  const [results, setResults] = useState<{
    correct: number;
    total: number;
    timeUsed: number;
    bySubject: Record<string, { total: number; correct: number }>;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Load subjects
  useEffect(() => {
    supabase.from("subjects").select("*").order("order_num").then(({ data }) => {
      if (data) setSubjects(data);
    });
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(LOCAL_KEY(user.id));
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
          localStorage.removeItem(LOCAL_KEY(user.id));
        }
      } catch {
        localStorage.removeItem(LOCAL_KEY(user.id));
      }
    }
  }, [user]);

  // Persist session to localStorage
  const persistSession = useCallback((s: SimSession) => {
    if (!user) return;
    const toSave = {
      ...s,
      markedForReview: Array.from(s.markedForReview),
    };
    localStorage.setItem(LOCAL_KEY(user.id), JSON.stringify(toSave));
  }, [user]);

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

    let query = supabase
      .from("questions")
      .select("id, enunciado, banca, ano, subject_id, question_options(*)")
      .eq("status", "publicado");
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
    setResults({ correct: correctCount, total: s.questions.length, timeUsed, bySubject });
    localStorage.removeItem(LOCAL_KEY(user.id));
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
    return <ExamSetup subjects={subjects} onStart={startSimulation} minutesPerQuestion={MINUTES_PER_QUESTION} />;
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
