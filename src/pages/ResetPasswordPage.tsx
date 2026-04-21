import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setValid(true);
        setUserEmail(session?.user?.email ?? null);
        setVerifying(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const hash = window.location.hash;
      if (hash.includes("type=recovery") || session) {
        setValid(true);
        setUserEmail(session?.user?.email ?? null);
      }
      setVerifying(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Erro ao definir senha. Tente novamente.");
    } else {
      setDone(true);
    }
  };

  // Carregando
  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4 text-sm">Verificando seu acesso...</p>
      </div>
    );
  }

  // Link inválido
  if (!valid) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Link inválido ou expirado</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Este link de acesso expirou ou já foi usado. Se você comprou o GuardaQuest,
            entre em contato com o suporte.
          </p>
          <a
            href="mailto:suporte@guardaquest.com.br"
            className="block"
          >
            <Button variant="outline" className="w-full h-11">
              Falar com suporte
            </Button>
          </a>
          <Button onClick={() => navigate("/login")} className="w-full h-11">
            Ir para o login
          </Button>
        </div>
      </div>
    );
  }

  // Senha criada com sucesso
  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tudo pronto! 🎉</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Sua senha foi criada com sucesso. Agora é só entrar e começar a estudar para a GCM Manaus 2026!
            </p>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="w-full h-12 text-base font-bold rounded-xl"
            style={{ background: "var(--gradient-hero)" }}
          >
            Entrar na plataforma →
          </Button>
        </div>
      </div>
    );
  }

  // Formulário de criação de senha
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crie sua senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Bem-vindo ao GuardaQuest! 🎯
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="premium-card p-6 space-y-5">

          {/* Info do e-mail */}
          {userEmail && (
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
              <p className="text-xs text-muted-foreground mb-1 font-medium">Sua conta:</p>
              <p className="text-sm font-bold text-foreground">{userEmail}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Este é o e-mail que você usou na compra da Hotmart.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Crie sua senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl"
              style={{ background: "var(--gradient-hero)" }}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Criar senha e acessar →"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Problema com o acesso?{" "}
          <a href="mailto:suporte@guardaquest.com.br" className="text-primary hover:underline">
            suporte@guardaquest.com.br
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;