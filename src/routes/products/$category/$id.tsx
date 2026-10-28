import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProduct, getCategory } from "@/data/robotics";
import { getEngineeringDossier } from "@/data/engineeringData";
import { getIntelligentActuator } from "@/data/intelligentActuatorsData";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { normalizeProductData } from "@/lib/normalizeProductData";
import { ProductBreadcrumbs } from "@/components/products/ProductBreadcrumbs";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductOverview } from "@/components/products/ProductOverview";
import { ProductSpecTable } from "@/components/products/ProductSpecTable";
import { ProductVariants } from "@/components/products/ProductVariants";
import { ProductApplications } from "@/components/products/ProductApplications";
import { ProductBenefits } from "@/components/products/ProductBenefits";
import { ProductIntegration } from "@/components/products/ProductIntegration";
import { ProductDownloads } from "@/components/products/ProductDownloads";
import { ProductRelated } from "@/components/products/ProductRelated";
import { ProductFaqs } from "@/components/products/ProductFaqs";
import { ProductEnquiryCta } from "@/components/products/ProductEnquiryCta";
import { ProductFamilyOperatingPrinciple } from "@/components/engineering/ProductFamilyOperatingPrinciple";
import { IntelligentActuatorDashboard } from "@/components/engineering/IntelligentActuatorDashboard";
import type { NormalizedVariant, NormalizedResource } from "@/components/products/types";

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
    const intelData = loaderData?.intelData;

    const titleModel = dossier?.modelCode || (intelData ? intelData.modelVariants[0]?.modelCode : product?.slug?.toUpperCase());
    const desc =
      dossier?.functionalOverview ||
      intelData?.headline ||
      product?.overview ||
      product?.shortDescription ||
      "Industrial robotics engineering specification, kinematic envelope, and CAD models.";

    return buildSeoMeta({
      title: `${product?.name || "Product"} (${titleModel || "Industrial"}) Specifications | INDUS`,
      description: desc,
      path: `/products/${category?.slug || ""}/${product?.slug || ""}`,
      ogType: "article",
    });
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product, category, dossier, intelData } = Route.useLoaderData();
  const { openModal } = useModals();

  // Normalize data across all 8 master categories, 14 catalogue lines, and legacy dossiers
  const data = normalizeProductData(product, category, dossier, intelData);

  const handleOpenQuoteModal = (customProduct?: string, modelConfig?: string) => {
    openModal("quote", {
      productName: customProduct || data.name,
      categoryName: data.categoryTitle,
      productSlug: data.slug,
      modelConfig: modelConfig || data.modelCode,
      originUrl: data.currentUrl,
    });
  };

  const handleOpenConsultationModal = (initialMessage?: string) => {
    openModal("engineer", {
      categoryName: data.categoryTitle,
      productName: `${data.name} (Engineering Consultation)`,
      productSlug: data.slug,
      modelConfig: data.modelCode,
      originUrl: data.currentUrl,
      initialMessage:
        initialMessage ||
        `Technical inquiry regarding ${data.name} [Model: ${data.modelCode}]. Please provide dynamic sizing verification, 3D STEP geometry, and fieldbus configuration support.`,
    });
  };

  const handleSelectVariantForQuote = (variant: NormalizedVariant) => {
    handleOpenQuoteModal(`${data.name} (${variant.modelCode})`, variant.modelCode);
  };

  const handleRequestResource = (resource: NormalizedResource) => {
    handleOpenConsultationModal(
      `Engineering request for document "${resource.title}" [Ref: ${resource.docNumber}] for ${data.name}. Please supply revision-controlled PDF / STEP file.`,
    );
  };

  // Structured JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://precision-motion-systems-main.vercel.app/products/${data.categorySlug}/${data.slug}#product`,
        name: data.name,
        model: data.modelCode,
        description: data.shortDescription,
        category: data.categoryTitle,
        brand: {
          "@type": "Brand",
          name: "INDUS",
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: `https://precision-motion-systems-main.vercel.app/products/${data.categorySlug}/${data.slug}`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* =========================================================================
          SECTION 1: BREADCRUMB NAVIGATION BAR
         ========================================================================= */}
      <div className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <ProductBreadcrumbs
            categorySlug={data.categorySlug}
            categoryTitle={data.categoryTitle}
            familyGroup={data.familyGroup}
            productName={data.name}
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: PRODUCT HERO
         ========================================================================= */}
      <ProductHero
        data={data}
        onRequestQuote={() => handleOpenQuoteModal()}
        onRequestConsultation={() => handleOpenConsultationModal()}
      />

      {/* =========================================================================
          SECTION 3: PRODUCT OVERVIEW
         ========================================================================= */}
      <ProductOverview data={data} />

      {/* Mechatronic Operating Principle Sequence (where applicable) */}
      <ProductFamilyOperatingPrinciple
        categorySlug={data.categorySlug}
        productName={data.name}
      />

      {/* Intelligent Actuator Telemetry Dashboard (if intelligent actuator) */}
      {intelData && (
        <section className="border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-[1440px] space-y-10">
            <div>
              <span className="rounded bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
                Mechatronic Subsystems
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
                Integrated Multi-Disciplinary Joint Architecture
              </h2>
              <p className="mt-2 text-sm text-[#475467] leading-relaxed max-w-3xl">
                Packages brushless servomotor, zero-backlash harmonic reducer, dual absolute 19-bit optical encoders, and integrated 48V DC FOC drive into an IP65 mechatronic package.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {intelData.mechatronicArchitecture.map((sub, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-4 shadow-2xs hover:border-[#155EEF] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[9.5px] font-mono font-bold text-[#155EEF] uppercase">
                      {sub.category.replace("-", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-[#16A34A] font-bold">
                      {sub.status}
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-xs text-[#172033]">{sub.name}</h4>
                  <p className="mt-1 text-[11px] font-mono text-[#155EEF] leading-snug">
                    {sub.specification}
                  </p>
                  <p className="mt-2 pt-2 border-t border-[#E5EAF1] text-[11px] text-[#667085] leading-relaxed">
                    {sub.purpose}
                  </p>
                </div>
              ))}
            </div>

            <IntelligentActuatorDashboard actuatorModel={data.modelCode || "IND-IRA-090-80"} />
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: TECHNICAL SPECIFICATIONS
         ========================================================================= */}
      <ProductSpecTable
        data={data}
        onRequestQuote={() => handleOpenQuoteModal(undefined, "Custom Sizing Matrix")}
      />

      {/* =========================================================================
          SECTION 5: PRODUCT VARIANTS AND CONFIGURATIONS
         ========================================================================= */}
      <ProductVariants
        data={data}
        onSelectVariantForQuote={handleSelectVariantForQuote}
      />

      {/* =========================================================================
          SECTION 6: APPLICATIONS AND USE CASES
         ========================================================================= */}
      <ProductApplications data={data} />

      {/* =========================================================================
          SECTION 7: BENEFITS AND CAUSALITY
         ========================================================================= */}
      <ProductBenefits data={data} />

      {/* =========================================================================
          SECTION 8: INTEGRATION AND COMPATIBILITY
         ========================================================================= */}
      <ProductIntegration data={data} />

      {/* =========================================================================
          SECTION 9: CAD, DRAWINGS, AND TECHNICAL DOCUMENTS
         ========================================================================= */}
      <ProductDownloads
        data={data}
        onRequestResource={handleRequestResource}
      />

      {/* =========================================================================
          SECTION 10: RELATED PRODUCTS
         ========================================================================= */}
      <ProductRelated
        data={data}
        onQuickQuote={(relName, relCat) => handleOpenQuoteModal(relName)}
      />

      {/* =========================================================================
          SECTION 11: FREQUENTLY ASKED QUESTIONS
         ========================================================================= */}
      <ProductFaqs data={data} />

      {/* =========================================================================
          SECTION 12: ENGINEERING ENQUIRY (ON-PAGE RFQ)
         ========================================================================= */}
      <ProductEnquiryCta data={data} />
    </div>
  );
}
