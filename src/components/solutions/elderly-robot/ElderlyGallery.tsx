import React from "react";
import { images } from "@/lib/images";

export function ElderlyGallery() {
  const galleryItems = [
    {
      title: "CareCompanion Prototype Chassis",
      caption: "Soft curved industrial enclosure with anti-pinch chassis and friendly display interface.",
      image: images.elderlyRobot,
    },
    {
      title: "Rotary Pill Carousel Assembly",
      caption: "Precision motorized rotary dispenser ensuring exact pill portioning and tamper protection.",
      image: images.rotaryActuator,
    },
    {
      title: "Internal Electronics & Sensors",
      caption: "Medical-grade sensor integration, fail-safe battery management, and cellular antenna array.",
      image: images.components,
    },
    {
      title: "Assisted Living Facility Testing",
      caption: "Residential facility corridor navigation and voice recognition testing with senior volunteers.",
      image: images.arm,
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#155EEF] mb-3">
            <span>SYSTEM VISUALS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
            Gallery &amp; <span className="text-[#155EEF]">Prototype Testing</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            Designing assistive technology that seniors feel comfortable welcoming into their homes.
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
