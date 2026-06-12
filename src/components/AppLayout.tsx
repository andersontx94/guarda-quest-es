import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { ConcursoSelector } from "./ConcursoSelector";

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background">
      {!isAdmin && <DesktopSidebar />}
      <div className={!isAdmin ? "lg:ml-64" : ""}>
        {!isAdmin && (
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-2 px-4 h-14 border-b border-border bg-background/95 backdrop-blur">
            <ConcursoSelector variant="compact" />
          </div>
        )}
        <Outlet />
      </div>
      {!isAdmin && <BottomNav />}
    </div>
  );
};
