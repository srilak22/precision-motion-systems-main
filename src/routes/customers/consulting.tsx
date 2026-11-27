import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeoMeta } from "@/lib/seo";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

export const Route = createFileRoute("/customers/consulting")({
  head: () =>
    buildSeoMeta({
      title: "De-Risk Your Automation Investment | Consulting | INDUS Robotics",
      description:
        "Our automation architects audit your facility, simulate your exact workflow in 3D, and deliver a guaranteed ROI roadmap.",
      path: "/customers/consulting",
    }),
  component: ConsultingPage,
});

const CONSULTING_DELIVERABLES = [
  {
    step: "01",
    title: "On-Site Feasibility & Bottleneck Audit",
    description:
      "Cycle-time measurement, payload analysis, and safety compliance check.",
    icon: Compass,
  },
  {
    step: "02",
    title: "3D Digital Twin & Cycle-Time Simulation",
    description:
      "We build a virtual model of your line to prove exact throughput before purchasing hardware.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Vendor-Neutral Hardware Selection",
    description:
      "Unbiased selection of the right robot arm, AMR, or vision system for your budget.",
    icon: Sliders,
  },
  {
    step: "04",
    title: "Financial ROI & Payback Report",
    description:
      "Transparent breakdown of CapEx, OpEx savings, and exact payback timeline (typically 12–18 months).",
    icon: BarChart3,
  },
];

function ConsultingPage() {
  const [nameCompany, setNameCompany] = useState("");
  const [contact, setContact] = useState("");
  const [facilityType, setFacilityType] = useState("Manufacturing Plant");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameCompany.trim() || !contact.trim()) return;
    trackDigitalPresence("lead_capture", "Feasibility Audit Request", facilityType);
    setSubmitted(true);
  };

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
            <span className="text-[#155EEF]">Consulting</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              <Compass size={14} />
              <span>Automation Consulting</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              De-Risk Your Automation Investment Before You Spend
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Our automation architects audit your facility, simulate your exact
              workflow in 3D, and deliver a guaranteed ROI roadmap.
            </p>
            <div className="pt-2">
              <a
                href="#feasibility-form"
                className="inline-flex items-center gap-2 rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-7 h-12 text-sm shadow-sm transition-colors"
              >
                <span>Book an On-Site Feasibility Audit</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP CONSULTING DELIVERABLES TIMELINE */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              4-Step Consulting Deliverables
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Engineering certainty from audit to payback
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONSULTING_DELIVERABLES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  id={item.step === "01" ? "floor-audit" : item.step === "02" ? "digital-twin" : undefined}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="size-10 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center">
                        <Icon size={20} />
                      </span>
                      <span className="text-2xl font-bold text-slate-200">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CONVERSION CARD: BOOK AN ON-SITE FEASIBILITY AUDIT */}
      <section id="feasibility-form" className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 size={36} className="mx-auto text-[#155EEF]" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Feasibility Audit Scheduled
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="font-bold">{nameCompany}</span>.
                  Our solutions architect will reach out to confirm your{" "}
                  <span className="font-bold">{facilityType}</span> audit
                  window.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Book an On-Site Feasibility Audit
                  </h2>
                  <p className="text-sm text-slate-600">
                    Share your facility details and receive a 3D simulation &
                    ROI payback roadmap.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={nameCompany}
                    onChange={(e) => setNameCompany(e.target.value)}
                    placeholder="Name & Company Name *"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#155EEF] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Work Email / Phone *"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#155EEF] focus:outline-none"
                  />
                </div>

                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#155EEF] focus:outline-none"
                >
                  <option>Manufacturing Plant</option>
                  <option>Warehouse & 3PL Hub</option>
                  <option>Hospital / Pharma Lab</option>
                  <option>Farm / Food Processing</option>
                  <option>Hotel / Retail / Airport</option>
                </select>

                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Target process, daily volume, or shift hours (optional)..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#155EEF] focus:outline-none"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold h-12 cursor-pointer"
                >
                  <span>Book On-Site Feasibility Audit</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
