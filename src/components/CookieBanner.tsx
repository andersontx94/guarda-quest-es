import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const COOKIE_KEY = "gq_cookie_consent";
const VERSAO = "1.0";

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const salvarConsentimento = async (aceita_analytics: boolean) => {
    setSaving(true);

    localStorage.setItem(COOKIE_KEY, JSON.stringify({
      aceito: true,
      analytics: aceita_analytics,
      versao: VERSAO,
      data: new Date().toISOString(),
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      // Cast para any para contornar tipos desatualizados — tabela criada via migration
      const db = supabase as any;
      await db.from("lgpd_consents").insert({
        user_id: session?.user?.id ?? null,
        session_id: session ? null : sessionId,
        aceita_termos: true,
        aceita_privacidade: true,
        aceita_cookies_essenciais: true,
        aceita_cookies_analytics: aceita_analytics,
        user_agent: navigator.userAgent.slice(0, 200),
        versao_termos: VERSAO,
        versao_privacidade: VERSAO,
      });
    } catch (e) {
      console.warn("Erro ao salvar consentimento:", e);
    }

    setSaving(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      zIndex: 9999, pointerEvents: "none",
      padding: "0 0 env(safe-area-inset-bottom)",
    }}>
      <div
        className="bg-card border border-border"
        style={{
          margin: "12px", borderRadius: "16px",
          padding: "14px 16px", pointerEvents: "all",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Linha 1: ícone + texto + fechar */}
          <div className="flex items-start gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Cookie className="w-3.5 h-3.5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground mb-0.5">Sua privacidade importa</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Usamos apenas <strong className="text-foreground">cookies essenciais</strong>.
                Ao continuar, você concorda com nossos{" "}
                <Link to="/termos" className="text-primary hover:underline">Termos</Link>
                {" "}e{" "}
                <Link to="/privacidade" className="text-primary hover:underline">Privacidade</Link>.
              </p>
            </div>

            <button
              onClick={() => salvarConsentimento(false)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Linha 2: botões em linha cheia */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 rounded-xl text-xs"
              onClick={() => salvarConsentimento(false)}
              disabled={saving}
            >
              Só essenciais
            </Button>
            <Button
              size="sm"
              className="flex-1 h-8 rounded-xl text-xs font-bold"
              style={{ background: "var(--gradient-hero)" }}
              onClick={() => salvarConsentimento(true)}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Aceitar todos"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;