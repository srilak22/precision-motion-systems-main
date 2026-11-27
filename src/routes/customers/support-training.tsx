import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  GraduationCap,
  Headphones,
  Package,
  Phone,
  ShieldCheck,
  Ticket,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { getActiveUserSession } from "@/data/mockUsersData";
import type { UserRecord } from "@/types/userAdmin";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

export const Route = createFileRoute("/customers/support-training")({
  head: () =>
    buildSeoMeta({
      title: "Rapid Technical Support & Operator Certification | INDUS Robotics",
      description:
        "Minimize downtime with 24/7 remote diagnostics, rapid field-engineer dispatch, and hands-on training programs for your shop-floor team.",
      path: "/customers/support-training",
    }),
  component: SupportTrainingPage,
});

const ACADEMY_LEVELS = [
  {
    level: "Level 1",
    title: "Operator Essentials",
    duration: "2 Days",
    description:
      "Safe daily operation, pendant/dashboard control, and basic fault recovery.",
    topics: [
      "Daily startup, homing & job selection",
      "E-Stop & safety scanner reset drills",
      "Basic fault code recovery",
    ],
  },
  {
    level: "Level 2",
    title: "Maintenance & Troubleshooting",
    duration: "3 Days",
    description:
      "Preventive mechanical checks, sensor calibration, and electrical diagnostics.",
    topics: [
      "Harmonic gearbox & belt inspection",
      "EtherCAT / PROFINET I/O diagnostics",
      "LiDAR & vision sensor calibration",
    ],
  },
  {
    level: "Level 3",
    title: "Custom Programming & Vision",
    duration: "5 Days",
    description:
      "Path reprogramming, camera recalibration, and adding new SKUs.",
    topics: [
      "Multi-point path & pallet pattern editing",
      "3D vision pick-point calibration",
      "Adding new SKUs & EOAT tool offsets",
    ],
  },
];

const SPARE_PARTS_CATALOG = [
  { sku: "IND-GRP-2F85", name: "2-Finger Adaptive Servo Gripper", stock: "In Stock (24h Dispatch)" },
  { sku: "IND-VAC-6Z", name: "6-Zone Palletizing Vacuum Cups (Set)", stock: "In Stock (24h Dispatch)" },
  { sku: "IND-LIDAR-360", name: "360° Safety Laser Scanner Module", stock: "In Stock (48h Dispatch)" },
  { sku: "IND-BAT-48V", name: "48V LiFePO4 Fast-Charge AMR Pack", stock: "In Stock (24h Dispatch)" },
];

function SupportTrainingPage() {
  const [activeUser, setActiveUser] = useState<UserRecord | null>(null);
  const [activeToolTab, setActiveToolTab] = useState<"portal" | "parts">("portal");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketSent, setTicketSent] = useState(false);
  const [partQuery, setPartQuery] = useState("");

  useEffect(() => {
    setActiveUser(getActiveUserSession());
    const onAuth = (e: CustomEvent<UserRecord | null>) => setActiveUser(e.detail);
    window.addEventListener("indus:auth-change", onAuth as EventListener);
    return () => window.removeEventListener("indus:auth-change", onAuth as EventListener);
  }, []);

  const filteredParts = SPARE_PARTS_CATALOG.filter(
    (p) =>
      !partQuery.trim() ||
      p.name.toLowerCase().includes(partQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(partQuery.toLowerCase()),
  );

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
            <span className="text-[#155EEF]">Support & Training</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              <Headphones size={14} />
              <span>24/7 Support & Robotics Academy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              Rapid Technical Support & Operator Certification
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Minimize downtime with 24/7 remote diagnostics, rapid
              field-engineer dispatch, and hands-on training programs for your
              shop-floor team.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE "GET INSTANT HELP" ACTION BAR (3 QUICK CARDS) */}
      <section className="bg-[#F8FAFC] py-14 border-b border-slate-200">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Raise a Support Ticket */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="size-10 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center">
                  <Ticket size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Raise a Support Ticket
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {activeUser
                    ? `Signed in as ${activeUser.name}. Open your Client Portal to submit tickets, view AMC status, or download certificates.`
                    : "Sign in to your Client Portal to log a priority ticket and track live engineer dispatch."}
                </p>
              </div>
              {activeUser ? (
                <a
                  href="#client-portal"
                  onClick={() => setActiveToolTab("portal")}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:text-[#1047BF]"
                >
                  <span>Open Client Portal</span>
                  <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:text-[#1047BF]"
                >
                  <span>Sign In to Portal</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Card 2: 24/7 Emergency Breakdown Line */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  24/7 Emergency Breakdown Line
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Direct phone & WhatsApp escalation for active AMC clients with
                  &lt; 15-minute remote response.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                <a
                  href={`tel:${companyConfig.phone.replace(/[^+\d]/g, "")}`}
                  className="text-slate-900 hover:text-[#155EEF]"
                >
                  {companyConfig.phone}
                </a>
                <a
                  href={companyConfig.getWhatsAppUrl({ type: "general" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  WhatsApp Escalation →
                </a>
              </div>
            </div>

            {/* Card 3: Spare Parts & Consumables Order */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="size-10 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center">
                  <Package size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Spare Parts & Consumables Order
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Fast lookup for grippers, suction cups, LiDAR sensors, and
                  AMR battery packs.
                </p>
              </div>
              <a
                href="#client-portal"
                onClick={() => setActiveToolTab("parts")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155EEF] hover:text-[#1047BF]"
              >
                <span>Lookup Spare Parts</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* CLIENT PORTAL & SPARE PARTS WORKSPACE */}
          <div
            id="client-portal"
            className="rounded-2xl border border-blue-200 bg-white p-7 shadow-xs space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <UserCheck size={18} className="text-[#155EEF]" />
                <span className="text-sm font-bold text-slate-900">
                  {activeUser
                    ? `Client Portal — ${activeUser.name}`
                    : "Client Support & Spare Parts Workspace"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveToolTab("portal")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer ${
                    activeToolTab === "portal"
                      ? "bg-[#155EEF] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Client Portal & Tickets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveToolTab("parts")}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold cursor-pointer ${
                    activeToolTab === "parts"
                      ? "bg-[#155EEF] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Spare Parts Lookup
                </button>
              </div>
            </div>

            {activeToolTab === "portal" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-4">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Active AMC Plan
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      Gold 24/7 Mission-Critical
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Renewal: 15 Mar 2027
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-4">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Academy Certificates
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      Level 1 & Level 2
                    </div>
                    <button
                      type="button"
                      onClick={() => setTicketSent(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#155EEF] mt-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  {ticketSent ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Action confirmed! Ticket / certificate request queued.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTicketSent(false);
                          setTicketSubject("");
                        }}
                        className="text-xs font-bold text-emerald-800 underline cursor-pointer"
                      >
                        New Request
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!ticketSubject.trim()) return;
                        setTicketSent(true);
                      }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Describe robot ID or fault code to raise a priority ticket..."
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-[#155EEF] focus:outline-none"
                      />
                      <Button
                        type="submit"
                        className="rounded-xl bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-6 cursor-pointer"
                      >
                        Submit Ticket
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={partQuery}
                  onChange={(e) => setPartQuery(e.target.value)}
                  placeholder="Search spare parts by name or SKU (e.g., gripper, vacuum, LiDAR, battery)..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-[#155EEF] focus:outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredParts.map((part) => (
                    <div
                      key={part.sku}
                      className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-1"
                    >
                      <div className="text-[11px] font-bold text-[#155EEF]">
                        {part.sku}
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {part.name}
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold">
                        {part.stock}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INDUS ROBOTICS ACADEMY (3 TRAINING MODULES) */}
      <section id="operator-training" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              INDUS Robotics Academy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Certified training for every floor role
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACADEMY_LEVELS.map((mod) => (
              <article
                key={mod.level}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#155EEF]">
                      {mod.level}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {mod.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {mod.description}
                  </p>
                  <ul className="space-y-2 pt-3 border-t border-slate-200">
                    {mod.topics.map((t) => (
                      <li
                        key={t}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                      >
                        <GraduationCap
                          size={14}
                          className="text-[#155EEF] shrink-0"
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
