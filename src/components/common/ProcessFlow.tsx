import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  number?: number;
  icon?: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}

export interface ProcessFlowProps {
  title?: string;
  steps: ProcessStep[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}

function StepCard({
  step,
  index,
  isLast,
  orientation,
  reducedMotion,
}: {
  step: ProcessStep;
  index: number;
  isLast: boolean;
  orientation: "horizontal" | "vertical";
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const stepNumber = step.number ?? index + 1;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex transition-all duration-700",
        orientation === "horizontal"
          ? "flex-col items-center text-center"
          : "flex-row items-start gap-5",
        reducedMotion
          ? "opacity-100 translate-y-0"
          : visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6",
      )}
      style={
        !reducedMotion
          ? { transitionDelay: `${index * 120}ms` }
          : undefined
      }
    >
      {/* Step indicator */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center",
          orientation === "horizontal" ? "mb-4" : "mt-0.5",
        )}
      >
        {/* Outer ring / glow */}
        <div className="absolute inset-0 rounded-full bg-[#2388FF]/10 scale-150" />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2388FF] bg-[#101B2D]">
          {step.icon ? (
            <span className="text-[#16C7E8]">{step.icon}</span>
          ) : (
            <span className="font-mono text-sm font-bold text-[#16C7E8]">
              {String(stepNumber).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {/* Connector line (not on last item) */}
      {!isLast && (
        <div
          aria-hidden="true"
          className={cn(
            "shrink-0",
            orientation === "horizontal"
              ? "hidden lg:block absolute top-6 left-1/2 h-0.5 w-full bg-gradient-to-r from-[#2388FF] via-[#16C7E8] to-transparent"
              : "mx-auto w-0.5 bg-gradient-to-b from-[#2388FF] to-transparent",
            orientation === "vertical" ? "mt-2 h-full min-h-[3rem]" : "",
          )}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          orientation === "horizontal" ? "flex flex-col items-center" : "pb-8",
        )}
      >
        {step.tag && (
          <span className="engineering-badge mb-2 rounded-sm text-[10px]">
            {step.tag}
          </span>
        )}
        <h4 className="text-sm font-bold uppercase tracking-wide text-[#101B2D]">
          {step.title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function ProcessFlow({
  title,
  steps,
  orientation = "horizontal",
  className,
}: ProcessFlowProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <p className="section-label mb-8">{title}</p>
      )}

      {/* Horizontal on desktop, always vertical on mobile */}
      <div
        className={cn(
          "relative",
          orientation === "horizontal"
            ? "flex flex-col gap-8 lg:grid lg:gap-0"
            : "flex flex-col",
        )}
        style={
          orientation === "horizontal" && steps.length > 0
            ? { gridTemplateColumns: `repeat(${steps.length}, 1fr)` }
            : undefined
        }
      >
        {steps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            index={i}
            isLast={i === steps.length - 1}
            orientation={orientation}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

export default ProcessFlow;
