import { useReducedMotion as useFramerReducedMotion } from "motion/react";

/**
 * Hook to detect if user has requested reduced motion in their OS/browser settings.
 * Safe for SSR and client rendering.
 */
export function useReducedMotion(): boolean {
  const prefersReduced = useFramerReducedMotion();
  return Boolean(prefersReduced);
}
