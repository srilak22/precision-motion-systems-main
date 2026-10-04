import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, MessageSquare, Loader2 } from "lucide-react";
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
import { useModals } from "./ModalContext";
import { trackClarityEvent } from "@/analytics/clarity";

export function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { modalPayload } = useModals();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: modalPayload.productName || "",
    quantity: "",
    timeline: "Prototype / 1-3 Months",
    requirements: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Jira task
      const result = await createJiraTask({
        data: {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          product: formData.product,
          quantity: formData.quantity,
          requirements: `Timeline: ${formData.timeline}\n\nRequirements / BOM Notes:\n${formData.requirements}`,
          type: "Commercial RFQ",
          labels: ["rfq", "quote-request"],
        },
      });

      console.log("Jira task created:", result);
      if (result && "issueKey" in result && result.issueKey) {
        setTicketKey(result.issueKey);
      }

      trackClarityEvent("request_quote");
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to create Jira task:", error);
      trackClarityEvent("request_quote");
      setLoading(false);
      setSuccess(true);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setLoading(false);
    setTicketKey(null);
    onClose();
  };

  const handleWhatsApp = () => {
    trackClarityEvent("whatsapp_click");
    window.open(
      companyConfig.getWhatsAppUrl({
        type: modalPayload.productName ? "product" : "general",
        name: modalPayload.productName,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto rounded-none border border-border bg-card p-6 shadow-2xl sm:p-8">
        <DialogHeader>
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-signal">
            Commercial Proposal
          </p>
          <DialogTitle className="font-display text-2xl uppercase sm:text-3xl">
            Request an Engineering Quotation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Share your motion requirements or system BOM. Our technical sales engineers will verify
            sizing calculations and provide formal commercial pricing.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center bg-signal text-signal-foreground">
              <Check size={28} />
            </div>
            <h3 className="mt-5 font-display text-3xl uppercase">Quotation Request Received</h3>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Thank you, {formData.name || "Customer"}. Your commercial quote request has been
              transmitted. Our technical sales team will review sizing feasibility and provide an
              itemized commercial proposal.
            </p>
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
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-clarity-mask="true" className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Full Name *
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>

              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Company Name *
                <Input
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Precision Robotics Corp"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Business Email *
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="m.vance@company.com"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>

              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Product / Technology Domain
                <Input
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g. 6-Axis Arms, Harmonic Reducers"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>

              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Target Quantity
                <Input
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 10 units / Production batch"
                  className="mt-1.5 h-11 rounded-none border-input bg-background text-sm"
                />
              </label>
            </div>

            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Technical Requirements & Sizing Parameters *
              <Textarea
                required
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Include torque, payload, speed, cycle duty cycle, fieldbus requirements, or delivery schedule..."
                className="mt-1.5 rounded-none border-input bg-background text-sm"
              />
            </label>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Transmitting Request...
                  </>
                ) : (
                  <>
                    Submit Quote Request <ArrowRight size={14} className="ml-1.5" />
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
                WhatsApp Us
              </Button>
            </div>

            <div className="border-t border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Have complex CAD drawings or custom OEM machine specs?
              </p>
              <Link
                to="/contact/engineering-enquiry"
                onClick={handleReset}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-signal hover:underline"
              >
                Complete Detailed 7-Section Engineering Form →
              </Link>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
