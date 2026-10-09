import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  amount?: number;
  once?: boolean;
};

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
  none: { x: 0, y: 0 },
};

function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  amount = 0.15,
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = offsets[direction];

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: reduceMotion ? 0.2 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/** Fade in with a small upward movement when the element enters the viewport. */
export function FadeUp(props: Omit<RevealProps, "direction">) {
  return <Reveal {...props} direction="up" />;
}

/** Reveal content from a selected direction, with reduced-motion support. */
export function DirectionalReveal(props: RevealProps) {
  return <Reveal {...props} />;
}

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
  once?: boolean;
  staggerDelay?: number;
};

export function StaggerContainer({
  children,
  className,
  amount = 0.12,
  once = true,
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    ...staggerContainerVariants,
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : staggerDelay,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduceMotion
          ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
          : staggerItemVariants
      }
    >
      {children}
    </motion.div>
  );
}

type HoverMotionProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  lift?: number;
  scale?: number;
};

/** Lightweight hover treatment for product cards and other non-interactive wrappers. */
export function HoverMotion({
  children,
  lift = 4,
  scale = 1.01,
  whileHover,
  whileTap,
  ...props
}: HoverMotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}
      whileHover={
        reduceMotion ? undefined : whileHover ?? { y: -lift, scale }
      }
      whileTap={reduceMotion ? undefined : whileTap ?? { scale: 0.995 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
