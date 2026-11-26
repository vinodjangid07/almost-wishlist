"use client";

import React, { useMemo } from "react";
import { useSavings } from "@/contexts/SavingsContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface BentoDashboardProps {
  onOpenEditSavings: () => void;
  onOpenAddWish: () => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = React.memo(({
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

  const { activeCount, affordableCount } = useMemo(() => {
    let active = 0;
    let affordable = 0;
    for (let i = 0; i < wishes.length; i++) {
      const w = wishes[i];
      if (!w.isPurchased) {
        active++;
        if (currentSavings >= w.estimatedPrice) {
          affordable++;
        }
      }
    }
    return { activeCount: active, affordableCount: affordable };
  }, [wishes, currentSavings]);

  if (loading && wishes.length === 0 && currentSavings === 0) {
    return (
      <div className="rounded-2xl bg-[var(--surface)] grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-7 select-none animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-3 w-16 bg-[var(--surface-raised)] rounded" />
            <div className="h-7 w-28 bg-[var(--surface-raised)] rounded" />
            <div className="h-2.5 w-20 bg-[var(--surface-raised)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-[var(--surface)] overflow-hidden select-none">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 p-6 sm:p-7">
        {/* 1: Savings */}
        <div
          onClick={onOpenEditSavings}
          className="cursor-pointer group flex flex-col justify-between space-y-2.5 rounded-xl -m-2.5 p-2.5 hover:bg-[var(--background)]/70 transition-colors"
          title="Click to edit savings"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[var(--muted)]">Savings</span>
            <span className="text-[11px] font-medium text-[var(--primary)] opacity-80 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>
          <span
            suppressHydrationWarning
            className="text-xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--foreground)] truncate block leading-none"
          >
            {currency}{currentSavings.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-[var(--muted)] block truncate">
            Available balance
          </span>
        </div>

        {/* 2: Wishlist Total */}
        <div className="flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[var(--muted)]">Wishlist</span>
            <span className="text-[11px] text-[var(--muted)] tabular-nums">
              {activeCount} {activeCount === 1 ? "wish" : "wishes"}
            </span>
          </div>
          <span
            suppressHydrationWarning
            className="text-xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--foreground)] truncate block leading-none"
          >
            {currency}{totalWishlistCost.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-[var(--muted)] block truncate">
            Total target cost
          </span>
        </div>

        {/* 3: Remaining Gap */}
        <div className="flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[var(--muted)]">Gap</span>
            <span className="text-[11px] text-[var(--muted)] tabular-nums">
              {gap === 0 && totalWishlistCost > 0 ? "Covered" : `${affordabilityPercent}%`}
            </span>
          </div>
          <span
            suppressHydrationWarning
            className={`text-xl sm:text-[28px] font-bold tracking-tight tabular-nums truncate block leading-none ${
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
        <div className="flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[var(--muted)]">Readiness</span>
            <span className="text-[11px] tabular-nums text-[var(--primary)] font-semibold">
              {affordabilityPercent}%
            </span>
          </div>
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[var(--foreground)]">
              {affordableCount}
            </span>
            <span className="text-xs text-[var(--muted)]">
              affordable now
            </span>
          </div>
          <span className="text-[11px] text-[var(--muted)] block truncate">
            {activeCount > 0 ? `Out of ${activeCount} active` : "No active wishes"}
          </span>
        </div>
      </div>

      {/* Single Calibrated Progress Horizon across the bottom edge */}
      <div className="h-[2px] w-full bg-[var(--surface-raised)]">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-500"
          style={{ width: `${Math.min(100, affordabilityPercent)}%` }}
        />
      </div>
    </div>
  );
});

BentoDashboard.displayName = "BentoDashboard";
