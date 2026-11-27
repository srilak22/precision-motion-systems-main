import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Cpu,
  Factory,
  Gauge,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { FloatingEngineerCta } from "@/components/solutions/FloatingEngineerCta";

import heroWeldingImg from "@/assets/solution-manufacturing-auto.jpg";
import weldingRobotImg from "@/assets/products/welding-robot.jpg";
import cobotRobotImg from "@/assets/products/cobot-robot.jpg";
import scaraRobotImg from "@/assets/products/scara-robot.jpg";

export const Route = createFileRoute("/solutions/manufacturing-automotive")({
  head: () =>
    buildSeoMeta({
      title: "Precision Robotics for Manufacturing & Automotive | INDUS Robotics",
      description:
        "Eliminate production bottlenecks, improve workplace safety, and achieve 24/7 millimeter-accurate throughput with industrial and collaborative robotics.",
      path: "/solutions/manufacturing-automotive",
    }),
  component: ManufacturingAutomotivePage,
});

interface CoreRobotBlock {
  id: string;
  name: string;
  tagline: string;
  description: string;
  applications: string[];
  image: string;
  imageAlt: string;
  toolingBadge: string;
  specs: { label: string; value: string }[];
  compliance: string;
}

const TRUST_METRICS = [
  {
    value: "99.9%",
    label: "Repeatability & Precision",
    icon: Gauge,
  },
  {
    value: "Up to 4x",
    label: "Faster Cycle Times",
    icon: Zap,
  },
  {
    value: "24/7",
    label: "Continuous Production",
    icon: Clock,
  },
  {
    value: "< 18 Months",
    label: "Typical ROI",
    icon: TrendingUp,
  },
];

const CORE_ROBOT_BLOCKS: CoreRobotBlock[] = [
  {
    id: "6-axis-articulated-robots",
    name: "6-Axis Articulated Robots",
    tagline: "Heavy-Duty Power & Precision",
    description:
      "Engineered for demanding factory environments, our 6-axis industrial arms deliver unmatched reach, high payload capacity, and consistent performance in harsh conditions.",
    applications: [
      "Spot & Arc Welding",
      "Automotive Spray Painting & Coating",
      "Heavy Material Handling & Press Tending",
    ],
    image: weldingRobotImg,
    imageAlt:
      "6-axis articulated industrial robot arm with MIG/spot welding torch in action",
    toolingBadge: "Servo Spot-Weld & MIG Torch EOAT",
    specs: [
      { label: "Payload Capacity", value: "20 kg – 500 kg" },
      { label: "Max Reach", value: "1,650 – 3,200 mm" },
      { label: "Repeatability", value: "±0.03 – ±0.08 mm" },
      { label: "Protection Rating", value: "IP67 Wrist / IP65 Body" },
      { label: "Fieldbus Support", value: "EtherCAT / PROFINET / EtherNet/IP" },
      { label: "Mounting Options", value: "Floor, Inverted, Wall / Shelf" },
    ],
    compliance: "ISO 10218-1 • CE • UL 1740",
  },
  {
    id: "collaborative-robots",
    name: "Collaborative Robots (Cobots)",
    tagline: "Safe, Flexible Human-Robot Teamwork",
    description:
      "Designed with built-in force sensors, cobots work safely alongside your operators without bulky safety cages—making them ideal for SMEs and high-mix, low-volume production lines.",
    applications: [
      "CNC Machine Tending",
      "Automated Screwdriving & Fastening",
      "Gluing, Dispensing & Quality Inspection",
    ],
    image: cobotRobotImg,
    imageAlt:
      "Collaborative robot arm with dual precision gripper tending a CNC machining center",
    toolingBadge: "Dual-Jaw CNC & Torque Driver EOAT",
    specs: [
      { label: "Payload Capacity", value: "5 kg – 25 kg" },
      { label: "Max Reach", value: "850 – 1,750 mm" },
      { label: "Repeatability", value: "±0.02 – ±0.03 mm" },
      { label: "Safety Sensing", value: "6-Axis Joint Torque + Wrist F/T" },
      { label: "Power Input", value: "110–240 VAC Single Phase" },
      { label: "Protection Rating", value: "IP65 / Cleanroom ISO Class 5" },
    ],
    compliance: "ISO/TS 15066 • ISO 13849-1 PLd Cat 3",
  },
  {
    id: "scara-delta-robots",
    name: "SCARA & Delta Robots",
    tagline: "Ultra-High-Speed Pick & Place",
    description:
      "Built for speed and accuracy, SCARA and overhead Delta robots execute up to 150+ cycles per minute, maximizing output on compact assembly and packaging lines.",
    applications: [
      "High-Speed Pick-and-Place Sorting",
      "Precision Electronics & PCB Assembly",
      "Blister & Flow-Wrap Packaging",
    ],
    image: scaraRobotImg,
    imageAlt:
      "High-speed SCARA robot with vacuum end-of-arm tooling performing precision assembly",
    toolingBadge: "High-Speed Vacuum & Precision Pick EOAT",
    specs: [
      { label: "Payload Capacity", value: "1 kg – 20 kg" },
      { label: "Cycle Rate", value: "Up to 150+ cycles / min" },
      { label: "Repeatability", value: "±0.01 – ±0.02 mm" },
      { label: "Work Envelope", value: "400 – 1,300 mm" },
      { label: "Vision Sync", value: "2D/3D GigE Conveyor Tracking" },
      { label: "Cleanroom / ESD", value: "ESD-Safe, ISO Class 4/5" },
    ],
    compliance: "ISO 10218-1 • RoHS • CE",
  },
];

const DEPLOYMENT_STEPS = [
  {
    step: "01",
    title: "Floor Audit & Feasibility",
    description:
      "We analyze your cycle times, payload needs, and factory layout.",
    icon: Factory,
  },
  {
    step: "02",
    title: "3D Simulation & Digital Twin",
    description:
      "We test the robot cell virtually before you spend on hardware.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Custom Integration & Gripper Design",
    description:
      "We build custom end-of-arm tooling (EOAT) and safety systems.",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Installation & Operator Training",
    description:
      "Turnkey setup on your floor with full staff training and AMC support.",
    icon: ShieldCheck,
  },
];

const APPLICATION_OPTIONS = [
  "Welding/Painting",
  "CNC Tending",
  "Assembly/Screwdriving",
  "Pick & Place",
  "Other",
];

function ManufacturingAutomotivePage() {
  const [expandedRobotId, setExpandedRobotId] = useState<string | null>(
    "6-axis-articulated-robots",
  );
  const [nameAndCompany, setNameAndCompany] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [applicationType, setApplicationType] = useState("Welding/Painting");
  const [projectDetails, setProjectDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleSpecs = (robotId: string) => {
    setExpandedRobotId((prev) => (prev === robotId ? null : robotId));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAndCompany.trim() || !contactInfo.trim()) return;
    trackDigitalPresence(
      "lead_capture",
      "Manufacturing & Automotive Consultation",
      applicationType,
    );
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#155EEF] selection:text-white">
      {/* SECTION 1: HERO BANNER (ABOVE THE FOLD) */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8"
          >
            <Link
              to="/solutions"
              className="hover:text-[#155EEF] transition-colors"
            >
              Solutions
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#155EEF]">Manufacturing & Automotive</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                <Factory size={14} />
                <span>Manufacturing & Automotive</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-slate-900 leading-[1.08]">
                Precision Robotics for Manufacturing & Automotive
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Eliminate production bottlenecks, improve workplace safety, and
                achieve 24/7 millimeter-accurate throughput with industrial and
                collaborative robotics.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#lead-capture"
                  className="inline-flex items-center gap-2 rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-7 h-12 text-sm shadow-sm transition-colors"
                >
                  <span>Request a Site Assessment</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#core-robots"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-6 h-12 text-sm transition-colors"
                >
                  <span>Explore Solutions</span>
                  <ArrowDown size={15} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-[16/10] bg-slate-100">
                <img
                  src={heroWeldingImg}
                  alt="Industrial 6-axis robotic arms welding an automotive chassis on a production line"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: KEY IMPACT METRICS (TRUST BAR) */}
      <section className="border-b border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="size-11 rounded-lg bg-blue-50 text-[#155EEF] shrink-0 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-600">
                      {metric.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE 3 CORE ROBOT SOLUTIONS (ALTERNATING FEATURE BLOCKS) */}
      <section id="core-robots" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 lg:mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              Core Robot Platforms
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Purpose-built robotics & end-of-arm tooling
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Every workcell is engineered around your part geometry, cycle
              time, and end-of-arm tooling—from MIG torches to servo grippers.
            </p>
          </div>

          <div className="space-y-14 lg:space-y-20">
            {CORE_ROBOT_BLOCKS.map((robot, idx) => {
              const isReversed = idx % 2 === 1;
              const isExpanded = expandedRobotId === robot.id;

              return (
                <article
                  key={robot.id}
                  id={robot.id}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-xs"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    {/* Tooling-Focused Robot Photo */}
                    <div
                      className={`lg:col-span-6 relative aspect-[16/11] lg:aspect-auto lg:h-full min-h-[280px] bg-slate-100 overflow-hidden ${
                        isReversed ? "lg:order-2" : ""
                      }`}
                    >
                      <img
                        src={robot.image}
                        alt={robot.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 rounded-full bg-slate-900/85 backdrop-blur-xs px-3.5 py-1.5 text-xs font-semibold text-white">
                        {robot.toolingBadge}
                      </div>
                    </div>

                    {/* Text & Applications */}
                    <div
                      className={`lg:col-span-6 p-7 sm:p-10 lg:p-12 bg-white ${
                        isReversed ? "lg:order-1" : ""
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                        {robot.tagline}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
                        {robot.name}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
                        {robot.description}
                      </p>

                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Key Applications
                        </p>
                        <ul className="space-y-2.5">
                          {robot.applications.map((app) => (
                            <li
                              key={app}
                              className="flex items-center gap-2.5 text-sm font-semibold text-slate-800"
                            >
                              <CheckCircle2
                                size={17}
                                className="text-[#155EEF] shrink-0"
                              />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          onClick={() => toggleSpecs(robot.id)}
                          className="rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold px-6 h-11 text-sm cursor-pointer"
                        >
                          <span>View Specs & Use Cases</span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="ml-2" />
                          ) : (
                            <ChevronDown size={16} className="ml-2" />
                          )}
                        </Button>
                        <a
                          href="#lead-capture"
                          onClick={() => {
                            if (robot.id === "6-axis-articulated-robots") {
                              setApplicationType("Welding/Painting");
                            } else if (robot.id === "collaborative-robots") {
                              setApplicationType("CNC Tending");
                            } else {
                              setApplicationType("Pick & Place");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#155EEF] px-3 py-2 transition-colors"
                        >
                          <span>Request Cell Quote</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>

                      {/* Expandable Engineering Specifications Drawer */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in duration-200">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Technical Specifications
                            </span>
                            <span className="text-xs font-semibold text-[#155EEF] bg-blue-50 px-2.5 py-1 rounded-full">
                              {robot.compliance}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {robot.specs.map((spec) => (
                              <div
                                key={spec.label}
                                className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3"
                              >
                                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                  {spec.label}
                                </div>
                                <div className="text-sm font-bold text-slate-900 mt-0.5">
                                  {spec.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW WE DEPLOY (4-STEP PROCESS) */}
      <section className="border-t border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              How We Deploy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              From factory audit to production in 4 steps
            </h2>
            <p className="text-base text-slate-600">
              A proven, risk-free engineering process designed to validate ROI
              before hardware hits your shop floor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPLOYMENT_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center justify-center size-10 rounded-xl bg-blue-50 text-[#155EEF]">
                        <Icon size={20} />
                      </span>
                      <span className="text-2xl font-bold text-slate-200">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: BOTTOM CONVERSION FORM (LEAD CAPTURE) */}
      <section id="lead-capture" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Contact Details */}
              <div className="lg:col-span-5 bg-[#0F172A] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Free Engineering Consultation
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                    Ready to Automate Your Production Line?
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Tell us about your application, and our automation engineers
                    will recommend the right robot cell and ROI estimate.
                  </p>
                </div>

                <div className="mt-10 space-y-4 pt-8 border-t border-white/10 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <Phone size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.salesEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.headquarters}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={17} className="text-sky-400 shrink-0" />
                    <span>{companyConfig.supportHours}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Short 4-Field Lead Capture Form */}
              <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 bg-white">
                {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4">
                    <div className="size-14 rounded-full bg-blue-50 text-[#155EEF] flex items-center justify-center">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Consultation Request Received
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 max-w-md">
                      Thank you,{" "}
                      <span className="font-semibold text-slate-900">
                        {nameAndCompany}
                      </span>
                      . An INDUS automation engineer will review your{" "}
                      <span className="font-semibold text-slate-900">
                        {applicationType}
                      </span>{" "}
                      requirements and follow up with an ROI estimate shortly.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setNameAndCompany("");
                        setContactInfo("");
                        setProjectDetails("");
                      }}
                      className="rounded-full mt-2 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="mfg-name-company"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Name & Company Name *
                      </label>
                      <input
                        id="mfg-name-company"
                        type="text"
                        required
                        value={nameAndCompany}
                        onChange={(e) => setNameAndCompany(e.target.value)}
                        placeholder="e.g., Arjun Mehta — Apex Precision Gears"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mfg-contact"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Work Email / Phone Number *
                      </label>
                      <input
                        id="mfg-contact"
                        type="text"
                        required
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="e.g., arjun@apexgears.com or +1 555-0142"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mfg-application"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Application Type
                      </label>
                      <select
                        id="mfg-application"
                        value={applicationType}
                        onChange={(e) => setApplicationType(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      >
                        {APPLICATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mfg-details"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Brief Project Details{" "}
                        <span className="font-normal text-slate-400">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        id="mfg-details"
                        rows={3}
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        placeholder="Share part weight, target cycle time, or number of shifts..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white font-semibold h-12 text-sm shadow-sm cursor-pointer"
                    >
                      <span>Get My Free Automation Consultation</span>
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloatingEngineerCta />
    </div>
  );
}
