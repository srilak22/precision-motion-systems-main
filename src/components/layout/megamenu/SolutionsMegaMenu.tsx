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
  Cpu,
  Activity,
  Video,
} from "lucide-react";

interface SolutionsMegaMenuProps {
  onClose: () => void;
  onLinkClick: (title: string, href: string) => void;
  onQuoteClick: () => void;
}

interface RoboticsSolutionItemConfig {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
}

const ROBOTICS_SOLUTIONS_LIST: RoboticsSolutionItemConfig[] = [
  {
    id: "robotic-process-automation",
    title: "Robotic Process Automation (RPA)",
    href: "/robotic-process-automation",
    icon: Cpu,
  },
  {
    id: "robotic-process-analysis-tools",
    title: "Robotic Process Analysis Tools",
    href: "/robotic-process-analysis-tools",
    icon: Activity,
  },
  {
    id: "video-based-robotization-calculator",
    title: "Video Robotization Calculator",
    href: "/video-based-robotization-calculator",
    icon: Video,
  },
  {
    id: "smart-waste-collection-robot",
    title: "Smart Waste Collection Robot",
    href: "/solutions/smart-waste-collection-robot",
    icon: Trash2,
  },
  {
    id: "hospital-delivery-robot",
    title: "Hospital Delivery Robot",
    href: "/solutions/hospital-delivery-robot",
    icon: Stethoscope,
  },
  {
    id: "agricultural-crop-monitoring-robot",
    title: "Agricultural Crop Monitoring Robot",
    href: "/solutions/agricultural-crop-monitoring-robot",
    icon: Sprout,
  },
  {
    id: "railway-track-inspection-robot",
    title: "Railway Track Inspection Robot",
    href: "/solutions/railway-track-inspection-robot",
    icon: TrainTrack,
  },
  {
    id: "warehouse-inventory-robot",
    title: "Warehouse Inventory Robot",
    href: "/solutions/warehouse-inventory-robot",
    icon: Boxes,
  },
  {
    id: "elderly-assistance-robot",
    title: "Elderly Assistance Robot",
    href: "/solutions/elderly-assistance-robot",
    icon: HeartHandshake,
  },
];

export function SolutionsMegaMenu({
  onLinkClick,
}: SolutionsMegaMenuProps) {
  return (
    <div className="p-5 bg-white max-w-[980px] mx-auto selection:bg-[#155EEF] selection:text-white">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Robotics Solutions
        </span>
        <Link
          to="/solutions"
          onClick={() => onLinkClick("All Solutions", "/solutions")}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors group"
        >
          <span>All Solutions</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-3">
        {ROBOTICS_SOLUTIONS_LIST.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href as never}
              onClick={() => onLinkClick(item.title, item.href)}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF]"
            >
              <div className="size-8 rounded-md bg-blue-50 text-[#155EEF] shrink-0 flex items-center justify-center group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                <Icon size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-[#155EEF] transition-colors truncate">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SolutionsMegaMenu;
