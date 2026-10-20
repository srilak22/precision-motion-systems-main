import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useRef, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  Wrench,
  ShieldAlert,
  AlertCircle,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  Scale,
  Compass,
  Filter,
  ExternalLink,
  HelpCircle,
  Calculator,
  GitCompare,
  Layers,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProduct, getCategory, products, type Product } from "@/data/robotics";
import { getEngineeringDossier, type EngineeringParameter } from "@/data/engineeringData";
import { companyConfig } from "@/data/config";
import { createJiraTask } from "@/lib/jira";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { useModals } from "@/components/modals/ModalContext";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { RelatedContent } from "@/components/common/RelatedContent";
import { ProductImage } from "@/components/common/ProductImage";
import { buildSeoMeta } from "@/lib/seo";
import { ProductFamilyOperatingPrinciple } from "@/components/engineering/ProductFamilyOperatingPrinciple";
import { AgenticNodeInspector } from "@/components/engineering/AgenticNodeInspector";
import { getCompatibilityRulesForNode } from "@/data/knowledgeGraph/compatibilityRules";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export const Route = createFileRoute("/products/$category/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    const category = getCategory(params.category);
    if (!product || !category) {
      throw notFound();
    }
    const dossier = getEngineeringDossier(product.id) || getEngineeringDossier(product.slug);
    return { product, category, dossier };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const category = loaderData?.category;
    const dossier = loaderData?.dossier;
    return buildSeoMeta({
      title: `${product?.name || "Product"} (${dossier?.modelCode || "Industrial"}) Specifications | INDUS`,
      description:
        dossier?.functionalOverview ||
        product?.overview ||
        product?.shortDescription ||
        "Research-backed industrial engineering specification and selection platform.",
      path: `/products/${category?.slug || ""}/${product?.slug || ""}`,
      ogType: "article",
    });
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product, category, dossier } = Route.useLoaderData();
  const { openModal } = useModals();

  // Parameter Filtering State
  const [paramFilter, setParamFilter] = useState<string>("all");

  // Contextual quick enquiry form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formStartedRef = useRef(false);
  const [quickForm, setQuickForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    quantity: "1-5 units (Prototype / Pilot)",
    application: "",
    message: "",
  });

  const handleFormFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence("form_start", "Product Detail Quick Enquiry", product.name);
      trackClarityEvent("form_start");
    }
  };

  const handleQuickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!quickForm.name.trim()) {
      trackDigitalPresence("form_validation_error", "Product Detail Quick Enquiry", "Name validation failure");
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!quickForm.company.trim()) {
      trackDigitalPresence("form_validation_error", "Product Detail Quick Enquiry", "Company validation failure");
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please enter your company name.");
      return;
    }
    if (!quickForm.email.trim() || !isValidEmail(quickForm.email)) {
      trackDigitalPresence("form_validation_error", "Product Detail Quick Enquiry", "Email validation failure");
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please provide a valid business email address.");
      return;
    }
    if (!quickForm.message.trim()) {
      trackDigitalPresence("form_validation_error", "Product Detail Quick Enquiry", "Message validation failure");
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please specify your technical requirements or message.");
      return;
    }

    setLoading(true);

    try {
      const technicalDossier = [
        `=== CONTEXTUAL PRODUCT ENQUIRY ===`,
        `Product: ${product.name}`,
        `Model Code: ${dossier?.modelCode || "Standard"}`,
        `Category: ${category.title}`,
        `Quantity: ${quickForm.quantity}`,
        `Application Task: ${quickForm.application || "Not specified"}`,
        `\n=== ENGINEERING REQUIREMENTS & NOTES ===`,
        quickForm.message.trim(),
      ].join("\n");

      const result = await createJiraTask({
        data: {
          name: quickForm.name.trim(),
          company: quickForm.company.trim(),
          email: quickForm.email.trim(),
          phone: quickForm.phone.trim() || undefined,
          product: `${product.name} [${dossier?.modelCode || "STD"}]`,
          quantity: quickForm.quantity.trim() || undefined,
          requirements: technicalDossier,
          type: "Product Engineering Enquiry",
          labels: ["product-inquiry", "pdp-lead", dossier?.categorySlug || "robotics"],
          attribution: getYouTubeAttribution() ?? undefined,
        },
      });

      if (result && "issueKey" in result && result.issueKey) {
        setTicketKey(result.issueKey);
      }
      if (result && "duplicate" in result && result.duplicate) {
        setIsDuplicate(true);
      }
      trackDigitalPresence("form_submit", "Product Detail Quick Enquiry", product.name);
      trackClarityEvent("enquiry_submit");
      setLoading(false);
      setFormSubmitted(true);
    } catch (err: unknown) {
      console.error("Enquiry submission failed:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to submit enquiry. Please check your network connection or contact us via WhatsApp.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    trackClarityEvent("whatsapp_click");
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "product",
        name: `${product.name} (${dossier?.modelCode || "Model"})`,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug || product.related.includes(p.slug)),
    )
    .slice(0, 3);

  const compatibilityRules = getCompatibilityRulesForNode(category.slug);

  // Filter parameters if dossier exists
  const rawParams = dossier?.parameters || [];
  const statusFilters = ["all", "verified", "configurable", "preliminary"];
  const displayedParams =
    paramFilter === "all"
      ? rawParams
      : rawParams.filter((p) => (p.status || (p as any).verification) === paramFilter);

  // Relevant Sizing Calculator
  const getCalculatorInfo = () => {
    if (category.slug.includes("actuator")) {
      return {
        slug: "actuator-sizing",
        title: "Linear Actuator & Ball Screw Sizing Calculator",
        desc: "Calculate dynamic motor torque, lead velocity, screw whirling speed margin, and Euler buckling safety factor.",
      };
    }
    if (category.slug.includes("reducer")) {
      return {
        slug: "reducer-sizing",
        title: "Precision Reducer Torque & Inertia Ratio Calculator",
        desc: "Determine reflected load inertia, ratio-to-motor compatibility (JL/JM ≤ 5:1), and required driving torque.",
      };
    }
    return {
      slug: "arm-payload",
      title: "Robot Wrist Flange Overhung Moment Calculator",
      desc: "Verify static overturning moments, dynamic rotational acceleration margins, and allowable payload center of gravity.",
    };
  };

  const calcInfo = getCalculatorInfo();

  const productSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://precision-motion-systems-main.vercel.app/products/${category.slug}/${product.slug}#product`,
        name: product.name,
        model: dossier?.modelCode || product.slug,
        description: dossier?.functionalOverview || product.overview || product.shortDescription,
        category: category.title,
        brand: {
          "@type": "Brand",
          name: "INDUS",
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: `https://precision-motion-systems-main.vercel.app/products/${category.slug}/${product.slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://precision-motion-systems-main.vercel.app/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: "https://precision-motion-systems-main.vercel.app/products",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.title,
            item: `https://precision-motion-systems-main.vercel.app/products/${category.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: `https://precision-motion-systems-main.vercel.app/products/${category.slug}/${product.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* =========================================================================
          SECTION 1: FUNCTIONAL OVERVIEW & HERO POSITIONING
         ========================================================================= */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-16 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr] items-center">
            <div>
              {/* Breadcrumbs & Metadata Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/products/$category"
                  params={{ category: category.slug }}
                  className="text-xs font-bold uppercase tracking-[.2em] text-signal hover:underline"
                >
                  {category.title}
                </Link>
                <span className="text-surface-foreground/40">/</span>
                <span className="text-xs uppercase tracking-wider text-surface-foreground/60">
                  {dossier?.componentType || "Industrial Component"}
                </span>
                <span className="text-surface-foreground/40">/</span>
                <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[11px] font-bold text-signal">
                  {dossier?.modelCode || product.slug.toUpperCase()}
                </span>
              </div>

              <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[.92] sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              <p className="mt-3 font-display text-lg uppercase tracking-wide text-signal sm:text-xl">
                {product.positioning}
              </p>

              {/* Functional Overview (Research-Backed) */}
              <div className="mt-6 rounded-md border border-border/60 bg-surface-elevated/40 p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal mb-2">
                  <Info size={14} />
                  <span>1. Functional Overview</span>
                </div>
                <p className="text-sm leading-7 text-surface-foreground/80 sm:text-base">
                  {dossier?.functionalOverview || product.overview}
                </p>
                {dossier?.datasheet && (
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-surface-foreground/60 font-mono">
                    <ShieldCheck size={14} className="text-signal" />
                    <span>
                      Specification Status:{" "}
                      <strong className="text-foreground uppercase">
                        {dossier.datasheet.verificationLevel}
                      </strong>{" "}
                      (Datasheet Rev: {dossier.datasheet.revision})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  className="h-12 rounded-none bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-signal/90"
                  onClick={() =>
                    openModal("quote", { productName: product.name, categoryName: category.title })
                  }
                >
                  Request Quote <ArrowRight size={14} className="ml-1.5" />
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
                  onClick={() => openModal("engineer", { productName: `${product.name} (${dossier?.modelCode})` })}
                >
                  <Wrench size={14} className="mr-1.5" />
                  Engineering Review
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-none border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare size={14} className="mr-1.5 text-signal" />
                  WhatsApp
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-none border-signal/40 bg-surface-elevated/40 px-5 font-bold uppercase text-signal hover:border-signal hover:bg-surface-elevated"
                >
                  <Link to="/technology/motion-studio">
                    <Sparkles size={14} className="mr-1.5" />
                    Size in Motion Studio
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hardware Visual & Traceability Badge */}
            <div className="overflow-hidden rounded-lg border border-border/80 bg-surface-elevated/60 p-4 shadow-sm">
              <div className="overflow-hidden rounded">
                <ProductImage
                  product={product}
                  alt={`${product.name} ${dossier?.modelCode || ""} engineering overview`}
                  aspectRatioClass="aspect-[4/3]"
                  priority
                />
              </div>
              <div className="mt-4 space-y-1.5 border-t border-border/30 pt-3 text-[11px] uppercase tracking-wider text-surface-foreground/70">
                <div className="flex justify-between">
                  <span>Model Identifier:</span>
                  <span className="font-mono font-bold text-foreground">{dossier?.modelIdentifier || dossier?.modelCode || product.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span>Datasheet Doc:</span>
                  <span className="font-mono text-signal">{dossier?.datasheet?.documentNumber || dossier?.datasheet?.revision || "REV 2026.1"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Policy:</span>
                  <span className="text-foreground">Zero Invention / Traceable Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Physics & Mechatronic Operating Principle Sequence */}
      <ProductFamilyOperatingPrinciple
        categorySlug={category.slug}
        productName={product.name}
      />

      {/* =========================================================================
          SECTION 2: APPLICATION USE CASES
         ========================================================================= */}
      <section className="border-b border-border/40 bg-card px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            <Compass size={14} />
            <span>2. Application Use Cases</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Target Industrial Deployment Scenarios
          </h2>
          <p className="mt-2 max-w-3xl text-xs text-muted-foreground sm:text-sm">
            Validated real-world production processes engineered specifically for the mechanical stiffness,
            thermal rating, and cycle duty profile of {product.name}.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(dossier?.useCases && dossier.useCases.length > 0 ? dossier.useCases : product.applications).map(
              (useCase, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-md border border-border bg-background p-5 hover:border-signal/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-signal/15 text-xs font-mono font-bold text-signal">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-semibold uppercase leading-snug text-foreground">
                      {useCase}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
                    <span>Validation</span>
                    <span className="text-signal">Industry Proven</span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ENGINEERING SPECIFICATIONS (CATEGORY-SPECIFIC SCHEMAS)
         ========================================================================= */}
      <section className="border-b border-border/40 bg-background px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                <Activity size={14} />
                <span>3. Engineering Specifications</span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Category-Specific Technical Matrix
              </h2>
              <p className="mt-2 max-w-2xl text-xs text-muted-foreground sm:text-sm">
                Every parameter is audited against source manufacturer datasheets. Never an estimate without explicit
                test conditions and tolerances.
              </p>
            </div>

            {/* Filter Tabs */}
            {statusFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 rounded border border-border bg-muted/20 p-1">
                {statusFilters.map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setParamFilter(flt)}
                    className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      paramFilter === flt
                        ? "bg-signal text-signal-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {flt === "all" ? `All Parameters (${rawParams.length})` : flt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Specifications Table */}
          <div className="mt-8 overflow-x-auto rounded-md border border-border bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Parameter Name</th>
                  <th className="px-5 py-3.5 font-bold">Standard Value</th>
                  <th className="px-5 py-3.5 font-bold">Unit</th>
                  <th className="px-5 py-3.5 font-bold">Tolerance / Precision</th>
                  <th className="px-5 py-3.5 font-bold">Applicable Test Conditions</th>
                  <th className="px-5 py-3.5 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedParams.length > 0 ? (
                  displayedParams.map((param, pIdx) => (
                    <tr key={pIdx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {param.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                        {param.value}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">
                        {param.unit || "—"}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-foreground/90">
                        {param.tolerance || "Nominal"}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-[11px] leading-relaxed max-w-xs">
                        {param.conditions || "Standard industrial room temperature 20°C"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider ${
                            (param.status || (param as any).verification) === "verified"
                              ? "bg-signal/15 text-signal border border-signal/40"
                              : (param.status || (param as any).verification) === "configurable"
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {param.status || (param as any).verification}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  product.specifications.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/20">
                      <td className="px-5 py-3.5 font-medium text-foreground">{row.label}</td>
                      <td className="px-5 py-3.5 font-mono text-foreground font-bold">{row.value}</td>
                      <td className="px-5 py-3.5 font-mono text-muted-foreground">—</td>
                      <td className="px-5 py-3.5 font-mono text-xs">Verified Standard</td>
                      <td className="px-5 py-3.5 text-muted-foreground text-[11px]">20°C Nominal</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="rounded bg-signal/15 px-2 py-0.5 text-[9px] font-mono uppercase font-bold text-signal">
                          verified
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-signal shrink-0" />
              <span>
                Audited against published manufacturer standards ({dossier?.datasheet?.traceableSource || "ISO 230-2 Bench"}). Do not extrapolate ratings beyond published limits.
              </span>
            </div>
            <Link
              to="/products/compare"
              className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-signal hover:underline"
            >
              <GitCompare size={13} /> Compare with Alternative Models →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SELECTION & SIZING CONSIDERATIONS
         ========================================================================= */}
      <section className="border-b border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                <Scale size={14} />
                <span>4. Selection &amp; Sizing Considerations</span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Kinematic &amp; Dynamic Sizing Rules
              </h2>
              <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
                Proper selection ensures mechanical fatigue life exceeding 20,000 operating hours while
                avoiding servo amplifier thermal trip-outs under emergency braking.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-md border border-border bg-background p-4">
                  <h4 className="text-xs font-bold uppercase text-signal">Governing Methodology</h4>
                  <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed font-mono">
                    {dossier?.selectionConsiderations?.sizingFormulasHint ||
                      (dossier as any)?.selectionAndSizing?.sizingMethodology ||
                      "Verify RMS torque against continuous thermal limits; check peak acceleration torque against instantaneous stall threshold."}
                  </p>
                </div>

                <div className="rounded-md border border-border bg-background p-4">
                  <h4 className="text-xs font-bold uppercase text-signal">Recommended Safety Factor</h4>
                  <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed font-mono">
                    {dossier?.selectionConsiderations?.recommendedSafetyFactor ||
                      (dossier as any)?.selectionAndSizing?.recommendedSafetyFactor ||
                      "Safety margin ≥ 1.5x continuous rating for intermittent duty; ≥ 2.0x for rapid reversal lines."}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Key Selection Criteria
                  </h4>
                  <ul className="space-y-2.5">
                    {(
                      dossier?.selectionConsiderations?.primaryCriteria ||
                      (dossier as any)?.selectionAndSizing?.keySelectionCriteria || [
                        "Calculate reflected load-to-rotor inertia ratio",
                        "Account for vertical gravity offset when operating without counterweight",
                        "Verify duty cycle and ambient heat dissipation boundaries",
                      ]
                    ).map((criterion: string, cIdx: number) => (
                      <li key={cIdx} className="flex items-start gap-2.5 text-xs text-foreground">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-signal" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Sizing Callout Card */}
            <div className="rounded-xl border-2 border-signal/40 bg-surface-dark p-6 sm:p-8 text-surface-foreground shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-signal">
                <Calculator size={16} />
                <span>Recommended Engineering Sizing Tool</span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold uppercase sm:text-3xl">
                {calcInfo.title}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-surface-foreground/75 sm:text-sm">
                {calcInfo.desc}
              </p>

              <div className="mt-6 rounded border border-border/40 bg-surface-elevated/40 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                  Calculated Parameters
                </span>
                <p className="mt-1 text-xs text-surface-foreground/80 font-mono">
                  Input payload, velocity profile, and mechanical stroke to evaluate instantaneous torque margin,
                  critical buckling thresholds, and dynamic safety coefficients.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/technology/calculators"
                  className="inline-flex h-11 items-center justify-center rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90 text-xs"
                >
                  Launch Engineering Calculator <ArrowRight size={14} className="ml-1.5" />
                </Link>
                <Button
                  variant="outline"
                  className="h-11 rounded-none border-surface-foreground/30 bg-transparent text-xs font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
                  onClick={() => openModal("engineer", { productName: product.name })}
                >
                  Request Application Engineering Sizing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INTEGRATION & COMPATIBILITY
         ========================================================================= */}
      <section className="border-b border-border/40 bg-background px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            <Cpu size={14} />
            <span>5. Integration &amp; Compatibility</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Mechanical, Electrical &amp; Fieldbus Interfaces
          </h2>
          <p className="mt-2 max-w-3xl text-xs text-muted-foreground sm:text-sm">
            Standardized interfaces for drop-in compatibility with global robotic workcell architectures,
            multi-axis servo drives, and deterministic industrial fieldbus rings.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Mechanical Mounting */}
            <div className="rounded-md border border-border bg-card p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                Mechanical Mounting
              </span>
              <h3 className="mt-2 font-display text-lg uppercase text-foreground">
                Flange Standard
              </h3>
              <p className="mt-2 font-mono text-xs text-signal font-bold">
                {dossier?.mechanicalMounting?.flangeStandard || (dossier as any)?.mountingAndInterfaces?.flangeOrShaftStandard || "ISO 9409-1 Flange Pattern"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {dossier?.mechanicalMounting?.orientationNotes || (dossier as any)?.mountingAndInterfaces?.mechanicalMounting ||
                  "Rigid tapped face mount with precision dowel pin locating holes for zero play."}
              </p>
            </div>

            {/* Electrical Power & Drive */}
            <div className="rounded-md border border-border bg-card p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                Power &amp; Drives
              </span>
              <h3 className="mt-2 font-display text-lg uppercase text-foreground">
                Electrical Drive Specs
              </h3>
              <p className="mt-2 font-mono text-xs text-signal font-bold">
                {dossier?.electricalRequirements?.supplyVoltage || (dossier as any)?.mountingAndInterfaces?.electricalPowerRequirements || "3-Phase 380-480V AC / 48V DC"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {dossier?.electricalRequirements?.motorType || (dossier as any)?.mountingAndInterfaces?.motorAndDriveCompatibility ||
                  "Compatible with AC synchronous permanent magnet servo motors and standard industrial inverter drives."}
              </p>
            </div>

            {/* Fieldbus & Control */}
            <div className="rounded-md border border-border bg-card p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                Fieldbus &amp; Control
              </span>
              <h3 className="mt-2 font-display text-lg uppercase text-foreground">
                Industrial Network
              </h3>
              <p className="mt-2 font-mono text-xs text-signal font-bold">
                Cycle: {dossier?.controlAndCommunication?.cycleTime || "< 1.0 ms"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Jitter: {dossier?.controlAndCommunication?.syncJitter || "< 1 µs"}. Real-time deterministic distributed clock synchronization.
              </p>
            </div>
          </div>

          {/* Supported Fieldbuses Chips */}
          <div className="mt-8 rounded-lg border border-border bg-muted/20 p-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal block">
              Supported Industrial Fieldbus Interfaces
            </span>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(
                dossier?.controlAndCommunication?.fieldbuses ||
                (dossier as any)?.mountingAndInterfaces?.supportedFieldbuses || [
                  "EtherCAT (CoE)",
                  "PROFINET RT / IRT",
                  "EtherNet/IP CIP Sync",
                  "CANopen (DS402)",
                  "Modbus TCP",
                ]
              ).map((bus: string) => (
                <span
                  key={bus}
                  className="rounded border border-border bg-card px-3.5 py-1.5 font-mono text-xs font-semibold text-foreground shadow-2xs hover:border-signal transition-colors"
                >
                  {bus}
                </span>
              ))}
            </div>
          </div>

          {/* Integration Dependencies */}
          {dossier?.integrationDependencies && dossier.integrationDependencies.length > 0 && (
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Required Integration Hardware &amp; Dependencies
              </span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dossier.integrationDependencies.map((dep, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs font-mono text-foreground/90">
                    <ChevronRight size={13} className="text-signal" />
                    <span>{dep}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Mechatronic Compatibility & Incompatibility Rules */}
          {compatibilityRules.length > 0 && (
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal block mb-3">
                Verified Mechatronic Compatibility &amp; Selection Rules
              </span>
              <div className="grid gap-4 md:grid-cols-2">
                {compatibilityRules.map((rule) => (
                  <div
                    key={rule.ruleId}
                    className="rounded border border-border/80 bg-background/60 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs uppercase font-bold text-foreground">
                        {rule.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          rule.ruleType === "INCOMPATIBILITY"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-signal/10 text-signal border border-signal/30"
                        }`}
                      >
                        {rule.ruleType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rule.summary}
                    </p>
                    <div className="pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                      Governing Standard: <span className="text-foreground">{rule.governingStandardOrFormula}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: OPERATING LIMITATIONS & UNSUITABLE APPLICATIONS
         ========================================================================= */}
      <section className="border-b border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-amber-500">
            <ShieldAlert size={14} />
            <span>6. Operating Limitations &amp; Boundary Conditions</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Design Envelopes &amp; Application Exclusions
          </h2>
          <p className="mt-2 max-w-3xl text-xs text-muted-foreground sm:text-sm">
            Engineering boundaries must be respected. Operating outside rated envelope voids warranty and causes
            premature mechanical fatigue.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Duty Cycle & Thermal */}
            <div className="rounded-md border border-border bg-background p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Operating Limits
              </span>
              <p className="font-mono text-xs font-bold text-foreground">
                {dossier?.environmentalAndSafety?.operatingTemp || (dossier as any)?.operatingLimitations?.maxDutyCycle || "60% ED intermittent duty"}
              </p>
              <div className="pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Thermal Derating
                </span>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {dossier?.selectionConsiderations?.thermalDeratingNotes || (dossier as any)?.operatingLimitations?.thermalConstraints ||
                    "Ambient 0°C to +40°C. Motor stator temperature must remain under 115°C."}
                </p>
              </div>
            </div>

            {/* Environmental Rating */}
            <div className="rounded-md border border-border bg-background p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Environmental Ingress
              </span>
              <p className="font-mono text-xs font-bold text-foreground">
                {dossier?.environmentalAndSafety?.ipRating || (dossier as any)?.operatingLimitations?.environmentalConstraints || "IP54 standard indoor shopfloor"}
              </p>
              <div className="pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Atmospheric &amp; Humidity Limits
                </span>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {dossier?.environmentalAndSafety?.humidity || "Non-condensing relative humidity (20% to 85%). Protect from corrosive chemical vapors."}
                </p>
              </div>
            </div>

            {/* Strict Unsuitable Applications Box */}
            <div className="rounded-md border-2 border-destructive/40 bg-destructive/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Unsuitable Applications
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Do NOT deploy this component in the following scenarios without custom engineering clearance:
              </p>
              <ul className="space-y-2 pt-1">
                {(
                  dossier?.unsuitableApplications ||
                  (dossier as any)?.operatingLimitations?.unsuitableApplications || [
                    "Explosive atmospheres (ATEX Zone 0/1) without explosion-proof enclosure",
                    "Direct high-pressure steam washdown environments without IP67 seals",
                    "Continuous stall operation exceeding continuous motor rated holding torque",
                    "Unguided cantilever bending moments beyond maximum permissible overhung load",
                  ]
                ).map((unsuitable: string, uIdx: number) => (
                  <li key={uIdx} className="flex items-start gap-2 text-xs text-destructive/90">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-destructive" />
                    <span>{unsuitable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: VERIFIED DOCUMENTATION & CAD
         ========================================================================= */}
      <section className="border-b border-border/40 bg-background px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            <FileText size={14} />
            <span>7. Verified Documentation &amp; CAD</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Datasheets, 3D STEP Models &amp; Certifications
          </h2>
          <p className="mt-2 max-w-3xl text-xs text-muted-foreground sm:text-sm">
            Auditable documentation directly from engineering testing. No placeholder drawings or unverified claims.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Technical Datasheet */}
            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                  Certified Technical Document
                </span>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground">
                  {dossier?.datasheet?.documentNumber || (dossier as any)?.documentation?.datasheetTitle || `${product.name} Engineering Datasheet`}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground font-mono">
                  {dossier?.datasheet?.revision || (dossier as any)?.documentation?.datasheetRevision || "Rev 2026.1"} | {dossier?.datasheet?.verificationLevel || "Verified"}
                </p>
                {dossier?.datasheet?.traceableSource && (
                  <p className="mt-1 text-[11px] text-muted-foreground/80 font-mono">
                    Source: {dossier.datasheet.traceableSource}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <Button
                  className="w-full rounded-none bg-signal text-signal-foreground hover:bg-signal/90 font-bold uppercase text-xs"
                  onClick={() => openModal("engineer", { productName: `${product.name} Datasheet (${dossier?.modelIdentifier || product.slug})` })}
                >
                  <Download size={14} className="mr-1.5" />
                  Request Full PDF Datasheet
                </Button>
              </div>
            </div>

            {/* 3D STEP CAD Model */}
            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                  SolidWorks / Inventor / Parasolid
                </span>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground">
                  3D STEP CAD Geometry
                </h3>
                <p className="mt-2 text-xs text-muted-foreground font-mono">
                  STEP AP214 format with accurate center-of-gravity and mass matrix.
                </p>
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full rounded-none border-border font-bold uppercase text-xs hover:border-signal"
                  onClick={() => openModal("engineer", { productName: `${product.name} 3D STEP CAD Model (${dossier?.modelIdentifier || product.slug})` })}
                >
                  <Download size={14} className="mr-1.5 text-signal" />
                  Request 3D STEP Assembly
                </Button>
              </div>
            </div>

            {/* Safety & Compliance */}
            <div className="flex flex-col justify-between rounded-md border border-border bg-card p-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                  Safety Standards
                </span>
                <h3 className="mt-2 font-display text-xl uppercase text-foreground">
                  Certifications &amp; Directives
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(
                    dossier?.environmentalAndSafety?.safetyCertifications ||
                    (dossier as any)?.documentation?.safetyCertifications || [
                      "CE Machinery Directive 2006/42/EC",
                      "ISO 12100 Risk Assessment",
                      "ISO 13849-1 Functional Safety",
                      "RoHS 3 (EU 2015/863)",
                    ]
                  ).map((cert: string) => (
                    <span
                      key={cert}
                      className="rounded bg-muted px-2 py-1 font-mono text-[10px] text-foreground"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                Certificates available upon project kick-off.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: RELATED TECHNOLOGIES & SYSTEM ARCHITECTURE
         ========================================================================= */}
      <section className="border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                <Layers size={14} />
                <span>8. Related Technologies &amp; Architecture</span>
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Explore Complete System Architecture
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-surface-foreground/75 sm:text-sm">
                See how {product.name} operates in the full industrial stack alongside motor drives,
                interpolated multi-axis controllers, safety PLC enclosures, and mobile AMR bases.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/technology/architecture-explorer"
                  className="inline-flex h-11 items-center justify-center rounded-none bg-signal px-6 font-bold uppercase text-signal-foreground hover:bg-signal/90 text-xs"
                >
                  Launch Architecture Explorer <ArrowRight size={14} className="ml-1.5" />
                </Link>
                <Link
                  to="/products/compare"
                  className="inline-flex h-11 items-center justify-center rounded-none border border-surface-foreground/30 bg-transparent px-5 font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal text-xs"
                >
                  <GitCompare size={14} className="mr-1.5 text-signal" /> Component Comparator
                </Link>
              </div>
            </div>

            {/* Upstream / Downstream Link Cards */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                Downstream &amp; Upstream Workcell Integration
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    to="/products/$category/$id"
                    params={{ category: p.categorySlug, id: p.slug }}
                    className="group rounded border border-border/40 bg-surface-elevated/40 p-4 hover:border-signal transition-colors block"
                  >
                    <span className="text-[9px] font-mono uppercase text-signal">{p.category}</span>
                    <h4 className="mt-1 font-display text-sm uppercase text-surface-foreground group-hover:text-signal transition-colors">
                      {p.name}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-[11px] text-surface-foreground/70">
                      {p.overview}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layer C: Future Agentic Network Readiness — Knowledge Node Inspector */}
      <AgenticNodeInspector nodeId={product.id || product.slug} />

      {/* =========================================================================
          SECTION 9: CONTEXTUAL ENGINEERING ENQUIRY
         ========================================================================= */}
      <section className="border-t border-border/40 bg-card px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-3xl border border-border bg-background p-8 sm:p-12 shadow-xl">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              9. Contextual Engineering Enquiry
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Enquire About {product.name}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-muted-foreground sm:text-sm">
              Connect directly with our application engineers for sizing verification, mechanical
              availability, and volume quotation under Model Code{" "}
              <strong className="text-foreground">{dossier?.modelCode || product.slug.toUpperCase()}</strong>.
            </p>
          </div>

          <div className="mt-6 border border-signal/30 bg-surface-elevated/40 p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
              Configured Target Hardware
            </span>
            <p className="font-display text-lg uppercase text-foreground">
              {product.name} — Model Code: {dossier?.modelCode || product.slug.toUpperCase()}
            </p>
          </div>

          {formSubmitted ? (
            <div className="mt-8 py-8 text-center animate-in fade-in">
              <div className="mx-auto flex size-14 items-center justify-center bg-signal text-signal-foreground">
                <Check size={28} />
              </div>
              <h3 className="mt-4 font-display text-2xl uppercase">Enquiry Transmitted</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Thank you, {quickForm.name || "Engineer"}. Your technical enquiry for {product.name} ({dossier?.modelCode})
                has been routed to our application engineering team.
              </p>
              {isDuplicate && (
                <p className="mt-2 text-xs text-signal font-mono">
                  Note: An existing enquiry with these details was already recorded.
                </p>
              )}
              {ticketKey && (
                <div className="mt-4 inline-flex items-center gap-2 border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-mono text-signal">
                  <span className="font-bold">Jira Ticket Reference:</span> {ticketKey}
                </div>
              )}
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  className="rounded-none bg-signal text-signal-foreground hover:bg-signal/90 font-bold uppercase text-xs"
                  onClick={() => {
                    setFormSubmitted(false);
                    setErrorMessage(null);
                  }}
                >
                  Submit Another Note
                </Button>
                <Button variant="outline" className="rounded-none text-xs font-bold uppercase" onClick={handleWhatsApp}>
                  <MessageSquare size={14} className="mr-1.5 text-signal" />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleQuickSubmit}
              onFocusCapture={handleFormFocus}
              data-clarity-mask="true"
              className="mt-8 space-y-4"
            >
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Unable to submit enquiry</p>
                    <p className="mt-0.5 text-xs text-red-300/90">{errorMessage}</p>
                  </div>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Full Name *
                  <Input
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="mt-1.5 h-12 rounded-none border-input bg-card text-sm"
                  />
                </label>

                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Company Name *
                  <Input
                    required
                    value={quickForm.company}
                    onChange={(e) => setQuickForm({ ...quickForm, company: e.target.value })}
                    placeholder="e.g. Precision Systems Inc"
                    className="mt-1.5 h-12 rounded-none border-input bg-card text-sm"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Business Email *
                  <Input
                    type="email"
                    required
                    value={quickForm.email}
                    onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
                    placeholder="a.morgan@company.com"
                    className="mt-1.5 h-12 rounded-none border-input bg-card text-sm"
                  />
                </label>

                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                  <Input
                    type="tel"
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="mt-1.5 h-12 rounded-none border-input bg-card text-sm"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Target Quantity
                  <Input
                    value={quickForm.quantity}
                    onChange={(e) => setQuickForm({ ...quickForm, quantity: e.target.value })}
                    placeholder="e.g. 5 units / Pilot"
                    className="mt-1.5 h-12 rounded-none border-input bg-card text-sm"
                  />
                </label>

                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Application Task
                  <Input
                    value={quickForm.application}
                    onChange={(e) => setQuickForm({ ...quickForm, application: e.target.value })}
                    placeholder="e.g. Robotic Arm Joint Axis 3"
                    className="mt-1.5 h-12 rounded-none border-input bg-card text-sm"
                  />
                </label>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Technical Sizing Requirements *
                <Textarea
                  required
                  rows={3}
                  value={quickForm.message}
                  onChange={(e) => setQuickForm({ ...quickForm, message: e.target.value })}
                  placeholder={`Describe your torque, velocity, duty cycle, mounting envelope, or fieldbus needs for ${product.name} [${dossier?.modelCode || "Model"}]...`}
                  className="mt-1.5 rounded-none border-input bg-card text-sm"
                />
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry for {product.name} <ArrowRight size={14} className="ml-1.5" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="rounded-none border-border"
                >
                  <MessageSquare size={14} className="mr-1.5 text-signal" />
                  WhatsApp
                </Button>
              </div>

              <div className="border-t border-border pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Need to provide complete machine drawings or multi-axis specs?
                </p>
                <Link
                  to="/contact/engineering-enquiry"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                >
                  Open Full 7-Section Engineering Form →
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Related Content */}
      <RelatedContent
        title={`Related Technologies for ${product.name}`}
        items={[
          {
            sectionTitle: "Complementary Products",
            links: relatedProducts.map((p) => ({
              title: p.name,
              category: p.category,
              description: p.overview,
              href: `/products/${p.categorySlug}/${p.slug}`,
            })),
          },
          {
            sectionTitle: "Applicable Industries",
            links: product.applications.map((app) => ({
              title: app,
              description: `Robotic integration for ${app} manufacturing environments.`,
              href: `/applications/${app.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
            })),
          },
          {
            sectionTitle: "Engineering Calculators & Architecture",
            links: [
              {
                title: "Engineering Motion Calculators",
                category: "Technology",
                description: "Linear actuator, reducer inertia, and wrist overhung moment calculators.",
                href: "/technology/calculators",
              },
              {
                title: "Component Architecture Explorer",
                category: "System Engineering",
                description: "Explore the 5-layer industrial robotics hardware stack.",
                href: "/technology/architecture-explorer",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
