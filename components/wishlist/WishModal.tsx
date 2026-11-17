"use client";

import React, { useState, useEffect } from "react";
import { WishItem, TagType, PriorityLevel, ShoppingLink } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { X, UploadSimple, Plus, Trash, CurrencyInr, UsersThree } from "@phosphor-icons/react";

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishToEdit?: WishItem | null;
}

const COMMON_STORES = ["Amazon", "Flipkart", "Myntra", "Apple", "Nike", "Booking.com", "Airbnb", "Other"];
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

export const WishModal: React.FC<WishModalProps> = ({ isOpen, onClose, wishToEdit }) => {
  const { addWish, updateWish } = useWishlist();
  const { currency } = useSavings();

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

  // Links repeater
  const [links, setLinks] = useState<ShoppingLink[]>([
    { id: "link-1", storeName: "Amazon", url: "", price: undefined },
  ]);

  // Image upload & preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setShowPriceRange(!!(wishToEdit.minPrice || wishToEdit.maxPrice));
      setIsShared(Boolean(wishToEdit.isShared));
      setLinks(
        wishToEdit.links && wishToEdit.links.length > 0
          ? wishToEdit.links
          : [{ id: "link-1", storeName: "Amazon", url: "", price: undefined }]
      );
      setImagePreview(wishToEdit.imageUrl || "");
      setImageFile(null);
    } else {
      // Reset
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
    }
  }, [wishToEdit, isOpen]);

  if (!isOpen) return null;

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
    }
  };

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

      const finalCategory = category === "Other" && customCategory.trim()
        ? customCategory.trim()
        : category;

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

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[var(--surface)] rounded-3xl p-6 sm:p-7 text-[var(--foreground)] my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] transition cursor-pointer"
          title="Close modal"
        >
          <X size={16} />
        </button>

        {/* Single Confident Headline (No duplicate "Edit Item" eyebrow) */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] mb-5">
          {wishToEdit ? "Edit Wish" : "New Wish"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Photo & Upload */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Photo
            </label>
            <div className="flex gap-3 items-center">
              <div className="w-20 h-20 rounded-2xl bg-[var(--surface-raised)] overflow-hidden flex items-center justify-center relative shrink-0 group">
                {imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                      title="Remove image"
                    >
                      <Trash size={15} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[var(--muted)] font-medium">None</span>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="h-9 flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--foreground)] cursor-pointer transition">
                  <UploadSimple size={15} />
                  <span>{imagePreview ? "Change Photo File" : "Upload Photo File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  placeholder="Or paste an image web link..."
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
                  className="h-9 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition"
                />

                {imageError && (
                  <p className="text-[11px] text-[var(--danger)] font-medium pt-0.5">
                    {imageError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rimowa Classic Cabin Suitcase, Trip to Japan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3.5 text-xs sm:text-sm font-semibold text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition"
            />
          </div>

          {/* Classification (Spacious dedicated row) */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Classification
            </label>
            <div className="h-10 p-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-1.5 max-w-sm">
              <button
                type="button"
                onClick={() => setTag("need")}
                className={`h-8 flex-1 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                  tag === "need"
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Need
              </button>
              <button
                type="button"
                onClick={() => setTag("want")}
                className={`h-8 flex-1 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                  tag === "want"
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Want
              </button>
              <button
                type="button"
                onClick={() => setTag("luxury")}
                className={`h-8 flex-1 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                  tag === "luxury"
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Luxury
              </button>
            </div>
          </div>

          {/* Priority & Category (Clean 2-column grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="h-10 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer font-medium transition"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer font-medium transition"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Category Input if "Other" is selected */}
          {category === "Other" && (
            <div>
              <input
                type="text"
                placeholder="Enter custom category name..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="h-10 w-full bg-[var(--surface-raised)] focus:bg-[var(--background)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none transition"
              />
            </div>
          )}

          {/* Pricing (Without browser spin-buttons) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[var(--muted)]">
                Estimated Price ({currency}) *
              </label>
              <button
                type="button"
                onClick={() => setShowPriceRange(!showPriceRange)}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition font-medium cursor-pointer"
              >
                {showPriceRange ? "Single price only" : "+ Add min/max range"}
              </button>
            </div>

            <div className="relative">
              <CurrencyInr
                size={16}
                className="text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="e.g. 5000"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="h-10 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl pl-8 pr-3.5 text-sm font-semibold tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {showPriceRange && (
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">
                    Min Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-10 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs tabular-nums text-[var(--foreground)] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">
                    Max Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-10 w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs tabular-nums text-[var(--foreground)] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Note
            </label>
            <textarea
              rows={2}
              placeholder="Why you want this, target date, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition resize-none"
            />
          </div>

          {/* Collaborative / Shared Wish Toggle */}
          <div
            onClick={() => setIsShared(!isShared)}
            className={`p-3.5 rounded-2xl cursor-pointer transition select-none flex items-center justify-between gap-3 ${
              isShared
                ? "bg-[var(--surface-raised)]"
                : "bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                  isShared
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--surface)] text-[var(--muted)]"
                }`}
              >
                <UsersThree size={17} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--foreground)] block">
                  Collaborative Wish
                </span>
                <span className="text-[11px] text-[var(--muted)] block">
                  Pool savings and track with friends (travel, trips, group gifts)
                </span>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                isShared ? "bg-[var(--primary)]" : "bg-[var(--muted)]/30"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isShared ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Store Comparison Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--muted)]">
                Store Links
              </label>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Store</span>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-2">
              {links.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2 p-2.5 sm:p-0 rounded-2xl bg-[var(--background)] sm:bg-transparent border border-[var(--border-subtle)] sm:border-0"
                >
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    <select
                      value={link.storeName}
                      onChange={(e) =>
                        handleUpdateLink(link.id, { storeName: e.target.value })
                      }
                      className="h-10 w-full sm:w-28 bg-[var(--surface-raised)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium shrink-0"
                    >
                      {COMMON_STORES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={link.price !== undefined ? link.price : ""}
                      onChange={(e) =>
                        handleUpdateLink(link.id, {
                          price: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="h-10 w-full sm:w-24 bg-[var(--surface-raised)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="url"
                      placeholder="https://store.com/item..."
                      value={link.url}
                      onChange={(e) =>
                        handleUpdateLink(link.id, { url: e.target.value })
                      }
                      className="h-10 w-full flex-1 bg-[var(--surface-raised)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none transition"
                    />

                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="h-10 w-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--surface-raised)] rounded-xl transition cursor-pointer shrink-0"
                        title="Remove link"
                      >
                        <Trash size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-xs font-semibold bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !estimatedPrice}
              className="h-10 px-6 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : wishToEdit
                ? "Update Wish"
                : "Save Wish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
