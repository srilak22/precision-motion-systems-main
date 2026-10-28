import React, { useState, type FormEvent } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Send,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJiraTask } from "@/lib/jira";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { companyConfig } from "@/data/config";
import type { NormalizedProductData } from "./types";

interface ProductEnquiryCtaProps {
  data: NormalizedProductData;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function ProductEnquiryCta({ data }: ProductEnquiryCtaProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  const [form, setForm] = useState({
    fullName: "",
    businessEmail: "",
    company: "",
    phone: "",
    productName: data.name,
    productId: data.id,
    modelVariant: data.modelCode,
    quantity: "1",
    applicationRequirements: "",
    fieldbusProtocol: "EtherCAT",
  });

  const handleFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence("form_start", "Product Page Enquiry Form", `Product: ${data.name}`);
      trackClarityEvent("form_start");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (form.fullName.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!isValidEmail(form.businessEmail)) {
      setErrorMessage("Please provide a valid business email address.");
      return;
    }
    if (form.company.trim().length < 2) {
      setErrorMessage("Please provide your company or institution name.");
      return;
    }

    setLoading(true);

    try {
      const result = await createJiraTask({
        data: {
          name: form.fullName.trim(),
          company: form.company.trim(),
          email: form.businessEmail.trim(),
          phone: form.phone.trim(),
          product: `${form.productName} [${form.modelVariant || data.id}]`,
          quantity: form.quantity || "1",
          requirements: `
Product ID: ${data.id}
Product Name: ${data.name}
Model / Configuration: ${form.modelVariant}
Category / Family: ${data.categoryTitle} • ${data.familyGroup}
Origin URL: ${window.location.href}

Application Requirements & Duty Cycle:
${form.applicationRequirements || "Standard sizing verification requested."}

Preferred Fieldbus: ${form.fieldbusProtocol}
          `.trim(),
          type: "Product Technical Enquiry",
          labels: ["product-detail-rfq", data.categorySlug, "sizing-verification"],
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
          "Product Page Enquiry Form",
          `Ticket: ${result.issueKey || "Created"} for ${data.name}`,
        );
        trackClarityEvent("lead_submit_success");
        trackClarityEvent("enquiry_submit");
        setLoading(false);
        setSuccess(true);
      } else {
        throw new Error(result?.message || "Failed to submit technical enquiry.");
      }
    } catch (err) {
      console.error("Product enquiry error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "We encountered a transmission failure. Please retry or contact our engineering desk via WhatsApp.";
      trackDigitalPresence("lead_submit_failure", "Product Page Enquiry Form", msg);
      trackClarityEvent("lead_submit_failure");
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "product",
        name: `${data.name} (${data.modelCode})`,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section id="engineering-enquiry" className="bg-[#FFFFFF] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="rounded-2xl border border-[#B2CCFF] bg-gradient-to-br from-[#F5F8FF] to-[#FFFFFF] p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                <ShieldCheck size={16} />
                <span>12. Engineering Consultation &amp; RFQ</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
                Need Help Selecting the Right Product?
              </h2>

              <p className="text-sm text-[#475467] leading-relaxed">
                Connect directly with an INDUS motion systems engineer to verify sizing calculations, evaluate thermal duty cycles, request 3D STEP models, or configure custom flange interfaces.
              </p>

              {/* Prefilled Product Card */}
              <div className="rounded-xl border border-[#E5EAF1] bg-white p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Selected Product:</span>
                  <span className="font-bold text-[#172033]">{data.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Product Identifier:</span>
                  <span className="font-mono font-bold text-[#155EEF]">{data.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Engineering Family:</span>
                  <span className="text-[#344054] font-medium">{data.familyGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Standard Conformance:</span>
                  <span className="text-[#344054]">{data.traceableStandard.split("/")[0]}</span>
                </div>
              </div>

              {/* Instant WhatsApp Option */}
              <div className="pt-2">
                <span className="block text-xs text-[#667085] mb-2 font-medium">
                  Need immediate sizing advice?
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="w-full h-11 border-[#86EFAC] bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] font-bold text-xs uppercase"
                >
                  <MessageSquare size={16} className="mr-2" /> Connect on WhatsApp Engineering Desk
                </Button>
              </div>

              <div className="pt-2 text-[11px] text-[#667085] space-y-1">
                <p>• Official NDA protected technical evaluation</p>
                <p>• 24 business hours standard proposal response</p>
                <p>• Factory direct engineering support &amp; CAD integration</p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5EAF1] p-6 sm:p-8 shadow-xs">
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                    <Check size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#172033]">
                    Enquiry Received Successfully
                  </h3>
                  <p className="text-sm text-[#475467] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-[#172033]">{form.fullName}</span>. An INDUS application engineer has been assigned to your request for <span className="font-semibold text-[#172033]">{data.name}</span>.
                  </p>
                  {ticketKey && (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#B2CCFF] bg-[#EFF6FF] px-4 py-2 font-mono text-xs font-bold text-[#155EEF]">
                      <span>Jira Reference:</span> {ticketKey}
                    </div>
                  )}
                  {isDuplicate && (
                    <p className="text-xs text-[#667085]">
                      Note: An existing enquiry with these contact details was previously registered.
                    </p>
                  )}
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSuccess(false);
                        setTicketKey(null);
                      }}
                      className="text-xs font-semibold"
                    >
                      Submit Another Technical Request
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} onFocus={handleFocus} className="space-y-4">
                  <div className="border-b border-[#E5EAF1] pb-3">
                    <h3 className="text-base font-bold text-[#172033]">
                      Request Official Quotation &amp; Application Verification
                    </h3>
                    <p className="text-xs text-[#667085]">
                      Prefilled with {data.name} specifications. Fill in your details below.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="rounded-lg border border-[#FECDCA] bg-[#FEF3F2] p-3 text-xs text-[#D92D20] flex items-start gap-2">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1: Name & Business Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#344054] mb-1">
                        Full Name <span className="text-[#D92D20]">*</span>
                      </label>
                      <Input
                        required
                        placeholder="e.g. Dr. Sarah Jenkins"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#344054] mb-1">
                        Business Email <span className="text-[#D92D20]">*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="name@company.com"
                        value={form.businessEmail}
                        onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 2: Company & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#344054] mb-1">
                        Company / Organization <span className="text-[#D92D20]">*</span>
                      </label>
                      <Input
                        required
                        placeholder="Company name"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#344054] mb-1">
                        Phone Number
                      </label>
                      <Input
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 3: Product Config & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#344054] mb-1">
                        Product &amp; Model Variant
                      </label>
                      <Input
                        value={`${form.productName} (${form.modelVariant})`}
                        onChange={(e) => setForm({ ...form, modelVariant: e.target.value })}
                        className="h-10 text-xs font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#344054] mb-1">
                        Estimated Qty
                      </label>
                      <Input
                        placeholder="1"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>

                  {/* Application Requirements */}
                  <div>
                    <label className="block text-xs font-semibold text-[#344054] mb-1">
                      Application Requirements &amp; Duty Cycle Details
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Describe target payload, cycle time, stroke, dynamic torque, ambient environment, or specific motor mounting requirements..."
                      value={form.applicationRequirements}
                      onChange={(e) => setForm({ ...form, applicationRequirements: e.target.value })}
                      className="text-xs resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" /> Transmitting Technical Request...
                      </>
                    ) : (
                      <>
                        <Send size={15} className="mr-2" /> Submit Engineering Enquiry
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
