import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Factory,
  Target,
  Boxes,
  Wrench,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface SolutionsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface SolutionCardData {
  title: string;
  challenge: string;
  solution: string;
  technologies: string[];
  href: string;
}

interface SolutionCategoryConfig {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  overviewHref: string;
  cards: SolutionCardData[];
}

const SOLUTION_CATEGORIES: SolutionCategoryConfig[] = [
  {
    id: "motion-control",
    label: "Motion Control",
    subtitle: "Multi-axis kinematics & deterministic synchronization",
    icon: Activity,
    overviewHref: "/solutions/motion-control",
    cards: [
      {
        title: "Coordinated Multi-Axis Motion",
        challenge:
          "Synchronizing multi-axis kinematics with sub-millisecond deterministic fieldbus cycles.",
        solution:
          "Real-time EtherCAT trajectory generation with electronic camming and CNC interpolation.",
        technologies: ["EtherCAT Master", "Servo Drives", "Harmonic Reducers"],
        href: "/solutions/motion-control",
      },
      {
        title: "Flying Shear & Continuous Cutting",
        challenge:
          "Synchronous material cutting and registration without interrupting continuous web feed.",
        solution:
          "Electronic master-slave motion profiles executing high-speed dynamic registration mark cuts.",
        technologies: ["Motion Controllers", "Optical Encoders", "Vector Drives"],
        href: "/solutions/motion-control",
      },
      {
        title: "Direct-Drive Precision Rotary Stages",
        challenge:
          "Backlash and coupling compliance limiting angular accuracy in metrology indexing.",
        solution:
          "Frameless direct-drive torque kits paired with 24-bit hollow-shaft optical encoders.",
        technologies: ["Torque Motors", "Absolute Encoders", "Crossed Roller Bearings"],
        href: "/solutions/motion-control",
      },
    ],
  },
  {
    id: "robotic-automation",
    label: "Robotic Automation",
    subtitle: "Machine tending, assembly & processing cells",
    icon: Bot,
    overviewHref: "/solutions/robotic-automation",
    cards: [
      {
        title: "Machine Tending Automation",
        challenge:
          "Spindle idle time and repetitive physical strain during manual CNC loading and unloading.",
        solution:
          "Articulated 6-axis robot cells with dual-pneumatic/electric grippers for lights-out production.",
        technologies: ["6-Axis Robots", "Machine Vision", "EtherCAT"],
        href: "/solutions/robotic-automation",
      },
      {
        title: "Collaborative Assembly & Screwdriving",
        challenge:
          "Tight-tolerance component assembly requiring human-safe operation without cage fences.",
        solution:
          "Power- and force-limited cobots with joint torque sensing and continuous depth feedback.",
        technologies: ["Cobot Arms", "Electric Grippers", "F/T Sensing"],
        href: "/solutions/robotic-automation",
      },
      {
        title: "Robotic Welding & Seam Tracking",
        challenge:
          "Inconsistent joint seams and thermal distortion during manual MIG and TIG fabrication.",
        solution:
          "Coordinated hollow-wrist robotic welding cells equipped with real-time laser seam tracking.",
        technologies: ["Welding Robots", "Laser Profilers", "Safety PLCs"],
        href: "/solutions/robotic-automation",
      },
    ],
  },
  {
    id: "factory-automation",
    label: "Machine Integration",
    subtitle: "Plant-floor retrofits, conveyor lines & line gating",
    icon: Factory,
    overviewHref: "/solutions/factory-automation",
    cards: [
      {
        title: "Legacy Line & PLC Modernization",
        challenge:
          "Islands of older machinery lacking digital fieldbus interconnects and modern safety relays.",
        solution:
          "Unified EtherCAT and PROFINET gateway retrofits linking existing machine tools to central IPCs.",
        technologies: ["Safety PLCs", "Industrial Gateways", "Servo Upgrades"],
        href: "/solutions/factory-automation",
      },
      {
        title: "Synchronized Conveyor Transfer Lines",
        challenge:
          "Unbalanced line takt times causing part accumulation and bottlenecking between stations.",
        solution:
          "Multi-zone servo transfer tracks with optical part singulation and automatic diversion gates.",
        technologies: ["Linear Actuators", "Servo Drives", "Vision Gating"],
        href: "/solutions/factory-automation",
      },
      {
        title: "In-Line Automated Quality Gating",
        challenge:
          "Subtle dimensional variances escaping manual QA inspection causing costly downstream scrap.",
        solution:
          "100% in-line dimensional metrology stations using 3D laser scanners and smart cameras.",
        technologies: ["3D Laser Profilers", "Edge AI Gateways", "Reject Gates"],
        href: "/solutions/factory-automation",
      },
    ],
  },
  {
    id: "smart-manufacturing",
    label: "Precision Positioning",
    subtitle: "Sub-micron stages, optical alignment & micro-dispensing",
    icon: Target,
    overviewHref: "/solutions/smart-manufacturing",
    cards: [
      {
        title: "Sub-Micron Semiconductor Stages",
        challenge:
          "Thermal drift and mechanical backlash degrading nanometer-level die placement precision.",
        solution:
          "Direct-drive ironless linear motor stages guided by crossed-roller ways with optical feedback.",
        technologies: ["Linear Motors", "Optical Scales", "Crossed Roller Bearings"],
        href: "/solutions/smart-manufacturing",
      },
      {
        title: "Multi-Axis Optical Alignment",
        challenge:
          "Multi-element optical lenses requiring sub-arcsecond tilt and sub-micron positioning.",
        solution:
          "High-stiffness zero-backlash strain-wave gearheads with micro-stepping closed-loop drivers.",
        technologies: ["Harmonic Reducers", "Rotary Actuators", "Sub-Arcmin Encoders"],
        href: "/solutions/smart-manufacturing",
      },
      {
        title: "Precision Jetting & Fluid Dispensing",
        challenge:
          "Maintaining uniform adhesive bead width across high-acceleration 3D curvilinear trajectories.",
        solution:
          "High-dynamic 3-axis Cartesian gantries running continuous velocity lookahead motion planning.",
        technologies: ["Ground Ball Screws", "Servo Motors", "Motion Controllers"],
        href: "/solutions/smart-manufacturing",
      },
    ],
  },
  {
    id: "material-handling",
    label: "Material Handling",
    subtitle: "Palletizing, AMR logistics & high-speed sorting",
    icon: Boxes,
    overviewHref: "/solutions/material-handling",
    cards: [
      {
        title: "Automated Robotic Palletizing",
        challenge:
          "High-rate mixed-SKU carton stacking requiring rapid pattern recomputation and endurance.",
        solution:
          "Dedicated 4-axis and 6-axis palletizing arms with vacuum area matrix grippers and layer slip.",
        technologies: ["Palletizing Robots", "Vacuum Grippers", "Safety Scanners"],
        href: "/solutions/material-handling",
      },
      {
        title: "Autonomous Mobile Transport (AMR)",
        challenge:
          "Manual forklift traffic congestion and safety hazards during warehouse-to-line transit.",
        solution:
          "Omnidirectional Mecanum and differential AMRs with LiDAR SLAM fleet coordination.",
        technologies: ["Mecanum Wheels", "Drive Modules", "Safety Scanners"],
        href: "/solutions/material-handling",
      },
      {
        title: "High-Speed Vision-Guided Sorting",
        challenge:
          "Randomly oriented bulk parts causing packaging stoppages on high-throughput consumer lines.",
        solution:
          "Vision-guided delta robots executing up to 140 picks per minute with smart vacuum pickers.",
        technologies: ["Delta Robots", "Machine Vision", "Conveyor Tracking"],
        href: "/solutions/material-handling",
      },
    ],
  },
  {
    id: "custom-robotics",
    label: "Custom Engineering",
    subtitle: "Bespoke mechatronics, environmental hardening & simulation",
    icon: Wrench,
    overviewHref: "/solutions/custom-robotics",
    cards: [
      {
        title: "Bespoke Mechatronic Drivetrains",
        challenge:
          "Severe space envelopes where standard off-the-shelf actuators or gearboxes cannot fit.",
        solution:
          "Custom frameless motor integrations, custom gearbox ratios, and application-specific housings.",
        technologies: ["Frameless Motors", "Harmonic Reducers", "FEA Analysis"],
        href: "/solutions/custom-robotics",
      },
      {
        title: "Cleanroom & Harsh Environment Hardening",
        challenge:
          "Standard commercial robotics failing in vacuum, cleanrooms, washdown, or foundry heat.",
        solution:
          "IP67/IP69K sealing packages, special fluoropolymer lubricants, and stainless steel hardware.",
        technologies: ["IP67 Actuators", "Stainless Enclosures", "Bellows Covers"],
        href: "/solutions/custom-robotics",
      },
      {
        title: "Digital Twin Simulation & Kinematics",
        challenge:
          "Uncertain cycle times, reach limitations, and collision risks delaying commissioning.",
        solution:
          "3D kinematics physics simulation, cycle time optimization, and pre-integrated FAT testing.",
        technologies: ["Digital Twin", "Kinematic Validation", "Turnkey FAT"],
        href: "/solutions/custom-robotics",
      },
    ],
  },
];

export function SolutionsMegaMenu({ onClose, onLinkClick, onQuoteClick }: SolutionsMegaMenuProps) {
  const [activeSolutionId, setActiveSolutionId] = useState<string>("motion-control");

  const currentCategory =
    SOLUTION_CATEGORIES.find((s) => s.id === activeSolutionId) || SOLUTION_CATEGORIES[0];

  return (
    <div className="w-full bg-[#FFFFFF] flex flex-col justify-between">
      {/* 2-AREA MAIN BODY */}
      <div className="flex flex-col lg:flex-row w-full min-h-[440px]">
        {/* =========================================================================
            AREA 1: COMPACT SOLUTION CATEGORY SIDEBAR (LEFT)
           ========================================================================= */}
        <div className="w-full lg:w-[250px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#E5EAF1] bg-[#F8FAFC] p-3 flex flex-col justify-between">
          <nav className="space-y-1" aria-label="Solution categories rail">
            {SOLUTION_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeSolutionId;
              const IconComponent = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveSolutionId(cat.id)}
                  onMouseEnter={() => setActiveSolutionId(cat.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-[12.5px] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#155EEF] font-semibold border-l-2 border-[#155EEF] shadow-2xs"
                      : "text-[#344054] hover:bg-[#F2F4F7] hover:text-[#172033]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive ? "text-[#155EEF]" : "text-[#667085] group-hover:text-[#172033]"
                      }`}
                    >
                      <IconComponent size={15} />
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <ChevronRight
                    size={13}
                    className={`shrink-0 transition-transform ${
                      isActive
                        ? "text-[#155EEF] translate-x-0.5"
                        : "text-[#98A2B3] group-hover:text-[#667085]"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Quick link at bottom of sidebar */}
          <div className="pt-2.5 mt-2 border-t border-[#E5EAF1] px-1">
            <Link
              to="/solutions"
              onClick={() => onLinkClick("All Turnkey Solutions", "/solutions")}
              className="flex items-center justify-between text-[11.5px] font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
            >
              <span>Explore All Solutions</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            AREA 2: CLEAN GRID OF SOLUTION CARDS (RIGHT)
           ========================================================================= */}
        <div className="flex-1 p-5 lg:p-6 bg-[#FFFFFF] flex flex-col justify-between">
          <div>
            {/* Header for Active Solution */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E5EAF1]">
              <div>
                <h3 className="text-sm font-bold text-[#172033] tracking-tight flex items-center gap-2">
                  <span>{currentCategory.label}</span>
                  <span className="text-[#98A2B3] font-normal text-xs">/</span>
                  <span className="text-xs font-normal text-[#667085]">
                    {currentCategory.subtitle}
                  </span>
                </h3>
              </div>

              <Link
                to={currentCategory.overviewHref as never}
                onClick={() =>
                  onLinkClick(`${currentCategory.label} Architecture`, currentCategory.overviewHref)
                }
                className="hidden sm:inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#155EEF] hover:text-[#1047BF] transition-colors"
              >
                <span>View System Architecture</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* 3-Column Clean Engineering Challenge & Solution Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {currentCategory.cards.map((card) => (
                <Link
                  key={card.title}
                  to={card.href as never}
                  onClick={() => onLinkClick(card.title, card.href)}
                  className="group flex flex-col justify-between rounded-xl border border-[#E5EAF1] bg-[#FFFFFF] hover:bg-[#F8FAFC] hover:border-[#B2CCFF] p-4 transition-all duration-150 shadow-2xs hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
                >
                  <div className="space-y-3">
                    {/* Solution Title */}
                    <h4 className="text-[13px] font-bold text-[#172033] group-hover:text-[#155EEF] leading-snug transition-colors">
                      {card.title}
                    </h4>

                    {/* Engineering Challenge Statement */}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#98A2B3] block mb-0.5">
                        Challenge
                      </span>
                      <p className="text-[11.5px] text-[#475467] leading-relaxed line-clamp-2">
                        {card.challenge}
                      </p>
                    </div>

                    {/* Intended Solution Statement */}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-0.5">
                        Solution
                      </span>
                      <p className="text-[11.5px] text-[#172033] font-medium leading-relaxed line-clamp-2">
                        {card.solution}
                      </p>
                    </div>

                    {/* Technologies Tags */}
                    <div className="pt-1 flex flex-wrap gap-1">
                      {card.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2F4F7] text-[#475467] border border-[#E5EAF1]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Explore Solution Link */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#F0F4F8] flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#155EEF] group-hover:text-[#1047BF] transition-colors">
                      <span>Explore Solution</span>
                      <ArrowRight
                        size={11}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CTA FOOTER STRIP
         ========================================================================= */}
      <div className="border-t border-[#E5EAF1] bg-[#F8FAFC] px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center shrink-0 border border-[#D1E0FF]">
            <Sparkles size={12} />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#172033]">
              Have a custom automation requirement?
            </span>
            <span className="hidden sm:inline text-xs text-[#667085] ml-1.5">
              Our systems engineering group evaluates payload envelopes, takt times, and fieldbus
              standards.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/book-consultation"
            onClick={() => {
              onClose();
              onLinkClick("Discuss Your Application", "/book-consultation");
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[#D1E0FF] bg-white hover:bg-[#EFF6FF] text-[#155EEF] text-xs font-semibold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>Discuss Your Application</span>
          </Link>

          <button
            type="button"
            onClick={onQuoteClick}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
          >
            <span>Talk to Engineering</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
