import React, { useState } from "react";
import type { BookingFormData } from "@/types/consultation";
import {
  OPERATING_ENVIRONMENTS,
  ACCURACY_OPTIONS,
  PRODUCTION_SHIFTS,
  BUDGET_RANGES,
  IMPLEMENTATION_TIMELINES,
} from "@/data/robotics-consultation";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileCheck,
  X,
  HelpCircle,
  AlertCircle,
  Flame,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TechnicalSpecsStepProps {
  formData: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TechnicalSpecsStep({ formData, updateForm, onNext, onBack }: TechnicalSpecsStepProps) {
  const [fileError, setFileError] = useState<string | null>(null);

  const isWelding = formData.robotCategory === "Welding robots" ||
    (formData.specificApplication && /weld/i.test(formData.specificApplication));

  const isPalletizing = formData.robotCategory === "Palletizing and depalletizing robots" ||
    (formData.specificApplication && /pallet/i.test(formData.specificApplication));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File exceeds 10MB limit. Please upload a smaller document or CAD drawing.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = typeof reader.result === "string" ? reader.result : "";
      updateForm({
        attachmentName: file.name,
        attachmentSize: file.size,
        attachmentType: file.type,
        attachmentData: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    updateForm({
      attachmentName: undefined,
      attachmentSize: undefined,
      attachmentType: undefined,
      attachmentData: undefined,
    });
  };

  const isComplete = Boolean(
    formData.projectDescription.trim().length >= 10 &&
    formData.materialHandled.trim() &&
    formData.operatingEnvironment &&
    formData.implementationTimeline,
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal">
          <span>Step 02 / 04</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Kinematic & Operational Parameters</span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
          Define Technical Requirements & Specifications
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Provide your engineering targets. Advanced fields are optional if you require INDUS application
          engineers to calculate sizing, thermal margins, and cycle times during the consultation.
        </p>
      </div>

      {/* 1. Project Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Project / Application Overview <span className="text-signal">*</span>
          </Label>
          <span className="text-[11px] text-muted-foreground">
            {formData.projectDescription.length} / 3000 chars (min 10)
          </span>
        </div>
        <Textarea
          rows={4}
          value={formData.projectDescription}
          onChange={(e) => updateForm({ projectDescription: e.target.value })}
          placeholder="Describe the manufacturing or handling process: current manual or automated method, bottlenecks, spatial constraints, line speed targets, or specific kinematic challenges..."
          className="bg-card border-border text-foreground text-xs leading-relaxed"
        />
      </div>

      {/* 2. Material Handled & Operating Environment */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Material or Product Being Handled <span className="text-signal">*</span>
          </Label>
          <Input
            value={formData.materialHandled}
            onChange={(e) => updateForm({ materialHandled: e.target.value })}
            placeholder="e.g. Stamped steel body panels, silicon wafers, corrugated cartons, frozen meat"
            className="bg-card border-border text-foreground text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Operating Environment <span className="text-signal">*</span>
          </Label>
          <select
            value={formData.operatingEnvironment}
            onChange={(e) => updateForm({ operatingEnvironment: e.target.value as any })}
            className="w-full h-10 border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:border-signal"
          >
            <option value="">Select Operating Environment</option>
            {OPERATING_ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Engineering Kinematic Metrics (Optional / Sizing) */}
      <div className="rounded-none border border-border bg-card/60 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h3 className="font-display text-sm font-bold uppercase text-foreground">
              Kinematic & Sizing Parameters
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Optional if unknown — leave blank and our application engineering team will size the solution.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-signal bg-signal/10 px-2 py-1">
            Engineering Sizing
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Required Payload (kg)</span>
              <span className="text-[10px] text-signal/80">Optional</span>
            </Label>
            <Input
              value={formData.payloadKg}
              onChange={(e) => updateForm({ payloadKg: e.target.value })}
              placeholder="e.g. 15 kg (or 'Unsure')"
              className="bg-background border-border text-foreground text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Required Reach (mm)</span>
              <span className="text-[10px] text-signal/80">Optional</span>
            </Label>
            <Input
              value={formData.reachMm}
              onChange={(e) => updateForm({ reachMm: e.target.value })}
              placeholder="e.g. 1400 mm"
              className="bg-background border-border text-foreground text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Target Cycle Time (s)</span>
              <span className="text-[10px] text-signal/80">Optional</span>
            </Label>
            <Input
              value={formData.cycleTimeSec}
              onChange={(e) => updateForm({ cycleTimeSec: e.target.value })}
              placeholder="e.g. 4.2 sec/cycle"
              className="bg-background border-border text-foreground text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Required Repeatability / Accuracy</Label>
            <select
              value={formData.accuracyRequirement}
              onChange={(e) => updateForm({ accuracyRequirement: e.target.value as any })}
              className="w-full h-10 border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-signal"
            >
              <option value="">Select Accuracy (if known)</option>
              {ACCURACY_OPTIONS.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Production Shifts / Duty Cycle</Label>
            <select
              value={formData.productionShifts}
              onChange={(e) => updateForm({ productionShifts: e.target.value as any })}
              className="w-full h-10 border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-signal"
            >
              <option value="">Select Shift Duty Cycle</option>
              {PRODUCTION_SHIFTS.map((sh) => (
                <option key={sh} value={sh}>
                  {sh}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Conditional Engineering Questions */}
      {isWelding && (
        <div className="rounded-none border border-signal/50 bg-signal/5 p-5 space-y-4">
          <div className="flex items-center gap-2 text-signal font-bold uppercase text-xs tracking-wider">
            <Flame size={16} />
            <span>Welding Application Specifics</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground">Welding Process</Label>
              <Input
                value={formData.weldingProcess || ""}
                onChange={(e) => updateForm({ weldingProcess: e.target.value })}
                placeholder="e.g. MIG/MAG (GMAW), TIG (GTAW), Laser, Spot Resistance"
                className="bg-card border-border text-foreground text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground">Shielding Gas / Wire Specs</Label>
              <Input
                value={formData.shieldingGas || ""}
                onChange={(e) => updateForm({ shieldingGas: e.target.value })}
                placeholder="e.g. Ar/CO2 80/20, 1.2mm solid wire, water-cooled torch"
                className="bg-card border-border text-foreground text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {isPalletizing && (
        <div className="rounded-none border border-signal/50 bg-signal/5 p-5 space-y-4">
          <div className="flex items-center gap-2 text-signal font-bold uppercase text-xs tracking-wider">
            <Layers size={16} />
            <span>Palletizing Cell Specifics</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground">Pallet Format & Dimensions</Label>
              <Input
                value={formData.palletDimensions || ""}
                onChange={(e) => updateForm({ palletDimensions: e.target.value })}
                placeholder="e.g. Euro (1200x800mm), Industrial (1200x1000mm), Max height 1800mm"
                className="bg-card border-border text-foreground text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground">Infeed Rate / Throughput</Label>
              <Input
                value={formData.palletThroughput || ""}
                onChange={(e) => updateForm({ palletThroughput: e.target.value })}
                placeholder="e.g. 24 cartons/minute, single or multi-lane infeed"
                className="bg-card border-border text-foreground text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Integration, Budget, & Timeline */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-3">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Existing Equipment & Fieldbus / PLC Standards
          </Label>
          <Input
            value={formData.existingEquipment}
            onChange={(e) => updateForm({ existingEquipment: e.target.value })}
            placeholder="e.g. Siemens S7-1500 (PROFINET), Rockwell ControlLogix (EtherNet/IP), CNC Fanuc 31i, Beckhoff EtherCAT"
            className="bg-card border-border text-foreground text-xs font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Project Budget Range (Optional)
          </Label>
          <select
            value={formData.projectBudget}
            onChange={(e) => updateForm({ projectBudget: e.target.value as any })}
            className="w-full h-10 border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:border-signal"
          >
            <option value="">Undetermined / Flexible</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Expected Implementation Timeline <span className="text-signal">*</span>
          </Label>
          <select
            value={formData.implementationTimeline}
            onChange={(e) => updateForm({ implementationTimeline: e.target.value as any })}
            className="w-full h-10 border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:border-signal"
          >
            <option value="">Select Implementation Horizon</option>
            {IMPLEMENTATION_TIMELINES.map((tl) => (
              <option key={tl} value={tl}>
                {tl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Optional File Upload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Upload Layout Drawings, Part CAD, or Specifications (Optional)
          </Label>
          <span className="text-[11px] text-muted-foreground">PDF, STEP, DWG, PNG, JPG (Max 10MB)</span>
        </div>

        {formData.attachmentName ? (
          <div className="flex items-center justify-between border border-signal bg-signal/10 p-3">
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-signal" />
              <span className="text-xs font-mono text-foreground">{formData.attachmentName}</span>
              {formData.attachmentSize && (
                <span className="text-[10px] text-muted-foreground">
                  ({(formData.attachmentSize / 1024).toFixed(0)} KB)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-signal/60 bg-card/40 p-6 text-center cursor-pointer transition-colors">
            <Upload size={22} className="text-muted-foreground mb-2" />
            <span className="text-xs font-bold uppercase text-foreground">Click to upload or drag files</span>
            <span className="text-[11px] text-muted-foreground mt-1">Part drawings, cell envelope sketches, or tender RFQs</span>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.step,.stp,.dwg,.dxf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />
          </label>
        )}

        {fileError && (
          <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle size={13} />
            <span>{fileError}</span>
          </p>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-none border-border text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={14} className="mr-2" />
          Back: Industry Scope
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className="rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 disabled:opacity-50"
        >
          Next: Customer Information
          <ArrowRight size={14} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
