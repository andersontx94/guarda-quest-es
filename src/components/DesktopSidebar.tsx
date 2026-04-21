import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, FileText, BarChart3, User, Shield, PenLine, Trophy, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/inicio", icon: Home, label: "Início" },
  { to: "/questoes", icon: BookOpen, label: "Questões" },
  { to: "/simulados", icon: FileText, label: "Simulados" },
  { to: "/redacao", icon: PenLine, label: "Redação" },
  { to: "/desempenho", icon: BarChart3, label: "Desempenho" },
  { to: "/ranking", icon: Trophy, label: "Ranking" },
  { to: "/materiais", icon: Download, label: "Materiais" },
  { to: "/conta", icon: User, label: "Conta" },
];

export const DesktopSidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card min-h-screen fixed left-0 top-0 z-40">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-foreground leading-tight font-display">GM Manaus</h1>
            <p className="text-[10px] text-muted-foreground font-medium">Questões e simulados</p>
          </div>
        </div>
        <div className="mt-3">
          <span className="badge-pre-edital">Edital 2026</span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            <span>{label}</span>
            {label === "Ranking" && (
              <span className="ml-auto text-[10px] font-bold bg-yellow-400/20 text-yellow-600 px-1.5 py-0.5 rounded-full">
                TOP
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {isAdmin && (
        <div className="p-3 border-t border-border">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`
            }
          >
            <Shield className="w-[18px] h-[18px]" />
            <span>Admin</span>
          </NavLink>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center font-medium">© 2026 GM Manaus</p>
      </div>
    </aside>
  );
};