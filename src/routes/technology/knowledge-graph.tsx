import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Network, Bot, Wrench, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeGraphExplorer } from "@/components/engineering/KnowledgeGraphExplorer";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/technology/knowledge-graph")({
  head: () =>
    buildSeoMeta({
      title: "Robotics Knowledge Graph & Future Agentic Network | INDUS Robotics",
      description:
        "Semantic knowledge network and future agentic foundation for industrial robotics. Interconnecting 12 product lines, 244 ranges, 18 application verticals, 221 use cases, and 10 future agent specifications.",
      path: "/technology/knowledge-graph",
    }),
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-24">
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
              Information Architecture
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-signal/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              Layer B &amp; Layer C Architecture
            </span>
            <span className="text-xs font-mono text-surface-foreground/50">
              Robotics Knowledge Graph &amp; Future Agentic Network Readiness
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl">
            Robotics Engineering Knowledge Graph
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/75 sm:text-base">
            Every component, reduction ratio, torque rating, and industrial application is mapped into an interconnected 
            semantic network with stable identifiers, SI units, and traceable ISO/DIN standards. 
            Structured to support future autonomous engineering agents without unsupervised deployment.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-11 rounded-none bg-signal px-6 font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={14} className="mr-1.5" /> Consult Knowledge Architect
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-xs text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" /> WhatsApp Engineering
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-none border-signal/40 bg-surface-elevated/40 px-5 font-bold uppercase text-xs text-signal hover:border-signal hover:bg-surface-elevated"
            >
              <Link to="/products/precision-reducers">
                Explore Priority Reducers <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Interactive Explorer */}
      <section className="px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <KnowledgeGraphExplorer />
        </div>
      </section>
    </div>
  );
}
