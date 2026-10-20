export type VerificationStatus =
  | "verified"
  | "configurable"
  | "preliminary"
  | "custom-on-request";

export interface CatalogueRange {
  id: string;
  name: string;
  lineId: string;
  lineName: string;
  engineeringPurpose: string;
  operatingPrinciple: string;
  typicalApplications: string[];
  keySelectionCriteria: string[];
  compatibility: string[];
  specificationSummary: Record<string, string>;
  cadStepAvailable: boolean;
  datasheetAvailable: boolean;
  verificationStatus: VerificationStatus;
  traceableSource: string;
  relatedComponents: string[];
  relatedApplicationIds: string[];
}

export interface CatalogueLine {
  id: string;
  name: string;
  shortDescription: string;
  overview: string;
  engineeringStandard: string;
  primaryIndustries: string[];
  ranges: CatalogueRange[];
}
