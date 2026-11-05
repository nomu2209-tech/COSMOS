import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "blue" | "pink" | "none";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  hoverEffect = true,
  glow = "none",
  children,
  className = "",
  ...props
}) => {
  const hoverClass = hoverEffect ? "glass-card-hover" : "";

  return (
    <div
      className={`glass-card p-6 relative overflow-hidden ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
