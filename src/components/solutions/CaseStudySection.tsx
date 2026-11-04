import React from "react";
import {
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export function CaseStudySection() {
  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <FileSpreadsheet size={13} className="text-[#155EEF]" />
            <span>Illustrative Deployment Scenario</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Commercial Tech Campus <br />
            <span className="text-[#155EEF]">Deployment Simulation</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Examine a representative operational model detailing how a 120-acre corporate tech
            park transitioned from reactive manual sweeps to autonomous, vision-guided waste
            collection.
          </p>

          {/* Demonstration Notice */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-mono text-amber-800">
            <AlertCircle size={14} className="text-amber-600 shrink-0" />
            <span>
              <strong>Demonstration Scenario:</strong> Metrics reflect an illustrative campus
              engineering model based on simulated fleet operating parameters.
            </span>
          </div>
        </div>

        {/* 4 Impact Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#155EEF]">
              -42%
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Manual Labor Hours
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Ground crew reallocated to high-value building maintenance
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-600">
              99.4%
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Overflow Prevention
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Autonomous pickup triggers before bin fill reaches 85%
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-[#155EEF]">
              +28%
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Recycling Purity
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              AI camera-based material segregation eliminates cross-contamination
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900">
              8.4 Mo
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wider">
              Amortization Payback
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Rapid payback via reduced utility fuel and overtime wages
            </p>
          </div>
        </div>

        {/* Narrative Deep-Dive 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Facility Baseline & Challenges */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Phase 1 // Baseline Context
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Pre-Deployment Challenges
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                A 120-acre commercial technology facility housing 9,500 daily employees experienced
                chronic litter accumulation across outdoor eating terraces and pedestrian courtyards
                during lunch surges.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>Fixed 3x daily collection rounds missed irregular afternoon spill spikes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>High turnover among sanitation staff and recurrent overtime charges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>Over 60% of recyclable plastics contaminated by mixed food waste</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Deployed Architecture */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-2">
                Phase 2 // Solution Deployment
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Autonomous Robotic Rollout
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                INDUS commissioned four Smart Waste Collection Robots equipped with stereo depth
                vision, dual segregated hoppers, and automated inductive opportunity charging docks.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Continuous autonomous sweep of 6 high-density campus pedestrian zones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Sub-20ms AI classification sorting plastics into dedicated clean hoppers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span>Automated cloud alerts routing units to cafeteria plazas at 12:45 PM daily</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Sustainable Outcomes */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 mb-2">
                Phase 3 // Measured Outcomes
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Measurable Long-Term Impact
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Within 90 days of operation, the facility achieved near-zero litter complaints,
                significant fuel savings, and clean audit metrics for their annual ESG disclosure.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>42% reduction in manual collection labor hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero pedestrian collision incidents across 1,800+ operating hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Payback amortized in 8.4 months based on direct operational savings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
