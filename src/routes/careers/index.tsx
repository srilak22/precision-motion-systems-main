import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GraduationCap,
  Award,
  FileText,
  Send,
  ShieldCheck,
  ArrowRight,
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
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { companyConfig } from "@/data/config";

import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/careers/")({
  head: () =>
    buildSeoMeta({
      title: "Submit Your Profile & Career Opportunities | INDUS Industrial Robotics",
      description:
        "Submit your professional profile, resume, and engineering credentials to join the INDUS Industrial Robotics team in building next-generation motion systems.",
      path: "/careers",
    }),
  component: SubmitProfilePage,
});

function SubmitProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    education: "",
    experience: "",
    skills: "",
    areaOfInterest: "Robotics Engineering",
    position: "",
    summary: "",
    resumeFileName: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB limit. Please upload a smaller PDF/DOCX file.");
        return;
      }
      setResumeFile(file);
      setFormData((prev) => ({ ...prev, resumeFileName: file.name }));
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMessage("Please fill in all required fields (Full Name, Email, Phone).");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    trackDigitalPresence(
      "form_submit",
      "Career Profile Submission",
      `Applicant: ${formData.fullName}`,
    );

    let progress = 10;
    const progressInterval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 90) {
        clearInterval(progressInterval);
      }
    }, 200);

    try {
      await trackDigitalPresence(
        "lead",
        "Career Profile Submission",
        JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: "Career Candidate",
          product: formData.position || formData.areaOfInterest,
          details: `Education: ${formData.education} | Experience: ${formData.experience} | File: ${formData.resumeFileName}`,
        }),
      );

      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setStatus("success");
      }, 1000);
    } catch {
      clearInterval(progressInterval);
      setStatus("error");
      setErrorMessage(
        `Failed to submit profile. Please try again or email your resume directly to ${companyConfig.email}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Banner */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-12 text-surface-foreground lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-signal">
              Home
            </Link>
            <span>/</span>
            <span className="text-signal font-bold">Careers</span>
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[.24em] text-signal">
            Join The Engineering Force
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[.95] sm:text-5xl lg:text-6xl">
            Careers &amp; Engineering Culture
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-surface-foreground/75 sm:text-base">
            Are you passionate about mechanical design, high-stiffness precision gear reducers,
            embedded motion controllers, or autonomous mobile robotics? Join our engineering team
            in building next-generation industrial automation.
          </p>

          {/* Quick Jump Anchor Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <a
              href="#open-positions"
              className="inline-flex items-center gap-1.5 rounded bg-signal/15 border border-signal/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-signal hover:bg-signal/25 transition-colors"
            >
              <Briefcase size={13} />
              <span>Open Positions</span>
            </a>
            <a
              href="#internships"
              className="inline-flex items-center gap-1.5 rounded bg-surface-elevated border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal/40 hover:text-signal transition-colors"
            >
              <GraduationCap size={13} />
              <span>Internships</span>
            </a>
            <a
              href="#culture"
              className="inline-flex items-center gap-1.5 rounded bg-surface-elevated border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-surface-foreground hover:border-signal/40 hover:text-signal transition-colors"
            >
              <Award size={13} />
              <span>Company Culture</span>
            </a>
            <a
              href="#apply"
              className="inline-flex items-center gap-1.5 rounded bg-signal text-signal-foreground px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-signal/90 transition-colors"
            >
              <Send size={13} />
              <span>Submit Resume</span>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-surface-foreground/70">
            <div className="flex items-center gap-2">
              <Briefcase size={15} className="text-signal" />
              <span>Full-time, Contract &amp; R&amp;D Engineering Roles</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-signal" />
              <span>Strict Confidentiality &amp; Direct Engineering Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. OPEN POSITIONS (#open-positions) */}
      <section id="open-positions" className="border-b border-border/40 bg-card px-5 py-12 lg:px-10 lg:py-16 scroll-mt-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Current Opportunities
              </span>
              <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                Open Engineering Positions
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              We recruit directly into physical lab and production teams. Candidates engage in
              hands-on mechatronic design, dyno testing, and embedded architecture.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Senior Mechatronics & Strain-Wave Reducer Engineer",
                type: "Full-Time",
                location: "Chennai HQ / On-Site Lab",
                dept: "Precision Mechanical Engineering",
                desc: "Lead FEA stress modeling of flexspline tooth profiles, backlash characterization (<0.5 arcmin), and thermal dissipation under continuous industrial duty cycles.",
              },
              {
                title: "Real-Time Embedded Firmware & EtherCAT Engineer",
                type: "Full-Time",
                location: "Chennai HQ / Hybrid",
                dept: "Motion Control & Drives",
                desc: "Develop low-latency C/C++ firmware on DSP and ARM Cortex-M7 cores. Implement CiA 402 drive profiles, sub-microsecond synchronization, and FSoE safety stacks.",
              },
              {
                title: "Field Applications & Robotic Systems Integrator",
                type: "Full-Time",
                location: "Chennai / Client Deployments",
                dept: "Application Engineering",
                desc: "Partner with tier-1 automotive and semiconductor customers to validate kinematic workcells, sizing tolerances, payload dynamics, and turnkey safety enclosures.",
              },
              {
                title: "Quality Metrology & CMM Inspection Specialist",
                type: "Full-Time",
                location: "Chennai HQ / Manufacturing",
                dept: "Manufacturing Quality QA",
                desc: "Operate high-precision coordinate measuring machines (CMM) and laser optical profilers to audit sub-micron gearhead tolerances against ISO 9001:2015 standards.",
              },
            ].map((pos) => (
              <div
                key={pos.title}
                className="border border-border bg-background p-6 rounded flex flex-col justify-between hover:border-signal/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-signal bg-signal/10 px-2 py-0.5 rounded">
                      {pos.dept}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {pos.type} · {pos.location}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase text-foreground">
                    {pos.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {pos.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <a
                    href="#apply"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        position: pos.title,
                        areaOfInterest: "Robotics Engineering",
                      }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-signal hover:underline"
                  >
                    <span>Apply for this Role</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTERNSHIP OPPORTUNITIES (#internships) */}
      <section id="internships" className="border-b border-border/40 bg-background px-5 py-12 lg:px-10 lg:py-16 scroll-mt-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Early Career &amp; Research
              </span>
              <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                Internship Opportunities
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              6-month structured engineering internships paired directly with senior specialists on
              real production hardware and kinematic test rigs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-card p-6 rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-signal bg-signal/10 px-2 py-0.5 rounded">
                  Graduate / Final Year Intern
                </span>
                <h3 className="mt-2 font-display text-lg font-bold uppercase text-foreground">
                  Kinematics &amp; Mechanical Dynamics Intern (6 Months)
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Collaborate on multi-body dynamics simulation of robotic joints, strain-wave tooth wear
                  analysis, and thermal cycling of brushless servomotor housings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <a
                  href="#apply"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      position: "Kinematics & Mechanical Dynamics Intern",
                      areaOfInterest: "Mechanical & Gear Design",
                    }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-signal hover:underline"
                >
                  <span>Submit Internship Application</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            <div className="border border-border bg-card p-6 rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-signal bg-signal/10 px-2 py-0.5 rounded">
                  Undergrad / Graduate Intern
                </span>
                <h3 className="mt-2 font-display text-lg font-bold uppercase text-foreground">
                  Embedded ROS2 &amp; Mobile Robotics Intern (6 Months)
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Integrate safety LiDAR sensors, implement navigation costmaps on differential AGV drive
                  bases, and benchmark path-planning algorithms in simulated and real environments.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <a
                  href="#apply"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      position: "Embedded ROS2 & Mobile Robotics Intern",
                      areaOfInterest: "Embedded Systems & ROS",
                    }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-signal hover:underline"
                >
                  <span>Submit Internship Application</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPANY CULTURE (#culture) */}
      <section id="culture" className="border-b border-border/40 bg-card px-5 py-12 lg:px-10 lg:py-16 scroll-mt-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
              Our Way of Working
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
              Company Culture
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              We are an engineering-led robotics company. We value physical rigor, data from real
              hardware dyno benches, and deep respect for mechanical craftsmanship.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Physics First Principles",
                desc: "We analyze torque, stiffness, and thermal dissipation from first physical principles rather than treating robot components as black boxes.",
              },
              {
                num: "02",
                title: "Dyno-Bench Verifiability",
                desc: "No claim is accepted without traceable test bench verification. We calibrate and document repeatability under real continuous loads.",
              },
              {
                num: "03",
                title: "Interdisciplinary Harmony",
                desc: "Mechanical gear designers, firmware engineers, and control specialists sit in the same room, iterating rapidly on joint integration.",
              },
              {
                num: "04",
                title: "Direct Engineering Ownership",
                desc: "Engineers interface directly with automation customers, visit manufacturing lines, and see their designs running 24/7 on factory floors.",
              },
            ].map((cult) => (
              <div key={cult.num} className="border border-border bg-background p-6 rounded">
                <span className="font-mono text-2xl font-black text-signal block mb-2">
                  {cult.num}
                </span>
                <h4 className="font-display text-base font-bold uppercase text-foreground">
                  {cult.title}
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {cult.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MAIN APPLICATION & RESUME SUBMISSION (#apply) */}
      <section id="apply" className="px-5 py-12 lg:px-10 lg:py-16 scroll-mt-20">
        <div className="mx-auto max-w-[1440px] grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main Profile Form */}
          <div className="border border-border bg-card p-6 sm:p-10 shadow-lg">
            <div className="mb-6 border-b border-border pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-signal">
                Direct Engineering Talent Gateway
              </span>
              <h2 className="mt-1 font-display text-2xl uppercase tracking-wider text-foreground">
                Submit Your Engineering Profile
              </h2>
            </div>
            {status === "success" ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-signal/10 text-signal border border-signal">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="font-display text-2xl uppercase tracking-wider text-foreground sm:text-3xl">
                  Profile Submitted Successfully
                </h2>
                <p className="mx-auto max-w-lg text-sm text-muted-foreground leading-6">
                  Thank you, <strong className="text-foreground">{formData.fullName}</strong>. Your
                  engineering profile and credentials have been logged in our talent database. Our
                  engineering leads will review your application against current and upcoming
                  project requirements.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      setStatus("idle");
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        location: "",
                        linkedin: "",
                        portfolio: "",
                        education: "",
                        experience: "",
                        skills: "",
                        areaOfInterest: "Robotics Engineering",
                        position: "",
                        summary: "",
                        resumeFileName: "",
                      });
                      setResumeFile(null);
                    }}
                    className="rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90"
                  >
                    Submit Another Profile
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none border-border font-bold uppercase"
                  >
                    <Link to="/products">Explore Products</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                    <User size={18} className="text-signal" />
                    Candidate Information
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Full Name <span className="text-signal">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Dr. Alex Rivera"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
                        Email Address <span className="text-signal">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="alex.rivera@example.com"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">
                        Phone Number <span className="text-signal">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 019-2834"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Current Location (City, Country)
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Detroit, MI, USA"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                    <Linkedin size={18} className="text-signal" />
                    Professional Profiles & Portfolio
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="linkedin"
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        LinkedIn Profile URL
                      </Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/alexrivera"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="portfolio"
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Portfolio / GitHub / Research URL
                      </Label>
                      <Input
                        id="portfolio"
                        name="portfolio"
                        type="url"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://github.com/alexrivera-robotics"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Domain & Credentials */}
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                    <Award size={18} className="text-signal" />
                    Engineering Domain & Experience
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="areaOfInterest"
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Primary Engineering Focus
                      </Label>
                      <Select
                        value={formData.areaOfInterest}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, areaOfInterest: val }))
                        }
                      >
                        <SelectTrigger
                          id="areaOfInterest"
                          className="h-11 rounded-none bg-background"
                        >
                          <SelectValue placeholder="Select primary engineering discipline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Robotics Engineering">
                            Robotics & Kinematics Engineering
                          </SelectItem>
                          <SelectItem value="Motion Control & Drives">
                            Motion Control & Servo Drives
                          </SelectItem>
                          <SelectItem value="Mechanical & Gear Design">
                            Mechanical & Strain-Wave Reducer Design
                          </SelectItem>
                          <SelectItem value="Embedded Systems & ROS">
                            Embedded Firmware & ROS2 Architecture
                          </SelectItem>
                          <SelectItem value="Industrial Automation / PLC">
                            Industrial Automation & PLC Integration
                          </SelectItem>
                          <SelectItem value="Manufacturing & Quality QA">
                            High-Precision Manufacturing & Metrology
                          </SelectItem>
                          <SelectItem value="Technical Sales & Application Engineering">
                            Field Application & Solutions Engineering
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className="text-xs font-bold uppercase tracking-wider"
                      >
                        Years of Industry Experience
                      </Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g. 6+ years in precision automation"
                        className="h-11 rounded-none bg-background"
                      />
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-wider">
                      Core Technical Competencies & Toolchain
                    </Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g. SolidWorks, EtherCAT, ROS2, Finite Element Analysis, C++, Servo Tuning"
                      className="h-11 rounded-none bg-background"
                    />
                  </div>

                  <div className="mt-5 space-y-2">
                    <Label htmlFor="summary" className="text-xs font-bold uppercase tracking-wider">
                      Professional Summary / Technical Achievements
                    </Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Briefly describe your key engineering accomplishments, patent history, or industrial project leadership..."
                      className="rounded-none bg-background"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wider text-foreground border-b border-border pb-3 flex items-center gap-2">
                    <FileText size={18} className="text-signal" />
                    Resume / Curriculum Vitae Upload
                  </h3>

                  <div className="mt-4 border-2 border-dashed border-border/80 bg-muted/20 p-8 text-center transition-colors hover:border-signal/50">
                    <input
                      type="file"
                      id="resumeUpload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resumeUpload" className="cursor-pointer block">
                      <div className="mx-auto grid size-12 place-items-center rounded-full bg-signal/10 text-signal mb-3">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                        {resumeFile
                          ? resumeFile.name
                          : "Click to select or drag & drop your Resume"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX (Max size: 10MB)
                      </p>
                    </label>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 border border-destructive/50 bg-destructive/10 p-4 text-xs text-destructive">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {status === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>Uploading & Processing Profile...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-signal transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={status === "uploading"}
                    className="h-12 flex-1 rounded-none bg-signal text-signal-foreground font-bold uppercase tracking-wider hover:bg-signal/90"
                  >
                    {status === "uploading" ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Submitting Profile...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Submit Engineering Profile
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="h-12 rounded-none border-border font-bold uppercase tracking-wider"
                  >
                    <Link to="/contact">Contact HR Directly</Link>
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                Why Join INDUS?
              </h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                We design and manufacture high-precision motion controls, strain-wave reducers, and
                heavy-payload robotic actuators for demanding industrial operations.
              </p>

              <ul className="mt-6 space-y-4 text-xs">
                <li className="flex gap-3">
                  <span className="grid size-6 place-items-center rounded bg-signal/10 text-signal font-mono font-bold">
                    01
                  </span>
                  <div>
                    <strong className="block text-foreground">Core Motion R&D</strong>
                    <span className="text-muted-foreground">
                      Work directly on sub-arcminute gear geometry and servo loops.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-6 place-items-center rounded bg-signal/10 text-signal font-mono font-bold">
                    02
                  </span>
                  <div>
                    <strong className="block text-foreground">Industrial Scaling</strong>
                    <span className="text-muted-foreground">
                      Deploy automation in automotive, semiconductor, and heavy manufacturing.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-6 place-items-center rounded bg-signal/10 text-signal font-mono font-bold">
                    03
                  </span>
                  <div>
                    <strong className="block text-foreground">Interdisciplinary Teams</strong>
                    <span className="text-muted-foreground">
                      Collaborate across kinematics, power electronics, and embedded ROS systems.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="border border-border bg-muted/30 p-6">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                Direct Contact
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-5">
                For executive inquiries or specialized academic research partnerships:
              </p>
              <div className="mt-4 space-y-2 font-mono text-xs">
                <p className="text-foreground">
                  <strong>Careers Email:</strong> {companyConfig.email}
                </p>
                <p className="text-foreground">
                  <strong>Headquarters:</strong> {companyConfig.headquarters}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
