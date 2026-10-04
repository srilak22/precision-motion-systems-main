import React, { useState, useEffect } from "react";
import { IntelligenceEvent } from "@/lib/intelligence/types";
import { getLocalIntelligenceEvents } from "@/lib/intelligence/tracker";
import { Activity, ShieldCheck, Clock, Globe, ArrowRight, RefreshCw, FileSpreadsheet, ExternalLink } from "lucide-react";
import { companyConfig } from "@/data/config";

export function LiveTelemetryStream() {
  const [events, setEvents] = useState<IntelligenceEvent[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const refreshEvents = () => {
    const list = getLocalIntelligenceEvents();
    setEvents(list.slice(0, 15));
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    refreshEvents();

    const handleUpdate = () => {
      refreshEvents();
    };

    window.addEventListener("indus_intelligence_update", handleUpdate);
    const interval = setInterval(refreshEvents, 4000);

    return () => {
      window.removeEventListener("indus_intelligence_update", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="border border-border/30 bg-surface-dark p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/20 pb-4">
        <div className="flex items-center gap-2">
          <span className="dot-online" />
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-surface-foreground">
            LIVE TELEMETRY STREAM (REAL DATA LOG)
          </h4>
          <span className="font-mono text-[10px] text-muted-foreground">
            {events.length} EVENTS CAPTURED
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={companyConfig.googleSheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors"
          >
            <FileSpreadsheet size={12} />
            <span>Open Google Sheet</span>
            <ExternalLink size={10} className="opacity-70" />
          </a>
          <button
            onClick={refreshEvents}
            className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-signal transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={11} /> Refresh Telemetry
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground space-y-2">
          <Activity size={24} className="mx-auto text-signal opacity-50" />
          <p className="font-mono text-xs">No telemetry recorded yet in this session.</p>
          <p className="text-[11px]">
            Navigate between products, trigger a quote request, or download a catalogue to see real events logged here live.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border/20 text-[10px] uppercase text-muted-foreground">
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Event</th>
                <th className="py-2 pr-3">Page / Target</th>
                <th className="py-2 pr-3">Source</th>
                <th className="py-2 pr-3">Geo / Timezone</th>
                <th className="py-2 pr-3">Device / Network</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-2.5 pr-3 text-[11px] text-muted-foreground whitespace-nowrap">
                    {evt.timestamp ? evt.timestamp.split("T")[1]?.slice(0, 8) : "—"}
                  </td>
                  <td className="py-2.5 pr-3 whitespace-nowrap">
                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold ${
                      evt.event.includes("cta") || evt.event.includes("lead") || evt.event.includes("form")
                        ? "bg-signal/20 text-signal"
                        : "bg-surface-elevated text-surface-foreground/80"
                    }`}>
                      {evt.event}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-surface-foreground/90 max-w-[200px] truncate">
                    {evt.page || "/"}
                    {evt.element ? ` · ${evt.element}` : ""}
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                    {evt.trafficSource || "Direct"}
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                    {evt.country ? `${evt.country} · ` : ""}
                    {evt.timezone || "Local TZ"}
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                    {evt.device} · {evt.networkType || "Broadband"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
