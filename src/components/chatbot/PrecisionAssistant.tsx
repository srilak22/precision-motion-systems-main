import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";
import {
  Bot,
  X,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Wrench,
  ShieldAlert,
  Send,
  Cpu,
  Sliders,
  ChevronRight,
  Maximize2,
  Sparkles,
  Layout,
  Gauge,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import {
  getPageContext,
  getWelcomeGreeting,
  getExitIntentGreeting,
  matchEngineeringResponse,
  type AssistantAction,
  type ChatMessage,
} from "./assistantData";

const STORAGE_KEY_VISITED = "pms_returning_visitor";

export function PrecisionAssistant() {
  const location = useLocation();
  const router = useRouter();
  const { openModal } = useModals();

  // Assistant State
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  const [showExitCard, setShowExitCard] = useState(false);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [quickInput, setQuickInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const lastExitTimeRef = useRef<number>(0);
  const inactivityTimerRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── 1. INITIAL VISITOR DETECTION & WELCOME GREETING ────────────────────────
  // Prompt entrance greeting after 1.0s delay whenever entering the website
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    // Detect if returning visitor
    const hasVisited = localStorage.getItem(STORAGE_KEY_VISITED);
    if (hasVisited) {
      setIsReturningVisitor(true);
    } else {
      localStorage.setItem(STORAGE_KEY_VISITED, "true");
    }

    // Display greeting promptly after 1000ms delay on entry/route change
    const timer = setTimeout(() => {
      if (!isOpen && !showExitCard) {
        setShowWelcomeCard(true);
        trackDigitalPresence("assistant_greeting_shown", "welcome_card", location.pathname);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, isOpen, isMounted]);

  // ── 2. RELIABLE EXIT-INTENT GREETING DETECTION ────────────────────────────
  // Triggers when user moves to exit tab/window, switch tabs, or cursor leaves top edge
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    const triggerExitIntent = () => {
      const now = Date.now();
      // 20-second cooldown so it doesn't spam repeatedly while browsing,
      // but reliably triggers whenever the user moves to exit or switch tabs
      if (now - lastExitTimeRef.current < 20000) return;
      if (isOpen) return; // Do not interrupt if chat dialog is actively open

      lastExitTimeRef.current = now;
      setShowWelcomeCard(false);
      setShowExitCard(true);
      trackDigitalPresence("assistant_exit_intent_shown", "exit_intent", location.pathname);
    };

    // Desktop: Trigger on mousemove upward near top edge (close/switch tab intention)
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 45 && e.movementY < 0) {
        triggerExitIntent();
      }
    };

    // Desktop: Trigger on mouseleave document toward the top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 60 || e.relatedTarget === null) {
        triggerExitIntent();
      }
    };

    // Tab blur / window leave trigger
    const handleWindowBlur = () => {
      triggerExitIntent();
    };

    // Visibility change trigger (switching tabs or minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        triggerExitIntent();
      }
    };

    // Mobile: Natural inactivity & scroll engagement trigger
    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        if (window.innerWidth < 768) {
          triggerExitIntent();
        }
      }, 30000);
    };

    const handleMobileActivity = () => {
      resetInactivityTimer();
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // If user scrolled past 30% of the page and suddenly scrolls up rapidly
      if (docHeight > 500 && currentScrollY > docHeight * 0.3 && lastScrollY - currentScrollY > 100) {
        triggerExitIntent();
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleMobileActivity, { passive: true });
    resetInactivityTimer();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleMobileActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isOpen, location.pathname, isMounted]);

  // ── 3. CHAT INITIALIZATION ON OPEN ────────────────────────────────────────
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getWelcomeGreeting(location.pathname, isReturningVisitor);
      const initialMsg: ChatMessage = {
        id: "msg_init_" + Date.now(),
        sender: "assistant",
        text: greeting.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: greeting.actions,
      };
      setMessages([initialMsg]);
      trackDigitalPresence("assistant_opened", "chat_window", location.pathname);

      // Focus input automatically
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, location.pathname, isReturningVisitor, messages.length]);

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // ── 4. ACTION HANDLER ─────────────────────────────────────────────────────
  const handleActionClick = (action: AssistantAction) => {
    trackDigitalPresence("assistant_action_click", action.label, location.pathname);

    setShowWelcomeCard(false);
    setShowExitCard(false);

    if (action.actionType === "dismiss") {
      return;
    }

    if (action.actionType === "modal") {
      if (action.target === "quote") openModal("quote", action.payload);
      else if (action.target === "engineer") openModal("engineer", action.payload);
      else if (action.target === "quick") openModal("quick", action.payload);
      else if (action.target === "search") openModal("search", action.payload);
      return;
    }

    if (action.actionType === "whatsapp") {
      window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
      return;
    }

    if (action.actionType === "navigate" && action.target) {
      router.navigate({ to: action.target as any });
      return;
    }

    if (action.actionType === "chat_intent") {
      setIsOpen(true);
      handleSendUserQuery(action.label);
    }
  };

  // ── 5. USER MESSAGE SUBMISSION ────────────────────────────────────────────
  const handleSendUserQuery = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    if (!isOpen) setIsOpen(true);
    setShowWelcomeCard(false);
    setShowExitCard(false);

    // Add user message
    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    trackDigitalPresence("assistant_query_sent", query.substring(0, 100), location.pathname);

    // Natural brief delay for professional engineering response
    setTimeout(() => {
      const response = matchEngineeringResponse(query, location.pathname);
      const botMsg: ChatMessage = {
        id: "ast_" + Date.now(),
        sender: "assistant",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: response.actions,
        isTechnicalNote: response.isTechnicalNote,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleResetChat = () => {
    const greeting = getWelcomeGreeting(location.pathname, isReturningVisitor);
    setMessages([
      {
        id: "msg_reset_" + Date.now(),
        sender: "assistant",
        text: greeting.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: greeting.actions,
      },
    ]);
  };

  const currentWelcome = useMemo(
    () => getWelcomeGreeting(location.pathname, isReturningVisitor),
    [location.pathname, isReturningVisitor]
  );

  const exitGreeting = useMemo(
    () => getExitIntentGreeting(location.pathname),
    [location.pathname]
  );

  if (!isMounted) return null;

  return (
    <>
      {/* ───────────────────────────────────────────────────────────────────
          1. FLOATING WELCOME GREETING CARD (Prompt, context-aware)
          ─────────────────────────────────────────────────────────────────── */}
      {showWelcomeCard && !isOpen && (
        <aside
          role="dialog"
          aria-label="Welcome to Precision Motion Systems"
          className="fixed bottom-16 right-3 z-40 w-[calc(100vw-1.5rem)] max-w-sm rounded border border-border bg-card/95 p-4 text-left shadow-2xl backdrop-blur-md transition-all sm:right-6 md:bottom-20 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-signal" />
              </span>
              <div>
                <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {currentWelcome.title}
                </span>
                <span className="block text-[10px] font-medium text-signal">
                  {currentWelcome.subtitle}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowWelcomeCard(false);
                trackDigitalPresence("assistant_greeting_dismissed", "welcome_card", location.pathname);
              }}
              className="rounded p-1 text-muted-foreground hover:bg-surface-elevated/40 hover:text-foreground"
              aria-label="Dismiss greeting"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body message */}
          <p className="mt-2.5 text-xs leading-relaxed text-foreground">
            {currentWelcome.message}
          </p>

          {/* Quick-action buttons */}
          <div className="mt-3 grid gap-1.5">
            {currentWelcome.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="group flex w-full items-center justify-between rounded border border-border/70 bg-background/80 px-2.5 py-1.5 text-left text-[11px] font-semibold text-foreground transition-all hover:border-signal hover:bg-surface-elevated/30"
              >
                <span>{action.label}</span>
                <ArrowRight
                  size={12}
                  className="text-signal opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </button>
            ))}
          </div>

          {/* Prompt to open full assistant */}
          <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1 font-mono text-[9px] uppercase">
              <Bot size={11} className="text-signal" /> Engineering Assistant
            </span>
            <button
              onClick={() => {
                setShowWelcomeCard(false);
                setIsOpen(true);
              }}
              className="font-bold text-signal hover:underline"
            >
              Open Assistant →
            </button>
          </div>
        </aside>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          2. SUBTLE EXIT-INTENT CARD (Triggered reliably on tab exit/leave)
          ─────────────────────────────────────────────────────────────────── */}
      {showExitCard && !isOpen && (
        <aside
          role="dialog"
          aria-label="Before you leave Precision Motion Systems"
          className="fixed bottom-16 right-3 z-40 w-[calc(100vw-1.5rem)] max-w-sm rounded border border-signal/40 bg-surface-dark p-4 text-left text-surface-foreground shadow-2xl backdrop-blur-md transition-all sm:right-6 md:bottom-20 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start justify-between gap-2 border-b border-border/20 pb-2">
            <div className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-signal">
              <Cpu size={14} />
              <span>Precision Motion Systems</span>
            </div>
            <button
              onClick={() => {
                setShowExitCard(false);
                trackDigitalPresence("assistant_exit_intent_dismissed", "exit_intent", location.pathname);
              }}
              className="rounded p-1 text-surface-foreground/60 hover:text-surface-foreground"
              aria-label="Close message"
            >
              <X size={15} />
            </button>
          </div>

          <h4 className="mt-2.5 font-display text-sm font-bold uppercase tracking-wide text-surface-foreground">
            {exitGreeting.headline}
          </h4>

          <p className="mt-1.5 text-xs leading-relaxed text-surface-foreground/80">
            {exitGreeting.body}
          </p>

          <div className="mt-3.5 flex flex-col gap-2">
            <Button
              onClick={() => handleActionClick(exitGreeting.primaryAction)}
              className="h-8 w-full rounded-none bg-signal text-xs font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90"
            >
              <Wrench size={13} className="mr-1.5" />
              {exitGreeting.primaryAction.label}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleActionClick(exitGreeting.secondaryAction)}
                className="h-7 flex-1 rounded-none border-border/40 text-[11px] font-bold uppercase text-surface-foreground hover:border-signal hover:text-signal"
              >
                {exitGreeting.secondaryAction.label}
              </Button>

              <button
                onClick={() => setShowExitCard(false)}
                className="h-7 px-2 text-[10px] font-medium text-surface-foreground/60 hover:text-surface-foreground"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ───────────────────────────────────────────────────────────────────
          3. DOCKED BOTTOM CHAT WIDGET & TRIGGER BAR
          ─────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-16 right-3 z-40 flex items-center gap-2 sm:right-6 md:bottom-6">
        {/* Desktop Quick-Send Bar attached to bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (quickInput.trim()) {
              setIsOpen(true);
              handleSendUserQuery(quickInput);
              setQuickInput("");
            } else {
              setIsOpen(true);
            }
          }}
          className="hidden md:flex h-11 items-center rounded border border-signal/40 bg-surface-dark/95 px-3 py-1 text-xs shadow-2xl backdrop-blur-md transition-all hover:border-signal"
        >
          <Bot size={15} className="mr-2 text-signal shrink-0" />
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Ask engineering question or check layout..."
            className="w-56 bg-transparent text-xs text-surface-foreground placeholder:text-surface-foreground/50 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 rounded bg-signal px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-signal-foreground hover:bg-signal/90 transition-colors"
          >
            Send
          </button>
        </form>

        {/* Trigger Button (Mobile & Desktop companion) */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowWelcomeCard(false);
            setShowExitCard(false);
          }}
          className="flex h-11 items-center gap-2 border border-signal/40 bg-surface-dark px-3.5 text-xs font-bold uppercase tracking-wider text-surface-foreground shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-signal hover:text-signal"
          aria-label="How can we help? Open Precision Motion Assistant"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          <span className="grid size-6 place-items-center bg-signal text-signal-foreground">
            <Bot size={15} />
          </span>
          <span className="hidden sm:inline">How can we help?</span>
          <span className="sm:hidden">Help</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          4. INTERACTIVE ENGINEERING CONCIERGE DIALOG
          ─────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Precision Motion Systems Engineering Assistant"
          className="fixed bottom-16 right-2 left-2 z-50 flex h-[580px] max-h-[82vh] flex-col rounded border border-border bg-card shadow-2xl sm:left-auto sm:right-6 sm:w-[430px] md:bottom-20 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 bg-surface-dark px-4 py-3 text-surface-foreground">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center bg-signal text-signal-foreground">
                <Bot size={16} />
              </span>
              <div>
                <div className="flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
                  <span>Precision Motion Assistant</span>
                  <span className="rounded bg-signal/20 px-1 py-0.2 text-[9px] font-bold text-signal">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-surface-foreground/60">
                  Industrial Automation & Motion Guidance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="rounded p-1.5 text-surface-foreground/60 transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
                title="Restart Conversation"
                aria-label="Restart Conversation"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1.5 text-surface-foreground/60 transition-colors hover:bg-surface-elevated hover:text-surface-foreground"
                aria-label="Close Assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border/40 bg-muted/30 px-3 py-1.5 text-[10px]">
            <span className="shrink-0 font-bold uppercase tracking-wider text-muted-foreground">
              Quick:
            </span>
            <button
              onClick={() => handleSendUserQuery("check_display_diagnostic")}
              className="shrink-0 rounded border border-signal/40 bg-signal/10 px-2 py-0.5 font-bold text-signal hover:bg-signal/20"
            >
              📐 Check Pixel & Layout
            </button>
            <button
              onClick={() => handleSendUserQuery("I need a motion control solution for an industrial application.")}
              className="shrink-0 rounded border border-border/60 bg-background px-2 py-0.5 font-medium text-foreground hover:border-signal hover:text-signal"
            >
              Motion Control
            </button>
            <button
              onClick={() => handleSendUserQuery("What are the payload and reach specifications for robotic arms?")}
              className="shrink-0 rounded border border-border/60 bg-background px-2 py-0.5 font-medium text-foreground hover:border-signal hover:text-signal"
            >
              Robotic Arms
            </button>
            <button
              onClick={() => handleSendUserQuery("What is the typical commercial lead time and quote turnaround?")}
              className="shrink-0 rounded border border-border/60 bg-background px-2 py-0.5 font-medium text-foreground hover:border-signal hover:text-signal"
            >
              Quote & Lead Time
            </button>
          </div>

          {/* Chat Messages Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 space-y-3.5 overflow-y-auto p-4 text-left text-xs"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded p-3 ${
                    msg.sender === "user"
                      ? "bg-signal font-semibold text-signal-foreground"
                      : "border border-border/60 bg-muted/40 text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Technical Note Callout */}
                  {msg.isTechnicalNote && (
                    <div className="mt-2.5 flex items-start gap-1.5 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                      <ShieldAlert size={14} className="mt-0.5 shrink-0 text-signal" />
                      <span>
                        Specifications require mechanical inertia and duty cycle validation before final deployment.
                      </span>
                    </div>
                  )}
                </div>

                <span className="mt-1 text-[9px] text-muted-foreground">
                  {msg.timestamp}
                </span>

                {/* Action Chips for Assistant Messages */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.actions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleActionClick(act)}
                        className="group flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground transition-all hover:border-signal hover:bg-surface-elevated/40 hover:text-signal"
                      >
                        <span>{act.label}</span>
                        <ChevronRight
                          size={11}
                          className="text-signal opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="size-1.5 animate-bounce rounded-full bg-signal" />
                <span className="size-1.5 animate-bounce rounded-full bg-signal [animation-delay:0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-signal [animation-delay:0.4s]" />
                <span className="ml-1 text-[10px]">Analyzing engineering parameters...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Handoff Bar */}
          <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-3 py-1.5 text-[11px]">
            <button
              onClick={() => handleActionClick({ id: "b_diag", label: "Check Alignment", actionType: "chat_intent", target: "check_display_diagnostic" })}
              className="flex items-center gap-1 font-bold text-muted-foreground hover:text-signal"
            >
              <Layout size={12} className="text-signal" /> Check Layout
            </button>
            <button
              onClick={() => handleActionClick({ id: "b_quote", label: "Request Quote", actionType: "modal", target: "quote" })}
              className="flex items-center gap-1 font-bold text-muted-foreground hover:text-signal"
            >
              <Sliders size={12} className="text-signal" /> RFQ Form
            </button>
            <button
              onClick={() => handleActionClick({ id: "b_eng", label: "Consult Engineer", actionType: "modal", target: "engineer" })}
              className="flex items-center gap-1 font-bold text-muted-foreground hover:text-signal"
            >
              <Wrench size={12} className="text-signal" /> Engineer Review
            </button>
            <button
              onClick={() => handleActionClick({ id: "b_wa", label: "WhatsApp", actionType: "whatsapp" })}
              className="flex items-center gap-1 font-bold text-muted-foreground hover:text-signal"
            >
              <MessageSquare size={12} className="text-signal" /> WhatsApp
            </button>
          </div>

          {/* Chat Send Bar on Bottom */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendUserQuery();
            }}
            className="flex items-center gap-1.5 border-t border-border p-2.5 bg-background"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a technical question, enter specs, or check layout..."
              className="flex-1 rounded border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-signal focus:outline-none"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="size-9 shrink-0 rounded bg-signal text-signal-foreground hover:bg-signal/90 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={14} />
            </Button>
          </form>
        </aside>
      )}
    </>
  );
}
