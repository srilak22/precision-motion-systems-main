import React from "react";
import { Link } from "@tanstack/react-router";
import { companyConfig } from "@/data/config";
import {
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Phone,
  Factory,
  Cpu,
  Zap,
  Gauge,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function ConsultationLeftColumn() {
  const BENEFITS = [
    {
      title: "Robot & Kinematic Sizing",
      desc: "Validate 6-axis, SCARA, and delta reach envelopes against payload mass, tooling inertia, and cell boundaries.",
      icon: Gauge,
    },
    {
      title: "Cycle-Time & Throughput Simulation",
      desc: "Parts-per-hour calculations based on servo acceleration profiles, pick-and-place trajectories, and dwell times.",
      icon: Clock,
    },
    {
      title: "PLC & Industrial Fieldbus Integration",
      desc: "Deterministic synchronization with PROFINET, EtherNet/IP, EtherCAT, CC-Link, and modern ROS 2 stacks.",
      icon: Cpu,
    },
    {
      title: "CAPEX & Payback Financial Modeling",
      desc: "Equipment amortization, scrap reduction metrics, and investment timeline for capital equipment approvals.",
      icon: Zap,
    },
  ];

  const SUPPORTED_INDUSTRIES = [
    "Automotive & BIW Welding",
    "Electronics & Micro-Assembly",
    "Food & Beverage (IP69K)",
    "Pharmaceuticals & Cleanroom",
    "Warehousing & AMR Logistics",
    "CNC Machining & Metal Fabrication",
  ];

  return (
    <div className="space-y-8 lg:pr-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Link to="/" className="hover:text-signal transition-colors flex items-center gap-1">
          <ArrowLeft size={13} />
          Home
        </Link>
        <span className="text-border">/</span>
        <Link to="/contact" className="hover:text-signal transition-colors">
          Contact
        </Link>
        <span className="text-border">/</span>
        <span className="text-signal font-bold">Book Consultation</span>
      </nav>

      {/* Page Introduction - Exact Phase 5 Hierarchy */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[.24em] text-signal">
          ENGINEERING CONSULTATION
        </p>

        <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-foreground leading-[0.96]">
          Plan Your Next Automation Project with Confidence
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Connect with our engineering team to evaluate your application, robot requirements,
          cycle-time targets, integration constraints, and project feasibility.
        </p>
      </div>

      {/* Trust Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            IP Protection
          </span>
          <span className="block text-sm font-bold text-foreground">
            Bilateral NDA
          </span>
          <span className="block text-[11px] text-muted-foreground">
            Strict engineering confidentiality
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Availability
          </span>
          <span className="block text-sm font-bold text-foreground">
            Real-Time Sync
          </span>
          <span className="block text-[11px] text-muted-foreground">
            Google Calendar verified
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Team Access
          </span>
          <span className="block text-sm font-bold text-foreground">
            Application Architects
          </span>
          <span className="block text-[11px] text-muted-foreground">
            Direct technical engineers
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Deliverable
          </span>
          <span className="block text-sm font-bold text-foreground">
            Feasibility Summary
          </span>
          <span className="block text-[11px] text-muted-foreground">
            Sizing & architecture notes
          </span>
        </div>
      </div>

      {/* Consultation Benefits Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          What We Evaluate During Your 30-Minute Consultation
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-md border border-border bg-card p-4 shadow-sm transition-all hover:border-signal/50"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="size-8 rounded-md bg-signal/10 text-signal flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {b.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Automation Sectors */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Supported Automation Sectors
        </h2>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_INDUSTRIES.map((sector) => (
            <span
              key={sector}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
            >
              <Factory size={12} className="text-signal" />
              <span>{sector}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Emergency Line / Official Calendar Direct Link */}
      <div className="rounded-md border border-border bg-surface-dark p-5 text-surface-foreground space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-signal">
            Need Immediate Assistance?
          </span>
          <span className="text-[10px] bg-signal/15 text-signal font-bold px-2 py-0.5 rounded">
            Engineering Desk
          </span>
        </div>

        <p className="text-xs text-surface-foreground/75 leading-relaxed">
          For immediate line-down diagnostics, RFQ tender deadlines, or direct appointment questions:
        </p>

        <div className="grid gap-2.5 sm:grid-cols-2 pt-1 text-xs">
          <a
            href={`tel:${companyConfig.contact.phone.raw}`}
            className="flex items-center gap-2.5 rounded-md border border-border/40 bg-surface-elevated p-2.5 hover:border-signal/60 transition-colors"
          >
            <Phone size={15} className="text-signal shrink-0" />
            <div>
              <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Direct Applications Line</span>
              <span className="font-mono text-xs font-bold text-surface-foreground">{companyConfig.contact.phone.display}</span>
            </div>
          </a>

          <a
            href="https://calendar.app.google/ZMQqX8rKGyCZqtqB7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-md border border-border/40 bg-surface-elevated p-2.5 hover:border-signal/60 transition-colors"
          >
            <CalendarCheck size={15} className="text-signal shrink-0" />
            <div>
              <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Google Calendar Direct</span>
              <span className="text-xs font-bold text-signal flex items-center gap-1">
                Open Official Page <ExternalLink size={11} />
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
