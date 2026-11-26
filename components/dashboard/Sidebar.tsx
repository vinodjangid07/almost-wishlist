"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSavings } from "@/contexts/SavingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import {
  SquaresFour,
  ChartPieSlice,
  SidebarSimple,
  Plus,
  X,
  UsersThree,
  Sun,
  Moon,
  User,
} from "@phosphor-icons/react";

interface SidebarProps {
  activeTab: "wishlist" | "analytics";
  setActiveTab: (tab: "wishlist" | "analytics") => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenAddWish: () => void;
  onOpenEditSavings: () => void;
  onOpenJoinWish?: () => void;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  onCloseMobile,
  onOpenAddWish,
  onOpenEditSavings,
  onOpenJoinWish,
  onOpenAuthModal,
}) => {
  const { currentSavings, currency } = useSavings();
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [avatarError, setAvatarError] = useState(false);

  const appIconSrc =
    resolvedTheme === "dark" ? "/dark-app-icon.webp" : "/light-app-icon.webp";

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const handleSelectTab = useCallback((tab: "wishlist" | "analytics") => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  }, [setActiveTab, onCloseMobile]);

  const handleAddWish = useCallback(() => {
    onOpenAddWish();
    if (onCloseMobile) onCloseMobile();
  }, [onOpenAddWish, onCloseMobile]);

  const handleEditSavings = useCallback(() => {
    onOpenEditSavings();
    if (onCloseMobile) onCloseMobile();
  }, [onOpenEditSavings, onCloseMobile]);

  const handleJoinWish = useCallback(() => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      if (onCloseMobile) onCloseMobile();
      return;
    }
    if (onOpenJoinWish) onOpenJoinWish();
    if (onCloseMobile) onCloseMobile();
  }, [user, onOpenAuthModal, onOpenJoinWish, onCloseMobile]);

  const handleAuth = useCallback(() => {
    if (onOpenAuthModal) onOpenAuthModal();
    if (onCloseMobile) onCloseMobile();
  }, [onOpenAuthModal, onCloseMobile]);

  // Nav list component to share between desktop and mobile drawer
  const NavLinks = ({ collapsed = false }: { collapsed?: boolean }) => (
    <nav className="space-y-1">
      <button
        onClick={() => handleSelectTab("wishlist")}
        className={`w-full h-10 flex items-center gap-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
          collapsed ? "justify-center p-0" : "px-3"
        } ${
          activeTab === "wishlist"
            ? "bg-[var(--background)] text-[var(--foreground)] font-semibold"
            : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
        }`}
        title="Wishlist"
      >
        <SquaresFour size={18} weight={activeTab === "wishlist" ? "fill" : "regular"} />
        {!collapsed && <span>Wishlist</span>}
      </button>

      <button
        onClick={() => handleSelectTab("analytics")}
        className={`w-full h-10 flex items-center gap-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
          collapsed ? "justify-center p-0" : "px-3"
        } ${
          activeTab === "analytics"
            ? "bg-[var(--background)] text-[var(--foreground)] font-semibold"
            : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
        }`}
        title="Analytics"
      >
        <ChartPieSlice size={18} weight={activeTab === "analytics" ? "fill" : "regular"} />
        {!collapsed && <span>Analytics</span>}
      </button>
    </nav>
  );

  return (
    <>
      {/* Desktop Sticky Left Rail */}
      <aside
        className={`hidden md:flex h-screen sticky top-0 bg-[var(--surface)] border-r border-[var(--border-subtle)]/60 flex-col justify-between transition-all duration-200 z-30 select-none shrink-0 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Brand & Collapse Header - Clean tonal flow without horizontal divider */}
          <div
            className={`h-16 flex items-center shrink-0 ${
              isCollapsed ? "justify-center px-2" : "justify-between px-3.5"
            }`}
          >
            {!isCollapsed ? (
              <>
                {/* Fully open sidebar: app icon redirects to home */}
                <Link
                  href="/"
                  title="Return to Home"
                  className="w-10 h-10 flex items-center justify-center cursor-pointer select-none shrink-0"
                >
                  <Image
                    src={appIconSrc}
                    alt="almost"
                    width={40}
                    height={40}
                    priority
                    className="w-10 h-10 rounded-xl object-contain transition duration-150 hover:brightness-90 shrink-0"
                  />
                </Link>

                {/* Collapsible toggle button - Perfectly balanced with app icon */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  title="Collapse sidebar"
                  className="w-10 h-10 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer flex items-center justify-center"
                >
                  <SidebarSimple size={20} weight="regular" />
                </button>
              </>
            ) : (
              /* Collapsed sidebar: shows app icon, on hover reveals collapse/expand icon */
              <button
                onClick={() => setIsCollapsed(false)}
                title="Expand sidebar"
                className="relative group w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
              >
                {/* Default: App icon (fades out on hover) */}
                <div className="flex items-center justify-center transition-opacity duration-150 group-hover:opacity-0">
                  <Image
                    src={appIconSrc}
                    alt="almost"
                    width={40}
                    height={40}
                    priority
                    className="w-10 h-10 rounded-xl object-contain"
                  />
                </div>

                {/* Hover state: Reveal sidebar expand icon */}
                <div className="absolute inset-0 flex items-center justify-center text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <SidebarSimple size={20} weight="regular" />
                </div>
              </button>
            )}
          </div>

          {/* Navigation & Actions Area */}
          <div className={`space-y-4 ${isCollapsed ? "p-2.5" : "p-4"}`}>
            {/* Primary Add Wish Button */}
            <button
              onClick={handleAddWish}
              className={`w-full h-10 flex items-center gap-2.5 rounded-xl font-semibold text-xs bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer ${
                isCollapsed ? "justify-center p-0" : "px-3"
              }`}
              title="Add Wish"
            >
              <Plus size={16} weight="bold" />
              {!isCollapsed && <span>Add Wish</span>}
            </button>

            {/* Navigation Links */}
            <NavLinks collapsed={isCollapsed} />
          </div>
        </div>

        {/* Bottom Section: Total Savings Status (Profile is strictly in Header on PC) */}
        <div className={isCollapsed ? "p-2" : "p-4"}>
          {isCollapsed ? (
            <button
              onClick={handleEditSavings}
              className="w-10 h-10 mx-auto rounded-xl bg-[var(--background)] hover:bg-[var(--surface-hover)] transition flex items-center justify-center text-xs font-bold text-[var(--foreground)] cursor-pointer"
              title={`Total savings: ${currency}${currentSavings.toLocaleString("en-IN")}`}
            >
              {currency}
            </button>
          ) : (
            <div
              onClick={handleEditSavings}
              className="p-3 rounded-xl bg-[var(--background)] cursor-pointer hover:bg-[var(--surface-hover)] transition group"
              title="Click to edit savings"
            >
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Total savings</span>
                <span className="text-[11px] text-[var(--primary)] font-medium opacity-80 group-hover:opacity-100 transition">
                  Edit
                </span>
              </div>
              <span
                suppressHydrationWarning
                className="text-base font-bold tabular-nums text-[var(--foreground)] block mt-1"
              >
                {currency}{currentSavings.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer (Visible on < md, smoothly animated open/close) */}
      <div
        aria-hidden={!isMobileOpen}
        className={`fixed inset-0 z-50 md:hidden flex select-none transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={onCloseMobile}
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Slide-over Drawer Panel */}
        <div
          className={`relative w-72 max-w-[80vw] bg-[var(--surface)] border-r border-[var(--border-subtle)] h-full flex flex-col justify-between z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
            <div>
              {/* Header with Brand and Close - Clean tonal flow without horizontal divider */}
              <div className="h-16 px-4 flex items-center justify-between">
                <Link
                  href="/"
                  title="Return to Home"
                  className="w-10 h-10 flex items-center justify-center cursor-pointer select-none"
                  onClick={onCloseMobile}
                >
                  <Image
                    src={appIconSrc}
                    alt="almost"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-xl object-contain transition duration-150 hover:brightness-90"
                  />
                </Link>

                <button
                  onClick={onCloseMobile}
                  className="w-10 h-10 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer flex items-center justify-center"
                  title="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Mobile User Profile Button (Direct link to /profile, no dropdown) */}
                <ProfileDropdown
                  className="w-full justify-start h-11 bg-[var(--background)]"
                  showDropdown={false}
                  onOpenAuthModal={onOpenAuthModal}
                  onAction={onCloseMobile}
                />

                {/* Mobile Add Wish CTA */}
                <button
                  onClick={handleAddWish}
                  className="w-full h-10 flex items-center gap-2.5 rounded-xl font-semibold text-xs px-3 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition cursor-pointer"
                >
                  <Plus size={16} weight="bold" />
                  <span>Add Wish</span>
                </button>

                {/* Mobile Join Shared Wish */}
                <button
                  onClick={handleJoinWish}
                  className="w-full h-10 flex items-center gap-2.5 rounded-xl font-semibold text-xs px-3 bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                >
                  <UsersThree size={16} />
                  <span>Join Shared Wish</span>
                </button>

                {/* Navigation Links */}
                <NavLinks collapsed={false} />

                {/* Theme Toggle inside Drawer */}
                <div className="pt-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full h-10 flex items-center justify-between px-3 rounded-xl bg-[var(--background)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{resolvedTheme === "dark" ? "Light theme" : "Dark theme"}</span>
                    </span>
                    <span className="text-[11px] font-medium text-[var(--muted)]">
                      {resolvedTheme === "dark" ? "Switch" : "Switch"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Savings */}
            <div className="p-5">
              <div
                onClick={handleEditSavings}
                className="p-3.5 rounded-xl bg-[var(--background)] cursor-pointer hover:bg-[var(--surface-hover)] transition"
              >
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Total savings</span>
                  <span className="text-[11px] text-[var(--primary)] font-medium">Edit</span>
                </div>
                <span
                  suppressHydrationWarning
                  className="text-base font-bold tabular-nums text-[var(--foreground)] block mt-1"
                >
                  {currency}{currentSavings.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";
