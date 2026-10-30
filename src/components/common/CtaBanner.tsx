import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquare, PhoneCall, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CtaBannerProps {
  headline: string;
  description?: string;
  badge?: string;
  ctaPrimary: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  ctaSecondary?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "dark" | "precision" | "signal";
  className?: string;
}

export function CtaBanner({
  headline,
  description,
  badge,
  ctaPrimary,
  ctaSecondary,
  variant = "dark",
  className,
}: CtaBannerProps) {
  const bgStyles = {
    dark: "bg-[#101B2D] border-border/40 text-white",
    precision: "bg-gradient-to-r from-[#101B2D] via-[#16243A] to-[#1F3A60] border-precision-blue/30 text-white",
    signal: "bg-[#101B2D] border-l-4 border-l-signal border-border/40 text-white",
  };

  return (
    <section className={cn("relative overflow-hidden border py-12 px-6 sm:px-12 my-12", bgStyles[variant], className)}>
      {/* Subtle grid background pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          {badge && (
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-signal bg-signal/10 px-2.5 py-1 border border-signal/20">
              {badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-white">
            {headline}
          </h2>
          {description && (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {ctaPrimary.href ? (
            <Button
              asChild
              className="bg-signal text-surface-dark font-bold uppercase hover:bg-signal/90 rounded-none h-11 px-6 tracking-wide text-xs"
            >
              <Link to={ctaPrimary.href}>
                {ctaPrimary.label}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <Button
              onClick={ctaPrimary.onClick}
              className="bg-signal text-surface-dark font-bold uppercase hover:bg-signal/90 rounded-none h-11 px-6 tracking-wide text-xs"
            >
              {ctaPrimary.label}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          {ctaSecondary && (
            ctaSecondary.href ? (
              <Button
                asChild
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 rounded-none h-11 px-6 tracking-wide uppercase text-xs"
              >
                <Link to={ctaSecondary.href}>
                  {ctaSecondary.label}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={ctaSecondary.onClick}
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 rounded-none h-11 px-6 tracking-wide uppercase text-xs"
              >
                {ctaSecondary.label}
              </Button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
