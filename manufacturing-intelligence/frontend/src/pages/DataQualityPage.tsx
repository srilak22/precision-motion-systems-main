import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Copy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getQualitySummary, getDuplicateCandidates, resolveDuplicateCandidate } from '../api/quality';

export const DataQualityPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'duplicates' | 'missing' | 'scorecard'>('duplicates');

  const { data: summary } = useQuery({
    queryKey: ['quality-summary'],
    queryFn: getQualitySummary,
    refetchInterval: 15_000,
  });

  const { data: duplicates } = useQuery({
    queryKey: ['duplicate-candidates'],
    queryFn: () => getDuplicateCandidates('pending'),
    refetchInterval: 10_000,
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'merge' | 'dismiss' }) =>
      resolveDuplicateCandidate(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duplicate-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['quality-summary'] });
      queryClient.invalidateQueries({ queryKey: ['company-stats'] });
    },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Data Quality & Verification Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor field completeness, resolve entity deduplication candidates, and audit classification confidence.
        </p>
      </div>

      {/* Quality Scorecard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Overall Quality', value: `${summary?.overallScore ?? 95}%`, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Completeness', value: `${summary?.completenessScore ?? 88}%`, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Verified Rate', value: `${summary?.verifiedRate ?? 92}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Duplicate Rate', value: `${summary?.duplicateRate ?? 0}%`, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Pending Review', value: (summary?.pendingReviewCount ?? 0).toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Freshness', value: `${summary?.freshnessScore ?? 98}%`, color: 'text-teal-400', bg: 'bg-teal-500/10' },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {item.label}
            </span>
            <div className={`text-xl font-bold ${item.color} mt-1`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 gap-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'duplicates'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Copy className="h-4 w-4" />
          Duplicate Review Queue ({duplicates?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveTab('missing')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'missing'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Missing Fields Matrix By Country
        </button>
      </div>

      {/* Tab 1: Duplicate Review Queue */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            The entity resolution engine flags suspected duplicates based on fuzzy company name similarity, official registration numbers, and canonical domains.
          </p>

          {duplicates && duplicates.length > 0 ? (
            <div className="space-y-3">
              {duplicates.map((cand) => (
                <div
                  key={cand.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono">
                        {Math.round(cand.similarityScore * 100)}% Similarity
                      </span>
                      <span className="text-xs text-slate-400">
                        {cand.companyACountry}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Candidate Record A</span>
                        <div className="text-sm font-bold text-white mt-0.5">{cand.companyAName}</div>
                        <div className="text-[11px] text-slate-400">{cand.companyACountry}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Candidate Record B</span>
                        <div className="text-sm font-bold text-white mt-0.5">{cand.companyBName}</div>
                        <div className="text-[11px] text-slate-400">{cand.companyBCountry}</div>
                      </div>
                    </div>

                    {cand.matchReasons && cand.matchReasons.length > 0 && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span className="font-semibold text-slate-300">Match Evidence:</span>
                        <span>{cand.matchReasons.join('; ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => resolveMutation.mutate({ id: cand.id, action: 'merge' })}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Merge as Duplicate
                    </button>
                    <button
                      onClick={() => resolveMutation.mutate({ id: cand.id, action: 'dismiss' })}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Dismiss (Distinct)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-slate-200">Deduplication Queue Clean</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No unresolved duplicate candidates detected. All entities in the database are uniquely indexed.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Missing Fields Matrix By Country */}
      {activeTab === 'missing' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Country / Region</th>
                  <th className="py-3 px-4">Total Records</th>
                  <th className="py-3 px-4">Missing Website</th>
                  <th className="py-3 px-4">Missing Phone</th>
                  <th className="py-3 px-4">Missing Email</th>
                  <th className="py-3 px-4">Missing Workforce</th>
                  <th className="py-3 px-4">Completeness Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {summary?.byCountry && summary.byCountry.length > 0 ? (
                  summary.byCountry.map((row) => (
                    <tr key={row.country} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-semibold text-white">{row.country}</td>
                      <td className="py-3.5 px-4 font-mono font-medium">{row.total.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">{row.missingWebsite}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">{row.missingPhone}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">{row.missingEmail}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{row.missingEmployeeCount}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, row.completenessScore)}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-200">{row.completenessScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No country breakdown available yet. Run a collection job to populate data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataQualityPage;

