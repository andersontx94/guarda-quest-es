import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileText,
  Download,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
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
  "Legisla\u00E7\u00E3o Espec\u00EDfica": "#3B82F6",
  "L\u00EDngua Portuguesa": "#8B5CF6",
  "\u00C9tica e Direitos Humanos": "#10B981",
  "Legisla\u00E7\u00E3o de Tr\u00E2nsito": "#06B6D4",
  "No\u00E7\u00F5es de Inform\u00E1tica": "#84CC16",
  "Geografia e Hist\u00F3ria de Manaus": "#EC4899",
  "LegislaÃ§Ã£o EspecÃ­fica": "#3B82F6",
  "LÃ­ngua Portuguesa": "#8B5CF6",
  "Ã‰tica e Direitos Humanos": "#10B981",
  "LegislaÃ§Ã£o de TrÃ¢nsito": "#06B6D4",
  "NoÃ§Ãµes de InformÃ¡tica": "#84CC16",
  "Geografia e HistÃ³ria de Manaus": "#EC4899",
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
  "Legisla\u00E7\u00E3o Espec\u00EDfica": 55,
  "L\u00EDngua Portuguesa": 30,
  "\u00C9tica e Direitos Humanos": 14,
  "Legisla\u00E7\u00E3o de Tr\u00E2nsito": 25,
  "No\u00E7\u00F5es de Inform\u00E1tica": 20,
  "Geografia e Hist\u00F3ria de Manaus": 15,
  "LegislaÃ§Ã£o EspecÃ­fica": 55,
  "LÃ­ngua Portuguesa": 30,
  "Ã‰tica e Direitos Humanos": 14,
  "LegislaÃ§Ã£o de TrÃ¢nsito": 25,
  "NoÃ§Ãµes de InformÃ¡tica": 20,
  "Geografia e HistÃ³ria de Manaus": 15,
};

const buildFallbackFileName = (subjectName: string, extension: "pdf" | "html") =>
  `material-${subjectName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.${extension}`;

const getFileName = (subjectName: string, contentDisposition: string | null) => {
  if (contentDisposition) {
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1]);
    }

    const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    if (asciiMatch?.[1]) {
      return asciiMatch[1];
    }
  }

  return buildFallbackFileName(subjectName, "pdf");
};

const baixarArquivo = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

const renderLoadingPreview = (previewTab: Window, subjectName: string) => {
  previewTab.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Gerando material...</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            background: #f8fafc;
            color: #0f172a;
          }

          .box {
            max-width: 420px;
            padding: 24px;
            text-align: center;
          }

          h1 {
            margin: 0 0 8px;
            font-size: 24px;
          }

          p {
            margin: 0;
            color: #475569;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Gerando material...</h1>
          <p>Estamos preparando o arquivo de ${subjectName}.</p>
        </div>
      </body>
    </html>
  `);
  previewTab.document.close();
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
    const previewTab = window.open("", "_blank");

    if (previewTab) {
      renderLoadingPreview(previewTab, subject.name);
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Faca login novamente para baixar o PDF.");
        if (previewTab && !previewTab.closed) previewTab.close();
        setState(subject.id, "error");
        setTimeout(() => setState(subject.id, "idle"), 3000);
        return;
      }

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gerar-pdf-materia?subject_id=${subject.id}&inline=true`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/pdf, text/html",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const contentType = response.headers.get("content-type") || "";
      const contentDisposition = response.headers.get("content-disposition");

      if (contentType.includes("application/pdf")) {
        const blob = await response.blob();
        baixarArquivo(blob, getFileName(subject.name, contentDisposition));

        if (previewTab && !previewTab.closed) {
          previewTab.close();
        }
      } else {
        const html = await response.text();

        if (previewTab && !previewTab.closed) {
          previewTab.document.open();
          previewTab.document.write(html);
          previewTab.document.close();
        } else {
          const htmlBlob = new Blob([html], { type: "text/html; charset=utf-8" });
          baixarArquivo(htmlBlob, buildFallbackFileName(subject.name, "html"));
          toast.message("A visualizacao foi bloqueada. Baixamos o material em HTML.");
        }
      }

      setState(subject.id, "done");
      setTimeout(() => setState(subject.id, "idle"), 4000);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
      if (previewTab && !previewTab.closed) previewTab.close();
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
              Clique em <strong>"Baixar PDF"</strong> - uma nova aba vai abrir com o
              conteudo formatado.
              Use <strong>Ctrl+P</strong> (ou Cmd+P no Mac) e selecione{" "}
              <strong>"Salvar como PDF"</strong> para salvar no seu dispositivo.
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
                {state === "loading" && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Gerando...
                  </>
                )}
                {state === "done" && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-success" /> Pronto!
                  </>
                )}
                {state === "error" && (
                  <>
                    <AlertCircle className="w-4 h-4 text-destructive" /> Erro
                  </>
                )}
                {state === "idle" && (
                  <>
                    <Download className="w-4 h-4" /> Baixar PDF
                  </>
                )}
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
