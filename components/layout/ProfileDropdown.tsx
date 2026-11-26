"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/modals/AuthModal";
import { User, SignOut, CaretDown, ArrowRight, Gear } from "@phosphor-icons/react";

interface ProfileDropdownProps {
  onOpenAuthModal?: () => void;
  className?: string;
  align?: "left" | "right";
  direction?: "up" | "down";
  onAction?: () => void;
  collapsed?: boolean;
  showDropdown?: boolean;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onOpenAuthModal,
  className = "",
  align = "right",
  direction = "down",
  onAction,
  collapsed = false,
  showDropdown = true,
}) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const handleTriggerClick = () => {
    if (!user) {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      } else {
        setInternalAuthOpen(true);
      }
      if (onAction) onAction();
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsOpen(false);
      if (onAction) onAction();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onAction) onAction();
  };

  const positionClasses = `${align === "left" ? "left-0" : "right-0"} ${
    direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
  }`;

  return (
    <div className="relative" ref={containerRef}>
      {/* If showDropdown is false and user is logged in, link directly to /profile without dropdown or chevron */}
      {!showDropdown && user ? (
        <Link
          href="/profile"
          onClick={() => {
            if (onAction) onAction();
          }}
          className={`h-10 flex items-center gap-2 px-3 rounded-xl bg-[var(--background)] hover:bg-[var(--surface-hover)] transition shrink-0 cursor-pointer select-none active:scale-95 ${className}`}
          title="Account / Profile"
          aria-label="Account profile"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-[var(--surface-raised)] text-[var(--foreground)] flex items-center justify-center text-[10px] font-semibold shrink-0 overflow-hidden">
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

            {!collapsed && (
              <span className="text-xs font-medium text-[var(--foreground)] truncate">
                {user.displayName || user.email?.split("@")[0]}
              </span>
            )}
          </div>
        </Link>
      ) : (
        /* Standard Profile Button with dropdown trigger */
        <button
          onClick={handleTriggerClick}
          className={`h-10 flex items-center gap-2 px-3 rounded-xl ${
            className.includes("bg-") ? "" : "bg-[var(--surface)]"
          } hover:bg-[var(--surface-hover)] transition shrink-0 cursor-pointer select-none active:scale-95 ${className}`}
          title={user ? "Account / Profile" : "Sign In to Account"}
          aria-label={user ? "Account menu" : "Sign In"}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-[var(--surface-raised)] text-[var(--foreground)] flex items-center justify-center text-[10px] font-semibold shrink-0 overflow-hidden">
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
                <User size={12} weight="bold" />
              )}
            </div>

            {!collapsed && (
              <span className="text-xs font-medium text-[var(--foreground)] truncate">
                {user ? user.displayName || user.email?.split("@")[0] : "Sign In"}
              </span>
            )}
          </div>

          {showDropdown && user && !collapsed && (
            <CaretDown
              size={11}
              weight="bold"
              className={`text-[var(--muted)] transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      )}

      {/* Flat Quiet Luxury Dropdown Menu - matches dashboard surface & cardlet style */}
      {showDropdown && user && isOpen && (
        <div
          className={`absolute ${positionClasses} w-60 rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--border-subtle)] p-2 z-50 text-[var(--foreground)]`}
        >
          <div className="p-2.5 rounded-xl bg-[var(--background)] mb-1.5 space-y-0.5">
            <p className="text-xs font-semibold text-[var(--foreground)] truncate">
              {user.displayName || "Account"}
            </p>
            <p className="text-[11px] text-[var(--muted)] truncate">
              {user.email || "Active Session"}
            </p>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/app"
              onClick={handleItemClick}
              className="w-full h-9 flex items-center justify-between px-2.5 text-xs font-medium rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight size={12} className="text-[var(--muted)]" />
            </Link>

            <Link
              href="/profile"
              onClick={handleItemClick}
              className="w-full h-9 flex items-center justify-between px-2.5 text-xs font-medium rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
            >
              <span>Manage Account</span>
              <Gear size={13} className="text-[var(--muted)]" />
            </Link>
          </div>

          <div className="mt-1 pt-1">
            <button
              onClick={handleSignOut}
              className="w-full h-9 flex items-center gap-2 px-2.5 text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-xl transition cursor-pointer"
            >
              <SignOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Internal Auth Modal Fallback */}
      {!onOpenAuthModal && (
        <AuthModal
          isOpen={internalAuthOpen}
          onClose={() => setInternalAuthOpen(false)}
        />
      )}
    </div>
  );
};
