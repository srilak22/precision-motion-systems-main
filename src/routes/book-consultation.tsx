import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConsultationWizard } from "@/components/consultation/ConsultationWizard";
import { ConsultationLeftColumn } from "@/components/consultation/ConsultationLeftColumn";
import { ConsultationEntryModal } from "@/components/consultation/ConsultationEntryModal";
import type { BookingMode } from "@/types/consultation";
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

const MODAL_SESSION_KEY = "indus_consultation_modal_seen";

function BookRoboticsConsultationPage() {
  const [mode, setMode] = useState<BookingMode>("quick");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    trackDigitalPresence("booking_view", "Consultation Booking Page", "Entered robotics consultation booking experience");
    trackClarityEvent("booking_view");

    // Sensible once-per-session popup check
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem(MODAL_SESSION_KEY);
      if (!hasSeen) {
        timer = setTimeout(() => {
          setIsModalOpen(true);
          trackDigitalPresence("consultation_modal_opened", "Consultation Entry Modal", "Auto-prompted user for booking track");
        }, 700);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleCloseModal = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(MODAL_SESSION_KEY, "true");
    }
    setIsModalOpen(false);
  };

  const handleSelectMode = (selectedMode: BookingMode) => {
    setMode(selectedMode);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(MODAL_SESSION_KEY, "true");
    }
    setIsModalOpen(false);

    trackDigitalPresence("consultation_modal_mode_chosen", "Consultation Track Selected", `User chose ${selectedMode} from modal`);
    trackClarityEvent(`consultation_modal_${selectedMode}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    trackDigitalPresence("consultation_modal_manual_opened", "Consultation Modal Reopened", "User clicked compare tracks");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Consultation Entry Modal */}
      <ConsultationEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectMode={handleSelectMode}
      />

      {/* Main Two-Column Layout Container */}
      <main className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: Headline, Benefits, Supported Industries, Trust Indicators */}
          <div className="lg:col-span-7">
            <ConsultationLeftColumn />
          </div>

          {/* RIGHT COLUMN: Prominent Appointment Form Card with Segmented Switch */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <ConsultationWizard
              currentMode={mode}
              onModeChange={setMode}
              onOpenModeModal={handleOpenModal}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

