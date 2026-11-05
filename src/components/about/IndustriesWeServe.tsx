import React from "react";
import { Link } from "@tanstack/react-router";
import { Car, Cpu, Package, Truck, Flame, UtensilsCrossed, ArrowRight, Layers } from "lucide-react";
import heroWeldingCellImg from "@/assets/hero/hero-welding-cell.jpg";
import sensorsFeedbackImg from "@/assets/products/sensors-feedback.jpg";
import palletizingRobotImg from "@/assets/products/palletizing-robot.jpg";
import mobileRoboticsImg from "@/assets/mobile-robotics.jpg";
import pillarIndustrialImg from "@/assets/taxonomy/pillar-industrial.jpg";
import cobotRobotImg from "@/assets/products/cobot-robot.jpg";

interface IndustryCardItem {
  id: string;
  name: string;
  application: string;
  description: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  image: string;
  highlight: string;
}

const INDUSTRIES: IndustryCardItem[] = [
  {
    id: "automotive",
    name: "Automotive & EV",
    application: "Body Welding & Battery Assembly",
    description:
      "High-rigidity cycloidal joints and articulated arms for spot welding, laser seam tracking, and automated electric vehicle battery module insertion.",
    icon: Car,
    image: heroWeldingCellImg,
    highlight: "High-Payload Torsional Rigidity",
  },
  {
    id: "electronics",
    name: "Electronics & Semiconductor",
    application: "Micro-Assembly & Wafer Handling",
    description:
      "Sub-micron repeatability SCARA manipulators and zero-backlash harmonic gearheads for cleanroom wafer transport and precision PCB component placement.",
    icon: Cpu,
    image: sensorsFeedbackImg,
    highlight: "Sub-Micron Encoder Repeatability",
  },
  {
    id: "packaging",
    name: "Packaging & Palletizing",
    application: "High-Speed Sortation & Case Packing",
    description:
      "Parallel kinematic delta robots and high-throughput 4-axis palletizing arms capable of continuous pick rates exceeding 120 cycles per minute.",
    icon: Package,
    image: palletizingRobotImg,
    highlight: "120+ Cycles/Min Dynamic Motion",
  },
  {
    id: "logistics",
    name: "Warehousing & Logistics",
    application: "Autonomous Mobile Transport",
    description:
      "Integrated brushless AGV drive wheel modules, Mecanum omnidirectional chassis, and safety laser integration for autonomous internal transit.",
    icon: Truck,
    image: mobileRoboticsImg,
    highlight: "Integrated In-Hub Drive Wheels",
  },
  {
    id: "metal-fabrication",
    name: "Metal Fabrication",
    application: "CNC Tending & Press Brake Loading",
    description:
      "Heavy-duty industrial manipulators with sealed IP67 wrist cavities resistant to cutting fluids, grinding grit, and welding spatter.",
    icon: Flame,
    image: pillarIndustrialImg,
    highlight: "Sealed IP67 Foundry Protection",
  },
  {
    id: "pharma-food",
    name: "Food & Pharmaceutical",
    application: "Hygienic Transfer & Blister Packing",
    description:
      "Corrosion-resistant stainless steel collaborative arms with washdown IP69K sealing, food-grade lubricants, and cleanroom certification.",
    icon: UtensilsCrossed,
    image: cobotRobotImg,
    highlight: "Washdown Food-Grade Compliance",
  },
];

export function IndustriesWeServe() {
  return (
    <section
      id="industries"
      className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
              <Layers size={12} className="text-[#155EEF]" />
              SECTORS &amp; APPLICATIONS
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
              Industries We Serve
            </h2>
            <p className="mt-3 text-base text-[#475467] leading-relaxed">
              INDUS motion technology and robotic systems are deployed across demanding industrial
              environments where uptime, cycle speed, and mechanical precision are critical.
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

        {/* 6 Industries Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;

            return (
              <div
                key={ind.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E5EAF1] bg-white overflow-hidden hover:border-[#155EEF]/50 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Image with overlay highlight */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={ind.image}
                      alt={ind.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold bg-white/95 text-[#101B2D] border border-slate-200/80 shadow-xs">
                        <Icon size={12} className="text-[#155EEF]" />
                        {ind.name}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#101B2D]/80 backdrop-blur-sm text-white">
                        {ind.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <span className="text-[11px] font-mono font-bold text-[#155EEF] uppercase tracking-wider">
                      {ind.application}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#475467] leading-relaxed">{ind.description}</p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-5 pt-0">
                  <div className="pt-3.5 border-t border-[#F2F4F7]">
                    <Link
                      to="/industries"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] group-hover:text-[#1047BF] transition-colors"
                    >
                      <span>View Sector Case Examples</span>
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
