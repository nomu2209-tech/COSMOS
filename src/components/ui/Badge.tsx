import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "amber" | "neutral" | "purple" | "pink" | "accent";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => {
  const variantStyles: Record<string, string> = {
    accent: "bg-orange-950/50 text-orange-400 border-orange-800/60",
    blue: "bg-sky-950/40 text-sky-300 border-sky-800/50",
    green: "bg-emerald-950/40 text-emerald-300 border-emerald-800/50",
    amber: "bg-amber-950/40 text-amber-300 border-amber-800/50",
    neutral: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
    purple: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
    pink: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
  };

  const selectedStyle = variantStyles[variant] || variantStyles.neutral;
  const sizeStyles = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center font-medium tracking-normal rounded-md border ${selectedStyle} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
