import React from "react";
import { Link } from "@tanstack/react-router";
import { companyConfig } from "@/data/config";
import {
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Video,
  Building2,
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  Bot,
  Zap,
  Gauge,
  Factory,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export function ConsultationLeftColumn() {
  const BENEFITS = [
    {
      title: "Kinematic Sizing & Reach Envelopes",
      desc: "Validate 6-axis, SCARA, and delta reach radii against payload mass, tooling inertia, and collision boundaries.",
      icon: Gauge,
    },
    {
      title: "Cycle-Time & Throughput Simulation",
      desc: "Parts-per-hour (PPH) calculations based on servo acceleration profiles and process transfer times.",
      icon: Clock,
    },
    {
      title: "PLC & Industrial Fieldbus Architecture",
      desc: "Deterministic integration with Siemens PROFINET, Rockwell EtherNet/IP, Beckhoff EtherCAT, and ROS 2.",
      icon: Cpu,
    },
    {
      title: "CapEx & Payback Financial Modeling",
      desc: "Equipment amortization, scrap reduction calculations, and ROI timeline for executive approval.",
      icon: Zap,
    },
  ];

  const SUPPORTED_INDUSTRIES = [
    { name: "Automotive & BIW Welding", code: "AUTO" },
    { name: "Electronics & Micro-Assembly", code: "ELEC" },
    { name: "Food & Beverage (IP69K)", code: "FOOD" },
    { name: "Pharma Cleanroom (ISO 4-8)", code: "MED" },
    { name: "Warehousing & AMR Logistics", code: "LOG" },
    { name: "Metal Fabrication & CNC Tending", code: "FAB" },
  ];

  const TRUST_METRICS = [
    { label: "Engineering NDA", val: "100% Guaranteed", detail: "Strict IP protection" },
    { label: "Calendar Sync", val: "Real-Time", detail: "Google Calendar verified" },
    { label: "Direct Access", val: "Application Architects", detail: "No sales gatekeeping" },
    { label: "Turnaround", val: "< 24 Hours", detail: "Immediate sizing model" },
  ];

  return (
    <div className="space-y-8 lg:pr-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Link to="/" className="hover:text-[#0052FF] transition-colors flex items-center gap-1">
          <ArrowLeft size={13} />
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <Link to="/contact" className="hover:text-[#0052FF] transition-colors">
          Contact Hub
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-[#0052FF] font-bold">Book a Consultation</span>
      </nav>

      {/* Headline & Value Proposition */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0052FF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0052FF] animate-pulse" />
          <span>INDUS Robotics · Applications Engineering Desk</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-sans">
          Accelerate Your Automation Deployment with Precision Engineering
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          Schedule a 30-minute one-on-one kinematic sizing review with INDUS senior robotics application architects.
          Evaluate payload envelopes, cycle times, and cell architecture with zero sales qualification gatekeeping.
        </p>
      </div>

      {/* Trust Metrics Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-200">
        {TRUST_METRICS.map((tm) => (
          <div key={tm.label} className="space-y-0.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {tm.label}
            </span>
            <span className="block text-sm font-extrabold text-slate-900 font-sans">
              {tm.val}
            </span>
            <span className="block text-[10px] text-slate-500">
              {tm.detail}
            </span>
          </div>
        ))}
      </div>

      {/* Consultation Benefits Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          What We Deliver During Your 30-Minute Consultation
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-[#0052FF]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="h-8 w-8 rounded-md bg-blue-50 text-[#0052FF] flex items-center justify-center shrink-0 group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1">
                    {b.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Robotics Industries */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Supported Automation Sectors
        </h2>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_INDUSTRIES.map((ind) => (
            <span
              key={ind.name}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              <Factory size={12} className="text-[#0052FF]" />
              <span>{ind.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Engagement Highlights Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#0052FF]" />
          <span>INDUS Enterprise Consultation Assurance</span>
        </h3>

        <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Bilateral NDA Coverage:</strong> All customer CAD drawings & cycle metrics remain strictly confidential.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Real-Time Calendar Sync:</strong> Real slots queried directly against engineering availability.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Virtual or On-Site:</strong> Join via Google Meet video or inspect physical cells at Chennai lab.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
            <span><strong>Vendor Agnostic:</strong> Solutions sized for maximum client ROI across FANUC, KUKA, ABB, and INDUS.</span>
          </div>
        </div>
      </div>

      {/* Urgent Line-Down or Tender Support */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            Emergency Desk / Commercial Tender
          </span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
            Immediate Response
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Need immediate line-down diagnostics, RFQ deadline support, or official tender compliance? Reach our engineering team directly:
        </p>

        <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs">
          <a
            href={`tel:${companyConfig.contact.phone.raw}`}
            className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800/80 p-2.5 hover:border-amber-400 transition-colors"
          >
            <Phone size={15} className="text-amber-400 shrink-0" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Direct Applications Line</span>
              <span className="font-mono text-xs font-bold text-white">{companyConfig.contact.phone.display}</span>
            </div>
          </a>

          <a
            href="https://calendar.app.google/ZMQqX8rKGyCZqtqB7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800/80 p-2.5 hover:border-amber-400 transition-colors"
          >
            <CalendarCheck size={15} className="text-amber-400 shrink-0" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Google Calendar Direct</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                Open Official Page <ExternalLink size={11} />
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
