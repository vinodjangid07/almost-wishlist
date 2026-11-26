"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export const FooterFinale: React.FC = () => {
  return (
    <footer className="pt-16 sm:pt-24 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-20 sm:space-y-28">
        {/* Closing Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h2
              data-split="lines"
              className="text-[clamp(2.4rem,5.6vw,5rem)] font-bold tracking-[-0.03em] leading-[0.98] text-[var(--foreground)] text-balance"
            >
              Close the gap between
              <br />
              wanting and owning.
            </h2>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              href="/app"
              data-fill
              className="btn-fill h-11 inline-flex items-center justify-center gap-2.5 px-7 rounded-xl bg-[var(--primary)] text-xs sm:text-sm font-semibold text-[var(--primary-foreground)] cursor-pointer"
            >
              <span className="btn__fill" aria-hidden="true" />
              <span>Open Wishlist</span>
              <ArrowRight size={15} weight="bold" className="btn__arrow" />
            </Link>
          </div>
        </div>

        {/* Single Quiet Footer Hairline & Real Links */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <Image
              src="/dark-wordmark-logo.webp"
              alt="almost"
              width={88}
              height={20}
              className="h-5 w-auto object-contain dark:hidden"
            />
            <Image
              src="/light-wordmark-logo.webp"
              alt="almost"
              width={88}
              height={20}
              className="hidden dark:block h-5 w-auto object-contain"
            />
            <span className="text-[var(--muted-light)]">·</span>
            <span>almost yours</span>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6"
          >
            <Link
              href="/app"
              className="draw-line py-0.5 text-[var(--foreground)] font-medium cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              href="/privacy"
              className="draw-line py-0.5 hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="draw-line py-0.5 hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              Terms
            </Link>
            <a
              href="https://github.com/vinodjangid07"
              target="_blank"
              rel="noopener noreferrer"
              className="draw-line py-0.5 hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              GitHub
            </a>
          </nav>

          <p className="text-xs text-[var(--muted)]">
            Designed &amp; engineered by{" "}
            <a
              href="https://github.com/vinodjangid07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)] underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
            >
              Vinod Jangid
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
