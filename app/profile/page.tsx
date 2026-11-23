"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { AuthModal } from "@/components/modals/AuthModal";
import { ArrowLeft, Check } from "@phosphor-icons/react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const { wishes } = useWishlist();
  const { currentSavings, currency } = useSavings();

  const [isEditingName, setIsEditingName] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayNameInput(user.displayName);
    }
  }, [user]);

  const wordmarkLogo =
    resolvedTheme === "dark"
      ? "/light-wordmark-logo.webp"
      : "/dark-wordmark-logo.webp";

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !displayNameInput.trim()) return;
    setIsUpdatingName(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayNameInput.trim(),
      });
      setNameSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update profile name:", err);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "November 2026";

  const fulfilledCount = wishes.filter((w) => w.isFulfilled).length;
  const activeCount = wishes.filter((w) => !w.isFulfilled).length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] font-sans antialiased">
      {/* Top Header - Fully responsive, zero crammed text */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer select-none shrink-0"
            title="almost"
          >
            <Image
              src={wordmarkLogo}
              alt="almost"
              width={100}
              height={24}
              priority
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </Link>

          {/* Controls: Responsive back button + Theme toggle + Desktop Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link
              href="/app"
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs font-semibold bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft size={13} weight="bold" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>

            <ThemeToggle className="h-9 w-9 sm:h-10 sm:w-10" />

            {/* Profile Dropdown hidden on mobile to avoid overcrowding on profile page */}
            <div className="hidden sm:block">
              <ProfileDropdown onOpenAuthModal={() => setIsAuthModalOpen(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 sm:pt-28 pb-20 px-4 sm:px-8 max-w-2xl mx-auto space-y-5 sm:space-y-6">
        {/* Page Heading */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-[var(--primary)]">
            Account &amp; preferences
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Profile settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Manage your personal profile, cloud synchronization, and wishlist registry.
          </p>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] text-center text-xs text-[var(--muted)]">
            Loading account details...
          </div>
        ) : user ? (
          <div className="space-y-4">
            {/* Card 1: Personal Details */}
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Avatar + Name Row (Bulletproof responsive flex) */}
              <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
                    {user.photoURL && !avatarError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userInitial}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base text-[var(--foreground)] truncate">
                        {user.displayName || "Account"}
                      </span>
                      {nameSuccess && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-green)] font-medium shrink-0">
                          <Check size={11} weight="bold" />
                          <span>Saved</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--muted)] block truncate">
                      {user.email || "Active User"}
                    </span>
                  </div>
                </div>

                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="h-8.5 px-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--foreground)] transition cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    Edit Name
                  </button>
                )}
              </div>

              {/* Inline Edit Name Form */}
              {isEditingName && (
                <form onSubmit={handleSaveDisplayName} className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Enter display name"
                    className="flex-1 h-9 px-3 rounded-lg bg-[var(--background)] border border-[var(--border-subtle)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    autoFocus
                    required
                  />
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="submit"
                      disabled={isUpdatingName}
                      className="h-9 px-3.5 rounded-lg text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      {isUpdatingName ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="h-9 px-3 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition cursor-pointer whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Metadata Sub-grid */}
              <div className="pt-3.5 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-[var(--muted)] block">Member since</span>
                  <span className="font-medium text-[var(--foreground)] text-xs mt-0.5 block">{memberSince}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--muted)] block">Sync security</span>
                  <span className="font-medium text-[var(--accent-green)] text-xs mt-0.5 block">Cloud Firestore Synced</span>
                </div>
              </div>
            </div>

            {/* Card 2: Registry Summary (Responsive Grid: 2 cols on mobile, 3 on tablet/desktop) */}
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] p-4 sm:p-6 space-y-3.5 sm:space-y-4">
              <span className="text-xs font-semibold text-[var(--foreground)] block">
                Registry summary
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left">
                <div>
                  <span className="text-[11px] text-[var(--muted)] block">Active wishes</span>
                  <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)] block mt-0.5">
                    {activeCount}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[var(--muted)] block">Fulfilled</span>
                  <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--accent-green)] block mt-0.5">
                    {fulfilledCount}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--muted)] block">Total savings</span>
                  <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)] block mt-0.5 whitespace-nowrap">
                    {currency}{currentSavings.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Session Management */}
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[var(--foreground)] block">Session</span>
                <span className="text-[11px] text-[var(--muted)] block mt-0.5 truncate sm:whitespace-normal">
                  Sign out of your account on this device.
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="h-8.5 px-3.5 rounded-lg text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-bg)] border border-[var(--border-subtle)] transition cursor-pointer shrink-0 whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Unauthenticated State */
          <div className="p-6 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] text-center space-y-4">
            <div className="space-y-1 max-w-sm mx-auto">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Authentication Required
              </h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Connect your account to sync your wishes across devices and manage your savings goals.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-6 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
