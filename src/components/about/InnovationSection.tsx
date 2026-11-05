import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, GraduationCap, Brain, Cpu, Layers, ArrowRight, Briefcase } from "lucide-react";

export function InnovationSection() {
  return (
    <section
      id="presence-innovation"
      className="py-20 lg:py-24 bg-white border-b border-[#E5EAF1] scroll-mt-36"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] bg-[#EFF6FF] border border-[#D1E0FF]">
              <Sparkles size={12} className="text-[#155EEF]" />
              ENGINEERING CULTURE &amp; R&amp;D
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#101B2D]">
              Driving Robotics Innovation Through Engineering Talent
            </h2>
            <p className="mt-3 text-base text-[#475467] leading-relaxed">
              We cultivate a culture of deep technical rigor where robotics research, simulation
              testing, student fellowships, and hands-on hardware fabrication converge.
            </p>
          </div>

          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-sm shrink-0"
          >
            <Briefcase size={14} />
            <span>Explore Engineering Opportunities</span>
          </Link>
        </div>

        {/* Culture & Innovation Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:border-[#155EEF]/50 hover:bg-white transition-all duration-200">
            <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#101B2D]">
              Robotics Research &amp; Development
            </h3>
            <p className="mt-2 text-xs text-[#475467] leading-relaxed">
              Dedicated prototyping labs testing non-linear friction compensation, flexspline tooth
              wear under cyclic loading, and zero-backlash harmonic gearhead optimization.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:border-[#155EEF]/50 hover:bg-white transition-all duration-200">
            <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#9333EA] flex items-center justify-center">
              <Brain size={18} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#101B2D]">
              Physical AI &amp; Embodied Intelligence
            </h3>
            <p className="mt-2 text-xs text-[#475467] leading-relaxed">
              Developing spatial representations and Vision-Language-Action (VLA) models allowing
              industrial arms to perform complex multi-modal manipulation in dynamic workcells.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:border-[#155EEF]/50 hover:bg-white transition-all duration-200">
            <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#0284C7] flex items-center justify-center">
              <Layers size={18} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#101B2D]">
              Simulation &amp; Digital Engineering
            </h3>
            <p className="mt-2 text-xs text-[#475467] leading-relaxed">
              Photorealistic physics simulations in NVIDIA Isaac Sim bridging sim-to-real transfer,
              evaluating reach envelopes, cycle-time optimizations, and collision avoidance before
              deployment.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:border-[#155EEF]/50 hover:bg-white transition-all duration-200">
            <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#16A34A] flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#101B2D]">
              Engineering Internships &amp; Fellowships
            </h3>
            <p className="mt-2 text-xs text-[#475467] leading-relaxed">
              Partnering with top technical institutions to mentor promising undergraduate and
              graduate engineers in embedded firmware, motor driver design, and robotics vision.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:border-[#155EEF]/50 hover:bg-white transition-all duration-200">
            <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#155EEF] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#101B2D]">
              Humanoid Robotics Exploration
            </h3>
            <p className="mt-2 text-xs text-[#475467] leading-relaxed">
              Evaluating high-torque density compact rotary actuators, compliant joint impedance
              control, and bipedal stability algorithms for next-generation humanoid form factors.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] hover:border-[#155EEF]/50 hover:bg-white transition-all duration-200">
            <div className="size-10 rounded-xl bg-white border border-[#D1E0FF] text-[#D97706] flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#101B2D]">
              Specialized Engineering Projects
            </h3>
            <p className="mt-2 text-xs text-[#475467] leading-relaxed">
              Collaborative joint-development programs with machine builders custom-engineering
              robotic wrist axes, high-speed delta pickers, and automated tool-change systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
