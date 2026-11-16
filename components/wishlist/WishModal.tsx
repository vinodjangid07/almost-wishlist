"use client";

import React, { useState, useEffect } from "react";
import { WishItem, TagType, PriorityLevel, ShoppingLink } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import { X, UploadSimple, Plus, Trash, CurrencyInr } from "@phosphor-icons/react";

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishToEdit?: WishItem | null;
}

const COMMON_STORES = ["Amazon", "Flipkart", "Myntra", "Apple", "Nike", "Other"];
const DEFAULT_CATEGORIES = [
  "Tech & Electronics",
  "Clothing & Shoes",
  "Home & Living",
  "Books & Learning",
  "Fitness & Sports",
  "Travel & Outings",
  "Gaming",
];

export const WishModal: React.FC<WishModalProps> = ({ isOpen, onClose, wishToEdit }) => {
  const { addWish, updateWish } = useWishlist();
  const { currency } = useSavings();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech & Electronics");
  const [customCategory, setCustomCategory] = useState("");
  const [tag, setTag] = useState<TagType>("want");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [estimatedPrice, setEstimatedPrice] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showPriceRange, setShowPriceRange] = useState(false);

  // Links repeater
  const [links, setLinks] = useState<ShoppingLink[]>([
    { id: "link-1", storeName: "Amazon", url: "", price: undefined },
  ]);

  // Image upload & preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (wishToEdit) {
      setTitle(wishToEdit.title);
      setDescription(wishToEdit.description || "");
      if (DEFAULT_CATEGORIES.includes(wishToEdit.category)) {
        setCategory(wishToEdit.category);
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
      setCategory("Tech & Electronics");
      setCustomCategory("");
      setTag("want");
      setPriority("medium");
      setEstimatedPrice("");
      setMinPrice("");
      setMaxPrice("");
      setShowPriceRange(false);
      setLinks([{ id: "link-1", storeName: "Amazon", url: "", price: undefined }]);
      setImagePreview("");
      setImageFile(null);
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
          isPurchased: false,
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

        <span className="text-xs font-semibold text-[var(--primary)] block mb-1">
          {wishToEdit ? "Edit Item" : "New Wish"}
        </span>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-5">
          {wishToEdit ? "Edit Wish Details" : "Add to Wishlist"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image & Preview */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Item Photo
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full sm:w-28 h-20 rounded-2xl bg-[var(--background)] overflow-hidden flex items-center justify-center relative shrink-0">
                {imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Wish preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-white hover:bg-black transition cursor-pointer"
                    >
                      <Trash size={12} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[var(--muted)] font-medium">No photo</span>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="h-9 flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--background)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--foreground)] cursor-pointer transition">
                  <UploadSimple size={15} />
                  <span>Choose Image File</span>
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
                  className="h-9 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony Headphones, Winter Jacket, Coffee Maker"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3.5 text-xs sm:text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
              Note
            </label>
            <textarea
              rows={2}
              placeholder="Write why you want this, target date, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition resize-none"
            />
          </div>

          {/* Tag, Priority & Category (Exact unified h-10 row controls) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Tag */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Classification
              </label>
              <div className="h-10 p-1 bg-[var(--background)] rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTag("need")}
                  className={`h-8 flex-1 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                    tag === "need"
                      ? "bg-[var(--surface)] text-[var(--foreground)]"
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
                      ? "bg-[var(--surface)] text-[var(--foreground)]"
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
                      ? "bg-[var(--surface)] text-[var(--primary)] font-bold"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Luxury
                </button>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="h-10 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer font-medium"
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
                className="h-10 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer font-medium"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Custom...</option>
              </select>
            </div>
          </div>

          {category === "Other" && (
            <div>
              <input
                type="text"
                placeholder="Enter custom category name..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="h-10 w-full bg-[var(--background)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none"
              />
            </div>
          )}

          {/* Pricing (Flat surface, zero card-in-card) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[var(--muted)]">
                Estimated Price ({currency}) *
              </label>
              <button
                type="button"
                onClick={() => setShowPriceRange(!showPriceRange)}
                className="text-xs text-[var(--primary)] hover:opacity-80 transition font-medium cursor-pointer"
              >
                {showPriceRange ? "— Single price" : "+ Add min/max range"}
              </button>
            </div>

            <div className="relative">
              <CurrencyInr
                size={16}
                className="text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="e.g. 5000"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="h-10 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl pl-8 pr-3.5 text-sm font-semibold tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
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
                    className="h-10 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
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
                    className="h-10 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Multi-Store Comparison Links (Flat rows with unified h-10 controls) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--muted)]">
                Store Links
              </label>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs text-[var(--primary)] hover:opacity-80 transition inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Store</span>
              </button>
            </div>

            <div className="space-y-2">
              {links.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="flex flex-col sm:flex-row gap-2 items-center"
                >
                  <select
                    value={link.storeName}
                    onChange={(e) =>
                      handleUpdateLink(link.id, { storeName: e.target.value })
                    }
                    className="h-10 w-full sm:w-28 bg-[var(--background)] hover:bg-[var(--surface-hover)] rounded-xl px-3 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
                  >
                    {COMMON_STORES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <input
                    type="url"
                    placeholder="https://store.com/item..."
                    value={link.url}
                    onChange={(e) =>
                      handleUpdateLink(link.id, { url: e.target.value })
                    }
                    className="h-10 flex-1 w-full bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                  />

                  <input
                    type="number"
                    placeholder="Price ₹"
                    value={link.price !== undefined ? link.price : ""}
                    onChange={(e) =>
                      handleUpdateLink(link.id, {
                        price: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="h-10 w-full sm:w-24 bg-[var(--background)] hover:bg-[var(--surface-hover)] focus:bg-[var(--background)] rounded-xl px-3 text-xs tabular-nums text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.id)}
                    className="h-10 w-10 flex items-center justify-center text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--background)] rounded-xl transition cursor-pointer shrink-0"
                    title="Remove link"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-xs font-semibold bg-[var(--background)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer"
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
