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
  Factory,
  Cpu,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/data/robotics";
import { companyConfig } from "@/data/config";
import { useModals } from "@/components/modals/ModalContext";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: string[];
  links?: { label: string; url: string; isExternal?: boolean; isModal?: string; isConsultation?: boolean }[];
  products?: Product[];
}

const INITIAL_GREETING =
  "Welcome to INDUS. Looking for a robot, motion component, or automation solution?";

const QUICK_ACTIONS = [
  "Find a Product",
  "Explore Industry Solutions",
  "Request a Quote",
  "Book Consultation",
] as const;

export function RoboticsAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [reqStep, setReqStep] = useState<number>(0);
  const [reqAnswers, setReqAnswers] = useState<{ payload?: string; reach?: string; cycleTime?: string }>({});

  const { openModal } = useModals();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "bot",
      text: INITIAL_GREETING,
      timestamp: "Just now",
      quickReplies: [...QUICK_ACTIONS],
    },
  ]);

  // Entrance greeting timer (unsolicited auto-popup disabled to prevent obstructing product cards and conversion CTAs)
  useEffect(() => {
    // Greeting bubble is now user-initiated or triggered by direct actions rather than a timer
  }, [isOpen]);

  // Keyboard accessibility: Escape closes assistant
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

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleDismissGreeting = () => {
    setShowGreeting(false);
    try {
      sessionStorage.setItem("indus_ai_greeting_dismissed", "true");
    } catch {
      // ignore
    }
    trackDigitalPresence("ai_assistant", "dismiss_greeting", "User dismissed welcome greeting");
  };

  const handleOpenFromGreeting = () => {
    handleDismissGreeting();
    setIsOpen(true);
    trackDigitalPresence("ai_assistant", "open_from_greeting", "Opened assistant from greeting bubble");
  };

  const toggleAssistant = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setShowGreeting(false);
      try {
        sessionStorage.setItem("indus_ai_greeting_dismissed", "true");
      } catch {
        // ignore
      }
      trackDigitalPresence("ai_assistant", "open_toggle", "Toggled assistant open");
      trackClarityEvent("ai_assistant_open");
    }
  };

  const addBotMessage = (
    text: string,
    quickReplies?: string[],
    links?: ChatMessage["links"],
    matchedProducts?: Product[]
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text,
        timestamp: "Just now",
        quickReplies,
        links,
        products: matchedProducts,
      },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}-${Math.random()}`,
        sender: "user",
        text,
        timestamp: "Just now",
      },
    ]);
  };

  const handleQuickAction = (action: string) => {
    addUserMessage(action);
    trackDigitalPresence("ai_assistant", "quick_action", action);

    switch (action) {
      case "Find a Product":
      case "Find a Robotics Solution": {
        setActiveFlow("solution");
        addBotMessage(
          "Explore our precision robotics hardware catalogue. Select a product domain or open full search:",
          [
            "Articulated 6-Axis Arm",
            "Collaborative Robot (Cobot)",
            "Robotic Welding System",
            "SCARA High-Speed Assembly",
            "Palletizing / Material Handling",
            "Autonomous Mobile Robot (AMR)",
            "Cartesian / Gantry System",
          ],
          [
            { label: "View Complete Products Portfolio", url: "/products" },
            { label: "Open Search Product Finder", url: "/search" },
          ]
        );
        break;
      }

      case "Explore Industry Solutions":
      case "Explore Industry Applications": {
        setActiveFlow("industry");
        addBotMessage(
          "Which manufacturing or logistics sector are you automating?",
          [
            "Automotive & Components",
            "Electronics & Semiconductor",
            "Food & Beverage Packaging",
            "Pharmaceuticals & Healthcare",
            "Warehousing & Intralogistics",
            "Metal Fabrication & CNC",
          ],
          [
            { label: "Explore All Turn-Key Solutions", url: "/solutions" },
          ]
        );
        break;
      }

      case "Request a Quote": {
        openModal("quote");
        addBotMessage(
          "The Commercial RFQ desk has been opened. Enter your component requirements or target volumes for a formal proposal.",
          ["Book Consultation", "Find a Product", "Explore Industry Solutions"],
          [
            { label: "Open Engineering RFQ Form", url: "/contact/engineering-enquiry" },
          ]
        );
        break;
      }

      case "Book Consultation":
      case "Book a Consultation": {
        navigate({ to: "/book-consultation" });
        addBotMessage(
          "Directing to our live Google Calendar booking desk. Choose between Quick Consultation (2 min) or Detailed Project Review (5 min).",
          ["Request a Quote", "Find a Product", "Explore Industry Solutions"]
        );
        break;
      }

      case "Understand My Project Requirements": {
        setActiveFlow("requirements");
        setReqStep(1);
        setReqAnswers({});
        addBotMessage(
          "Let's size your automation requirements. Step 1: What is the maximum payload target (workpiece + end-effector gripper)?",
          [
            "< 5 kg (Light Assembly / Cobot)",
            "5 - 20 kg (Mid-Range Sizing)",
            "20 - 70 kg (Heavy Duty Handling)",
            "> 70 kg (High Payload Palletizing)",
          ]
        );
        break;
      }

      case "Book a Consultation": {
        setActiveFlow("consultation");
        addBotMessage(
          "You can schedule a direct 30-minute technical consultation with an INDUS robotics application engineer. We evaluate CAD feasibility, kinematic envelopes, and cycle times.",
          ["Quick Consultation", "Detailed Project Review", "Back to Main Options"],
          [
            {
              label: "Schedule Consultation on Live Calendar",
              url: "/book-consultation",
              isConsultation: true,
            },
          ]
        );
        break;
      }

      case "Contact the Engineering Team": {
        setActiveFlow("contact");
        addBotMessage(
          "Our engineering headquarters in Chennai, India is available for application reviews, CAD simulations, and plant visits:",
          ["Talk to an Engineer (Form)", "Chat on WhatsApp", "Call +91 44 2624 1155", "Back to Main Options"],
          [
            {
              label: "Book Engineering Consultation",
              url: "/book-consultation",
              isConsultation: true,
            },
          ]
        );
        break;
      }

      // SUB-FLOW: Find a Robotics Solution
      case "Articulated 6-Axis Arm":
      case "Collaborative Robot (Cobot)":
      case "Robotic Welding System":
      case "SCARA High-Speed Assembly":
      case "Palletizing / Material Handling":
      case "Autonomous Mobile Robot (AMR)":
      case "Cartesian / Gantry System": {
        handleKinematicSelection(action);
        break;
      }

      // SUB-FLOW: Explore Industry Applications
      case "Automotive & Components":
      case "Electronics & Semiconductor":
      case "Food & Beverage Packaging":
      case "Pharmaceuticals & Healthcare":
      case "Warehousing & Intralogistics":
      case "Metal Fabrication & CNC": {
        handleIndustrySelection(action);
        break;
      }

      // SUB-FLOW: Requirements sizing
      case "< 5 kg (Light Assembly / Cobot)":
      case "5 - 20 kg (Mid-Range Sizing)":
      case "20 - 70 kg (Heavy Duty Handling)":
      case "> 70 kg (High Payload Palletizing)": {
        setReqAnswers((prev) => ({ ...prev, payload: action }));
        setReqStep(2);
        addBotMessage(
          "Step 2: What is the required working reach radius from the robot base?",
          [
            "< 900 mm (Compact Cell)",
            "900 - 1500 mm (Standard Machine Envelope)",
            "1500 - 2500 mm (Extended Reach / Palletizer)",
            "> 2500 mm (Rail Mounted or Gantry)",
          ]
        );
        break;
      }

      case "< 900 mm (Compact Cell)":
      case "900 - 1500 mm (Standard Machine Envelope)":
      case "1500 - 2500 mm (Extended Reach / Palletizer)":
      case "> 2500 mm (Rail Mounted or Gantry)": {
        setReqAnswers((prev) => ({ ...prev, reach: action }));
        setReqStep(3);
        addBotMessage(
          "Step 3: What is the target production rate or robot cycle time?",
          [
            "< 4 seconds / part (Rapid Pick & Place)",
            "4 - 12 seconds / part (Standard Machine Tending)",
            "12 - 30 seconds / part (Continuous Arc / Laser Welding)",
            "Flexible / In Planning Phase",
          ]
        );
        break;
      }

      case "< 4 seconds / part (Rapid Pick & Place)":
      case "4 - 12 seconds / part (Standard Machine Tending)":
      case "12 - 30 seconds / part (Continuous Arc / Laser Welding)":
      case "Flexible / In Planning Phase": {
        const finalAnswers = { ...reqAnswers, cycleTime: action };
        setReqAnswers(finalAnswers);
        setReqStep(4);
        addBotMessage(
          `Requirements Summary:\n• Payload: ${finalAnswers.payload}\n• Reach: ${finalAnswers.reach}\n• Cycle Target: ${action}\n\nOur engineering team can run a preliminary reach simulation and cycle-time study for this exact envelope.`,
          ["Book Consultation with These Parameters", "Start Over", "Explore Catalogues"],
          [
            {
              label: "Lock Slot in Google Calendar",
              url: "/book-consultation",
              isConsultation: true,
            },
          ]
        );
        break;
      }

      case "Book Consultation with These Parameters":
      case "Quick Consultation":
      case "Detailed Project Review": {
        setIsOpen(false);
        navigate({ to: "/book-consultation" });
        break;
      }

      case "Talk to an Engineer (Form)": {
        setIsOpen(false);
        openModal("engineer");
        break;
      }

      case "Chat on WhatsApp": {
        window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
        break;
      }

      case "Call +91 44 2624 1155": {
        window.location.href = "tel:+914426241155";
        break;
      }

      case "Back to Main Options":
      case "Start Over": {
        setActiveFlow(null);
        setReqStep(0);
        setReqAnswers({});
        addBotMessage("How else can I assist your automation project today?", [...QUICK_ACTIONS]);
        break;
      }

      case "Explore Catalogues": {
        setIsOpen(false);
        navigate({ to: "/products" });
        break;
      }

      default: {
        handleFreeformQuery(action);
      }
    }
  };

  const handleKinematicSelection = (kinematic: string) => {
    let matched = products.slice(0, 2);
    let desc = "";

    if (kinematic.includes("6-Axis") || kinematic.includes("Articulated")) {
      matched = products.filter((p) => p.categorySlug === "robotic-arms" || p.categorySlug === "industrial-robots").slice(0, 2);
      desc = "INDUS 6-axis articulated robots provide high wrist torque, ±0.03 mm repeatability, and industrial fieldbus integration (Siemens, Beckhoff, EtherCAT).";
    } else if (kinematic.includes("Cobot")) {
      matched = products.filter((p) => p.categorySlug === "robotic-arms").slice(0, 2);
      desc = "Collaborative robots feature integrated torque sensors on all joints, hand-guiding lead-through teaching, and ISO 10218-1 / ISO/TS 15066 safety compliance.";
    } else if (kinematic.includes("Welding")) {
      matched = products.filter((p) => p.categorySlug === "robotic-arms" || p.categorySlug === "industrial-robots").slice(0, 2);
      desc = "Dedicated robotic welding systems with seam tracking, coordinated rotary positioners, and digital weld power source interfaces.";
    } else if (kinematic.includes("SCARA")) {
      matched = products.filter((p) => p.categorySlug === "robotic-arms").slice(0, 2);
      desc = "SCARA high-speed 4-axis robots designed for rapid assembly, screwdriving, and high-frequency pick-and-place operations.";
    } else if (kinematic.includes("Palletizing")) {
      matched = products.filter((p) => p.categorySlug === "industrial-robots").slice(0, 2);
      desc = "Heavy-payload articulated palletizing robots capable of stacking corrugated boxes, bags, and automotive crates up to 2.4m stack heights.";
    } else if (kinematic.includes("AMR")) {
      matched = products.filter((p) => p.categorySlug === "robotic-wheels").slice(0, 2);
      desc = "Autonomous Mobile Robots (AMRs) with natural feature LiDAR navigation, fleet management, and automated docking.";
    } else {
      matched = products.filter((p) => p.categorySlug === "actuators").slice(0, 2);
      desc = "Cartesian gantries and linear actuators for long-stroke transfers, machine tending, and multi-axis CNC loading.";
    }

    addBotMessage(
      `${desc}\n\nRecommended next steps:`,
      ["Book a Consultation", "Explore More Solutions", "Back to Main Options"],
      [
        {
          label: "Book Application Sizing Review",
          url: "/book-consultation",
          isConsultation: true,
        },
        {
          label: "View All Robotics Products",
          url: "/products",
        },
      ],
      matched.length > 0 ? matched : undefined
    );
  };

  const handleIndustrySelection = (ind: string) => {
    let summary = "";
    let targetUrl = "/solutions";

    if (ind.includes("Automotive")) {
      summary = "Automotive applications include BIW spot & laser welding cells, powertrain machine tending, stamping transfer, and EV battery module assembly.";
      targetUrl = "/solutions";
    } else if (ind.includes("Electronics")) {
      summary = "Electronics applications require cleanroom-compatible (ISO Class 4/5) SCARA robots, SMD tray loading, precision dispensing, and automated optical inspection (AOI).";
      targetUrl = "/solutions";
    } else if (ind.includes("Food")) {
      summary = "Food and beverage automation features washdown IP69K stainless steel delta robots, secondary packaging, and high-speed end-of-line palletizing cells.";
      targetUrl = "/solutions";
    } else if (ind.includes("Pharma")) {
      summary = "Pharmaceutical automation includes aseptic vial handling, serialization, blister pack carton loading, and ISO cleanroom robotics.";
      targetUrl = "/solutions";
    } else if (ind.includes("Warehousing")) {
      summary = "Intralogistics automation utilizes AMRs, pallet conveyor sorting, case packing, and automated high-bay transfer mechanisms.";
      targetUrl = "/solutions";
    } else {
      summary = "Metal fabrication applications include CNC lathe/VMC auto-tending, brake press robotic bending, deburring cells, and robotic arc welding.";
      targetUrl = "/solutions";
    }

    addBotMessage(
      `${summary}\n\nWould you like to review relevant cells or schedule an engineering consultation?`,
      ["Book Consultation for This Industry", "Explore Solutions Page", "Back to Main Options"],
      [
        {
          label: "Schedule Consultation with Applications Team",
          url: "/book-consultation",
          isConsultation: true,
        },
        {
          label: "View Automation Solutions",
          url: targetUrl,
        },
      ]
    );
  };

  const handleFreeformQuery = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes("book") || q.includes("consult") || q.includes("meeting") || q.includes("schedule") || q.includes("calendar")) {
      addBotMessage(
        "You can reserve an engineering consultation directly on our calendar. Choose between Quick Consultation (15-min scope check) and Detailed Project Review (30-min CAD & kinematics review).",
        ["Book Consultation Now", "Contact Engineering Team"],
        [
          {
            label: "Open Consultation Calendar",
            url: "/book-consultation",
            isConsultation: true,
          },
        ]
      );
    } else if (q.includes("price") || q.includes("cost") || q.includes("quote") || q.includes("pricing")) {
      addBotMessage(
        "Industrial robotics pricing depends on required payload, reach envelope, end-of-arm tooling (EOAT), safety fencing, and fieldbus line integration. We provide formal commercial quotes following an engineering feasibility review.",
        ["Book a Consultation", "Request a Quote (Form)", "Chat on WhatsApp"],
        [
          {
            label: "Book Free Engineering Consultation",
            url: "/book-consultation",
            isConsultation: true,
          },
        ]
      );
    } else if (q.includes("weld")) {
      handleKinematicSelection("Robotic Welding System");
    } else if (q.includes("cobot") || q.includes("collaborative")) {
      handleKinematicSelection("Collaborative Robot (Cobot)");
    } else if (q.includes("pallet")) {
      handleKinematicSelection("Palletizing / Material Handling");
    } else if (q.includes("amr") || q.includes("agv") || q.includes("mobile")) {
      handleKinematicSelection("Autonomous Mobile Robot (AMR)");
    } else if (q.includes("scara")) {
      handleKinematicSelection("SCARA High-Speed Assembly");
    } else if (q.includes("where") || q.includes("location") || q.includes("chennai") || q.includes("address")) {
      addBotMessage(
        "INDUS Robotics is based in Chennai, Tamil Nadu, India. Our Tech Center features operational demonstration cells for articulated robots, cobots, and precision kinematics. In-person facility visits are welcomed.",
        ["Book On-Site Visit", "Contact Details", "Back to Main Options"],
        [
          {
            label: "Book On-Site Tech Center Consultation",
            url: "/book-consultation",
            isConsultation: true,
          },
        ]
      );
    } else {
      addBotMessage(
        "Thank you for your question. As an industrial assistant grounded in verified technical data, I can guide kinematics sizing, cell architectures, and schedule an appointment with our senior application engineers.",
        ["Find a Robotics Solution", "Explore Industry Applications", "Book a Consultation", "Contact the Engineering Team"],
        [
          {
            label: "Book Engineering Consultation",
            url: "/book-consultation",
            isConsultation: true,
          },
        ]
      );
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal.trim();
    setInputVal("");
    addUserMessage(text);
    trackDigitalPresence("ai_assistant", "typed_query", text);
    setTimeout(() => {
      handleFreeformQuery(text);
    }, 400);
  };

  const handleReset = () => {
    setActiveFlow(null);
    setReqStep(0);
    setReqAnswers({});
    setMessages([
      {
        id: "initial-reset",
        sender: "bot",
        text: INITIAL_GREETING,
        timestamp: "Just now",
        quickReplies: [...QUICK_ACTIONS],
      },
    ]);
    trackDigitalPresence("ai_assistant", "reset", "Reset chat");
  };

  return (
    <>
      {/* 1. NON-BLOCKING ENTRANCE GREETING BUBBLE (Phase 6 requirement) */}
      {showGreeting && !isOpen && (
        <aside
          role="complementary"
          aria-label="Welcome Assistant Message"
          className="fixed bottom-36 right-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-md border border-signal/40 bg-[#0b1329] p-4 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 md:bottom-20 md:right-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-signal" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-signal">
                INDUS Robotics AI
              </span>
            </div>
            <button
              onClick={handleDismissGreeting}
              aria-label="Dismiss welcome message"
              className="text-white/60 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/10"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <p className="mt-2.5 text-xs text-white/90 leading-relaxed font-sans">
            {INITIAL_GREETING}
          </p>

          {/* 4 Quick Action Pills */}
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                handleDismissGreeting();
                setIsOpen(true);
                handleQuickAction("Find a Product");
              }}
              className="rounded border border-white/15 bg-white/5 px-2 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:border-primary hover:text-primary transition-colors"
            >
              • Find a Product
            </button>
            <button
              type="button"
              onClick={() => {
                handleDismissGreeting();
                setIsOpen(true);
                handleQuickAction("Explore Industry Solutions");
              }}
              className="rounded border border-white/15 bg-white/5 px-2 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:border-primary hover:text-primary transition-colors"
            >
              • Industry Solutions
            </button>
            <button
              type="button"
              onClick={() => {
                handleDismissGreeting();
                openModal("quote");
              }}
              className="rounded border border-white/15 bg-white/5 px-2 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:border-primary hover:text-primary transition-colors"
            >
              • Request a Quote
            </button>
            <button
              type="button"
              onClick={() => {
                handleDismissGreeting();
                navigate({ to: "/book-consultation" });
              }}
              className="rounded border border-primary/30 bg-primary/10 px-2 py-1.5 text-left text-[11px] font-medium text-primary hover:border-primary hover:bg-primary/20 transition-colors"
            >
              • Book Consultation
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleDismissGreeting}
              className="text-xs font-semibold text-white/60 hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={handleOpenFromGreeting}
              className="text-xs font-bold uppercase tracking-wide h-8 bg-primary hover:bg-[#1a74dc] text-white"
            >
              <Bot size={13} className="mr-1.5 text-white" />
              <span>Ask Assistant</span>
            </Button>
          </div>
        </aside>
      )}

      {/* 2. PERSISTENT ASSISTANT LAUNCHER BUTTON */}
      <button
        onClick={toggleAssistant}
        aria-label={isOpen ? "Close Robotics Assistant" : "Open Robotics Assistant"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="fixed bottom-20 right-4 z-40 flex h-11 items-center gap-2 rounded-md border border-slate-700 bg-[#101B2D] px-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xl transition-all hover:border-primary hover:shadow-[0_0_16px_rgba(35,136,255,0.35)] md:bottom-6 md:right-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="grid size-6 place-items-center rounded-sm bg-primary text-white">
          {isOpen ? <X size={15} /> : <Bot size={15} />}
        </span>
        <span className="hidden sm:inline font-mono">
          {isOpen ? "Close Assistant" : "Robotics Assistant"}
        </span>
      </button>

      {/* 3. ASSISTANT CHAT DRAWER */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="INDUS Robotics Assistant"
          aria-modal="true"
          className="fixed bottom-36 right-4 z-40 flex w-[calc(100%-2rem)] max-w-md flex-col rounded-md border border-slate-700 bg-card shadow-2xl md:bottom-20 md:right-6 animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#101B2D] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-md bg-primary/20 text-primary border border-primary/30">
                <Bot size={17} />
              </span>
              <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
                  INDUS Engineering Assistant
                </h3>
                <span className="text-[10px] font-mono text-signal flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Verified Robotics Knowledge
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                <RefreshCw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="p-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background text-sm max-h-[50vh]">
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"} space-y-1.5`}
                >
                  <div
                    className={`max-w-[90%] rounded-md px-3.5 py-2.5 text-xs leading-relaxed ${
                      isBot
                        ? "bg-card border border-border text-foreground shadow-sm"
                        : "bg-signal text-signal-foreground font-medium shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Matched Products Card Previews */}
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-border">
                        <span className="text-[10px] font-mono font-bold uppercase text-signal block">
                          Verified Technical Hardware Matches:
                        </span>
                        {m.products.map((p) => (
                          <div
                            key={p.id}
                            className="rounded-md border border-border bg-background p-2.5 text-left space-y-1"
                          >
                            <span className="text-[9px] font-mono uppercase text-muted-foreground block">
                              {p.category}
                            </span>
                            <div className="font-semibold text-xs text-foreground">{p.name}</div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{p.overview}</p>
                            <div className="flex gap-2 pt-1.5">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] px-2.5"
                                onClick={() => setIsOpen(false)}
                              >
                                <Link
                                  to="/products/$category/$id"
                                  params={{ category: p.categorySlug, id: p.slug }}
                                >
                                  View Specs
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                className="h-7 text-[11px] px-2.5"
                                onClick={() => {
                                  setIsOpen(false);
                                  navigate({ to: "/book-consultation" });
                                }}
                              >
                                Book Sizing
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    {m.links && m.links.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1.5 pt-2 border-t border-border">
                        {m.links.map((link, idx) => (
                          <Button
                            key={idx}
                            asChild
                            size="sm"
                            variant={link.isConsultation ? "default" : "outline"}
                            className="h-8 justify-between text-xs"
                            onClick={() => setIsOpen(false)}
                          >
                            <Link to={link.url as any}>
                              <span className="flex items-center gap-1.5">
                                {link.isConsultation && <Calendar size={13} className="text-signal" />}
                                {link.label}
                              </span>
                              <ArrowRight size={13} />
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
                          className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-signal hover:bg-signal/5 hover:text-signal transition-all text-left"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Technical Validation Notice */}
          <div className="border-t border-border bg-muted/30 px-3.5 py-2 text-[10px] text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldAlert size={12} className="text-signal shrink-0" />
              <span>Grounded in verified engineering specifications.</span>
            </span>
            <Link
              to="/book-consultation"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-signal hover:underline"
            >
              Book Consultation →
            </Link>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleInputSubmit}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              type="text"
              placeholder="Ask about payloads, cycle times, or welding..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-signal focus:border-signal"
            />
            <Button
              type="submit"
              size="sm"
              variant="default"
              disabled={!inputVal.trim()}
              className="h-8 px-3 shrink-0"
              aria-label="Send message"
            >
              <Send size={13} />
            </Button>
          </form>
        </aside>
      )}
    </>
  );
}
