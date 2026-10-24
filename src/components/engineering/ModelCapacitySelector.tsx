import React, { useState } from "react";
import { CheckCircle2, GitCompare, Download, ArrowRight, ShieldCheck, Scale, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ModelVariantSpec {
  modelCode: string;
  name?: string;
  headlineMetric: string;
  nominalRating: string;
  peakRating: string;
  ratedSpeedOrVelocity: string;
  maxSpeedOrVelocity: string;
  precisionOrBacklash: string;
  powerOrCurrent: string;
  loadLimits: string;
  massOrDimension: string;
  applicationFit: string;
  interfaces?: string;
  environmentalSuitability?: string;
  integrationRequirements?: string;
  verificationStatus: "verified" | "configurable";
}

interface ModelCapacitySelectorProps {
  productName: string;
  categorySlug: string;
  variants: ModelVariantSpec[];
  onSelectModelForQuote?: (modelCode: string) => void;
}

export function ModelCapacitySelector({
  productName,
  categorySlug,
  variants,
  onSelectModelForQuote,
}: ModelCapacitySelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>(variants[0]?.modelCode || "");
  const [activeTab, setActiveTab] = useState<"table" | "cards">("table");

  if (!variants || variants.length === 0) return null;

  const currentVariant = variants.find((v) => v.modelCode === selectedModel) || variants[0];

  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-white p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAF1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#EFF6FF] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
              Engineering Variant Matrix
            </span>
            <span className="text-xs font-mono text-[#667085]">
              {variants.length} Verified Configurations
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#172033] mt-1 tracking-tight">
            Capacity &amp; Model Variant Comparison
          </h3>
          <p className="text-xs text-[#667085] mt-0.5">
            Compare verified continuous versus peak ratings, kinematic envelopes, and application mapping for {productName}.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-1 text-xs">
          <button
            onClick={() => setActiveTab("table")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "table"
                ? "bg-white text-[#155EEF] shadow-2xs font-bold"
                : "text-[#667085] hover:text-[#172033]"
            }`}
          >
            Matrix Table
          </button>
          <button
            onClick={() => setActiveTab("cards")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "cards"
                ? "bg-white text-[#155EEF] shadow-2xs font-bold"
                : "text-[#667085] hover:text-[#172033]"
            }`}
          >
            Application Cards
          </button>
        </div>
      </div>

      {/* 2. Variant Selector Pills */}
      <div className="my-5 flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = v.modelCode === selectedModel;
          return (
            <button
              key={v.modelCode}
              onClick={() => setSelectedModel(v.modelCode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                isSelected
                  ? "bg-[#155EEF] text-white border-[#155EEF] font-bold shadow-xs"
                  : "bg-[#F8FAFC] text-[#475467] border-[#E5EAF1] hover:border-[#B2CCFF]"
              }`}
            >
              <span>{v.modelCode}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-[#EFF6FF] text-[#155EEF]"
                }`}
              >
                {v.headlineMetric}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Table View */}
      {activeTab === "table" && (
        <div className="overflow-x-auto rounded-xl border border-[#E5EAF1]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5EAF1] text-[#475467] uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Engineering Parameter</th>
                {variants.map((v) => (
                  <th
                    key={v.modelCode}
                    className={`py-3 px-4 font-mono ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF] text-[#155EEF]" : ""
                    }`}
                  >
                    {v.modelCode}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1] font-mono text-[11.5px]">
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Rated Continuous Capacity
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 font-bold text-[#172033] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.nominalRating}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Peak Acceleration Limit
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#D92D20] font-semibold ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.peakRating}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Rated Operating Speed / Velocity
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.ratedSpeedOrVelocity}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Maximum Commutation Speed
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.maxSpeedOrVelocity}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Backlash / Positioning Repeatability
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#155EEF] font-bold ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.precisionOrBacklash}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Continuous Current / Power
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.powerOrCurrent}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Allowable Radial / Moment Load
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.loadLimits}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Mass &amp; Mounting Envelope
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.massOrDimension}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Fieldbus &amp; Electrical Interfaces
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] text-[11px] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.interfaces || "EtherCAT CoE / CANopen DS402 · 48V DC"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Environmental Suitability &amp; Ingress
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] text-[11px] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.environmentalSuitability || "IP65 Enclosure · 0°C to +50°C Ambient"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Integration Requirements &amp; Mounting
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 text-[#475467] text-[11px] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60" : ""
                    }`}
                  >
                    {v.integrationRequirements || "ISO 9409-1 Standard Flange"}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-[#FBFDFE]">
                <td className="py-2.5 px-4 font-sans font-semibold text-[#172033]">
                  Target Application Class
                </td>
                {variants.map((v) => (
                  <td
                    key={v.modelCode}
                    className={`py-2.5 px-4 font-sans text-xs text-[#475467] ${
                      v.modelCode === selectedModel ? "bg-[#EFF6FF]/60 font-semibold text-[#155EEF]" : ""
                    }`}
                  >
                    {v.applicationFit}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Application Cards View */}
      {activeTab === "cards" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {variants.map((v) => {
            const isSelected = v.modelCode === selectedModel;
            return (
              <div
                key={v.modelCode}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-[#155EEF] bg-[#F5F8FF] shadow-sm ring-1 ring-[#155EEF]"
                    : "border-[#E5EAF1] bg-white hover:border-[#B2CCFF]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#172033]">
                      {v.modelCode}
                    </span>
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-mono font-bold text-[#155EEF]">
                      {v.verificationStatus}
                    </span>
                  </div>
                  <div className="mt-2 font-display text-xl font-bold text-[#155EEF]">
                    {v.headlineMetric}
                  </div>
                  <p className="mt-2 text-xs text-[#667085] leading-snug">
                    {v.applicationFit}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#E5EAF1] space-y-1.5 text-[11px] font-mono text-[#475467]">
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Continuous:</span>
                      <strong className="text-[#172033]">{v.nominalRating}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Peak Accel:</span>
                      <strong className="text-[#D92D20]">{v.peakRating}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Precision:</span>
                      <strong className="text-[#155EEF]">{v.precisionOrBacklash}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5EAF1]">
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => {
                      setSelectedModel(v.modelCode);
                      if (onSelectModelForQuote) onSelectModelForQuote(v.modelCode);
                    }}
                    className={`w-full text-xs font-bold uppercase ${
                      isSelected
                        ? "bg-[#155EEF] hover:bg-[#1047BF] text-white"
                        : "border-[#E5EAF1] text-[#172033]"
                    }`}
                  >
                    Select {v.modelCode}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Traceability Note */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E5EAF1] text-[11px] text-[#667085]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
          <span>Ratings derived from audited dyno bench calibration. Torque ratings do not equate to direct lifting payload without lever geometry sizing.</span>
        </div>
        {onSelectModelForQuote && (
          <Button
            size="sm"
            onClick={() => onSelectModelForQuote(selectedModel)}
            className="bg-[#155EEF] hover:bg-[#1047BF] text-white text-xs font-bold uppercase h-8 px-4 shrink-0"
          >
            Quote Model {selectedModel} <ArrowRight size={12} className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
