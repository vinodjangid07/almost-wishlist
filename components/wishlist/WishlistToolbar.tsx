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
    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between select-none">
      {/* Segmented Classification Filter Pills (Exact h-10 matching sidebar controls) */}
      <div className="h-10 p-1 flex items-center gap-1 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shrink-0 self-start sm:self-auto">
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
              className={`h-8 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                isActive
                  ? "bg-[var(--foreground)] text-[var(--background)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: Dropdown Filters (Exact h-10 matching baseline) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Select */}
        <div className="relative h-10">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 appearance-none bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl pl-3.5 pr-8 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>

        {/* Affordability Select */}
        <div className="relative h-10">
          <select
            value={affordabilityFilter}
            onChange={(e) =>
              setAffordabilityFilter(e.target.value as AffordabilityFilter)
            }
            className="h-10 appearance-none bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl pl-3.5 pr-8 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="all">Status: All</option>
            <option value="affordable">Can afford now</option>
            <option value="unaffordable">Saving up</option>
          </select>
          <CaretDown
            size={12}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>

        {/* Sort Select */}
        <div className="relative h-10">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 appearance-none bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--surface-hover)] rounded-xl pl-3.5 pr-8 text-xs text-[var(--foreground)] focus:outline-none cursor-pointer transition font-medium"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="priority-desc">Priority</option>
          </select>
          <CaretDown
            size={12}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
});

WishlistToolbar.displayName = "WishlistToolbar";
