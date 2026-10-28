import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Factory, Cog, Layers } from "lucide-react";
import type { Category } from "@/data/robotics";

export interface CategoryApplicationsSectionProps {
  category: Category;
}

export function CategoryApplicationsSection({
  category,
}: CategoryApplicationsSectionProps) {
  const applications = category.applications || [
    "Automotive Powertrain & EV Battery Assembly",
    "Semiconductor Wafer Transfer & Cleanroom Metrology",
    "CNC High-Speed Milling & Robotic Machine Tending",
    "Automated Packaging, Sortation & Case Palletizing",
    "Aerospace Composite Drilling & Rivet Inspection",
    "Medical Device Precision Micromanipulation",
  ];

  const relatedTechs = category.relatedTechnologies || [
    {
      name: "Precision Reducers",
      href: "/products/motion-actuation",
      description: "Zero-backlash harmonic and cycloidal gear units for multi-axis joints.",
    },
    {
      name: "Kinematic Sizing Calculators",
      href: "/technology/calculators",
      description: "Online inertia ratio, torque derating, and cycle time simulators.",
    },
    {
      name: "Robotics Intelligence Explorer",
      href: "/technology/intelligence-explorer",
      description: "Level 0–5 autonomy framework for synchronized automation cells.",
    },
  ];

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/50 px-4 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Industrial Applications */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
                Section F1: Field Deployment
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-slate-900">
                Primary Industrial Applications
              </h2>
              <p className="mt-1.5 text-xs text-slate-600">
                Validated manufacturing tasks where {category.title} delivers proven precision and uptime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {applications.map((app, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs flex items-start gap-3 hover:border-[#155EEF]/50 transition-colors"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#155EEF]">
                    <Factory size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-snug">
                      {app}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5 block">
                      Production Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Coordinated Technologies */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF]">
                Section F2: Coordinated Systems
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-slate-900">
                Related Technologies
              </h3>
              <p className="mt-1.5 text-xs text-slate-600">
                Interoperable motion components and engineering sizing utilities.
              </p>
            </div>

            <div className="space-y-3">
              {relatedTechs.map((tech, i) => (
                <Link
                  key={i}
                  to={tech.href as never}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-[#155EEF]/50 hover:bg-[#F8FAFC] transition-all"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold uppercase text-slate-900 group-hover:text-[#155EEF] transition-colors flex items-center gap-1.5">
                      <span>{tech.name}</span>
                      <ArrowRight
                        size={12}
                        className="text-slate-300 group-hover:text-[#155EEF] transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {tech.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
