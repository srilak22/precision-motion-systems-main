import React from "react";
import {
  INDUSTRIES,
  ROBOT_CATEGORIES,
  PROJECT_STAGES,
  PREFERRED_SOLUTIONS,
} from "@/data/robotics-consultation";
import type {
  IndustryCategory,
  RobotCategory,
  ProjectStage,
  PreferredSolution,
  BookingFormData,
} from "@/types/consultation";
import {
  Car,
  Cpu,
  Utensils,
  Pill,
  Boxes,
  Package,
  Flame,
  Scissors,
  Sprout,
  Plane,
  Cog,
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IndustryRobotStepProps {
  formData: BookingFormData;
  updateForm: (updates: Partial<BookingFormData>) => void;
  onNext: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Car,
  Cpu,
  Utensils,
  Pill,
  Boxes,
  Package,
  Flame,
  Scissors,
  Sprout,
  Plane,
  Cog,
  Compass,
};

export function IndustryRobotStep({ formData, updateForm, onNext }: IndustryRobotStepProps) {
  const selectedIndustryMeta = INDUSTRIES.find((ind) => ind.id === formData.industry);
  const recommendedSet = new Set(selectedIndustryMeta?.recommendedRobots || []);

  const handleIndustrySelect = (industryId: IndustryCategory) => {
    const meta = INDUSTRIES.find((i) => i.id === industryId);
    const defaultApp = meta?.commonApplications[0] || "";
    // If the currently selected robot is not recommended, select the first recommended or keep
    const recommendedRobot = meta?.recommendedRobots[0] || "Articulated robotic arms";

    updateForm({
      industry: industryId,
      specificApplication: defaultApp,
      robotCategory: formData.robotCategory || recommendedRobot,
    });
  };

  const handleRobotSelect = (robotId: RobotCategory) => {
    updateForm({ robotCategory: robotId });
  };

  const handleStageSelect = (stage: ProjectStage) => {
    updateForm({ projectStage: stage });
  };

  const handleSolutionSelect = (sol: PreferredSolution) => {
    updateForm({ preferredSolution: sol });
  };

  const isComplete = Boolean(
    formData.industry &&
    formData.robotCategory &&
    formData.specificApplication.trim() &&
    formData.projectStage &&
    formData.preferredSolution,
  );

  return (
    <div className="space-y-10">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal">
          <span>Step 01 / 04</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Application Sizing & Scope</span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
          Select Your Industry & Robotics Requirement
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Robot selections are treated as engineering consultation requirements. Our robotics architects
          will review kinematic feasibility, required reach, payload rating, and cycle times.
        </p>
      </div>

      {/* 1. Industry Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Target Industry Category <span className="text-signal">*</span>
          </Label>
          <span className="text-[11px] text-muted-foreground">Select one industry</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIES.map((ind) => {
            const Icon = ICON_MAP[ind.iconName] || Cog;
            const isSelected = formData.industry === ind.id;

            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => handleIndustrySelect(ind.id)}
                className={`group relative flex flex-col justify-between p-4 text-left transition-all border ${
                  isSelected
                    ? "border-signal bg-signal/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "border-border bg-card/60 hover:border-border/80 hover:bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-none border ${
                        isSelected
                          ? "border-signal bg-signal text-signal-foreground"
                          : "border-border/60 bg-muted/40 text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon size={17} />
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={16} className="text-signal" />
                    )}
                  </div>
                  <h4 className="mt-3 font-display text-sm font-bold uppercase text-foreground leading-snug">
                    {ind.shortName}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                    {ind.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Specific Application Presets */}
      {selectedIndustryMeta && (
        <div className="rounded-none border border-border/80 bg-surface-dark/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Specific Application for {selectedIndustryMeta.shortName} <span className="text-signal">*</span>
            </Label>
            <span className="text-[11px] text-signal font-medium">Click a preset or customize</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedIndustryMeta.commonApplications.map((app) => {
              const isSelected = formData.specificApplication === app;
              return (
                <button
                  key={app}
                  type="button"
                  onClick={() => updateForm({ specificApplication: app })}
                  className={`rounded-none px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-all border ${
                    isSelected
                      ? "border-signal bg-signal text-signal-foreground font-bold"
                      : "border-border bg-card text-muted-foreground hover:border-signal/50 hover:text-foreground"
                  }`}
                >
                  {app}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <Input
              value={formData.specificApplication}
              onChange={(e) => updateForm({ specificApplication: e.target.value })}
              placeholder="Or type custom application (e.g. End-of-arm dual gripper palletizing cell)"
              className="bg-card border-border text-foreground text-xs"
            />
          </div>
        </div>
      )}

      {/* 3. Robot & Automation Category */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Type of Robot or Automation Solution Required <span className="text-signal">*</span>
          </Label>
          {selectedIndustryMeta && (
            <span className="flex items-center gap-1.5 text-[11px] text-signal font-semibold">
              <Sparkles size={12} />
              Recommended categories highlighted for {selectedIndustryMeta.shortName}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROBOT_CATEGORIES.map((robot) => {
            const isSelected = formData.robotCategory === robot.id;
            const isRecommended = recommendedSet.has(robot.id);
            const isGuidance = robot.id === "Not sure, recommend a solution";

            return (
              <button
                key={robot.id}
                type="button"
                onClick={() => handleRobotSelect(robot.id)}
                className={`group relative flex flex-col justify-between p-4 text-left transition-all border ${
                  isSelected
                    ? "border-signal bg-signal/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-signal"
                    : isRecommended
                    ? "border-signal/40 bg-card/80 hover:border-signal hover:bg-card"
                    : isGuidance
                    ? "border-primary/50 bg-primary/5 hover:border-primary"
                    : "border-border bg-card/60 hover:border-border/80 hover:bg-card"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        isSelected
                          ? "bg-signal text-signal-foreground"
                          : isRecommended
                          ? "bg-signal/20 text-signal border border-signal/30"
                          : isGuidance
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isRecommended && !isGuidance ? "Recommended" : robot.badge}
                    </span>
                    {isSelected && <CheckCircle2 size={16} className="text-signal shrink-0" />}
                  </div>

                  <h4 className="mt-2.5 font-display text-sm font-bold uppercase text-foreground leading-snug">
                    {robot.title}
                  </h4>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {robot.description}
                  </p>
                </div>

                <div className="mt-3 border-t border-border/40 pt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Payload: <strong className="text-foreground">{robot.typicalPayload}</strong></span>
                  <span>Reach: <strong className="text-foreground">{robot.typicalReach}</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Project Stage & Solution Type */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Project Stage */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Current Project Stage <span className="text-signal">*</span>
          </Label>
          <div className="space-y-2">
            {PROJECT_STAGES.map((stg) => {
              const isSelected = formData.projectStage === stg.value;
              return (
                <button
                  key={stg.value}
                  type="button"
                  onClick={() => handleStageSelect(stg.value)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-all border ${
                    isSelected
                      ? "border-signal bg-signal/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? "border-signal bg-signal text-signal-foreground" : "border-muted-foreground/40"
                  }`}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-foreground leading-none">
                      {stg.label}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {stg.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Solution Type */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-wider text-foreground">
            Preferred Solution Scope <span className="text-signal">*</span>
          </Label>
          <div className="space-y-2">
            {PREFERRED_SOLUTIONS.map((sol) => {
              const isSelected = formData.preferredSolution === sol.value;
              return (
                <button
                  key={sol.value}
                  type="button"
                  onClick={() => handleSolutionSelect(sol.value)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-all border ${
                    isSelected
                      ? "border-signal bg-signal/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? "border-signal bg-signal text-signal-foreground" : "border-muted-foreground/40"
                  }`}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-foreground leading-none">
                      {sol.label}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {sol.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engineering Disclaimers Banner */}
      <div className="flex items-start gap-3 border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground">
        <Info size={16} className="text-signal shrink-0 mt-0.5" />
        <p>
          INDUS robotics engineering evaluates each consultation individually based on line ergonomics, cycle time,
          and payload requirements. Selections here guide our engineering preparation for your consultation session.
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className="rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 disabled:opacity-50"
        >
          Next: Technical Specifications
          <ArrowRight size={14} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
