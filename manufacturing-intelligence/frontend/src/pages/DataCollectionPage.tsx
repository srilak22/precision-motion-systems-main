import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Database,
  Play,
  Pause,
  XCircle,
  Clock,
  Terminal,
} from 'lucide-react';
import { getJobs, triggerJob, pauseJob, resumeJob, cancelJob, getJobLogs } from '../api/jobs';
import { getSources } from '../api/sources';

export const DataCollectionPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedSource, setSelectedSource] = useState<string>('uk_companies_house');
  const [targetCount, setTargetCount] = useState<number>(1000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeJobIdForLogs, setActiveJobIdForLogs] = useState<string | null>(null);

  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: getSources,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    refetchInterval: 3_000,
  });

  const { data: jobLogs } = useQuery({
    queryKey: ['job-logs', activeJobIdForLogs],
    queryFn: () => getJobLogs(activeJobIdForLogs!),
    enabled: Boolean(activeJobIdForLogs),
    refetchInterval: 2_000,
  });

  const triggerMutation = useMutation({
    mutationFn: () => triggerJob(selectedSource),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsModalOpen(false);
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: string) => pauseJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  const resumeMutation = useMutation({
    mutationFn: (id: string) => resumeJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Data Collection & Mining Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage official connectors, orchestrate multi-session collection jobs, pause/resume, and inspect logs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Play className="h-4 w-4 fill-white" />
          Trigger Collection Job
        </button>
      </div>

      {/* Source Connectors Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-400" />
          Source Connectors Registry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sourcesLoading ? (
            <div className="text-xs text-slate-400 col-span-3 py-6 text-center">Loading connectors...</div>
          ) : (
            sources?.map((src) => (
              <div
                key={src.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{src.flag || '🌐'}</span>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{src.name}</div>
                      <div className="text-[11px] text-slate-400">{src.country}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    {src.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{src.description}</p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Rate Limit: {src.rateLimitPerMinute}/min</span>
                  <span>{src.companiesCollected.toLocaleString()} saved</span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 text-[10px] truncate max-w-[150px]">
                    {src.license}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSource(src.id);
                      setIsModalOpen(true);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Run Job →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Collection Jobs Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          Collection Execution History & Controls
        </h2>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Job Name / Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Discovered</th>
                  <th className="py-3 px-4">Accepted Mfg</th>
                  <th className="py-3 px-4">Duplicates Excluded</th>
                  <th className="py-3 px-4">Started At</th>
                  <th className="py-3 px-4 text-right">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 text-xs">
                {jobsLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">Loading jobs...</td>
                  </tr>
                ) : jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="font-semibold">{job.jobName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{job.sourceName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            job.status === 'running'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse'
                              : job.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : job.status === 'paused'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {job.status === 'running' && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />}
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">{job.totalDiscovered.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {job.totalAccepted.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">
                        {job.totalDuplicates.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {job.startedAt ? new Date(job.startedAt).toLocaleTimeString() : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {job.status === 'running' && (
                            <button
                              onClick={() => pauseMutation.mutate(job.id)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                              title="Pause Job"
                            >
                              <Pause className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {job.status === 'paused' && (
                            <button
                              onClick={() => resumeMutation.mutate(job.id)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition"
                              title="Resume Job"
                            >
                              <Play className="h-3.5 w-3.5 fill-emerald-400" />
                            </button>
                          )}

                          {(job.status === 'running' || job.status === 'paused') && (
                            <button
                              onClick={() => cancelMutation.mutate(job.id)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition"
                              title="Cancel Job"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => setActiveJobIdForLogs(job.id)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition flex items-center gap-1 text-[11px] px-2"
                          >
                            <Terminal className="h-3.5 w-3.5" />
                            Logs
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No collection jobs triggered yet. Launch your first job above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Structured Logs Drawer / Viewer */}
      {activeJobIdForLogs && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Terminal className="h-4 w-4" />
              Live Job Execution Logs (ID: {activeJobIdForLogs.slice(0, 8)}...)
            </div>
            <button
              onClick={() => setActiveJobIdForLogs(null)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Close
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 text-[11px] text-slate-300">
            {jobLogs && jobLogs.length > 0 ? (
              jobLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`font-bold shrink-0 ${
                      log.level === 'ERROR'
                        ? 'text-rose-400'
                        : log.level === 'WARNING'
                        ? 'text-amber-400'
                        : 'text-indigo-400'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500">No log entries found for this job.</div>
            )}
          </div>
        </div>
      )}

      {/* Trigger Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" />
              Launch Collection Job
            </h3>
            <p className="text-xs text-slate-400">
              Select an authorized data source connector and target entity batch size.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Source Connector</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="uk_companies_house">Companies House (UK)</option>
                  <option value="us_sec_edgar">SEC EDGAR (US)</option>
                  <option value="india_mca">Ministry of Corporate Affairs (India)</option>
                  <option value="singapore_acra">ACRA / data.gov.sg (Singapore)</option>
                  <option value="middle_east_gcc">GCC Regional Industrial Registries (UAE, KSA, Qatar, Oman, Bahrain, Kuwait)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Entity Count</label>
                <select
                  value={targetCount}
                  onChange={(e) => setTargetCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                >
                  <option value={500}>500 companies</option>
                  <option value={1000}>1,000 companies</option>
                  <option value={2500}>2,500 companies</option>
                  <option value={5000}>5,000 companies</option>
                  <option value={10000}>10,000 companies</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => triggerMutation.mutate()}
                disabled={triggerMutation.isPending}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-lg shadow-indigo-600/30"
              >
                {triggerMutation.isPending ? 'Launching...' : 'Start Collection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataCollectionPage;

