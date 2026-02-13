"use client";

import { cn } from "@/lib/utils";

const sizeMap = { sm: { h: 24, f: 14, g: 6 }, md: { h: 32, f: 18, g: 8 }, lg: { h: 40, f: 24, g: 10 }, xl: { h: 48, f: 28, g: 12 } };

function LogoIcon({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const s = sizeMap[size].h;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <radialGradient id="mic-head" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E40AF" />
        </radialGradient>
        <linearGradient id="mic-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="mic-stand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {/* Microphone head (rounded top) */}
      <ellipse cx="32" cy="18" rx="12" ry="14" fill="url(#mic-head)" />
      {/* Mesh lines on head */}
      <line x1="24" y1="14" x2="40" y2="14" stroke="#93C5FD" strokeWidth="0.7" opacity="0.5" />
      <line x1="22" y1="18" x2="42" y2="18" stroke="#93C5FD" strokeWidth="0.7" opacity="0.5" />
      <line x1="24" y1="22" x2="40" y2="22" stroke="#93C5FD" strokeWidth="0.7" opacity="0.5" />
      {/* Body (rectangle connecting head to stand) */}
      <rect x="26" y="30" width="12" height="10" rx="2" fill="url(#mic-body)" />
      {/* Stand pole */}
      <rect x="30" y="40" width="4" height="12" rx="1" fill="url(#mic-stand)" />
      {/* Base */}
      <ellipse cx="32" cy="54" rx="10" ry="3" fill="url(#mic-stand)" />
      {/* Highlight/shine on head */}
      <ellipse cx="28" cy="14" rx="3" ry="5" fill="white" opacity="0.15" />
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
