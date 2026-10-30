import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  ClipboardCheck,
  Wrench,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute("/engineering-services/quality-standards")({
  head: () =>
    buildSeoMeta({
      title: "Quality, Standards & Engineering References | INDUS Industrial Robotics",
      description:
        "Engineering standards, design references, testing procedures, and certification scope for INDUS industrial robotics and motion systems.",
      path: "/engineering-services/quality-standards",
    }),
  component: QualityStandardsPage,
});

const DESIGN_STANDARDS = [
  { standard: "ISO 9283:1998", scope: "Manipulating industrial robots — performance criteria and testing", usage: "Kinematic accuracy, repeatability, and path accuracy specification methodology", status: "Design reference" },
  { standard: "ISO 13849-1:2023", scope: "Safety of machinery — safety-related parts of control systems", usage: "SISTEMA calculations for safety function PLd/PLe determination", status: "Engineering calculation" },
  { standard: "IEC 62061:2021", scope: "Functional safety of safety-related control systems", usage: "SILCL determination for safety-integrated drive functions", status: "Engineering reference" },
  { standard: "ISO 10218-1:2011", scope: "Robots for industrial environments — safety requirements for robots", usage: "Robot system design requirements", status: "Design reference" },
  { standard: "ISO 10218-2:2011", scope: "Robots for industrial environments — safety for integration", usage: "Robot cell integration safety requirements", status: "Applied during integration projects" },
  { standard: "ISO 12100:2010", scope: "Safety of machinery — risk assessment", usage: "Hazard identification and risk reduction methodology", status: "Applied during engineering assessment" },
  { standard: "ISO/TS 15066:2016", scope: "Collaborative robots — safety requirements", usage: "Power and force limiting operation parameters", status: "Applied to cobot application design" },
  { standard: "DIN 3990", scope: "Calculation of load capacity of cylindrical gears", usage: "Gear tooth strength and safety factor calculations", status: "Calculation reference" },
  { standard: "IEC 61000-4 series", scope: "Electromagnetic compatibility — immunity", usage: "EMC immunity requirements for electrical products", status: "Procurement specification reference" },
  { standard: "ISO 3408", scope: "Ball screws — acceptance conditions and tests", usage: "Ball screw accuracy grade specification", status: "Design and procurement reference" },
];

const CERTIFICATION_CARDS = [
  {
    title: "CE Marking",
    description:
      "Products supplied by INDUS for the European market carry CE marking where applicable. CE marking is based on the manufacturer's Declaration of Conformity. Scope and applicable directives (Machinery Directive, Low Voltage Directive, EMC Directive) vary per product. Customers should request the Declaration of Conformity for the specific product.",
  },
  {
    title: "Safety Integrity Level (SIL)",
    description:
      "Functional safety components (servo drives with STO, safety PLCs, light curtains, scanners) may carry SIL ratings from IEC 61508 or IEC 62061. SIL ratings apply to the component in isolation. System-level SIL determination requires a full safety function analysis across all components in the safety chain.",
  },
  {
    title: "UL / CSA Listing",
    description:
      "Selected products may carry UL or CSA listings for North American markets. Availability depends on the product family and model. Specify the required standard when placing an enquiry.",
  },
];

const TESTING_CARDS = [
  {
    title: "Factory Acceptance Test (FAT)",
    description:
      "Individual subsystem verification before delivery. Covers axis homing, communication continuity, safety function activation, and motion profile validation. FAT protocol is agreed during project scoping.",
  },
  {
    title: "Site Acceptance Test (SAT)",
    description:
      "Full system verification at the customer site after installation. Covers coordinated motion, I/O integration, production cycle execution, and alarm handling. SAT sign-off is required before handover.",
  },
  {
    title: "Safety Verification",
    description:
      "SISTEMA calculations for safety function Performance Level. Safety circuit continuity testing per ISO 13849. Documented for each safety function in the system.",
  },
  {
    title: "Servo Loop Tuning & Validation",
    description:
      "Frequency response measurement, following error verification, and cycle time confirmation. Results documented in commissioning report.",
  },
];

const PROJECT_ASSESSMENT_ITEMS = [
  "System-level Performance Level (PL) for functional safety — requires full safety function analysis including all components",
  "ATEX / IECEx zone classification compliance — requires hazardous area classification data",
  "Food-contact and hygienic design compliance — requires material and surface finish confirmation for the specific product",
  "Cleanroom classification (ISO 14644) — requires contamination testing of the specific configuration",
  "Pressure vessel, pressure equipment, or PSSR compliance — not applicable to standard motion systems",
  "Medical device regulatory requirements (MDR, FDA) — out of scope for standard robotics components",
  "EMC system-level compliance — requires testing of the complete installed system",
];

function QualityStandardsPage() {
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
            <span className="text-signal font-semibold">QUALITY &amp; STANDARDS</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-signal">
            <ShieldCheck size={13} />
            Standards &amp; Quality
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl text-white">
            Quality, Standards &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-signal">
              Engineering References
            </span>
          </h1>

          <p className="mt-3 font-display text-lg uppercase tracking-wide text-signal sm:text-xl font-bold">
            What Standards Mean for Your Application — and What They Do Not
          </p>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Standards and certifications are specific in scope. A product may reference a standard
            during design without being independently certified to it. A company certification
            covers defined processes, not the entire product catalogue. This page clearly separates
            confirmed certifications, design references, applicable standards, and testing procedures.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="h-12 rounded-none bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(21,94,239,0.35)] transition-all cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Standards & Compliance",
                  initialMessage: "I would like to discuss standards and compliance requirements for our project.",
                })
              }
            >
              Discuss Standards Requirements <ArrowRight size={15} className="ml-2" />
            </Button>
            <Link
              to="/contact/engineering-enquiry"
              className="inline-flex h-12 items-center gap-2 border border-slate-700 bg-slate-900/60 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-xs transition-colors hover:border-signal hover:text-signal"
            >
              <FileCheck2 size={14} className="text-signal" />
              Engineering Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* IMPORTANT FRAMING CALLOUT */}
      <section className="border-b border-amber-200 bg-amber-50 px-5 py-5 lg:px-10">
        <div className="mx-auto max-w-[1440px] flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 text-amber-600 shrink-0" />
          <div className="text-xs leading-relaxed text-amber-900">
            <strong>Important:</strong> Standards compliance, certification, calibration, verification,
            and testing are distinct concepts. INDUS publishes this page to help customers understand
            which standards are relevant to their application. Claims on this page are scoped to the
            referenced standard and product. Do not infer that the entire catalogue is certified
            because one product references a standard.
          </div>
        </div>
      </section>

      {/* SECTION 1: ENGINEERING DESIGN STANDARDS */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Design References
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Engineering Design Standards &amp; References
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            INDUS engineering work uses the following international standards as design references
            and calculation bases. <strong>"Referenced"</strong> means the standard is used as an
            engineering methodology. <strong>"Independently certified"</strong> means an external
            certification body has issued a certificate.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-muted/30">
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-foreground min-w-[140px]">Standard</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-foreground">Scope</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-foreground">How INDUS Uses It</th>
                  <th className="text-left p-3 font-bold uppercase tracking-wider text-foreground min-w-[160px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {DESIGN_STANDARDS.map((row, idx) => (
                  <tr
                    key={row.standard}
                    className={`border-b border-border/60 ${idx % 2 === 0 ? "bg-card" : "bg-muted/10"}`}
                  >
                    <td className="p-3 font-mono font-semibold text-foreground">{row.standard}</td>
                    <td className="p-3 text-muted-foreground">{row.scope}</td>
                    <td className="p-3 text-foreground/90">{row.usage}</td>
                    <td className="p-3">
                      <span className="rounded bg-signal/10 border border-signal/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-signal whitespace-nowrap">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRODUCT CERTIFICATION SCOPE */}
      <section className="border-y border-border/60 bg-muted/20 px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Certification Scope
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Product Certification Scope
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Selected products in the INDUS catalogue carry certifications from their manufacturers.
            Certification scope is specific to the product model and configuration tested. INDUS
            re-sells and integrates these products — the manufacturer's certificate applies to the
            product as manufactured, not to the complete system as integrated.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {CERTIFICATION_CARDS.map((card) => (
              <div
                key={card.title}
                className="border border-border bg-card p-6 transition-all hover:border-signal"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-signal" />
                  <h3 className="font-display text-base font-bold uppercase tracking-tight">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Company certification notice */}
          <div className="mt-8 rounded border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
            <Info size={18} className="mt-0.5 text-amber-600 shrink-0" />
            <p className="text-xs leading-relaxed text-amber-900">
              <strong>Company Certification:</strong> INDUS is an engineering and distribution company.
              Quality commitments are project-specific and defined in project documentation. If your
              procurement requires a specific company certification, raise this during the enquiry stage.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: TESTING & ACCEPTANCE */}
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Verification &amp; Acceptance
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Engineering Testing &amp; Project Acceptance
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            For engineering service engagements, INDUS defines and executes acceptance testing as
            part of the project scope. Testing is evidence-based and documented.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTING_CARDS.map((card) => (
              <div
                key={card.title}
                className="border border-border bg-card p-6 transition-all hover:border-signal"
              >
                <ClipboardCheck size={20} className="text-signal" />
                <h3 className="mt-3 font-display text-base font-bold uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PROJECT ASSESSMENT REQUIRED */}
      <section className="technical-grid border-t border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
            Application-Specific Requirements
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-white">
            What Requires Application-Specific Assessment
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
            Not all standards apply to every application. The following items require project-specific
            determination — they cannot be confirmed without knowing the exact hardware, application,
            and operating environment.
          </p>

          <div className="mt-8 space-y-3">
            {PROJECT_ASSESSMENT_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 border border-slate-700 bg-slate-900/70 p-4"
              >
                <AlertTriangle size={15} className="mt-0.5 text-amber-400 shrink-0" />
                <p className="text-sm text-slate-200 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button
              className="h-12 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Standards & Compliance",
                  initialMessage: "I would like to discuss specific standards and compliance requirements for our application.",
                })
              }
            >
              Discuss Standards Requirements <ArrowRight size={15} className="ml-2" />
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
              { title: "System Integration", description: "Fieldbus architecture and cell commissioning.", href: "/engineering-services/system-integration" },
              { title: "Technical Specifications", description: "Specification reference by product family.", href: "/engineering-services/technical-specifications" },
            ],
          },
        ]}
      />
    </main>
  );
}

