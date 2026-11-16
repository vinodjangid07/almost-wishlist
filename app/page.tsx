"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  CurrencyInr,
  SlidersHorizontal,
  LockKey,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";

export default function LandingPage() {
  // Interactive live simulator state
  const [simulatedSavings, setSimulatedSavings] = useState(350000);
  const totalTarget = 1003390;
  const gap = Math.max(0, totalTarget - simulatedSavings);
  const coveredPercent = Math.min(100, Math.round((simulatedSavings / totalTarget) * 100));

  const items = [
    { name: "Sony WH-1000XM5", price: 26990, tag: "Want", cat: "Tech" },
    { name: "Keychron Q1 Pro", price: 18500, tag: "Want", cat: "Tech" },
    { name: "Herman Miller Aeron", price: 115000, tag: "Need", cat: "Living" },
    { name: "MacBook Pro 14\"", price: 169900, tag: "Need", cat: "Work" },
    { name: "Rimowa Classic Cabin", price: 128000, tag: "Luxury", cat: "Travel" },
    { name: "Leica Q3 Camera", price: 545000, tag: "Luxury", cat: "Optics" },
  ];

  const affordableCount = items.filter((item) => simulatedSavings >= item.price).length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] font-sans antialiased overflow-x-hidden">
      <SmoothScroll />

      {/* Atmospheric Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/85 backdrop-blur-md select-none transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2.5 group cursor-pointer">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition">
              almost
            </span>
            <span className="text-[11px] text-[var(--muted)] font-medium tracking-wide hidden sm:inline">
              almost yours
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] text-[11px] text-[var(--muted)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span>v2.0 • Active Ledger</span>
            </div>

            <Link
              href="/app"
              className="h-9 inline-flex items-center gap-2 px-4 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer"
            >
              <span>Open Wishlist</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Architectural Hero */}
      <main className="pt-32 sm:pt-40 pb-24 px-6 sm:px-10 max-w-7xl mx-auto space-y-28 sm:space-y-36">
        {/* Hero Section */}
        <section className="space-y-10 sm:space-y-12">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-xs font-medium text-[var(--muted)]">
              <span className="text-[var(--primary)] font-semibold">The Intentional Ledger</span>
              <span>—</span>
              <span>Delay impulse. Own with clarity.</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[var(--foreground)] leading-[0.96] text-balance">
              Save what you desire.
              <br />
              <span className="text-[var(--muted)]">Own when you afford.</span>
            </h1>

            <p className="text-base sm:text-xl text-[var(--muted)] max-w-2xl leading-relaxed text-balance">
              A quiet luxury wishlist manager that transforms impulsive shopping into intentional ownership.
              Classify your wishes into Need, Want, and Luxury, track your true savings gap, and purchase with zero guilt.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/app"
                className="h-11 inline-flex items-center gap-2 px-6 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer"
              >
                <span>Launch Your Ledger</span>
                <ArrowRight size={15} weight="bold" />
              </Link>
              <Link
                href="/app?seed=true"
                className="h-11 inline-flex items-center gap-2 px-5 rounded-xl text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
              >
                <span>Explore Live Demo</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Interactive Live Formula Calculator (Signature Moment) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] space-y-6 select-none">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2">
              <div>
                <span className="text-xs font-medium text-[var(--primary)] block mb-0.5">
                  The &ldquo;Almost&rdquo; Formula
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Live Gap Simulation
                </h3>
              </div>
              <p className="text-xs text-[var(--muted)] max-w-xs">
                Drag the slider to test how real savings close the distance to your curated wishlist.
              </p>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[var(--background)]">
                <span className="text-[11px] text-[var(--muted)] font-medium block">
                  Simulated Savings
                </span>
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)] block mt-1">
                  ₹{simulatedSavings.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--background)]">
                <span className="text-[11px] text-[var(--muted)] font-medium block">
                  Wishlist Total (6 items)
                </span>
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)] block mt-1">
                  ₹{totalTarget.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--background)]">
                <span className="text-[11px] text-[var(--muted)] font-medium block">
                  Remaining Gap
                </span>
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)] block mt-1">
                  ₹{gap.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--background)]">
                <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-medium">
                  <span>Covered</span>
                  <span className="font-semibold text-[var(--accent-green)]">{coveredPercent}%</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--foreground)] block mt-1">
                  {affordableCount} <span className="text-xs font-normal text-[var(--muted)]">affordable now</span>
                </span>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal size={14} />
                  <span>Adjust Savings Amount:</span>
                </span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">
                  ₹{simulatedSavings.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={totalTarget}
                step="5000"
                value={simulatedSavings}
                onChange={(e) => setSimulatedSavings(Number(e.target.value))}
                className="w-full h-2 bg-[var(--surface-hover)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted)] pt-0.5">
                <span>₹0 (Starting point)</span>
                <span>₹5,00,000 (Midway milestone)</span>
                <span>₹10,03,390 (100% Unlocked)</span>
              </div>
            </div>

            {/* Item Availability Chips */}
            <div className="pt-3">
              <span className="text-xs font-medium text-[var(--muted)] block mb-2.5">
                Real-Time Item Affordability Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {items.map((item, idx) => {
                  const unlocked = simulatedSavings >= item.price;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl transition duration-200 text-xs ${
                        unlocked
                          ? "bg-[var(--accent-green-bg)] text-[var(--accent-green)]"
                          : "bg-[var(--background)] text-[var(--muted)] opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          {item.tag}
                        </span>
                        {unlocked && <CheckCircle size={12} weight="fill" />}
                      </div>
                      <p className="font-semibold truncate text-[var(--foreground)]">
                        {item.name}
                      </p>
                      <span className="text-[11px] tabular-nums font-medium block mt-0.5">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Manifesto / Philosophy */}
        <section className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider block">
              The Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Patience is luxury.
              <br />
              The objects worth having are worth waiting for.
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              Consumer commerce is engineered for instant gratification — impulsive cart checkouts that lead to remorse.
              Almost restores dignity to your spending through structural clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-7 rounded-3xl bg-[var(--surface)] space-y-3">
              <span className="text-xs font-semibold text-[var(--primary)] block">
                01 • The Three Tiers
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Need, Want, and Luxury
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Categorize purchases with brutal honesty. Is it a tool for your craft (Need), a comfort you desire (Want), or a high-ticket dream piece (Luxury)? Never confuse them again.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[var(--surface)] space-y-3">
              <span className="text-xs font-semibold text-[var(--primary)] block">
                02 • The Truth of the Gap
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                One uncompromising metric
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Enter your total liquid savings with one click. The dashboard immediately calculates the gap between your present reality and your desires. No guessing.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[var(--surface)] space-y-3">
              <span className="text-xs font-semibold text-[var(--primary)] block">
                03 • Multi-Store Sourcing
              </span>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Arbitrage across retailers
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Save links from Amazon, Apple, Leica, or niche stores on each item. Compare prices, track min/max variations, and execute the purchase at the best price.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Curated Showcase (Visual Poster Grid) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider block">
                The Objects
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-1">
                Curated Desire Showcase
              </h2>
            </div>
            <p className="text-xs text-[var(--muted)] max-w-sm">
              Explore how real high-value items live inside the Almost ledger with rich metadata and price sourcing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="group rounded-3xl bg-[var(--surface)] overflow-hidden transition-all duration-300">
              <div className="h-60 w-full overflow-hidden bg-[var(--background)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                  alt="Leica Q3 Camera"
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
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
            <div className="group rounded-3xl bg-[var(--surface)] overflow-hidden transition-all duration-300">
              <div className="h-60 w-full overflow-hidden bg-[var(--background)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
                  alt="MacBook Pro"
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
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
            <div className="group rounded-3xl bg-[var(--surface)] overflow-hidden transition-all duration-300">
              <div className="h-60 w-full overflow-hidden bg-[var(--background)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80"
                  alt="Rimowa Cabin"
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
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

        {/* Section 4: Privacy & Simplicity Statement */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider block">
                Frictionless &amp; Private
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">
                No forced signups.
                <br />
                Works instantly offline and on mobile.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Start adding wishes in three seconds as a guest. When you are ready, sign in with Google or Email to sync across your phone, tablet, and desktop in real time with Firebase.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--background)] space-y-1">
                <ShieldCheck size={20} className="text-[var(--accent-green)]" />
                <p className="font-semibold text-[var(--foreground)] pt-1">Zero Tracking</p>
                <span className="text-[11px] text-[var(--muted)] leading-normal block">
                  Your wishes and finances are strictly private to your account.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--background)] space-y-1">
                <LockKey size={20} className="text-[var(--primary)]" />
                <p className="font-semibold text-[var(--foreground)] pt-1">Cloud Sync</p>
                <span className="text-[11px] text-[var(--muted)] leading-normal block">
                  Powered by Google Firebase and Vercel Blob private storage.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Architectural Call To Action */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-4xl sm:text-6xl font-bold text-[var(--foreground)] tracking-tight text-balance">
            Close the gap between
            <br />
            wanting and owning.
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Begin curating your wishlist today. Free, fast, and crafted with quiet luxury.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/app"
              className="h-11 inline-flex items-center gap-2 px-7 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition active:scale-[0.98] cursor-pointer"
            >
              <span>Open Your Wishlist</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </section>
      </main>

      {/* Architectural Colophon Footer */}
      <footer className="border-t border-[var(--surface-hover)] py-12 px-6 sm:px-10 text-xs text-[var(--muted)] select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--foreground)] tracking-tight">almost</span>
              <span>•</span>
              <span className="font-medium">almost yours</span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              The intentional wishlist manager for quiet luxury and patient ownership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/app" className="hover:text-[var(--foreground)] transition cursor-pointer">
              Dashboard
            </Link>
            <Link href="/app?tab=analytics" className="hover:text-[var(--foreground)] transition cursor-pointer">
              Analytics
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
