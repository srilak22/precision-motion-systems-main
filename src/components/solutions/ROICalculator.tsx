import React, { useState, useId } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function ROICalculator() {
  const staffInputId = useId();
  const laborCostInputId = useId();
  const daysInputId = useId();
  const coverageInputId = useId();
  const capexInputId = useId();

  // Input States with realistic defaults
  const [staffCount, setStaffCount] = useState<number>(6);
  const [monthlyLaborCost, setMonthlyLaborCost] = useState<number>(2800); // $ per worker
  const [operatingDays, setOperatingDays] = useState<number>(26);
  const [roboticCoverage, setRoboticCoverage] = useState<number>(60); // 60%
  const [capexInvestment, setCapexInvestment] = useState<number>(55000); // $ system capex

  // Calculations:
  // Total baseline monthly manual labor spend
  const totalMonthlyLaborSpend = staffCount * monthlyLaborCost;
  // Effective labor hours/capacity automated
  const monthlyLaborSavings = Math.round(totalMonthlyLaborSpend * (roboticCoverage / 100));
  // Estimated monthly robotic maintenance & cellular cloud fee (~12% of savings or fixed $400)
  const monthlyOpex = Math.round(monthlyLaborSavings * 0.12);
  const netMonthlySavings = monthlyLaborSavings - monthlyOpex;
  const annualNetSavings = netMonthlySavings * 12;

  // Payback period in months
  const paybackMonths =
    netMonthlySavings > 0
      ? (capexInvestment / netMonthlySavings).toFixed(1)
      : "N/A";

  // 3-Year Total Financial Benefit
  const threeYearGrossSavings = netMonthlySavings * 36;
  const threeYearNetReturn = threeYearGrossSavings - capexInvestment;
  const threeYearRoiPercent =
    capexInvestment > 0
      ? Math.round((threeYearNetReturn / capexInvestment) * 100)
      : 0;

  return (
    <section className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -bottom-40 left-10 w-[500px] h-[500px] bg-[#16C7E8]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 w-[600px] h-[600px] bg-[#155EEF]/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
            <Calculator size={13} className="text-emerald-400" />
            <span>Economic Feasibility Model</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Interactive Operational <br />
            <span className="text-emerald-400">ROI &amp; Payback Calculator</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Adjust the operational variables below to evaluate potential labor redeployment
            savings, operational payback duration, and projected 3-year net ROI for your facility.
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Sliders & Form */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Facility Baseline Parameters
              </span>
              <button
                type="button"
                onClick={() => {
                  setStaffCount(6);
                  setMonthlyLaborCost(2800);
                  setOperatingDays(26);
                  setRoboticCoverage(60);
                  setCapexInvestment(55000);
                }}
                className="text-xs font-mono text-[#16C7E8] hover:underline"
              >
                Reset Defaults
              </button>
            </div>

            {/* Slider 1: Staff Count */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={staffInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Sanitation &amp; Ground Workers
                </label>
                <span className="font-mono text-sm font-bold text-[#16C7E8]">
                  {staffCount} Workers
                </span>
              </div>
              <input
                id={staffInputId}
                type="range"
                min="1"
                max="25"
                step="1"
                value={staffCount}
                onChange={(e) => setStaffCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#16C7E8]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>1 Worker</span>
                <span>25 Workers</span>
              </div>
            </div>

            {/* Slider 2: Monthly Labor Cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={laborCostInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Avg. Monthly Cost per Worker (Salary + Benefits)
                </label>
                <span className="font-mono text-sm font-bold text-[#16C7E8]">
                  ${monthlyLaborCost.toLocaleString()} / mo
                </span>
              </div>
              <input
                id={laborCostInputId}
                type="range"
                min="1000"
                max="6000"
                step="100"
                value={monthlyLaborCost}
                onChange={(e) => setMonthlyLaborCost(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#16C7E8]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>$1,000 / mo</span>
                <span>$6,000 / mo</span>
              </div>
            </div>

            {/* Slider 3: Target Robotic Coverage % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={coverageInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Robotic Automation Coverage %
                </label>
                <span className="font-mono text-sm font-bold text-[#16C7E8]">
                  {roboticCoverage}%
                </span>
              </div>
              <input
                id={coverageInputId}
                type="range"
                min="20"
                max="85"
                step="5"
                value={roboticCoverage}
                onChange={(e) => setRoboticCoverage(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#16C7E8]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>20% (Assisted)</span>
                <span>85% (High Autonomy)</span>
              </div>
            </div>

            {/* Slider 4: Initial System Capex Investment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={capexInputId}
                  className="text-xs font-mono uppercase text-slate-300"
                >
                  Estimated Robotic System Investment
                </label>
                <span className="font-mono text-sm font-bold text-[#16C7E8]">
                  ${capexInvestment.toLocaleString()}
                </span>
              </div>
              <input
                id={capexInputId}
                type="range"
                min="25000"
                max="150000"
                step="5000"
                value={capexInvestment}
                onChange={(e) => setCapexInvestment(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#16C7E8]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>$25,000 (Pilot)</span>
                <span>$150,000 (Fleet)</span>
              </div>
            </div>

            {/* Calculation Note */}
            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed font-mono flex items-center gap-1.5">
              <Info size={13} className="shrink-0 text-slate-400" />
              <span>Includes estimated 12% annual cloud telematics &amp; maintenance allocation.</span>
            </div>
          </div>

          {/* Right Column: Computed Outputs & ROI Cards */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Big Impact KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payback Period */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-emerald-400">
                    Payback Duration
                  </span>
                  <Clock size={16} className="text-emerald-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                  {paybackMonths}{" "}
                  <span className="text-lg text-emerald-400 font-semibold">Months</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Full capital cost amortization
                </div>
              </div>

              {/* 3-Year Projected Net ROI */}
              <div className="rounded-xl border border-[#16C7E8]/30 bg-blue-950/20 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-[#16C7E8]">
                    3-Year Net Return
                  </span>
                  <TrendingUp size={16} className="text-[#16C7E8]" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                  +{threeYearRoiPercent}%
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Net savings after full capex
                </div>
              </div>
            </div>

            {/* Financial Breakdown Table Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                Projected Financial Returns Breakdown
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Monthly Manual Labor Cost Baseline</span>
                  <span className="text-slate-200">${totalMonthlyLaborSpend.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Gross Monthly Labor Savings ({roboticCoverage}%)</span>
                  <span className="text-white font-bold">${monthlyLaborSavings.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Est. Monthly Fleet Opex &amp; Cloud (12%)</span>
                  <span className="text-slate-500">-${monthlyOpex.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-emerald-400 font-bold">Net Monthly Operational Savings</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ${netMonthlySavings.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                  <span className="text-emerald-400 font-bold">Net Annual Cash Savings</span>
                  <span className="text-emerald-400 font-black text-base">
                    ${annualNetSavings.toLocaleString()} / yr
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300">3-Year Cumulative Net Profit</span>
                  <span className="text-white font-black text-base">
                    ${threeYearNetReturn.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Illustrative Disclaimer Box */}
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-amber-300">Illustrative Engineering Estimate:</strong> The
                above financial figures are model simulations based on generalized commercial facility
                averages. Actual ROI, equipment lifecycle, and staff reallocation require site-specific
                feasibility surveys conducted by INDUS engineers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
