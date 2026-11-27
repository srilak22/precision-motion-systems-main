import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Eye,
  Flame,
  Moon,
  Navigation,
  ShieldAlert,
  Sparkles,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import hospitalityDayImg from "@/assets/solution-hospitality-robot.jpg";
import retailPatrolImg from "@/assets/hero/hero-amr-fleet.jpg";

export const Route = createFileRoute(
  "/solutions/hospitality-retail-facility-management",
)({
  head: () =>
    buildSeoMeta({
      title:
        "Autonomous Service & Facility Robotics | Hospitality & Retail | INDUS",
      description:
        "Elevate guest experiences during peak hours and automate overnight cleaning, security, and inventory tracking across hotels, malls, and airports.",
      path: "/solutions/hospitality-retail-facility-management",
    }),
  component: HospitalityRetailPage,
});

const TRAY_DESTINATIONS = [
  {
    id: "table-12",
    label: "Table 12",
    zone: "Main Dining Hall",
    eta: "18 sec",
    pathPercent: 34,
    payload: "3 Entrees + Beverage Tray",
  },
  {
    id: "room-408",
    label: "Room 408",
    zone: "4th Floor Guest Wing (Elevator Sync)",
    eta: "1 min 40 sec",
    pathPercent: 68,
    payload: "Locked Room-Service Bay",
  },
  {
    id: "hall-b",
    label: "Conference Hall B",
    zone: "Executive Atrium",
    eta: "42 sec",
    pathPercent: 95,
    payload: "Refreshments & AV Kit",
  },
];

const SHELF_TAGS = [
  {
    id: "tag-1",
    label: "SKU-402 · In Stock (94%)",
    status: "ok",
    x: 22,
    y: 35,
  },
  {
    id: "tag-2",
    label: "SKU-118 · Low Stock (2 left)",
    status: "warn",
    x: 56,
    y: 52,
  },
  {
    id: "tag-3",
    label: "Thermal Patrol: Perimeter Clear (21°C)",
    status: "thermal",
    x: 78,
    y: 28,
  },
];

function HospitalityRetailPage() {
  const { openModal } = useModals();

  // Hero: Day Mode vs Night Mode Switcher
  const [venueMode, setVenueMode] = useState<"day" | "night">("day");

  // Solution 1: Heatmap Cleaning Coverage
  const [cleaningPass, setCleaningPass] = useState<number>(78);

  // Solution 2: Tap-to-Send Tray Preview
  const [selectedDestId, setSelectedDestId] = useState<string>("table-12");
  const activeDest =
    TRAY_DESTINATIONS.find((d) => d.id === selectedDestId) ??
    TRAY_DESTINATIONS[0];

  // Solution 3: AI Shelf-Scan & Thermal Vision Lens
  const [visionLensOn, setVisionLensOn] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#18181B] text-white selection:bg-amber-400 selection:text-zinc-950">
      {/* 1. INTERACTIVE HERO: "24-HOUR SMART VENUE" DAY/NIGHT SWITCHER */}
      <section className="border-b border-white/10 bg-gradient-to-b from-zinc-900 to-[#18181B]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-8"
          >
            <Link
              to="/solutions"
              className="hover:text-amber-400 transition-colors"
            >
              Solutions
            </Link>
            <ChevronRight size={14} />
            <span className="text-amber-400">
              Hospitality, Retail & Facility Management
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Building2 size={14} />
                <span>24-Hour Smart Venue Robotics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.08]">
                Autonomous Service & Facility Robotics That Never Clock Out
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                Elevate guest experiences during peak hours and automate
                overnight cleaning, security, and inventory tracking across
                hotels, malls, and airports.
              </p>

              {/* Day / Night Mode Toggle */}
              <div className="inline-flex p-1 rounded-full bg-white/10 border border-white/15">
                <button
                  type="button"
                  onClick={() => setVenueMode("day")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    venueMode === "day"
                      ? "bg-amber-400 text-zinc-950 shadow-sm"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <Sun size={14} />
                  <span>Day Mode (Guest Experience)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVenueMode("night")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    venueMode === "night"
                      ? "bg-amber-400 text-zinc-950 shadow-sm"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <Moon size={14} />
                  <span>Night Mode (Autonomous Ops)</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button
                  size="lg"
                  onClick={() => openModal("quote")}
                  className="rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-7 h-12 text-sm shadow-sm cursor-pointer"
                >
                  <span>Calculate Facility Savings</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>

            {/* Day/Night Interactive Visual */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/10] bg-zinc-900">
                <img
                  src={venueMode === "day" ? hospitalityDayImg : retailPatrolImg}
                  alt={
                    venueMode === "day"
                      ? "Autonomous guest service robot gliding through a sunlit modern concourse"
                      : "Autonomous floor scrubber and security patrol robot operating overnight"
                  }
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    venueMode === "night" ? "brightness-75 contrast-110" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-zinc-950/75 border border-amber-400/30 backdrop-blur-md p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {venueMode === "day"
                      ? "08:00 – 22:00 · Peak Guest Hours"
                      : "22:00 – 06:00 · After-Hours Autonomy"}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 mt-1">
                    {venueMode === "day"
                      ? "Concierge & restaurant bots run 220+ deliveries per shift while gliding politely around guests."
                      : "Floor scrubbers clean 100,000+ sq. ft. overnight while RFID & thermal rovers audit shelves and perimeters."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3 CORE SOLUTIONS (WITH INTERACTIVE VISUAL TRIGGERS) */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 space-y-12">
          {/* SOLUTION 1: COMMERCIAL AUTONOMOUS FLOOR SCRUBBERS */}
          <article
            id="autonomous-floor-scrubbers"
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-7 sm:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                  <Sparkles size={14} />
                  <span>01 · Live Heatmap Cleaning Coverage</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Commercial Autonomous Floor Scrubbers
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Scheduled, self-docking commercial cleaners that auto-refill
                  water and cut janitorial labor costs by up to 50%.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-zinc-300">
                    <span>Simulated Floor Pass (100,000 sq. ft. Concourse)</span>
                    <span className="text-amber-300 font-bold">
                      {cleaningPass}% Sanitized
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={100}
                    value={cleaningPass}
                    onChange={(e) => setCleaningPass(Number(e.target.value))}
                    aria-label="Simulate floor cleaning heatmap progress"
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Floor Map · Terminal A Concourse</span>
                  <span className="text-emerald-400 font-semibold">
                    Pedestrian Dodge Active
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const threshold = ((i + 1) / 40) * 100;
                    const cleaned = threshold <= cleaningPass;
                    return (
                      <div
                        key={i}
                        className={`h-7 rounded transition-colors duration-200 ${
                          cleaned
                            ? "bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.35)]"
                            : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-zinc-400 pt-1">
                  <span>3,200 m²/hr Coverage</span>
                  <span>Auto-Drain & Refill Dock</span>
                </div>
              </div>
            </div>
          </article>

          {/* SOLUTION 2: SERVICE & HOSPITALITY DELIVERY BOTS */}
          <article
            id="service-delivery-bots"
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-7 sm:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                  <UtensilsCrossed size={14} />
                  <span>02 · Tap-to-Send Tray Preview</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Service & Hospitality Delivery Bots
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Multi-tray food runners for restaurants and
                  elevator-integrated concierge bots for hotels that boost table
                  turnover during rush hours.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {TRAY_DESTINATIONS.map((dest) => {
                    const isSelected = dest.id === activeDest.id;
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => setSelectedDestId(dest.id)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-amber-400 text-zinc-950 border-amber-400"
                            : "bg-white/5 text-zinc-200 border-white/15 hover:bg-white/10"
                        }`}
                      >
                        Send to {dest.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-300">
                    <Navigation size={15} />
                    <span>Routing to {activeDest.label}</span>
                  </span>
                  <span className="text-xs font-semibold text-zinc-300">
                    ETA: {activeDest.eta}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeDest.pathPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white/5 p-3.5">
                    <div className="text-zinc-400">Destination Zone</div>
                    <div className="font-bold text-white mt-0.5">
                      {activeDest.zone}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3.5">
                    <div className="text-zinc-400">Active Tray Load</div>
                    <div className="font-bold text-white mt-0.5">
                      {activeDest.payload}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* SOLUTION 3: INVENTORY & SECURITY PATROL BOTS */}
          <article
            id="inventory-security-patrol-bots"
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-7 sm:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                  <Eye size={14} />
                  <span>03 · AI Shelf-Scan & Thermal Vision</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Inventory & Security Patrol Bots
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Autonomous rovers that prevent lost retail sales from empty
                  shelves and provide 24/7 perimeter surveillance with instant
                  security alerts.
                </p>

                <button
                  type="button"
                  onClick={() => setVisionLensOn((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer border ${
                    visionLensOn
                      ? "bg-amber-400 text-zinc-950 border-amber-400"
                      : "bg-white/10 text-white border-white/20"
                  }`}
                >
                  <Flame size={14} />
                  <span>
                    {visionLensOn
                      ? "AI & Thermal Lens: ON"
                      : "Enable AI & Thermal Lens"}
                  </span>
                </button>
              </div>

              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/15 aspect-[16/10] bg-zinc-900">
                <img
                  src={retailPatrolImg}
                  alt="Autonomous retail inventory and security patrol robot"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    visionLensOn ? "contrast-125 brightness-90" : ""
                  }`}
                />
                {visionLensOn &&
                  SHELF_TAGS.map((tag) => (
                    <div
                      key={tag.id}
                      style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-lg backdrop-blur-xs ${
                          tag.status === "ok"
                            ? "bg-emerald-500/95 text-white"
                            : tag.status === "warn"
                              ? "bg-amber-400 text-zinc-950"
                              : "bg-sky-500/95 text-white"
                        }`}
                      >
                        {tag.status === "ok" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <ShieldAlert size={12} />
                        )}
                        {tag.label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
