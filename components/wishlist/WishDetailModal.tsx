"use client";

import React, { useState, useMemo, useEffect } from "react";
import { WishItem, WishMember } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useModalBackGesture } from "@/hooks/useModalBackGesture";
import {
  X,
  ArrowSquareOut,
  PencilSimple,
  Trash,
  UsersThree,
  Copy,
  Check,
  SignOut,
} from "@phosphor-icons/react";
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
  const { toggleFulfilled, deleteWish, updateMemberContribution, leaveSharedWish } = useWishlist();
  const { currentSavings, currency } = useSavings();
  const { user } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [updateSavedSuccess, setUpdateSavedSuccess] = useState(false);
  const [myContribution, setMyContribution] = useState<string>("");
  const [savingContribution, setSavingContribution] = useState(false);

  const { dragOffset, touchHandlers } = useModalBackGesture({
    isOpen,
    onClose,
    modalId: "wish-detail-modal",
  });

  const isFulfilled = Boolean(wish?.isFulfilled ?? wish?.isPurchased);

  // Initialize personal contribution input from member record
  useEffect(() => {
    if (wish && wish.isShared && user && wish.members && wish.members[user.uid]) {
      setMyContribution(wish.members[user.uid].savedAmount?.toString() || "");
    } else {
      setMyContribution("");
    }
  }, [wish, user]);

  // Keyboard shortcut: ESC to exit
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const memberList: WishMember[] = useMemo(() => {
    if (!wish || !wish.isShared || !wish.members) return [];
    return Object.values(wish.members);
  }, [wish]);

  const totalPooled = useMemo(() => {
    return memberList.reduce((acc, m) => acc + (m.savedAmount || 0), 0);
  }, [memberList]);

  if (!isOpen || !wish) return null;

  const isAffordable = wish.isShared
    ? totalPooled >= wish.estimatedPrice
    : currentSavings >= wish.estimatedPrice;

  const shortfall = wish.isShared
    ? Math.max(0, wish.estimatedPrice - totalPooled)
    : Math.max(0, wish.estimatedPrice - currentSavings);

  const pooledPercent = wish.estimatedPrice > 0
    ? Math.min(100, Math.round((totalPooled / wish.estimatedPrice) * 100))
    : 0;

  const isCreator = !wish.isShared || (user && wish.userId === user.uid);

  const handleCopyInvite = () => {
    if (!wish.inviteCode) return;
    navigator.clipboard.writeText(wish.inviteCode);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 2000);
  };

  const handleSaveContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(myContribution) || 0;
    setSavingContribution(true);
    await updateMemberContribution(wish.id, amount);
    setSavingContribution(false);
    setUpdateSavedSuccess(true);
    setTimeout(() => setUpdateSavedSuccess(false), 1800);
  };

  const handleLeave = async () => {
    await leaveSharedWish(wish.id);
    onClose();
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md overflow-hidden select-none"
      >
        <div
          {...touchHandlers}
          style={{
            transform: dragOffset > 0 ? `translateX(${dragOffset}px)` : undefined,
            opacity: dragOffset > 0 ? Math.max(0.5, 1 - dragOffset / 300) : undefined,
            transition: dragOffset === 0 ? "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease" : "none",
          }}
          className="relative w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] bg-[var(--surface)] border-0 sm:border sm:border-[var(--border-subtle)] rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col my-0 sm:my-4 text-[var(--foreground)] animate-in zoom-in-95 duration-150"
        >
          {/* Header Bar */}
          <div className="px-5 sm:px-7 py-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--surface)]">
            <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
              Wish Details
            </h2>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--muted)]">
                ESC
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition cursor-pointer"
                title="Close (ESC)"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 space-y-4 overflow-y-auto flex-1 select-text">
            {/* Hero image */}
          {wish.imageUrl && (
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[var(--surface-raised)] mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wish.imageUrl}
                alt={wish.title}
                className="w-full h-full object-cover"
              />
              {isFulfilled && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white text-black">
                    Fulfilled
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Editorial Meta Bar (Zero plastic pills) */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-[var(--muted)] pt-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-semibold text-[var(--foreground)] whitespace-nowrap">{wish.category}</span>
              <span className="text-[var(--muted-light)]">•</span>
              <span className="capitalize whitespace-nowrap">{wish.tag}</span>
              <span className="text-[var(--muted-light)]">•</span>
              <span className="capitalize whitespace-nowrap">{wish.priority} priority</span>
            </div>
            <span className="text-[11px] tabular-nums whitespace-nowrap shrink-0">
              {new Date(wish.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] mt-1.5 mb-2">
            {wish.title}
          </h2>

          {/* Target Price Block (Flat on surface, no Russian doll card) */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-[var(--surface-raised)]">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tabular-nums text-[var(--foreground)]">
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

            <div>
              {isAffordable ? (
                <span className="text-xs font-semibold text-[var(--accent-green)]">
                  {wish.isShared ? "Goal fully pooled" : "Within current savings"}
                </span>
              ) : (
                <span className="text-xs font-medium text-[var(--muted)]">
                  Need {currency}{shortfall.toLocaleString("en-IN")} more to fulfill
                </span>
              )}
            </div>
          </div>

          {/* Collaborative Fund Pool (Clean, flat, integrated) */}
          {wish.isShared && (
            <div className="py-4 space-y-3.5 border-b border-[var(--surface-raised)]">
              {/* Header with Invite Code */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersThree size={16} className="text-[var(--foreground)]" />
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    Collaborative Fund Pool
                  </span>
                </div>
                {wish.inviteCode && (
                  <button
                    onClick={handleCopyInvite}
                    className="h-7 px-2.5 rounded-lg text-[11px] font-medium bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] flex items-center gap-1.5 transition cursor-pointer"
                    title="Copy invite code for friends"
                  >
                    {copyCodeSuccess ? (
                      <>
                        <Check size={12} className="text-[var(--accent-green)]" />
                        <span className="text-[var(--accent-green)] font-semibold">Copied Code</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="opacity-70" />
                        <span className="font-mono uppercase tracking-wider">Code: {wish.inviteCode}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Minimal Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold tabular-nums text-[var(--foreground)]">
                    {currency}{totalPooled.toLocaleString("en-IN")} pooled
                  </span>
                  <span className="tabular-nums text-[var(--muted)] font-medium">
                    {pooledPercent}% of goal
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--surface-raised)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                    style={{ width: `${pooledPercent}%` }}
                  />
                </div>
              </div>

              {/* Participants List */}
              <div className="space-y-1.5 pt-1">
                <div className="space-y-0.5">
                  {memberList.map((m) => {
                    const isMe = user && m.uid === user.uid;
                    return (
                      <div
                        key={m.uid}
                        className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-[var(--surface-raised)] transition text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-[var(--surface-raised)] flex items-center justify-center font-bold text-[10px] text-[var(--foreground)] shrink-0">
                            {m.displayName ? m.displayName.charAt(0).toUpperCase() : "F"}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[var(--foreground)]">
                              {m.displayName || (isMe ? "You" : "Friend")}
                            </span>
                            {isMe && (
                              <span className="text-[10px] font-medium text-[var(--muted)]">
                                (You)
                              </span>
                            )}
                            {m.role === "owner" && (
                              <span className="text-[10px] text-[var(--muted)]">
                                • Creator
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums text-[var(--foreground)]">
                          {currency}{(m.savedAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Personal Contribution input: quiet, integrated, with currency prefix and high-contrast dark button */}
                {user && (
                  <form onSubmit={handleSaveContribution} className="pt-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] font-semibold pointer-events-none">
                        {currency}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="My contribution..."
                        value={myContribution}
                        onChange={(e) => setMyContribution(e.target.value)}
                        className="w-full h-9 pl-7 pr-3 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] text-xs tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingContribution}
                      className={`h-9 px-3.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5 ${
                        updateSavedSuccess
                          ? "bg-[var(--accent-green)] text-black"
                          : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
                      }`}
                    >
                      {updateSavedSuccess ? (
                        <>
                          <Check size={13} weight="bold" />
                          <span>Saved</span>
                        </>
                      ) : savingContribution ? (
                        "Saving..."
                      ) : (
                        "Update Saved"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Notes (Quiet text on surface, no grey wrapper box) */}
          {wish.description && (
            <div className="py-3.5 border-b border-[var(--surface-raised)]">
              <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                Note
              </span>
              <p className="text-xs text-[var(--foreground)] leading-relaxed">
                {wish.description}
              </p>
            </div>
          )}

          {/* Reference Links (Only rendered when links exist) */}
          {wish.links && wish.links.length > 0 && (
            <div className="py-3.5 border-b border-[var(--surface-raised)]">
              <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
                Reference Links ({wish.links.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {wish.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] transition group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[var(--foreground)] block">
                        {link.storeName}
                      </span>
                      {link.price && (
                        <p className="text-[11px] tabular-nums text-[var(--muted)] mt-0.5">
                          {currency}{link.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                    <ArrowSquareOut
                      size={13}
                      className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Pinned Sticky Footer */}
          <div className="px-5 sm:px-7 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 backdrop-blur-md shrink-0 flex items-center justify-between gap-2 text-xs">
            <button
              onClick={() => toggleFulfilled(wish.id)}
              className={`h-9 px-3.5 sm:px-4 rounded-xl font-semibold transition cursor-pointer text-xs ${
                isFulfilled
                  ? "bg-[var(--surface-raised)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                  : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-xs"
              }`}
            >
              {isFulfilled ? "Mark Pending" : "Mark Fulfilled"}
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {isCreator && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(wish);
                  }}
                  className="h-9 inline-flex items-center gap-1.5 px-3 sm:px-4 rounded-xl font-medium bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer text-xs"
                >
                  <PencilSimple size={13} />
                  <span>Edit</span>
                </button>
              )}

              {isCreator ? (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="h-9 inline-flex items-center justify-center w-9 rounded-xl font-medium bg-[var(--surface-raised)] hover:text-[var(--danger)] hover:bg-[var(--surface-hover)] text-[var(--muted)] transition cursor-pointer text-xs"
                  title="Delete wish"
                >
                  <Trash size={14} />
                </button>
              ) : (
                <button
                  onClick={handleLeave}
                  className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl font-medium bg-[var(--surface-raised)] hover:text-[var(--danger)] hover:bg-[var(--surface-hover)] text-[var(--muted)] transition cursor-pointer text-xs"
                  title="Leave shared wish"
                >
                  <SignOut size={14} />
                  <span>Leave</span>
                </button>
              )}
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
