/**
 * IndusBotRobot — Animated SVG Robot Character for INDUS Guide
 *
 * Pure CSS + SVG animated robot. No external libraries.
 * Colors: navy #101B2D, cyan #16C7E8, blue #2388FF
 * Respects prefers-reduced-motion.
 *
 * Props:
 *   state: "idle" | "thinking" | "speaking" | "welcome"
 *   size?: number (width in px, default 80; height auto from viewBox)
 */

import React from "react";

export type RobotState = "idle" | "thinking" | "speaking" | "welcome";

interface IndusBotRobotProps {
  state?: RobotState;
  size?: number;
}

export function IndusBotRobot({ state = "idle", size = 80 }: IndusBotRobotProps) {
  // Unique ID prefix to avoid CSS collision when rendered multiple times
  const uid = React.useId().replace(/:/g, "");

  const styleId = `indusbot-styles-${uid}`;

  const css = `
    @media (prefers-reduced-motion: no-preference) {
      .ibr-body-${uid} {
        animation: ibr-float-${uid} 3s ease-in-out infinite;
      }
      .ibr-head-${uid}[data-state="thinking"] {
        animation: ibr-tilt-${uid} 0.8s ease-in-out alternate infinite;
      }
      .ibr-antenna-${uid}[data-state="speaking"] {
        animation: ibr-pulse-${uid} 0.4s ease-in-out alternate infinite;
        transform-origin: 50% 100%;
      }
      .ibr-eye-${uid}[data-state="speaking"] {
        filter: drop-shadow(0 0 4px #16C7E8);
      }
      .ibr-arm-right-${uid}[data-state="welcome"] {
        animation: ibr-wave-${uid} 0.6s ease-in-out alternate infinite;
        transform-origin: 20% 10%;
      }
    }

    @keyframes ibr-float-${uid} {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-4px); }
    }
    @keyframes ibr-tilt-${uid} {
      from { transform: rotate(0deg); }
      to   { transform: rotate(5deg); }
    }
    @keyframes ibr-pulse-${uid} {
      from { transform: scale(1); }
      to   { transform: scale(1.2); }
    }
    @keyframes ibr-wave-${uid} {
      from { transform: rotate(-10deg); }
      to   { transform: rotate(20deg); }
    }
  `;

  return (
    <>
      <style id={styleId} dangerouslySetInnerHTML={{ __html: css }} />
      {/*
       * ViewBox: 0 0 80 100
       * Robot layout (top-down):
       *   Antenna tip:   (40, 2)
       *   Head:          (20, 14) 40×30
       *   Torso:         (14, 46) 52×34
       *   Left arm:      (2,  50) 12×22
       *   Right arm:     (66, 50) 12×22
       *   Legs:          (22, 82) & (44, 82)  each 12×18
       */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 100"
        width={size}
        height={size * 1.25}
        aria-label="INDUS Guide robot character"
        role="img"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* ── Defs: gradients & glow ── */}
        <defs>
          <linearGradient id={`torso-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2B45" />
            <stop offset="100%" stopColor="#101B2D" />
          </linearGradient>
          <linearGradient id={`head-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F3255" />
            <stop offset="100%" stopColor="#101B2D" />
          </linearGradient>
          <radialGradient id={`eye-grad-${uid}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#9AEEF8" />
            <stop offset="100%" stopColor="#16C7E8" />
          </radialGradient>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Floating body group (idle animation) ── */}
        <g className={`ibr-body-${uid}`}>

          {/* ── ANTENNA ── */}
          <g className={`ibr-antenna-${uid}`} data-state={state}>
            {/* Antenna stem */}
            <rect x="38" y="4" width="4" height="12" rx="2" fill="#2388FF" />
            {/* Antenna ball */}
            <circle cx="40" cy="3" r="3.5" fill="#16C7E8" filter={`url(#glow-${uid})`} />
            {/* Inner antenna ball highlight */}
            <circle cx="39.2" cy="2.2" r="1.2" fill="#CFFAFE" opacity="0.8" />
          </g>

          {/* ── HEAD ── */}
          <g className={`ibr-head-${uid}`} data-state={state}>
            {/* Head base rounded rect */}
            <rect
              x="18" y="14" width="44" height="32"
              rx="9" ry="9"
              fill={`url(#head-grad-${uid})`}
              stroke="#2388FF" strokeWidth="1.2"
            />
            {/* Ear left */}
            <rect x="11" y="22" width="8" height="14" rx="3" fill="#101B2D" stroke="#16C7E8" strokeWidth="1" />
            {/* Ear right */}
            <rect x="61" y="22" width="8" height="14" rx="3" fill="#101B2D" stroke="#16C7E8" strokeWidth="1" />

            {/* Left Eye */}
            <ellipse
              cx="30" cy="30" rx="6.5" ry="5.5"
              fill={`url(#eye-grad-${uid})`}
              filter={`url(#glow-${uid})`}
              className={`ibr-eye-${uid}`}
              data-state={state}
            />
            <ellipse cx="28.5" cy="28.5" rx="2" ry="1.6" fill="#CFFAFE" opacity="0.7" />

            {/* Right Eye */}
            <ellipse
              cx="50" cy="30" rx="6.5" ry="5.5"
              fill={`url(#eye-grad-${uid})`}
              filter={`url(#glow-${uid})`}
              className={`ibr-eye-${uid}`}
              data-state={state}
            />
            <ellipse cx="48.5" cy="28.5" rx="2" ry="1.6" fill="#CFFAFE" opacity="0.7" />

            {/* Mouth — small rect bar */}
            <rect x="30" y="38" width="20" height="4" rx="2" fill="#2388FF" opacity="0.8" />
            {/* Mouth highlight segments */}
            <rect x="32" y="39" width="4" height="2" rx="1" fill="#16C7E8" opacity="0.7" />
            <rect x="38" y="39" width="4" height="2" rx="1" fill="#16C7E8" opacity="0.7" />
            <rect x="44" y="39" width="4" height="2" rx="1" fill="#16C7E8" opacity="0.7" />
          </g>

          {/* ── TORSO ── */}
          <rect
            x="14" y="48" width="52" height="34"
            rx="7" ry="7"
            fill={`url(#torso-grad-${uid})`}
            stroke="#2388FF" strokeWidth="1.2"
          />
          {/* Chest panel */}
          <rect x="22" y="54" width="36" height="22" rx="4" fill="#0D1829" stroke="#16C7E8" strokeWidth="0.8" />
          {/* Status LED row */}
          <circle cx="30" cy="62" r="3" fill="#16C7E8" filter={`url(#glow-${uid})`} opacity="0.9" />
          <circle cx="40" cy="62" r="3" fill="#2388FF" opacity="0.7" />
          <circle cx="50" cy="62" r="3" fill="#16C7E8" opacity="0.5" />
          {/* Center bar */}
          <rect x="26" y="68" width="28" height="3" rx="1.5" fill="#2388FF" opacity="0.6" />

          {/* ── LEFT ARM ── */}
          <rect x="2" y="50" width="12" height="22" rx="5" fill="#101B2D" stroke="#2388FF" strokeWidth="1" />
          {/* Left hand */}
          <rect x="3" y="71" width="10" height="8" rx="4" fill="#16C7E8" opacity="0.7" />

          {/* ── RIGHT ARM (waving on welcome) ── */}
          <g className={`ibr-arm-right-${uid}`} data-state={state}>
            <rect x="66" y="50" width="12" height="22" rx="5" fill="#101B2D" stroke="#2388FF" strokeWidth="1" />
            {/* Right hand */}
            <rect x="67" y="71" width="10" height="8" rx="4" fill="#16C7E8" opacity="0.7" />
          </g>

          {/* ── LEFT LEG ── */}
          <rect x="22" y="82" width="14" height="16" rx="5" fill="#101B2D" stroke="#2388FF" strokeWidth="1" />
          {/* Left foot */}
          <rect x="20" y="96" width="16" height="6" rx="3" fill="#16C7E8" opacity="0.6" />

          {/* ── RIGHT LEG ── */}
          <rect x="44" y="82" width="14" height="16" rx="5" fill="#101B2D" stroke="#2388FF" strokeWidth="1" />
          {/* Right foot */}
          <rect x="42" y="96" width="16" height="6" rx="3" fill="#16C7E8" opacity="0.6" />

        </g>
      </svg>
    </>
  );
}
