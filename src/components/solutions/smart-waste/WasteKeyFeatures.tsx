import React from "react";
import {
  Scan,
  ShieldAlert,
  Recycle,
  Radio,
  BatteryCharging,
  BarChart3,
} from "lucide-react";

export function WasteKeyFeatures() {
  const features = [
    {
      id: "object-detection",
      icon: Scan,
      title: "Object Detection",
      badge: "Edge AI Vision",
      description:
        "High-accuracy camera model recognizes plastic bottles, cans, paper, cartons, and wrappers under varied outdoor sunlight and shadows.",
    },
    {
      id: "obstacle-avoidance",
      icon: ShieldAlert,
      title: "Obstacle Avoidance",
      badge: "Dynamic Safety",
      description:
        "Combines ultrasonic sensors and planar LiDAR to detect moving pedestrians, parked vehicles, and curbs within 5 meters with sub-second braking.",
    },
    {
      id: "waste-segregation",
      icon: Recycle,
      title: "Waste Segregation",
      badge: "Automated Sorting",
      description:
        "Automated sorting mechanism deposits collected trash into dedicated onboard compartments to simplify downstream municipal recycling.",
    },
    {
      id: "real-time-monitoring",
      icon: Radio,
      title: "Real-Time Monitoring",
      badge: "Cloud Telemetry",
      description:
        "4G/Wi-Fi telemetry streams GPS coordinates, patrol routes, operational logs, and live bin volume to facility managers.",
    },
    {
      id: "battery-efficient",
      icon: BatteryCharging,
      title: "Battery Efficient",
      badge: "Extended Runtime",
      description:
        "Low-power edge compute and regenerative braking deliver 6 to 8 hours of continuous operation on a single charging cycle.",
    },
    {
      id: "smart-analytics",
      icon: BarChart3,
      title: "Smart Analytics",
      badge: "Predictive Intelligence",
      description:
        "Generates heat maps of high-litter zones and daily collection volume trends to help facilities optimize cleaning schedules.",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Key Features &amp; <span className="text-[#155EEF]">System Capabilities</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Designed for continuous outdoor and indoor autonomous sanitary maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:-translate-y-1.5 hover:border-[#155EEF] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="size-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF] mb-6 group-hover:bg-[#155EEF] group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
