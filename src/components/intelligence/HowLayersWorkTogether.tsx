import React from "react";
import { ArrowDown, Layers, ShieldCheck, Zap, TrendingUp, Cpu, Lock, Crosshair, Sparkles } from "lucide-react";

export function HowLayersWorkTogether() {
  return (
    <div className="space-y-10">
      <div className="border border-border/40 bg-surface-dark p-6 lg:p-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
            SYSTEM SYNTHESIS &amp; DATA INTERLOCK
          </p>
          <h3 className="font-display text-2xl uppercase tracking-tight text-surface-foreground sm:text-3xl md:text-4xl">
            HOW INTELLIGENCE LAYERS WORK TOGETHER
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Isolated web metrics produce noise. When all five telemetry streams correlate in real time,
            INDUS transforms raw web traffic into actionable enterprise motion automation intelligence.
          </p>
        </div>

        {/* 3 CORE DUAL-LAYER SYNTHESES */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* SYNERGY 1: SESSION + TRAFFIC */}
          <div className="relative flex flex-col justify-between border border-border/30 bg-surface-elevated/30 p-6 transition-all hover:border-signal/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-signal">COMBINATION 01</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">FUNNEL ENGINE</span>
              </div>

              <div className="flex items-center gap-2 border-y border-border/20 py-3 text-xs font-bold uppercase tracking-wider text-surface-foreground">
                <span className="bg-signal/15 px-2 py-1 text-signal">SESSION</span>
                <span className="text-muted-foreground">+</span>
                <span className="bg-signal/15 px-2 py-1 text-signal">TRAFFIC</span>
              </div>

              <div className="flex justify-center text-signal">
                <ArrowDown size={18} className="animate-bounce" />
              </div>

              <div className="space-y-2 rounded-none border border-signal/30 bg-signal/5 p-4 text-center">
                <TrendingUp size={20} className="mx-auto text-signal" />
                <h5 className="font-display text-base font-bold uppercase tracking-wide text-surface-foreground">
                  CONVERSION FUNNEL CLARITY
                </h5>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Dissects the full acquisition funnel: maps how organic keywords vs direct OEM visits navigate from robot specs to quote submissions.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/20 text-[10px] text-muted-foreground font-mono">
              Outcome: Identifies highest-yielding engineering acquisition channels.
            </div>
          </div>

          {/* SYNERGY 2: GEO + TIME ZONE */}
          <div className="relative flex flex-col justify-between border border-border/30 bg-surface-elevated/30 p-6 transition-all hover:border-signal/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-signal">COMBINATION 02</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SPATIO-TEMPORAL</span>
              </div>

              <div className="flex items-center gap-2 border-y border-border/20 py-3 text-xs font-bold uppercase tracking-wider text-surface-foreground">
                <span className="bg-signal/15 px-2 py-1 text-signal">GEO</span>
                <span className="text-muted-foreground">+</span>
                <span className="bg-signal/15 px-2 py-1 text-signal">TIME ZONE</span>
              </div>

              <div className="flex justify-center text-signal">
                <ArrowDown size={18} className="animate-bounce" />
              </div>

              <div className="space-y-2 rounded-none border border-signal/30 bg-signal/5 p-4 text-center">
                <Crosshair size={20} className="mx-auto text-signal" />
                <h5 className="font-display text-base font-bold uppercase tracking-wide text-surface-foreground">
                  REGIONAL ENGAGEMENT OPTIMIZATION
                </h5>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Correlates local manufacturing shift hours with regional geography to align application engineering support and rapid quote turnaround.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/20 text-[10px] text-muted-foreground font-mono">
              Outcome: Eliminates procurement delays across global time zones.
            </div>
          </div>

          {/* SYNERGY 3: IP + TRAFFIC */}
          <div className="relative flex flex-col justify-between border border-border/30 bg-surface-elevated/30 p-6 transition-all hover:border-signal/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-signal">COMBINATION 03</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">B2B SECURITY</span>
              </div>

              <div className="flex items-center gap-2 border-y border-border/20 py-3 text-xs font-bold uppercase tracking-wider text-surface-foreground">
                <span className="bg-signal/15 px-2 py-1 text-signal">IP</span>
                <span className="text-muted-foreground">+</span>
                <span className="bg-signal/15 px-2 py-1 text-signal">TRAFFIC</span>
              </div>

              <div className="flex justify-center text-signal">
                <ArrowDown size={18} className="animate-bounce" />
              </div>

              <div className="space-y-2 rounded-none border border-signal/30 bg-signal/5 p-4 text-center">
                <ShieldCheck size={20} className="mx-auto text-signal" />
                <h5 className="font-display text-base font-bold uppercase tracking-wide text-surface-foreground">
                  FRAUD DETECTION + ENTERPRISE TARGETING
                </h5>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Screens incoming requests against known ASN datacenters and bot vectors while identifying tier-1 automotive &amp; electronics manufacturing networks.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/20 text-[10px] text-muted-foreground font-mono">
              Outcome: Protects system integrity while elevating enterprise inquiries.
            </div>
          </div>
        </div>

        {/* MASTER CULMINATION: ALL FIVE LAYERS */}
        <div className="mt-10 border border-signal/40 bg-surface-elevated p-6 lg:p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 border border-signal bg-signal/10 px-3 py-1 font-mono text-xs font-bold text-signal">
              <Sparkles size={14} />
              ALL FIVE LAYERS COMBINED
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-wider text-surface-foreground/80">
              <span className="border border-border/40 px-2 py-1">Layer 1: Session</span>
              <span className="border border-border/40 px-2 py-1">Layer 2: Traffic</span>
              <span className="border border-border/40 px-2 py-1">Layer 3: Geo</span>
              <span className="border border-border/40 px-2 py-1">Layer 4: Time Zone</span>
              <span className="border border-border/40 px-2 py-1">Layer 5: IP Intelligence</span>
            </div>

            <div className="text-signal my-1">
              <ArrowDown size={22} className="animate-pulse" />
            </div>

            <h4 className="font-display text-2xl uppercase tracking-wider text-signal sm:text-3xl">
              PREDICTIVE INTELLIGENCE
            </h4>

            <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              When all 5 layers converge, the platform anticipates customer requirements, eliminates technical friction, and delivers 4 core strategic capabilities:
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 w-full text-left">
              <div className="border border-border/30 bg-surface-dark/80 p-4">
                <span className="font-mono text-[10px] text-signal font-bold">PILLAR A</span>
                <h6 className="font-display text-sm font-bold uppercase tracking-wide text-surface-foreground mt-1">
                  PERSONALIZATION
                </h6>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Surfaces relevant actuators and reducers tailored to the visitor's industry segment.
                </p>
              </div>

              <div className="border border-border/30 bg-surface-dark/80 p-4">
                <span className="font-mono text-[10px] text-signal font-bold">PILLAR B</span>
                <h6 className="font-display text-sm font-bold uppercase tracking-wide text-surface-foreground mt-1">
                  MARKETING
                </h6>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Optimizes digital budgets around real engineering engagement rather than vanity clicks.
                </p>
              </div>

              <div className="border border-border/30 bg-surface-dark/80 p-4">
                <span className="font-mono text-[10px] text-signal font-bold">PILLAR C</span>
                <h6 className="font-display text-sm font-bold uppercase tracking-wide text-surface-foreground mt-1">
                  SECURITY
                </h6>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Guards proprietary technical drawings against automated scraping and abusive queries.
                </p>
              </div>

              <div className="border border-border/30 bg-surface-dark/80 p-4">
                <span className="font-mono text-[10px] text-signal font-bold">PILLAR D</span>
                <h6 className="font-display text-sm font-bold uppercase tracking-wide text-surface-foreground mt-1">
                  OPTIMIZATION
                </h6>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Continuous conversion path acceleration from initial product landing to final RFQ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
