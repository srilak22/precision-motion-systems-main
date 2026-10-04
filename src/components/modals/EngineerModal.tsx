import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, MessageSquare, Wrench, Loader2 } from "lucide-react";
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

export function EngineerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { modalPayload } = useModals();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    topic: modalPayload.categoryName || "Motion & Kinematics Sizing",
    description: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createJiraTask({
        data: {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          product: modalPayload.productName || "Engineering Consultation",
          topic: formData.topic,
          quantity: "N/A",
          requirements: `Topic: ${formData.topic}\n\nTechnical Notes:\n${formData.description}`,
          type: "Engineering Consultation",
          labels: ["engineering-consultation", "applications"],
        },
      });
      if (result && "issueKey" in result && result.issueKey) {
        setTicketKey(result.issueKey);
      }
      trackClarityEvent("enquiry_submit");
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      trackClarityEvent("enquiry_submit");
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

        {success ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center bg-signal text-signal-foreground">
              <Check size={28} />
            </div>
            <h3 className="mt-5 font-display text-3xl uppercase">Consultation Scheduled</h3>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Thank you, {formData.name || "Engineer"}. Your technical consultation request has been
              assigned to a senior application engineer. We will review your challenge and reach out
              via email or phone.
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
                Discuss on WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-clarity-mask="true" className="mt-4 space-y-4">
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
              Consultation Topic / Application Focus
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="mt-1.5 flex h-11 w-full rounded-none border border-input bg-background px-3 text-sm focus:border-signal"
              >
                <option>Motion & Kinematics Sizing</option>
                <option>Precision Reducer Backlash & Life Calculations</option>
                <option>Mobile Robotics AGV/AMR Wheel Selection</option>
                <option>Articulated Robotic Arm Workcell Integration</option>
                <option>Fieldbus Protocol Compatibility (EtherCAT / PROFINET)</option>
                <option>Custom OEM Actuator Development</option>
              </select>
            </label>

            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Describe Your Engineering Challenge *
              <Textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail your operating payload, cycle time requirements, thermal considerations, mechanical interfaces, or control architecture..."
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
