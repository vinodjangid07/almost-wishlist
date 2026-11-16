"use client";

import React, { useState, useEffect } from "react";
import { useSavings } from "@/contexts/SavingsContext";
import { X, CurrencyInr } from "@phosphor-icons/react";

interface EditSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditSavingsModal: React.FC<EditSavingsModalProps> = ({ isOpen, onClose }) => {
  const { currentSavings, updateSavings, currency } = useSavings();
  const [value, setValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue(currentSavings > 0 ? currentSavings.toString() : "");
    }
  }, [isOpen, currentSavings]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(value);
    setIsSubmitting(true);
    try {
      await updateSavings(isNaN(parsed) ? 0 : parsed);
      onClose();
    } catch (err) {
      console.error("Failed to update savings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-sm bg-[var(--surface)] rounded-3xl p-6 text-[var(--foreground)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
        >
          <X size={16} />
        </button>

        <span className="text-xs font-medium text-[var(--muted)] block mb-1">
          Savings Balance
        </span>
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-1">Edit Total Savings</h2>
        <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed">
          Update how much money you currently have saved. Enter any amount you want.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Current Savings ({currency})
            </label>
            <div className="relative">
              <CurrencyInr
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
              />
              <input
                type="number"
                min="0"
                step="any"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 50000"
                autoFocus
                className="w-full h-10 bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl pl-9 pr-3.5 text-sm font-semibold tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl text-xs font-semibold bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Amount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
