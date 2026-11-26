"use client";

import React, { useState, useCallback, useMemo } from "react";
import { WishItem } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { PencilSimple, Trash, ArrowSquareOut } from "@phosphor-icons/react";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

interface WishCardProps {
  wish: WishItem;
  onEdit: (wish: WishItem) => void;
  onViewDetail: (wish: WishItem) => void;
}

export const WishCard: React.FC<WishCardProps> = React.memo(({ wish, onEdit, onViewDetail }) => {
  const { deleteWish, toggleFulfilled } = useWishlist();
  const { currency } = useSavings();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isFulfilled = Boolean(wish.isFulfilled ?? wish.isPurchased);

  const memberCount = wish.memberUids?.length || (wish.members ? Object.keys(wish.members).length : 1);

  const pooledSavings = useMemo(() => {
    if (!wish.members) return 0;
    return Object.values(wish.members).reduce((sum, m) => sum + (m.savedAmount || 0), 0);
  }, [wish.members]);

  const handleToggleFulfilled = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFulfilled(wish.id);
  }, [toggleFulfilled, wish.id]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  }, []);

  return (
    <>
      <div
        onClick={() => onViewDetail(wish)}
        className={`group relative flex flex-col justify-between rounded-2xl bg-[var(--surface)] hover:bg-[var(--card-hover)] transition-colors duration-200 cursor-pointer overflow-hidden ${
          isFulfilled ? "opacity-60" : ""
        }`}
      >
        {/* Top Image Container (Clean recessed matte studio canvas, zero border lines) */}
        <div className="relative w-full h-48 bg-[var(--background)]/80 overflow-hidden">
          {wish.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wish.imageUrl}
              alt={wish.title}
              className={`w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                isFulfilled ? "grayscale" : ""
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[var(--muted)] font-medium">
              <span>almost</span>
            </div>
          )}

          {/* Architectural Shared Label (No rounded-full bubble pill) */}
          {wish.isShared && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-white text-[11px] font-medium">
              {memberCount} {memberCount === 1 ? "friend" : "friends"}
            </div>
          )}

          {isFulfilled && (
            <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--foreground)]">
                Fulfilled
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-semibold text-sm text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                {wish.title}
              </h3>
              <span className="text-[11px] text-[var(--muted)] shrink-0">
                {wish.category}
              </span>
            </div>

            {wish.description ? (
              <p className="text-xs text-[var(--muted)] line-clamp-1 mt-1 leading-relaxed">
                {wish.description}
              </p>
            ) : (
              <span className="text-xs text-[var(--muted)] opacity-50 mt-1 block">No notes</span>
            )}
          </div>

          {/* Price & Progress */}
          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold tabular-nums tracking-tight text-[var(--foreground)]">
                  {currency}{wish.estimatedPrice.toLocaleString("en-IN")}
                </span>
                {(wish.minPrice || wish.maxPrice) && (
                  <span className="text-[11px] tabular-nums text-[var(--muted)]">
                    ({wish.minPrice ? `${currency}${wish.minPrice.toLocaleString("en-IN")}` : ""}
                    {wish.minPrice && wish.maxPrice ? "–" : ""}
                    {wish.maxPrice ? `${currency}${wish.maxPrice.toLocaleString("en-IN")}` : ""})
                  </span>
                )}
              </div>

              {wish.isShared && pooledSavings > 0 && (
                <span className="text-[11px] font-semibold text-[var(--accent-green)] tabular-nums">
                  {currency}{pooledSavings.toLocaleString("en-IN")} pooled
                </span>
              )}
            </div>

            {/* Sourcing Stores (Clean borderless chips) */}
            {wish.links && wish.links.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {wish.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
                  >
                    <span>{link.storeName}</span>
                    <ArrowSquareOut size={10} className="opacity-60" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quiet Recessed Action Footer (Zero borders, zero colorful pills) */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleToggleFulfilled}
              className={`h-8 px-3 rounded-lg bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-medium transition cursor-pointer ${
                isFulfilled
                  ? "text-[var(--accent-green)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {isFulfilled ? "Fulfilled" : "Mark fulfilled"}
            </button>

            <div className="flex items-center gap-1 text-[var(--muted)] md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(wish);
                }}
                title="Edit wish"
                className="p-1.5 rounded-lg hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition cursor-pointer"
              >
                <PencilSimple size={15} />
              </button>
              <button
                onClick={handleDeleteClick}
                title="Delete wish"
                className="p-1.5 rounded-lg hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] transition cursor-pointer"
              >
                <Trash size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemTitle={wish.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteWish(wish.id)}
      />
    </>
  );
});

WishCard.displayName = "WishCard";
