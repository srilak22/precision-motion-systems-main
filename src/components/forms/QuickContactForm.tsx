import React, { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, Loader2, AlertCircle, Send, Calendar, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJiraTask } from "@/lib/jira";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const INTEREST_OPTIONS = [
  "6-Axis Articulated Robots",
  "SCARA Assembly Robots",
  "Cartesian & Linear Gantries",
  "Precision Ball Screws & Actuators",
  "Delta High-Speed Pick & Place",
  "Welding & Material Handling Automation",
  "Custom Industrial Motion Systems",
];

export function QuickContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [projectKey, setProjectKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    interest: INTEREST_OPTIONS[0],
    requirements: "",
    preferredContact: "Email",
  });

  const handleFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence("form_start", "Direct Contact Form", "User focused on direct contact form");
      trackClarityEvent("form_start");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.fullName.trim().length < 2) {
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

    if (formData.requirements.trim().length < 5) {
      setErrorMessage("Please describe your application or motion requirements.");
      return;
    }

    setLoading(true);

    try {
      trackDigitalPresence(
        "form_submit",
        "Direct Contact Form",
        `Submitting inquiry for ${formData.company} (${formData.interest})`,
      );

      const ytAttr = getYouTubeAttribution();

      const result = await createJiraTask({
        data: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim(),
          product: formData.interest,
          topic: formData.interest,
          requirements: formData.requirements.trim(),
          type: "Direct Website Contact Enquiry",
          preferredContact: formData.preferredContact,
          labels: ["website-contact", "direct-lead", "motion-systems"],
          attribution: ytAttr ?? undefined,
        },
      });

      if (result && result.success) {
        if (result.issueKey || result.jiraKey) {
          setTicketKey(result.issueKey || result.jiraKey || null);
        }
        if (result.projectKey) {
          setProjectKey(result.projectKey);
        }
        if (result.duplicate) {
          setIsDuplicate(true);
        }

        trackDigitalPresence(
          "lead_submit_success",
          "Direct Contact Form",
          `Ticket: ${result.issueKey || "Created"} | Sheet: Synced`,
        );
        trackClarityEvent("contact_form_success");
        setSuccess(true);
      } else {
        throw new Error(result?.message || "Transmission failed. Please retry.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please check network.";
      trackDigitalPresence("lead_submit_failure", "Direct Contact Form", msg);
      trackClarityEvent("contact_form_error");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      interest: INTEREST_OPTIONS[0],
      requirements: "",
      preferredContact: "Email",
    });
    setSuccess(false);
    setTicketKey(null);
    setErrorMessage(null);
  };

  if (success) {
    return (
      <div className="border border-signal/40 bg-card p-8 sm:p-12 text-center animate-in fade-in duration-300">
        <div className="mx-auto flex size-14 items-center justify-center bg-signal text-signal-foreground">
          <Check size={32} />
        </div>
        <h3 className="mt-5 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          Enquiry Transmitted Successfully
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
          Thank you, <span className="font-semibold text-foreground">{formData.fullName}</span>. Your enquiry
          has been synchronized into our engineering dealflow pipeline in real time. An application engineer will review your
          specifications and follow up via <span className="font-semibold text-foreground">{formData.preferredContact}</span>.
        </p>

        {ticketKey && (
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 border border-signal/40 bg-signal/10 px-6 py-3 font-mono text-xs sm:text-sm text-signal">
            <span className="font-bold uppercase tracking-wider">Jira Ticket Reference:</span>
            <span className="font-bold">{ticketKey}</span>
            {projectKey && (
              <span className="border-l border-signal/40 pl-3 text-[11px] uppercase tracking-widest text-signal/80">
                Project [{projectKey}]
              </span>
            )}
          </div>
        )}

        {isDuplicate && (
          <p className="mt-3 text-xs text-signal font-mono">
            Notice: An active enquiry with these contact details was previously registered.
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-signal" />
          <span>Synchronized with Google Sheets & Jira Lead Desk</span>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-none border-border font-bold uppercase text-xs"
          >
            Submit Another Specification
          </Button>
          <Button
            asChild
            className="rounded-none bg-signal font-bold uppercase text-xs text-signal-foreground hover:bg-signal/90"
          >
            <Link to="/book-consultation">
              <Calendar size={13} className="mr-1.5" /> Book Consultation Slot
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-6 sm:p-10 shadow-lg">
      <div className="border-b border-border/60 pb-6">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-signal animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-[.25em] text-signal">
            Direct Engineering Enquiry
          </p>
        </div>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-foreground">
          Send Us Your Project Requirements
        </h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          Connect directly with our automation sizing desk. Submissions automatically synchronize to our Jira dealflow queue
          and engineering records sheet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" onFocus={handleFocus}>
        {errorMessage && (
          <div className="flex items-start gap-3 border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Full Name <span className="text-signal">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Dr. Rajesh Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="rounded-none border-border bg-background text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Business Email <span className="text-signal">*</span>
            </label>
            <Input
              required
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-none border-border bg-background text-sm font-sans"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Company / Organization <span className="text-signal">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Precision Automation Labs"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="rounded-none border-border bg-background text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Phone / WhatsApp Number
            </label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="rounded-none border-border bg-background text-sm font-sans"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Product & Technology Category
            </label>
            <select
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              className="w-full h-10 border border-border bg-background px-3 text-xs sm:text-sm font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-signal"
            >
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
              Preferred Contact Channel
            </label>
            <select
              value={formData.preferredContact}
              onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
              className="w-full h-10 border border-border bg-background px-3 text-xs sm:text-sm font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="Email">Email Communication</option>
              <option value="Phone">Phone Call</option>
              <option value="WhatsApp">WhatsApp Message</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
            Technical Requirements, Sizing Constraints & Scope <span className="text-signal">*</span>
          </label>
          <Textarea
            required
            rows={4}
            placeholder="Outline payload targets, cycle times, stroke length, operating environment, or part geometry..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="rounded-none border-border bg-background text-sm font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-signal" /> 24-hr engineering response
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-signal" /> NDA protected
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 rounded-none bg-signal px-8 font-bold uppercase text-xs tracking-wider text-signal-foreground hover:bg-signal/90"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Transmitting to Jira & Sheets...
              </>
            ) : (
              <>
                <Send size={13} className="mr-2" />
                Submit Engineering Enquiry
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
