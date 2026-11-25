import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, RotateCcw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";
import { buildSeoMeta } from "@/lib/seo";
import {
  MotionStudio3DCanvas,
  type StudioPreset,
} from "@/components/technology/MotionStudio3DCanvas";

export const Route = createFileRoute("/technology/motion-studio")({
  head: () =>
    buildSeoMeta({
      title: "INDUS Motion Studio — 3D Multi-Axis Robotics Simulator",
      description:
        "Interactive 3D multi-axis robotic workcell simulator with 7th-axis linear rail, rotary index table, and real-time trajectory visualization.",
      path: "/technology/motion-studio",
    }),
  component: MotionStudioPage,
});

const PRESETS: Record<
  StudioPreset,
  { label: string; cycleTime: string; payload: string; repeatability: string; inertiaRatio: string }
> = {
  "dual-welding": {
    label: "Dual-Arm Welding Cell",
    cycleTime: "3.4 s",
    payload: "2 × 20 kg",
    repeatability: "±0.02 mm",
    inertiaRatio: "3.2 : 1",
  },
  "cnc-tending": {
    label: "CNC Machine Tending",
    cycleTime: "5.8 s",
    payload: "65 kg",
    repeatability: "±0.03 mm",
    inertiaRatio: "4.1 : 1",
  },
  "pick-place": {
    label: "High-Speed Pick & Place",
    cycleTime: "0.9 s",
    payload: "2 × 8 kg",
    repeatability: "±0.01 mm",
    inertiaRatio: "2.4 : 1",
  },
};

function MotionStudioPage() {
  const { openModal } = useModals();
  const [preset, setPreset] = useState<StudioPreset>("dual-welding");
  const [railOffset, setRailOffset] = useState(0);
  const [tableAngle, setTableAngle] = useState(0);
  const [j2Offset, setJ2Offset] = useState(0);
  const [j3Offset, setJ3Offset] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  const metrics = PRESETS[preset];

  const handleResetControls = () => {
    setRailOffset(0);
    setTableAngle(0);
    setJ2Offset(0);
    setJ3Offset(0);
    setSpeed(1);
    setShowEnvelope(true);
    setShowTrails(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Compact Header */}
      <section className="border-b border-slate-200 bg-white px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/technology"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:underline mb-2"
            >
              <ArrowLeft size={13} /> Technology Stack
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-slate-900">
              INDUS Motion Studio
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Interactive 3D multi-axis workcell &amp; trajectory visualizer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => openModal("engineer", { categoryName: "Motion Studio Sizing" })}
              className="h-10 rounded-lg bg-[#155EEF] hover:bg-[#1047BF] text-white font-bold uppercase text-xs px-5 cursor-pointer"
            >
              <Wrench size={14} className="mr-1.5" /> Request Sizing
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-lg border-slate-300 bg-white text-slate-800 hover:border-[#155EEF] hover:text-[#155EEF] font-bold uppercase text-xs px-5"
            >
              <Link to="/book-consultation">
                <Calendar size={14} className="mr-1.5 text-[#155EEF]" /> Book Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main 3D Studio Workspace */}
      <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Viewport + Live Telemetry Strip */}
          <div className="lg:col-span-8 space-y-4">
            <MotionStudio3DCanvas
              preset={preset}
              railOffset={railOffset}
              tableAngle={tableAngle}
              j2Offset={j2Offset}
              j3Offset={j3Offset}
              showEnvelope={showEnvelope}
              showTrails={showTrails}
              speed={speed}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
            />

            {/* 4 Clean Live KPI Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Cycle Time
                </span>
                <span className="mt-1 block font-mono text-lg font-bold text-slate-900">
                  {metrics.cycleTime}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Rated Payload
                </span>
                <span className="mt-1 block font-mono text-lg font-bold text-slate-900">
                  {metrics.payload}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Repeatability
                </span>
                <span className="mt-1 block font-mono text-lg font-bold text-[#155EEF]">
                  {metrics.repeatability}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Inertia Ratio
                </span>
                <span className="mt-1 block font-mono text-lg font-bold text-emerald-700">
                  {metrics.inertiaRatio}
                </span>
              </div>
            </div>
          </div>

          {/* Right Control Panel (Only Essential Controls) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">
                Workcell Controls
              </h2>
              <button
                type="button"
                onClick={handleResetControls}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:underline cursor-pointer"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Workcell Preset */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Cell Configuration
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {(Object.keys(PRESETS) as StudioPreset[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPreset(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      preset === key
                        ? "border-[#155EEF] bg-blue-50 text-[#155EEF]"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                    }`}
                  >
                    {PRESETS[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kinematic Sliders */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600">7th-Axis Rail (E1)</span>
                  <span className="font-bold text-slate-900">{Math.round(railOffset * 1000)} mm</span>
                </div>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.05}
                  value={railOffset}
                  onChange={(e) => setRailOffset(parseFloat(e.target.value))}
                  className="w-full accent-[#155EEF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600">Rotary Table (A)</span>
                  <span className="font-bold text-slate-900">{tableAngle}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={5}
                  value={tableAngle}
                  onChange={(e) => setTableAngle(parseFloat(e.target.value))}
                  className="w-full accent-[#155EEF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600">Shoulder Pitch (J2)</span>
                  <span className="font-bold text-slate-900">{j2Offset}°</span>
                </div>
                <input
                  type="range"
                  min={-25}
                  max={25}
                  step={1}
                  value={j2Offset}
                  onChange={(e) => setJ2Offset(parseFloat(e.target.value))}
                  className="w-full accent-[#155EEF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600">Elbow Pitch (J3)</span>
                  <span className="font-bold text-slate-900">{j3Offset}°</span>
                </div>
                <input
                  type="range"
                  min={-25}
                  max={25}
                  step={1}
                  value={j3Offset}
                  onChange={(e) => setJ3Offset(parseFloat(e.target.value))}
                  className="w-full accent-[#155EEF]"
                />
              </div>
            </div>

            {/* Visual Effects & Speed */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Speed</span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 font-mono text-[11px]">
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={`px-2.5 py-1 rounded-md cursor-pointer ${
                        speed === s ? "bg-[#155EEF] text-white font-bold" : "text-slate-600"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Show 3D Reach Envelope</span>
                <input
                  type="checkbox"
                  checked={showEnvelope}
                  onChange={(e) => setShowEnvelope(e.target.checked)}
                  className="accent-[#155EEF] size-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Show Glowing TCP Trails</span>
                <input
                  type="checkbox"
                  checked={showTrails}
                  onChange={(e) => setShowTrails(e.target.checked)}
                  className="accent-[#155EEF] size-4"
                />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
