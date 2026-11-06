import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Trash2,
  Stethoscope,
  Sprout,
  TrainTrack,
  Boxes,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Calendar,
  Cpu,
  Activity,
  Video,
  Bot,
} from "lucide-react";

interface SolutionsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface RoboticsSolutionItemConfig {
  id: string;
  category: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  tag: string;
}

const ROBOTICS_SOLUTIONS_LIST: RoboticsSolutionItemConfig[] = [
  {
    id: "robotic-process-automation",
    category: "Industrial Workcells",
    title: "Robotic Process Automation (RPA)",
    description: "Sub-millimeter precision pick-and-place, vision-guided workcells, and turnkey manufacturing pipelines.",
    href: "/robotic-process-automation",
    icon: Cpu,
    tag: "Workcell Automation",
  },
  {
    id: "robotic-process-analysis-tools",
    category: "Process Engineering",
    title: "Robotic Process Analysis Tools",
    description: "Kinematic cycle time bottlenecks, multi-axis torque margins, OEE loss diagnostics, and trajectory jerk modeling.",
    href: "/robotic-process-analysis-tools",
    icon: Activity,
    tag: "Physics & OEE Suite",
  },
  {
    id: "video-based-robotization-calculator",
    category: "AI Video Analytics",
    title: "Video Robotization Calculator",
    description: "Ingest manual video footage to extract MTM micro-motions, kinematic envelopes, and robotic ROI payback.",
    href: "/video-based-robotization-calculator",
    icon: Video,
    tag: "CV Motion Tracking",
  },
  {
    id: "traffic-profile-content-agents",
    category: "Autonomous Intelligence",
    title: "Traffic Profile Content Agents",
    description: "Autonomous multi-agent content generation engine aligning high-intent ICP profiles with precision motion robotics.",
    href: "/traffic-profile-content-agents",
    icon: Bot,
    tag: "IN27-298 Fleet",
  },
  {
    id: "smart-waste-collection-robot",
    category: "Smart Infrastructure",
    title: "Smart Waste Collection Robot",
    description: "AI-based waste detection, object recognition, and automated urban & facility collection.",
    href: "/solutions/smart-waste-collection-robot",
    icon: Trash2,
    tag: "Autonomous Mobile",
  },
  {
    id: "hospital-delivery-robot",
    category: "Healthcare Robotics",
    title: "Hospital Delivery Robot",
    description: "Autonomous indoor transport for medicines, sterile supplies, documents, and lab reports.",
    href: "/solutions/hospital-delivery-robot",
    icon: Stethoscope,
    tag: "Assistive Logistics",
  },
  {
    id: "agricultural-crop-monitoring-robot",
    category: "Agricultural Robotics",
    title: "Agricultural Crop Monitoring Robot",
    description: "Computer vision & multispectral health analysis for early crop disease identification.",
    href: "/solutions/agricultural-crop-monitoring-robot",
    icon: Sprout,
    tag: "Precision Farming",
  },
  {
    id: "railway-track-inspection-robot",
    category: "Railway Robotics",
    title: "Railway Track Inspection Robot",
    description: "Vision & sensor-based rail defect detection, crack profiling, and automated maintenance alerts.",
    href: "/solutions/railway-track-inspection-robot",
    icon: TrainTrack,
    tag: "Decision Support",
  },
  {
    id: "warehouse-inventory-robot",
    category: "Logistics Robotics",
    title: "Warehouse Inventory Robot",
    description: "Automated stock tracking, RFID scanning, 3D rack location verification, and WMS syncing.",
    href: "/solutions/warehouse-inventory-robot",
    icon: Boxes,
    tag: "Inventory Automation",
  },
  {
    id: "elderly-assistance-robot",
    category: "Assistive Robotics",
    title: "Elderly Assistance Robot",
    description: "Caregiver support platform with scheduled reminders, communication, and emergency alerts.",
    href: "/solutions/elderly-assistance-robot",
    icon: HeartHandshake,
    tag: "Caregiver Support",
  },
];

export function SolutionsMegaMenu({
  onClose,
  onLinkClick,
  onQuoteClick,
}: SolutionsMegaMenuProps) {
  return (
    <div className="p-6 bg-white selection:bg-[#155EEF] selection:text-white">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#155EEF] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
              INTELLIGENT ROBOTICS SOLUTIONS
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-1">
            Engineering intelligent robots for real-world challenges across industries.
          </p>
        </div>

        <Link
          to="/solutions"
          onClick={() => onLinkClick("Explore All Robotics Solutions", "/solutions")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] rounded px-2.5 py-1.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 shrink-0 self-start sm:self-auto"
        >
          <span>Explore All Robotics Solutions</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* 2. 6-SOLUTIONS GRID IN 3 COLUMNS × 2 ROWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4">
        {ROBOTICS_SOLUTIONS_LIST.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.href as never}
              onClick={() => onLinkClick(item.title, item.href)}
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-slate-150/90 bg-white hover:border-[#155EEF]/50 hover:bg-[#F8FAFC] hover:shadow-[0_4px_16px_rgba(21,94,239,0.08)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
            >
              <div>
                {/* Category Label + Tag Bar */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                    {item.category}
                  </span>
                  <span className="rounded-xs bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase text-slate-500 border border-slate-200/60">
                    {item.tag}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-blue-50/80 border border-blue-100 text-[#155EEF] shrink-0 flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors duration-200 shadow-2xs">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors line-clamp-1 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11.5px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Indicator */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#155EEF]">
                <span className="group-hover:underline">Explore Solution</span>
                <ArrowRight
                  size={12}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. MEGA MENU FOOTER BAR */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-[#155EEF]" />
          <span className="font-mono text-[11px] text-slate-600">
            Field-Proven Kinematics · Edge AI Perception · Autonomous Navigation
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/solutions"
            onClick={() => onLinkClick("Explore All Solutions", "/solutions")}
            className="text-slate-700 hover:text-[#155EEF] font-semibold transition-colors"
          >
            Explore All Solutions →
          </Link>

          <span className="text-slate-300">•</span>

          <Link
            to="/book-consultation"
            onClick={() => onLinkClick("Discuss Your Robotics Project", "/book-consultation")}
            className="text-slate-700 hover:text-[#155EEF] font-semibold transition-colors flex items-center gap-1"
          >
            <Calendar size={12} className="text-[#0284C7]" />
            <span>Discuss Your Robotics Project</span>
          </Link>

          <span className="text-slate-300">•</span>

          <button
            type="button"
            onClick={onQuoteClick}
            className="text-[#155EEF] hover:text-[#1047BF] font-bold cursor-pointer transition-colors flex items-center gap-1"
          >
            <PhoneCall size={12} />
            <span>Request an Engineering Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolutionsMegaMenu;
