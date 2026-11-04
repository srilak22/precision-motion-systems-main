import React, { useState } from "react";
import {
  Building2,
  GraduationCap,
  Factory,
  ShoppingBag,
  Hospital,
  Trees,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface SectorApplication {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  environmentAdaptations: string[];
  keyBenefits: string[];
  recommendedDeployment: string;
}

const SECTOR_APPLICATIONS: SectorApplication[] = [
  {
    id: "smart-cities",
    icon: Building2,
    title: "Smart Cities & Urban Plazas",
    subtitle: "Public Pedestrian Walkways & Municipal Centers",
    description:
      "Autonomous sidewalk and civic square maintenance operating smoothly amidst high foot-traffic, ensuring spotless public corridors without interrupting pedestrians.",
    environmentAdaptations: [
      "Dynamic speed governing (max 4.5 km/h) in crowded pedestrian zones",
      "IP65 weather-sealed chassis for continuous rain and dust tolerance",
      "Low-decibel ultra-quiet electric direct-drive powertrain (<52 dB)",
    ],
    keyBenefits: [
      "Eliminates public litter overflow during peak civic events",
      "Reduces municipal diesel utility truck traffic in plazas",
      "24/7 autonomous patrol coverage with automated docking",
    ],
    recommendedDeployment: "2–4 units per square kilometer",
  },
  {
    id: "campuses",
    icon: GraduationCap,
    title: "Corporate & University Campuses",
    subtitle: "Multi-Building Grounds & Tech Parks",
    description:
      "Sprawling university and corporate headquarters require continuous cleanliness across courtyards, dining lawns, and inter-building transit pathways.",
    environmentAdaptations: [
      "Dynamic schedule switching: off-peak morning runs and post-lunch sweeps",
      "Seamless outdoor-to-covered breezeway navigation without GPS loss",
      "Multi-building perimeter geofencing and barrier avoidance",
    ],
    keyBenefits: [
      "Substantially reduced ground maintenance labor overhead",
      "Enhanced campus sustainability index and green certifications",
      "Zero disruption to lectures, executive tours, or student transit",
    ],
    recommendedDeployment: "1 unit per 20–30 campus acres",
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Industrial & Manufacturing Plants",
    subtitle: "Workshops, Loading Docks & Assembly Facilities",
    description:
      "Heavy-duty environments with metallic debris, packaging scrap, and forklift traffic demand ruggedized chassis durability and uncompromising industrial safety.",
    environmentAdaptations: [
      "Puncture-proof solid polyurethane drive wheels with active suspension",
      "Heavy-duty internal hopper liner resistant to industrial scrap and grease",
      "Integration with plant AGV traffic management and safety interlocks",
    ],
    keyBenefits: [
      "Prevents slip and trip hazards from loose packaging straps or pallets",
      "Continuous debris clearing around high-traffic loading docks",
      "Frees maintenance crew for critical machinery servicing",
    ],
    recommendedDeployment: "1 unit per 80,000 sq.ft facility footprint",
  },
  {
    id: "commercial-transit",
    icon: ShoppingBag,
    title: "Commercial Malls & Transit Hubs",
    subtitle: "Airports, Railway Terminals & Retail Plazas",
    description:
      "High-density commercial hubs require immaculate hygiene and polished aesthetics while safely navigating around fast-moving crowds and luggage carts.",
    environmentAdaptations: [
      "360° tactile bumper and optical safety curtain with instant deceleration",
      "Sleek architectural exterior with integrated anti-glare branding displays",
      "Precision indoor localization using LiDAR floor contour SLAM",
    ],
    keyBenefits: [
      "Continuous concourse cleanliness between scheduled janitorial passes",
      "Rapid autonomous clearing of food court spills and wrappers",
      "Visible showcase of modern technological sophistication",
    ],
    recommendedDeployment: "2–6 units per transit terminal",
  },
  {
    id: "healthcare",
    icon: Hospital,
    title: "Hospitals & Healthcare Campuses",
    subtitle: "Hospital Courtyards & Medical Logistics Grounds",
    description:
      "Sanitary healthcare facilities demand strict segregation protocols to handle exterior medical campus grounds and non-clinical perimeter waste.",
    environmentAdaptations: [
      "Antimicrobial chassis coatings and sealed bio-barrier hopper gaskets",
      "Hazardous material visual lockout flags with automated warning beeper",
      "Ultra-hygienic automated steam-wash dock compatibility",
    ],
    keyBenefits: [
      "Minimizes manual staff exposure to discarded PPE or sharp waste",
      "Ensures exterior patient walkways remain spotless and sanitary",
      "Complies with rigorous healthcare environmental sanitation criteria",
    ],
    recommendedDeployment: "1 unit per medical pavilion cluster",
  },
  {
    id: "parks-recreation",
    icon: Trees,
    title: "Parks & Recreational Grounds",
    subtitle: "Public Botanical Gardens, Marinas & Nature Reserves",
    description:
      "Outdoor recreational areas feature uneven turf, paved trails, seasonal fallen debris, and vast acreage requiring autonomous long-range navigation.",
    environmentAdaptations: [
      "All-terrain four-wheel independent suspension and high ground clearance",
      "Solar canopy top assist extending daytime battery endurance by 20%",
      "Long-range RTK-GNSS perimeter geofencing preserving fragile garden beds",
    ],
    keyBenefits: [
      "Maintains expansive park acreage without noise or fumes",
      "Reduces petrol utility quad-bike usage in serene green zones",
      "Prevents animal scavenging by clearing discarded picnic waste",
    ],
    recommendedDeployment: "1 unit per 15–25 park acres",
  },
];

export function IndustryApplications() {
  const [activeSectorId, setActiveSectorId] = useState<string>("smart-cities");

  const activeSector =
    SECTOR_APPLICATIONS.find((s) => s.id === activeSectorId) || SECTOR_APPLICATIONS[0];
  const ActiveIcon = activeSector.icon;

  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Building2 size={13} className="text-[#155EEF]" />
            <span>Target Operating Sectors</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Industry Applications &amp; <br />
            <span className="text-[#155EEF]">Environmental Adaptations</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every operating environment presents unique surface terrains, safety constraints, and
            waste generation dynamics. Discover how the INDUS platform adapts to your facility.
          </p>
        </div>

        {/* Sector Tabs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {SECTOR_APPLICATIONS.map((sector) => {
            const Icon = sector.icon;
            const isSelected = sector.id === activeSectorId;

            return (
              <button
                key={sector.id}
                onClick={() => setActiveSectorId(sector.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-[#155EEF] bg-blue-50 shadow-sm ring-1 ring-[#155EEF]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`size-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? "bg-[#155EEF] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {sector.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Deep-Dive Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Context & Overview */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-[#155EEF]/10 border border-[#155EEF]/20 flex items-center justify-center text-[#155EEF]">
                  <ActiveIcon size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                    Application Domain
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {activeSector.title}
                  </h3>
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-700 mb-3">
                {activeSector.subtitle}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {activeSector.description}
              </p>

              {/* Recommended Deployment */}
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Typical Deployment Density
                </div>
                <div className="text-base font-bold font-mono text-[#155EEF]">
                  {activeSector.recommendedDeployment}
                </div>
              </div>
            </div>

            {/* Right Column: Adaptations & Benefits */}
            <div className="lg:col-span-6 space-y-6">
              {/* Adaptations */}
              <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#155EEF]" />
                  <span>Specific Engineering Adaptations</span>
                </h4>
                <div className="space-y-2">
                  {activeSector.environmentAdaptations.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <span className="size-1.5 rounded-full bg-[#155EEF] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Benefits */}
              <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-2xs">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Demonstrated Operational Value</span>
                </h4>
                <div className="space-y-2">
                  {activeSector.keyBenefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 shrink-0 mt-0.5"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
