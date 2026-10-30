import React, { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
  Layers,
  MessageSquare,
  Wrench,
  FileText,
  Gauge,
  Zap,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Sparkles,
  Cpu,
  Settings,
  Activity,
  Compass,
  ChevronRight,
  ExternalLink,
  Radio,
  Sliders,
  Check,
  Clock,
  PhoneCall,
  HardDrive,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSolution, solutionsData, type SolutionItem } from "@/data/solutions";
import { images } from "@/lib/images";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { buildSeoMeta } from "@/lib/seo";
import { SolutionArchitectureDiagram } from "@/components/solutions/SolutionArchitectureDiagram";
import { SolutionEnquiryForm } from "@/components/solutions/SolutionEnquiryForm";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/solutions/$solutionId")({
  loader: ({ params }) => {
    const solution = getSolution(params.solutionId);
    if (!solution) {
      throw notFound();
    }
    return { solution };
  },
  head: ({ loaderData }) => {
    const solution = loaderData?.solution;
    return buildSeoMeta({
      title: `${solution?.title || "Solution"} | Turnkey Engineering | INDUS Robotics`,
      description:
        solution?.heroSubtitle ||
        solution?.shortDescription ||
        "Turnkey industrial automation and motion control solution.",
      path: `/solutions/${solution?.id || ""}`,
      ogType: "article",
    });
  },
  component: SolutionDetailPage,
});

// Solution-specific photographic assets
const SOLUTION_DETAIL_IMAGES: Record<string, string> = {
  "motion-control": images.motionController,
  "robotic-automation": images.weldingRobot,
  "machine-integration": images.plcAutomation,
  "material-handling": images.palletizingRobot,
  "precision-positioning": images.rotaryEncoder,
  "custom-engineering": images.servoActuator,
};

// Plant interface standard specifications
function getPlantInterfaceSpecs(solutionId: string) {
  return [
    {
      icon: Zap,
      category: "Electrical Power Supply",
      spec: "400 VAC, 3-Phase + PE, 50/60 Hz (±10% allowable ripple)",
      notes: "Dedicated breaker recommended; 24 VDC / 20A redundant power for field sensors.",
    },
    {
      icon: Network,
      category: "Industrial Fieldbus Network",
      spec: "EtherCAT CoE or PROFINET IRT (Cat 6A shielded industrial Ethernet)",
      notes: "Deterministic master cycle rate ≤ 1.0 ms with distributed clocks enabled.",
    },
    {
      icon: Settings,
      category: "Pneumatics & Fluid Power",
      spec: "0.6 – 0.8 MPa (6 – 8 bar) clean dry air (ISO 8573-1:2010 Class 2:4:2)",
      notes: "Flow rate ≥ 150 NL/min with digital threshold interlock.",
    },
    {
      icon: ShieldCheck,
      category: "Safety Architecture & Enclosure",
      spec: "ISO 13849-1 Performance Level e (PLe) / Cat 4 compliant circuit",
      notes: "Dual-channel emergency stops, interlocked gates, and optional optical light curtains.",
    },
  ];
}

function SolutionDetailPage() {
  const { solution } = Route.useLoaderData();
  const { openModal } = useModals();
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  // Track page view telemetry on mount
  useEffect(() => {
    trackDigitalPresence("solution_view", solution.title, `/solutions/${solution.id}`);
    trackClarityEvent("solution_view");
  }, [solution.id, solution.title]);

  const handleWhatsApp = () => {
    trackDigitalPresence("contact", `WhatsApp Solution - ${solution.title}`, `/solutions/${solution.id}`);
    trackClarityEvent("whatsapp_click");
    window.open(
      companyConfig.getWhatsAppUrl({ type: "solution", name: solution.title }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const scrollToEnquiry = () => {
    const el = document.getElementById("solution-enquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroImage = SOLUTION_DETAIL_IMAGES[solution.id] || images.components;
  const plantSpecs = getPlantInterfaceSpecs(solution.id);

  // Related adjacent solutions excluding current
  const relatedSolutions = solutionsData.filter((s) => s.id !== solution.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. BREADCRUMBS & HERO SECTION */}
      <section className="relative border-b border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-10 sm:py-16 lg:px-8 overflow-hidden">
        {/* Subtle engineering grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-[1440px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <Link to="/" className="hover:text-[#155EEF] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <Link to="/solutions" className="hover:text-[#155EEF] transition-colors">
              Solutions
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-[#155EEF] font-bold">{solution.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 max-w-3xl">
              {/* Solution Badge & Standards */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                  <ShieldCheck size={13} />
                  <span>{solution.badge || "Turnkey Engineering"}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-1 text-[10px] font-mono font-semibold uppercase text-slate-600">
                  <Activity size={12} className="text-slate-500" />
                  <span>ISO 9283 / ISO 13849-1</span>
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                {solution.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-base sm:text-lg font-semibold text-slate-700 leading-snug">
                {solution.heroSubtitle}
              </p>

              {/* Short Description */}
              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {solution.shortDescription}
              </p>

              {/* Key Value Metric Pills */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono text-slate-700">
                {solution.technologiesUsed?.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium shadow-xs"
                  >
                    <span className="size-1.5 rounded-full bg-[#155EEF]" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  onClick={scrollToEnquiry}
                  className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1047BF] transition-colors"
                >
                  <PhoneCall size={14} className="mr-2" />
                  Discuss Your Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    openModal("quote", {
                      productName: `${solution.title} System Solution`,
                      categoryName: solution.title,
                      initialMessage: `Requesting engineering feasibility and preliminary proposal for ${solution.title}.`,
                    })
                  }
                  className="h-11 rounded-lg border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <FileText size={14} className="mr-2" />
                  Request Proposal &amp; CAD
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleWhatsApp}
                  className="h-11 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  WhatsApp Engineering Desk →
                </Button>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl overflow-hidden group">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={heroImage}
                    alt={`${solution.title} System Visual`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                  {/* HUD Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between text-[11px] font-mono font-medium text-blue-200 mb-1">
                      <span>VERIFIED SUBSYSTEM SPECIFICATION</span>
                      <span>FAT VALIDATED</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-snug">
                      {solution.title} package engineered with deterministic feedback loops, certified safety architecture, and full test logs.
                    </p>
                  </div>
                </div>

                {/* Sub-strip metric summary */}
                <div className="mt-3 grid grid-cols-3 divide-x divide-slate-100 py-1 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Architecture</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Modular</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Validation</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">FAT / SAT</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Fieldbus</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Multi-Protocol</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CUSTOMER PROBLEM & OPERATIONAL BOTTLENECKS */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Operational Challenges
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
                {solution.challenge?.title || "The Engineering Challenge"}
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {solution.challenge?.description}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-red-100 bg-red-50/40 p-6">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-red-700 mb-3 flex items-center gap-1.5">
                  <AlertOctagon size={14} />
                  <span>Production Risks Solved by This Solution</span>
                </div>
                <div className="space-y-3">
                  {solution.challenge?.bulletPoints?.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="size-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        ✕
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT THE SOLUTION INCLUDES (SYSTEM SCOPE) */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Scope &amp; Interface Boundaries
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              What The Solution Includes
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We define clear engineering boundaries so plant managers and system integrators know exactly what INDUS designs, 
              supplies, and commissions versus what requires plant facility hookup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What INDUS Supplies */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Engineered &amp; Supplied by INDUS
                  </h3>
                  <span className="text-[11px] text-slate-500">Delivered fully tested and validated</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {solution.systemScope?.included?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plant Facility Interface Required */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Customer Plant Interfaces Required
                  </h3>
                  <span className="text-[11px] text-slate-500">Facility supplies and utility connections</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {solution.systemScope?.plantInterfaceRequired?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="size-4 rounded-full bg-blue-100 text-[#155EEF] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      →
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SYSTEM ARCHITECTURE & SIGNAL FLOW */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <SolutionArchitectureDiagram
            solutionId={solution.id}
            solutionTitle={solution.title}
            steps={solution.systemArchitecture}
          />
        </div>
      </section>

      {/* 5. VERIFIED ENGINEERING SPECIFICATIONS MATRIX */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-slate-50/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Technical Rigor
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Verified Engineering Specifications
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Performance parameters governed by international standards (ISO, IEC, DIN). Numerical values represent 
              verified laboratory test benchmarks and require confirmation for specific workpiece payloads.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-mono uppercase text-slate-600">
                    <th className="py-3.5 px-5 font-bold">Engineering Parameter</th>
                    <th className="py-3.5 px-5 font-bold">Benchmark Value</th>
                    <th className="py-3.5 px-5 font-bold">Governing Standard</th>
                    <th className="py-3.5 px-5 font-bold">Technical Qualification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {solution.technicalSpecs?.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{spec.label}</td>
                      <td className="py-3.5 px-5 font-mono font-bold text-[#155EEF]">{spec.value}</td>
                      <td className="py-3.5 px-5 font-mono text-slate-600">{spec.standard}</td>
                      <td className="py-3.5 px-5 text-slate-600">{spec.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TYPICAL APPLICATIONS & FACTORY SCENARIOS */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Factory Deployment
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Typical Applications &amp; Use Cases
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Representative production environments where this system configuration eliminates manual handling and improves takt pacing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.typicalApplications?.map((app, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#155EEF]/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-[#155EEF]">
                  <span>SCENARIO 0{idx + 1}</span>
                </div>
                <h3 className="font-display text-sm font-bold text-slate-900 leading-snug">
                  {app}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Engineered with customized tool flanging, cycle interlocking, and dedicated safety boundaries.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SYSTEM INTEGRATION & PLANT INTERFACES */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Utility Specifications
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Plant Interfaces &amp; Utility Requirements
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Physical prerequisites required on the customer shop floor to enable rapid installation and commissioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plantSpecs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="size-9 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center mb-3">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                      {spec.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {spec.spec}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    {spec.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TESTING & ACCEPTANCE METHODOLOGY (FAT / SAT) */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Quality Assurance
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Testing, FAT &amp; SAT Validation
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every system undergoes rigorous multi-phase verification before dispatch and after on-site installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.testingAndValidation?.map((phase, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF]">
                      {phase.phase}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {phase.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                    Acceptance Gate
                  </span>
                  <p className="text-[11px] font-medium text-emerald-700 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                    {phase.acceptanceCriteria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONNECTED CANONICAL PRODUCTS */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/60">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Hardware Building Blocks
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
                Connected Product Ranges
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Standard catalogue components verified for compatibility with this solution architecture.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-[#1047BF]"
            >
              <span>Explore Product Catalogue</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.relatedProducts?.map((prod, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#155EEF]/50 transition-all justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {prod.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                    {prod.name}
                  </h4>
                  <p className="text-xs font-mono text-[#155EEF] mt-2">
                    {prod.specs}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={prod.href as never}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-[#1047BF]"
                  >
                    <span>View Specifications</span>
                    <ArrowRight size={12} />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      openModal("quote", {
                        productName: prod.name,
                        categoryName: prod.category,
                        initialMessage: `Requesting datasheet and quotation for ${prod.name} as part of ${solution.title}.`,
                      })
                    }
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800"
                  >
                    RFQ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. REAL ENGINEERING FAQS */}
      <section className="px-4 py-16 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
              Technical Inquiries
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineering specifics regarding lead times, PLC protocols, safety compliance, and commissioning.
            </p>
          </div>

          <div className="space-y-3">
            {solution.faqs?.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-slate-900 hover:text-[#155EEF] transition-colors"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#155EEF]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. APPLICATION-SPECIFIC ENGINEERING ENQUIRY FORM */}
      <section id="solution-enquiry-section" className="px-4 py-16 lg:px-8 bg-slate-50/60 border-b border-slate-200/80">
        <div className="mx-auto max-w-4xl">
          <SolutionEnquiryForm
            solutionId={solution.id}
            solutionTitle={solution.title}
          />
        </div>
      </section>

      {/* CONNECTED JOURNEY CTA BANNER */}
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8 my-8">
        <CtaBanner
          variant="precision"
          badge="TURNKEY ENGINEERING ASSISTANCE"
          headline={`Deploy ${solution.title} with Guaranteed FAT/SAT`}
          description="Speak directly with our motion control application engineers for a detailed torque, inertia ratio, cycle takt simulation, and custom CAD space-claim envelope."
          ctaPrimary={{
            label: "Book 30-Min Consultation",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Open Sizing Calculator",
            href: "/application-finder",
          }}
        />
      </div>

      {/* 12. RELATED SOLUTIONS & NAVIGATION */}
      <section className="px-4 py-16 lg:px-8 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                Adjacent Disciplines
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900 mt-0.5">
                Explore Other Solution Packages
              </h2>
            </div>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-[#1047BF]"
            >
              <span>View All 6 Solutions</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedSolutions.map((rel) => (
              <Link
                key={rel.id}
                to="/solutions/$solutionId"
                params={{ solutionId: rel.id }}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#155EEF]/50 hover:shadow-md transition-all"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                    {rel.badge || "System Solution"}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors mt-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#155EEF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Architecture</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
