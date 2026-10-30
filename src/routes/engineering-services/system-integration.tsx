import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Network,
  Box,
  Zap,
  Cpu,
  Shield,
  Monitor,
  Eye,
  BarChart3,
  Cable,
  AlertTriangle,
  CheckCircle2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { companyConfig } from "@/data/config";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute("/engineering-services/system-integration")(
  {
    head: () =>
      buildSeoMeta({
        title: "System Integration Engineering | INDUS Industrial Robotics",
        description:
          "Engineering system integration for multi-axis robotic cells: mechanical, electrical, and control boundary definition, fieldbus architecture, PLC and HMI integration, commissioning, and diagnostic requirements.",
        path: "/engineering-services/system-integration",
      }),
    component: SystemIntegrationPage,
  }
);

const BOUNDARY_CARDS = [
  {
    title: "Mechanical Boundary",
    icon: Box,
    description:
      "Mounting interfaces, load paths, cable routing envelope, maintenance clearances, and thermal dissipation zones.",
  },
  {
    title: "Electrical Boundary",
    icon: Zap,
    description:
      "Power distribution, cabinet earthing, cable segregation (power vs signal), connector standards, and IP rating compliance.",
  },
  {
    title: "Control Boundary",
    icon: Cpu,
    description:
      "Fieldbus master/slave topology, cyclic I/O mapping, process data objects, safety channel wiring, and emergency stop circuit architecture.",
  },
];

const FIELDBUS_CARDS = [
  {
    title: "EtherCAT",
    description:
      "Sub-millisecond distributed clock synchronization (DC). Used for high-axis-count multi-robot cells. Line or ring topology.",
  },
  {
    title: "PROFINET IRT",
    description:
      "Isochronous real-time profile. Common in Siemens-ecosystem plants. Supported by most major drive manufacturers.",
  },
  {
    title: "EtherNet/IP",
    description:
      "CIP protocol. Common in Rockwell Automation environments. Suitable for motion and I/O integration.",
  },
  {
    title: "CANopen / DeviceNet",
    description:
      "Older installed-base protocols. Lower bandwidth; suitable for low-axis-count or legacy machine retrofit.",
  },
];

const INTEGRATION_LAYERS = [
  { icon: Cpu, label: "Robot Controller", detail: "Motion programming, kinematic model" },
  { icon: Settings, label: "Servo Drive Network", detail: "Axis torque/velocity loops" },
  { icon: Shield, label: "Safety PLC", detail: "Emergency stop, STO, zone management" },
  { icon: Monitor, label: "HMI / Operator Panel", detail: "Recipe management, alarm display" },
  { icon: Eye, label: "Sensors & Vision", detail: "Trigger, result, coordinate handshake" },
  { icon: BarChart3, label: "Plant MES / SCADA", detail: "Production orders, batch data, OEE" },
];

const COMMISSIONING_STAGES = [
  {
    step: "01",
    name: "FAT",
    headline: "Factory Acceptance Test",
    description:
      "Individual subsystem verification at supplier facility. Axis homing, safety circuit continuity, network communication, and motion profile validation.",
  },
  {
    step: "02",
    name: "Pre-SAT",
    headline: "Installation Readiness",
    description:
      "Mechanical alignment, cable routing, earthing continuity, and cabinet thermal verification at customer site before power-on.",
  },
  {
    step: "03",
    name: "SAT",
    headline: "Site Acceptance Test",
    description:
      "Full system power-on sequence, coordinated motion routines, I/O handshake verification, and alarm response testing.",
  },
  {
    step: "04",
    name: "Handover",
    headline: "Handover",
    description:
      "Operator training, validated backup of all controller projects, as-built documentation, and agreed preventive maintenance schedule.",
  },
];

const SIGNAL_REQUIREMENTS = [
  "Digital I/O handshakes",
  "Robot program start/stop",
  "Conveyor interlock",
  "Vision trigger/result",
  "Safety door monitoring",
  "Fault annunciation",
];

const LEGACY_POINTS = [
  "Obtain existing wiring schematics and PLC program documentation.",
  "Identify non-standard signal voltages, loop currents, and serial baud rates.",
  "Define gateway or protocol converter requirements and validate timing budgets.",
];

function SystemIntegrationPage() {
  const { openModal } = useModals();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =========================================================
          HERO SECTION (Dark)
         ========================================================= */}
      <section className="technical-grid border-b border-border/50 bg-[#0B0F17] px-5 py-16 text-white sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400"
          >
            <Link to="/" className="hover:text-signal transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link
              to="/engineering-services"
              className="hover:text-signal transition-colors"
            >
              ENGINEERING SERVICES
            </Link>
            <span>/</span>
            <span className="text-signal font-semibold">SYSTEM INTEGRATION</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-signal">
            <Network size={13} className="text-signal" />
            Systems Engineering
          </div>

          {/* H1 */}
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.96] tracking-tight text-white sm:text-5xl lg:text-6xl">
            System Integration Engineering
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg font-semibold text-signal sm:text-xl">
            From Standalone Subsystems to a Functioning Automated Cell
          </p>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            System integration connects mechanical actuators, servo drives, robot controllers,
            safety systems, sensors, and plant-level supervisory controls into a single
            deterministic production system. INDUS engineering engagements define mechanical,
            electrical, and control boundaries before hardware commitment.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="h-12 rounded-none bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(180,245,20,0.25)] transition-all cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "System Integration",
                  initialMessage:
                    "I would like to discuss integration requirements for a robotic cell project.",
                })
              }
            >
              Discuss Integration Requirements <ArrowRight size={15} className="ml-2" />
            </Button>

            <Link
              to="/contact/engineering-enquiry"
              className="inline-flex h-12 items-center gap-2 border border-slate-700 bg-slate-900/60 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-xs transition-colors hover:border-signal hover:text-signal"
            >
              Submit Engineering Spec Sheet <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 1 — SYSTEM BOUNDARY DEFINITION (White)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Engineering Scope
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Defining System Boundaries Before Integration
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Clear boundary definition is the first integration step. Each subsystem — robot
            controller, servo drive, safety PLC, HMI, and plant MES — has defined input/output
            interfaces, signal ownership, and timing responsibilities.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BOUNDARY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="border border-border bg-card p-7 flex flex-col gap-4"
                >
                  <div className="size-10 grid place-items-center border border-border bg-muted/30 text-signal">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 — FIELDBUS & CONTROL ARCHITECTURE (Light Gray)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-[#F7F8F6]">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Communication Architecture
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Supported Fieldbus Topologies & Control Layers
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Industrial fieldbuses carry deterministic cyclic process data between controllers and
            drives. The choice of protocol depends on controller OEM, required cycle time, network
            topology, and installed equipment.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {FIELDBUS_CARDS.map((card) => (
              <div
                key={card.title}
                className="border border-border bg-white p-6 flex flex-col gap-3"
              >
                <Cable size={18} className="text-signal" />
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 flex items-start gap-3 border border-amber-400/40 bg-amber-50 p-5">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Protocol Compatibility Note: </span>
              Protocol compatibility depends on the specific robot controller, drive, and safety PLC
              combination selected for the project. INDUS engineers verify protocol support during
              the Define phase.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 — INTEGRATION COMPONENTS (White)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Integration Architecture
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Typical Integration Components
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {/* Left: Integration Layers */}
            <div className="space-y-4">
              {INTEGRATION_LAYERS.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 border border-border bg-card px-5 py-4"
                >
                  <div className="size-9 shrink-0 grid place-items-center border border-border bg-muted/20 text-signal">
                    <Icon size={17} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-foreground">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Signal & Sequence Requirements */}
            <div className="border border-border bg-card p-7">
              <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground border-b border-border pb-3">
                Signal & Sequence Requirements
              </h3>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                Typical signals managed across the integration boundary:
              </p>
              <ul className="mt-4 space-y-3">
                {SIGNAL_REQUIREMENTS.map((sig) => (
                  <li key={sig} className="flex items-start gap-2 text-xs leading-5">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-signal" />
                    <span className="text-foreground/90">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4 — LEGACY MACHINE INTEGRATION (Dark)
         ========================================================= */}
      <section className="technical-grid border-y border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Retrofit Integration
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
            Legacy Machine Integration Considerations
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300">
            Existing production lines often contain legacy PLCs, proprietary serial protocols, and
            non-standard signal conditioning. Integration projects require interface documentation,
            protocol conversion, and signal isolation before new automation hardware is installed.
          </p>

          <ul className="mt-8 space-y-4">
            {LEGACY_POINTS.map((point, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span className="mt-0.5 font-mono text-xs font-bold text-signal shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-slate-300">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 — COMMISSIONING SEQUENCE (White)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Project Execution
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Integration Testing & Commissioning Sequence
          </h2>

          <div className="mt-12 grid gap-0 border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
            {COMMISSIONING_STAGES.map((stage, idx) => (
              <div
                key={stage.step}
                className={`relative flex flex-col justify-between p-6 sm:p-7 ${
                  idx > 0 ? "border-t border-border lg:border-l lg:border-t-0" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-signal">{stage.step}</span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5">
                      PHASE {stage.step}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                    {stage.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-signal uppercase tracking-wider">
                    {stage.headline}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 — CTA (Dark)
         ========================================================= */}
      <section className="technical-grid border-t border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                Start an Integration Discussion
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                Define Your System Integration Scope
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Share your existing equipment inventory, fieldbus preferences, safety category
                requirements, and production throughput targets. Our integration engineers will
                define the interface architecture and project milestones.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Button
                className="h-12 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(180,245,20,0.25)] cursor-pointer"
                onClick={() =>
                  openModal("engineer", {
                    categoryName: "System Integration",
                    initialMessage:
                      "I would like to discuss integration requirements for an automated cell project.",
                  })
                }
              >
                Discuss Integration Requirements <ArrowRight size={15} className="ml-2" />
              </Button>

              <Link
                to="/contact/engineering-enquiry"
                className="inline-flex h-12 items-center justify-center gap-2 border border-slate-700 bg-slate-900/70 px-7 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-signal hover:text-signal transition-colors text-center"
              >
                Submit 7-Section Spec Sheet
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RELATED CONTENT
         ========================================================= */}
      <RelatedContent
        eyebrow="Connected Ecosystem"
        title="Related Engineering Content"
        items={[
          {
            sectionTitle: "Engineering Services",
            links: [
              {
                title: "Engineering Capabilities",
                href: "/engineering-services",
                category: "Engineering Services",
                description:
                  "Overview of INDUS engineering disciplines: application feasibility, mechatronics, workcells, motion control, safety, and lifecycle optimization.",
              },
              {
                title: "Kinematic Sizing Calculators",
                href: "/technology/calculators",
                category: "Technology",
                description:
                  "Interactive tools for sizing joints, drives, and reducers based on your application torque, speed, and inertia targets.",
              },
              {
                title: "Technical Specifications",
                href: "/engineering-services/technical-specifications",
                category: "Engineering Reference",
                description:
                  "Specification reference for INDUS product families: torque, speed, payload, repeatability, fieldbus, and environmental limits.",
              },
            ],
          },
          {
            sectionTitle: "Relevant Solutions",
            links: [
              {
                title: "Factory Automation",
                href: "/solutions/factory-automation",
                category: "Solutions",
                description:
                  "End-to-end factory automation solutions covering robotic cells, conveyor integration, and production line synchronization.",
              },
              {
                title: "Motion Control",
                href: "/solutions/motion-control",
                category: "Solutions",
                description:
                  "Multi-axis motion control architectures, drive selection, and servo tuning for precision manufacturing applications.",
              },
            ],
          },
        ]}
      />
    </main>
  );
}
