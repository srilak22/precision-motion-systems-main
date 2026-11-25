import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  BarChart3,
  Factory,
  Building,
  Users,
  Layers,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  Cpu,
  Bot,
  Activity,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRPA_DOMAINS } from "@/data/irpa/domains";
import { IRPA_INDUSTRIES } from "@/data/irpa/industries";

interface AdminOverviewData {
  stats: {
    totalAssessments: number;
    submittedAssessments: number;
    verifiedAssessments: number;
    totalCompanies: number;
    totalFactories: number;
    averageBaselineScore: number;
  };
  recentAssessments: any[];
  auditLogs: any[];
}

export function AdminPortal() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem("indus_irpa_token");
      const res = await fetch("/api/irpa/admin/overview", {
        headers: {
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
      });
      if (res.ok) {
        const resData = await res.json();
        setData(resData);
      }
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const exportCsv = () => {
    if (!data?.recentAssessments || data.recentAssessments.length === 0) return;
    const headers = [
      "Assessment ID",
      "Company",
      "Factory",
      "Industry",
      "Status",
      "Current Score",
      "Target Score",
      "Submitted At",
    ];
    const rows = data.recentAssessments.map((a) => [
      a.id,
      `"${a.companyName || ""}"`,
      `"${a.factoryName || ""}"`,
      `"${a.industryId || ""}"`,
      a.status,
      a.overallCurrentScore || "",
      a.overallTargetScore || "",
      a.submittedAt || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `indus_irpa_assessments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAssessments = (data?.recentAssessments || []).filter((a) => {
    const matchesSearch =
      (a.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.factoryName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.referenceId || a.id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>IRPA Control Center &bull; Executive Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Automation Maturity Command Console
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Monitor pipeline velocity, domain maturity benchmarks across customer manufacturing plants, unverified evidence flags, and security audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={fetchOverview}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={exportCsv}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs px-4 py-2 rounded-lg"
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Export Pipeline CSV
          </Button>
        </div>
      </div>

      {/* High-Level KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Total Plant Assessments</span>
            <Factory className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {data?.stats?.totalAssessments ?? 14}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {data?.stats?.totalCompanies ?? 8} registered enterprises
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Submitted for Verification</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">
            {data?.stats?.submittedAssessments ?? 9}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1">
            {data?.stats?.verifiedAssessments ?? 5} formally verified
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Average Baseline Maturity</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {data?.stats?.averageBaselineScore
              ? data.stats.averageBaselineScore.toFixed(2)
              : "2.35"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Level 0–5 composite scale</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase mb-2">
            <span>Supported Industries</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">15</div>
          <div className="text-[11px] text-slate-400 mt-1">
            12 Domains &bull; 120 Capability Parameters
          </div>
        </div>
      </div>

      {/* Main Table: Assessments Register */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-cyan-400" />
            <span>Active Assessment Register</span>
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <th className="py-3 px-3">Reference / Factory</th>
                <th className="py-3 px-3">Enterprise</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Baseline</th>
                <th className="py-3 px-3 text-center">Target</th>
                <th className="py-3 px-3 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No assessments found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">
                        {a.factoryName || "Primary Facility"}
                      </div>
                      <div className="font-mono text-[10px] text-cyan-400">
                        {a.referenceId || a.id.slice(0, 12)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {a.companyName || "Industrial Partner"}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {a.industryId || "Automotive"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          a.status === "verified" || a.status === "completed"
                            ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
                            : a.status === "submitted" || a.status === "under_review"
                            ? "bg-cyan-950/70 border-cyan-500/50 text-cyan-300"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                      {a.overallCurrentScore ? a.overallCurrentScore.toFixed(2) : "—"}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                      {a.overallTargetScore ? a.overallTargetScore.toFixed(2) : "—"}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                      {a.submittedAt
                        ? new Date(a.submittedAt).toLocaleDateString()
                        : new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail Log Stream */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>System Audit Trail &amp; Data Integrity Log</span>
        </h2>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {(!data?.auditLogs || data.auditLogs.length === 0) ? (
            <div className="p-4 rounded-xl bg-slate-950/40 text-center text-xs text-slate-500">
              No audit log entries recorded yet.
            </div>
          ) : (
            data.auditLogs.map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {log.action}
                  </span>
                  <span className="text-slate-300 font-medium">{log.entityType}</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    ID: {log.entityId}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
