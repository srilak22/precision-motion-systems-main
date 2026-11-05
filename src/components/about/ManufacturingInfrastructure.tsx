import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Factory, Gauge, Microscope, Award, ArrowRight } from "lucide-react";

export function ManufacturingInfrastructure() {
  return (
    <section
      id="infrastructure"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
              <ShieldCheck size={12} className="text-[#155EEF]" />
              MANUFACTURING &amp; INFRASTRUCTURE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
              Manufacturing Infrastructure &amp; Quality Metrology
            </h2>
            <p className="mt-4 text-base text-[#475467] leading-relaxed">
              Every robotic reducer, harmonic cup, servo actuator, and manipulator assembly is
              manufactured and validated under strict process controls. Our metrology facility
              benchmarks gear tooth runout, torsional backlash, and motor efficiency against
              international standards.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                  <Award size={16} className="text-[#155EEF]" />
                  <span>ISO 9001:2015 Verified</span>
                </div>
                <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                  Documented quality management across precision machining, cleanroom assembly, and
                  endurance testing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                  <Microscope size={16} className="text-[#155EEF]" />
                  <span>CMM Metrology Lab</span>
                </div>
                <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                  Coordinate Measuring Machines verifying sub-micron pitch accuracy and tooth flank
                  profiles.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                  <Gauge size={16} className="text-[#155EEF]" />
                  <span>Dyno Test Benches</span>
                </div>
                <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                  Automated dynamic dynamometer test rigs validating continuous torque, efficiency
                  curves, and thermal rise.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF1]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                  <ShieldCheck size={16} className="text-[#155EEF]" />
                  <span>ISO 9283 Standards</span>
                </div>
                <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                  Laser tracking verification of manipulator pose repeatability and path velocity
                  constancy.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-7 shadow-sm space-y-5">
              <div className="size-12 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
                <Factory size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#101B2D]">Serialized Quality Traceability</h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Every component shipped from INDUS manufacturing facilities is serialized and
                benchmarked against rigorous mechanical and electrical directives, backed by
                individual inspection reports.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/engineering-services/technical-specifications"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <span>View Technical Specifications</span>
                  <ArrowRight size={13} />
                </Link>

                <Link
                  to="/engineering-services"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E5EAF1] hover:bg-slate-50 text-[#344054] text-xs font-bold transition-colors"
                >
                  <span>Engineering Services</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
