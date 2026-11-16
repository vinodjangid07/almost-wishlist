"use client";

import React, { useEffect } from "react";
import { X } from "@phosphor-icons/react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  itemTitle,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm bg-[var(--surface)] rounded-3xl p-6 text-[var(--foreground)] animate-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
          title="Close"
        >
          <X size={16} />
        </button>

        <h3 className="text-base font-bold text-[var(--foreground)] pt-1">
          Delete wish
        </h3>
        <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-[var(--foreground)]">
            &ldquo;{itemTitle}&rdquo;
          </span>{" "}
          from your wishlist? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl text-xs font-semibold bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-10 px-4 rounded-xl text-xs font-semibold bg-[var(--foreground)] hover:opacity-90 text-[var(--surface)] transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
