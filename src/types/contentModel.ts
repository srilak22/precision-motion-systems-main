/**
 * INDUS Industrial Robotics — Unified Content Model & Taxonomy Schemas
 * 
 * Strict typing for:
 * 1. Product & Product Ranges
 * 2. Product Specifications (SI Units & ISO/DIN standards)
 * 3. Solutions (Turnkey Automation Systems)
 * 4. Applications (Industrial Manufacturing Sectors)
 * 5. Industries (18 Verticals with verified use cases)
 * 6. Resources (CAD STEP, Datasheets, Whitepapers)
 * 7. Navigation Items & Mega-Menu Hierarchy
 * 8. Enquiry & Telemetry Context
 */

export type VerificationStatus =
  | "verified"
  | "configurable"
  | "preliminary"
  | "custom-on-request";

export interface ProductSpecification {
  id: string;
  productId: string;
  parameterName: string;
  value: string;
  unit?: string;
  minimumValue?: number;
  maximumValue?: number;
  tolerance?: string;
  operatingConditions?: string;
  sourceReference: string;
  verifiedAt?: string;
}

export interface ProductVariant {
  modelCode: string;
  name: string;
  ratioOrStroke: string;
  ratedTorqueOrThrust: string;
  backlashOrRepeatability: string;
  massKg?: number;
  cadFileUrl?: string;
}

export interface ProductEntity {
  id: string;
  slug: string;
  name: string;
  productFamily: string;
  productType: string;
  shortDescription: string;
  fullDescription: string;
  primaryImage: string;
  gallery?: string[];
  useCases: string[];
  applications: string[];
  industries: string[];
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  relatedProducts: string[];
  relatedSolutions: string[];
  relatedResources: string[];
  datasheets: {
    title: string;
    url: string;
    fileSize?: string;
  }[];
  seoTitle: string;
  seoDescription: string;
  publicationStatus: "published" | "draft" | "archived";
}

export interface SolutionEntity {
  id: string;
  slug: string;
  name: string;
  customerProblem: {
    headline: string;
    painPoints: string[];
  };
  overview: string;
  workflow: {
    step: string;
    title: string;
    description: string;
  }[];
  requiredCapabilities: string[];
  systemComponents: {
    name: string;
    category: string;
    href: string;
  }[];
  relatedProducts: string[];
  relatedApplications: string[];
  relatedIndustries: string[];
  implementationScope: string;
  relatedResources: {
    title: string;
    type: string;
    href: string;
  }[];
  enquiryCTA: {
    label: string;
    actionType: "quote" | "consultation" | "rfq";
  };
  publicationStatus: "published" | "draft";
}

export interface ApplicationUseCase {
  id: string;
  title: string;
  industry: string;
  taktTime?: string;
  payloadRequirement?: string;
  precisionTarget?: string;
  description: string;
  componentsUsed: string[];
  standardReference?: string;
}

export interface ApplicationEntity {
  id: string;
  slug: string;
  name: string;
  description: string;
  operationalChallenge: string;
  processSteps: string[];
  technicalRequirements: string[];
  relevantSolutions: string[];
  relevantProducts: string[];
  relevantIndustries: string[];
  media?: {
    type: "image" | "diagram";
    url: string;
    caption: string;
  }[];
  useCases?: ApplicationUseCase[];
  relatedResources: string[];
  enquiryCTA: {
    label: string;
    context: string;
  };
}

export interface IndustryEntity {
  id: string;
  slug: string;
  name: string;
  overview: string;
  commonChallenges: string[];
  applications: string[];
  relevantProducts: string[];
  relevantSolutions: string[];
  relatedResources: string[];
  supportingEvidence: {
    standardCodes: string[];
    typicalTaktTime: string;
    uptimeRequirement: string;
  };
  publicationStatus: "published" | "draft";
}

export interface ResourceEntity {
  id: string;
  slug: string;
  title: string;
  resourceType: "datasheet" | "cad-step" | "whitepaper" | "application-note" | "manual" | "faq";
  summary: string;
  associatedProducts: string[];
  associatedSolutions: string[];
  associatedApplications: string[];
  fileReference: {
    fileName: string;
    fileSize: string;
    format: "pdf" | "step" | "dxf" | "zip";
    downloadUrl: string;
  };
  version: string;
  language: string;
  publicationDate: string;
  accessPermissions: "public" | "registration-required";
  seoMetadata: {
    title: string;
    description: string;
  };
}

export interface NavigationItemEntity {
  id: string;
  label: string;
  href: string;
  parentId?: string;
  order: number;
  depth: 1 | 2 | 3;
  menuGroup?: string;
  description?: string;
  icon?: string;
  previewImage?: string;
  badge?: string;
  targetType: "internal" | "external" | "modal";
  relatedContentId?: string;
  visibility: "all" | "desktop-only" | "mobile-only";
  activeMatchRules: string[];
}

export interface EnquiryContext {
  enquiryType: "quote" | "consultation" | "custom_engineering" | "datasheet_request";
  contactDetails: {
    name: string;
    email: string;
    phone?: string;
    preferredChannel?: "email" | "phone" | "whatsapp";
  };
  companyDetails?: {
    companyName: string;
    industrySector?: string;
    plantLocation?: string;
  };
  productContext?: {
    productId?: string;
    productLine?: string;
    modelCode?: string;
    quantity?: number;
  };
  applicationContext?: {
    industryId?: string;
    applicationId?: string;
    motionAxes?: number;
  };
  technicalRequirements?: {
    ratedTorqueNm?: string;
    reductionRatio?: string;
    backlashLimitArcmin?: string;
    strokeLengthMm?: string;
    payloadKg?: string;
    targetTaktSeconds?: string;
    operatingVoltage?: string;
    fieldbusProtocol?: string;
  };
  projectDescription?: string;
  consentStatus: boolean;
  submissionStatus: "pending" | "dispatched" | "logged" | "failed";
  sourcePage: string;
  trackingContext?: {
    sessionId: string;
    referrer?: string;
    utmSource?: string;
    utmCampaign?: string;
  };
}
