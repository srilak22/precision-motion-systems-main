import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ApplicationFinderWizard } from "@/components/forms/ApplicationFinderWizard";
import { useModals } from "./ModalContext";

export function ApplicationFinderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { modalPayload } = useModals();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-white border border-[#E5EAF1] shadow-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Find the Right Solution - Application Finder</DialogTitle>
          <DialogDescription>
            Guided multi-step engineering discovery and Request for Quotation (RFQ) workflow.
          </DialogDescription>
        </DialogHeader>

        <ApplicationFinderWizard
          initialCategory={modalPayload.categoryName || modalPayload.productSlug || "rotary-actuator"}
          initialProduct={modalPayload.productName || ""}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
