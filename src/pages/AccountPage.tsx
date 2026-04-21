import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, LogOut, Shield, Calendar, Mail, LockKeyhole, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AccountPage: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Não foi possível validar sua conta agora.");
      return;
    }

    if (!currentPassword) {
      toast.error("Informe sua senha atual.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("A senha atual está incorreta.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

      if (updateError) {
        toast.error(updateError.message || "Não foi possível alterar sua senha.");
        return;
      }

      toast.success("Senha alterada com sucesso.");
      resetPasswordForm();
      setShowPasswordForm(false);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="page-container animate-slide-up">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5" /> Minha Conta
        </h1>
      </div>

      <div className="space-y-4">
        {/* Profile card */}
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{profile?.name || "—"}</p>
              <p className="text-xs text-muted-foreground">Acesso completo</p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Membro desde</p>
                <p className="text-sm text-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <LockKeyhole className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Segurança</p>
                <p className="text-xs text-muted-foreground">Atualize sua senha de acesso quando precisar</p>
              </div>
            </div>

            {!showPasswordForm && (
              <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(true)}>
                Alterar senha
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4 mt-4 border-t border-border">
              <div className="space-y-1.5">
                <Label htmlFor="current-password">Senha atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="h-11"
                  autoComplete="current-password"
                  disabled={updatingPassword}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-11"
                  autoComplete="new-password"
                  disabled={updatingPassword}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="h-11"
                  autoComplete="new-password"
                  disabled={updatingPassword}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="flex-1 h-11" disabled={updatingPassword}>
                  {updatingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar nova senha"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  disabled={updatingPassword}
                  onClick={() => {
                    resetPasswordForm();
                    setShowPasswordForm(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>

        {isAdmin && (
          <Link to="/admin">
            <Button variant="outline" className="w-full justify-start gap-2 h-11">
              <Shield className="w-4 h-4" />
              Painel Administrativo
            </Button>
          </Link>
        )}

        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11 text-destructive hover:text-destructive hover:bg-destructive/5"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
};

export default AccountPage;
