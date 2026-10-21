import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  Zap,
  Wrench,
  FileText,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TaxonomySubcategory,
  SpecItem,
  getAllSubcategories,
  TOTAL_ROBOTICS_PILLARS,
} from "@/data/taxonomy/roboticsTaxonomyData";

export type VerticalSubject =
  | "Overview"
  | "Physical Architecture"
  | "Mobility"
  | "Manipulation"
  | "Payload and Performance"
  | "Sensors and Perception"
  | "Control System"
  | "Autonomy"
  | "Power and Energy"
  | "Operating Environment"
  | "Safety and Compliance"
  | "Integration"
  | "Applications"
  | "Resources";

export type HorizontalView =
  | "Specifications"
  | "Configurations"
  | "Operating Principle"
  | "Components"
  | "Applications"
  | "Resources";

const VERTICAL_SUBJECTS: { id: VerticalSubject; label: string; icon: any }[] = [
  { id: "Overview", label: "Overview", icon: Layers },
  { id: "Physical Architecture", label: "Physical Architecture", icon: Cpu },
  { id: "Mobility", label: "Mobility", icon: Activity },
  { id: "Manipulation", label: "Manipulation", icon: Wrench },
  { id: "Payload and Performance", label: "Payload & Performance", icon: Zap },
  { id: "Sensors and Perception", label: "Sensors & Perception", icon: Search },
  { id: "Control System", label: "Control System", icon: Cpu },
  { id: "Autonomy", label: "Autonomy", icon: Sparkles },
  { id: "Power and Energy", label: "Power & Energy", icon: Zap },
  { id: "Operating Environment", label: "Operating Environment", icon: Layers },
  { id: "Safety and Compliance", label: "Safety & Compliance", icon: ShieldCheck },
  { id: "Integration", label: "Integration", icon: Filter },
  { id: "Applications", label: "Applications", icon: BookOpen },
  { id: "Resources", label: "Resources", icon: FileText },
];

const HORIZONTAL_VIEWS: { id: HorizontalView; label: string }[] = [
  { id: "Specifications", label: "Specifications" },
  { id: "Configurations", label: "Configurations" },
  { id: "Operating Principle", label: "Operating Principle" },
  { id: "Components", label: "Compatible Components" },
  { id: "Applications", label: "Deployed Applications" },
  { id: "Resources", label: "Standards & Docs" },
];

export function EngineeringSpecWorkspace({
  initialSubcategoryId,
  onBackToExplorer,
}: {
  initialSubcategoryId?: string;
  onBackToExplorer?: () => void;
}) {
  const allSubcats = getAllSubcategories();
  const [selectedSubcatId, setSelectedSubcatId] = useState<string>(
    initialSubcategoryId || allSubcats[0]?.id || "subcat:bipedal-humanoid"
  );
  const [activeSubject, setActiveSubject] = useState<VerticalSubject>("Overview");
  const [activeView, setActiveView] = useState<HorizontalView>("Specifications");
  const [specSearchQuery, setSpecSearchQuery] = useState<string>("");

  const currentSubcat = allSubcats.find((s) => s.id === selectedSubcatId) || allSubcats[0];
  const parentPillar = TOTAL_ROBOTICS_PILLARS.find((p) => p.id === currentSubcat.pillarId);

  // Filter specs by subject or show all if Overview is selected
  const filteredSpecs = currentSubcat.specifications.filter((spec) => {
    const matchesSubject = activeSubject === "Overview" || spec.subject === activeSubject;
    const matchesSearch =
      !specSearchQuery ||
      spec.parameter.toLowerCase().includes(specSearchQuery.toLowerCase()) ||
      spec.value.toLowerCase().includes(specSearchQuery.toLowerCase()) ||
      spec.unit.toLowerCase().includes(specSearchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Switcher Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border/60 bg-surface-dark p-6 text-surface-foreground shadow-xl lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {onBackToExplorer && (
              <button
                onClick={onBackToExplorer}
                className="text-signal hover:underline flex items-center gap-1 font-bold"
              >
                ← Back to Explorer
              </button>
            )}
            <span>/</span>
            <span>{parentPillar?.categoryNumber} {parentPillar?.title}</span>
            <span>/</span>
            <span className="text-signal font-bold">{currentSubcat.title}</span>
          </div>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
            {currentSubcat.title}
          </h2>

          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {currentSubcat.definition}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded bg-signal/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal">
              IFR: {currentSubcat.ifrClassification}
            </span>
            <span className="rounded bg-surface-elevated px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/40">
              Standard: {currentSubcat.isoStandardRef}
            </span>
          </div>
        </div>

        {/* Quick Robot Category Selector Dropdown */}
        <div className="shrink-0 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Select Robot Architecture:
          </label>
          <select
            value={currentSubcat.id}
            onChange={(e) => setSelectedSubcatId(e.target.value)}
            className="w-full rounded border border-border bg-surface-elevated px-3 py-2 text-xs font-bold text-foreground focus:border-signal focus:outline-none"
          >
            {TOTAL_ROBOTICS_PILLARS.map((p) => (
              <optgroup key={p.id} label={`${p.categoryNumber}. ${p.title}`}>
                {p.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Main Dual-Axis Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (3 cols): 14 Vertical Subjects Navigation */}
        <div className="lg:col-span-3 space-y-1">
          <div className="rounded-t-lg border border-b-0 border-border/60 bg-surface-elevated/70 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Engineering Subjects (14)
          </div>
          <div className="rounded-b-lg border border-border/60 bg-surface-dark p-2 space-y-1 shadow-lg">
            {VERTICAL_SUBJECTS.map((subj) => {
              const Icon = subj.icon;
              const isActive = activeSubject === subj.id;
              // Count specs for this subject
              const specCount = currentSubcat.specifications.filter((s) => s.subject === subj.id).length;

              return (
                <button
                  key={subj.id}
                  onClick={() => setActiveSubject(subj.id)}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-signal text-signal-foreground font-bold shadow-md"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={14} className={isActive ? "text-signal-foreground" : "text-signal"} />
                    <span>{subj.label}</span>
                  </span>
                  {specCount > 0 && (
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono ${
                        isActive ? "bg-signal-foreground/20 text-signal-foreground font-bold" : "bg-surface-elevated text-muted-foreground"
                      }`}
                    >
                      {specCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (9 cols): Horizontal View Switcher & Detailed Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Horizontal Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
            {HORIZONTAL_VIEWS.map((view) => {
              const isActive = activeView === view.id;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`rounded-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                    isActive
                      ? "border-signal text-signal bg-signal/10"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {view.label}
                </button>
              );
            })}
          </div>

          {/* VIEW 1: SPECIFICATIONS TABLE */}
          {activeView === "Specifications" && (
            <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xl space-y-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-border/40 pb-4">
                <div>
                  <h3 className="font-display text-base font-bold uppercase text-foreground">
                    {activeSubject === "Overview" ? "All Engineering Specifications" : `${activeSubject} Specifications`}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    SI parameter values backed by official ISO/IFR standards and manufacturer datasheets.
                  </p>
                </div>

                {/* Filter Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={specSearchQuery}
                    onChange={(e) => setSpecSearchQuery(e.target.value)}
                    placeholder="Filter parameters..."
                    className="w-full rounded border border-border bg-surface-elevated py-1.5 pl-8 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-signal focus:outline-none"
                  />
                </div>
              </div>

              {filteredSpecs.length === 0 ? (
                <div className="py-12 text-center">
                  <MinusCircle size={32} className="mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    No specifications registered under subject "{activeSubject}". Switch to "Overview" to see all parameters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs"
                    onClick={() => setActiveSubject("Overview")}
                  >
                    View All Specifications
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-surface-elevated/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Value</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Operating Conditions</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Source Citation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-mono">
                      {filteredSpecs.map((spec, i) => (
                        <tr key={i} className="hover:bg-surface-elevated/30 transition-colors">
                          <td className="py-3 px-3 font-sans font-semibold text-foreground">
                            {spec.parameter}
                            <span className="block text-[9px] font-mono text-muted-foreground mt-0.5">
                              {spec.applicableConfiguration}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-signal">{spec.value}</td>
                          <td className="py-3 px-3 text-muted-foreground">{spec.unit}</td>
                          <td className="py-3 px-3 font-sans text-xs text-muted-foreground">
                            {spec.operatingConditions}
                          </td>
                          <td className="py-3 px-3">
                            {spec.verificationStatus === "verified" ? (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            ) : spec.verificationStatus === "not-verified" ? (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                                <AlertTriangle size={10} /> Not verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-slate-500/15 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                                <MinusCircle size={10} /> N/A
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-sans text-[11px] text-muted-foreground">
                            {spec.source || "ISO 8373:2021 Reference"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: CONFIGURATIONS */}
          {activeView === "Configurations" && (
            <div className="space-y-4">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Available Architectural Configurations
                </h3>
                <p className="text-xs text-muted-foreground">
                  Typical modular configurations, engineering trade-offs, and payload adaptations.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentSubcat.configurations.map((cfg) => (
                  <div
                    key={cfg.configId}
                    className="rounded-lg border border-border/60 bg-card p-5 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-signal/15 px-2 py-0.5 text-[10px] font-mono font-bold text-signal">
                        {cfg.configId}
                      </span>
                      <span className="text-xs font-bold text-foreground">{cfg.targetPayload}</span>
                    </div>

                    <h4 className="font-display text-base font-bold text-foreground">
                      {cfg.configName}
                    </h4>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cfg.description}
                    </p>

                    <div className="border-t border-border/40 pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Drivetrain:</span>
                        <span className="font-semibold text-foreground text-right">{cfg.primaryDrivetrain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Power Source:</span>
                        <span className="font-semibold text-foreground text-right">{cfg.powerSource}</span>
                      </div>
                      <div className="pt-2 text-[11px] text-amber-400/90 font-medium bg-amber-500/10 p-2 rounded">
                        ⚠ Engineering Trade-off: {cfg.keyTradeoff}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: OPERATING PRINCIPLE */}
          {activeView === "Operating Principle" && (
            <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xl space-y-6">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Kinematic &amp; Control Operating Principle
                </h3>
                <p className="text-xs text-muted-foreground">
                  Mathematical formulation, sensor fusion pipeline, and control loop execution rates.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                    <Layers size={13} /> Kinematic Structure
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground bg-surface-elevated/40 p-3 rounded border border-border/40">
                    {currentSubcat.operatingPrinciple.kinematicChain}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                    <Cpu size={13} /> Actuation Technology
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground bg-surface-elevated/40 p-3 rounded border border-border/40">
                    {currentSubcat.operatingPrinciple.actuationTechnology}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                    <Activity size={13} /> Control Frequencies &amp; Latency
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground bg-surface-elevated/40 p-3 rounded border border-border/40">
                    {currentSubcat.operatingPrinciple.controlLoopFrequency}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-signal flex items-center gap-1.5">
                    <Search size={13} /> Sensor Fusion Pipeline
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground bg-surface-elevated/40 p-3 rounded border border-border/40">
                    {currentSubcat.operatingPrinciple.sensorFusionPipeline}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Mathematical Foundation &amp; Dynamics
                </h4>
                <div className="font-mono text-xs bg-surface-elevated/70 p-3 rounded border border-border/60 text-emerald-400">
                  {currentSubcat.operatingPrinciple.mathematicalFoundation}
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Failsafe &amp; Emergency Stop Mechanics
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentSubcat.operatingPrinciple.failureModesAndFailsafes}
                </p>
              </div>
            </div>
          )}

          {/* VIEW 4: COMPATIBLE CATALOGUE COMPONENTS */}
          {activeView === "Components" && (
            <div className="space-y-4">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Connected Product Catalogue Components
                </h3>
                <p className="text-xs text-muted-foreground">
                  Traceable linkages to real INDUS motion reducers, servomotors, sensors, and controllers. No invented compatibility.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentSubcat.compatibleComponents.map((comp) => (
                  <div
                    key={comp.componentId}
                    className="rounded-lg border border-border/60 bg-card p-5 shadow-lg space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-surface-elevated px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border/40">
                          {comp.lineId}
                        </span>
                        <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {comp.relationshipType}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold text-foreground">
                        {comp.name}
                      </h4>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {comp.notes}
                      </p>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-none border-border font-bold uppercase text-xs mt-2 w-full"
                    >
                      <Link to="/products/precision-reducers">
                        Inspect Component Specs <ArrowRight size={13} className="ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: APPLICATIONS */}
          {activeView === "Applications" && (
            <div className="space-y-4">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Verified Industrial Deployment Verticals
                </h3>
                <p className="text-xs text-muted-foreground">
                  Target industries where this kinematic architecture delivers primary operational value.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentSubcat.applications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="rounded-lg border border-border/60 bg-card p-5 shadow-lg space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-signal/15 px-2 py-0.5 text-[10px] font-bold uppercase text-signal">
                          {app.domain}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold text-foreground">
                        {app.name}
                      </h4>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {app.deploymentNotes}
                      </p>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-none border-border font-bold uppercase text-xs mt-2 w-full"
                    >
                      <Link to={`/applications/${app.applicationId}`}>
                        Explore Application Workcell <ArrowRight size={13} className="ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 6: RESOURCES */}
          {activeView === "Resources" && (
            <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xl space-y-4">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Technical Documentation &amp; Standards
                </h3>
                <p className="text-xs text-muted-foreground">
                  Governing international standards, kinematic sizing whitepapers, and CAD reference files.
                </p>
              </div>

              <div className="space-y-3">
                {currentSubcat.resources.map((res, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-border/60 bg-surface-elevated/30 p-4 hover:border-signal/50 transition-all"
                  >
                    <div>
                      <span className="rounded bg-surface-elevated px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-signal border border-border/40">
                        {res.type}
                      </span>
                      <h4 className="font-display text-sm font-bold text-foreground mt-1">
                        {res.title}
                      </h4>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Reference: {res.referenceId}
                      </p>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-none border-border font-bold uppercase text-xs"
                    >
                      <Link to="/resources">
                        <ExternalLink size={12} className="mr-1.5 text-signal" />
                        View Document
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
