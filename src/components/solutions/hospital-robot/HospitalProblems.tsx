import React from "react";
import {
  AlertTriangle,
  Stethoscope,
  Clock,
  FileQuestion,
  Users2,
  TrendingDown,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

interface HospitalChallenge {
  id: string;
  number: string;
  icon: React.ElementType;
  title: string;
  problem: string;
  operationalImpact: string;
  metric: string;
  metricLabel: string;
}

const HOSPITAL_CHALLENGES: HospitalChallenge[] = [
  {
    id: "nurse-walking-fatigue",
    number: "01",
    icon: Stethoscope,
    title: "Nursing Transit Fatigue & Burnout",
    problem:
      "Registered nurses walk an estimated 4 to 5 miles per 12-hour shift running errands to retrieve IV bags, routine pharmaceuticals, and linen rather than providing bedside care.",
    operationalImpact:
      "Up to 30% of nursing shift hours are lost to courier tasks, worsening clinical fatigue and driving nurse turnover.",
    metric: "4.2 mi",
    metricLabel: "Average miles walked per nurse per shift",
  },
  {
    id: "delayed-stat-meds",
    number: "02",
    icon: Clock,
    title: "Delayed STAT & Emergency Deliveries",
    problem:
      "Critical STAT medication orders for the ICU, ER, or surgical suites sit in pharmacy queues waiting for available human porters during peak shift changeovers.",
    operationalImpact:
      "Delivery turnaround times can exceed 45 minutes, creating dangerous delays for time-sensitive clinical interventions.",
    metric: "48 min",
    metricLabel: "Average manual STAT pharmacy transit delay",
  },
  {
    id: "specimen-chain-of-custody",
    number: "03",
    icon: FileQuestion,
    title: "Specimen Chain-of-Custody Vulnerabilities",
    problem:
      "Hand-carried blood samples, pathology biopsies, and sensitive patient records lack digital tracking during transport between wards and centralized laboratories.",
    operationalImpact:
      "Risk of misplaced specimens, delayed diagnostic reports, sample temperature degradation, and HIPAA compliance risks.",
    metric: "12%",
    metricLabel: "Hand-carried samples experience tracking gaps",
  },
  {
    id: "elevator-interfloor-bottlenecks",
    number: "04",
    icon: AlertTriangle,
    title: "Inter-Floor Transit & Elevator Gridlock",
    problem:
      "Human runners pushing manual carts must wait alongside patients, visitors, and emergency gurneys for elevators, multiplying transit friction across multi-wing facilities.",
    operationalImpact:
      "Unpredictable delivery schedules, congested hallway corridors, and high cross-contamination exposure.",
    metric: "35%",
    metricLabel: "Courier transit time spent waiting at elevators",
  },
  {
    id: "porter-shortages",
    number: "05",
    icon: Users2,
    title: "Support Staff Shortages & High Turnover",
    problem:
      "Hospitals face persistent vacancies in internal logistics and portering roles, forcing skilled medical staff to cover courier duties.",
    operationalImpact:
      "Skyrocketing hospital overtime expenditures, inconsistent supply deliveries, and unpredictable service levels.",
    metric: "28%",
    metricLabel: "Annual turnover rate among hospital courier staff",
  },
];

export function HospitalProblems() {
  return (
    <section className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute -bottom-32 right-10 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-4">
            <ShieldAlert size={13} className="text-rose-400" />
            <span>Healthcare Logistics Friction</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            The Hidden Burden in <br />
            <span className="text-rose-400">Hospital Internal Logistics</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Hospitals operate 24/7, yet thousands of skilled clinical hours are drained by manual
            foot messenger rounds. When nurses and technicians become couriers, patient response
            times suffer and operational costs soar.
          </p>
        </div>

        {/* 5 Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOSPITAL_CHALLENGES.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`group relative rounded-xl border border-slate-800 bg-slate-950/80 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-rose-500/40 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-rose-500/5 ${
                  index === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Top index & icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="size-11 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 group-hover:bg-rose-500/20 transition-all duration-200">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500 tracking-wider">
                    BOTTLENECK {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-rose-300 transition-colors">
                  {item.title}
                </h3>

                {/* Problem description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {item.problem}
                </p>

                {/* Operational impact box */}
                <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-3 mb-5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Clinical &amp; Facility Impact
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {item.operationalImpact}
                  </div>
                </div>

                {/* Metric footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-baseline justify-between">
                  <div className="text-2xl font-mono font-black text-rose-400 tracking-tight">
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
            <div className="size-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-sm font-semibold text-slate-200">
              The Medical Solution: Automated, secure indoor robotics handling routine material
              movement 24/7 so clinicians remain at the patient bedside.
            </span>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            Explore System Architecture
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </section>
  );
}
