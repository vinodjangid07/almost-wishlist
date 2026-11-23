"use client";

import React, { useState, useEffect } from "react";
import { X, UsersThree, GoogleLogo, ArrowRight } from "@phosphor-icons/react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

interface JoinWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinedSuccess?: (wishId: string) => void;
  onOpenAuthModal?: () => void;
}

export const JoinWishModal: React.FC<JoinWishModalProps> = ({
  isOpen,
  onClose,
  onJoinedSuccess,
  onOpenAuthModal,
}) => {
  const { joinSharedWish } = useWishlist();
  const { user, signInWithGoogle } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

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
      }, 900);
    } else {
      setFeedback({ text: result.message, error: true });
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-2xl p-6 text-[var(--foreground)] animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition cursor-pointer"
          title="Close (ESC)"
        >
          <X size={15} />
        </button>

        {/* If user is not authenticated: Show Sign In Gate */}
        {!user ? (
          <div className="space-y-4 pt-1">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--foreground)]">
              <UsersThree size={20} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                Sign in to Join Wish
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Collaborative wishlists require an account so your friends know who joined and can pool savings in real time.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full h-10 px-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--foreground)] flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <GoogleLogo size={16} weight="bold" />
                <span>{authLoading ? "Connecting..." : "Continue with Google"}</span>
              </button>

              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="w-full text-center text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] transition py-1 cursor-pointer"
                >
                  Or sign in with email →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* User is authenticated: Show Code Input */
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--foreground)]">
                <UsersThree size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                  Join Shared Wish
                </h3>
                <span className="text-[11px] text-[var(--muted)] block">
                  Connected as {user.displayName || user.email?.split("@")[0]}
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Enter the 6-character invite code from your friend to join their wishlist and pool savings.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  maxLength={10}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (feedback) setFeedback(null);
                  }}
                  placeholder="e.g. W7X9P2"
                  autoFocus
                  className="w-full h-11 px-4 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-center text-sm font-mono tracking-widest uppercase text-[var(--foreground)] placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-[var(--placeholder)] placeholder:text-xs focus:outline-none focus:border-[var(--muted)] transition"
                />
              </div>

              {feedback && (
                <p
                  className={`text-xs text-center font-medium ${
                    feedback.error ? "text-[var(--danger)]" : "text-[var(--accent-green)]"
                  }`}
                >
                  {feedback.text}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-3.5 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="h-9 px-4 rounded-lg text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{loading ? "Joining..." : "Join Wish"}</span>
                  <ArrowRight size={13} weight="bold" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
