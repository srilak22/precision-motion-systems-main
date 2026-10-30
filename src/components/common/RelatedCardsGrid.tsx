import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers, Factory, BookOpen, Cpu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RelatedCardItem {
  title: string;
  description?: string;
  href: string;
  category?: "solution" | "industry" | "resource" | "product" | "technology";
  badgeText?: string;
  specs?: string;
}

export interface RelatedCardsGridProps {
  title?: string;
  description?: string;
  cards: RelatedCardItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType<{ className?: string }>> = {
  solution: Layers,
  industry: Factory,
  resource: BookOpen,
  product: Cpu,
  technology: ShieldCheck,
};

const CATEGORY_COLORS: Record<string, { badge: string; text: string }> = {
  solution: { badge: "bg-blue-500/10 border-blue-500/30 text-blue-400", text: "text-blue-500" },
  industry: { badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", text: "text-emerald-500" },
  resource: { badge: "bg-amber-500/10 border-amber-500/30 text-amber-400", text: "text-amber-500" },
  product: { badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", text: "text-cyan-500" },
  technology: { badge: "bg-purple-500/10 border-purple-500/30 text-purple-400", text: "text-purple-500" },
};

export function RelatedCardsGrid({
  title = "Related Capabilities & Resources",
  description = "Explore complementary systems, engineering specifications, and industry applications.",
  cards,
  columns = 3,
  className,
}: RelatedCardsGridProps) {
  const colClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={cn("py-12 my-8", className)}>
      <div className="mb-8">
        <span className="section-label mb-2 block">CONNECTED CAPABILITIES</span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </div>

      <div className={cn("grid gap-6", colClasses[columns])}>
        {cards.map((card, idx) => {
          const catKey = card.category || "solution";
          const IconComp = CATEGORY_ICONS[catKey] || Layers;
          const colors = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.solution;

          return (
            <Link
              key={idx}
              to={card.href}
              className="card-industrial group flex flex-col justify-between p-6 rounded-none relative overflow-hidden bg-card border border-border hover:border-precision-blue/50 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border", colors.badge)}>
                    <IconComp className="w-3 h-3" />
                    {card.badgeText || card.category || "Exploration"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-precision-blue group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-precision-blue transition-colors">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>

              {card.specs && (
                <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
                  {card.specs}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
