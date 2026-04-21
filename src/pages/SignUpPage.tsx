import React from "react";
import { Link } from "react-router-dom";
import { Shield, ShoppingCart, Lock, ArrowRight } from "lucide-react";
import CheckoutButton from "@/components/checkout/CheckoutButton";

const CHECKOUT_URL = "https://pay.hotmart.com/P105084825B";

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Acesso ao GuardaQuest</h1>
            <p className="text-sm text-muted-foreground mt-1">GCM Manaus 2026</p>
          </div>
        </div>

        <div className="premium-card p-6 space-y-5">
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                O acesso é liberado após a compra
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Após confirmar seu pagamento na Hotmart, você receberá um e-mail automático no{" "}
                <strong className="text-foreground">mesmo endereço usado na compra</strong>{" "}
                com um link para criar sua senha.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-medium">como funciona</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            {[
              { n: "1", txt: "Compre o acesso na Hotmart pelo botão abaixo" },
              { n: "2", txt: "Receba o e-mail no endereço usado no pagamento" },
              { n: "3", txt: "Clique no link e crie sua senha de acesso" },
              { n: "4", txt: "Entre na plataforma e estude por 60 dias até a prova!" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {step.n}
                </div>
                <p className="text-sm text-foreground leading-5">{step.txt}</p>
              </div>
            ))}
          </div>

          <CheckoutButton
            checkoutUrl={CHECKOUT_URL}
            newTab
            className="w-full h-12 text-base font-bold gap-2 rounded-xl"
            style={{ background: "var(--gradient-hero)" }}
            eventData={{
              content_name: "Cadastro GuardaQuest",
              content_category: "Hotmart Checkout",
              value: 29.9,
              currency: "BRL",
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            Comprar acesso - R$ 29,90
            <ArrowRight className="w-4 h-4" />
          </CheckoutButton>

          <p className="text-center text-xs text-muted-foreground">
            Pagamento seguro via Hotmart · Acesso imediato · Válido por 60 dias
          </p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Já comprou e recebeu o e-mail?</p>
          <Link to="/login" className="text-sm text-primary hover:underline font-semibold">
            Entrar na minha conta →
          </Link>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
