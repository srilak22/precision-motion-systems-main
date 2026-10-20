import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Move3d, Zap, Settings2, Bot, Box, Cpu, MessageSquare, ShieldCheck, Layers, Wrench, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp, StaggerContainer, StaggerItem, HoverMotion } from "@/components/ui/motion";
import { categories, products } from "@/data/robotics";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { getAllCatalogueLines } from "@/data/productCatalogue";
import { useState } from "react";

import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Robotics Product Portfolio (12 Lines) | INDUS Robotics",
      description:
        "Comprehensive industrial robotics component catalogue: 12 product lines with 244 research-backed ranges including precision reducers, servo motors, linear motion, and safety systems.",
      path: "/products",
    }),
  component: ProductsIndexPage,
});

function ProductsIndexPage() {
  const { openModal } = useModals();
  const catalogueLines = getAllCatalogueLines();
  const [lineSearch, setLineSearch] = useState("");

  const filteredLines = catalogueLines.filter((l) =>
    l.name.toLowerCase().includes(lineSearch.toLowerCase()) ||
    l.shortDescription.toLowerCase().includes(lineSearch.toLowerCase()) ||
    l.engineeringStandard.toLowerCase().includes(lineSearch.toLowerCase())
  );

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <FadeUp distance={20}>
            <div className="inline-flex items-center gap-2 border border-signal/30 bg-signal/10 px-3 py-1 mb-4">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-signal">
                12 Master Product Lines · 244 Verified Engineering Ranges
              </span>
            </div>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
              Robotics & Motion Control Portfolio
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
              Structured mechatronic catalogue adhering to ISO 9283, DIN 3990, IEC 61800, and ISO 13849-1 standards. 
              Each line features 20–25 genuinely distinct engineering configurations with verified operating principles, 
              repeatability tolerances, and physical selection criteria.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <HoverMotion variant="button">
                <Button
                  className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
                  onClick={() => openModal("quote")}
                >
                  Request a Commercial Quote <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </HoverMotion>
              <HoverMotion variant="button">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
                >
                  <Link to="/products/$category" params={{ category: "precision-reducers" }}>
                    Explore Precision Reducers (Priority)
                  </Link>
                </Button>
              </HoverMotion>
              <HoverMotion variant="button">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-none border-signal/40 bg-signal/5 px-6 font-bold uppercase text-signal hover:bg-signal/20"
                >
                  <Link to="/technology/intelligence-explorer">
                    Robotics Intelligence Framework (L0–L5)
                  </Link>
                </Button>
              </HoverMotion>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 12 Master Product Lines Grid */}
      <section className="border-b border-border/40 bg-surface-elevated/20 px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Comprehensive Engineering Catalogue
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                12 Core Mechatronic Product Lines
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Explore 244 distinct, research-backed component ranges. Every range specifies real physical operating principles, 
                adherence to international automation standards, and strict verification states.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={lineSearch}
                onChange={(e) => setLineSearch(e.target.value)}
                placeholder="Filter product lines or standards..."
                className="w-full h-11 pl-10 pr-4 bg-background border border-border text-xs font-mono focus:outline-none focus:border-signal"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLines.map((line, idx) => (
              <div
                key={line.id}
                className="group flex flex-col justify-between border border-border bg-card p-6 transition-all hover:border-signal hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-3">
                    <span className="font-bold text-signal">LINE {String(idx + 1).padStart(2, "0")}</span>
                    <span className="border border-border/60 bg-muted/40 px-2 py-0.5">
                      {line.ranges.length} Ranges
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold uppercase text-foreground group-hover:text-signal transition-colors">
                    {line.name}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {line.shortDescription}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/40">
                    <span className="text-[10px] font-mono text-signal block mb-1">STANDARD</span>
                    <span className="text-[11px] font-mono text-muted-foreground line-clamp-1">
                      {line.engineeringStandard}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <Link
                    to="/products/$category"
                    params={{ category: line.id }}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    View {line.ranges.length} Ranges <ArrowRight size={13} className="ml-1.5" />
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-[11px] font-bold uppercase text-muted-foreground hover:text-signal hover:bg-signal/10 rounded-none"
                    onClick={() => openModal("quick", { productName: line.name })}
                  >
                    Enquire
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Category Portfolios (Extended Details) */}
      <section className="px-5 py-20 lg:px-10 lg:py-24 bg-background">
        <div className="mx-auto max-w-[1440px] space-y-20">
          {categories.map((category, idx) => {
            const categoryProducts = products.filter((p) => p.categorySlug === category.slug);

            return (
              <FadeUp key={category.slug} distance={24}>
                <div
                  id={category.slug}
                  className="border border-border bg-card p-8 sm:p-12 transition-all hover:border-signal/40"
                >
                  <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
                    <div className="max-w-3xl">
                      <span className="text-xs font-bold uppercase tracking-[.2em] text-signal">
                        Domain 0{idx + 1}
                      </span>
                      <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
                        {category.title}
                      </h2>
                      <p className="mt-2 font-display text-lg uppercase text-signal">
                        {category.positioning}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        {category.intro}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <HoverMotion variant="button">
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-none border-border font-bold uppercase text-xs"
                        >
                          <Link to="/products/$category" params={{ category: category.slug }}>
                            Category Overview <ArrowRight size={14} className="ml-1" />
                          </Link>
                        </Button>
                      </HoverMotion>
                      <HoverMotion variant="button">
                        <Button
                          className="rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
                          onClick={() => openModal("quote", { productName: category.title })}
                        >
                          Quote {category.title}
                        </Button>
                      </HoverMotion>
                    </div>
                  </div>

                  {/* Sub-Families Grid */}
                  <div className="mt-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Available Technology Families
                    </h3>
                    <StaggerContainer
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                      staggerDelay={0.06}
                    >
                      {category.subFamilies.map((sub) => (
                        <StaggerItem key={sub.slug} className="h-full">
                          <HoverMotion variant="card" className="h-full">
                            <Link
                              to="/products/$category/$id"
                              params={{ category: category.slug, id: sub.slug }}
                              className="group flex h-full flex-col justify-between border border-border/80 bg-background p-5 transition-all hover:border-signal hover:bg-surface-elevated/30"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <h4 className="font-display text-lg uppercase text-foreground group-hover:text-signal">
                                    {sub.name}
                                  </h4>
                                  <ArrowRight
                                    size={13}
                                    className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                                  />
                                </div>
                                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                  {sub.description}
                                </p>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-1 border-t border-border/40 pt-3">
                                {sub.specsPreview.map((spec) => (
                                  <span
                                    key={spec}
                                    className="border border-border bg-muted/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </Link>
                          </HoverMotion>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>
    </div>
  );
}
