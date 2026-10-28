import React from "react";
import { Plug, Cpu, Wrench, ShieldCheck, Network } from "lucide-react";
import type { NormalizedProductData } from "./types";

interface ProductIntegrationProps {
  data: NormalizedProductData;
}

export function ProductIntegration({ data }: ProductIntegrationProps) {
  return (
    <section id="integration" className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            <Plug size={14} />
            <span>8. Integration &amp; Compatibility</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Mechanical, Electrical &amp; Control Interfaces
          </h2>
          <p className="mt-2 text-sm text-[#475467] leading-relaxed">
            Standardized interfaces for drop-in mechanical alignment, regulated power delivery, and deterministic fieldbus synchronization with host PLC and motion controllers.
          </p>
        </div>

        {/* 3 Core Interface Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mechanical Mounting */}
          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase text-[#155EEF]">
              <Wrench size={15} />
              <span>Mechanical Interface</span>
            </div>
            <h3 className="mt-2 font-bold text-base text-[#172033]">
              {data.mechanicalInterface.title}
            </h3>
            <p className="mt-2 font-mono text-xs font-bold text-[#155EEF] bg-white p-2 rounded border border-[#E5EAF1]">
              {data.mechanicalInterface.value}
            </p>
            <p className="mt-3 text-xs text-[#667085] leading-relaxed">
              {data.mechanicalInterface.details}
            </p>
          </div>

          {/* Electrical & Power */}
          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase text-[#155EEF]">
              <Cpu size={15} />
              <span>Electrical &amp; Power</span>
            </div>
            <h3 className="mt-2 font-bold text-base text-[#172033]">
              {data.electricalRequirements.title}
            </h3>
            <p className="mt-2 font-mono text-xs font-bold text-[#155EEF] bg-white p-2 rounded border border-[#E5EAF1]">
              {data.electricalRequirements.value}
            </p>
            <p className="mt-3 text-xs text-[#667085] leading-relaxed">
              {data.electricalRequirements.details}
            </p>
          </div>

          {/* Control & Fieldbus */}
          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase text-[#155EEF]">
              <Network size={15} />
              <span>Fieldbus Synchronization</span>
            </div>
            <h3 className="mt-2 font-bold text-base text-[#172033]">
              {data.controlAndFieldbus.title}
            </h3>
            <p className="mt-2 font-mono text-xs font-bold text-[#155EEF] bg-white p-2 rounded border border-[#E5EAF1]">
              {data.controlAndFieldbus.value}
            </p>
            <p className="mt-3 text-xs text-[#667085] leading-relaxed">
              {data.controlAndFieldbus.details}
            </p>
          </div>

        </div>

        {/* Supported Fieldbuses Chips */}
        <div className="mt-6 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5">
          <span className="text-xs font-bold text-[#172033] uppercase tracking-wider block mb-3">
            Supported Industrial Fieldbuses &amp; Safety Protocols
          </span>
          <div className="flex flex-wrap gap-2">
            {data.controlAndFieldbus.supportedProtocols.map((proto) => (
              <span
                key={proto}
                className="rounded-lg border border-[#E5EAF1] bg-white px-3 py-1 font-mono text-xs font-semibold text-[#172033] hover:border-[#155EEF] transition-colors shadow-2xs"
              >
                {proto}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
