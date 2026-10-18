import React from "react";

interface TechnicalSchematicProps {
  type: "kinematic" | "foc" | "fieldbus" | "mounting" | "reducer-matrix";
  title?: string;
}

export function TechnicalSchematicDiagram({ type, title }: TechnicalSchematicProps) {
  switch (type) {
    case "reducer-matrix":
      return (
        <div className="my-8 overflow-hidden rounded-lg border border-border bg-surface-dark/95 p-6 text-surface-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal">
              Kinematic Schematic &bull; Torsional Deflection & Shock Load Envelope
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">ISO 9283 / DIN 3960</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Diagram 1: Hysteresis / Lost Motion Curve */}
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Torsional Spring Rate & Hysteresis Curve
              </span>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Angular deflection θ vs applied torque T (Harmonic vs Cycloidal)
              </p>

              <svg
                viewBox="0 0 400 240"
                className="mt-4 w-full h-auto text-surface-foreground"
                aria-label="Torsional spring rate and hysteresis graph"
              >
                {/* Coordinate Grid */}
                <line x1="50" y1="120" x2="370" y2="120" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="210" y1="20" x2="210" y2="220" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Axis Labels */}
                <text x="365" y="115" fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">+ Torque (T)</text>
                <text x="55" y="115" fill="#94A3B8" fontSize="10" textAnchor="start" fontFamily="monospace">- Torque (T)</text>
                <text x="215" y="30" fill="#94A3B8" fontSize="10" textAnchor="start" fontFamily="monospace">+ Deflection (θ)</text>
                <text x="215" y="215" fill="#94A3B8" fontSize="10" textAnchor="start" fontFamily="monospace">- Deflection (θ)</text>

                {/* Cycloidal Curve (High slope, solid disc) */}
                <path
                  d="M 60 195 Q 160 145 205 122 L 215 118 Q 260 95 360 45"
                  fill="none"
                  stroke="#16C7E8"
                  strokeWidth="2.5"
                />

                {/* Harmonic Curve (Soft initial spring zone, true zero lost motion) */}
                <path
                  d="M 60 210 Q 170 140 208 120 L 212 120 Q 250 100 360 30"
                  fill="none"
                  stroke="#2388FF"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                />

                {/* Zero backlash window indicator */}
                <rect x="202" y="105" width="16" height="30" fill="#16C7E8" fillOpacity="0.15" stroke="#16C7E8" strokeWidth="0.8" />
                <text x="210" y="98" fill="#16C7E8" fontSize="9" textAnchor="middle" fontFamily="monospace">Zero Backlash Window</text>
              </svg>

              <div className="mt-3 flex items-center justify-center gap-6 text-[11px] font-mono">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-4 bg-[#16C7E8]" />
                  <span>Cycloidal (500% Shock Load)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-4 border-t-2 border-dashed border-[#2388FF]" />
                  <span>Harmonic (&lt; 1 arcmin Lost Motion)</span>
                </span>
              </div>
            </div>

            {/* Diagram 2: Joint Placement Architecture */}
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
                6-Axis Arm Optimal Joint Placement
              </span>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Balancing moment load carrying capacity and distal arm inertia
              </p>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between rounded border border-[#16C7E8]/40 bg-[#16C7E8]/10 p-2.5">
                  <div>
                    <span className="font-bold text-[#16C7E8]">Axes 1, 2, 3 (Base, Shoulder, Elbow)</span>
                    <p className="text-[10px] text-muted-foreground">Cycloidal Reducers &bull; 8,000 Nm moment capacity</p>
                  </div>
                  <span className="rounded bg-[#16C7E8]/20 px-2 py-0.5 text-[9px] font-bold text-[#16C7E8]">High Rigidity</span>
                </div>

                <div className="flex items-center justify-between rounded border border-[#2388FF]/40 bg-[#2388FF]/10 p-2.5">
                  <div>
                    <span className="font-bold text-[#2388FF]">Axes 4, 5, 6 (Forearm, Wrist, Tool Flange)</span>
                    <p className="text-[10px] text-muted-foreground">Harmonic Reducers &bull; Hollow shaft for cable feed</p>
                  </div>
                  <span className="rounded bg-[#2388FF]/20 px-2 py-0.5 text-[9px] font-bold text-[#2388FF]">Zero Backlash</span>
                </div>

                <div className="rounded border border-border/40 bg-surface-dark p-2.5 text-[11px] text-muted-foreground">
                  <strong className="text-white">Engineering Decision:</strong> Avoid placing harmonic strain-wave reducers on Axis 1. Heavy part inertia during emergency stops generates shear spikes exceeding flexspline endurance limits.
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "foc":
      return (
        <div className="my-8 overflow-hidden rounded-lg border border-border bg-surface-dark/95 p-6 text-surface-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal">
              Vector Control Architecture &bull; Clarke / Park Synchronous Transforms
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">IEC 61800-5-1 / 4 kHz Current Loop</span>
          </div>

          <div className="mt-6">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-auto text-surface-foreground"
              aria-label="FOC Block Diagram and Coordinate Transforms"
            >
              {/* Stage 1: Motor Phase Currents */}
              <rect x="20" y="80" width="70" height="60" rx="4" fill="#16243A" stroke="#334155" strokeWidth="1.5" />
              <text x="55" y="105" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Motor</text>
              <text x="55" y="122" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">Ia, Ib, Ic</text>

              {/* Arrow to Clarke */}
              <line x1="90" y1="110" x2="130" y2="110" stroke="#16C7E8" strokeWidth="2" markerEnd="url(#arrow)" />

              {/* Stage 2: Clarke Transform */}
              <rect x="130" y="80" width="90" height="60" rx="4" fill="#16243A" stroke="#16C7E8" strokeWidth="1.5" />
              <text x="175" y="105" fill="#16C7E8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Clarke (a,b,c)</text>
              <text x="175" y="122" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">to (Iα, Iβ)</text>

              {/* Arrow to Park */}
              <line x1="220" y1="110" x2="260" y2="110" stroke="#16C7E8" strokeWidth="2" />

              {/* Stage 3: Park Transform */}
              <rect x="260" y="80" width="90" height="60" rx="4" fill="#16243A" stroke="#2388FF" strokeWidth="1.5" />
              <text x="305" y="105" fill="#2388FF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Park (θe)</text>
              <text x="305" y="122" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">to (Id, Iq)</text>

              {/* Rotor angle feed into Park */}
              <line x1="305" y1="190" x2="305" y2="140" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="305" y="205" fill="#A855F7" fontSize="9" textAnchor="middle" fontFamily="monospace">θe (Encoder)</text>

              {/* Arrow to Decoupled PI Controllers */}
              <line x1="350" y1="110" x2="390" y2="110" stroke="#2388FF" strokeWidth="2" />

              {/* Stage 4: PI Regulators */}
              <rect x="390" y="70" width="85" height="80" rx="4" fill="#16243A" stroke="#334155" strokeWidth="1.5" />
              <text x="432" y="95" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PI Regulators</text>
              <text x="432" y="112" fill="#16C7E8" fontSize="8" textAnchor="middle" fontFamily="monospace">Iq → Vq (Torque)</text>
              <text x="432" y="128" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">Id → Vd (Flux = 0)</text>

              {/* Arrow to Inv Park & SVPWM */}
              <line x1="475" y1="110" x2="505" y2="110" stroke="#16C7E8" strokeWidth="2" />

              {/* Stage 5: Space Vector PWM */}
              <rect x="505" y="80" width="80" height="60" rx="4" fill="#16243A" stroke="#16C7E8" strokeWidth="1.5" />
              <text x="545" y="105" fill="#16C7E8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SVPWM</text>
              <text x="545" y="122" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">Gate Pulses</text>
            </svg>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3 font-mono text-xs">
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-2.5">
              <span className="text-[#16C7E8] font-bold">Clarke Frame (α, β):</span>
              <p className="mt-1 text-[11px] text-muted-foreground">Stationary 2-phase coordinates eliminating zero-sequence current.</p>
            </div>
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-2.5">
              <span className="text-[#2388FF] font-bold">Park Frame (d, q):</span>
              <p className="mt-1 text-[11px] text-muted-foreground">Rotating frame where Iq directly governs mechanical torque, Id governs flux.</p>
            </div>
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-2.5">
              <span className="text-purple-400 font-bold">Space Vector PWM:</span>
              <p className="mt-1 text-[11px] text-muted-foreground">15.5% higher DC bus voltage utilization without harmonic current heating.</p>
            </div>
          </div>
        </div>
      );

    case "fieldbus":
      return (
        <div className="my-8 overflow-hidden rounded-lg border border-border bg-surface-dark/95 p-6 text-surface-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal">
              Deterministic Fieldbus Topology &bull; EtherCAT vs PROFINET IRT
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">ETG.1000 / IEC 61158</span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded border border-[#16C7E8]/40 bg-surface-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16C7E8]">EtherCAT &bull; Processing On-The-Fly</span>
                <span className="rounded bg-[#16C7E8]/20 px-2 py-0.5 text-[9px] font-mono text-[#16C7E8]">Jitter &lt; 100 ns</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                One Ethernet master frame travels through slave ASICs in hardware bit-times. No individual packet addressing overhead.
              </p>

              <div className="mt-4 flex items-center justify-between font-mono text-xs border border-border/40 rounded p-2 bg-surface-dark">
                <span>Master (Standard NIC)</span>
                <span className="text-[#16C7E8] font-bold">→ Ring Frame →</span>
                <span>Node 1 → Node 2 → Loopback</span>
              </div>
              <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                <li>&bull; Distributed Clocks (DC) auto-calibrate physical wire propagation delays</li>
                <li>&bull; Single 1,500-byte frame updates up to 64 axes at 250 µs</li>
                <li>&bull; Software master requires zero proprietary PCIe interface card</li>
              </ul>
            </div>

            <div className="rounded border border-[#2388FF]/40 bg-surface-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2388FF]">PROFINET IRT &bull; Reserved Time Slots</span>
                <span className="rounded bg-[#2388FF]/20 px-2 py-0.5 text-[9px] font-mono text-[#2388FF]">Jitter &lt; 1 µs</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Hardware-scheduled bandwidth slicing: dedicated isochronous slot for motion, open slot for TCP/IP diagnostics.
              </p>

              <div className="mt-4 flex items-center justify-between font-mono text-xs border border-border/40 rounded p-2 bg-surface-dark">
                <span>PLC (Siemens S7)</span>
                <span className="text-[#2388FF] font-bold">→ IRT Time Slot →</span>
                <span>ERTEC ASIC Switches</span>
              </div>
              <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                <li>&bull; Native integration in TIA Portal plant-wide automation</li>
                <li>&bull; Profisafe functional safety over same physical Ethernet cable</li>
                <li>&bull; Requires dedicated ASIC switch silicon in every drive node</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "mounting":
      return (
        <div className="my-8 overflow-hidden rounded-lg border border-border bg-surface-dark/95 p-6 text-surface-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal">
              Mechanical Tolerances &bull; Housing Pilot Fits & Star Bolt Torquing
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">ISO 286-1 / DIN 74-1</span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3 font-mono text-xs">
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5">
              <span className="text-[#16C7E8] font-bold">Pilot Fit Tolerance:</span>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Bore machined to <strong>ISO H7</strong> (+0.025 / -0.000 mm). Machine spigot to <strong>ISO h6</strong>. Eliminates radial shear eccentricity on needle bearings.
              </p>
            </div>
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5">
              <span className="text-[#2388FF] font-bold">Runout & Perpendicularity:</span>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Total Indicator Reading (TIR) &lt; <strong>0.015 mm</strong>. Face perpendicularity &lt; <strong>0.012 mm per 100 mm</strong> radius to prevent angular contact binding.
              </p>
            </div>
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5">
              <span className="text-purple-400 font-bold">Progressive Star Torque:</span>
              <p className="mt-2 text-[11px] text-muted-foreground">
                3-stage tightening (35% → 70% → 100% target torque) using Grade 12.9 fasteners in crosswise star order to prevent pin ring distortion.
              </p>
            </div>
          </div>
        </div>
      );

    case "kinematic":
    default:
      return (
        <div className="my-8 overflow-hidden rounded-lg border border-border bg-surface-dark/95 p-6 text-surface-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-signal">
              Kinematic Singular Configurations &bull; 6-Axis Industrial Manipulator
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">ISO 9787 / det(J) = 0</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 font-mono text-xs">
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5">
              <span className="text-[#16C7E8] font-bold">1. Wrist Singularity (θ5 = 0°)</span>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Axes 4 and 6 align collinearly. Controller cannot resolve planar rotation without infinite angular joint velocity. Solution: Apply Damped Least Squares (DLS).
              </p>
            </div>
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5">
              <span className="text-[#2388FF] font-bold">2. Shoulder Singularity</span>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Wrist center aligns directly with vertical centerline of Axis 1. Sideways translation in Cartesian space demands 180° instant base spin.
              </p>
            </div>
            <div className="rounded border border-border/40 bg-surface-elevated/40 p-3.5">
              <span className="text-purple-400 font-bold">3. Elbow Singularity</span>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Arm reaches maximum radial extension or folds completely flat against upper link. The arm loses 1 translational degree of freedom.
              </p>
            </div>
          </div>
        </div>
      );
  }
}
