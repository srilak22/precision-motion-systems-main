import React, { useState } from "react";
import { Shield, Clock, Globe, BarChart2, Activity, ArrowRight, Eye, Brain, Network, Zap, CheckCircle2 } from "lucide-react";

interface LayerInfo {
  layerNumber: number;
  id: string;
  name: string;
  stage: string;
  stageVerb: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  telemetryPoints: string[];
  industrialUseCases: string[];
  outputInsight: string;
}

const LAYERS: LayerInfo[] = [
  {
    layerNumber: 5,
    id: "ip-intelligence",
    name: "IP INTELLIGENCE",
    stage: "STAGE 5 — ACT",
    stageVerb: "ACT",
    tagline: "Uses network intelligence for deeper profiling.",
    description: "Evaluates B2B enterprise networks, ASNs, ISP topologies, and proxy/bot signals with strict privacy-preserving anonymity (no raw IPs stored).",
    icon: Shield,
    telemetryPoints: [
      "Enterprise corporate LAN signatures",
      "Autonomous System Numbers (ASN)",
      "ISP & carrier network tier classification",
      "Data-center & VPN routing indicators",
      "Automated bot & crawler discrimination",
    ],
    industrialUseCases: [
      "B2B OEM account prioritization",
      "RFQ fraud detection & threat mitigation",
      "Automated security & access compliance",
    ],
    outputInsight: "Detects enterprise manufacturing buyers and filters anomalous non-human automated traffic.",
  },
  {
    layerNumber: 4,
    id: "time-zone-intelligence",
    name: "TIME ZONE INTELLIGENCE",
    stage: "STAGE 4 — PREDICT",
    stageVerb: "PREDICT",
    tagline: "Captures user activity by time zone.",
    description: "Maps user interaction timelines against regional business shifts, shop-floor operating hours, and international procurement schedules.",
    icon: Clock,
    telemetryPoints: [
      "Client browser locale & IANA timezone",
      "Local procurement shift hour (00:00–23:00)",
      "Weekday production vs weekend standby cycles",
      "Peak quote request temporal distribution",
      "Dwell curve alignment with manufacturing shifts",
    ],
    industrialUseCases: [
      "Application engineer dispatch scheduling",
      "Regional digital campaign pacing",
      "24/7 technical desk routing",
    ],
    outputInsight: "Aligns engineering support and live quotation capabilities with peak regional factory operational hours.",
  },
  {
    layerNumber: 3,
    id: "geo-intelligence",
    name: "GEO INTELLIGENCE",
    stage: "STAGE 3 — CONNECT",
    stageVerb: "CONNECT",
    tagline: "Identifies user location.",
    description: "Derives privacy-safe regional and municipal cluster demand patterns without intrusive GPS tracking, adhering to GDPR and industrial data standards.",
    icon: Globe,
    telemetryPoints: [
      "Country, regional state & metropolitan cluster",
      "Industrial manufacturing hub density",
      "Regional session velocity & dwell intensity",
      "Regional lead conversion propensity",
      "Localization & language compatibility",
    ],
    industrialUseCases: [
      "Regional robotic cell distributor allocation",
      "Targeted localized application notes",
      "Export & trade compliance verification",
    ],
    outputInsight: "Surfaces high-growth manufacturing geography demanding robotic automation cells and actuators.",
  },
  {
    layerNumber: 2,
    id: "traffic-intelligence",
    name: "TRAFFIC INTELLIGENCE",
    stage: "STAGE 2 — UNDERSTAND",
    stageVerb: "UNDERSTAND",
    tagline: "Monitors overall traffic sources and patterns.",
    description: "Preserves campaign attribution (UTMs), referral chains, and organic search queries across multi-touch industrial buying cycles.",
    icon: BarChart2,
    telemetryPoints: [
      "Direct industrial engineering visits",
      "Organic robotic keyword search origins",
      "Partner, directory & trade referral links",
      "UTM campaign, source, medium & term attribution",
      "Source-to-spec-sheet download velocity",
    ],
    industrialUseCases: [
      "Marketing return on investment (ROI)",
      "Channel & partner performance benchmarking",
      "High-value automation audience segmentation",
    ],
    outputInsight: "Reveals which acquisition channels deliver serious automation engineers rather than passive traffic.",
  },
  {
    layerNumber: 1,
    id: "session-intelligence",
    name: "SESSION INTELLIGENCE",
    stage: "STAGE 1 — SEE",
    stageVerb: "SEE",
    tagline: "Tracks individual user sessions.",
    description: "Captures the granular mechanical exploration path: technical datasheets opened, CAD model interactions, product filters, and RFQ form completions.",
    icon: Activity,
    telemetryPoints: [
      "Session lifecycle (start, duration, dwell, exit)",
      "Entry point & exit drop-off identification",
      "Multi-step sequential navigation journey",
      "Single-page bounce vs deep technical engagement",
      "Micro-interactions (CAD, zoom, specs, WhatsApp)",
    ],
    industrialUseCases: [
      "Technical catalog UX optimization",
      "Component specification funnel refinement",
      "Personalized dynamic product recommendation",
    ],
    outputInsight: "Maps the complete engineering evaluation journey from initial landing to Request for Quote (RFQ).",
  },
];

export function ArchitectureLayers() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>("session-intelligence");

  const activeLayer = LAYERS.find((l) => l.id === selectedLayerId) || LAYERS[4];

  return (
    <div className="space-y-8">
      {/* 5 STAGES PIPELINE NAVIGATION */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 md:gap-3">
        {[...LAYERS].reverse().map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          const Icon = layer.icon;

          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              className={`group relative flex flex-col items-start border p-4 text-left transition-all ${
                isSelected
                  ? "border-signal bg-surface-elevated text-surface-foreground shadow-lg"
                  : "border-border/30 bg-surface-dark/70 text-surface-foreground/70 hover:border-signal/60 hover:bg-surface-elevated/50 hover:text-surface-foreground"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-[10px] font-bold uppercase tracking-widest text-signal">
                  LAYER {layer.layerNumber}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {layer.stageVerb}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Icon size={16} className={isSelected ? "text-signal" : "text-surface-foreground/60"} />
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                  {layer.name}
                </h4>
              </div>

              <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                {layer.tagline}
              </p>

              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-signal" />
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE LAYER DETAIL CARD */}
      <div className="border border-border/40 bg-surface-dark p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 lg:max-w-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-signal">
                LAYER {activeLayer.layerNumber} / 5
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {activeLayer.stage}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-surface-foreground sm:text-3xl">
              {activeLayer.name}
            </h3>

            <p className="text-sm font-semibold text-signal">
              "{activeLayer.tagline}"
            </p>

            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {activeLayer.description}
            </p>

            <div className="border-l-2 border-signal/60 bg-surface-elevated/40 p-3 text-xs text-surface-foreground/90">
              <span className="font-bold text-signal">PRIMARY OUTCOME: </span>
              {activeLayer.outputInsight}
            </div>
          </div>

          {/* TELEMETRY POINTS & USE CASES */}
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-xl">
            <div className="space-y-3 rounded-none border border-border/20 bg-surface-elevated/20 p-4">
              <h5 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-signal">
                <Activity size={14} /> Telemetry Captured
              </h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {activeLayer.telemetryPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-signal font-mono text-[10px] mt-0.5">0{idx + 1}</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 rounded-none border border-border/20 bg-surface-elevated/20 p-4">
              <h5 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-signal">
                <Zap size={14} /> Industrial Use Cases
              </h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {activeLayer.industrialUseCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-signal mt-0.5 shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
