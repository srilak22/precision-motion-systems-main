import React from "react";
import { images } from "@/lib/images";

export function RailwayGallery() {
  const galleryItems = [
    {
      title: "Inspection Vehicle Chassis",
      caption: "Flanged steel wheel assemblies and dual-rail stabilized guidance mechanism.",
      image: images.railwayRobot,
    },
    {
      title: "Acoustic EMAT Sensors",
      caption: "Non-contact ultrasonic transducers measuring rail internal metallurgy.",
      image: images.sensorsFeedback,
    },
    {
      title: "4K Line-Scan Sensor Assembly",
      caption: "Synchronized dual-axis optical profilers with active LED flood illumination.",
      image: images.vision3dCamera,
    },
    {
      title: "Mainline Field Trial",
      caption: "Night-shift autonomous track geometry and gauge verification testing.",
      image: images.heroProductionLine,
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>FIELD VISUALS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            System Engineering &amp; <span className="text-[#155EEF]">Testing Gallery</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Precision engineering, ruggedized enclosures, and live field trial validation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-[#155EEF] hover:shadow-md transition-all group"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#155EEF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
