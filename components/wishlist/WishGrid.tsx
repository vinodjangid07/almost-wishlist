"use client";

import React from "react";
import { WishItem } from "@/types";
import { WishCard } from "./WishCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { Plus, Package } from "@phosphor-icons/react";

interface WishlistGridProps {
  onEdit: (wish: WishItem) => void;
  onViewDetail: (wish: WishItem) => void;
  onOpenAddWish: () => void;
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({
  onEdit,
  onViewDetail,
  onOpenAddWish,
}) => {
  const { filteredWishes, affordabilityFilter, loading } = useWishlist();
  const { currentSavings } = useSavings();

  const displayedWishes = filteredWishes.filter((item) => {
    if (affordabilityFilter === "affordable") {
      return currentSavings >= item.estimatedPrice;
    }
    if (affordabilityFilter === "unaffordable") {
      return currentSavings < item.estimatedPrice;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-72 rounded-2xl bg-[var(--surface)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (displayedWishes.length === 0) {
    return (
      <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3.5 select-none">
        <div className="w-11 h-11 rounded-2xl bg-[var(--surface)] text-[var(--muted)] flex items-center justify-center">
          <Package size={22} weight="regular" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {filteredWishes.length === 0 ? "No wishes saved yet" : "No matching items"}
          </h3>
          <p className="text-xs text-[var(--muted)] max-w-xs mx-auto leading-relaxed">
            {filteredWishes.length === 0
              ? "Add items you want to buy to track your savings gap."
              : "Try adjusting your search terms or filters."}
          </p>
        </div>
        {filteredWishes.length === 0 && (
          <button
            onClick={onOpenAddWish}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer"
          >
            <Plus size={14} weight="bold" />
            <span>Add Wish</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--muted)] px-0.5">
        <span>
          Showing <span className="font-semibold text-[var(--foreground)]">{displayedWishes.length}</span>{" "}
          {displayedWishes.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedWishes.map((wish) => (
          <WishCard
            key={wish.id}
            wish={wish}
            onEdit={onEdit}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </div>
  );
};
