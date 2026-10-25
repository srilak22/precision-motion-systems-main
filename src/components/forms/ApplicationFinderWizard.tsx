import React, { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Cpu,
  Boxes,
  Activity,
  Layers,
  ShieldCheck,
  Building2,
  Mail,
  User,
  Phone,
  Send,
  Loader2,
  FileCheck,
  AlertCircle,
  RotateCw,
  Sliders,
  Check,
  Info,
  Compass,
  FileText,
  AlertTriangle,
  Cog,
  Zap,
  Gauge,
  Sparkles,
  ExternalLink,
  Lock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createJiraTask } from "@/lib/jira";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackIndusEvent } from "@/lib/analytics";
import { trackClarityEvent } from "@/analytics/clarity";
import { getYouTubeAttribution } from "@/integrations/youtube-leads/attribution";
import { companyConfig } from "@/data/config";

export interface ApplicationFinderWizardProps {
  initialCategory?: string;
  initialProduct?: string;
  searchParams?: {
    category?: string;
    product?: string;
    app?: string;
    goal?: string;
    payload?: string;
    reach?: string;
    cycle?: string;
    industry?: string;
  };
  onSuccess?: (ticketKey: string) => void;
  onClose?: () => void;
}

// 8 Application Categories mandated by Phase 3 + Other + I'm not sure
const APPLICATION_CATEGORIES = [
  {
    id: "robotic-handling",
    label: "Robotic Handling",
    description: "Palletizing, machine loading, heavy-part transfer, multi-axis articulation.",
    defaultComponent: "robot",
  },
  {
    id: "machine-tending",
    label: "Machine Tending",
    description: "CNC turning/milling loading, press tending, injection mold extraction.",
    defaultComponent: "robot",
  },
  {
    id: "pick-and-place",
    label: "Pick and Place",
    description: "High-speed packaging, electronic component sorting, tray loading.",
    defaultComponent: "linear-actuator",
  },
  {
    id: "precision-assembly",
    label: "Precision Assembly",
    description: "Micro-insertion, screwdriving, force-controlled press-fit, staking.",
    defaultComponent: "rotary-actuator",
  },
  {
    id: "inspection-qc",
    label: "Inspection & Quality Control",
    description: "Automated vision gauging, coordinate metrology, sensor scanning.",
    defaultComponent: "linear-actuator",
  },
  {
    id: "material-handling",
    label: "Material Handling",
    description: "Overhead gantry shuttles, conveyor divert gates, AMR top modules.",
    defaultComponent: "linear-actuator",
  },
  {
    id: "motion-control",
    label: "Motion Control",
    description: "Multi-axis synchronized joints, continuous electronic camming.",
    defaultComponent: "rotary-actuator",
  },
  {
    id: "custom-automation",
    label: "Custom Automation",
    description: "Bespoke kinematics, special test fixtures, turnkey robotic cells.",
    defaultComponent: "gearbox",
  },
  {
    id: "other",
    label: "Other Automation Process",
    description: "Unique mechanism, specialized tooling, or process not listed above.",
    defaultComponent: "rotary-actuator",
  },
  {
    id: "not-sure",
    label: "I'm Not Sure",
    description: "Need engineering consultation to evaluate kinematics and architecture.",
    defaultComponent: "robot",
  },
] as const;

export function ApplicationFinderWizard({
  initialCategory = "rotary-actuator",
  initialProduct = "",
  searchParams,
  onSuccess,
  onClose,
}: ApplicationFinderWizardProps) {
  // Total steps: 1. Application, 2. Technical, 3. Environment & Integration, 4. Project Details, 5. Application Brief & Review, 6. Contact & Dispatch
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionType, setSubmissionType] = useState<"rfq" | "consultation">("rfq");
  const [ticketKey, setTicketKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active component category
  const [category, setCategory] = useState<string>(() => {
    const c = initialCategory.toLowerCase();
    if (c.includes("rotary")) return "rotary-actuator";
    if (c.includes("linear")) return "linear-actuator";
    if (c.includes("robot") || c.includes("arm")) return "robot";
    if (c.includes("gear") || c.includes("reducer")) return "gearbox";
    return "rotary-actuator";
  });

  // Step 1: Application Profile
  const [step1, setStep1] = useState({
    applicationCategory: "robotic-handling",
    automationGoal: "Automate machine loading and workpiece transfer",
    industry: "Automotive & EV",
    projectNature: "New Machine Build (Greenfield)",
    operationalChallenge: "Cycle Time / Takt Reduction",
  });

  // Step 2: Mechanical Requirements (Category Specific)
  const [step2Robot, setStep2Robot] = useState({
    payloadKg: "12",
    reachMm: "1100",
    repeatabilityMm: "±0.03",
    axes: "6-Axis Articulated",
    cycleTimeSec: "4.5",
    mounting: "Floor Mount",
    unknownSpecs: false,
  });

  const [step2Linear, setStep2Linear] = useState({
    thrustForceN: "1200",
    strokeMm: "450",
    speedMmPerSec: "600",
    dutyCyclePercent: "60",
    orientation: "Horizontal",
    overhungMomentNm: "180",
    unknownSpecs: false,
  });

  const [step2Rotary, setStep2Rotary] = useState({
    continuousTorqueNm: "85",
    peakTorqueNm: "210",
    outputSpeedRpm: "35",
    angularTravelDeg: "360 Continuous",
    positioningAccuracy: "< 1.0 arcmin",
    dutyCyclePercent: "60",
    unknownSpecs: false,
  });

  const [step2Gearbox, setStep2Gearbox] = useState({
    outputTorqueNm: "160",
    inputSpeedRpm: "3000",
    reductionRatio: "50:1",
    backlashArcmin: "< 1.0 arcmin",
    radialAxialLoad: "3200 N Radial / 1800 N Axial",
    unknownSpecs: false,
  });

  // Step 3: Environment & Integration
  const [step3, setStep3] = useState({
    operatingTemp: "Standard Ambient (15°C to 35°C)",
    dustMoistureIP: "IP65 Dust-tight & Water Jet Protected",
    cleanroomClass: "Standard Industrial (No Cleanroom)",
    powerSupply: "48V DC Regulated Bus (Joint Actuators)",
    plcController: "Beckhoff TwinCAT 3 (EtherCAT)",
    fieldbusProtocol: "EtherCAT (CoE / CiA 402)",
    interfaces: "Standard ISO 9409-1 Robot Flange",
    safetyRequirements: "EN ISO 13849-1 Safe Torque Off (STO SIL2 / PLd)",
  });

  // Step 4: Project Details
  const [step4, setStep4] = useState({
    estimatedQuantity: "3–10 units (Pilot Production)",
    projectStage: "Detailed 3D CAD & Mechanical Design",
    implementationDate: "Within 2–3 Months",
    customizationRequirements: "Standard Catalogue Model is acceptable",
    projectDescription: initialProduct ? `Evaluating suitability for ${initialProduct}` : "",
  });

  // Step 5: Contact Details
  const [step5, setStep5] = useState({
    fullName: "",
    company: "",
    workEmail: "",
    phoneNumber: "",
    preferredContact: "Email & WhatsApp",
    consentPrivacy: true,
  });

  const formStartedRef = useRef(false);
  const submittedRef = useRef(false);
  const funnelIdRef = useRef<string>(`fnl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

  // Track initial open
  useEffect(() => {
    trackIndusEvent({
      event_name: "application_finder_opened",
      product_category: category,
      funnel_id: funnelIdRef.current,
      funnel_step: 1,
      funnel_stage: "application_finder_opened",
      interaction_source: "wizard",
      details: "Application Finder Wizard Opened",
    });
    trackClarityEvent("application_finder_opened");

    // Abandonment listener on unmount
    return () => {
      if (formStartedRef.current && !submittedRef.current) {
        trackIndusEvent({
          event_name: "application_finder_abandoned",
          product_category: category,
          funnel_id: funnelIdRef.current,
          funnel_stage: `Step ${currentStep} Abandoned`,
          funnel_step: currentStep,
          interaction_source: "wizard",
          details: `Abandoned at step ${currentStep}`,
        });
        trackClarityEvent("application_finder_abandoned");
      }
    };
  }, []);

  const [transferredNotice, setTransferredNotice] = useState(false);
  const [transferredTitle, setTransferredTitle] = useState("Transferred from INDUS Robotics Guide");

  // Load transferred parameters from INDUS Robotics Guide or Search Params
  useEffect(() => {
    try {
      let prefill: any = null;
      const raw = sessionStorage.getItem("indus_finder_prefill");
      if (raw) {
        prefill = JSON.parse(raw);
        sessionStorage.removeItem("indus_finder_prefill");
      } else if (searchParams) {
        if (
          searchParams.category ||
          searchParams.app ||
          searchParams.payload ||
          searchParams.reach ||
          searchParams.cycle ||
          searchParams.goal
        ) {
          prefill = {
            category: searchParams.category,
            applicationCategory: searchParams.app,
            automationGoal: searchParams.goal,
            industry: searchParams.industry,
            payloadKg: searchParams.payload,
            reachMm: searchParams.reach,
            cycleTimeSec: searchParams.cycle,
            summary: searchParams.product ? `Evaluating suitability for ${searchParams.product}` : "",
          };
        }
      }

      if (prefill) {
        setTransferredNotice(true);
        if (prefill.modelCode) {
          setTransferredTitle(`Transferred from Intelligent Actuator Studio (${prefill.modelCode})`);
        }
        if (prefill.category) {
          const c = String(prefill.category).toLowerCase();
          if (c.includes("rotary")) setCategory("rotary-actuator");
          else if (c.includes("linear")) setCategory("linear-actuator");
          else if (c.includes("robot") || c.includes("arm")) setCategory("robot");
          else if (c.includes("gear") || c.includes("reducer")) setCategory("gearbox");
        }
        if (prefill.applicationCategory) {
          setStep1((prev) => ({
            ...prev,
            applicationCategory: prefill.applicationCategory,
            automationGoal: prefill.automationGoal || prev.automationGoal,
            industry: prefill.industry || prev.industry,
          }));
        } else if (prefill.automationGoal) {
          setStep1((prev) => ({
            ...prev,
            automationGoal: prefill.automationGoal,
          }));
        }

        if (prefill.payloadKg || prefill.reachMm || prefill.cycleTimeSec) {
          setStep2Robot((prev) => ({
            ...prev,
            payloadKg: prefill.payloadKg || prev.payloadKg,
            reachMm: prefill.reachMm || prev.reachMm,
            cycleTimeSec: prefill.cycleTimeSec || prev.cycleTimeSec,
          }));
        }

        if (prefill.continuousTorqueNm || prefill.peakTorqueNm || prefill.outputSpeedRpm) {
          setStep2Rotary((prev) => ({
            ...prev,
            continuousTorqueNm: prefill.continuousTorqueNm || prev.continuousTorqueNm,
            peakTorqueNm: prefill.peakTorqueNm || prev.peakTorqueNm,
            outputSpeedRpm: prefill.outputSpeedRpm || prev.outputSpeedRpm,
          }));
        }

        if (prefill.thrustForceN || prefill.strokeMm || prefill.speedMmPerSec) {
          setStep2Linear((prev) => ({
            ...prev,
            thrustForceN: prefill.thrustForceN || prev.thrustForceN,
            strokeMm: prefill.strokeMm || prev.strokeMm,
            speedMmPerSec: prefill.speedMmPerSec || prev.speedMmPerSec,
          }));
        }

        if (prefill.fieldbusProtocol) {
          setStep3((prev) => ({
            ...prev,
            fieldbusProtocol: prefill.fieldbusProtocol || prev.fieldbusProtocol,
          }));
        }

        if (prefill.summary) {
          setStep4((prev) => ({
            ...prev,
            projectDescription: prefill.summary,
          }));
        }
      }
    } catch {
      // ignore
    }
  }, [searchParams]);

  const handleFormFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
    }
  };

  // Switch category and sync component defaults
  const handleSelectAppCategory = (catId: string) => {
    formStartedRef.current = true;
    const found = APPLICATION_CATEGORIES.find((c) => c.id === catId);
    setStep1((prev) => ({ ...prev, applicationCategory: catId }));
    if (found && found.defaultComponent) {
      setCategory(found.defaultComponent);
    }
    trackIndusEvent({
      event_name: "application_selected",
      application_type: catId,
      product_category: found?.defaultComponent || category,
      funnel_id: funnelIdRef.current,
      funnel_step: 1,
      funnel_stage: "application_selected",
      interaction_source: "wizard",
      details: found?.label || catId,
    });
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    formStartedRef.current = true;

    if (currentStep === 1) {
      if (!step1.automationGoal.trim()) {
        setErrorMessage("Please specify what process or machine you are trying to automate.");
        return;
      }
      trackIndusEvent({
        event_name: "application_selected",
        application_type: step1.applicationCategory,
        product_category: category,
        funnel_id: funnelIdRef.current,
        funnel_step: 1,
        funnel_stage: "application_selected",
        interaction_source: "wizard",
        details: step1.automationGoal,
      });
    }

    if (currentStep === 2) {
      trackIndusEvent({
        event_name: "technical_requirements_completed",
        application_type: step1.applicationCategory,
        product_category: category,
        funnel_id: funnelIdRef.current,
        funnel_step: 2,
        funnel_stage: "technical_requirements_completed",
        interaction_source: "wizard",
        details: `Category: ${category}`,
      });
      trackClarityEvent("technical_requirements_completed");
    }

    if (currentStep === 4) {
      // Transitioning to Step 5: Brief Review
      trackIndusEvent({
        event_name: "project_details_completed",
        application_type: step1.applicationCategory,
        product_category: category,
        funnel_id: funnelIdRef.current,
        funnel_step: 4,
        funnel_stage: "project_details_completed",
        interaction_source: "wizard",
        details: `Quantity: ${step4.estimatedQuantity}`,
      });
      trackIndusEvent({
        event_name: "review_screen_viewed",
        application_type: step1.applicationCategory,
        product_category: category,
        funnel_id: funnelIdRef.current,
        funnel_step: 5,
        funnel_stage: "review_screen_viewed",
        interaction_source: "wizard",
        details: "Application Brief Review Screen",
      });
      trackClarityEvent("review_screen_viewed");
    }

    trackDigitalPresence(
      "application_finder_step_completed",
      `Step ${currentStep} Completed`,
      `Category: ${category}`
    );
    trackClarityEvent(`application_finder_step_${currentStep}_complete`);

    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Compile structured application brief dossier
  const buildDossier = (type: "rfq" | "consultation") => {
    let mechanicalText = "";
    if (category === "robot") {
      mechanicalText = `
- System Type: Industrial Robot Kinematics
- Required Payload: ${step2Robot.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Robot.payloadKg} kg`}
- Required Reach: ${step2Robot.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Robot.reachMm} mm`}
- Repeatability: ${step2Robot.unknownSpecs ? "Standard ISO" : step2Robot.repeatabilityMm}
- Kinematic Axes: ${step2Robot.axes}
- Target Cycle Time: ${step2Robot.cycleTimeSec} sec
- Mounting: ${step2Robot.mounting}
      `.trim();
    } else if (category === "linear-actuator") {
      mechanicalText = `
- System Type: Linear Motion Actuator
- Required Thrust Force: ${step2Linear.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Linear.thrustForceN} N`}
- Stroke Length: ${step2Linear.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Linear.strokeMm} mm`}
- Linear Speed: ${step2Linear.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Linear.speedMmPerSec} mm/s`}
- Duty Cycle: ${step2Linear.dutyCyclePercent}%
- Orientation: ${step2Linear.orientation}
- Load Moments: ${step2Linear.overhungMomentNm} Nm
      `.trim();
    } else if (category === "rotary-actuator") {
      mechanicalText = `
- System Type: Intelligent Rotary Joint Actuator
- Continuous Torque: ${step2Rotary.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Rotary.continuousTorqueNm} Nm`}
- Peak Acceleration Torque: ${step2Rotary.peakTorqueNm} Nm
- Output Speed: ${step2Rotary.outputSpeedRpm} rpm
- Angular Travel: ${step2Rotary.angularTravelDeg}
- Positioning Accuracy / Backlash: ${step2Rotary.positioningAccuracy}
- Duty Cycle: ${step2Rotary.dutyCyclePercent}%
      `.trim();
    } else {
      mechanicalText = `
- System Type: Precision Reducer / Gearbox
- Output Torque: ${step2Gearbox.unknownSpecs ? "UNKNOWN / NEED SIZING" : `${step2Gearbox.outputTorqueNm} Nm`}
- Input Motor Speed: ${step2Gearbox.inputSpeedRpm} rpm
- Reduction Ratio: ${step2Gearbox.reductionRatio}
- Backlash Limit: ${step2Gearbox.backlashArcmin}
- Bearing Loads: ${step2Gearbox.radialAxialLoad}
      `.trim();
    }

    return `
======================================================
INDUS INDUSTRIAL ROBOTICS — APPLICATION BRIEF & RFQ
Mode: ${type === "consultation" ? "ENGINEERING CONSULTATION REQUEST" : "FORMAL APPLICATION RFQ"}
Submission Date: ${new Date().toISOString()}
======================================================

1. APPLICATION & INDUSTRY PROFILE
- Application Category: ${step1.applicationCategory.toUpperCase()}
- Automation Goal: ${step1.automationGoal}
- Target Industry: ${step1.industry}
- Project Classification: ${step1.projectNature}
- Main Operational Challenge: ${step1.operationalChallenge}
- Target Product Family: ${category.toUpperCase()}

2. MECHANICAL & KINEMATIC BOUNDARIES
${mechanicalText}

3. ENVIRONMENT & INGRESS INTEGRATION
- Operating Temperature: ${step3.operatingTemp}
- Ingress Rating (IP): ${step3.dustMoistureIP}
- Cleanroom Standard: ${step3.cleanroomClass}
- Power Supply Bus: ${step3.powerSupply}
- Supervisory PLC/Controller: ${step3.plcController}
- Fieldbus Protocol: ${step3.fieldbusProtocol}
- Equipment Interface: ${step3.interfaces}
- Safety Standard: ${step3.safetyRequirements}

4. BUSINESS SCOPE & TIMELINE
- Current Phase: ${step4.projectStage}
- Estimated Quantity: ${step4.estimatedQuantity}
- Target Implementation: ${step4.implementationDate}
- Customization Level: ${step4.customizationRequirements}
- Additional Engineering Notes: ${step4.projectDescription || "None provided"}

5. CONTACT PREFERENCES
- Full Name: ${step5.fullName.trim()}
- Company: ${step5.company.trim()}
- Work Email: ${step5.workEmail.trim()}
- Phone: ${step5.phoneNumber.trim() || "Not provided"}
- Preferred Channel: ${step5.preferredContact}
- NDA / GDPR Consent: Verified
    `.trim();
  };

  // Perform submission
  const handleSubmitDossier = async (type: "rfq" | "consultation") => {
    setErrorMessage(null);

    // Validate required fields in Step 6
    if (step5.fullName.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!step5.workEmail.includes("@") || !step5.workEmail.includes(".")) {
      setErrorMessage("Please provide a valid business email address.");
      return;
    }
    if (step5.company.trim().length < 2) {
      setErrorMessage("Please specify your company or organization name.");
      return;
    }
    if (!step5.consentPrivacy) {
      setErrorMessage("Please confirm data handling consent for engineering review.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionType(type);

    const fullDossier = buildDossier(type);
    const leadType =
      type === "consultation"
        ? "Application Engineering Consultation Request"
        : "Application Finder Sized RFQ";

    // Track submission attempt
    trackIndusEvent({
      event_name: "enquiry_submission_attempted",
      application_type: step1.applicationCategory,
      product_category: category,
      funnel_id: funnelIdRef.current,
      funnel_step: 6,
      funnel_stage: "enquiry_submission_attempted",
      interaction_source: "wizard",
      details: leadType,
    });
    trackClarityEvent("enquiry_submission_attempted");

    try {
      const res = await createJiraTask({
        data: {
          name: step5.fullName.trim(),
          company: step5.company.trim(),
          email: step5.workEmail.trim(),
          phone: step5.phoneNumber.trim() || undefined,
          product: `Application Finder [${category.toUpperCase()}] - ${step1.applicationCategory}`,
          quantity: step4.estimatedQuantity,
          requirements: fullDossier,
          type: leadType,
          labels: [
            "application-finder",
            "phase-3-rfq",
            category,
            step1.applicationCategory,
            type === "consultation" ? "consultation-lead" : "rfq-lead",
          ],
          preferredContact: step5.preferredContact,
          attribution: getYouTubeAttribution() ?? undefined,
        },
      });

      if (res && res.success) {
        submittedRef.current = true;
        const assignedKey = res.issueKey || "ENG-ROBOTICS";
        setTicketKey(assignedKey);
        setSubmissionSuccess(true);

        // Confirmed submission tracked only AFTER backend confirms Jira creation
        trackIndusEvent({
          event_name: "enquiry_submission_confirmed",
          application_type: step1.applicationCategory,
          product_category: category,
          funnel_id: funnelIdRef.current,
          funnel_step: 7,
          funnel_stage: "enquiry_submission_confirmed",
          interaction_source: "wizard",
          issue_key: assignedKey,
          details: `Confirmed Jira Ticket: ${assignedKey} (${type})`,
        });
        trackClarityEvent("enquiry_submission_confirmed");

        if (type === "consultation") {
          trackDigitalPresence("application_finder_consultation_requested", "Consultation Lead Created", assignedKey);
          trackClarityEvent("application_finder_consultation_requested");
        } else {
          trackDigitalPresence("application_finder_submitted", "RFQ Lead Created", assignedKey);
          trackClarityEvent("application_finder_submitted");
        }

        if (onSuccess) {
          onSuccess(assignedKey);
        }
      } else {
        throw new Error(res?.message || "Failed to transmit application brief.");
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(
        "Could not transmit application brief automatically. Our engineering desk remains reachable via WhatsApp or phone (+91 94440 24848)."
      );
      trackIndusEvent({
        event_name: "enquiry_submission_failed",
        application_type: step1.applicationCategory,
        product_category: category,
        funnel_id: funnelIdRef.current,
        funnel_step: 6,
        funnel_stage: "enquiry_submission_failed",
        interaction_source: "wizard",
        error_code: String(err?.message || err),
        details: "Submission error or network timeout",
      });
      trackDigitalPresence("application_finder_failed", "Submission Error", String(err));
      trackClarityEvent("application_finder_failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to determine missing parameters for the brief review
  const getMissingParameters = () => {
    const missing: string[] = [];
    if (category === "robot" && step2Robot.unknownSpecs) {
      missing.push("Kinematic payload envelope & reach requirements");
    }
    if (category === "linear-actuator" && step2Linear.unknownSpecs) {
      missing.push("Thrust force & stroke length");
    }
    if (category === "rotary-actuator" && step2Rotary.unknownSpecs) {
      missing.push("Continuous & peak torque ratings");
    }
    if (category === "gearbox" && step2Gearbox.unknownSpecs) {
      missing.push("Output torque and reduction ratio");
    }
    if (step3.operatingTemp.includes("Undecided") || step3.operatingTemp.includes("Unknown")) {
      missing.push("Operating temperature boundary");
    }
    if (step3.dustMoistureIP.includes("Undecided") || step3.dustMoistureIP.includes("Unknown")) {
      missing.push("Ingress protection level (IP rating)");
    }
    if (step3.fieldbusProtocol.includes("Undecided") || step3.fieldbusProtocol.includes("Unknown")) {
      missing.push("Industrial communication protocol / fieldbus");
    }
    if (step3.powerSupply.includes("Undecided") || step3.powerSupply.includes("Unknown")) {
      missing.push("Power supply voltage architecture");
    }
    return missing;
  };

  // Explainable product suggestions mapping (Mandate 4)
  const getExplainableProductSuggestion = () => {
    if (category === "rotary-actuator" || step1.applicationCategory === "precision-assembly" || step1.applicationCategory === "motion-control") {
      return {
        familyName: "IND-IRA Series (Intelligent Rotary Actuators)",
        href: "/products/actuators/rotary-actuators",
        whyRelevant:
          "Mechatronically integrates a frameless BLDC torque motor, zero-backlash strain-wave gear, dual absolute encoders, and an EtherCAT servo drive inside a single hollow-bore housing.",
        matchedSpecs: [
          `Target torque profile (${step2Rotary.unknownSpecs ? "Configurable" : `${step2Rotary.continuousTorqueNm} Nm cont.`})`,
          `Fieldbus compatibility (${step3.fieldbusProtocol.split(" ")[0]})`,
          `Supply voltage (${step3.powerSupply.split(" ")[0]})`,
        ],
        unknownSpecs: [
          "Reflected payload inertia ratio (JL/JM ≤ 5:1 required for high bandwidth)",
          "Overhung radial & axial bearing moment during dynamic deceleration",
        ],
        validationRequired:
          "Thermal simulation under full operational duty cycle and emergency stop braking energy dissipation audit.",
      };
    } else if (category === "linear-actuator" || step1.applicationCategory === "material-handling" || step1.applicationCategory === "inspection-qc" || step1.applicationCategory === "pick-and-place") {
      return {
        familyName: "IND-ILA Series (Intelligent Linear Actuators)",
        href: "/products/actuators/linear-actuators",
        whyRelevant:
          "Combines precision ground ball-screws, integrated servo commutation, absolute positioning, and dynamic linear guide blocks for high-thrust, rigid linear movement.",
        matchedSpecs: [
          `Force output (${step2Linear.unknownSpecs ? "Configurable" : `${step2Linear.thrustForceN} N thrust`})`,
          `Stroke range (${step2Linear.unknownSpecs ? "Configurable" : `${step2Linear.strokeMm} mm`})`,
          `Ingress protection (${step3.dustMoistureIP.split(" ")[0]})`,
        ],
        unknownSpecs: [
          "Overhung moment loading across stroke extremes",
          "Column buckling safety factor under dynamic compression",
        ],
        validationRequired:
          "Ball screw critical speed calculation (nc) and L10h bearing life verification under operational cycle time.",
      };
    } else if (category === "gearbox" || step1.applicationCategory === "custom-automation") {
      return {
        familyName: "IND-SWG & IND-RVG Precision Reducers",
        href: "/products/reducers",
        whyRelevant:
          "Zero-backlash strain-wave and high-stiffness RV cycloidal reducers designed for industrial robot joint articulation and high-ratio precision speed reduction.",
        matchedSpecs: [
          `Torque transmission (${step2Gearbox.unknownSpecs ? "Configurable" : `${step2Gearbox.outputTorqueNm} Nm`})`,
          `Reduction ratio (${step2Gearbox.reductionRatio})`,
          `Backlash threshold (${step2Gearbox.backlashArcmin})`,
        ],
        unknownSpecs: [
          "Input motor shaft concentricity and coupling runout",
          "External tilting moment under emergency stop conditions",
        ],
        validationRequired:
          "ISO 9283 torsional rigidity and lost-motion testing under reversing dynamic cyclic loads.",
      };
    } else {
      return {
        familyName: "INDUS 6-Axis Articulated Industrial Robotics",
        href: "/products/robotics",
        whyRelevant:
          "Designed for multi-axis handling, machine tending, and continuous path dispensing with high repeatability and modular tool-flange interfaces.",
        matchedSpecs: [
          `Payload class (${step2Robot.unknownSpecs ? "Configurable" : `${step2Robot.payloadKg} kg`})`,
          `Radial reach envelope (${step2Robot.unknownSpecs ? "Configurable" : `${step2Robot.reachMm} mm`})`,
          `Safety interface (${step3.safetyRequirements.includes("STO") ? "STO SIL2/PLd" : "Standard"})`,
        ],
        unknownSpecs: [
          "End-effector mass & center-of-gravity offset",
          "Singularity-free trajectory envelope inside actual cell footprint",
        ],
        validationRequired:
          "3D kinematic cycle-time reach simulation and joint torque thermal headroom audit.",
      };
    }
  };

  const missingParams = getMissingParameters();
  const productSuggestion = getExplainableProductSuggestion();

  // ---------------------------------------------------------------------------
  // SUCCESS SCREEN
  // ---------------------------------------------------------------------------
  if (submissionSuccess) {
    return (
      <div className="rounded-2xl border border-[#D1E0FF] bg-white p-7 sm:p-10 text-center shadow-lg max-w-2xl mx-auto">
        <div className="mx-auto size-16 rounded-full bg-[#EFF6FF] text-[#155EEF] grid place-items-center mb-4 border border-[#B2CCFF]">
          <CheckCircle2 size={36} />
        </div>
        <span className="rounded bg-[#EFF6FF] px-3.5 py-1 font-mono text-xs font-bold text-[#155EEF] border border-[#B2CCFF]">
          Jira Ticket ID: {ticketKey}
        </span>
        <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-[#172033]">
          {submissionType === "consultation"
            ? "Engineering Consultation Scheduled"
            : "Application Brief Successfully Registered"}
        </h3>
        <p className="mt-3 text-sm text-[#475467] leading-relaxed max-w-lg mx-auto">
          {submissionType === "consultation"
            ? "An INDUS senior kinematics engineer will review your application requirements, address missing parameters, and schedule a technical sizing review."
            : "Your technical parameters have been routed directly to our Motion & Kinematics engineering team. A formal application sizing dossier and quotation will be delivered within 24 hours."}
        </p>

        <div className="mt-5 p-4 rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] text-left text-xs max-w-md mx-auto space-y-1.5 font-mono text-[#344054]">
          <div className="flex justify-between">
            <span className="text-[#667085]">Lead Reference:</span>
            <span className="font-bold text-[#172033]">{ticketKey}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#667085]">Category:</span>
            <span className="font-bold text-[#155EEF]">{category.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#667085]">Assigned Team:</span>
            <span className="font-bold text-[#172033]">Motion &amp; Kinematics Applications</span>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {onClose && (
            <Button
              onClick={onClose}
              className="bg-[#155EEF] text-white hover:bg-[#1047BF] font-bold text-xs uppercase px-6"
            >
              Close Application Finder
            </Button>
          )}
          <a
            href={`https://wa.me/919444024848?text=Hello%20INDUS%20Engineering,%20I%20have%20submitted%20Application%20Brief%20${ticketKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#EFF6FF] transition-colors"
          >
            <Phone size={13} className="text-[#16A34A]" /> Connect on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN WIZARD INTERFACE (6 Structured Steps)
  // ---------------------------------------------------------------------------
  return (
    <div
      onFocus={handleFormFocus}
      className="rounded-2xl border border-[#E5EAF1] bg-white p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] max-w-3xl mx-auto"
    >
      {/* 1. Header & Step Progress Bar */}
      <div className="border-b border-[#E5EAF1] pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#EFF6FF] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
                Guided Sizing Workflow
              </span>
              <span className="text-xs text-[#667085]">Step {currentStep} of 6</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033] mt-1 tracking-tight">
              {currentStep === 1 && "1. Target Application & Process"}
              {currentStep === 2 && "2. Technical & Kinematic Requirements"}
              {currentStep === 3 && "3. Environment, Ingress & Integration"}
              {currentStep === 4 && "4. Project Stage, Timeline & Quantity"}
              {currentStep === 5 && "5. Application Brief & Engineering Review"}
              {currentStep === 6 && "6. Contact & Proposal Dispatch"}
            </h2>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center gap-1.5" aria-label={`Step ${currentStep} of 6`}>
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-200 ${
                  s === currentStep
                    ? "w-8 bg-[#155EEF]"
                    : s < currentStep
                    ? "w-4 bg-[#16A34A]"
                    : "w-4 bg-[#E5EAF1]"
                }`}
                title={`Step ${s}`}
              />
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {transferredNotice && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#155EEF]/30 bg-[#EFF6FF] p-4 text-[#172033] shadow-xs">
          <Sparkles className="size-5 text-[#155EEF] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-[#155EEF] uppercase tracking-wider text-[11px]">
              {transferredTitle}
            </div>
            <p className="mt-1 text-[#475467] leading-relaxed">
              Your preliminary automation requirements have been automatically applied to this engineering brief.
              You can review, adjust, or expand any parameters in the steps below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTransferredNotice(false)}
            aria-label="Dismiss notice"
            className="text-xs text-[#667085] hover:text-[#172033] p-1 rounded hover:bg-white/50 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* =======================================================================
          STEP 1: APPLICATION CATEGORY & PROCESS
         ======================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1.5">
              Select Application Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {APPLICATION_CATEGORIES.map((cat) => {
                const isSelected = step1.applicationCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectAppCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#155EEF] bg-[#EFF6FF] text-[#155EEF] shadow-xs ring-1 ring-[#155EEF]"
                        : "border-[#E5EAF1] bg-[#F8FAFC] text-[#344054] hover:border-[#B2CCFF] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172033]">{cat.label}</span>
                      {isSelected && <Check size={14} className="text-[#155EEF]" />}
                    </div>
                    <p className="mt-1 text-[11px] text-[#667085] leading-normal">{cat.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Component Family Override Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              Target Component Family
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "rotary-actuator", label: "Rotary Actuator", icon: <RotateCw size={13} /> },
                { id: "linear-actuator", label: "Linear Actuator", icon: <Activity size={13} /> },
                { id: "robot", label: "Robot Arm / Cell", icon: <Boxes size={13} /> },
                { id: "gearbox", label: "Precision Gearbox", icon: <Cpu size={13} /> },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    category === c.id
                      ? "border-[#155EEF] bg-[#EFF6FF] text-[#155EEF]"
                      : "border-[#E5EAF1] bg-[#F8FAFC] text-[#475467] hover:border-[#B2CCFF]"
                  }`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                What are you trying to automate? *
              </label>
              <Input
                placeholder="e.g. Automated palletizing, CNC machine loading, battery assembly"
                value={step1.automationGoal}
                onChange={(e) => setStep1({ ...step1, automationGoal: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Target Industry Sector
              </label>
              <select
                value={step1.industry}
                onChange={(e) => setStep1({ ...step1, industry: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033] focus:border-[#155EEF] focus:outline-none"
              >
                <option>Automotive & EV</option>
                <option>Electronics & Semiconductors</option>
                <option>Aerospace & Defence</option>
                <option>Medical Devices & Healthcare</option>
                <option>Metal Machining & Fabrication</option>
                <option>Food, Beverage & Pharmaceutical</option>
                <option>Logistics & Warehousing</option>
                <option>Custom Automation & Machinery</option>
                <option>Other Industry</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Project Classification
              </label>
              <select
                value={step1.projectNature}
                onChange={(e) => setStep1({ ...step1, projectNature: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033] focus:border-[#155EEF] focus:outline-none"
              >
                <option>New Machine Build (Greenfield)</option>
                <option>System Upgrade & Optimization</option>
                <option>Replacement of Legacy Pneumatic / Hydraulic</option>
                <option>Direct OEM Component Supply</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Main Operational Challenge
              </label>
              <select
                value={step1.operationalChallenge}
                onChange={(e) => setStep1({ ...step1, operationalChallenge: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033] focus:border-[#155EEF] focus:outline-none"
              >
                <option>Cycle Time / Takt Reduction</option>
                <option>High Payload / Overhung Moment Capacity</option>
                <option>Sub-millimeter Repeatability & Zero Backlash</option>
                <option>Harsh Washdown / Chemical IP Exposure</option>
                <option>Space / Tight Installation Envelope</option>
                <option>Continuous 24/7 Duty Cycle / Thermal Rise</option>
                <option>Other / Not Sure</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STEP 2: TECHNICAL REQUIREMENTS (CONDITIONAL BY CATEGORY)
         ======================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF1]">
            <span className="text-xs font-bold uppercase text-[#155EEF]">
              Category: {category.replace("-", " ").toUpperCase()} REQUIREMENTS
            </span>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#667085] cursor-pointer">
              <input
                type="checkbox"
                checked={
                  category === "robot"
                    ? step2Robot.unknownSpecs
                    : category === "linear-actuator"
                    ? step2Linear.unknownSpecs
                    : category === "rotary-actuator"
                    ? step2Rotary.unknownSpecs
                    : step2Gearbox.unknownSpecs
                }
                onChange={(e) => {
                  const val = e.target.checked;
                  if (category === "robot") setStep2Robot({ ...step2Robot, unknownSpecs: val });
                  else if (category === "linear-actuator") setStep2Linear({ ...step2Linear, unknownSpecs: val });
                  else if (category === "rotary-actuator") setStep2Rotary({ ...step2Rotary, unknownSpecs: val });
                  else setStep2Gearbox({ ...step2Gearbox, unknownSpecs: val });
                }}
                className="rounded border-[#D0D5DD] text-[#155EEF]"
              />
              <span>I don't know exact specs (Request Sizing Assistance)</span>
            </label>
          </div>

          {/* ROBOT CONDITIONAL FIELDS */}
          {category === "robot" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Required Payload (kg)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 5, 12, 25, 50"
                  value={step2Robot.payloadKg}
                  onChange={(e) => setStep2Robot({ ...step2Robot, payloadKg: e.target.value })}
                  disabled={step2Robot.unknownSpecs}
                  className="text-xs font-mono"
                />
                <span className="text-[10.5px] text-[#667085]">Mass of part + gripper end-effector tooling</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Required Reach Radius (mm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 850, 1100, 1400, 1800"
                  value={step2Robot.reachMm}
                  onChange={(e) => setStep2Robot({ ...step2Robot, reachMm: e.target.value })}
                  disabled={step2Robot.unknownSpecs}
                  className="text-xs font-mono"
                />
                <span className="text-[10.5px] text-[#667085]">Radial working distance from base center to tool center</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Repeatability Requirement
                </label>
                <select
                  value={step2Robot.repeatabilityMm}
                  onChange={(e) => setStep2Robot({ ...step2Robot, repeatabilityMm: e.target.value })}
                  disabled={step2Robot.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>±0.01 mm (High-Precision Assembly)</option>
                  <option>±0.02 mm (Standard Precision)</option>
                  <option>±0.03 mm (General Handling)</option>
                  <option>±0.05 mm (Packaging / Palletizing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Number of Kinematic Axes
                </label>
                <select
                  value={step2Robot.axes}
                  onChange={(e) => setStep2Robot({ ...step2Robot, axes: e.target.value })}
                  disabled={step2Robot.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>6-Axis Articulated Arm</option>
                  <option>4-Axis SCARA</option>
                  <option>7-Axis Redundant Articulated</option>
                  <option>Cartesian / Delta Architecture</option>
                  <option>Unknown / Sizing Recommendation Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Target Cycle-Time (seconds)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 3.0, 4.5, 8.0"
                  value={step2Robot.cycleTimeSec}
                  onChange={(e) => setStep2Robot({ ...step2Robot, cycleTimeSec: e.target.value })}
                  disabled={step2Robot.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Mounting Orientation
                </label>
                <select
                  value={step2Robot.mounting}
                  onChange={(e) => setStep2Robot({ ...step2Robot, mounting: e.target.value })}
                  disabled={step2Robot.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>Floor Mount</option>
                  <option>Ceiling / Inverted Mount</option>
                  <option>Wall Mount</option>
                  <option>Slanted / Mobile Base Mount</option>
                </select>
              </div>
            </div>
          )}

          {/* LINEAR ACTUATOR CONDITIONAL FIELDS */}
          {category === "linear-actuator" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Required Thrust Force (N)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 500, 1200, 3500, 8000"
                  value={step2Linear.thrustForceN}
                  onChange={(e) => setStep2Linear({ ...step2Linear, thrustForceN: e.target.value })}
                  disabled={step2Linear.unknownSpecs}
                  className="text-xs font-mono"
                />
                <span className="text-[10.5px] text-[#667085]">Continuous push/pull axial force</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Stroke Length (mm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 150, 300, 600, 1200"
                  value={step2Linear.strokeMm}
                  onChange={(e) => setStep2Linear({ ...step2Linear, strokeMm: e.target.value })}
                  disabled={step2Linear.unknownSpecs}
                  className="text-xs font-mono"
                />
                <span className="text-[10.5px] text-[#667085]">Total usable travel displacement</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Linear Speed (mm/s)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 200, 500, 1000"
                  value={step2Linear.speedMmPerSec}
                  onChange={(e) => setStep2Linear({ ...step2Linear, speedMmPerSec: e.target.value })}
                  disabled={step2Linear.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Duty Cycle (%)
                </label>
                <select
                  value={step2Linear.dutyCyclePercent}
                  onChange={(e) => setStep2Linear({ ...step2Linear, dutyCyclePercent: e.target.value })}
                  disabled={step2Linear.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option value="25">25% (Intermittent Operation)</option>
                  <option value="50">50% (Standard Machine Duty)</option>
                  <option value="75">75% (High Takt Cycle)</option>
                  <option value="100">100% (Continuous 24/7)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Mounting Orientation
                </label>
                <select
                  value={step2Linear.orientation}
                  onChange={(e) => setStep2Linear({ ...step2Linear, orientation: e.target.value })}
                  disabled={step2Linear.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>Horizontal Slide</option>
                  <option>Vertical Z-Axis (Requires Holding Brake)</option>
                  <option>Inverted Ceiling</option>
                  <option>Slanted Angle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  External Loads &amp; Moments (Nm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 120 Nm pitch / roll"
                  value={step2Linear.overhungMomentNm}
                  onChange={(e) => setStep2Linear({ ...step2Linear, overhungMomentNm: e.target.value })}
                  disabled={step2Linear.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* ROTARY ACTUATOR CONDITIONAL FIELDS */}
          {category === "rotary-actuator" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Continuous Torque (Nm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 15, 35, 85, 175, 320"
                  value={step2Rotary.continuousTorqueNm}
                  onChange={(e) => setStep2Rotary({ ...step2Rotary, continuousTorqueNm: e.target.value })}
                  disabled={step2Rotary.unknownSpecs}
                  className="text-xs font-mono"
                />
                <span className="text-[10.5px] text-[#667085]">Continuous thermal equilibrium rating</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Peak Acceleration Torque (Nm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 40, 95, 210, 450"
                  value={step2Rotary.peakTorqueNm}
                  onChange={(e) => setStep2Rotary({ ...step2Rotary, peakTorqueNm: e.target.value })}
                  disabled={step2Rotary.unknownSpecs}
                  className="text-xs font-mono"
                />
                <span className="text-[10.5px] text-[#667085]">Peak transient acceleration torque</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Output Speed (rpm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 15, 30, 45, 90"
                  value={step2Rotary.outputSpeedRpm}
                  onChange={(e) => setStep2Rotary({ ...step2Rotary, outputSpeedRpm: e.target.value })}
                  disabled={step2Rotary.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Angular Travel
                </label>
                <select
                  value={step2Rotary.angularTravelDeg}
                  onChange={(e) => setStep2Rotary({ ...step2Rotary, angularTravelDeg: e.target.value })}
                  disabled={step2Rotary.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>360 Continuous (Continuous Rotation)</option>
                  <option>±180 Limited Joint Travel</option>
                  <option>±90 Limited Indexing</option>
                  <option>Multi-turn Coordinate Positioning</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Positioning Requirements / Backlash
                </label>
                <select
                  value={step2Rotary.positioningAccuracy}
                  onChange={(e) => setStep2Rotary({ ...step2Rotary, positioningAccuracy: e.target.value })}
                  disabled={step2Rotary.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>&lt; 0.5 arcmin (Sub-arcminute Zero-Backlash)</option>
                  <option>&lt; 1.0 arcmin (Precision Robotic Joint)</option>
                  <option>&lt; 3.0 arcmin (Standard Industrial Indexing)</option>
                  <option>Unknown / Engineering Guidance Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Duty Cycle (%)
                </label>
                <select
                  value={step2Rotary.dutyCyclePercent}
                  onChange={(e) => setStep2Rotary({ ...step2Rotary, dutyCyclePercent: e.target.value })}
                  disabled={step2Rotary.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option value="40">40% Duty Cycle</option>
                  <option value="60">60% Duty Cycle</option>
                  <option value="80">80% Duty Cycle</option>
                  <option value="100">100% Continuous Duty</option>
                </select>
              </div>
            </div>
          )}

          {/* GEARBOX CONDITIONAL FIELDS */}
          {category === "gearbox" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Required Output Torque (Nm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 80, 160, 350, 850"
                  value={step2Gearbox.outputTorqueNm}
                  onChange={(e) => setStep2Gearbox({ ...step2Gearbox, outputTorqueNm: e.target.value })}
                  disabled={step2Gearbox.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Input Motor Speed (rpm)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 3000, 4500, 6000"
                  value={step2Gearbox.inputSpeedRpm}
                  onChange={(e) => setStep2Gearbox({ ...step2Gearbox, inputSpeedRpm: e.target.value })}
                  disabled={step2Gearbox.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Reduction Ratio
                </label>
                <select
                  value={step2Gearbox.reductionRatio}
                  onChange={(e) => setStep2Gearbox({ ...step2Gearbox, reductionRatio: e.target.value })}
                  disabled={step2Gearbox.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>30:1</option>
                  <option>50:1 (Standard Strain Wave)</option>
                  <option>80:1</option>
                  <option>100:1</option>
                  <option>160:1</option>
                  <option>Custom / Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Backlash Requirement
                </label>
                <select
                  value={step2Gearbox.backlashArcmin}
                  onChange={(e) => setStep2Gearbox({ ...step2Gearbox, backlashArcmin: e.target.value })}
                  disabled={step2Gearbox.unknownSpecs}
                  className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
                >
                  <option>&lt; 0.5 arcmin (Harmonic Zero-Backlash)</option>
                  <option>&lt; 1.0 arcmin (RV Cycloidal High-Stiffness)</option>
                  <option>&lt; 3.0 arcmin (Helical Planetary)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#172033] mb-1">
                  Radial, Axial &amp; Tilting Moment Loads (where known)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 3200 N Radial / 1800 N Axial / 450 Nm Tilting Moment"
                  value={step2Gearbox.radialAxialLoad}
                  onChange={(e) => setStep2Gearbox({ ...step2Gearbox, radialAxialLoad: e.target.value })}
                  disabled={step2Gearbox.unknownSpecs}
                  className="text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* =======================================================================
          STEP 3: ENVIRONMENT & INTEGRATION
         ======================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Operating Temperature Range
              </label>
              <select
                value={step3.operatingTemp}
                onChange={(e) => setStep3({ ...step3, operatingTemp: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Standard Ambient (15°C to 35°C)</option>
                <option>Extended Industrial (-10°C to 50°C)</option>
                <option>Extreme Low Temp (-40°C Cold Storage)</option>
                <option>High Heat (&gt; 60°C Foundry / Thermal)</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Ingress &amp; Environmental Exposure
              </label>
              <select
                value={step3.dustMoistureIP}
                onChange={(e) => setStep3({ ...step3, dustMoistureIP: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>IP54 Standard Indoor Shopfloor</option>
                <option>IP65 Dust-tight &amp; Water Jet Protected</option>
                <option>IP67 Washdown Proof / Sealed Submersion</option>
                <option>IP69K High-Pressure Steam / Food Washdown</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Cleanroom Requirements
              </label>
              <select
                value={step3.cleanroomClass}
                onChange={(e) => setStep3({ ...step3, cleanroomClass: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Standard Industrial (No Cleanroom)</option>
                <option>ISO 14644-1 Class 5 (Fed 100 Semiconductor)</option>
                <option>ISO 14644-1 Class 6 (Electronics Assembly)</option>
                <option>ISO 14644-1 Class 7 / Class 8 (Pharma / Medical)</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Available Power Supply
              </label>
              <select
                value={step3.powerSupply}
                onChange={(e) => setStep3({ ...step3, powerSupply: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>48V DC Regulated Bus (Joint Actuators)</option>
                <option>24V DC Industrial Control Bus</option>
                <option>3-Phase 380V–480V AC (Standard factory grid)</option>
                <option>Single-Phase 230V AC</option>
                <option>Battery Bus 48V–96V (Mobile AMR / AGV)</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Supervisory PLC / Controller System
              </label>
              <select
                value={step3.plcController}
                onChange={(e) => setStep3({ ...step3, plcController: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Beckhoff TwinCAT 3 (EtherCAT)</option>
                <option>Siemens S7-1500 / TIA Portal (PROFINET)</option>
                <option>Omron Sysmac NJ/NX (EtherCAT)</option>
                <option>Rockwell ControlLogix (EtherNet/IP)</option>
                <option>CODESYS V3.5 SoftPLC</option>
                <option>Open-source ROS 2 / LinuxCNC</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Fieldbus Communication Protocol
              </label>
              <select
                value={step3.fieldbusProtocol}
                onChange={(e) => setStep3({ ...step3, fieldbusProtocol: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>EtherCAT (CoE / CiA 402)</option>
                <option>PROFINET RT / IRT</option>
                <option>EtherNet/IP CIP Sync</option>
                <option>CANopen (DS402)</option>
                <option>Modbus TCP / RTU</option>
                <option>Analog ±10V / Pulse &amp; Direction</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Existing Equipment Interface
              </label>
              <select
                value={step3.interfaces}
                onChange={(e) => setStep3({ ...step3, interfaces: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Standard ISO 9409-1 Robot Flange</option>
                <option>Hollow Shaft Center Pass-Through</option>
                <option>Keyed Solid Shaft Output</option>
                <option>DIN Rail / Profile Slide Carrier</option>
                <option>Custom Machined Adapter Needed</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Safety Requirements
              </label>
              <select
                value={step3.safetyRequirements}
                onChange={(e) => setStep3({ ...step3, safetyRequirements: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>EN ISO 13849-1 Safe Torque Off (STO SIL2 / PLd)</option>
                <option>Safe Brake Control (SBC) for vertical gravity loads</option>
                <option>Safely-Limited Speed (SLS) for collaborative cells</option>
                <option>Standard CE Machinery Directive 2006/42/EC</option>
                <option>Unknown / Undecided</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STEP 4: PROJECT STAGE, TIMELINE & DRAWINGS
         ======================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Current Project Phase
              </label>
              <select
                value={step4.projectStage}
                onChange={(e) => setStep4({ ...step4, projectStage: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Concept Feasibility &amp; Kinematic Evaluation</option>
                <option>Detailed 3D CAD &amp; Mechanical Design</option>
                <option>Prototype Build &amp; Alpha Testing</option>
                <option>Volume Series Production Rollout</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Estimated Quantity
              </label>
              <select
                value={step4.estimatedQuantity}
                onChange={(e) => setStep4({ ...step4, estimatedQuantity: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>1–2 units (Prototype / Evaluation)</option>
                <option>3–10 units (Pilot Workcell Line)</option>
                <option>10–50 units / year (Batch Series)</option>
                <option>50+ units / year (OEM Annual Supply Agreement)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Target Commissioning Date
              </label>
              <select
                value={step4.implementationDate}
                onChange={(e) => setStep4({ ...step4, implementationDate: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Urgent (&lt; 4 Weeks)</option>
                <option>Within 2–3 Months</option>
                <option>Within 6 Months</option>
                <option>Planning for Next Budget Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Customization Requirements
              </label>
              <select
                value={step4.customizationRequirements}
                onChange={(e) => setStep4({ ...step4, customizationRequirements: e.target.value })}
                className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
              >
                <option>Standard Catalogue Model is acceptable</option>
                <option>Custom Flange / Output Adapter Pattern</option>
                <option>Custom Cable Harness / Pinout</option>
                <option>Special Lubrication (Food-grade / Vacuum)</option>
                <option>Fully Bespoke Kinematic Assembly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Project Description / Specific Operational Constraints (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Describe mounting envelopes, duty cycle specifics, reflected inertia estimates, or required 3D CAD formats..."
              value={step4.projectDescription}
              onChange={(e) => setStep4({ ...step4, projectDescription: e.target.value })}
              className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-2.5 text-xs text-[#172033] focus:border-[#155EEF] focus:outline-none"
            />
          </div>

          {/* Secure Drawing Transmission Notice */}
          <div className="rounded-xl border border-[#D1E0FF] bg-[#EFF6FF] p-3.5 flex items-start gap-3">
            <Lock size={16} className="text-[#155EEF] shrink-0 mt-0.5" />
            <div className="text-xs text-[#344054]">
              <strong className="text-[#172033] block mb-0.5">Secure 3D CAD &amp; Drawing Exchange:</strong>
              CAD models (.STEP, .IGES, .DXF) and cell drawings are protected under strict bilateral NDA protocols.
              You can email files directly to <code className="text-[#155EEF] font-mono">engineering@indus-robotics.com</code> or
              request a secure end-to-end encrypted transfer link once your ticket key is generated.
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STEP 5: APPLICATION BRIEF GENERATION & EXPLAINABLE SUGGESTIONS
         ======================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-[#D1E0FF] bg-[#EFF6FF] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF] flex items-center gap-1.5">
                <FileCheck size={14} /> Compiled Application Dossier
              </span>
              <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[#155EEF] border border-[#B2CCFF]">
                Pre-Submission Review
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-[#D1E0FF]/60 pt-3">
              <div>
                <span className="text-[#667085] block text-[10.5px]">Application:</span>
                <strong className="text-[#172033] font-semibold">{step1.applicationCategory}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[10.5px]">Industry:</span>
                <strong className="text-[#172033] font-semibold">{step1.industry}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[10.5px]">Fieldbus:</span>
                <strong className="text-[#172033] font-semibold">{step3.fieldbusProtocol.split(" ")[0]}</strong>
              </div>
              <div>
                <span className="text-[#667085] block text-[10.5px]">Power Bus:</span>
                <strong className="text-[#172033] font-semibold">{step3.powerSupply.split(" ")[0]}</strong>
              </div>
            </div>
          </div>

          {/* Missing Engineering Information Box (Mandate 3) */}
          {missingParams.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <AlertTriangle size={15} className="text-amber-600" />
                <span>Pending Engineering Parameters ({missingParams.length})</span>
              </div>
              <p className="mt-1 text-[11.5px] text-amber-900 leading-relaxed">
                The following parameters are currently marked as unknown or undecided. Our engineering team will assist in sizing these during kinematic review:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-800 list-disc list-inside">
                {missingParams.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-[#D1FADF] bg-[#F6FEF9] p-3 flex items-center gap-2 text-xs text-[#027A48]">
              <CheckCircle2 size={15} />
              <span>All primary mechanical and electrical boundary parameters have been defined.</span>
            </div>
          )}

          {/* Next Engineering Checks Required (Mandate 3) */}
          <div className="rounded-xl border border-[#E5EAF1] bg-[#F8FAFC] p-4 text-xs">
            <h4 className="font-bold text-[#172033] flex items-center gap-1.5 mb-2">
              <Compass size={14} className="text-[#155EEF]" /> Next Engineering Validation Checks:
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-[#475467]">
              <div className="flex items-start gap-1.5">
                <span className="text-[#155EEF] font-bold">•</span>
                <span>Reflected load inertia ratio calculation (<code className="font-mono text-[#172033]">JL/JM ≤ 5:1</code>)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#155EEF] font-bold">•</span>
                <span>Thermal equilibrium simulation across 100% duty cycle</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#155EEF] font-bold">•</span>
                <span>Dynamic torsional stiffness &amp; deflection analysis</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#155EEF] font-bold">•</span>
                <span>Deterministic fieldbus cycle time &amp; jitter synchronization</span>
              </div>
            </div>
          </div>

          {/* Explainable Product Family Suggestion (Mandate 4) */}
          <div className="rounded-xl border border-[#E5EAF1] bg-white p-4.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5EAF1]">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#155EEF]" />
                <span className="text-xs font-bold text-[#172033]">
                  Suggested Hardware Family: {productSuggestion.familyName}
                </span>
              </div>
              <Link
                to={productSuggestion.href}
                target="_blank"
                className="text-[11px] font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
              >
                View Catalogue <ExternalLink size={10} />
              </Link>
            </div>

            <p className="text-xs text-[#475467] leading-relaxed mb-3">
              <strong className="text-[#172033]">Why Relevant:</strong> {productSuggestion.whyRelevant}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1]">
                <span className="text-[10px] font-mono font-bold uppercase text-[#16A34A] block mb-1">
                  Matching Specifications
                </span>
                <ul className="space-y-0.5 text-[#344054]">
                  {productSuggestion.matchedSpecs.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1 text-[11.5px]">
                      <Check size={11} className="text-[#16A34A] shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF1]">
                <span className="text-[10px] font-mono font-bold uppercase text-[#667085] block mb-1">
                  Required Engineering Validation
                </span>
                <p className="text-[11.5px] text-[#475467] leading-tight">
                  {productSuggestion.validationRequired}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[10.5px] text-[#667085] italic border-t border-[#F0F4F8]">
              * Engineering Sizing Disclosure: Sizing suggestions are preliminary. INDUS will perform formal kinematic simulation prior to binding commercial quotation. Never use robot payload as a substitute for actuator torque or gearbox load capacity.
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          STEP 6: CONTACT DETAILS & DUAL SUBMISSION
         ======================================================================= */}
      {currentStep === 6 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#D1E0FF] bg-[#EFF6FF] p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#155EEF]">Application Brief Ready for Dispatch</span>
              <span className="font-mono text-[10.5px] text-[#475467]">NDA Protected Transmission</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Full Name *
              </label>
              <Input
                required
                placeholder="e.g. Dr. Markus Weber"
                value={step5.fullName}
                onChange={(e) => setStep5({ ...step5, fullName: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Company / Organization *
              </label>
              <Input
                required
                placeholder="e.g. Apex Robotics Systems GmbH"
                value={step5.company}
                onChange={(e) => setStep5({ ...step5, company: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Work Email *
              </label>
              <Input
                required
                type="email"
                placeholder="name@company.com"
                value={step5.workEmail}
                onChange={(e) => setStep5({ ...step5, workEmail: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Phone Number (with Country Code)
              </label>
              <Input
                placeholder="+49 171 1234567 or +91 94440..."
                value={step5.phoneNumber}
                onChange={(e) => setStep5({ ...step5, phoneNumber: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Preferred Consultation Format
            </label>
            <select
              value={step5.preferredContact}
              onChange={(e) => setStep5({ ...step5, preferredContact: e.target.value })}
              className="w-full rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] px-3 py-2 text-xs text-[#172033]"
            >
              <option>Email Formal Sizing Report &amp; Quotation</option>
              <option>WhatsApp Direct Engineering Desk</option>
              <option>Direct Phone Call with Applications Engineer</option>
              <option>Microsoft Teams / Video Screen Share</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-[#475467] cursor-pointer">
              <input
                type="checkbox"
                checked={step5.consentPrivacy}
                onChange={(e) => setStep5({ ...step5, consentPrivacy: e.target.checked })}
                className="mt-0.5 rounded border-[#D0D5DD] text-[#155EEF]"
              />
              <span>
                I agree to the processing of application requirements in accordance with INDUS bilateral NDA and privacy policy. No unsolicited marketing.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* =======================================================================
          NAVIGATION CONTROLS & SUBMISSION ACTIONS
         ======================================================================= */}
      <div className="mt-7 pt-4 border-t border-[#E5EAF1] flex flex-wrap items-center justify-between gap-3">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            className="border-[#E5EAF1] text-xs font-semibold text-[#475467] hover:bg-[#F8FAFC]"
          >
            <ArrowLeft size={13} className="mr-1.5" /> Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 6 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-5 shadow-xs"
          >
            Continue to {currentStep === 4 ? "Application Brief" : `Step ${currentStep + 1}`}{" "}
            <ArrowRight size={13} className="ml-1.5" />
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Alternative Action for users lacking essential technical details */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmitDossier("consultation")}
              disabled={isSubmitting}
              className="border-[#B2CCFF] bg-[#EFF6FF] text-[#155EEF] hover:bg-[#D1E9FF] font-bold text-xs uppercase px-4 shadow-2xs"
            >
              {isSubmitting && submissionType === "consultation" ? (
                <>
                  <Loader2 size={13} className="mr-1.5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Compass size={13} className="mr-1.5" /> Request Engineering Consultation
                </>
              )}
            </Button>

            {/* Standard RFQ Submission */}
            <Button
              type="button"
              onClick={() => handleSubmitDossier("rfq")}
              disabled={isSubmitting}
              className="bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold text-xs uppercase px-6 shadow-sm"
            >
              {isSubmitting && submissionType === "rfq" ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" /> Registering RFQ...
                </>
              ) : (
                <>
                  <Send size={13} className="mr-1.5" /> Submit Application RFQ
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
