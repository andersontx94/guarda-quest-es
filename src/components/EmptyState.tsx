import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, actionTo }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[260px]">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-4">
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
};
