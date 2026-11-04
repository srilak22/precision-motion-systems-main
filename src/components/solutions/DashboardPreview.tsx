import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Radio,
  BatteryCharging,
  Trash2,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface BinData {
  id: string;
  name: string;
  location: string;
  fillLevel: number;
  status: "Normal" | "Warning" | "Critical";
  wasteCategory: string;
  lastUpdated: string;
}

interface EventLog {
  id: string;
  timestamp: string;
  robotId: string;
  action: string;
  category: string;
  bin: string;
  status: "Success" | "Alert";
}

const INITIAL_BINS: BinData[] = [
  {
    id: "BIN-01",
    name: "Central Plaza - East",
    location: "Sector 1A",
    fillLevel: 32,
    status: "Normal",
    wasteCategory: "Dry Recyclables",
    lastUpdated: "2 mins ago",
  },
  {
    id: "BIN-02",
    name: "Cafeteria Terrace",
    location: "Sector 2B",
    fillLevel: 78,
    status: "Warning",
    wasteCategory: "Food & Organics",
    lastUpdated: "4 mins ago",
  },
  {
    id: "BIN-03",
    name: "Main Transit Hub",
    location: "Sector 1C",
    fillLevel: 94,
    status: "Critical",
    wasteCategory: "Plastic & Cans",
    lastUpdated: "Just now",
  },
  {
    id: "BIN-04",
    name: "Engineering Quad",
    location: "Sector 3A",
    fillLevel: 51,
    status: "Normal",
    wasteCategory: "Paper & Cardboard",
    lastUpdated: "8 mins ago",
  },
  {
    id: "BIN-05",
    name: "Library Walkway",
    location: "Sector 4B",
    fillLevel: 19,
    status: "Normal",
    wasteCategory: "General Waste",
    lastUpdated: "12 mins ago",
  },
];

const INITIAL_LOGS: EventLog[] = [
  {
    id: "EVT-1082",
    timestamp: "14:32:05",
    robotId: "INDUS-W01",
    action: "Autonomous Collection",
    category: "PET Plastic Bottle",
    bin: "BIN-03",
    status: "Success",
  },
  {
    id: "EVT-1081",
    timestamp: "14:28:44",
    robotId: "INDUS-W02",
    action: "Chamber Compaction",
    category: "Cardboard Packaging",
    bin: "BIN-04",
    status: "Success",
  },
  {
    id: "EVT-1080",
    timestamp: "14:24:19",
    robotId: "INDUS-W01",
    action: "Fill Level Warning (78%)",
    category: "Organic Waste",
    bin: "BIN-02",
    status: "Alert",
  },
  {
    id: "EVT-1079",
    timestamp: "14:19:50",
    robotId: "INDUS-W03",
    action: "Opportunity Inductive Charge",
    category: "Docking Protocol",
    bin: "DEPOT-01",
    status: "Success",
  },
];

export function DashboardPreview() {
  const [selectedBinId, setSelectedBinId] = useState<string>("BIN-03");
  const [activeTab, setActiveTab] = useState<"fleet" | "bins" | "analytics">("fleet");
  const [simulatedTime, setSimulatedTime] = useState<string>("14:35:22 UTC");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSimulatedTime(
        `${now.getUTCHours().toString().padStart(2, "0")}:${now
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${now.getUTCSeconds().toString().padStart(2, "0")} UTC`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedBin = INITIAL_BINS.find((b) => b.id === selectedBinId) || INITIAL_BINS[2];

  return (
    <section className="relative bg-slate-950 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 right-10 w-[600px] h-[600px] bg-[#16C7E8]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#155EEF]/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#16C7E8]/30 bg-[#16C7E8]/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8] mb-4">
              <LayoutDashboard size={13} className="text-[#16C7E8]" />
              <span>Real-Time Operations Showcase</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Fleet Telematics &amp; <br />
              <span className="text-[#16C7E8]">Live Operational Dashboard</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Experience the simulated web console utilized by facility dispatchers to monitor
              autonomous units, bin fill dynamics, and segregated waste yields in real time.
            </p>
          </div>

          {/* Demonstration Notice Badge */}
          <div className="shrink-0 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 flex items-center gap-3">
            <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Interactive Demonstration
              </div>
              <div className="text-xs text-amber-200">
                Simulated real-time telemetry stream
              </div>
            </div>
          </div>
        </div>

        {/* Console Container Window */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
          {/* Top Browser / Window Chrome */}
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/80 inline-block" />
              <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-slate-300 font-bold">
                INDUS FLEET TELEMETRY // v3.4.1
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio size={13} className="animate-pulse" />
                <span>MQTT CONNECTED (TLS 1.3)</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-slate-300 hidden sm:flex">
                <Clock size={13} />
                <span>{simulatedTime}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/50">
            <div className="p-4 sm:p-5 border-r border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Robots Online</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-white">4</span>
                <span className="text-xs font-mono text-emerald-400">/ 4 Active</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-r border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Daily Picks</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-[#16C7E8]">
                  482
                </span>
                <span className="text-xs font-mono text-emerald-400">+18% vs avg</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-r border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Avg Battery</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-white">84%</span>
                <span className="text-xs font-mono text-slate-400">~5.2h remain</span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Purity Rate</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                  96.2%
                </span>
                <span className="text-xs font-mono text-slate-400">Target 95%</span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 lg:p-8">
            {/* Left Column: Interactive Map & Route Tracking */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Map Panel */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#16C7E8]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Live Campus Dispatch Route Map
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#16C7E8] bg-[#16C7E8]/10 border border-[#16C7E8]/20 px-2 py-0.5 rounded">
                    Centimeter RTK-GPS Active
                  </span>
                </div>

                {/* Simulated Visual Route SVG Map */}
                <div className="relative w-full h-64 sm:h-72 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {/* Grid Lines */}
                  <svg className="absolute inset-0 w-full h-full stroke-slate-800/60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Campus Zones */}
                  <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-600 uppercase">
                    Zone A · Administration
                  </div>
                  <div className="absolute top-4 right-6 text-[10px] font-mono text-slate-600 uppercase">
                    Zone B · Tech Park
                  </div>
                  <div className="absolute bottom-4 left-6 text-[10px] font-mono text-slate-600 uppercase">
                    Zone C · Food Court
                  </div>
                  <div className="absolute bottom-4 right-6 text-[10px] font-mono text-slate-600 uppercase">
                    Zone D · Sports Quad
                  </div>

                  {/* Waypoint Path SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 250">
                    <path
                      d="M 60 70 Q 180 30 260 110 T 420 80 Q 400 200 280 180 T 120 190 Z"
                      fill="none"
                      stroke="#16C7E8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="opacity-40 animate-pulse"
                    />

                    {/* Robot 1 (Active) */}
                    <circle cx="260" cy="110" r="8" fill="#16C7E8" className="animate-ping opacity-75" />
                    <circle cx="260" cy="110" r="5" fill="#16C7E8" />

                    {/* Robot 2 */}
                    <circle cx="400" cy="140" r="4" fill="#38BDF8" />

                    {/* Bin Markers */}
                    <circle cx="120" cy="190" r="4" fill="#10B981" />
                    <circle cx="420" cy="80" r="4" fill="#EF4444" />
                    <circle cx="180" cy="40" r="4" fill="#F59E0B" />
                  </svg>

                  {/* Overlay Node Tag */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8 bg-slate-950/90 border border-[#16C7E8] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#16C7E8] animate-ping" />
                    <span className="text-[11px] font-mono font-bold text-white">
                      INDUS-W01 (En Route to BIN-03)
                    </span>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#16C7E8]" />
                      <span>Active Units</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>Normal Bins</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span>Critical (&gt;90%)</span>
                    </span>
                  </div>
                  <span className="text-slate-500">Scale: 1:500m</span>
                </div>
              </div>

              {/* Real-Time Event Audit Log */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Live Event Log
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Auto-refresh 5s</span>
                </div>

                <div className="space-y-2">
                  {INITIAL_LOGS.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-500">{evt.timestamp}</span>
                        <span className="text-[#16C7E8] font-bold">{evt.robotId}</span>
                        <span className="text-slate-200">{evt.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 hidden sm:inline">{evt.category}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            evt.status === "Success"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Bin Status & Waste Breakdown */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Bin Telemetry Selector */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Monitored Bin Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    5 of 18 Receptacles
                  </span>
                </div>

                {/* Bins List */}
                <div className="space-y-2.5">
                  {INITIAL_BINS.map((bin) => {
                    const isSelected = bin.id === selectedBinId;

                    return (
                      <button
                        key={bin.id}
                        onClick={() => setSelectedBinId(bin.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-[#16C7E8] bg-slate-900 ring-1 ring-[#16C7E8]"
                            : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-xs font-bold text-[#16C7E8]">
                              {bin.id}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {bin.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {bin.location} · {bin.wasteCategory}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            className={`font-mono text-sm font-black ${
                              bin.fillLevel >= 90
                                ? "text-red-400"
                                : bin.fillLevel >= 70
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {bin.fillLevel}%
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {bin.status}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Bin Gauge & Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C7E8]">
                    Focus: {selectedBin.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Updated {selectedBin.lastUpdated}
                  </span>
                </div>

                {/* Large Progress Bar Gauge */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Chamber Fill Capacity</span>
                    <span
                      className={`font-bold ${
                        selectedBin.fillLevel >= 90
                          ? "text-red-400"
                          : selectedBin.fillLevel >= 70
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {selectedBin.fillLevel}% Full
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        selectedBin.fillLevel >= 90
                          ? "bg-gradient-to-r from-red-500 to-rose-400"
                          : selectedBin.fillLevel >= 70
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-emerald-500 to-teal-400"
                      }`}
                      style={{ width: `${selectedBin.fillLevel}%` }}
                    />
                  </div>
                </div>

                {/* Waste Categorization Breakdown */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Aggregated Material Breakdown
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>PET Plastic &amp; Bottles</span>
                        <span className="text-white font-bold">38%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "38%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Paper &amp; Cardboard</span>
                        <span className="text-white font-bold">27%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#16C7E8]" style={{ width: "27%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Organic &amp; Compost</span>
                        <span className="text-white font-bold">22%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "22%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Aluminum &amp; Metal</span>
                        <span className="text-white font-bold">13%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: "13%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
