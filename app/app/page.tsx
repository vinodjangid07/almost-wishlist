"use client";

import React, { useState } from "react";
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
import { useSavings } from "@/contexts/SavingsContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SHOWCASE_PRODUCTS } from "@/lib/seedData";
import { Plus, PencilSimple, MagnifyingGlass, Sun, Moon, User, List } from "@phosphor-icons/react";

export default function WishlistApp() {
  const [activeTab, setActiveTab] = useState<"wishlist" | "analytics">("wishlist");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentSavings, totalWishlistCost, gap, affordabilityPercent, currency } = useSavings();
  const { wishes, searchQuery, setSearchQuery } = useWishlist();
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [headerAvatarError, setHeaderAvatarError] = useState(false);

  const activeCount = wishes.filter((w) => !w.isPurchased).length;

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "V";

  // Modals state
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [wishToEdit, setWishToEdit] = useState<WishItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [wishForDetail, setWishForDetail] = useState<WishItem | null>(null);

  const [isEditSavingsOpen, setIsEditSavingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { addWish } = useWishlist();
  const { updateSavings } = useSavings();

  const handleSeedShowcase = async () => {
    try {
      for (const prod of SHOWCASE_PRODUCTS) {
        await addWish({
          title: prod.title,
          description: prod.description,
          category: prod.category,
          tag: prod.tag,
          priority: prod.priority,
          estimatedPrice: prod.estimatedPrice,
          minPrice: prod.minPrice,
          maxPrice: prod.maxPrice,
          currency: "₹",
          imageUrl: prod.imageUrl,
          links: prod.links,
          isPurchased: false,
        });
      }
      await updateSavings(350000);
    } catch (err) {
      console.error("Failed to seed showcase products:", err);
    }
  };

  React.useEffect(() => {
    // Expose in browser console for fast manual seeding
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__seedShowcaseWishes = handleSeedShowcase;

      const params = new URLSearchParams(window.location.search);
      if (params.get("seed") === "true") {
        handleSeedShowcase();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user]);

  const handleOpenAddWish = () => {
    setWishToEdit(null);
    setIsWishModalOpen(true);
  };

  const handleEditWish = (wish: WishItem) => {
    setWishToEdit(wish);
    setIsWishModalOpen(true);
  };

  const handleViewDetail = (wish: WishItem) => {
    setWishForDetail(wish);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-row bg-[var(--background)] text-[var(--foreground)]">
      {/* Responsive Sidebar (Desktop rail + Mobile slide-over drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAddWish={handleOpenAddWish}
        onOpenEditSavings={() => setIsEditSavingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-7 space-y-5 overflow-y-auto">
        {/* Global Top Command Header */}
        <header className="flex items-center justify-between gap-3 select-none">
          {/* Left: Mobile Menu Toggle + Left-Shifted Search Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-sm sm:max-w-md">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer shrink-0"
              title="Open menu"
            >
              <List size={18} weight="bold" />
            </button>

            {/* Quick Search on Left */}
            <div className="relative flex-1">
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--placeholder)] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search wishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[var(--surface)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface)] rounded-xl pl-8 pr-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
              />
            </div>
          </div>

          {/* Right: Controls (Theme, Avatar, Add Wish) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] transition shrink-0 cursor-pointer"
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            >
              {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="h-9 flex items-center gap-2 px-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition shrink-0 cursor-pointer"
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

            {/* Primary Action Button */}
            <button
              onClick={handleOpenAddWish}
              className="h-9 inline-flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] shrink-0 cursor-pointer"
            >
              <Plus size={15} weight="bold" />
              <span>Add Wish</span>
            </button>
          </div>
        </header>

        {/* Bento Dashboard */}
        <BentoDashboard
          onOpenEditSavings={() => setIsEditSavingsOpen(true)}
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

      {/* Modals */}
      <WishModal
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
        wishToEdit={wishToEdit}
      />

      <WishDetailModal
        wish={wishForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setWishForDetail(null);
        }}
        onEdit={(w) => {
          setIsDetailModalOpen(false);
          handleEditWish(w);
        }}
      />

      <EditSavingsModal
        isOpen={isEditSavingsOpen}
        onClose={() => setIsEditSavingsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSeedShowcase={handleSeedShowcase}
      />
    </div>
  );
}
