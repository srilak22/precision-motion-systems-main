import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Layers, ArrowRight, CheckCircle2, Building, Wrench } from "lucide-react";

interface CaseStudyItem {
  id: string;
  industry: string;
  application: string;
  challenge: string;
  approach: string;
  solution: string;
  components: string[];
  outcome: string;
  href: string;
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "automotive-welding",
    industry: "Automotive & EV",
    application: "Body-in-White Seam Welding & Battery Tray Insertion",
    challenge:
      "High dynamic inertia causing torsional deflection and seam tracking inaccuracies on high-payload car chassis assembly lines.",
    approach:
      "Selected high-rigidity cycloidal reducers for base and shoulder axes to eliminate dynamic joint deflection under 150kg welding toolheads.",
    solution:
      "Deployed 6-axis articulated arm cells configured with EtherCAT synchronized servo drives and laser vision seam tracking.",
    components: [
      "RV Cycloidal Reducers",
      "6-Axis Heavy-Duty Arm",
      "EtherCAT Servo Drives",
      "Laser Tracking Vision",
    ],
    outcome:
      "Eliminated joint backlash, achieved sub-millimeter seam repeatability, and enabled continuous multi-shift production.",
    href: "/products/robotic-systems",
  },
  {
    id: "electronics-smt",
    industry: "Electronics & Semiconductor",
    application: "Cleanroom Wafer Handling & High-Density SMT Assembly",
    challenge:
      "Micro-vibration and particulate contamination during high-speed wafer transfer damaging sensitive silicon dies.",
    approach:
      "Engineered sealed harmonic reducers with zero lost motion and high-resolution absolute optical encoders for gentle acceleration.",
    solution:
      "Implemented cleanroom-certified 4-axis SCARA manipulators with vibration-damped trajectories and vacuum wafer end-effectors.",
    components: [
      "Strain-Wave Harmonic Reducers",
      "SCARA Manipulator",
      "Dual Absolute Encoders",
      "Vacuum End-Effector",
    ],
    outcome:
      "Zero wafer edge chipping, sub-micron positioning repeatability, and full ISO Class 4 cleanroom compliance.",
    href: "/products/motion-actuation",
  },
  {
    id: "logistics-amr",
    industry: "Warehousing & Logistics",
    application: "Heavy-Payload Autonomous Material Transport",
    challenge:
      "Frequent gear tooth wear and wheel slippage on automated warehouse floors carrying 1,500kg payloads across uneven concrete.",
    approach:
      "Engineered integrated in-hub brushless drive wheel modules with high-ratio planetary reduction and high-grip polyurethane tires.",
    solution:
      "Supplied modular dual-wheel differential drive assemblies with built-in safety laser scanner interfaces and CANopen/EtherCAT buses.",
    components: [
      "In-Hub AGV Drive Wheels",
      "Safety Laser Scanners",
      "Integrated BLDC Motor Kit",
      "Modular Suspension",
    ],
    outcome:
      "35% increase in battery run-time efficiency, zero mechanical gear replacements over 12 months of 24/7 duty.",
    href: "/products/mobility-systems",
  },
  {
    id: "packaging-delta",
    industry: "Packaging & Food Processing",
    application: "High-Speed Product Collation & Carton Loading",
    challenge:
      "Bottlenecks at the packaging line where manual carton sorting could not keep pace with 120 units/minute output.",
    approach:
      "Designed parallel kinematic delta manipulators utilizing ultra-light carbon fiber arms and high-torque direct servo actuators.",
    solution:
      "Turnkey 3-axis delta pick-and-place cell paired with conveyor tracking encoder synchronizer and food-grade hygienic grippers.",
    components: [
      "High-Speed Delta Manipulator",
      "Carbon Fiber Links",
      "Optical Line Tracker",
      "Food-Grade Washdown Gripper",
    ],
    outcome:
      "Achieved consistent 135 picks per minute, eliminated packaging bottlenecks, and maintained hygienic washdown standards.",
    href: "/solutions",
  },
];

export function CaseStudies() {
  const [activeTab, setActiveTab] = useState<string>("automotive-welding");
  const active = CASE_STUDIES.find((c) => c.id === activeTab) || CASE_STUDIES[0];

  return (
    <section
      id="case-studies"
      className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
              <Layers size={12} className="text-[#155EEF]" />
              APPLICATION SHOWCASE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
              Robotics Engineering Across Real-World Industries
            </h2>
            <p className="mt-3 text-base text-[#475467] leading-relaxed">
              Real-world engineering scenarios demonstrating how INDUS precision motion components,
              robotic manipulators, and integration architectures solve difficult manufacturing
              challenges.
            </p>
          </div>

          <Link
            to="/industries"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors shrink-0 group"
          >
            <span>Explore All Application Scenarios</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tab Selector Row */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {CASE_STUDIES.map((cs) => {
            const isSelected = activeTab === cs.id;

            return (
              <button
                key={cs.id}
                type="button"
                onClick={() => setActiveTab(cs.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                  isSelected
                    ? "bg-[#155EEF] border-[#155EEF] text-white shadow-sm"
                    : "bg-white border-[#E5EAF1] text-[#475467] hover:border-[#155EEF]/40 hover:text-[#101B2D]"
                }`}
              >
                {cs.industry}
              </button>
            );
          })}
        </div>

        {/* Selected Case Study Detail Card */}
        <div className="mt-6 rounded-2xl border border-[#E5EAF1] bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF1]">
            <div>
              <span className="text-xs font-mono font-bold text-[#155EEF] uppercase tracking-wider">
                {active.industry} Sector Application
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#101B2D] mt-1">
                {active.application}
              </h3>
            </div>

            <Link
              to={active.href as never}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] text-xs font-bold hover:bg-[#155EEF] hover:text-white transition-all shrink-0"
            >
              <span>Explore Related Subsystems</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Operational Challenge */}
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#D97706] block mb-2">
                01 // Operational Challenge
              </span>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                {active.challenge}
              </p>
            </div>

            {/* Engineering Approach & Solution */}
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-2">
                02 // Engineering Solution
              </span>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">{active.solution}</p>
            </div>

            {/* Verified Outcome */}
            <div className="p-5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#16A34A] block mb-2">
                03 // Technical Outcome
              </span>
              <p className="text-xs sm:text-sm text-[#14532D] leading-relaxed font-medium">
                {active.outcome}
              </p>
            </div>
          </div>

          {/* Integrated Technical Components */}
          <div className="mt-6 pt-5 border-t border-[#E5EAF1] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#667085] mr-2">
              Integrated Subsystems:
            </span>
            {active.components.map((comp) => (
              <span
                key={comp}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F1F5F9] text-[#344054] border border-[#E2E8F0]"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
