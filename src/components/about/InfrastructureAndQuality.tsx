import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  ShieldCheck,
  Sparkles,
  Factory,
  Cpu,
  Gauge,
  Microscope,
  CheckCircle2,
  ArrowRight,
  Award,
} from "lucide-react";

export function InfrastructureAndQuality() {
  return (
    <>
      {/* SECTION: LEADERSHIP & ENGINEERING TEAM (#leadership-team) */}
      <section
        id="leadership-team"
        className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
              <Users size={12} className="text-[#155EEF]" />
              ENGINEERING TALENT &amp; R&amp;D
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
              Leadership &amp; Multidisciplinary Engineering Team
            </h2>
            <p className="mt-3 text-base text-[#475467] leading-relaxed">
              Our engineering organization bridges physical mechanics with digital control. We bring
              together specialists across kinematics modeling, embedded firmware, high-voltage servo
              electronics, and turnkey automation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6">
              <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
                <Cpu size={18} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#101B2D]">
                Kinematics &amp; Mechanical Design
              </h3>
              <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                Specialized in strain-wave tooth profiles, FEA structural stress modeling, casting
                optimization, and torsional stiffness enhancement for robotic links and cycloidal
                gear trains.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF] font-semibold">
                FEA Simulation · Dynamic Sizing
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6">
              <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
                <Gauge size={18} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#101B2D]">
                Embedded Firmware &amp; Control
              </h3>
              <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                Developing deterministic fieldbus stacks (EtherCAT CoE, PROFINET IRT),
                Field-Oriented Control (FOC) algorithms for frameless BLDC motors, and
                sub-millisecond trajectory generation.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF] font-semibold">
                Sub-Millisecond CSP · FOC DSP
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6">
              <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
                <Factory size={18} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#101B2D]">
                Systems Integration &amp; Applications
              </h3>
              <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                Deploying turnkey cells, custom vacuum/pneumatic end-effectors, robotic welding
                cells, and safety perimeter calculations complying strictly with ISO 13849-1
                standards.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF] font-semibold">
                Turnkey Cells · Safety Interlocks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: MANUFACTURING & INFRASTRUCTURE (#infrastructure) */}
      <section
        id="infrastructure"
        className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-[#E5EAF1] scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
                <ShieldCheck size={12} className="text-[#155EEF]" />
                INFRASTRUCTURE &amp; QUALITY
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
                Manufacturing Infrastructure &amp; Metrology Validation
              </h2>
              <p className="mt-4 text-base text-[#475467] leading-relaxed">
                Every robotic component and motion subsystem is manufactured and validated under
                strict process controls. Our metrology facility benchmark critical gear profiles
                against international standards.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                    <Award size={16} className="text-[#155EEF]" />
                    <span>ISO 9001:2015 Verified</span>
                  </div>
                  <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                    Documented quality management across precision machining, assembly, cleanroom
                    prep, and load testing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                    <Microscope size={16} className="text-[#155EEF]" />
                    <span>CMM Metrology Lab</span>
                  </div>
                  <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                    Coordinate Measuring Machines verifying sub-micron pitch accuracy and runout
                    across all gear tooth profiles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                    <Gauge size={16} className="text-[#155EEF]" />
                    <span>Dyno Test Benches</span>
                  </div>
                  <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                    Automated dynamic dynamometer benches validating torsional stiffness, efficiency
                    curves, and thermal rise.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5EAF1]">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#101B2D]">
                    <ShieldCheck size={16} className="text-[#155EEF]" />
                    <span>ISO 9283 Standards</span>
                  </div>
                  <p className="mt-1 text-xs text-[#475467] leading-relaxed">
                    Manipulator pose repeatability, path velocity constancy, and multidirectional
                    overshoot validation.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E5EAF1] bg-white p-7 shadow-sm space-y-5">
                <div className="size-12 rounded-xl bg-[#EFF6FF] border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
                  <Factory size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#101B2D]">Traceable Quality Guarantee</h3>
                <p className="text-xs text-[#475467] leading-relaxed">
                  Every reducer, servo actuator, and manipulator assembly is serialized and paired
                  with its individual inspection report documenting backlash, no-load starting
                  torque, and encoder linearity.
                </p>
                <div className="pt-2">
                  <Link
                    to="/resources/faqs"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                  >
                    <span>Read Technical Standards FAQs</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INNOVATION & TECHNOLOGY (#innovation) */}
      <section
        id="innovation"
        className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-20"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
                <Sparkles size={12} className="text-[#155EEF]" />
                FUTURE ROBOTICS
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
                Robotics Innovation &amp; Intelligent Automation
              </h2>
              <p className="mt-3 text-base text-[#475467] leading-relaxed">
                Pioneering physical AI kinematics, edge diagnostics, and deterministic multi-axis
                synchronization for adaptive modern manufacturing environments.
              </p>
            </div>

            <Link
              to="/technology"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors shrink-0 group"
            >
              <span>Explore Technology Platform</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-mono font-bold text-[#155EEF] uppercase">
                01 // Kinematics
              </span>
              <h3 className="mt-2 text-base font-bold text-[#101B2D]">
                Adaptive Trajectory Generation
              </h3>
              <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                Algorithms that dynamically adjust acceleration profiles and vibration damping in
                real time, minimizing mechanical stress during high-speed directional changes.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-mono font-bold text-[#155EEF] uppercase">
                02 // Physical AI
              </span>
              <h3 className="mt-2 text-base font-bold text-[#101B2D]">
                Integrated Joint Intelligence
              </h3>
              <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                Edge sensors inside actuator housings monitoring high-frequency vibration, thermal
                transients, and current draw for predictive maintenance before mechanical failure
                occurs.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:shadow-md transition-shadow">
              <span className="text-[11px] font-mono font-bold text-[#155EEF] uppercase">
                03 // Connectivity
              </span>
              <h3 className="mt-2 text-base font-bold text-[#101B2D]">
                Open Fieldbus Architectures
              </h3>
              <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                Zero-friction interoperability with global PLC controllers, edge gateways, and
                digital twin simulations via standard EtherCAT and PROFINET profiles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
