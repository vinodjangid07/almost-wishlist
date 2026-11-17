"use client";

import React, { useState, useMemo, useCallback } from "react";
import { WishItem } from "@/types";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BentoDashboard } from "@/components/dashboard/BentoDashboard";
import { WishlistToolbar } from "@/components/wishlist/WishlistToolbar";
import { WishlistGrid } from "@/components/wishlist/WishGrid";
import { WishModal } from "@/components/wishlist/WishModal";
import { WishDetailModal } from "@/components/wishlist/WishDetailModal";
import { EditSavingsModal } from "@/components/savings/EditSavingsModal";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { AuthModal } from "@/components/modals/AuthModal";
import { JoinWishModal } from "@/components/modals/JoinWishModal";
import { useSavings } from "@/contexts/SavingsContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Plus, PencilSimple, MagnifyingGlass, Sun, Moon, User, List, UsersThree } from "@phosphor-icons/react";

export default function WishlistApp() {
  const [activeTab, setActiveTab] = useState<"wishlist" | "analytics">("wishlist");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentSavings, totalWishlistCost, gap, affordabilityPercent, currency } = useSavings();
  const { wishes, searchQuery, setSearchQuery } = useWishlist();
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [headerAvatarError, setHeaderAvatarError] = useState(false);

  const userInitial = useMemo(() => {
    return user?.displayName
      ? user.displayName.charAt(0).toUpperCase()
      : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "V";
  }, [user]);

  // Modals state
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [wishToEdit, setWishToEdit] = useState<WishItem | null>(null);

  const [detailWishId, setDetailWishId] = useState<string | null>(null);
  const wishForDetail = useMemo(
    () => (detailWishId ? wishes.find((w) => w.id === detailWishId) || null : null),
    [wishes, detailWishId]
  );
  const isDetailModalOpen = Boolean(detailWishId);

  const [isEditSavingsOpen, setIsEditSavingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isJoinWishOpen, setIsJoinWishOpen] = useState(false);

  const handleOpenAddWish = useCallback(() => {
    setWishToEdit(null);
    setIsWishModalOpen(true);
  }, []);

  const handleEditWish = useCallback((wish: WishItem) => {
    setWishToEdit(wish);
    setIsWishModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((wish: WishItem) => {
    setDetailWishId(wish.id);
  }, []);

  const handleOpenEditSavings = useCallback(() => {
    setIsEditSavingsOpen(true);
  }, []);

  const handleCloseMobile = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailWishId(null);
  }, []);

  const handleEditFromDetail = useCallback((w: WishItem) => {
    setDetailWishId(null);
    handleEditWish(w);
  }, [handleEditWish]);

  return (
    <div className="w-full h-screen flex flex-row bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Responsive Sidebar (Desktop rail + Mobile slide-over drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={handleCloseMobile}
        onOpenAddWish={handleOpenAddWish}
        onOpenEditSavings={handleOpenEditSavings}
        onOpenJoinWish={() => setIsJoinWishOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Column with Fixed Top Header and Scrollable Canvas */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Global Top Command Header - Sits directly flush to edges, never scrolls, zero gap */}
        <header className="w-full h-16 px-3 sm:px-6 lg:px-7 bg-[var(--surface)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-2.5 sm:gap-3 select-none shrink-0 z-30">
          {/* Left: Mobile Menu Toggle + Search Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer shrink-0"
              title="Open menu"
            >
              <List size={18} weight="bold" />
            </button>

            {/* Quick Search on Left */}
            <div className="relative flex-1">
              <MagnifyingGlass
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--placeholder)] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search wishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface)] focus:border-[var(--muted)] rounded-xl pl-9 pr-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Right: Controls (Theme, Avatar, Join Wish, Add Wish) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle (Desktop only - mobile accessible inside drawer) */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] transition shrink-0 cursor-pointer"
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            >
              {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* User Profile Pill (Desktop only - mobile accessible inside drawer) */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex h-10 items-center gap-2 px-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] transition shrink-0 cursor-pointer"
              title="Account / Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--surface-raised)] text-[var(--foreground)] flex items-center justify-center text-[10px] font-semibold shrink-0 overflow-hidden">
                {user?.photoURL && !headerAvatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setHeaderAvatarError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : user ? (
                  <span>{userInitial}</span>
                ) : (
                  <User size={12} weight="bold" />
                )}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-[var(--foreground)] max-w-[100px] truncate">
                {user ? user.displayName || user.email?.split("@")[0] : "Sign In"}
              </span>
            </button>

            {/* Join Shared Wish CTA (Desktop only - mobile accessible inside drawer) */}
            <button
              onClick={() => setIsJoinWishOpen(true)}
              className="hidden md:flex h-10 px-3.5 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--foreground)] items-center gap-1.5 transition cursor-pointer shrink-0"
              title="Join a shared wish with invite code"
            >
              <UsersThree size={15} />
              <span>Join Wish</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={handleOpenAddWish}
              className="h-10 inline-flex items-center gap-1.5 px-3 sm:px-4 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] shrink-0 cursor-pointer"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden sm:inline">Add Wish</span>
              <span className="sm:hidden">Wish</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-5">
          {/* Bento Dashboard */}
          <BentoDashboard
            onOpenEditSavings={handleOpenEditSavings}
            onOpenAddWish={handleOpenAddWish}
          />

          {/* Dynamic Tab Views */}
          {activeTab === "wishlist" && (
            <section className="space-y-4">
              <WishlistToolbar />
              <WishlistGrid
                onEdit={handleEditWish}
                onViewDetail={handleViewDetail}
                onOpenAddWish={handleOpenAddWish}
              />
            </section>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <section className="space-y-4">
              <AnalyticsDashboard />
            </section>
          )}
        </main>
      </div>

      {/* Modals */}
      <WishModal
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
        wishToEdit={wishToEdit}
      />

      <WishDetailModal
        wish={wishForDetail}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={handleEditFromDetail}
      />

      <JoinWishModal
        isOpen={isJoinWishOpen}
        onClose={() => setIsJoinWishOpen(false)}
        onJoinedSuccess={(wishId) => {
          const found = wishes.find((w) => w.id === wishId);
          if (found) handleViewDetail(found);
        }}
      />

      <EditSavingsModal
        isOpen={isEditSavingsOpen}
        onClose={() => setIsEditSavingsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
