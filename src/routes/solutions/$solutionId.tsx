import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
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
  Download,
  ChevronDown,
  Calendar,
  Sparkles,
  Cpu,
  Settings,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSolution, solutionsData } from "@/data/solutions";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { RelatedContent } from "@/components/common/RelatedContent";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { buildSeoMeta } from "@/lib/seo";

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
      title: `${solution?.title || "Solution"} | INDUS Industrial Robotics`,
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

// Helper for verified solution engineering specifications
function getSolutionSpecifications(solutionId: string) {
  const specsMap: Record<string, { label: string; value: string; detail: string }[]> = {
    "factory-automation": [
      { label: "Nominal Cell Payload", value: "5 – 50 kg", detail: "Configurable by end-effector mass" },
      { label: "Positioning Repeatability", value: "±0.02 mm", detail: "ISO 9283 multi-axis kinematic verification" },
      { label: "Takt Time Envelope", value: "3.5 – 12 sec", detail: "Application process dependent" },
      { label: "Interpolated Motion Axes", value: "4 – 8 Axes", detail: "Coordinated robot + external positioner" },
      { label: "Fieldbus Protocol", value: "EtherCAT / PROFINET", detail: "250 µs deterministic sync cycle" },
      { label: "Enclosure Safety Rating", value: "ISO 13849-1 Cat 4 PLe", detail: "Dual-channel interlocked safety cage" },
    ],
    "robotic-automation": [
      { label: "Articulated Arm Payload", value: "6 – 210 kg", detail: "Harmonic & cycloidal zero-backlash drive" },
      { label: "Radial Reach Radius", value: "900 – 3,100 mm", detail: "Spherical working envelope" },
      { label: "Path Repeatability", value: "±0.03 mm", detail: "Continuous path velocity tracking" },
      { label: "Ingress Protection", value: "IP67 (Wrist) / IP65 (Base)", detail: "Protected against washdown & dust" },
      { label: "Safety Functions", value: "STO, SS1, SLS, SLP", detail: "IEC 61800-5-2 integrated safety" },
      { label: "Tool Flange Interface", value: "ISO 9409-1-50 / 9409-1-100", detail: "Quick automatic tool-changer ready" },
    ],
    "motion-control": [
      { label: "Drive Synchronization", value: "CoE (CiA 402)", detail: "Distributed clocks jitter < 1 µs" },
      { label: "Gearbacklash Threshold", value: "< 0.1 arcmin", detail: "Zero lost motion harmonic gearing" },
      { label: "Feedback Resolution", value: "24-Bit Optical", detail: "16,777,216 counts / revolution" },
      { label: "DC Bus Voltage", value: "48 VDC – 320 VDC", detail: "Regenerative braking chopper circuit" },
      { label: "Torque Density", value: "Up to 120 Nm/kg", detail: "Compact frameless direct-drive motor" },
      { label: "Compliance Standards", value: "CE / UL508C / RoHS", detail: "Industrial EMC immunity certified" },
    ],
    "smart-manufacturing": [
      { label: "Edge Telemetry Rate", value: "1,000 Hz", detail: "High-speed vibration & thermal logging" },
      { label: "Connectivity Gateway", value: "OPC UA / MQTT", detail: "IEC 62541 industrial standard" },
      { label: "Line OEE Analytics", value: "Real-Time Spindle / Takt", detail: "Automated micro-stoppage detection" },
      { label: "Field MTBF Baseline", value: "> 85,000 Hours", detail: "Continuous 24/7 duty verification" },
      { label: "Database Integration", value: "REST API / SQL / MES", detail: "Zero-loss local store-and-forward" },
      { label: "Cybersecurity Protocol", value: "TLS 1.3 / X.509 certs", detail: "IEC 62443 industrial cyber standard" },
    ],
    "material-handling": [
      { label: "AMR / Pallet Payload", value: "100 – 1,500 kg", detail: "Heavy steel chassis & high-torque hubs" },
      { label: "Navigation Method", value: "Natural LiDAR SLAM", detail: "Reflector-free dynamic obstacle avoidance" },
      { label: "Transit Velocity", value: "Up to 1.8 m/sec", detail: "Automatic deceleration at aisle corners" },
      { label: "Station Docking Accuracy", value: "±5.0 mm", detail: "Optical centering pin & floor docking" },
      { label: "Battery Chemistry", value: "48V LiFePO4 Fast-Charge", detail: "30 min charge yields 4 hours transit" },
      { label: "Fleet Interoperability", value: "VDA 5050 Standard", detail: "Centralized multi-vendor fleet manager" },
    ],
    "assembly-automation": [
      { label: "Micro-Insertion Tolerance", value: "±0.010 mm", detail: "Visual servoing & compliant center nest" },
      { label: "Dynamic Force Sensing", value: "0.1 N Sensitivity", detail: "6-axis wrist force-torque cell" },
      { label: "Fastening Torque Range", value: "0.2 – 25 Nm", detail: "Brushless DC servo spindle with curve audit" },
      { label: "Vision Resolution", value: "5.0 MP Telecentric", detail: "Zero-distortion optical sub-pixel gauging" },
      { label: "Cleanroom Capability", value: "ISO Class 5 / 6", detail: "Exhausted vacuum ports & stainless links" },
      { label: "Line Changeover Speed", value: "< 3.0 Minutes", detail: "Automatic recipe and tool-finger swap" },
    ],
    "inspection-systems": [
      { label: "Metrology Accuracy", value: "±2.5 µm (3D Point Cloud)", detail: "NIST-traceable calibration target" },
      { label: "Laser Profile Acquisition", value: "Up to 10,000 profiles/sec", detail: "405 nm high-contrast blue laser" },
      { label: "Inspection Volume", value: "120 × 120 × 80 mm", detail: "Expandable via multi-head gantry array" },
      { label: "AI Classification Rate", value: "< 25 ms per component", detail: "Automated burr, dent & porosity check" },
      { label: "Rejection Diverter Takt", value: "Under 120 ms", detail: "Pneumatic high-speed paddle diverter" },
      { label: "Audit Compliance", value: "100% Digital Traceability", detail: "Individual part serial image archive" },
    ],
  };

  return specsMap[solutionId] || [
    { label: "Kinematic Repeatability", value: "±0.025 mm", detail: "ISO 9283 test verified" },
    { label: "Payload Capacity", value: "10 – 60 kg", detail: "Configurable by cell tooling" },
    { label: "Fieldbus Synchronization", value: "EtherCAT / PROFINET", detail: "250 µs deterministic cycle" },
    { label: "Cell Safety Architecture", value: "ISO 13849-1 Cat 4 PLe", detail: "Dual-channel hardware interlock" },
  ];
}

// Integration requirements for plant engineers
function getIntegrationRequirements(solutionId: string) {
  return [
    {
      icon: Zap,
      category: "Electrical Power Supply",
      spec: "400 VAC, 3-Phase + PE, 50/60 Hz (±10% allowable ripple)",
      notes: "Dedicated 32A breaker recommended; secondary 24 VDC / 20A redundant power supply for field sensors.",
    },
    {
      icon: Activity,
      category: "Industrial Fieldbus Network",
      spec: "EtherCAT CoE or PROFINET IRT (Cat 6A shielded industrial Ethernet)",
      notes: "Deterministic master cycle rate ≤ 1.0 ms with distributed clocks enabled for multi-axis synchronization.",
    },
    {
      icon: Settings,
      category: "Pneumatics & Fluid Power",
      spec: "0.6 – 0.8 MPa (6 – 8 bar) clean, filtered dry air (ISO 8573-1:2010 [Class 2:4:2])",
      notes: "Minimum 120 NL/min sustained flow rate with digital pressure sensor threshold interlock.",
    },
    {
      icon: ShieldCheck,
      category: "Safety Architecture & Enclosure",
      spec: "ISO 13849-1 Performance Level e (PLe) / SIL 3 compliant safety circuit",
      notes: "Interlocked safety gate switches, dual-channel emergency stop buttons, and optional optical light curtains.",
    },
  ];
}

// Solution-specific FAQs
function getSolutionFaqs(solution: { title: string }) {
  return [
    {
      question: `What is the typical engineering and deployment lead time for a turnkey ${solution.title} cell?`,
      answer: `Standard modular cells typically require 8 to 14 weeks from preliminary design freeze to Factory Acceptance Testing (FAT). Highly customized tooling, automated vision fixtures, or multi-station linked transfer lines typically take 14 to 20 weeks including on-site Site Acceptance Testing (SAT).`,
    },
    {
      question: `Can this system communicate directly with our existing factory PLCs and SCADA networks?`,
      answer: `Yes. INDUS motion controllers and robotic cells support open deterministic industrial protocols including EtherCAT, PROFINET, EtherNet/IP, Modbus TCP, and OPC UA. We regularly interface with Siemens S7-1500, Allen-Bradley ControlLogix, Beckhoff TwinCAT, and Omron controllers without third-party protocol converters.`,
    },
    {
      question: `How does the system ensure safety compliance for operator part loading and maintenance?`,
      answer: `All cells are engineered in strict compliance with ISO 10218-1/2 (Robotics Safety) and ISO 13849-1 Category 4 Performance Level e (PLe). Safety loops include monitored safety interlocks, dynamic speed-and-separation optical sensors, and dual Safe Torque Off (STO) drive circuits to protect operators at all times.`,
    },
    {
      question: `What telemetry and predictive maintenance capabilities are integrated into the cell?`,
      answer: `Each servo axis and reducer includes integrated temperature, vibration, and torque deviation monitoring. Telemetry is streamed in real-time to the local HMI and enterprise MES via OPC UA, enabling early detection of mechanical wear, lube degradation, or collision impact long before catastrophic line stoppages occur.`,
    },
  ];
}

function SolutionDetailPage() {
  const { solution } = Route.useLoaderData();
  const { openModal } = useModals();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

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
      "noopener,noreferrer",
    );
  };

  const handleDatasheetDownload = (resourceTitle: string, resourceType: string) => {
    trackDigitalPresence("specification_download", resourceTitle, `/solutions/${solution.id}`);
    trackClarityEvent("specification_download");
    setDownloadSuccess(`Dossier "${resourceTitle}" download link dispatched.`);
    setTimeout(() => setDownloadSuccess(null), 4000);

    // Open enquiry modal if user wants full CAD/datasheet bundle
    openModal("quote", {
      productName: `${solution.title} - ${resourceTitle}`,
      categoryName: solution.title,
      initialMessage: `Requesting engineering documentation and CAD models for ${solution.title} (${resourceTitle}).`,
    });
  };

  const specifications = getSolutionSpecifications(solution.id);
  const integrationReqs = getIntegrationRequirements(solution.id);
  const solutionFaqs = getSolutionFaqs(solution);

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-precision-blue/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-electric-cyan/10 blur-3xl" />

        <div className="mx-auto max-w-[1440px] relative">
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/solutions"
              className="text-xs font-bold uppercase tracking-[.2em] text-signal hover:underline"
            >
              Solutions
            </Link>
            <span className="text-surface-foreground/40">/</span>
            <span className="text-xs uppercase tracking-wider text-surface-foreground/60 font-mono">
              Turnkey System Engineering
            </span>
          </div>

          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[.92] text-white sm:text-6xl lg:text-7xl">
            {solution.title}
          </h1>

          <p className="mt-4 font-display text-xl uppercase tracking-wide text-signal sm:text-2xl">
            {solution.heroSubtitle}
          </p>

          <p className="mt-6 max-w-3xl text-sm leading-8 text-surface-foreground/75 sm:text-base">
            {solution.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-industrial-navy hover:bg-signal/90 text-xs tracking-wider"
              onClick={() => {
                trackDigitalPresence("cta_click", `Discuss ${solution.title}`, `/solutions/${solution.id}`);
                trackClarityEvent("request_consultation");
                openModal("engineer", { categoryName: solution.title });
              }}
            >
              <Wrench size={15} className="mr-2" />
              Discuss Engineering Requirements
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal text-xs tracking-wider"
              onClick={() => {
                trackDigitalPresence("cta_click", `RFQ for ${solution.title}`, `/solutions/${solution.id}`);
                trackClarityEvent("request_quote");
                openModal("quote", { productName: solution.title });
              }}
            >
              Request Solution RFQ
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal text-xs tracking-wider"
            >
              <Link to="/book-consultation">
                <Calendar size={14} className="mr-1.5 text-signal" />
                Book Video Consultation
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-emerald-400 hover:text-emerald-400 text-xs tracking-wider"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-emerald-400" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* 2. THE CHALLENGE & OUR APPROACH */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background border-b border-border">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* The Challenge */}
            <div className="border border-border bg-card p-8 rounded-sm">
              <div className="flex items-center gap-2 text-destructive mb-3">
                <AlertOctagon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">
                  Industrial Pain Points
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                {solution.challenge.title}
              </h2>
              <p className="mt-4 text-xs leading-6 text-muted-foreground sm:text-sm">
                {solution.challenge.description}
              </p>
              <ul className="mt-6 space-y-3">
                {solution.challenge.bulletPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-xs text-muted-foreground sm:text-sm"
                  >
                    <span className="text-destructive font-bold text-base leading-none">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Approach */}
            <div className="border border-signal/40 bg-surface-elevated/20 p-8 rounded-sm">
              <div className="flex items-center gap-2 text-signal mb-3">
                <CheckCircle2 size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-signal">
                  Engineering Methodology
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                {solution.approach.title}
              </h2>
              <p className="mt-4 text-xs leading-6 text-muted-foreground sm:text-sm">
                {solution.approach.description}
              </p>
              <ul className="mt-6 space-y-3">
                {solution.approach.bulletPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-xs text-foreground sm:text-sm"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-signal" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technologies Deployed Strip */}
          <div className="mt-10 border-t border-border pt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-3 font-mono">
              Core Technologies Deployed in this Turnkey Cell
            </span>
            <div className="flex flex-wrap gap-2">
              {solution.technologiesUsed.map((tech) => (
                <span
                  key={tech}
                  className="border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground uppercase tracking-wider rounded-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED ENGINEERING SPECIFICATIONS TABLE */}
      <section className="bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-24 border-b border-border/40">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.24em] text-signal">
              AUDITED SPECIFICATIONS
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl text-white">
              Engineering Parameters &amp; Performance Baselines
            </h2>
            <p className="mt-3 text-xs leading-6 text-surface-foreground/65 sm:text-sm">
              Standard nominal ratings for {solution.title} cell architectures. Exact kinematics and torque envelopes are tailored to component mass and cycle requirements during project engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specifications.map((spec) => (
              <div
                key={spec.label}
                className="rounded border border-border/30 bg-surface-elevated/70 p-5 backdrop-blur-sm"
              >
                <span className="text-[10px] font-mono font-bold uppercase text-surface-foreground/50 block">
                  {spec.label}
                </span>
                <span className="mt-2 text-xl font-mono font-bold text-signal block">
                  {spec.value}
                </span>
                <p className="mt-1 text-[11px] text-surface-foreground/60 leading-relaxed">
                  {spec.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SYSTEM ARCHITECTURE & PROCESS FLOW */}
      <section className="border-b border-border/40 bg-surface-dark/95 px-5 py-20 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 max-w-3xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[.24em] text-signal">
              PROCESS TOPOLOGY
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl text-white">
              System Architecture &amp; Execution Flow
            </h2>
            <p className="mt-3 text-xs leading-6 text-surface-foreground/65 sm:text-sm">
              How INDUS coordinates mechanical kinematics, real-time sensing, and closed-loop fieldbus control from raw infeed to final discharge.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solution.systemArchitecture.map((step) => (
              <div
                key={step.step}
                className="border border-surface-foreground/15 bg-surface-elevated p-6 transition-all hover:border-signal rounded-sm"
              >
                <span className="font-display text-3xl font-bold text-signal">{step.step}</span>
                <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-surface-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-surface-foreground/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTEGRATION REQUIREMENTS FOR PLANT ENGINEERS */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background border-b border-border">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              FACILITY INTEGRATION
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl text-foreground">
              Plant Infrastructure &amp; Utility Requirements
            </h2>
            <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
              Essential utility supplies and network requirements needed on-site prior to cell installation and commissioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationReqs.map((req) => {
              const Icon = req.icon;
              return (
                <div
                  key={req.category}
                  className="border border-border bg-card p-6 rounded-sm flex gap-4 items-start"
                >
                  <div className="size-10 rounded bg-precision-blue/10 border border-precision-blue/20 flex items-center justify-center text-precision-blue shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg uppercase text-foreground">
                      {req.category}
                    </h3>
                    <p className="mt-1 font-mono text-xs font-semibold text-signal">
                      {req.spec}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {req.notes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. APPLICATIONS & QUANTIFIABLE BENEFITS */}
      <section className="border-b border-border bg-card px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Applications */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Deployment Scenarios
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Typical Industrial Applications
              </h2>
              <ul className="mt-6 space-y-3">
                {solution.typicalApplications.map((app) => (
                  <li
                    key={app}
                    className="flex items-center gap-3 border border-border bg-background p-4 rounded-xs"
                  >
                    <span className="size-2 rounded-full bg-signal" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
                      {app}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Operational ROI
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Key Performance Advantages
              </h2>
              <div className="mt-6 space-y-4">
                {solution.benefits.map((b) => (
                  <div key={b.title} className="border border-border bg-background p-5 rounded-xs">
                    <h3 className="font-display text-lg uppercase text-signal">{b.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TECHNICAL DOCUMENTATION & DATASHEETS */}
      <section className="border-b border-border bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 border-b border-border/30 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-signal">
                TECHNICAL DOCUMENTATION
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase text-white">
                Engineering Drawings &amp; Application Notes
              </h2>
            </div>
            {downloadSuccess && (
              <span className="text-xs text-signal font-mono bg-signal/10 px-3 py-1.5 rounded border border-signal/30 animate-fade-in">
                {downloadSuccess}
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solution.resources.map((r) => (
              <div
                key={r.title}
                className="border border-border/30 bg-surface-elevated p-6 rounded-sm flex flex-col justify-between hover:border-signal transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded bg-precision-blue/15 px-2 py-0.5 text-[9px] font-mono uppercase text-precision-blue border border-precision-blue/30">
                      {r.type}
                    </span>
                    <FileText size={18} className="text-signal" />
                  </div>
                  <h3 className="font-display text-lg uppercase text-white">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-xs text-surface-foreground/60 leading-relaxed">
                    Dimensional schematics, electrical integration guides, and torque curves for {solution.title}.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/20 flex items-center justify-between">
                  <button
                    onClick={() => handleDatasheetDownload(r.title, r.type)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline cursor-pointer"
                  >
                    <Download size={13} />
                    Download PDF Dossier
                  </button>
                  <span className="text-[10px] font-mono text-surface-foreground/40">PDF / 1.8 MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SOLUTION FAQS */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background border-b border-border">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              TECHNICAL ANSWERS
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Engineering Questions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {solutionFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-border bg-card p-5 transition-colors open:bg-surface-elevated/20 rounded-xs"
              >
                <summary className="flex cursor-pointer items-center justify-between font-display text-base uppercase tracking-wide list-none text-foreground">
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className="shrink-0 transition-transform group-open:rotate-180 text-signal"
                    size={18}
                  />
                </summary>
                <p className="mt-4 text-xs leading-6 text-muted-foreground border-t border-border/50 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONSULTATION CALL TO ACTION */}
      <section className="bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-20 border-b border-border/40">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-signal">
              READY FOR KINEMATIC SIZING?
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              Schedule a Technical Consultation on {solution.title}
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-surface-foreground/75 sm:text-sm">
              Connect directly with an INDUS robotics applications engineer to review cycle times, payload requirements, and facility layout constraints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild className="bg-signal text-industrial-navy font-bold uppercase text-xs tracking-wider hover:bg-signal/90 px-6 py-3">
              <Link to="/book-consultation">
                <Calendar size={14} className="mr-1.5" />
                Book Video Consultation
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-surface-foreground/30 text-xs font-bold uppercase text-white hover:border-signal hover:text-signal px-6 py-3"
              onClick={() => openModal("engineer", { categoryName: solution.title })}
            >
              Request Engineering Call
            </Button>
          </div>
        </div>
      </section>

      {/* 10. CONTEXTUAL RELATED CONTENT */}
      <RelatedContent
        title="Explore Complementary Robotic Solutions"
        items={[
          {
            sectionTitle: "Alternative Automation Solutions",
            links: solutionsData
              .filter((s) => s.id !== solution.id)
              .slice(0, 3)
              .map((s) => ({
                title: s.title,
                description: s.shortDescription,
                href: `/solutions/${s.id}`,
              })),
          },
          {
            sectionTitle: "Industry Vertical Case Pathways",
            links: [
              {
                title: "Automotive & EV Robotics",
                description: "Sub-assembly welding, battery module handling, and powertrain lines.",
                href: "/applications/automotive",
              },
              {
                title: "Electronics & Semiconductor",
                description: "Cleanroom micro-placement, optical sorting, and PCB inspection.",
                href: "/applications/electronics",
              },
              {
                title: "Intralogistics & Warehouse Fleets",
                description: "Autonomous mobile robots and end-of-line palletizing cells.",
                href: "/applications/warehousing",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
