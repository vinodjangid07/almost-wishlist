"use client";

import React, { useState } from "react";
import { X, UsersThree } from "@phosphor-icons/react";
import { useWishlist } from "@/contexts/WishlistContext";

interface JoinWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinedSuccess?: (wishId: string) => void;
}

export const JoinWishModal: React.FC<JoinWishModalProps> = ({
  isOpen,
  onClose,
  onJoinedSuccess,
}) => {
  const { joinSharedWish } = useWishlist();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setFeedback(null);

    const result = await joinSharedWish(code);
    setLoading(false);

    if (result.success) {
      setFeedback({ text: result.message, error: false });
      setTimeout(() => {
        onClose();
        setCode("");
        setFeedback(null);
        if (result.wishId && onJoinedSuccess) {
          onJoinedSuccess(result.wishId);
        }
      }, 1000);
    } else {
      setFeedback({ text: result.message, error: true });
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-[var(--surface)] p-6 text-[var(--foreground)] animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
          title="Close"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[var(--foreground)]">
            <UsersThree size={18} />
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)]">
            Join shared wish
          </h3>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
          Enter the invite code or link from your friend to collaborate and pool savings together.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (feedback) setFeedback(null);
              }}
              placeholder="e.g. W7X9P2"
              autoFocus
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--background)] text-center text-sm font-mono tracking-widest uppercase text-[var(--foreground)] placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--muted)] placeholder:text-xs focus:outline-none transition"
            />
          </div>

          {feedback && (
            <p
              className={`text-xs text-center font-medium ${
                feedback.error ? "text-[var(--primary)]" : "text-[var(--accent-green)]"
              }`}
            >
              {feedback.text}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="h-10 px-5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Joining..." : "Join Wish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
