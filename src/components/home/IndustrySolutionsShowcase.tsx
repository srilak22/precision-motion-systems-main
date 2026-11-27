import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Factory,
  Sprout,
  Stethoscope,
  Warehouse,
} from "lucide-react";

import mfgImg from "@/assets/solution-manufacturing-auto.jpg";
import warehouseImg from "@/assets/solution-warehouse-logistics.jpg";
import healthcareImg from "@/assets/solution-healthcare-robot.jpg";
import agricultureImg from "@/assets/solution-agriculture-robot.jpg";
import hospitalityImg from "@/assets/solution-hospitality-robot.jpg";

const INDUSTRY_CARDS = [
  {
    id: "manufacturing-automotive",
    title: "Manufacturing & Automotive",
    subtitle: "6-Axis Arms, Cobots & SCARA/Delta",
    href: "/solutions/manufacturing-automotive",
    image: mfgImg,
    icon: Factory,
  },
  {
    id: "warehousing-ecommerce-logistics",
    title: "Warehousing & Logistics",
    subtitle: "AMRs, Autonomous Forklifts & Palletizers",
    href: "/solutions/warehousing-ecommerce-logistics",
    image: warehouseImg,
    icon: Warehouse,
  },
  {
    id: "healthcare-pharmaceuticals",
    title: "Healthcare & Pharma",
    subtitle: "UV-C Sterilization, Couriers & Lab Arms",
    href: "/solutions/healthcare-pharmaceuticals",
    image: healthcareImg,
    icon: Stethoscope,
  },
  {
    id: "agriculture-food-processing",
    title: "Agriculture & Food",
    subtitle: "Field Rovers, IP69K Cobots & Harvesters",
    href: "/solutions/agriculture-food-processing",
    image: agricultureImg,
    icon: Sprout,
  },
  {
    id: "hospitality-retail-facility-management",
    title: "Hospitality & Retail",
    subtitle: "Floor Scrubbers, Concierge & Patrol Bots",
    href: "/solutions/hospitality-retail-facility-management",
    image: hospitalityImg,
    icon: Building2,
  },
];

export function IndustrySolutionsShowcase() {
  return (
    <section className="bg-white border-b border-slate-200 py-14 lg:py-20 px-5 lg:px-10">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              Solutions by Industry
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
              Explore Robotics Tailored to Your Sector
            </h2>
          </div>
          <Link
            to="/solutions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#155EEF] hover:text-[#1047BF] shrink-0"
          >
            <span>Explore All Solutions</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {INDUSTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.href as never}
                className="group relative rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden aspect-[4/5] flex flex-col justify-end shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                <div className="relative z-10 p-5 text-white space-y-2">
                  <div className="inline-flex items-center justify-center size-8 rounded-lg bg-[#155EEF]/90 text-white">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-base font-bold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 pt-1">
                    <span>Explore</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
