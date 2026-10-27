import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Loader2,
  AlertCircle,
  Building2,
  Cpu,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { createJiraTask } from "@/lib/jira";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { getLinkedInAttribution } from "@/integrations/linkedin-tracking/attribution";
import { useModals } from "./ModalContext";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const CATEGORIES = [
  "Robotic Arms & Cobots",
  "Precision Reducers (Harmonic / Planetary / Cycloidal)",
  "Actuators (Linear / Rotary / Servo)",
  "Robotic Wheels & AGV Drive Modules",
  "Control Systems & PLCs",
  "Complete Integrated Automation Workcell",
];

const INDUSTRIES = [
  "Automotive & Electric Vehicles (EV)",
  "Electronics & Semiconductor",
  "Food, Beverage & Packaging",
  "Pharmaceutical & Medical Device",
  "Logistics & Warehousing (AGV/AMR)",
  "Heavy Manufacturing & Metal Fabrication",
  "Aerospace & Defense",
  "Other Industrial Automation",
];

const TIMELINES = [
  "Immediate / Proof of Concept (< 1 month)",
  "Active Project / 1–3 Months",
  "Production Scale-up / 3–6 Months",
  "Budgetary & Engineering Sizing (6+ Months)",
];

export function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { modalPayload } = useModals();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  const [formData, setFormData] = useState({
    // Step 1: Contact
    name: "",
    email: "",
    phone: "",
    company: "",
    jobRole: "Automation / Controls Engineer",
    // Sizing Mode
    rfqMode: "direct" as "direct" | "assisted",

    // Step 2: Engineering Requirements (Direct Mode)
    category: modalPayload.categoryName || "Robotic Arms & Cobots",
    product: modalPayload.productName || "",
    industry: "Automotive & Electric Vehicles (EV)",
    quantity: "1-5 units (Prototype / Pilot)",
    timeline: "Active Project / 1–3 Months",
    payloadKg: "",
    reachOrStroke: "",
    torqueOrSpeed: "",

    // Category-specific Direct Questions
    actuatorOrientation: "Horizontal",
    actuatorLead: "10 mm Lead (Standard Precision)",
    reducerRatio: "50:1 Ratio",
    reducerBacklash: "< 1.0 arcmin (Precision Class)",
    robotSafety: "Standard Fenced Cell (High Speed)",
    wheelGrossWeight: "500 to 1200 kg AGV Loaded",
    controlSyncAxes: "6-Axis Coordinated Motion",

    // Assisted Mode Questions ("Help me determine requirements")
    assistedTask: "High-Speed Pick & Place Assembly",
    assistedPayloadTier: "5 to 15 kg (Medium Payloads)",
    assistedCycleTime: "2 to 5 seconds (Standard Automated Takt)",
    assistedEnvelope: "500 to 1200 mm (Machine Bed Envelope)",
    assistedEnvironment: "Clean, dry indoor workshop / standard IP54",
    assistedPlantFieldbus: "EtherCAT (Real-time Industrial Ethernet)",

    // Step 3: Additional Details
    requirements: modalPayload.initialMessage || "",
    fieldbus: "EtherCAT",
    preferredContact: "Email & Commercial PDF",
    consent: true,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        category: modalPayload.categoryName || prev.category,
        product: modalPayload.productName || prev.product,
        requirements: modalPayload.initialMessage || prev.requirements,
      }));
    }
  }, [isOpen, modalPayload]);

  const handleFormFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence("form_start", "Quote Modal RFQ", "Started progressive quote form");
      trackClarityEvent("form_start");
    }
  };

  const validateStep1 = (): boolean => {
    setErrorMessage(null);
    if (formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid business email address (e.g. name@company.com).");
      return false;
    }
    if (formData.company.trim().length < 2) {
      setErrorMessage("Please enter your company name.");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    setErrorMessage(null);
    if (formData.rfqMode === "direct") {
      if (!formData.product.trim() && !formData.category) {
        setErrorMessage("Please specify the target product or component category.");
        return false;
      }
    } else {
      if (!formData.assistedTask.trim()) {
        setErrorMessage("Please select your primary production task.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        trackDigitalPresence("rfq_step_2_reached", "Quote Modal RFQ", "Advanced to technical requirements step");
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
        trackDigitalPresence("rfq_step_3_reached", "Quote Modal RFQ", "Advanced to project description step");
      }
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.requirements.trim().length < 5) {
      setErrorMessage("Please provide a brief description of your project scope or engineering specifications.");
      trackDigitalPresence("form_validation_error", "Quote Modal RFQ", "Requirements description too short");
      trackClarityEvent("form_validation_error");
      return;
    }

    setLoading(true);

    try {
      // Assemble comprehensive engineering dossier for Jira & backend
      const technicalDossier = [
        `=== ENGINEERING RFQ DOSSIER ===`,
        `Role: ${formData.jobRole}`,
        `Target Industry: ${formData.industry}`,
        `RFQ Workflow Mode: ${formData.rfqMode === "assisted" ? "ASSISTED SIZING ('Help me determine requirements')" : "DIRECT SPECIFICATION"}`,
        `Product Category: ${formData.category}`,
        `Target Product/Variant: ${formData.product || modalPayload.productName || "General Portfolio"}`,
        `Quantity / Batch: ${formData.quantity}`,
        `Implementation Timeline: ${formData.timeline}`,
        formData.rfqMode === "assisted"
          ? [
              `\n--- GUIDED REQUIREMENTS DETERMINATION ---`,
              `Target Production Task: ${formData.assistedTask}`,
              `Working Payload Range: ${formData.assistedPayloadTier}`,
              `Target Cycle / Takt Time: ${formData.assistedCycleTime}`,
              `Working Stroke / Envelope: ${formData.assistedEnvelope}`,
              `Operating Environment: ${formData.assistedEnvironment}`,
              `Plant Fieldbus Standard: ${formData.assistedPlantFieldbus}`,
            ].join("\n")
          : [
              `\n--- DIRECT TECHNICAL PARAMETERS ---`,
              formData.payloadKg ? `Target Payload: ${formData.payloadKg} kg` : null,
              formData.reachOrStroke ? `Target Reach / Stroke: ${formData.reachOrStroke}` : null,
              formData.torqueOrSpeed ? `Target Torque / Velocity: ${formData.torqueOrSpeed}` : null,
              formData.category.includes("Actuator") ? `Mounting Orientation: ${formData.actuatorOrientation} | Lead: ${formData.actuatorLead}` : null,
              formData.category.includes("Reducer") ? `Reduction Ratio: ${formData.reducerRatio} | Backlash Limit: ${formData.reducerBacklash}` : null,
              formData.category.includes("Arm") || formData.category.includes("Robot") ? `Safety Cell Architecture: ${formData.robotSafety}` : null,
              formData.category.includes("Wheel") ? `Vehicle Gross Weight: ${formData.wheelGrossWeight}` : null,
              formData.category.includes("Control") ? `Synchronized Axes: ${formData.controlSyncAxes}` : null,
            ].filter(Boolean).join("\n"),
        `Fieldbus / Network: ${formData.fieldbus}`,
        `Preferred Contact Method: ${formData.preferredContact}`,
        `\n=== PROJECT DESCRIPTION & SIZING NOTES ===`,
        formData.requirements.trim(),
      ]
        .filter(Boolean)
        .join("\n");

      const result = await createJiraTask({
        data: {
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          product: formData.product.trim() || modalPayload.productName || formData.category,
          category: formData.category || modalPayload.categoryName,
          modelConfig: modalPayload.modelConfig,
          originUrl: modalPayload.originUrl,
          payloadKg: formData.payloadKg || undefined,
          travelOrReach: formData.reachOrStroke || undefined,
          environment: formData.rfqMode === "assisted" ? formData.assistedEnvironment : undefined,
          quantity: formData.quantity,
          requirements: technicalDossier + (modalPayload.originUrl ? `\nOrigin Route: ${modalPayload.originUrl}` : ""),
          preferredContact: formData.preferredContact,
          type: "Commercial RFQ",
          labels: ["rfq", "quote-request", "enterprise-intake", formData.rfqMode === "assisted" ? "assisted-sizing" : "direct-spec"],
          attribution: getYouTubeAttribution() ?? undefined,
          linkedinAttribution: getLinkedInAttribution() ?? undefined,
        },
      });

      if (result && "success" in result && result.success) {
        if ("issueKey" in result && result.issueKey) {
          setTicketKey(result.issueKey);
        }
        if (result.duplicate) {
          setIsDuplicate(true);
        }
        trackDigitalPresence(
          "lead_submit_success",
          "Quote Modal RFQ",
          `Ticket: ${result.issueKey || "Created"} | Mode: Progressive RFQ`,
        );
        trackClarityEvent("lead_submit_success");
        trackClarityEvent("request_quote");
        setLoading(false);
        setSuccess(true);
      } else {
        throw new Error(result?.message || "Quote request could not be transmitted.");
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "We encountered a transmission failure. Please retry or contact our technical sales desk directly on WhatsApp.";
      trackDigitalPresence("lead_submit_failure", "Quote Modal RFQ", msg);
      trackClarityEvent("lead_submit_failure");
      setErrorMessage(msg);
      setLoading(false);
      setSuccess(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setLoading(false);
    setErrorMessage(null);
    setTicketKey(null);
    setStep(1);
    onClose();
  };

  const handleWhatsApp = () => {
    trackClarityEvent("whatsapp_click");
    window.open(
      companyConfig.getWhatsAppUrl({
        type: modalPayload.productName ? "product" : "general",
        name: modalPayload.productName || formData.product,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-md border border-border bg-card p-6 shadow-2xl sm:p-8">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              Commercial RFQ Desk
            </span>
            <span className="text-xs font-mono text-muted-foreground uppercase">
              Step {step} of 3
            </span>
          </div>

          <DialogTitle className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
            Request an Engineering Quotation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {step === 1 && "Enter your primary procurement contact details."}
            {step === 2 && "Specify component category, target kinematics, and required volumes."}
            {step === 3 && "Add technical sizing parameters and select preferred quote format."}
          </DialogDescription>

          {/* Stepper Progress Bar */}
          {!success && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div
                className={`flex items-center gap-1.5 border-t-2 pt-2 text-[10px] font-bold uppercase tracking-wider ${
                  step >= 1 ? "border-signal text-signal" : "border-border text-muted-foreground"
                }`}
              >
                <Building2 size={12} />
                <span>1. Contact</span>
              </div>
              <div
                className={`flex items-center gap-1.5 border-t-2 pt-2 text-[10px] font-bold uppercase tracking-wider ${
                  step >= 2 ? "border-signal text-signal" : "border-border text-muted-foreground"
                }`}
              >
                <Cpu size={12} />
                <span>2. Requirements</span>
              </div>
              <div
                className={`flex items-center gap-1.5 border-t-2 pt-2 text-[10px] font-bold uppercase tracking-wider ${
                  step >= 3 ? "border-signal text-signal" : "border-border text-muted-foreground"
                }`}
              >
                <FileCheck2 size={12} />
                <span>3. Details</span>
              </div>
            </div>
          )}
        </DialogHeader>

        {!success && (modalPayload.productName || modalPayload.modelConfig || modalPayload.originUrl) && (
          <div className="border border-signal/30 bg-surface-elevated/40 p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
              Configured Quotation Context
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {modalPayload.productName && (
                <p className="font-display text-sm uppercase text-foreground">{modalPayload.productName}</p>
              )}
              {modalPayload.modelConfig && (
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold text-signal">
                  {modalPayload.modelConfig}
                </span>
              )}
            </div>
            {modalPayload.originUrl && (
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                Originating Path: {modalPayload.originUrl}
              </p>
            )}
          </div>
        )}

        {success ? (
          <div className="py-8 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex size-14 items-center justify-center rounded-md bg-signal text-signal-foreground shadow-md">
              <Check size={28} />
            </div>
            <h3 className="mt-5 font-display text-2xl uppercase tracking-tight sm:text-3xl">
              Quotation Request Received
            </h3>
            <p className="mt-3 text-xs leading-6 text-muted-foreground max-w-lg mx-auto">
              Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. Your engineering quotation request has been routed to our commercial applications desk. An itemized proposal will be delivered to <span className="font-semibold text-foreground">{formData.email}</span>.
            </p>

            {isDuplicate && (
              <p className="mt-3 text-xs text-signal font-mono bg-signal/10 border border-signal/30 p-2 rounded">
                Note: An existing quote request under this email address was previously acknowledged.
              </p>
            )}

            {ticketKey && (
              <div className="mt-4 inline-flex items-center gap-2 rounded border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-mono text-signal">
                <span className="font-bold">Jira Ticket Reference:</span> {ticketKey}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                className="rounded-md bg-signal text-signal-foreground hover:bg-signal/90 font-bold uppercase text-xs h-11 px-6"
                onClick={handleReset}
              >
                Done
              </Button>
              <Button
                variant="outline"
                className="rounded-md border-border font-bold uppercase text-xs h-11 px-5"
                onClick={handleWhatsApp}
              >
                <MessageSquare size={14} className="mr-1.5 text-signal" />
                Chat with Sales on WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            onFocusCapture={handleFormFocus}
            data-clarity-mask="true"
            className="mt-4 space-y-4"
          >
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: CONTACT DETAILS */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name *
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Marcus Vance"
                      className="mt-1.5 h-11 rounded-md border-input bg-background text-sm"
                    />
                  </label>

                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Company Name *
                    <Input
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Precision Robotics Corp"
                      className="mt-1.5 h-11 rounded-md border-input bg-background text-sm"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Business Email *
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="m.vance@company.com"
                      className="mt-1.5 h-11 rounded-md border-input bg-background text-sm"
                    />
                  </label>

                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Phone with Country Code
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210 / +1 (555) 012-3456"
                      className="mt-1.5 h-11 rounded-md border-input bg-background text-sm"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Engineering Job Role
                    <select
                      value={formData.jobRole}
                      onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                      className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Automation / Controls Engineer</option>
                      <option>Mechanical Design Engineer</option>
                      <option>Robotics System Integrator</option>
                      <option>Procurement / Sourcing Specialist</option>
                      <option>Plant & Operations Manager</option>
                      <option>CTO / Engineering Director</option>
                      <option>R&D Academic Researcher</option>
                    </select>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 rounded-md bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90 px-6 text-xs flex items-center gap-1.5"
                  >
                    <span>Continue to Technical Specs</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: ENGINEERING REQUIREMENTS */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Workflow Mode Selector */}
                <div className="flex rounded-md border border-border p-1 bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rfqMode: "direct" })}
                    className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                      formData.rfqMode === "direct"
                        ? "bg-signal text-signal-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Direct Component Sizing
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rfqMode: "assisted" })}
                    className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                      formData.rfqMode === "assisted"
                        ? "bg-signal text-signal-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Help Me Determine Requirements
                  </button>
                </div>

                {formData.rfqMode === "assisted" ? (
                  /* ASSISTED REQUIREMENTS DETERMINATION WIZARD */
                  <div className="space-y-3.5 rounded-md border border-signal/40 bg-surface-elevated/40 p-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
                        Guided Application Sizing Assistant
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        INDUS Engineering Intake
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Primary Production Task *
                        <select
                          value={formData.assistedTask}
                          onChange={(e) => setFormData({ ...formData, assistedTask: e.target.value })}
                          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-signal"
                        >
                          <option>High-Speed Pick & Place Assembly</option>
                          <option>CNC Machine & Press Brake Tending</option>
                          <option>Precision Dispensing / Laser Welding</option>
                          <option>Heavy Palletizing & End-of-Line Packing</option>
                          <option>Autonomous Mobile Robot (AGV/AMR) Transport</option>
                          <option>Sub-Millimeter Inspection & Metrology</option>
                        </select>
                      </label>

                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Target Payload Tier *
                        <select
                          value={formData.assistedPayloadTier}
                          onChange={(e) => setFormData({ ...formData, assistedPayloadTier: e.target.value })}
                          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-signal"
                        >
                          <option>Under 5 kg (Micro / Lightweight)</option>
                          <option>5 to 15 kg (Medium Payloads)</option>
                          <option>16 to 50 kg (Heavy Assembly / Cobot)</option>
                          <option>50 to 120 kg (High Payload Industrial)</option>
                          <option>Over 120 kg (Heavy Machining & Decking)</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Target Cycle / Takt Time
                        <select
                          value={formData.assistedCycleTime}
                          onChange={(e) => setFormData({ ...formData, assistedCycleTime: e.target.value })}
                          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-signal"
                        >
                          <option>&lt; 1.5 seconds (Ultra-Fast Cycle)</option>
                          <option>2 to 5 seconds (Standard Automated Takt)</option>
                          <option>6 to 15 seconds (Heavy Material Handling)</option>
                          <option>&gt; 15 seconds (Continuous Process / Dispense)</option>
                        </select>
                      </label>

                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Required Stroke / Working Reach
                        <select
                          value={formData.assistedEnvelope}
                          onChange={(e) => setFormData({ ...formData, assistedEnvelope: e.target.value })}
                          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-signal"
                        >
                          <option>&lt; 500 mm (Compact Benchtop)</option>
                          <option>500 to 1200 mm (Standard Machine Envelope)</option>
                          <option>1200 to 2500 mm (Expanded Workcell Reach)</option>
                          <option>&gt; 2500 mm (Long-Stroke Linear Axis / Rail)</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Operating Environment
                        <select
                          value={formData.assistedEnvironment}
                          onChange={(e) => setFormData({ ...formData, assistedEnvironment: e.target.value })}
                          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-signal"
                        >
                          <option>Clean, dry indoor workshop / standard IP54</option>
                          <option>Washdown / High moisture / IP65-IP67</option>
                          <option>Foundry / High heat / Heavy particulate</option>
                          <option>Cleanroom ISO Class 5/7 (Semiconductor/Med)</option>
                          <option>Explosive Atmosphere / ATEX Zone 1/2</option>
                        </select>
                      </label>

                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Plant Fieldbus Standard
                        <select
                          value={formData.assistedPlantFieldbus}
                          onChange={(e) => setFormData({ ...formData, assistedPlantFieldbus: e.target.value })}
                          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-signal"
                        >
                          <option>EtherCAT (Real-time Industrial Ethernet)</option>
                          <option>PROFINET / Siemens TIA Portal</option>
                          <option>EtherNet/IP / Rockwell Allen-Bradley</option>
                          <option>CANopen / Low Voltage Mobile DC</option>
                          <option>Discrete Digital I/O / Hardwired</option>
                          <option>Recommend Optimal Architecture</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* DIRECT SPECIFICATION MODE */
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Component / System Category *
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                      </label>

                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Specific Product or Model Class
                        <Input
                          value={formData.product}
                          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                          placeholder="e.g. 6-Axis Robot, Harmonic Reducer 40:1"
                          className="mt-1.5 h-11 rounded-md border-input bg-background text-sm"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Target Industry
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {INDUSTRIES.map((ind) => (
                            <option key={ind}>{ind}</option>
                          ))}
                        </select>
                      </label>

                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Required Quantity / Volume
                        <select
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option>1-5 units (Prototype / Pilot)</option>
                          <option>6-25 units (Machine Build Batch)</option>
                          <option>26-100 units (Standard OEM Production)</option>
                          <option>100+ units / Annum (High Volume OEM)</option>
                        </select>
                      </label>
                    </div>

                    {/* Kinematic Slices */}
                    <div className="rounded-md border border-border/80 bg-muted/20 p-3.5 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-signal">
                        Target Motion Slices (Optional)
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Payload / Load (kg)
                          <Input
                            value={formData.payloadKg}
                            onChange={(e) => setFormData({ ...formData, payloadKg: e.target.value })}
                            placeholder="e.g. 20 kg"
                            className="mt-1 h-9 rounded-md text-xs bg-background"
                          />
                        </label>
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Reach / Stroke (mm)
                          <Input
                            value={formData.reachOrStroke}
                            onChange={(e) => setFormData({ ...formData, reachOrStroke: e.target.value })}
                            placeholder="e.g. 1400 mm"
                            className="mt-1 h-9 rounded-md text-xs bg-background"
                          />
                        </label>
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Torque / Speed
                          <Input
                            value={formData.torqueOrSpeed}
                            onChange={(e) => setFormData({ ...formData, torqueOrSpeed: e.target.value })}
                            placeholder="e.g. 120 Nm / 2 m/s"
                            className="mt-1 h-9 rounded-md text-xs bg-background"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Category-Specific Engineering Questions */}
                    {formData.category.includes("Actuator") && (
                      <div className="rounded-md border border-border/80 bg-surface-elevated/40 p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-signal">
                          Actuator Mechanical Configuration
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Mounting Orientation
                            <select
                              value={formData.actuatorOrientation}
                              onChange={(e) => setFormData({ ...formData, actuatorOrientation: e.target.value })}
                              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                            >
                              <option>Horizontal (Thrust against Friction)</option>
                              <option>Vertical Z-Axis (Requires Holding Brake)</option>
                              <option>Inverted / Gantry Cantilever</option>
                            </select>
                          </label>
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Screw Lead Preference
                            <select
                              value={formData.actuatorLead}
                              onChange={(e) => setFormData({ ...formData, actuatorLead: e.target.value })}
                              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                            >
                              <option>5 mm Lead (High Thrust / Low Speed)</option>
                              <option>10 mm Lead (Standard Precision)</option>
                              <option>20 mm Lead (High Velocity Dynamic)</option>
                              <option>Belt Drive (Long Stroke &gt; 2 m)</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    )}

                    {formData.category.includes("Reducer") && (
                      <div className="rounded-md border border-border/80 bg-surface-elevated/40 p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-signal">
                          Gearbox Precision Requirements
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Target Reduction Ratio
                            <select
                              value={formData.reducerRatio}
                              onChange={(e) => setFormData({ ...formData, reducerRatio: e.target.value })}
                              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                            >
                              <option>30:1 Ratio</option>
                              <option>50:1 Ratio</option>
                              <option>80:1 Ratio</option>
                              <option>100:1 Ratio</option>
                              <option>120:1 Ratio</option>
                              <option>Custom Engineering Ratio</option>
                            </select>
                          </label>
                          <label className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Allowable Backlash
                            <select
                              value={formData.reducerBacklash}
                              onChange={(e) => setFormData({ ...formData, reducerBacklash: e.target.value })}
                              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                            >
                              <option>&lt; 1.0 arcmin (Zero-Backlash Grade)</option>
                              <option>1.0 to 3.0 arcmin (Precision Grade)</option>
                              <option>&lt; 5.0 arcmin (Standard Industrial)</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    )}

                    {(formData.category.includes("Arm") || formData.category.includes("Robot")) && (
                      <div className="rounded-md border border-border/80 bg-surface-elevated/40 p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-signal">
                          Robotic Safety & Cell Enclosure
                        </p>
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          Safety Interlock Architecture
                          <select
                            value={formData.robotSafety}
                            onChange={(e) => setFormData({ ...formData, robotSafety: e.target.value })}
                            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                          >
                            <option>Standard Fenced Cell (High Speed / Interlocked Light Curtains)</option>
                            <option>Collaborative (ISO/TS 15066 Power &amp; Force Limiting / Fence-free)</option>
                            <option>Hybrid Dual-Speed Cell (Laser Scanner Zone Switching)</option>
                          </select>
                        </label>
                      </div>
                    )}

                    {formData.category.includes("Wheel") && (
                      <div className="rounded-md border border-border/80 bg-surface-elevated/40 p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-signal">
                          Mobile Base Specifications
                        </p>
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          Total Gross Vehicle Weight (GVW) Loaded
                          <select
                            value={formData.wheelGrossWeight}
                            onChange={(e) => setFormData({ ...formData, wheelGrossWeight: e.target.value })}
                            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                          >
                            <option>Under 500 kg (Light AMR / Delivery Cart)</option>
                            <option>500 to 1200 kg AGV Loaded (Standard Pallet)</option>
                            <option>1200 to 3000 kg (Heavy Duty Forklift / Tugger)</option>
                            <option>Over 3000 kg (Automotive Body Skid Carrier)</option>
                          </select>
                        </label>
                      </div>
                    )}

                    {formData.category.includes("Control") && (
                      <div className="rounded-md border border-border/80 bg-surface-elevated/40 p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-signal">
                          Motion Control Axis Capacity
                        </p>
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          Required Synchronized Axes
                          <select
                            value={formData.controlSyncAxes}
                            onChange={(e) => setFormData({ ...formData, controlSyncAxes: e.target.value })}
                            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-xs"
                          >
                            <option>2 to 4 Axes (Gantry / Cartesian Station)</option>
                            <option>6-Axis Coordinated Motion (Articulated Arm)</option>
                            <option>8+ Axes (Dual Arm / Robot on Rail / External Positioner)</option>
                            <option>16+ Axes (Complete Cell Master Controller)</option>
                          </select>
                        </label>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Project Stage & Timeline
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {TIMELINES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-11 rounded-md border-border font-bold uppercase text-xs px-4"
                  >
                    <ArrowLeft size={14} className="mr-1" /> Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 rounded-md bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90 px-6 text-xs flex items-center gap-1.5"
                  >
                    <span>Continue to Project Scope</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: ADDITIONAL DETAILS & SUBMIT */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Project Description & Sizing Constraints *
                  <Textarea
                    required
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Describe parts handled, cycle duty cycle, mounting envelope, repeatability needs, or existing machine controller..."
                    className="mt-1.5 rounded-md border-input bg-background text-sm"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Preferred Fieldbus / Control Protocol
                    <select
                      value={formData.fieldbus}
                      onChange={(e) => setFormData({ ...formData, fieldbus: e.target.value })}
                      className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>EtherCAT (Deterministic Motion)</option>
                      <option>PROFINET / Siemens PLC</option>
                      <option>EtherNet/IP / Rockwell Allen-Bradley</option>
                      <option>CANopen / Low-Voltage DC</option>
                      <option>Modbus TCP / Discrete I/O</option>
                      <option>To be determined by INDUS engineers</option>
                    </select>
                  </label>

                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Preferred Delivery Format
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Email & Itemized Commercial PDF</option>
                      <option>Technical Phone Consultation & BOM Review</option>
                      <option>WhatsApp Instant PDF Quotation</option>
                      <option>Video Conference (Google Meet / Teams)</option>
                    </select>
                  </label>
                </div>

                {/* Consent & Privacy Notice */}
                <div className="rounded-md border border-border/60 bg-muted/10 p-3 text-xs text-muted-foreground">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-border text-signal focus:ring-signal"
                    />
                    <span className="text-[11px] leading-4 text-muted-foreground">
                      I confirm that the specifications provided represent genuine engineering or procurement requirements. INDUS maintains strict non-disclosure compliance for all shared client drawings.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col gap-2 pt-2 sm:flex-row items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-11 rounded-md border-border font-bold uppercase text-xs px-4 w-full sm:w-auto"
                  >
                    <ArrowLeft size={14} className="mr-1" /> Back
                  </Button>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleWhatsApp}
                      className="h-11 rounded-md border-border font-bold uppercase text-xs px-4"
                    >
                      <MessageSquare size={14} className="mr-1.5 text-signal" />
                      WhatsApp
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading || !formData.consent}
                      className="h-11 flex-1 sm:flex-none rounded-md bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90 px-6 text-xs flex items-center justify-center gap-1.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="mr-1.5 animate-spin" /> Transmitting RFQ...
                        </>
                      ) : (
                        <>
                          Submit Quote Request <ArrowRight size={14} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Have full CAD files or custom OEM robotic machinery specifications?
                  </p>
                  <Link
                    to="/contact/engineering-enquiry"
                    onClick={handleReset}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
                  >
                    Complete Detailed 7-Section Engineering Enquiry →
                  </Link>
                </div>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
