import React, { useState, useEffect, useRef } from "react";

interface CounterProps {
  end: number;
  suffix?: string;
  decimals?: number;
  label: string;
  subtext: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({ end, suffix = "", decimals = 0, label, subtext }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, end]);

  return (
    <div ref={ref} className="text-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all">
      <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#155EEF]">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
        {suffix}
      </div>
      <div className="mt-2 text-base font-bold text-slate-900">{label}</div>
      <div className="mt-1 text-xs text-slate-500 font-mono">{subtext}</div>
    </div>
  );
};

export function RailwayProjectResults() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>PROVEN METRICS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Validated Track Safety <span className="text-[#155EEF]">Impact</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Observed results across 1,200 km of mainline track audits compared to traditional foot patrol methods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCounter
            end={98}
            suffix="%"
            label="Defect Detection Rate"
            subtext="Sub-surface & surface rail cracks"
          />
          <AnimatedCounter
            end={85}
            suffix="%"
            label="Human Hazard Reduction"
            subtext="Track walking hours removed"
          />
          <AnimatedCounter
            end={4}
            suffix="x"
            label="Faster Track Audits"
            subtext="25 km/h continuous scanning"
          />
          <AnimatedCounter
            end={50}
            suffix="%"
            label="Fewer Emergency Closures"
            subtext="Preventative maintenance scheduling"
          />
        </div>
      </div>
    </section>
  );
}
