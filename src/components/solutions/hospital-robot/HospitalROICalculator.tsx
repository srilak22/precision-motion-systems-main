import React, { useState, useId } from "react";
import {
  Calculator,
  TrendingUp,
  Clock,
  Heart,
  Info,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

export function HospitalROICalculator() {
  const bedsInputId = useId();
  const nursesInputId = useId();
  const transitHoursInputId = useId();
  const hourlyRateInputId = useId();
  const automationInputId = useId();
  const capexInputId = useId();

  // Inputs with realistic hospital defaults
  const [inpatientBeds, setInpatientBeds] = useState<number>(300);
  const [nursesOnShift, setNursesOnShift] = useState<number>(50);
  const [transitHoursPerShift, setTransitHoursPerShift] = useState<number>(1.2); // hrs/shift running errands
  const [hourlyNurseRate, setHourlyNurseRate] = useState<number>(52); // $ / hr fully loaded
  const [automationPercent, setAutomationPercent] = useState<number>(75); // 75%
  const [capexInvestment, setCapexInvestment] = useState<number>(85000); // $ for 2-3 unit system

  // Calculations
  // Total daily transit hours lost by nurses
  const totalDailyTransitHoursLost = nursesOnShift * 2 * transitHoursPerShift; // 2 shifts / day
  // Daily hours reclaimed
  const dailyHoursReclaimed = Math.round(totalDailyTransitHoursLost * (automationPercent / 100));
  // Annual hours reclaimed
  const annualHoursReclaimed = dailyHoursReclaimed * 365;

  // Monthly labor value of reclaimed hours
  const monthlyLaborValue = Math.round((annualHoursReclaimed / 12) * hourlyNurseRate);
  // Estimated monthly fleet maintenance & hospital Wi-Fi telematics opex (~10%)
  const monthlyOpex = Math.round(monthlyLaborValue * 0.10);
  const netMonthlyValue = monthlyLaborValue - monthlyOpex;
  const annualNetSavings = netMonthlyValue * 12;

  // Payback period in months
  const paybackMonths =
    netMonthlyValue > 0
      ? (capexInvestment / netMonthlyValue).toFixed(1)
      : "N/A";

  // 3-Year Cumulative Net Financial Benefit
  const threeYearGross = netMonthlyValue * 36;
  const threeYearNetReturn = threeYearGross - capexInvestment;
  const threeYearRoiPercent =
    capexInvestment > 0
      ? Math.round((threeYearNetReturn / capexInvestment) * 100)
      : 0;

  return (
    <section className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -bottom-40 left-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
            <Calculator size={13} className="text-emerald-400" />
            <span>Clinical Economics &amp; Nursing Staff Time Model</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Hospital Staff Time &amp; <br />
            <span className="text-emerald-400">Logistics Payback Calculator</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Quantify the hours returned directly to patient care by offloading routine pharmacy,
            linen, and pathology errands to autonomous delivery robots.
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Sliders */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Hospital Operating Baseline
              </span>
              <button
                type="button"
                onClick={() => {
                  setInpatientBeds(300);
                  setNursesOnShift(50);
                  setTransitHoursPerShift(1.2);
                  setHourlyNurseRate(52);
                  setAutomationPercent(75);
                  setCapexInvestment(85000);
                }}
                className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Reset Clinical Defaults
              </button>
            </div>

            {/* Slider 1: Nurses on Shift */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={nursesInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Nurses on Duty per 12-Hour Shift
                </label>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {nursesOnShift} Nurses
                </span>
              </div>
              <input
                id={nursesInputId}
                type="range"
                min="10"
                max="200"
                step="5"
                value={nursesOnShift}
                onChange={(e) => setNursesOnShift(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>10 Nurses</span>
                <span>200 Nurses</span>
              </div>
            </div>

            {/* Slider 2: Transit Hours per Shift */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={transitHoursInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Hours Lost per Nurse to Running Errands / Shift
                </label>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {transitHoursPerShift} Hours / Shift
                </span>
              </div>
              <input
                id={transitHoursInputId}
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={transitHoursPerShift}
                onChange={(e) => setTransitHoursPerShift(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.5 hrs (Low)</span>
                <span>3.0 hrs (High multi-wing)</span>
              </div>
            </div>

            {/* Slider 3: Hourly Nurse Cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={hourlyRateInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Fully Loaded Nurse Cost ($ / Hour)
                </label>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  ${hourlyNurseRate} / hr
                </span>
              </div>
              <input
                id={hourlyRateInputId}
                type="range"
                min="35"
                max="90"
                step="1"
                value={hourlyNurseRate}
                onChange={(e) => setHourlyNurseRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>$35 / hr</span>
                <span>$90 / hr</span>
              </div>
            </div>

            {/* Slider 4: Runner Automation Target % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={automationInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Target Errand Automation Rate %
                </label>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  {automationPercent}%
                </span>
              </div>
              <input
                id={automationInputId}
                type="range"
                min="40"
                max="90"
                step="5"
                value={automationPercent}
                onChange={(e) => setAutomationPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>40% (Pharmacy Only)</span>
                <span>90% (Hospital-Wide)</span>
              </div>
            </div>

            {/* Slider 5: Estimated System Capex */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={capexInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Estimated Hospital Robotics Deployment Capex
                </label>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  ${capexInvestment.toLocaleString()}
                </span>
              </div>
              <input
                id={capexInputId}
                type="range"
                min="45000"
                max="250000"
                step="5000"
                value={capexInvestment}
                onChange={(e) => setCapexInvestment(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>$45,000 (1 Unit)</span>
                <span>$250,000 (5 Unit Fleet)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed font-mono flex items-center gap-1.5">
              <Info size={13} className="shrink-0 text-slate-400" />
              <span>Includes estimated 10% annual Wi-Fi telematics and preventive maintenance buffer.</span>
            </div>
          </div>

          {/* Right Column: Computed Outputs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Impact KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nursing Hours Returned */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-emerald-400">
                    Bedside Hours Reclaimed
                  </span>
                  <Heart size={16} className="text-emerald-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                  {dailyHoursReclaimed}{" "}
                  <span className="text-lg text-emerald-400 font-semibold">Hours / Day</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  ~{annualHoursReclaimed.toLocaleString()} hours returned to patients / yr
                </div>
              </div>

              {/* Payback Duration */}
              <div className="rounded-xl border border-cyan-500/30 bg-blue-950/20 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-cyan-400">
                    Amortized Payback
                  </span>
                  <Clock size={16} className="text-cyan-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                  {paybackMonths}{" "}
                  <span className="text-lg text-cyan-400 font-semibold">Months</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Full capital cost amortization
                </div>
              </div>
            </div>

            {/* Financial Breakdown Table Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                Clinical Value &amp; Financial Breakdown
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Daily Nursing Transit Hours Lost (Baseline)</span>
                  <span className="text-slate-200">{totalDailyTransitHoursLost.toFixed(1)} hrs / day</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Annual Hours Returned to Bedside ({automationPercent}%)</span>
                  <span className="text-white font-bold">{annualHoursReclaimed.toLocaleString()} hrs / yr</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Monthly Reclaimed Clinical Value</span>
                  <span className="text-white font-bold">${monthlyLaborValue.toLocaleString()} / mo</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Est. Monthly Fleet Maintenance &amp; Cloud (10%)</span>
                  <span className="text-slate-500">-${monthlyOpex.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-emerald-400 font-bold">Net Monthly Operational Value</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ${netMonthlyValue.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-emerald-400 font-bold">Net Annual Operational Value</span>
                  <span className="text-emerald-400 font-black text-base">
                    ${annualNetSavings.toLocaleString()} / yr
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300">3-Year Projected Net ROI</span>
                  <span className="text-white font-black text-base">
                    +{threeYearRoiPercent}% (${threeYearNetReturn.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-amber-300">Clinical Feasibility Notice:</strong> Figures are
                economic model simulations based on generalized hospital nurse walking metrics.
                Specific staff time reallocation and payback timelines are evaluated during on-site
                clinical shadowing surveys.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
