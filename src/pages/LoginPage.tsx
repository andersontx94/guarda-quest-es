import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      const msg = error.message || "";
      if (msg.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos.");
      } else if (msg.includes("Email not confirmed")) {
        toast.error("Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.");
      } else if (msg.includes("banned")) {
        toast.error("Seu acesso foi revogado. Entre em contato com o suporte.");
      } else {
        toast.error(msg || "Erro inesperado. Tente novamente.");
      }
    } else {
      navigate("/inicio");
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">GuardaQuest</h1>
            <p className="text-sm text-muted-foreground mt-1">GCM Manaus 2026</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/esqueci-senha" className="text-xs text-primary hover:underline font-medium">
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 pr-10"
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

          <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Link to="/cadastro" className="text-sm text-primary hover:underline font-medium block">
            Não tem conta? Comprar acesso →
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground block">
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;