import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Layers,
  Cpu,
  Zap,
  Activity,
  Shield,
  Eye,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Radio,
  Sliders,
  Wrench,
  MessageSquare,
  CornerDownRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useModals } from "@/components/modals/ModalContext";
import {
  INTELLIGENCE_LEVELS,
  CONTROL_DISTINCTIONS,
  IntelligenceLevelDefinition,
} from "@/data/intelligenceFramework";

export function RoboticsIntelligenceExplorer() {
  const { openModal } = useModals();
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  const activeLevel = INTELLIGENCE_LEVELS.find((l) => l.levelNumber === selectedLevel) || INTELLIGENCE_LEVELS[0];

  return (
    <div className="space-y-16">
      {/* 1. Educational Framework Notice Banner */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-primary">
              <Info size={14} />
              Educational &amp; Architectural Taxonomy
            </div>
            <h2 className="font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
              INDUS 6-Tier Robotics Intelligence Framework
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              This 6-tier taxonomy (Level 0 through Level 5) is an <strong>educational engineering framework</strong> established by INDUS Industrial Robotics to clarify how physical transmission, electromechanical actuation, deterministic real-time control, and modern AI perception interact. It is designed to assist system integrators, robotics engineers, and equipment purchasers in scoping system complexity.
            </p>
          </div>
          <div className="shrink-0 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 max-w-xs text-xs text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-amber-600 dark:text-amber-400">
              <ShieldAlert size={14} /> Safety Integrity Notice
            </span>
            <p className="mt-1 text-[11px] leading-relaxed">
              This framework is <strong>not an ISO/IEC standardized classification</strong>. Certified safety circuits (ISO 13849-1 / IEC 62061) operate as independent, hardware-level supervisors across all six tiers.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive System Architecture Flow Diagram */}
      <div className="rounded-2xl border border-border bg-card p-6 lg:p-10 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
            System Signal Flow
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
            Interactive Robotics Intelligence Stack
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Click on any tier below to inspect its mechanical physics, signal interfaces, latency budgets, and real-world failure dependencies.
          </p>
        </div>

        {/* Stack Visualizer */}
        <div className="mt-8 grid gap-3 lg:grid-cols-6 items-stretch">
          {INTELLIGENCE_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.levelNumber;
            return (
              <button
                key={level.levelNumber}
                onClick={() => setSelectedLevel(level.levelNumber)}
                className={`relative flex flex-col justify-between rounded-xl border p-5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                    : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-primary">
                      {level.levelCode}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      T{level.levelNumber}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-sm font-bold uppercase text-foreground leading-tight">
                    {level.title.split("&")[0].trim()}
                  </h4>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                    {level.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{level.exampleSystemArchitecture.latencyBudget.split(" ")[0]} latency</span>
                  <span className={`text-xs ${isSelected ? "text-primary font-bold" : ""}`}>
                    {isSelected ? "Active ●" : "Inspect →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Independent Safety Supervisor Overlay Banner */}
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <Shield size={20} className="shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[11px]">
                Orthogonal Functional Safety Supervisor (ISO 13849-1 Cat 4 / PLe · IEC 62061 SIL 3)
              </span>
              <p className="text-[11px] text-muted-foreground">
                Hardwired dual-channel safety relays, light curtains, emergency stops, and Safe Torque Off (STO) override software commands at every tier.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-red-500/30 text-red-600 dark:text-red-400 uppercase text-[10px] shrink-0">
            Hardwired Safety Interlock
          </Badge>
        </div>
      </div>

      {/* 3. Deep Dive on Selected Level */}
      <div className="rounded-2xl border border-border bg-card p-6 lg:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase text-primary">
                {activeLevel.levelCode} Deep-Dive
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground font-mono">
                Latency Budget: {activeLevel.exampleSystemArchitecture.latencyBudget}
              </span>
            </div>
            <h3 className="mt-2 font-display text-3xl font-bold uppercase text-foreground">
              {activeLevel.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary">
              {activeLevel.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold uppercase"
              onClick={() => openModal("engineer", { categoryName: `${activeLevel.levelCode}: ${activeLevel.title} Review` })}
            >
              <Wrench size={13} className="mr-1.5" /> Consult on {activeLevel.levelCode}
            </Button>
          </div>
        </div>

        {/* Core Description & Kinematic Role */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Purpose &amp; Engineering Capabilities
              </span>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {activeLevel.purposeAndCapabilities}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/30 p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Kinematic &amp; Algorithmic Role
              </span>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {activeLevel.kinematicAndAlgorithmicRole}
              </p>
            </div>

            {/* Example Industrial Tasks */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Example Industrial Tasks at this Tier
              </span>
              <ul className="mt-3 space-y-2">
                {activeLevel.exampleIndustrialTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/80">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Signal Interfaces Table */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Signal Interfaces &amp; Data Protocols
              </span>
              <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/60 text-[10px] font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="p-3">Signal Name</th>
                      <th className="p-3">Signal Type</th>
                      <th className="p-3">Bandwidth / Rate</th>
                      <th className="p-3">Protocol / Interface</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                    {activeLevel.inputSignals.map((sig, i) => (
                      <tr key={`in-${i}`} className="hover:bg-muted/20">
                        <td className="p-3 font-sans font-semibold text-foreground">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-blue-500/10 text-blue-600 mr-1.5 font-mono">IN</span>
                          {sig.signal}
                        </td>
                        <td className="p-3 text-muted-foreground">{sig.type}</td>
                        <td className="p-3 text-foreground">{sig.typicalBandwidth}</td>
                        <td className="p-3 text-primary">{sig.protocol}</td>
                      </tr>
                    ))}
                    {activeLevel.outputSignals.map((sig, i) => (
                      <tr key={`out-${i}`} className="hover:bg-muted/20">
                        <td className="p-3 font-sans font-semibold text-foreground">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-600 mr-1.5 font-mono">OUT</span>
                          {sig.signal}
                        </td>
                        <td className="p-3 text-muted-foreground">{sig.type}</td>
                        <td className="p-3 text-foreground">{sig.typicalBandwidth}</td>
                        <td className="p-3 text-primary">{sig.protocol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Architecture, Dependencies, Products */}
          <div className="lg:col-span-5 space-y-6">
            {/* System Architecture Snapshot */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Example Architecture Implementation
              </span>

              <dl className="space-y-2.5 font-mono text-[11px]">
                <div>
                  <dt className="text-muted-foreground font-sans text-[10px] uppercase">Input State:</dt>
                  <dd className="font-semibold text-foreground">{activeLevel.exampleSystemArchitecture.sensorInput}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-sans text-[10px] uppercase">Processing Core:</dt>
                  <dd className="font-semibold text-primary">{activeLevel.exampleSystemArchitecture.processingUnit}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-sans text-[10px] uppercase">Physical Actuator Output:</dt>
                  <dd className="font-semibold text-foreground">{activeLevel.exampleSystemArchitecture.actuatorOutput}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-sans text-[10px] uppercase">Latency Budget:</dt>
                  <dd className="font-semibold text-emerald-600 dark:text-emerald-400">{activeLevel.exampleSystemArchitecture.latencyBudget}</dd>
                </div>
              </dl>
            </div>

            {/* Hardware Components Required */}
            <div className="rounded-xl border border-border bg-card p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Mechatronic Components Required
              </span>
              <ul className="mt-3 space-y-1.5">
                {activeLevel.requiredComponents.map((comp, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-foreground/90">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dependencies & Real-World Limitations */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <AlertTriangle size={13} />
                Engineering Dependencies &amp; Limitations
              </span>
              <ul className="mt-3 space-y-2">
                {activeLevel.dependenciesAndLimitations.map((lim, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground leading-relaxed">
                    • {lim}
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Interaction */}
            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                Functional Safety Relationship
              </span>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {activeLevel.safetyInteraction}
              </p>
            </div>

            {/* Related INDUS Product Lines & Applications */}
            <div className="rounded-xl border border-border p-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Related INDUS Hardware &amp; Verticals
              </span>
              <div className="flex flex-wrap gap-2">
                {activeLevel.relatedProductRanges.map((prod) => (
                  <Link
                    key={prod.name}
                    to={prod.href}
                    className="inline-flex items-center gap-1 rounded border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {prod.name} <ArrowRight size={11} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Engineering Comparison: Deterministic vs Feedback vs AI Perception */}
      <div className="rounded-2xl border border-border bg-card p-6 lg:p-10 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
            Engineering Clarity
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
            Distinguishing Control, Perception &amp; Autonomy
          </h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Marketing narratives often blur the boundaries between mathematical feedback control, deep learning vision, and real-time motion generation. Compare their governing principles and safety roles:
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/60 text-[10px] font-bold uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Control Concept</th>
                <th className="p-4">Governing Principle</th>
                <th className="p-4">Typical Frequency</th>
                <th className="p-4">Determinism Guarantee</th>
                <th className="p-4">Replaces Safety Circuit?</th>
                <th className="p-4">Industrial Automation Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {CONTROL_DISTINCTIONS.map((item) => (
                <tr key={item.concept} className="hover:bg-muted/20">
                  <td className="p-4 font-bold text-foreground">{item.concept}</td>
                  <td className="p-4 text-muted-foreground max-w-xs">{item.governingPrinciple}</td>
                  <td className="p-4 font-mono font-semibold text-primary">{item.typicalFrequency}</td>
                  <td className="p-4 text-xs text-foreground/80">{item.determinismGuarantee}</td>
                  <td className="p-4 font-mono">
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                      ✕ Never (Strictly No)
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-xs">{item.commonIndustrialRole}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fallacy Callout */}
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">System Integration Rule:</strong> Adding a single &quot;intelligent&quot; component (such as an AI camera or edge computer) does not make an entire robotic cell autonomous. A robot&apos;s physical capability is always constrained by its lowest-tier mechanical rigidity (Level 0), motor thermal bandwidth (Level 1), and certified safety envelope.
        </div>
      </div>
    </div>
  );
}
