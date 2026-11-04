import React from "react";
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Heart,
  TrendingUp,
  AlertCircle,
  Building,
} from "lucide-react";

export function HospitalCaseStudy() {
  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <FileSpreadsheet size={13} className="text-[#155EEF]" />
            <span>Illustrative Deployment Simulation</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            450-Bed Tertiary Hospital <br />
            <span className="text-[#155EEF]">Clinical Logistics Simulation</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Examine a representative hospital deployment model showing how a multi-tower academic
            medical center deployed autonomous mobile delivery robots to reclaim nurse bedside time
            and accelerate STAT medication dispatches.
          </p>

          {/* Demonstration Notice */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-mono text-amber-800">
            <AlertCircle size={14} className="text-amber-600 shrink-0" />
            <span>
              <strong>Demonstration Scenario:</strong> Metrics reflect an illustrative hospital
              operational model based on simulated clinical logistics parameters.
            </span>
          </div>
        </div>

        {/* 4 Impact Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#155EEF]">
              -68%
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Nurse Runner Errands
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Over 2,400 monthly courier hours redirected to bedside patient care
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-600">
              12.4 min
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              STAT Pharmacy Turnaround
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Reduced from 48 minutes down to 12.4 minutes for emergency ICU orders
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#155EEF]">
              100%
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Custody Accountability
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Zero lost medication or specimen chain-of-custody disputes across 6,000+ dispatches
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900">
              7.2 Mo
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Amortization Payback
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Rapid capital amortization based on courier staffing reduction and overtime savings
            </p>
          </div>
        </div>

        {/* Narrative Deep-Dive 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Baseline Context */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Phase 1 // Clinical Baseline
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Pre-Deployment Hospital Bottlenecks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                A 450-bed academic teaching hospital featuring two 7-story patient towers struggled
                with severe porter shortages and inter-floor delivery delays during peak clinical
                shift changes.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>Nurses walked 4.8 miles per shift fetching routine medications and IV fluids</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>Emergency STAT pharmacy deliveries averaged 48 minutes during 2 PM peak handover</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>Porters frequently caused corridor congestion waiting for passenger elevators</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Solution Architecture */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-2">
                Phase 2 // Robotics Deployment
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Autonomous Clinical Rollout
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                The hospital commissioned a fleet of four INDUS Hospital Delivery Robots integrated
                directly with the central pharmacy carousel, four passenger elevators, and nurse pagers.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Autonomous multi-floor navigation through BACnet elevator summoning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Multi-tier electronic smart lockers requiring nurse badge tap to release</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Automatic Vocera pager chime notifying nurses upon robot arrival at ward</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Measurable Outcomes */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 mb-2">
                Phase 3 // Measured Outcomes
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Measurable Clinical Impact
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Within 120 days of commissioning, the medical center reported substantial nurse
                satisfaction improvements, near-instant STAT delivery turnaround, and reduced overtime.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>68% drop in nurse courier walking steps, returning 80+ daily hours to bedside</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero safety incidents or patient collisions across 4,200 operating hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>System fully amortized in 7.2 months through courier overtime reduction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
