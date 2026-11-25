import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart3,
  ArrowRight,
  Factory,
  FileCheck,
  Zap,
  Clock,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  FileCode,
  Users
} from "lucide-react";
import { IrpaNavigationHeader } from "./IrpaNavigationHeader";
import { IRPA_INDUSTRIES } from "@/data/irpa/industries";
import { ASSESSMENT_DOMAINS } from "@/data/irpa/domains";

export function IrpaLandingPage() {
  const [selectedIndustryTab, setSelectedIndustryTab] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("D01");

  const filteredIndustries =
    selectedIndustryTab === "all"
      ? IRPA_INDUSTRIES
      : IRPA_INDUSTRIES.filter((ind) => ind.type.toLowerCase() === selectedIndustryTab);

  const activeDomainData = ASSESSMENT_DOMAINS.find((d) => d.id === selectedDomain) || ASSESSMENT_DOMAINS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <IrpaNavigationHeader currentModule="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>INDUS INDUSTRIAL ROBOTICS • ASSESSMENT FRAMEWORK 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Industrial Robotics Process Automation{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                (IRPA) Gap Analysis
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Standardized, empirical industrial maturity evaluation platform for manufacturing enterprises.
              Quantify plant automation readiness across 12 operational domains, diagnose bottlenecks, and generate
              deterministic, evidence-backed robotics roadmaps.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/irpa-gap-analysis/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Start Plant Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/book-consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-medium text-sm transition-all"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Book Lead Robotics Consultant</span>
              </Link>
            </div>

            {/* Micro Benchmarks Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-800/60 mt-8">
              <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800">
                <p className="text-[11px] font-mono uppercase text-slate-400">Supported Sectors</p>
                <p className="text-xl font-bold text-white">15 Industries</p>
                <p className="text-[10px] text-blue-400 mt-0.5">Discrete, Process & Hybrid</p>
              </div>
              <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800">
                <p className="text-[11px] font-mono uppercase text-slate-400">Assessment Scope</p>
                <p className="text-xl font-bold text-white">12 Domains</p>
                <p className="text-[10px] text-cyan-400 mt-0.5">120 Verified Capabilities</p>
              </div>
              <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800">
                <p className="text-[11px] font-mono uppercase text-slate-400">Maturity Engine</p>
                <p className="text-xl font-bold text-white">0 to 5 Ladder</p>
                <p className="text-[10px] text-indigo-400 mt-0.5">Evidence-Backed Auditing</p>
              </div>
              <div className="bg-slate-900/50 p-3.5 rounded-lg border border-slate-800">
                <p className="text-[11px] font-mono uppercase text-slate-400">Payback Horizon</p>
                <p className="text-xl font-bold text-white">11–16 Months</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">CFO Business Case Model</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Industrial Automation Gap Analysis? */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>EXECUTIVE BRIEFING</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                What is Industrial Automation Gap Analysis?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Industrial Automation Gap Analysis is an engineering assessment methodology that systematically
                measures the variance between a manufacturing plant’s <strong>current verified operational capability</strong>{" "}
                (<span className="font-mono text-cyan-400">M_current</span>) and its{" "}
                <strong>strategic target automation state</strong> (<span className="font-mono text-indigo-400">M_target</span>).
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlike subjective vendor sales pitches that push pre-packaged hardware, the INDUS IRPA framework
                audits physical evidence—controller firmware revisions, safety stopping distance certs (ISO 13855),
                OEE availability, and inline metrology repeatability—to pinpoint actual process bottlenecks before
                committing capital expenditure.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Evidence-Gated Scoring</p>
                    <p className="text-[11px] text-slate-400">No unverified vendor claims; requires drawings, logs, or certs.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Physical Feasibility Gates</p>
                    <p className="text-[11px] text-slate-400">Validates payload, reach, takt time, and ISO 10218 safety.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Formula Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono font-semibold text-slate-400">IRPA MATURITY GAP ENGINE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DETERMINISTIC
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-center">
                  <p className="text-xs text-slate-400 mb-1">Raw Domain Gap Formula</p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    G<sub className="text-xs">d</sub> = M<sub className="text-xs">target, d</sub> − M<sub className="text-xs">current, d</sub>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-center">
                  <p className="text-xs text-slate-400 mb-1">Weighted Composite Plant Maturity</p>
                  <p className="text-lg sm:text-xl font-bold text-cyan-300 tracking-wide">
                    M<sub className="text-xs">plant</sub> = ∑ (w<sub className="text-xs">d</sub> × M<sub className="text-xs">current, d</sub>)
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Critical Priority Gap (Tier 1)</span>
                  <span className="font-mono font-bold text-red-400">Gap ≥ 2.5 or Safety Bottleneck</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">High Priority Gap (Tier 2)</span>
                  <span className="font-mono font-bold text-amber-400">1.8 ≤ Gap &lt; 2.5</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Moderate Priority Gap (Tier 3)</span>
                  <span className="font-mono font-bold text-blue-400">0.9 ≤ Gap &lt; 1.8</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Optimized State (Tier 4)</span>
                  <span className="font-mono font-bold text-emerald-400">Gap &lt; 0.9 (Sustaining)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Assessment Domains Interactive Explorer */}
      <section className="py-16 bg-slate-900/50 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
              FRAMEWORK ARCHITECTURE
            </span>
            <h2 className="text-3xl font-bold text-white">The 12 Core Assessment Domains</h2>
            <p className="text-slate-400 text-sm">
              Each domain evaluates 10 granular capabilities across physical mechanization, sensing, logic, and workforce readiness.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {ASSESSMENT_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDomain === domain.id
                    ? "bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 text-white"
                    : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-blue-400">{domain.code}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {(domain.weightDiscrete * 100).toFixed(0)}% Wt
                  </span>
                </div>
                <p className="text-xs font-semibold leading-tight line-clamp-1">{domain.name}</p>
              </button>
            ))}
          </div>

          {/* Active Domain Detail Card */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800/90 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{activeDomainData.code} • DOMAIN BLUEPRINT</span>
                <h3 className="text-2xl font-bold text-white mt-1">{activeDomainData.name}</h3>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  Discrete Wt: <span className="text-white font-bold">{(activeDomainData.weightDiscrete * 100).toFixed(0)}%</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  Process Wt: <span className="text-white font-bold">{(activeDomainData.weightProcess * 100).toFixed(0)}%</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  Hybrid Wt: <span className="text-white font-bold">{(activeDomainData.weightHybrid * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* 5-Level Maturity Ladder for Selected Domain */}
            <div className="pt-6">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4">
                Observable Evidence Required Across Maturity Levels (0 to 5)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold text-slate-300">Level 0: Not Implemented</span>
                    <span className="text-red-400">Score 0.0</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{activeDomainData.levels.level0}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold text-amber-300">Level 1: Initial</span>
                    <span className="text-amber-400">Score 1.0</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{activeDomainData.levels.level1}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold text-amber-200">Level 2: Basic</span>
                    <span className="text-amber-400">Score 2.0</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{activeDomainData.levels.level2}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold text-blue-300">Level 3: Intermediate</span>
                    <span className="text-blue-400">Score 3.0</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{activeDomainData.levels.level3}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold text-indigo-300">Level 4: Advanced</span>
                    <span className="text-indigo-400">Score 4.0</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{activeDomainData.levels.level4}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold text-emerald-300">Level 5: Optimized</span>
                    <span className="text-emerald-400">Score 5.0</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{activeDomainData.levels.level5}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Supported Industries */}
      <section className="py-16 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-400">
                INDUSTRY SPECIFICITY
              </span>
              <h2 className="text-3xl font-bold text-white mt-2">15 Specialized Manufacturing Sectors</h2>
              <p className="text-slate-400 text-sm mt-1">
                Dynamic questionnaires load only parameters relevant to your specific operational archetype.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {["all", "discrete", "hybrid", "process"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedIndustryTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                    selectedIndustryTab === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIndustries.map((ind) => (
              <div
                key={ind.id}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-blue-400">{ind.code}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ind.type}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {ind.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 mb-3">{ind.archetype}</p>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/70 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Current Median:</span>
                      <span className="font-mono font-medium text-amber-300">Level {ind.currentMedian.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target Benchmark:</span>
                      <span className="font-mono font-medium text-emerald-300">Level {ind.targetBenchmark.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Typical Payback:</span>
                      <span className="font-mono text-cyan-300">{ind.typicalPayback}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/70">
                  <p className="text-[11px] text-slate-400 truncate">
                    <span className="text-slate-500">Fast Track:</span> {ind.fastTrackFocus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Stage Methodology & 12-Step Assessment Experience */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
              AUDIT ROADMAP
            </span>
            <h2 className="text-3xl font-bold text-white">The 12-Step Interactive Assessment Journey</h2>
            <p className="text-slate-400 text-sm">
              From company registration and factory profiling through 12 domains to target capability formulation and consultant review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-blue-400 font-bold">PHASE A • PROFILE</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Steps 1–3: Facility Baseline</h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Company legal entity details</li>
                <li>Factory footprint, shifts & capacity</li>
                <li>Industry selection & question loading</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-indigo-400 font-bold">PHASE B • HARDWARE</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Steps 4–7: Shop Floor Audit</h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Production mechanization (D01)</li>
                <li>Robotics & intralogistics (D02, D03)</li>
                <li>Inspection & CNC tending (D04, D05)</li>
                <li>Maintenance & safety PLr (D06, D07)</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-cyan-400 font-bold">PHASE C • CONNECTIVITY</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Steps 8–10: Digital Architecture</h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>IoT telemetry & PLC fieldbus (D08, D09)</li>
                <li>MES ISA-95 & Digital Twins (D10, D11)</li>
                <li>Workforce skills & digital SOPs (D12)</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-emerald-400 font-bold">PHASE D • TRANSFORMATION</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Steps 11–12: Target & Review</h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Configure target maturity (0–5)</li>
                <li>Set cycle time & scrap goals</li>
                <li>Audit attached evidence files</li>
                <li>Submit for consultant verification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Deliverables Section */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              DELIVERABLES PACKAGE
            </span>
            <h2 className="text-3xl font-bold text-white">What You Receive Upon Completion</h2>
            <p className="text-slate-400 text-sm">
              Formal consulting artifacts generated directly from your plant's verified assessment responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Maturity Scorecard & Gap Radar</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detailed 12-domain breakdown contrasting current verified score vs. industry benchmark with critical gap tier prioritization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Robotics Solution Mapping & Feasibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identified manual bottlenecks mapped to specific robotic workcells with verified payload, reach, cycle time, and ISO 10218 safety envelopes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">CFO Financial Business Case & Payback</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mathematical payback period, CapEx amortization schedule, direct labor cost per unit delta, and 36-month net ROI projection.
              </p>
            </div>
          </div>

          {/* Final Call to Action Box */}
          <div className="mt-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 text-center relative overflow-hidden shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to Benchmark Your Factory's Automation Maturity?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Join leading manufacturers across automotive, aerospace, electronics, and pharmaceuticals in deploying
              the INDUS IRPA standardized assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/irpa-gap-analysis/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Register & Start Assessment
              </Link>
              <Link
                to="/irpa-gap-analysis/consultant"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all"
              >
                Consultant Portal Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal info */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500 font-mono">
        <p>INDUS Industrial Robotics & Precision Motion Practice • IRPA Framework 2.0 • ISO 10218 & ISA-95 Aligned</p>
      </footer>
    </div>
  );
}
