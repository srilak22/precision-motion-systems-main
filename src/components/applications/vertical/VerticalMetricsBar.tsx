import React from "react";
import { Clock, Crosshair, Weight, ShieldCheck, Activity } from "lucide-react";

interface MetricItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  badge: string;
  icon?: React.ElementType<{ size?: number; className?: string }>;
}

interface VerticalMetricsBarProps {
  metrics?: MetricItem[];
}

const FALLBACK_ICONS = [Clock, Crosshair, Weight, ShieldCheck];

const DEFAULT_METRICS: MetricItem[] = [
  {
    id: "cycle-time",
    value: "< 42s",
    label: "Takt Time Reduction",
    sublabel: "Down from 78s baseline on high-cadence production lines",
    badge: "TAKT CYCLE",
    icon: Clock,
  },
  {
    id: "seam-accuracy",
    value: "±0.02 mm",
    label: "Sub-Millimeter Precision",
    sublabel: "Closed-loop laser triangulation seam tracking guidance",
    badge: "ISO 9283",
    icon: Crosshair,
  },
  {
    id: "payload",
    value: "210 kg",
    label: "Max Dynamic Payload",
    sublabel: "Rigid heavy-duty articulated arm and gantry tooling",
    badge: "HIGH RIGIDITY",
    icon: Weight,
  },
  {
    id: "uptime",
    value: "99.98%",
    label: "Defect Interception & Uptime",
    sublabel: "Zero unplanned line shutdowns across continuous 24/7 duty",
    badge: "SIX SIGMA",
    icon: ShieldCheck,
  },
];

export function VerticalMetricsBar({ metrics = DEFAULT_METRICS }: VerticalMetricsBarProps) {
  const safeMetrics = metrics && metrics.length > 0 ? metrics : DEFAULT_METRICS;

  return (
    <section className="bg-[#F8FAFC] py-10 sm:py-14 border-b border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {safeMetrics.map((metric, idx) => {
            const Icon = metric.icon || FALLBACK_ICONS[idx % FALLBACK_ICONS.length] || Activity;
            return (
              <div
                key={metric.id || idx}
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 p-6 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#1D4ED8] uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80">
                    {metric.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D4ED8] border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {Icon ? <Icon size={16} /> : <Activity size={16} />}
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-900 mb-1.5 group-hover:text-[#1D4ED8] transition-colors">
                  {metric.value}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {metric.label}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {metric.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
