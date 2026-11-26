import React, { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Download,
  Globe2,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TimeRange = "day" | "week" | "month";
type BotFilter = "all" | "verified" | "suspicious";

interface TrendPoint {
  label: string;
  human: number;
  aiAgent: number;
}

interface AiAgentRow {
  id: string;
  name: string;
  provider: string;
  category: "Search Crawler" | "AI Assistant" | "Suspicious Scraper";
  requests: number;
  topPath: string;
  avgLatencyMs: number;
  status: "Verified" | "Suspicious" | "Blocked";
}

const TRENDS_BY_RANGE: Record<TimeRange, TrendPoint[]> = {
  day: [
    { label: "00:00", human: 180, aiAgent: 95 },
    { label: "04:00", human: 120, aiAgent: 110 },
    { label: "08:00", human: 420, aiAgent: 145 },
    { label: "12:00", human: 690, aiAgent: 210 },
    { label: "16:00", human: 740, aiAgent: 240 },
    { label: "20:00", human: 480, aiAgent: 175 },
  ],
  week: [
    { label: "Mon", human: 2410, aiAgent: 820 },
    { label: "Tue", human: 2790, aiAgent: 940 },
    { label: "Wed", human: 3120, aiAgent: 1050 },
    { label: "Thu", human: 2980, aiAgent: 990 },
    { label: "Fri", human: 3340, aiAgent: 1120 },
    { label: "Sat", human: 1850, aiAgent: 760 },
    { label: "Sun", human: 1620, aiAgent: 710 },
  ],
  month: [
    { label: "Wk 1", human: 14800, aiAgent: 5120 },
    { label: "Wk 2", human: 16950, aiAgent: 5840 },
    { label: "Wk 3", human: 18420, aiAgent: 6410 },
    { label: "Wk 4", human: 21100, aiAgent: 7290 },
  ],
};

const SUMMARY_BY_RANGE: Record<
  TimeRange,
  {
    totalVisitors: string;
    growth: string;
    humanPct: number;
    aiPct: number;
    conversions: string;
    conversionRate: string;
    avgSession: string;
  }
> = {
  day: {
    totalVisitors: "3,605",
    growth: "+12.4%",
    humanPct: 73.0,
    aiPct: 27.0,
    conversions: "48",
    conversionRate: "1.82%",
    avgSession: "4m 18s",
  },
  week: {
    totalVisitors: "24,500",
    growth: "+18.6%",
    humanPct: 73.9,
    aiPct: 26.1,
    conversions: "312",
    conversionRate: "1.72%",
    avgSession: "4m 42s",
  },
  month: {
    totalVisitors: "95,930",
    growth: "+24.1%",
    humanPct: 74.3,
    aiPct: 25.7,
    conversions: "1,284",
    conversionRate: "1.80%",
    avgSession: "4m 51s",
  },
};

const INITIAL_AI_AGENTS: AiAgentRow[] = [
  {
    id: "gptbot",
    name: "GPTBot / OAI-SearchBot",
    provider: "OpenAI (ChatGPT)",
    category: "AI Assistant",
    requests: 6420,
    topPath: "/products/motion-actuation",
    avgLatencyMs: 84,
    status: "Verified",
  },
  {
    id: "googlebot",
    name: "Googlebot",
    provider: "Google Search",
    category: "Search Crawler",
    requests: 8910,
    topPath: "/robotic-process-automation",
    avgLatencyMs: 62,
    status: "Verified",
  },
  {
    id: "bingbot",
    name: "Bingbot",
    provider: "Microsoft Bing",
    category: "Search Crawler",
    requests: 4180,
    topPath: "/technology/physical-ai",
    avgLatencyMs: 71,
    status: "Verified",
  },
  {
    id: "claudebot",
    name: "ClaudeBot",
    provider: "Anthropic",
    category: "AI Assistant",
    requests: 2840,
    topPath: "/engineering-services",
    avgLatencyMs: 92,
    status: "Verified",
  },
  {
    id: "perplexity",
    name: "PerplexityBot",
    provider: "Perplexity AI",
    category: "AI Assistant",
    requests: 1930,
    topPath: "/solutions/warehouse-inventory-robot",
    avgLatencyMs: 88,
    status: "Verified",
  },
  {
    id: "scraper-01",
    name: "Headless-Harvester/2.1",
    provider: "Unverified ASN 49102",
    category: "Suspicious Scraper",
    requests: 1420,
    topPath: "/products (bulk crawl)",
    avgLatencyMs: 310,
    status: "Suspicious",
  },
];

const TOP_ROBOTICS_PAGES = [
  {
    title: "Motion & Actuation (Harmonic & Planetary Reducers)",
    path: "/products/motion-actuation",
    views: "18,420",
    avgTime: "5m 12s",
    conversions: 384,
  },
  {
    title: "Robotic Process Automation (RPA) Workcells",
    path: "/robotic-process-automation",
    views: "14,190",
    avgTime: "4m 48s",
    conversions: 296,
  },
  {
    title: "Physical AI Platform (3D Point Cloud & Trajectory)",
    path: "/technology/physical-ai",
    views: "11,640",
    avgTime: "4m 35s",
    conversions: 178,
  },
  {
    title: "INDUS Motion Studio (3D Multi-Axis Simulator)",
    path: "/technology/motion-studio",
    views: "9,820",
    avgTime: "6m 05s",
    conversions: 164,
  },
  {
    title: "Warehouse Inventory Robot Solution",
    path: "/solutions/warehouse-inventory-robot",
    views: "7,450",
    avgTime: "3m 54s",
    conversions: 132,
  },
  {
    title: "Engineering Services Hub",
    path: "/engineering-services",
    views: "6,310",
    avgTime: "4m 10s",
    conversions: 130,
  },
];

const TRAFFIC_SOURCES = [
  { name: "Google Organic Search", share: 44, visitors: "42,209", color: "bg-[#155EEF]" },
  { name: "Direct & Bookmarked", share: 21, visitors: "20,145", color: "bg-slate-700" },
  { name: "AI Assistants (ChatGPT / Perplexity)", share: 15, visitors: "14,390", color: "bg-cyan-500" },
  { name: "Bing Organic Search", share: 11, visitors: "10,552", color: "bg-sky-500" },
  { name: "LinkedIn & Technical Social", share: 9, visitors: "8,634", color: "bg-indigo-500" },
];

const GEO_DISTRIBUTION = [
  { country: "India", share: 36, sessions: "34,535" },
  { country: "Germany", share: 22, sessions: "21,105" },
  { country: "United States", share: 19, sessions: "18,227" },
  { country: "Japan", share: 11, sessions: "10,552" },
  { country: "United Kingdom", share: 7, sessions: "6,715" },
  { country: "Other Regions", share: 5, sessions: "4,796" },
];

const POPULAR_KEYWORDS = [
  { keyword: "zero backlash strain wave reducer", volume: "4,820", ctr: "6.4%" },
  { keyword: "6-axis industrial robot workcell", volume: "3,940", ctr: "5.8%" },
  { keyword: "cycloidal RV gearbox torque", volume: "3,110", ctr: "5.2%" },
  { keyword: "physical AI robotics trajectory", volume: "2,650", ctr: "4.9%" },
  { keyword: "warehouse inventory AMR robot", volume: "2,180", ctr: "5.5%" },
  { keyword: "video robotization ROI calculator", volume: "1,740", ctr: "7.1%" },
];

export function TrafficProfileContentAgentsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [botFilter, setBotFilter] = useState<BotFilter>("all");
  const [agents, setAgents] = useState<AiAgentRow[]>(INITIAL_AI_AGENTS);

  const summary = SUMMARY_BY_RANGE[timeRange];
  const trends = TRENDS_BY_RANGE[timeRange];
  const maxTrendValue = useMemo(
    () => Math.max(...trends.map((t) => t.human + t.aiAgent), 1),
    [trends],
  );

  const filteredAgents = useMemo(() => {
    if (botFilter === "verified") return agents.filter((a) => a.status === "Verified");
    if (botFilter === "suspicious") return agents.filter((a) => a.status !== "Verified");
    return agents;
  }, [agents, botFilter]);

  const toggleBlockAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          status: a.status === "Blocked" ? "Suspicious" : "Blocked",
        };
      }),
    );
  };

  const handleExportCsv = () => {
    const header = "Agent Name,Provider,Category,Requests,Top Crawled Page,Status\n";
    const rows = agents
      .map(
        (a) =>
          `"${a.name}","${a.provider}","${a.category}",${a.requests},"${a.topPath}","${a.status}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `indus-traffic-ai-agents-${timeRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Traffic &amp; Content Analytics
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Human Visitors vs. AI Agent &amp; Crawler Activity
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Monitor visitor behavior, AI crawler indexing, top robotics pages, conversions, and suspicious bot traffic.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-mono">
            {(["day", "week", "month"] as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md capitalize font-semibold cursor-pointer transition-colors ${
                  timeRange === range
                    ? "bg-[#155EEF] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleExportCsv}
            className="h-9 rounded-lg border-slate-300 bg-white text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] text-xs font-semibold cursor-pointer"
          >
            <Download size={14} className="mr-1.5" />
            Export SEO Report
          </Button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Visitors</span>
            <Users size={16} className="text-[#155EEF]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {summary.totalVisitors}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {summary.growth}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Avg. engagement: <strong className="text-slate-700">{summary.avgSession}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Human vs. AI-Agent Split</span>
            <Bot size={16} className="text-cyan-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-slate-900">{summary.humanPct}%</span>
            <span className="text-xs text-slate-500">Human</span>
            <span className="text-slate-300">/</span>
            <span className="text-lg font-bold text-[#155EEF]">{summary.aiPct}%</span>
            <span className="text-xs text-slate-500">AI</span>
          </div>
          <div className="mt-2.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
            <div className="bg-slate-800 h-full" style={{ width: `${summary.humanPct}%` }} />
            <div className="bg-[#155EEF] h-full" style={{ width: `${summary.aiPct}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Monitored AI Agents / Bots</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-slate-900">{agents.length}</span>
            <span className="text-xs text-emerald-700 font-semibold">
              {agents.filter((a) => a.status === "Verified").length} Verified
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-amber-700 font-medium">
            {agents.filter((a) => a.status !== "Verified").length} suspicious scraper flagged
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Lead-Gen Conversions</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-slate-900">{summary.conversions}</span>
            <span className="text-xs font-semibold text-[#155EEF]">
              {summary.conversionRate} CVR
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            RFQ quotes &amp; engineering consultations
          </p>
        </div>
      </div>

      {/* Traffic Trends Chart + Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic Trends Over Time */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                Traffic Trends Over Time ({timeRange})
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of human sessions vs. automated AI &amp; search bot requests
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="size-2.5 rounded-xs bg-slate-800" /> Human Visitors
              </span>
              <span className="flex items-center gap-1.5 text-[#155EEF]">
                <span className="size-2.5 rounded-xs bg-[#155EEF]" /> AI Agents / Bots
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end gap-3 sm:gap-5 pt-4 border-b border-slate-200 pb-2 px-2">
            {trends.map((pt) => {
              const humanH = Math.max(8, Math.round((pt.human / maxTrendValue) * 180));
              const aiH = Math.max(6, Math.round((pt.aiAgent / maxTrendValue) * 180));
              return (
                <div key={pt.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1.5 h-[185px]">
                    <div
                      className="w-3 sm:w-5 rounded-t bg-slate-800 transition-all"
                      style={{ height: `${humanH}px` }}
                      title={`Human: ${pt.human.toLocaleString()}`}
                    />
                    <div
                      className="w-3 sm:w-5 rounded-t bg-[#155EEF] transition-all"
                      style={{ height: `${aiH}px` }}
                      title={`AI Agents: ${pt.aiAgent.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{pt.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
              Traffic Sources
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Acquisition channels driving visitors to INDUS Robotics
            </p>

            <div className="space-y-4">
              {TRAFFIC_SOURCES.map((src) => (
                <div key={src.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{src.name}</span>
                    <span className="font-mono text-slate-600">
                      {src.visitors} ({src.share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${src.color}`} style={{ width: `${src.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Agents & Crawler Activity Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
              Most Active AI Agents &amp; Crawlers
            </h3>
            <p className="text-xs text-slate-500">
              Track verified AI assistants/search crawlers and block suspicious scraping bots
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-mono">
            {(
              [
                { id: "all", label: "All Bots" },
                { id: "verified", label: "Verified" },
                { id: "suspicious", label: "Suspicious" },
              ] as { id: BotFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setBotFilter(tab.id)}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                  botFilter === tab.id
                    ? "bg-white text-[#155EEF] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-600">
                <th className="py-3 px-4">Agent / Bot</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Requests</th>
                <th className="py-3 px-4">Most Accessed Page</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{agent.name}</div>
                    <div className="text-[11px] text-slate-500">{agent.provider}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{agent.category}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    {agent.requests.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#155EEF]">{agent.topPath}</td>
                  <td className="py-3.5 px-4">
                    {agent.status === "Verified" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    ) : agent.status === "Blocked" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                        <Ban size={11} /> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-700">
                        <ShieldAlert size={11} /> Suspicious
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {agent.status === "Verified" ? (
                      <span className="text-[11px] font-mono text-slate-400">Allowed</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleBlockAgent(agent.id)}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold cursor-pointer border ${
                          agent.status === "Blocked"
                            ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        {agent.status === "Blocked" ? "Unblock" : "Block Bot"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Robotics Pages + Geography & Search Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Robotics Pages */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                Top Visited Products &amp; Solutions
              </h3>
              <p className="text-xs text-slate-500">
                Content performance and lead conversions by robotics page
              </p>
            </div>
            <Activity size={16} className="text-[#155EEF]" />
          </div>

          <div className="divide-y divide-slate-100">
            {TOP_ROBOTICS_PAGES.map((page) => (
              <div key={page.path} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    to={page.path as never}
                    className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#155EEF] inline-flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{page.title}</span>
                    <ArrowUpRight size={13} className="shrink-0 text-slate-400" />
                  </Link>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {page.path} &bull; Avg. Time: {page.avgTime}
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-slate-900">{page.views} views</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {page.conversions} leads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geography & Popular Keywords */}
        <div className="lg:col-span-5 space-y-6">
          {/* Geographic Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                Geographic Distribution
              </h3>
              <Globe2 size={16} className="text-[#155EEF]" />
            </div>
            <div className="space-y-3">
              {GEO_DISTRIBUTION.map((geo) => (
                <div key={geo.country} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 w-32">{geo.country}</span>
                  <div className="flex-1 mx-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#155EEF]"
                      style={{ width: `${geo.share}%` }}
                    />
                  </div>
                  <span className="font-mono text-slate-600 w-20 text-right">
                    {geo.share}% ({geo.sessions})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Search Keywords */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                Popular Search Keywords
              </h3>
              <Search size={16} className="text-[#155EEF]" />
            </div>
            <div className="space-y-2.5">
              {POPULAR_KEYWORDS.map((kw) => (
                <div
                  key={kw.keyword}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                >
                  <span className="font-medium text-slate-800 truncate pr-2">{kw.keyword}</span>
                  <span className="font-mono text-[11px] text-slate-600 shrink-0">
                    {kw.volume} &bull; <strong className="text-[#155EEF]">{kw.ctr} CTR</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
