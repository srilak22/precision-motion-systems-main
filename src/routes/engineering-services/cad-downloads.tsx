import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Download,
  FileText,
  FileCode2,
  Ruler,
  BookOpen,
  Shield,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute("/engineering-services/cad-downloads")({
  head: () =>
    buildSeoMeta({
      title: "CAD Files & Engineering Downloads | INDUS Industrial Robotics",
      description:
        "Request STEP CAD models, dimensional drawings, datasheets, wiring diagrams, and technical manuals for INDUS robotic components and motion systems.",
      path: "/engineering-services/cad-downloads",
    }),
  component: CadDownloadsPage,
});

const DOCUMENT_TYPES = [
  {
    icon: FileCode2,
    title: "STEP / 3D CAD Files",
    description:
      "ISO 10303-21 STEP format 3D models for mechanical layout and collision checking. Available for selected product families. Specify model number when requesting.",
  },
  {
    icon: Ruler,
    title: "Dimensional Drawings",
    description:
      "2D engineering drawings (PDF/DXF) with principal dimensions, mounting interfaces, connector positions, and weight. GD&T tolerances where applicable.",
  },
  {
    icon: FileText,
    title: "Technical Datasheets",
    description:
      "Rated performance specifications, electrical characteristics, mechanical ratings, and environmental limits. Issued per model and revision.",
  },
  {
    icon: Download,
    title: "Wiring Diagrams",
    description:
      "Control cabinet layouts, fieldbus wiring topologies, safety circuit architecture, and connector pinout references.",
  },
  {
    icon: BookOpen,
    title: "Installation & Operation Manuals",
    description:
      "Mechanical installation, initial commissioning, parameter configuration, and maintenance intervals. Issued per product and firmware version.",
  },
  {
    icon: Shield,
    title: "Declarations of Conformity",
    description:
      "CE Declaration of Conformity and relevant certification scope. Issued per product line. Scope is limited to the product as supplied.",
  },
];

const REQUEST_STEPS = [
  {
    step: "01",
    name: "Identify",
    description:
      "Specify the product family (e.g., Strain-Wave Reducers, EtherCAT Servo Drives), model number or series, and document type required.",
  },
  {
    step: "02",
    name: "Submit",
    description:
      "Contact our engineering team via the document request form, email, or engineering enquiry. Include the intended application context so we can confirm the correct revision.",
  },
  {
    step: "03",
    name: "Receive",
    description:
      "Our team reviews the request, issues the correct document revision, and provides application guidance where needed.",
  },
];

const PRODUCT_FAMILIES = [
  "Strain-Wave Harmonic Reducers",
  "Cycloidal (RV) Reducers",
  "Precision Planetary Gearboxes",
  "Servo Joint Actuators",
  "Linear Guideways & Actuators",
  "End Effectors & Grippers",
  "EtherCAT Servo Drives",
  "Robot Motion Controllers",
  "Safety Laser Scanners",
];

function CadDownloadsPage() {
  const { openModal } = useModals();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="technical-grid border-b border-border/50 bg-[#0B0F17] px-5 py-16 text-white sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400"
          >
            <Link to="/" className="hover:text-signal transition-colors">HOME</Link>
            <span>/</span>
            <Link to="/engineering-services" className="hover:text-signal transition-colors">
              ENGINEERING SERVICES
            </Link>
            <span>/</span>
            <span className="text-signal font-semibold">CAD &amp; DOWNLOADS</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-signal">
            <Download size={13} />
            Engineering Documentation
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl text-white">
            CAD Files &amp; Engineering Downloads
          </h1>

          <p className="mt-3 font-display text-lg uppercase tracking-wide text-signal sm:text-xl font-bold">
            Technical Documentation for System Design &amp; Integration
          </p>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Engineering documentation supports mechanical layout, electrical design, and software
            configuration. INDUS provides technical documents on request through our engineering
            team. Documents are issued in project context to ensure the correct revision is matched
            to your hardware configuration.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="h-12 rounded-none bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(21,94,239,0.35)] transition-all cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Document Request",
                  initialMessage: "I would like to request CAD files and technical documents for a specific product.",
                })
              }
            >
              Request Documents <ArrowRight size={15} className="ml-2" />
            </Button>
            <Link
              to="/resources"
              className="inline-flex h-12 items-center gap-2 border border-slate-700 bg-slate-900/60 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-xs transition-colors hover:border-signal hover:text-signal"
            >
              Browse Resource Library
            </Link>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE */}
      <section className="border-b border-amber-200 bg-amber-50 px-5 py-5 lg:px-10">
        <div className="mx-auto max-w-[1440px] flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 text-amber-600 shrink-0" />
          <div className="text-xs leading-relaxed text-amber-900">
            <strong>Document Availability Notice:</strong> INDUS does not publish uncontrolled document
            downloads. All documents are issued by our engineering team to ensure revision control
            and correct application matching. Submit a request specifying your product family, model
            number, and document type.
          </div>
        </div>
      </section>

      {/* SECTION 1: DOCUMENT TYPES */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Documentation Categories
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Available Document Types
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_TYPES.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.title}
                  className="border border-border bg-card p-6 transition-all hover:border-signal"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded border border-border bg-muted/30 grid place-items-center text-signal">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase tracking-tight">
                      {doc.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {doc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW TO REQUEST */}
      <section className="border-y border-border/60 bg-muted/20 px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Request Process
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Document Request Process
          </h2>

          <div className="mt-10 grid gap-0 border border-border bg-card sm:grid-cols-3">
            {REQUEST_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className={`flex flex-col justify-between p-6 sm:p-7 ${
                  idx > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-signal">{step.step}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-tight">
                    {step.name}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              className="h-12 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Document Request",
                  initialMessage: "I would like to request specific technical documents.",
                })
              }
            >
              <Send size={14} className="mr-2" />
              Submit Document Request
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT FAMILIES TABLE */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Product Coverage
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Product Families &amp; Typical Documents
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-muted/30">
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-foreground">Product Family</th>
                  <th className="text-center p-3 font-bold uppercase tracking-wider text-foreground">CAD (STEP)</th>
                  <th className="text-center p-3 font-bold uppercase tracking-wider text-foreground">Drawing</th>
                  <th className="text-center p-3 font-bold uppercase tracking-wider text-foreground">Datasheet</th>
                  <th className="text-center p-3 font-bold uppercase tracking-wider text-foreground">Manual</th>
                  <th className="text-center p-3 font-bold uppercase tracking-wider text-foreground">DoC</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT_FAMILIES.map((family, idx) => (
                  <tr
                    key={family}
                    className={`border-b border-border/60 ${idx % 2 === 0 ? "bg-card" : "bg-muted/10"}`}
                  >
                    <td className="p-3 font-medium text-foreground">{family}</td>
                    {Array.from({ length: 5 }).map((_, col) => (
                      <td key={col} className="p-3 text-center text-muted-foreground font-mono">
                        On Request
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
            All documents are available via engineering request. Specify model number and revision
            where known. INDUS does not guarantee availability of third-party manufacturer
            documentation.
          </p>
        </div>
      </section>

      {/* SECTION 4: WHAT TO INCLUDE */}
      <section className="technical-grid border-y border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Request Checklist
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-white">
            Information to Include When Requesting Documents
          </h2>

          <div className="mt-8 space-y-3">
            {[
              "Product family and model number (or series range if unknown)",
              "Required document type (STEP, drawing, datasheet, manual, etc.)",
              "Intended application (robot joint, linear axis, mobile platform, etc.)",
              "Project stage (early layout, detailed design, commissioning, service)",
              "Preferred format (PDF, DXF, STEP, IGS)",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 border border-slate-700 bg-slate-900/70 p-4"
              >
                <CheckCircle2 size={16} className="mt-0.5 text-signal shrink-0" />
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              className="h-12 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Document Request",
                  initialMessage: "I would like to request technical documentation.",
                })
              }
            >
              Submit Request Now <ArrowRight size={15} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 5: BROWSE RESOURCES */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Resource Library
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Searchable Resource Library
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The INDUS Resource Library contains verified datasheets, application notes, case study
            references, and technical articles. Use filters by document type, product family, and
            keyword to find relevant documentation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-none bg-signal px-6 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90">
              <Link to="/resources">Open Resource Library</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-none border-border px-6 text-xs font-bold uppercase tracking-wider hover:border-signal hover:text-signal">
              <Link to="/resources/faqs">Engineering FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* RELATED CONTENT */}
      <RelatedContent
        title="Related Engineering Resources"
        items={[
          {
            sectionTitle: "Engineering Services",
            links: [
              { title: "Engineering Capabilities", description: "7 engineering disciplines and project workflow.", href: "/engineering-services" },
              { title: "Technical Specifications", description: "Specification reference by product family.", href: "/engineering-services/technical-specifications" },
              { title: "System Integration", description: "Fieldbus architecture and cell commissioning.", href: "/engineering-services/system-integration" },
            ],
          },
        ]}
      />
    </main>
  );
}

