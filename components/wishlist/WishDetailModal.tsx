"use client";

import React, { useState } from "react";
import { WishItem } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { X, ArrowSquareOut, PencilSimple, CalendarBlank, Trash } from "@phosphor-icons/react";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";

interface WishDetailModalProps {
  wish: WishItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (wish: WishItem) => void;
}

export const WishDetailModal: React.FC<WishDetailModalProps> = ({
  wish,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { togglePurchased, deleteWish } = useWishlist();
  const { currentSavings, currency } = useSavings();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen || !wish) return null;

  const isAffordable = currentSavings >= wish.estimatedPrice;
  const shortfall = Math.max(0, wish.estimatedPrice - currentSavings);

  const getTagBadge = () => {
    if (wish.tag === "need") {
      return (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--background)] text-[var(--foreground)]">
          Need
        </span>
      );
    }
    if (wish.tag === "want") {
      return (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--background)] text-[var(--foreground)]">
          Want
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--accent-gold-bg)] text-[var(--accent-gold)]">
        Luxury
      </span>
    );
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      >
        <div className="relative w-full max-w-lg bg-[var(--surface)] rounded-3xl p-6 sm:p-7 text-[var(--foreground)] my-8 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] transition z-10 cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>

          {/* Hero image */}
          {wish.imageUrl && (
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[var(--background)] mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wish.imageUrl}
                alt={wish.title}
                className="w-full h-full object-cover"
              />
              {wish.isPurchased && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white text-black">
                    Purchased
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {getTagBadge()}
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--background)] text-[var(--muted)]">
              {wish.category}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--background)] text-[var(--muted)]">
              {wish.priority} priority
            </span>
            <span className="text-xs text-[var(--muted)] ml-auto flex items-center gap-1">
              <CalendarBlank size={14} />
              {new Date(wish.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] mb-3">
            {wish.title}
          </h2>

          {/* Price & Affordability Box */}
          <div className="p-4 rounded-2xl bg-[var(--background)] my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-xs font-medium text-[var(--muted)] block">
                Estimated Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold tabular-nums text-[var(--foreground)]">
                  {currency}{wish.estimatedPrice.toLocaleString("en-IN")}
                </span>
                {(wish.minPrice || wish.maxPrice) && (
                  <span className="text-xs tabular-nums text-[var(--muted)]">
                    (Range: {wish.minPrice ? `${currency}${wish.minPrice.toLocaleString("en-IN")}` : ""}
                    {wish.minPrice && wish.maxPrice ? " – " : ""}
                    {wish.maxPrice ? `${currency}${wish.maxPrice.toLocaleString("en-IN")}` : ""})
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              {isAffordable ? (
                <span className="text-xs font-semibold text-[var(--accent-green)] block">
                  Within current savings
                </span>
              ) : (
                <span className="text-xs text-[var(--muted)] block">
                  Need {currency}{shortfall.toLocaleString("en-IN")} more to purchase
                </span>
              )}
            </div>
          </div>

          {/* Note */}
          {wish.description && (
            <div className="mb-4 p-4 rounded-2xl bg-[var(--background)]">
              <span className="text-xs font-medium text-[var(--muted)] block mb-1">
                Note
              </span>
              <p className="text-xs text-[var(--foreground)] leading-relaxed">
                {wish.description}
              </p>
            </div>
          )}

          {/* Multi-store comparison */}
          <div className="mb-5">
            <span className="text-xs font-medium text-[var(--muted)] block mb-2">
              Store Links ({wish.links?.length || 0})
            </span>

            {wish.links && wish.links.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {wish.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)] hover:bg-[var(--surface-hover)] transition group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[var(--foreground)] block">
                        {link.storeName}
                      </span>
                      {link.price && (
                        <p className="text-xs tabular-nums text-[var(--muted)] mt-0.5">
                          {currency}{link.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                    <ArrowSquareOut size={14} className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted)]">No store links saved.</p>
            )}
          </div>

          {/* Footer (Unified h-10 button controls) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
            <button
              onClick={() => togglePurchased(wish.id)}
              className={`h-10 px-4 rounded-xl font-semibold transition cursor-pointer ${
                wish.isPurchased
                  ? "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                  : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
              }`}
            >
              {wish.isPurchased ? "Mark Pending" : "Mark as Bought"}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(wish);
                }}
                className="h-10 inline-flex items-center gap-1.5 px-4 rounded-xl font-medium bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
              >
                <PencilSimple size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-10 inline-flex items-center gap-1.5 px-3 rounded-xl font-medium bg-[var(--background)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] text-[var(--muted)] transition cursor-pointer"
                title="Delete wish"
              >
                <Trash size={15} />
              </button>
              <button
                onClick={onClose}
                className="h-10 px-4 rounded-xl font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemTitle={wish.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteWish(wish.id);
          onClose();
        }}
      />
    </>
  );
};
