import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, ArrowRight, MessageSquare, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchItems } from "@/data/robotics";
import { companyConfig } from "@/data/config";
import { useModals } from "./ModalContext";

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { openModal } = useModals();
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return searchItems.slice(0, 8); // show popular default suggestions
    }
    const q = query.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q),
    );
  }, [query]);

  const handleSelect = (href: string) => {
    onClose();
    navigate({ to: href as string });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate({ to: "/search", search: { q: query.trim() } });
  };

  const handleWhatsApp = () => {
    onClose();
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl rounded-md border border-border bg-card p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="border-b border-border bg-[#0b1329] p-6 text-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-2xl uppercase tracking-wider text-white sm:text-3xl">
                Search Engineering Platform
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs text-slate-300">
                Search across products, solutions, applications, technologies, resources, and
                technical FAQs.
              </DialogDescription>
            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative mt-4">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search across robotics platform"
              placeholder="Search e.g. 'Harmonic Reducer', 'EtherCAT', 'Automotive', 'Traction'..."
              className="h-12 rounded-md border-slate-700 bg-slate-900/90 pl-11 pr-24 text-sm text-white placeholder:text-slate-400 focus-visible:ring-primary"
            />
            {query.trim() && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1.5 bottom-1.5 h-auto rounded-md bg-signal text-signal-foreground px-3 text-xs font-bold uppercase flex items-center gap-1"
              >
                <span>Search</span>
                <CornerDownLeft size={12} />
              </Button>
            )}
          </form>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
          {query.trim() && (
            <div className="mb-3 border-b border-border/60 pb-2">
              <button
                onClick={handleSearchSubmit}
                className="flex items-center gap-2 text-xs font-semibold text-signal hover:underline cursor-pointer"
              >
                <Search size={13} />
                <span>View all search results for &quot;{query}&quot; on full results page →</span>
              </button>
            </div>
          )}

          {filteredItems.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredItems.map((item, idx) => (
                <button
                  key={`${item.href}-${idx}`}
                  onClick={() => handleSelect(item.href)}
                  className="group flex w-full items-center justify-between py-3.5 text-left transition-colors hover:bg-muted/50 rounded-sm px-2 cursor-pointer"
                >
                  <div className="pr-4">
                    <span className="font-display text-base font-bold uppercase tracking-wide text-foreground group-hover:text-signal">
                      {item.title}
                    </span>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="border border-border bg-muted/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground rounded">
                      {item.type}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-signal opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="font-display text-xl uppercase tracking-wide text-foreground">
                No exact match found
              </p>
              <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
                Can&apos;t find what you&apos;re looking for? Our application engineers can identify the right
                components or solution for your specific requirements.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  className="rounded-md bg-signal text-signal-foreground hover:bg-signal/90 font-bold uppercase text-xs h-10 px-5"
                  onClick={() => {
                    onClose();
                    openModal("engineer");
                  }}
                >
                  Talk to an Engineer
                </Button>
                <Button
                  variant="outline"
                  className="rounded-md border-border font-bold uppercase text-xs h-10 px-5"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare size={14} className="mr-1.5 text-signal" />
                  WhatsApp Us
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-3 text-[11px] text-muted-foreground">
          <span>Press ESC to close or Enter to search</span>
          <Link
            to="/search"
            onClick={onClose}
            className="font-bold uppercase tracking-wider text-signal hover:underline"
          >
            Open Full Search Page →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
