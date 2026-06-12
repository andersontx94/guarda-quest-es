import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

export type Concurso = Database["public"]["Tables"]["concursos"]["Row"];

interface ConcursoContextType {
  concursos: Concurso[];
  concursoAtual: Concurso | null;
  /** id do concurso ativo — usar em `.eq("concurso_id", concursoId)` nas queries */
  concursoId: string | null;
  loading: boolean;
  setConcurso: (id: string) => void;
}

const ConcursoContext = createContext<ConcursoContextType | undefined>(undefined);

const LS_KEY = "concurso_atual_id";

export const useConcurso = () => {
  const ctx = useContext(ConcursoContext);
  if (!ctx) throw new Error("useConcurso must be used within ConcursoProvider");
  return ctx;
};

/** Concurso primário = produto ativo (não encerrado, menor ordem). Hoje: Aracaju. */
function pickDefault(concursos: Concurso[]): Concurso | null {
  if (concursos.length === 0) return null;
  const ativos = concursos.filter((c) => !c.encerrado);
  const pool = ativos.length > 0 ? ativos : concursos;
  return [...pool].sort((a, b) => a.ordem - b.ordem)[0];
}

export const ConcursoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [concursoAtual, setConcursoAtual] = useState<Concurso | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega a lista de concursos uma vez
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("concursos")
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("Falha ao carregar concursos:", error);
      }
      setConcursos(data ?? []);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Resolve o concurso ativo a partir de: perfil do usuário > localStorage > default (Aracaju)
  useEffect(() => {
    if (concursos.length === 0) return;

    let cancelled = false;
    const resolve = async () => {
      let resolvedId: string | null = null;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("concurso_atual")
          .eq("user_id", user.id)
          .single();
        if (profile?.concurso_atual) resolvedId = profile.concurso_atual;
      }

      if (!resolvedId) {
        const stored = localStorage.getItem(LS_KEY);
        if (stored && concursos.some((c) => c.id === stored)) resolvedId = stored;
      }

      const resolved =
        concursos.find((c) => c.id === resolvedId) ?? pickDefault(concursos);

      if (cancelled) return;
      setConcursoAtual(resolved);
      if (resolved) localStorage.setItem(LS_KEY, resolved.id);
      setLoading(false);
    };

    resolve();
    return () => { cancelled = true; };
  }, [concursos, user]);

  const setConcurso = useCallback((id: string) => {
    const found = concursos.find((c) => c.id === id);
    if (!found) return;
    setConcursoAtual(found);
    localStorage.setItem(LS_KEY, id);
    if (user) {
      // persiste a escolha no perfil (não bloqueia a UI)
      supabase
        .from("profiles")
        .update({ concurso_atual: id })
        .eq("user_id", user.id)
        .then(({ error }) => {
          if (error) console.error("Falha ao salvar concurso no perfil:", error);
        });
    }
  }, [concursos, user]);

  return (
    <ConcursoContext.Provider
      value={{
        concursos,
        concursoAtual,
        concursoId: concursoAtual?.id ?? null,
        loading,
        setConcurso,
      }}
    >
      {children}
    </ConcursoContext.Provider>
  );
};
