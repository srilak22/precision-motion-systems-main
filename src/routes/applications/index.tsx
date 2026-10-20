import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Factory, MessageSquare, Wrench, Search, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { all18ApplicationsData } from "@/data/applications";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";

import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/applications/")({
  head: () =>
    buildSeoMeta({
      title: "18 Industrial Robotics Application Areas | INDUS Robotics",
      description:
        "Explore 18 industrial manufacturing and robotics sectors with 221 verified engineering use cases: Automotive, Aerospace, Semiconductor, Mining, Medical, Packaging, and Humanoids.",
      path: "/applications",
    }),
  component: ApplicationsIndexPage,
});

function ApplicationsIndexPage() {
  const { openModal } = useModals();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredApplications = React.useMemo(() => {
    if (!searchQuery.trim()) return all18ApplicationsData;
    const q = searchQuery.toLowerCase();
    return all18ApplicationsData.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.heroSubtitle.toLowerCase().includes(q) ||
        app.typicalApplications.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            Industry Sectors & Verticals
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Industrial Robotics Applications
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Every manufacturing vertical has distinct cycle takt times, contamination limits, and
            mechanical loading environments. We engineer automation hardware tailored specifically
            to these real-world industrial constraints.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("engineer")}
            >
              <Wrench size={15} className="mr-2" />
              Discuss Industry Requirements
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

      {/* Applications Cards Grid */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1440px]">
          {/* Search & Stats Bar */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.22em] text-primary">
                Comprehensive Automation Directory
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
                18 Manufacturing Verticals ({filteredApplications.length} Shown)
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Covering 221 researched industrial use cases with validated kinematic architectures and standards.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vertical, task, or process..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((app, idx) => {
              const useCaseCount = app.useCases?.length || 12;
              return (
                <div
                  key={app.id}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                      <span className="text-xs font-bold uppercase tracking-[.2em] text-primary font-mono">
                        Sector {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-mono font-bold text-primary">
                        {useCaseCount} Use Cases
                      </span>
                    </div>

                    <h2 className="mt-5 font-display text-2xl uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                      {app.title}
                    </h2>

                    <p className="mt-2 text-xs font-semibold text-primary leading-5">
                      {app.heroSubtitle}
                    </p>

                    <p className="mt-4 text-xs leading-6 text-muted-foreground line-clamp-3">
                      {app.shortDescription}
                    </p>

                    <div className="mt-6 space-y-2 border-t border-border/30 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Sample Production Tasks
                      </span>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {app.typicalApplications.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="size-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
                    <Link
                      to="/applications/$applicationId"
                      params={{ applicationId: app.id }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Explore {useCaseCount} Use Cases <ArrowRight size={13} className="ml-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
