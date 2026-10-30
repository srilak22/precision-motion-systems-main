import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PageHeroProps {
  label?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaPrimary?: { label: string; href?: string; onClick?: () => void };
  ctaSecondary?: { label: string; href?: string; onClick?: () => void };
  badgeText?: string;
  darkBackground?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHero({
  label,
  headline,
  subheadline,
  description,
  imageSrc,
  imageAlt,
  ctaPrimary,
  ctaSecondary,
  badgeText,
  darkBackground = true,
  breadcrumbs,
  children,
}: PageHeroProps) {
  const bg = darkBackground ? "bg-[#101B2D]" : "bg-[#16243A]";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 lg:py-20",
        bg,
      )}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 technical-grid opacity-40"
        aria-hidden="true"
      />

      {/* Precision-blue left border accent */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#2388FF]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb slot */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs text-white/50"
          >
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={12} className="shrink-0" />}
                {crumb.href ? (
                  <Link
                    to={crumb.href as "/"}
                    className="hover:text-white/80 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/70">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div
          className={cn(
            "grid gap-10 lg:gap-16",
            imageSrc ? "lg:grid-cols-2 lg:items-center" : "max-w-3xl",
          )}
        >
          {/* Left: Content */}
          <div className="space-y-5">
            {/* Engineering badge */}
            {badgeText && (
              <span className="engineering-badge rounded-sm">
                {badgeText}
              </span>
            )}

            {/* Section label */}
            {label && (
              <p className="section-label">{label}</p>
            )}

            {/* Headline */}
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {headline}
              {subheadline && (
                <>
                  {" "}
                  <span className="text-[#2388FF]">{subheadline}</span>
                </>
              )}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-base text-white/70 leading-relaxed max-w-xl">
                {description}
              </p>
            )}

            {/* CTAs */}
            {(ctaPrimary || ctaSecondary) && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {ctaPrimary &&
                  (ctaPrimary.href ? (
                    <Link to={ctaPrimary.href as "/"}>
                      <Button
                        variant="default"
                        size="lg"
                        className="btn-signal-glow"
                      >
                        {ctaPrimary.label}
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="default"
                      size="lg"
                      className="btn-signal-glow"
                      onClick={ctaPrimary.onClick}
                    >
                      {ctaPrimary.label}
                      <ArrowRight size={15} />
                    </Button>
                  ))}

                {ctaSecondary &&
                  (ctaSecondary.href ? (
                    <Link to={ctaSecondary.href as "/"}>
                      <Button
                        variant="dark"
                        size="lg"
                        className="btn-outline-glow"
                      >
                        {ctaSecondary.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="dark"
                      size="lg"
                      className="btn-outline-glow"
                      onClick={ctaSecondary.onClick}
                    >
                      {ctaSecondary.label}
                    </Button>
                  ))}
              </div>
            )}

            {/* Optional children slot */}
            {children}
          </div>

          {/* Right: Image */}
          {imageSrc && (
            <div className="relative hidden lg:block">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img
                  src={imageSrc}
                  alt={imageAlt ?? headline}
                  className="h-full w-full object-cover max-h-[420px]"
                  loading="lazy"
                />
                {/* Subtle overlay gradient */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#101B2D]/60 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PageHero;
