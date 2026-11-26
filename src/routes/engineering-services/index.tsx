import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  Bot,
  BrainCircuit,
  CircuitBoard,
  DraftingCompass,
  Gauge,
  Layers3,
  Move3d,
  Radio,
  ShieldCheck,
  Sparkles,
  Wrench,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { ENGINEERING_SERVICES, type EngineeringServiceItem } from "@/data/engineeringServicesData";
import { images } from "@/lib/images";

export const Route = createFileRoute("/engineering-services/")({
  head: () =>
    buildSeoMeta({
      title: "Engineering Services & 3D Robotics Platforms | INDUS Robotics",
      description:
        "Aligned with our Engineering Stack: Physical AI, 3D Motion Studio, Digital Twin, Robotics Ecosystem, Indus Bot 2.0, and turnkey robotics engineering services.",
      path: "/engineering-services",
    }),
  component: EngineeringServicesLandingPage,
});

interface MenuPlatformItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: React.ElementType;
  image: string;
  highlight?: boolean;
}

const MENU_ALIGNED_PLATFORMS: MenuPlatformItem[] = [
  {
    id: "physical-ai",
    title: "Physical AI Platform",
    badge: "Flagship • 3D Vision",
    description:
      "3D point clouds, vision-language-action (VLA) models, and 1kHz deterministic robot control.",
    href: "/technology/physical-ai",
    ctaLabel: "Open Physical AI",
    icon: BrainCircuit,
    image: images.vision3dCamera,
    highlight: true,
  },
  {
    id: "motion-studio",
    title: "INDUS Motion Studio",
    badge: "Interactive 3D",
    description:
      "7th-axis dual-robot 3D workcell simulation, inverse kinematics (J1–J6), and inertia ratio sizing.",
    href: "/technology/motion-studio",
    ctaLabel: "Launch 3D Studio",
    icon: Move3d,
    image: images.arm,
    highlight: true,
  },
  {
    id: "digital-twin",
    title: "Digital Twin & Telemetry",
    badge: "Live 3D Twin",
    description:
      "3D virtual workcell simulation, ISO 10816 vibration FFT diagnostics, and AMR fleet tracking.",
    href: "/technology/digital-twin",
    ctaLabel: "View 3D Twin",
    icon: Radio,
    image: images.motionController,
    highlight: true,
  },
  {
    id: "robotics-ecosystem",
    title: "Robotics Ecosystem",
    badge: "Taxonomy",
    description:
      "8-pillar architecture: Humanoids, AMRs, Cobots, AI Vision, Delta, Cartesian, and Soft Grippers.",
    href: "/technology/robotics-ecosystem",
    ctaLabel: "Explore Ecosystem",
    icon: Bot,
    image: images.cobotRobot,
  },
  {
    id: "indus-bot",
    title: "Indus Bot 2.0 AI Assistant",
    badge: "AI + Vision",
    description:
      "Dedicated multimodal engineering assistant for component discovery, voice queries, and vision.",
    href: "/indus-bot",
    ctaLabel: "Launch Indus Bot",
    icon: Sparkles,
    image: images.edgeAiCompute,
  },
  {
    id: "technology-stack",
    title: "Engineering Technology Stack",
    badge: "Architecture",
    description:
      "Explore the full INDUS hardware, kinematics, sizing calculators, and edge telemetry stack.",
    href: "/technology",
    ctaLabel: "Explore Tech Stack",
    icon: Layers3,
    image: images.harmonicReducer,
  },
];

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "application-engineering": DraftingCompass,
  "kinematic-subsystems": Layers3,
  "robotic-workcells": Bot,
  "motion-control": CircuitBoard,
  "safety-compliance": ShieldCheck,
  "custom-robotics": Wrench,
  "lifecycle-optimization": Activity,
};

const SERVICE_IMAGES: Record<string, string> = {
  "application-engineering": images.arm,
  "kinematic-subsystems": images.harmonicReducer,
  "robotic-workcells": images.weldingRobot,
  "motion-control": images.motionController,
  "safety-compliance": images.safetyLaserScanner,
  "custom-robotics": images.cobotRobot,
  "lifecycle-optimization": images.mobile,
};

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Understand Your Goal",
    description: "We review your part dimensions, target cycle speed, and factory floor layout.",
  },
  {
    step: "02",
    title: "3D Simulate & Size",
    description: "Our engineers verify reach, inertia, and 3D workcell layouts in INDUS Motion Studio.",
  },
  {
    step: "03",
    title: "Build & Integrate",
    description: "Complete mechanical assembly, PLC/motion programming, and safety integration.",
  },
  {
    step: "04",
    title: "Test & Support",
    description: "On-site commissioning, live Digital Twin telemetry, and ongoing predictive maintenance.",
  },
];

function EngineeringServicesLandingPage() {
  const { openModal } = useModals();

  const handleDiscussService = (service: EngineeringServiceItem) => {
    openModal("engineer", {
      categoryName: service.title,
      initialMessage: `I would like to discuss engineering requirements for ${service.title}.`,
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* 1. CLEAN HERO SECTION */}
      <section className="border-b border-slate-200 bg-white px-5 py-14 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1360px] grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#155EEF]">
              <Gauge size={13} />
              Engineering Services &amp; 3D Platforms
            </span>

            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
              Precision Motion. <br />
              <span className="text-[#155EEF]">3D Simulation &amp;</span> Engineering.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              Explore our interactive 3D robotics simulators, Physical AI, and Digital Twin platforms,
              backed by turnkey industrial automation engineering from sizing to commissioning.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] transition-all"
              >
                <Link to="/technology/motion-studio">
                  <Move3d size={15} className="mr-2" />
                  Launch 3D Motion Studio
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-lg border-slate-300 bg-white px-5 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] cursor-pointer"
                onClick={() =>
                  openModal("engineer", {
                    categoryName: "Engineering Consultation",
                    initialMessage: "I would like to discuss a robotics automation project.",
                  })
                }
              >
                Talk to an Engineer <ArrowRight size={15} className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={images.weldingRobot}
                  alt="INDUS Industrial Robotics Engineering"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                      3D Kinematics &bull; Physical AI &bull; Turnkey Cells
                    </span>
                    <span className="text-sm font-bold">
                      ±0.02 mm Repeatability &bull; 24/7 Industrial Duty
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ENGINEERING PLATFORMS & 3D SIMULATORS (ALIGNED WITH TOP MENU) */}
      <section id="engineering-platforms" className="px-5 py-16 lg:px-10 lg:py-20 bg-[#F4F7FB]">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#155EEF] font-mono">
                Interactive 3D &amp; AI Platforms
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-slate-900">
                3D Simulation, Physical AI &amp; Digital Twin
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Direct access to every interactive 3D simulator, Physical AI engine, and engineering
                platform from our Engineering suite.
              </p>
            </div>
            <Link
              to="/technology/calculators"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:underline shrink-0"
            >
              <span>Open Sizing Calculators</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MENU_ALIGNED_PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              return (
                <article
                  key={platform.id}
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${
                    platform.highlight
                      ? "border-blue-200 hover:border-[#155EEF]"
                      : "border-slate-200 hover:border-[#155EEF]/50"
                  }`}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={platform.image}
                      alt={platform.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-[#155EEF] shadow-2xs">
                      <Icon size={12} />
                      {platform.badge}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors">
                        {platform.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {platform.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={platform.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:underline"
                      >
                        <span>{platform.ctaLabel}</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. TURNKEY ENGINEERING SERVICES */}
      <section id="service-portfolio" className="border-t border-slate-200 bg-white px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#155EEF] font-mono">
                Turnkey Capabilities
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-slate-900">
                Engineering Services Hub
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Choose the engineering support you need—from component sizing to full robotic cell integration.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/engineering-services/system-integration"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
              >
                System Integration
              </Link>
              <Link
                to="/engineering-services/technical-specifications"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#155EEF] hover:text-[#155EEF] transition-colors"
              >
                Technical Specifications
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ENGINEERING_SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.id] || DraftingCompass;
              const imgSrc = SERVICE_IMAGES[service.id] || images.arm;

              return (
                <article
                  key={service.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#155EEF]/50 hover:bg-white hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={imgSrc}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-[#155EEF] shadow-2xs">
                      <Icon size={12} />
                      {service.badge}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-slate-900 group-hover:text-[#155EEF] transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {service.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between gap-3">
                      <Link
                        to="/engineering-services/$serviceId"
                        params={{ serviceId: service.id }}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#155EEF] hover:underline"
                      >
                        <span>View Details</span>
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDiscussService(service)}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#155EEF] hover:bg-[#155EEF] hover:text-white transition-colors cursor-pointer"
                      >
                        Request Sizing
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SIMPLE 4-STEP PROCESS */}
      <section className="border-t border-slate-200 bg-[#F4F7FB] px-5 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#155EEF] font-mono">
              How We Work
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-slate-900">
              Simple 4-Step Delivery
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#155EEF]/40 hover:shadow-md"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-mono font-bold text-[#155EEF] border border-blue-200">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLEAN CALL TO ACTION */}
      <section className="px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-[1360px]">
          <div className="rounded-2xl border border-blue-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-slate-900">
                Ready to Automate Your Production?
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Share your application requirements and our engineering team will recommend the right
                robotic architecture and 3D sizing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                className="h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs px-6"
              >
                <Link to="/book-consultation">
                  <Calendar size={14} className="mr-2" />
                  Book Consultation
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => openModal("quote")}
                className="h-11 rounded-lg border-slate-300 bg-white text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] font-bold uppercase text-xs px-6 cursor-pointer"
              >
                Request a Quote <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
