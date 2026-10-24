/**
 * INDUS Industrial Robotics — Intelligent Actuator AI & Application Bridge
 * 
 * Facilitates verified communication between the Intelligent Actuator Studio,
 * the INDUS Robotics Guide AI assistant, and the Application Finder Wizard.
 */

export interface ActuatorBridgeQueryOptions {
  query: string;
  autoOpen?: boolean;
}

/**
 * Dispatches a prompt to the global INDUS Robotics Guide assistant.
 * Does not create a duplicate chatbot — invokes the existing singleton assistant.
 */
export function askRoboticsGuide(query: string) {
  if (typeof window === "undefined") return;
  const event = new CustomEvent("indus-robotics-guide-prompt", {
    detail: { query, autoOpen: true },
  });
  window.dispatchEvent(event);
}

/**
 * Formatted prompt generators based on verified engineering specifications
 */
export const ActuatorAIActions = {
  /**
   * Action 1: Explain this specification
   */
  explainSpecification: (specName: string, value: string, modelCode: string) => {
    const prompt = `Please explain the engineering significance of the specification "${specName}" (${value}) on actuator model ${modelCode}. How does it affect dynamic motion and thermal duty cycle?`;
    askRoboticsGuide(prompt);
  },

  /**
   * Action 2: Compare these models
   */
  compareModels: (modelA: string, modelB: string) => {
    const prompt = `Compare actuator models ${modelA} vs ${modelB}. What are the primary differences in rated torque/thrust, output speed, mass, and mechanical flange sizing?`;
    askRoboticsGuide(prompt);
  },

  /**
   * Action 3: Find an actuator for my application
   */
  findActuatorForApplication: (applicationName: string, requirements?: string) => {
    const reqText = requirements ? ` with requirements: ${requirements}` : "";
    const prompt = `I need an actuator for ${applicationName}${reqText}. Which INDUS intelligent rotary or linear actuator model fits this kinematic envelope?`;
    askRoboticsGuide(prompt);
  },

  /**
   * Action 4: Explain a diagnostic indicator
   */
  explainDiagnosticIndicator: (indicatorName: string, observedValue: string, threshold: string) => {
    const prompt = `Explain the diagnostic indicator "${indicatorName}". Current observed telemetry is ${observedValue} against verified limit ${threshold}. What are the possible causes and recommended engineering checks?`;
    askRoboticsGuide(prompt);
  },

  /**
   * Action 5: Request engineering assistance
   */
  requestEngineeringAssistance: (modelCode: string, context?: string) => {
    const ctxText = context ? ` (${context})` : "";
    const prompt = `I would like to request technical engineering assistance from the INDUS robotics team for ${modelCode}${ctxText}. How do I review 3D CAD inertia models and schedule an engineering consultation?`;
    askRoboticsGuide(prompt);
  },
};

/**
 * Transfers actuator model parameters to the Application Finder Wizard
 * and navigates to the tool without data loss.
 */
export function transferActuatorToFinder(data: {
  category: "rotary-actuator" | "linear-actuator";
  modelCode: string;
  continuousTorqueOrForce: string;
  peakTorqueOrForce: string;
  ratedSpeed: string;
  strokeMm?: string;
  fieldbus?: string;
  flangeSize?: string;
  applicationGoal?: string;
}) {
  if (typeof window === "undefined") return;

  const prefill = {
    category: data.category,
    applicationCategory: data.category === "rotary-actuator" ? "robotic-handling" : "linear-transfer",
    automationGoal: data.applicationGoal || `Configure and size ${data.modelCode} for automation workcell`,
    industry: "Automotive & Industrial Automation",
    continuousTorqueNm: data.category === "rotary-actuator" ? data.continuousTorqueOrForce.replace(/[^0-9.]/g, "") : undefined,
    peakTorqueNm: data.category === "rotary-actuator" ? data.peakTorqueOrForce.replace(/[^0-9.]/g, "") : undefined,
    outputSpeedRpm: data.category === "rotary-actuator" ? data.ratedSpeed.replace(/[^0-9.]/g, "") : undefined,
    thrustForceN: data.category === "linear-actuator" ? data.continuousTorqueOrForce.replace(/[^0-9.]/g, "") : undefined,
    strokeMm: data.strokeMm ? data.strokeMm.replace(/[^0-9.]/g, "") : undefined,
    speedMmPerSec: data.category === "linear-actuator" ? data.ratedSpeed.replace(/[^0-9.]/g, "") : undefined,
    fieldbusProtocol: data.fieldbus || "EtherCAT (CoE / CiA 402)",
    summary: `Pre-configured from Intelligent Actuator Studio: Model ${data.modelCode} (${data.continuousTorqueOrForce} continuous, ${data.ratedSpeed})`,
    modelCode: data.modelCode,
  };

  try {
    sessionStorage.setItem("indus_finder_prefill", JSON.stringify(prefill));
  } catch (err) {
    console.warn("Could not save to sessionStorage", err);
  }

  // Scroll to application finder section if on the same page, or redirect
  const finderEl = document.getElementById("application-finder");
  if (finderEl) {
    finderEl.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = `/application-finder?category=${data.category}&product=${encodeURIComponent(data.modelCode)}`;
  }
}
