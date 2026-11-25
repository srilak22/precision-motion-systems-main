import React, { useState } from "react";
import {
  Gauge,
  Activity,
  DollarSign,
  Cpu,
  Bot,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface KpiItem {
  kpiCode: string;
  kpiCategory: "OPERATIONAL" | "ROBOTICS" | "FINANCIAL" | "DIGITAL" | string;
  kpiName: string;
  measuredOrEstimatedValue: number | null;
  unit: string;
  benchmarkValue: number | null;
  gapValue: number | null;
  formulaDefinition: string;
  inputParameters: Record<string, any>;
  isEstimate: boolean;
  dataAvailabilityStatus: "available" | "estimated" | "missing" | string;
}

interface KpiPerformanceDashboardProps {
  kpis: KpiItem[];
}

export function KpiPerformanceDashboard({ kpis }: KpiPerformanceDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedKpiCode, setSelectedKpiCode] = useState<string | null>(null);

  const categories = ["ALL", "OPERATIONAL", "ROBOTICS", "FINANCIAL", "DIGITAL"];

  const filtered = kpis.filter((k) => {
    if (activeTab === "ALL") return true;
    return k.kpiCategory === activeTab;
  });

  const formatValue = (val: number | null, unit: string) => {
    if (val === null || val === undefined) return "N/A";
    if (unit === "USD ($)" || unit === "USD ($) / Year") {
      return "$" + val.toLocaleString();
    }
    return val.toLocaleString() + " " + unit;
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "OPERATIONAL":
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case "ROBOTICS":
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case "FINANCIAL":
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      case "DIGITAL":
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      default:
        return <Gauge className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <span>Industrial KPI Analytics &amp; Performance Telemetry</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic formulas across Operational (OEE), Robotics, Financial ROI, and Digital Connectivity.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveTab(c)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-colors shrink-0 ${
                activeTab === c
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((kpi) => {
          const isSelected = selectedKpiCode === kpi.kpiCode;
          return (
            <div
              key={kpi.kpiCode}
              onClick={() => setSelectedKpiCode(isSelected ? null : kpi.kpiCode)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-400"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    {getCategoryIcon(kpi.kpiCategory)}
                    <span className="font-bold text-slate-300">{kpi.kpiCode}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      kpi.dataAvailabilityStatus === "available"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                        : kpi.dataAvailabilityStatus === "estimated"
                        ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {kpi.dataAvailabilityStatus === "available" ? "Measured" : "Model Estimate"}
                  </span>
                </div>

                <div className="text-sm font-bold text-white line-clamp-1">{kpi.kpiName}</div>

                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono mt-2">
                  {formatValue(kpi.measuredOrEstimatedValue, kpi.unit)}
                </div>

                {kpi.benchmarkValue !== null && (
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Industry Benchmark:</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {formatValue(kpi.benchmarkValue, kpi.unit)}
                    </span>
                  </div>
                )}
              </div>

              {/* Collapsible Formula Box */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="text-slate-500 font-mono line-clamp-1">
                  Formula: {kpi.formulaDefinition}
                </div>
                {isSelected && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] space-y-1 animate-in fade-in">
                    <div className="font-bold text-cyan-300">Active Mathematical Formulation:</div>
                    <div className="text-slate-300 font-mono">{kpi.formulaDefinition}</div>
                    {kpi.inputParameters && (
                      <div className="text-slate-400 pt-1">
                        Input Values: {JSON.stringify(kpi.inputParameters)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
