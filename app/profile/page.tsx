"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AuthModal } from "@/components/modals/AuthModal";
import { ArrowLeft, ArrowUpRight, Check } from "@phosphor-icons/react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { wishes } = useWishlist();
  const {
    currentSavings,
    totalWishlistCost,
    gap,
    affordabilityPercent,
    currency,
  } = useSavings();

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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] font-sans antialiased flex flex-col">
      {/* Unified Seamless Top Rail - Matches Landing grid alignment & Dashboard borderless surfaces */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[var(--background)]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Left: Wordmark identical in proportion to Landing Navbar */}
          <Link
            href="/"
            className="flex items-center group cursor-pointer select-none shrink-0"
            title="almost • home"
          >
            <Image
              src="/dark-wordmark-logo.webp"
              alt="almost"
              width={120}
              height={28}
              priority
              className="h-6 sm:h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80 dark:hidden"
            />
            <Image
              src="/light-wordmark-logo.webp"
              alt="almost"
              width={120}
              height={28}
              priority
              className="hidden dark:block h-6 sm:h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
            />
          </Link>

          {/* Right: Borderless Tonal Controls matching Dashboard Header */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link
              href="/app"
              className="group h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition active:scale-[0.98] flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft
                size={13}
                weight="bold"
                className="text-[var(--muted)] group-hover:text-[var(--foreground)] group-hover:-translate-x-0.5 transition-all duration-200"
              />
              <span className="hidden sm:inline">Back to Wishlist</span>
              <span className="sm:hidden">Wishlist</span>
            </Link>

            <ThemeToggle />

            {!loading && !user && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="h-10 px-4 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Architectural Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 sm:pt-32 pb-20">
        {/* Editorial Page Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 sm:pb-12">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs font-medium text-[var(--muted)]">
              {user ? `Member since ${memberSince}` : "Personal workspace"}
            </p>
            <h1 className="text-[clamp(2.25rem,5vw,4.25rem)] font-bold tracking-[-0.03em] leading-[1.02] text-[var(--foreground)] text-balance">
              {loading
                ? "Loading profile."
                : user
                ? user.displayName || user.email?.split("@")[0] || "Your account"
                : "Sign in to sync."}
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl leading-relaxed">
              Manage your identity, cloud synchronization, and current savings standing across almost.
            </p>
          </div>

          {user && (
            <div className="lg:col-span-4 flex flex-col lg:items-end justify-end space-y-1">
              <span className="text-xs font-medium text-[var(--accent-green)]">
                Cloud Firestore Synced
              </span>
              <span className="text-xs text-[var(--muted)] truncate max-w-full">
                {user.email || "Active session"}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-pulse select-none">
            <div className="lg:col-span-5 rounded-3xl bg-[var(--surface)] h-80 p-7 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--background)]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-[var(--background)]" />
                  <div className="h-3 w-44 rounded bg-[var(--background)]" />
                </div>
              </div>
              <div className="h-24 rounded-2xl bg-[var(--background)]" />
              <div className="h-16 rounded-2xl bg-[var(--background)]" />
            </div>
            <div className="lg:col-span-7 rounded-3xl bg-[var(--surface)] h-80 p-7 space-y-6">
              <div className="h-3 w-28 rounded bg-[var(--background)]" />
              <div className="h-12 w-52 rounded bg-[var(--background)]" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded-2xl bg-[var(--background)]" />
                <div className="h-24 rounded-2xl bg-[var(--background)]" />
                <div className="h-24 rounded-2xl bg-[var(--background)]" />
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            {/* Left Wing (5 cols): Identity & Session Slab */}
            <section className="lg:col-span-5 rounded-3xl bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between gap-7">
              <div className="space-y-6">
                {/* Identity Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-[var(--background)] flex items-center justify-center text-lg sm:text-xl font-bold text-[var(--foreground)] shrink-0">
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

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-base sm:text-lg text-[var(--foreground)] truncate">
                          {user.displayName || "Account"}
                        </h2>
                        {nameSuccess && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-green)] font-medium shrink-0">
                            <Check size={11} weight="bold" />
                            <span>Saved</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted)] truncate">
                        {user.email || "Active user"}
                      </p>
                    </div>
                  </div>

                  {!isEditingName && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="h-9 px-3.5 rounded-xl bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--foreground)] transition active:scale-[0.98] cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      Edit name
                    </button>
                  )}
                </div>

                {/* Inline Display Name Form */}
                {isEditingName && (
                  <form
                    onSubmit={handleSaveDisplayName}
                    className="p-4 rounded-2xl bg-[var(--background)] space-y-3"
                  >
                    <label
                      htmlFor="profile-display-name"
                      className="text-xs font-medium text-[var(--muted)] block"
                    >
                      Display name
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        id="profile-display-name"
                        type="text"
                        value={displayNameInput}
                        onChange={(e) => setDisplayNameInput(e.target.value)}
                        placeholder="Enter display name"
                        className="flex-1 h-10 px-3.5 rounded-xl bg-[var(--surface)] text-xs font-medium text-[var(--foreground)] placeholder:text-[var(--placeholder)] outline-none focus:ring-1 focus:ring-[var(--border-subtle)] transition"
                        autoFocus
                        required
                      />
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="submit"
                          disabled={isUpdatingName}
                          className="h-10 px-4 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                          {isUpdatingName ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="h-10 px-3 rounded-xl text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition cursor-pointer whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Recessed Account Metadata Pockets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[var(--background)] p-4 space-y-1">
                    <span className="text-[11px] text-[var(--muted)] block">
                      Member since
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--foreground)] block">
                      {memberSince}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[var(--background)] p-4 space-y-1">
                    <span className="text-[11px] text-[var(--muted)] block">
                      Sync security
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--accent-green)] block">
                      Cloud Firestore Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Integrated Session Control Footer */}
              <div className="rounded-2xl bg-[var(--background)] p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-0.5">
                  <span className="text-xs font-semibold text-[var(--foreground)] block">
                    Session
                  </span>
                  <span className="text-[11px] text-[var(--muted)] block truncate sm:whitespace-normal">
                    Sign out of your account on this device.
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-[var(--surface)] text-[var(--danger)] hover:bg-[var(--danger-bg)] transition active:scale-[0.98] cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Sign out
                </button>
              </div>
            </section>

            {/* Right Wing (7 cols): Savings & Wishlist Standing Slab */}
            <section className="lg:col-span-7 rounded-3xl bg-[var(--surface)] overflow-hidden flex flex-col justify-between">
              <div className="p-6 sm:p-8 space-y-8">
                {/* Header & Direct Return CTA */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-[var(--muted)]">
                    Wishlist overview
                  </span>

                  <Link
                    href="/app"
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                  >
                    <span>Open wishlist</span>
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      className="text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    />
                  </Link>
                </div>

                {/* Primary Hero Savings Metric */}
                <div className="space-y-2.5">
                  <span className="text-xs font-medium text-[var(--muted)] block">
                    Total savings
                  </span>
                  <div
                    suppressHydrationWarning
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.035em] tabular-nums leading-none text-[var(--foreground)]"
                  >
                    {currency}
                    {currentSavings.toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {totalWishlistCost > 0
                      ? `Measured against ${currency}${totalWishlistCost.toLocaleString("en-IN")} across your active wishlist.`
                      : "Your live balance sits beside every item you add to almost."}
                  </p>
                </div>

                {/* Three Recessed Standing Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[var(--background)] p-4 sm:p-5 space-y-2">
                    <span className="text-[11px] font-medium text-[var(--muted)] block">
                      Active wishes
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[var(--foreground)] block leading-none">
                      {activeCount}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] block">
                      {activeCount === 1 ? "Item in queue" : "Items in queue"}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[var(--background)] p-4 sm:p-5 space-y-2">
                    <span className="text-[11px] font-medium text-[var(--muted)] block">
                      Fulfilled
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-[var(--accent-green)] block leading-none">
                      {fulfilledCount}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] block">
                      {fulfilledCount === 1 ? "Completed wish" : "Completed wishes"}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[var(--background)] p-4 sm:p-5 space-y-2">
                    <span className="text-[11px] font-medium text-[var(--muted)] block">
                      Remaining gap
                    </span>
                    <span
                      suppressHydrationWarning
                      className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums block leading-none ${
                        gap === 0 && totalWishlistCost > 0
                          ? "text-[var(--accent-green)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {gap === 0 && totalWishlistCost > 0
                        ? `${currency}0`
                        : `${currency}${gap.toLocaleString("en-IN")}`}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] block">
                      {gap === 0 && totalWishlistCost > 0
                        ? "Fully covered"
                        : "Until everything is funded"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calibrated Readiness Horizon Bar - Matches BentoDashboard & Landing */}
              <div>
                <div className="px-6 sm:px-8 py-4 bg-[var(--background)]/50 flex items-center justify-between gap-4 text-xs">
                  <span className="text-[var(--muted)] font-medium">
                    Wishlist coverage
                  </span>
                  <span className="tabular-nums font-semibold text-[var(--primary)]">
                    {affordabilityPercent}%
                  </span>
                </div>
                <div className="h-[2px] w-full bg-[var(--surface-raised)]">
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-500"
                    style={{ width: `${Math.min(100, affordabilityPercent)}%` }}
                  />
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Unauthenticated Editorial Card */
          <div className="rounded-3xl bg-[var(--surface)] p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <Image
                src="/light-app-icon.webp"
                alt="almost"
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl object-contain dark:hidden"
              />
              <Image
                src="/dark-app-icon.webp"
                alt="almost"
                width={56}
                height={56}
                className="hidden dark:block w-14 h-14 rounded-2xl object-contain"
              />
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
                  Keep your wishlist synchronized.
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md leading-relaxed">
                  Connect your account to save your wishlist, update your live savings balance, and collaborate on shared goals across every device.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="h-11 px-6 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                Sign in to continue
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
