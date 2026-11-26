"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/engine";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "A wish deserves more than an impulse cart.",
  "Keep the things you want in one calm place,",
  "watch your savings close the gap,",
  "and buy only when the numbers make sense.",
  "Private by default, synced across your devices when you sign in.",
];

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = section.querySelectorAll<HTMLElement>("[data-manifesto-line]");
      lines.forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
              end: "top 48%",
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="principles"
      className="py-12 sm:py-24 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-10">
          <h2 className="sr-only">Philosophy</h2>
          <div className="space-y-1.5 sm:space-y-2 text-[clamp(1.65rem,4.1vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.15] text-[var(--foreground)]">
            {LINES.map((text, idx) => (
              <p key={idx} data-manifesto-line>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
