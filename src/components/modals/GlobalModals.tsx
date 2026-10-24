import React, { useEffect } from "react";
import { useModals } from "./ModalContext";
import { SearchModal } from "./SearchModal";
import { QuickEnquiryModal } from "./QuickEnquiryModal";
import { QuoteModal } from "./QuoteModal";
import { EngineerModal } from "./EngineerModal";
import { ApplicationFinderModal } from "./ApplicationFinderModal";

export function GlobalModals() {
  const { activeModal, closeModal, openModal } = useModals();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openModal("search");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);

  return (
    <>
      <SearchModal isOpen={activeModal === "search"} onClose={closeModal} />
      <QuickEnquiryModal isOpen={activeModal === "quick"} onClose={closeModal} />
      <QuoteModal isOpen={activeModal === "quote"} onClose={closeModal} />
      <EngineerModal isOpen={activeModal === "engineer"} onClose={closeModal} />
      <ApplicationFinderModal isOpen={activeModal === "finder"} onClose={closeModal} />
    </>
  );
}
