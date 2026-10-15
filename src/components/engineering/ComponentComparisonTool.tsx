import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Scale,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  engineeringDossiers,
  getAllEngineeringDossiers,
  type EngineeringProductDossier,
} from "@/data/engineeringData";
import { products, type Product } from "@/data/robotics";
import { useModals } from "@/components/modals/ModalContext";

const COMPARISON_PRESETS = [
  {
    name: "Precision Reducers: Strain Wave vs Cycloidal vs Planetary",
    ids: ["harmonic", "cycloidal", "planetary"],
  },
  {
    name: "Actuators: Linear Slide vs Electric Cylinder vs Servo Actuator",
    ids: ["linear", "electric", "servo"],
  },
  {
    name: "Robotic Arms: 6-Axis vs SCARA vs Cobot",
    ids: ["6-axis", "4-axis", "collaborative"],
  },
  {
    name: "Mobile Robotics: In-Hub Wheel vs Mecanum vs Swerve Module",
    ids: ["drive", "mecanum", "mobile-modules"],
  },
];

export function ComponentComparisonTool() {
  const { openModal } = useModals();
  const allDossiers = getAllEngineeringDossiers();

  const [selectedIds, setSelectedIds] = useState<string[]>([
    "harmonic",
    "cycloidal",
    "planetary",
  ]);

  const handleAddComponent = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveComponent = (id: string) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const handleApplyPreset = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const activeDossiers: EngineeringProductDossier[] = selectedIds
    .map((id) => engineeringDossiers[id])
    .filter(Boolean);

  return (
    <div className="w-full space-y-8">
      {/* Header Panel */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded bg-signal/15 text-signal font-mono font-bold text-xs">
                CMP
              </span>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-signal">
                Side-by-Side Technical Comparison Matrix
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
              Component Specification Comparator
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Compare 2 to 4 components across verified ratings, mechanical constraints, interfaces, and limitations.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Technical Comparison Presets
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMPARISON_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.ids)}
                  className="rounded border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
                >
                  {preset.name.split(":")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Component Selector Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Comparing ({selectedIds.length}/4 max):
          </span>

          {activeDossiers.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 text-xs font-semibold text-foreground"
            >
              <span className="font-mono text-signal">{d.modelIdentifier}</span>
              <span className="text-muted-foreground font-normal">| {d.componentType.split(" ")[0]}</span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemoveComponent(d.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${d.modelIdentifier}`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}

          {/* Add Component Dropdown if < 4 */}
          {selectedIds.length < 4 && (
            <div className="relative inline-block">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddComponent(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="h-8 rounded border border-border bg-muted/40 px-3 text-xs font-semibold text-foreground hover:bg-muted focus:outline-hidden"
                defaultValue=""
              >
                <option value="" disabled>
                  + Add Component to Compare...
                </option>
                {allDossiers
                  .filter((d) => !selectedIds.includes(d.id))
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.categorySlug.toUpperCase()}] {d.modelIdentifier} — {d.componentType}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 font-bold uppercase tracking-wider text-muted-foreground w-1/4">
                Engineering Dimension
              </th>
              {activeDossiers.map((d) => (
                <th key={d.id} className="p-4 font-bold uppercase tracking-wider text-foreground min-w-[240px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[.2em] text-signal">
                        {d.categorySlug}
                      </span>
                      <p className="font-display text-base font-bold uppercase mt-0.5">{d.modelIdentifier}</p>
                      <p className="text-[11px] text-muted-foreground font-normal mt-0.5">{d.componentType}</p>
                    </div>
                    {selectedIds.length > 2 && (
                      <button
                        onClick={() => handleRemoveComponent(d.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Remove column"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-[11px]">
            {/* Row 1: Verification Status & Datasheet */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Verification Status</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4">
                  <span className="inline-flex items-center gap-1 rounded bg-signal/15 px-2 py-0.5 text-[10px] font-mono font-bold text-signal uppercase">
                    <CheckCircle2 size={11} /> {d.datasheet.verificationLevel}
                  </span>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    Ref: {d.datasheet.documentNumber} ({d.datasheet.revision})
                  </p>
                </td>
              ))}
            </tr>

            {/* Row 2: Traceable Lab Source */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Traceable Test Source</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 font-mono text-muted-foreground">
                  {d.datasheet.traceableSource}
                </td>
              ))}
            </tr>

            {/* Row 3: Primary Key Parameters */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10 align-top">
                Key Performance Parameters
              </td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 align-top space-y-2">
                  {d.parameters.slice(0, 4).map((p) => (
                    <div key={p.name} className="border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-muted-foreground">{p.name}:</span>
                        <span className="font-bold text-foreground">
                          {p.value} {p.unit || ""}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/80">{p.conditions}</p>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Row 4: Mechanical Interface Standard */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Mechanical Mounting</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4">
                  <p className="font-semibold text-foreground">{d.mechanicalMounting.flangeStandard}</p>
                  <p className="text-muted-foreground mt-0.5">{d.mechanicalMounting.boltPattern}</p>
                  <p className="text-[10px] text-signal font-mono mt-1">
                    Max Overhung Load: {d.mechanicalMounting.maxOverhungLoad}
                  </p>
                </td>
              ))}
            </tr>

            {/* Row 5: Electrical Supply & Motor Requirements */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Electrical & Drive Requirements</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 space-y-1">
                  <p className="font-mono text-foreground font-semibold">
                    Supply: {d.electricalRequirements.supplyVoltage}
                  </p>
                  <p className="text-muted-foreground">
                    Rated/Peak: {d.electricalRequirements.ratedCurrent} / {d.electricalRequirements.peakCurrent}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Feedback: {d.electricalRequirements.feedbackInterface}
                  </p>
                </td>
              ))}
            </tr>

            {/* Row 6: Fieldbuses & Communication */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Control & Fieldbuses</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {d.controlAndCommunication.fieldbuses.map((bus) => (
                      <span
                        key={bus}
                        className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[9px] text-foreground"
                      >
                        {bus}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                    Loop Cycle: {d.controlAndCommunication.cycleTime}
                  </p>
                </td>
              ))}
            </tr>

            {/* Row 7: Protection & Environment */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Environmental Constraints</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 font-mono text-muted-foreground">
                  <p className="font-semibold text-foreground">Rating: {d.environmentalAndSafety.ipRating}</p>
                  <p>Operating: {d.environmentalAndSafety.operatingTemp}</p>
                  <p>Storage: {d.environmentalAndSafety.storageTemp}</p>
                </td>
              ))}
            </tr>

            {/* Row 8: Ideal Production Tasks */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10 align-top">Ideal Applications</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 align-top">
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {d.useCases.slice(0, 3).map((uc) => (
                      <li key={uc}>{uc}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Row 9: Operating Limitations & Unsuitable */}
            <tr className="hover:bg-muted/15">
              <td className="p-4 font-semibold text-foreground bg-muted/10 align-top">
                Operating Limitations & Boundaries
              </td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 align-top">
                  <ul className="list-disc pl-4 space-y-1 text-amber-700 dark:text-amber-400">
                    {d.unsuitableApplications.slice(0, 2).map((un) => (
                      <li key={un}>{un}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Row 10: Actions */}
            <tr className="bg-muted/20">
              <td className="p-4 font-semibold text-foreground bg-muted/10">Actions & RFQ</td>
              {activeDossiers.map((d) => (
                <td key={d.id} className="p-4 space-y-2">
                  <Link
                    to="/products/$category/$id"
                    params={{ category: d.categorySlug, id: d.id }}
                    className="w-full inline-flex items-center justify-center h-8 rounded border border-border bg-background hover:bg-muted text-xs font-bold uppercase text-foreground transition-colors"
                  >
                    View Product Page
                  </Link>
                  <Button
                    size="sm"
                    className="w-full h-8 rounded bg-signal text-signal-foreground font-bold uppercase text-[11px]"
                    onClick={() =>
                      openModal("quote", {
                        productName: `${d.componentType} (${d.modelIdentifier})`,
                        categoryName: d.categorySlug,
                      })
                    }
                  >
                    Request Quote <ArrowRight size={12} className="ml-1" />
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
