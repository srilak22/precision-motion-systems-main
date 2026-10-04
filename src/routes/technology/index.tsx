import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wrench, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { technologiesData } from "@/data/technologies";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

export const Route = createFileRoute("/technology/")({
  head: () => ({
    meta: [
      { title: "Technology Stack | INDUS Industrial Robotics" },
      {
        name: "description",
        content:
          "Explore the core engineering technologies behind INDUS robotics: mechanics, motion control, servo technology, industrial automation, sensors & feedback, AI robotics, and Industry 4.0.",
      },
    ],
  }),
  component: TechnologyIndexPage,
});

export function TechnologyIndexPage() {
  const { openModal } = useModals();

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            Engineering Pillars &amp; Architecture
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Robotics Technology Stack
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Mechanical kinematics, electrical power regulation, deterministic real-time trajectory
            generation, high-resolution sensing, and edge telemetry operating as one synchronized
            engineering architecture.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={15} className="mr-2" />
              Consult an Application Engineer
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={15} className="mr-2 text-signal" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* Technology Layers — Architecture Stack View */}
      <section className="px-5 py-20 lg:px-10 lg:py-28 bg-background">
        <div className="mx-auto max-w-[1440px]">

          {/* Section intro */}
          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Engineering Stack
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl">
                Technology Architecture
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Every INDUS automation system is built on a proven layered architecture — from
                mechanical precision at the foundation to intelligent software at the system level.
                Each layer is independently validated and designed to interoperate deterministically.
              </p>
            </div>
            <Button
              className="h-11 w-fit rounded-none bg-signal px-6 font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={14} className="mr-2" />
              Discuss Your Architecture
            </Button>
          </div>

          {/* Numbered layer stack */}
          <div className="space-y-1.5">
            {technologiesData.map((tech, idx) => {
              const layerNum = technologiesData.length - idx;
              return (
                <div
                  key={tech.id}
                  className="tech-layer group grid grid-cols-[64px_1fr] border border-border bg-card hover:border-signal/50 hover:bg-muted/20"
                >
                  {/* Layer number column */}
                  <div className="flex flex-col items-center justify-center border-r border-border/50 bg-muted/15 px-2 py-6 text-center transition-colors group-hover:bg-signal/5">
                    <span className="font-display text-2xl font-bold leading-none text-muted-foreground/40 group-hover:text-signal transition-colors">
                      {String(layerNum).padStart(2, "0")}
                    </span>
                    <span className="mt-1 text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Layer
                    </span>
                  </div>

                  {/* Layer content */}
                  <div className="grid gap-4 p-5 sm:grid-cols-[1.6fr_1fr_auto] sm:items-center">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[.22em] text-signal/60">
                        Technology Pillar 0{idx + 1}
                      </p>
                      <h3 className="mt-1 font-display text-2xl uppercase tracking-wide text-foreground transition-colors group-hover:text-signal">
                        {tech.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-5 text-muted-foreground line-clamp-2">
                        {tech.shortDescription}
                      </p>
                    </div>

                    {/* Component chips */}
                    <div className="hidden sm:flex flex-wrap gap-1.5">
                      {tech.mainComponents.slice(0, 3).map((item) => (
                        <span
                          key={item.name}
                          className="border border-border/60 bg-background px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>

                    {/* Hover CTA */}
                    <div className="flex items-center">
                      <Link
                        to={`/technology/${tech.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal opacity-0 transition-opacity group-hover:opacity-100 hover:underline whitespace-nowrap"
                      >
                        Explore <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border pt-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Architecture reads bottom-up: mechanical foundation → intelligent systems
            </span>
            <Link
              to="/technology"
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
            >
              View Full Technology Stack <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
