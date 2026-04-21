import React from "react";

interface LandingSectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}

export const LandingSectionHeading: React.FC<LandingSectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
}) => {
  const alignment = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  return (
    <div className={alignment}>
      <span className="badge-pre-edital">{eyebrow}</span>
      <h2 className="font-display mt-4 text-[1.9rem] font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{description}</p>
    </div>
  );
};
