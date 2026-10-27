import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, MessageSquare, Wrench, Loader2, AlertCircle } from "lucide-react";
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
import { useModals } from "./ModalContext";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function EngineerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { modalPayload } = useModals();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);
  const formStartedRef = React.useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    topic: modalPayload.categoryName || "Application Engineering & Feasibility",
    industry: "",
    projectStage: "Concept & Feasibility",
    timeline: "1–3 Months",
    specs: "",
    description: modalPayload.initialMessage || "",
  });

  // Sync state when modal is opened or modalPayload changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        topic: modalPayload.categoryName || prev.topic,
        description: modalPayload.initialMessage || prev.description,
      }));
    }
  }, [isOpen, modalPayload.categoryName, modalPayload.initialMessage]);

  const handleFormFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence("form_start", "Engineer Modal", "Started consultation form");
      trackClarityEvent("form_start");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side field validations
    if (formData.name.trim().length < 2) {
      trackDigitalPresence("form_validation_error", "Engineer Modal", "Name validation failure");
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }

    if (!isValidEmail(formData.email)) {
      trackDigitalPresence("form_validation_error", "Engineer Modal", "Email validation failure");
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please enter a valid business email address (e.g. name@company.com).");
      return;
    }

    if (formData.description.trim().length < 5) {
      trackDigitalPresence(
        "form_validation_error",
        "Engineer Modal",
        "Description validation failure",
      );
      trackClarityEvent("form_validation_error");
      setErrorMessage("Please provide brief details of your engineering challenge.");
      return;
    }

    setLoading(true);

    try {
      const projectContextParts = [
        formData.industry ? `Industry: ${formData.industry}` : null,
        formData.projectStage ? `Project Stage: ${formData.projectStage}` : null,
        formData.timeline ? `Expected Timeline: ${formData.timeline}` : null,
        formData.specs
          ? `Technical Specifications (Payload/Cycle Time): ${formData.specs.trim()}`
          : null,
      ].filter(Boolean);

      const requirementsText = [
        `Service / Topic: ${formData.topic}`,
        `Technical Challenge:\n${formData.description.trim()}`,
        projectContextParts.length > 0
          ? `Project Parameters:\n${projectContextParts.join("\n")}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n");

      const result = await createJiraTask({
        data: {
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          product: modalPayload.productName || formData.topic || "Engineering Consultation",
          category: modalPayload.categoryName,
          modelConfig: modalPayload.modelConfig,
          originUrl: modalPayload.originUrl,
          topic: formData.topic,
          quantity: "N/A",
          requirements: requirementsText + (modalPayload.originUrl ? `\n\nOrigin Page: ${modalPayload.originUrl}` : ""),
          type: "Engineering Consultation",
          labels: ["engineering-consultation", "engineering-services", "web-lead"],
          // Explicit attribution: reads from sessionStorage for same-session YouTube visitors.
          // Does not recover attribution across new tabs or incognito sessions.
          attribution: getYouTubeAttribution() ?? undefined,
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
          "Engineer Modal",
          `Ticket: ${result.issueKey || "Created"}`,
        );
        trackClarityEvent("lead_submit_success");
        trackClarityEvent("enquiry_submit");
        setLoading(false);
        setSuccess(true);
      } else {
        throw new Error(result?.message || "Engineering inquiry could not be dispatched.");
      }
    } catch (error) {
      console.error("Consultation submission error:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "We encountered a transmission failure. Please retry or contact us directly on WhatsApp.";
      trackDigitalPresence("lead_submit_failure", "Engineer Modal", msg);
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
    onClose();
  };

  const handleWhatsApp = () => {
    trackClarityEvent("whatsapp_click");
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto rounded-none border border-border bg-card p-6 shadow-2xl sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center bg-signal/15 text-signal">
              <Wrench size={14} />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
              Technical Consultation
            </p>
          </div>
          <DialogTitle className="mt-2 font-display text-2xl uppercase sm:text-3xl">
            Talk to an Application Engineer
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Connect directly with an INDUS robotics and motion control specialist. We assist with
            mechanical sizing, duty cycle thermal analysis, and fieldbus architecture design.
          </DialogDescription>
        </DialogHeader>

        {(modalPayload.productName || modalPayload.modelConfig || modalPayload.originUrl) && (
          <div className="border border-signal/30 bg-surface-elevated/40 p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal">
              Referenced Component / System
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {modalPayload.productName && (
                <p className="font-display text-base uppercase text-foreground">{modalPayload.productName}</p>
              )}
              {modalPayload.modelConfig && (
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold text-signal">
                  {modalPayload.modelConfig}
                </span>
              )}
            </div>
            {modalPayload.originUrl && (
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                Context URL: {modalPayload.originUrl}
              </p>
            )}
          </div>
        )}

        {success ? (
          <div className="py-10 text-center animate-in fade-in duration-150">
            <div className="mx-auto flex size-14 items-center justify-center bg-signal text-signal-foreground">
              <Check size={28} />
            </div>
            <h3 className="mt-5 font-display text-3xl uppercase">Consultation Scheduled</h3>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Thank you, {formData.name || "Engineer"}. Your technical consultation request has been
              received by our application engineering team. We will review your requirements and
              reach out via email or phone.
            </p>
            {isDuplicate && (
              <p className="mt-2 text-xs text-signal font-mono">
                Note: An existing consultation request with these details was already recorded.
              </p>
            )}
            {ticketKey && (
              <div className="mt-4 inline-flex items-center gap-2 border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-mono text-signal">
                <span className="font-bold">Jira Ticket Reference:</span> {ticketKey}
              </div>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                className="rounded-none bg-signal text-signal-foreground hover:bg-signal/90"
                onClick={handleReset}
              >
                Close
              </Button>
              <Button variant="outline" className="rounded-none" onClick={handleWhatsApp}>
                <MessageSquare size={14} className="mr-1.5" />
                Discuss on WhatsApp
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
                className="flex items-start gap-2 border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Your Name *
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. David Miller, PE"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>

              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Company / Organization *
                <Input
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Genesis Automation"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Engineering Email *
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="d.miller@company.com"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>

              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 345-6789"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>
            </div>

            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Engineering Service / Topic *
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="mt-1.5 flex h-11 w-full rounded-none border border-input bg-background px-3 text-sm focus:border-signal"
              >
                <optgroup label="Engineering Services Portfolio">
                  <option value="Application Engineering & Feasibility">
                    01: Application Engineering & Feasibility
                  </option>
                  <option value="Kinematic Subsystems & Joint Actuator Engineering">
                    02: Kinematic Subsystems & Joint Actuators
                  </option>
                  <option value="Robotic Workcells & Machine Tending">
                    03: Robotic Workcells & Machine Tending
                  </option>
                  <option value="Motion Control & Multi-Axis Synchronization">
                    04: Motion Control & Multi-Axis Synchronization
                  </option>
                  <option value="Safety, Compliance & Risk Engineering">
                    05: Safety, Compliance & Risk Engineering
                  </option>
                  <option value="Custom Robotics & Special-Purpose Machines">
                    06: Custom Robotics & Special-Purpose Machines
                  </option>
                  <option value="Lifecycle & Performance Optimization">
                    07: Lifecycle & Performance Optimization
                  </option>
                </optgroup>
                <optgroup label="Component & Architecture Focus">
                  <option value="Motion & Kinematics Sizing">Motion & Kinematics Sizing</option>
                  <option value="Precision Reducer Backlash & Life Calculations">
                    Precision Reducer Sizing & Calculations
                  </option>
                  <option value="Mobile Robotics AGV/AMR Wheel Selection">
                    Mobile Robotics AGV/AMR Wheel Selection
                  </option>
                  <option value="Articulated Robotic Arm Workcell Integration">
                    Articulated Arm Workcell Integration
                  </option>
                  <option value="Fieldbus Protocol Compatibility (EtherCAT / PROFINET)">
                    Fieldbus Protocol Compatibility
                  </option>
                  <option value="Custom OEM Actuator Development">
                    Custom OEM Actuator Development
                  </option>
                </optgroup>
              </select>
            </label>

            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Describe Your Technical Challenge *
              <Textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail your operating payload, reach, cycle time requirements, thermal considerations, mechanical interfaces, or control architecture..."
                className="mt-1.5 rounded-none border-input bg-background text-sm"
              />
            </label>

            {/* Optional Project Context Toggle */}
            <div className="border border-border/70 bg-muted/20 p-3">
              <button
                type="button"
                onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
                className="flex w-full items-center justify-between text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                <span>+ Add Project Specifications (Optional)</span>
                <span className="text-signal">{showTechnicalSpecs ? "Hide" : "Show"}</span>
              </button>

              {showTechnicalSpecs && (
                <div className="mt-3 space-y-3 pt-2 border-t border-border/50 animate-in fade-in duration-150">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Industry Sector
                      <Input
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. Automotive, Machining"
                        className="mt-1 h-9 rounded-none border-input bg-background text-xs"
                      />
                    </label>

                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Project Stage
                      <select
                        value={formData.projectStage}
                        onChange={(e) => setFormData({ ...formData, projectStage: e.target.value })}
                        className="mt-1 flex h-9 w-full rounded-none border border-input bg-background px-2 text-xs"
                      >
                        <option>Concept & Feasibility</option>
                        <option>Sizing & Component Selection</option>
                        <option>Detailed CAD Design</option>
                        <option>Integration / Retrofit</option>
                        <option>Production Optimization</option>
                      </select>
                    </label>

                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Target Timeline
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="mt-1 flex h-9 w-full rounded-none border border-input bg-background px-2 text-xs"
                      >
                        <option>Immediate (&lt; 1 Month)</option>
                        <option>1–3 Months</option>
                        <option>3–6 Months</option>
                        <option>6+ Months</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Known Constraints (Payload, Target Cycle Time, Repeatability)
                    <Input
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      placeholder="e.g. 25 kg payload, &lt; 8s cycle time, ±0.03 mm repeatability, 48V DC"
                      className="mt-1 h-9 rounded-none border-input bg-background text-xs"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Scheduling...
                  </>
                ) : (
                  <>
                    Request Consultation <ArrowRight size={14} className="ml-1.5" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleWhatsApp}
                className="rounded-none border-border"
              >
                <MessageSquare size={14} className="mr-1.5 text-signal" />
                WhatsApp an Engineer
              </Button>
            </div>

            <div className="border-t border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Have formal project requirements and spec sheets?
              </p>
              <Link
                to="/contact/engineering-enquiry"
                onClick={handleReset}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                Submit Full 7-Section Engineering Enquiry →
              </Link>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
