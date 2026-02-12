"use client";

import { cn } from "@/lib/utils";

const sizeMap = { sm: { h: 24, f: 14, g: 6 }, md: { h: 32, f: 18, g: 8 }, lg: { h: 40, f: 24, g: 10 }, xl: { h: 48, f: 28, g: 12 } };

function LogoIcon({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const s = sizeMap[size].h;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
      <g transform="translate(8, 8)">
        <path d="M4 40C4 40 10 4 18 4C24 4 24 24 30 24C36 24 36 4 44 4" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M4 24C10 24 16 14 24 14C32 14 38 34 44 34" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M4 4C10 44 16 44 24 44C32 44 38 4 44 44" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function Logo({ size = "md", showWordmark = true, variant = "auto", className, interactive = false }: {
  size?: "sm" | "md" | "lg" | "xl"; showWordmark?: boolean; variant?: "light" | "dark" | "auto"; className?: string; interactive?: boolean;
}) {
  const { f, g, h } = sizeMap[size];
  return (
    <div className={cn("flex items-center", interactive && "transition-transform duration-200 hover:scale-105 cursor-pointer", className)} style={{ gap: g }}>
      <LogoIcon size={size} />
      {showWordmark && (
        <span className={cn("font-bold tracking-tight", variant === "dark" ? "text-slate-50" : variant === "light" ? "text-slate-900" : "text-foreground", size === "sm" && "hidden sm:inline")} style={{ fontSize: f, lineHeight: `${h}px`, letterSpacing: "-0.02em" }}>
          NewsFlow
        </span>
      )}
    </div>
  );
}

export { LogoIcon };
