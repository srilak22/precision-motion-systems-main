import React from "react";
import { Clock, Crosshair, Weight, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

interface MetricItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  badge: string;
  icon: React.ElementType<{ size?: number; className?: string }>;
  accentColor: string;
}

const AUTOMOTIVE_METRICS: MetricItem[] = [
  {
    id: "cycle-time",
    value: "< 42s",
    label: "Cycle Time Reduction",
    sublabel: "Down from 78s baseline on EV battery chassis trays",
    badge: "TAKT OPTIMIZATION",
    icon: Clock,
    accentColor: "from-[#00F0FF] to-[#00A3FF]",
  },
  {
    id: "seam-accuracy",
    value: "±0.02 mm",
    label: "Seam Tracking Accuracy",
    sublabel: "Sub-pixel real-time laser triangulation guidance",
    badge: "CLOSED-LOOP PRECISION",
    icon: Crosshair,
    accentColor: "from-[#38BDF8] to-[#0284C7]",
  },
  {
    id: "payload",
    value: "210 kg",
    label: "Max Dynamic Payload",
    sublabel: "Heavy servo spot-welding guns and battery modules",
    badge: "HIGH RIGIDITY",
    icon: Weight,
    accentColor: "from-[#6366F1] to-[#4F46E5]",
  },
  {
    id: "uptime",
    value: "99.98%",
    label: "Uptime & Defect Interception",
    sublabel: "Zero unplanned line shutdowns across 24/7 duty",
    badge: "SIX SIGMA QUALITY",
    icon: ShieldCheck,
    accentColor: "from-[#10B981] to-[#059669]",
  },
];

export function VerticalMetricsBar() {
  return (
    <section className="bg-[#0B0F17] py-8 sm:py-12 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {AUTOMOTIVE_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="group relative rounded-2xl bg-[#0D1424]/80 backdrop-blur-md border border-white/10 hover:border-[#00F0FF]/50 p-6 transition-all duration-300 shadow-lg hover:shadow-cyan-950/30 overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#00F0FF]/5 rounded-full blur-2xl group-hover:bg-[#00F0FF]/15 transition-colors pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Micro-Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300/80 uppercase px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      {metric.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
                      <Icon size={16} />
                    </div>
                  </div>

                  {/* Main Value with Gradient Accent */}
                  <div
                    className={`text-3xl sm:text-4xl font-black font-mono tracking-tight bg-gradient-to-r ${metric.accentColor} bg-clip-text text-transparent mb-2`}
                  >
                    {metric.value}
                  </div>

                  {/* Headline Label */}
                  <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-200 transition-colors">
                    {metric.label}
                  </h4>

                  {/* Subtitle Description */}
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {metric.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
