"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseModalBackGestureOptions {
  isOpen: boolean;
  onClose: () => void;
  modalId?: string;
  enableSwipeBack?: boolean;
}

export function useModalBackGesture<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  modalId = "modal",
  enableSwipeBack = true,
}: UseModalBackGestureOptions) {
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<T>(null);

  // Store onClose in a ref so history effect NEVER re-runs on function reference changes
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const modalKeyRef = useRef<string | null>(null);
  const isBrowserBackRef = useRef(false);

  // 1. Mobile Browser History Back Gesture Integration
  // Traps iOS Safari edge back swipe, Android system back swipe/button, and browser back.
  // Pushes a single history entry on open and pops it on close.
  useEffect(() => {
    if (!isOpen) {
      modalKeyRef.current = null;
      isBrowserBackRef.current = false;
      setDragOffset(0);
      return;
    }

    // Modal opened: Push single history entry
    const key = `modal_${modalId}_${Date.now()}`;
    modalKeyRef.current = key;
    isBrowserBackRef.current = false;

    // Use current URL explicitly (industry standard for in-page overlays)
    if (typeof window !== "undefined") {
      window.history.pushState(
        { modalOpen: true, modalKey: key },
        "",
        window.location.href
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      // Browser back gesture occurred
      if (modalKeyRef.current) {
        modalKeyRef.current = null;
        isBrowserBackRef.current = true;
        // Blur any active inputs so mobile keyboard dismisses cleanly
        if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        onCloseRef.current();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      // If modal closed via UI (X button, ESC key, backdrop, or form submit),
      // cleanly revert the pushed history entry without leaving an orphaned history state
      if (modalKeyRef.current && !isBrowserBackRef.current) {
        modalKeyRef.current = null;
        if (typeof window !== "undefined" && window.history.state?.modalOpen) {
          window.history.back();
        }
      }
    };
  }, [isOpen, modalId]); // STRICT: Only depend on isOpen and modalId, NEVER onClose!

  // 2. Horizontal In-App Swipe-to-Back Gesture
  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    isEdgeSwipe: boolean;
    isHorizontal: boolean | null;
  } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isOpen || !enableSwipeBack) return;

      const touch = e.touches[0];
      const isEdgeSwipe = touch.clientX <= 60; // Left bezel edge start

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        isEdgeSwipe,
        isHorizontal: null,
      };
    },
    [isOpen, enableSwipeBack]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isOpen || !enableSwipeBack || !touchStartRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Classify gesture direction once movement exceeds threshold
      if (touchStartRef.current.isHorizontal === null) {
        if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
          touchStartRef.current.isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
        }
      }

      // Only engage if swiping right (back gesture)
      if (touchStartRef.current.isHorizontal && deltaX > 0) {
        // Blur inputs if swiping has started to collapse virtual keyboard
        if (deltaX > 20 && typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        const damped = Math.min(deltaX * 0.85, 240);
        setDragOffset(damped);
      }
    },
    [isOpen, enableSwipeBack]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isOpen || !enableSwipeBack || !touchStartRef.current) {
        setDragOffset(0);
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const timeDelta = Math.max(1, Date.now() - touchStartRef.current.time);
      const velocityX = deltaX / timeDelta;

      const isDismissRight =
        touchStartRef.current.isHorizontal &&
        deltaX > 0 &&
        (deltaX > 75 || velocityX > 0.4 || (touchStartRef.current.isEdgeSwipe && deltaX > 50));

      if (isDismissRight) {
        onCloseRef.current();
      }

      setDragOffset(0);
      touchStartRef.current = null;
    },
    [isOpen, enableSwipeBack]
  );

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    containerRef,
    dragOffset,
    touchHandlers,
  };
}
