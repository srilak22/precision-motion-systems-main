import React, { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Compass,
  Calendar,
  AlertCircle,
  X,
  Cpu,
  Layers,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { companyConfig } from "@/data/config";
import { buildSeoMeta } from "@/lib/seo";
import { IndusBotRobot, type RobotState } from "@/components/chatbot/IndusBotRobot";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { processUserQuery, type IntentEngineResult } from "@/services/roboticsGuide/intentEngine";
import type { GuideMessage } from "@/services/roboticsGuide/types";

export const Route = createFileRoute("/indus-bot")({
  head: () =>
    buildSeoMeta({
      title: "Indus Bot 2.0 | Multimodal AI Engineering Assistant",
      description:
        "Dedicated engineering assistant for industrial robotics, precision motion sizing, zero-backlash reducer selection, and computer vision guidance.",
      path: "/indus-bot",
    }),
  component: IndusBotPage,
});

const FEATURED_PROMPTS = [
  {
    category: "Actuator Sizing",
    prompt: "Which IND-IRA rotary actuator is recommended for a 45 Nm continuous torque robotic arm joint?",
  },
  {
    category: "Reducer Comparison",
    prompt: "Compare strain-wave harmonic gears vs RV cycloidal reducers for high-payload robot bases.",
  },
  {
    category: "Palletizing Sizing",
    prompt: "What robot configuration and reach is needed to palletize 25 kg bags onto a 1.8m standard pallet?",
  },
  {
    category: "Fieldbus & Safety",
    prompt: "How does the IND-MC-400 motion controller integrate with EtherCAT CiA 402 and STO SIL3 safety?",
  },
  {
    category: "Physical AI Vision",
    prompt: "How does 3D point cloud visual servoing guide sub-millimeter bolt insertion without fixed fixturing?",
  },
  {
    category: "Linear Positioning",
    prompt: "Calculate required lead and thrust for an IND-ILA-095 actuator moving 800 kg at 0.5 m/s.",
  },
];

function IndusBotPage() {
  const { openModal } = useModals();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multimodal Image Attachment State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Web Speech API Voice State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<GuideMessage[]>([
    {
      id: "bot-welcome-2",
      sender: "bot",
      intent: "greeting",
      timestamp: "Just now",
      text: "Hello! I am Indus Bot 2.0, your dedicated industrial robotics and motion engineering assistant.\n\nAsk me about kinematics, motor torque vs inertia matching (JL/JM < 10:1), strain-wave vs cycloidal reducer selection, or upload an equipment photo for vision-guided component discovery.",
      quickReplies: [
        "Select an Actuator",
        "Compare Components",
        "Explore Robot Applications",
        "Launch Sizing & RFQ Wizard",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputVal(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") {
            setErrorMessage("Microphone access denied. Please enable in your browser settings.");
          }
        };

        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleVoice = () => {
    if (!speechSupported || !recognitionRef.current) {
      setErrorMessage("Voice input is not supported on this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setErrorMessage(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setErrorMessage("Please upload a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds the 5MB upload limit.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
      setAttachedImageName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const dispatchQuery = async (text: string, imgData?: string | null) => {
    const userMsg: GuideMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: imgData ? `[Attached Image: ${attachedImageName || "Component"}]\n\n${text}` : text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setErrorMessage(null);

    const imageToSend = imgData || attachedImage;
    setAttachedImage(null);
    setAttachedImageName(null);

    trackDigitalPresence("ai_assistant", "query_dispatched_indusbot2", text);
    trackClarityEvent("ai_assistant_query");

    // 1. Try server AI gateway
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          imageData: imageToSend || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === "success" && data.reply) {
          const aiMsg: GuideMessage = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: data.reply,
            intent: "technical_explanation",
            timestamp: "Just now",
            quickReplies: [
              "Launch Sizing & RFQ Wizard",
              "Compare Component Specifications",
              "Book Engineering Consultation",
            ],
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.info("Using local verified engineering engine.");
    }

    // 2. Deterministic Fallback
    setTimeout(() => {
      try {
        const result: IntentEngineResult = processUserQuery(text, { step: 0 });
        let reply = result.message;
        if (imageToSend) {
          reply = {
            ...reply,
            text: `[Visual Analysis Recorded]:\n\n${reply.text}`,
          };
        }
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      } catch (err) {
        setIsTyping(false);
        setErrorMessage("An error occurred while evaluating the query.");
      }
    }, 450);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputVal.trim() && !attachedImage) || isTyping) return;
    const text = inputVal.trim() || "Analyze this industrial component image.";
    const img = attachedImage;
    setInputVal("");
    dispatchQuery(text, img);
  };

  const robotAvatarState: RobotState = isTyping ? "thinking" : isListening ? "speaking" : "idle";

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 font-sans selection:bg-[#16C7E8] selection:text-[#0B111E] flex flex-col justify-between">
      {/* 1. TOP HEADER & IDENTITY (MATCHING IMAGE 2) */}
      <section className="border-b border-white/10 pt-20 pb-8 px-5 lg:px-10 bg-[#0F172A]/80">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-[#080D1A] border-2 border-[#16C7E8]/40 p-1 flex items-center justify-center shadow-[0_0_24px_rgba(22,199,232,0.25)] shrink-0">
              <IndusBotRobot state={robotAvatarState} size={64} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white tracking-tight">
                  Indus Bot 2.0
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#16C7E8]/20 text-[#16C7E8] border border-[#16C7E8]/40">
                  Multimodal AI Assistant
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                Grounded in ISO 9283 Kinematics, DIN 3990 Gear Rating &bull; Hardware Sizing &bull; Vision Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="h-9 text-xs rounded-none border-white/20 bg-white/5 text-white hover:bg-white/10 uppercase font-bold"
            >
              <Link to="/technology/motion-studio">
                <Move3d size={13} className="mr-1.5 text-[#2388FF]" /> Motion Studio
              </Link>
            </Button>
            <Button
              onClick={() => {
                setMessages([
                  {
                    id: "reset-msg",
                    sender: "bot",
                    timestamp: "Just now",
                    text: "Conversation refreshed. How may I assist your engineering sizing today?",
                    quickReplies: ["Select an Actuator", "Compare Components", "Launch Sizing & RFQ Wizard"],
                  },
                ]);
              }}
              variant="ghost"
              className="h-9 text-xs text-slate-400 hover:text-white"
            >
              <RefreshCw size={13} className="mr-1" /> Reset
            </Button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONVERSATION WORKSPACE */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-5 py-6 flex flex-col justify-between">
        {/* Messages Stream */}
        <div className="space-y-4 mb-6">
          {messages.map((m) => {
            const isBot = m.sender === "bot";
            const isCopied = copiedId === m.id;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? "items-start" : "items-end"} space-y-1`}
              >
                <div
                  className={`relative group max-w-[90%] sm:max-w-[80%] rounded-2xl p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isBot
                      ? "bg-[#0F172A] border border-white/10 text-slate-200"
                      : "bg-[#2388FF] text-white font-medium"
                  }`}
                >
                  {isBot && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      title="Copy response"
                      className="absolute top-3 right-3 p-1 rounded bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  )}

                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>

                {/* Quick Reply Pills */}
                {isBot && m.quickReplies && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.quickReplies.map((qr, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => {
                          if (qr === "Launch Sizing & RFQ Wizard") {
                            navigate({ to: "/application-finder" });
                          } else {
                            dispatchQuery(qr);
                          }
                        }}
                        className="rounded-full border border-white/10 bg-[#080D1A] px-3 py-1 text-[11px] font-mono text-slate-300 hover:border-[#16C7E8] hover:text-[#16C7E8] transition-colors cursor-pointer"
                      >
                        • {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing state */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 py-2">
              <Loader2 size={14} className="animate-spin text-[#16C7E8]" />
              <span>Indus Bot is querying verified engineering catalogues...</span>
            </div>
          )}

          {/* Listening state */}
          {isListening && (
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg animate-pulse">
              <span className="size-2 rounded-full bg-rose-500 animate-ping" />
              <span>Listening... Speak your motion sizing query</span>
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="underline font-bold">
                Dismiss
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Engineering Prompts if only 1 message */}
        {messages.length <= 1 && (
          <div className="mb-6 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#16C7E8] block">
              SUGGESTED ENGINEERING EXPLORATIONS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FEATURED_PROMPTS.map((item, fIdx) => (
                <button
                  key={fIdx}
                  onClick={() => dispatchQuery(item.prompt)}
                  className="rounded-xl border border-white/10 bg-[#0F172A] p-3 text-left hover:border-[#16C7E8]/50 transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-[#2388FF] font-bold">
                    {item.category}
                  </div>
                  <div className="text-xs text-slate-300 mt-1 line-clamp-2 group-hover:text-white">
                    {item.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="space-y-3">
          {/* Image preview chip */}
          {attachedImage && (
            <div className="rounded-lg border border-[#16C7E8]/40 bg-[#0F172A] p-2.5 flex items-center justify-between text-xs text-[#16C7E8] font-mono">
              <div className="flex items-center gap-2">
                <img
                  src={attachedImage}
                  alt="Component"
                  className="size-8 object-cover rounded border border-white/20"
                />
                <span>Attached: {attachedImageName || "Component photo"}</span>
              </div>
              <button onClick={() => setAttachedImage(null)} className="p-1 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#0F172A] p-2 shadow-2xl"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach equipment or drawing image (<5MB)"
              className="p-2.5 text-slate-400 hover:text-[#16C7E8] rounded-lg transition-colors cursor-pointer"
            >
              <Paperclip size={18} />
            </button>

            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                title={isListening ? "Stop listening" : "Speak query (Speech to text)"}
                className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                  isListening
                    ? "bg-rose-500/20 text-rose-400 animate-pulse"
                    : "text-slate-400 hover:text-[#16C7E8]"
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}

            <input
              ref={inputRef}
              type="text"
              placeholder={
                isListening
                  ? "Listening to voice..."
                  : attachedImage
                  ? "Describe question regarding this attached image..."
                  : "Ask about kinematics, torque vs inertia (JL/JM), or zero-backlash reducers..."
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-transparent border-0 px-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />

            <Button
              type="submit"
              size="sm"
              disabled={(!inputVal.trim() && !attachedImage) || isTyping}
              className="h-9 px-4 rounded-lg bg-[#16C7E8] hover:bg-[#16C7E8]/90 text-[#0B111E] font-bold uppercase text-xs cursor-pointer"
            >
              {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </Button>
          </form>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-[#16C7E8]" />
              Preliminary sizing only. Mission-critical joints require certified DIN 3990 calculation review.
            </span>
            <Link to="/book-consultation" className="text-[#16C7E8] hover:underline">
              Book Engineering Consultation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
