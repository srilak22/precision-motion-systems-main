import type { Variants, Transition } from "motion/react";

/**
 * INDUS Precision Motion Design System - Motion Tokens & Easing Curves
 * Engineered for deterministic, responsive, high-precision industrial UI.
 */

export const INDUSTRIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SMOOTH_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
export const ACCELERATE_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

export const SPRING_PRECISE: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

export const SPRING_TACTILE: Transition = {
  type: "spring",
  stiffness: 450,
  damping: 24,
};

export const DEFAULT_TRANSITION: Transition = {
  duration: 0.6,
  ease: INDUSTRIAL_EASE,
};

export const FAST_TRANSITION: Transition = {
  duration: 0.3,
  ease: INDUSTRIAL_EASE,
};

/**
 * Direction type for directional reveals
 */
export type MotionDirection = "up" | "down" | "left" | "right" | "none";

/**
 * Fade In Variants
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom?: { duration?: number; delay?: number }) => ({
    opacity: 1,
    transition: {
      duration: custom?.duration ?? 0.5,
      delay: custom?.delay ?? 0,
      ease: INDUSTRIAL_EASE,
    },
  }),
};

/**
 * Fade Up Variants (Default standard entrance)
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom?: { duration?: number; delay?: number; distance?: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom?.duration ?? 0.65,
      delay: custom?.delay ?? 0,
      ease: INDUSTRIAL_EASE,
    },
  }),
};

/**
 * Directional Reveal Generator
 */
export function createDirectionalVariants(
  direction: MotionDirection = "up",
  distance: number = 24,
): Variants {
  let initialX = 0;
  let initialY = 0;

  switch (direction) {
    case "up":
      initialY = distance;
      break;
    case "down":
      initialY = -distance;
      break;
    case "left":
      initialX = distance;
      break;
    case "right":
      initialX = -distance;
      break;
    case "none":
    default:
      break;
  }

  return {
    hidden: {
      opacity: 0,
      x: initialX,
      y: initialY,
    },
    visible: (custom?: { duration?: number; delay?: number }) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: custom?.duration ?? 0.6,
        delay: custom?.delay ?? 0,
        ease: INDUSTRIAL_EASE,
      },
    }),
  };
}

/**
 * Stagger Container Variants Generator
 */
export function createStaggerVariants(
  staggerChildren: number = 0.08,
  delayChildren: number = 0.05,
): Variants {
  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

/**
 * Standard Stagger Item
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: INDUSTRIAL_EASE,
    },
  },
};

/**
 * Stagger Item with horizontal slide
 */
export const staggerItemHorizontalVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: INDUSTRIAL_EASE,
    },
  },
};

/**
 * Hover Card Variants for Interactive B2B Tiles & Cards
 */
export const hoverCardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: INDUSTRIAL_EASE },
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.25, ease: INDUSTRIAL_EASE },
  },
  tap: {
    y: 0,
    scale: 0.99,
    transition: { duration: 0.12 },
  },
};

/**
 * Tactile Button Micro-Interaction Variants
 */
export const hoverButtonVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: INDUSTRIAL_EASE },
  },
  hover: {
    y: -2,
    scale: 1.02,
    transition: { duration: 0.2, ease: INDUSTRIAL_EASE },
  },
  tap: {
    y: 0,
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Reduced Motion Fallback Variants (Instant opacity without translation)
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};
