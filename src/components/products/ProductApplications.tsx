import React from "react";
import { Link } from "@tanstack/react-router";
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, Layers } from "lucide-react";
import type { NormalizedProductData } from "./types";

interface ProductApplicationsProps {
  data: NormalizedProductData;
}

export function ProductApplications({ data }: ProductApplicationsProps) {
  if (data.applications.length === 0) {
    return null;
  }

  return (
    <section id="applications" className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              <Compass size={14} />
              <span>6. Target Industrial Applications</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Verified Deployment Scenarios &amp; Operating Environments
            </h2>
            <p className="mt-2 text-sm text-[#475467] leading-relaxed">
              Every application below reflects documented load capabilities, thermal equilibrium boundaries, and kinematics integration for {data.name}.
            </p>
          </div>

          <Link
            to="/applications"
            className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1.5 shrink-0"
          >
            Explore All Industry Solutions <ArrowRight size={13} />
          </Link>
        </div>

        {/* Applications Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.applications.map((app, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 flex flex-col justify-between hover:border-[#B2CCFF] transition-all"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1]">
                  <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF]">
                    Scenario 0{idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Deployment
                  </span>
                </div>

                {/* Application Name */}
                <h3 className="mt-3 font-bold text-base text-[#172033]">
                  {app.name}
                </h3>

                {/* Environment */}
                <p className="mt-1 text-xs text-[#667085] font-medium">
                  <strong>Environment:</strong> {app.environment}
                </p>

                {/* Challenge */}
                <div className="mt-3 text-xs bg-white p-3 rounded-lg border border-[#E5EAF1]">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#D92D20] block mb-1">
                    Operational Challenge:
                  </span>
                  <p className="text-[#344054] leading-relaxed">
                    {app.challenge}
                  </p>
                </div>

                {/* How Product Helps */}
                <div className="mt-3 text-xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] block mb-1">
                    How {data.name} Solves It:
                  </span>
                  <p className="text-[#475467] leading-relaxed">
                    {app.howProductHelps}
                  </p>
                </div>

                {/* Supporting Components */}
                {app.supportingComponents && app.supportingComponents.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#475467] block mb-1">
                      Required Supporting Subsystems:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#667085]">
                      {app.supportingComponents.map((comp, cIdx) => (
                        <li key={cIdx}>{comp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Selection / Limitations */}
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] space-y-2 text-[11px]">
                {app.engineeringConsiderations && (
                  <div className="text-[#475467]">
                    <strong className="text-[#172033]">Considerations:</strong> {app.engineeringConsiderations}
                  </div>
                )}
                <div className="text-[#B54708] bg-[#FFFAEB] p-2.5 rounded-lg border border-[#FEDF89] flex items-start gap-1.5">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5 text-[#B54708]" />
                  <span>{app.limitations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
