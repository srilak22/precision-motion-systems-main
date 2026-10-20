import { ApplicationArea, IndustrialUseCase, IntelligenceLevel } from "./applications/types";
import { automotiveApp } from "./applications/automotive";
import { electronicsApp } from "./applications/electronics";
import { aerospaceApp } from "./applications/aerospace";
import { metalMachiningApp } from "./applications/metalMachining";
import { warehousingApp } from "./applications/warehousing";
import { foodBeverageApp } from "./applications/foodBeverage";
import { pharmaApp } from "./applications/pharma";
import { medicalApp } from "./applications/medical";
import { plasticsApp } from "./applications/plastics";
import { packagingApp } from "./applications/packaging";
import { agricultureApp } from "./applications/agriculture";
import { constructionApp } from "./applications/construction";
import { energyApp } from "./applications/energy";
import { chemicalsApp } from "./applications/chemicals";
import { textilesApp } from "./applications/textiles";
import { miningApp } from "./applications/mining";
import { educationApp } from "./applications/education";
import { humanoidApp } from "./applications/humanoid";

export const ALL_18_APPLICATIONS: ApplicationArea[] = [
  automotiveApp,
  electronicsApp,
  aerospaceApp,
  metalMachiningApp,
  warehousingApp,
  foodBeverageApp,
  pharmaApp,
  medicalApp,
  plasticsApp,
  packagingApp,
  agricultureApp,
  constructionApp,
  energyApp,
  chemicalsApp,
  textilesApp,
  miningApp,
  educationApp,
  humanoidApp,
];

export const all18ApplicationsData = ALL_18_APPLICATIONS;

export function getApplicationBySlug(slug: string): ApplicationArea | undefined {
  return ALL_18_APPLICATIONS.find(
    (app) => app.slug.toLowerCase() === slug.toLowerCase() || app.id.toLowerCase() === slug.toLowerCase()
  );
}

export function getAllUseCases(): IndustrialUseCase[] {
  return ALL_18_APPLICATIONS.flatMap((app) => app.useCases);
}

export function getUseCasesByIntelligenceLevel(level: IntelligenceLevel): IndustrialUseCase[] {
  return getAllUseCases().filter((uc) => uc.intelligenceLevel === level);
}

export function getUseCasesByComponentKeyword(keyword: string): IndustrialUseCase[] {
  const lower = keyword.toLowerCase();
  return getAllUseCases().filter((uc) =>
    uc.relevantComponents.some((c) => c.toLowerCase().includes(lower)) ||
    uc.relevantProductLinks.some((p) => p.name.toLowerCase().includes(lower) || p.href.toLowerCase().includes(lower))
  );
}

export {
  type ApplicationArea,
  type IndustrialUseCase,
  type IntelligenceLevel,
};
