export interface ProductHighlightSpec {
  label: string;
  value: string;
  unit?: string;
  note?: string;
}

export interface NormalizedSpecificationRow {
  parameter: string;
  value: string;
  unit: string;
  notes: string;
  category?: string;
  ratingType?: "Continuous" | "Peak" | "Envelope" | "Standard" | "Verified" | "Nominal";
}

export interface NormalizedVariant {
  modelCode: string;
  headlineMetric: string;
  nominalRating: string;
  peakRating: string;
  ratedSpeedOrVelocity: string;
  precisionOrBacklash: string;
  powerOrCurrent: string;
  massOrDimension: string;
  applicationFit: string;
  verificationStatus: "verified" | "configurable" | "preliminary";
}

export interface NormalizedApplication {
  name: string;
  environment: string;
  challenge: string;
  howProductHelps: string;
  supportingComponents: string[];
  engineeringConsiderations: string;
  benefits: string;
  limitations: string;
}

export interface NormalizedBenefit {
  feature: string;
  effect: string;
  benefit: string;
  conditions: string;
}

export interface NormalizedResource {
  title: string;
  docNumber: string;
  type: "Datasheet" | "CAD 3D STEP" | "Manual" | "Certificate" | "Technical Guide";
  format: string;
  fileSize: string;
  verificationLevel: string;
}

export interface NormalizedFaq {
  question: string;
  answer: string;
}

export interface NormalizedProductData {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryTitle: string;
  familyGroup: string;
  familySlug?: string;
  currentUrl: string;

  // Hero
  shortDescription: string;
  highlights: ProductHighlightSpec[];
  modelCode: string;
  traceableStandard: string;

  // Overview
  whatItIs: string;
  howItWorks: string;
  engineeringProblemSolved: string;
  targetEnvironment: string;
  roleInAutomation: string;

  // Specifications
  specifications: NormalizedSpecificationRow[];
  verificationStandardNotes: string;

  // Variants
  hasGenuineVariants: boolean;
  variants: NormalizedVariant[];

  // Applications
  applications: NormalizedApplication[];

  // Benefits
  benefits: NormalizedBenefit[];

  // Integration
  mechanicalInterface: {
    title: string;
    value: string;
    details: string;
  };
  electricalRequirements: {
    title: string;
    value: string;
    details: string;
  };
  controlAndFieldbus: {
    title: string;
    value: string;
    details: string;
    supportedProtocols: string[];
  };

  // Resources
  resources: NormalizedResource[];

  // Related
  relatedProductIds: string[];

  // FAQs
  faqs: NormalizedFaq[];
}
