import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, GitCompare, Wrench, MessageSquare, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentComparisonTool } from "@/components/engineering/ComponentComparisonTool";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/compare")({
  head: () =>
    buildSeoMeta({
      title: "Component Comparison Tool | INDUS Industrial Robotics",
      description:
        "Side-by-side engineering comparison matrix for industrial robotic components, precision reducers, actuators, and AGV wheel drives. Compare verified ratings, backlash, payload, and fieldbuses.",
      path: "/products/compare",
    }),
  component: ProductComparePage,
});

function ProductComparePage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Hero Section */}
      <section className="border-b border-[#E5EAF1] bg-white px-5 py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.15em] text-[#155EEF] hover:underline"
            >
              <ArrowLeft size={13} /> Product Portfolio
            </Link>
            <span className="text-[#667085]/40">/</span>
            <span className="text-xs uppercase tracking-wider text-[#667085]">
              Technical Comparison Matrix
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-[#155EEF] border border-[#155EEF]/20">
              Multi-Variant Engineering Matrix
            </span>
            <span className="text-xs font-mono text-[#667085]">
              Verified Parameter Correlation (Continuous vs Peak Ratings)
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
            Component Comparison Tool
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#667085] sm:text-base">
            Compare up to 4 components side-by-side across verified mechanical kinematics, torque/force ratings,
            fieldbus compatibility, ISO tolerances, and operating boundaries. Select pre-engineered benchmark sets or build custom comparisons.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="h-10 rounded-md bg-[#155EEF] px-5 font-bold uppercase text-white hover:bg-[#124bbf] text-xs shadow-sm"
            >
              <Link to="/application-finder">
                <Compass size={14} className="mr-1.5" /> Find the Right Solution
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-md border-[#D0D5DD] bg-white px-5 font-bold uppercase text-[#172033] hover:bg-[#F8FAFC] text-xs transition-colors"
              onClick={() => openModal("engineer", { categoryName: "Component Comparison Consultation" })}
            >
              <Wrench size={14} className="mr-1.5 text-[#155EEF]" /> Request Engineering Consultation
            </Button>
            <Button
              variant="ghost"
              className="h-10 px-4 text-xs font-semibold text-[#16A34A] hover:bg-[#F0FDF4]"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5" /> Direct WhatsApp Desk
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px] space-y-12">
          <ComponentComparisonTool />

          {/* Motion Studio Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
                Automated Kinematic Sizing
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
                Need Dynamic Physics Sizing for Your Architecture?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-2xl">
                Run ball screw lead formulas, calculate reflected inertia ratios (JL/JM ≤ 5:1), and generate a certified engineering passport in INDUS Motion Studio.
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
