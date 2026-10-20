import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cpu, ShieldCheck, Wrench, MessageSquare, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndusMotionStudio } from "@/components/engineering/IndusMotionStudio";
import { InteractiveRobotAnatomy } from "@/components/engineering/InteractiveRobotAnatomy";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/technology/motion-studio")({
  head: () =>
    buildSeoMeta({
      title: "INDUS Motion Studio — Interactive Robotics Sizing & Architecture Platform",
      description:
        "Unified multi-axis motion sizing, component architecture selection, and specification verification platform. Calculate dynamic inertia matching, evaluate physics models, and generate certified engineering passports.",
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
              Interactive Kinematic Sizing
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              Kinematics &bull; Dynamics &bull; Thermal Envelope
            </span>
            <span className="text-xs font-mono text-surface-foreground/50">
              ISO 9283 &bull; DIN 3990 Certified Architecture
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl">
            INDUS Motion Studio &amp; Robot Anatomy
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/75 sm:text-base">
            Configure multi-axis robotic joints, evaluate load inertia matching, verify wrist moment
            margins, and inspect cross-sectional mechanical anatomy from base slewing rings to 6-axis end-effector flanges.
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
        <IndusMotionStudio />
        <InteractiveRobotAnatomy />
      </div>
    </div>
  );
}
