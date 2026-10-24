import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  RotateCw,
  Gauge,
  Thermometer,
  Wifi,
  Radio,
  CheckCircle2,
  ArrowRight,
  Download,
  Wrench,
  MessageSquare,
  Sparkles,
  Plug,
  Sliders,
  Scale,
  Compass,
  Check,
  SlidersHorizontal,
  Workflow,
  Factory,
  AlertTriangle,
  HelpCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { getAllIntelligentActuators } from "@/data/intelligentActuatorsData";
import { ApplicationFinderWizard } from "@/components/forms/ApplicationFinderWizard";
import { ActuatorStudioWorkspace } from "@/components/engineering/ActuatorStudioWorkspace";
import { ActuatorAIActions } from "@/services/roboticsGuide/actuatorBridge";

export const Route = createFileRoute("/technology/intelligent-actuators")({
  head: () =>
    buildSeoMeta({
      title: "Intelligent Actuator Studio: Product Selection, Telemetry & Integration | INDUS",
      description:
        "Unified engineering studio for all-in-one mechatronic actuators integrating frameless BLDC servos, zero-backlash gearing, dual absolute encoders, DSP vector drives, and real-time fieldbuses.",
      path: "/technology/intelligent-actuators",
      ogType: "article",
    }),
  component: IntelligentActuatorStudioPage,
});

export function IntelligentActuatorStudioPage() {
  const { openModal } = useModals();
  const actuators = getAllIntelligentActuators();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* =========================================================================
          SECTION 1: HERO (PREMIUM WHITE INDUSTRIAL AESTHETIC)
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#667085]">
            <Link to="/technology" className="hover:text-[#155EEF] transition-colors">
              ENGINEERING &amp; TECHNOLOGY
            </Link>
            <span className="text-[#D0D5DD]">/</span>
            <span className="text-[#155EEF] font-bold">INTELLIGENT ACTUATOR STUDIO</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B2CCFF] bg-[#EFF6FF] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
                <Cpu size={14} />
                <span>Mechatronic Convergence Platform · Phase 5 Studio</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#172033] leading-[1.05]">
                Intelligent Actuator Studio
              </h1>

              <p className="mt-4 text-base sm:text-xl text-[#667085] leading-relaxed max-w-2xl">
                The engineering convergence of high-density electromagnetic actuation, dual closed-loop optical feedback, embedded DSP drive electronics, and deterministic industrial fieldbuses in a sealed IP65 modular joint.
              </p>

              {/* Verified Headline Specifications */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Integration</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">4-in-1 Joint</strong>
                  <span className="text-[10px] text-[#667085]">Motor + Gear + Drive + Dual Sensor</span>
                </div>
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Feedback</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">Dual 19-Bit</strong>
                  <span className="text-[10px] text-[#667085]">Flange Compliance Compensation</span>
                </div>
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Fieldbus</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">EtherCAT CoE</strong>
                  <span className="text-[10px] text-[#667085]">&lt; 1 µs Distributed Clocks</span>
                </div>
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Supply Bus</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">48V DC SELV</strong>
                  <span className="text-[10px] text-[#667085]">Integrated Safe Torque Off (STO)</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-6 shadow-xs transition-all cursor-pointer"
                  onClick={() => {
                    document.getElementById("studio-workspace")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Activity size={14} className="mr-1.5" /> Launch Studio Workspace
                </Button>

                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-5 shadow-2xs cursor-pointer"
                  onClick={() => {
                    document.getElementById("application-finder")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Sliders size={14} className="mr-1.5 text-[#155EEF]" /> Configure My Actuator
                </Button>

                <Button
                  variant="ghost"
                  onClick={() =>
                    ActuatorAIActions.requestEngineeringAssistance(
                      "IND-IRA Series",
                      "Actuator Studio Consultation"
                    )
                  }
                  className="h-11 text-xs text-[#155EEF] hover:bg-[#EFF6FF] font-semibold cursor-pointer"
                >
                  <Sparkles size={14} className="mr-1.5" /> Ask Robotics AI Guide
                </Button>
              </div>
            </div>

            {/* Right Comparison Schematic Card */}
            <div className="lg:col-span-5 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 shadow-sm">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-2">
                Mechatronic Simplification Factor
              </span>
              <h3 className="text-lg font-bold text-[#172033]">
                Conventional Multi-Component Train vs. INDUS Joint
              </h3>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="rounded-xl border border-[#FDA29B] bg-[#FFFBFA] p-4">
                  <span className="font-bold text-[#B42318] uppercase tracking-wide block mb-1">
                    Conventional Actuation Setup (Legacy Architecture):
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#475467] leading-relaxed">
                    <li>Separate motor, external gearbox, and flex coupling with shaft runout.</li>
                    <li>Centralized drive cabinet requiring 15m+ power and encoder cables per axis.</li>
                    <li>Single motor-side encoder (blind to gearbox backlash and torsional compliance).</li>
                    <li>High assembly labor, multi-connector harness points, and cabinet heat generation.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-4">
                  <span className="font-bold text-[#027A48] uppercase tracking-wide block mb-1">
                    INDUS Intelligent Actuator (Mechatronic Architecture):
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#027A48] leading-relaxed">
                    <li>Motor, strain-wave gearing, DSP drive, and dual encoders in 1 sealed housing.</li>
                    <li>Direct 48V DC bus connection with daisy-chained M12 EtherCAT fieldbus.</li>
                    <li>Dual 19-bit absolute encoders actively measure true output flange orientation.</li>
                    <li>Eliminates separate motor drives, reducing robot arm harness bulk by 70%.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHAT AN INTELLIGENT ACTUATOR IS & SIGNAL/POWER FLOW
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-2">
              Mechatronic Principle of Operation
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
              How Motor, Transmission, Drive &amp; Sensors Work Together
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#667085] leading-relaxed">
              An intelligent actuator is not simply a motor with an attached sensor. It is an integrated mechatronic subsystem where electrical power conversion, deterministic digital control, mechanical torque multiplication, and closed-loop position sensing execute simultaneously inside an IP65 sealed enclosure.
            </p>
          </div>

          {/* Interactive Signal Flow Diagram */}
          <div className="mb-14 rounded-2xl border border-[#B2CCFF] bg-[#F5F8FF] p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D1E0FF]">
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase text-[#155EEF] block">
                  Deterministic Control Loop
                </span>
                <h3 className="text-lg font-bold text-[#172033] mt-0.5">
                  Sub-Millisecond Closed-Loop Command &amp; Feedback Flow
                </h3>
              </div>
              <span className="hidden sm:inline-block text-xs font-mono text-[#155EEF] bg-white border border-[#B2CCFF] px-2.5 py-1 rounded-md font-semibold">
                EtherCAT CiA 402 CSP Mode (1 ms Cycle)
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-5 relative">
              {/* Step 1: Host Controller */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-2xs">
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3 font-mono font-bold text-xs">
                  01
                </div>
                <h4 className="font-bold text-[#172033] text-sm">PLC / IPC Master</h4>
                <p className="text-[11.5px] text-[#667085] mt-1.5 leading-relaxed">
                  Calculates coordinated multi-axis robot kinematics and sends cyclic target positions via EtherCAT CoE.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#155EEF]">TwinCAT / CODESYS</div>
              </div>

              {/* Step 2: DSP Servo Drive */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-2xs">
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3 font-mono font-bold text-xs">
                  02
                </div>
                <h4 className="font-bold text-[#172033] text-sm">Embedded DSP Drive</h4>
                <p className="text-[11.5px] text-[#667085] mt-1.5 leading-relaxed">
                  Executes 20 kHz current FOC, 5 kHz velocity, and 1 kHz position cascaded loops with polynomial trajectory spline.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#155EEF]">Space-Vector PWM</div>
              </div>

              {/* Step 3: Brushless Servomotor */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-2xs">
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3 font-mono font-bold text-xs">
                  03
                </div>
                <h4 className="font-bold text-[#172033] text-sm">Frameless PM Motor</h4>
                <p className="text-[11.5px] text-[#667085] mt-1.5 leading-relaxed">
                  High-permeability concentrated stator windings and neodymium rotor generate smooth, low-cogging torque.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#155EEF]">48V DC Nominal Bus</div>
              </div>

              {/* Step 4: Transmission */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-2xs">
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3 font-mono font-bold text-xs">
                  04
                </div>
                <h4 className="font-bold text-[#172033] text-sm">Precision Gearhead</h4>
                <p className="text-[11.5px] text-[#667085] mt-1.5 leading-relaxed">
                  Zero-backlash strain-wave gearhead or C5 ground ball screw multiplies torque with torsional backlash &lt;1.0 arcmin.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#155EEF]">50:1 to 160:1 Ratios</div>
              </div>

              {/* Step 5: Dual Feedback */}
              <div className="bg-white rounded-xl border border-[#E5EAF1] p-4 shadow-2xs">
                <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-3 font-mono font-bold text-xs">
                  05
                </div>
                <h4 className="font-bold text-[#172033] text-sm">Dual 19-Bit Feedback</h4>
                <p className="text-[11.5px] text-[#667085] mt-1.5 leading-relaxed">
                  Samples output flange position directly, measuring structural windup and closing the loop against deflection.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#16A34A] font-bold">±10 arcsec Accuracy</div>
              </div>
            </div>
          </div>

          {/* Available Actuator Configurations (Rotary & Linear) */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-1">
                  Verified Manufacturing Configurations
                </span>
                <h3 className="text-2xl font-bold text-[#172033]">
                  Available Intelligent Actuator Families
                </h3>
              </div>
              <span className="text-xs text-[#667085]">
                Strictly grounded in lab-verified models. No fictitious variants.
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {actuators.map((act) => (
                <div
                  key={act.id}
                  className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 sm:p-7 flex flex-col justify-between hover:border-[#155EEF] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1]">
                      <span className="rounded bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-mono font-bold text-[#155EEF]">
                        {act.categoryName}
                      </span>
                      <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                        <CheckCircle2 size={13} /> Verified Hardware
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-[#172033] mt-3">
                      {act.name}
                    </h4>
                    <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                      {act.headline}
                    </p>

                    {/* Headline Specs 2x2 */}
                    <div className="my-5 grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-[#E5EAF1]">
                      <div>
                        <span className="text-[10.5px] text-[#667085] font-mono block">
                          {act.headlineSpecs.ratedTorqueOrForce.label}
                        </span>
                        <strong className="text-sm font-bold text-[#172033] block mt-0.5">
                          {act.headlineSpecs.ratedTorqueOrForce.value} {act.headlineSpecs.ratedTorqueOrForce.unit}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-[#667085] font-mono block">
                          {act.headlineSpecs.outputSpeed.label}
                        </span>
                        <strong className="text-sm font-bold text-[#172033] block mt-0.5">
                          {act.headlineSpecs.outputSpeed.value} {act.headlineSpecs.outputSpeed.unit}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-[#667085] font-mono block">
                          {act.headlineSpecs.positionFeedback.label}
                        </span>
                        <strong className="text-xs font-bold text-[#172033] block mt-0.5">
                          {act.headlineSpecs.positionFeedback.value}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10.5px] text-[#667085] font-mono block">
                          {act.headlineSpecs.integration.label}
                        </span>
                        <strong className="text-xs font-bold text-[#172033] block mt-0.5">
                          {act.headlineSpecs.integration.value}
                        </strong>
                      </div>
                    </div>

                    {/* Model Variants */}
                    <div className="space-y-1.5 text-xs">
                      <span className="font-semibold text-[#475467] block">Standard Production Models:</span>
                      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                        {act.modelVariants.map((v) => (
                          <span
                            key={v.modelCode}
                            className="rounded bg-white border border-[#E5EAF1] px-2 py-0.5 text-[#172033]"
                          >
                            {v.modelCode} ({v.nominalTorqueOrForce})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5EAF1] flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={`/products/${act.categorySlug}/${act.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155EEF] hover:text-[#1047BF]"
                    >
                      <span>Full Product Dossier</span>
                      <ArrowRight size={13} />
                    </Link>

                    <Button
                      size="sm"
                      className="h-8 rounded bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs"
                      onClick={() =>
                        openModal("quote", {
                          productName: act.name,
                          categoryName: act.categoryName,
                        })
                      }
                    >
                      Request Quote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Where Intelligent Actuation is Used (Practical Applications) */}
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-1">
                Industrial Deployment Showcase
              </span>
              <h3 className="text-2xl font-bold text-[#172033]">
                Where Intelligent Actuators Are Used in Real Production
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Automotive &amp; Cobots</span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">Cobot Joint Articulation (J1–J6)</h4>
                <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                  Eliminates external motor drives and reduces internal hollow arm wiring harness by 70%, with sub-arcminute repeatability.
                </p>
                <div className="mt-3 pt-2 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Target: IND-IRA-070 / 090
                </div>
              </div>

              <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Machining &amp; Tooling</span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">CNC Indexing Tables &amp; Turrets</h4>
                <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                  Direct strain-wave torque transmission achieves 90° tool station changes in &lt;180 ms with zero mechanical backlash.
                </p>
                <div className="mt-3 pt-2 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Target: IND-IRA-115 / 142
                </div>
              </div>

              <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">EV Battery Manufacturing</span>
                <h4 className="text-sm font-bold text-[#172033] mt-1">Battery Cell Pressing &amp; Stacking</h4>
                <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                  Electric servo linear slide with programmable force push-mode guarantees uniform 1200 N dwell without pneumatic leaks.
                </p>
                <div className="mt-3 pt-2 border-t border-[#E5EAF1] text-[11px] font-mono text-[#155EEF]">
                  Target: IND-ILA-080 Slide
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WHAT ENGINEERING PARAMETERS MATTER WHEN SELECTING A MODEL
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-2">
              Motion Sizing Criteria
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              What Engineering Parameters Matter When Selecting an Actuator
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed">
              Selecting an intelligent joint requires analyzing dynamic duty cycles rather than relying solely on catalog headline ratings.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Criterion 01</span>
              <h4 className="text-sm font-bold text-[#172033] mt-1">Continuous (S1) vs Peak Torque/Force</h4>
              <p className="text-[#667085] mt-2 leading-relaxed">
                The continuous rating defines what the actuator can deliver 100% of the time in thermal equilibrium. Peak torque is permitted only for acceleration/deceleration transients (≤1.0 second, ≤10% duty factor) to avoid motor burnout.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Criterion 02</span>
              <h4 className="text-sm font-bold text-[#172033] mt-1">Reflected Load Inertia Ratio</h4>
              <p className="text-[#667085] mt-2 leading-relaxed">
                Keep the ratio of reflected load inertia to motor rotor inertia (J_load / J_motor) below 5:1 for high-dynamic robotics, and below 10:1 for general industrial indexing. Higher ratios induce servo hunting and tracking error.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Criterion 03</span>
              <h4 className="text-sm font-bold text-[#172033] mt-1">Thermal Equilibrium &amp; Ambient Derating</h4>
              <p className="text-[#667085] mt-2 leading-relaxed">
                Standard catalog ratings are benchmarked at 25°C ambient. If operating inside a sealed machinery enclosure above 40°C, the motor continuous torque envelope must be derated by 1.2% per °C rise according to IEC 60034-1.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Criterion 04</span>
              <h4 className="text-sm font-bold text-[#172033] mt-1">Repeatability vs. Absolute Accuracy</h4>
              <p className="text-[#667085] mt-2 leading-relaxed">
                Repeatability (±10 arcsec) defines the consistency of returning to the same position from the same direction. Absolute accuracy accounts for kinematic link compliance and thermal expansion across the complete operating envelope.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Criterion 05</span>
              <h4 className="text-sm font-bold text-[#172033] mt-1">Allowable Radial (Fr) &amp; Axial (Fa) Bearing Loads</h4>
              <p className="text-[#667085] mt-2 leading-relaxed">
                Overhung payloads create bending moments on the actuator output bearing. Ensure dynamic moment loads remain within catalog envelopes (e.g. Fr = 3200 N for size 090) to guarantee 20,000-hour L10h bearing life.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Criterion 06</span>
              <h4 className="text-sm font-bold text-[#172033] mt-1">DC Bus Voltage &amp; Regenerative Absorption</h4>
              <p className="text-[#667085] mt-2 leading-relaxed">
                During rapid deceleration, motor kinetic energy is converted back into electrical power, raising the 48V DC bus voltage. Verify that external power supplies have sufficient capacitance or shunt brake resistors to absorb this energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: EMBEDDED ACTUATOR STUDIO WORKSPACE (ANCHOR: #studio-workspace)
         ========================================================================= */}
      <section id="studio-workspace" className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-1">
              Engineering Workspace
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
              Interactive Model Comparator, Telemetry &amp; Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
              Compare verified model records side-by-side, inspect simulated DSP drive vector waveforms, and evaluate diagnostic fault rules.
            </p>
          </div>

          {/* Unified Actuator Studio Workspace */}
          <ActuatorStudioWorkspace initialTab="comparison" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: APPLICATION FINDER SIZING WIZARD (ANCHOR: #application-finder)
         ========================================================================= */}
      <section id="application-finder" className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="rounded bg-[#EFF6FF] px-3 py-1 font-mono text-xs font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
              Guided Kinematic Sizing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-2">
              Size Your Actuator for Application Duty
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
              Transfer parameters from the Studio into the guided wizard below. Enter your payload, cycle time, stroke, and fieldbus to receive a verified engineering recommendation.
            </p>
          </div>

          <ApplicationFinderWizard
            initialCategory="rotary-actuator"
            initialProduct="Intelligent Rotary Actuator"
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CONSULTATION & RFQ PATHWAY
         ========================================================================= */}
      <section className="bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <div className="size-12 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center mx-auto mb-4 border border-[#B2CCFF]">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033]">
            Speak with an INDUS Motion Engineer
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#667085] max-w-xl mx-auto leading-relaxed">
            Need 3D CAD STEP files with verified mass moments of inertia, custom flange bolt circles, or multi-joint kinematics analysis for a robotic manipulator?
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-6"
              onClick={() => openModal("engineer", { categoryName: "Intelligent Actuators" })}
            >
              <Wrench size={14} className="mr-1.5" /> Request Engineering Consultation
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-5"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-[#16A34A]" /> Instant WhatsApp Desk
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
