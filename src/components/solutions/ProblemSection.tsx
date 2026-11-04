import React from "react";
import {
  AlertTriangle,
  Trash2,
  Users2,
  Recycle,
  Wrench,
  EyeOff,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

interface ChallengeItem {
  id: string;
  number: string;
  icon: React.ElementType;
  title: string;
  problem: string;
  operationalImpact: string;
  metric: string;
  metricLabel: string;
}

const CHALLENGES: ChallengeItem[] = [
  {
    id: "overflowing-bins",
    number: "01",
    icon: Trash2,
    title: "Overflowing Waste Bins",
    problem:
      "Unscheduled disposal spikes and rigid collection routes lead to overflowing receptacles, secondary street litter, sanitation hazards, and severe tenant dissatisfaction.",
    operationalImpact:
      "Public health risks, pest infestations, and costly emergency dispatch rounds.",
    metric: "43%",
    metricLabel: "Bins overflow before scheduled pickup",
  },
  {
    id: "manual-collection",
    number: "02",
    icon: Users2,
    title: "Manual Waste Collection",
    problem:
      "Sanitation staff endure continuous ergonomic strain, repetitive heavy lifting, and direct exposure to hazardous, sharp, or contaminated waste materials.",
    operationalImpact:
      "High worker turnover, absenteeism, rising injury compensation, and chronic labor shortages.",
    metric: "3.2x",
    metricLabel: "Higher turnover vs general facility roles",
  },
  {
    id: "inefficient-segregation",
    number: "03",
    icon: Recycle,
    title: "Inefficient Waste Segregation",
    problem:
      "Source segregation relies on inconsistent human sorting, causing recyclable batches to be heavily contaminated by wet organics or toxic substances.",
    operationalImpact:
      "Up to 70% of potentially recyclable material is rejected at processing plants and landfilled.",
    metric: "<24%",
    metricLabel: "Actual recycling yield achieved manually",
  },
  {
    id: "maintenance-workload",
    number: "04",
    icon: Wrench,
    title: "High Maintenance Workload",
    problem:
      "Traditional static schedules send utility vehicles and workers to empty bins that are barely a quarter full, burning fuel and wasting manpower.",
    operationalImpact:
      "Excessive wear on facility vehicles, high operational expenditure, and unnecessary carbon emissions.",
    metric: "38%",
    metricLabel: "Collection runs performed on half-empty bins",
  },
  {
    id: "limited-visibility",
    number: "05",
    icon: EyeOff,
    title: "Limited Collection Visibility",
    problem:
      "Facility managers have no real-time telemetry regarding bin fill levels, spatial waste generation patterns, or collection timestamps.",
    operationalImpact:
      "Operations operate in the dark, responding solely to phone complaints rather than predictive telemetry.",
    metric: "88%",
    metricLabel: "Decisions made reactively after complaints",
  },
];

export function ProblemSection() {
  return (
    <section className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background radial accent */}
      <div className="pointer-events-none absolute -bottom-32 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-4">
            <AlertTriangle size={13} className="text-red-400" />
            <span>Operational Bottlenecks</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Rethinking the Way <br />
            <span className="text-red-400">Waste Is Collected</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Traditional waste management across smart cities, university campuses, and industrial
            parks remains manual, blind, and reactive. Fixed collection routes burn operational
            budgets while overflowing bins and contaminated recycling defeat sustainability goals.
          </p>
        </div>

        {/* 5 Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((item, index) => {
            const Icon = item.icon;
            const isLarge = index === 0 || index === 1;

            return (
              <div
                key={item.id}
                className={`group relative rounded-xl border border-slate-800 bg-slate-950/80 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-red-500/5 ${
                  index === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Top index & icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="size-11 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 group-hover:bg-red-500/20 transition-all duration-200">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">
                    CHALLENGE {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-red-300 transition-colors">
                  {item.title}
                </h3>

                {/* Problem description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {item.problem}
                </p>

                {/* Operational impact box */}
                <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-3 mb-5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Direct Impact
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {item.operationalImpact}
                  </div>
                </div>

                {/* Metric footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
                  <div className="text-2xl font-mono font-black text-red-400 tracking-tight">
                    {item.metric}
                  </div>
                  <div className="text-right text-[11px] font-medium text-slate-400 max-w-[65%]">
                    {item.metricLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Transition Prompt */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-[#16C7E8] animate-ping" />
            <span className="text-sm font-semibold text-slate-200">
              The Solution: Transitioning from static manual rounds to autonomous, vision-guided
              collection robotics.
            </span>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8] flex items-center gap-1">
            Explore System Architecture
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </section>
  );
}
