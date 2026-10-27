import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Compass,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Phone,
  MessageSquare,
  Clock,
  FileCheck2,
  Wrench,
  HelpCircle,
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

export const Route = createFileRoute("/rental")({
  head: () =>
    buildSeoMeta({
      title: "Industrial Robotics Rental & Pilot Evaluation | INDUS Robotics",
      description:
        "Flexible industrial robotics rental and proof-of-concept evaluation. Rent 6-axis arms, collaborative robots, AGV mobile platforms, and linear gantries for automation feasibility.",
      path: "/rental",
    }),
  component: RentalPage,
});

const RENTAL_EQUIPMENT = [
  {
    id: "industrial-arms",
    title: "6-Axis Articulated Industrial Robot Arms",
    specSummary: "Payload: 7 kg – 50 kg | Reach: 900 mm – 2,100 mm",
    description:
      "High-speed, rigid articulated manipulators for automated material handling, machine tending, and precision dispensing.",
    idealFor: "Cycle time validation, pick-and-place trials, welding and machine tending PoCs.",
    badge: "Industrial Duty",
  },
  {
    id: "cobots",
    title: "Collaborative Robots (Cobots)",
    specSummary: "Payload: 5 kg – 16 kg | Repeatability: ±0.03 mm",
    description:
      "Power and force limited (PFL) manipulators equipped with joint torque sensors, compliant hand guiding, and quick-mount ISO flanges.",
    idealFor: "Fenceless assembly, screwdriving cells, palletizing tests, and shared human-robot workspaces.",
    badge: "ISO/TS 15066",
  },
  {
    id: "mobile-robots",
    title: "Autonomous Mobile Robot (AMR) Drive Bases",
    specSummary: "Payload: 300 kg – 1,200 kg | 48V DC Battery Powered",
    description:
      "Omnidirectional and differential mobile robot chassis equipped with safety LiDAR scanners, navigation controllers, and docking interfaces.",
    idealFor: "Intralogistics routing simulation, warehouse transport trials, and custom payload top-module testing.",
    badge: "Safety LiDAR",
  },
  {
    id: "linear-gantries",
    title: "Precision Multi-Axis Linear Motion Gantries",
    specSummary: "Stroke: Up to 4,000 mm | Drive: Ball Screw / Ironcore Linear Motor",
    description:
      "High-stiffness orthogonal XYZ gantry stages with closed-loop servo feedback for automated inspection and cutting.",
    idealFor: "Large-envelope dispensing, laser scanning, automated optical inspection (AOI), and pick-and-place.",
    badge: "Sub-Micron Encoders",
  },
  {
    id: "intelligent-actuators",
    title: "Intelligent Mechatronic Actuator Test Kits",
    specSummary: "Continuous Torque: 35 – 280 Nm | EtherCAT / CANopen",
    description:
      "Modular robotic joints with built-in 48V vector drive, strain-wave reduction, and dual 19-bit encoders ready for benchtop testing.",
    idealFor: "Custom robot arm prototyping, kinematic benchtop testing, and digital twin motion profile evaluation.",
    badge: "All-in-One Mechatronics",
  },
];

const RENTAL_APPLICATIONS = [
  {
    title: "Proof of Concept & Feasibility Testing",
    desc: "Verify cycle times, reach envelopes, part grip reliability, and dimensional repeatability before issuing major capital expenditure.",
  },
  {
    title: "Production Peak & Surge Capacity",
    desc: "Meet urgent seasonal contract spikes or unexpected order surges without locking up working capital in long-term equipment assets.",
  },
  {
    title: "System Integration & Tooling Validation",
    desc: "Test custom vacuum or servo end-effectors, machine vision cameras, and PLC fieldbus sequencing prior to factory customer sign-off.",
  },
  {
    title: "R&D Prototyping & Academic Research",
    desc: "Deploy certified industrial-grade robotics in laboratory settings for advanced trajectory planning, force control, and AI studies.",
  },
];

const RENTAL_PROCESS = [
  {
    step: "01",
    title: "Engineering Sizing & Scope",
    desc: "Submit your payload, reach, takt time, and environment requirements. Our application engineers verify kinematic fit within 24 hours.",
  },
  {
    step: "02",
    title: "Agreement & Safety Review",
    desc: "Select rental duration (weekly, monthly, or quarterly pilot). We finalize commercial terms, equipment availability, and safety clearances.",
  },
  {
    step: "03",
    title: "Dispatch & Integration Support",
    desc: "Equipment undergoes factory inspection and DIN/ISO benchmark verification before express crating and dispatch to your facility.",
  },
  {
    step: "04",
    title: "Operation, Support & Buyout Option",
    desc: "Access remote engineering support throughout your rental term. Apply up to 70% of rental fees toward permanent equipment purchase.",
  },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function RentalPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    equipmentType: "6-Axis Articulated Industrial Robot Arms",
    rentalDuration: "1–3 Months (Quarterly Pilot)",
    location: "",
    applicationDetails: "",
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
      setErrorMessage("Please enter your full name (minimum 2 characters).");
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
      setErrorMessage("Please enter a valid direct contact telephone number.");
      return;
    }

    setLoading(true);
    trackDigitalPresence("form_submit", "Rental Enquiry Form", formData.equipmentType);
    trackClarityEvent("rental_enquiry_submit");

    try {
      const response = await createJiraTask({
        data: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          product: `Rental: ${formData.equipmentType}`,
          category: "Equipment Rental & Pilot Evaluation",
          quantity: formData.rentalDuration,
          requirements: `Location: ${formData.location || "Not specified"}\nDuration: ${formData.rentalDuration}\nApplication Details: ${formData.applicationDetails || "Standard trial requested"}`,
          type: "Rental Enquiry",
          topic: `Rental Request: ${formData.equipmentType} (${formData.company})`,
          labels: ["rental", "pilot-evaluation", "equipment-loan"],
        },
      });

      if (response.success) {
        setSuccess(true);
        if (response.issueKey) {
          setTicketKey(response.issueKey);
        }
      } else {
        setErrorMessage(
          response.message ||
            "Unable to log rental request. Please try again or reach our engineering desk directly."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      setErrorMessage(
        `${msg}. Please email your rental specifications directly to ${companyConfig.email}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({ type: "general" }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative border-b border-[#E5EAF1] bg-[#FFFFFF] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#667085] mb-4">
            <Link to="/" className="text-[#155EEF] hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#172033]">Equipment Rental &amp; Evaluation</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D1E0FF] bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#155EEF] mb-4">
              <span className="size-2 rounded-full bg-[#155EEF] animate-pulse" />
              Pilot Evaluation &amp; Flexible Rental Program
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
              Industrial Robotics &amp; Precision Motion Rental
            </h1>

            <p className="mt-4 text-base text-[#475467] leading-relaxed sm:text-lg">
              Validate automated workcells, cycle takt times, and kinematic feasibility with certified
              industrial robotics hardware before committing to major capital investments.
              Flexible weekly, monthly, and pilot-to-purchase arrangements.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#rental-form"
                className="inline-flex items-center gap-2 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white px-5 py-2.5 text-sm font-bold shadow-xs hover:shadow transition-all"
              >
                <span>Request Equipment Rental</span>
                <ArrowRight size={15} />
              </a>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5EAF1] bg-white hover:bg-[#F8FAFC] text-[#344054] px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                <MessageSquare size={15} className="text-[#16A34A]" />
                <span>Chat with Equipment Specialist</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AVAILABLE EQUIPMENT CATALOGUE */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              <Cpu size={14} />
              <span>Rental &amp; Evaluation Fleet</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Available Hardware Configurations
            </h2>
            <p className="mt-2 text-sm text-[#667085] max-w-2xl">
              All rental systems undergo full kinematic calibration, backlash verification, and
              safety interlock testing before dispatch. Availability is subject to prior reservation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RENTAL_EQUIPMENT.map((eq) => (
              <div
                key={eq.id}
                className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-xs hover:border-[#B2CCFF] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center rounded-md bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-bold text-[#155EEF] border border-[#D1E0FF]">
                      {eq.badge}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#16A34A] flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Fleet Active
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#172033] tracking-tight">
                    {eq.title}
                  </h3>

                  <div className="mt-2 text-xs font-mono font-semibold text-[#155EEF] bg-[#F8FAFC] p-2 rounded-lg border border-[#E5EAF1]">
                    {eq.specSummary}
                  </div>

                  <p className="mt-3 text-xs text-[#475467] leading-relaxed">
                    {eq.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#F2F4F7]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#344054] block mb-1">
                      Target Engineering Use:
                    </span>
                    <p className="text-xs text-[#667085]">{eq.idealFor}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5EAF1] flex items-center justify-between">
                  <a
                    href="#rental-form"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, equipmentType: eq.title }))
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#155EEF] hover:text-[#1047BF] transition-colors"
                  >
                    <span>Reserve this Unit</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. APPLICATIONS & RENTAL PROCESS */}
      <section className="border-y border-[#E5EAF1] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          {/* Applications Grid */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                Deployment Scenarios
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                When Does Equipment Rental Make Sense?
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {RENTAL_APPLICATIONS.map((app, idx) => (
                <div
                  key={app.title}
                  className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-5 shadow-2xs"
                >
                  <div className="size-8 rounded-lg bg-[#EFF6FF] text-[#155EEF] font-mono font-bold text-xs grid place-items-center mb-3 border border-[#D1E0FF]">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-[#172033] tracking-tight">
                    {app.title}
                  </h4>
                  <p className="mt-2 text-xs text-[#475467] leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Step Process */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                Operational Workflow
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                The 4-Step Rental Process
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {RENTAL_PROCESS.map((p) => (
                <div key={p.step} className="relative">
                  <div className="text-3xl font-black text-[#D1E0FF] font-mono mb-2">
                    {p.step}
                  </div>
                  <h4 className="text-base font-bold text-[#172033]">{p.title}</h4>
                  <p className="mt-2 text-xs text-[#667085] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TERMS, REQUIREMENTS & ENQUIRY FORM */}
      <section id="rental-form" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px] grid gap-12 lg:grid-cols-[1fr_420px]">
          {/* Form Column */}
          <div className="rounded-2xl border border-[#E5EAF1] bg-white p-6 sm:p-10 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                Formal Reservation
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172033]">
                Submit Rental or Evaluation Enquiry
              </h2>
              <p className="mt-1.5 text-xs text-[#667085]">
                Please provide your project specifications. Our application engineering team will
                review availability, payload envelope, and dispatch readiness.
              </p>
            </div>

            {success ? (
              <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-8 text-center space-y-4">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#D1FADF] text-[#12B76A]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#101828]">
                  Rental Enquiry Registered
                </h3>
                <p className="text-xs text-[#475467] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your rental request for{" "}
                  <strong>{formData.equipmentType}</strong> has been logged in our application queue.
                  {ticketKey && (
                    <span className="block mt-1 font-mono text-[11px] text-[#027A48]">
                      Reference Lead ID: {ticketKey}
                    </span>
                  )}
                  An engineering representative will contact you with dispatch schedules and
                  qualification requirements.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: "",
                        company: "",
                        email: "",
                        phone: "",
                        equipmentType: "6-Axis Articulated Industrial Robot Arms",
                        rentalDuration: "1–3 Months (Quarterly Pilot)",
                        location: "",
                        applicationDetails: "",
                      });
                    }}
                    variant="outline"
                    className="border-[#D0D5DD] text-xs font-bold"
                  >
                    Submit Another Request
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-[#344054]">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. David Vance"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs font-bold text-[#344054]">
                      Company / Organization *
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      required
                      placeholder="e.g. Apex Automation LLC"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="h-10 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-[#344054]">
                      Business Email *
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
                      Direct Telephone *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-10 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="equipmentType" className="text-xs font-bold text-[#344054]">
                      Equipment Required
                    </Label>
                    <Select
                      value={formData.equipmentType}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, equipmentType: val }))
                      }
                    >
                      <SelectTrigger id="equipmentType" className="h-10 text-xs">
                        <SelectValue placeholder="Select Equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {RENTAL_EQUIPMENT.map((eq) => (
                          <SelectItem key={eq.id} value={eq.title} className="text-xs">
                            {eq.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="rentalDuration" className="text-xs font-bold text-[#344054]">
                      Estimated Duration
                    </Label>
                    <Select
                      value={formData.rentalDuration}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, rentalDuration: val }))
                      }
                    >
                      <SelectTrigger id="rentalDuration" className="h-10 text-xs">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1–4 Weeks (Evaluation Trial)" className="text-xs">
                          1–4 Weeks (Evaluation Trial)
                        </SelectItem>
                        <SelectItem value="1–3 Months (Quarterly Pilot)" className="text-xs">
                          1–3 Months (Quarterly Pilot)
                        </SelectItem>
                        <SelectItem value="3–6 Months (Extended Lease)" className="text-xs">
                          3–6 Months (Extended Lease)
                        </SelectItem>
                        <SelectItem value="6+ Months / Rent-to-Own" className="text-xs">
                          6+ Months / Rent-to-Own
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-bold text-[#344054]">
                    Facility Deployment Location (City, Country)
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Detroit, MI, USA or Chennai, India"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="applicationDetails"
                    className="text-xs font-bold text-[#344054]"
                  >
                    Application Scope &amp; Target Payload / Cycle Requirements
                  </Label>
                  <Textarea
                    id="applicationDetails"
                    name="applicationDetails"
                    rows={3}
                    placeholder="Describe your manufacturing task (e.g. 12 kg payload, 4 second pick-and-place, machine door tending, EtherCAT integration)..."
                    value={formData.applicationDetails}
                    onChange={handleInputChange}
                    className="text-xs"
                  />
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
                    className="w-full h-11 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Verifying Availability &amp; Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={15} className="mr-2" />
                        Submit Rental Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Terms & Requirements Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#155EEF] mb-3">
                <ShieldCheck size={16} />
                <span>Rental Requirements &amp; Terms</span>
              </div>

              <ul className="space-y-3 text-xs text-[#475467]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>Commercial Qualification:</strong> Renters must be registered legal
                    entities or recognized educational/research institutes.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>Safety Envelope:</strong> Safe installation compliant with ISO 10218-1/2
                    or safety LiDAR zones must be maintained.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>Technical Supervision:</strong> Qualified engineering staff must supervise
                    operation. INDUS field engineers are available for commissioning.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#155EEF] font-bold mt-0.5">•</span>
                  <span>
                    <strong>Equity Conversion:</strong> Up to 70% of accumulated rental charges can be
                    credited toward outright purchase.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E5EAF1] bg-[#EFF6FF] p-6">
              <h4 className="text-sm font-bold text-[#172033] mb-1">
                Need Fast Technical Consultation?
              </h4>
              <p className="text-xs text-[#475467] leading-relaxed mb-4">
                Our application engineering desk evaluates your kinematic model and suggests the
                exact rental hardware for your trial period.
              </p>
              <div className="space-y-2 text-xs font-semibold text-[#155EEF]">
                <div className="flex items-center gap-2">
                  <Phone size={13} />
                  <a href="tel:+919444024848" className="hover:underline">
                    +91 94440 24848
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={13} />
                  <span>Chennai Engineering HQ · Global Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
