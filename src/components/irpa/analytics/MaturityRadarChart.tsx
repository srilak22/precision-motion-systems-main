import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Layers } from "lucide-react";

interface DomainScoreItem {
  domainId: string;
  domainCode: string;
  domainName: string;
  currentScore: number;
  targetScore: number;
  medianBenchmark?: number;
}

interface MaturityRadarChartProps {
  domainScores: DomainScoreItem[];
  industryName?: string;
}

export function MaturityRadarChart({
  domainScores,
  industryName = "Automotive Manufacturing",
}: MaturityRadarChartProps) {
  const radarData = domainScores.map((ds) => ({
    subject: ds.domainName.length > 18 ? ds.domainName.slice(0, 16) + "..." : ds.domainName,
    fullDomainName: ds.domainName,
    domainCode: ds.domainCode,
    Current: ds.currentScore,
    Target: ds.targetScore,
    Benchmark: ds.medianBenchmark || 3.5,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold text-white mb-1">
            {data.domainCode}: {data.fullDomainName}
          </div>
          <div className="text-cyan-400">Current Baseline: {data.Current.toFixed(2)} / 5.0</div>
          <div className="text-emerald-400">Target Horizon: {data.Target.toFixed(2)} / 5.0</div>
          <div className="text-indigo-400">Industry Median: {data.Benchmark.toFixed(2)} / 5.0</div>
          <div className="text-amber-300 font-mono text-[11px] pt-1 border-t border-slate-800">
            Capability Gap: +{(data.Target - data.Current).toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>12-Domain Maturity Radar &bull; Current vs Target vs Benchmark</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Calibrated against {industryName}
        </span>
      </div>

      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              stroke="#475569"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              iconType="circle"
            />
            <Radar
              name="Current Baseline"
              dataKey="Current"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.35}
            />
            <Radar
              name="Target Horizon"
              dataKey="Target"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.25}
            />
            <Radar
              name="Industry Median"
              dataKey="Benchmark"
              stroke="#818cf8"
              fill="#818cf8"
              fillOpacity={0.10}
              strokeDasharray="4 4"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
