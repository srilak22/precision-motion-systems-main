import React from "react";
import { ShieldCheck, Lock, Clock } from "lucide-react";

export interface FormTrustReassuranceProps {
  className?: string;
  theme?: "light" | "dark";
}

export function FormTrustReassurance({
  className = "",
  theme = "light",
}: FormTrustReassuranceProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`pt-3 border-t ${
        isDark ? "border-slate-800" : "border-slate-100"
      } ${className}`}
      aria-label="Security, ISO Quality and NDA Reassurance"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center sm:text-left">
        {/* Badge 1: ISO 9001:2015 */}
        <div
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
            isDark
              ? "bg-slate-900/60 text-slate-300 border border-slate-800"
              : "bg-slate-50 text-slate-700 border border-slate-200/80"
          }`}
        >
          <ShieldCheck
            size={14}
            className={`shrink-0 ${isDark ? "text-blue-400" : "text-[#155EEF]"}`}
          />
          <span className="truncate font-semibold">ISO 9001:2015 Certified</span>
        </div>

        {/* Badge 2: NDA Protected */}
        <div
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
            isDark
              ? "bg-slate-900/60 text-slate-300 border border-slate-800"
              : "bg-slate-50 text-slate-700 border border-slate-200/80"
          }`}
        >
          <Lock
            size={13}
            className={`shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
          />
          <span className="truncate font-semibold">NDA Protected</span>
        </div>

        {/* Badge 3: 24h Response */}
        <div
          className={`flex items-center justify-center sm:justify-start gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
            isDark
              ? "bg-slate-900/60 text-slate-300 border border-slate-800"
              : "bg-slate-50 text-slate-700 border border-slate-200/80"
          }`}
        >
          <Clock
            size={13}
            className={`shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`}
          />
          <span className="truncate font-semibold">24h Engineering Response</span>
        </div>
      </div>
    </div>
  );
}

export default FormTrustReassurance;
