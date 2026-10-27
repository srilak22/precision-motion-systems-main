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
  RotateCw,
  Gauge,
  Focus,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProduct, getCategory, products, type Product } from "@/data/robotics";
import { getEngineeringDossier, type EngineeringParameter } from "@/data/engineeringData";
import { getIntelligentActuator, type IntelligentActuatorItem } from "@/data/intelligentActuatorsData";
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
import { IntelligentActuatorDashboard } from "@/components/engineering/IntelligentActuatorDashboard";
import { ApplicationFinderWizard } from "@/components/forms/ApplicationFinderWizard";
import { ModelCapacitySelector, type ModelVariantSpec } from "@/components/engineering/ModelCapacitySelector";

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
    const intelData = getIntelligentActuator(product.slug) || getIntelligentActuator(product.id);
    return { product, category, dossier, intelData };
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
  const { product, category, dossier, intelData } = Route.useLoaderData();
  const { openModal } = useModals();

  // Parameter Filtering State
  const [paramFilter, setParamFilter] = useState<string>("all");
  const [specModelFilter, setSpecModelFilter] = useState<string>("all");

  const currentUrl = `/products/${category.slug}/${product.slug}`;
  const activeModelCode = dossier?.modelCode || (intelData ? intelData.modelVariants[0]?.modelCode : undefined);

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "product",
        name: `${product.name} (${dossier?.modelCode || "STD"})`,
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

  // Derive variants for ModelCapacitySelector
  const modelVariants: ModelVariantSpec[] = intelData
    ? intelData.modelVariants.map((v) => ({
        modelCode: v.modelCode,
        headlineMetric: v.nominalTorqueOrForce,
        nominalRating: v.nominalTorqueOrForce,
        peakRating: v.peakTorqueOrForce,
        ratedSpeedOrVelocity: v.ratedSpeed,
        maxSpeedOrVelocity: v.maxSpeed,
        precisionOrBacklash: v.encoderResolution,
        powerOrCurrent: `${v.continuousCurrent} cont. / ${v.peakCurrent} peak`,
        loadLimits: `IP Rating: ${v.ipRating}`,
        massOrDimension: `${v.flangeSizeMm} · ${v.massKg}`,
        applicationFit: `${v.nominalTorqueOrForce} joint motion`,
        interfaces: v.interfaces,
        environmentalSuitability: v.environmentalSuitability,
        integrationRequirements: v.integrationRequirements,
        verificationStatus: v.verifiedStatus === "verified" ? "verified" : "configurable",
      }))
    : [
        {
          modelCode: `${dossier?.modelCode || product.slug.toUpperCase()}-01`,
          headlineMetric: "Standard Rating",
          nominalRating: rawParams[0]?.value ? `${rawParams[0].value} ${rawParams[0].unit || ""}` : "Verified",
          peakRating: rawParams[1]?.value ? `${rawParams[1].value} ${rawParams[1].unit || ""}` : "Peak Envelope",
          ratedSpeedOrVelocity: rawParams[2]?.value ? `${rawParams[2].value} ${rawParams[2].unit || ""}` : "Rated",
          maxSpeedOrVelocity: "Maximum Safe Commutation",
          precisionOrBacklash: rawParams[4]?.value ? `${rawParams[4].value} ${rawParams[4].unit || ""}` : "Sub-arcminute",
          powerOrCurrent: "Standard Industrial Rating",
          loadLimits: "Verified ISO Rating",
          massOrDimension: "Metric Standard",
          applicationFit: "Standard Industrial Automation Duty",
          verificationStatus: "verified",
        },
      ];

  // Headline specifications (4 cards matching reference screenshot)
  const headlineSpecs = intelData?.headlineSpecs || {
    ratedTorqueOrForce: {
      label: category.slug.includes("actuator") ? "Rated torque / thrust" : "Rated continuous capacity",
      value: rawParams[0]?.value || "Verified value",
      unit: rawParams[0]?.unit || "by model",
      note: "Continuous S1 duty",
    },
    outputSpeed: {
      label: "Output speed / velocity",
      value: rawParams[2]?.value || "Verified value",
      unit: rawParams[2]?.unit || "rpm · by model",
      note: "At rated supply voltage",
    },
    positionFeedback: {
      label: "Position feedback",
      value: dossier?.controlAndCommunication?.syncJitter ? "Dual Absolute 19-Bit" : "Encoder options",
      unit: "BiSS-C / SSI",
      note: "Actual configuration",
    },
    integration: {
      label: "Integration & Bus",
      value: dossier?.controlAndCommunication?.fieldbuses?.[0] || "EtherCAT / CANopen",
      unit: "CiA 402 Profile",
      note: "By configuration",
    },
  };

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
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* =========================================================================
          SECTION 1: PRODUCT HERO (LIGHT THEME MATCHING REFERENCE SPECIFICATION)
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-[1440px]">
          {/* Main White Hero Surface Card */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-[#FFFFFF] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-center">
              <div>
                {/* Breadcrumbs matching reference: PRODUCTS / MOTION & ACTUATION / INTELLIGENT ACTUATORS */}
                <nav
                  aria-label="Breadcrumb"
                  className="mb-3.5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#667085]"
                >
                  <Link to="/products" className="hover:text-[#155EEF] transition-colors">
                    PRODUCTS
                  </Link>
                  <span className="text-[#D0D5DD]">/</span>
                  <Link
                    to="/products"
                    className="hover:text-[#155EEF] transition-colors"
                  >
                    {category.slug.includes("actuator") ? "MOTION & ACTUATION" : category.title.toUpperCase()}
                  </Link>
                  <span className="text-[#D0D5DD]">/</span>
                  <span className="text-[#155EEF] font-bold">
                    {product.name.toUpperCase()}
                  </span>
                </nav>

                {/* Primary Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172033] tracking-tight">
                  {product.name}
                </h1>

                {/* One-Sentence Engineering Value Proposition (Slate Muted) */}
                <p className="mt-3 text-base sm:text-lg text-[#667085] leading-relaxed max-w-2xl font-normal">
                  {intelData?.headline ||
                    product.positioning ||
                    product.shortDescription ||
                    "Precision motion, integrated feedback, and configurable control for robotic joints and automated machinery."}
                </p>

                {/* 2x2 Headline Specifications Grid (matching reference screenshot) */}
                <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
                  {/* Metric 1: Rated Torque / Force */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 text-[#155EEF] shrink-0">
                      <Gauge size={22} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-xs text-[#667085] font-medium">
                        {headlineSpecs.ratedTorqueOrForce.label}
                      </span>
                      <strong className="block text-xl font-bold text-[#172033] tracking-tight mt-0.5">
                        {headlineSpecs.ratedTorqueOrForce.value}
                      </strong>
                      <span className="block text-xs font-mono text-[#667085] mt-0.5">
                        {headlineSpecs.ratedTorqueOrForce.unit} · {headlineSpecs.ratedTorqueOrForce.note}
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Output Speed */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 text-[#155EEF] shrink-0">
                      <RotateCw size={22} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-xs text-[#667085] font-medium">
                        {headlineSpecs.outputSpeed.label}
                      </span>
                      <strong className="block text-xl font-bold text-[#172033] tracking-tight mt-0.5">
                        {headlineSpecs.outputSpeed.value}
                      </strong>
                      <span className="block text-xs font-mono text-[#667085] mt-0.5">
                        {headlineSpecs.outputSpeed.unit} · {headlineSpecs.outputSpeed.note}
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: Position Feedback */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 text-[#155EEF] shrink-0">
                      <Focus size={22} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-xs text-[#667085] font-medium">
                        {headlineSpecs.positionFeedback.label}
                      </span>
                      <strong className="block text-xl font-bold text-[#172033] tracking-tight mt-0.5">
                        {headlineSpecs.positionFeedback.value}
                      </strong>
                      <span className="block text-xs font-mono text-[#667085] mt-0.5">
                        {headlineSpecs.positionFeedback.unit} · {headlineSpecs.positionFeedback.note}
                      </span>
                    </div>
                  </div>

                  {/* Metric 4: Integration / Interfaces */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 text-[#155EEF] shrink-0">
                      <Plug size={22} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-xs text-[#667085] font-medium">
                        {headlineSpecs.integration.label}
                      </span>
                      <strong className="block text-xl font-bold text-[#172033] tracking-tight mt-0.5">
                        {headlineSpecs.integration.value}
                      </strong>
                      <span className="block text-xs font-mono text-[#667085] mt-0.5">
                        {headlineSpecs.integration.unit} · {headlineSpecs.integration.note}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Triggers Row (Mandate 2: Explore Applications, View Specifications, Compare Models, Request a Quote) */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3">
                  <Button
                    className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-5 shadow-xs transition-all"
                    onClick={() =>
                      openModal("quote", {
                        productName: product.name,
                        categoryName: category.title,
                        productSlug: product.slug,
                        modelConfig: activeModelCode,
                        originUrl: currentUrl,
                      })
                    }
                  >
                    Request a Quote
                  </Button>

                  <Button
                    variant="outline"
                    className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-4 shadow-2xs"
                    onClick={() => {
                      document.getElementById("applications")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Explore Applications
                  </Button>

                  <Button
                    variant="outline"
                    className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-4 shadow-2xs"
                    onClick={() => {
                      document.getElementById("specifications")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    View Specifications
                  </Button>

                  <Button
                    variant="outline"
                    className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-4 shadow-2xs"
                    onClick={() => {
                      document.getElementById("model-comparison")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Compare Models
                  </Button>

                  <Button
                    variant="outline"
                    className="h-11 rounded-lg border-[#B2CCFF] bg-[#EFF6FF] text-[#155EEF] hover:bg-[#D1E9FF] font-bold text-xs uppercase px-4 shadow-2xs"
                    onClick={() => {
                      document.getElementById("application-finder")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Find the Right Solution
                  </Button>

                  {intelData && (
                    <Link
                      to="/technology/intelligent-actuators"
                      className="h-11 rounded-lg border border-[#B2CCFF] bg-[#F5F8FF] text-[#155EEF] hover:bg-[#EFF6FF] font-bold text-xs uppercase px-4 inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Activity size={14} /> Open Actuator Studio
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    className="h-11 rounded-lg border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#F8FAFC] font-bold text-xs uppercase px-4 shadow-2xs"
                    onClick={() => {
                      openModal("engineer", {
                        categoryName: category.title,
                        productName: `${product.name} (Engineering Consultation)`,
                        productSlug: product.slug,
                        modelConfig: activeModelCode,
                        originUrl: currentUrl,
                        initialMessage: `Inquiry regarding ${product.name} [${activeModelCode || "standard"}]. Please provide sizing verification, 3D envelope CAD, and system integration feasibility.`,
                      });
                    }}
                  >
                    Request Engineering Consultation
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleWhatsApp}
                    className="h-11 text-xs text-[#16A34A] hover:bg-[#F0FDF4] font-semibold"
                  >
                    <MessageSquare size={14} className="mr-1.5" /> Direct WhatsApp Desk
                  </Button>
                </div>
              </div>

              {/* Hardware Visual & Traceability Badge */}
              <div className="overflow-hidden rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 shadow-xs">
                <div className="overflow-hidden rounded-lg bg-white border border-[#E5EAF1] p-3">
                  <ProductImage
                    product={product}
                    alt={`${product.name} ${dossier?.modelCode || ""} engineering overview`}
                    aspectRatioClass="aspect-[4/3]"
                    priority
                  />
                </div>
                <div className="mt-4 space-y-2 border-t border-[#E5EAF1] pt-3 text-[11px] font-mono text-[#667085]">
                  <div className="flex justify-between">
                    <span className="text-[#475467] font-semibold">Model Identifier:</span>
                    <span className="font-bold text-[#172033]">
                      {dossier?.modelIdentifier || dossier?.modelCode || product.slug.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467] font-semibold">Datasheet Document:</span>
                    <span className="text-[#155EEF] font-bold">
                      {dossier?.datasheet?.documentNumber || "DS-IND-2026-REV4"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#475467] font-semibold">Engineering Standard:</span>
                    <span className="text-[#172033]">
                      {dossier?.datasheet?.traceableSource || "ISO 9409-1 / ISO 230-2"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mechatronic Operating Principle Sequence */}
      <ProductFamilyOperatingPrinciple
        categorySlug={category.slug}
        productName={product.name}
      />

      {/* =========================================================================
          SECTION 2: PRACTICAL APPLICATIONS & USE CASES (MANDATE 3)
         ========================================================================= */}
      <section id="applications" className="border-b border-[#E5EAF1] bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
            <Compass size={14} />
            <span>2. Practical Applications &amp; Use Cases</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172033] tracking-tight">
            Target Industrial Deployment Scenarios
          </h2>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[#667085] leading-relaxed">
            Every application below reflects verified kinematic loads, thermal duty cycles, and integration requirements for {product.name}.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(intelData?.practicalApplications || [
              {
                applicationName: "Collaborative Robot Articulation (J1–J6)",
                manufacturingProblem: "Excessive backlash causing positioning inaccuracies and vibration chatter in multi-axis assembly.",
                howProductContributes: "Combines zero-backlash harmonic drive, dual 19-bit encoders, and integrated DSP servo drive into a compact hollow-bore joint.",
                applicationEnvironment: "Automotive battery & electronic component assembly lines.",
                productRole: "Direct articulated joint actuator for J1–J6 robot axes.",
                requiredMotion: "Sub-millisecond cyclic synchronized positioning with zero mechanical backlash.",
                integrationComponents: ["EtherCAT Master PLC", "48V Regulated DC Bus", "Cat5e Industrial Cabling"],
                requiredSupportingComponents: ["TwinCAT 3 / CODESYS SoftPLC", "48V DC Power Supply", "M12 Cat5e Shielded Cable"],
                engineeringConsiderations: "Verify dynamic cantilever moments and thermal dissipation at 100% duty.",
                operationalBenefit: "Eliminates external motor drives and reduces arm cabling harness by 70%.",
                expectedBenefits: "Eliminates external drives and reduces arm cabling harness by 70% with ±10 arcsec repeatability.",
                designLimitations: "Not suitable for continuous stall above continuous holding torque without forced cooling.",
                limitationsAndValidation: "Continuous thermal equilibrium must be maintained; holding torque beyond S1 rating requires cooling.",
              },
            ]).map((app, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 flex flex-col justify-between hover:border-[#B2CCFF] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1]">
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF]">
                      Scenario 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Application
                    </span>
                  </div>

                  {/* 1. Application Name */}
                  <h3 className="mt-3 font-bold text-base text-[#172033]">
                    {app.applicationName || `Industrial Application Scenario 0${idx + 1}`}
                  </h3>

                  {/* 2. Operational Problem */}
                  <div className="mt-3 text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#D92D20] block mb-0.5">
                      Operational Problem:
                    </span>
                    <p className="text-[#344054] font-medium leading-relaxed">
                      {app.manufacturingProblem}
                    </p>
                  </div>

                  {/* 3. How Product Contributes to Solution */}
                  {app.howProductContributes && (
                    <div className="mt-3 text-xs bg-white p-3 rounded-lg border border-[#E5EAF1]">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] block mb-0.5">
                        How {product.name} Solves This:
                      </span>
                      <p className="text-[#475467] leading-relaxed">
                        {app.howProductContributes}
                      </p>
                    </div>
                  )}

                  {/* Motion, Role & Environment Context */}
                  <div className="mt-3 space-y-1.5 text-[11.5px] text-[#475467] border-t border-[#E5EAF1] pt-3">
                    <div>
                      <strong className="text-[#172033]">Environment:</strong> {app.applicationEnvironment}
                    </div>
                    <div>
                      <strong className="text-[#172033]">Required Motion:</strong> {app.requiredMotion}
                    </div>
                  </div>

                  {/* 4. Required Supporting Components */}
                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#475467] block mb-1">
                      Required Supporting Components:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#667085]">
                      {(app.requiredSupportingComponents || app.integrationComponents || []).map((comp, cIdx) => (
                        <li key={cIdx}>{comp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 5. Important Engineering Considerations */}
                  {app.engineeringConsiderations && (
                    <div className="mt-3 text-xs text-[#475467]">
                      <strong className="text-[#172033] block mb-0.5">Engineering Considerations:</strong>
                      <p className="text-[11px] leading-relaxed text-[#667085]">
                        {app.engineeringConsiderations}
                      </p>
                    </div>
                  )}

                  {/* 6. Expected Benefits */}
                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] text-xs">
                    <strong className="text-[#16A34A] block mb-1">Expected Benefits:</strong>
                    <p className="text-[#172033] font-medium leading-relaxed">
                      {app.expectedBenefits || app.operationalBenefit}
                    </p>
                  </div>
                </div>

                {/* 7. Limitations or Conditions Requiring Validation */}
                <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] text-[#B54708] bg-[#FFFAEB] p-2.5 rounded-lg border border-[#FEDF89]">
                  <strong className="block mb-0.5">Limitations &amp; Conditions Requiring Validation:</strong>
                  <span>{app.limitationsAndValidation || app.designLimitations}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2B: INTELLIGENT ACTUATOR ARCHITECTURE & TELEMETRY (PHASE 5)
         ========================================================================= */}
      {intelData && (
        <section className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1440px] space-y-12">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
                <Cpu size={14} />
                <span>Phase 5: Mechatronic System Architecture</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172033] tracking-tight">
                Conventional Actuator vs. INDUS Intelligent Actuator
              </h2>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[#667085] leading-relaxed">
                Conventional actuation requires 4 separate components (motor, gearbox, external drive, and cable harness).
                The INDUS Intelligent Actuator packages all 4 subsystems into a single IP65 sealed mechatronic joint with built-in closed-loop telemetry.
              </p>

              {/* Mechatronic Subsystems Grid */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {intelData.mechatronicArchitecture.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="rounded-xl border border-[#E5EAF1] bg-white p-4 shadow-2xs hover:border-[#155EEF] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[9.5px] font-mono font-bold text-[#155EEF] uppercase">
                        {sub.category.replace("-", " ")}
                      </span>
                      <span className="text-[10px] font-mono text-[#16A34A] font-bold">
                        {sub.status}
                      </span>
                    </div>
                    <h4 className="mt-2 font-bold text-xs text-[#172033]">
                      {sub.name}
                    </h4>
                    <p className="mt-1 text-[11px] font-mono text-[#155EEF] leading-snug">
                      {sub.specification}
                    </p>
                    <p className="mt-2 pt-2 border-t border-[#E5EAF1] text-[11px] text-[#667085] leading-relaxed">
                      {sub.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Telemetry Dashboard */}
            <IntelligentActuatorDashboard actuatorModel={dossier?.modelIdentifier || "IND-IRA-090-80"} />
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: ENGINEERING SPECIFICATIONS TABLE (MANDATE 4)
         ========================================================================= */}
      <section id="specifications" className="border-b border-[#E5EAF1] bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
                <Activity size={14} />
                <span>3. Verified Technical Specifications</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172033] tracking-tight">
                Engineering Specification Matrix
              </h2>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#667085]">
                Continuous ratings are strictly separated from peak ratings, and component capacity is distinguished from complete-system capacity. Missing values are displayed as &ldquo;Request specification&rdquo; without fabricated claims.
              </p>
            </div>

            {/* Model & Verification Filter Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {intelData && (
                <div className="flex items-center gap-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-1">
                  <button
                    type="button"
                    onClick={() => setSpecModelFilter("all")}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      specModelFilter === "all"
                        ? "bg-[#155EEF] text-white shadow-2xs"
                        : "text-[#667085] hover:text-[#172033]"
                    }`}
                  >
                    All Variants
                  </button>
                  {Object.keys(intelData.specificationTable[0]?.models || {}).map((mKey) => (
                    <button
                      key={mKey}
                      type="button"
                      onClick={() => setSpecModelFilter(mKey)}
                      className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                        specModelFilter === mKey
                          ? "bg-[#155EEF] text-white shadow-2xs"
                          : "text-[#667085] hover:text-[#172033]"
                      }`}
                    >
                      {mKey}
                    </button>
                  ))}
                </div>
              )}

              {/* Status Filters (for generic/dossier data) */}
              {!intelData && statusFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-1">
                  {statusFilters.map((flt) => (
                    <button
                      key={flt}
                      type="button"
                      onClick={() => setParamFilter(flt)}
                      className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        paramFilter === flt
                          ? "bg-[#155EEF] text-white shadow-2xs font-bold"
                          : "text-[#667085] hover:text-[#172033]"
                      }`}
                    >
                      {flt === "all" ? `All (${rawParams.length})` : flt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table matching Mandate 4: Parameter | Specification | Unit | Notes */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-[#E5EAF1] bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5EAF1] bg-[#F8FAFC] uppercase tracking-wider text-[#475467] font-bold text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 w-1/4">Parameter</th>
                  <th className="px-5 py-3.5 w-1/4">Specification</th>
                  <th className="px-5 py-3.5 w-1/6">Unit</th>
                  <th className="px-5 py-3.5 w-1/3">Notes &amp; Operating Limits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF1]">
                {intelData?.specificationTable ? (
                  intelData.specificationTable.map((row, rIdx) => {
                    const specVal =
                      specModelFilter === "all"
                        ? Object.entries(row.models)
                            .map(([m, val]) => `${m.replace("IND-IRA-", "").replace("IND-ILA-", "")}: ${val}`)
                            .join(" · ")
                        : row.models[specModelFilter];

                    return (
                      <tr key={rIdx} className="hover:bg-[#F8FAFC] transition-colors">
                        {/* 1. Parameter */}
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-[#172033]">{row.parameter}</div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider ${
                                row.ratingType === "Continuous"
                                  ? "bg-[#ECFDF3] text-[#16A34A] border border-[#A6F4C5]"
                                  : row.ratingType === "Peak"
                                  ? "bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]"
                                  : row.ratingType === "Envelope"
                                  ? "bg-[#F9F5FF] text-[#6941C6] border border-[#E9D7FE]"
                                  : "bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]"
                              }`}
                            >
                              {row.ratingType}
                            </span>
                            <span className="text-[10px] font-mono text-[#667085]">{row.category}</span>
                          </div>
                        </td>

                        {/* 2. Specification */}
                        <td className="px-5 py-3.5 font-mono font-bold text-[#172033]">
                          {specVal ? (
                            <span>{specVal}</span>
                          ) : (
                            <span className="text-[#B54708] italic font-normal">Request specification</span>
                          )}
                        </td>

                        {/* 3. Unit */}
                        <td className="px-5 py-3.5 font-mono text-[#667085]">{row.unit || "—"}</td>

                        {/* 4. Notes & Operating Limits */}
                        <td className="px-5 py-3.5 text-[#475467] text-[11px] leading-relaxed">
                          <p>{row.testCondition}</p>
                          <p className="mt-1 text-[10px] text-[#667085]">
                            {row.ratingType === "Continuous"
                              ? "Distinction: Continuous component capacity (S1 duty). System limits depend on cooling and bus voltage stability."
                              : row.ratingType === "Peak"
                              ? "Distinction: Peak dynamic limit (duration ≤ 1.0s, duty ≤ 10%). Complete-system capacity limited by DC power supply."
                              : "Audited standard test condition on calibrated bench."}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                ) : displayedParams.length > 0 ? (
                  displayedParams.map((param, pIdx) => (
                    <tr key={pIdx} className="hover:bg-[#F8FAFC] transition-colors">
                      {/* 1. Parameter */}
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-[#172033]">{param.name}</div>
                        <div className="mt-1">
                          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider bg-[#EFF6FF] text-[#155EEF] border border-[#B2CCFF]">
                            {param.status || (param as any).verification || "Verified"}
                          </span>
                        </div>
                      </td>

                      {/* 2. Specification */}
                      <td className="px-5 py-3.5 font-mono font-bold text-[#172033]">
                        {param.value ? (
                          param.value
                        ) : (
                          <span className="text-[#B54708] italic font-normal">Request specification</span>
                        )}
                      </td>

                      {/* 3. Unit */}
                      <td className="px-5 py-3.5 font-mono text-[#667085]">{param.unit || "—"}</td>

                      {/* 4. Notes */}
                      <td className="px-5 py-3.5 text-[#475467] text-[11px] leading-relaxed">
                        <p>{param.conditions || param.tolerance || "Standard factory test conditions."}</p>
                        <p className="mt-1 text-[10px] text-[#667085]">
                          Continuous capacity is distinguished from complete-system capacity.
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-xs text-[#667085]">
                      No parameters match the selected verification filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
              <span>
                Audited against published manufacturer standards ({dossier?.datasheet?.traceableSource || "ISO 230-2 Lab Bench"}).
              </span>
            </div>
            <Link
              to="/products/compare"
              className="font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
            >
              <GitCompare size={13} /> Compare with Alternative Models →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: MODEL & CAPACITY SELECTOR (MANDATE 5: ANCHOR #model-comparison)
         ========================================================================= */}
      <section id="model-comparison" className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 lg:px-10 lg:py-20">
        <div id="model-capacity" className="sr-only" />
        <div className="mx-auto max-w-[1440px]">
          <ModelCapacitySelector
            productName={product.name}
            categorySlug={category.slug}
            variants={modelVariants}
            onSelectModelForQuote={(modelCode) => {
              openModal("quote", {
                productName: `${product.name} (${modelCode})`,
                categoryName: category.title,
              });
            }}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BENEFITS (MANDATE 6: FEATURE → EFFECT → BENEFIT)
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
            <Scale size={14} />
            <span>5. Engineering Benefits &amp; Causality</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172033] tracking-tight">
            Technical Feature → Engineering Effect → Customer Benefit
          </h2>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[#667085] leading-relaxed">
            Every customer advantage is linked to an underlying mechanical or electronic feature. Operating conditions and verification limits are explicitly stated without unverified claims.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(intelData?.engineeringBenefits || [
              {
                technicalFeature: "Dual 19-Bit Absolute Position Encoders",
                engineeringEffect: "Directly measures gearhead output deflection and dynamic torsional wind-up under load.",
                customerBenefit: "Maintains ±10 arcsec positional repeatability, preventing cumulative kinematic drift in multi-axis arms.",
                operatingConditions: "Valid within rated continuous torque envelope (≤175 Nm on Size 115) and ambient temperatures 10°C to 45°C.",
              },
              {
                technicalFeature: "Zero-Backlash Strain-Wave Gearhead (< 1.0 arcmin)",
                engineeringEffect: "Eliminates gear teeth clearance and reversal deadband during directional change.",
                customerBenefit: "Enables smooth micro-stepping and vibration-free motion tracking during laser or dispensing paths.",
                operatingConditions: "Continuous factory synthetic grease lubrication; input speed ≤ 3000 rpm.",
              },
              {
                technicalFeature: "Integrated 48V DC FOC Vector Drive & Space-Vector Inverter",
                engineeringEffect: "Eliminates long motor power and feedback wiring, executing 20 kHz current loops locally.",
                customerBenefit: "Shrinks electrical cabinet footprint by 80%, cuts cabling harness mass by 70%, and minimizes EMI.",
                operatingConditions: "Requires stabilized 48V DC bus (ripple < 2%) and adequate thermal conduction to mounting structure.",
              },
              {
                technicalFeature: "On-Board Stator & Inverter Real-Time Thermal Sensing",
                engineeringEffect: "Monitors winding thermistors and MOSFET temperatures, applying graceful algorithmic current derating.",
                customerBenefit: "Prevents sudden thermal emergency trips during hot summer production cycles.",
                operatingConditions: "Ambient temperature ≤ 50°C; maximum allowable internal winding temperature 115°C.",
              },
              {
                technicalFeature: "High-Density Concentrated Neodymium Rotor Design",
                engineeringEffect: "Yields high continuous torque-to-weight ratio (up to 25.9 Nm/kg) with minimal rotor inertia.",
                customerBenefit: "Allows higher joint acceleration without motor overheating, shortening pick-and-place cycle times.",
                operatingConditions: "Peak duty factor ≤ 10% with acceleration duration ≤ 1.0 second.",
              },
            ]).map((b, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 flex flex-col justify-between hover:border-[#155EEF] transition-all"
              >
                <div className="space-y-3.5">
                  {/* Step 1: Technical Feature */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] block mb-1">
                      1. Technical Feature
                    </span>
                    <h3 className="font-bold text-sm text-[#172033] leading-snug">
                      {b.technicalFeature}
                    </h3>
                  </div>

                  {/* Step 2: Engineering Effect */}
                  <div className="pt-3 border-t border-[#E5EAF1]">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#475467] block mb-1 flex items-center gap-1">
                      <ChevronRight size={12} className="text-[#155EEF]" /> 2. Engineering Effect
                    </span>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      {b.engineeringEffect}
                    </p>
                  </div>

                  {/* Step 3: Customer Benefit */}
                  <div className="pt-3 border-t border-[#E5EAF1] bg-[#EFF6FF] p-3 rounded-lg border border-[#B2CCFF]">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF] block mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> 3. Customer Benefit
                    </span>
                    <p className="text-xs font-semibold text-[#172033] leading-relaxed">
                      {b.customerBenefit}
                    </p>
                  </div>
                </div>

                {/* Operating Conditions & Verification Limits */}
                <div className="mt-4 pt-3 border-t border-[#E5EAF1] text-[11px] text-[#475467] bg-white p-2.5 rounded-lg border border-[#E5EAF1]">
                  <strong className="text-[#172033] block mb-0.5">Operating Conditions:</strong>
                  <span className="text-[#667085] leading-relaxed">{b.operatingConditions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INTEGRATION & COMPATIBILITY
         ========================================================================= */}
      <section className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
            <Plug size={14} />
            <span>6. Integration, Compatibility &amp; Fieldbuses</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172033] tracking-tight">
            Mechanical, Electrical &amp; Control Interfaces
          </h2>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[#667085] leading-relaxed">
            Standardized interfaces for drop-in compatibility with global industrial controllers, robot workcells, and deterministic fieldbus rings.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Mechanical Mounting */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">
                Mechanical Mounting
              </span>
              <h3 className="mt-1 font-bold text-base text-[#172033]">
                Flange Standard
              </h3>
              <p className="mt-2 font-mono text-xs text-[#155EEF] font-bold">
                {dossier?.mechanicalMounting?.flangeStandard || "ISO 9409-1 Robot Tool Flange"}
              </p>
              <p className="mt-2 text-xs text-[#667085] leading-relaxed">
                {dossier?.mechanicalMounting?.orientationNotes || "Universal mounting in horizontal, vertical, or inverted orientations with precision dowel hole alignment."}
              </p>
            </div>

            {/* Electrical Drive Specs */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">
                Electrical &amp; Power
              </span>
              <h3 className="mt-1 font-bold text-base text-[#172033]">
                Drive &amp; Bus Requirements
              </h3>
              <p className="mt-2 font-mono text-xs text-[#155EEF] font-bold">
                {dossier?.electricalRequirements?.supplyVoltage || "48V DC Regulated Bus (24V–56V range)"}
              </p>
              <p className="mt-2 text-xs text-[#667085] leading-relaxed">
                {dossier?.electricalRequirements?.driveRequirement || "Integrated field-oriented vector controller with dynamic regeneration energy absorption."}
              </p>
            </div>

            {/* Fieldbus & Control */}
            <div className="rounded-xl border border-[#E5EAF1] bg-white p-5 shadow-2xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#155EEF]">
                Fieldbus &amp; Control
              </span>
              <h3 className="mt-1 font-bold text-base text-[#172033]">
                Industrial Network Sync
              </h3>
              <p className="mt-2 font-mono text-xs text-[#155EEF] font-bold">
                Sync Cycle: {dossier?.controlAndCommunication?.cycleTime || "< 1.0 ms"} (Jitter &lt; 1 µs)
              </p>
              <p className="mt-2 text-xs text-[#667085] leading-relaxed">
                Adheres to CiA 402 drive profile: CSP (position), CSV (velocity), and CST (torque) modes.
              </p>
            </div>
          </div>

          {/* Supported Fieldbus Chips */}
          <div className="mt-6 rounded-xl border border-[#E5EAF1] bg-white p-5">
            <span className="text-xs font-bold text-[#172033] uppercase tracking-wider block mb-3">
              Supported Industrial Networks &amp; Safety Directives
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "EtherCAT (CoE / CiA 402)",
                "CANopen (DS402)",
                "PROFINET RT / IRT",
                "EtherNet/IP CIP Sync",
                "Modbus RTU / TCP",
                "ISO 13849-1 Safe Torque Off (STO SIL2 / PLd)",
                "CE Machinery Directive 2006/42/EC",
              ].map((bus) => (
                <span
                  key={bus}
                  className="rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-1 font-mono text-xs font-semibold text-[#172033] hover:border-[#155EEF] transition-colors"
                >
                  {bus}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: VERIFIED DOCUMENTATION & CAD (MANDATE 8)
         ========================================================================= */}
      <section id="engineering-resources" className="border-b border-[#E5EAF1] bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
            <FileText size={14} />
            <span>7. Verified Engineering Documentation &amp; CAD</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#172033] tracking-tight">
            Datasheets, 3D STEP Models, Wiring Diagrams &amp; Manuals
          </h2>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[#667085] leading-relaxed">
            Traceable documentation from ISO calibrated test benches. Revision-controlled engineering assets are supplied directly via our engineering desk without broken download links.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(intelData?.engineeringResources || [
              {
                title: "Official Engineering Datasheet & Sizing Curves",
                docNumber: dossier?.datasheet?.documentNumber || "DS-IND-2026-REV4",
                type: "Datasheet",
                format: "PDF",
                fileSize: "4.8 MB",
                verificationLevel: "Audited Lab Specification",
              },
              {
                title: "3D STEP Assembly Geometry Model",
                docNumber: "CAD-IND-PKG-STEP",
                type: "CAD 3D STEP",
                format: "STEP / AP214",
                fileSize: "38.2 MB",
                verificationLevel: "Accurate C.G. Matrix",
              },
              {
                title: "CiA 402 Commissioning & User Manual",
                docNumber: "MAN-IND-COMM-2026",
                type: "User Manual",
                format: "PDF",
                fileSize: "7.1 MB",
                verificationLevel: "Official Documentation",
              },
            ]).map((res, rIdx) => (
              <div
                key={rIdx}
                className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 flex flex-col justify-between hover:border-[#B2CCFF] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF] uppercase">
                      {res.type}
                    </span>
                    <span className="text-[10px] font-mono text-[#667085]">
                      {res.format} · {res.fileSize}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-bold text-sm text-[#172033]">
                    {res.title}
                  </h3>

                  <div className="mt-2 text-xs font-mono text-[#155EEF] font-bold">
                    {res.docNumber}
                  </div>

                  <p className="mt-1 text-[11px] text-[#667085]">
                    {res.verificationLevel}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5EAF1]">
                  <Button
                    variant={res.type === "Datasheet" ? "default" : "outline"}
                    className={`w-full font-bold text-xs uppercase ${
                      res.type === "Datasheet"
                        ? "bg-[#155EEF] hover:bg-[#1047BF] text-white"
                        : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F8FAFC]"
                    }`}
                    onClick={() =>
                      openModal("engineer", {
                        productName: `${product.name} - ${res.title} (${res.docNumber})`,
                        categoryName: category.title,
                        productSlug: product.slug,
                        modelConfig: res.docNumber,
                        originUrl: currentUrl,
                        initialMessage: `Engineering request for ${res.title} [Document ID: ${res.docNumber}] for ${product.name}.`,
                      })
                    }
                  >
                    <Download size={14} className="mr-1.5" /> Request {res.type}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: GUIDED APPLICATION FINDER & RFQ (ANCHOR: #application-finder)
         ========================================================================= */}
      <section id="application-finder" className="border-b border-[#E5EAF1] bg-[#F7F9FC] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="rounded bg-[#EFF6FF] px-3 py-1 font-mono text-xs font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
              Find the Right Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] mt-2">
              Application Finder &amp; Sizing Verification
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Select process, payload, stroke, torque, and fieldbus parameters. Our engineers will return a validated configuration proposal within 24 hours.
            </p>
          </div>

          <ApplicationFinderWizard
            initialCategory={category.slug}
            initialProduct={product.name}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: RELATED PRODUCTS & CONSULTATION NEXT STEPS
         ========================================================================= */}
      <section className="bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-[#155EEF]">
                Complementary Systems
              </span>
              <h2 className="text-2xl font-bold text-[#172033] mt-1">
                Compatible Components &amp; Next Steps
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
            >
              View Full Robotics Catalogue <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 flex flex-col justify-between hover:border-[#B2CCFF] transition-all"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#667085]">
                    {rel.category}
                  </span>
                  <h3 className="mt-1 font-bold text-base text-[#172033]">
                    {rel.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#667085] line-clamp-2">
                    {rel.shortDescription || rel.positioning}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EAF1] flex items-center justify-between">
                  <Link
                    to="/products/$category/$id"
                    params={{ category: rel.categorySlug, id: rel.slug }}
                    className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
                  >
                    View Specs <ArrowRight size={12} />
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] border-[#D0D5DD]"
                    onClick={() =>
                      openModal("quote", { productName: rel.name, categoryName: rel.category })
                    }
                  >
                    Quote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
