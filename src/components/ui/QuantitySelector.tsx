import React, { useState, useEffect } from "react";
import { Plus, Minus, AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { StockStatus } from "@/data/flagshipCatalogue";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  availableQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  orderMultiple?: number;
  stockStatus: StockStatus;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  availableQuantity,
  minOrderQuantity = 1,
  maxOrderQuantity = 10,
  orderMultiple = 1,
  stockStatus,
  disabled = false,
  className = "",
}: QuantitySelectorProps) {
  // If product is Made to Order or Contact for Availability, availableQuantity might be 0, but max order still applies
  const isMadeToOrder = stockStatus === "Made to Order" || stockStatus === "Contact for Availability";
  const effectiveMax = isMadeToOrder
    ? maxOrderQuantity
    : Math.min(availableQuantity, maxOrderQuantity);
  const effectiveMin = Math.max(1, minOrderQuantity);

  const [localVal, setLocalVal] = useState<string>(String(value || effectiveMin));
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Sync when prop value changes
  useEffect(() => {
    setLocalVal(String(value));
  }, [value]);

  const handleDecrease = () => {
    if (disabled) return;
    const next = Math.max(effectiveMin, value - orderMultiple);
    if (next < effectiveMin) {
      setWarningMessage(`Minimum order quantity is ${effectiveMin} unit${effectiveMin > 1 ? "s" : ""}.`);
    } else {
      setWarningMessage(null);
    }
    onChange(next);
  };

  const handleIncrease = () => {
    if (disabled) return;
    if (value + orderMultiple > effectiveMax) {
      if (!isMadeToOrder && value >= availableQuantity) {
        setWarningMessage(`Only ${availableQuantity} unit${availableQuantity > 1 ? "s" : ""} currently available in stock.`);
      } else {
        setWarningMessage(`Maximum order limit is ${effectiveMax} units per engineering quote.`);
      }
      return;
    }
    setWarningMessage(null);
    onChange(value + orderMultiple);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);

    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) {
      setWarningMessage("Please enter a valid numeric quantity.");
      return;
    }

    if (parsed < effectiveMin) {
      setWarningMessage(`Minimum order quantity is ${effectiveMin}.`);
      onChange(effectiveMin);
    } else if (parsed > effectiveMax) {
      if (!isMadeToOrder && parsed > availableQuantity) {
        setWarningMessage(`Capped to available stock: ${availableQuantity} units.`);
      } else {
        setWarningMessage(`Capped to maximum permitted order: ${effectiveMax} units.`);
      }
      onChange(effectiveMax);
    } else {
      setWarningMessage(null);
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(localVal, 10);
    if (isNaN(parsed) || parsed < effectiveMin) {
      setLocalVal(String(effectiveMin));
      onChange(effectiveMin);
    } else if (parsed > effectiveMax) {
      setLocalVal(String(effectiveMax));
      onChange(effectiveMax);
    } else {
      setLocalVal(String(parsed));
    }
  };

  const isAtMin = value <= effectiveMin;
  const isAtMax = value >= effectiveMax || effectiveMax <= 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Quantity Controls Pill */}
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={disabled || isAtMin}
            aria-label="Decrease quantity"
            className="flex size-9 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={15} />
          </button>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={localVal}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            aria-label="Order Quantity"
            className="w-14 text-center font-mono text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
          />

          <button
            type="button"
            onClick={handleIncrease}
            disabled={disabled || isAtMax}
            aria-label="Increase quantity"
            className="flex size-9 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Stock Context Indicator */}
        <div className="text-xs">
          {stockStatus === "In Stock" && (
            <span className="font-medium text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>{availableQuantity} available in stock</span>
            </span>
          )}
          {stockStatus === "Low Stock" && (
            <span className="font-semibold text-amber-700 flex items-center gap-1">
              <AlertCircle size={13} className="text-amber-600" />
              <span>Only {availableQuantity} left in stock</span>
            </span>
          )}
          {stockStatus === "Made to Order" && (
            <span className="font-medium text-blue-700 flex items-center gap-1">
              <Info size={13} className="text-blue-600" />
              <span>Manufactured to order (Max {maxOrderQuantity}/batch)</span>
            </span>
          )}
          {stockStatus === "Contact for Availability" && (
            <span className="font-medium text-slate-600 flex items-center gap-1">
              <Info size={13} className="text-slate-500" />
              <span>Specialized build allocation</span>
            </span>
          )}
          <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
            Order limits: Min {effectiveMin} · Max {maxOrderQuantity} units
          </span>
        </div>
      </div>

      {/* Warning / Validation Message */}
      {warningMessage && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200/80 rounded-md px-2.5 py-1.5">
          <AlertCircle size={13} className="shrink-0 text-amber-600" />
          <span>{warningMessage}</span>
        </div>
      )}
    </div>
  );
}

export default QuantitySelector;
