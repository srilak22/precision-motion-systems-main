import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

export const Route = createFileRoute("/customers/customer-success")({
  head: () =>
    buildSeoMeta({
      title: "Built for Long-Term Automation Success | INDUS Robotics",
      description:
        "From initial floor integration to multi-year fleet care, our dedicated engineering team ensures your robots deliver peak ROI every single day.",
      path: "/customers/customer-success",
    }),
  component: CustomerSuccessPage,
});

const PILLARS = [
  {
    id: "integration-services",
    title: "Integration Services",
    description:
      "End-to-end site evaluation, PLC/WMS software handshake, custom End-of-Arm Tooling (EOAT), and turnkey commissioning.",
    icon: Wrench,
    highlights: [
      "PLC, SCADA & WMS API integration",
      "Custom EOAT grippers & safety curtains",
      "Turnkey floor sign-off & OEE validation",
    ],
  },
  {
    id: "fleet-care",
    title: "INDUS Fleet Care",
    description:
      "Cloud-based remote diagnostics, real-time health telemetry, and proactive software/AI firmware updates.",
    icon: Cpu,
    highlights: [
      "24/7 servo thermal & backlash alerts",
      "OTA vision & navigation firmware updates",
      "Quarterly fleet health & ROI reports",
    ],
  },
  {
    id: "amc-support",
    title: "Annual Maintenance (AMC)",
    description:
      "Scheduled preventive inspections, priority genuine spare parts dispatch, and guaranteed uptime SLAs.",
    icon: Award,
    highlights: [
      "Scheduled preventive mechanical servicing",
      "Regional genuine spare-parts stocking",
      "Contracted multi-shift uptime SLAs",
    ],
  },
];

interface CareTier {
  id: string;
  name: string;
  badge: string;
  responseTime: string;
  preventiveVisits: string;
  spareParts: string;
  remoteMonitoring: string;
  recommended?: boolean;
}

const CARE_TIERS: CareTier[] = [
  {
    id: "standard",
    name: "Standard Warranty",
    badge: "Included (Year 1)",
    responseTime: "Next Business Day",
    preventiveVisits: "1 Commissioning Check",
    spareParts: "Manufacturing Defects",
    remoteMonitoring: "Email & Ticket Portal",
  },
  {
    id: "silver",
    name: "Silver Care",
    badge: "Growing Plants",
    responseTime: "< 8 Hours Remote / 48h Site",
    preventiveVisits: "2 Scheduled Visits / Year",
    spareParts: "Priority Dispatch (15% Off)",
    remoteMonitoring: "Business-Hours Telemetry",
  },
  {
    id: "gold",
    name: "Gold 24/7 Mission-Critical AMC",
    badge: "Recommended",
    responseTime: "< 15 Min Remote / 24h Site",
    preventiveVisits: "4 Quarterly Audits / Year",
    spareParts: "100% Wear Parts Included",
    remoteMonitoring: "24/7 Live AI Anomaly Alerts",
    recommended: true,
  },
];

function CustomerSuccessPage() {
  const { openModal } = useModals();
  const [selectedTierId, setSelectedTierId] = useState<string>("gold");

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* HERO BANNER */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6"
          >
            <Link to="/customers" className="hover:text-[#155EEF]">
              Customers
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#155EEF]">Customer Success</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              <ShieldCheck size={14} />
              <span>Lifecycle Partnership</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              Built for Long-Term Automation Success
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              From initial floor integration to multi-year fleet care, our
              dedicated engineering team ensures your robots deliver peak ROI
              every single day.
            </p>
            <div className="pt-2">
              <a
                href="#care-plans"
                className="inline-flex items-center gap-2 rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-7 h-12 text-sm shadow-sm transition-colors"
              >
                <span>Explore Care Plans</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE PILLARS */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.id}
                  id={pillar.id}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="size-11 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {pillar.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                    <ul className="space-y-2 pt-3 border-t border-slate-100">
                      {pillar.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                        >
                          <CheckCircle2
                            size={15}
                            className="text-[#155EEF] shrink-0"
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE SLA & AMC TIER COMPARISON TABLE */}
      <section id="care-plans" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              SLA & AMC Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Choose the care tier built for your shift schedule
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CARE_TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`rounded-2xl border p-7 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#155EEF] bg-blue-50/30 ring-2 ring-[#155EEF]/20 shadow-md"
                      : "border-slate-200 bg-[#F8FAFC] hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          tier.recommended
                            ? "bg-[#155EEF] text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {tier.badge}
                      </span>
                      {isSelected && (
                        <Check size={18} className="text-[#155EEF]" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {tier.name}
                    </h3>

                    <div className="space-y-3 pt-3 border-t border-slate-200 text-sm">
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-slate-500">
                          Response Time
                        </div>
                        <div className="font-bold text-slate-900">
                          {tier.responseTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-slate-500">
                          Preventive Visits / Year
                        </div>
                        <div className="font-bold text-slate-900">
                          {tier.preventiveVisits}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-slate-500">
                          Spare Parts Coverage
                        </div>
                        <div className="font-bold text-slate-900">
                          {tier.spareParts}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-slate-500">
                          Remote Monitoring
                        </div>
                        <div className="font-bold text-slate-900">
                          {tier.remoteMonitoring}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("quote");
                    }}
                    className={`mt-7 w-full rounded-full font-semibold h-11 cursor-pointer ${
                      isSelected
                        ? "bg-[#155EEF] hover:bg-[#1047BF] text-white"
                        : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    Request {tier.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
