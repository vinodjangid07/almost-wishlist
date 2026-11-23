"use client";

import { useState, useRef, useCallback } from "react";

interface UseSwipeDismissOptions {
  onClose: () => void;
  isEnabled?: boolean;
}

export function useSwipeDismiss<T extends HTMLElement = HTMLDivElement>({
  onClose,
  isEnabled = true,
}: UseSwipeDismissOptions) {
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    isAtTop: boolean;
    isEdgeSwipe: boolean;
  } | null>(null);

  const contentRef = useRef<T>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isEnabled) return;
      const touch = e.touches[0];
      const isAtTop = contentRef.current ? contentRef.current.scrollTop <= 8 : true;
      const isEdgeSwipe = touch.clientX <= 50; // Started near left edge

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        isAtTop,
        isEdgeSwipe,
      };
    },
    [isEnabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isEnabled || !touchStartRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Swipe down when content is at top
      if (touchStartRef.current.isAtTop && deltaY > 0 && deltaY > Math.abs(deltaX)) {
        // Dampen the drag distance for a natural iOS sheet pull feel
        const damped = Math.min(deltaY * 0.75, 180);
        setDragOffset(damped);
      }

      // Edge swipe right (prevent browser back and give tactile feedback)
      if (touchStartRef.current.isEdgeSwipe && deltaX > 0 && deltaX > Math.abs(deltaY) * 1.2) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    },
    [isEnabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isEnabled || !touchStartRef.current) {
        setDragOffset(0);
        return;
      }
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const timeDelta = Math.max(1, Date.now() - touchStartRef.current.time);
      const velocityY = deltaY / timeDelta;
      const velocityX = deltaX / timeDelta;

      // Trigger dismiss on swipe down
      const isDismissDown =
        touchStartRef.current.isAtTop &&
        deltaY > 0 &&
        deltaY > Math.abs(deltaX) &&
        (deltaY > 75 || velocityY > 0.45);

      // Trigger dismiss on swipe right from edge (without browser history back)
      const isDismissRight =
        touchStartRef.current.isEdgeSwipe &&
        deltaX > 70 &&
        (deltaX > 75 || velocityX > 0.4);

      if (isDismissDown || isDismissRight) {
        onClose();
      }

      setDragOffset(0);
      touchStartRef.current = null;
    },
    [isEnabled, onClose]
  );

  return {
    contentRef,
    dragOffset,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
