import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, animate, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import {
  INDUSTRIAL_EASE,
  createDirectionalVariants,
  createStaggerVariants,
  staggerItemVariants,
  hoverCardVariants,
  type MotionDirection,
} from "@/lib/motion";

/* =========================================================================
   1. FADE UP & FADE IN (Directional reveal with viewport intersection trigger)
========================================================================= */

export interface FadeUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  className?: string;
}

// Strip Framer Motion specific props when rendering standard HTML elements in reduced-motion mode
function stripMotionProps<T extends Record<string, unknown>>(
  props: T,
): React.HTMLAttributes<HTMLDivElement> {
  const {
    whileHover,
    whileTap,
    whileInView,
    whileFocus,
    whileDrag,
    viewport,
    variants,
    initial,
    animate,
    exit,
    transition,
    custom,
    layout,
    layoutId,
    onAnimationStart,
    onAnimationComplete,
    onUpdate,
    ...htmlProps
  } = props;
  return htmlProps;
}

export function FadeUp({
  children,
  distance = 24,
  duration = 0.6,
  delay = 0,
  once = true,
  amount = 0.2,
  className,
  ...props
}: FadeUpProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...stripMotionProps(props)}>
        {children}
      </div>
    );
  }

  const variants = createDirectionalVariants("up", distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      custom={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  direction?: MotionDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  className?: string;
}

export function FadeIn({
  children,
  direction = "up",
  distance = 24,
  duration = 0.6,
  delay = 0,
  once = true,
  amount = 0.2,
  className,
  ...props
}: FadeInProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...stripMotionProps(props)}>
        {children}
      </div>
    );
  }

  const variants = createDirectionalVariants(direction, distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      custom={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================================
   2. STAGGER CONTAINER & STAGGER ITEM (Coordinated parent-child reveals)
========================================================================= */

export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  once = true,
  amount = 0.15,
  className,
  ...props
}: StaggerContainerProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...stripMotionProps(props)}>
        {children}
      </div>
    );
  }

  const variants = createStaggerVariants(staggerDelay, delayChildren);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...stripMotionProps(props)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div variants={staggerItemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/* =========================================================================
   3. DIRECTIONAL REVEAL (Semantic alias with fine-tuned duration/distance)
========================================================================= */

export interface DirectionalRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  direction?: MotionDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function DirectionalReveal({
  children,
  direction = "up",
  distance = 32,
  duration = 0.65,
  delay = 0,
  className,
  ...props
}: DirectionalRevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...stripMotionProps(props)}>
        {children}
      </div>
    );
  }

  const variants = createDirectionalVariants(direction, distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      custom={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================================
   4. HOVER MOTION & HOVER CARD (Subtle elevation and tactile response)
========================================================================= */

export interface HoverMotionProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "card" | "button" | "scale" | "lift";
  className?: string;
}

export function HoverMotion({ children, variant = "card", className, ...props }: HoverMotionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  const getVariants = () => {
    switch (variant) {
      case "button":
        return {
          rest: { y: 0, scale: 1 },
          hover: { y: -2, scale: 1.02, transition: { duration: 0.2, ease: INDUSTRIAL_EASE } },
          tap: { y: 0, scale: 0.98, transition: { duration: 0.1 } },
        };
      case "scale":
        return {
          rest: { scale: 1 },
          hover: { scale: 1.03, transition: { duration: 0.2, ease: INDUSTRIAL_EASE } },
          tap: { scale: 0.97, transition: { duration: 0.1 } },
        };
      case "lift":
        return {
          rest: { y: 0 },
          hover: { y: -3, transition: { duration: 0.2, ease: INDUSTRIAL_EASE } },
          tap: { y: 0, transition: { duration: 0.1 } },
        };
      case "card":
      default:
        return hoverCardVariants;
    }
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={getVariants()}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface HoverCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export function HoverCard({ children, className, ...props }: HoverCardProps) {
  return (
    <HoverMotion variant="card" {...(className !== undefined ? { className } : {})} {...props}>
      {children}
    </HoverMotion>
  );
}

/* =========================================================================
   5. MOTION SCALE (Micro-interaction wrapper for icons, buttons, pills)
========================================================================= */

export interface MotionScaleProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  scaleHover?: number;
  scaleTap?: number;
  className?: string;
}

export function MotionScale({
  children,
  scaleHover = 1.04,
  scaleTap = 0.96,
  className,
  ...props
}: MotionScaleProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...stripMotionProps(props)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: scaleHover }}
      whileTap={{ scale: scaleTap }}
      transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================================
   6. TELEMETRY COUNTER (Animated precision metric counter for specs)
========================================================================= */

export interface TelemetryCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function TelemetryCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className,
}: TelemetryCounterProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState<string>(
    prefersReduced ? value.toFixed(decimals) : "0",
  );

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value.toFixed(decimals));
      return;
    }

    if (!isInView) return;

    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest.toFixed(decimals));
      },
    });

    return () => controls.stop();
  }, [isInView, value, decimals, duration, prefersReduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
