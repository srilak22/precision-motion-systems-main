/**
 * INDUS Industrial Robotics — Robotics Guide & Intelligent Product Discovery
 *
 * Implements Phase 4 Production Assistant:
 * - Grounded in verified catalogue specifications, ISO/DIN test conditions, and engineering dossiers.
 * - Non-blocking floating launcher with session-remembered greeting.
 * - Multi-intent workflows: Product Discovery, Technical Explanations, Model Comparisons,
 *   Progressive Application Sizing, and Application Finder Handoff.
 * - Seamless handoff into /application-finder with pre-filled parameters.
 * - Strict engineering safety boundaries and privacy controls.
 */

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  X,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Wrench,
  ShieldAlert,
  Send,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Compass,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { trackIndusEvent } from "@/lib/analytics";
import {
  processUserQuery,
  type IntentEngineResult,
} from "@/services/roboticsGuide/intentEngine";
import type {
  GuideMessage,
  ApplicationDiscoveryState,
  ApplicationFinderTransferPayload,
  ProductCardData,
} from "@/services/roboticsGuide/types";

const INITIAL_GREETING_TITLE =
  "Welcome to INDUS. What are you looking to build or automate today?";
const INITIAL_GREETING_BODY =
  "I can help you explore motion components, understand technical specifications, compare products, and prepare an engineering enquiry.";

const QUICK_ACTIONS = [
  "Find a Product",
  "Select an Actuator",
  "Compare Components",
  "Explore Robot Applications",
  "Prepare an Application Brief",
  "Talk to Engineering",
] as const;

export function RoboticsAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Conversation & Discovery State
  const [discoveryState, setDiscoveryState] = useState<ApplicationDiscoveryState>({ step: 0 });
  const [messages, setMessages] = useState<GuideMessage[]>(() => {
    // Attempt session restoration if available
    try {
      const saved = sessionStorage.getItem("indus_robotics_guide_chat");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: "msg-welcome",
        sender: "bot",
        intent: "greeting",
        timestamp: "Just now",
        text: `${INITIAL_GREETING_TITLE}\n\n${INITIAL_GREETING_BODY}`,
        quickReplies: [...QUICK_ACTIONS],
      },
    ];
  });

  const { openModal } = useModals();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync messages to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem("indus_robotics_guide_chat", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Entrance greeting timer: shows greeting once after 2.5s if not previously dismissed in session
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("indus_robotics_guide_dismissed");
      if (!dismissed && !isOpen) {
        const timer = setTimeout(() => {
          setShowGreeting(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [isOpen]);

  // Keyboard accessibility: Escape closes assistant or greeting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpen) {
          setIsOpen(false);
        } else if (showGreeting) {
          handleDismissGreeting();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showGreeting]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleDismissGreeting = () => {
    setShowGreeting(false);
    try {
      sessionStorage.setItem("indus_robotics_guide_dismissed", "true");
    } catch {}
    trackDigitalPresence("ai_assistant", "dismiss_greeting", "User dismissed welcome greeting");
  };

  const handleOpenFromGreeting = () => {
    handleDismissGreeting();
    setIsOpen(true);
    trackIndusEvent("assistant_opened", {
      interaction_source: "assistant",
      details: "greeting_bubble",
    });
    trackDigitalPresence("ai_assistant", "open_from_greeting", "Opened assistant from greeting bubble");
    trackClarityEvent("ai_assistant_open");
  };

  const toggleAssistant = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setShowGreeting(false);
      try {
        sessionStorage.setItem("indus_robotics_guide_dismissed", "true");
      } catch {}
      trackIndusEvent("assistant_opened", {
        interaction_source: "assistant",
        details: "launcher_button",
      });
      trackDigitalPresence("ai_assistant", "open_toggle", "Assistant opened");
      trackClarityEvent("ai_assistant_open");
    }
  };

  const handleResetConversation = () => {
    setDiscoveryState({ step: 0 });
    setErrorMessage(null);
    const initial: GuideMessage[] = [
      {
        id: `msg-reset-${Date.now()}`,
        sender: "bot",
        intent: "greeting",
        timestamp: "Just now",
        text: `${INITIAL_GREETING_TITLE}\n\n${INITIAL_GREETING_BODY}`,
        quickReplies: [...QUICK_ACTIONS],
      },
    ];
    setMessages(initial);
    try {
      sessionStorage.setItem("indus_robotics_guide_chat", JSON.stringify(initial));
    } catch {}
    trackDigitalPresence("ai_assistant", "conversation_reset", "User reset conversation");
  };

  // Dispatch queries through the Intent Engine
  const dispatchQuery = (text: string) => {
    const userMsg: GuideMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setErrorMessage(null);

    // Track comparison if query relates to comparison
    if (text.toLowerCase().includes("compare")) {
      trackIndusEvent("comparison_initiated", {
        interaction_source: "assistant",
      });
    }

    // Track non-sensitive event without logging raw conversation message text
    trackDigitalPresence("ai_assistant", "query_dispatched", "User submitted query");

    setTimeout(() => {
      try {
        const result: IntentEngineResult = processUserQuery(text, discoveryState);

        if (result.nextDiscoveryState) {
          setDiscoveryState(result.nextDiscoveryState);
        }

        setMessages((prev) => [...prev, result.message]);
        setIsTyping(false);
      } catch (err) {
        setIsTyping(false);
        setErrorMessage("An unexpected error occurred while searching catalogue data.");
        trackIndusEvent("assistant_error_or_unavailable", {
          error_code: "intent_engine_error",
          interaction_source: "assistant",
        });
        trackDigitalPresence("ai_assistant", "conversation_error", "Intent engine error");
      }
    }, 450);
  };

  // External prompt listener from Intelligent Actuator Studio & Application Actions
  useEffect(() => {
    const handlePromptEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string; autoOpen?: boolean }>;
      if (customEvent.detail?.autoOpen !== false) {
        setIsOpen(true);
        setShowGreeting(false);
      }
      if (customEvent.detail?.query) {
        dispatchQuery(customEvent.detail.query);
      }
    };

    window.addEventListener("indus-robotics-guide-prompt", handlePromptEvent);
    return () => window.removeEventListener("indus-robotics-guide-prompt", handlePromptEvent);
  }, [discoveryState]);

  const handleQuickAction = (action: string) => {
    trackIndusEvent("quick_action_selected", {
      quick_action: action,
      interaction_source: "assistant",
    });
    trackDigitalPresence("ai_assistant", "quick_action_selected", action);
    trackClarityEvent("ai_assistant_quick_action");

    // Handle instant shortcuts
    if (action === "Prepare an Application Brief" || action === "Launch Sizing & RFQ Wizard") {
      trackIndusEvent("application_finder_launched", {
        interaction_source: "assistant",
      });
      setIsOpen(false);
      navigate({ to: "/application-finder" });
      return;
    }

    if (action === "Talk to Engineering" || action === "Book Live Calendar Consultation (30 min)") {
      trackIndusEvent("human_assistance_requested", {
        assistance_channel: "consultation_calendar",
        interaction_source: "assistant",
      });
      setIsOpen(false);
      navigate({ to: "/book-consultation" });
      return;
    }

    if (action === "Compare Components" || action === "Compare Specific Models") {
      trackIndusEvent("comparison_initiated", {
        interaction_source: "assistant",
      });
      dispatchQuery("Compare IND-IRA-070 and IND-IRA-090");
      return;
    }

    if (action === "Select an Actuator") {
      dispatchQuery("Select an actuator for rotational movement");
      return;
    }

    if (action === "Explore Robot Applications") {
      dispatchQuery("I want to automate loading parts into a CNC machine");
      return;
    }

    if (action === "Find a Product") {
      dispatchQuery("Show me verified robotics products");
      return;
    }

    if (action === "Transfer to Application Finder") {
      handleTransferToFinder();
      return;
    }

    if (action === "Back to Main Menu" || action === "Start Discovery Over") {
      handleResetConversation();
      return;
    }

    // Default: pass as typed query
    dispatchQuery(action);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const text = inputVal.trim();
    setInputVal("");
    dispatchQuery(text);
  };

  // Transfer requirements to /application-finder
  const handleTransferToFinder = (customHandoff?: ApplicationFinderTransferPayload) => {
    let payload = customHandoff;
    if (!payload) {
      // Find the last message that contained a handoff payload
      const foundMsg = [...messages].reverse().find((m) => m.handoff);
      if (foundMsg?.handoff) {
        payload = foundMsg.handoff;
      } else {
        payload = {
          category: "rotary-actuator",
          applicationCategory: "machine-tending",
          automationGoal: "Automate motion system with verified hardware",
          industry: "Automotive & EV",
          payloadKg: discoveryState.payloadKg || "10",
          reachMm: discoveryState.reachMm || "1100",
          cycleTimeSec: discoveryState.cycleTimeSec || "5",
          summary: "Transferred from INDUS Robotics Guide consultation.",
          source: "INDUS Robotics Guide",
        };
      }
    }

    try {
      sessionStorage.setItem("indus_finder_prefill", JSON.stringify(payload));
    } catch {}

    trackIndusEvent("application_finder_launched", {
      application_type: payload.category || payload.applicationCategory,
      interaction_source: "assistant",
    });
    trackDigitalPresence("ai_assistant", "application_finder_launched", payload.category);
    trackClarityEvent("ai_assistant_handoff_finder");
    setIsOpen(false);

    // Navigate to actual Application Finder route
    navigate({
      to: "/application-finder",
      search: {
        category: payload.category,
        app: payload.applicationCategory,
        payload: payload.payloadKg,
        reach: payload.reachMm,
        cycle: payload.cycleTimeSec,
      },
    });
  };

  return (
    <>
      {/* =====================================================================
          1. FIRST-VISIT WELCOME GREETING BUBBLE
          Appears after short delay (2.5s) if not dismissed in session
         ===================================================================== */}
      {showGreeting && !isOpen && (
        <aside
          role="complementary"
          aria-label="Welcome from INDUS Robotics Guide"
          className="fixed bottom-28 right-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-[#E5EAF1] bg-white p-4 text-[#172033] shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 md:bottom-20 md:right-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF1]">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#155EEF] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#155EEF]" />
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                INDUS Robotics Guide
              </span>
            </div>
            <button
              onClick={handleDismissGreeting}
              aria-label="Dismiss greeting for this browsing session"
              className="text-[#667085] hover:text-[#172033] p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <p className="mt-2.5 text-xs font-semibold text-[#172033] leading-relaxed">
            {INITIAL_GREETING_TITLE}
          </p>
          <p className="mt-1 text-[11px] text-[#475467] leading-relaxed">
            {INITIAL_GREETING_BODY}
          </p>

          {/* 6 Quick Action Pills (Mandated by Phase 4) */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => {
                  handleDismissGreeting();
                  setIsOpen(true);
                  handleQuickAction(action);
                }}
                className="rounded-md border border-[#E5EAF1] bg-[#F8FAFC] px-2.5 py-1 text-left text-[11px] font-medium text-[#172033] hover:border-[#155EEF] hover:bg-[#EFF6FF] hover:text-[#155EEF] transition-all cursor-pointer"
              >
                • {action}
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-[#E5EAF1]">
            <button
              type="button"
              onClick={handleDismissGreeting}
              className="text-[11px] font-medium text-[#667085] hover:text-[#172033] transition-colors cursor-pointer"
            >
              Dismiss for session
            </button>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenFromGreeting}
              className="h-7 text-xs font-bold uppercase tracking-wide bg-[#155EEF] hover:bg-[#124bbf] text-white px-3"
            >
              <Bot size={13} className="mr-1.5 text-white" />
              <span>Ask Guide</span>
            </Button>
          </div>
        </aside>
      )}

      {/* =====================================================================
          2. PERSISTENT FLOATING LAUNCHER BUTTON
          Positioned unobtrusively at bottom-right (does not cover forms/WhatsApp)
         ===================================================================== */}
      <button
        onClick={toggleAssistant}
        aria-label={isOpen ? "Close INDUS Robotics Guide" : "Open INDUS Robotics Guide"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="fixed bottom-20 right-4 z-40 flex h-11 items-center gap-2 rounded-full border border-[#E5EAF1] bg-white px-3.5 text-xs font-bold tracking-wider text-[#172033] shadow-lg transition-all hover:border-[#155EEF] hover:shadow-xl md:bottom-6 md:right-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155EEF] cursor-pointer"
      >
        <span className="grid size-6 place-items-center rounded-full bg-[#155EEF] text-white">
          {isOpen ? <X size={14} /> : <Bot size={14} />}
        </span>
        <span className="hidden sm:inline font-sans font-semibold text-xs text-[#172033]">
          {isOpen ? "Close Guide" : "INDUS Robotics Guide"}
        </span>
      </button>

      {/* =====================================================================
          3. MAIN ASSISTANT DIALOG PANEL
          Light Industrial Design System (#155EEF, #172033, #F7F9FC, #E5EAF1)
         ===================================================================== */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="INDUS Robotics Guide — Engineering Discovery"
          aria-modal="true"
          className="fixed bottom-28 right-4 z-40 flex w-[calc(100%-2rem)] max-w-lg flex-col rounded-2xl border border-[#E5EAF1] bg-white shadow-2xl md:bottom-20 md:right-6 animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden"
          style={{ height: "620px", maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5EAF1] bg-white px-4 py-3 text-[#172033]">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[#EFF6FF] text-[#155EEF] border border-[#155EEF]/20">
                <Bot size={19} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#172033]">
                    INDUS Robotics Guide
                  </h3>
                  <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-[#155EEF] border border-[#B2CCFF]">
                    Verified Specs
                  </span>
                </div>
                <span className="text-[10px] text-[#667085] flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Engineering Discovery Assistant · DIN 3990 / ISO 9283
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetConversation}
                title="Start new conversation / clear history"
                aria-label="Reset conversation"
                className="p-1.5 text-[#667085] hover:text-[#172033] rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="p-1.5 text-[#667085] hover:text-[#172033] rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC] text-xs">
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"} space-y-1.5`}
                >
                  <div
                    className={`max-w-[92%] rounded-xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      isBot
                        ? "bg-white border border-[#E5EAF1] text-[#172033]"
                        : "bg-[#155EEF] text-white font-medium"
                    }`}
                  >
                    {/* Stepper Progress Pill (Intent D) */}
                    {m.progressStep && (
                      <div className="mb-2.5 flex items-center justify-between border-b border-[#E5EAF1] pb-1.5 text-[10px]">
                        <span className="font-mono font-bold uppercase text-[#155EEF]">
                          Discovery Step {m.progressStep.currentStep} of {m.progressStep.totalSteps}
                        </span>
                        <span className="text-[#667085] font-medium">
                          {m.progressStep.stepName}
                        </span>
                      </div>
                    )}

                    {/* Main Message Text */}
                    <p className="whitespace-pre-line leading-relaxed font-sans">{m.text}</p>

                    {/* Grounded Product Cards (Intent A & D) */}
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3.5 space-y-2.5 pt-2.5 border-t border-[#E5EAF1]">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] block">
                          Verified Candidate Hardware:
                        </span>
                        <div className="space-y-2">
                          {m.products.map((p) => (
                            <div
                              key={p.id}
                              className="rounded-lg border border-[#E5EAF1] bg-[#F8FAFC] p-3 text-left space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono uppercase font-bold text-[#667085]">
                                  {p.category}
                                </span>
                                <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#155EEF] border border-[#E5EAF1]">
                                  {p.modelCode}
                                </span>
                              </div>
                              <div className="font-bold text-xs text-[#172033]">{p.name}</div>
                              <p className="text-[11px] text-[#475467] leading-normal">{p.valueProp}</p>

                              {/* 2-3 Verified Specifications */}
                              <div className="grid grid-cols-2 gap-1.5 py-1">
                                {p.specs.slice(0, 4).map((spec, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="rounded border border-[#E5EAF1] bg-white px-2 py-1 text-[10px]"
                                  >
                                    <span className="text-[#667085] block">{spec.label}</span>
                                    <span className="font-semibold text-[#172033]">
                                      {spec.value} {spec.unit || ""}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[11px] px-2.5 rounded-md border-[#D0D5DD] bg-white text-[#172033] hover:bg-[#EFF6FF] hover:text-[#155EEF]"
                                  onClick={() => {
                                    trackIndusEvent("product_result_opened", {
                                      product_id: p.name,
                                      product_category: p.categorySlug,
                                      interaction_source: "assistant",
                                    });
                                    trackDigitalPresence("ai_assistant", "product_result_opened", p.name);
                                    setIsOpen(false);
                                  }}
                                >
                                  <Link to={p.detailUrl as any}>
                                    View Full Specs <ArrowRight size={11} className="ml-1" />
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-[11px] px-2.5 text-[#155EEF] hover:bg-[#EFF6FF]"
                                  onClick={() => {
                                    handleTransferToFinder({
                                      category: p.categorySlug.includes("linear")
                                        ? "linear-actuator"
                                        : p.categorySlug.includes("gear")
                                        ? "gearbox"
                                        : "rotary-actuator",
                                      applicationCategory: "precision-assembly",
                                      automationGoal: `Sizing review for ${p.name}`,
                                      industry: "Automotive & EV",
                                      summary: `Inquired via INDUS Robotics Guide regarding ${p.name} (${p.modelCode}).`,
                                      source: "INDUS Robotics Guide",
                                    });
                                  }}
                                >
                                  Find Configuration →
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grounded Comparison Table (Intent C) */}
                    {m.comparison && (
                      <div className="mt-3.5 space-y-2 pt-2.5 border-t border-[#E5EAF1]">
                        <div className="rounded-lg border border-[#E5EAF1] bg-white overflow-hidden">
                          <div className="bg-[#F8FAFC] px-3 py-2 border-b border-[#E5EAF1] flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#172033]">{m.comparison.title}</span>
                            <span className="text-[10px] font-mono text-[#667085]">
                              Side-by-Side Matrix
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[10px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#E5EAF1] bg-[#F8FAFC] text-[#667085] font-mono uppercase">
                                  <th className="p-2 font-medium">Parameter</th>
                                  <th className="p-2 font-medium">{m.comparison.modelA.code}</th>
                                  <th className="p-2 font-medium">{m.comparison.modelB.code}</th>
                                  <th className="p-2 font-medium">Important Difference</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E5EAF1]">
                                {m.comparison.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50">
                                    <td className="p-2 font-medium text-[#172033]">
                                      {row.parameter}
                                    </td>
                                    <td className="p-2 font-mono text-[#155EEF]">
                                      {row.modelAVal} {row.unit}
                                    </td>
                                    <td className="p-2 font-mono text-[#155EEF]">
                                      {row.modelBVal} {row.unit}
                                    </td>
                                    <td className="p-2 text-[#475467]">{row.difference}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#475467] leading-relaxed italic">
                          💡 <strong>Engineering Insight:</strong> {m.comparison.engineeringInsight}
                        </p>
                      </div>
                    )}

                    {/* Application Finder Handoff Card (Intent E) */}
                    {m.handoff && (
                      <div className="mt-3.5 rounded-lg border border-[#155EEF]/30 bg-[#EFF6FF] p-3 text-left space-y-2">
                        <div className="flex items-center gap-1.5 text-[#155EEF] font-bold text-xs">
                          <Compass size={14} />
                          <span>Ready for Application Finder Transfer</span>
                        </div>
                        <p className="text-[11px] text-[#475467] leading-normal">
                          All preliminary requirements collected in this chat will be passed into the
                          formal 6-step engineering RFQ wizard without retyping.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleTransferToFinder(m.handoff)}
                          className="h-8 w-full bg-[#155EEF] hover:bg-[#124bbf] text-white text-xs font-bold uppercase tracking-wider"
                        >
                          Transfer to Application Finder →
                        </Button>
                      </div>
                    )}

                    {/* Action Links */}
                    {m.actionLinks && m.actionLinks.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1.5 pt-2 border-t border-[#E5EAF1]">
                        {m.actionLinks.map((link, idx) => (
                          <Button
                            key={idx}
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-7.5 justify-between text-xs rounded-md border-[#D0D5DD] bg-white text-[#172033] hover:border-[#155EEF] hover:bg-[#EFF6FF] hover:text-[#155EEF]"
                            onClick={() => {
                              if (link.icon === "calendar") {
                                trackIndusEvent("human_assistance_requested", {
                                  assistance_channel: "action_link_calendar",
                                  interaction_source: "assistant",
                                });
                                trackDigitalPresence("ai_assistant", "human_assistance_requested", "Calendar Consultation");
                              } else if (link.icon === "compare") {
                                trackIndusEvent("comparison_initiated", {
                                  interaction_source: "assistant",
                                });
                              } else if (link.icon === "finder") {
                                trackIndusEvent("application_finder_launched", {
                                  interaction_source: "assistant",
                                });
                              }
                              setIsOpen(false);
                            }}
                          >
                            <Link to={link.url as any}>
                              <span className="flex items-center gap-1.5">
                                {link.icon === "calendar" && <Calendar size={13} className="text-[#155EEF]" />}
                                {link.icon === "compare" && <SlidersHorizontal size={13} className="text-[#155EEF]" />}
                                {link.icon === "finder" && <Compass size={13} className="text-[#155EEF]" />}
                                {link.label}
                              </span>
                              <ChevronRight size={13} />
                            </Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Chips */}
                  {isBot && m.quickReplies && m.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                      {m.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => handleQuickAction(reply)}
                          className="rounded-md border border-[#E5EAF1] bg-white px-2.5 py-1 text-[11px] font-medium text-[#172033] hover:border-[#155EEF] hover:bg-[#EFF6FF] hover:text-[#155EEF] transition-all text-left shadow-2xs cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#667085] text-xs py-1">
                <span className="grid size-6 place-items-center rounded-full bg-[#EFF6FF] text-[#155EEF]">
                  <Bot size={13} />
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#155EEF] animate-bounce" />
                  <span className="size-1.5 rounded-full bg-[#155EEF] animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-[#155EEF] animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[11px] text-[#667085] font-mono">Retrieving verified specs...</span>
              </div>
            )}

            {/* Error Message & Retry */}
            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetConversation}
                  className="font-bold underline hover:text-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Technical Safety Notice Banner (Requirement 7) */}
          <div className="border-t border-[#E5EAF1] bg-white px-3.5 py-2 text-[10px] text-[#667085] flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate pr-2">
              <ShieldAlert size={12} className="text-[#155EEF] shrink-0" />
              <span className="truncate">
                Preliminary discovery only. Sizing requires DIN 3990 &amp; safety validation.
              </span>
            </span>
            <Link
              to="/book-consultation"
              onClick={() => {
                trackDigitalPresence("ai_assistant", "human_assistance_requested", "Safety banner link");
                setIsOpen(false);
              }}
              className="font-semibold text-[#155EEF] hover:underline shrink-0"
            >
              Talk to Engineering →
            </Link>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleInputSubmit}
            className="flex items-center gap-2 border-t border-[#E5EAF1] bg-[#F8FAFC] p-3"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about torque, stroke, EtherCAT, payload, or kinematics..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isTyping}
              className="flex-1 rounded-lg border border-[#E5EAF1] bg-white px-3 py-2 text-xs text-[#172033] placeholder:text-[#667085] focus:outline-none focus:ring-1 focus:ring-[#155EEF] focus:border-[#155EEF] disabled:opacity-60"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputVal.trim() || isTyping}
              className="h-8.5 px-3.5 shrink-0 bg-[#155EEF] hover:bg-[#124bbf] text-white rounded-lg disabled:opacity-40 cursor-pointer"
              aria-label="Send query"
            >
              {isTyping ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </Button>
          </form>
        </aside>
      )}
    </>
  );
}
