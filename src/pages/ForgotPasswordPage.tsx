import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    setSent(true);
    toast.success("Se o e-mail existir, enviamos um link de redefinição.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Esqueci minha senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {sent ? "Verifique seu e-mail" : "Informe seu e-mail para redefinir"}
            </p>
          </div>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Se o endereço <span className="font-medium text-foreground">{email}</span> estiver cadastrado, enviamos um link para redefinição de senha.
            </p>
            <p className="text-xs text-muted-foreground">
              Verifique também a pasta de spam ou lixo eletrônico.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full h-11 mt-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" required />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
            <Link to="/login" className="block text-center">
              <Button variant="ghost" type="button" className="w-full h-11">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o login
              </Button>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
