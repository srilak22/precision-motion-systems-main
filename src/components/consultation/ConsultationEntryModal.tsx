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
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070b14]/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 my-auto w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border/40 bg-[#111A30] p-6 sm:p-8 md:p-10 shadow-2xl rounded-none text-slate-100 outline-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close consultation modal"
          className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center border border-border/40 bg-[#16203a] text-slate-300 hover:border-signal hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border border-signal/30 bg-signal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-signal">
            <ShieldCheck size={13} />
            <span>Industrial Engineering Intake</span>
          </div>
          <h2
            id="consultation-modal-title"
            className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white leading-tight"
          >
            How would you like to plan your automation project?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select the consultation track best suited to your current project stage. You can review
            specifications or switch modes at any point.
          </p>
        </div>

        {/* Two Comparison Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Option A: Quick Consultation */}
          <div className="group relative flex flex-col justify-between border border-border/40 bg-[#16203a] p-6 transition-all hover:border-signal/60 hover:bg-[#1A2542] hover:shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 border border-slate-600/60 bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  <Clock size={11} className="text-signal" />
                  Fast Track (~2 mins)
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                  Option A
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-signal/30 bg-signal/10 text-signal">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-signal transition-colors">
                    Quick Consultation
                  </h3>
                  <p className="text-xs text-slate-400">Exploratory & budgetary sizing</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-300">
                Ideal for initial automation feasibility, general product catalog inquiries, and
                swift calendar booking with an INDUS robotics specialist.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-signal shrink-0" />
                  <span>Name, business email & company details</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-signal shrink-0" />
                  <span>Industry application & high-level objective</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-signal shrink-0" />
                  <span>Direct Google Calendar time-slot reservation</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Button
                onClick={() => onSelectMode("quick")}
                variant="outline"
                className="w-full h-11 rounded-none border-signal/60 bg-transparent text-signal hover:bg-signal hover:text-[#111A30] font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Choose Quick Consultation</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Option B: Detailed Project Review (Recommended) */}
          <div className="group relative flex flex-col justify-between border-2 border-signal/60 bg-[#16203a] p-6 transition-all hover:border-signal hover:bg-[#1A2542] hover:shadow-xl hover:shadow-signal/10">
            {/* Recommended Badge */}
            <div className="absolute -top-3 right-5 bg-signal px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#111A30] shadow-sm">
              Recommended for Engineering RFQs
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 border border-signal/40 bg-signal/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal">
                  <FileText size={11} />
                  Engineering Review (~5 mins)
                </span>
                <span className="text-[11px] font-mono text-signal uppercase tracking-widest font-bold">
                  Option B
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-signal bg-signal text-[#111A30]">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-signal transition-colors">
                    Detailed Project Review
                  </h3>
                  <p className="text-xs text-slate-400">Application sizing & architecture review</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-300">
                Recommended for active engineering projects requiring payload calculations, reach
                analysis, cycle-time verification, or PLC/fieldbus integration.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-signal shrink-0" />
                  <span>Payload, reach, cycle time & environment specs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-signal shrink-0" />
                  <span>PLC, fieldbus (EtherCAT/PROFINET) & cell safety</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-signal shrink-0" />
                  <span>Priority assignment with Senior Solution Architect</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Button
                onClick={() => onSelectMode("detailed")}
                className="w-full h-11 rounded-none bg-signal hover:bg-signal/90 text-[#111A30] font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-[0_0_15px_rgba(149,204,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse"></span>
            <span>
              Real-time Google Calendar slot validation with automated timezone conversion
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-300 underline-offset-4 hover:text-signal hover:underline transition-colors cursor-pointer"
          >
            Explore page and decide later →
          </button>
        </div>
      </div>
    </div>
  );
}
