import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  Activity,
  Bot,
  CheckCircle2,
  CircuitBoard,
  ClipboardCheck,
  DraftingCompass,
  Factory,
  Gauge,
  Layers3,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/engineering-services/")({
  head: () =>
    buildSeoMeta({
      title: "Engineering Services | INDUS Industrial Robotics",
      description:
        "Explore INDUS engineering services for application feasibility, precision motion subsystems, robotic workcells, motion control, safety engineering, custom robotics, and lifecycle optimization.",
      path: "/engineering-services",
    }),
  component: EngineeringServicesPage,
});

const services = [
  {
    number: "01",
    id: "application-engineering",
    title: "Application Engineering & Feasibility",
    summary:
      "Evaluate automation opportunities, clarify technical requirements, and compare system architectures before committing to equipment.",
    capabilities: [
      "Process analysis and bottleneck review",
      "Robot, actuator and transmission selection",
      "Payload, reach and repeatability assessment",
      "Preliminary work-envelope and risk review",
      "ROI modelling based on agreed assumptions",
    ],
    icon: DraftingCompass,
    audience: "Manufacturers and machine shops",
  },
  {
    number: "02",
    id: "kinematic-subsystems",
    title: "Kinematic Subsystems & Joint Actuator Engineering",
    summary:
      "Develop precision motion subsystems for machine builders and robotics OEMs, from component sizing to integrated joint-module design.",
    capabilities: [
      "Torque, stiffness and service-life calculations",
      "Reducer technology selection and sizing",
      "Motor, reducer, encoder and brake integration",
      "Hollow-shaft and cable-routing considerations",
      "CAD packages and prototype-to-series support",
    ],
    icon: Layers3,
    audience: "Machine builders and robotics OEMs",
  },
  {
    number: "03",
    id: "robotic-workcells",
    title: "Robotic Workcells & Machine Tending",
    summary:
      "Plan robotic cells around production tasks, material flow, tooling, controls and the safety requirements of the operating environment.",
    capabilities: [
      "Cell layout and material-flow planning",
      "Robot and end-of-arm tooling selection",
      "Fixturing, positioner and peripheral integration",
      "Offline programming and commissioning planning",
      "Installation, handover and operator training scope",
    ],
    icon: Bot,
    audience: "Production teams and manufacturing plants",
  },
  {
    number: "04",
    id: "motion-control",
    title: "Motion Control & Multi-Axis Synchronization",
    summary:
      "Design coordinated motion architectures for accurate positioning, synchronized movement and repeatable process performance.",
    capabilities: [
      "Motion controller and servo-drive selection",
      "Industrial network and control architecture",
      "Electronic gearing, camming and axis coordination",
      "Trajectory and vibration considerations",
      "PLC, robot logic and performance verification",
    ],
    icon: CircuitBoard,
    audience: "Automation integrators and equipment OEMs",
  },
  {
    number: "05",
    id: "safety-compliance",
    title: "Safety, Compliance & Risk Engineering",
    summary:
      "Identify machine and robot-cell hazards, define suitable safeguards, and support validation against applicable requirements.",
    capabilities: [
      "Machine and application risk assessment",
      "Safety concept and architecture development",
      "Safety PLC, interlock and protective-device integration",
      "Functional-safety requirements review",
      "Validation records and technical documentation",
    ],
    icon: ShieldCheck,
    audience: "Machine owners, integrators and OEMs",
  },
  {
    number: "06",
    id: "custom-robotics",
    title: "Custom Robotics & Special-Purpose Machines",
    summary:
      "Explore application-specific mechanisms, tooling and controls when standard equipment does not meet the operating requirements.",
    capabilities: [
      "Custom joint, linkage and mechanism concepts",
      "Special end-effectors and tool-changing systems",
      "Application-specific control and software planning",
      "Environmental and installation adaptations",
      "Engineering documentation and production support",
    ],
    icon: Wrench,
    audience: "Teams with non-standard requirements",
  },
  {
    number: "07",
    id: "lifecycle-optimization",
    title: "Lifecycle & Performance Optimization",
    summary:
      "Support ongoing system performance through maintenance planning, motion review, condition monitoring and upgrade assessments.",
    capabilities: [
      "Cycle-time and motion-path review",
      "Condition-monitoring strategy assessment",
      "Critical spares and maintenance planning",
      "Operator and maintenance training",
      "Periodic performance reviews and upgrade roadmaps",
    ],
    icon: Activity,
    audience: "Existing automation system owners",
  },
];

const phases = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the process, operating constraints and success criteria.",
  },
  {
    number: "02",
    title: "Define",
    description: "Develop the proposed architecture, scope, assumptions and deliverables.",
  },
  {
    number: "03",
    title: "Engineer",
    description: "Complete the agreed design, integration and verification activities.",
  },
  {
    number: "04",
    title: "Improve",
    description: "Review performance and identify practical next steps for optimization.",
  },
];

function EngineeringServicesPage() {
  const { openModal } = useModals();

  return (
    <main className="min-h-screen bg-background">
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] items-end gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              INDUS / Engineering Services
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold uppercase leading-[.98] tracking-tight sm:text-5xl lg:text-7xl">
              Precision Motion. Smarter Manufacturing.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
              Engineering services for the design, integration and improvement of motion
              subsystems, robotic equipment and industrial automation systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90"
                onClick={() => openModal("engineer")}
              >
                Discuss Your Project <ArrowRight size={15} className="ml-2" />
              </Button>
              <a
                href="#service-portfolio"
                className="inline-flex h-12 items-center gap-2 border border-surface-foreground/30 px-5 text-xs font-bold uppercase tracking-wide text-surface-foreground transition-colors hover:border-signal hover:text-signal"
              >
                Explore Services <ArrowDownRight size={15} />
              </a>
            </div>
          </div>
          <div className="border-l-2 border-signal pl-6 lg:mb-2">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-signal">
              From concept to lifecycle
            </p>
            <p className="mt-3 max-w-lg text-sm leading-7 text-surface-foreground/75">
              Start with a defined manufacturing challenge. Align on technical requirements,
              engineering scope and verification criteria, then build a practical path forward.
            </p>
          </div>
        </div>
      </section>

      <section id="service-portfolio" className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Service Portfolio / 01–07
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Engineering Capabilities
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:justify-self-end">
              Choose a service based on your application, equipment or production challenge.
              Scope, deliverables, schedule and verification requirements are defined for each
              engagement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  id={service.id}
                  key={service.id}
                  className="group flex h-full flex-col border border-border bg-card p-6 transition-colors hover:border-signal sm:p-7"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-5">
                    <span className="text-xs font-bold tracking-[.2em] text-signal">
                      SERVICE {service.number}
                    </span>
                    <Icon
                      size={21}
                      strokeWidth={1.6}
                      className="text-muted-foreground transition-colors group-hover:text-signal"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {service.summary}
                  </p>
                  <div className="mt-6 border-t border-border/60 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
                      Typical scope areas
                    </p>
                    <ul className="mt-4 space-y-3">
                      {service.capabilities.map((capability) => (
                        <li key={capability} className="flex items-start gap-2.5 text-sm leading-6">
                          <CheckCircle2 size={15} className="mt-1 shrink-0 text-signal" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-7">
                    <div className="mb-4 flex items-start gap-2 border-t border-border/60 pt-4">
                      <Factory size={15} className="mt-0.5 shrink-0 text-signal" />
                      <p className="text-xs leading-5 text-muted-foreground">
                        <span className="font-semibold text-foreground">Designed for: </span>
                        {service.audience}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openModal("engineer")}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-signal hover:gap-3"
                    >
                      Discuss this service <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/30 px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Project Method
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              A Clear Path from Requirement to Results
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Each engagement is scoped around the application, project complexity, available
              information and agreed acceptance criteria. Timing and deliverables are confirmed
              during project definition.
            </p>
          </div>
          <div className="mt-10 grid gap-0 border border-border bg-card sm:grid-cols-2 xl:grid-cols-4">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className={`p-6 sm:p-7 ${index > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""}`}
              >
                <span className="font-display text-3xl font-bold text-signal">{phase.number}</span>
                <h3 className="mt-4 font-display text-xl font-bold uppercase">{phase.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Engineering Principles
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Defined Requirements. Verifiable Engineering.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Engineering decisions should be traceable to application requirements, component
              data, risk assessments and agreed acceptance criteria.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border p-5">
              <Gauge size={22} className="text-signal" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase">Performance Criteria</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Define measurable targets such as cycle time, payload, repeatability and duty cycle
                for the specific application.
              </p>
            </div>
            <div className="border border-border p-5">
              <ClipboardCheck size={22} className="text-signal" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase">Technical Evidence</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use applicable datasheets, calculations, test records and validation documents to
                support engineering decisions.
              </p>
            </div>
            <div className="border border-border p-5">
              <ShieldCheck size={22} className="text-signal" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase">Safety by Design</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Identify relevant hazards and safety requirements early, with validation planned
                for the agreed system scope.
              </p>
            </div>
            <div className="border border-border p-5">
              <Layers3 size={22} className="text-signal" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase">System Integration</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Consider mechanical, electrical, controls, tooling and operating interfaces as
                parts of one system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="technical-grid bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Start a Technical Discussion
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              What Are You Trying to Engineer?
            </h2>
            <p className="mt-4 text-sm leading-7 text-surface-foreground/70">
              Tell us about your machine, motion subsystem or production challenge. We can use your
              requirements to define the appropriate next step.
            </p>
          </div>
          <Button
            className="h-12 shrink-0 rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90"
            onClick={() => openModal("engineer")}
          >
            Discuss Your Requirements <ArrowRight size={15} className="ml-2" />
          </Button>
        </div>
      </section>
    </main>
  );
}
