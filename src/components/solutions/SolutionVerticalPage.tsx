import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Bot,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import {
  SOLUTION_VERTICALS_DATA,
  type SolutionVerticalData,
} from "@/data/solutionVerticals";

interface SolutionVerticalPageProps {
  vertical: SolutionVerticalData;
}

export function SolutionVerticalPage({ vertical }: SolutionVerticalPageProps) {
  const { openModal } = useModals();
  const [activeCapId, setActiveCapId] = useState<string>(
    vertical.capabilities[0].id,
  );
  const [activeRobotId, setActiveRobotId] = useState<string>(
    vertical.robots[0].id,
  );

  const activeCapability =
    vertical.capabilities.find((c) => c.id === activeCapId) ??
    vertical.capabilities[0];

  const activeRobot =
    vertical.robots.find((r) => r.id === activeRobotId) ?? vertical.robots[0];

  const otherVerticals = SOLUTION_VERTICALS_DATA.filter(
    (v) => v.id !== vertical.id,
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0B1324] text-white">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8"
          >
            <Link to="/solutions" className="hover:text-white transition-colors">
              Solutions
            </Link>
            <ChevronRight size={14} />
            <span className="text-sky-300">{vertical.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
                <Bot size={14} />
                <span>{vertical.title}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08]">
                {vertical.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {vertical.heroSubtitle}
              </p>

              {/* Target Clients Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {vertical.targetClients.map((client) => (
                  <span
                    key={client}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                  >
                    {client}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => openModal("quote")}
                  className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold rounded-full px-7 h-12 cursor-pointer"
                >
                  <span>Contact Sales</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <a
                  href="#fleet-specs"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 hover:bg-white/10 px-6 h-12 text-sm font-semibold text-white transition-colors"
                >
                  <span>Explore Fleet Specs</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/10] bg-slate-900">
                <img
                  src={vertical.image}
                  alt={vertical.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1324]/60 via-transparent to-transparent" />
              </div>

              {/* Hero KPI Strip */}
              <div className="grid grid-cols-3 gap-3">
                {vertical.heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-xs"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-sky-300">
                      {metric.value}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-300 mt-0.5">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAPABILITIES EXPLORER (Boston Dynamics 4-Tab Pattern) */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {vertical.introHeadline}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {vertical.introDescription}
            </p>
          </div>

          {/* Interactive Tab Buttons */}
          <div className="mt-10 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {vertical.capabilities.map((cap) => {
              const isActive = cap.id === activeCapability.id;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setActiveCapId(cap.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0284C7] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cap.label}
                </button>
              );
            })}
          </div>

          {/* Active Capability Panel */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 sm:p-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                <Sparkles size={14} />
                <span>{activeCapability.label}</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {activeCapability.headline}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeCapability.description}
              </p>
              <ul className="space-y-2.5 pt-2">
                {activeCapability.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={18}
                      className="text-[#0284C7] shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-[#0B1324] text-white p-7 text-center shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Measured Impact
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mt-3">
                  {activeCapability.metricValue}
                </div>
                <div className="text-sm font-medium text-slate-300 mt-2">
                  {activeCapability.metricLabel}
                </div>
                <Button
                  onClick={() => openModal("quote")}
                  className="mt-6 w-full rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold cursor-pointer"
                >
                  Request Site Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE ROBOT FLEET & ENGINEERING SPECIFICATIONS */}
      <section id="fleet-specs" className="bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                Robot Fleet & Specifications
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
                Engineered robots for {vertical.shortLabel}
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Select a robot platform below to inspect engineering specs,
              applications, and safety compliance standards.
            </p>
          </div>

          {/* 3 Robot Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {vertical.robots.map((robot, index) => {
              const isSelected = robot.id === activeRobot.id;
              return (
                <button
                  key={robot.id}
                  id={robot.id}
                  type="button"
                  onClick={() => setActiveRobotId(robot.id)}
                  className={`text-left rounded-2xl p-6 border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md"
                      : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isSelected ? "text-[#0284C7]" : "text-slate-400"
                      }`}
                    >
                      Platform 0{index + 1}
                    </span>
                    <ArrowRight
                      size={16}
                      className={
                        isSelected ? "text-[#0284C7]" : "text-slate-400"
                      }
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {robot.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {robot.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Engineering Specification Sheet for Selected Robot */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-[#0284C7]">
                    <ShieldCheck size={14} />
                    <span>{activeRobot.compliance}</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                    {activeRobot.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#0284C7] mt-1">
                    {activeRobot.tagline}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">
                    {activeRobot.description}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Primary Applications
                  </h4>
                  <ul className="space-y-2">
                    {activeRobot.applications.map((app) => (
                      <li key={app} className="flex items-center gap-2.5">
                        <CheckCircle2
                          size={16}
                          className="text-[#0284C7] shrink-0"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {app}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 flex flex-wrap gap-3">
                  <Button
                    onClick={() => openModal("quote")}
                    className="rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white px-6 font-semibold cursor-pointer"
                  >
                    <span>Request Spec Sheet & Quote</span>
                    <ArrowRight size={15} className="ml-2" />
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activeRobot.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4"
                    >
                      <div className="text-xs font-semibold text-slate-500">
                        {spec.label}
                      </div>
                      <div className="text-base font-bold text-slate-900 mt-1">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 4-CARD ECOSYSTEM & INTEGRATION STRIP (Boston Dynamics Pattern) */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
              Deployment Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Everything you need to deploy fast
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {vertical.ecosystem.map((card) => (
              <div
                key={card.title}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 hover:border-slate-300 transition-colors"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {vertical.shortLabel}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    {card.description}
                  </p>
                </div>
                <Link
                  to={card.href as never}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0284C7] hover:text-[#155EEF] mt-5 group"
                >
                  <span>{card.ctaLabel}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER PROOF QUOTE */}
      <section className="border-t border-slate-200 bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Quote size={32} className="mx-auto text-[#0284C7]/60" />
          <blockquote className="text-xl sm:text-2xl font-semibold text-slate-900 leading-relaxed">
            “{vertical.testimonial.quote}”
          </blockquote>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {vertical.testimonial.author}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">
              {vertical.testimonial.role}, {vertical.testimonial.company}
            </div>
          </div>
          <div>
            <Link
              to="/resources/case-studies"
              className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8] px-6 py-2.5 text-sm font-semibold text-[#0284C7] hover:bg-[#F0F9FF] transition-colors"
            >
              <span>View Case Studies</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. EXPLORE OTHER INDUSTRIES */}
      <section className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Explore other industry solutions
            </h2>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0284C7] hover:text-[#155EEF]"
            >
              <span>All Solutions</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherVerticals.map((other) => (
              <Link
                key={other.id}
                to={`/solutions/${other.slug}` as never}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-[#0284C7] hover:shadow-sm transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={other.image}
                    alt={other.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                    {other.title}
                  </span>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="bg-[#0B1324] text-white py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to automate {vertical.shortLabel}?
          </h2>
          <p className="mt-3 text-base text-slate-300 max-w-2xl mx-auto">
            Talk with an INDUS solutions architect to scope your facility,
            review ROI projections, and schedule a live robot demonstration.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => openModal("quote")}
              className="rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white px-7 h-12 text-sm font-semibold cursor-pointer"
            >
              <PhoneCall size={16} className="mr-2" />
              <span>Contact Sales</span>
            </Button>
            <Link
              to="/book-consultation"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 hover:bg-white/10 px-7 h-12 text-sm font-semibold text-white transition-colors"
            >
              <span>Book Engineering Demo</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
