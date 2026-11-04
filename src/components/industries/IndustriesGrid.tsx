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
  Layers,
  Activity,
  Zap,
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
  actionLabel: string;
  actionHref: string;
}

export const CORE_INDUSTRIES: IndustrySectorCard[] = [
  {
    id: "automotive",
    title: "Automotive & Mobility",
    badge: "AUTOMATED ASSEMBLY",
    badgeColor: "bg-blue-50 text-[#155EEF] border-blue-200",
    icon: Car,
    description:
      "High-speed, continuous-duty robotic workcells for structural welding, powertrain fabrication, and precision EV battery module integration.",
    applications: [
      "EV battery pack assembly & thermal dispensing",
      "Laser welding automation & seam tracking",
      "Real-time body-in-white inline inspection",
    ],
    techStack: ["7th-Axis Linear Actuators", "ROS2 Kinematics", "High-Payload Articulated Arms"],
    metrics: [
      { label: "Cycle Time", value: "< 42 sec" },
      { label: "Repeatability", value: "±0.02 mm" },
      { label: "OEE Uplift", value: "+38%" },
    ],
    actionLabel: "View Automotive Solutions →",
    actionHref: "/applications/automotive",
  },
  {
    id: "electronics",
    title: "Electronics & Electrical",
    badge: "MICRON PRECISION",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    icon: Cpu,
    description:
      "Cleanroom-grade high-cadence pick-and-place manipulators, micro-fastening systems, and automated 3D optical defect classification.",
    applications: [
      "High-speed SMT PCB component placement",
      "Automated optical inspection (AOI)",
      "Semiconductor wafer handling & packaging",
    ],
    techStack: ["OpenCV Vision", "Deep CNN Defect Detection", "High-Speed SCARA Manipulators"],
    metrics: [
      { label: "Accuracy", value: "±15 µm" },
      { label: "ESD Rating", value: "Class 1" },
      { label: "Throughput", value: "1,800 CPH" },
    ],
    actionLabel: "View Electronics Solutions →",
    actionHref: "/applications/electronics",
  },
  {
    id: "manufacturing",
    title: "Manufacturing & Machine Building",
    badge: "HEAVY AUTOMATION",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Factory,
    description:
      "Robust machine tending and multi-axis component handling designed to maximize spindle uptime and eliminate operator ergonomic bottlenecks.",
    applications: [
      "Autonomous CNC machine tending & lathe loading",
      "High-precision robotic sub-assembly & press-fit",
      "Raw material billet loading & pallet transfer",
    ],
    techStack: ["Siemens/Allen-Bradley PLC", "Industrial IoT Telemetry", "Torque Control Systems"],
    metrics: [
      { label: "Spindle Uptime", value: "96.4%" },
      { label: "Part Swap", value: "< 8 sec" },
      { label: "Max Payload", value: "450 kg" },
    ],
    actionLabel: "View Machinery Solutions →",
    actionHref: "/applications/metal-machining",
  },
  {
    id: "packaging",
    title: "Packaging & Logistics",
    badge: "AMR / AGV FLEET",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Warehouse,
    description:
      "Autonomous warehouse intralogistics and dynamic end-of-line packaging cells orchestrating smooth continuous carton flow.",
    applications: [
      "Intelligent 3D vision bin picking",
      "High-speed sorting & cross-dock systems",
      "Dynamic mixed-palletizing & warehouse AGVs",
    ],
    techStack: ["SLAM Navigation", "LiDAR Sensor Fusion", "Fleet Management Systems (FMS)"],
    metrics: [
      { label: "Transit Speed", value: "2.2 m/s" },
      { label: "Sort Cadence", value: "12,000 PPH" },
      { label: "Collision Rate", value: "0.00%" },
    ],
    actionLabel: "View Logistics Solutions →",
    actionHref: "/applications/packaging",
  },
  {
    id: "food-pharma",
    title: "Food & Pharmaceutical",
    badge: "STERILE & WASH-DOWN",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: UtensilsCrossed,
    description:
      "IP69K sanitary robotic manipulators and high-speed delta pickers meeting strict FDA 21 CFR Part 11 electronic batch record compliance.",
    applications: [
      "High-speed sterile vial & syringe sorting",
      "Aseptic liquid filling & capping automation",
      "Package seal integrity checking & QR serialization",
    ],
    techStack: ["IP69K Stainless Steel Robots", "High-Speed Conveyor Vision", "FDA-Compliant Grippers"],
    metrics: [
      { label: "Washdown", value: "IP69K Rated" },
      { label: "Audit Trail", value: "21 CFR Part 11" },
      { label: "Pick Speed", value: "140 Picks/min" },
    ],
    actionLabel: "View Pharma Solutions →",
    actionHref: "/applications/food-beverage",
  },
  {
    id: "aerospace",
    title: "Aerospace & Precision Engineering",
    badge: "HIGH TOLERANCE",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Plane,
    description:
      "Extreme-tolerance kinematics, composite skin automated fastening, and non-destructive ultrasonic aerospace surface inspection.",
    applications: [
      "Automated composite layer robotic drilling",
      "Non-destructive ultrasonic surface inspection",
      "Tight-tolerance aerostructure rivet fastening",
    ],
    techStack: ["Closed-Loop Force Sensors", "High-Res Optical Metrology", "Sub-millimeter Controllers"],
    metrics: [
      { label: "Standard", value: "AS9100 / ISO 9283" },
      { label: "Force Feedback", value: "6-DOF Real-Time" },
      { label: "Drill Rate", value: "5x Faster" },
    ],
    actionLabel: "View Aerospace Solutions →",
    actionHref: "/applications/aerospace",
  },
];

export function IndustriesGrid() {
  return (
    <section id="sectors" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
      <div className="max-w-3xl mb-14">
        <div className="text-xs font-mono font-bold tracking-wider text-[#155EEF] uppercase mb-2">
          // PRODUCTION-PROVEN SECTORS
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Core Manufacturing Domains
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          From high-rate EV assembly lines to sterile pharmaceutical containment and aerospace composites, our robotics
          systems are pre-validated to integrate directly into your plant floor architectures.
        </p>
      </div>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CORE_INDUSTRIES.map((industry) => {
          const IconComponent = industry.icon;
          return (
            <div
              key={industry.id}
              className="group relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#155EEF]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon + Domain Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-center text-[#155EEF] group-hover:scale-105 transition-transform">
                    <IconComponent size={22} />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full uppercase border ${industry.badgeColor}`}
                  >
                    {industry.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors mb-2">
                  {industry.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                  {industry.description}
                </p>

                {/* Sub-services / Applications list */}
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Target Applications:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {industry.applications.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-[#155EEF] shrink-0 mt-0.5" />
                        <span className="leading-snug">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Chips */}
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Validated Tech Stack:
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

              {/* Bottom Metrics Bar & Direct Action Link */}
              <div>
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 mb-4">
                  {industry.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center bg-blue-50/40 p-2 rounded-lg border border-blue-100/60">
                      <div className="text-xs font-bold font-mono text-[#155EEF]">{metric.value}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <Link
                  to={industry.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#155EEF] hover:text-[#0d4ecc] group-hover:underline transition-all"
                >
                  <span>{industry.actionLabel}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
