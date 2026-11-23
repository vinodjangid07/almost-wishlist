"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { AuthModal } from "@/components/modals/AuthModal";

export const Navbar: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const wordmarkLogo =
    resolvedTheme === "dark"
      ? "/light-wordmark-logo.webp"
      : "/dark-wordmark-logo.webp";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-200 transform-gpu">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer select-none"
            title="almost • quiet wishlist manager"
          >
            <Image
              src={wordmarkLogo}
              alt="almost"
              width={120}
              height={28}
              priority
              className="h-6 sm:h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
            />
          </Link>

          {/* Right: Identical to Dashboard Controls (Theme Toggle & Profile Dropdown) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <ProfileDropdown onOpenAuthModal={() => setIsAuthModalOpen(true)} />
          </div>
        </div>
      </header>

      {/* Auth Modal Triggered from Profile Dropdown */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
