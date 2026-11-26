"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WISHLIST_CHAPTERS } from "@/lib/data/landing";
import { prefersReducedMotion } from "@/lib/motion/engine";

gsap.registerPlugin(ScrollTrigger);

export const WishlistChapters: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll<HTMLElement>("[data-chapter]");
      items.forEach((item, idx) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => setActiveChapter(idx),
          onEnterBack: () => setActiveChapter(idx),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-10 sm:py-16 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
        {/* Sticky Left Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
          <h2
            data-split="lines"
            className="text-[clamp(2.1rem,4.6vw,4rem)] font-bold tracking-[-0.03em] leading-[0.98] text-[var(--foreground)]"
          >
            Built for
            <br />
            deliberate buying.
          </h2>

          <p className="text-sm text-[var(--muted)] max-w-sm leading-relaxed">
            Four quiet principles that turn impulse browsing into patient ownership.
          </p>
        </div>

        {/* Spacious Editorial Chapters separated cleanly by negative space (zero borders/dividers) */}
        <div className="lg:col-span-6 lg:col-start-7 space-y-12 sm:space-y-16">
          {WISHLIST_CHAPTERS.map((chapter, idx) => {
            const isActive = activeChapter === idx;
            return (
              <article
                key={chapter.number}
                data-chapter
                className={`space-y-3 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
                }`}
              >
                <span
                  className={`block text-xs font-semibold tabular-nums transition-colors duration-300 ${
                    isActive ? "text-[var(--primary)]" : "text-[var(--muted)]"
                  }`}
                >
                  {chapter.number}
                </span>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] leading-tight text-[var(--foreground)]">
                  {chapter.title}
                </h3>

                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-lg">
                  {chapter.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
