import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Subject, Topic, Question, QuestionOption } from "@/types/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2,
  XCircle, SlidersHorizontal, BookOpen, Lightbulb, Award, RotateCcw, Target,
} from "lucide-react";
import { toast } from "sonner";
import { sanitizeText } from "@/lib/textUtils";
import { EmptyState } from "@/components/EmptyState";
import { QuestionCardSkeleton } from "@/components/LoadingSkeleton";

// ── Pesos das matérias conforme o edital GCM Manaus 2026 ──
const PESOS_EDITAL: Record<string, { questoes: number; pontos: number; cor: string }> = {
  "Legislação Específica":          { questoes: 15, pontos: 30,   cor: "#3B82F6" },
  "Língua Portuguesa":              { questoes: 10, pontos: 15,   cor: "#8B5CF6" },
  "Direito Constitucional":         { questoes: 5,  pontos: 10,   cor: "#EF4444" },
  "Direito Penal":                  { questoes: 5,  pontos: 7.5,  cor: "#F59E0B" },
  "Direito Processual Penal":       { questoes: 5,  pontos: 7.5,  cor: "#F97316" },
  "Ética e Direitos Humanos":       { questoes: 5,  pontos: 7.5,  cor: "#10B981" },
  "Legislação de Trânsito":         { questoes: 5,  pontos: 7.5,  cor: "#06B6D4" },
  "Noções de Informática":          { questoes: 5,  pontos: 7.5,  cor: "#84CC16" },
  "Geografia e História de Manaus": { questoes: 5,  pontos: 7.5,  cor: "#EC4899" },
};

// ── Helpers localStorage ──
const LS_KEY = (userId: string) => `study_session_${userId}`;

interface SessionData {
  questionIds: string[];
  currentIndex: number;
  sessionCorrect: number;
  sessionTotal: number;
  filters: { subject: string; topic: string; difficulty: string; status: string };
  updatedAt: string;
}

function saveSessionLocal(userId: string, data: SessionData) {
  try { localStorage.setItem(LS_KEY(userId), JSON.stringify(data)); } catch {}
}
function loadSessionLocal(userId: string): SessionData | null {
  try {
    const raw = localStorage.getItem(LS_KEY(userId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function clearSessionLocal(userId: string) {
  try { localStorage.removeItem(LS_KEY(userId)); } catch {}
}

const QUESTIONS_BATCH_SIZE = 500;
type QuestionWithOptions = Question & { question_options: QuestionOption[] };

async function fetchAllPublishedQuestions(filters?: {
  subjectId?: string;
  topicId?: string;
  difficulty?: "facil" | "medio" | "dificil";
}) {
  const allQuestions: QuestionWithOptions[] = [];
  let from = 0;

  while (true) {
    let query = supabase
      .from("questions")
      .select("*, question_options(*)")
      .eq("status", "publicado")
      .order("created_at", { ascending: false })
      .range(from, from + QUESTIONS_BATCH_SIZE - 1);

    if (filters?.subjectId) query = query.eq("subject_id", filters.subjectId);
    if (filters?.topicId) query = query.eq("topic_id", filters.topicId);
    if (filters?.difficulty) query = query.eq("dificuldade", filters.difficulty);

    const { data, error } = await query;
    if (error) throw error;
    if (!data?.length) break;

    allQuestions.push(...(data as QuestionWithOptions[]));

    if (data.length < QUESTIONS_BATCH_SIZE) break;
    from += QUESTIONS_BATCH_SIZE;
  }

  return allQuestions;
}

async function fetchAllPublishedQuestionSubjectIds() {
  const allRows: { subject_id: string }[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("questions")
      .select("subject_id")
      .eq("status", "publicado")
      .range(from, from + QUESTIONS_BATCH_SIZE - 1);

    if (error) throw error;
    if (!data?.length) break;

    allRows.push(...data);

    if (data.length < QUESTIONS_BATCH_SIZE) break;
    from += QUESTIONS_BATCH_SIZE;
  }

  return allRows;
}

// ── Componente de seleção de matéria com peso ──
interface MateriaSelectorProps {
  subjects: Subject[];
  selectedSubject: string;
  onSelect: (id: string) => void;
  totalBySubject: Record<string, number>;
}

const MateriaSelector: React.FC<MateriaSelectorProps> = ({
  subjects, selectedSubject, onSelect, totalBySubject,
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Target className="w-4 h-4 text-primary" />
      <h2 className="text-sm font-bold text-foreground">Estudar por matéria</h2>
      <span className="text-xs text-muted-foreground ml-auto">conforme o edital</span>
    </div>

    {/* Botão "Todas" */}
    <button
      onClick={() => onSelect("all")}
      className={`w-full p-3 rounded-xl border-2 text-left transition-all mb-2 ${
        selectedSubject === "all"
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">📚 Todas as matérias</p>
          <p className="text-xs text-muted-foreground mt-0.5">Estudo geral — todas as questões</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold text-foreground">60 q.</p>
          <p className="text-xs text-muted-foreground">100 pts</p>
        </div>
      </div>
    </button>

    {/* Matérias do edital */}
    <div className="grid grid-cols-1 gap-2">
      {subjects.map((s) => {
        const peso = PESOS_EDITAL[s.name];
        const qtdNobanco = totalBySubject[s.id] || 0;
        const isSelected = selectedSubject === s.id;
        const cor = peso?.cor || "#6B7280";

        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Bolinha colorida */}
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cor }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{s.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    {qtdNobanco} questões no banco
                  </span>
                </div>
              </div>
              {peso && (
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold" style={{ color: cor }}>
                    {peso.questoes}q
                  </p>
                  <p className="text-[10px] text-muted-foreground">{peso.pontos}pts</p>
                </div>
              )}
            </div>

            {/* Barra de peso visual */}
            {peso && (
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(peso.pontos / 100) * 100}%`,
                    backgroundColor: cor,
                  }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>

    {/* Legenda */}
    <div className="mt-3 p-3 bg-muted/40 rounded-xl">
      <p className="text-[10px] text-muted-foreground text-center">
        🎯 <strong>Prova GCM Manaus 2026:</strong> 60 questões · 100 pontos · Nota mínima: 60pts
      </p>
    </div>
  </div>
);

const QuestionsPage: React.FC = () => {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [totalBySubject, setTotalBySubject] = useState<Record<string, number>>({});
  const [showMateriaSelector, setShowMateriaSelector] = useState(false);

  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<string>>(new Set());
  const [incorrectQuestions, setIncorrectQuestions] = useState<Set<string>>(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [restoringSession, setRestoringSession] = useState(true);
  const [filtersFromRestore, setFiltersFromRestore] = useState<SessionData["filters"] | null>(null);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionInitialized = useRef(false);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Fetch subjects, topics e contagem por matéria
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [subRes, topRes, questionSubjectRows] = await Promise.all([
          supabase.from("subjects").select("*").order("order_num"),
          supabase.from("topics").select("*"),
          fetchAllPublishedQuestionSubjectIds(),
        ]);
        if (subRes.data) setSubjects(subRes.data);
        if (topRes.data) setTopics(topRes.data);
        if (questionSubjectRows) {
          const counts: Record<string, number> = {};
          questionSubjectRows.forEach((q) => {
            counts[q.subject_id] = (counts[q.subject_id] || 0) + 1;
          });
          setTotalBySubject(counts);
        }
      } catch (error) {
        console.error("Failed to fetch question metadata:", error);
      }
    };
    fetchMeta();
  }, []);

  // Fetch user progress
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const [attRes, bkRes] = await Promise.all([
        supabase.from("question_attempts").select("question_id, is_correct").eq("user_id", user.id),
        supabase.from("bookmarks").select("question_id").eq("user_id", user.id),
      ]);
      if (attRes.data) {
        setAttemptedQuestions(new Set(attRes.data.map((a) => a.question_id)));
        setIncorrectQuestions(new Set(attRes.data.filter((a) => !a.is_correct).map((a) => a.question_id)));
      }
      if (bkRes.data) {
        setBookmarkedQuestions(new Set(bkRes.data.map((b) => b.question_id)));
      }
    };
    fetchUserData();
  }, [user]);

  // Restore session
  useEffect(() => {
    if (!user) { setRestoringSession(false); return; }

    const restore = async () => {
      try {
        const { data } = await supabase
          .from("study_sessions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        let session: SessionData | null = null;

        if (data && data.question_ids?.length > 0) {
          session = {
            questionIds: data.question_ids,
            currentIndex: data.current_index,
            sessionCorrect: data.session_correct,
            sessionTotal: data.session_total,
            filters: (data.filters as SessionData["filters"]) || { subject: "all", topic: "all", difficulty: "all", status: "all" },
            updatedAt: data.updated_at,
          };
        }

        if (!session) session = loadSessionLocal(user.id);

        if (session && session.questionIds.length > 0) {
          setFiltersFromRestore(session.filters);
          setSelectedSubject(session.filters.subject || "all");
          setSelectedTopic(session.filters.topic || "all");
          setSelectedDifficulty(session.filters.difficulty || "all");
          setSelectedStatus(session.filters.status || "all");
          setSessionCorrect(session.sessionCorrect);
          setSessionTotal(session.sessionTotal);
          sessionInitialized.current = true;

          const { data: qData } = await supabase
            .from("questions")
            .select("*, question_options(*)")
            .in("id", session.questionIds);

          if (qData && qData.length > 0) {
            const qMap = new Map(qData.map((q) => [q.id, q]));
            const ordered = session.questionIds
              .map((id) => qMap.get(id))
              .filter(Boolean) as QuestionWithOptions[];

            if (ordered.length > 0) {
              setQuestions(ordered);
              setCurrentIndex(Math.min(session.currentIndex, ordered.length - 1));
              setLoading(false);
              setRestoringSession(false);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
      }

      sessionInitialized.current = false;
      setRestoringSession(false);
    };

    restore();
  }, [user]);

  // Fetch questions when filters change
  useEffect(() => {
    if (restoringSession) return;
    if (sessionInitialized.current) {
      sessionInitialized.current = false;
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const allQuestions = await fetchAllPublishedQuestions({
          subjectId: selectedSubject !== "all" ? selectedSubject : undefined,
          topicId: selectedTopic !== "all" ? selectedTopic : undefined,
          difficulty: selectedDifficulty !== "all"
            ? selectedDifficulty as "facil" | "medio" | "dificil"
            : undefined,
        });
        let filtered = allQuestions;

        if (selectedStatus === "nao_respondidas") {
          filtered = filtered.filter((q) => !attemptedQuestions.has(q.id));
        } else if (selectedStatus === "respondidas") {
          filtered = filtered.filter((q) => attemptedQuestions.has(q.id));
        } else if (selectedStatus === "erradas") {
          filtered = filtered.filter((q) => incorrectQuestions.has(q.id));
        } else if (selectedStatus === "favoritas") {
          filtered = filtered.filter((q) => bookmarkedQuestions.has(q.id));
        }

        setQuestions(filtered);
        setCurrentIndex(0);
        setSelectedOption(null);
        setAnswered(false);
        setSessionCorrect(0);
        setSessionTotal(0);
        setSessionFinished(false);
        setShowMateriaSelector(false);

        if (user && filtered.length > 0) {
          persistSession(filtered.map((q) => q.id), 0, 0, 0);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        toast.error("Não foi possível carregar todas as questões.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedTopic, selectedDifficulty, selectedStatus, restoringSession]);

  const persistSession = useCallback((
    questionIds: string[],
    idx: number,
    correct: number,
    total: number,
  ) => {
    if (!user) return;
    const filters = { subject: selectedSubject, topic: selectedTopic, difficulty: selectedDifficulty, status: selectedStatus };
    const sessionData: SessionData = { questionIds, currentIndex: idx, sessionCorrect: correct, sessionTotal: total, filters, updatedAt: new Date().toISOString() };
    saveSessionLocal(user.id, sessionData);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await supabase.from("study_sessions").upsert({
        user_id: user.id, question_ids: questionIds, current_index: idx,
        session_correct: correct, session_total: total, filters, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }, 500);
  }, [user, selectedSubject, selectedTopic, selectedDifficulty, selectedStatus]);

  useEffect(() => {
    if (!user || loading || restoringSession || questions.length === 0) return;
    persistSession(questions.map((q) => q.id), currentIndex, sessionCorrect, sessionTotal);
  }, [currentIndex, sessionCorrect, sessionTotal, questions, user, loading, restoringSession, persistSession]);

  useEffect(() => {
    if (!user) return;
    const handleBeforeUnload = () => {
      if (questions.length > 0) {
        saveSessionLocal(user.id, {
          questionIds: questions.map((q) => q.id),
          currentIndex, sessionCorrect, sessionTotal,
          filters: { subject: selectedSubject, topic: selectedTopic, difficulty: selectedDifficulty, status: selectedStatus },
          updatedAt: new Date().toISOString(),
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => { handleBeforeUnload(); window.removeEventListener("beforeunload", handleBeforeUnload); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, questions, currentIndex, sessionCorrect, sessionTotal, selectedSubject, selectedTopic, selectedDifficulty, selectedStatus]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) setIsBookmarked(bookmarkedQuestions.has(currentQuestion.id));
  }, [currentQuestion, bookmarkedQuestions]);

  const handleNext = useCallback(() => {
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null; }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1); setSelectedOption(null); setAnswered(false);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (autoAdvanceRef.current) { clearTimeout(autoAdvanceRef.current); autoAdvanceRef.current = null; }
    if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setSelectedOption(null); setAnswered(false); }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0); setSelectedOption(null); setAnswered(false);
    setSessionFinished(false); setSessionCorrect(0); setSessionTotal(0);
    if (user) {
      clearSessionLocal(user.id);
      supabase.from("study_sessions").delete().eq("user_id", user.id);
    }
  }, [user]);

  const handleAnswer = async () => {
    if (!selectedOption || !currentQuestion || !user) return;
    const option = currentQuestion.question_options.find((o) => o.id === selectedOption);
    if (!option) return;
    setAnswered(true);
    setSessionTotal((p) => p + 1);
    if (option.is_correct) setSessionCorrect((p) => p + 1);
    await supabase.from("question_attempts").insert({
      user_id: user.id, question_id: currentQuestion.id,
      selected_option_id: selectedOption, is_correct: option.is_correct,
    });
    setAttemptedQuestions((prev) => new Set(prev).add(currentQuestion.id));
    if (!option.is_correct) setIncorrectQuestions((prev) => new Set(prev).add(currentQuestion.id));
    toast(option.is_correct ? "✅ Resposta correta!" : "❌ Resposta incorreta", { duration: 2000 });
  };

  const handleBookmark = async () => {
    if (!currentQuestion || !user) return;
    if (isBookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("question_id", currentQuestion.id);
      setBookmarkedQuestions((prev) => { const next = new Set(prev); next.delete(currentQuestion.id); return next; });
      setIsBookmarked(false);
      toast("Removida dos favoritos", { duration: 1500 });
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, question_id: currentQuestion.id });
      setBookmarkedQuestions((prev) => new Set(prev).add(currentQuestion.id));
      setIsBookmarked(true);
      toast("⭐ Adicionada aos favoritos", { duration: 1500 });
    }
  };

  const handleMateriaSelect = (id: string) => {
    setSelectedSubject(id);
    setSelectedTopic("all");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
  };

  const filteredTopics = selectedSubject !== "all" ? topics.filter((t) => t.subject_id === selectedSubject) : topics;
  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name || "";
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const activeFilterCount = [selectedSubject, selectedTopic, selectedDifficulty, selectedStatus].filter((v) => v !== "all").length;
  const currentQuestionOptions = currentQuestion
    ? [...currentQuestion.question_options].sort((a, b) => a.letter.localeCompare(b.letter))
    : [];

  const difficultyLabel = (d: string) => {
    if (d === "facil") return "Fácil";
    if (d === "medio") return "Médio";
    if (d === "dificil") return "Difícil";
    return d;
  };

  const getOptionClass = (option: QuestionOption) => {
    if (!answered) return selectedOption === option.id ? "question-option selected" : "question-option";
    if (option.is_correct) return "question-option correct";
    if (selectedOption === option.id && !option.is_correct) return "question-option incorrect";
    return "question-option opacity-50";
  };

  const getLetterClass = (option: QuestionOption) => {
    if (!answered) {
      return selectedOption === option.id
        ? "option-letter bg-primary text-primary-foreground"
        : "option-letter bg-muted text-muted-foreground";
    }
    if (option.is_correct) return "option-letter bg-success text-success-foreground";
    if (selectedOption === option.id && !option.is_correct) return "option-letter bg-destructive text-destructive-foreground";
    return "option-letter bg-muted text-muted-foreground";
  };

  const filtersContent = (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Matéria</label>
        <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedTopic("all"); }}>
          <SelectTrigger><SelectValue placeholder="Todas as matérias" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as matérias</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} {PESOS_EDITAL[s.name] ? `(${PESOS_EDITAL[s.name].questoes}q · ${PESOS_EDITAL[s.name].pontos}pts)` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Assunto</label>
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger><SelectValue placeholder="Todos os assuntos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os assuntos</SelectItem>
            {filteredTopics.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Dificuldade</label>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="facil">Fácil</SelectItem>
            <SelectItem value="medio">Médio</SelectItem>
            <SelectItem value="dificil">Difícil</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Status</label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="nao_respondidas">Não respondidas</SelectItem>
            <SelectItem value="respondidas">Respondidas</SelectItem>
            <SelectItem value="erradas">Erradas</SelectItem>
            <SelectItem value="favoritas">Favoritas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="secondary" className="w-full" onClick={() => {
        setSelectedSubject("all"); setSelectedTopic("all");
        setSelectedDifficulty("all"); setSelectedStatus("all");
      }}>
        Limpar filtros
      </Button>
    </div>
  );

  const sessionPanel = currentQuestion && (
    <div className="hidden xl:block w-[280px] flex-shrink-0">
      <div className="sticky top-6 space-y-4">
        <div className="premium-card">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Sessão de estudo</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">Progresso</span>
                <span className="font-bold text-foreground">{currentIndex + 1}/{questions.length}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            {sessionTotal > 0 && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Acertos</span>
                  <span className="font-bold text-success">{sessionCorrect}/{sessionTotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Taxa de acerto</span>
                  <span className="font-bold text-primary">{Math.round((sessionCorrect / sessionTotal) * 100)}%</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="premium-card">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Questão atual</p>
          <p className="text-sm font-semibold text-foreground">{subjectName(currentQuestion.subject_id)}</p>
          {(() => {
            const peso = PESOS_EDITAL[subjectName(currentQuestion.subject_id)];
            return peso ? (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(peso.pontos / 100) * 100}%`, backgroundColor: peso.cor }} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                  {peso.questoes}q · {peso.pontos}pts
                </span>
              </div>
            ) : null;
          })()}
          {currentQuestion.banca && (
            <p className="text-xs text-muted-foreground mt-1">{currentQuestion.banca} · {currentQuestion.ano}</p>
          )}
        </div>

        {answered && currentIndex < questions.length - 1 && (
          <Button className="w-full gap-2 h-11" onClick={handleNext}>
            Próxima questão <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        <div className="premium-card">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Filtros</p>
          {filtersContent}
        </div>
      </div>
    </div>
  );

  if (restoringSession || loading) {
    return (
      <div className="page-container-wide animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-foreground font-display">Questões</h1>
        </div>
        <QuestionCardSkeleton />
      </div>
    );
  }

  return (
    <div className="page-container-wide animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground font-display">Questões</h1>
          {questions.length > 0 && !showMateriaSelector && (
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {questions.length} questões
              {selectedSubject !== "all" && (
                <span className="ml-1 text-primary font-bold">
                  · {subjectName(selectedSubject)}
                  {PESOS_EDITAL[subjectName(selectedSubject)] && (
                    <span className="text-muted-foreground font-normal">
                      {" "}({PESOS_EDITAL[subjectName(selectedSubject)].questoes}q na prova)
                    </span>
                  )}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {/* Botão escolher matéria */}
          <Button
            variant={showMateriaSelector ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setShowMateriaSelector(!showMateriaSelector)}
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">
              {selectedSubject === "all" ? "Escolher matéria" : subjectName(selectedSubject)}
            </span>
          </Button>

          {/* Filtros avançados (mobile) */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 xl:hidden">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
              <SheetHeader><SheetTitle>Filtrar questões</SheetTitle></SheetHeader>
              <div className="mt-4 pb-6">{filtersContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Seletor de matéria */}
      {showMateriaSelector && (
        <MateriaSelector
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelect={handleMateriaSelect}
          totalBySubject={totalBySubject}
        />
      )}

      {/* Conteúdo principal */}
      {!showMateriaSelector && (
        <>
          {questions.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nenhuma questão encontrada"
              description="Tente ajustar os filtros para encontrar questões disponíveis."
            />
          ) : sessionFinished ? (
            <div className="max-w-lg mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground mb-2">Sessão concluída!</h2>
              {sessionTotal > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  Você acertou <span className="font-bold text-success">{sessionCorrect}</span> de{" "}
                  <span className="font-bold">{sessionTotal}</span> questões ({Math.round((sessionCorrect / sessionTotal) * 100)}%)
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleRestart} className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Recomeçar
                </Button>
                <Button onClick={() => { setSelectedStatus("all"); handleRestart(); }}>
                  Ver todas as questões
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="flex gap-8">
              {/* Main */}
              <div key={currentQuestion.id} className="flex-1 min-w-0 max-w-3xl">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-foreground">Questão {currentIndex + 1} de {questions.length}</span>
                    <span className="font-semibold text-muted-foreground">{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(() => {
                    const nome = subjectName(currentQuestion.subject_id);
                    const peso = PESOS_EDITAL[nome];
                    return (
                      <span
                        className="px-2.5 py-1 text-white text-[11px] font-bold rounded-md"
                        style={{ backgroundColor: peso?.cor || "#3B82F6" }}
                      >
                        {nome}
                        {peso && <span className="ml-1 opacity-80">({peso.questoes}q · {peso.pontos}pts)</span>}
                      </span>
                    );
                  })()}
                  {currentQuestion.dificuldade && (
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                      currentQuestion.dificuldade === "facil" ? "bg-success/10 text-success" :
                      currentQuestion.dificuldade === "dificil" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {difficultyLabel(currentQuestion.dificuldade)}
                    </span>
                  )}
                  {currentQuestion.banca && (
                    <span className="px-2.5 py-1 bg-muted text-muted-foreground text-[11px] font-medium rounded-md">
                      {currentQuestion.banca}
                    </span>
                  )}
                  {currentQuestion.ano > 0 && (
                    <span className="px-2.5 py-1 bg-muted text-muted-foreground text-[11px] font-medium rounded-md">
                      {currentQuestion.ano}
                    </span>
                  )}
                  {currentQuestion.orgao && (
                    <span className="px-2.5 py-1 bg-muted text-muted-foreground text-[11px] font-medium rounded-md">
                      {currentQuestion.orgao}
                    </span>
                  )}
                </div>

                {/* Enunciado */}
                <div className="premium-card p-5 lg:p-7 mb-6">
                  <p className="text-sm lg:text-[15px] leading-relaxed text-foreground sanitized-text">
                    {sanitizeText(currentQuestion.enunciado)}
                  </p>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Alternativas</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestionOptions.map((option) => (
                    <button
                      key={option.id}
                      className={getOptionClass(option)}
                      onClick={() => !answered && setSelectedOption(option.id)}
                      disabled={answered}
                    >
                      <span className={getLetterClass(option)}>{option.letter}</span>
                      <span className="text-sm leading-relaxed sanitized-text flex-1">{sanitizeText(option.text)}</span>
                      {answered && option.is_correct && <CheckCircle2 className="w-5 h-5 text-success ml-auto flex-shrink-0" />}
                      {answered && selectedOption === option.id && !option.is_correct && <XCircle className="w-5 h-5 text-destructive ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {!answered && (
                  <Button className="w-full h-12 text-sm font-bold" size="lg" onClick={handleAnswer} disabled={!selectedOption}>
                    Confirmar resposta
                  </Button>
                )}

                {/* Feedback */}
                {answered && (() => {
                  const isCorrect = currentQuestion.question_options.find((o) => o.id === selectedOption)?.is_correct;
                  return (
                    <div className="space-y-4">
                      <div className={`p-5 rounded-xl border-2 ${isCorrect ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30"}`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <>
                              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                                <Award className="w-5 h-5 text-success" />
                              </div>
                              <div>
                                <p className="font-bold text-success text-sm">Parabéns, você acertou!</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Continue assim para garantir a aprovação.</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-5 h-5 text-destructive" />
                              </div>
                              <div>
                                <p className="font-bold text-destructive text-sm">Resposta incorreta</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Revise a explicação abaixo e fortaleça seu conhecimento.</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {(currentQuestion.explanation_main || currentQuestion.explicacao) && (
                        <div className="bg-accent/30 rounded-xl border border-accent-foreground/10 p-5 lg:p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Lightbulb className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Comentário do professor</p>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground sanitized-text">
                            {sanitizeText(currentQuestion.explanation_main || currentQuestion.explicacao)}
                          </p>
                        </div>
                      )}

                      {(() => {
                        const optionComments: Record<string, string> = {
                          A: currentQuestion.option_a_comment || "",
                          B: currentQuestion.option_b_comment || "",
                          C: currentQuestion.option_c_comment || "",
                          D: currentQuestion.option_d_comment || "",
                          E: currentQuestion.option_e_comment || "",
                        };
                        const hasAnyComment = Object.values(optionComments).some((c) => c.trim());
                        if (!hasAnyComment) return null;
                        return (
                          <div className="bg-accent/30 rounded-xl border border-accent-foreground/10 p-5 lg:p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5 text-foreground" />
                              </div>
                              <p className="text-xs font-bold text-foreground uppercase tracking-wide">Análise das alternativas</p>
                            </div>
                            <div className="space-y-2">
                              {currentQuestionOptions.map((opt) => {
                                const comment = optionComments[opt.letter];
                                if (!comment?.trim()) return null;
                                return (
                                  <div key={opt.letter} className="flex gap-2 items-start">
                                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${opt.is_correct ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                                      {opt.letter}
                                    </span>
                                    <p className="text-sm leading-relaxed text-foreground sanitized-text">{sanitizeText(comment)}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {currentQuestion.legal_basis?.trim() && (
                        <div className="bg-accent/30 rounded-xl border border-accent-foreground/10 p-5 lg:p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center">
                              <BookOpen className="w-3.5 h-3.5 text-foreground" />
                            </div>
                            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Fundamento</p>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground sanitized-text">{sanitizeText(currentQuestion.legal_basis)}</p>
                        </div>
                      )}

                      {currentQuestion.exam_tip?.trim() && (
                        <div className="bg-primary/5 rounded-xl border border-primary/20 p-5 lg:p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Lightbulb className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <p className="text-xs font-bold text-primary uppercase tracking-wide">Dica de prova</p>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground sanitized-text">{sanitizeText(currentQuestion.exam_tip)}</p>
                        </div>
                      )}

                      <div className="flex gap-2.5">
                        <Button variant="outline" size="sm" onClick={handleBookmark} className="flex-1 h-11">
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4 mr-1.5" /> : <Bookmark className="w-4 h-4 mr-1.5" />}
                          {isBookmarked ? "Favoritada" : "Rever depois"}
                        </Button>
                        {currentIndex < questions.length - 1 ? (
                          <Button size="sm" onClick={handleNext} className="flex-1 h-11 xl:hidden">
                            Próxima questão <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => setSessionFinished(true)} className="flex-1 h-11 xl:hidden">
                            Finalizar sessão
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-between mt-8 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleNext} disabled={currentIndex >= questions.length - 1}>
                    Próxima <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {sessionPanel}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default QuestionsPage;
