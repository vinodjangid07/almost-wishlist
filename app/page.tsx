"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowRight,
  ShieldCheck,
  LockKey,
  SquaresFour,
} from "@phosphor-icons/react";

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const wordmarkLogo =
    resolvedTheme === "dark"
      ? "/light-wordmark-logo.webp"
      : "/dark-wordmark-logo.webp";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] font-sans antialiased overflow-x-hidden">
      <SmoothScroll />

      {/* Dynamic Elevated Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 sm:pt-28 pb-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-24 sm:space-y-32">
        {/* Animated Luxury Hero Section */}
        <HeroSection />

        {/* Section 2: Principles */}
        <section id="principles" className="space-y-10 scroll-mt-24">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Patience is luxury.
              <br />
              The objects worth having are worth waiting for.
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              Instant checkouts often lead to buyer regret. Almost brings clarity to your spending through four quiet principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3">
              <span className="w-8 h-8 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                01
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Need, Want, and Luxury
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Categorize purchases with honesty. Separate essential work tools from everyday comforts and high-ticket splurges. Never blur them together.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3">
              <span className="w-8 h-8 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                02
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                The Savings Gap
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Enter your current savings with one tap. The dashboard immediately shows the exact difference between what you have and what you want.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3">
              <span className="w-8 h-8 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                03
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Collaborative Goals
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Pool savings with friends or family for shared trips, studio gear, or joint celebrations. Track collective progress with an invite code.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] space-y-3">
              <span className="w-8 h-8 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                04
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Multi-Store Sourcing
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Save links from Amazon, Apple, Leica, or independent stores on every wish. Compare prices and purchase at the right time.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Curated Objects Showcase */}
        <section id="curated-objects" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
                Curated objects
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1 max-w-sm">
                Organize high-value items with detailed notes, store comparisons, and priority levels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-300">
              <div className="h-60 w-full overflow-hidden bg-[var(--background)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                  alt="Leica Q3 Camera"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-102 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--primary)]">Luxury</span>
                  <span className="text-[var(--muted)]">Leica Official Store</span>
                </div>
                <h4 className="text-base font-semibold text-[var(--foreground)]">
                  Leica Q3 Full-Frame
                </h4>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                  Fixed 28mm Summilux f/1.7 ASPH lens. Built for street documentary and travel archives.
                </p>
                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">
                    ₹5,45,000
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)]">Saving in progress</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-300">
              <div className="h-60 w-full overflow-hidden bg-[var(--background)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                  alt="MacBook Pro"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-102 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--foreground)]">Need</span>
                  <span className="text-[var(--muted)]">Apple Store • Amazon</span>
                </div>
                <h4 className="text-base font-semibold text-[var(--foreground)]">
                  MacBook Pro 14&quot; M3
                </h4>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                  Primary engineering workstation with 18GB unified memory and Liquid Retina XDR.
                </p>
                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">
                    ₹1,69,900
                  </span>
                  <span className="text-xs font-semibold text-[var(--accent-green)]">Affordable now</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-300">
              <div className="h-60 w-full overflow-hidden bg-[var(--background)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80"
                  alt="Rimowa Cabin"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-102 transition duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--primary)]">Luxury</span>
                  <span className="text-[var(--muted)]">Rimowa Official</span>
                </div>
                <h4 className="text-base font-semibold text-[var(--foreground)]">
                  Rimowa Classic Cabin
                </h4>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                  Anodized aluminum alloy with TSA-approved locks and ball-bearing wheels.
                </p>
                <div className="pt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">
                    ₹1,28,000
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)]">Target milestone</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Privacy & Focus (Flat Minimal Architecture, Zero Russian-Doll Cards) */}
        <section id="privacy" className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-subtle)] space-y-8 scroll-mt-24">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">
              Private by default.
              <br />
              Designed for focus.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Curate your collection in a distraction-free space. Sync seamlessly across your devices with your own account when you are ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[var(--border-subtle)] text-xs">
            <div className="space-y-1.5 pt-2">
              <ShieldCheck size={22} className="text-[var(--accent-green)]" />
              <p className="font-semibold text-[var(--foreground)] text-sm pt-1">Zero Tracking</p>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                Your desires, notes, and finances are completely private to you. No behavioral tracking, no third-party ads.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <SquaresFour size={22} className="text-[var(--primary)]" />
              <p className="font-semibold text-[var(--foreground)] text-sm pt-1">Client First</p>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                Immediate responsive interaction with instant local caching. Fast, elegant, and whisper-quiet.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <LockKey size={22} className="text-[var(--foreground)]" />
              <p className="font-semibold text-[var(--foreground)] text-sm pt-1">Real-Time Cloud Sync</p>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                Connect your account in seconds to seamlessly sync across your desktop, tablet, and mobile in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Call To Action */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-4xl sm:text-6xl font-bold text-[var(--foreground)] tracking-tight text-balance">
            Close the gap between
            <br />
            wanting and owning.
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Begin curating your wishlist today. Private, quiet, and distraction-free.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/app"
              className="h-11 inline-flex items-center gap-2 px-7 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer"
            >
              <span>Open Wishlist</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-12 px-6 sm:px-10 text-xs text-[var(--muted)] select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Image
                src={wordmarkLogo}
                alt="almost"
                width={88}
                height={20}
                className="h-5 w-auto object-contain"
              />
              <span className="text-[var(--muted-light)]">•</span>
              <span className="font-medium text-xs text-[var(--muted)]">almost yours</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              The intentional wishlist manager for quiet luxury and patient ownership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/app" className="hover:text-[var(--foreground)] transition cursor-pointer">
              Dashboard
            </Link>
            <Link href="/privacy" className="hover:text-[var(--foreground)] transition cursor-pointer">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--foreground)] transition cursor-pointer">
              Terms
            </Link>
            <a
              href="https://github.com/vinodjangid07"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground)] transition cursor-pointer"
            >
              GitHub
            </a>
          </div>

          <div className="text-left md:text-right space-y-0.5">
            <p className="text-[11px]">
              Designed &amp; engineered by{" "}
              <a
                href="https://github.com/vinodjangid07"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--foreground)] underline hover:opacity-80 transition cursor-pointer"
              >
                Vinod Jangid
              </a>
            </p>
            <p className="text-[10px] text-[var(--muted)]">
              © 2026 almost. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
