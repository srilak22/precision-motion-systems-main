import React from "react";
import { MessageSquare } from "lucide-react";
import { useModals } from "@/components/modals/ModalContext";

export function FloatingEngineerCta() {
  const { openModal } = useModals();

  return (
    <button
      type="button"
      onClick={() => openModal("quote")}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#155EEF] hover:bg-[#1047BF] text-white px-5 py-3 text-xs sm:text-sm font-semibold shadow-xl border border-white/20 transition-all hover:scale-[1.03] cursor-pointer"
    >
      <MessageSquare size={16} />
      <span>Talk to a Robotics Engineer</span>
    </button>
  );
}
