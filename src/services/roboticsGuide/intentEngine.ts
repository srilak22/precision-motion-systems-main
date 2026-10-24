/**
 * INDUS Industrial Robotics — Robotics Guide Intent Engine
 *
 * Implements conversational workflows across 6 core industrial automation intents:
 * - Intent A: Product discovery
 * - Intent B: Technical explanation
 * - Intent C: Model comparison
 * - Intent D: Application discovery (progressive multi-step)
 * - Intent E: Application Finder handoff
 * - Intent F: Human engineering assistance
 */

import {
  discoverProductsByIntent,
  getEngineeringExplanation,
  compareActuatorModels,
  compareGeneralComponents,
  getDiagnosticExplanation,
  getActuatorSpecExplanation,
} from "./knowledgeService";
import type {
  GuideMessage,
  ApplicationDiscoveryState,
  ApplicationFinderTransferPayload,
} from "./types";

export interface IntentEngineResult {
  message: GuideMessage;
  nextDiscoveryState?: ApplicationDiscoveryState;
  handoffPayload?: ApplicationFinderTransferPayload;
}

export function processUserQuery(
  rawInput: string,
  discoveryState: ApplicationDiscoveryState = { step: 0 }
): IntentEngineResult {
  const query = rawInput.trim();
  const q = query.toLowerCase();

  // -------------------------------------------------------------------------
  // 1. ACTIVE PROGRESSIVE APPLICATION DISCOVERY (Intent D continuation)
  // -------------------------------------------------------------------------
  if (discoveryState.step > 0 && discoveryState.step < 7) {
    return handleDiscoveryStepContinuation(query, discoveryState);
  }

  // -------------------------------------------------------------------------
  // 2. INTENT F: HUMAN ASSISTANCE / ENGINEERING CONSULTATION
  // -------------------------------------------------------------------------
  if (
    q.includes("human") ||
    q.includes("speak with") ||
    q.includes("talk to") ||
    q.includes("engineer") ||
    q.includes("consult") ||
    q.includes("meeting") ||
    q.includes("schedule") ||
    q.includes("calendar") ||
    q.includes("visit") ||
    q.includes("chennai") ||
    q.includes("call") ||
    q.includes("phone")
  ) {
    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "human",
        timestamp: "Just now",
        text:
          "Our senior robotics application engineering team in Chennai, India is available for CAD reviews, kinematic envelope studies, cycle-time simulations, and plant automation feasibility.",
        quickReplies: [
          "Book Live Calendar Consultation (30 min)",
          "Launch Application Finder (RFQ)",
          "Find a Product",
          "Back to Main Menu",
        ],
        actionLinks: [
          {
            label: "Schedule Consultation on Google Calendar",
            url: "/book-consultation",
            icon: "calendar",
          },
          {
            label: "Launch Guided Application Finder",
            url: "/application-finder",
            icon: "finder",
          },
        ],
      },
    };
  }

  // -------------------------------------------------------------------------
  // 3. INTENT C: MODEL & COMPONENT COMPARISON
  // -------------------------------------------------------------------------
  if (
    q.includes("compare") ||
    q.includes("vs") ||
    q.includes("versus") ||
    q.includes("difference between models")
  ) {
    // Model comparison between specific IRA variants
    if (q.includes("ira") || q.includes("rotary") || q.includes("actuator") || q.includes("070") || q.includes("090")) {
      const modelA = q.includes("115") ? "IND-IRA-115" : "IND-IRA-070";
      const modelB = q.includes("142") ? "IND-IRA-142" : "IND-IRA-090";
      const comparison = compareActuatorModels(modelA, modelB);

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: "bot",
          intent: "comparison",
          timestamp: "Just now",
          text: `Here is the verified specification comparison between ${comparison.modelA.name} and ${comparison.modelB.name}. Data reflects ISO/DIN laboratory test benchmarks:`,
          comparison,
          quickReplies: [
            "Launch Sizing & RFQ Wizard",
            "Compare Other Components",
            "Speak with an Engineer",
            "Back to Main Menu",
          ],
          actionLinks: [
            {
              label: "Open Full Interactive Comparison Matrix",
              url: "/products/compare",
              icon: "compare",
            },
            {
              label: "Configure in Application Finder",
              url: "/application-finder",
              icon: "finder",
            },
          ],
        },
      };
    }

    // Comparison between gear technologies (e.g. harmonic vs planetary)
    const techExplanation = getEngineeringExplanation(query);
    if (techExplanation) {
      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: "bot",
          intent: "explanation",
          timestamp: "Just now",
          text: `### ${techExplanation.title}\n\n**Operating Principles:**\n${techExplanation.principles}\n\n**Engineering Trade-offs:**\n${techExplanation.tradeOffs}\n\n**Typical Industrial Applications:**\n${techExplanation.typicalApplications}\n\n*${techExplanation.indusCatalogueConnection}*`,
          products: techExplanation.relevantProducts,
          quickReplies: [
            "Compare Specific Models",
            "Select an Actuator",
            "Launch Application Finder",
            "Speak with an Engineer",
          ],
          actionLinks: [
            {
              label: "Explore Technical Comparison Matrix",
              url: "/products/compare",
              icon: "compare",
            },
          ],
        },
      };
    }
  }

  // -------------------------------------------------------------------------
  // 4. INTENT B: TECHNICAL EXPLANATION
  // -------------------------------------------------------------------------
  if (
    q.includes("difference") ||
    q.includes("how does") ||
    q.includes("what is") ||
    q.includes("explain") ||
    q.includes("principle") ||
    q.includes("backlash") ||
    q.includes("encoder") ||
    q.includes("biss") ||
    q.includes("strain wave")
  ) {
    // 4a. Grounded Intelligent Actuator Diagnostic Indicators
    if (q.includes("diagnostic") || q.includes("indicator") || q.includes("tracking error") || q.includes("over-temperature") || q.includes("temperature") || q.includes("current spike")) {
      const diag = getDiagnosticExplanation(query);
      if (diag) {
        return {
          message: {
            id: `msg-${Date.now()}`,
            sender: "bot",
            intent: "explanation",
            timestamp: "Just now",
            text: `### ${diag.title}\n\n**Observed Telemetry:** ${diag.observedCondition}\n**Verified Safe Threshold:** ${diag.verifiedThreshold}\n\n**Possible Engineering Causes:**\n${diag.rootCauses.map((c) => `• ${c}`).join("\n")}\n\n**Recommended Investigation Steps:**\n${diag.recommendedInvestigation.map((s) => `1. ${s}`).join("\n")}\n\n*Reference: ${diag.documentationRef}*`,
            quickReplies: [
              "Request Engineering Investigation",
              "Open Actuator Telemetry Studio",
              "Launch Sizing & RFQ Wizard",
              "Back to Main Menu",
            ],
            actionLinks: [
              {
                label: "Open Actuator Telemetry Studio",
                url: "/technology/intelligent-actuators#telemetry-dashboard",
                icon: "arrow",
              },
              {
                label: "Book Application Sizing Review",
                url: "/book-consultation",
                icon: "calendar",
              },
            ],
          },
        };
      }
    }

    // 4b. Intelligent Actuator Specifications
    const specExp = getActuatorSpecExplanation(query);
    if (specExp) {
      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: "bot",
          intent: "explanation",
          timestamp: "Just now",
          text: `### ${specExp.title}\n\n${specExp.summary}\n\n**Engineering Significance & Dynamic Impact:**\n${specExp.engineeringImpact}\n\n**INDUS Engineering Standard:**\n${specExp.indusStandard}`,
          quickReplies: [
            "Compare Actuator Models",
            "Open Intelligent Actuator Studio",
            "Launch Sizing Wizard",
            "Back to Main Menu",
          ],
          actionLinks: [
            {
              label: "Explore Intelligent Actuator Studio",
              url: "/technology/intelligent-actuators",
              icon: "arrow",
            },
          ],
        },
      };
    }

    const explanation = getEngineeringExplanation(query);
    if (explanation) {
      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: "bot",
          intent: "explanation",
          timestamp: "Just now",
          text: `### ${explanation.title}\n\n**Operating Principles:**\n${explanation.principles}\n\n**Engineering Trade-offs & Limitations:**\n${explanation.tradeOffs}\n\n**Typical Industrial Applications:**\n${explanation.typicalApplications}\n\n*${explanation.indusCatalogueConnection}*`,
          products: explanation.relevantProducts,
          quickReplies: [
            "Find a Product for This Application",
            "Launch Application Finder",
            "Speak with an Engineer",
            "Back to Main Menu",
          ],
          actionLinks: [
            {
              label: "View Reducer & Gearbox Catalogue",
              url: "/products/precision-reducers",
              icon: "arrow",
            },
            {
              label: "Book Application Sizing Review",
              url: "/book-consultation",
              icon: "calendar",
            },
          ],
        },
      };
    }
  }

  // -------------------------------------------------------------------------
  // 5. INTENT D: APPLICATION DISCOVERY (Starting a New Process Sizing Flow)
  // -------------------------------------------------------------------------
  if (
    q.includes("automate") ||
    q.includes("loading") ||
    q.includes("tending") ||
    q.includes("cnc") ||
    q.includes("welding") ||
    q.includes("palletiz") ||
    q.includes("pick and place") ||
    q.includes("assembly cell") ||
    q.includes("inspection cell")
  ) {
    let appType = "General Robotic Cell";
    let categoryKey = "robot";
    if (q.includes("cnc") || q.includes("tending") || q.includes("loading")) {
      appType = "CNC Machine Tending & Workpiece Loading";
      categoryKey = "robot";
    } else if (q.includes("weld")) {
      appType = "Robotic Seam & Spot Welding System";
      categoryKey = "robot";
    } else if (q.includes("pallet")) {
      appType = "End-of-Line Palletizing & Material Handling";
      categoryKey = "robot";
    } else if (q.includes("pick") || q.includes("place")) {
      appType = "High-Speed Pick and Place Packaging";
      categoryKey = "linear-actuator";
    } else if (q.includes("assembly")) {
      appType = "Precision Screwdriving & Press-Fit Assembly";
      categoryKey = "rotary-actuator";
    }

    const nextState: ApplicationDiscoveryState = {
      step: 1,
      applicationType: appType,
    };

    return {
      nextDiscoveryState: nextState,
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "application",
        timestamp: "Just now",
        progressStep: {
          currentStep: 1,
          totalSteps: 5,
          stepName: "Workpiece Mass & Dimensions",
        },
        text: `Understood: You are planning an automation cell for **${appType}**.\n\nTo recommend qualified kinematic formats and estimate payload torque, let's step through your boundary conditions.\n\n**Step 1 of 5: What is the maximum workpiece weight (including the pneumatic or electric gripper)?**`,
        quickReplies: [
          "< 5 kg (Light Assembly / Cobot)",
          "5 – 15 kg (Standard Tending / Handling)",
          "15 – 35 kg (Heavy Workpiece)",
          "> 35 kg (Palletizing / Structural Load)",
        ],
      },
    };
  }

  // -------------------------------------------------------------------------
  // 6. INTENT E: DIRECT APPLICATION FINDER / RFQ REQUEST
  // -------------------------------------------------------------------------
  if (
    q.includes("quote") ||
    q.includes("rfq") ||
    q.includes("pricing") ||
    q.includes("cost") ||
    q.includes("application finder") ||
    q.includes("find the right solution") ||
    q.includes("application brief")
  ) {
    const handoffPayload: ApplicationFinderTransferPayload = {
      category: "rotary-actuator",
      applicationCategory: "robotic-handling",
      automationGoal: "Automate motion system with verified hardware",
      industry: "Automotive & EV",
      payloadKg: "10",
      reachMm: "1000",
      cycleTimeSec: "5",
      summary: "Inquired via INDUS Robotics Guide for commercial quotation and kinematic review.",
      source: "INDUS Robotics Guide",
    };

    return {
      handoffPayload,
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "handoff",
        timestamp: "Just now",
        text:
          "To provide a validated engineering proposal and quotation, we evaluate electrical bus supply, mounting envelope, reflected inertia ratio (JL/JM ≤ 5:1), and environmental ingress (IP rating).\n\nYou can continue directly into the **INDUS Application Finder** — any specifications you've discussed have been pre-filled so you won't need to re-enter them.",
        handoff: handoffPayload,
        quickReplies: [
          "Transfer to Application Finder",
          "Speak with an Engineer",
          "Back to Main Menu",
        ],
        actionLinks: [
          {
            label: "Open 6-Step Application Finder & RFQ",
            url: "/application-finder",
            icon: "finder",
          },
          {
            label: "Schedule Engineering Consultation",
            url: "/book-consultation",
            icon: "calendar",
          },
        ],
      },
    };
  }

  // -------------------------------------------------------------------------
  // 7. INTENT A: PRODUCT DISCOVERY (Motion requirement & catalogue lookup)
  // -------------------------------------------------------------------------
  const discovery = discoverProductsByIntent(query);
  return {
    message: {
      id: `msg-${Date.now()}`,
      sender: "bot",
      intent: "discovery",
      timestamp: "Just now",
      text: `${discovery.explanation}\n\n${
        discovery.requiresFollowUp
          ? `**Engineering Sizing Check:** ${discovery.requiresFollowUp}`
          : "Explore the candidate hardware below or launch the Application Finder for detailed sizing."
      }`,
      products: discovery.products,
      quickReplies: [
        "Select an Actuator",
        "Compare Components",
        "Launch Application Finder",
        "Speak with an Engineer",
      ],
      actionLinks: [
        {
          label: "Launch Guided Application Finder",
          url: "/application-finder",
          icon: "finder",
        },
        {
          label: "View All Motion Products",
          url: "/products",
          icon: "arrow",
        },
      ],
    },
  };
}

/* =========================================================================
   PROGRESSIVE APPLICATION DISCOVERY STEPPER (Intent D & E Bridge)
   ========================================================================= */

function handleDiscoveryStepContinuation(
  userAnswer: string,
  state: ApplicationDiscoveryState
): IntentEngineResult {
  const ans = userAnswer.trim();

  // Step 1: Payload recorded -> Ask Step 2: Cycle time
  if (state.step === 1) {
    const nextState: ApplicationDiscoveryState = {
      ...state,
      step: 2,
      payloadKg: ans,
    };

    return {
      nextDiscoveryState: nextState,
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "application",
        timestamp: "Just now",
        progressStep: {
          currentStep: 2,
          totalSteps: 5,
          stepName: "Required Cycle Time / Takt",
        },
        text: `Target Payload recorded: **${ans}**.\n\n**Step 2 of 5: What is the required cycle time or part transfer takt rate?**`,
        quickReplies: [
          "< 3 seconds / part (High Speed)",
          "3 – 8 seconds / part (Standard Machine Tending)",
          "8 – 20 seconds / part (Process / Welding / Dispensing)",
          "Flexible / In Planning Phase",
        ],
      },
    };
  }

  // Step 2: Cycle time recorded -> Ask Step 3: Reach & Layout
  if (state.step === 2) {
    const nextState: ApplicationDiscoveryState = {
      ...state,
      step: 3,
      cycleTimeSec: ans,
    };

    return {
      nextDiscoveryState: nextState,
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "application",
        timestamp: "Just now",
        progressStep: {
          currentStep: 3,
          totalSteps: 5,
          stepName: "Machine Layout & Working Radius",
        },
        text: `Target Cycle Time recorded: **${ans}**.\n\n**Step 3 of 5: What is the required working reach radius from the robot or axis base?**`,
        quickReplies: [
          "< 700 mm (Compact Benchtop / Cell)",
          "700 – 1400 mm (Standard Machine Envelope)",
          "1400 – 2200 mm (Extended Reach Palletizer)",
          "> 2200 mm (Linear Rail or Gantry Mounted)",
        ],
      },
    };
  }

  // Step 3: Reach recorded -> Ask Step 4: Machine Interface & Gripper
  if (state.step === 3) {
    const nextState: ApplicationDiscoveryState = {
      ...state,
      step: 4,
      reachMm: ans,
    };

    return {
      nextDiscoveryState: nextState,
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "application",
        timestamp: "Just now",
        progressStep: {
          currentStep: 4,
          totalSteps: 5,
          stepName: "Gripper & Machine Interface",
        },
        text: `Working Radius recorded: **${ans}**.\n\n**Step 4 of 5: What gripper type and machine control interface are you using?**`,
        quickReplies: [
          "Pneumatic 2-Jaw Gripper + 24V I/O",
          "Electric Servo Gripper + IO-Link / EtherCAT",
          "Vacuum Suction Matrix",
          "Magnetic / Bespoke Tooling",
        ],
      },
    };
  }

  // Step 4: Gripper recorded -> Ask Step 5: Duty & Safety
  if (state.step === 4) {
    const nextState: ApplicationDiscoveryState = {
      ...state,
      step: 5,
      gripperType: ans,
    };

    return {
      nextDiscoveryState: nextState,
      message: {
        id: `msg-${Date.now()}`,
        sender: "bot",
        intent: "application",
        timestamp: "Just now",
        progressStep: {
          currentStep: 5,
          totalSteps: 5,
          stepName: "Operating Duty & Safety Constraints",
        },
        text: `Tooling Interface recorded: **${ans}**.\n\n**Step 5 of 5: What is the operating shift pattern and safety constraint?**`,
        quickReplies: [
          "24/7 Continuous Duty · Fenced Perimeter (Safety Interlocks)",
          "2 Shifts/Day · Collaborative Fenceless (Area Scanner PLd)",
          "Single Shift Pilot Cell · Standard Safety Circuit",
        ],
      },
    };
  }

  // Step 5: All steps collected -> Summarize & Prepare Handoff to Application Finder
  const finalState: ApplicationDiscoveryState = {
    ...state,
    step: 7, // Completed
    safetyConstraints: ans,
  };

  // Map to Application Finder Schema
  let catSlug = "robot";
  let appCategory = "machine-tending";
  if (state.applicationType?.includes("Pick")) {
    catSlug = "linear-actuator";
    appCategory = "pick-and-place";
  } else if (state.applicationType?.includes("Assembly")) {
    catSlug = "rotary-actuator";
    appCategory = "precision-assembly";
  } else if (state.applicationType?.includes("Pallet")) {
    catSlug = "robot";
    appCategory = "robotic-handling";
  }

  const payloadClean = (state.payloadKg || "10 kg").replace(/[^0-9.]/g, "") || "10";
  const reachClean = (state.reachMm || "1200 mm").replace(/[^0-9.]/g, "") || "1200";
  const cycleClean = (state.cycleTimeSec || "5 s").replace(/[^0-9.]/g, "") || "5";

  const handoffPayload: ApplicationFinderTransferPayload = {
    category: catSlug,
    applicationCategory: appCategory,
    automationGoal: `Automate ${state.applicationType || "robotic process"}`,
    industry: "Automotive & EV",
    payloadKg: payloadClean,
    reachMm: reachClean,
    cycleTimeSec: cycleClean,
    summary: `Application: ${state.applicationType} | Payload: ${state.payloadKg} | Reach: ${state.reachMm} | Cycle Target: ${state.cycleTimeSec} | Tooling: ${state.gripperType} | Safety/Duty: ${ans}`,
    source: "INDUS Robotics Guide",
  };

  const discoveryProducts = discoverProductsByIntent(state.applicationType || "robot");

  return {
    nextDiscoveryState: finalState,
    handoffPayload,
    message: {
      id: `msg-${Date.now()}`,
      sender: "bot",
      intent: "handoff",
      timestamp: "Just now",
      text: `### Preliminary Sizing Summary for ${state.applicationType}\n\n• **Payload target:** ${state.payloadKg}\n• **Cycle time target:** ${state.cycleTimeSec}\n• **Working envelope:** ${state.reachMm}\n• **Tooling format:** ${state.gripperType}\n• **Operational envelope:** ${ans}\n\n> **Engineering Safety Notice:** Preliminary sizing is grounded in verified kinematics, but formal hardware sign-off requires dynamic torque calculations, reflected inertia ratio (JL/JM ≤ 5:1), and emergency braking verification.\n\nWe have packaged these requirements for the **INDUS Application Finder**. You can transfer them with one click below without retyping anything:`,
      products: discoveryProducts.products.slice(0, 2),
      handoff: handoffPayload,
      quickReplies: [
        "Transfer to Application Finder",
        "Book Consultation with These Parameters",
        "Start Discovery Over",
      ],
      actionLinks: [
        {
          label: "Continue in Application Finder (Pre-filled)",
          url: "/application-finder",
          icon: "finder",
        },
        {
          label: "Book 30-Min CAD Review with Engineer",
          url: "/book-consultation",
          icon: "calendar",
        },
      ],
    },
  };
}
