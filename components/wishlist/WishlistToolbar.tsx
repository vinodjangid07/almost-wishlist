"use client";

import React from "react";
import { useWishlist, SortOption, AffordabilityFilter } from "@/contexts/WishlistContext";
import { CaretDown } from "@phosphor-icons/react";

export const WishlistToolbar: React.FC = () => {
  const {
    tagFilter,
    setTagFilter,
    categoryFilter,
    setCategoryFilter,
    affordabilityFilter,
    setAffordabilityFilter,
    sortBy,
    setSortBy,
    categories,
  } = useWishlist();

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between select-none pt-1">
      {/* Segmented Classification Filter Pills (Exact h-9 container) */}
      <div className="h-9 p-1 flex items-center gap-1 bg-[var(--surface)] rounded-xl shrink-0 self-start sm:self-auto">
        <button
          onClick={() => setTagFilter("all")}
          className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
            tagFilter === "all"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setTagFilter("need")}
          className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
            tagFilter === "need"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          Need
        </button>
        <button
          onClick={() => setTagFilter("want")}
          className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
            tagFilter === "want"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          Want
        </button>
        <button
          onClick={() => setTagFilter("luxury")}
          className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
            tagFilter === "luxury"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          Luxury
        </button>
      </div>

      {/* Right: Dropdown Filters (Category, Affordability Status, Sort - all exact h-9) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Select */}
        <div className="relative h-9">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 appearance-none bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl pl-3 pr-7 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="all">Category: All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <CaretDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>

        {/* Affordability Select */}
        <div className="relative h-9">
          <select
            value={affordabilityFilter}
            onChange={(e) => setAffordabilityFilter(e.target.value as AffordabilityFilter)}
            className="h-9 appearance-none bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl pl-3 pr-7 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="all">Status: All</option>
            <option value="affordable">Can afford now</option>
            <option value="unaffordable">Saving up</option>
          </select>
          <CaretDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>

        {/* Sort Select */}
        <div className="relative h-9">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-9 appearance-none bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl pl-3 pr-7 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="priority-desc">Priority</option>
          </select>
          <CaretDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};
