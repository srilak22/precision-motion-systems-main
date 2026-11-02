import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cpu, ShieldCheck, Wrench, MessageSquare, ArrowRight, Calendar, Move3d, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndusMotionStudio } from "@/components/engineering/IndusMotionStudio";
import { InteractiveRobotAnatomy } from "@/components/engineering/InteractiveRobotAnatomy";
import { DualArmWorkcellSimulator } from "@/components/engineering/DualArmWorkcellSimulator";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/common/CtaBanner";

export const Route = createFileRoute("/technology/motion-studio")({
  head: () =>
    buildSeoMeta({
      title: "INDUS Motion Studio — Interactive Robotics Sizing & 7th-Axis Workcell Platform",
      description:
        "Unified multi-axis motion sizing, 7th-axis linear track simulation, dual-robot kinematic coordination, and specification verification platform. Calculate dynamic inertia matching and export engineering dossiers.",
      path: "/technology/motion-studio",
    }),
  component: MotionStudioPage,
});

function MotionStudioPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Breadcrumbs */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2">
            <Link
              to="/technology"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.2em] text-signal hover:underline"
            >
              <ArrowLeft size={13} /> Technology Stack
            </Link>
            <span className="text-surface-foreground/40">/</span>
            <span className="text-xs uppercase tracking-wider text-surface-foreground/60">
              Interactive Kinematic Sizing &amp; Simulation
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              Kinematics &bull; Dynamics &bull; 7th-Axis Simulation
            </span>
            <span className="text-xs font-mono text-surface-foreground/50">
              ISO 9283 &bull; DIN 3990 Certified Architecture
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl">
            INDUS Motion Studio
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/75 sm:text-base">
            Unified robotics engineering platform: simulate 7th-axis dual-arm welding cells, tune inverse kinematics axes (J1–J6), calculate load inertia ratios ($J_L/J_M &lt; 10:1$), and inspect precision mechanical anatomy.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-11 rounded-none bg-signal px-6 font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer", { categoryName: "Kinematic Review" })}
            >
              <Wrench size={14} className="mr-1.5" /> Request Kinematic Review
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-xs text-surface-foreground hover:border-signal hover:text-signal"
            >
              <Link to="/book-consultation">
                <Calendar size={14} className="mr-1.5 text-signal" /> Book Engineering Sizing
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-xs text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" /> WhatsApp Motion Specialist
            </Button>
          </div>
        </div>
      </section>

      {/* Main Studio Interactive Components */}
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-16 space-y-16">
        {/* Module 1: 7th-Axis Dual-Arm Workcell Simulator (Reference Image 4) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#155EEF] block">
                FLAGSHIP 3D SIMULATION WORKBENCH
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-foreground">
                7th-Axis Dual-Robot Workcell Simulation
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Synchronized Linear Axis E1 &bull; Fixture Rotational Axis A &bull; Inverse Kinematics
            </p>
          </div>
          <DualArmWorkcellSimulator />
        </section>

        {/* Module 2: Sizing Calculations & Component Selection */}
        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#155EEF] block">
              MULTI-AXIS PHYSICS ENGINE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-foreground">
              Dynamic Sizing &amp; Motor-Reducer Selection
            </h2>
          </div>
          <IndusMotionStudio />
        </section>

        {/* Module 3: Cross-Sectional Robot Anatomy */}
        <section className="space-y-4">
          <div className="border-b border-border pb-3">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#155EEF] block">
              INTERNAL MECHANICAL ARCHITECTURE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-foreground">
              Interactive 6-Axis Robot Anatomy
            </h2>
          </div>
          <InteractiveRobotAnatomy />
        </section>

        {/* Connected Journey Banner */}
        <CtaBanner
          variant="precision"
          badge="VALIDATED ENGINEERING SUPPORT"
          headline="Have a Complex Multi-Axis Motion Challenge?"
          description="Submit your cycle takt requirements, payload CAD space claims, and target fieldbus protocol. Our applications team in Chennai will generate a formal kinematic simulation and quotation."
          ctaPrimary={{
            label: "Schedule Engineering Sizing",
            href: "/book-consultation",
          }}
          ctaSecondary={{
            label: "Chat with Indus Bot 2.0",
            href: "/indus-bot",
          }}
        />
      </div>
    </div>
  );
}
