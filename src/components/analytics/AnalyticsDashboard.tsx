import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  TrendingUp,
  Users,
  Layers,
  Bot,
  FileSpreadsheet,
  Compass,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  Eye,
  Download,
  SlidersHorizontal,
  ExternalLink,
  Filter,
  Check,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { aggregateConversionIntelligence } from "@/lib/intelligence/aggregator";
import { trackIndusEvent } from "@/lib/analytics";
import type {
  AnalyticsDateRange,
  ConversionIntelligenceReport,
  ApplicationFinderFunnelStage,
} from "@/lib/intelligence/types";

const COLORS = ["#155EEF", "#0BA5EC", "#12B76A", "#F79009", "#7A5AF8", "#EE46BC"];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("7d");
  const [isDemoData, setIsDemoData] = useState<boolean>(false);
  const [report, setReport] = useState<ConversionIntelligenceReport | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const loadMetrics = useCallback(() => {
    const data = aggregateConversionIntelligence(dateRange, isDemoData);
    setReport(data);
  }, [dateRange, isDemoData]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSimulateTestEvent = () => {
    trackIndusEvent("product_detail_view", {
      product_id: "IND-IRA-070",
      product_category: "robotic-arms",
      interaction_source: "product_page",
      details: "Articulated 6-Axis Arms (IRA)",
    });
    handleRefresh();
  };

  if (!report) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm">
          <RefreshCw className="animate-spin text-blue-600" size={18} />
          <span>Loading INDUS Conversion Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. TOP ANNOUNCEMENT & DEMO DATA ALERT BANNER */}
      {isDemoData && (
        <div className="bg-amber-500 text-white px-4 py-2.5 shadow-sm text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <span className="bg-amber-700 text-white font-bold font-mono px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              DEMO DATA MODE ACTIVE
            </span>
            <span>
              Displaying synthetic benchmark metrics for interface preview. Live production data remains unaffected.
            </span>
            <button
              onClick={() => setIsDemoData(false)}
              className="ml-3 underline hover:text-amber-100 font-bold cursor-pointer"
            >
              Switch to Real Telemetry
            </button>
          </div>
        </div>
      )}

      {/* 2. DASHBOARD HEADER & CONTROLS */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold font-mono text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  INDUS PHASE 6
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Analytics &amp; Conversion Intelligence Layer
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Conversion &amp; Attribution Intelligence
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  {report.reportingPeriod}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  {report.dataFreshness}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Telemetry Engine Active
                </span>
              </div>
            </div>

            {/* Filter Buttons & Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Date Filter Buttons */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-2xs">
                {(["today", "7d", "30d", "all"] as AnalyticsDateRange[]).map((range) => {
                  const labels: Record<AnalyticsDateRange, string> = {
                    today: "Today",
                    "7d": "7 Days",
                    "30d": "30 Days",
                    all: "All Time",
                  };
                  const active = dateRange === range;
                  return (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                        active
                          ? "bg-white text-blue-700 font-bold shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {labels[range]}
                    </button>
                  );
                })}
              </div>

              {/* DEMO DATA Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsDemoData(!isDemoData)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  isDemoData
                    ? "bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/30"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
                title="Toggle between genuine live production telemetry and synthetic preview data"
              >
                <Sparkles size={13} className={isDemoData ? "text-amber-600" : "text-slate-400"} />
                <span>{isDemoData ? "DEMO DATA: ON" : "Preview DEMO DATA"}</span>
              </button>

              {/* Manual Refresh */}
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="Refresh dashboard metrics"
              >
                <RefreshCw size={13} className="text-slate-500" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Genuine Empty State Alert (when no events exist and demo mode is off) */}
        {!report.hasData && !isDemoData && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                    Live Telemetry Ready — Awaiting Initial User Interactions
                  </h3>
                  <p className="mt-1 text-xs text-blue-800 leading-relaxed max-w-2xl">
                    No analytics events were recorded for the selected date window ({report.reportingPeriod}).
                    INDUS maintains strict privacy and <strong>zero fabricated figures</strong>. To generate real telemetry,
                    browse robotics products, run an Application Finder sizing, or click below to simulate an event.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSimulateTestEvent}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Generate Test View
                </button>
                <button
                  onClick={() => setIsDemoData(true)}
                  className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg transition-colors cursor-pointer"
                >
                  Load Benchmark DEMO DATA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. EXECUTIVE CONVERSION KPIS */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">Executive Conversion KPIs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Sessions & Page Views */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Total Sessions &amp; Views
                </span>
                <Users size={16} className="text-slate-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {report.totalSessions.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  / {report.totalPageViews.toLocaleString()} views
                </span>
              </div>
              <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Views / Session:</span>
                <span className="font-mono font-bold text-slate-900">
                  {report.totalSessions > 0
                    ? (report.totalPageViews / report.totalSessions).toFixed(1)
                    : "0.0"}
                </span>
              </div>
              {isDemoData && (
                <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>

            {/* KPI 2: Product Discovery-to-Enquiry Conversion */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Discovery-to-Enquiry
                </span>
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600">
                  {report.enquiries.conversionRatePercent.toFixed(2)}%
                </span>
                <span className="text-xs font-mono text-slate-500">
                  conversion
                </span>
              </div>
              <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Confirmed Enquiries:</span>
                <span className="font-mono font-bold text-slate-900">
                  {report.enquiries.totalRawEnquiries} leads
                </span>
              </div>
              {isDemoData && (
                <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>

            {/* KPI 3: Application Finder Funnel Completion */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Finder Completion Rate
                </span>
                <Compass size={16} className="text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600">
                  {report.funnel.completionRatePercent.toFixed(1)}%
                </span>
                <span className="text-xs font-mono text-slate-500">
                  ({report.funnel.totalCompleted}/{report.funnel.totalStarted})
                </span>
              </div>
              <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Drop-off / Abandoned:</span>
                <span className="font-mono font-bold text-amber-600">
                  {report.funnel.abandonmentRatePercent.toFixed(1)}% ({report.funnel.totalAbandoned})
                </span>
              </div>
              {isDemoData && (
                <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>

            {/* KPI 4: Engineering Asset Engagement */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Datasheet &amp; CAD Requests
                </span>
                <Download size={16} className="text-purple-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-purple-600">
                  {report.productDiscovery.datasheetDownloadsConfirmed}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  confirmed ({report.productDiscovery.datasheetDownloadsAttempted} attempted)
                </span>
              </div>
              <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
                <span>Comparisons Started:</span>
                <span className="font-mono font-bold text-slate-900">
                  {report.productDiscovery.totalComparisonsStarted}
                </span>
              </div>
              {isDemoData && (
                <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 5. APPLICATION FINDER 8-STAGE FUNNEL VISUALIZATION */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Application Finder 8-Stage Conversion Funnel
                </h3>
                {isDemoData && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Strict stage-by-stage progression tracking from initial wizard launch to verified backend synchronization.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-600" />
                Active Sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Completed: {report.funnel.totalCompleted}
              </span>
            </div>
          </div>

          {/* Funnel Visual Table / Progress */}
          <div className="mt-6 space-y-3">
            {report.funnel.stages.map((stage: ApplicationFinderFunnelStage) => {
              const maxVal = report.funnel.stages[0]?.count || 1;
              const barWidth = maxVal > 0 ? Math.max(4, Math.round((stage.count / maxVal) * 100)) : 0;
              const isConfirmed = stage.stageKey === "enquiry_submission_confirmed";
              const isFailed = stage.stageKey === "enquiry_submission_failed";

              return (
                <div
                  key={stage.stageNumber}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold text-[10px] grid place-items-center">
                        {stage.stageNumber}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {stage.stageName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({stage.stageKey})
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="font-bold text-slate-900 text-sm">
                        {stage.count.toLocaleString()}
                      </span>
                      <span className="text-slate-500 w-16 text-right">
                        {stage.conversionFromStartPercent.toFixed(1)}% conv.
                      </span>
                      {stage.stageNumber > 1 && !isFailed && (
                        <span className={`w-20 text-right ${stage.dropoffFromPriorPercent > 0 ? "text-amber-600 font-semibold" : "text-emerald-600"}`}>
                          {stage.dropoffFromPriorPercent > 0 ? `-${stage.dropoffFromPriorPercent}% drop` : "0% drop"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isConfirmed
                          ? "bg-emerald-500"
                          : isFailed
                          ? "bg-rose-500"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              Funnel Metric Rule: Conversion calculated over the eligible cohort within the selected reporting window.
            </span>
            <span className="text-emerald-700 font-bold">
              Final Confirmed RFQs: {report.funnel.totalCompleted}
            </span>
          </div>
        </section>

        {/* 6. PRODUCT DISCOVERY & COMPARISON ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most-Viewed Product Families */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Most-Viewed Product Families
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distribution of confirmed product detail page views
                  </p>
                </div>
                {isDemoData && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                )}
              </div>

              <div className="mt-4">
                {report.productDiscovery.viewsByFamily.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={report.productDiscovery.viewsByFamily}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                        <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="family"
                          stroke="#94A3B8"
                          fontSize={11}
                          width={140}
                          tick={{ fill: "#475467" }}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", fontSize: "12px", borderRadius: "8px" }}
                          formatter={(value: any) => [`${value} Views`, "Engagement"]}
                        />
                        <Bar dataKey="views" fill="#155EEF" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 font-mono text-xs">
                    <Eye size={24} className="mb-2 text-slate-300" />
                    <span>No product view telemetry in selected timeframe.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Total Product Detail Views:</span>
              <span className="font-mono font-bold text-slate-900">
                {report.productDiscovery.totalDetailViews}
              </span>
            </div>
          </div>

          {/* Product Comparison & Technical Downloads */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Engineering Sizing &amp; Download Outcomes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparison tools, CAD models, and formal RFQ actions
                  </p>
                </div>
                {isDemoData && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <SlidersHorizontal size={14} className="text-blue-600" />
                    <span>Comparisons Started</span>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">
                    {report.productDiscovery.totalComparisonsStarted}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {report.productDiscovery.totalComparisonResultsViewed} matrix views
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Download size={14} className="text-purple-600" />
                    <span>Datasheet Deliveries</span>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-purple-600">
                    {report.productDiscovery.datasheetDownloadsConfirmed}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {report.productDiscovery.datasheetDownloadsAttempted} requests logged
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <TrendingUp size={14} className="text-emerald-600" />
                    <span>Quote Actions Initiated</span>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-600">
                    {report.enquiries.quoteActionsInitiated}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Direct modal triggers
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <CheckCircle2 size={14} className="text-blue-600" />
                    <span>Spec Views Confirmed</span>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-blue-600">
                    {report.productDiscovery.totalSpecViews}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Variant &amp; filter selections
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-mono">
              Integrity note: Download attempts are segregated from confirmed successful deliveries.
            </div>
          </div>
        </div>

        {/* 7. ROBOT AI ASSISTANT EFFECTIVENESS */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-blue-50 text-blue-600">
                  <Bot size={16} />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Robot AI Assistant Effectiveness &amp; Intent Routing
                </h3>
                {isDemoData && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Measures how autonomous guidance moves visitors toward product discovery and live human engineering reviews.
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md">
              Total Opens: <strong className="text-slate-900">{report.assistant.totalOpens}</strong> across{" "}
              <strong className="text-slate-900">{report.assistant.uniqueSessionsWithAssistant}</strong> sessions
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-mono text-slate-500 uppercase block">Quick Actions</span>
              <span className="mt-1 text-2xl font-extrabold text-slate-900 block">
                {report.assistant.quickActionClicks}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Chip selections</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-mono text-slate-500 uppercase block">Product Cards</span>
              <span className="mt-1 text-2xl font-extrabold text-blue-600 block">
                {report.assistant.productCardsOpened}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Detail spec opens</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-mono text-slate-500 uppercase block">Comparisons</span>
              <span className="mt-1 text-2xl font-extrabold text-indigo-600 block">
                {report.assistant.comparisonsTriggered}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Comparison queries</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-mono text-slate-500 uppercase block">Finder Transfers</span>
              <span className="mt-1 text-2xl font-extrabold text-emerald-600 block">
                {report.assistant.finderHandoffs}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Handoffs to wizard</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-mono text-slate-500 uppercase block">Human Assistance</span>
              <span className="mt-1 text-2xl font-extrabold text-amber-600 block">
                {report.assistant.humanAssistanceRequests}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Calendar consultations</span>
            </div>
          </div>

          {/* Quick Action Breakdown pills */}
          {report.assistant.quickActionBreakdown.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2 font-mono uppercase">
                Most Popular Assistant Actions:
              </span>
              <div className="flex flex-wrap gap-2">
                {report.assistant.quickActionBreakdown.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700 font-medium"
                  >
                    <span>{item.action}</span>
                    <strong className="font-mono text-blue-700">({item.count})</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Protection Callout */}
          <div className="mt-4 rounded-lg bg-emerald-50/70 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
            <span>
              <strong>Zero-PII Compliance Verified:</strong> Assistant analytics measures only aggregate metadata and
              intent routing. Full user query text, chat bodies, and personal inputs are strictly discarded from analytics pipelines.
            </span>
          </div>
        </section>

        {/* 8. LEAD ROUTING & ATTRIBUTION BREAKDOWN */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Lead Attribution &amp; Jira Project Key Routing
                </h3>
                {isDemoData && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Preserves separate routing to dedicated Jira projects without duplication or schema divergence.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Target JIRA Domain: <strong className="text-slate-800">srilakshanaint2027g3-1790324760192</strong>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {report.enquiries.enquiriesByChannel.map((ch, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-white text-blue-700 px-2 py-0.5 rounded border border-slate-200">
                      JIRA: {ch.projectKey}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {ch.percentage.toFixed(1)}% share
                    </span>
                  </div>
                  <h4 className="mt-3 font-bold text-sm text-slate-900">
                    {ch.channel}
                  </h4>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">
                    {ch.count}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-600 font-mono flex items-center justify-between">
                  <span>Routing Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. TOP LANDING PAGES & TRAFFIC SOURCES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Landing Pages Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Top Landing Pages
              </h3>
              {isDemoData && (
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>

            <div className="mt-4 overflow-x-auto">
              {report.topLandingPages.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 font-mono text-slate-500 uppercase text-[10px]">
                      <th className="pb-2 font-semibold">Page Route</th>
                      <th className="pb-2 font-semibold text-right">Sessions</th>
                      <th className="pb-2 font-semibold text-right">Avg Dwell</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {report.topLandingPages.map((page, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 font-sans font-medium text-slate-900">
                          {page.path}
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-800">
                          {page.views}
                        </td>
                        <td className="py-2.5 text-right text-slate-500">
                          {page.avgDwellSec}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-slate-400 font-mono text-xs">
                  No landing page sessions recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Traffic Sources Breakdown
              </h3>
              {isDemoData && (
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  DEMO DATA
                </span>
              )}
            </div>

            <div className="mt-4">
              {report.trafficSources.length > 0 ? (
                <div className="space-y-3">
                  {report.trafficSources.map((source, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-sans font-medium text-slate-800">
                          {source.source}
                        </span>
                        <span className="text-slate-600">
                          {source.count} ({source.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(3, source.percentage))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 font-mono text-xs">
                  No referrer traffic sources classified in this window.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 10. ARCHITECTURE & SECURITY METRIC DEFINITIONS */}
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-xs text-slate-600 space-y-4">
          <h4 className="font-bold text-slate-900 uppercase font-mono text-[11px] tracking-wider">
            Analytics Architecture &amp; Metric Verification Protocol
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-relaxed font-sans">
            <div>
              <strong className="text-slate-800 block mb-1">Deduplication &amp; Privacy:</strong>
              Events enforce a 2,000 ms client sliding-window cache to eliminate React StrictMode or accidental double-triggers.
              All events carry collision-resistant `event_id` and anonymous session IDs.
            </div>
            <div>
              <strong className="text-slate-800 block mb-1">Jira Cloud Leads Routing:</strong>
              General website inquiries route to Jira Project <code>DI</code>. Dedicated YouTube campaign inquiries route to Project <code>YLT</code>. LinkedIn outreach routes to <code>LIT</code>.
            </div>
            <div>
              <strong className="text-slate-800 block mb-1">Google Sheets Protection:</strong>
              High-frequency micro-events (scrolls, hovers) bypass Google Sheets to safeguard API quotas. Only confirmed lead submissions and major milestones sync to Sheets.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
