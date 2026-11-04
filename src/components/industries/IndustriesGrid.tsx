import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Car,
  Cpu,
  Factory,
  Warehouse,
  UtensilsCrossed,
  Plane,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export interface IndustrySectorCard {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  description: string;
  applications: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  architectureAnchor: string;
}

export const CORE_INDUSTRIES: IndustrySectorCard[] = [
  {
    id: "automotive",
    title: "Automotive & Mobility",
    badge: "AUTOMATED ASSEMBLY",
    badgeColor: "bg-blue-50 text-[#1D4ED8] border-blue-200",
    icon: Car,
    description:
      "Continuous-duty robotic welding cells, high-payload chassis handling, and micro-precision EV battery module pack integration.",
    applications: [
      "EV battery pack assembly & thermal paste dispensing",
      "Adaptive laser welding automation with seam tracking",
      "Real-time body-in-white (BIW) inline geometric inspection",
    ],
    techStack: ["7th-Axis Linear Actuators", "ROS2 Kinematics", "High-Payload Articulated Arms", "EtherCAT CoE"],
    metrics: [
      { label: "Cycle Time", value: "< 42s" },
      { label: "Seam Accuracy", value: "±0.02 mm" },
      { label: "Inspection", value: "99.98%" },
    ],
    architectureAnchor: "automotive",
  },
  {
    id: "electronics",
    title: "Electronics & Semiconductor",
    badge: "MICRON PRECISION",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Cpu,
    description:
      "Cleanroom ISO Class 1 high-cadence pick-and-place manipulators, micro-fastening systems, and automated 3D optical defect classification.",
    applications: [
      "High-speed SMT PCB component placement (< 15 µm)",
      "Automated optical inspection (AOI) with sub-pixel CNN",
      "Semiconductor wafer handling & FOUP pod transfer",
    ],
    techStack: ["OpenCV Vision", "Deep CNN Defect Detection", "High-Speed SCARA Manipulators", "SEMI Cleanroom S2/S8"],
    metrics: [
      { label: "Accuracy", value: "±15 µm" },
      { label: "Inspection", value: "99.98%" },
      { label: "ESD Rating", value: "Class 1" },
    ],
    architectureAnchor: "electronics",
  },
  {
    id: "manufacturing",
    title: "Heavy Manufacturing & Machining",
    badge: "HEAVY AUTOMATION",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Factory,
    description:
      "Heavy-duty CNC machine tending, automated press loading, and metal fabrication cells maximizing spindle utilization.",
    applications: [
      "Autonomous CNC lathe and milling machine tending",
      "High-precision multi-stage robotic assembly & press-fit",
      "Raw material billet loading and automated pallet swap",
    ],
    techStack: ["Siemens/Allen-Bradley PLC Interfaces", "Industrial IoT Telemetry", "Torque Control", "PROFINET IRT"],
    metrics: [
      { label: "Spindle Uptime", value: "96.4%" },
      { label: "Swap Time", value: "< 8s" },
      { label: "Payload", value: "450 kg" },
    ],
    architectureAnchor: "manufacturing",
  },
  {
    id: "packaging",
    title: "Packaging & Warehouse Logistics",
    badge: "AMR / AGV FLEET",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Warehouse,
    description:
      "Autonomous mobile intralogistics and dynamic end-of-line packaging workcells orchestrating continuous warehouse carton flow.",
    applications: [
      "Intelligent 3D vision bin picking across diverse SKUs",
      "High-speed automated cross-belt sorting systems",
      "Dynamic mixed-case palletizing and warehouse AGVs",
    ],
    techStack: ["SLAM Navigation", "LiDAR Sensor Fusion", "Fleet Management Systems (FMS)", "VDA 5050 Protocol"],
    metrics: [
      { label: "Transit Speed", value: "2.2 m/s" },
      { label: "Throughput", value: "12,000 PPH" },
      { label: "Collisions", value: "0 Incidents" },
    ],
    architectureAnchor: "packaging",
  },
  {
    id: "food-pharma",
    title: "Food & Pharmaceutical Automation",
    badge: "STERILE & WASH-DOWN",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: UtensilsCrossed,
    description:
      "IP69K sanitary robotic manipulators and high-speed delta pickers meeting strict FDA 21 CFR Part 11 electronic batch compliance.",
    applications: [
      "High-speed sterile vial and syringe sorting",
      "Aseptic liquid filling and automated capping systems",
      "Package seal integrity checking and QR serialization",
    ],
    techStack: ["IP69K Stainless Steel Robots", "High-Speed Conveyor Vision", "FDA-Compliant Grippers", "21 CFR Part 11"],
    metrics: [
      { label: "Washdown", value: "IP69K" },
      { label: "Pick Speed", value: "140 P/min" },
      { label: "Compliance", value: "100% Audit" },
    ],
    architectureAnchor: "food-pharma",
  },
  {
    id: "aerospace",
    title: "Aerospace & High-Precision Engineering",
    badge: "HIGH TOLERANCE",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Plane,
    description:
      "Extreme-tolerance kinematics, composite skin automated fastening, and non-destructive ultrasonic aerospace surface inspection.",
    applications: [
      "Automated composite layer robotic drilling and fastening",
      "Non-destructive ultrasonic surface inspection (NDT)",
      "Tight-tolerance aerostructure rivet fastening (< 0.008 mm)",
    ],
    techStack: ["Closed-Loop Force Sensors", "High-Res Optical Metrology", "Sub-millimeter Controllers", "AS9100 / ISO 9283"],
    metrics: [
      { label: "Tolerance", value: "±0.008 mm" },
      { label: "Drill Rate", value: "5.2x Faster" },
      { label: "Force Sensor", value: "6-DOF" },
    ],
    architectureAnchor: "aerospace",
  },
];

export function IndustriesGrid() {
  return (
    <section id="sectors" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
      <div className="max-w-3xl mb-14">
        <div className="text-xs font-mono font-bold tracking-wider text-[#1D4ED8] uppercase mb-2">
          // 3X2 BENTO GRID • SIX TARGET SECTORS
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Interactive Industry Solutions Grid
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Explore specialized robotic workcells, automation stacks, and proven operational benchmarks engineered for each
          manufacturing domain.
        </p>
      </div>

      {/* 3x2 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CORE_INDUSTRIES.map((industry) => {
          const IconComponent = industry.icon;
          return (
            <div
              key={industry.id}
              className="group relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#1D4ED8]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* 1. Header: Industry Name & Icon + 2. Technical Sub-Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-center text-[#1D4ED8] group-hover:scale-105 transition-transform">
                    <IconComponent size={22} />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full uppercase border ${industry.badgeColor}`}
                  >
                    {industry.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1D4ED8] transition-colors mb-2">
                  {industry.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {industry.description}
                </p>

                {/* 3. Core Applications List (3 bullet points focusing on real operations) */}
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Core Industrial Applications:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {industry.applications.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                        <span className="leading-snug">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Tech Stack & Hardware Layer */}
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Tech Stack &amp; Hardware Layer:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Key Benchmark Metrics & 6. Card Footer Link */}
              <div>
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 mb-4">
                  {industry.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center bg-blue-50/40 p-2 rounded-lg border border-blue-100/60">
                      <div className="text-xs font-bold font-mono text-[#1D4ED8]">{metric.value}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <a
                  href={`#case-study-${industry.architectureAnchor}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#1D4ED8] hover:text-[#1e40af] group-hover:underline transition-all"
                >
                  <span>View {industry.title.split(" ")[0]} System Architecture →</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
