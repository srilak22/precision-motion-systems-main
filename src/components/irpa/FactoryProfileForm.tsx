import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Factory,
  MapPin,
  Maximize2,
  Users,
  Clock,
  Gauge,
  Cpu,
  Bot,
  Layers,
  HardDrive,
  Network,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building,
  Save,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FactoryProfileData {
  factoryName: string;
  location: string;
  city: string;
  state: string;
  country: string;
  sizeSqFt: string;
  employeeCount: string;
  shiftPattern: string;
  annualCapacity: string;
  manufacturingProcesses: string[];
  existingAutomation: string[];
  robotCount: string;
  plcSystems: string[];
  mesErpSystems: string[];
  iotInfrastructure: string;
}

const COMMON_PROCESSES = [
  "CNC Machining & Milling",
  "Sheet Metal Stamping & Bending",
  "Robotic / Manual Welding (MIG/TIG/Spot)",
  "Surface Coating & Painting",
  "High-Precision Assembly",
  "Injection Molding & Plastics",
  "SMT & Electronics Board Assembly",
  "Material Handling & Palletizing",
  "Quality Testing & CMM Inspection",
  "Packaging, Boxing & Labelling",
];

const AUTOMATION_SYSTEMS = [
  "Conveyor Belts & Transfer Lines",
  "Pneumatic / Pick & Place Feeders",
  "Automated Guided Vehicles (AGV)",
  "Autonomous Mobile Robots (AMR)",
  "Automated Storage & Retrieval (ASRS)",
  "Machine Vision Inspection Systems",
  "SCADA Telemetry & HMI Stations",
  "Robotic Welding / Assembly Workcells",
];

const PLC_VENDORS = [
  "Siemens (S7-1200 / S7-1500 / TIA Portal)",
  "Rockwell / Allen-Bradley (ControlLogix / CompactLogix)",
  "Mitsubishi Electric (MELSEC-Q / iQ-R)",
  "Omron (Sysmac NJ/NX)",
  "Schneider Electric (Modicon)",
  "Beckhoff (TwinCAT PC-based)",
  "Custom / Proprietary Microcontroller",
];

const MES_ERP_PLATFORMS = [
  "SAP S/4HANA / ECC",
  "Oracle Cloud SCM / NetSuite",
  "Microsoft Dynamics 365 Supply Chain",
  "Plex Smart Manufacturing Platform",
  "Siemens Opcenter (MES)",
  "Rockwell FactoryTalk ProductionCentre",
  "In-house Developed ERP / Spreadsheets",
  "None / Manual Logbooks",
];

const IOT_LEVELS = [
  {
    id: "none",
    title: "Level 0: No Shopfloor IoT",
    desc: "Isolated machines with no sensor telemetry or network connection.",
  },
  {
    id: "pilot",
    title: "Level 1: Pilot Standalone Sensors",
    desc: "Ad-hoc vibration or temperature sensors logging to local USB/SD.",
  },
  {
    id: "scada",
    title: "Level 2: Shopfloor SCADA Network",
    desc: "Centralized SCADA monitoring machine status across primary lines.",
  },
  {
    id: "edge",
    title: "Level 3: Edge Gateways & OPC UA",
    desc: "Standardized OPC UA/MQTT industrial edge gateways aggregating telemetry.",
  },
  {
    id: "cloud",
    title: "Level 4+: Cloud Digital Twin & Predictive AI",
    desc: "Real-time bi-directional telemetry streaming to cloud data lake & AI models.",
  },
];

interface FactoryProfileFormProps {
  initialData?: Partial<FactoryProfileData>;
  companyId?: string;
  onSuccess: (factoryId: string, profileData: FactoryProfileData) => void;
  onBack?: () => void;
}

export function FactoryProfileForm({
  initialData,
  companyId,
  onSuccess,
  onBack,
}: FactoryProfileFormProps) {
  const [formData, setFormData] = useState<FactoryProfileData>({
    factoryName: initialData?.factoryName || "",
    location: initialData?.location || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "India",
    sizeSqFt: initialData?.sizeSqFt || "",
    employeeCount: initialData?.employeeCount || "",
    shiftPattern: initialData?.shiftPattern || "3 Shifts (24/7 continuous)",
    annualCapacity: initialData?.annualCapacity || "",
    manufacturingProcesses: initialData?.manufacturingProcesses || [],
    existingAutomation: initialData?.existingAutomation || [],
    robotCount: initialData?.robotCount || "0",
    plcSystems: initialData?.plcSystems || [],
    mesErpSystems: initialData?.mesErpSystems || [],
    iotInfrastructure: initialData?.iotInfrastructure || "pilot",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customProcess, setCustomProcess] = useState("");

  // Load saved draft from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("indus_irpa_factory_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("indus_irpa_factory_draft", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleArrayItem = (field: keyof FactoryProfileData, item: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const updated = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      const newState = { ...prev, [field]: updated };
      localStorage.setItem("indus_irpa_factory_draft", JSON.stringify(newState));
      return newState;
    });
  };

  const addCustomProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProcess.trim()) return;
    if (!formData.manufacturingProcesses.includes(customProcess.trim())) {
      toggleArrayItem("manufacturingProcesses", customProcess.trim());
    }
    setCustomProcess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.factoryName.trim()) {
      setError("Please specify a factory or manufacturing plant name.");
      return;
    }

    setLoading(true);

    try {
      // Get stored token & company if not provided
      const storedToken = localStorage.getItem("indus_irpa_token");
      const storedCompany = localStorage.getItem("indus_irpa_company");
      let activeCompanyId = companyId;
      if (!activeCompanyId && storedCompany) {
        try {
          activeCompanyId = JSON.parse(storedCompany).id;
        } catch {}
      }

      const res = await fetch("/api/factories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({
          companyId: activeCompanyId,
          name: formData.factoryName,
          location: formData.location || `${formData.city}, ${formData.state}`,
          sizeSqFt: parseInt(formData.sizeSqFt) || null,
          employees: parseInt(formData.employeeCount) || null,
          shifts: formData.shiftPattern,
          productionCapacity: formData.annualCapacity,
          manufacturingProcesses: formData.manufacturingProcesses,
          existingAutomation: formData.existingAutomation,
          robotCount: parseInt(formData.robotCount) || 0,
          plcSystems: formData.plcSystems,
          mesErpSystems: formData.mesErpSystems,
          iotInfrastructure: formData.iotInfrastructure,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save factory profile.");
      }

      localStorage.setItem("indus_irpa_factory", JSON.stringify(data.factory));
      onSuccess(data.factory.id, formData);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-blue-900/40 shadow-xl">
        <div className="flex items-center gap-3 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-2">
          <Factory className="w-4 h-4" />
          <span>Step 2 of 12 &bull; Industrial Site Characterization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Factory Profile &amp; Operational Baseline
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Provide accurate baseline operational parameters for your manufacturing site. These inputs configure the capability assessment weighting and calibrate the robotics ROI baseline.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-300">Validation Issue</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Facility Identification */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-400" />
            <span>Facility Identification &amp; Physical Footprint</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Factory / Plant Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="factoryName"
                required
                value={formData.factoryName}
                onChange={handleTextChange}
                placeholder="e.g. Pune Plant 01 - Heavy Machining Div"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Floor Area (Square Feet)
              </label>
              <div className="relative">
                <Maximize2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="number"
                  name="sizeSqFt"
                  value={formData.sizeSqFt}
                  onChange={handleTextChange}
                  placeholder="e.g. 85000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Street / Industrial Zone Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleTextChange}
                  placeholder="e.g. Plot B-24, Chakan MIDC Phase II"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleTextChange}
                  placeholder="e.g. Pune"
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  State / Region
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleTextChange}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Workforce & Operational Capacity */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Workforce &amp; Production Scale</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Total Shopfloor Employees
              </label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleTextChange}
                placeholder="e.g. 240"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Shift Schedule
              </label>
              <select
                name="shiftPattern"
                value={formData.shiftPattern}
                onChange={handleTextChange}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="1 Shift (8 hrs / 5 days)">1 Shift (8 hrs / 5 days)</option>
                <option value="2 Shifts (16 hrs / 6 days)">2 Shifts (16 hrs / 6 days)</option>
                <option value="3 Shifts (24/7 continuous)">3 Shifts (24/7 continuous)</option>
                <option value="Continental / 4 Shifts (24/7 continuous)">Continental / 4 Shifts (24/7 continuous)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Annual Production Volume / Output
              </label>
              <input
                type="text"
                name="annualCapacity"
                value={formData.annualCapacity}
                onChange={handleTextChange}
                placeholder="e.g. 150,000 sub-assemblies/yr"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Manufacturing Processes */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Core Manufacturing Processes Active on Site</span>
            </h3>
            <span className="text-xs text-slate-400">
              {formData.manufacturingProcesses.length} selected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Select all processes conducted in this facility to tailor automation recommendations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            {COMMON_PROCESSES.map((proc) => {
              const active = formData.manufacturingProcesses.includes(proc);
              return (
                <button
                  type="button"
                  key={proc}
                  onClick={() => toggleArrayItem("manufacturingProcesses", proc)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 ${
                    active
                      ? "bg-cyan-950/40 border-cyan-500/70 text-cyan-200 shadow-sm"
                      : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors ${
                      active
                        ? "bg-cyan-500 border-cyan-400 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{proc}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex gap-2">
            <input
              type="text"
              value={customProcess}
              onChange={(e) => setCustomProcess(e.target.value)}
              placeholder="Add other custom process..."
              className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomProcess}
              className="border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
            >
              Add Process
            </Button>
          </div>
        </div>

        {/* Section 4: Existing Automation & Robotics Footprint */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span>Installed Automation &amp; Robotics Assets</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Currently Operating Industrial Robots
              </label>
              <select
                name="robotCount"
                value={formData.robotCount}
                onChange={handleTextChange}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="0">0 (Fully manual or dedicated fixed hard automation)</option>
                <option value="3">1 - 5 Robots (Pilot / single-cell automation)</option>
                <option value="12">6 - 20 Robots (Multiple dedicated workcells)</option>
                <option value="35">21 - 50 Robots (Department-wide automated lines)</option>
                <option value="80">50+ Robots (High-density automated factory)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Operational Shopfloor Automation Assets
              </label>
              <div className="text-xs text-slate-400 mb-2">
                Check all operational automation types present on site:
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {AUTOMATION_SYSTEMS.map((sys) => {
              const active = formData.existingAutomation.includes(sys);
              return (
                <button
                  type="button"
                  key={sys}
                  onClick={() => toggleArrayItem("existingAutomation", sys)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 ${
                    active
                      ? "bg-emerald-950/40 border-emerald-500/70 text-emerald-200"
                      : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                      active
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{sys}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Control, IT & IoT Infrastructure */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span>Control Systems, MES/ERP &amp; Industrial IoT</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Primary PLC &amp; PAC Control Platforms
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {PLC_VENDORS.map((plc) => {
                  const active = formData.plcSystems.includes(plc);
                  return (
                    <button
                      type="button"
                      key={plc}
                      onClick={() => toggleArrayItem("plcSystems", plc)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                        active
                          ? "bg-amber-950/40 border-amber-500/70 text-amber-200"
                          : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                          active
                            ? "bg-amber-500 border-amber-400 text-slate-950"
                            : "border-slate-700"
                        }`}
                      >
                        {active && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>
                      <span className="truncate">{plc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enterprise &amp; Manufacturing Execution Systems (MES / ERP)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {MES_ERP_PLATFORMS.map((sys) => {
                  const active = formData.mesErpSystems.includes(sys);
                  return (
                    <button
                      type="button"
                      key={sys}
                      onClick={() => toggleArrayItem("mesErpSystems", sys)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                        active
                          ? "bg-purple-950/40 border-purple-500/70 text-purple-200"
                          : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                          active
                            ? "bg-purple-500 border-purple-400 text-slate-950"
                            : "border-slate-700"
                        }`}
                      >
                        {active && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>
                      <span className="truncate">{sys}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Shopfloor IoT &amp; Telemetry Maturity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {IOT_LEVELS.map((lvl) => {
                  const active = formData.iotInfrastructure === lvl.id;
                  return (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, iotInfrastructure: lvl.id }))
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        active
                          ? "bg-blue-950/50 border-cyan-400 shadow-md text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-cyan-400 mb-1">{lvl.title}</div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">{lvl.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div>
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Company Info
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-blue-900/30 w-full sm:w-auto transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Facility Profile...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Continue to Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
