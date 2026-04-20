import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Trophy,
  User,
  FileText,
  PenLine,
  BarChart3,
  Download,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const primaryNavItems = [
  { to: "/inicio", icon: Home, label: "Início" },
  { to: "/questoes", icon: BookOpen, label: "Questões" },
  { to: "/simulados", icon: FileText, label: "Simulados" },
  { to: "/ranking", icon: Trophy, label: "Ranking" },
  { to: "/conta", icon: User, label: "Conta" },
];

const secondaryNavItems = [
  { to: "/redacao", icon: PenLine, label: "Redação" },
  { to: "/desempenho", icon: BarChart3, label: "Desempenho" },
  { to: "/materiais", icon: Download, label: "Materiais" },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreItems = useMemo(() => {
    if (!isAdmin) return secondaryNavItems;
    return [
      ...secondaryNavItems,
      { to: "/admin", icon: Shield, label: "Admin" },
    ];
  }, [isAdmin]);

  const isMoreActive = moreItems.some(({ to }) => location.pathname.startsWith(to));

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-bottom lg:hidden">
        <div className="max-w-lg mx-auto grid h-16 grid-cols-6 items-center px-1">
          {primaryNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label === "Ranking" ? (
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {!isActive && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400" />
                      )}
                    </div>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`h-full rounded-none px-1 py-2 text-[10px] font-medium ${
                  isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex flex-col items-center gap-0.5">
                  <MoreHorizontal className="h-5 w-5" />
                  <span>Mais</span>
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8">
              <SheetHeader>
                <SheetTitle>Mais opções</SheetTitle>
              </SheetHeader>

              <div className="mt-6 grid gap-2">
                {moreItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};
