import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  Download,
  Share2,
  ExternalLink,
  Bot,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssessmentSubmittedScreenProps {
  referenceId: string;
  factoryName: string;
  companyName: string;
  submittedAt: string;
  overallCurrentScore: number;
  overallTargetScore: number;
  onViewConsultantPortal?: () => void;
  onStartNew?: () => void;
}

export function AssessmentSubmittedScreen({
  referenceId,
  factoryName,
  companyName,
  submittedAt,
  overallCurrentScore,
  overallTargetScore,
  onViewConsultantPortal,
  onStartNew,
}: AssessmentSubmittedScreenProps) {
  const gap = Math.max(0, overallTargetScore - overallCurrentScore);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Success Badge & Title */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-2xl shadow-emerald-500/20">
          <div className="w-full h-full bg-[#0B132B] rounded-[22px] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[2.5]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Assessment Transmitted</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Gap Analysis Successfully Submitted
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Your factory capability assessment has been securely indexed and queued for verification by INDUS Industrial Robotics automation engineers.
        </p>

        {/* Reference Identification Code */}
        <div className="inline-block p-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-center">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Official Reference ID
          </div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wider">
            {referenceId}
          </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Current Factory Baseline
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">
            {overallCurrentScore.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Level 0–5 Scale</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Target Automation Goal
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {overallTargetScore.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Desired Horizon</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-center bg-gradient-to-br from-slate-900 to-cyan-950/30">
          <div className="text-xs text-cyan-300 uppercase tracking-wider mb-1">
            Identified Capability Gap
          </div>
          <div className="text-3xl font-black text-white font-mono">
            +{gap.toFixed(2)}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">Automation Delta</div>
        </div>
      </div>

      {/* Next Steps Roadmap */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl mb-10 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Next Steps in the IRPA Advisory Process</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div className="text-xs font-bold text-slate-200">
              Consultant Evidence Audit
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Our automation team verifies your answers against attached SOPs and shopfloor equipment data.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div className="text-xs font-bold text-slate-200">
              Formal Gap Analysis Report
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Generation of the comprehensive 12-domain report with root-cause analysis and industry benchmark comparisons.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div className="text-xs font-bold text-slate-200">
              Robotics Workcell Roadmap
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Turnkey INDUS robotic cell proposals with 3D layout simulation, cycle time targets, and payback models.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={`/irpa-gap-analysis/analytics/${referenceId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold px-7 py-3 rounded-xl shadow-xl shadow-emerald-950/40 text-xs sm:text-sm transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2 text-cyan-200" />
          <span>View Phase 3 Intelligence &amp; Analytics Dashboard</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>

        {onViewConsultantPortal && (
          <Button
            type="button"
            onClick={onViewConsultantPortal}
            variant="outline"
            className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm"
          >
            <span>Consultant Portal</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => window.print()}
          className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Download className="w-4 h-4 mr-2" />
          <span>Save PDF / Print Summary</span>
        </Button>

        {onStartNew && (
          <Button
            type="button"
            variant="ghost"
            onClick={onStartNew}
            className="w-full sm:w-auto text-slate-400 hover:text-white"
          >
            <span>Start Another Plant Assessment</span>
          </Button>
        )}
      </div>
    </div>
  );
}
