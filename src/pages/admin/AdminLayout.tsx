import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, BookOpen, Layers, FileText, Bell, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { to: "/admin", icon: Home, label: "Dashboard", end: true },
  { to: "/admin/subjects", icon: Layers, label: "Matérias" },
  { to: "/admin/questions", icon: BookOpen, label: "Questões" },
  { to: "/admin/updates", icon: Bell, label: "Atualizações" },
];

const AdminLayout: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground gap-4">
      <Shield className="w-12 h-12" />
      <p className="text-lg font-medium">Acesso restrito</p>
      <Link to="/"><Button variant="outline">Voltar</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Admin</span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> App
            </Button>
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {adminLinks.map(({ to, icon: Icon, label, end }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                (end ? location.pathname === to : location.pathname.startsWith(to))
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
