import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Phone,
  Users2,
  DollarSign,
  ArrowRight,
  Database,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getCompanyStats } from '../api/companies';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];

export const OverviewPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['company-stats'],
    queryFn: getCompanyStats,
    refetchInterval: 10_000,
  });

  const targetCount = stats?.targetCount ?? 50_000;
  const verifiedCount = stats?.verifiedManufacturers ?? 0;
  const progressPct = stats?.progressToTarget ?? 0;

  // Chart data formatting
  const countryChartData = Object.entries(stats?.countryBreakdown ?? {}).map(([name, count]) => ({
    name,
    count,
  }));

  const industryChartData = Object.entries(stats?.industryBreakdown ?? {}).map(([name, count]) => ({
    name,
    value: count,
  }));

  const kpis = [
    {
      label: 'Verified Manufacturers',
      value: verifiedCount.toLocaleString(),
      sub: `Primary Target KPI (of ${targetCount.toLocaleString()})`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      highlight: true,
    },
    {
      label: 'Total Discovered',
      value: (stats?.totalDiscovered ?? 0).toLocaleString(),
      sub: 'Raw records ingested from sources',
      icon: Database,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Unique Companies',
      value: (stats?.uniqueCompanies ?? 0).toLocaleString(),
      sub: 'Deduplicated company entities',
      icon: Building2,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Pending Human Review',
      value: (stats?.pendingReview ?? 0).toLocaleString(),
      sub: 'Low-confidence classification queue',
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'With Official Website',
      value: (stats?.withWebsites ?? 0).toLocaleString(),
      sub: `${Math.round(((stats?.withWebsites ?? 0) / Math.max(1, stats?.uniqueCompanies ?? 1)) * 100)}% coverage`,
      icon: Globe2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Public Business Contacts',
      value: (stats?.withContacts ?? 0).toLocaleString(),
      sub: `${Math.round(((stats?.withContacts ?? 0) / Math.max(1, stats?.uniqueCompanies ?? 1)) * 100)}% email/phone`,
      icon: Phone,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      label: 'Verified Leadership',
      value: (stats?.withLeadership ?? 0).toLocaleString(),
      sub: 'CEOs & Board Directors extracted',
      icon: Users2,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Financial Information',
      value: (stats?.withFinancials ?? 0).toLocaleString(),
      sub: 'Audited revenues & filings',
      icon: DollarSign,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Goal Progress Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Target Objective: 50,000 Unique Manufacturing Companies
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Global Manufacturing Intelligence Dashboard
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Discovering, verifying, classifying, and enriching manufacturing enterprises across United States, United Kingdom, Middle East (GCC), Singapore, and India from scratch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/collection"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Run Collection Jobs
            </Link>
            <Link
              to="/explorer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition flex items-center gap-2"
            >
              Explore Companies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Progress Toward 50,000 Target
              </span>
              <div className="text-2xl font-black text-white flex items-baseline gap-2">
                {verifiedCount.toLocaleString()}
                <span className="text-sm font-normal text-slate-400">/ 50,000 verified entities</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {progressPct}%
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(progressPct, 0.5))}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-xl border p-5 bg-slate-900/60 backdrop-blur transition hover:border-slate-700 ${
                kpi.highlight ? 'ring-1 ring-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-lg border ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                <div className="text-xs text-slate-400 mt-1">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regional Gap Analysis Report (Section 11) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-400" />
              Country-Wise Target & Gap Analysis Report
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target planning allocations across the 5 target regions to reach the 50,000 threshold.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            5 Target Regions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Target Region</th>
                <th className="py-3 px-4">Target Allocation</th>
                <th className="py-3 px-4">Collected & Verified</th>
                <th className="py-3 px-4">Remaining Gap</th>
                <th className="py-3 px-4 rounded-r-lg">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {Object.entries(stats?.gapReport ?? {}).map(([region, data]) => {
                const completion = Math.round((data.collected / Math.max(1, data.target)) * 100);
                return (
                  <tr key={region} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                      {region === 'United States' && '🇺🇸'}
                      {region === 'India' && '🇮🇳'}
                      {region === 'United Kingdom' && '🇬🇧'}
                      {region === 'Middle East' && '🇦🇪'}
                      {region === 'Singapore' && '🇸🇬'}
                      {region}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{data.target.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                      {data.collected.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-400">
                      {data.gap.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, completion)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300 font-mono">{completion}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Charts: Country Breakdown & Industry Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1">Company Geographic Distribution</h3>
          <p className="text-xs text-slate-400 mb-6">Verified manufacturing entities across regions</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Manufacturing Taxonomy Sectors Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1">Manufacturing Taxonomy Coverage</h3>
          <p className="text-xs text-slate-400 mb-6">Distribution across 10 primary industrial sectors</p>
          <div className="h-64 w-full flex items-center justify-center">
            {industryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {industryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-xs">Run collection to populate industry taxonomy distribution.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OverviewPage;

