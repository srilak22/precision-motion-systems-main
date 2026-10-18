import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Factory,
  Cpu,
  Layers,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Send,
  Calendar,
  FileText,
  Shield,
  Gauge,
  Sliders,
  DollarSign,
  TrendingUp,
  Clock,
  Wrench,
  Bot,
  Box,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

/* =========================================================================
   STATION DEFINITIONS FOR 2D FACTORY EXPLORER
========================================================================= */

export interface FactoryStation {
  id: string;
  name: string;
  category: string;
  coord: { x: number; y: number }; // percentage on 2D floor
  status: "Operational" | "Synchronized" | "Active Cell";
  manufacturingProblem: string;
  processDescription: string;
  workflowSteps: { step: string; label: string; detail: string }[];
  engineeringSpecs: {
    typicalPayload: string;
    nominalReach: string;
    repeatability: string;
    cycleTime: string;
    ingressProtection: string;
  };
  applicableSolutions: { name: string; slug: string }[];
  illustrativeNote: string;
}

export const FACTORY_STATIONS: FactoryStation[] = [
  {
    id: "assembly",
    name: "Precision Assembly Cell",
    category: "Assembly & Fastening",
    coord: { x: 20, y: 32 },
    status: "Synchronized",
    manufacturingProblem:
      "Manual multi-part assembly suffers from fastening torque inconsistency, delicate component damage, and worker wrist strain across 8-hour continuous shifts.",
    processDescription:
      "Synchronized SCARA and 6-axis arms perform vision-guided pick, microscopic peg-in-hole alignment, and deterministic torque fastening under ±0.01 mm repeatability.",
    workflowSteps: [
      { step: "01", label: "Feeder Singulation", detail: "Vibratory bowl or tray presentation with optical part validation" },
      { step: "02", label: "Vision-Guided Pick", detail: "High-resolution camera compensates for sub-millimeter part orientation" },
      { step: "03", label: "Force-Monitored Press", detail: "Closed-loop servo press with micro-load cell depth control" },
      { step: "04", label: "Discharge & Staging", detail: "Sub-assembly queued for automated welding or transfer" },
    ],
    engineeringSpecs: {
      typicalPayload: "3 – 20 kg",
      nominalReach: "600 – 1,100 mm",
      repeatability: "±0.015 mm",
      cycleTime: "2.8 – 6.5 sec / part",
      ingressProtection: "IP54 / Cleanroom ISO 6 optional",
    },
    applicableSolutions: [
      { name: "Precision Assembly Automation", slug: "assembly-automation" },
      { name: "Factory Automation Systems", slug: "factory-automation" },
    ],
    illustrativeNote:
      "Specifications reflect verified INDUS articulated & SCARA kinematics configurations; tooling payload varies by end-effector mass.",
  },
  {
    id: "welding",
    name: "Robotic Welding Station",
    category: "Welding & Thermal Processing",
    coord: { x: 48, y: 22 },
    status: "Active Cell",
    manufacturingProblem:
      "Hazardous arc welding fumes, thermal distortion, high defect rates, and a severe shortage of certified welders limit line productivity and structural consistency.",
    processDescription:
      "Multi-axis articulated robot paired with synchronized servo rotary turn-table executes continuous-path seam tracking with real-time arc voltage feedback.",
    workflowSteps: [
      { step: "01", label: "Fixture Clamping", detail: "Pneumatic/hydraulic toggle clamps locate workpiece with zero backlash" },
      { step: "02", label: "Torch Touch Sense", detail: "Kinematic wire touch sensing confirms weld joint seam coordinates" },
      { step: "03", label: "Arc Seam Trajectory", detail: "Continuous path welding with synchronized multi-axis positioner rotation" },
      { step: "04", label: "Post-Weld Inspection", detail: "Laser scan profile validates throat thickness and spatter clearance" },
    ],
    engineeringSpecs: {
      typicalPayload: "12 – 50 kg (torch + feeder)",
      nominalReach: "1,400 – 2,050 mm",
      repeatability: "±0.04 mm",
      cycleTime: "Continuous path / process defined",
      ingressProtection: "IP65 (Weld spatter & thermal shielded)",
    },
    applicableSolutions: [
      { name: "Robotic Automation Solutions", slug: "robotic-automation" },
      { name: "Motion Control & Drives", slug: "motion-control" },
    ],
    illustrativeNote:
      "Turn-table positioner and robot axis interpolation synchronized over real-time EtherCAT fieldbus.",
  },
  {
    id: "inspection",
    name: "Automated Inspection & Metrology",
    category: "Quality Assurance",
    coord: { x: 78, y: 30 },
    status: "Operational",
    manufacturingProblem:
      "Sample-based manual micrometer inspection lets random dimensional defects slip through to customers, resulting in expensive warranty claims and batch quarantines.",
    processDescription:
      "100% inline 3D laser profiler and telecentric optical cameras capture volumetric point clouds, validating GD&T tolerances in milliseconds per component.",
    workflowSteps: [
      { step: "01", label: "Part Indexing", detail: "Servo indexing stage brings part into calibrated optical inspection volume" },
      { step: "02", label: "3D Profile Scan", detail: "Blue laser triangulation captures surface elevation and hole diameters" },
      { step: "03", label: "AI Defect Classification", detail: "Neural classifier checks for burrs, porosity, and tool markings" },
      { step: "04", label: "Automated Sorting", detail: "Servo diverter routes conforming parts to packing and rejects to rework" },
    ],
    engineeringSpecs: {
      typicalPayload: "Payload free (optical sensor)",
      nominalReach: "Fixed / Gantry mounted",
      repeatability: "±0.002 mm (optical resolution)",
      cycleTime: "0.8 – 2.0 sec / scan",
      ingressProtection: "IP67 (Sealed optical enclosure)",
    },
    applicableSolutions: [
      { name: "Automated Inspection Systems", slug: "inspection-systems" },
      { name: "Smart Manufacturing & IIoT", slug: "smart-manufacturing" },
    ],
    illustrativeNote:
      "Inline metrology data streamed directly to plant MES / QMS database via OPC UA.",
  },
  {
    id: "machine-tending",
    name: "CNC Machine Tending Cell",
    category: "Machine Tending",
    coord: { x: 26, y: 70 },
    status: "Active Cell",
    manufacturingProblem:
      "CNC machining centers sit idle during operator meal breaks and shift handovers, dropping machine utilization (OEE) below 65% on expensive 5-axis tooling.",
    processDescription:
      "Articulated robot equipped with dual pneumatic grippers swaps finished parts for raw blanks in a single door opening cycle, keeping spindle cut-time above 92%.",
    workflowSteps: [
      { step: "01", label: "Raw Stock Acquisition", detail: "Robot retrieves blank from pallet or optical centering nest" },
      { step: "02", label: "Spindle Door Cycle", detail: "Machine interlock unlocks door; robot enters chamber" },
      { step: "03", label: "Dual-Gripper Swap", detail: "Gripper A unclamps finished part; Gripper B immediately clamps blank" },
      { step: "04", label: "Air Blow & Exit", detail: "Spindle blast clears swarf chips before door closes and machining starts" },
    ],
    engineeringSpecs: {
      typicalPayload: "10 – 70 kg",
      nominalReach: "1,200 – 1,800 mm",
      repeatability: "±0.03 mm",
      cycleTime: "12 – 18 sec part-to-part swap",
      ingressProtection: "IP67 (Coolant & cutting fluid resistant)",
    },
    applicableSolutions: [
      { name: "Robotic Automation", slug: "robotic-automation" },
      { name: "Factory Automation Systems", slug: "factory-automation" },
    ],
    illustrativeNote:
      "Connects to CNC controller via standard Euromap / fieldbus interface with hardware safety interlock.",
  },
  {
    id: "material-handling",
    name: "AMR & Intralogistics Transport",
    category: "Intralogistics",
    coord: { x: 52, y: 76 },
    status: "Operational",
    manufacturingProblem:
      "Manual forklift traffic creates safety hazards in congested plant aisles and leaves line-side buffer racks periodically starved of critical work-in-progress.",
    processDescription:
      "Fleet of autonomous mobile robots (AMRs) with LiDAR SLAM navigation autonomously shuttles materials between warehouse staging and robotic workstation cells.",
    workflowSteps: [
      { step: "01", label: "Material Request Dispatch", detail: "Workstation low-level sensor triggers automated replenishment mission" },
      { step: "02", label: "Autonomous Navigation", detail: "AMR navigates aisles dynamically dodging pedestrian and obstacle traffic" },
      { step: "03", label: "Docking & Transfer", detail: "Precision optical docking pin aligns with cell conveyor transfer bed" },
      { step: "04", label: "Mission Confirmation", detail: "Fleet manager updates enterprise ERP inventory status in real-time" },
    ],
    engineeringSpecs: {
      typicalPayload: "100 – 1,500 kg payload",
      nominalReach: "Autonomous plant-wide navigation",
      repeatability: "±5 mm docking accuracy",
      cycleTime: "Speed up to 1.8 m/sec",
      ingressProtection: "IP54 industrial chassis",
    },
    applicableSolutions: [
      { name: "Material Handling & Intralogistics", slug: "material-handling" },
      { name: "Smart Manufacturing & IIoT", slug: "smart-manufacturing" },
    ],
    illustrativeNote:
      "Safety LiDAR compliant with ISO 3691-4 safety standard with 360-degree protective fields.",
  },
  {
    id: "packaging",
    name: "Palletizing & Packaging End-of-Line",
    category: "End-of-Line Automation",
    coord: { x: 80, y: 72 },
    status: "Synchronized",
    manufacturingProblem:
      "Manual case stacking causes repetitive stress injuries, unstable pallet loads during transport, and line bottlenecks when container throughput surges.",
    processDescription:
      "High-speed 4-axis or 6-axis palletizing robot with vacuum layer gripper stacks corrugated cartons in custom interlocking patterns onto dispatch pallets.",
    workflowSteps: [
      { step: "01", label: "Case Infeed & Pacing", detail: "Conveyor meters carton arrivals and bar code scanner reads SKU" },
      { step: "02", label: "Pattern Recipe Loading", detail: "Controller loads appropriate interlocking tie-sheet and layer pattern" },
      { step: "03", label: "Multi-Case Pick", detail: "Vacuum matrix tool lifts 2 to 4 cases simultaneously" },
      { step: "04", label: "Pallet Load Completion", detail: "Finished pallet automatically rolls into stretch wrapper and labeler" },
    ],
    engineeringSpecs: {
      typicalPayload: "50 – 180 kg",
      nominalReach: "2,200 – 3,100 mm",
      repeatability: "±0.06 mm",
      cycleTime: "Up to 24 cycles / min (multi-pick)",
      ingressProtection: "IP54 standard / IP65 optional",
    },
    applicableSolutions: [
      { name: "Material Handling & Intralogistics", slug: "material-handling" },
      { name: "Factory Automation Systems", slug: "factory-automation" },
    ],
    illustrativeNote:
      "Includes slip-sheet insertion and automatic empty pallet dispensing integration.",
  },
];

/* =========================================================================
   GUIDED SOLUTION FINDER OPTIONS
========================================================================= */

const INDUSTRIES = [
  "Automotive & EV Manufacturing",
  "Electronics & Semiconductors",
  "Aerospace & Defense",
  "Food, Beverage & Packaging",
  "Pharmaceutical & Medical Devices",
  "Metal Fabrication & Heavy Equipment",
  "General Precision Engineering",
];

const APPLICATION_TYPES = [
  "Precision Robotic Assembly",
  "Arc / Laser / Spot Welding",
  "Machine Tending & CNC Load/Unload",
  "In-Line Metrology & Inspection",
  "Material Handling & Palletizing",
  "High-Speed Pick-and-Place",
  "Dispensing, Sealing & Coating",
  "Not sure — recommend based on challenge",
];

const WORKPIECE_MATERIALS = [
  "Sheet Steel & High-Tensile Alloys",
  "Aluminum Castings & Extrusions",
  "PCBA & Electronic Substrates",
  "Polymer, Plastics & Composites",
  "Glass & Optical Components",
  "Corrugated Cartons & Packaging",
  "Other / Mixed Materials",
];

const PRODUCTION_CHALLENGES = [
  "Cycle time bottleneck & insufficient line throughput",
  "High scrap rate or dimensional quality inconsistency",
  "Operator safety risks & repetitive ergonomic strain",
  "Labor scarcity and inability to run 2nd/3rd shifts",
  "Slow or rigid recipe changeovers between SKU variants",
  "Lack of digital traceability and real-time telemetry",
];

const INTEGRATION_CONSTRAINTS = [
  "Cleanroom Environment (ISO 5 / 6 / 7)",
  "Washdown & Ingress Protection (IP67)",
  "Compact Floor Footprint (< 2.5 m² per cell)",
  "Collaborative Shared Zone (No physical fences)",
  "High Ambient Temperature / Welding Spatter",
  "Explosion Proof / Hazardous Location",
];

/* =========================================================================
   MAIN COMPONENT: INDUS AUTOMATION NAVIGATOR
========================================================================= */

export function IndusAutomationNavigator() {
  const { openModal } = useModals();

  // Active Tab: "explorer" | "finder" | "estimator" | "brief"
  const [activeTab, setActiveTab] = useState<"explorer" | "finder" | "estimator" | "brief">(
    "explorer",
  );

  // 1. Factory Explorer State
  const [selectedStationId, setSelectedStationId] = useState<string>("welding");
  const currentStation = useMemo(
    () => FACTORY_STATIONS.find((s) => s.id === selectedStationId) || FACTORY_STATIONS[0],
    [selectedStationId],
  );

  // 2. Guided Solution Finder State
  const [finderStep, setFinderStep] = useState<number>(1);
  const [industry, setIndustry] = useState<string>("");
  const [applicationType, setApplicationType] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");
  // Optional / Skippable Technical Parameters
  const [payloadKg, setPayloadKg] = useState<string>("");
  const [reachMm, setReachMm] = useState<string>("");
  const [cycleTimeSec, setCycleTimeSec] = useState<string>("");
  const [repeatabilityMm, setRepeatabilityMm] = useState<string>("");
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [desiredOutcome, setDesiredOutcome] = useState<string>("");

  // 3. Value Estimator State
  const [shiftsPerDay, setShiftsPerDay] = useState<number>(2);
  const [operatingDays, setOperatingDays] = useState<number>(300);
  const [operatorsPerShift, setOperatorsPerShift] = useState<number>(2);
  const [hourlyLaborRate, setHourlyLaborRate] = useState<number>(32);
  const [estimatedCapEx, setEstimatedCapEx] = useState<number>(125000); // USD
  const [maintenanceFactorPct, setMaintenanceFactorPct] = useState<number>(8); // 8% annual maintenance

  // 4. Lead Capture State (Connected to existing /api/track)
  const [fullName, setFullName] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Toggle constraint checkboxes
  const toggleConstraint = (item: string) => {
    setSelectedConstraints((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item],
    );
  };

  // Calculations for Value Estimator
  const estimatorCalculations = useMemo(() => {
    const hoursPerShift = 8;
    const currentAnnualHours = shiftsPerDay * hoursPerShift * operatingDays;
    // Automated operating hours with standard 92% line OEE
    const automatedAnnualHours = Math.round(currentAnnualHours * 0.92);
    const hoursDifference = automatedAnnualHours - currentAnnualHours;

    // Total annual labor baseline
    const totalCurrentOperators = shiftsPerDay * operatorsPerShift;
    const annualLaborCost = currentAnnualHours * totalCurrentOperators * hourlyLaborRate;

    // Automated annual maintenance & energy reserve
    const annualMaintenanceCost = estimatedCapEx * (maintenanceFactorPct / 100);
    // Estimated net annual operating difference
    const annualOperatingDifference = Math.max(0, annualLaborCost - annualMaintenanceCost);

    // Payback in months
    const paybackMonths =
      annualOperatingDifference > 0
        ? Math.round((estimatedCapEx / annualOperatingDifference) * 12 * 10) / 10
        : null;

    return {
      currentAnnualHours,
      automatedAnnualHours,
      hoursDifference,
      totalCurrentOperators,
      annualLaborCost,
      annualMaintenanceCost,
      annualOperatingDifference,
      paybackMonths,
    };
  }, [
    shiftsPerDay,
    operatingDays,
    operatorsPerShift,
    hourlyLaborRate,
    estimatedCapEx,
    maintenanceFactorPct,
  ]);

  // Tab change handler with telemetry
  const handleTabChange = (tab: "explorer" | "finder" | "estimator" | "brief") => {
    setActiveTab(tab);
    trackDigitalPresence("navigation", `Automation Navigator Tab - ${tab}`, `Switched to ${tab}`);
    trackClarityEvent(`navigator_${tab}_view`);
  };

  // Station select handler with telemetry
  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
    trackDigitalPresence("application_select", `Station: ${stationId}`, `Selected station ${stationId}`);
    trackClarityEvent("application_select");
  };

  // Transfer from Station to Solution Finder
  const configureStationInFinder = (station: FactoryStation) => {
    setApplicationType(station.category);
    setActiveTab("finder");
    setFinderStep(2);
    trackDigitalPresence("cta_click", "Configure Station in Finder", station.name);
    trackClarityEvent("navigator_configure_station");
  };

  // Submission to existing lead pipeline
  const handleSubmitProjectBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) {
      setSubmissionError("Please agree to the engineering privacy and project review consent to submit.");
      return;
    }
    if (!fullName.trim() || fullName.length < 2) {
      setSubmissionError("Please provide your full professional name.");
      return;
    }
    if (!companyEmail.trim() || !companyEmail.includes("@")) {
      setSubmissionError("Please provide a valid corporate email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Build structured technical dossier
    const structuredBrief = {
      intakeSource: "INDUS Automation Navigator Dossier",
      selectedStation: currentStation.name,
      stationCategory: currentStation.category,
      industry: industry || "General Manufacturing",
      applicationType: applicationType || currentStation.category,
      workpieceMaterial: material || "Unspecified",
      productionChallenge: challenge || currentStation.manufacturingProblem,
      engineeringParameters: {
        payloadKg: payloadKg || "Not specified (to be calculated)",
        reachMm: reachMm || "Not specified (to be calculated)",
        cycleTimeSec: cycleTimeSec || "Not specified",
        repeatabilityMm: repeatabilityMm || "Standard industrial tolerance",
        integrationConstraints: selectedConstraints,
        desiredOutcome: desiredOutcome || "Line throughput enhancement & quality stabilization",
      },
      preliminaryROIModel: {
        shiftsPerDay,
        annualOperatingHours: estimatorCalculations.currentAnnualHours,
        laborRatePerHour: `$${hourlyLaborRate}`,
        baselineLaborExpenditure: `$${estimatorCalculations.annualLaborCost.toLocaleString()}`,
        estimatedCapExBudget: `$${estimatedCapEx.toLocaleString()}`,
        estimatedPaybackMonths: estimatorCalculations.paybackMonths ? `${estimatorCalculations.paybackMonths} months` : "Input dependent",
      },
      verifiedDisclaimerAcknowledged: true,
    };

    try {
      trackDigitalPresence("quote_form_start", "Automation Navigator Form", "Submitting brief");
      trackClarityEvent("quote_form_start");

      const response = await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "consultation_request",
          name: fullName,
          email: companyEmail,
          phone: phoneNumber,
          company: companyName,
          product: `Automation Brief: ${structuredBrief.applicationType}`,
          details: JSON.stringify(structuredBrief, null, 2),
          requirements: `Industry: ${structuredBrief.industry} | Target: ${structuredBrief.applicationType} | Station: ${structuredBrief.selectedStation} | CapEx: ${structuredBrief.preliminaryROIModel.estimatedCapExBudget}`,
          form: "Automation Navigator Dossier",
          element: "Automation Navigator",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionSuccess(true);
        setTicketKey(result.jiraKey || result.issueKey || "DI-REGISTERED");
        trackDigitalPresence(
          "quote_form_success",
          "Automation Navigator Form",
          `Success ticket: ${result.jiraKey || result.issueKey || "Recorded"}`,
        );
        trackClarityEvent("quote_form_success");
        trackClarityEvent("automation_navigator_complete");
      } else {
        throw new Error(result.error || "Submission failed. Please try again or use direct consultation.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again or contact engineering support.";
      setSubmissionError(message);
      trackDigitalPresence("quote_form_error", "Automation Navigator Form", message);
      trackClarityEvent("quote_form_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="automation-navigator"
      className="relative overflow-hidden bg-surface-dark py-20 text-surface-foreground border-y border-border/20 technical-grid"
      aria-label="INDUS Automation Navigator"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-precision-blue/10 blur-3xl animate-industrial-glow" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-electric-cyan/10 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-signal animate-status-led" />
            <span className="text-[11px] font-bold uppercase tracking-[.25em] text-signal">
              Signature Engineering Tool
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl leading-none">
            INDUS Automation Navigator
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-surface-foreground/75 sm:text-base">
            Explore 2D cell architectures, configure application requirements, evaluate transparent operational
            payback models, and generate a validated preliminary project brief for your manufacturing facility.
          </p>
        </div>

        {/* TAB CONTROLS */}
        <div
          role="tablist"
          aria-label="Automation Navigator Modules"
          className="mb-8 flex flex-wrap gap-2 border-b border-border/20 pb-4"
        >
          <button
            role="tab"
            aria-selected={activeTab === "explorer"}
            aria-controls="panel-explorer"
            id="tab-explorer"
            onClick={() => handleTabChange("explorer")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
              activeTab === "explorer"
                ? "bg-precision-blue text-white shadow-lg shadow-precision-blue/25"
                : "bg-surface-elevated/60 text-surface-foreground/70 hover:bg-surface-elevated hover:text-white"
            }`}
          >
            <Factory size={15} />
            <span>1. 2D Factory Explorer</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "finder"}
            aria-controls="panel-finder"
            id="tab-finder"
            onClick={() => handleTabChange("finder")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
              activeTab === "finder"
                ? "bg-precision-blue text-white shadow-lg shadow-precision-blue/25"
                : "bg-surface-elevated/60 text-surface-foreground/70 hover:bg-surface-elevated hover:text-white"
            }`}
          >
            <Sliders size={15} />
            <span>2. Solution Requirements Finder</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "estimator"}
            aria-controls="panel-estimator"
            id="tab-estimator"
            onClick={() => handleTabChange("estimator")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
              activeTab === "estimator"
                ? "bg-precision-blue text-white shadow-lg shadow-precision-blue/25"
                : "bg-surface-elevated/60 text-surface-foreground/70 hover:bg-surface-elevated hover:text-white"
            }`}
          >
            <Calculator size={15} />
            <span>3. Value &amp; Payback Estimator</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "brief"}
            aria-controls="panel-brief"
            id="tab-brief"
            onClick={() => handleTabChange("brief")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
              activeTab === "brief"
                ? "bg-signal text-industrial-navy shadow-lg shadow-signal/25"
                : "bg-surface-elevated/60 text-surface-foreground/70 hover:bg-surface-elevated hover:text-white"
            }`}
          >
            <FileText size={15} />
            <span>4. Project Brief Dossier</span>
          </button>
        </div>

        {/* =================================================================
            TAB 1: 2D FACTORY EXPLORER
        ================================================================== */}
        {activeTab === "explorer" && (
          <div
            id="panel-explorer"
            role="tabpanel"
            aria-labelledby="tab-explorer"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in"
          >
            {/* 2D FACTORY SVG CANVAS */}
            <div className="lg:col-span-7 rounded-md border border-border/30 bg-surface-elevated/70 p-6 backdrop-blur-md relative blueprint-corners">
              <div className="flex items-center justify-between mb-4 border-b border-border/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-signal">
                    PLANT FLOOR SCHEMATIC // 2D LAYOUT
                  </span>
                </div>
                <span className="text-[11px] font-mono text-surface-foreground/50">
                  Click a cell node to inspect
                </span>
              </div>

              {/* Interactive Floor SVG Visualizer */}
              <div className="relative aspect-[16/10] w-full bg-[#0a121e] rounded border border-border/20 overflow-hidden shadow-inner flex items-center justify-center">
                {/* SVG Floor Grids & Pathways */}
                <svg
                  className="w-full h-full absolute inset-0 select-none"
                  viewBox="0 0 1000 625"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern id="factory-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(35, 136, 255, 0.08)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="pathway-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2388FF" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#16C7E8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#2388FF" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  {/* Base Floor Grid */}
                  <rect width="100%" height="100%" fill="url(#factory-grid)" />

                  {/* Flow Pathways between stations */}
                  {/* Assembly (200, 200) -> Welding (480, 140) */}
                  <path
                    d="M 240 200 L 440 140"
                    stroke="url(#pathway-flow)"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    fill="none"
                  />
                  {/* Welding (480, 140) -> Inspection (780, 190) */}
                  <path
                    d="M 520 140 L 740 190"
                    stroke="url(#pathway-flow)"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    fill="none"
                  />
                  {/* Assembly (200, 200) -> Machine Tending (260, 440) */}
                  <path
                    d="M 200 240 L 260 400"
                    stroke="rgba(35, 136, 255, 0.2)"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    fill="none"
                  />
                  {/* Machine Tending (260, 440) -> Material Handling (520, 480) */}
                  <path
                    d="M 300 440 L 480 480"
                    stroke="url(#pathway-flow)"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    fill="none"
                  />
                  {/* Material Handling (520, 480) -> Packaging (800, 450) */}
                  <path
                    d="M 560 480 L 760 450"
                    stroke="url(#pathway-flow)"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    fill="none"
                  />
                  {/* Inspection (780, 190) -> Packaging (800, 450) */}
                  <path
                    d="M 780 230 L 800 410"
                    stroke="url(#pathway-flow)"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    fill="none"
                  />

                  {/* Plant Boundary Aisle Lines */}
                  <rect
                    x="40"
                    y="40"
                    width="920"
                    height="545"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="60"
                    y="60"
                    width="880"
                    height="505"
                    fill="none"
                    stroke="rgba(22, 199, 232, 0.06)"
                    strokeWidth="1"
                    strokeDasharray="8,6"
                  />
                </svg>

                {/* STATION NODES BUTTONS OVERLAY */}
                {FACTORY_STATIONS.map((station, idx) => {
                  const isSelected = station.id === selectedStationId;
                  return (
                    <button
                      key={station.id}
                      onClick={() => handleStationSelect(station.id)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-full z-10 ${
                        isSelected ? "scale-110" : "hover:scale-105"
                      }`}
                      style={{
                        left: `${station.coord.x}%`,
                        top: `${station.coord.y}%`,
                      }}
                      aria-pressed={isSelected}
                      aria-label={`${station.name} (${station.category})`}
                    >
                      {/* Pulse ring on selected */}
                      {isSelected && (
                        <span className="absolute -inset-3 rounded-full bg-signal/25 animate-pulse-ring" />
                      )}

                      {/* Main Node Badge */}
                      <div
                        className={`relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 transition-all ${
                          isSelected
                            ? "bg-surface-elevated border-signal text-signal shadow-lg shadow-signal/40"
                            : "bg-[#0b1320] border-border/40 text-surface-foreground/70 group-hover:border-precision-blue group-hover:text-white"
                        }`}
                      >
                        <span className="font-mono text-xs font-bold">{`0${idx + 1}`}</span>
                      </div>

                      {/* Station Label Tooltip below node */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider pointer-events-none transition-all ${
                          isSelected
                            ? "bg-signal text-industrial-navy shadow-md opacity-100"
                            : "bg-surface-elevated/90 text-surface-foreground/80 opacity-80 group-hover:opacity-100"
                        }`}
                      >
                        {station.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Station Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-surface-foreground/60 gap-4 pt-3 border-t border-border/10">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-signal" /> Selected Node
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-precision-blue" /> Synchronized Pathway
                  </span>
                </div>
                <span className="font-mono text-[11px] text-surface-foreground/40">
                  ISO 10218-2 Certified Architecture Model
                </span>
              </div>
            </div>

            {/* STATION DETAIL DOSSIER PANEL */}
            <div className="lg:col-span-5 rounded-md border border-border/30 bg-surface-elevated/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-signal">
                    CELL DOSSIER // {currentStation.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white mt-1">
                    {currentStation.name}
                  </h3>
                </div>
                <span className="rounded bg-precision-blue/15 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-precision-blue border border-precision-blue/30">
                  {currentStation.status}
                </span>
              </div>

              {/* Manufacturing Problem */}
              <div className="mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-surface-foreground/50 mb-1">
                  Manufacturing Challenge
                </h4>
                <p className="text-xs leading-relaxed text-surface-foreground/85 bg-surface-dark/50 p-3 rounded border border-border/10">
                  {currentStation.manufacturingProblem}
                </p>
              </div>

              {/* Process Description */}
              <div className="mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-surface-foreground/50 mb-1">
                  Kinematic &amp; Control Process
                </h4>
                <p className="text-xs leading-relaxed text-surface-foreground/85">
                  {currentStation.processDescription}
                </p>
              </div>

              {/* Workflow Steps */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-surface-foreground/50 mb-2">
                  Station Workflow Sequence
                </h4>
                <div className="space-y-2">
                  {currentStation.workflowSteps.map((step) => (
                    <div
                      key={step.step}
                      className="flex items-start gap-2.5 text-xs bg-surface-dark/40 p-2.5 rounded border border-border/10"
                    >
                      <span className="font-mono font-bold text-signal text-[11px] shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <strong className="text-white block font-sans">{step.label}</strong>
                        <span className="text-surface-foreground/70 text-[11px]">{step.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Engineering Specs Grid */}
              <div className="mb-5 bg-surface-dark/60 p-3.5 rounded border border-border/20">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-signal mb-2.5">
                  Nominal Engineering Parameters
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
                  <div>
                    <span className="text-surface-foreground/50 block text-[10px]">PAYLOAD RANGE</span>
                    <span className="text-white font-bold">{currentStation.engineeringSpecs.typicalPayload}</span>
                  </div>
                  <div>
                    <span className="text-surface-foreground/50 block text-[10px]">MAX REACH</span>
                    <span className="text-white font-bold">{currentStation.engineeringSpecs.nominalReach}</span>
                  </div>
                  <div>
                    <span className="text-surface-foreground/50 block text-[10px]">REPEATABILITY</span>
                    <span className="text-white font-bold">{currentStation.engineeringSpecs.repeatability}</span>
                  </div>
                  <div>
                    <span className="text-surface-foreground/50 block text-[10px]">NOMINAL CYCLE</span>
                    <span className="text-white font-bold">{currentStation.engineeringSpecs.cycleTime}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-border/10">
                    <span className="text-surface-foreground/50 block text-[10px]">INGRESS PROTECTION</span>
                    <span className="text-white font-bold">{currentStation.engineeringSpecs.ingressProtection}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => configureStationInFinder(currentStation)}
                  className="flex-1 bg-precision-blue font-bold uppercase text-xs tracking-wider text-white hover:bg-precision-blue/90"
                >
                  Configure In Finder
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    trackDigitalPresence("cta_click", `RFQ for ${currentStation.name}`, currentStation.category);
                    trackClarityEvent("request_quote");
                    openModal("quote", {
                      productName: currentStation.name,
                      categoryName: currentStation.category,
                      initialMessage: `I am inquiring about cell engineering for ${currentStation.name} with target payload ${currentStation.engineeringSpecs.typicalPayload}.`,
                    });
                  }}
                  className="border-border/40 text-xs font-bold uppercase tracking-wider hover:border-signal hover:text-signal"
                >
                  Request Cell RFQ
                </Button>
              </div>

              <p className="mt-3 text-[10px] text-surface-foreground/45 italic leading-tight">
                * {currentStation.illustrativeNote}
              </p>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 2: GUIDED SOLUTION FINDER
        ================================================================== */}
        {activeTab === "finder" && (
          <div
            id="panel-finder"
            role="tabpanel"
            aria-labelledby="tab-finder"
            className="rounded-md border border-border/30 bg-surface-elevated/70 p-6 sm:p-8 backdrop-blur-md animate-fade-in max-w-4xl mx-auto"
          >
            {/* Step Progress Bar */}
            <div className="mb-8 border-b border-border/20 pb-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-surface-foreground/60 mb-2">
                <span>Requirements Collector // Step {finderStep} of 5</span>
                <span>{Math.round((finderStep / 5) * 100)}% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-surface-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-precision-blue to-signal transition-all duration-300"
                  style={{ width: `${(finderStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: INDUSTRY */}
            {finderStep === 1 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-signal">Step 01</span>
                <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-2">
                  Select Your Manufacturing Industry
                </h3>
                <p className="text-xs text-surface-foreground/70 mb-6">
                  Industry context determines regulatory compliance standards (e.g. ISO 10218, cleanroom classes, or hygienic design).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`p-4 text-left rounded border transition-all text-sm font-semibold flex items-center justify-between ${
                        industry === ind
                          ? "bg-precision-blue/20 border-signal text-white shadow-sm"
                          : "bg-surface-dark/50 border-border/20 text-surface-foreground/80 hover:border-precision-blue hover:text-white"
                      }`}
                    >
                      <span>{ind}</span>
                      {industry === ind && <CheckCircle2 size={16} className="text-signal shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    disabled={!industry}
                    onClick={() => setFinderStep(2)}
                    className="bg-precision-blue font-bold uppercase text-xs tracking-wider text-white"
                  >
                    Continue to Application
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: APPLICATION TYPE & MATERIAL */}
            {finderStep === 2 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-signal">Step 02</span>
                <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-2">
                  Select Primary Process &amp; Workpiece Material
                </h3>
                <p className="text-xs text-surface-foreground/70 mb-6">
                  Identify the core manufacturing task to match kinematics and tooling rigidity.
                </p>

                <label className="block text-xs font-bold uppercase tracking-wider text-surface-foreground/60 mb-2">
                  Target Automation Process
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {APPLICATION_TYPES.map((app) => (
                    <button
                      key={app}
                      onClick={() => setApplicationType(app)}
                      className={`p-3 text-left rounded border text-xs font-semibold flex items-center justify-between ${
                        applicationType === app
                          ? "bg-precision-blue/20 border-signal text-white"
                          : "bg-surface-dark/50 border-border/20 text-surface-foreground/80 hover:border-precision-blue"
                      }`}
                    >
                      <span>{app}</span>
                      {applicationType === app && <CheckCircle2 size={14} className="text-signal shrink-0" />}
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-bold uppercase tracking-wider text-surface-foreground/60 mb-2">
                  Component / Workpiece Material
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {WORKPIECE_MATERIALS.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setMaterial(mat)}
                      className={`p-3 text-left rounded border text-xs font-semibold flex items-center justify-between ${
                        material === mat
                          ? "bg-precision-blue/20 border-signal text-white"
                          : "bg-surface-dark/50 border-border/20 text-surface-foreground/80 hover:border-precision-blue"
                      }`}
                    >
                      <span>{mat}</span>
                      {material === mat && <CheckCircle2 size={14} className="text-signal shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setFinderStep(1)}
                    className="border-border/30 text-xs font-bold uppercase"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back
                  </Button>
                  <Button
                    disabled={!applicationType}
                    onClick={() => setFinderStep(3)}
                    className="bg-precision-blue font-bold uppercase text-xs tracking-wider text-white"
                  >
                    Continue to Challenge
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PRODUCTION CHALLENGE */}
            {finderStep === 3 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-signal">Step 03</span>
                <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-2">
                  What is Your Primary Production Challenge?
                </h3>
                <p className="text-xs text-surface-foreground/70 mb-6">
                  Select the bottleneck or hurdle this robotic cell will directly resolve.
                </p>

                <div className="space-y-3 mb-8">
                  {PRODUCTION_CHALLENGES.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChallenge(ch)}
                      className={`w-full p-4 text-left rounded border text-sm font-semibold flex items-center justify-between ${
                        challenge === ch
                          ? "bg-precision-blue/20 border-signal text-white"
                          : "bg-surface-dark/50 border-border/20 text-surface-foreground/80 hover:border-precision-blue"
                      }`}
                    >
                      <span>{ch}</span>
                      {challenge === ch && <CheckCircle2 size={16} className="text-signal shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setFinderStep(2)}
                    className="border-border/30 text-xs font-bold uppercase"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back
                  </Button>
                  <Button
                    disabled={!challenge}
                    onClick={() => setFinderStep(4)}
                    className="bg-precision-blue font-bold uppercase text-xs tracking-wider text-white"
                  >
                    Technical Specifications
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: OPTIONAL TECHNICAL SPECS & CONSTRAINTS */}
            {finderStep === 4 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-signal">Step 04</span>
                  <span className="text-[10px] font-mono uppercase bg-surface-dark px-2 py-0.5 rounded text-surface-foreground/60">
                    Fields are optional (skip if unknown)
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-2">
                  Known Engineering Constraints &amp; Parameters
                </h3>
                <p className="text-xs text-surface-foreground/70 mb-6">
                  Provide estimated figures if available; our engineering sizing team can determine exact dynamics during consultation.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Target Payload (kg)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15 kg"
                      value={payloadKg}
                      onChange={(e) => setPayloadKg(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Required Radial Reach (mm)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1400 mm"
                      value={reachMm}
                      onChange={(e) => setReachMm(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Target Takt / Cycle Time (seconds)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 4.5 sec"
                      value={cycleTimeSec}
                      onChange={(e) => setCycleTimeSec(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Required Repeatability (±mm)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ±0.03 mm"
                      value={repeatabilityMm}
                      onChange={(e) => setRepeatabilityMm(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>
                </div>

                <label className="block text-xs font-bold uppercase tracking-wider text-surface-foreground/60 mb-2">
                  Cell &amp; Environmental Constraints
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {INTEGRATION_CONSTRAINTS.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2.5 p-2.5 rounded bg-surface-dark/40 border border-border/20 text-xs cursor-pointer hover:border-precision-blue/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConstraints.includes(c)}
                        onChange={() => toggleConstraint(c)}
                        className="rounded border-border text-signal focus:ring-signal"
                      />
                      <span className="text-surface-foreground/80">{c}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setFinderStep(3)}
                    className="border-border/30 text-xs font-bold uppercase"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setFinderStep(5)}
                    className="bg-precision-blue font-bold uppercase text-xs tracking-wider text-white"
                  >
                    Review Preliminary Brief
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: PRELIMINARY BRIEF PREVIEW */}
            {finderStep === 5 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-signal">Step 05</span>
                <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-2">
                  Preliminary Automation Assessment
                </h3>
                <p className="text-xs text-surface-foreground/70 mb-6">
                  Review your configured project parameters before forwarding to the value calculator or engineering handoff.
                </p>

                <div className="rounded border border-border/30 bg-surface-dark/80 p-5 mb-6 space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border/20">
                    <div>
                      <span className="text-surface-foreground/50 block text-[10px]">INDUSTRY</span>
                      <strong className="text-white text-sm">{industry || "General Industry"}</strong>
                    </div>
                    <div>
                      <span className="text-surface-foreground/50 block text-[10px]">PROCESS CATEGORY</span>
                      <strong className="text-signal text-sm">{applicationType || "Automated Cell"}</strong>
                    </div>
                    <div>
                      <span className="text-surface-foreground/50 block text-[10px]">WORKPIECE MATERIAL</span>
                      <span className="text-white">{material || "Unspecified"}</span>
                    </div>
                    <div>
                      <span className="text-surface-foreground/50 block text-[10px]">PRIMARY CHALLENGE</span>
                      <span className="text-white">{challenge || "Throughput / Quality"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-surface-foreground/50 block text-[10px] mb-1">
                      TECHNICAL CONSTRAINTS &amp; PARAMETERS
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white">
                      <div>Payload: {payloadKg ? `${payloadKg} kg` : "TBD"}</div>
                      <div>Reach: {reachMm ? `${reachMm} mm` : "TBD"}</div>
                      <div>Takt: {cycleTimeSec ? `${cycleTimeSec}s` : "TBD"}</div>
                      <div>Rep: {repeatabilityMm || "±0.03mm"}</div>
                    </div>
                    {selectedConstraints.length > 0 && (
                      <div className="mt-2 text-[11px] text-surface-foreground/70">
                        Environmental: {selectedConstraints.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setFinderStep(4)}
                    className="border-border/30 text-xs font-bold uppercase"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Modify Inputs
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleTabChange("estimator")}
                      className="bg-precision-blue font-bold uppercase text-xs tracking-wider text-white"
                    >
                      3. Calculate Value &amp; ROI
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                    <Button
                      onClick={() => handleTabChange("brief")}
                      className="bg-signal font-bold uppercase text-xs tracking-wider text-industrial-navy"
                    >
                      4. Proceed to Dossier
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================
            TAB 3: VALUE & PAYBACK ESTIMATOR
        ================================================================== */}
        {activeTab === "estimator" && (
          <div
            id="panel-estimator"
            role="tabpanel"
            aria-labelledby="tab-estimator"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in"
          >
            {/* CALCULATOR INPUT CONTROLS */}
            <div className="lg:col-span-6 rounded-md border border-border/30 bg-surface-elevated/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                  PROCESS METRIC INPUTS
                </span>
                <button
                  onClick={() => {
                    setShiftsPerDay(2);
                    setOperatingDays(300);
                    setOperatorsPerShift(2);
                    setHourlyLaborRate(32);
                    setEstimatedCapEx(125000);
                    setMaintenanceFactorPct(8);
                  }}
                  className="text-[10px] font-mono text-surface-foreground/50 hover:text-signal flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset Defaults
                </button>
              </div>

              <div className="space-y-4">
                {/* Operating Shifts */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold uppercase text-surface-foreground/80">Operating Shifts per Day</span>
                    <span className="font-mono font-bold text-signal">{shiftsPerDay} shifts (8h each)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={shiftsPerDay}
                    onChange={(e) => setShiftsPerDay(Number(e.target.value))}
                    className="w-full accent-signal"
                  />
                  <div className="flex justify-between text-[10px] text-surface-foreground/40 font-mono">
                    <span>1 Shift (8h)</span>
                    <span>2 Shifts (16h)</span>
                    <span>3 Shifts (24h continuous)</span>
                  </div>
                </div>

                {/* Operating Days */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold uppercase text-surface-foreground/80">Annual Operating Days</span>
                    <span className="font-mono font-bold text-signal">{operatingDays} days/year</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="365"
                    step="5"
                    value={operatingDays}
                    onChange={(e) => setOperatingDays(Number(e.target.value))}
                    className="w-full accent-signal"
                  />
                </div>

                {/* Operators per Shift */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold uppercase text-surface-foreground/80">Manual Operators per Station</span>
                    <span className="font-mono font-bold text-signal">{operatorsPerShift} operators</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={operatorsPerShift}
                    onChange={(e) => setOperatorsPerShift(Number(e.target.value))}
                    className="w-full accent-signal"
                  />
                </div>

                {/* Fully Loaded Labor Rate */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold uppercase text-surface-foreground/80">
                      Fully-Loaded Labor Rate ($/hr)
                    </span>
                    <span className="font-mono font-bold text-signal">${hourlyLaborRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="85"
                    step="1"
                    value={hourlyLaborRate}
                    onChange={(e) => setHourlyLaborRate(Number(e.target.value))}
                    className="w-full accent-signal"
                  />
                  <span className="text-[10px] text-surface-foreground/45 block mt-0.5">
                    Includes wages, health coverage, payroll taxes, and worker safety insurance.
                  </span>
                </div>

                {/* Capital Expenditure Estimate */}
                <div className="pt-2 border-t border-border/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold uppercase text-surface-foreground/80">
                      Estimated Turnkey Automation CapEx ($)
                    </span>
                    <span className="font-mono font-bold text-precision-blue">
                      ${estimatedCapEx.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40000"
                    max="350000"
                    step="5000"
                    value={estimatedCapEx}
                    onChange={(e) => setEstimatedCapEx(Number(e.target.value))}
                    className="w-full accent-precision-blue"
                  />
                  <span className="text-[10px] text-surface-foreground/45 block mt-0.5">
                    Estimated scope for robot, tooling, base fixturing, safety enclosure &amp; commissioning.
                  </span>
                </div>
              </div>
            </div>

            {/* FINANCIAL OUTPUT & TRANSPARENT FORMULAS */}
            <div className="lg:col-span-6 rounded-md border border-border/30 bg-surface-elevated/80 p-6 backdrop-blur-md">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                TRANSPARENT VALUE ANALYSIS
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-4">
                Operational Difference &amp; Payback
              </h3>

              {/* High-Level Metric Tiles */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-surface-dark/70 p-4 rounded border border-border/20">
                  <span className="text-[10px] font-mono uppercase text-surface-foreground/50 block">
                    CURRENT ANNUAL LABOR
                  </span>
                  <span className="font-mono text-2xl font-bold text-white mt-1 block">
                    ${estimatorCalculations.annualLaborCost.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-surface-foreground/50 font-mono">
                    {estimatorCalculations.totalCurrentOperators} total operators across shifts
                  </span>
                </div>

                <div className="bg-surface-dark/70 p-4 rounded border border-signal/30">
                  <span className="text-[10px] font-mono uppercase text-signal block">
                    ESTIMATED PAYBACK PERIOD
                  </span>
                  <span className="font-mono text-2xl font-bold text-signal mt-1 block">
                    {estimatorCalculations.paybackMonths
                      ? `${estimatorCalculations.paybackMonths} Mo`
                      : "Input dependent"}
                  </span>
                  <span className="text-[10px] text-surface-foreground/50 font-mono">
                    ~{(Number(estimatorCalculations.paybackMonths || 0) / 12).toFixed(1)} years to break even
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-surface-dark/50 p-4 rounded border border-border/20 space-y-2.5 text-xs font-mono mb-5">
                <div className="flex justify-between pb-1.5 border-b border-border/10">
                  <span className="text-surface-foreground/70">Current Annual Operating Hours:</span>
                  <strong className="text-white">{estimatorCalculations.currentAnnualHours.toLocaleString()} hrs</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-border/10">
                  <span className="text-surface-foreground/70">Automated Hours (92% OEE factor):</span>
                  <strong className="text-white">{estimatorCalculations.automatedAnnualHours.toLocaleString()} hrs</strong>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-border/10">
                  <span className="text-surface-foreground/70">Estimated Annual Robot Maintenance (8%):</span>
                  <strong className="text-rose-400">-${estimatorCalculations.annualMaintenanceCost.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-signal font-bold">Potential Annual Net Operating Difference:</span>
                  <strong className="text-signal font-bold">
                    +${estimatorCalculations.annualOperatingDifference.toLocaleString()} / yr
                  </strong>
                </div>
              </div>

              {/* Formula & Assumptions Disclosure */}
              <div className="text-[10px] text-surface-foreground/55 space-y-1.5 mb-6 bg-surface-dark/30 p-3 rounded border border-border/10">
                <p className="font-mono font-bold text-surface-foreground/70 uppercase">
                  Transparent Calculation Methodology:
                </p>
                <p>
                  • Baseline Labor Cost = Shifts ({shiftsPerDay}) × 8h × Operating Days ({operatingDays}) × Operators ({operatorsPerShift}) × Labor Rate (${hourlyLaborRate}).
                </p>
                <p>
                  • Estimated Payback = Estimated CapEx (${estimatedCapEx.toLocaleString()}) ÷ Net Annual Difference.
                </p>
                <p className="italic text-amber-300/80">
                  * Note: Figures represent illustrative engineering estimates and do not constitute a financial guarantee. Unplanned tooling downtime, parts quality, and utility rates affect operational yield.
                </p>
              </div>

              <Button
                onClick={() => handleTabChange("brief")}
                className="w-full bg-signal text-industrial-navy font-bold uppercase text-xs tracking-wider hover:bg-signal/90"
              >
                Forward Estimates to Project Dossier
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 4: PROJECT BRIEF & LEAD HANDOFF
        ================================================================== */}
        {activeTab === "brief" && (
          <div
            id="panel-brief"
            role="tabpanel"
            aria-labelledby="tab-brief"
            className="rounded-md border border-border/30 bg-surface-elevated/70 p-6 sm:p-8 backdrop-blur-md animate-fade-in max-w-4xl mx-auto"
          >
            {submissionSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex size-16 items-center justify-center rounded-full bg-signal/20 text-signal mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-3xl font-bold uppercase text-white mb-2">
                  Automation Brief Registered
                </h3>
                <p className="text-sm text-surface-foreground/80 max-w-md mx-auto mb-6">
                  Your project requirements have been registered into the INDUS DealFlow system. An applications engineer
                  will review your payload and cycle time parameters within 1 business day.
                </p>

                <div className="inline-block bg-surface-dark px-4 py-2 rounded font-mono text-xs text-signal border border-signal/30 mb-8">
                  JIRA TRACKING KEY: {ticketKey}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild className="bg-precision-blue font-bold uppercase text-xs tracking-wider">
                    <Link to="/book-consultation">
                      <Calendar size={14} className="mr-1.5" />
                      Book Live Engineering Consultation (Google Meet)
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmissionSuccess(false);
                      setSubmissionError(null);
                    }}
                    className="border-border/30 text-xs font-bold uppercase"
                  >
                    Create Another Brief
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitProjectBrief}>
                <div className="border-b border-border/20 pb-4 mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                    EXECUTIVE HANDOFF
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white mt-1 mb-2">
                    Submit Preliminary Automation Dossier
                  </h3>
                  <p className="text-xs text-surface-foreground/70">
                    Your selected application requirements, constraints, and preliminary payback estimates will be delivered directly to the INDUS Robotics Applications Engineering Team.
                  </p>
                </div>

                {/* Dossier Summary Preview Card */}
                <div className="rounded border border-border/20 bg-surface-dark/70 p-4 mb-6 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/10">
                    <span className="font-bold text-signal">CONFIGURED SPECIFICATIONS SUMMARY</span>
                    <span className="text-surface-foreground/50">{industry || "Automotive / Manufacturing"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-surface-foreground/80">
                    <div>Station: <span className="text-white">{currentStation.name}</span></div>
                    <div>Process: <span className="text-white">{applicationType || currentStation.category}</span></div>
                    <div>Est. Payback: <span className="text-white">{estimatorCalculations.paybackMonths ? `${estimatorCalculations.paybackMonths} Mo` : "Dynamic"}</span></div>
                  </div>
                </div>

                {submissionError && (
                  <div className="mb-6 p-4 rounded bg-destructive/15 border border-destructive/40 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{submissionError}</span>
                  </div>
                )}

                {/* Lead Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Corporate Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. m.vance@company.com"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 234-5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-surface-foreground/70 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Precision Systems Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-surface-dark border border-border/30 rounded px-3 py-2 text-sm text-white focus:border-signal outline-none"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-2.5 mb-8 text-xs text-surface-foreground/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-border text-signal focus:ring-signal"
                  />
                  <span>
                    I consent to INDUS Industrial Robotics processing this preliminary project brief for technical sizing,
                    feasibility verification, and quotation according to the corporate privacy policy.
                  </span>
                </label>

                {/* Submit Action */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <span className="text-[11px] text-surface-foreground/50 font-mono">
                    Direct integration with Jira Project DI &amp; Google Sheets
                  </span>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-signal text-industrial-navy font-bold uppercase text-xs tracking-wider hover:bg-signal/90 px-6 py-2.5"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-industrial-navy border-t-transparent" />
                          Registering Brief...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Send size={14} />
                          Submit Automation Brief
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
