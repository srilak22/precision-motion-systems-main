import React from "react";
import {
  Scan,
  Filter,
  Sparkles,
  Gauge,
  ShieldAlert,
  Compass,
  Route,
  LineChart,
  CheckCircle2,
} from "lucide-react";

interface FeatureCard {
  id: string;
  icon: React.ElementType;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  specs: string;
}

const FEATURES: FeatureCard[] = [
  {
    id: "vision-detection",
    icon: Scan,
    title: "Computer Vision Waste Detection",
    category: "Perception & AI",
    description:
      "High-speed edge computer vision identifies, bounds, and tracks debris on ground surfaces under varying daylight, rain, and shadow conditions.",
    highlights: [
      "Sub-20ms multi-target object detection",
      "Robust to ground glare, wet surfaces, and shadows",
      "Dynamic background filtering for pedestrian zones",
    ],
    specs: "30 FPS Real-time Detection",
  },
  {
    id: "waste-classification",
    icon: Filter,
    title: "Automatic Waste Classification",
    category: "Material Taxonomy",
    description:
      "Deep neural classifiers segment items into dry recyclables (PET, HDPE, cans, paper), organic waste, and non-recyclable inert residues.",
    highlights: [
      "24 discrete material taxonomies supported",
      "94.6% sorting purity in controlled trials",
      "Instant hazardous / e-waste lockout protocol",
    ],
    specs: "24 Waste Classes Identified",
  },
  {
    id: "robotic-collection",
    icon: Sparkles,
    title: "Robotic Collection Mechanism",
    category: "Kinematics & Manipulation",
    description:
      "Compliant robotic arm equipped with adaptive soft-silicone fingers and high-flow venturi suction picks items from 5 grams up to 3.5 kilograms.",
    highlights: [
      "Force-feedback sensing prevents surface scratching",
      "Automated jam-clearing reverse cycle",
      "Interchangeable end-effector geometry",
    ],
    specs: "Up to 3.5 kg Payload / Pick",
  },
  {
    id: "fill-level-monitoring",
    icon: Gauge,
    title: "Fill-Level Monitoring",
    category: "Sensory Telematics",
    description:
      "Non-contact ultrasonic transducers and multi-point time-of-flight arrays continuously measure volumetric chamber fill rates.",
    highlights: [
      "Real-time volume calculation within ±2%",
      "Predictive overflow prevention triggers",
      "Autonomous dispatch to depot at 90% threshold",
    ],
    specs: "±2% Volumetric Accuracy",
  },
  {
    id: "obstacle-detection",
    icon: ShieldAlert,
    title: "360° Obstacle Detection & Safety",
    category: "Active Safety",
    description:
      "Multi-layered safety architecture with safety-rated 3D LiDAR, ultrasonic bumpers, and emergency stop interlocks guarantee zero-collision operation around pedestrians.",
    highlights: [
      "ISO 3691-4 industrial AGV safety compliance",
      "Dynamic deceleration zones based on human approach speed",
      "Physical tactile bumper pressure cutoffs",
    ],
    specs: "ISO 3691-4 Safety Compliant",
  },
  {
    id: "autonomous-navigation",
    icon: Compass,
    title: "Autonomous Navigation & SLAM",
    category: "Mobility & Localization",
    description:
      "Simultaneous Localization and Mapping (SLAM) with RTK-GPS outdoor guidance and LiDAR-inertial odometry indoor navigation.",
    highlights: [
      "Seamless indoor-to-outdoor perimeter handoffs",
      "Centimeter-level path-following precision",
      "Dynamic rerouting around temporary construction barriers",
    ],
    specs: "±2.5 cm Localization Accuracy",
  },
  {
    id: "route-optimization",
    icon: Route,
    title: "Intelligent Route Optimization",
    category: "Fleet Logistics",
    description:
      "Algorithmic dispatch systems optimize collection paths based on historic waste accumulation heatmaps, battery levels, and facility operating hours.",
    highlights: [
      "35% reduction in robot travel distance vs fixed loops",
      "Dynamic priority scheduling during peak cafeteria/event hours",
      "Automated docking and inductive opportunity charging",
    ],
    specs: "35% Travel Distance Reduction",
  },
  {
    id: "waste-analytics",
    icon: LineChart,
    title: "Enterprise Waste Analytics",
    category: "Cloud Intelligence",
    description:
      "Cloud platform visualizes spatial generation rates, contamination percentages, ESG compliance milestones, and operational cost savings.",
    highlights: [
      "Exportable CSV/PDF audit trails for sustainability boards",
      "Carbon abatement equivalent calculations",
      "Automated preventive maintenance health diagnostics",
    ],
    specs: "Real-time Telemetry & ESG Reports",
  },
];

export function FeatureGrid() {
  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-24 px-4 lg:px-8 border-b border-slate-200">
      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-4">
            <Sparkles size={13} className="text-[#155EEF]" />
            <span>Engineered Capabilities</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            Key Features Built for <br />
            <span className="text-[#155EEF]">Continuous Operational Reliability</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Every subsystem is engineered to industrial motion and functional safety standards,
            delivering robust performance across open campuses, transit hubs, and commercial
            facilities.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-[#155EEF] hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Top category & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#155EEF] mb-1.5">
                    {feature.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#155EEF] transition-colors leading-snug">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-1.5 mb-5">
                    {feature.highlights.map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-tight"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-[#155EEF] shrink-0 mt-0.5"
                        />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Spec Badge */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="inline-block font-mono text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 w-full text-center">
                    {feature.specs}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
