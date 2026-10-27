import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileCheck2,
  ShieldCheck,
  Building2,
  Cpu,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companyConfig } from "@/data/config";
import { createJiraTask } from "@/lib/jira";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/quote")({
  head: () =>
    buildSeoMeta({
      title: "Request a Formal Quotation (RFQ) | INDUS Industrial Robotics",
      description:
        "Request formal commercial quotations, 3D CAD files, and technical datasheets for precision reducers, robot actuators, articulated arms, and motion controls. 24-hour engineering response.",
      path: "/quote",
    }),
  component: QuotePage,
});

const PRODUCT_CATEGORIES = [
  "Precision Reducers (Strain-Wave Harmonic / RV Cycloidal / Planetary)",
  "Intelligent Actuators & Rotary/Linear Mechatronic Joints",
  "Servo Motors & High-Bandwidth Inverter Drives",
  "6-Axis Industrial Robot Arms & Collaborative Robots",
  "Autonomous Mobile Robot (AMR / AGV) Drive Wheel Modules",
  "End Effectors, Servo Grippers & Automatic Tool Changers",
  "Linear Motion Stages, Ball Screws & 7th-Axis Robot Transfer Tracks",
  "Motion Controllers, PLC Systems & Safety LiDAR Modules",
  "Custom Automation Workcell Integration",
];

const INDUSTRIES = [
  "Automotive & Electric Vehicles (EV Battery / Powertrain)",
  "Electronics, Semiconductor & Cleanroom Manufacturing",
  "Aerospace, Defence & Precision Machining",
  "Logistics, Intralogistics & Autonomous Warehousing",
  "Pharmaceutical, Medical Devices & Life Sciences",
  "Food, Beverage & High-Speed Packaging",
  "Heavy Metal Fabrication & Robotic Welding",
  "Academic & Advanced Industrial R&D",
];

const QUANTITY_TIERS = [
  "1–5 Units (Proof-of-Concept / Prototyping)",
  "6–25 Units (Pilot Line / Pre-Production)",
  "26–100 Units (Annual Production Batch)",
  "100+ Units (High-Volume OEM Schedule)",
  "Budgetary & Feasibility Sizing Only",
];

const TIMELINES = [
  "Immediate (< 30 Days)",
  "Active Project / 1–3 Months",
  "Production Scale / 3–6 Months",
  "Engineering Sizing (6+ Months)",
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function QuotePage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    jobRole: "Automation / Mechanical Engineer",
    productInterest: PRODUCT_CATEGORIES[0],
    applicationIndustry: INDUSTRIES[0],
    quantity: QUANTITY_TIERS[0],
    timeline: TIMELINES[1],
    payloadOrStroke: "",
    fieldbus: "EtherCAT",
    projectRequirements: "",
    preferredFormat: "Commercial PDF & Formal Datasheet",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketKey, setTicketKey] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid corporate or business email address.");
      return;
    }
    if (formData.company.trim().length < 2) {
      setErrorMessage("Please enter your company or organization name.");
      return;
    }
    if (formData.phone.trim().length < 7) {
      setErrorMessage("Please provide a valid direct phone number.");
      return;
    }

    setLoading(true);
    trackDigitalPresence("form_submit", "Dedicated Quote Page RFQ", formData.productInterest);
    trackClarityEvent("quote_page_submit");

    try {
      const result = await createJiraTask({
        data: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          product: formData.productInterest,
          category: formData.applicationIndustry,
          quantity: formData.quantity,
          requirements: `Industry: ${formData.applicationIndustry}\nQuantity: ${formData.quantity}\nTimeline: ${formData.timeline}\nSizing/Payload: ${formData.payloadOrStroke || "Not specified"}\nFieldbus: ${formData.fieldbus}\nPreferred Format: ${formData.preferredFormat}\n\nProject Scope:\n${formData.projectRequirements || "Commercial quote requested"}`,
          type: "Commercial Quote Request",
          topic: `RFQ: ${formData.productInterest} - ${formData.company}`,
          preferredContact: formData.preferredFormat,
          labels: ["rfq", "commercial-quote", "quote-page"],
        },
      });

      if (result.success) {
        setSuccess(true);
        if (result.issueKey) {
          setTicketKey(result.issueKey);
        }
      } else {
        setErrorMessage(
          result.message ||
            "Unable to log quotation request. Please retry or contact our direct engineering desk."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Quotation processing error";
      setErrorMessage(
        `${msg}. Please email your specifications directly to ${companyConfig.email}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    trackDigitalPresence("contact", "Quote Page WhatsApp", "Opened WhatsApp");
    window.open(
      companyConfig.getWhatsAppUrl({ type: "general" }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO HEADER */}
      <section className="border-b border-[#E5EAF1] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#667085] mb-3">
            <Link to="/" className="text-[#155EEF] hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#172033]">Commercial RFQ &amp; Quotation</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D1E0FF] bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#155EEF] mb-3">
                <FileCheck2 size={13} />
                <span>Formal Commercial Quotation (RFQ)</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#172033] sm:text-4xl">
                Engineering Sizing &amp; Commercial Quotation
              </h1>
              <p className="mt-3 text-sm text-[#475467] leading-relaxed sm:text-base">
                Request verified commercial pricing, delivery lead times, and certified kinematic
                data sheets. Every RFQ is analyzed by our senior mechatronics engineering desk.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1.5 rounded-lg">
                <Clock size={14} />
                24-Hour Engineering Turnaround
              </span>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5EAF1] bg-white hover:bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-bold text-[#344054] transition-colors"
              >
                <MessageSquare size={14} className="text-[#16A34A]" />
                <span>WhatsApp Active</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FORM & SIDEBAR CONTAINER */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main Quotation Form */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-6 sm:p-10 shadow-xs">
            {success ? (
              <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-8 text-center space-y-4">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#D1FADF] text-[#12B76A]">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-2xl font-bold text-[#101828]">
                  Quotation Request Logged Successfully
                </h2>
                <p className="text-xs text-[#475467] max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your quotation request for{" "}
                  <strong>{formData.productInterest}</strong> has been transmitted to our
                  engineering and commercial pricing desk.
                </p>

                {ticketKey && (
                  <div className="inline-block rounded-md bg-white border border-[#A6F4C5] px-4 py-2 font-mono text-xs font-bold text-[#027A48]">
                    Confirmed Lead ID: {ticketKey}
                  </div>
                )}

                <p className="text-[11.5px] text-[#667085] max-w-md mx-auto">
                  A dedicated application engineer will evaluate your load specifications and email
                  a formal commercial proposal along with relevant 3D CAD files within 24 hours.
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setFormData((prev) => ({
                        ...prev,
                        projectRequirements: "",
                        payloadOrStroke: "",
                      }));
                    }}
                    variant="outline"
                    className="border-[#D0D5DD] text-xs font-bold"
                  >
                    Submit Additional RFQ
                  </Button>
                  <Button
                    asChild
                    className="bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold"
                  >
                    <Link to="/products">Browse Product Catalogue</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#155EEF] border-b border-[#E5EAF1] pb-2 mb-4 flex items-center gap-2">
                    <Building2 size={16} />
                    <span>1. Commercial &amp; Contact Details</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-[#344054]">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="e.g. Dr. Robert Lang"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-bold text-[#344054]">
                        Company / OEM / Facility *
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        required
                        placeholder="e.g. Siemens Robotics Lab / Apex Dynamics"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 mt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-[#344054]">
                        Corporate Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-[#344054]">
                        Direct Phone / Mobile *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 234-5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="jobRole" className="text-xs font-bold text-[#344054]">
                        Engineering Role
                      </Label>
                      <Input
                        id="jobRole"
                        name="jobRole"
                        placeholder="e.g. Lead Robotics Engineer"
                        value={formData.jobRole}
                        onChange={handleInputChange}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Product Requirements */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#155EEF] border-b border-[#E5EAF1] pb-2 mb-4 flex items-center gap-2">
                    <Cpu size={16} />
                    <span>2. Product &amp; Application Specification</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="productInterest" className="text-xs font-bold text-[#344054]">
                        Product Family of Interest *
                      </Label>
                      <Select
                        value={formData.productInterest}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, productInterest: val }))
                        }
                      >
                        <SelectTrigger id="productInterest" className="h-10 text-xs">
                          <SelectValue placeholder="Select Product Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-xs">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="applicationIndustry"
                        className="text-xs font-bold text-[#344054]"
                      >
                        Application Industry Vertical
                      </Label>
                      <Select
                        value={formData.applicationIndustry}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, applicationIndustry: val }))
                        }
                      >
                        <SelectTrigger id="applicationIndustry" className="h-10 text-xs">
                          <SelectValue placeholder="Select Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind} className="text-xs">
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 mt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity" className="text-xs font-bold text-[#344054]">
                        Estimated Quantity
                      </Label>
                      <Select
                        value={formData.quantity}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, quantity: val }))
                        }
                      >
                        <SelectTrigger id="quantity" className="h-10 text-xs">
                          <SelectValue placeholder="Select Quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUANTITY_TIERS.map((tier) => (
                            <SelectItem key={tier} value={tier} className="text-xs">
                              {tier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="timeline" className="text-xs font-bold text-[#344054]">
                        Project Timeline
                      </Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, timeline: val }))
                        }
                      >
                        <SelectTrigger id="timeline" className="h-10 text-xs">
                          <SelectValue placeholder="Select Timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMELINES.map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="fieldbus" className="text-xs font-bold text-[#344054]">
                        Fieldbus Protocol
                      </Label>
                      <Input
                        id="fieldbus"
                        name="fieldbus"
                        placeholder="e.g. EtherCAT, PROFINET, CANopen"
                        value={formData.fieldbus}
                        onChange={handleInputChange}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <Label htmlFor="payloadOrStroke" className="text-xs font-bold text-[#344054]">
                      Target Sizing Parameters (Payload, Torque, Ratio or Travel Stroke)
                    </Label>
                    <Input
                      id="payloadOrStroke"
                      name="payloadOrStroke"
                      placeholder="e.g. 50:1 Ratio, <1.0 arcmin backlash, 25 kg payload, 800 mm stroke"
                      value={formData.payloadOrStroke}
                      onChange={handleInputChange}
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <Label
                      htmlFor="projectRequirements"
                      className="text-xs font-bold text-[#344054]"
                    >
                      Project Requirements &amp; Performance Needs
                    </Label>
                    <Textarea
                      id="projectRequirements"
                      name="projectRequirements"
                      rows={4}
                      placeholder="Specify ambient environment, duty cycle, emergency-stop holding brake needs, mounting constraints, or custom flange preferences..."
                      value={formData.projectRequirements}
                      onChange={handleInputChange}
                      className="text-xs"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#FDA29B] bg-[#FEF3F2] p-3 text-xs text-[#B42318]">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Generating DealFlow Lead &amp; Sizing Ticket...
                      </>
                    ) : (
                      <>
                        <Send size={15} className="mr-2" />
                        Submit Formal Quotation Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Sizing & Standards Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#155EEF] mb-3">
                <ShieldCheck size={16} />
                <span>Engineering Guarantee</span>
              </div>

              <ul className="space-y-3 text-xs text-[#475467]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>ISO 9283 / DIN 3990 Compliance:</strong> All gearing and joint
                    specifications reflect certified physical test bench records.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>Direct Factory Sizing:</strong> Applications engineers verify safety
                    factors and thermal derating curves before issuing quotes.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>Fast 3D Models:</strong> Receive native STEP and IGES files paired with
                    formal quotes for direct CAD assembly verification.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E5EAF1] bg-[#F8FAFC] p-6">
              <h4 className="text-sm font-bold text-[#172033] mb-1">
                Explore Alternative Tools
              </h4>
              <p className="text-xs text-[#667085] leading-relaxed mb-4">
                Not ready for a formal commercial quote? Use our interactive sizing calculators or
                application wizard.
              </p>
              <div className="space-y-2 text-xs font-semibold">
                <Link
                  to="/technology/calculators"
                  className="flex items-center justify-between text-[#155EEF] hover:underline"
                >
                  <span>Motion Sizing Calculators</span>
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/application-finder"
                  className="flex items-center justify-between text-[#155EEF] hover:underline"
                >
                  <span>Interactive Application Finder</span>
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/products/compare"
                  className="flex items-center justify-between text-[#155EEF] hover:underline"
                >
                  <span>Side-by-Side Product Comparator</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
