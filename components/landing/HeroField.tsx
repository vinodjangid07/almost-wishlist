"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/contexts/ThemeContext";
import { isTouchDevice, prefersReducedMotion } from "@/lib/motion/engine";

gsap.registerPlugin(ScrollTrigger);

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uRipple;
  uniform float uRippleTime;
  uniform vec3 uLine;
  uniform vec3 uAccent;

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    bool isPortrait = aspect < 1.05;

    // Aspect-corrected centered coordinates
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);

    // Fixed focal well (right third on desktop, upper half on portrait phone)
    vec2 objCenter = isPortrait
      ? vec2(0.05 * aspect, 0.18)
      : vec2(0.24 * aspect, 0.03);

    // Slow, serene orbital breath
    objCenter += vec2(cos(uTime * 0.32), sin(uTime * 0.24)) * 0.028;

    // Interactive visitor cursor well
    vec2 ptr = (uMouse - 0.5) * vec2(aspect, 1.0);

    float dObj = length(p - objCenter);
    float dPtr = length(p - ptr);

    // Dual-pole gravity potential field
    float potential = 0.27 / (dObj + 0.15) + 0.18 / (dPtr + 0.17);

    // Subtle organic wave modulation
    float wave = 0.075 * sin(p.x * 2.6 + uTime * 0.2) * cos(p.y * 2.5 - uTime * 0.15);
    wave += 0.035 * sin((p.x - p.y) * 4.0 + uTime * 0.12);
    potential += wave;

    // Tactile ripple expanding outward on click / tap
    float rippleWave = sin(dPtr * 22.0 - uRippleTime * 8.5) * exp(-dPtr * 3.4) * uRipple;
    potential += rippleWave * 0.15;

    // Razor-sharp topographic iso-contours
    float bands = potential * 13.5;
    float distToLine = abs(fract(bands) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.055, distToLine);

    // Golden harmonic resonance along the convergence bridge and core rings
    float bridge = exp(-dObj * 2.1) * (0.4 + 0.6 * exp(-dPtr * 1.7));
    float innerThreshold = smoothstep(0.42, 0.04, dObj);
    float goldMix = clamp(
      bridge * 1.2 + innerThreshold * 0.55 + uRipple * exp(-dPtr * 2.2) * 0.7,
      0.0,
      1.0
    );

    // Softly mask behind hero text on left (desktop) or lower half (mobile) to preserve >10:1 text contrast
    float textProtection = isPortrait
      ? mix(0.28, 1.0, smoothstep(-0.32, 0.25, p.y))
      : mix(0.20, 1.0, smoothstep(-0.38 * aspect, 0.22 * aspect, p.x));

    // Organic vignette at viewport edges
    float edgeX = smoothstep(0.50 * aspect, 0.34 * aspect, abs(p.x));
    float edgeY = smoothstep(0.50, 0.35, abs(p.y));
    float vignette = edgeX * edgeY;

    float baseOpacity = mix(0.14, 0.58, goldMix);
    float alpha = contour * baseOpacity * textProtection * vignette;

    vec3 col = mix(uLine, uAccent, goldMix);
    gl_FragColor = vec4(col, alpha);
  }
`;

const PALETTES = {
  light: {
    line: [17 / 255, 19 / 255, 24 / 255],
    accent: [197 / 255, 131 / 255, 22 / 255],
  },
  dark: {
    line: [244 / 255, 245 / 255, 247 / 255],
    accent: [229 / 255, 169 / 255, 60 / 255],
  },
};

export const HeroField: React.FC<{ hostRef: React.RefObject<HTMLElement | null> }> = ({
  hostRef,
}) => {
  const { resolvedTheme } = useTheme();
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);

  useEffect(() => {
    const prog = programRef.current;
    if (!prog) return;
    const pal = resolvedTheme === "dark" ? PALETTES.dark : PALETTES.light;
    prog.uniforms.uLine.value = pal.line;
    prog.uniforms.uAccent.value = pal.accent;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvasHost = canvasHostRef.current;
    const hostEl = hostRef.current;
    if (!canvasHost || !hostEl || prefersReducedMotion()) return;

    let renderer: Renderer | null = null;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    canvasHost.appendChild(gl.canvas);

    const pal = resolvedTheme === "dark" ? PALETTES.dark : PALETTES.light;

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(canvasHost.clientWidth, canvasHost.clientHeight) },
        uMouse: { value: new Vec2(0.72, 0.54) },
        uRipple: { value: 0 },
        uRippleTime: { value: 0 },
        uLine: { value: pal.line },
        uAccent: { value: pal.accent },
      },
    });
    programRef.current = program;

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (!renderer || !canvasHost) return;
      const w = canvasHost.clientWidth || window.innerWidth;
      const h = canvasHost.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvasHost);

    const aim = { x: 0.72, y: 0.54 };
    const mouse = { x: 0.72, y: 0.54 };
    const rippleState = { strength: 0, time: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = hostEl.getBoundingClientRect();
      aim.x = gsap.utils.clamp(0.05, 0.95, (e.clientX - rect.left) / Math.max(rect.width, 1));
      aim.y = gsap.utils.clamp(
        0.05,
        0.95,
        1.0 - (e.clientY - rect.top) / Math.max(rect.height, 1)
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = hostEl.getBoundingClientRect();
      aim.x = gsap.utils.clamp(0.05, 0.95, (e.clientX - rect.left) / Math.max(rect.width, 1));
      aim.y = gsap.utils.clamp(
        0.05,
        0.95,
        1.0 - (e.clientY - rect.top) / Math.max(rect.height, 1)
      );
      rippleState.time = 0;
      gsap.fromTo(
        rippleState,
        { strength: 1.0 },
        { strength: 0, duration: 1.4, ease: "expo.out", overwrite: true }
      );
    };

    const touch = isTouchDevice();
    if (!touch) {
      hostEl.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    hostEl.addEventListener("pointerdown", onPointerDown, { passive: true });

    let isActive = true;
    const renderTick = (time: number, deltaTime: number) => {
      if (!isActive || !renderer) return;
      const r = gsap.ticker.deltaRatio();
      const k = 1 - Math.pow(0.92, r);
      mouse.x += (aim.x - mouse.x) * k;
      mouse.y += (aim.y - mouse.y) * k;
      rippleState.time += deltaTime * 0.001;

      program.uniforms.uTime.value = time;
      program.uniforms.uMouse.value.set(mouse.x, mouse.y);
      program.uniforms.uRipple.value = rippleState.strength;
      program.uniforms.uRippleTime.value = rippleState.time;

      renderer.render({ scene: mesh });
    };

    const st = ScrollTrigger.create({
      trigger: hostEl,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        isActive = self.isActive;
      },
    });

    gsap.ticker.add(renderTick);

    return () => {
      gsap.ticker.remove(renderTick);
      st.kill();
      ro.disconnect();
      if (!touch) {
        hostEl.removeEventListener("pointermove", onPointerMove);
      }
      hostEl.removeEventListener("pointerdown", onPointerDown);
      if (gl.canvas.parentNode === canvasHost) {
        canvasHost.removeChild(gl.canvas);
      }
      programRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostRef]);

  return (
    <div
      ref={canvasHostRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      {/* Static contour fallback for reduced-motion / no-WebGL */}
      <svg
        className="w-full h-full opacity-[0.14] hidden motion-reduce:block"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="880" cy="360" r="110" stroke="var(--primary)" strokeWidth="1.25" />
        <circle cx="880" cy="360" r="180" stroke="currentColor" strokeWidth="1" />
        <circle cx="880" cy="360" r="260" stroke="currentColor" strokeWidth="1" />
        <circle cx="880" cy="360" r="350" stroke="currentColor" strokeWidth="1" />
        <circle cx="880" cy="360" r="460" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
};
