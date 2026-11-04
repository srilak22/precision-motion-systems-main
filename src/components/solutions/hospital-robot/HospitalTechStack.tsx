import React from "react";
import {
  Cpu,
  BrainCircuit,
  Lock,
  Network,
  AlertCircle,
  Layers,
} from "lucide-react";

interface TechGroup {
  id: string;
  category: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  items: {
    name: string;
    role: string;
    status: "Proposed" | "Compatible" | "Standard";
  }[];
}

const TECH_GROUPS: TechGroup[] = [
  {
    id: "hardware",
    category: "Hardware & Clinical Mobility",
    badge: "Medical Grade",
    icon: Cpu,
    description:
      "Physical drive base, whisper-quiet motors, cleanroom casters, and multi-tier electronic smart lockers.",
    items: [
      {
        name: "Dual Safety Planar LiDARs",
        role: "360° obstacle clearance certified to ISO 13849-1 PLd",
        status: "Standard",
      },
      {
        name: "Brushless DC Direct Drives",
        role: "Ultra-quiet (<48 dB) high-torque motors with regenerative braking",
        status: "Standard",
      },
      {
        name: "Multi-Tier Smart Lockers",
        role: "Independently lockable compartments with electronic solenoid latches",
        status: "Proposed",
      },
      {
        name: "Active Thermal Bay (Optional)",
        role: "Peltier-cooled 2°C–8°C storage for biologicals and blood products",
        status: "Compatible",
      },
      {
        name: "Wireless Inductive Docking",
        role: "Automatic opportunity charging without exposed electrical contacts",
        status: "Proposed",
      },
      {
        name: "Antimicrobial Sealed Shell",
        role: "IP54 fluid-resistant body withstands daily hospital disinfectant wipes",
        status: "Standard",
      },
    ],
  },
  {
    id: "autonomy",
    category: "Perception & Indoor SLAM",
    badge: "Autonomy Core",
    icon: BrainCircuit,
    description:
      "Deterministic robotics middleware, indoor laser odometry, and dynamic hallway obstacle avoidance.",
    items: [
      {
        name: "ROS 2 Humble / Iron",
        role: "Deterministic real-time publish-subscribe robotics middleware",
        status: "Standard",
      },
      {
        name: "Nav2 Navigation Stack",
        role: "Corridor path planning, multi-costmap generation, and dynamic replanning",
        status: "Proposed",
      },
      {
        name: "Cartographer / AMCL SLAM",
        role: "Centimeter-level indoor localization using natural structural features",
        status: "Compatible",
      },
      {
        name: "Gentle Corridor Speed Governor",
        role: "Limits velocity to 1.2 m/s; soft deceleration around pedestrians and beds",
        status: "Standard",
      },
    ],
  },
  {
    id: "security",
    category: "Security & Chain of Custody",
    badge: "HIPAA Aligned",
    icon: Lock,
    description:
      "Identity verification, cryptographic audit trails, and tamper-resistant access control.",
    items: [
      {
        name: "RFID / NFC Badge Reader",
        role: "Hospital staff badge authentication (Mifare, HID iClass)",
        status: "Standard",
      },
      {
        name: "Clinical Touchscreen & PIN Keypad",
        role: "6-digit nurse PIN entry and interactive delivery sign-off",
        status: "Standard",
      },
      {
        name: "Hardware Security Module (HSM)",
        role: "Cryptographic storage of chain-of-custody signatures and encryption keys",
        status: "Proposed",
      },
      {
        name: "Tamper Detection Sensors",
        role: "Real-time door contact switches and forced-entry alarm triggers",
        status: "Standard",
      },
    ],
  },
  {
    id: "healthcare-cloud",
    category: "Healthcare Informatics & IoT",
    badge: "HL7 / FHIR",
    icon: Network,
    description:
      "Multi-vendor elevator integrations, hospital EHR bridges, and clinical notification pagers.",
    items: [
      {
        name: "BACnet IP / Modbus Gateway",
        role: "Autonomous wireless elevator summoning and airlock door control",
        status: "Proposed",
      },
      {
        name: "HL7 v2.x / FHIR R4 Interface",
        role: "Bi-directional transport order sync with Epic, Cerner, and Meditech",
        status: "Compatible",
      },
      {
        name: "Clinical Notification Webhook",
        role: "Automated arrival pings to nurse Vocera badges, pagers, and mobile apps",
        status: "Proposed",
      },
      {
        name: "Hospital Fleet Management Portal",
        role: "Role-based biomedical engineering dashboard and compliance reporting",
        status: "Standard",
      },
    ],
  },
];

export function HospitalTechStack() {
  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Layers size={13} className="text-[#155EEF]" />
            <span>Underlying Engineering Matrix</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Proposed &amp; Compatible <br />
            <span className="text-[#155EEF]">Clinical Technology Architecture</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            The INDUS Hospital Delivery platform integrates standard healthcare protocols, open
            robotics frameworks, and secure access hardware to guarantee seamless deployment
            into existing hospital infrastructure.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <AlertCircle size={14} className="text-[#155EEF] shrink-0" />
            <span>
              <strong>Note:</strong> Listed architectures represent proposed and compatible
              engineering baselines. Final hardware modules, elevator interfaces, and EHR
              connectors are customized to each hospital’s physical and IT infrastructure.
            </span>
          </div>
        </div>

        {/* 4 Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {TECH_GROUPS.map((group) => {
            const Icon = group.icon;

            return (
              <div
                key={group.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-lg bg-[#155EEF]/10 border border-[#155EEF]/20 flex items-center justify-center text-[#155EEF]">
                        <Icon size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF]">
                          {group.badge}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">
                          {group.category}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-6">
                    {group.description}
                  </p>

                  {/* Items List */}
                  <div className="space-y-3">
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {item.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider shrink-0 ${
                              item.status === "Standard"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.status === "Proposed"
                                ? "bg-blue-50 text-[#155EEF] border border-blue-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {item.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
