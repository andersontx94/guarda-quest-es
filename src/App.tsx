import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import QuestionsPage from "./pages/QuestionsPage";
import PerformancePage from "./pages/PerformancePage";
import ErrorsPage from "./pages/ErrorsPage";
import FavoritesPage from "./pages/FavoritesPage";
import SimulationsPage from "./pages/SimulationsPage";
import EssayPage from "./pages/EssayPage";
import UpdatesPage from "./pages/UpdatesPage";
import AccountPage from "./pages/AccountPage";
import RankingPage from "./pages/RankingPage";
import MateriaisPage from "./pages/MateriaisPage";
import PrivacidadePage from "./pages/PrivacidadePage";
import TermosPage from "./pages/TermosPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminUpdates from "./pages/admin/AdminUpdates";
import NotFound from "./pages/NotFound";
import CookieBanner from "./components/CookieBanner";
import MetaPixelProvider from "@/components/analytics/MetaPixelProvider";

const queryClient = new QueryClient();

const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      if (hash.includes("type=recovery")) {
        navigate("/redefinir-senha" + hash, { replace: true });
      } else {
        navigate("/inicio", { replace: true });
      }
    }
  }, [navigate]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (user) return <Navigate to="/inicio" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MetaPixelProvider />
        <AuthProvider>
          <AuthRedirectHandler />
          <CookieBanner />
          <Routes>
            {/* Landing page — pública */}
            <Route path="/" element={<Index />} />

            {/* Páginas institucionais LGPD */}
            <Route path="/privacidade" element={<PrivacidadePage />} />
            <Route path="/termos" element={<TermosPage />} />

            {/* Rotas públicas */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/cadastro" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/confirmacao-enviada" element={<EmailConfirmationPage />} />
            <Route path="/esqueci-senha" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/inicio" element={<DashboardPage />} />
              <Route path="/questoes" element={<QuestionsPage />} />
              <Route path="/simulados" element={<SimulationsPage />} />
              <Route path="/redacao" element={<EssayPage />} />
              <Route path="/desempenho" element={<PerformancePage />} />
              <Route path="/erros" element={<ErrorsPage />} />
              <Route path="/favoritas" element={<FavoritesPage />} />
              <Route path="/atualizacoes" element={<UpdatesPage />} />
              <Route path="/conta" element={<AccountPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/materiais" element={<MateriaisPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="updates" element={<AdminUpdates />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
