import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, AlertTriangle, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import { companyConfig } from "@/data/config";
import { RelatedContent } from "@/components/common/RelatedContent";

export const Route = createFileRoute(
  "/engineering-services/technical-specifications"
)({
  head: () =>
    buildSeoMeta({
      title: "Technical Specifications Reference | INDUS Industrial Robotics",
      description:
        "Technical specification reference for INDUS product families: torque, speed, payload, repeatability, gear ratio, backlash, feedback resolution, communication interfaces, and environmental limits.",
      path: "/engineering-services/technical-specifications",
    }),
  component: TechnicalSpecificationsPage,
});

// ─── Data ──────────────────────────────────────────────────────────────────

const REDUCER_ROWS = [
  {
    param: "Gear Ratio Range",
    harmonic: "30:1 – 160:1",
    cycloidal: "31:1 – 192:1",
    planetary: "3:1 – 100:1",
    notes: "Standard catalogue ratios",
  },
  {
    param: "Backlash (Lost Motion)",
    harmonic: "< 1 arcmin",
    cycloidal: "< 1 arcmin",
    planetary: "1–3 arcmin (std) / < 1 (precision)",
    notes: "At rated preload",
  },
  {
    param: "Torsional Rigidity",
    harmonic: "High (flexspline compliance)",
    cycloidal: "Very High",
    planetary: "Medium-High",
    notes: "Application-dependent",
  },
  {
    param: "Shock Load Capacity",
    harmonic: "3× rated torque (peak)",
    cycloidal: "5× rated torque (peak)",
    planetary: "2× rated torque",
    notes: "Momentary transient",
  },
  {
    param: "Lubrication",
    harmonic: "Grease (sealed)",
    cycloidal: "Oil bath or grease",
    planetary: "Grease (sealed)",
    notes: "Check OEM intervals",
  },
  {
    param: "Operating Temperature",
    harmonic: "-10°C to +40°C",
    cycloidal: "-10°C to +40°C",
    planetary: "-20°C to +60°C",
    notes: "Ambient, unventilated",
  },
  {
    param: "Feedback Mounting",
    harmonic: "Hollow bore (standard)",
    cycloidal: "Solid or hollow",
    planetary: "Solid or hollow",
    notes: "Per joint design",
  },
  {
    param: "Applicable Standard",
    harmonic: "ISO 9283",
    cycloidal: "ISO 9283",
    planetary: "ISO 9283",
    notes: "Kinematic accuracy",
  },
];

const DRIVE_ROWS = [
  {
    param: "Supply Voltage",
    compact: "24–48 VDC",
    multiAxis: "230/400 VAC (3-phase)",
    notes: "Nominal",
  },
  {
    param: "Continuous Current",
    compact: "5–30 A",
    multiAxis: "3–120 A per axis",
    notes: "RMS",
  },
  {
    param: "Peak Current",
    compact: "Up to 3× continuous",
    multiAxis: "Up to 3× continuous",
    notes: "Brief transient",
  },
  {
    param: "Communication",
    compact: "CANopen, EtherCAT",
    multiAxis: "EtherCAT, PROFINET",
    notes: "Check model",
  },
  {
    param: "Update Cycle",
    compact: "1–4 ms",
    multiAxis: "0.25–1 ms",
    notes: "With EtherCAT DC",
  },
  {
    param: "Safety Function",
    compact: "STO (SIL 2 / PLd)",
    multiAxis: "STO, SLS, SS1 (SIL 3 / PLe)",
    notes: "IEC 62061 / ISO 13849",
  },
  {
    param: "Feedback Supported",
    compact: "Sin/Cos, EnDat 2.2",
    multiAxis: "EnDat 2.2, HIPERFACE, Biss-C",
    notes: "Per axis",
  },
];

const LINEAR_ROWS = [
  {
    param: "Load Capacity",
    ballScrew: "1 kN – 40 kN (depends on diameter/lead)",
    guideway: "2 kN – 120 kN (depends on size)",
    notes: "Static rated load",
  },
  {
    param: "Accuracy Grade",
    ballScrew: "C3 / C5 ground",
    guideway: "Grade H/P",
    notes: "ISO 3408 / ISO 9285",
  },
  {
    param: "Lead Range",
    ballScrew: "5–50 mm/rev",
    guideway: "N/A",
    notes: "Standard catalogue",
  },
  {
    param: "Max Speed",
    ballScrew: "1 m/s (depends on lead and RPM)",
    guideway: "Up to 5 m/s (linear motor)",
    notes: "Application-dependent",
  },
  {
    param: "Backlash",
    ballScrew: "< 0.01 mm (preloaded)",
    guideway: "N/A",
    notes: "With preloaded nut",
  },
  {
    param: "Stroke Range",
    ballScrew: "Custom (up to ~4 m)",
    guideway: "Standard lengths",
    notes: "Project-specific",
  },
];

const ROBOT_ROWS = [
  {
    param: "Payload",
    cobot: "3–35 kg",
    industrial: "3–800 kg",
    scara: "1–20 kg",
    delta: "1–8 kg",
  },
  {
    param: "Reach",
    cobot: "500–1500 mm",
    industrial: "500–4000 mm",
    scara: "300–1200 mm",
    delta: "400–1500 mm",
  },
  {
    param: "Repeatability (ISO 9283)",
    cobot: "±0.03–0.1 mm",
    industrial: "±0.02–0.1 mm",
    scara: "±0.01–0.02 mm",
    delta: "±0.05–0.1 mm",
  },
  {
    param: "TCP Speed",
    cobot: "Up to 2.5 m/s",
    industrial: "Up to 3 m/s",
    scara: "Up to 10 m/s",
    delta: "Up to 10 m/s",
  },
  {
    param: "Degrees of Freedom",
    cobot: "6",
    industrial: "6",
    scara: "4",
    delta: "3–4",
  },
  {
    param: "Ingress Protection",
    cobot: "IP54 (std) / IP67 (wash)",
    industrial: "IP54 / IP67 / IP69K",
    scara: "IP54 / IP65",
    delta: "IP54",
  },
];

const ENV_SAFETY_ITEMS = [
  {
    param: "Ambient Temperature (operation)",
    value: "Typically -10°C to +45°C (product dependent)",
  },
  { param: "Humidity", value: "Typically 10–95% RH non-condensing" },
  {
    param: "IP Rating",
    value: "IP54 standard; IP65/67/69K on sealed variants — verify per product",
  },
  {
    param: "Vibration",
    value: "Per IEC 60068-2-6 (product-specific test levels)",
  },
  {
    param: "EMC",
    value: "CE marked products comply with IEC 61000-4 series (verify scope)",
  },
  {
    param: "Functional Safety",
    value:
      "ISO 13849-1, IEC 62061, IEC 61508 — applicable standard depends on product",
  },
  {
    param: "Collaborative Robot Safety",
    value: "ISO/TS 15066 (power & force limits for cobot applications)",
  },
  {
    param: "Industrial Robot Safety",
    value: "ISO 10218-1 (robot) and ISO 10218-2 (integration)",
  },
];

// ─── Table components ───────────────────────────────────────────────────────

function TableNote({ note }: { note: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
      <Info size={13} className="mt-0.5 shrink-0 text-signal" />
      <p>{note}</p>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
      {label}
    </p>
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────

function TechnicalSpecificationsPage() {
  const { openModal } = useModals();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* =========================================================
          HERO SECTION (Dark)
         ========================================================= */}
      <section className="technical-grid border-b border-border/50 bg-[#0B0F17] px-5 py-16 text-white sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400"
          >
            <Link to="/" className="hover:text-signal transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link
              to="/engineering-services"
              className="hover:text-signal transition-colors"
            >
              ENGINEERING SERVICES
            </Link>
            <span>/</span>
            <span className="text-signal font-semibold">TECHNICAL SPECIFICATIONS</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-signal">
            <FileText size={13} className="text-signal" />
            Engineering Reference
          </div>

          {/* H1 */}
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.96] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Technical Specifications
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg font-semibold text-signal sm:text-xl">
            Specification Reference by Product Family & Engineering Discipline
          </p>

          {/* Description */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            Technical specifications define the performance envelope within which a product or
            system operates. This reference page organises key parameters by product family.
            Published values reflect typical product specifications — project-specific
            configuration, mounting orientation, duty cycle, and ambient conditions affect actual
            performance. Consult our engineering team for application-specific sizing.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="h-12 rounded-none bg-signal px-7 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(180,245,20,0.25)] transition-all cursor-pointer"
              onClick={() =>
                openModal("engineer", {
                  categoryName: "Technical Specifications",
                  initialMessage:
                    "I would like to request a sizing review for my application.",
                })
              }
            >
              Request Sizing Review <ArrowRight size={15} className="ml-2" />
            </Button>

            <Link
              to="/resources"
              className="inline-flex h-12 items-center gap-2 border border-slate-700 bg-slate-900/60 px-6 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-xs transition-colors hover:border-signal hover:text-signal"
            >
              Download Datasheets <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Global Disclaimer ─── */}
      <div className="px-5 lg:px-10 bg-white">
        <div className="mx-auto max-w-[1440px] pt-10">
          <div className="flex items-start gap-3 border border-amber-400/40 bg-amber-50 p-5">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Important: </span>
              Specifications published here are representative of typical product performance.
              Actual performance depends on mounting configuration, duty cycle, load spectrum,
              ambient temperature, and system integration. All values must be verified against
              manufacturer datasheets for the specific model. INDUS engineers provide
              application-specific sizing calculations on request.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 1 — PRECISION REDUCERS (White)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel label="Precision Reducers" />
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-foreground">
            Precision Reducer Specifications
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Harmonic (Strain-Wave)
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Cycloidal (RV)
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Planetary
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {REDUCER_ROWS.map((row, idx) => (
                  <tr
                    key={row.param}
                    className={`border-b border-border ${idx % 2 === 1 ? "bg-muted/20" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                      {row.param}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.harmonic}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.cycloidal}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.planetary}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TableNote note="Exact values vary by model and ratio. Request the relevant manufacturer datasheet for your specific model number." />
        </div>
      </section>

      {/* =========================================================
          SECTION 2 — SERVO DRIVES & CONTROLLERS (Light Gray)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-[#F7F8F6]">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel label="Servo Drives & Controllers" />
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-foreground">
            Servo Drive & Controller Specifications
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Compact Joint Drives
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Multi-Axis EtherCAT Drives
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {DRIVE_ROWS.map((row, idx) => (
                  <tr
                    key={row.param}
                    className={`border-b border-border ${idx % 2 === 1 ? "bg-muted/20" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                      {row.param}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.compact}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.multiAxis}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TableNote note="Verify compatibility with your specific motor, encoder, and safety controller before ordering." />
        </div>
      </section>

      {/* =========================================================
          SECTION 3 — LINEAR MOTION (White)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel label="Linear Motion" />
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-foreground">
            Linear Guidance & Actuator Specifications
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Ball Screw Actuators
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Linear Guideways
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {LINEAR_ROWS.map((row, idx) => (
                  <tr
                    key={row.param}
                    className={`border-b border-border ${idx % 2 === 1 ? "bg-muted/20" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                      {row.param}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.ballScrew}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.guideway}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground/70">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TableNote note="Operating speeds, load ratings, and stroke lengths depend on mounting configuration, preload class, and lubrication schedule." />
        </div>
      </section>

      {/* =========================================================
          SECTION 4 — ROBOTIC SYSTEMS (Light Gray)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-[#F7F8F6]">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel label="Robotic Systems" />
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-foreground">
            Robotic System Performance Parameters
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border border-border text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Collaborative Arms (Cobots)
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    Industrial 6-Axis Articulated
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground border-r border-border">
                    SCARA
                  </th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-foreground">
                    Delta
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROBOT_ROWS.map((row, idx) => (
                  <tr
                    key={row.param}
                    className={`border-b border-border ${idx % 2 === 1 ? "bg-muted/20" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                      {row.param}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.cobot}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.industrial}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground border-r border-border">
                      {row.scara}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TableNote note="Exact specifications depend on manufacturer, model, and configuration. INDUS supplies application-specific system configurations." />
        </div>
      </section>

      {/* =========================================================
          SECTION 5 — ENVIRONMENTAL & SAFETY (White)
         ========================================================= */}
      <section className="px-5 py-16 lg:px-10 lg:py-24 bg-white">
        <div className="mx-auto max-w-[1440px]">
          <SectionLabel label="Environmental & Safety" />
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl text-foreground">
            Environmental Limits & Safety Standards
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {ENV_SAFETY_ITEMS.map((item) => (
              <div key={item.param} className="border border-border bg-card p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-signal font-mono">
                  {item.param}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Safety important note */}
          <div className="mt-8 flex items-start gap-3 border border-amber-400/40 bg-amber-50 p-5">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-bold">Important: </span>
              Safety standard compliance must be verified for the complete system, not individual
              components. INDUS engineering performs SISTEMA calculations and hazard assessments as
              part of engineering service engagements.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 — CTA (Dark)
         ========================================================= */}
      <section className="technical-grid border-t border-border/50 bg-[#0B0F17] px-5 py-16 text-white lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal font-mono">
                Application-Specific Engineering
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need Application-Specific Specifications?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Specifications on this page are representative reference values. For sizing
                calculations, motor selection, and validated performance analysis for your specific
                application, our engineering team provides traceable, calculation-backed
                recommendations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Button
                className="h-12 rounded-none bg-signal px-8 text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 shadow-[0_4px_20px_rgba(180,245,20,0.25)] cursor-pointer"
                onClick={() =>
                  openModal("engineer", {
                    categoryName: "Technical Specifications",
                    initialMessage:
                      "I would like to request a sizing review and application-specific specification analysis.",
                  })
                }
              >
                Request Sizing Review <ArrowRight size={15} className="ml-2" />
              </Button>

              <Link
                to="/resources"
                className="inline-flex h-12 items-center justify-center gap-2 border border-slate-700 bg-slate-900/70 px-7 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-signal hover:text-signal transition-colors text-center"
              >
                Browse Technical Documentation
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RELATED CONTENT
         ========================================================= */}
      <RelatedContent
        eyebrow="Connected Ecosystem"
        title="Related Engineering Content"
        items={[
          {
            sectionTitle: "Engineering Services",
            links: [
              {
                title: "Engineering Capabilities",
                href: "/engineering-services",
                category: "Engineering Services",
                description:
                  "Overview of INDUS engineering disciplines: application feasibility, mechatronics, workcells, motion control, safety, and lifecycle optimization.",
              },
              {
                title: "CAD & Downloads",
                href: "/engineering-services/cad-downloads",
                category: "Engineering Reference",
                description:
                  "CAD models, technical drawings, and downloadable documentation for INDUS product families.",
              },
              {
                title: "Kinematic Sizing Calculators",
                href: "/technology/calculators",
                category: "Technology",
                description:
                  "Interactive tools for sizing joints, drives, and reducers based on your application torque, speed, and inertia targets.",
              },
            ],
          },
        ]}
      />
    </main>
  );
}
