import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background">
      {!isAdmin && <DesktopSidebar />}
      <div className={!isAdmin ? "lg:ml-64" : ""}>
        <Outlet />
      </div>
      {!isAdmin && <BottomNav />}
    </div>
  );
};
