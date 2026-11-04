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
 * Authentic Industrial Autonomous Robot Icon:
 * Features a modern robotic head chassis, precision dual-vision optical sensor array,
 * articulated base mount, and telemetry sensor nodes.
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
      {/* 1. AUTHENTIC INDUSTRIAL ROBOT ICON */}
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
            <linearGradient id={accentGradId} x1="12" y1="18" x2="32" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Container Badge */}
          <rect
            x="3"
            y="3"
            width="38"
            height="38"
            rx="10"
            fill={theme === "dark" ? "rgba(22, 199, 232, 0.08)" : "#EFF6FF"}
            stroke={`url(#${primaryGradId})`}
            strokeWidth="2"
          />

          {/* Robot Antenna / Sensor Node */}
          <path
            d="M22 6.5V11"
            stroke={primaryColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="22" cy="6.5" r="2" fill={secondaryColor} />

          {/* Robot Side Ears / Acoustic Sensor Pods */}
          <rect x="7" y="18" width="2.5" height="8" rx="1.25" fill={primaryColor} />
          <rect x="34.5" y="18" width="2.5" height="8" rx="1.25" fill={primaryColor} />

          {/* Robot Head Main Chassis */}
          <rect
            x="11"
            y="12"
            width="22"
            height="18"
            rx="5"
            fill={theme === "dark" ? "#0F172A" : "#FFFFFF"}
            stroke={`url(#${primaryGradId})`}
            strokeWidth="2"
          />

          {/* High-Tech Optical Sensor Visor */}
          <rect
            x="13.5"
            y="16.5"
            width="17"
            height="8"
            rx="3"
            fill={`url(#${accentGradId})`}
          />

          {/* Dual Robot Camera Optics / Vision Lenses */}
          <circle cx="17.5" cy="20.5" r="2" fill="#FFFFFF" />
          <circle cx="26.5" cy="20.5" r="2" fill="#FFFFFF" />
          <circle cx="18" cy="20" r="0.8" fill={primaryColor} />
          <circle cx="27" cy="20" r="0.8" fill={primaryColor} />

          {/* Robot Chin / Articulated Neck Joint */}
          <path
            d="M17 33H27"
            stroke={primaryColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M19 30V33M25 30V33"
            stroke={primaryColor}
            strokeWidth="2"
          />
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
