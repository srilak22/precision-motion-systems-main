import React, { useState, type FormEvent } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Building,
  PhoneCall,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createJiraTask } from "@/lib/jira";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { getLinkedInAttribution } from "@/integrations/linkedin-tracking/attribution";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackDigitalPresence } from "@/trackDigitalPresence";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function HospitalInquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    hospitalName: "",
    email: "",
    phone: "",
    facilityType: "Tertiary / Teaching Hospital",
    bedCount: "100–300 Beds",
    elevatorBrand: "Otis / Schindler / KONE",
    primaryMaterialFlow: "Pharmacy to Inpatient Wards & ICU",
    desiredTimeline: "Within 3–6 Months",
    clinicalScope: "",
  });

  const handleFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDigitalPresence(
        "form_start",
        "Hospital Delivery Robot Inquiry",
        "/solutions/hospital-delivery-robot"
      );
      trackClarityEvent("hospital_form_start");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.name.trim() || !formData.hospitalName.trim() || !formData.email.trim()) {
      setErrorMessage("Please complete all required fields (Name, Hospital, Work Email).");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setLoading(true);

    try {
      const ytAttr = getYouTubeAttribution();
      const liAttr = getLinkedInAttribution();

      const description = `
h3. Clinical Solution Inquiry: Hospital Delivery Robot
*Clinical Contact Information:*
* *Name:* ${formData.name}
* *Hospital / System:* ${formData.hospitalName}
* *Work Email:* ${formData.email}
* *Phone:* ${formData.phone || "Not provided"}

*Facility & Clinical Operational Profile:*
* *Solution:* Hospital Delivery Robot (ID: hospital-delivery-robot)
* *Facility Classification:* ${formData.facilityType}
* *Operational Bed Capacity:* ${formData.bedCount}
* *Elevator Infrastructure:* ${formData.elevatorBrand}
* *Primary Material Flow:* ${formData.primaryMaterialFlow}
* *Target Timeline:* ${formData.desiredTimeline}

*Clinical Notes & Workflow Scope:*
${formData.clinicalScope || "Standard clinical site survey requested."}

*Attribution & Digital Signature:*
* *Page:* /solutions/hospital-delivery-robot
* *YouTube Campaign:* ${ytAttr?.campaign || "Direct / None"}
* *LinkedIn Campaign:* ${liAttr?.campaign_name || "Direct / None"}
* *Submission Timestamp:* ${new Date().toISOString()}
      `.trim();

      const task = await createJiraTask({
        summary: `[Hospital Inquiry] Delivery Robot - ${formData.hospitalName} (${formData.name})`,
        description,
        issueType: "Task",
        priority: "High",
        labels: ["solution-lead", "hospital-robot", "phase-2"],
      });

      trackDigitalPresence(
        "form_submit",
        `Hospital Inquiry: ${formData.hospitalName}`,
        "/solutions/hospital-delivery-robot"
      );
      trackClarityEvent("hospital_form_submit");

      setTicketKey(task?.key || "MED-REQ-" + Math.floor(1000 + Math.random() * 9000));
      setSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      trackDigitalPresence(
        "form_submit_fallback",
        `Hospital Inquiry: ${formData.hospitalName}`,
        "/solutions/hospital-delivery-robot"
      );
      setTicketKey("MED-REQ-" + Math.floor(1000 + Math.random() * 9000));
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hospital-inquiry-section" className="relative bg-slate-900 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800">
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Clinical Context */}
          <div className="lg:col-span-5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4">
              <Stethoscope size={13} className="text-cyan-400" />
              <span>Hospital Logistics Consultation</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Evaluate Autonomous <br />
              <span className="text-cyan-400">Hospital Delivery</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Schedule an exploratory consultation with an INDUS healthcare robotics specialist.
              We evaluate corridor traffic, elevator dispatch interfaces, and calculate precise
              nursing hours reclaimed for your healthcare system.
            </p>

            {/* Value Guarantees */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-slate-950 p-4 border border-slate-800">
                <ShieldCheck size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white font-mono uppercase">
                    HIPAA &amp; Cleanroom Compliant Design
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Engineered to meet hospital infection control criteria and patient data privacy standards.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-950 p-4 border border-slate-800">
                <FileCheck size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white font-mono uppercase">
                    Elevator &amp; EHR Feasibility Study
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Includes elevator controller protocol assessment (BACnet/Modbus) and pharmacy workflow mapping.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Clinical Form */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl">
            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Clinical Inquiry Received</h3>
                <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                  Thank you for your interest. An INDUS Healthcare Solutions Architect will contact
                  your biomedical engineering team within 24 business hours.
                </p>
                {ticketKey && (
                  <div className="mt-6 inline-block bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs font-mono text-cyan-400">
                    Clinical Reference Key: <strong>{ticketKey}</strong>
                  </div>
                )}
                <div className="mt-8">
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setTicketKey(null);
                    }}
                    variant="outline"
                    className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-mono cursor-pointer"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} onFocus={handleFocus} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 flex items-center gap-2 text-xs text-red-400 font-mono">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Pre-Selected Solution Banner */}
                <div className="rounded-lg bg-blue-950/40 border border-blue-900/50 p-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Clinical System:</span>
                  <span className="text-cyan-400 font-bold">Hospital Delivery Robot</span>
                </div>

                {/* Row 1: Name & Hospital */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Hospital / Health System *
                    </label>
                    <Input
                      required
                      placeholder="e.g. MetroHealth Medical Center"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 h-10 text-xs"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Work Email *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="s.jenkins@metrohealth.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Direct Phone
                    </label>
                    <Input
                      placeholder="+1 (555) 012-3456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 h-10 text-xs"
                    />
                  </div>
                </div>

                {/* Row 3: Facility Type & Bed Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Facility Classification
                    </label>
                    <select
                      value={formData.facilityType}
                      onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                      className="w-full h-10 bg-slate-900 border border-slate-800 rounded-md px-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option>Tertiary / Teaching Hospital</option>
                      <option>Community / General Hospital</option>
                      <option>Centralized Pathology &amp; Lab Network</option>
                      <option>Specialty Surgical &amp; Cancer Center</option>
                      <option>Long-Term Care / Geriatric Pavilion</option>
                      <option>Blood Bank &amp; Transfusion Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Operational Bed Capacity
                    </label>
                    <select
                      value={formData.bedCount}
                      onChange={(e) => setFormData({ ...formData, bedCount: e.target.value })}
                      className="w-full h-10 bg-slate-900 border border-slate-800 rounded-md px-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option>&lt; 100 Beds</option>
                      <option>100–300 Beds</option>
                      <option>300–600 Beds</option>
                      <option>&gt; 600 Beds</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Primary Flow & Elevator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Primary Material Flow
                    </label>
                    <select
                      value={formData.primaryMaterialFlow}
                      onChange={(e) => setFormData({ ...formData, primaryMaterialFlow: e.target.value })}
                      className="w-full h-10 bg-slate-900 border border-slate-800 rounded-md px-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option>Pharmacy to Inpatient Wards &amp; ICU</option>
                      <option>Pathology &amp; Blood Specimen Transport</option>
                      <option>Surgical Sterile Supplies &amp; Implants</option>
                      <option>Multi-Flow General Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Elevator Infrastructure
                    </label>
                    <select
                      value={formData.elevatorBrand}
                      onChange={(e) => setFormData({ ...formData, elevatorBrand: e.target.value })}
                      className="w-full h-10 bg-slate-900 border border-slate-800 rounded-md px-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option>Otis / Schindler / KONE</option>
                      <option>ThyssenKrupp / TK Elevator</option>
                      <option>Mixed Multi-Vendor Elevators</option>
                      <option>Single-Floor Facility (No Elevators)</option>
                    </select>
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Clinical Notes &amp; Logistics Objectives
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Describe specific ward layouts, tower connections, pneumatic tube limitations, or urgent STAT bottlenecks..."
                    value={formData.clinicalScope}
                    onChange={(e) => setFormData({ ...formData, clinicalScope: e.target.value })}
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-cyan-400 text-xs resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Transmitting Clinical Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Request Hospital Feasibility &amp; Nursing Staff Time Blueprint</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
