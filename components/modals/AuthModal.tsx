"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, Lock, Envelope, User } from "@phosphor-icons/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeedShowcase?: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSeedShowcase }) => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-sm bg-[var(--surface)] rounded-3xl p-6 sm:p-7 text-[var(--foreground)]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
        >
          <X size={16} />
        </button>

        <span className="text-xs font-medium text-[var(--primary)] block mb-1">
          Account
        </span>

        <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
          {user ? "Your Account" : isSignUp ? "Create Account" : "Sign In"}
        </h2>
        <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed">
          {user
            ? `Logged in as ${user.email || user.displayName || "User"}`
            : "Sign in to keep your wishlist synced across your devices."}
        </p>

        {user ? (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--background)]">
              <span className="text-[var(--muted)] text-[11px] block">
                Signed In As
              </span>
              <p className="font-semibold text-[var(--foreground)] mt-0.5">{user.email || "Guest Session"}</p>
              {user.displayName && <p className="text-[var(--muted)] mt-0.5">{user.displayName}</p>}
            </div>

            {onSeedShowcase && (
              <button
                type="button"
                disabled={seeding}
                onClick={async () => {
                  setSeeding(true);
                  try {
                    await onSeedShowcase();
                    onClose();
                  } finally {
                    setSeeding(false);
                  }
                }}
                className="w-full h-10 px-4 rounded-xl text-xs font-semibold bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] text-[var(--foreground)] transition cursor-pointer flex items-center justify-center gap-2"
              >
                {seeding ? "Populating wishes..." : "Seed 6 Showcase Products"}
              </button>
            )}

            <button
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="w-full h-10 px-4 rounded-xl text-xs font-semibold bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 mb-3.5 rounded-xl bg-[var(--danger-bg)] text-[var(--danger)] text-xs font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-10 mb-3 flex items-center justify-center gap-2.5 px-4 rounded-xl text-xs font-semibold bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-3 gap-2">
              <div className="flex-1 h-px bg-[var(--surface-hover)]" />
              <span className="text-[11px] text-[var(--muted)]">or with email</span>
              <div className="flex-1 h-px bg-[var(--surface-hover)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl pl-9 pr-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                  Email
                </label>
                <div className="relative">
                  <Envelope size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl pl-9 pr-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl pl-9 pr-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-2 px-4 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="text-center pt-3 text-xs text-[var(--muted)]">
              <span>{isSignUp ? "Already have an account?" : "Don't have an account?"} </span>
              <button
                onClick={() => {
                  setError(null);
                  setIsSignUp(!isSignUp);
                }}
                className="text-[var(--primary)] font-semibold underline hover:opacity-80 transition cursor-pointer"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
