import React, { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Quote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import mfgImg from "@/assets/solution-manufacturing-auto.jpg";
import warehouseImg from "@/assets/solution-warehouse-logistics.jpg";
import healthcareImg from "@/assets/solution-healthcare-robot.jpg";
import agricultureImg from "@/assets/solution-agriculture-robot.jpg";
import hospitalityImg from "@/assets/solution-hospitality-robot.jpg";

export const Route = createFileRoute("/customers/case-studies")({
  head: () =>
    buildSeoMeta({
      title: "Customer Case Studies & Proven ROI | INDUS Robotics",
      description:
        "Explore verified robotics deployments across manufacturing, warehousing, healthcare, agriculture, and hospitality.",
      path: "/customers/case-studies",
    }),
  component: CustomerCaseStudiesPage,
});

type CaseIndustry =
  | "All Projects"
  | "Manufacturing"
  | "Warehousing"
  | "Healthcare"
  | "Agriculture"
  | "Hospitality";

interface CaseStudyItem {
  id: string;
  industry: Exclude<CaseIndustry, "All Projects">;
  metricBadge: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
  image: string;
  beforeStats: string[];
  afterStats: string[];
  quote: string;
  author: string;
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "cnc-auto-components",
    industry: "Manufacturing",
    metricBadge: "+42% Throughput",
    title: "Automated CNC Machine Tending for an Auto-Components Plant",
    challenge:
      "3-shift spindle idle losses and high operator fatigue from manual chuck loading.",
    solution:
      "Deployed dual-gripper collaborative robots tending 4 CNC lathes cage-free.",
    result:
      "Spindle utilization jumped 42% with 14-month capital payback.",
    image: mfgImg,
    beforeStats: ["61% Spindle Utilization", "18% Shift Overtime", "2.4% Scrap Rate"],
    afterStats: ["87% Spindle Utilization", "Zero Manual Tending", "0.3% Scrap Rate"],
    quote:
      "Our machinists now supervise four automated cells instead of loading parts by hand every 45 seconds.",
    author: "Vikram Deshmukh, VP Operations — Precision AutoComponents",
  },
  {
    id: "amr-3pl-hub",
    industry: "Warehousing",
    metricBadge: "2.8x Pick Speed",
    title: "Goods-to-Person AMR Fleet for a Regional E-Commerce 3PL Hub",
    challenge:
      "Pickers walked 14 km per shift during festive peak surges with rising SLA misses.",
    solution:
      "Rolled out 24 LiDAR SLAM AMRs + 2 vision palletizers integrated with SAP EWM.",
    result:
      "Order picking scaled 2.8x faster with 99.95% dispatch accuracy.",
    image: warehouseImg,
    beforeStats: ["85 Lines / Hr / Picker", "14 km Daily Walking", "97.8% Accuracy"],
    afterStats: ["240 Lines / Hr / Picker", "70% Less Walking", "99.95% Accuracy"],
    quote:
      "We doubled peak-season dispatch capacity without adding a single square foot of warehouse space.",
    author: "Meera Krishnan, Director of Fulfillment — SwiftCart 3PL",
  },
  {
    id: "hospital-uvc-delivery",
    industry: "Healthcare",
    metricBadge: "99.99% Sterilized",
    title: "Autonomous UV-C & Pharmacy Couriers Across a 500-Bed Hospital",
    challenge:
      "Slow 45-minute manual OR turnover and nurses walking 180+ lab runs daily.",
    solution:
      "Deployed elevator-integrated pharmacy delivery bots and 254 nm UV-C sterilizers.",
    result:
      "10-minute room sterilization cycles with full digital compliance logs.",
    image: healthcareImg,
    beforeStats: ["45 Min OR Turnover", "180 Manual Runs / Day", "Paper Logs"],
    afterStats: ["10 Min UV-C Cycle", "100% Automated Chain", "HL7 Digital Logs"],
    quote:
      "Nurses gained back hours of bedside focus every shift while infection audits became effortless.",
    author: "Dr. Ananya Rao, Chief Medical Ops — MedCare Network",
  },
  {
    id: "washdown-dairy-line",
    industry: "Agriculture",
    metricBadge: "-60% Chemical Use",
    title: "Field Rovers & IP69K Washdown Cobots for Agri-Food Processing",
    challenge:
      "High herbicide cost in open fields and slow chilled-room tray packing.",
    solution:
      "Paired RTK-GPS spot-spray rovers with IP69K stainless-steel washdown cobots.",
    result:
      "60% herbicide reduction in fields and +36% food packaging output.",
    image: agricultureImg,
    beforeStats: ["100% Blanket Spray", "Slow Manual Tray Pack", "High Sanitation Downtime"],
    afterStats: ["-60% Herbicide Usage", "+36% Packaging Output", "IP69K Direct Wash"],
    quote:
      "Sanitation turnaround was cut in half and produce bruising dropped below 1.2%.",
    author: "Rohan Kulkarni, Head of Plant Engineering — FreshValley Foods",
  },
  {
    id: "airport-scrubber-concierge",
    industry: "Hospitality",
    metricBadge: "3,200 m²/hr Clean",
    title: "Overnight Floor Scrubbers & Guest Delivery Bots for a Grand Hotel",
    challenge:
      "Overnight janitorial staffing gaps and slow peak-hour room-service runs.",
    solution:
      "Scheduled autonomous floor scrubbers overnight and elevator-linked concierge bots by day.",
    result:
      "Cut cleaning labor cost by 48% and delivered 220+ guest orders per shift.",
    image: hospitalityImg,
    beforeStats: ["Manual Night Scrubbing", "28 Min Room Delivery", "High Staff Turnover"],
    afterStats: ["100,000 sq.ft Auto-Clean", "11 Min Avg Delivery", "48% Labor Savings"],
    quote:
      "Guests love the concierge bots, and our concourse floors look spotless every morning at 6 AM.",
    author: "Nadia Al-Mansoor, VP Facilities — Meridian Grand Hotels",
  },
];

const FILTERS: CaseIndustry[] = [
  "All Projects",
  "Manufacturing",
  "Warehousing",
  "Healthcare",
  "Agriculture",
  "Hospitality",
];

function CustomerCaseStudiesPage() {
  const [activeFilter, setActiveFilter] = useState<CaseIndustry>("All Projects");
  const [selectedStudy, setSelectedStudy] = useState<CaseStudyItem | null>(null);

  const visibleStudies = useMemo(
    () =>
      activeFilter === "All Projects"
        ? CASE_STUDIES
        : CASE_STUDIES.filter((s) => s.industry === activeFilter),
    [activeFilter],
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-white py-14 lg:py-18">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500"
          >
            <Link to="/customers" className="hover:text-[#155EEF]">
              Customers
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#155EEF]">Case Studies</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Proven Robotics ROI in the Field
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Explore verified deployments across factories, warehouses,
              hospitals, farms, and commercial venues.
            </p>
          </div>

          {/* Interactive Industry Filter Bar */}
          <div className="flex flex-wrap gap-2 pt-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer border ${
                  activeFilter === f
                    ? "bg-[#155EEF] text-white border-[#155EEF]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="bg-[#F8FAFC] py-14 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleStudies.map((study) => (
            <article
              key={study.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#155EEF] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    {study.metricBadge}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {study.industry}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {study.title}
                  </h2>
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <p>
                      <strong className="text-slate-800">Challenge:</strong>{" "}
                      {study.challenge}
                    </p>
                    <p>
                      <strong className="text-slate-800">Solution:</strong>{" "}
                      {study.solution}
                    </p>
                    <p>
                      <strong className="text-[#155EEF]">Result:</strong>{" "}
                      {study.result}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setSelectedStudy(study)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:text-[#1047BF] cursor-pointer"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#155EEF]">
                {selectedStudy.industry} · {selectedStudy.metricBadge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedStudy(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-slate-900">
                {selectedStudy.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    Before INDUS
                  </div>
                  {selectedStudy.beforeStats.map((s) => (
                    <div key={s} className="text-xs font-medium text-slate-700">
                      • {s}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-1.5">
                  <div className="text-xs font-bold uppercase text-[#155EEF]">
                    After Deployment
                  </div>
                  {selectedStudy.afterStats.map((s) => (
                    <div key={s} className="text-xs font-bold text-slate-900">
                      ✓ {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-[#0B1324] text-white p-5 space-y-2">
                <Quote size={18} className="text-sky-400" />
                <p className="text-sm italic text-slate-200">
                  “{selectedStudy.quote}”
                </p>
                <div className="text-xs font-semibold text-sky-300">
                  — {selectedStudy.author}
                </div>
              </div>
              <Button
                type="button"
                onClick={() => setSelectedStudy(null)}
                className="w-full rounded-full bg-[#155EEF] text-white cursor-pointer"
              >
                Close Case Study
              </Button>
            </div>
          </div>
        </div>
      )}

      <FloatingEngineerCta />
    </div>
  );
}
