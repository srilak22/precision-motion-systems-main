import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, X, AlertCircle, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsultantValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId: string;
  techGaps: any[];
  rootCauses: any[];
  onValidationSuccess: () => void;
}

export function ConsultantValidationModal({
  isOpen,
  onClose,
  assessmentId,
  techGaps,
  rootCauses,
  onValidationSuccess,
}: ConsultantValidationModalProps) {
  const [selectedTechGaps, setSelectedTechGaps] = useState<string[]>(
    techGaps.map((g) => g.ruleId)
  );
  const [validationNotes, setValidationNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTechGap = (ruleId: string) => {
    setSelectedTechGaps((prev) =>
      prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch(`/api/analytics/${assessmentId}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({
          validatedTechGaps: selectedTechGaps,
          validationNotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit consultant validation.");
      }

      onValidationSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred during validation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Consultant Validation &amp; Engineering Sign-Off</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Official Assessment Certification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify automated intelligence findings, validate technology recommendations, and append engineering sign-off notes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Validate Technology Gaps */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Validate Detected Robotics Opportunities ({selectedTechGaps.length}/{techGaps.length})</span>
            </div>
            <div className="space-y-2">
              {techGaps.map((gap) => {
                const isSelected = selectedTechGaps.includes(gap.ruleId);
                return (
                  <button
                    type="button"
                    key={gap.ruleId}
                    onClick={() => toggleTechGap(gap.ruleId)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-500/60 text-white"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? "bg-cyan-500 border-cyan-400 text-slate-950"
                          : "border-slate-700 bg-slate-900"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-200">{gap.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">{gap.missingTechnology}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Remarks */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Consultant Engineering Certification Remarks
            </label>
            <textarea
              rows={4}
              required
              value={validationNotes}
              onChange={(e) => setValidationNotes(e.target.value)}
              placeholder="Record formal validation remarks, verification of layout feasibility, and specific turnkey workcell recommendations..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting || !validationNotes.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs px-6 py-2 rounded-lg"
            >
              {submitting ? "Certifying..." : "Confirm & Sign Off Assessment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
