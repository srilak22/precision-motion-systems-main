import React from "react";
import { cn } from "@/lib/utils";

export interface Challenge {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface ChallengeBlockProps {
  title?: string;
  challenges: Challenge[];
  variant?: "default" | "dark";
  className?: string;
}

export function ChallengeBlock({
  title = "Engineering Challenge",
  challenges,
  variant = "default",
  className,
}: ChallengeBlockProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "relative py-12 lg:py-16",
        isDark ? "bg-[#101B2D]" : "bg-[#F4F7FB]",
        className,
      )}
    >
      {/* Left accent bar */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#16C7E8]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <p
          className={cn(
            "section-label mb-8",
            isDark ? "text-[#16C7E8]" : undefined,
          )}
          style={!isDark ? { color: "var(--signal)" } : undefined}
        >
          {title}
        </p>

        {/* Challenge grid: 2 cols on md, 3 cols on lg */}
        <div
          className={cn(
            "grid gap-6 sm:grid-cols-2",
            challenges.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
          )}
        >
          {challenges.map((challenge, i) => (
            <div
              key={i}
              className={cn(
                "group relative rounded-xl border p-6 transition-all duration-200",
                isDark
                  ? "border-white/10 bg-[#16243A] hover:border-[#16C7E8]/30 hover:bg-[#1a2a44]"
                  : "border-[#E2E8F0] bg-white hover:border-[#2388FF]/40 hover:shadow-md",
              )}
            >
              {/* Icon */}
              {challenge.icon && (
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-[#16C7E8]/10 p-2.5 text-[#16C7E8]">
                  {challenge.icon}
                </div>
              )}

              {/* Title */}
              <h3
                className={cn(
                  "mb-2 text-sm font-bold uppercase tracking-wide",
                  isDark ? "text-white" : "text-[#101B2D]",
                )}
              >
                {challenge.title}
              </h3>

              {/* Description */}
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDark ? "text-white/60" : "text-[#64748B]",
                )}
              >
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChallengeBlock;
