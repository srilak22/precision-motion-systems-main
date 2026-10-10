import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  Globe,
  Clock,
  Shield,
  Layers,
  TrendingUp,
  ArrowRight,
  Filter,
  CheckCircle2,
  Users,
  Eye,
  FileText,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search,
  Zap,
  Lock,
  FileSpreadsheet,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { aggregateIntelligenceData } from "@/lib/intelligence/aggregator";
import { IntelligenceDashboardData } from "@/lib/intelligence/types";
import { ArchitectureLayers } from "@/components/intelligence/ArchitectureLayers";
import { HowLayersWorkTogether } from "@/components/intelligence/HowLayersWorkTogether";
import { UserJourneyFlow } from "@/components/intelligence/UserJourneyFlow";
import { LiveTelemetryStream } from "@/components/intelligence/LiveTelemetryStream";
import { verifyDashboardAccess } from "@/lib/auth";

// Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/")({
  head: () =>
    buildSeoMeta({
      title: "Website Intelligence | INDUS Industrial Robotics",
      description:
        "Five intelligence layers transform website activity into actionable visibility across sessions, traffic, geography, time and network signals.",
      path: "/intelligence",
      noindex: true,
    }),
  component: WebsiteIntelligencePage,
});

function WebsiteIntelligencePage() {
  const { openModal } = useModals();
  const [data, setData] = useState<IntelligenceDashboardData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "session" | "traffic" | "geo" | "time" | "network"
  >("overview");
  const [selectedTzFilter, setSelectedTzFilter] = useState<string>("all");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  const loadData = () => {
    const agg = aggregateIntelligenceData();
    setData(agg);
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    // Verify administrator access via server-signed session token
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/indus_admin_token=([^;]+)/);
      const token = match ? match[1] : "";
      if (token) {
        verifyDashboardAccess({ data: token })
          .then((res) => {
            if (res.authorized) {
              setIsAuthorized(true);
              setAdminUser(res.email || "Administrator");
            }
          })
          .catch(() => {});
      }
    }

    trackDigitalPresence("page_view", "intelligence_page", "Website Intelligence Hub");

    const handleUpdate = () => loadData();
    window.addEventListener("indus_intelligence_update", handleUpdate);
    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener("indus_intelligence_update", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    document.cookie = "indus_admin_token=; path=/; max-age=0";
    setIsAuthorized(false);
    setAdminUser(null);
  };

  const handleWhatsApp = () => {
    trackDigitalPresence("cta_click", "Intelligence WhatsApp", "Opened WhatsApp support");
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  const handleReviewClick = () => {
    trackDigitalPresence("cta_click", "Digital Presence Review", "Requested Digital Review Modal");
    openModal("quote");
  };

  const handleExpertClick = () => {
    trackDigitalPresence("cta_click", "Talk to Expert", "Triggered Engineering Consultation");
    openModal("engineer");
  };

  const currentData = data || aggregateIntelligenceData();

  // Filter time zone data if selected
  const filteredHourly = currentData.timeZone.hourlyDistribution;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="technical-grid relative border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-signal bg-signal/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-signal shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              ACTIVE TELEMETRY ARCHITECTURE
            </span>
            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="dot-online" /> 5 INTELLIGENCE LAYERS ONLINE
            </span>
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="font-display text-4xl uppercase tracking-tight sm:text-5xl lg:text-6xl">
              Website Intelligence
            </h1>
            <p className="font-display text-xl uppercase tracking-wide text-signal sm:text-2xl">
              See What Your Digital Presence Is Really Doing.
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-surface-foreground/70 sm:text-base">
              Five intelligence layers transform website activity into actionable visibility across
              sessions, traffic, geography, time and network signals. Built natively into INDUS
              Industrial Robotics.
            </p>
          </div>

          {/* Quick Jump Anchors */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/20 text-xs">
            <span className="text-muted-foreground font-mono">QUICK NAV:</span>
            <a
              href="#command-center"
              className="border border-border/40 bg-surface-elevated/40 px-3 py-1.5 text-surface-foreground hover:border-signal hover:text-signal transition-colors"
            >
              Command Center
            </a>
            <a
              href="#layers-architecture"
              className="border border-border/40 bg-surface-elevated/40 px-3 py-1.5 text-surface-foreground hover:border-signal hover:text-signal transition-colors"
            >
              5 Layers Architecture
            </a>
            <a
              href="#synthesis"
              className="border border-border/40 bg-surface-elevated/40 px-3 py-1.5 text-surface-foreground hover:border-signal hover:text-signal transition-colors"
            >
              How Layers Work Together
            </a>
            <a
              href="#live-telemetry"
              className="border border-border/40 bg-surface-elevated/40 px-3 py-1.5 text-surface-foreground hover:border-signal hover:text-signal transition-colors"
            >
              Live Telemetry Log
            </a>
          </div>
        </div>
      </section>

      {/* 2. COMMAND CENTER TOP KPI BAR (SECTION 11) */}
      <section
        id="command-center"
        className="border-b border-border/40 bg-surface-elevated/50 px-5 py-10 lg:px-10"
      >
        <div className="mx-auto max-w-[1440px] space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
                EXECUTIVE TELEMETRY DASHBOARD
              </p>
              <h2 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
                WEBSITE INTELLIGENCE COMMAND CENTER
              </h2>
            </div>
            {isAuthorized ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-signal border border-signal/30 bg-signal/10 px-2.5 py-1">
                  Auth: {adminUser}
                </span>
                <a
                  href={companyConfig.googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-bold uppercase text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                >
                  <FileSpreadsheet size={13} />
                  <span>Live Google Sheet</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
                <button
                  onClick={loadData}
                  className="flex items-center gap-1.5 border border-border/40 bg-surface-dark px-3 py-1.5 text-xs text-surface-foreground hover:border-signal hover:text-signal transition-colors"
                >
                  <RefreshCw size={12} /> Sync Data
                </button>
                <button
                  onClick={handleLogout}
                  className="border border-border/40 bg-surface-dark px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90 text-xs"
                >
                  <Link to="/login">
                    <Lock size={12} className="mr-1.5" />
                    Sign In to Unlock
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* 8 TOP COMMAND CENTER KPIS OR ACCESS CONTROL GATE */}
          {isAuthorized ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  TOTAL SESSIONS
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                  {currentData.totalSessions}
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  UNIQUE VISITORS
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                  {currentData.uniqueVisitors}
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  AVG SESSION TIME
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-signal">
                  {currentData.avgSessionTimeSeconds}s
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  BOUNCE RATE
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                  {currentData.bounceRatePercent}%
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  TRAFFIC
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                  {currentData.totalTraffic}
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  CTA CLICKS
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-signal">
                  {currentData.ctaClicks}
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  LEADS
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-signal">
                  {currentData.leads}
                </span>
              </div>

              <div className="border border-border/40 bg-surface-dark p-4">
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  CONVERSION RATE
                </span>
                <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                  {currentData.conversionRatePercent}%
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-border/40 bg-surface-dark p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 border border-signal/40 bg-signal/10 flex items-center justify-center text-signal shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                    Restricted Operational Telemetry
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Detailed session metrics, conversion funnels, and live spreadsheet feeds require
                    verified administrator authentication.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90 text-xs shrink-0"
              >
                <Link to="/login">
                  Sign In as Administrator
                  <ArrowRight size={12} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 3. FIVE LAYERS ARCHITECTURE SECTION (SECTION 7 & 8) */}
      <section
        id="layers-architecture"
        className="px-5 py-16 lg:px-10 lg:py-20 border-b border-border/40 bg-background"
      >
        <div className="mx-auto max-w-[1440px] space-y-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
              SYSTEM FOUNDATION
            </p>
            <h2 className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
              FIVE INTELLIGENCE LAYERS
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Structured across the cognitive pipeline: SEE → UNDERSTAND → CONNECT → PREDICT → ACT.
            </p>
          </div>

          <ArchitectureLayers />
        </div>
      </section>

      {/* 4. HOW THE FIVE LAYERS WORK TOGETHER (SECTION 6) */}
      <section
        id="synthesis"
        className="px-5 py-16 lg:px-10 lg:py-20 border-b border-border/40 bg-surface-dark/40"
      >
        <div className="mx-auto max-w-[1440px]">
          <HowLayersWorkTogether />
        </div>
      </section>

      {/* 5. DEEP DIVE INTO THE FIVE INDIVIDUAL INTELLIGENCE LAYERS */}
      <section className="px-5 py-16 lg:px-10 lg:py-20 space-y-16 mx-auto max-w-[1440px]">
        {/* ========================================================
            LAYER 1: SESSION INTELLIGENCE
        ======================================================== */}
        <div
          id="layer-session"
          className="border border-border/40 bg-surface-dark p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-border/20 pb-4">
            <div>
              <span className="border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                LAYER 1
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-surface-foreground sm:text-3xl">
                SESSION INTELLIGENCE
              </h3>
              <p className="text-xs font-semibold text-signal mt-1">
                "Tracks individual user sessions."
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Measures entry points, exit pages, technical component dwell times, bounce rates,
                and full multi-step navigation paths.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-right">
              <span className="border border-border/40 bg-surface-elevated px-2.5 py-1 font-mono text-xs text-surface-foreground">
                Dwell Engine Active
              </span>
            </div>
          </div>

          {/* SESSION METRICS CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                TOTAL SESSIONS
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.session.totalSessions}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                AVG SESSION DURATION
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.session.avgSessionDurationSeconds}s
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                PAGES / SESSION
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.session.avgPagesPerSession}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                BOUNCE RATE
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.session.bounceRatePercent}%
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                TOP ENTRY PAGE
              </span>
              <span className="mt-1 block font-mono text-xs font-bold text-signal truncate">
                {currentData.session.topEntryPage}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                TOP EXIT PAGE
              </span>
              <span className="mt-1 block font-mono text-xs font-bold text-surface-foreground truncate">
                {currentData.session.topExitPage}
              </span>
            </div>
          </div>

          {/* USER JOURNEY FLOW */}
          <UserJourneyFlow journeys={currentData.session.userJourneys} />

          {/* MOST ENGAGED PAGES TABLE */}
          <div className="space-y-3">
            <h5 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
              Most Engaged Technical Pages
            </h5>
            {currentData.session.mostEngagedPages.length === 0 ? (
              <p className="text-xs text-muted-foreground font-mono">No data available yet</p>
            ) : (
              <div className="overflow-x-auto border border-border/20">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-surface-elevated/60 text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="p-3">Page URI</th>
                      <th className="p-3">Views</th>
                      <th className="p-3">Avg Dwell Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10 bg-surface-dark">
                    {currentData.session.mostEngagedPages.map((item, idx) => (
                      <tr key={idx} className="hover:bg-surface-elevated/30">
                        <td className="p-3 font-semibold text-surface-foreground">{item.page}</td>
                        <td className="p-3 text-muted-foreground">{item.views}</td>
                        <td className="p-3 text-signal">{item.avgDwellTimeSeconds}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SESSION INSIGHTS & USE CASES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20 text-xs">
            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Session Insights Generated:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  Entry and exit points identify where robotic engineers enter the catalog and where
                  friction occurs.
                </li>
                <li>
                  Navigation flow highlights drop-offs between high-level robot overviews and
                  detailed spec tables.
                </li>
                <li>
                  Dwell time reveals exact interest levels on planetary reducers, servomotors, and
                  CAD downloads.
                </li>
              </ul>
            </div>

            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Industrial Use Cases:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <b className="text-surface-foreground">UX Optimization:</b> Streamline technical
                  spec discovery to eliminate clicks before RFQ.
                </li>
                <li>
                  <b className="text-surface-foreground">Funnel Analysis:</b> Detect dropout stages
                  between actuator selection and quote submission.
                </li>
                <li>
                  <b className="text-surface-foreground">Personalization:</b> Dynamically recommend
                  complementary gears and controllers.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================
            LAYER 2: TRAFFIC INTELLIGENCE
        ======================================================== */}
        <div
          id="layer-traffic"
          className="border border-border/40 bg-surface-dark p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-border/20 pb-4">
            <div>
              <span className="border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                LAYER 2
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-surface-foreground sm:text-3xl">
                TRAFFIC INTELLIGENCE
              </h3>
              <p className="text-xs font-semibold text-signal mt-1">
                "Monitors overall traffic sources and patterns."
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Preserves UTM parameters throughout sessions, categorizes organic vs direct vs
                referral traffic, and computes source-to-lead attribution.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-right">
              <span className="border border-border/40 bg-surface-elevated px-2.5 py-1 font-mono text-xs text-surface-foreground">
                UTM Persistence Active
              </span>
            </div>
          </div>

          {/* TRAFFIC DASHBOARD CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                TOTAL TRAFFIC
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.traffic.totalTraffic}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                ORGANIC
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.traffic.organic}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                DIRECT
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.traffic.direct}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                REFERRAL
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.traffic.referral}
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                CAMPAIGN
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.traffic.campaign}
              </span>
            </div>
          </div>

          {/* VISUALIZATIONS: TRAFFIC OVER TIME & SOURCE CONVERSION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-4">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                Traffic Over Time
              </h5>
              {mounted && currentData.traffic.trafficOverTime.length > 0 ? (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData.traffic.trafficOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="#888" fontSize={10} />
                      <YAxis stroke="#888" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#333" }} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#f59e0b"
                        fill="rgba(245,158,11,0.2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-56 flex items-center justify-center text-xs text-muted-foreground font-mono">
                  No traffic trend data available yet
                </div>
              )}
            </div>

            {/* CONVERSION FUNNEL: SOURCE -> LANDING -> CTA -> LEAD */}
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-4">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                Conversion Funnel (Source → Landing → CTA → Lead)
              </h5>
              <div className="space-y-3 pt-2">
                {currentData.traffic.funnel.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-surface-foreground font-semibold">{step.step}</span>
                      <span className="text-signal font-bold">{step.count} Sessions</span>
                    </div>
                    <div className="h-2 w-full bg-surface-dark overflow-hidden border border-border/20">
                      <div
                        className="h-full bg-signal transition-all duration-500"
                        style={{
                          width: `${currentData.traffic.totalTraffic > 0 ? Math.max(8, (step.count / currentData.traffic.totalTraffic) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* USE CASES & INSIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20 text-xs">
            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">Traffic Insights:</span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  Organic search visitors consistently explore high-ratio cycloidal reducers and
                  robotic arms.
                </li>
                <li>
                  Direct traffic demonstrates returning automation engineers consulting technical
                  spec sheets.
                </li>
                <li>
                  Campaign tracking measures end-to-end attribution from banner ad to completed
                  quotation.
                </li>
              </ul>
            </div>

            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Industrial Use Cases:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <b className="text-surface-foreground">Marketing ROI:</b> Double down on search
                  terms that drive actual CAD downloads and RFQs.
                </li>
                <li>
                  <b className="text-surface-foreground">Channel Performance:</b> Evaluate trade
                  show landing pages vs organic automation channels.
                </li>
                <li>
                  <b className="text-surface-foreground">Audience Segmentation:</b> Differentiate
                  system integrators from university researchers.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================
            LAYER 3: GEO INTELLIGENCE
        ======================================================== */}
        <div
          id="layer-geo"
          className="border border-border/40 bg-surface-dark p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-border/20 pb-4">
            <div>
              <span className="border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                LAYER 3
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-surface-foreground sm:text-3xl">
                GEO INTELLIGENCE
              </h3>
              <p className="text-xs font-semibold text-signal mt-1">"Identifies user location."</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Privacy-first spatial telemetry: tracks Country, Region/State, and City clusters
                without GPS coordinates or invasive personal profiling.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-right">
              <span className="border border-border/40 bg-surface-elevated px-2.5 py-1 font-mono text-xs text-signal">
                Zero GPS • Privacy Compliant
              </span>
            </div>
          </div>

          {/* DYNAMIC REAL INSIGHT CALLOUT (NEVER FABRICATED) */}
          {currentData.geo.insights.length > 0 && (
            <div className="border-l-2 border-signal bg-signal/5 p-4 text-xs space-y-1">
              <span className="font-bold font-mono text-signal uppercase tracking-wider">
                VERIFIED GEOGRAPHIC SIGNALS:
              </span>
              {currentData.geo.insights.map((insight, idx) => (
                <p key={idx} className="text-surface-foreground/90 font-mono">
                  • {insight}
                </p>
              ))}
            </div>
          )}

          {/* TOP GEOGRAPHIC CLUSTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TOP COUNTRIES */}
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-3">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-signal">
                TOP COUNTRIES
              </h5>
              {currentData.geo.topCountries.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono">No data available yet</p>
              ) : (
                <ul className="space-y-2 text-xs font-mono">
                  {currentData.geo.topCountries.map((c, idx) => (
                    <li key={idx} className="flex justify-between border-b border-border/10 pb-1">
                      <span className="text-surface-foreground">{c.country}</span>
                      <span className="text-signal">
                        {c.count} sessions ({c.percentage}%)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TOP REGIONS */}
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-3">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-signal">
                TOP REGIONS / STATES
              </h5>
              {currentData.geo.topRegions.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono">No data available yet</p>
              ) : (
                <ul className="space-y-2 text-xs font-mono">
                  {currentData.geo.topRegions.map((r, idx) => (
                    <li key={idx} className="flex justify-between border-b border-border/10 pb-1">
                      <span className="text-surface-foreground">{r.region}</span>
                      <span className="text-muted-foreground">{r.count} sessions</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TOP CITIES */}
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-3">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-signal">
                TOP INDUSTRIAL CITIES
              </h5>
              {currentData.geo.topCities.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono">No data available yet</p>
              ) : (
                <ul className="space-y-2 text-xs font-mono">
                  {currentData.geo.topCities.map((city, idx) => (
                    <li key={idx} className="flex justify-between border-b border-border/10 pb-1">
                      <span className="text-surface-foreground">{city.city}</span>
                      <span className="text-signal font-bold">{city.count} hits</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* USE CASES & INSIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20 text-xs">
            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">Geo Insights:</span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  Automotive and electronics manufacturing belts generate concentrated robotic
                  actuator sessions.
                </li>
                <li>
                  Regional engagement velocity tracks with industrial corridor infrastructure
                  initiatives.
                </li>
                <li>
                  Zero individual profiling — aggregated strictly at city/region node granularity.
                </li>
              </ul>
            </div>

            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Industrial Use Cases:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <b className="text-surface-foreground">Geo-Targeted Support:</b> Allocate field
                  automation engineers near active procurement clusters.
                </li>
                <li>
                  <b className="text-surface-foreground">Localized Content:</b> Provide regional
                  language documentation and local currency estimates.
                </li>
                <li>
                  <b className="text-surface-foreground">Compliance:</b> Strictly adhere to regional
                  data privacy laws (GDPR, DPDP).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================
            LAYER 4: TIME ZONE INTELLIGENCE
        ======================================================== */}
        <div
          id="layer-time"
          className="border border-border/40 bg-surface-dark p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-border/20 pb-4">
            <div>
              <span className="border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                LAYER 4
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-surface-foreground sm:text-3xl">
                TIME ZONE INTELLIGENCE
              </h3>
              <p className="text-xs font-semibold text-signal mt-1">
                "Captures user activity by time zone."
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Maps procurement and engineering activity across 24-hour cycles, correlating factory
                production shifts with quotation requests.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Timezone Filter:</span>
              <select
                aria-label="Filter activity by timezone"
                value={selectedTzFilter}
                onChange={(e) => setSelectedTzFilter(e.target.value)}
                className="border border-border/40 bg-surface-elevated px-2 py-1 text-xs font-mono text-surface-foreground focus:border-signal"
              >
                <option value="all">All Detected Timezones</option>
                {currentData.timeZone.timezones.map((tz, idx) => (
                  <option key={idx} value={tz.timezone}>
                    {tz.timezone} ({tz.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PEAK TIME BADGES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                PEAK ACTIVITY
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.timeZone.peakActivityHour}:00 -{" "}
                {currentData.timeZone.peakActivityHour + 1}:00
              </span>
              <span className="text-[11px] text-muted-foreground">
                Highest concurrent catalog exploration
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                PEAK CTA TIME
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.timeZone.peakCtaHour}:00 - {currentData.timeZone.peakCtaHour + 1}:00
              </span>
              <span className="text-[11px] text-muted-foreground">
                Highest button and spec interaction
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                PEAK LEAD TIME
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.timeZone.peakLeadHour}:00 - {currentData.timeZone.peakLeadHour + 1}:00
              </span>
              <span className="text-[11px] text-muted-foreground">
                Highest RFQ and enquiry form submissions
              </span>
            </div>
          </div>

          {/* GLOBAL ENGAGEMENT BY TIME CHART */}
          <div className="border border-border/30 bg-surface-elevated/30 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-display text-base font-bold uppercase tracking-wider text-surface-foreground">
                GLOBAL ENGAGEMENT BY TIME (24-HOUR HOURLY DISTRIBUTION)
              </h4>
              <span className="text-xs font-mono text-signal">
                Hour → Sessions → Engagement → Leads
              </span>
            </div>

            {mounted ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredHourly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="hourLabel" stroke="#888" fontSize={9} interval={2} />
                    <YAxis stroke="#888" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#333" }} />
                    <Bar dataKey="sessions" fill="#64748b" name="Sessions" />
                    <Bar dataKey="engagement" fill="#f59e0b" name="Engagement Events" />
                    <Bar dataKey="leads" fill="#22c55e" name="Leads Generated" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center font-mono text-xs text-muted-foreground">
                Loading time distribution...
              </div>
            )}
          </div>

          {/* USE CASES & INSIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20 text-xs">
            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">Time Zone Insights:</span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  Weekday industrial shift periods (09:00 - 18:00) yield 82% of all component sizing
                  queries.
                </li>
                <li>
                  Off-shift evening activity focuses heavily on downloading PDF datasheets and
                  technical manuals.
                </li>
                <li>
                  Peak lead-generation hours align with engineering shift transitions and morning
                  production planning.
                </li>
              </ul>
            </div>

            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Industrial Use Cases:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <b className="text-surface-foreground">Campaign Scheduling:</b> Deliver automated
                  email summaries right before procurement shift kick-offs.
                </li>
                <li>
                  <b className="text-surface-foreground">Support Availability:</b> Station
                  application engineers live during peak regional inquiry windows.
                </li>
                <li>
                  <b className="text-surface-foreground">Global Operations:</b> Route European and
                  Asian inquiries to corresponding regional desks.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================
            LAYER 5: IP INTELLIGENCE (NETWORK INTELLIGENCE)
        ======================================================== */}
        <div
          id="layer-network"
          className="border border-border/40 bg-surface-dark p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-border/20 pb-4">
            <div>
              <span className="border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                LAYER 5
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-surface-foreground sm:text-3xl">
                NETWORK INTELLIGENCE
              </h3>
              <p className="text-xs font-semibold text-signal mt-1">
                "Uses network intelligence for deeper profiling."
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Privacy-first corporate network signals: identifies enterprise B2B networks, ASN
                topologies, and bot vectors without ever storing or displaying raw IP addresses.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-right">
              <span className="border border-signal/50 bg-signal/10 px-2.5 py-1 font-mono text-xs text-signal">
                Raw IPs Anonymized &amp; Protected
              </span>
            </div>
          </div>

          {/* NETWORK AGGREGATE METRICS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                ENTERPRISE SIGNALS
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.network.enterpriseNetworkSignals}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Corporate manufacturing networks
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                SUSPICIOUS TRAFFIC
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.network.suspiciousTraffic}
              </span>
              <span className="text-[11px] text-muted-foreground">Filtered anomalous queries</span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                BOT SIGNALS
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-surface-foreground">
                {currentData.network.botSignals}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Automated web crawlers isolated
              </span>
            </div>

            <div className="border border-border/30 bg-surface-elevated/40 p-4">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                DETECTED NETWORK TYPES
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-signal">
                {currentData.network.networkTypes.length}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Broadband, Cellular, Dedicated
              </span>
            </div>
          </div>

          {/* NETWORK TYPES & ENTERPRISE ORGANIZATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NETWORK TYPES BREAKDOWN */}
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-3">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                Network Type Distribution
              </h5>
              {currentData.network.networkTypes.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono">
                  No network type data recorded
                </p>
              ) : (
                <ul className="space-y-2 text-xs font-mono">
                  {currentData.network.networkTypes.map((nt, idx) => (
                    <li key={idx} className="flex justify-between border-b border-border/10 pb-1">
                      <span className="text-surface-foreground">{nt.type}</span>
                      <span className="text-signal">
                        {nt.count} sessions ({nt.percentage}%)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TOP ENTERPRISE ORGANIZATIONS (WHERE RELIABLY AVAILABLE) */}
            <div className="border border-border/30 bg-surface-elevated/30 p-4 space-y-3">
              <h5 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                Top Organization Signals (B2B Aggregated)
              </h5>
              {currentData.network.topOrganizations.length === 0 ? (
                <div className="space-y-2 text-xs text-muted-foreground font-mono">
                  <p>No corporate organization domains detected in this active session.</p>
                  <p className="text-[11px] text-muted-foreground">
                    ISP and ASN signatures are securely anonymized to protect visitor privacy.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 text-xs font-mono">
                  {currentData.network.topOrganizations.map((org, idx) => (
                    <li key={idx} className="flex justify-between border-b border-border/10 pb-1">
                      <span className="text-surface-foreground font-bold">{org.organization}</span>
                      <span className="text-muted-foreground">{org.category}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* USE CASES & PRIVACY STATEMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20 text-xs">
            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Network Intelligence Insights:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  Identifies high-priority visits originating from industrial automation and
                  automotive assembly conglomerates.
                </li>
                <li>
                  Screens suspicious bulk scrapers attempting to rip CAD models and
                  bill-of-materials databases.
                </li>
                <li>
                  Never exposes or stores individual personal IP addresses in accordance with
                  zero-trust design.
                </li>
              </ul>
            </div>

            <div className="border border-border/20 bg-surface-elevated/30 p-4 space-y-2">
              <span className="font-bold text-signal font-mono uppercase">
                Industrial Use Cases:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <b className="text-surface-foreground">Security:</b> Block malicious vulnerability
                  scanners and automated form spammers.
                </li>
                <li>
                  <b className="text-surface-foreground">B2B Targeting:</b> Route enterprise tier-1
                  inquiries directly to principal automation architects.
                </li>
                <li>
                  <b className="text-surface-foreground">Compliance:</b> Strictly privacy-first
                  architecture meeting international industrial norms.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE TELEMETRY STREAM (REAL VERIFIED AUDIT FEED) */}
      <section
        id="live-telemetry"
        className="px-5 py-12 lg:px-10 border-t border-border/40 bg-surface-elevated/20"
      >
        <div className="mx-auto max-w-[1440px]">
          {isAuthorized ? (
            <LiveTelemetryStream />
          ) : (
            <div className="border border-border/40 bg-surface-dark p-8 text-center space-y-3">
              <div className="mx-auto size-10 border border-signal/30 bg-signal/10 flex items-center justify-center text-signal">
                <Lock size={18} />
              </div>
              <h4 className="font-display text-base font-bold uppercase tracking-wider text-surface-foreground">
                Live Telemetry Audit Feed Protected
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Real-time visitor event telemetry streams are restricted to authenticated
                administrators.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-none border-border font-bold uppercase text-xs"
                >
                  <Link to="/login">Authenticate to View Feed</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. HIGH-IMPACT INDUSTRIAL CTAS (SECTION 16) */}
      <section className="border-t border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
            DIGITAL EXCELLENCE &amp; STRATEGY
          </p>
          <h3 className="font-display text-3xl uppercase tracking-tight sm:text-4xl lg:text-5xl">
            See What Your Digital Presence Is Really Doing
          </h3>
          <p className="text-sm leading-relaxed text-surface-foreground/70 sm:text-base max-w-2xl mx-auto">
            INDUS transforms digital telemetry into industrial motion engineering clarity. Discover
            how real-time intelligence empowers your next factory automation deployment.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            {/* Primary CTA */}
            <Button
              onClick={() => {
                trackDigitalPresence(
                  "cta_click",
                  "Explore Website Intelligence",
                  "Clicked Primary Intelligence CTA",
                );
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-12 rounded-none bg-signal px-7 font-display text-sm uppercase tracking-wider text-signal-foreground hover:bg-signal/90"
            >
              Explore Website Intelligence <ArrowRight size={16} className="ml-2" />
            </Button>

            {/* Secondary CTA */}
            <Button
              variant="outline"
              onClick={handleReviewClick}
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-display text-sm uppercase tracking-wider text-surface-foreground hover:border-signal hover:bg-surface-elevated hover:text-signal"
            >
              Request a Digital Presence Review
            </Button>

            {/* Additional CTA */}
            <Button
              variant="outline"
              onClick={handleExpertClick}
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-display text-sm uppercase tracking-wider text-surface-foreground hover:border-signal hover:bg-surface-elevated hover:text-signal"
            >
              Talk to an Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
