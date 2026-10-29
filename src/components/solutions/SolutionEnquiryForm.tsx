import React, { useState, type FormEvent } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJiraTask } from "@/lib/jira";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { getLinkedInAttribution } from "@/integrations/linkedin-tracking/attribution";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";

interface SolutionEnquiryFormProps {
  solutionId: string;
  solutionTitle: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function SolutionEnquiryForm({
  solutionId,
  solutionTitle,
}: SolutionEnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    jobTitle: "",
    industry: "Automotive",
    applicationDescription: "",
    existingEquipment: "",
    productionRequirements: "",
    desiredTimeline: "Concept (1–3 months)",
  });

  const handleFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence("form_start", `Solution Enquiry: ${solutionTitle}`, `/solutions/${solutionId}`);
      trackClarityEvent("form_start");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid business email address.");
      return;
    }

    if (formData.company.trim().length < 2) {
      setErrorMessage("Please enter your company or organization name.");
      return;
    }

    if (formData.applicationDescription.trim().length < 10) {
      setErrorMessage("Please describe your application or technical requirements in at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const ytAttr = getYouTubeAttribution() || undefined;
      const liAttr = getLinkedInAttribution() || undefined;

      const comprehensiveRequirements = [
        `Solution Area: ${solutionTitle} (/solutions/${solutionId})`,
        `Job Title: ${formData.jobTitle || "Not specified"}`,
        `Target Industry: ${formData.industry}`,
        `Existing Equipment / PLCs: ${formData.existingEquipment || "None specified"}`,
        `Production Goals & Takt: ${formData.productionRequirements || "Not specified"}`,
        `Project Timeline: ${formData.desiredTimeline}`,
        `Application Scope: ${formData.applicationDescription}`,
      ].join("\n");

      const res = await createJiraTask({
        data: {
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          product: `${solutionTitle} System Solution`,
          category: "Turnkey Engineering Solutions",
          originUrl: `/solutions/${solutionId}`,
          requirements: comprehensiveRequirements,
          projectStage: formData.desiredTimeline,
          attribution: ytAttr,
          linkedinAttribution: liAttr,
          labels: ["solutions-enquiry", solutionId],
        },
      });

      if (res.success) {
        setSuccess(true);
        setTicketKey(res.issueKey || res.jiraKey || null);
        trackDigitalPresence("form_submit", `Solution Enquiry: ${solutionTitle}`, `/solutions/${solutionId}`);
        trackClarityEvent("form_submission_success");
      } else {
        setErrorMessage(
          res.message || "Failed to submit enquiry. Please retry or contact our engineering desk via WhatsApp."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center text-emerald-900 shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-emerald-950">
          Engineering Enquiry Received
        </h3>
        <p className="mt-2 text-sm text-emerald-800 max-w-lg mx-auto">
          Thank you for detailing your {solutionTitle} requirements. 
          An INDUS application engineer will review your operating parameters and respond within one business day.
        </p>

        {ticketKey && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3.5 py-1.5 font-mono text-xs font-bold text-emerald-800 shadow-xs">
            <FileCheck size={14} className="text-emerald-600" />
            <span>Reference Tracking ID: {ticketKey}</span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                jobTitle: "",
                industry: "Automotive",
                applicationDescription: "",
                existingEquipment: "",
                productionRequirements: "",
                desiredTimeline: "Concept (1–3 months)",
              });
            }}
            className="rounded-lg border-emerald-300 bg-white text-xs font-bold text-emerald-800 hover:bg-emerald-50"
          >
            Submit Another Specification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
            Application Engineering Review
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF]">
            <ShieldCheck size={11} />
            <span>Direct Jira Queue</span>
          </span>
        </div>
        <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
          Discuss Your {solutionTitle} Project
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Provide your target parameters below. Our engineers evaluate kinematic feasibility, cycle takt, and interface boundaries.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Row 1: Name & Business Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="h-10 text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Business Email <span className="text-red-500">*</span>
            </label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@company.com"
              className="h-10 text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
            />
          </div>
        </div>

        {/* Row 2: Company & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Company / Plant <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Acme Industrial Ltd"
              className="h-10 text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="h-10 text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
            />
          </div>
        </div>

        {/* Row 3: Industry & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Industry Sector
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:border-[#155EEF] focus:outline-none"
            >
              <option value="Automotive">Automotive &amp; EV</option>
              <option value="Electronics">Electronics &amp; Semiconductor</option>
              <option value="Aerospace">Aerospace &amp; Defense</option>
              <option value="Metal Machining">Metal Machining &amp; CNC</option>
              <option value="Warehouse">Warehouse &amp; Logistics</option>
              <option value="Medical">Medical Devices &amp; Cleanroom</option>
              <option value="Packaging">Packaging &amp; Consumer Goods</option>
              <option value="Other Industrial">Other Industrial Manufacturing</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Desired Project Timeline
            </label>
            <select
              value={formData.desiredTimeline}
              onChange={(e) => setFormData({ ...formData, desiredTimeline: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:border-[#155EEF] focus:outline-none"
            >
              <option value="Immediate (< 1 month)">Immediate (Urgent Retrofit / Replacement)</option>
              <option value="Concept (1–3 months)">Engineering Feasibility (1–3 months)</option>
              <option value="Budgetary (3–6 months)">Budgetary Planning (3–6 months)</option>
              <option value="Future Capex (6+ months)">Future Capex Expansion (6+ months)</option>
            </select>
          </div>
        </div>

        {/* Application Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Application Description &amp; Technical Requirements <span className="text-red-500">*</span>
          </label>
          <Textarea
            required
            rows={3}
            value={formData.applicationDescription}
            onChange={(e) => setFormData({ ...formData, applicationDescription: e.target.value })}
            placeholder="Describe the manufacturing process, workpiece mass/size, moving stroke, target takt time, or key mechanical constraints..."
            className="text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
          />
        </div>

        {/* Existing Equipment / PLC context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Existing Equipment / PLCs (Optional)
            </label>
            <Input
              value={formData.existingEquipment}
              onChange={(e) => setFormData({ ...formData, existingEquipment: e.target.value })}
              placeholder="e.g. Siemens S7-1500, Fanuc CNC, EtherCAT"
              className="h-10 text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Production Takt or Accuracy Goal
            </label>
            <Input
              value={formData.productionRequirements}
              onChange={(e) => setFormData({ ...formData, productionRequirements: e.target.value })}
              placeholder="e.g. 45 sec takt, ±0.03 mm repeatability"
              className="h-10 text-xs rounded-lg border-slate-200 focus:border-[#155EEF]"
            />
          </div>
        </div>
      </div>

      {/* Helpful submission note */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <HelpCircle size={13} className="text-slate-400 shrink-0" />
        <span>Submitting creates an authenticated lead ticket in our engineering evaluation queue.</span>
      </div>

      {/* Submit Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Button
          type="submit"
          disabled={loading}
          className="h-11 rounded-lg bg-[#155EEF] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1047BF] transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" />
              Routing to Application Engineer...
            </>
          ) : (
            <>
              <Send size={14} className="mr-2" />
              Submit Engineering Specification
            </>
          )}
        </Button>
        <span className="text-[11px] text-slate-400 font-mono">
          Response within 24h
        </span>
      </div>
    </form>
  );
}
