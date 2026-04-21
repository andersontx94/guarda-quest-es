import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton: React.FC = () => (
  <div className="stat-card space-y-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-8 w-16" />
  </div>
);

export const QuestionCardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-3 w-32" />
    <div className="stat-card space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="question-option">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="stat-card space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    ))}
  </div>
);
