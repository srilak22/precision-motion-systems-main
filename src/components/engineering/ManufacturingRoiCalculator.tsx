import React, { useState, useMemo } from "react";
import { Calculator, ArrowRight, ShieldCheck, HelpCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

// Deterministic currency formatter to guarantee identical SSR and client hydration
const formatCurrency = (val: number): string => {
  if (isNaN(val) || !isFinite(val)) return "$0";
  return "$" + Math.round(val).toLocaleString("en-US");
};

export function ManufacturingRoiCalculator() {
  const { openModal } = useModals();

  // Facility Operational Parameters (Interactive State)
  const [operators, setOperators] = useState(3);
  const [shifts, setShifts] = useState(2);
  const [hourlyWage, setHourlyWage] = useState(36);
  const [machineCount, setMachineCount] = useState(2);
  const [scrapRate, setScrapRate] = useState(3.5);
  const [scrapReductionPercent, setScrapReductionPercent] = useState(70);
  const [annualMaintenanceRate, setAnnualMaintenanceRate] = useState(5); // 5% of CapEx

  // Base CapEx ($110,000 turnkey base + $25,000 per machine station)
  const autoCapex = useMemo(() => 110000 + machineCount * 25000, [machineCount]);
  const [customCapexOverride, setCustomCapexOverride] = useState<number | null>(null);

  const effectiveCapex = customCapexOverride !== null ? customCapexOverride : autoCapex;

  // Reset to default assumptions
  const handleReset = () => {
    setOperators(3);
    setShifts(2);
    setHourlyWage(36);
    setMachineCount(2);
    setScrapRate(3.5);
    setScrapReductionPercent(70);
    setAnnualMaintenanceRate(5);
    setCustomCapexOverride(null);
  };

  // Financial and Operational Calculation Model
  const calculations = useMemo(() => {
    // 2,080 working hours per year per operator (standard 52 weeks * 40 hours)
    const annualHoursPerOperator = 2080;
    const totalCurrentLaborCost = operators * shifts * annualHoursPerOperator * hourlyWage;

    // Automation typically redeploys 75% of manual load/tending labor
    const laborRedeploymentRate = 0.75;
    const annualLaborSavings = totalCurrentLaborCost * laborRedeploymentRate;

    // Baseline material throughput estimated at $45,000 per automated workstation/machine
    const annualMaterialBaseline = machineCount * 45000;
    const effectiveScrapReductionFactor = (scrapRate / 100) * (scrapReductionPercent / 100);
    const annualScrapSavings = annualMaterialBaseline * effectiveScrapReductionFactor;

    // Gross annual operational savings
    const grossAnnualSavings = annualLaborSavings + annualScrapSavings;

    // Estimated annual routine maintenance and consumables
    const annualMaintenanceCost = effectiveCapex * (annualMaintenanceRate / 100);

    // Net annual savings after recurring maintenance
    const netAnnualSavings = grossAnnualSavings - annualMaintenanceCost;

    // Payback period in months
    let paybackMonths = 0;
    let isValidPayback = false;

    if (netAnnualSavings > 0) {
      paybackMonths = (effectiveCapex / netAnnualSavings) * 12;
      isValidPayback = true;
    }

    // 3-Year & 5-Year Net Economic Value generated
    const threeYearNetValue = netAnnualSavings * 3 - effectiveCapex;
    const threeYearRoiPercent =
      effectiveCapex > 0 ? Math.round(((netAnnualSavings * 3 - effectiveCapex) / effectiveCapex) * 100) : 0;

    return {
      totalCurrentLaborCost,
      annualLaborSavings,
      annualScrapSavings,
      grossAnnualSavings,
      annualMaintenanceCost,
      netAnnualSavings,
      systemCapex: effectiveCapex,
      paybackMonths: isValidPayback ? paybackMonths.toFixed(1) : "N/A",
      isValidPayback,
      threeYearNetValue,
      threeYearRoiPercent,
    };
  }, [
    operators,
    shifts,
    hourlyWage,
    machineCount,
    scrapRate,
    scrapReductionPercent,
    effectiveCapex,
    annualMaintenanceRate,
  ]);

  const handleCtaClick = () => {
    trackDigitalPresence(
      "roi_calculator_cta",
      "Manufacturing ROI Calculator",
      `Payback: ${calculations.paybackMonths}m | CapEx: ${formatCurrency(calculations.systemCapex)}`
    );
    trackClarityEvent("roi_calculator_inquiry");
    openModal("quote");
  };

  return (
    <section
      id="roi-calculator"
      className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-[#0F172A]"
      aria-label="Robotics Automation ROI and Payback Calculator"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0284C7]/30 bg-[#E0F2FE]/70 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#0284C7] mb-3">
              <Calculator size={13} />
              <span>Industrial Capital Allocation Modeling</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold uppercase tracking-tight text-[#0F172A] leading-tight">
              Robotics Automation ROI &amp; Payback Calculator
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#475467] leading-relaxed">
              Quantify the economic return of deploying precision robotic workcells, zero-backlash reducers, and automated machine tending. Adjust facility parameters below to project cash payback horizon and net 3-year value.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="self-start md:self-end inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1] bg-white px-3 py-1.5 rounded-lg shadow-2xs hover:bg-[#F1F5F9] transition-all cursor-pointer"
            title="Reset to default engineering assumptions"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* INTERACTIVE TWO-COLUMN DESKTOP GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FACILITY OPERATIONAL PARAMETERS (7 COLUMNS) */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-[#0F172A]">
                  Facility Operational Parameters
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Adjust labor, shift, machine, and scrap metrics
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-md">
                Live Dynamic Model
              </span>
            </div>

            {/* Parameter 1: Operators Dedicated per Shift */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label htmlFor="operators-range" className="text-[#334155] font-semibold">
                  Dedicated Process Operators (Per Shift):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={operators}
                    onChange={(e) => setOperators(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                    className="w-16 h-8 text-center font-mono font-bold text-xs rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#155EEF] focus:outline-none"
                    aria-label="Operators dedicated per shift"
                  />
                  <span className="text-xs font-medium text-[#64748B]">Staff</span>
                </div>
              </div>
              <input
                id="operators-range"
                type="range"
                min="1"
                max="10"
                value={operators}
                onChange={(e) => setOperators(Number(e.target.value))}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#155EEF]"
              />
              <div className="flex justify-between text-[10.5px] text-[#64748B] font-mono mt-1">
                <span>1 Operator</span>
                <span>5 Operators</span>
                <span>10 Operators</span>
              </div>
            </div>

            {/* Parameter 2: Operating Shifts per Day */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label htmlFor="shifts-range" className="text-[#334155] font-semibold">
                  Facility Operating Shifts per Day:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={shifts}
                    onChange={(e) => setShifts(Math.max(1, Math.min(3, Number(e.target.value) || 1)))}
                    className="w-16 h-8 text-center font-mono font-bold text-xs rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#155EEF] focus:outline-none"
                    aria-label="Operating shifts per day"
                  />
                  <span className="text-xs font-medium text-[#64748B]">Shifts/Day</span>
                </div>
              </div>
              <input
                id="shifts-range"
                type="range"
                min="1"
                max="3"
                value={shifts}
                onChange={(e) => setShifts(Number(e.target.value))}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#155EEF]"
              />
              <div className="flex justify-between text-[10.5px] text-[#64748B] font-mono mt-1">
                <span>1 Shift (8h/day)</span>
                <span>2 Shifts (16h/day)</span>
                <span>3 Shifts (24/7 Continuous)</span>
              </div>
            </div>

            {/* Parameter 3: Fully Loaded Hourly Wage */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label htmlFor="wage-range" className="text-[#334155] font-semibold">
                  Fully Loaded Hourly Labor Cost ($/hour):
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#64748B]">$</span>
                  <input
                    type="number"
                    min="18"
                    max="95"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Math.max(15, Math.min(120, Number(e.target.value) || 18)))}
                    className="w-20 h-8 text-center font-mono font-bold text-xs rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#155EEF] focus:outline-none"
                    aria-label="Fully loaded hourly labor cost"
                  />
                  <span className="text-xs font-medium text-[#64748B]">/hr</span>
                </div>
              </div>
              <input
                id="wage-range"
                type="range"
                min="18"
                max="85"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#155EEF]"
              />
              <div className="flex justify-between text-[10.5px] text-[#64748B] font-mono mt-1">
                <span>$18/hr</span>
                <span>$45/hr</span>
                <span>$85/hr</span>
              </div>
            </div>

            {/* Parameter 4: Workstations / Machines Automated */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label htmlFor="machines-range" className="text-[#334155] font-semibold">
                  Workstations / CNC Machines to Automate:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={machineCount}
                    onChange={(e) => {
                      const count = Math.max(1, Math.min(8, Number(e.target.value) || 1));
                      setMachineCount(count);
                      if (customCapexOverride !== null) {
                        setCustomCapexOverride(110000 + count * 25000);
                      }
                    }}
                    className="w-16 h-8 text-center font-mono font-bold text-xs rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#155EEF] focus:outline-none"
                    aria-label="Workstations to automate"
                  />
                  <span className="text-xs font-medium text-[#64748B]">Units</span>
                </div>
              </div>
              <input
                id="machines-range"
                type="range"
                min="1"
                max="8"
                value={machineCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setMachineCount(count);
                  if (customCapexOverride !== null) {
                    setCustomCapexOverride(110000 + count * 25000);
                  }
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#155EEF]"
              />
              <div className="flex justify-between text-[10.5px] text-[#64748B] font-mono mt-1">
                <span>1 Machine</span>
                <span>4 Workstations</span>
                <span>8 Line Stations</span>
              </div>
            </div>

            {/* Parameter 5: Baseline Scrap / Quality Rework Rate */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <label htmlFor="scrap-range" className="text-[#334155] font-semibold">
                  Baseline Process Scrap / Rework Rate (%):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    max="15.0"
                    step="0.1"
                    value={scrapRate}
                    onChange={(e) => setScrapRate(Math.max(0.1, Math.min(20, Number(e.target.value) || 0.5)))}
                    className="w-20 h-8 text-center font-mono font-bold text-xs rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#155EEF] focus:outline-none"
                    aria-label="Baseline scrap rate percentage"
                  />
                  <span className="text-xs font-medium text-[#64748B]">%</span>
                </div>
              </div>
              <input
                id="scrap-range"
                type="range"
                min="0.5"
                max="12.0"
                step="0.5"
                value={scrapRate}
                onChange={(e) => setScrapRate(Number(e.target.value))}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#155EEF]"
              />
              <div className="flex justify-between text-[10.5px] text-[#64748B] font-mono mt-1">
                <span>0.5% (High Precision)</span>
                <span>5.0% (Average)</span>
                <span>12.0% (Manual Defect Rate)</span>
              </div>
            </div>

            {/* Parameter 6: Estimated Automation CapEx Investment */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <div className="flex justify-between items-center text-xs mb-2">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="capex-input" className="text-[#334155] font-semibold">
                    Estimated Automation CapEx Budget:
                  </label>
                  <span
                    className="text-[#94A3B8] cursor-help"
                    title="Includes turnkey robot arms/actuators, end-effectors, safety interlocks, and commissioning."
                  >
                    <HelpCircle size={13} />
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#64748B]">$</span>
                  <input
                    id="capex-input"
                    type="number"
                    step="5000"
                    min="50000"
                    max="600000"
                    value={effectiveCapex}
                    onChange={(e) => setCustomCapexOverride(Number(e.target.value))}
                    className="w-28 h-8 text-right px-2 font-mono font-bold text-xs rounded border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#155EEF] focus:outline-none"
                    aria-label="Estimated automation CapEx budget"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Auto-calculated baseline: $110,000 core cell + $25,000 per fixture/machine tooling.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: PROJECTED FINANCIAL RESULTS (5 COLUMNS) */}
          <div className="lg:col-span-5 bg-white border-2 border-[#155EEF]/30 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0284C7]/30 bg-[#E0F2FE] px-3 py-0.5 text-[10.5px] font-mono font-bold text-[#0284C7]">
                <ShieldCheck size={12} />
                Financial Impact Model
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                Preliminary Estimate
              </span>
            </div>

            {/* Highlight Metric Card: Payback Period */}
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 mb-6">
              <span className="text-xs font-mono text-[#0284C7] font-bold uppercase tracking-wider block">
                Estimated Capital Payback Horizon
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-display font-black text-[#0F172A] tracking-tight">
                  {calculations.paybackMonths}
                </span>
                <span className="text-2xl font-display uppercase text-[#475467] font-bold">
                  {calculations.isValidPayback ? "Months" : ""}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-2">
                Projected cash recovery for {operators} operators over {shifts} shift(s) at {machineCount} automated workstation(s).
              </p>
            </div>

            {/* Detailed Financial Breakdown Metric Cards */}
            <div className="space-y-3 font-mono text-xs sm:text-[13px]">
              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Annual Labor Cost Avoidance:</span>
                <strong className="text-[#0F172A]">
                  {formatCurrency(calculations.annualLaborSavings)}
                </strong>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Annual Scrap &amp; Rework Reduction:</span>
                <strong className="text-[#0F172A]">
                  {formatCurrency(calculations.annualScrapSavings)}
                </strong>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Estimated Annual Routine Maintenance:</span>
                <strong className="text-[#EF4444]">
                  - {formatCurrency(calculations.annualMaintenanceCost)}
                </strong>
              </div>

              {/* Net Annual Cash Flow Container */}
              <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]">
                <span className="text-[#1E40AF] font-bold">Net Annual Cash Flow Savings:</span>
                <strong className="text-[#155EEF] text-base font-bold">
                  {formatCurrency(calculations.netAnnualSavings)} / yr
                </strong>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Estimated Capital Investment:</span>
                <strong className="text-[#0F172A]">
                  {formatCurrency(calculations.systemCapex)}
                </strong>
              </div>

              <div className="flex justify-between items-center py-2 pt-3 border-t border-[#E2E8F0]">
                <div className="flex flex-col">
                  <span className="text-[#0F172A] font-bold">Net 3-Year Value Generated:</span>
                  <span className="text-[10px] text-[#0284C7] font-semibold">
                    ROI: +{calculations.threeYearRoiPercent}% over initial CapEx
                  </span>
                </div>
                <strong className="text-[#155EEF] text-xl font-bold">
                  {formatCurrency(calculations.threeYearNetValue)}
                </strong>
              </div>
            </div>

            {/* Methodology & Limitations Note */}
            <div className="mt-6 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-[11px] text-[#64748B] space-y-1 font-mono">
              <span className="text-[#0284C7] font-bold uppercase block">
                Methodology &amp; Engineering Assumptions:
              </span>
              <p className="leading-relaxed">
                Calculations assume 2,080 annual operating hours per operator shift, 75% labor redeployment, and {scrapReductionPercent}% defect elimination under precision robotic takt cycles.
              </p>
              <p className="text-[#B45309] font-medium leading-relaxed">
                * Note: Preliminary engineering estimate for capital budgeting. Not a formal contract or guaranteed return. Final ROI depends on audited part cycle times, tooling fixtures, and plant safety gates.
              </p>
            </div>

            {/* Primary Action Button: Request an Engineering Assessment */}
            <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-2.5">
              <Button
                type="button"
                onClick={handleCtaClick}
                className="w-full h-12 bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request an Engineering Assessment</span>
                <ArrowRight size={14} />
              </Button>
              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#64748B]">
                <ShieldCheck size={13} className="text-[#0284C7]" />
                <span>Carries your facility parameters directly into sizing review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
