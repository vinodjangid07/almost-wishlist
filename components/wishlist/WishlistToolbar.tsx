"use client";

import React from "react";
import {
  useWishlist,
  SortOption,
  AffordabilityFilter,
} from "@/contexts/WishlistContext";
import { CaretDown } from "@phosphor-icons/react";

export const WishlistToolbar: React.FC = React.memo(() => {
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
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between py-1 select-none">
      {/* Segmented Classification Filter Tabs (Clean surface elevation, zero box borders) */}
      <div className="h-10 p-1 flex items-center gap-0.5 bg-[var(--surface)] rounded-xl shrink-0 self-start sm:self-auto">
        {(
          [
            { id: "all", label: "All" },
            { id: "need", label: "Need" },
            { id: "want", label: "Want" },
            { id: "luxury", label: "Luxury" },
          ] as const
        ).map((tab) => {
          const isActive = tagFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTagFilter(tab.id)}
              className={`h-8 px-3.5 rounded-[10px] text-xs font-medium flex items-center justify-center transition cursor-pointer ${
                isActive
                  ? "bg-[var(--foreground)] text-[var(--background)] font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: Clean Surface Select Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Select */}
        <div className="relative h-9">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 appearance-none bg-[var(--surface)] hover:bg-[var(--card-hover)] rounded-xl pl-3.5 pr-8 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="all">Category: All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <CaretDown
            size={11}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>

        {/* Affordability Select */}
        <div className="relative h-9">
          <select
            value={affordabilityFilter}
            onChange={(e) =>
              setAffordabilityFilter(e.target.value as AffordabilityFilter)
            }
            className="h-9 appearance-none bg-[var(--surface)] hover:bg-[var(--card-hover)] rounded-xl pl-3.5 pr-8 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="all">Status: All</option>
            <option value="affordable">Can afford now</option>
            <option value="unaffordable">Saving up</option>
          </select>
          <CaretDown
            size={11}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>

        {/* Sort Select */}
        <div className="relative h-9">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-9 appearance-none bg-[var(--surface)] hover:bg-[var(--card-hover)] rounded-xl pl-3.5 pr-8 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="priority-desc">Priority</option>
          </select>
          <CaretDown
            size={11}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
});

WishlistToolbar.displayName = "WishlistToolbar";
