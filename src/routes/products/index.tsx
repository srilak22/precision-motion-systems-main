import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Move3d, Zap, Settings2, Bot, Box, Cpu, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/robotics";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import heroImage from "@/assets/robotics-hero.jpg";
import componentsImage from "@/assets/robotic-components.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";

const categoryImages: Record<string, string> = {
  "actuators-linear-modules": componentsImage,
  "precision-gear-reducers": componentsImage,
  "mobile-robotics-agv-amr": mobileImage,
  "robotic-arms-articulated": armImage,
  "industrial-robots-turnkey": heroImage,
  "multi-axis-motion-controllers": componentsImage,
};

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Industrial Robotics Product Portfolio | INDUS Industrial Robotics" },
      {
        name: "description",
        content:
          "Explore the complete INDUS industrial robotics portfolio: actuators, precision reducers, robotic wheels, robotic arms, industrial robots, and multi-axis control systems.",
      },
    ],
  }),
  component: ProductsIndexPage,
});

export function ProductsIndexPage() {
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
            Engineering Catalogue
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Robotics & Motion Control Portfolio
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            From zero-backlash joint reducers and guided linear actuators to articulated 6-axis
            robot arms and deterministic multi-axis controllers. Engineered for extreme duty cycles,
            sub-millimeter precision, and industrial reliability.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
              onClick={() => openModal("quote")}
            >
              Request a Commercial Quote <ArrowRight size={14} className="ml-1.5" />
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
              onClick={() => openModal("engineer")}
            >
              Talk to an Application Engineer
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              onClick={handleWhatsApp}
            >
              <MessageSquare size={14} className="mr-1.5 text-signal" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* 6 Category Portfolios */}
      <section className="px-5 py-20 lg:px-10 lg:py-28 bg-background">
        <div className="mx-auto max-w-[1440px] space-y-20">
          {categories.map((category, idx) => {
            const categoryProducts = products.filter((p) => p.categorySlug === category.slug);

            return (
              <div
                key={category.slug}
                id={category.slug}
                className="group border border-border bg-card p-8 sm:p-12 transition-all hover:border-signal/40"
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-center border-b border-border pb-8">
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
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{category.intro}</p>

                    <div className="mt-6 flex shrink-0 flex-col gap-2 sm:flex-row">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-none border-border font-bold uppercase text-xs"
                      >
                        <Link to={`/products/${category.slug}`}>
                          Category Overview <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </Button>
                      <Button
                        className="rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
                        onClick={() => openModal("quote", { productName: category.title })}
                      >
                        Quote {category.title}
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-hidden border border-border/60 bg-surface-dark h-48 lg:h-56 relative">
                    <img
                      src={categoryImages[category.slug] || componentsImage}
                      alt={`${category.title} industrial robotics hardware`}
                      className="size-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-signal bg-surface-dark/90 px-2 py-1 border border-signal/30">
                      {category.title} Equipment
                    </span>
                  </div>
                </div>

                {/* Sub-Families Grid */}
                <div className="mt-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    Available Technology Families
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {category.subFamilies.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/products/${category.slug}/${sub.slug}`}
                        className="group flex flex-col justify-between border border-border/80 bg-background p-5 transition-all hover:border-signal hover:bg-surface-elevated/30"
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
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
