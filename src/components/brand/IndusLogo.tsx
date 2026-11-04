import React, { useId } from "react";

export interface IndusLogoProps {
  /** Variant of the logo */
  variant?: "full" | "icon" | "stacked";
  /** Color theme */
  theme?: "light" | "dark" | "adaptive";
  /** Size scale */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional custom className */
  className?: string;
  /** Whether to show the sub-brand tagline in full variant */
  showTagline?: boolean;
}

/**
 * INDUS Industrial Robotics — Unified Brand Identity System
 *
 * Geometric Engineering Robotics Mark:
 * High-precision cycloidal motion nexus composed of mathematical interlocking
 * kinetic arcs representing zero-backlash motion, planetary reduction, and synchronized kinematics.
 */
export function IndusLogo({
  variant = "full",
  theme = "adaptive",
  size = "md",
  className = "",
  showTagline = true,
}: IndusLogoProps) {
  const uniqueId = useId().replace(/:/g, "");

  // Size metrics
  const iconSizes = {
    sm: "size-7",
    md: "size-9",
    lg: "size-11",
    xl: "size-14",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight",
  };

  const taglineSizes = {
    sm: "text-[8px] tracking-[.18em]",
    md: "text-[9.5px] tracking-[.18em]",
    lg: "text-[11px] tracking-[.20em]",
    xl: "text-xs tracking-[.22em]",
  };

  // Theme colors
  const primaryColor = theme === "dark" ? "#16C7E8" : "#155EEF";
  const secondaryColor = theme === "dark" ? "#38BDF8" : "#0284C7";
  const textColor =
    theme === "dark"
      ? "text-white"
      : theme === "light"
      ? "text-[#0F172A]"
      : "text-slate-900 dark:text-white";
  const tagColor =
    theme === "dark"
      ? "text-slate-400"
      : theme === "light"
      ? "text-[#475467]"
      : "text-slate-500 dark:text-slate-400";

  const primaryGradId = `indusGradPrimary-${uniqueId}`;
  const accentGradId = `indusGradAccent-${uniqueId}`;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 1. GEOMETRIC ENGINEERING ROBOTICS SYMBOL */}
      <div
        className={`relative shrink-0 grid place-items-center ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id={primaryGradId} x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
            <linearGradient id={accentGradId} x1="40" y1="4" x2="4" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#16C7E8" />
              <stop offset="100%" stopColor="#155EEF" />
            </linearGradient>
          </defs>

          {/* Outer Precision Geodetic Hex-Ring */}
          <rect
            x="4"
            y="4"
            width="36"
            height="36"
            rx="9"
            fill={theme === "dark" ? "rgba(22, 199, 232, 0.08)" : "#EFF6FF"}
            stroke={`url(#${primaryGradId})`}
            strokeWidth="2.2"
          />

          {/* Precision Kinematic Gear / Rotor Lobes */}
          <path
            d="M22 10V14M22 30V34M10 22H14M30 22H34"
            stroke={`url(#${primaryGradId})`}
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Cycloidal / Planetary Motion Nexus Triangle */}
          <path
            d="M22 14L31 30H13L22 14Z"
            stroke={`url(#${accentGradId})`}
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill={theme === "dark" ? "rgba(56, 189, 248, 0.15)" : "rgba(21, 94, 239, 0.08)"}
          />

          {/* Central High-Tolerance Axis Center */}
          <circle cx="22" cy="23.5" r="3.2" fill={primaryColor} />
          <circle cx="22" cy="23.5" r="1.2" fill="#FFFFFF" />

          {/* Active Motion Pulse Dot */}
          <circle cx="33" cy="11" r="2.2" fill="#16C7E8" />
        </svg>
      </div>

      {/* 2. TYPOGRAPHY (When not icon-only) */}
      {variant !== "icon" && (
        <div className={`flex flex-col leading-none ${variant === "stacked" ? "items-center text-center" : ""}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-black uppercase text-foreground ${textSizes[size]} ${textColor}`}>
              INDUS
            </span>
            <span className="hidden sm:inline-block rounded-xs bg-signal/15 px-1 py-0.2 text-[8px] font-mono font-bold uppercase tracking-wider text-signal border border-signal/30">
              ROBOTICS
            </span>
          </div>
          {showTagline && (
            <span className={`font-mono font-bold uppercase ${taglineSizes[size]} ${tagColor} mt-1`}>
              Precision Motion & Automation
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const INDUSLogo = IndusLogo;
export default IndusLogo;
