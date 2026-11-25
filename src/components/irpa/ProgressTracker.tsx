import React from "react";
import { Check, ChevronRight } from "lucide-react";

export interface StepInfo {
  number: number;
  id: string;
  title: string;
  shortTitle: string;
}

export const ASSESSMENT_STEPS: StepInfo[] = [
  { number: 1, id: "register", title: "Company Registration", shortTitle: "Company" },
  { number: 2, id: "factory", title: "Factory Profile", shortTitle: "Factory" },
  { number: 3, id: "industry", title: "Industry Selection", shortTitle: "Industry" },
  { number: 4, id: "production", title: "Production Automation", shortTitle: "Production" },
  { number: 5, id: "robotics_handling", title: "Robotics & Material Handling", shortTitle: "Robotics" },
  { number: 6, id: "quality_machine", title: "Quality & Machine Automation", shortTitle: "Quality" },
  { number: 7, id: "maintenance_safety", title: "Maintenance & Safety", shortTitle: "Safety" },
  { number: 8, id: "iot_control", title: "IoT, PLC & Control Systems", shortTitle: "IoT & PLC" },
  { number: 9, id: "mes_digital_twin", title: "MES, AI & Digital Twin", shortTitle: "MES & AI" },
  { number: 10, id: "workforce", title: "Workforce & Digital Readiness", shortTitle: "Workforce" },
  { number: 11, id: "target_state", title: "Target State Definition", shortTitle: "Targets" },
  { number: 12, id: "review_submit", title: "Review & Submission", shortTitle: "Review" },
];

interface ProgressTrackerProps {
  currentStep: number; // 1 to 12
  completedSteps: number[]; // e.g. [1, 2]
  totalQuestions: number;
  answeredQuestions: number;
  onStepClick?: (stepNumber: number) => void;
}

export function ProgressTracker({
  currentStep,
  completedSteps,
  totalQuestions,
  answeredQuestions,
  onStepClick,
}: ProgressTrackerProps) {
  const percentage =
    totalQuestions > 0
      ? Math.min(100, Math.round((answeredQuestions / totalQuestions) * 100))
      : Math.round(((currentStep - 1) / 12) * 100);

  return (
    <div className="w-full bg-[#0B132B] border-b border-slate-800/80 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2.5">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">
              Step {currentStep} of 12:
            </span>
            <span className="text-cyan-400 font-medium">
              {ASSESSMENT_STEPS[currentStep - 1]?.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {totalQuestions > 0 && (
              <div>
                <span className="text-slate-200 font-semibold">{answeredQuestions}</span> of{" "}
                <span>{totalQuestions}</span> questions evaluated
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">{percentage}%</span>
              <span className="text-slate-500">Completed</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Horizontal Step Stepper Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {ASSESSMENT_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.number);
            const isCurrent = step.number === currentStep;
            const isClickable = onStepClick && (isCompleted || step.number <= currentStep);

            return (
              <button
                type="button"
                key={step.number}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 transition-all font-medium ${
                  isCurrent
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-semibold shadow-sm"
                    : isCompleted
                    ? "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 cursor-pointer"
                    : "text-slate-500 border border-transparent cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? "bg-cyan-400 text-slate-950"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : step.number}
                </div>
                <span>{step.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
