"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WishItem, TagType, PriorityLevel, ShoppingLink } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useModalBackGesture } from "@/hooks/useModalBackGesture";
import {
  X,
  UploadSimple,
  Plus,
  Trash,
  CurrencyInr,
  UsersThree,
  CaretDown,
  Check,
  LockKey,
} from "@phosphor-icons/react";

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishToEdit?: WishItem | null;
  onOpenAuthModal?: () => void;
}

const COMMON_STORES = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Apple",
  "Nike",
  "Booking.com",
  "Airbnb",
  "Other",
];

const DEFAULT_CATEGORIES = [
  "Experiences & Travel",
  "Travel & Outings",
  "Tech & Electronics",
  "Clothing & Shoes",
  "Home & Living",
  "Books & Learning",
  "Fitness & Sports",
  "Gaming",
  "Other",
];

export const WishModal: React.FC<WishModalProps> = ({
  isOpen,
  onClose,
  wishToEdit,
  onOpenAuthModal,
}) => {
  const { addWish, updateWish } = useWishlist();
  const { currency } = useSavings();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Experiences & Travel");
  const [customCategory, setCustomCategory] = useState("");
  const [tag, setTag] = useState<TagType>("want");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [estimatedPrice, setEstimatedPrice] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Store links repeater
  const [links, setLinks] = useState<ShoppingLink[]>([
    { id: "link-1", storeName: "Amazon", url: "", price: undefined },
  ]);

  // Image upload & preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { dragOffset, touchHandlers } = useModalBackGesture({
    isOpen,
    onClose,
    modalId: "wish-modal",
  });

  // Reset or populate on open
  useEffect(() => {
    if (wishToEdit) {
      setTitle(wishToEdit.title);
      setDescription(wishToEdit.description || "");
      if (DEFAULT_CATEGORIES.includes(wishToEdit.category)) {
        setCategory(wishToEdit.category);
        setCustomCategory("");
      } else {
        setCategory("Other");
        setCustomCategory(wishToEdit.category);
      }
      setTag(wishToEdit.tag);
      setPriority(wishToEdit.priority);
      setEstimatedPrice(wishToEdit.estimatedPrice.toString());
      setMinPrice(wishToEdit.minPrice ? wishToEdit.minPrice.toString() : "");
      setMaxPrice(wishToEdit.maxPrice ? wishToEdit.maxPrice.toString() : "");
      setShowPriceRange(Boolean(wishToEdit.minPrice || wishToEdit.maxPrice));
      setIsShared(Boolean(wishToEdit.isShared));
      setLinks(
        wishToEdit.links && wishToEdit.links.length > 0
          ? wishToEdit.links
          : [{ id: "link-1", storeName: "Amazon", url: "", price: undefined }]
      );
      setImagePreview(wishToEdit.imageUrl || "");
      setImageFile(null);
      setShowUrlInput(false);
    } else {
      setTitle("");
      setDescription("");
      setCategory("Experiences & Travel");
      setCustomCategory("");
      setTag("want");
      setPriority("medium");
      setEstimatedPrice("");
      setMinPrice("");
      setMaxPrice("");
      setShowPriceRange(false);
      setIsShared(false);
      setLinks([{ id: "link-1", storeName: "Amazon", url: "", price: undefined }]);
      setImagePreview("");
      setImageFile(null);
      setImageError(null);
      setShowUrlInput(false);
    }
  }, [wishToEdit, isOpen]);

  // Keyboard navigation: Escape to close, Cmd+Enter / Ctrl+Enter to submit
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const form = document.getElementById("wish-modal-form") as HTMLFormElement | null;
        if (form) {
          form.requestSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleAddLink = () => {
    setLinks([
      ...links,
      {
        id: `link-${Date.now()}`,
        storeName: "Amazon",
        url: "",
        price: undefined,
      },
    ]);
  };

  const handleUpdateLink = (id: string, updates: Partial<ShoppingLink>) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleRemoveLink = (id: string) => {
    if (links.length === 1) return;
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image exceeds 5MB limit. Please choose a smaller file.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowUrlInput(false);
    }
  };

  const handleToggleCollab = useCallback(() => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    setIsShared((prev) => !prev);
  }, [user, onOpenAuthModal]);

  const uploadToBlob = async (file: File): Promise<string> => {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(sanitizedName)}`, {
        method: "POST",
        body: file,
      });
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.pathname) {
        return `/api/view?pathname=${encodeURIComponent(data.pathname)}`;
      }
      return data.url || imagePreview;
    } catch (err) {
      console.warn("Blob upload fallback to local preview", err);
      return imagePreview;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !estimatedPrice) return;

    setIsSubmitting(true);

    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        finalImageUrl = await uploadToBlob(imageFile);
      }

      const finalCategory =
        category === "Other" && customCategory.trim() ? customCategory.trim() : category;

      const validLinks = links.filter((l) => l.url && l.url.trim().length > 0);

      const parsedEstimated = parseFloat(estimatedPrice);
      const parsedMin = minPrice ? parseFloat(minPrice) : undefined;
      const parsedMax = maxPrice ? parseFloat(maxPrice) : undefined;

      if (wishToEdit) {
        await updateWish(wishToEdit.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          category: finalCategory,
          tag,
          priority,
          estimatedPrice: parsedEstimated,
          minPrice: parsedMin,
          maxPrice: parsedMax,
          imageUrl: finalImageUrl || undefined,
          links: validLinks,
          isShared,
        });
      } else {
        await addWish({
          title: title.trim(),
          description: description.trim() || undefined,
          category: finalCategory,
          tag,
          priority,
          estimatedPrice: parsedEstimated,
          minPrice: parsedMin,
          maxPrice: parsedMax,
          currency: currency || "₹",
          imageUrl: finalImageUrl || undefined,
          links: validLinks,
          isFulfilled: false,
          isPurchased: false,
          isShared,
        });
      }

      onClose();
    } catch (err) {
      console.error("Failed to save wish:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md overflow-hidden animate-in fade-in duration-150 select-none"
    >
      <div
        {...touchHandlers}
        style={{
          transform: dragOffset > 0 ? `translateX(${dragOffset}px)` : undefined,
          opacity: dragOffset > 0 ? Math.max(0.5, 1 - dragOffset / 300) : undefined,
          transition: dragOffset === 0 ? "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease" : "none",
        }}
        className="relative w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] bg-[var(--surface)] border-0 sm:border sm:border-[var(--border-subtle)] rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col my-0 sm:my-4 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--surface)]">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
            {wishToEdit ? "Edit Wish" : "New Wish"}
          </h2>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--muted)]">
              ESC
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
              title="Close modal"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="wish-modal-form"
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 select-text"
        >
          {/* Cover Photo / Media Zone */}
          <div>
            {imagePreview ? (
              <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-raised)] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Mobile Persistent Action Controls (Always visible on mobile touch screens, zero hover needed) */}
                <div className="sm:hidden absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 px-2.5 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <UploadSimple size={12} />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="h-7 px-2.5 rounded-lg bg-black/75 backdrop-blur-md text-rose-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Trash size={12} />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Desktop Centered Hover Overlay */}
                <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 px-3 rounded-lg bg-black/75 backdrop-blur-xs text-white text-xs font-medium hover:bg-black transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <UploadSimple size={14} />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="h-8 px-3 rounded-lg bg-black/75 backdrop-blur-xs text-rose-300 text-xs font-medium hover:bg-black transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--muted)] p-3.5 bg-[var(--background)]/35 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--muted)] shrink-0">
                      <UploadSimple size={15} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-[var(--foreground)] block">
                        Cover Photo
                      </span>
                      <span className="text-[11px] text-[var(--muted)] block">
                        Upload an image or paste a product link
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="flex-1 sm:flex-initial h-8 sm:h-7 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] text-xs sm:text-[11px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition cursor-pointer text-center whitespace-nowrap"
                    >
                      {showUrlInput ? "Hide Link" : "Paste URL"}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-initial h-8 sm:h-7 px-3.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-xs sm:text-[11px] font-semibold hover:opacity-90 transition cursor-pointer text-center whitespace-nowrap"
                    >
                      Browse
                    </button>
                  </div>
                </div>

                {showUrlInput && (
                  <div className="pt-1">
                    <input
                      type="url"
                      placeholder="Paste image web link (https://...)"
                      value={
                        imageFile ||
                        imagePreview.startsWith("/api/") ||
                        imagePreview.startsWith("blob:") ||
                        imagePreview.startsWith("data:")
                          ? ""
                          : imagePreview
                      }
                      onChange={(e) => {
                        setImageFile(null);
                        setImagePreview(e.target.value);
                      }}
                      className="h-8.5 w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:border-[var(--muted)] transition"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imageError && (
              <p className="text-[11px] text-[var(--danger)] font-medium pt-1">
                {imageError}
              </p>
            )}
          </div>

          {/* Editorial Title & Notes (Clean & Borderless) */}
          <div className="space-y-1.5 pb-1">
            <input
              type="text"
              required
              placeholder="What are you wishing for?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)] placeholder:text-[var(--placeholder)] bg-transparent border-0 border-b border-transparent focus:border-[var(--border-subtle)] pb-1.5 focus:outline-none transition"
            />

            <textarea
              rows={2}
              placeholder="Why does this matter? Add personal notes, specifications, or wait conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--placeholder)] bg-transparent border-0 focus:outline-none resize-none leading-relaxed min-h-[44px]"
            />
          </div>

          {/* Properties: Classification, Priority, Category (Clean Unified Grid, No Outer Card Wrapper) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Classification */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted)] block">
                Classification
              </label>
              <div className="relative">
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value as TagType)}
                  className="w-full h-9.5 appearance-none bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl pl-3 pr-8 text-xs font-medium text-[var(--foreground)] focus:outline-none cursor-pointer transition capitalize"
                >
                  <option value="need">Need</option>
                  <option value="want">Want</option>
                  <option value="luxury">Luxury</option>
                </select>
                <CaretDown
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted)] block">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full h-9.5 appearance-none bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl pl-3 pr-8 text-xs font-medium text-[var(--foreground)] focus:outline-none cursor-pointer transition"
                >
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
                <CaretDown
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted)] block">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9.5 appearance-none bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl pl-3 pr-8 text-xs font-medium text-[var(--foreground)] focus:outline-none cursor-pointer transition truncate"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Custom Category Field if "Other" is chosen */}
          {category === "Other" && (
            <div className="animate-in fade-in duration-150">
              <input
                type="text"
                placeholder="Enter custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="h-9 w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--muted)] transition"
              />
            </div>
          )}

          {/* Valuation & Target Budgeting (Clean Direct Field, No Outer Card Wrapper) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--muted)]">
                Estimated Price *
              </label>
              <button
                type="button"
                onClick={() => setShowPriceRange(!showPriceRange)}
                className="text-[11px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition cursor-pointer"
              >
                {showPriceRange ? "Single price only" : "+ Add min/max range"}
              </button>
            </div>

            <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] focus-within:border-[var(--muted)] transition">
              <span className="text-sm font-semibold text-[var(--muted)] select-none">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="0.00"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="w-full text-base font-bold tabular-nums font-mono text-[var(--foreground)] placeholder:text-[var(--placeholder)] bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {showPriceRange && (
              <div className="grid grid-cols-2 gap-2.5 pt-1.5 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--muted)]">
                    Min Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-9 w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl px-2.5 text-xs font-mono tabular-nums text-[var(--foreground)] focus:outline-none focus:border-[var(--muted)] transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--muted)]">
                    Max Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-9 w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl px-2.5 text-xs font-mono tabular-nums text-[var(--foreground)] focus:outline-none focus:border-[var(--muted)] transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collaborative Wish (With strict authentication gate) */}
          <div
            onClick={handleToggleCollab}
            className={`p-3.5 rounded-xl border border-[var(--border-subtle)] transition flex items-center justify-between gap-3 cursor-pointer select-none ${
              isShared
                ? "bg-[var(--surface-raised)]/70 border-[var(--primary)]/40"
                : "bg-[var(--background)]/40 hover:bg-[var(--surface-hover)]/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                  isShared
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--surface-raised)] text-[var(--muted)] border border-[var(--border-subtle)]"
                }`}
              >
                <UsersThree size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    Collaborative Wish
                  </span>
                  {!user && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-md">
                      <LockKey size={10} />
                      Sign in required
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[var(--muted)] block">
                  Pool savings and track goals with friends via shared invite code
                </span>
              </div>
            </div>

            {/* Custom Precision Toggle Switch */}
            <div
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                isShared ? "bg-[var(--primary)]" : "bg-[var(--muted)]/25"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  isShared ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Store Comparison Links */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--foreground)]">
                Store Links
              </span>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] transition inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus size={12} />
                <span>Add store link</span>
              </button>
            </div>

            <div className="space-y-2">
              {links.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)]/30"
                >
                  <div className="flex items-center gap-2">
                    <select
                      value={link.storeName}
                      onChange={(e) =>
                        handleUpdateLink(link.id, { storeName: e.target.value })
                      }
                      className="h-8 w-28 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg px-2 text-xs font-medium text-[var(--foreground)] focus:outline-none cursor-pointer shrink-0"
                    >
                      {COMMON_STORES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder={`Price ${currency}`}
                      value={link.price !== undefined ? link.price : ""}
                      onChange={(e) =>
                        handleUpdateLink(link.id, {
                          price: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="h-8 w-24 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg px-2 text-xs font-mono tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shrink-0"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      type="url"
                      placeholder="https://store.com/item..."
                      value={link.url}
                      onChange={(e) =>
                        handleUpdateLink(link.id, { url: e.target.value })
                      }
                      className="h-8 w-full flex-1 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg px-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:border-[var(--muted)] transition min-w-0"
                    />

                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="h-8 w-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-hover)] rounded-lg transition cursor-pointer shrink-0"
                        title="Remove link"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Pinned Sticky Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--surface)]/95 backdrop-blur-md flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="wish-modal-form"
            disabled={isSubmitting || !title.trim() || !estimatedPrice}
            className="h-9 px-5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <span>{wishToEdit ? "Update Wish" : "Save Wish"}</span>
                <Check size={13} weight="bold" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
