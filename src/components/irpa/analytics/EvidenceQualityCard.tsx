import React from "react";
import { ShieldCheck, FileCheck, AlertTriangle, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ContradictionItem {
  id: string;
  severity: string;
  title: string;
  description: string;
  suggestedAction: string;
}

interface EvidenceQualityData {
  totalQuestionsEvaluated: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  selfReportedCount: number;
  missingEvidenceCount: number;
  overallConfidencePercentage: number;
  contradictionsDetected: ContradictionItem[];
  hasContradictions: boolean;
  evidenceQualityRating: string;
}

interface EvidenceQualityCardProps {
  evidenceQuality: EvidenceQualityData;
}

export function EvidenceQualityCard({ evidenceQuality }: EvidenceQualityCardProps) {
  const {
    totalQuestionsEvaluated,
    verifiedCount,
    partiallyVerifiedCount,
    selfReportedCount,
    missingEvidenceCount,
    overallConfidencePercentage,
    contradictionsDetected,
    evidenceQualityRating,
  } = evidenceQuality;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Assessment Confidence &amp; Evidence Quality Audit</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit confidence evaluated separately from maturity scores. Document uploads validate accuracy without artificially inflating maturity levels.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shrink-0">
          {evidenceQualityRating}
        </div>
      </div>

      {/* Progress & Confidence Bar */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Composite Audit Confidence Index</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">{overallConfidencePercentage}%</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            title={`Verified: ${verifiedCount}`}
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${(verifiedCount / (totalQuestionsEvaluated || 1)) * 100}%` }}
          />
          <div
            title={`Partially Verified: ${partiallyVerifiedCount}`}
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${(partiallyVerifiedCount / (totalQuestionsEvaluated || 1)) * 100}%` }}
          />
          <div
            title={`Self-Reported: ${selfReportedCount}`}
            className="bg-amber-500 h-full transition-all"
            style={{ width: `${(selfReportedCount / (totalQuestionsEvaluated || 1)) * 100}%` }}
          />
          <div
            title={`Missing: ${missingEvidenceCount}`}
            className="bg-slate-700 h-full transition-all"
            style={{ width: `${(missingEvidenceCount / (totalQuestionsEvaluated || 1)) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Verified ({verifiedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Partially Verified ({partiallyVerifiedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Self-Reported ({selfReportedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Missing / Unanswered ({missingEvidenceCount})</span>
          </div>
        </div>
      </div>

      {/* Contradiction Detection Alerts */}
      {contradictionsDetected && contradictionsDetected.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Discrepancy / Contradiction Flags ({contradictionsDetected.length})</span>
          </div>

          <div className="space-y-2">
            {contradictionsDetected.map((contra) => (
              <div
                key={contra.id}
                className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">{contra.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-900/60 text-amber-300 border border-amber-500/40">
                    {contra.severity} Severity
                  </span>
                </div>
                <p className="text-amber-100/90 leading-relaxed">{contra.description}</p>
                <div className="pt-1 text-[11px] text-cyan-300">
                  <strong>Consultant Action:</strong> {contra.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
