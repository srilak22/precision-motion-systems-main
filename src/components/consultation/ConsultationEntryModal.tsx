import React, { useEffect, useRef } from "react";
import { Zap, FileText, CheckCircle2, X, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingMode } from "@/types/consultation";

interface ConsultationEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: BookingMode) => void;
}

export function ConsultationEntryModal({
  isOpen,
  onClose,
  onSelectMode,
}: ConsultationEntryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus management & Escape key handling
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-4xl border border-border/70 bg-[#0b1329] p-6 sm:p-8 md:p-10 shadow-2xl rounded-md text-slate-100 outline-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close consultation modal"
          className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <ShieldCheck size={13} />
            <span>Industrial Engineering Intake</span>
          </div>
          <h2
            id="consultation-modal-title"
            className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white"
          >
            How would you like to plan your automation project?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Select the consultation track best suited to your current project stage. You can review specifications or switch modes at any point.
          </p>
        </div>

        {/* Two Comparison Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Option A: Quick Consultation */}
          <div className="group relative flex flex-col justify-between rounded-md border border-slate-700/80 bg-slate-900/60 p-6 transition-all hover:border-amber-400/80 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-amber-500/5">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                  <Clock size={12} />
                  Fast Track (~2 mins)
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase">Option A</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                    Quick Consultation
                  </h3>
                  <p className="text-xs text-slate-400">Exploratory & budgetary sizing</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-300">
                Ideal for initial automation feasibility, general product catalog questions, and quick calendar booking with an INDUS robotics specialist.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                  <span>Name, business email & company details</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                  <span>Industry application & high-level objective</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                  <span>Direct Google Calendar time-slot reservation</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Button
                onClick={() => onSelectMode("quick")}
                className="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Choose Quick Consultation</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Option B: Detailed Project Review */}
          <div className="group relative flex flex-col justify-between rounded-md border-2 border-amber-500/40 bg-slate-900/80 p-6 transition-all hover:border-amber-400 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-500/10">
            {/* Recommended Badge */}
            <div className="absolute -top-3 right-6 rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow">
              Recommended for Engineering RFQs
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
                  <FileText size={12} />
                  Engineering Review (~5 mins)
                </span>
                <span className="text-xs font-mono text-amber-400 uppercase">Option B</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                    Detailed Project Review
                  </h3>
                  <p className="text-xs text-slate-400">Application sizing & architecture review</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-300">
                Recommended for active engineering projects requiring payload calculations, reach analysis, cycle-time verification, or PLC/fieldbus integration.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Payload, reach, cycle time & environment specs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>PLC, fieldbus (EtherCAT/PROFINET) & cell safety</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                  <span>Priority assignment with Senior Solution Architect</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Button
                onClick={() => onSelectMode("detailed")}
                className="w-full h-11 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Choose Detailed Project Review</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Real-time Google Calendar slot validation with automated timezone conversion</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 underline-offset-4 hover:text-white hover:underline transition-colors"
          >
            Explore page and decide later
          </button>
        </div>
      </div>
    </div>
  );
}
