"use client";

import React from "react";
import Link from "next/link";
import { useSavings } from "@/contexts/SavingsContext";
import {
  SquaresFour,
  ChartPieSlice,
  SidebarSimple,
  Plus,
  X,
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  onCloseMobile,
  onOpenAddWish,
  onOpenEditSavings,
}) => {
  const { currentSavings, currency } = useSavings();

  const handleSelectTab = (tab: "wishlist" | "analytics") => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleAddWish = () => {
    onOpenAddWish();
    if (onCloseMobile) onCloseMobile();
  };

  const handleEditSavings = () => {
    onOpenEditSavings();
    if (onCloseMobile) onCloseMobile();
  };

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
        className={`hidden md:flex h-screen sticky top-0 bg-[var(--surface)] flex-col justify-between transition-all duration-200 z-30 select-none shrink-0 ${
          isCollapsed ? "w-16 px-2.5 py-4" : "w-56 p-4"
        }`}
      >
        {/* Top Section */}
        <div className="space-y-5">
          {/* Brand & Collapse */}
          <div className="flex items-center justify-between px-1">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <span className="text-xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition">
                  almost
                </span>
                <span className="text-[11px] text-[var(--muted)] font-medium">
                  wishlist
                </span>
              </Link>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={`p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer ${
                isCollapsed ? "mx-auto" : "ml-auto"
              }`}
            >
              <SidebarSimple size={18} weight="regular" />
            </button>
          </div>

          {/* Primary Add Wish Button (Left-aligned to match tabs) */}
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

        {/* Bottom Section: Total Savings Status Only */}
        <div className="pt-3">
          {!isCollapsed && (
            <div
              onClick={handleEditSavings}
              className="p-3 rounded-xl bg-[var(--surface-raised)] cursor-pointer hover:bg-[var(--surface-hover)] transition group"
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
          <div className="relative w-72 max-w-[80vw] bg-[var(--surface)] h-full p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Header with Brand and Close */}
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 cursor-pointer" onClick={onCloseMobile}>
                  <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                    almost
                  </span>
                  <span className="text-[11px] text-[var(--muted)] font-medium">
                    wishlist
                  </span>
                </Link>

                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
                  title="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Add Wish CTA */}
              <button
                onClick={handleAddWish}
                className="w-full h-10 flex items-center gap-2.5 rounded-xl font-semibold text-xs px-3 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition cursor-pointer"
              >
                <Plus size={16} weight="bold" />
                <span>Add Wish</span>
              </button>

              {/* Navigation Links */}
              <NavLinks collapsed={false} />
            </div>

            {/* Mobile Bottom Savings */}
            <div
              onClick={handleEditSavings}
              className="p-3.5 rounded-xl bg-[var(--surface-raised)] cursor-pointer hover:bg-[var(--surface-hover)] transition"
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
      )}
    </>
  );
};
