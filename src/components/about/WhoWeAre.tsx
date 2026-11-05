import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Cog,
  Bot,
  CircuitBoard,
  CheckCircle2,
  ArrowRight,
  Workflow,
  Shield,
  Layers,
} from "lucide-react";
import roboticComponentsImg from "@/assets/robotic-components.jpg";

export function WhoWeAre() {
  return (
    <section
      id="who-we-are"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
            <Bot size={12} className="text-[#155EEF]" />
            WHO WE ARE
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
            Engineering Precision Motion &amp; Industrial Robotics
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475467] leading-relaxed">
            INDUS is an industrial robotics and precision motion technology engineering company. We
            specialize in designing and delivering high-performance robotic manipulators,
            zero-backlash mechanical gearheads, and intelligent motion subsystems that power modern
            automation.
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Detailed Narratives & Value Delivery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-l-2 border-[#155EEF] pl-4">
              <h3 className="text-lg font-bold text-[#101B2D]">
                Focus on Industrial Robotics &amp; Kinematics
              </h3>
              <p className="mt-2 text-sm text-[#475467] leading-relaxed">
                Modern manufacturing demands deterministic accuracy and rugged mechanical
                repeatability. INDUS develops 6-axis articulated arms, collaborative cobots, delta
                packaging manipulators, and autonomous mobile wheel platforms built specifically to
                withstand continuous multi-shift production.
              </p>
            </div>

            <div className="border-l-2 border-[#38BDF8] pl-4">
              <h3 className="text-lg font-bold text-[#101B2D]">Precision Motion Engineering</h3>
              <p className="mt-2 text-sm text-[#475467] leading-relaxed">
                At the heart of every robotic joint is our precision actuation chain. We engineer
                strain-wave harmonic reducers, high-rigidity RV cycloidal drives, low-inertia
                frameless brushless torque motors, and optical absolute encoders that eliminate
                backlash and provide sub-arcminute lost motion.
              </p>
            </div>

            <div className="border-l-2 border-[#16A34A] pl-4">
              <h3 className="text-lg font-bold text-[#101B2D]">
                Our Role in Industrial Automation
              </h3>
              <p className="mt-2 text-sm text-[#475467] leading-relaxed">
                We partner with machine builders, system integrators, and plant engineers as a
                foundational mechatronics partner. By combining open fieldbuses (EtherCAT, PROFINET
                IRT) with standardized mechanical ISO interfaces, we help customers accelerate
                machine build schedules, eliminate kinematic integration risks, and ensure
                predictable factory floor uptime.
              </p>
            </div>

            {/* Value checklist */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Zero-backlash precision joint mechanisms",
                "Deterministic sub-millisecond fieldbus synchronization",
                "Application-specific kinematic sizing and torque calculation",
                "Direct engineer-to-engineer technical consultation",
              ].map((val) => (
                <div key={val} className="flex items-start gap-2.5 text-xs text-[#344054]">
                  <CheckCircle2 size={16} className="text-[#155EEF] shrink-0 mt-0.5" />
                  <span className="font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Technical Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-3 shadow-lg">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={roboticComponentsImg}
                  alt="INDUS Precision Motion Subsystems & Actuators"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Informative bottom banner */}
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-[#E5EAF1] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101B2D] flex items-center gap-1.5">
                    <Workflow size={14} className="text-[#155EEF]" />
                    Full Actuation Chain
                  </span>
                  <span className="text-[11px] font-mono text-[#155EEF] font-semibold">
                    ISO &amp; DIN Standard
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-[#667085] leading-relaxed">
                  Every component is engineered from physical first principles to optimize inertia
                  match, torsional stiffness, and thermal dissipation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
