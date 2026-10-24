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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { IntelligentActuatorDashboard } from "@/components/engineering/IntelligentActuatorDashboard";
import { getAllIntelligentActuators } from "@/data/intelligentActuatorsData";
import { ApplicationFinderWizard } from "@/components/forms/ApplicationFinderWizard";

export const Route = createFileRoute("/technology/intelligent-actuators")({
  head: () =>
    buildSeoMeta({
      title: "Intelligent Actuators: Actuation, Feedback & Control Architecture | INDUS",
      description:
        "Technical analysis of all-in-one mechatronic actuators integrating frameless BLDC servos, dual absolute encoders, DSP vector drives, and EtherCAT fieldbus.",
      path: "/technology/intelligent-actuators",
      ogType: "article",
    }),
  component: IntelligentActuatorTechnologyPage,
});

export function IntelligentActuatorTechnologyPage() {
  const { openModal } = useModals();
  const actuators = getAllIntelligentActuators();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* =========================================================================
          SECTION 1: HERO (LIGHT PREMIUM INDUSTRIAL THEME)
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#667085]">
            <Link to="/technology" className="hover:text-[#155EEF] transition-colors">
              ENGINEERING &amp; TECHNOLOGY
            </Link>
            <span className="text-[#D0D5DD]">/</span>
            <span className="text-[#155EEF] font-bold">INTELLIGENT ACTUATORS</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B2CCFF] bg-[#EFF6FF] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
                <Cpu size={14} />
                <span>Mechatronic Convergence Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#172033] leading-[1.05]">
                Intelligent Actuator Architecture
              </h1>

              <p className="mt-4 text-base sm:text-xl text-[#667085] leading-relaxed max-w-2xl">
                The engineering relationship between high-density electromagnetic actuation, dual closed-loop feedback, embedded DSP drive electronics, and deterministic industrial fieldbuses.
              </p>

              {/* Verified Headline Stats */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Integration</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">4-in-1 Joint</strong>
                  <span className="text-[10px] text-[#667085]">Motor+Gear+Drive+Feedback</span>
                </div>
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Feedback</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">Dual 19-Bit</strong>
                  <span className="text-[10px] text-[#667085]">Zero Lost Motion BiSS-C</span>
                </div>
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Fieldbus</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">EtherCAT CoE</strong>
                  <span className="text-[10px] text-[#667085]">&lt; 1 µs Distributed Clock</span>
                </div>
                <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-3">
                  <span className="text-[10.5px] font-mono uppercase text-[#667085] block">Supply Bus</span>
                  <strong className="text-base font-bold text-[#172033] mt-0.5 block">48V DC</strong>
                  <span className="text-[10px] text-[#667085]">SELV Safe Operation</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-6 shadow-xs transition-all"
                  onClick={() => {
                    document.getElementById("telemetry-dashboard")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Activity size={14} className="mr-1.5" /> View Live Telemetry Stream
                </Button>

                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-5 shadow-2xs"
                  onClick={() => {
                    document.getElementById("application-finder")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Application Sizing Wizard
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleWhatsApp}
                  className="h-11 text-xs text-[#16A34A] hover:bg-[#F0FDF4] font-semibold"
                >
                  <MessageSquare size={14} className="mr-1.5" /> Chat on WhatsApp
                </Button>
              </div>
            </div>

            {/* Right Comparison Schematic Card */}
            <div className="lg:col-span-5 rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 shadow-sm">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] block mb-2">
                Mechanical Simplification Factor
              </span>
              <h3 className="text-lg font-bold text-[#172033]">
                Conventional Train vs. INDUS Mechatronic Joint
              </h3>

              <div className="mt-5 space-y-4 text-xs">
                <div className="rounded-xl border border-[#FDA29B] bg-[#FFFBFA] p-4">
                  <span className="font-bold text-[#B42318] uppercase tracking-wide block mb-1">
                    Conventional Actuation Setup (Legacy):
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#475467] leading-relaxed">
                    <li>External motor, distinct planetary/harmonic gearbox, and coupling</li>
                    <li>External drive rack in centralized cabinet (15m+ cabling)</li>
                    <li>Single motor-side encoder (blind to gearbox backlash and torsion)</li>
                    <li>Complex harness with power, encoder, brake, and thermal lines</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-4">
                  <span className="font-bold text-[#027A48] uppercase tracking-wide block mb-1">
                    INDUS Intelligent Actuator (Mechatronic):
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#027A48] leading-relaxed">
                    <li>Motor, harmonic gearhead, DSP drive, and dual encoders in 1 housing</li>
                    <li>Direct 48V DC bus connection with daisy-chain EtherCAT fieldbus</li>
                    <li>Dual 19-bit absolute encoders measure input and output flange directly</li>
                    <li>Eliminates separate motor drives, reduces cable volume by 70%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE 5 MECHATRONIC CONVERGENCE PILLARS
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-2">
              System Architecture Breakdown
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
              The 5 Layers of an Intelligent Joint
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#667085] leading-relaxed">
              Every INDUS intelligent actuator operates on a tightly-coupled mechatronic loop where mechanical power generation, digital closed-loop regulation, and deterministic communication converge inside an IP65 sealed housing.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1: Electromagnetic Actuation */}
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all">
              <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#D1E0FF]">
                <Zap size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Layer 01</span>
              <h3 className="text-lg font-bold text-[#172033] mt-1">Electromagnetic Actuation</h3>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Frameless permanent magnet synchronous motor with high-permeability concentrated stator windings and neodymium rotor poles. Paired directly with zero-backlash strain-wave gearing for maximum continuous torque density.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#172033] space-y-1">
                <div>Rating: 35 – 280 Nm continuous</div>
                <div>Backlash: &lt; 0.8 arcmin</div>
              </div>
            </div>

            {/* Pillar 2: Dual Absolute Feedback */}
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all">
              <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#D1E0FF]">
                <Compass size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Layer 02</span>
              <h3 className="text-lg font-bold text-[#172033] mt-1">Dual Absolute Feedback</h3>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Primary encoder samples motor shaft rotation for high-speed field-oriented commutation. Secondary 19-bit optical encoder samples output flange directly, compensating for structural elasticity and gear compliance.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#172033] space-y-1">
                <div>Resolution: 19-Bit BiSS-C (524,288 cts/rev)</div>
                <div>Repeatability: ±10 arcseconds</div>
              </div>
            </div>

            {/* Pillar 3: Embedded DSP Drive Electronics */}
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all">
              <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#D1E0FF]">
                <Cpu size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Layer 03</span>
              <h3 className="text-lg font-bold text-[#172033] mt-1">Embedded Drive Inverter</h3>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                High-efficiency Gallium Nitride (GaN) / MOSFET inverter executing field-oriented current vector control at 20 kHz PWM. Integral aluminum heat-sink structure dissipates heat directly through the machine chassis mounting face.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#172033] space-y-1">
                <div>DC Bus: 48V DC nominal (24–56V)</div>
                <div>Current Loop: 50 µs response time</div>
              </div>
            </div>

            {/* Pillar 4: Real-Time Motion Control */}
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all">
              <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#D1E0FF]">
                <Sliders size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Layer 04</span>
              <h3 className="text-lg font-bold text-[#172033] mt-1">CiA 402 Control Profiles</h3>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Hardware trajectory interpolator supporting standard CiA 402 drive profiles: Cyclic Synchronous Position (CSP), Velocity (CSV), and Torque (CST). Enables smooth multi-axis robot kinematics with sub-millisecond coordination.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#172033] space-y-1">
                <div>Profiles: CSP, CSV, CST, Homing</div>
                <div>Interpolation: Polynomial 5th-order splines</div>
              </div>
            </div>

            {/* Pillar 5: Deterministic Fieldbus Communication */}
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all">
              <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#D1E0FF]">
                <Wifi size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Layer 05</span>
              <h3 className="text-lg font-bold text-[#172033] mt-1">EtherCAT &amp; CANopen Bus</h3>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Standard 100BASE-TX EtherCAT slave controller with dual RJ45/M12 ports for daisy-chain topology. Distributed Clocks (DC) synchronize multiple joints with sub-microsecond jitter across the robot arm.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#172033] space-y-1">
                <div>Sync Jitter: &lt; 0.8 µs (DC Active)</div>
                <div>Cycle Times: 250 µs, 500 µs, 1.0 ms</div>
              </div>
            </div>

            {/* Pillar 6: Functional Safety & Diagnostics */}
            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 hover:border-[#155EEF] transition-all">
              <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#D1E0FF]">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Layer 06</span>
              <h3 className="text-lg font-bold text-[#172033] mt-1">Safety &amp; Health Monitoring</h3>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Dual-channel Safe Torque Off (STO SIL2 / PLd) hardware cut-off prevents unexpected restart. Continuous stator temperature monitoring, over-current trip, and non-volatile cycle hour logging protect against mechanical downtime.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] font-mono text-[#172033] space-y-1">
                <div>Safety: EN ISO 13849-1 STO (SIL2)</div>
                <div>Telemetry: Temp, voltage, following error</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTERACTIVE TELEMETRY & WAVEFORM DASHBOARD (ANCHOR: #telemetry-dashboard)
         ========================================================================= */}
      <section id="telemetry-dashboard" className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-2">
              Laboratory Bench Verification
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
              Interactive Closed-Loop Telemetry &amp; Fault Diagnostics
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed">
              Observe real-time DSP drive vector calculations, commanded vs. actual encoder positioning waveforms, torque-speed curves, and on-board safety trip thresholds.
            </p>
          </div>

          <IntelligentActuatorDashboard actuatorModel="IND-IRA-090-80" />
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: VERIFIED HARDWARE MODELS (ROTARY & LINEAR)
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-2">
                Available Product Models
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
                Intelligent Rotary &amp; Linear Actuator Families
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
            >
              Browse Full Motion Catalogue →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {actuators.map((act) => (
              <div
                key={act.id}
                className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6 sm:p-8 flex flex-col justify-between hover:border-[#155EEF] transition-all"
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

                  <h3 className="text-xl sm:text-2xl font-bold text-[#172033] mt-4">
                    {act.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667085] mt-2 leading-relaxed">
                    {act.headline}
                  </p>

                  {/* 2x2 Specs */}
                  <div className="my-6 grid grid-cols-2 gap-3.5 bg-white p-4 rounded-xl border border-[#E5EAF1]">
                    <div>
                      <span className="text-[11px] text-[#667085] block font-mono">
                        {act.headlineSpecs.ratedTorqueOrForce.label}
                      </span>
                      <strong className="text-base font-bold text-[#172033] block mt-0.5">
                        {act.headlineSpecs.ratedTorqueOrForce.value} {act.headlineSpecs.ratedTorqueOrForce.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#667085] block font-mono">
                        {act.headlineSpecs.outputSpeed.label}
                      </span>
                      <strong className="text-base font-bold text-[#172033] block mt-0.5">
                        {act.headlineSpecs.outputSpeed.value} {act.headlineSpecs.outputSpeed.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#667085] block font-mono">
                        {act.headlineSpecs.positionFeedback.label}
                      </span>
                      <strong className="text-sm font-bold text-[#172033] block mt-0.5">
                        {act.headlineSpecs.positionFeedback.value}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#667085] block font-mono">
                        {act.headlineSpecs.integration.label}
                      </span>
                      <strong className="text-sm font-bold text-[#172033] block mt-0.5">
                        {act.headlineSpecs.integration.value}
                      </strong>
                    </div>
                  </div>

                  {/* Model Variants Pill List */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-semibold text-[#475467] block">Standard Models in Family:</span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {act.modelVariants.map((v) => (
                        <span key={v.modelCode} className="rounded bg-white border border-[#E5EAF1] px-2 py-0.5 text-[#172033]">
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
                    <span>View Complete Product Detail Page</span>
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
      </section>

      {/* =========================================================================
          SECTION 5: INTEGRATION REQUIREMENTS & CONTROLLER COMPATIBILITY
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[.22em] text-[#155EEF] block mb-2">
              Engineering Deployment Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Electrical, Mechanical &amp; Fieldbus Integration
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed">
              Standardized interfaces ensure plug-and-play commissioning with Beckhoff TwinCAT, Siemens S7-1500, Omron Sysmac, and CODESYS masters.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Electrical Interface</span>
              <h4 className="text-base font-bold text-[#172033] mt-1">48V DC Regulated Bus</h4>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Connects directly to an external industrial switched-mode 48V DC power supply. Recommended separate 24V DC logic supply ensures fail-safe STO brake holding even during main bus shutdown.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Mechanical Mounting</span>
              <h4 className="text-base font-bold text-[#172033] mt-1">ISO 9409-1 Flange</h4>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Industry-standard robot tool flange with precision dowel hole indexing. Center through-hole allows internal pneumatic hoses and sensor lines to pass through without external cable loops.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">Master Compatibility</span>
              <h4 className="text-base font-bold text-[#172033] mt-1">Plug-and-Play ESI XML</h4>
              <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                Supplied with official EtherCAT Slave Information (ESI) XML file. Pre-configured process data objects (PDOs) allow instant axis mapping in TwinCAT 3, CODESYS, or Omron Sysmac Studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: GUIDED APPLICATION FINDER (ANCHOR: #application-finder)
         ========================================================================= */}
      <section id="application-finder" className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="rounded bg-[#EFF6FF] px-3 py-1 font-mono text-xs font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
              Kinematic Selection Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-2">
              Calculate Your Joint Requirements
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Provide your payload, desired joint speed, acceleration, and fieldbus type. Our engineering team validates the inertia ratio and thermal duty cycle.
            </p>
          </div>

          <ApplicationFinderWizard
            initialCategory="rotary-actuator"
            initialProduct="Intelligent Rotary Actuator"
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CONSULTATION PATHWAY
         ========================================================================= */}
      <section className="bg-[#F7F9FC] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <div className="size-12 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center mx-auto mb-4 border border-[#B2CCFF]">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172033]">
            Speak with an INDUS Motion Engineer
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#667085] max-w-xl mx-auto leading-relaxed">
            Need 3D CAD STEP files with accurate inertia matrices, or a multi-joint kinematics review for a custom robotic manipulator?
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
