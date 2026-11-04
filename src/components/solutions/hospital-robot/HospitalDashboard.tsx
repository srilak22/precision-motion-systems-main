import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Radio,
  Clock,
  MapPin,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  BatteryCharging,
  Thermometer,
  AlertCircle,
} from "lucide-react";

interface RobotStatus {
  id: string;
  name: string;
  currentLocation: string;
  destination: string;
  status: "In Transit" | "Elevator" | "Docked" | "Delivering";
  priority: "STAT" | "Routine";
  battery: number;
  payload: string;
  lockStatus: "Locked" | "Authorized Unlock";
  temp: string;
}

interface ClinicalEvent {
  id: string;
  time: string;
  robotId: string;
  action: string;
  department: string;
  priority: "STAT" | "Routine";
  status: "Delivered" | "In-Transit" | "Docked";
}

const INITIAL_ROBOTS: RobotStatus[] = [
  {
    id: "ROBOT-MED01",
    name: "INDUS MedCourier Alpha",
    currentLocation: "West Wing Corridor 3F",
    destination: "Cardiovascular ICU (Pod B)",
    status: "In Transit",
    priority: "STAT",
    battery: 88,
    payload: "Emergency Heparin IV + Epinephrine",
    lockStatus: "Locked",
    temp: "21.4°C (Ambient)",
  },
  {
    id: "ROBOT-MED02",
    name: "INDUS MedCourier Beta",
    currentLocation: "Elevator Bank Car #3",
    destination: "Central Pathology Lab (Floor 1)",
    status: "Elevator",
    priority: "Routine",
    battery: 74,
    payload: "Biopsy Specimen Vials (Chamber 2)",
    lockStatus: "Locked",
    temp: "4.2°C (Refrigerated)",
  },
  {
    id: "ROBOT-MED03",
    name: "INDUS MedCourier Gamma",
    currentLocation: "Pharmacy Charging Depot",
    destination: "Standby / Next Mission",
    status: "Docked",
    priority: "Routine",
    battery: 99,
    payload: "Compartments Empty / Sanitized",
    lockStatus: "Authorized Unlock",
    temp: "20.8°C (Ambient)",
  },
];

const INITIAL_CLINICAL_EVENTS: ClinicalEvent[] = [
  {
    id: "TX-4091",
    time: "16:54:12",
    robotId: "ROBOT-MED01",
    action: "Dispatched from Central Pharmacy",
    department: "Main Pharmacy",
    priority: "STAT",
    status: "In-Transit",
  },
  {
    id: "TX-4090",
    time: "16:48:30",
    robotId: "ROBOT-MED02",
    action: "Specimen Loaded & Sealed",
    department: "Oncology Ward 4B",
    priority: "Routine",
    status: "In-Transit",
  },
  {
    id: "TX-4089",
    time: "16:35:10",
    robotId: "ROBOT-MED01",
    action: "Nurse Verified Delivery (Badge #7402)",
    department: "Emergency Dept Trauma 1",
    priority: "STAT",
    status: "Delivered",
  },
  {
    id: "TX-4088",
    time: "16:21:44",
    robotId: "ROBOT-MED03",
    action: "UV-C Auto-Sanitation Cycle Completed",
    department: "Central Depot",
    priority: "Routine",
    status: "Docked",
  },
];

export function HospitalDashboard() {
  const [selectedRobotId, setSelectedRobotId] = useState<string>("ROBOT-MED01");
  const [simulatedTime, setSimulatedTime] = useState<string>("16:58:30 UTC");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSimulatedTime(
        `${now.getUTCHours().toString().padStart(2, "0")}:${now
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${now.getUTCSeconds().toString().padStart(2, "0")} UTC`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedRobot =
    INITIAL_ROBOTS.find((r) => r.id === selectedRobotId) || INITIAL_ROBOTS[0];

  return (
    <section className="relative bg-slate-950 text-white py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-800 overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 right-10 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4">
              <LayoutDashboard size={13} className="text-cyan-400" />
              <span>Real-Time Clinical Telematics</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Hospital Fleet Telematics &amp; <br />
              <span className="text-cyan-400">Live Mission Dispatch Center</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Experience the simulated hospital operations console used by pharmacy directors and
              ward managers to monitor autonomous deliveries, compartment locks, and STAT turnaround.
            </p>
          </div>

          {/* Demonstration Notice */}
          <div className="shrink-0 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 flex items-center gap-3">
            <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Interactive Demonstration
              </div>
              <div className="text-xs text-amber-200">
                Simulated clinical logistics telemetry stream
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Window Chrome */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/80 inline-block" />
              <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-slate-300 font-bold">
                INDUS CLINICAL DISPATCH // HOSPITAL TOWER A
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio size={13} className="animate-pulse" />
                <span>EHR BRIDGE CONNECTED (HL7 / FHIR)</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-slate-300 hidden sm:flex">
                <Clock size={13} />
                <span>{simulatedTime}</span>
              </span>
            </div>
          </div>

          {/* Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/50">
            <div className="p-4 sm:p-5 border-r border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Robots Active</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-white">3</span>
                <span className="text-xs font-mono text-emerald-400">/ 3 Operational</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-r border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Today's Missions</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">
                  142
                </span>
                <span className="text-xs font-mono text-emerald-400">100% Delivered</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-r border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Avg STAT Transit</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                  11.4 min
                </span>
                <span className="text-xs font-mono text-cyan-400">Target &lt;15m</span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Nurse Hours Saved</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                  18.6 hrs
                </span>
                <span className="text-xs font-mono text-slate-400">Today</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 lg:p-8">
            {/* Left Column: Hospital Map & Flight Tracker */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Map Panel */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Live Hospital Wing Map (Floor 3)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                    Indoor LiDAR SLAM Active
                  </span>
                </div>

                {/* Simulated Hospital Wing Map */}
                <div className="relative w-full h-64 sm:h-72 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {/* Grid Lines */}
                  <svg className="absolute inset-0 w-full h-full stroke-slate-800/60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="hospgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hospgrid)" />
                  </svg>

                  {/* Ward Labels */}
                  <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-500 uppercase">
                    Central Pharmacy Hub
                  </div>
                  <div className="absolute top-4 right-6 text-[10px] font-mono text-slate-500 uppercase">
                    Cardiovascular ICU
                  </div>
                  <div className="absolute bottom-4 left-6 text-[10px] font-mono text-slate-500 uppercase">
                    Elevator Core #1-4
                  </div>
                  <div className="absolute bottom-4 right-6 text-[10px] font-mono text-slate-500 uppercase">
                    Oncology Ward 4B
                  </div>

                  {/* Vector Path */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 250">
                    <path
                      d="M 70 50 L 250 50 L 250 130 L 430 130 L 430 60"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="opacity-40 animate-pulse"
                    />

                    {/* Robot 1 (Active STAT) */}
                    <circle cx="340" cy="130" r="8" fill="#22D3EE" className="animate-ping opacity-75" />
                    <circle cx="340" cy="130" r="5" fill="#22D3EE" />

                    {/* Waypoint Nodes */}
                    <circle cx="70" cy="50" r="4" fill="#10B981" />
                    <circle cx="250" cy="50" r="3" fill="#64748B" />
                    <circle cx="430" cy="60" r="4" fill="#EF4444" />
                  </svg>

                  {/* Floating Tag */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 bg-slate-950/90 border border-cyan-400 px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
                    <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-mono font-bold text-white">
                      ROBOT-MED01 (STAT - ICU Pod B)
                    </span>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-cyan-400" />
                      <span>Active Robot</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>Origin (Pharmacy)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-500" />
                      <span>Destination (ICU)</span>
                    </span>
                  </div>
                  <span className="text-slate-500">Transit: 1.0 m/s Governed</span>
                </div>
              </div>

              {/* Real-time Event Log */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Live Chain-of-Custody Event Stream
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Auto-refresh 5s</span>
                </div>

                <div className="space-y-2">
                  {INITIAL_CLINICAL_EVENTS.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-500">{evt.time}</span>
                        <span className="text-cyan-400 font-bold">{evt.robotId}</span>
                        <span className="text-slate-200">{evt.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 hidden sm:inline">{evt.department}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                            evt.priority === "STAT"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {evt.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Fleet Selector & Robot Telemetry */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Robot Selector */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Active Hospital Units
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    3 Units Monitored
                  </span>
                </div>

                <div className="space-y-2.5">
                  {INITIAL_ROBOTS.map((robot) => {
                    const isSelected = robot.id === selectedRobotId;

                    return (
                      <button
                        key={robot.id}
                        onClick={() => setSelectedRobotId(robot.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "border-cyan-400 bg-slate-900 ring-1 ring-cyan-400"
                            : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-xs font-bold text-cyan-400">
                              {robot.id}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {robot.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {robot.destination}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              robot.priority === "STAT"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {robot.status}
                          </span>
                          <div className="text-[10px] font-mono text-slate-500 mt-1">
                            {robot.battery}% Battery
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Unit Telemetry */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Focus: {selectedRobot.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Telemetry Verified</span>
                  </span>
                </div>

                {/* Compartment Status Card */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400">Current Payload</span>
                      <span className="text-white font-bold">{selectedRobot.payload}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Destination: {selectedRobot.destination}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Lock size={13} className="text-cyan-400" />
                        <span>Security Lock Status</span>
                      </span>
                      <span
                        className={`font-bold ${
                          selectedRobot.lockStatus === "Locked"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {selectedRobot.lockStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Thermometer size={13} className="text-cyan-400" />
                        <span>Internal Chamber Temp</span>
                      </span>
                      <span className="text-white font-bold">{selectedRobot.temp}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <BatteryCharging size={13} className="text-cyan-400" />
                        <span>Battery Endurance</span>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {selectedRobot.battery}% (~8.5 hrs)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
