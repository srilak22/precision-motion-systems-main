import React from "react";
import { ArrowDown, CheckCircle2, ChevronRight, Compass } from "lucide-react";

interface UserJourneyProps {
  journeys: { path: string; count: number }[];
  activeSessionPages?: string[];
}

export function UserJourneyFlow({ journeys, activeSessionPages = [] }: UserJourneyProps) {
  // If we have aggregated journeys from past/active sessions, render them
  const hasJourneys = journeys.length > 0;
  const currentPath = activeSessionPages.length > 0 ? activeSessionPages : ["/"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border/20 pb-3">
        <div>
          <h4 className="font-display text-base font-bold uppercase tracking-wider text-surface-foreground">
            USER JOURNEY (ACTUAL NAVIGATION FLOWS)
          </h4>
          <p className="text-xs text-muted-foreground">
            Constructed strictly from recorded sequential page transitions. No simulated paths.
          </p>
        </div>
        <span className="font-mono text-[10px] text-signal font-bold uppercase">
          {hasJourneys ? `${journeys.length} COMMON PATHWAYS` : "CURRENT ACTIVE PATHWAY"}
        </span>
      </div>

      {hasJourneys ? (
        <div className="space-y-4">
          {journeys.map((item, index) => {
            const steps = item.path.split(" → ");

            return (
              <div
                key={index}
                className="border border-border/30 bg-surface-elevated/40 p-4 transition-all hover:border-signal/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-bold text-signal">
                    PATHWAY 0{index + 1}
                  </span>
                  <span className="font-mono text-xs bg-surface-dark px-2 py-0.5 text-muted-foreground border border-border/20">
                    {item.count} {item.count === 1 ? "Session" : "Sessions"}
                  </span>
                </div>

                {/* Horizontal flow on desktop, vertical on mobile */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {steps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <span className="border border-border/40 bg-surface-dark px-3 py-1.5 font-mono text-surface-foreground font-semibold">
                        {step === "/" ? "Homepage (Landing)" : step}
                      </span>
                      {sIdx < steps.length - 1 && (
                        <ChevronRight size={14} className="text-signal shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Real-time active session pathway fallback if only 1 active session */
        <div className="border border-border/30 bg-surface-elevated/30 p-6 text-center space-y-4">
          <Compass size={24} className="mx-auto text-signal" />
          <h5 className="font-display text-sm uppercase tracking-wider text-surface-foreground font-bold">
            Active Browser Session Flow
          </h5>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {currentPath.map((step, sIdx) => (
              <React.Fragment key={sIdx}>
                <span className="border border-signal/40 bg-signal/10 px-3 py-1.5 font-mono text-signal font-bold">
                  {step === "/" ? "Landing Page (/)" : step}
                </span>
                {sIdx < currentPath.length - 1 && (
                  <ChevronRight size={14} className="text-signal shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Navigate to products, solutions, and specs across the site to generate multi-session pathway graphs.
          </p>
        </div>
      )}
    </div>
  );
}
