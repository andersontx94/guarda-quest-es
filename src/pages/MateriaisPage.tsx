import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileText, Download, BookOpen, Loader2,
  CheckCircle2, AlertCircle,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  order_num: number;
}

type DownloadState = "idle" | "loading" | "done" | "error";

const CORES: Record<string, string> = {
  "Legislacao Especifica": "#3B82F6",
  "Lingua Portuguesa": "#8B5CF6",
  "Direito Constitucional": "#EF4444",
  "Direito Penal": "#F59E0B",
  "Direito Processual Penal": "#F97316",
  "Etica e Direitos Humanos": "#10B981",
  "Legislacao de Transito": "#06B6D4",
  "Nocoes de Informatica": "#84CC16",
  "Geografia e Historia de Manaus": "#EC4899",
  "Legislação Específica": "#3B82F6",
  "Língua Portuguesa": "#8B5CF6",
  "Ética e Direitos Humanos": "#10B981",
  "Legislação de Trânsito": "#06B6D4",
  "Noções de Informática": "#84CC16",
  "Geografia e História de Manaus": "#EC4899",
};

const TOTAIS: Record<string, number> = {
  "Legislacao Especifica": 55,
  "Lingua Portuguesa": 30,
  "Direito Constitucional": 40,
  "Direito Penal": 24,
  "Direito Processual Penal": 17,
  "Etica e Direitos Humanos": 14,
  "Legislacao de Transito": 25,
  "Nocoes de Informatica": 20,
  "Geografia e Historia de Manaus": 15,
  "Legislação Específica": 55,
  "Língua Portuguesa": 30,
  "Ética e Direitos Humanos": 14,
  "Legislação de Trânsito": 25,
  "Noções de Informática": 20,
  "Geografia e História de Manaus": 15,
};

const MateriaisPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<Record<string, DownloadState>>({});

  useEffect(() => {
    supabase
      .from("subjects")
      .select("id, name, order_num")
      .order("order_num")
      .then(({ data }) => {
        if (data) setSubjects(data);
        setLoading(false);
      });
  }, []);

  const setState = (id: string, state: DownloadState) =>
    setStates((prev) => ({ ...prev, [id]: state }));

  const baixarPDF = async (subject: Subject) => {
    setState(subject.id, "loading");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Faça login novamente para baixar o PDF.");
        setState(subject.id, "error");
        return;
      }

      const subjectId = subject.id;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gerar-pdf-materia?subject_id=${subjectId}&inline=true`;
      window.location.href = url;
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      setState(subject.id, "error");
      setTimeout(() => setState(subject.id, "idle"), 3000);
    }
  };

  if (loading) {
    return (
      <div className="page-container animate-slide-up flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container animate-slide-up max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2 font-display">
          <FileText className="w-5 h-5 text-primary" /> Materiais para Download
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          PDFs com questoes e gabarito comentado por materia - Exclusivo para alunos
        </p>
      </div>

      <div className="premium-card p-4 mb-6 border border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">Como usar os PDFs</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Clique em <strong>"Baixar PDF"</strong> - uma nova aba vai abrir com o conteudo formatado.
              Use <strong>Ctrl+P</strong> (ou Cmd+P no Mac) e selecione <strong>"Salvar como PDF"</strong> para salvar no seu dispositivo.
              Cada PDF tem as questoes + gabarito comentado ao final.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {subjects.map((subject) => {
          const cor = CORES[subject.name] || "#3B82F6";
          const total = TOTAIS[subject.name] || 0;
          const state = states[subject.id] || "idle";

          return (
            <div key={subject.id} className="premium-card p-4 flex items-center gap-4">
              <div className="w-1.5 h-14 rounded-full shrink-0" style={{ backgroundColor: cor }} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{subject.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {total} questoes - Gabarito comentado incluido
                </p>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden max-w-[180px]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(total / 55) * 100}%`, backgroundColor: cor }}
                  />
                </div>
              </div>

              <Button
                size="sm"
                variant={state === "done" ? "outline" : "default"}
                className="shrink-0 gap-2 h-9 rounded-xl"
                style={state === "idle" ? { background: cor } : undefined}
                onClick={() => baixarPDF(subject)}
                disabled={state === "loading"}
              >
                {state === "loading" && <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>}
                {state === "done" && <><CheckCircle2 className="w-4 h-4 text-success" /> Pronto!</>}
                {state === "error" && <><AlertCircle className="w-4 h-4 text-destructive" /> Erro</>}
                {state === "idle" && <><Download className="w-4 h-4" /> Baixar PDF</>}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-muted/40 text-center">
        <p className="text-xs text-muted-foreground">
          Material exclusivo para alunos GuardaQuest - Nao compartilhe
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Prova GCM Manaus 2026 - 24 de maio de 2026 - Consulplan
        </p>
      </div>
    </div>
  );
};

export default MateriaisPage;
