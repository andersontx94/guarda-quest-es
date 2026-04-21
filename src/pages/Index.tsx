import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import {
  Shield, ArrowRight, CheckCircle2, Trophy,
  Lock, Zap, ChevronDown, ChevronUp, Medal, Star,
} from "lucide-react";

const CHECKOUT_URL = "https://pay.hotmart.com/P105084825B";
const PROVA_DATA   = new Date("2026-05-24T08:00:00");
const IMG_HERO    = "/gmm-formacao.webp";
const IMG_MEIO    = "/gmm-guardas.jpg";
const IMG_VIATURA = "/gmm-viatura.jpg";

// ── Contador ──────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      dias:     Math.floor(diff / 86400000),
      horas:    Math.floor((diff % 86400000) / 3600000),
      minutos:  Math.floor((diff % 3600000) / 60000),
      segundos: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const CountBox: React.FC<{ valor: number; label: string }> = ({ valor, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      background: "rgba(255,255,255,0.12)",
      border: "1.5px solid rgba(255,255,255,0.25)",
      borderRadius: "10px",
      padding: "10px 16px",
      minWidth: "60px",
    }}>
      <span style={{
        display: "block",
        fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
        fontWeight: 900,
        color: "#ffffff",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
      }}>
        {String(valor).padStart(2, "0")}
      </span>
    </div>
    <span style={{
      display: "block",
      fontSize: "10px", fontWeight: 700,
      color: "rgba(255,255,255,0.55)",
      marginTop: "7px", textTransform: "uppercase",
      letterSpacing: "0.14em",
    }}>
      {label}
    </span>
  </div>
);

// ── Matérias ──────────────────────────────────────────
const materias = [
  { nome: "Legislação Específica",          q: 15, pts: 30,  cor: "#3B82F6" },
  { nome: "Língua Portuguesa",              q: 10, pts: 15,  cor: "#8B5CF6" },
  { nome: "Direito Constitucional",         q: 5,  pts: 10,  cor: "#EF4444" },
  { nome: "Direito Penal",                  q: 5,  pts: 7.5, cor: "#F59E0B" },
  { nome: "Dir. Processual Penal",          q: 5,  pts: 7.5, cor: "#F97316" },
  { nome: "Ética e Direitos Humanos",       q: 5,  pts: 7.5, cor: "#10B981" },
  { nome: "Legislação de Trânsito",         q: 5,  pts: 7.5, cor: "#06B6D4" },
  { nome: "Noções de Informática",          q: 5,  pts: 7.5, cor: "#84CC16" },
  { nome: "Geografia e História de Manaus", q: 5,  pts: 7.5, cor: "#EC4899" },
];

// ── FAQ ───────────────────────────────────────────────
const faqs = [
  {
    q: "As questões realmente seguem o edital da GCM Manaus 2026?",
    a: "Sim. Cada questão foi elaborada com base no edital oficial da Consulplan, cobrindo as 9 matérias na proporção exata da prova. Nada genérico.",
  },
  {
    q: "Funciona no celular?",
    a: "Perfeitamente. A plataforma é responsiva e salva sua sessão automaticamente. Estude onde quiser e continue de onde parou.",
  },
  {
    q: "Como sei se estou no caminho certo para a aprovação?",
    a: "Nosso simulado calcula sua nota ponderada real e mostra exatamente o quanto você precisa melhorar. A nota de corte é 60 pontos.",
  },
  {
    q: "O ranking é obrigatório?",
    a: "Não. É 100% opcional. Se quiser participar, escolhe um apelido. Se preferir privacidade, estuda sem aparecer para ninguém.",
  },
  {
    q: "Quando recebo o acesso?",
    a: "Na hora. Após confirmar o pagamento, você recebe o acesso por e-mail e já entra em minutos.",
  },
  {
    q: "Até quando tenho acesso?",
    a: "Até o dia da prova, 24 de maio de 2026. Novas questões chegam automaticamente, sem custo extra.",
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button className="flex w-full items-center justify-between gap-4 py-5 text-left" onClick={() => setOpen(!open)}>
        <span className="text-sm font-bold text-foreground sm:text-base leading-snug">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
      </button>
      {open && <p className="pb-5 text-sm leading-7 text-muted-foreground">{a}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────
const Index: React.FC = () => {
  const tempo = useCountdown(PROVA_DATA);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/94 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--gradient-hero)" }}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">GuardaQuest</p>
              <p className="text-[10px] text-muted-foreground font-medium">GCM Manaus 2026</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-xl hidden sm:inline-flex">
            <Link to="/login">Já tenho acesso</Link>
            </Button>
            <CheckoutButton
              checkoutUrl={CHECKOUT_URL}
              size="sm"
              className="rounded-xl font-bold px-5"
              style={{ background: "var(--gradient-hero)" }}
              eventData={{
                content_name: "Header CTA",
                content_category: "Hotmart Checkout",
                value: 29.9,
                currency: "BRL",
              }}
            >
              Acessar agora
            </CheckoutButton>
          </div>
        </div>
      </header>

      <main>

        {/* ════════════════════════════════════
            HERO
        ════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "94vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Foto real da GMM */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url('${IMG_HERO}')`,
            backgroundSize: "cover", backgroundPosition: "center top",
          }} />

          {/* Overlay — escuro no lado esquerdo, abre à direita */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(105deg, rgba(0,3,12,0.97) 0%, rgba(0,6,20,0.95) 35%, rgba(1,12,36,0.85) 58%, rgba(2,18,52,0.50) 80%, rgba(3,22,60,0.25) 100%)",
          }} />

          {/* Vinheta inferior para transição suave */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
            background: "linear-gradient(to top, var(--background, #ffffff), transparent)",
          }} />

          {/* CONTEÚDO HERO */}
          <div style={{
            position: "relative", flex: 1,
            display: "flex", alignItems: "center",
            maxWidth: "1152px", margin: "0 auto",
            padding: "7rem 1.5rem",
            width: "100%",
          }}>
            <div style={{ maxWidth: "620px" }}>

              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "999px",
                padding: "8px 16px",
                marginBottom: "28px",
              }}>
                <Shield size={14} color="rgba(255,255,255,0.7)" />
                <span style={{
                  fontSize: "11px", fontWeight: 700,
                  color: "rgba(255,255,255,0.75)",
                  textTransform: "uppercase", letterSpacing: "0.16em",
                }}>
                  Concurso GCM Manaus 2026 · Consulplan · 590 vagas
                </span>
              </div>

              {/* Título — tudo em style inline para garantir cor */}
              <h1 style={{
                fontSize: "clamp(2.3rem, 5.5vw, 3.8rem)",
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                marginBottom: "24px",
                textShadow: "0 2px 20px rgba(0,0,0,0.9)",
              }}>
                <span style={{ color: "#ffffff", display: "block" }}>Prepare-se para a</span>
                {/* "Guarda Municipal de Manaus" em amarelo-dourado — visível em qualquer fundo escuro */}
                <span style={{
                  color: "#FBBF24",
                  display: "block",
                  textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(251,191,36,0.2)",
                }}>
                  Guarda Municipal de Manaus
                </span>
                <span style={{ color: "#ffffff", display: "block" }}>com quem conhece o edital.</span>
              </h1>

              {/* Parágrafo */}
              <p style={{
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.85)",
                marginBottom: "32px",
                maxWidth: "540px",
                textShadow: "0 1px 12px rgba(0,0,0,0.95)",
              }}>
                Mais de{" "}
                <strong style={{ color: "#ffffff", fontWeight: 800 }}>500 questões comentadas</strong>,
                {" "}simulados cronometrados e ranking entre candidatos. Tudo baseado no edital oficial da Consulplan para a prova de{" "}
                <strong style={{ color: "#FBBF24", fontWeight: 800 }}>24 de maio de 2026</strong>.
              </p>

              {/* Badge preço promocional */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(251,191,36,0.15)",
                border: "1px solid rgba(251,191,36,0.4)",
                borderRadius: "999px", padding: "6px 16px",
                marginBottom: "16px",
              }}>
                <span style={{ fontSize: "12px", color: "#FBBF24", fontWeight: 700 }}>
                  🔥 Preço promocional — apenas nas primeiras semanas!
                </span>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
                <a href={CHECKOUT_URL} style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  height: "56px", padding: "0 32px",
                  background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "#ffffff", fontWeight: 800, fontSize: "1rem",
                  borderRadius: "12px", textDecoration: "none",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.55)",
                  whiteSpace: "nowrap",
                }}>
                  Quero meu acesso agora <ArrowRight size={18} />
                </a>
                <Link to="/login" style={{
                  display: "inline-flex", alignItems: "center",
                  height: "56px", padding: "0 28px",
                  border: "2px solid rgba(255,255,255,0.28)",
                  color: "#ffffff", fontWeight: 700, fontSize: "1rem",
                  borderRadius: "12px", background: "rgba(255,255,255,0.08)",
                  textDecoration: "none", whiteSpace: "nowrap",
                }}>
                  Já tenho acesso →
                </Link>
              </div>

              {/* Trust pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "✅ +500 questões do edital",
                  "⏱️ Simulado cronometrado",
                  "🏆 Ranking entre candidatos",
                  "📄 PDFs para estudar offline",
                  "📱 Funciona no celular",
                ].map(t => (
                  <span key={t} style={{
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "6px 14px",
                    fontSize: "12px", fontWeight: 600,
                    color: "rgba(255,255,255,0.92)",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CONTADOR — fundo sólido azul escuro */}
          <div style={{
            position: "relative",
            background: "#010c20",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "22px 24px",
          }}>
            <div style={{
              maxWidth: "1152px", margin: "0 auto",
              display: "flex", flexWrap: "wrap",
              alignItems: "center", justifyContent: "space-between", gap: "16px",
            }}>
              <div>
                <p style={{ color: "#ffffff", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                  ⚡ Tempo até a prova
                </p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", marginTop: "4px" }}>
                  24 de maio de 2026 · Manaus/AM
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                <CountBox valor={tempo.dias}     label="dias" />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "26px", fontWeight: 900, marginBottom: "26px" }}>:</span>
                <CountBox valor={tempo.horas}    label="horas" />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "26px", fontWeight: 900, marginBottom: "26px" }}>:</span>
                <CountBox valor={tempo.minutos}  label="min" />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "26px", fontWeight: 900, marginBottom: "26px" }}>:</span>
                <CountBox valor={tempo.segundos} label="seg" />
              </div>

              <a href={CHECKOUT_URL} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "11px 22px", borderRadius: "10px",
                background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                color: "#ffffff", fontWeight: 700, fontSize: "13px",
                textDecoration: "none",
              }}>
                Garantir acesso agora →
              </a>
            </div>
          </div>
        </section>

        {/* ══ NÚMEROS DA PROVA ══ */}
        <section className="bg-card/60 border-b border-border/50 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
              {[
                { v: "590",     l: "vagas",        s: "maior concurso da GMM" },
                { v: "60q",     l: "na prova",      s: "questões objetivas" },
                { v: "100pts",  l: "nota máxima",   s: "prova ponderada" },
                { v: "60pts",   l: "nota de corte", s: "mínimo para passar" },
                { v: "R$3.060", l: "salário base",  s: "+ benefícios" },
              ].map(item => (
                <div key={item.l}>
                  <p className="text-2xl sm:text-3xl font-black text-primary font-display">{item.v}</p>
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide mt-1">{item.l}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FOTO GUARDAS + TEXTO ══ */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img src={IMG_MEIO} alt="Guardas Municipais de Manaus"
                  className="w-full h-72 sm:h-[420px] object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#010a1e]/90 via-[#010a1e]/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 bg-black/65 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1E3A8A, #2563EB)" }}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Guarda Municipal de Manaus</p>
                      <p className="text-white/60 text-xs mt-0.5">590 vagas · Edital 2026 · Consulplan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Por que o GuardaQuest?</p>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground leading-tight mb-5">
                  Estudar muito não é o mesmo que estudar certo.
                </h2>
                <p className="text-muted-foreground text-sm leading-7 mb-5">
                  A maioria dos candidatos perde tempo com apostila genérica que não tem nada a ver com a Consulplan. O GuardaQuest é diferente: cada questão foi elaborada no estilo exato da banca, cobrindo as 9 matérias do edital na proporção certa.
                </p>
                <p className="text-muted-foreground text-sm leading-7 mb-8">
                  Com mais de <strong className="text-foreground">500 questões comentadas</strong>, você entende o porquê de cada resposta. Com os simulados cronometrados, treina a resistência para não travar na hora H.
                </p>
                <div className="space-y-3">
                  {[
                    "Questões no estilo da Consulplan, banca responsável pela prova",
                    "Cada questão tem comentário, fundamento legal e dica de prova",
                    "Simulado com nota ponderada — sabe se você passaria hoje",
                    "PDFs por matéria com gabarito para estudar offline e imprimir",
                    "Estude por matéria e veja o peso real de cada uma no edital",
                    "Sessão salva automaticamente — continue de onde parou",
                  ].map(t => (
                    <div key={t} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground leading-6">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MATÉRIAS ══ */}
        <section className="border-y border-border/50 bg-card/50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Edital oficial · Consulplan 2026</p>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">9 matérias. Saiba onde focar.</h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                <strong className="text-foreground">Legislação Específica vale 30 pontos</strong> — o dobro das outras. Comece por ela.
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {materias.map((m) => (
                <div key={m.nome} className="premium-card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
                  <div className="w-1.5 h-12 rounded-full shrink-0" style={{ backgroundColor: m.cor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{m.nome}</p>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(m.pts / 30) * 100}%`, backgroundColor: m.cor }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold" style={{ color: m.cor }}>{m.q}q</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{m.pts}pts</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/15 text-center">
              <p className="text-xs text-muted-foreground">
                🎯 <strong className="text-foreground">Total:</strong> 60 questões · 100 pontos · Nota mínima 60pts
              </p>
            </div>
          </div>
        </section>

        {/* ══ VIATURA + COMPARATIVO ══ */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">A diferença na prática</p>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground leading-tight mb-8">
                  Quem estuda com a ferramenta certa chega na frente.
                </h2>
                <div className="space-y-2.5">
                  {[
                    { sem: "Questões genéricas fora do estilo Consulplan",    com: "+500 questões no estilo exato da banca" },
                    { sem: "Não sabe o peso de cada matéria",                 com: "Peso de cada matéria sempre visível" },
                    { sem: "Sem simulado com o tempo real da prova",          com: "Simulado: 60 questões · 4 horas" },
                    { sem: "Sem nota ponderada para medir aprovação",         com: "Nota real calculada por matéria" },
                    { sem: "Sem saber onde está errando mais",                com: "Análise detalhada de cada erro" },
                    { sem: "Sem referência dos outros candidatos",            com: "Ranking para saber sua posição" },
                    { sem: "Sem material para estudar offline",               com: "PDFs por matéria com gabarito comentado" },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-3 flex items-start gap-2">
                        <span className="text-destructive text-xs mt-0.5 shrink-0 font-bold">✕</span>
                        <p className="text-xs text-muted-foreground leading-5">{item.sem}</p>
                      </div>
                      <div className="rounded-xl bg-success/5 border border-success/20 p-3 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                        <p className="text-xs text-foreground font-medium leading-5">{item.com}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2 group">
                <img src={IMG_VIATURA} alt="Viatura da Guarda Municipal de Manaus"
                  className="w-full h-72 sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#010a1e]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
                  {[{ v: "+500", l: "questões" }, { v: "9", l: "matérias" }, { v: "590", l: "vagas" }].map(s => (
                    <div key={s.l} className="bg-black/60 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center">
                      <p className="text-white font-black text-lg leading-none">{s.v}</p>
                      <p className="text-white/60 text-[10px] font-semibold mt-1 uppercase">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ RANKING ══ */}
        <section className="border-y border-border/50 bg-card/50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Exclusivo da plataforma</p>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground leading-tight mb-5">
                  Veja onde você está em relação aos outros candidatos.
                </h2>
                <p className="text-sm leading-7 text-muted-foreground mb-6">
                  O ranking é opcional e respeita sua privacidade. Você escolhe um apelido, habilita e começa a subir conforme seus simulados evoluem.
                </p>
                <ul className="space-y-3">
                  {[
                    "Participação 100% opcional — você decide",
                    "Apelido de sua escolha para preservar identidade",
                    "Pontuado pelas 5 melhores notas dos simulados",
                    "Ranking semanal reseta toda segunda-feira",
                    "Títulos: do 🪖 Recruta ao 👑 Comandante",
                  ].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="premium-card p-5 rounded-2xl shadow-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" /> Ranking Geral
                  </p>
                  <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-bold border border-success/20">● Ao vivo</span>
                </div>
                <div className="space-y-2">
                  {[
                    { pos: 1, nome: "GuardaConcurseiro", pts: 476, nota: "95%", titulo: "👑 Comandante", cor: "#3B82F6" },
                    { pos: 2, nome: "AnaGCM2026",        pts: 452, nota: "90%", titulo: "💎 Capitão",    cor: "#10B981" },
                    { pos: 3, nome: "ManauaraForte",     pts: 431, nota: "86%", titulo: "🔴 Tenente",    cor: "#EF4444" },
                    { pos: 4, nome: "você?",             pts: "—", nota: "—",   titulo: "🪖 Recruta",   cor: "#6B7280" },
                  ].map((r) => (
                    <div key={r.pos} className={`flex items-center gap-3 p-3 rounded-xl ${r.pos === 4 ? "border-2 border-dashed border-primary/40 bg-primary/5" : "bg-muted/50"}`}>
                      <div className="w-6 text-center shrink-0">
                        {r.pos === 1 && <Medal className="w-4 h-4 text-yellow-500 mx-auto" />}
                        {r.pos === 2 && <Medal className="w-4 h-4 text-gray-400 mx-auto" />}
                        {r.pos === 3 && <Medal className="w-4 h-4 text-amber-600 mx-auto" />}
                        {r.pos === 4 && <span className="text-xs font-bold text-muted-foreground">4</span>}
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: r.cor }}>
                        {r.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${r.pos === 4 ? "text-primary" : "text-foreground"}`}>{r.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{r.titulo}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-foreground">{r.nota}</p>
                        <p className="text-[10px] text-muted-foreground">{r.pts} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">Faça simulados para entrar no ranking 🏆</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA / PREÇO ══ */}
        <section id="checkout" className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Acesso imediato</p>
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-sm font-bold text-yellow-400">🔥 Preço promocional — apenas nas primeiras semanas!</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-4 leading-tight">
              A prova é em{" "}
              <span style={{ background: "var(--gradient-hero)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                24 de maio de 2026.
              </span>
            </h2>
            <p className="text-muted-foreground text-base leading-7 mb-10 max-w-xl mx-auto">
              São 590 vagas e milhares de candidatos. Cada dia sem estudar com direção é vantagem entregue para outro.
            </p>
            <div className="premium-card p-6 sm:p-8 rounded-3xl max-w-sm mx-auto shadow-2xl border-2 border-primary/10 mb-8">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
              </div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 mb-3">
                <span className="text-xs font-bold text-yellow-500">🔥 Preço promocional — primeiras semanas!</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5 font-medium">Acesso completo por 60 dias até a prova</p>
              <div className="flex items-end justify-center gap-3 mb-6">
                <span className="text-lg font-bold text-muted-foreground line-through">R$ 47</span>
                <div>
                  <p className="text-[3rem] font-black text-foreground leading-none">R$ 29<span className="text-2xl">,90</span></p>
                  <p className="text-xs text-muted-foreground mt-1">pagamento único · sem mensalidade</p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-7 text-left">
                {[
                  "+500 questões comentadas do edital",
                  "Simulados cronometrados com nota real",
                  "Ranking entre candidatos (opcional)",
                  "PDFs por matéria para estudar offline",
                  "Acesso no celular e no computador",
                  "Novas questões até o dia da prova",
                ].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />{t}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                checkoutUrl={CHECKOUT_URL}
                size="lg"
                className="w-full h-14 text-base font-black rounded-xl"
                style={{ background: "var(--gradient-hero)", boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}
                eventData={{
                  content_name: "Pricing CTA",
                  content_category: "Hotmart Checkout",
                  value: 29.9,
                  currency: "BRL",
                }}
              >
                Quero meu acesso agora <ArrowRight className="h-5 w-5 ml-2" />
              </CheckoutButton>
              <div className="flex items-center justify-center gap-5 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Pagamento seguro</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Acesso imediato</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="border-t border-border/50 bg-card/30 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Dúvidas</p>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">Perguntas frequentes</h2>
            </div>
            <div className="premium-card rounded-2xl px-5 sm:px-8">
              {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ══ CTA FINAL COM FOTO ══ */}
        <section style={{ position: "relative", padding: "80px 24px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${IMG_HERO}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,3,12,0.96)" }} />
          <div style={{ position: "relative", maxWidth: "896px", margin: "0 auto", textAlign: "center" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "16px",
              background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 8px 32px rgba(37,99,235,0.4)",
            }}>
              <Shield size={28} color="#ffffff" />
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "12px" }}>
              590 vagas · Salário R$ 3.060 · 24 mai 2026
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#ffffff", marginBottom: "20px", lineHeight: 1.1, textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
              Não deixe para amanhã o estudo que pode te aprovar hoje.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.8, marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px" }}>
              Quem começa antes chega melhor preparado. Entre agora, faça o primeiro simulado e veja exatamente onde você está.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
              <a href={CHECKOUT_URL} style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                height: "56px", padding: "0 40px",
                background: "#ffffff", color: "#1D4ED8", fontWeight: 800, fontSize: "1rem",
                borderRadius: "12px", textDecoration: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}>
                Garantir acesso por R$ 29,90 <ArrowRight size={18} />
              </a>
              <Link to="/login" style={{
                display: "inline-flex", alignItems: "center",
                height: "56px", padding: "0 32px",
                border: "2px solid rgba(255,255,255,0.25)", color: "#ffffff", fontWeight: 700, fontSize: "1rem",
                borderRadius: "12px", background: "rgba(255,255,255,0.08)", textDecoration: "none",
              }}>
                Já tenho acesso →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">GuardaQuest</p>
              <p className="text-[10px] text-muted-foreground">Plataforma GCM Manaus 2026</p>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">© 2026 GuardaQuest · Manaus/AM · www.guardaquest.com.br</p>
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <Link to="/privacidade" className="hover:text-foreground transition-colors">Política de Privacidade</Link>
              <span>·</span>
              <Link to="/termos" className="hover:text-foreground transition-colors">Termos de Uso</Link>
              <span>·</span>
              <span>LGPD</span>
            </div>
          </div>
          <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs text-muted-foreground">
            <Link to="/login">Área do aluno →</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
