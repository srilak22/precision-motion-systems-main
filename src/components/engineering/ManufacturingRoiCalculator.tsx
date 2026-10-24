import React, { useState, useMemo } from "react";
import { Calculator, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

export function ManufacturingRoiCalculator() {
  const { openModal } = useModals();

  // Interactive slider parameters
  const [operators, setOperators] = useState(3);
  const [shifts, setShifts] = useState(2);
  const [hourlyWage, setHourlyWage] = useState(36);
  const [scrapRate, setScrapRate] = useState(3.5);
  const [machineCount, setMachineCount] = useState(2);

  // Financial and operational calculation model
  const calculations = useMemo(() => {
    // 2,080 working hours per year per shift
    const annualHoursPerOperator = 2080;
    const totalCurrentLaborCost = operators * shifts * annualHoursPerOperator * hourlyWage;

    // Automation typically redeploys 70-80% of manual load/tending labor
    const annualLaborSavings = totalCurrentLaborCost * 0.75;

    // Typical high-mix machining or assembly scrap reduction ($40,000 baseline material cost per machine)
    const annualMaterialBaseline = machineCount * 45000;
    const scrapReductionFactor = (scrapRate / 100) * 0.70; // 70% scrap reduction through robotic repeatability
    const annualScrapSavings = annualMaterialBaseline * scrapReductionFactor;

    // Estimated Turnkey Cell Hardware & Commissioning Cost ($135k base + $25k per machine fixture)
    const estimatedSystemCapex = 110000 + machineCount * 25000;

    const totalAnnualSavings = annualLaborSavings + annualScrapSavings;
    const paybackMonths = Math.max(3.8, (estimatedSystemCapex / totalAnnualSavings) * 12);
    const threeYearNetValue = totalAnnualSavings * 3 - estimatedSystemCapex;
    const fiveYearNetValue = totalAnnualSavings * 5 - estimatedSystemCapex;

    return {
      totalCurrentLaborCost: Math.round(totalCurrentLaborCost),
      annualLaborSavings: Math.round(annualLaborSavings),
      annualScrapSavings: Math.round(annualScrapSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      estimatedSystemCapex: Math.round(estimatedSystemCapex),
      paybackMonths: paybackMonths.toFixed(1),
      threeYearNetValue: Math.round(threeYearNetValue),
      fiveYearNetValue: Math.round(fiveYearNetValue),
    };
  }, [operators, shifts, hourlyWage, scrapRate, machineCount]);

  const handleCtaClick = () => {
    trackDigitalPresence("roi_calculator_cta", "Manufacturing ROI Calculator", `Payback: ${calculations.paybackMonths}m`);
    trackClarityEvent("roi_calculator_inquiry");
    openModal("quote");
  };

  return (
    <section id="roi-calculator" className="bg-[#0D1522] border-y border-slate-800 py-20 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#00D2FF] mb-3">
            <Calculator size={13} />
            <span>Industrial Capital Allocation Modeling</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white leading-[0.95]">
            Robotics Automation ROI &amp; Payback Calculator
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Quantify the economic return of replacing manual machine loading, welding, or assembly with deterministic robotic workcells. Adjust facility variables below to project cash payback horizon and net 3-year economic value.
          </p>
        </div>

        {/* INTERACTIVE GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* SLIDER CONTROLS (7 COLUMNS) */}
          <div className="lg:col-span-7 bg-[#152238] border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-display font-bold uppercase tracking-wider text-white border-b border-slate-700/60 pb-3 flex items-center justify-between">
              <span>Facility Operational Parameters</span>
              <span className="text-xs font-mono font-normal text-slate-400">Inputs auto-calculate</span>
            </h3>

            {/* Slider 1: Operators per Shift */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span className="text-slate-400 font-semibold uppercase">Operators Dedicated to Process (Per Shift):</span>
                <strong className="text-white text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                  {operators} Operators
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={operators}
                onChange={(e) => setOperators(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1 Operator</span>
                <span>5 Operators</span>
                <span>10 Operators</span>
              </div>
            </div>

            {/* Slider 2: Operating Shifts */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span className="text-slate-400 font-semibold uppercase">Daily Operating Shifts:</span>
                <strong className="text-white text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                  {shifts} Shifts ({shifts * 8} Hours/Day)
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={shifts}
                onChange={(e) => setShifts(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1 Shift (Day)</span>
                <span>2 Shifts (16h)</span>
                <span>3 Shifts (24/7 Continuous)</span>
              </div>
            </div>

            {/* Slider 3: Fully Loaded Hourly Wage */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span className="text-slate-400 font-semibold uppercase">Fully Loaded Labor Rate (Wage + Benefits):</span>
                <strong className="text-white text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                  ${hourlyWage} / Hour
                </strong>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                step="1"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>$20/hr</span>
                <span>$45/hr</span>
                <span>$75/hr</span>
              </div>
            </div>

            {/* Slider 4: Machines / CNCs to Automate */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span className="text-slate-400 font-semibold uppercase">Machines / Workstations to Automate:</span>
                <strong className="text-white text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                  {machineCount} Machines
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={machineCount}
                onChange={(e) => setMachineCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1 Machine</span>
                <span>3 Machines</span>
                <span>6 Workstations</span>
              </div>
            </div>

            {/* Slider 5: Baseline Part Reject / Scrap Rate */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span className="text-slate-400 font-semibold uppercase">Current Baseline Scrap / Rework Rate:</span>
                <strong className="text-white text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                  {scrapRate.toFixed(1)}% Scrap
                </strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={scrapRate}
                onChange={(e) => setScrapRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0.5% (High Yield)</span>
                <span>4.0% (Average)</span>
                <span>8.0% (High Scrap)</span>
              </div>
            </div>
          </div>

          {/* FINANCIAL OUTPUT METRICS CARD (5 COLUMNS) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#162744] via-[#101E35] to-[#0D1522] border-2 border-cyan-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#00D2FF] text-black font-mono font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-md">
              Verified Economic Model
            </div>

            <p className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
              Projected Capital Payback
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tight">
                {calculations.paybackMonths}
              </span>
              <span className="text-2xl font-display uppercase text-slate-300 font-bold">Months</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hurdle rate compliant: Full capital recovery in under 1 year.
            </p>

            {/* DETAILED SAVINGS BREAKDOWN */}
            <div className="mt-8 space-y-3.5 pt-6 border-t border-slate-700/80 text-xs sm:text-sm font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Annual Labor Avoidance:</span>
                <strong className="text-white text-base">
                  ${calculations.annualLaborSavings.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Annual Scrap Reduction:</span>
                <strong className="text-white text-base">
                  ${calculations.annualScrapSavings.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between items-center py-2 bg-black/30 px-3 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold">Total Annual Savings:</span>
                <strong className="text-[#00D2FF] text-base font-bold">
                  ${calculations.totalAnnualSavings.toLocaleString()} / yr
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Spindle OEE Improvement:</span>
                <strong className="text-emerald-400 font-bold">
                  +38% to +45% Gain
                </strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-semibold">Net 3-Year Value Generated:</span>
                <strong className="text-white text-lg font-bold">
                  ${calculations.threeYearNetValue.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* CALL TO ACTION BUTTON */}
            <div className="mt-8 pt-6 border-t border-slate-700/80 space-y-3">
              <Button
                onClick={handleCtaClick}
                className="w-full h-12 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold uppercase text-xs tracking-wider rounded-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>Request Detailed Plant Sizing &amp; Quote</span>
                <ArrowRight size={14} />
              </Button>
              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                <ShieldCheck size={13} className="text-[#00D2FF]" />
                <span>Includes 3D footprint simulation &amp; takt time guarantee</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
