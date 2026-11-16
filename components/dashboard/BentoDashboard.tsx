"use client";

import React from "react";
import { useSavings } from "@/contexts/SavingsContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { PencilSimple } from "@phosphor-icons/react";

interface BentoDashboardProps {
  onOpenEditSavings: () => void;
  onOpenAddWish: () => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  onOpenEditSavings,
}) => {
  const {
    currentSavings,
    totalWishlistCost,
    gap,
    affordabilityPercent,
    currency,
  } = useSavings();
  const { wishes, loading } = useWishlist();

  const activeCount = wishes.filter((w) => !w.isPurchased).length;
  const affordableCount = wishes.filter(
    (w) => !w.isPurchased && currentSavings >= w.estimatedPrice
  ).length;

  if (loading && wishes.length === 0 && currentSavings === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] space-y-2">
            <div className="h-3 w-16 bg-[var(--surface-raised)] rounded" />
            <div className="h-6 w-24 bg-[var(--surface-raised)] rounded" />
            <div className="h-2 w-full bg-[var(--surface-raised)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1: Savings */}
      <div
        onClick={onOpenEditSavings}
        className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] hover:bg-[var(--card-hover)] transition cursor-pointer group flex flex-col justify-between space-y-2.5"
        title="Click to edit savings"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--muted)]">Savings</span>
          <PencilSimple size={13} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition opacity-60 group-hover:opacity-100" />
        </div>
        <span
          suppressHydrationWarning
          className="text-lg sm:text-2xl font-bold tabular-nums text-[var(--foreground)] truncate block"
        >
          {currency}{currentSavings.toLocaleString("en-IN")}
        </span>
        <span className="text-[11px] text-[var(--muted)] block truncate">
          Click to edit
        </span>
      </div>

      {/* 2: Wishlist Total */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--muted)]">Wishlist</span>
          <span className="text-[11px] text-[var(--muted)] font-medium">
            {activeCount} {activeCount === 1 ? "wish" : "wishes"}
          </span>
        </div>
        <span
          suppressHydrationWarning
          className="text-lg sm:text-2xl font-bold tabular-nums text-[var(--foreground)] truncate block"
        >
          {currency}{totalWishlistCost.toLocaleString("en-IN")}
        </span>
        <span className="text-[11px] text-[var(--muted)] block truncate">
          Total target cost
        </span>
      </div>

      {/* 3: Remaining Gap */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--muted)]">Gap</span>
          <span className="text-[11px] text-[var(--muted)] font-medium">
            {gap === 0 && totalWishlistCost > 0 ? "Ready" : `${affordabilityPercent}%`}
          </span>
        </div>
        <span
          suppressHydrationWarning
          className={`text-lg sm:text-2xl font-bold tabular-nums truncate block ${
            gap === 0 && totalWishlistCost > 0
              ? "text-[var(--accent-green)]"
              : "text-[var(--foreground)]"
          }`}
        >
          {gap === 0 && totalWishlistCost > 0
            ? "₹0"
            : `${currency}${gap.toLocaleString("en-IN")}`}
        </span>
        <span className="text-[11px] text-[var(--muted)] block truncate">
          {gap === 0 && totalWishlistCost > 0 ? "Fully covered" : "Remaining to save"}
        </span>
      </div>

      {/* 4: Summary / Status */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--muted)]">Summary</span>
          <span className="text-[11px] text-[var(--muted)] font-medium">
            {affordabilityPercent}%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-2xl font-bold tabular-nums text-[var(--foreground)]">
            {affordableCount}
          </span>
          <span className="text-xs text-[var(--muted)]">
            affordable now
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--surface-raised)] overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, affordabilityPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
