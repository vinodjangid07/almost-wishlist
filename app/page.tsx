"use client";

import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ConvergenceHorizon } from "@/components/landing/ConvergenceHorizon";
import { WishlistChapters } from "@/components/landing/WishlistChapters";
import { ManifestoSection } from "@/components/landing/ManifestoSection";
import { FooterFinale } from "@/components/landing/FooterFinale";
import { initLandingMotion } from "@/lib/motion/engine";

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanup = initLandingMotion(root);
    return () => cleanup();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] font-sans antialiased overflow-x-clip"
    >
      {/* Dynamic Elevated Navigation Bar */}
      <Navbar />

      {/* Main Editorial Flow */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {/* 1. Full-Bleed WebGL + Monumental Typography Hero */}
        <HeroSection />

        {/* Constrained Editorial Chapters */}
        <div className="px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-16 sm:space-y-28 pt-12 sm:pt-20 pb-16 sm:pb-24">
          {/* 2. Signature Moment: Scroll-Scrubbed Convergence */}
          <ConvergenceHorizon />

          {/* 3. Sticky Editorial Wishlist Chapters */}
          <WishlistChapters />

          {/* 4. Scroll-Illuminated Manifesto */}
          <ManifestoSection />
        </div>
      </main>

      {/* 5. Finale CTA & Footer */}
      <FooterFinale />
    </div>
  );
}
