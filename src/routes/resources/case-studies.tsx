import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  FolderKanban,
  AlertTriangle,
  CheckCircle2,
  Factory,
  Cpu,
  Warehouse,
  UtensilsCrossed,
  Wrench,
  Send,
  BookOpen,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute("/resources/case-studies")({
  head: () =>
    buildSeoMeta({
      title: "Application Engineering Case Studies | INDUS Industrial Robotics",
      description:
        "INDUS application engineering experience across automotive, electronics, packaging, food, pharmaceutical, and aerospace sectors. Submit a project for documented case study inclusion.",
      path: "/resources/case-studies",
    }),
  component: CaseStudiesPage,
});

const EXPERIENCE_SECTORS = [
  {
    icon: Factory,
    title: "Automotive Assembly",
    description:
      "Actuator and reducer supply for welding, press loading, and EV battery handling applications. Integration support for servo drive commissioning in multi-axis robotic cells.",
  },
  {
    icon: Cpu,
    title: "Electronics & Semiconductor",
    description:
      "Precision reducer and linear motion components for wafer handling, pick-and-place, and optical inspection stages. Engineering review of cleanroom-compliant motion system specifications.",
  },
  {
    icon: Warehouse,
    title: "Packaging & Material Handling",
    description:
      "Drive wheel and mobile platform components for AMR and AGV applications. Palletizer and case packing cell kinematic sizing consultations.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & Pharmaceutical",
    description:
      "Hygienic-design actuator selection guidance for washdown environments. Servo drive and safety PLC integration support for packaging line automation.",
  },
  {
    icon: Wrench,
    title: "Machine Building & OEM",
    description:
      "Component supply and engineering consultation for machine builders integrating INDUS motion systems into custom equipment designs.",
  },
  {
    icon: CheckCircle2,
    title: "Aerospace & Precision Engineering",
    description:
      "Precision reducer and linear motion supply for metrology, positioning, and composite machining support equipment.",
  },
];

function CaseStudiesPage() {
  const { openModal } = useModals();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-20 text-surface-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-foreground/60"
          >
            <Link to="/" className="hover:text-signal transition-colors">Home</Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <Link to="/resources" className="hover:text-signal transition-colors">Resources</Link>
            <ChevronRight size={13} className="text-surface-foreground/30" />
            <span className="text-signal">Case Studies</span>
          </nav>

          <div className="mt-6 inline-flex items-center gap-2 border border-signal/30 bg-surface-elevated/70 px-3 py-1 rounded-xs">
            <span className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(180,245,20,0.9)] animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-signal">
              Application Engineering
            </p>
          </div>

          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] sm:text-6xl lg:text-7xl">
            Application Engineering Case Studies
          </h1>

          <p className="mt-4 font-display text-xl uppercase tracking-wide text-signal sm:text-2xl">
            Documented Integration Projects &amp; Application Experience
          </p>

          <p className="mt-6 max-w-3xl text-base leading-8 text-surface-foreground/75 sm:text-lg">
            Case studies document real engineering projects: the operating problem, the requirements,
            the integration approach, the products used, and — where measured — the outcomes. INDUS
            publishes case studies from documented projects where customer permission has been confirmed.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="h-12 rounded bg-signal px-7 font-bold uppercase text-signal-foreground hover:bg-[#86b800] transition-colors"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Application Case Study",
                  initialMessage: "I would like to discuss an application for potential case study documentation.",
                })
              }
            >
              <Wrench size={15} className="mr-2" />
              Discuss Your Application
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded border-surface-foreground/30 bg-transparent px-6 font-bold uppercase text-surface-foreground hover:bg-surface-elevated hover:text-signal"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Case Study Submission",
                  initialMessage: "I would like to submit a completed project for case study documentation.",
                })
              }
            >
              <Send size={14} className="mr-2" />
              Submit a Project
            </Button>
          </div>
        </div>
      </section>

      {/* HONEST STATUS SECTION */}
      <section className="border-b border-amber-200 bg-[#FFFDF5] px-5 py-10 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 sm:p-8 flex items-start gap-4">
            <Info size={24} className="mt-0.5 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-amber-900">
                Current Publication Status
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-800">
                INDUS is in active project collection for this section. Documented case studies with
                customer approval are published here as they become available. The absence of a
                published case study does not indicate limited project experience — it reflects our
                commitment to publishing only confirmed, approved documentation rather than
                illustrative or composite examples.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-amber-800">
                If you have worked with INDUS on a project and would like to share the experience,
                we welcome your contact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: APPLICATION ENGINEERING EXPERIENCE */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary font-mono">
            Engineering Experience
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Application Engineering Scope
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            While individual case studies are being compiled, the following sectors represent areas
            where INDUS has engineering application experience through product supply, integration
            support, and technical consultation. This is not a claim of certified deployments or
            guaranteed performance outcomes.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCE_SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.title}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-blue-50/80 border border-blue-100 text-primary grid place-items-center">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                      {sector.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {sector.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: SUBMIT A PROJECT */}
      <section className="border-y border-slate-200 bg-[#F7F8F6] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary font-mono">
                Contribute
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                Have a Project to Share?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                If you have worked with INDUS hardware or engineering services and would like to
                document the application, we would like to hear from you. Documented case studies
                benefit both your engineering team (as a reference record) and other engineers
                evaluating similar applications.
              </p>

              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono mb-3">
                  What We Need:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "A brief description of the application and the problem solved",
                    "The products or engineering services involved",
                    "Any measurable outcomes you are willing to share",
                    "Confirmation of permission to publish (anonymized or attributed)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  className="h-11 rounded bg-[#155EEF] hover:bg-[#1047BF] text-white px-6 font-bold uppercase text-xs tracking-wider cursor-pointer"
                  onClick={() =>
                    openModal("engineer", {
                      categoryName: "Case Study Submission",
                      initialMessage: "I would like to discuss documenting a project as an INDUS case study.",
                    })
                  }
                >
                  <Send size={14} className="mr-2" />
                  Submit Your Project
                </Button>
              </div>
            </div>

            {/* Side panel: What a case study looks like */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h4 className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                Case Study Structure
              </h4>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Published case studies follow this evidence-based format:
              </p>
              <ol className="mt-4 space-y-2.5">
                {[
                  "Customer or project context (with permission)",
                  "Initial operating problem",
                  "Requirements and constraints",
                  "Engineering approach",
                  "Products and subsystems used",
                  "Integration method",
                  "Validation approach",
                  "Measured outcomes (where documented)",
                  "Lessons and limitations",
                  "Related solutions, industries, and products",
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <span className="font-mono font-bold text-primary text-[10px] mt-0.5 min-w-[1.25rem]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: RELATED RESOURCES */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary font-mono">
            Related Resources
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Related Engineering Resources
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FolderKanban,
                title: "Application Problem Library",
                description: "18 industry sectors with detailed use cases and engineering constraints.",
                href: "/engineering-intelligence?section=applications",
              },
              {
                icon: BookOpen,
                title: "Insights & Articles",
                description: "Technical engineering articles on motion control, reducers, fieldbuses, and integration.",
                href: "/engineering-intelligence",
              },
              {
                icon: FileText,
                title: "Technical Documentation",
                description: "Request datasheets, drawings, and technical references for INDUS products.",
                href: "/resources",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.href as never}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-blue-50/80 border border-blue-100 text-primary grid place-items-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                    Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED CONTENT */}
      <RelatedContent
        title="More Resources"
        items={[
          {
            sectionTitle: "Resources & Support",
            links: [
              { title: "Technical Documentation", description: "Datasheets, catalogues, and application notes.", href: "/resources" },
              { title: "FAQs & Support", description: "Engineering answers to common technical questions.", href: "/resources/faqs" },
              { title: "Engineering Capabilities", description: "7 engineering disciplines and project workflow.", href: "/engineering-services" },
            ],
          },
        ]}
      />
    </main>
  );
}

