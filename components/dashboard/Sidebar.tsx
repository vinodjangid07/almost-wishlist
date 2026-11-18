"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSavings } from "@/contexts/SavingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
    if (onOpenJoinWish) onOpenJoinWish();
    if (onCloseMobile) onCloseMobile();
  }, [onOpenJoinWish, onCloseMobile]);

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
        className={`hidden md:flex h-screen sticky top-0 bg-[var(--surface)] border-r border-[var(--border-subtle)] flex-col justify-between transition-all duration-200 z-30 select-none shrink-0 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Brand & Collapse Header - Exact h-16 + border-b to align with dashboard command header */}
          <div
            className={`h-16 border-b border-[var(--border-subtle)] flex items-center shrink-0 ${
              isCollapsed ? "justify-center px-2" : "justify-between px-4"
            }`}
          >
            {!isCollapsed ? (
              <>
                {/* Fully open sidebar: app icon redirects to home */}
                <Link
                  href="/"
                  title="Return to Home"
                  className="p-1 rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer flex items-center justify-center"
                >
                  <Image
                    src={appIconSrc}
                    alt="almost"
                    width={28}
                    height={28}
                    priority
                    className="w-7 h-7 rounded-lg object-contain"
                  />
                </Link>

                {/* Collapsible toggle button */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  title="Collapse sidebar"
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                >
                  <SidebarSimple size={18} weight="regular" />
                </button>
              </>
            ) : (
              /* Collapsed sidebar: shows app icon, on hover reveals collapse/expand icon */
              <button
                onClick={() => setIsCollapsed(false)}
                title="Expand sidebar"
                className="relative group w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
              >
                {/* Default: App icon (fades out on hover) */}
                <div className="flex items-center justify-center transition-opacity duration-150 group-hover:opacity-0">
                  <Image
                    src={appIconSrc}
                    alt="almost"
                    width={28}
                    height={28}
                    priority
                    className="w-7 h-7 rounded-lg object-contain"
                  />
                </div>

                {/* Hover state: Reveal sidebar expand icon */}
                <div className="absolute inset-0 flex items-center justify-center text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <SidebarSimple size={18} weight="regular" />
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

        {/* Bottom Section: Total Savings Status Only */}
        <div className={isCollapsed ? "p-2" : "p-4"}>
          {!isCollapsed && (
            <div
              onClick={handleEditSavings}
              className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--surface-hover)] transition group"
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

      {/* Mobile Drawer (Visible only on < md when opened) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex select-none">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-[var(--surface)] border-r border-[var(--border-subtle)] h-full flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Header with Brand and Close - Exact h-16 with border-b */}
              <div className="h-16 px-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <Link
                  href="/"
                  title="Return to Home"
                  className="p-1 rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer flex items-center justify-center"
                  onClick={onCloseMobile}
                >
                  <Image
                    src={appIconSrc}
                    alt="almost"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-lg object-contain"
                  />
                </Link>

                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                  title="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Mobile User Profile Pill */}
                <button
                  onClick={handleAuth}
                  className="w-full h-11 flex items-center justify-between px-3.5 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[var(--surface-raised)] text-[var(--foreground)] flex items-center justify-center text-xs font-semibold overflow-hidden">
                      {user?.photoURL && !avatarError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.photoURL}
                          alt=""
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : user ? (
                        <span>{userInitial}</span>
                      ) : (
                        <User size={14} weight="bold" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-[var(--foreground)] truncate max-w-[130px]">
                      {user ? user.displayName || user.email?.split("@")[0] : "Sign In / Account"}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--primary)] font-medium">
                    {user ? "Manage" : "Sign In"}
                  </span>
                </button>

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
                  className="w-full h-10 flex items-center gap-2.5 rounded-xl font-semibold text-xs px-3 bg-[var(--background)] border border-[var(--border-subtle)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
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
                    className="w-full h-10 flex items-center justify-between px-3 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{resolvedTheme === "dark" ? "Light theme" : "Dark theme"}</span>
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[var(--muted)]">
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
                className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--surface-hover)] transition"
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
      )}
    </>
  );
});

Sidebar.displayName = "Sidebar";
