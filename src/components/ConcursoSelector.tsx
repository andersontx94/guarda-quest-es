import React from "react";
import { Check, ChevronDown, Shield } from "lucide-react";
import { useConcurso } from "@/contexts/ConcursoContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConcursoSelectorProps {
  /** "sidebar" = bloco largo no topo da sidebar; "compact" = pílula enxuta p/ mobile */
  variant?: "sidebar" | "compact";
}

export const ConcursoSelector: React.FC<ConcursoSelectorProps> = ({ variant = "sidebar" }) => {
  const { concursos, concursoAtual, setConcurso, loading } = useConcurso();

  if (loading || !concursoAtual) {
    return (
      <div className={variant === "sidebar" ? "h-12 rounded-xl bg-muted/50 animate-pulse" : "h-9 w-40 rounded-lg bg-muted/50 animate-pulse"} />
    );
  }

  // Só faz sentido mostrar o seletor se houver mais de um concurso
  const podeTrocar = concursos.length > 1;

  const trigger =
    variant === "sidebar" ? (
      <button
        className="w-full flex items-center gap-3 group"
        disabled={!podeTrocar}
        aria-label="Trocar concurso"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h1 className="text-sm font-extrabold text-foreground leading-tight font-display truncate">
            {concursoAtual.nome}
          </h1>
          <p className="text-[10px] text-muted-foreground font-medium truncate">
            {concursoAtual.encerrado ? "📦 Arquivo de estudo" : `${concursoAtual.banca} · ${concursoAtual.uf}`}
          </p>
        </div>
        {podeTrocar && (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        )}
      </button>
    ) : (
      <button
        className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-card text-sm font-bold text-foreground"
        disabled={!podeTrocar}
        aria-label="Trocar concurso"
      >
        <Shield className="w-4 h-4 text-primary" />
        <span className="truncate max-w-[140px]">{concursoAtual.nome}</span>
        {podeTrocar && <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
    );

  if (!podeTrocar) return trigger;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {concursos.map((c) => {
          const ativo = c.id === concursoAtual.id;
          return (
            <DropdownMenuItem
              key={c.id}
              onClick={() => setConcurso(c.id)}
              className="flex items-start gap-2 py-2.5 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate">{c.nome}</span>
                  {c.encerrado && (
                    <span className="text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      📦 Arquivo
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {c.banca} · {c.cargo} · {c.uf}
                </p>
              </div>
              {ativo && <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
