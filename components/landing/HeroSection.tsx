"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { HeroField } from "@/components/landing/HeroField";

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[82svh] lg:min-h-[100svh] pt-16 overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Full-Bleed Viewport WebGL Gravitational Contour Field */}
      <HeroField hostRef={heroRef} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-6 sm:pt-10 lg:pt-12 pb-8 sm:pb-12 flex-1 flex flex-col justify-between">
        {/* Top Subtle Anchor */}
        <div
          data-reveal="fade"
          data-intro
          data-delay="0.1"
          className="text-xs font-medium text-[var(--muted)]"
        >
          almost yours
        </div>

        {/* Dedicated Portrait Breathing Stage for Mobile/Tablet WebGL Field */}
        <div className="h-44 sm:h-56 lg:hidden pointer-events-none" aria-hidden="true" />

        {/* Main Monumental Headline */}
        <div className="lg:my-auto py-4 sm:py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <h1
              data-split="lines"
              data-intro
              data-delay="0.05"
              className="text-[clamp(2.85rem,8.4vw,8.25rem)] font-bold tracking-[-0.03em] text-[var(--foreground)] leading-[0.98] text-balance"
            >
              The things worth
              <br />
              <span className="inline-flex items-center gap-3 sm:gap-5 align-middle">
                <Image
                  src="/light-app-icon.webp"
                  alt="almost"
                  width={108}
                  height={108}
                  priority
                  className="inline-block align-middle w-[0.78em] h-[0.78em] rounded-2xl border border-[var(--border-subtle)] object-contain shrink-0 -translate-y-[0.04em] dark:hidden"
                />
                <Image
                  src="/dark-app-icon.webp"
                  alt="almost"
                  width={108}
                  height={108}
                  priority
                  className="hidden dark:inline-block align-middle w-[0.78em] h-[0.78em] rounded-2xl border border-[var(--border-subtle)] object-contain shrink-0 -translate-y-[0.04em]"
                />
                <span>waiting for.</span>
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom Editorial Baseline */}
        <div className="pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <p
            data-reveal="up"
            data-intro
            data-delay="0.22"
            className="lg:col-span-6 text-sm sm:text-base text-[var(--muted)] max-w-md leading-relaxed"
          >
            An intentional wishlist manager that measures what you want against what
            you have already saved.
          </p>

          <div
            data-reveal="up"
            data-intro
            data-delay="0.3"
            className="lg:col-span-6 flex items-center lg:justify-end"
          >
            <Link
              href="/app"
              data-fill
              className="btn-fill h-11 inline-flex items-center justify-center gap-2.5 px-6 rounded-xl bg-[var(--primary)] text-xs sm:text-sm font-semibold text-[var(--primary-foreground)] cursor-pointer"
            >
              <span className="btn__fill" aria-hidden="true" />
              <span>Open Wishlist</span>
              <ArrowRight size={15} weight="bold" className="btn__arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
