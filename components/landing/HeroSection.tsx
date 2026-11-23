"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowRight } from "@phosphor-icons/react";

export const HeroSection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const appIconSrc =
    resolvedTheme === "dark" ? "/dark-app-icon.webp" : "/light-app-icon.webp";

  return (
    <section className="relative text-center space-y-8 sm:space-y-12 select-none pt-2 sm:pt-6">
      {/* Soft Ethereal Lighting - GPU composite layer to avoid CPU blur rasterization on scroll */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] sm:w-[750px] h-[280px] sm:h-[380px] bg-radial from-[var(--primary)]/10 via-[var(--primary)]/3 to-transparent blur-3xl pointer-events-none rounded-full -z-10 transform-gpu will-change-transform"
      />

      {/* Main Copy Group */}
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        {/* Editorial Eyebrow (No uppercase, no em-dashes) */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-medium text-[var(--primary)] select-none"
        >
          A quiet registry for considered desires
        </motion.p>

        {/* Hero Headline (Consistent site font, bare inline app-icon with no parent container) */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] leading-[1.12] text-balance"
        >
          The things worth
          <br />
          <span className="inline-flex items-center gap-2 sm:gap-3.5 align-middle">
            <Image
              src={appIconSrc}
              alt="almost icon"
              width={56}
              height={56}
              priority
              className="inline-block align-middle w-[0.84em] h-[0.84em] rounded-xl border border-[var(--border-subtle)] object-contain shrink-0 -translate-y-[0.05em] overflow-hidden"
            />
            <span>waiting for.</span>
          </span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base lg:text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed text-balance"
        >
          Classify desires, budget against actual savings, and pool funds with friends
          for the things that truly matter.
        </motion.p>

        {/* Single Primary Action Button (Pure Flat Luxury) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2 flex justify-center"
        >
          <Link
            href="/app"
            className="group h-11 inline-flex items-center justify-center gap-2 px-7 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <span>Open Wishlist</span>
            <ArrowRight
              size={14}
              weight="bold"
              className="transition-transform duration-150 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Pure Dashboard Image Showcase (Hairline Border, Zero Drop Shadows) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6 select-none"
      >
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/preview/dashboard-preview.webp"
            alt="Almost Dashboard Interface Preview"
            className="w-full h-auto object-cover block select-none"
            loading="eager"
          />
        </div>
      </motion.div>
    </section>
  );
};
