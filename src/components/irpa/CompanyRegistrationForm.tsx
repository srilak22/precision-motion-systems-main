import React, { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Building2, ArrowRight, ShieldCheck, Mail, Phone, Globe, User, Briefcase, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { IrpaNavigationHeader } from "./IrpaNavigationHeader";
import { IRPA_INDUSTRIES } from "@/data/irpa/industries";

export function CompanyRegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    industryId: "IND-01",
    website: "",
    country: "United States",
    state: "",
    city: "",
    contactPerson: "",
    designation: "VP of Manufacturing & Operations",
    businessEmail: "",
    contactNumber: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Validation
    if (!formData.companyName.trim() || !formData.businessEmail.trim() || !formData.contactPerson.trim() || !formData.city.trim()) {
      setErrorMessage("Please complete all required fields marked with *.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.businessEmail,
          password: formData.password,
          fullName: formData.contactPerson,
          companyName: formData.companyName,
          industryId: formData.industryId,
          country: formData.country,
          city: formData.city,
          phone: formData.contactNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please check your credentials.");
      }

      // Store token and company details locally for session persistence
      if (data.token) {
        localStorage.setItem("irpa_token", data.token);
        localStorage.setItem("irpa_user", JSON.stringify(data.user));
        localStorage.setItem("irpa_company_id", data.companyId || "");
        localStorage.setItem("irpa_company_name", formData.companyName);
        localStorage.setItem("irpa_industry_id", formData.industryId);
      }

      setSuccessMessage("Company registered successfully! Redirecting to Factory Profile setup...");
      setTimeout(() => {
        navigate({ to: "/irpa-gap-analysis/factory-profile" });
      }, 1200);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <IrpaNavigationHeader currentModule="register" />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="text-blue-400 font-semibold">STEP 1 OF 12: COMPANY REGISTRATION</span>
            <span>8% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[8%] transition-all duration-300" />
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 shadow-2xl p-6 sm:p-10">
          <div className="border-b border-slate-800/80 pb-6 mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Company & Enterprise Registration
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Establish your corporate manufacturing account to begin or resume an IRPA assessment.
                </p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/30 flex items-start space-x-3 text-red-300 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-start space-x-3 text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enterprise Legal Entity Details */}
            <div>
              <h2 className="text-xs font-mono uppercase text-blue-400 tracking-wider mb-4">
                1. Enterprise Legal Entity Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Company Legal Entity Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Precision Automotive Components Ltd"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Industry Sector <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="industryId"
                    value={formData.industryId}
                    onChange={handleChange}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {IRPA_INDUSTRIES.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.code} — {ind.name} ({ind.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Corporate Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.yourcompany.com"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical Headquarters */}
            <div className="border-t border-slate-800/80 pt-6">
              <h2 className="text-xs font-mono uppercase text-blue-400 tracking-wider mb-4">
                2. Corporate Headquarters Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. United States, Germany, India"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    State / Province / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Michigan, Bavaria, Karnataka"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    City / Industrial Area <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Detroit, Stuttgart, Chennai"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Sponsor & Contact */}
            <div className="border-t border-slate-800/80 pt-6">
              <h2 className="text-xs font-mono uppercase text-blue-400 tracking-wider mb-4">
                3. Lead Assessment Sponsor & Access Credentials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Contact Person Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g. Robert Sterling"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Corporate Designation <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="designation"
                      required
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. VP of Manufacturing, Plant Director"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Business Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="businessEmail"
                      required
                      value={formData.businessEmail}
                      onChange={handleChange}
                      placeholder="robert.sterling@yourcompany.com"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Direct Contact Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Account Security Password <span className="text-red-400">*</span> (used to resume drafts securely)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NDA Protected • 256-bit Encrypted Industrial Transmission</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>{isSubmitting ? "Registering Entity..." : "Save & Continue to Factory Profile"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
