import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layers, Wrench, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentArchitectureExplorer } from "@/components/engineering/ComponentArchitectureExplorer";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/technology/architecture-explorer")({
  head: () =>
    buildSeoMeta({
      title: "Component-to-System Architecture Explorer | INDUS Robotics",
      description:
        "Interactive 5-layer industrial robotics architecture explorer. Map mechanical kinematics, precision drives, fieldbuses, trajectory interpolation, and safety enclosures into complete workcells.",
      path: "/technology/architecture-explorer",
    }),
  component: ArchitectureExplorerPage,
});

function ArchitectureExplorerPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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
              System Engineering
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              Interactive 5-Tier Hardware Stack
            </span>
            <span className="text-xs font-mono text-surface-foreground/50">
              Deterministic Fieldbus &amp; Motion Mapping
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl">
            Component-to-System Architecture Explorer
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/75 sm:text-base">
            Deconstruct complex robotic automation cells across five integrated engineering layers:
            physical mechanical kinematics, precision servo drivetrains, deterministic fieldbus networks,
            centralized trajectory controllers, and supervisory safety architectures.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              className="h-11 rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90 text-xs"
              onClick={() => openModal("engineer", { categoryName: "System Architecture Design" })}
            >
              <Wrench size={14} className="mr-1.5" /> Consult System Architect
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal text-xs"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" /> Quick Architecture Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Tool Component */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px] space-y-12">
          <ComponentArchitectureExplorer />

          {/* Motion Studio Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                Unified Automation Sizing
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
                Ready to Size Drivetrain Components For This Architecture?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-2xl">
                Transition seamlessly from architectural planning to kinetic dimensioning. Enter your payload mass, linear speeds, and stroke lengths in INDUS Motion Studio to calculate inertia matching and export an Engineering Passport.
              </p>
            </div>
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/90 font-bold uppercase text-xs h-11 px-6 shadow-sm shrink-0"
            >
              <Link to="/technology/motion-studio">
                Launch Motion Studio →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
