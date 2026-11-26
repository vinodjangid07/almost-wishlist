"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

/**
 * Initializes unified one-clock motion for the landing page:
 * GSAP ticker drives Lenis smooth scroll & ScrollTrigger.
 * Returns a full cleanup teardown function.
 */
export function initLandingMotion(root: HTMLElement) {
  const reduced = prefersReducedMotion();
  let lenis: Lenis | null = null;
  let tickLenis: ((time: number) => void) | null = null;

  if (!reduced) {
    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    tickLenis = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickLenis);
    gsap.ticker.lagSmoothing(0);
  }

  const ctx = gsap.context(() => {
    if (reduced) {
      // Ensure all elements are immediately visible under reduced motion
      gsap.set("[data-split], [data-reveal]", {
        autoAlpha: 1,
        clearProps: "clipPath,transform",
      });
      return;
    }

    const intro = gsap.timeline({ delay: 0.08 });

    // 1. SplitText masked line reveals (both intro and scroll-triggered)
    const splitEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-split]")
    );

    splitEls.forEach((el) => {
      const isIntro = el.hasAttribute("data-intro");
      const delay = parseFloat(el.dataset.delay || "0");
      const type = (el.dataset.split || "lines") as "lines" | "words";

      let revealed = false;

      SplitText.create(el, {
        type: type === "lines" ? "lines" : "lines,words",
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        onSplit(self) {
          gsap.set(el, { visibility: "visible", autoAlpha: 1 });
          if (revealed) return;

          const targets = type === "lines" ? self.lines : self.words;
          const anim = gsap.from(targets, {
            yPercent: 108,
            rotate: 1.2,
            duration: 1.15,
            stagger: type === "lines" ? 0.08 : 0.035,
            ease: ease.out,
            delay: isIntro ? 0 : delay,
            onComplete: () => {
              revealed = true;
            },
            scrollTrigger: isIntro
              ? undefined
              : {
                  trigger: el,
                  start: "top 88%",
                  once: true,
                },
          });

          if (isIntro) {
            intro.add(anim, delay);
          }

          return anim;
        },
      });
    });

    // 2. Block reveals (clip, up, fade)
    const revealEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    revealEls.forEach((el) => {
      const kind = el.dataset.reveal || "up";
      const isIntro = el.hasAttribute("data-intro");
      const delay = parseFloat(el.dataset.delay || "0");

      const fromVars: gsap.TweenVars =
        kind === "clip"
          ? { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 }
          : kind === "fade"
            ? { autoAlpha: 0 }
            : { y: 36, autoAlpha: 0 };

      const toVars: gsap.TweenVars =
        kind === "clip"
          ? { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 }
          : { y: 0, autoAlpha: 1 };

      gsap.set(el, { visibility: "visible" });

      const tween = gsap.fromTo(el, fromVars, {
        ...toVars,
        duration: kind === "fade" ? 0.9 : 1.15,
        ease: ease.out,
        delay: isIntro ? 0 : delay,
        scrollTrigger: isIntro
          ? undefined
          : {
              trigger: el,
              start: "top 90%",
              once: true,
            },
      });

      if (isIntro) {
        intro.add(tween, delay);
      }
    });
  }, root);

  // 3. Pointer-entry circular fill buttons ([data-fill])
  const btnCleanups: (() => void)[] = [];
  if (!reduced && !isTouchDevice()) {
    root.querySelectorAll<HTMLElement>("[data-fill]").forEach((btn) => {
      const fill = btn.querySelector<HTMLElement>(".btn__fill");
      if (!fill) return;

      const getOrigin = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        return `${e.clientX - r.left}px ${e.clientY - r.top}px`;
      };

      let isClosed = true;

      const open = (at: string) => {
        if (isClosed) {
          gsap.set(fill, { clipPath: `circle(0% at ${at})` });
        }
        isClosed = false;
        btn.classList.add("is-filled");
        gsap.to(fill, {
          clipPath: `circle(155% at ${at})`,
          duration: 0.55,
          ease: ease.soft,
          overwrite: true,
        });
      };

      const close = (at: string) => {
        btn.classList.remove("is-filled");
        gsap.to(fill, {
          clipPath: `circle(0% at ${at})`,
          duration: 0.45,
          ease: ease.soft,
          overwrite: true,
          onComplete: () => {
            isClosed = true;
          },
        });
      };

      const onEnter = (e: PointerEvent) => open(getOrigin(e));
      const onLeave = (e: PointerEvent) => close(getOrigin(e));
      const onFocus = () => {
        if (btn.matches(":focus-visible")) open("50% 50%");
      };
      const onBlur = () => close("50% 50%");

      btn.addEventListener("pointerenter", onEnter);
      btn.addEventListener("pointerleave", onLeave);
      btn.addEventListener("focus", onFocus);
      btn.addEventListener("blur", onBlur);

      btnCleanups.push(() => {
        btn.removeEventListener("pointerenter", onEnter);
        btn.removeEventListener("pointerleave", onLeave);
        btn.removeEventListener("focus", onFocus);
        btn.removeEventListener("blur", onBlur);
      });
    });
  }

  return () => {
    btnCleanups.forEach((fn) => fn());
    ctx.revert();
    if (tickLenis) gsap.ticker.remove(tickLenis);
    if (lenis) lenis.destroy();
  };
}
