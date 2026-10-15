import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConsultationWizard } from "@/components/consultation/ConsultationWizard";
import { ConsultationLeftColumn } from "@/components/consultation/ConsultationLeftColumn";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/book-consultation")({
  head: () =>
    buildSeoMeta({
      title: "Book a Robotics Consultation | INDUS Industrial Robotics",
      description:
        "Schedule a technical consultation with INDUS application architects. Quick booking or detailed project sizing with live Google Calendar synchronization across automotive, electronics, food, pharma, and logistics industries.",
      path: "/book-consultation",
    }),
  component: BookRoboticsConsultationPage,
});

function BookRoboticsConsultationPage() {
  useEffect(() => {
    trackDigitalPresence("booking_view", "Consultation Booking Page", "Entered robotics consultation booking experience");
    trackClarityEvent("booking_view");
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 technical-grid selection:bg-[#0052FF] selection:text-white">
      {/* Top Subtle Engineering Ambient Highlight */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-100/40 via-blue-50/20 to-transparent pointer-events-none" />

      {/* Main Two-Column Layout Container */}
      <main className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: Headline, Benefits, Supported Industries, Trust Indicators */}
          <div className="lg:col-span-7">
            <ConsultationLeftColumn />
          </div>

          {/* RIGHT COLUMN: Prominent Appointment Form Card with Segmented Switch */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <ConsultationWizard />
          </div>
        </div>
      </main>
    </div>
  );
}
