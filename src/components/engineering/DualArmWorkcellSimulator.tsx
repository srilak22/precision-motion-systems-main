import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Move3d,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cpu,
  Layers,
  Wrench,
  Maximize2,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/ModalContext";

export function DualArmWorkcellSimulator() {
  const { openModal } = useModals();

  // 7th Axis Linear Position (meters along track)
  const [railPosM, setRailPosM] = useState<number>(2.4);
  const [robot1ArmAngle, setRobot1ArmAngle] = useState<number>(-25);
  const [robot2ArmAngle, setRobot2ArmAngle] = useState<number>(35);
  const [fixtureAngle, setFixtureAngle] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Configuration toggles matching Image 4
  const [flipBase, setFlipBase] = useState<boolean>(false);
  const [flipElbow, setFlipElbow] = useState<boolean>(false);
  const [flipWrist, setFlipWrist] = useState<boolean>(false);
  const [railControlMode, setRailControlMode] = useState<"direct" | "synchronized">("synchronized");
  const [operationType, setOperationType] = useState<"chassis-welding" | "stamping-handling">("chassis-welding");

  // Dynamic animation ticker
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFixtureAngle((prev) => (prev + 1) % 360);
      setRobot1ArmAngle((prev) => -25 + Math.sin(Date.now() * 0.002) * 12);
      setRobot2ArmAngle((prev) => 35 + Math.cos(Date.now() * 0.002) * 14);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="rounded-2xl border border-border/80 bg-[#0F172A] text-slate-100 overflow-hidden shadow-2xl font-mono">
      {/* Top Header Bar matching Image 4 (CubeCADTech style) */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#080D1A] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-bold text-white uppercase tracking-wider">INDUS Motion Studio</span>
            <span>/</span>
            <span className="text-[#16C7E8]">Chassis Welding Cell 2</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Dual Robot · 7th-Axis Linear Track
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 text-xs font-bold uppercase rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "Pause Kinematics" : "Simulate Motion"}</span>
          </button>
          <button
            onClick={() => {
              setRailPosM(2.4);
              setFixtureAngle(15);
            }}
            title="Reset Simulation View"
            className="p-1.5 text-slate-400 hover:text-white rounded bg-white/5 cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Control Panel matching Image 4 sidebar */}
        <div className="lg:col-span-4 border-r border-white/10 bg-[#080D1A]/90 p-4 space-y-4 text-xs">
          {/* Operations Module */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
              <span>Setup &amp; Tooling</span>
              <span className="text-[#16C7E8]">Model: FANUC / KUKA Type</span>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#0F172A] p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Operation:</span>
                <select
                  value={operationType}
                  onChange={(e) => setOperationType(e.target.value as any)}
                  className="bg-[#080D1A] border border-white/20 text-white text-[11px] rounded px-2 py-1 outline-none"
                >
                  <option value="chassis-welding">Chassis Welding 2</option>
                  <option value="stamping-handling">Stamping Press Unload</option>
                </select>
              </div>

              <div className="text-[10px] text-slate-400 space-y-1 pt-1 border-t border-white/5">
                <div className="flex justify-between">
                  <span>Robot 1 (A1):</span>
                  <span className="text-emerald-400">Primary Spot Gun (35 kg)</span>
                </div>
                <div className="flex justify-between">
                  <span>Robot 2 (A2):</span>
                  <span className="text-emerald-400">Seam Tracking Laser (18 kg)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7th-Axis Linear Rail Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
              <span>7th-Axis Linear Physical Axis (E1)</span>
              <span className="text-[#16C7E8]">{railPosM.toFixed(2)} m / 6.0 m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.5"
              step="0.05"
              value={railPosM}
              onChange={(e) => setRailPosM(parseFloat(e.target.value))}
              className="w-full accent-[#16C7E8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Station 1 (0.5m)</span>
              <span>Center Car (3.0m)</span>
              <span>Station 2 (5.5m)</span>
            </div>
          </div>

          {/* Inverse Kinematics Flags matching Image 4 */}
          <div className="rounded-lg border border-white/10 bg-[#0F172A] p-3 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-white/5 pb-1">
              Inverse Kinematics Flags
            </span>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Flip Base (J1):</span>
              <button
                onClick={() => setFlipBase(!flipBase)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  flipBase ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"
                }`}
              >
                {flipBase ? "Enabled" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Flip Elbow (J3):</span>
              <button
                onClick={() => setFlipElbow(!flipElbow)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  flipElbow ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"
                }`}
              >
                {flipElbow ? "Enabled" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Flip Wrist (J5):</span>
              <button
                onClick={() => setFlipWrist(!flipWrist)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  flipWrist ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"
                }`}
              >
                {flipWrist ? "Enabled" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              <span className="text-slate-300">7th Axis Mode:</span>
              <button
                onClick={() =>
                  setRailControlMode(railControlMode === "synchronized" ? "direct" : "synchronized")
                }
                className="text-[10px] text-[#16C7E8] font-bold underline"
              >
                {railControlMode === "synchronized" ? "Synchronized Path" : "Direct Point"}
              </button>
            </div>
          </div>

          {/* Sizing Results Quick Panel */}
          <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
            <div className="flex justify-between">
              <span>Inertia Ratio (JL / JM):</span>
              <span className="text-emerald-400 font-bold">4.2 : 1 (&lt; 10:1 Optimal)</span>
            </div>
            <div className="flex justify-between">
              <span>Wrist Torque Margin:</span>
              <span className="text-white font-bold">48% reserve</span>
            </div>
            <div className="flex justify-between">
              <span>Rail Servo Motor:</span>
              <span className="text-[#16C7E8] font-bold">IND-ILA-110 High-Thrust</span>
            </div>
          </div>

          <Button
            onClick={() =>
              openModal("engineer", {
                categoryName: "Dual Arm 7th-Axis Rail Cell",
                initialMessage: "Requesting full CAD space claim and kinematic cycle simulation for dual-arm welding cell.",
              })
            }
            className="w-full h-8 text-xs font-bold uppercase tracking-wider bg-[#16C7E8] text-[#0B111E] rounded-none hover:bg-[#16C7E8]/90"
          >
            Export Kinematic Sizing Dossier
          </Button>
        </div>

        {/* Right 3D Kinematic Viewport matching Image 4 */}
        <div className="lg:col-span-8 p-4 relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#080D1A]">
          {/* Viewport Top Controls */}
          <div className="flex items-center justify-between z-10 text-[10px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Compass size={12} className="text-[#16C7E8]" /> Tool Orientation: Normal to Workpiece Seam
              </span>
              <span className="text-emerald-400 font-bold">Collision Free</span>
            </div>
            <span>World Frame: [0, 0, 0] mm</span>
          </div>

          {/* Interactive SVG Diagram of 7th Axis Rail + Dual Yellow Arms + Workpiece */}
          <div className="relative my-auto flex items-center justify-center py-4">
            <svg viewBox="0 0 700 360" className="w-full max-w-2xl h-auto select-none">
              {/* Perspective Grid Floor */}
              <g stroke="#1E293B" strokeWidth="0.75" opacity="0.4">
                <line x1="50" y1="290" x2="650" y2="290" />
                <line x1="80" y1="310" x2="620" y2="310" />
                <line x1="120" y1="330" x2="580" y2="330" />
              </g>

              {/* 7th-Axis Elevated Linear Rail Beam (Matching Image 4) */}
              <g transform="translate(100, 160)">
                {/* Horizontal Heavy Steel Box Beam (Grey/White with Mounting Teeth) */}
                <rect x="0" y="0" width="500" height="40" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" rx="2" />
                {/* Guide Rail Tracks */}
                <line x1="0" y1="8" x2="500" y2="8" stroke="#334155" strokeWidth="3" />
                <line x1="0" y1="32" x2="500" y2="32" stroke="#334155" strokeWidth="3" />
                {/* Supporting Vertical Columns */}
                <rect x="60" y="40" width="40" height="90" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
                <rect x="400" y="40" width="40" height="90" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />

                {/* Traveling Linear Carriage 1 (Left Robot Carrier) */}
                <g transform={`translate(${railPosM * 50}, -15)`}>
                  <rect x="-35" y="0" width="70" height="25" fill="#0F172A" stroke="#16C7E8" strokeWidth="2" rx="3" />
                  {/* Robot Arm 1 (Yellow) */}
                  <g transform="translate(0, 0)">
                    {/* Base */}
                    <rect x="-16" y="-20" width="32" height="20" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" rx="3" />
                    {/* Articulated Link 1 */}
                    <path
                      d={`M 0 -20 L ${robot1ArmAngle} -75 L ${robot1ArmAngle + 35} -110`}
                      fill="none"
                      stroke="#EAB308"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Tool Flange & Welding Arc */}
                    <circle cx={robot1ArmAngle + 35} cy="-110" r="5" fill="#16C7E8" />
                    <line
                      x1={robot1ArmAngle + 35}
                      y1="-110"
                      x2={robot1ArmAngle + 50}
                      y2="-90"
                      stroke="#F8FAFC"
                      strokeWidth="2.5"
                    />
                    <circle cx={robot1ArmAngle + 50} cy="-90" r="2.5" fill="#38BDF8" className="animate-ping" />
                  </g>
                </g>

                {/* Traveling Linear Carriage 2 (Right Robot Carrier) */}
                <g transform={`translate(${Math.min(440, railPosM * 50 + 160)}, -15)`}>
                  <rect x="-35" y="0" width="70" height="25" fill="#0F172A" stroke="#2388FF" strokeWidth="2" rx="3" />
                  {/* Robot Arm 2 (Yellow) */}
                  <g transform="translate(0, 0)">
                    <rect x="-16" y="-20" width="32" height="20" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" rx="3" />
                    <path
                      d={`M 0 -20 L ${robot2ArmAngle} -70 L ${robot2ArmAngle - 30} -105`}
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <circle cx={robot2ArmAngle - 30} cy="-105" r="5" fill="#2388FF" />
                    <line
                      x1={robot2ArmAngle - 30}
                      y1="-105"
                      x2={robot2ArmAngle - 45}
                      y2="-85"
                      stroke="#F8FAFC"
                      strokeWidth="2.5"
                    />
                    <circle cx={robot2ArmAngle - 45} cy="-85" r="2.5" fill="#F43F5E" className="animate-ping" />
                  </g>
                </g>
              </g>

              {/* Central Rotating Workpiece Fixture holding Vehicle Chassis (Matching Image 4) */}
              <g transform="translate(350, 260)">
                {/* Turntable Base */}
                <ellipse cx="0" cy="0" rx="60" ry="16" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                <rect x="-10" y="-35" width="20" height="35" fill="#334155" stroke="#475569" />
                {/* Rotating Fixture Table */}
                <g transform={`rotate(${fixtureAngle * 0.1})`}>
                  <rect x="-70" y="-45" width="140" height="10" fill="#94A3B8" stroke="#64748B" rx="2" />
                  {/* Clamped Vehicle Subframe Member */}
                  <rect x="-55" y="-55" width="110" height="10" fill="#101B2D" stroke="#38BDF8" strokeWidth="1.5" rx="1" />
                  <circle cx="-40" cy="-50" r="2" fill="#E2E8F0" />
                  <circle cx="0" cy="-50" r="2" fill="#E2E8F0" />
                  <circle cx="40" cy="-50" r="2" fill="#E2E8F0" />
                </g>
              </g>
            </svg>
          </div>

          {/* Bottom Coordinate Bar */}
          <div className="rounded-lg border border-white/10 bg-[#080D1A]/90 p-3 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-400">
            <div>
              <span>Interpolation Cycle: </span>
              <strong className="text-white">1,000 Hz</strong>
            </div>
            <div>
              <span>Toolpath Speed: </span>
              <strong className="text-emerald-400">120 mm/s continuous</strong>
            </div>
            <div>
              <span>Workpiece Rotational Axis: </span>
              <strong className="text-[#16C7E8]">A-Axis {fixtureAngle}°</strong>
            </div>
            <div>
              <span>Joint Limits Status: </span>
              <strong className="text-emerald-400">Within Range (&gt;15° margin)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
