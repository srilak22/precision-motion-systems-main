import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface DomainScoreItem {
  domainId: string;
  domainCode: string;
  domainName: string;
  currentScore: number;
  targetScore: number;
  gapScore: number;
}

interface CurrentVsTargetBarChartProps {
  domainScores: DomainScoreItem[];
}

export function CurrentVsTargetBarChart({ domainScores }: CurrentVsTargetBarChartProps) {
  const chartData = domainScores.map((ds) => ({
    name: ds.domainCode,
    fullName: ds.domainName,
    "Current Baseline": ds.currentScore,
    "Target Horizon": ds.targetScore,
    Gap: ds.gapScore,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold text-white mb-1">
            {label}: {data.fullName}
          </div>
          <div className="text-cyan-400">Current Score: {data["Current Baseline"].toFixed(2)} / 5.0</div>
          <div className="text-emerald-400">Target Score: {data["Target Horizon"].toFixed(2)} / 5.0</div>
          <div className="text-amber-300 font-mono font-bold pt-1 border-t border-slate-800">
            Capability Gap: +{data.Gap.toFixed(2)}
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
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>Domain Maturity Comparison &bull; Current vs Target</span>
        </h3>
        <span className="text-xs text-slate-400">
          Scale: Level 0 (Manual) to Level 5 (Autonomous)
        </span>
      </div>

      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -15, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              domain={[0, 5]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              ticks={[0, 1, 2, 3, 4, 5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              iconType="circle"
            />
            <Bar
              dataKey="Current Baseline"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="Target Horizon"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
