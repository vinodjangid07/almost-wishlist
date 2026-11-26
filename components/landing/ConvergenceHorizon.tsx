"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/engine";

gsap.registerPlugin(ScrollTrigger);

export const ConvergenceHorizon: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftWordRef = useRef<HTMLSpanElement>(null);
  const rightWordRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const leftWord = leftWordRef.current;
    const rightWord = rightWordRef.current;
    const line = lineRef.current;

    if (!section || !stage || !leftWord || !rightWord || !line) return;

    if (prefersReducedMotion()) {
      gsap.set(line, { scaleX: 1 });
      return;
    }

    const getTravel = () => {
      const stageWidth = stage.clientWidth;
      const leftW = leftWord.offsetWidth;
      const rightW = rightWord.offsetWidth;
      const endGap = stageWidth < 640 ? 14 : 28;
      return Math.max(0, (stageWidth - leftW - rightW - endGap) / 2);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          end: "center 48%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        leftWord,
        { x: 0, opacity: 0.55 },
        { x: () => getTravel(), opacity: 1, ease: "none" },
        0
      )
        .fromTo(
          rightWord,
          { x: 0, opacity: 0.55 },
          { x: () => -getTravel(), opacity: 1, ease: "none" },
          0
        )
        .fromTo(
          line,
          { scaleX: 0.06 },
          { scaleX: 1, ease: "none" },
          0
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Closing the distance between wanting and owning"
      className="py-12 sm:py-24 select-none"
    >
      {/* Opposing Monumental Words */}
      <div
        ref={stageRef}
        className="w-full flex items-baseline justify-between overflow-x-clip"
      >
        <span
          ref={leftWordRef}
          className="inline-block text-[clamp(2rem,6.5vw,6.25rem)] font-bold tracking-[-0.03em] leading-none text-[var(--foreground)] will-change-transform shrink-0"
        >
          Wanting
        </span>

        <span
          ref={rightWordRef}
          className="inline-block text-[clamp(2rem,6.5vw,6.25rem)] font-bold tracking-[-0.03em] leading-none text-[var(--primary)] will-change-transform shrink-0"
        >
          Owning
        </span>
      </div>

      {/* Single Calibrated Horizon Line (sole deliberate line in section) */}
      <div className="mt-8 sm:mt-12 relative h-px w-full bg-[var(--surface-raised)] overflow-hidden">
        <div
          ref={lineRef}
          className="absolute inset-0 bg-[var(--primary)] origin-left will-change-transform"
        />
      </div>

      <p className="mt-6 text-xs sm:text-sm text-[var(--muted)] max-w-md leading-relaxed">
        Between wanting something and buying it sits your actual balance.
      </p>
    </section>
  );
};
