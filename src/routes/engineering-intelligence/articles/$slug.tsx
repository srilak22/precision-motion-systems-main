import React, { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  MessageSquare,
  Share2,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { knowledgeArticles, KnowledgeArticle } from "@/data/knowledgeHub";
import { engineeringDossiers } from "@/data/engineeringData";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { TechnicalSchematicDiagram } from "@/components/engineering/TechnicalSchematicDiagram";

export const Route = createFileRoute("/engineering-intelligence/articles/$slug")({
  loader: ({ params }) => {
    const article = knowledgeArticles.find((a) => a.slug === params.slug);
    if (!article) {
      throw notFound();
    }
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    return buildSeoMeta({
      title: `${article?.title || "Technical Article"} | INDUS Engineering Intelligence`,
      description:
        article?.summary ||
        "Peer-reviewed industrial robotics and precision motion technical paper.",
      path: `/engineering-intelligence/articles/${article?.slug || ""}`,
      ogType: "article",
    });
  },
  component: KnowledgeArticleDetailPage,
});

function KnowledgeArticleDetailPage() {
  const { article } = Route.useLoaderData();
  const { openModal } = useModals();

  useEffect(() => {
    trackDigitalPresence("knowledge_article_view", article.title, article.category);
    trackClarityEvent("knowledge_article_view");
  }, [article.title, article.category]);

  const handleConsultEngineer = () => {
    trackDigitalPresence(
      "resource_enquiry_click",
      `Article Consult - ${article.title}`,
      article.slug,
    );
    trackClarityEvent("resource_enquiry_click");
    openModal("engineer");
  };

  const handleWhatsApp = () => {
    trackDigitalPresence("whatsapp_click", `Article WhatsApp - ${article.title}`, article.slug);
    trackClarityEvent("whatsapp_click");
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "general",
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const otherArticles = knowledgeArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header & Breadcrumbs */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-12 text-surface-foreground lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1200px]">
          {/* Breadcrumb nav */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link to="/" className="hover:text-signal transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/engineering-intelligence" className="hover:text-signal transition-colors">
              Engineering Intelligence
            </Link>
            <span>/</span>
            <Link
              to="/engineering-intelligence"
              search={{ section: "knowledge" }}
              className="hover:text-signal transition-colors"
            >
              Knowledge Hub
            </Link>
            <span>/</span>
            <span className="text-signal truncate max-w-[300px]">{article.title}</span>
          </nav>

          {/* Badges Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded bg-signal/15 border border-signal/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-signal">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-surface-elevated px-3 py-1 font-mono text-xs text-muted-foreground border border-border/40">
              <Clock size={13} className="text-signal" />
              {article.readingTimeMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-surface-elevated px-3 py-1 font-mono text-xs text-muted-foreground border border-border/40">
              <Calendar size={13} className="text-signal" />
              Updated {article.updatedDate}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-xs text-emerald-400">
              <ShieldCheck size={13} />
              {article.reviewStatus}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-surface-foreground/80 sm:text-lg">
            {article.subtitle}
          </p>

          {/* Author Metadata Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded bg-signal/10 border border-signal/30 text-signal font-mono font-bold">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <span className="block font-sans text-sm font-bold text-white">
                  {article.author.name}
                </span>
                <span className="block font-mono text-xs text-muted-foreground">
                  {article.author.role} &bull; {article.author.department}
                </span>
              </div>
            </div>

            {/* Referenced Standards */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">Standards:</span>
              {article.standardsReferenced.map((std) => (
                <span
                  key={std}
                  className="rounded border border-border/60 bg-surface-dark px-2 py-0.5 font-mono text-[11px] text-surface-foreground/90"
                >
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1fr_340px]">
          {/* Left Column: Article Body */}
          <article className="min-w-0">
            {/* Executive Abstract Box */}
            <div className="rounded-lg border border-signal/30 bg-surface-elevated/20 p-6 lg:p-8">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
                Abstract & Engineering Scope
              </span>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
                {article.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 pt-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Sections */}
            <div className="mt-10 space-y-12">
              {article.sections.map((section, idx) => (
                <section
                  key={section.heading}
                  id={`section-${idx}`}
                  className="scroll-mt-24 border-b border-border/40 pb-10 last:border-b-0"
                >
                  <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                    {section.heading}
                  </h2>

                  {section.subheading && (
                    <p className="mt-1 font-mono text-xs font-semibold text-signal uppercase tracking-wider">
                      {section.subheading}
                    </p>
                  )}

                  {/* Paragraphs */}
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-foreground/80">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Optional Technical Schematic Diagram */}
                  {section.diagramType && (
                    <TechnicalSchematicDiagram type={section.diagramType} />
                  )}

                  {/* Formulas Block */}
                  {section.keyFormulas && section.keyFormulas.length > 0 && (
                    <div className="my-6 space-y-3">
                      {section.keyFormulas.map((f) => (
                        <div
                          key={f.label}
                          className="rounded border border-border bg-card p-4 font-mono shadow-xs"
                        >
                          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
                            <span className="font-bold text-signal">{f.label}</span>
                            <span>Formula</span>
                          </div>
                          <div className="py-3 text-center text-sm font-bold text-foreground sm:text-base tracking-wide">
                            {f.formula}
                          </div>
                          <p className="text-xs text-muted-foreground border-t border-border/50 pt-2 font-sans">
                            {f.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technical Specs Comparison Table */}
                  {section.technicalSpecsTable && section.technicalSpecsTable.length > 0 && (
                    <div className="my-6 overflow-x-auto rounded border border-border bg-card shadow-xs">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="border-b border-border bg-muted/60 text-muted-foreground">
                          <tr>
                            <th className="p-3 font-bold uppercase">Engineering Metric</th>
                            <th className="p-3 font-bold uppercase">Value / Tolerance</th>
                            <th className="p-3 font-bold uppercase">Condition / Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {section.technicalSpecsTable.map((row) => (
                            <tr key={row.label} className="hover:bg-muted/30 transition-colors">
                              <td className="p-3 font-semibold text-foreground">{row.label}</td>
                              <td className="p-3 text-signal">{row.value}</td>
                              <td className="p-3 text-muted-foreground">{row.notes || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Engineering Callout */}
                  {section.callout && (
                    <div
                      className={`my-6 rounded border p-4 text-xs ${
                        section.callout.type === "warning"
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                          : section.callout.type === "best-practice"
                            ? "border-signal/40 bg-signal/10 text-signal"
                            : "border-border bg-muted text-foreground"
                      }`}
                    >
                      <strong className="block font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                        {section.callout.type.toUpperCase()}: {section.callout.title}
                      </strong>
                      <p className="leading-relaxed font-sans text-foreground/90">
                        {section.callout.text}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Contextual Application Engineering Callout */}
            <div className="mt-12 rounded-lg border border-signal/50 bg-surface-dark p-8 text-surface-foreground shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
                    Direct Application Engineering Support
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white">
                    Need Custom Calculations for Your Machine?
                  </h3>
                  <p className="mt-2 text-sm text-surface-foreground/80 max-w-xl">
                    Our technical team provides kinematic sizing, finite element torsional analysis, and fieldbus latency audits for your exact payload and cycle parameters.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Button
                    className="h-12 rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90"
                    onClick={handleConsultEngineer}
                  >
                    <Wrench size={15} className="mr-2" />
                    Consult Engineer
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
                    onClick={handleWhatsApp}
                  >
                    <MessageSquare size={15} className="mr-2 text-signal" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Right Column: Sidebar */}
          <aside className="space-y-8">
            {/* Table of Contents Sticky Widget */}
            <div className="sticky top-28 rounded-lg border border-border bg-card p-6 shadow-sm">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block border-b border-border pb-3">
                Table of Contents
              </span>
              <ul className="mt-4 space-y-2.5 text-xs font-medium">
                {article.sections.map((section, idx) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${idx}`}
                      className="block text-muted-foreground hover:text-signal transition-colors leading-snug"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Related Verified Products Card */}
              <div className="mt-8 border-t border-border pt-6">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-signal block mb-3">
                  Verified Component Match
                </span>
                <div className="space-y-3">
                  {article.relatedProducts.map((prod) => {
                    const dossier = engineeringDossiers[prod.id];
                    return (
                      <div
                        key={prod.id}
                        className="rounded border border-border/80 bg-muted/40 p-3 hover:border-signal transition-colors"
                      >
                        <Link
                          to="/products/$category/$id"
                          params={{ category: prod.categorySlug, id: prod.id }}
                          className="font-bold text-xs text-foreground hover:text-signal transition-colors block"
                        >
                          {prod.name} &rarr;
                        </Link>
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                          {prod.description}
                        </p>
                        {dossier && (
                          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-1.5">
                            <span>{dossier.datasheet.documentNumber}</span>
                            <span className="text-emerald-500 font-semibold">
                              {dossier.datasheet.verificationLevel}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Back to Hub button */}
              <div className="mt-6 border-t border-border pt-4">
                <Link
                  to="/engineering-intelligence"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-signal hover:underline"
                >
                  <ArrowLeft size={13} />
                  Back to Intelligence Center
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Technical Papers */}
      {otherArticles.length > 0 && (
        <section className="border-t border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-signal">
                  Knowledge Hub
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase text-white">
                  Related Engineering Papers
                </h3>
              </div>
              <Link
                to="/engineering-intelligence"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-mono font-bold uppercase text-signal hover:underline"
              >
                View All Papers <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between border border-border/50 bg-surface-elevated/40 p-6 transition-all hover:border-signal"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                      {item.category}
                    </span>
                    <h4 className="mt-2 font-display text-lg font-bold uppercase text-white group-hover:text-signal transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-3 text-xs leading-relaxed text-surface-foreground/75 line-clamp-3">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {item.readingTimeMinutes} min read
                    </span>
                    <Link
                      to="/engineering-intelligence/articles/$slug"
                      params={{ slug: item.slug }}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase text-signal hover:underline"
                    >
                      Read Paper <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
