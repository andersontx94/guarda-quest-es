import React from "react";
import { LucideIcon } from "lucide-react";

interface LandingFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const LandingFeatureCard: React.FC<LandingFeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="premium-card h-full rounded-[1.75rem] border-white/70 bg-card/95 p-5 backdrop-blur sm:p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-bold leading-6 text-foreground">{title}</h3>
      <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
};
