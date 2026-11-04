import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Headphones, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";

export function IndustriesCta() {
  const { openModal } = useModals();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#103B66] to-[#0A1B2E] text-white border border-blue-400/30 p-8 sm:p-14 shadow-xl relative overflow-hidden text-center">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#155EEF]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Top Micro-Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-sky-300 font-bold mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>ENGINEERING FEASIBILITY &amp; PROPOSALS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            Ready to Automate Your Facility?
          </h2>

          <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            Submit your workcell specs to calculate kinematics feasibility, payload constraints, and obtain ISO-compliant sizing proposals.
          </p>

          {/* Action Buttons: Request Sizing Proposal | Book Technical Consultation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() =>
                openModal("engineer", {
                  initialMessage: "Industries Page CTA: Request Sizing Proposal & Kinematics Feasibility",
                })
              }
              size="lg"
              className="bg-white hover:bg-slate-100 text-[#0A2540] font-bold text-sm px-7 h-12 shadow-lg shadow-black/20 cursor-pointer border-0"
            >
              Request Sizing Proposal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={() =>
                openModal("engineer", {
                  initialMessage: "Industries Page CTA: Book Technical Consultation with Mechatronics Lead",
                })
              }
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/25 hover:border-white text-sm font-semibold h-12 px-6 cursor-pointer flex items-center gap-2"
            >
              <Headphones size={16} className="text-sky-300" />
              <span>Book Technical Consultation</span>
            </Button>
          </div>

          {/* Footer Compliance Stamp */}
          <div className="pt-6 border-t border-white/15 flex items-center justify-center gap-2 text-xs font-mono text-blue-200">
            <ShieldCheck size={14} className="text-sky-300" />
            <span>Calculations Physics-Validated • DIN 3990 &amp; ISO 9283 Standards Compliance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
