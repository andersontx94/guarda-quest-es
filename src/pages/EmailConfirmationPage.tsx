import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Shield, MailCheck } from "lucide-react";
import { toast } from "sonner";

const EmailConfirmationPage: React.FC = () => {
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("E-mail não identificado. Faça o cadastro novamente.");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) {
      toast.error("Não foi possível reenviar. Tente novamente em alguns minutos.");
    } else {
      toast.success("E-mail de confirmação reenviado!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MailCheck className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Verifique seu e-mail</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enviamos um link de confirmação para{" "}
            {email ? <span className="font-medium text-foreground">{email}</span> : "seu e-mail"}.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Clique no link recebido para ativar sua conta e começar a estudar.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full h-11" onClick={handleResend} disabled={resending}>
            {resending ? "Reenviando..." : "Reenviar e-mail de confirmação"}
          </Button>
          <Link to="/login">
            <Button variant="ghost" className="w-full h-11">
              Voltar para o login
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Verifique também a pasta de spam ou lixo eletrônico.
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
