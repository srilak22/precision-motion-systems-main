import React from "react";
import { Award } from "lucide-react";
import { ENGINEERING_PHILOSOPHIES } from "@/data/aboutPageData";

export function EngineeringPhilosophy() {
  return (
    <section
      id="philosophy"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Award size={12} className="text-[#155EEF]" />
            CORE METHODOLOGY
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Our Engineering Philosophy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            Inspired by deterministic physics, we believe robotics and automation should deliver
            uncompromised mechanical repeatability, structural longevity, and software transparency.
          </p>
        </div>

        {/* 6 Philosophy Cards Grid (3x2 on desktop) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENGINEERING_PHILOSOPHIES.map((item) => (
            <div
              key={item.number}
              className="p-7 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:bg-white hover:border-[#155EEF]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl font-mono font-bold text-[#CBD5E1] group-hover:text-[#155EEF] transition-colors">
                  {item.number}
                </span>

                <h3 className="mt-4 text-lg font-bold text-[#101B2D] group-hover:text-[#155EEF] transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs text-[#475467] leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5EAF1]">
                <span className="text-[11px] font-mono font-semibold text-[#155EEF]">
                  // Rigorous First-Principles Design
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
