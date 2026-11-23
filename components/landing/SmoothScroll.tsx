"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export const SmoothScroll = () => {
  useEffect(() => {
    // Respect OS accessibility settings for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Industry-standard 60fps/120fps smooth scrolling:
    // Uses linear interpolation (lerp: 0.1) instead of heavy duration curves.
    // Leaves touch scrolling native (syncTouch: false) so mobile devices
    // maintain 120Hz compositor-thread momentum without JS thread bottlenecks.
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

