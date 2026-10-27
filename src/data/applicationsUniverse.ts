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

export const APPLICATION_ALIASES: Record<string, string> = {
  aerospace: "aerospace-defence",
  "aerospace-defense": "aerospace-defence",
  pharmaceuticals: "pharmaceuticals-lifesciences",
  pharma: "pharmaceuticals-lifesciences",
  "pharma-lifesciences": "pharmaceuticals-lifesciences",
  "medical-devices": "medical-devices-healthcare",
  medical: "medical-devices-healthcare",
  packaging: "packaging-consumer-goods",
  agriculture: "agritech-agriculture",
  agritech: "agritech-agriculture",
  "agriculture-agritech": "agritech-agriculture",
  construction: "construction-building",
  chemicals: "chemicals-process",
  energy: "energy-utilities",
  electronics: "electronics-semiconductor",
  semiconductor: "electronics-semiconductor",
  "metal-machining": "metal-fabrication-machining",
  "metal-fabrication": "metal-fabrication-machining",
  warehousing: "warehousing-intralogistics",
  plastics: "plastics-rubber",
  manufacturing: "metal-fabrication-machining",
  "inspection-quality": "machine-vision-inspection",
  inspection: "machine-vision-inspection",
  "machine-vision-inspection": "machine-vision-inspection",
  welding: "welding",
  "robotic-welding": "welding",
  logistics: "warehousing-intralogistics",
  "food-packaging": "food-beverage",
  "machine-tending": "machine-tending",
  "pick-and-place": "pick-and-place",
  "pick-place": "pick-and-place",
  assembly: "assembly-automation",
  "assembly-automation": "assembly-automation",
  "material-handling": "material-handling",
  palletizing: "palletizing-depalletizing",
  "palletizing-depalletizing": "palletizing-depalletizing",
  "surface-finishing": "surface-finishing",
};

export function getApplicationBySlug(slug: string): ApplicationArea | undefined {
  const norm = slug.toLowerCase().trim();
  const direct = ALL_18_APPLICATIONS.find(
    (app) => app.slug.toLowerCase() === norm || app.id.toLowerCase() === norm
  );
  if (direct) return direct;
  const aliasedId = APPLICATION_ALIASES[norm];
  if (aliasedId) {
    return ALL_18_APPLICATIONS.find((app) => app.id.toLowerCase() === aliasedId);
  }
  return ALL_18_APPLICATIONS.find((app) => app.id.toLowerCase().startsWith(norm) || norm.startsWith(app.id.toLowerCase()));
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
