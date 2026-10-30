import React from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  parameter: string;
  value: string;
  unit?: string;
  notes?: string;
}

export interface SpecTableProps {
  title?: string;
  specs: SpecRow[];
  variant?: "default" | "compact";
  className?: string;
}

export function SpecTable({
  title,
  specs,
  variant = "default",
  className,
}: SpecTableProps) {
  const isCompact = variant === "compact";

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3
          className={cn(
            "mb-4 font-display font-bold uppercase tracking-tight text-[#101B2D]",
            isCompact ? "text-sm" : "text-base",
          )}
        >
          {title}
        </h3>
      )}

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#E2E8F0]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#101B2D] text-white">
              <th
                className={cn(
                  "text-left font-bold uppercase tracking-wider text-xs",
                  isCompact ? "px-4 py-2.5" : "px-5 py-3.5",
                )}
              >
                Parameter
              </th>
              <th
                className={cn(
                  "text-left font-bold uppercase tracking-wider text-xs",
                  isCompact ? "px-4 py-2.5" : "px-5 py-3.5",
                )}
              >
                Value
              </th>
              <th
                className={cn(
                  "text-left font-bold uppercase tracking-wider text-xs",
                  isCompact ? "px-4 py-2.5" : "px-5 py-3.5",
                )}
              >
                Unit
              </th>
              {specs.some((s) => s.notes) && (
                <th
                  className={cn(
                    "text-left font-bold uppercase tracking-wider text-xs",
                    isCompact ? "px-4 py-2.5" : "px-5 py-3.5",
                  )}
                >
                  Notes
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-[#E2E8F0] last:border-0 transition-colors",
                  i % 2 === 0 ? "bg-white" : "bg-[#F4F7FB]",
                  "hover:bg-blue-50/40",
                )}
              >
                <td
                  className={cn(
                    "font-semibold text-[#101B2D]",
                    isCompact ? "px-4 py-2" : "px-5 py-3",
                  )}
                >
                  {spec.parameter}
                </td>
                <td
                  className={cn(
                    "font-mono font-bold text-[#101B2D]",
                    isCompact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm",
                  )}
                >
                  {spec.value}
                </td>
                <td
                  className={cn(
                    "text-[#64748B]",
                    isCompact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm",
                  )}
                >
                  {spec.unit ?? "—"}
                </td>
                {specs.some((s) => s.notes) && (
                  <td
                    className={cn(
                      "italic text-[#64748B]",
                      isCompact ? "px-4 py-2 text-xs" : "px-5 py-3 text-xs",
                    )}
                  >
                    {spec.notes ?? ""}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked view */}
      <div className="sm:hidden space-y-3">
        {specs.map((spec, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border border-[#E2E8F0] p-4",
              i % 2 === 0 ? "bg-white" : "bg-[#F4F7FB]",
            )}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
              {spec.parameter}
            </p>
            <p className="font-mono font-bold text-[#101B2D] text-sm">
              {spec.value}
              {spec.unit && (
                <span className="ml-1.5 font-sans text-xs font-normal text-[#64748B]">
                  {spec.unit}
                </span>
              )}
            </p>
            {spec.notes && (
              <p className="mt-1 text-xs italic text-[#64748B]">{spec.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpecTable;
