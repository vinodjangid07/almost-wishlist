"use client";

import React, { useMemo, useCallback } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useSavings } from "@/contexts/SavingsContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const AnalyticsDashboard: React.FC = React.memo(() => {
  const { wishes } = useWishlist();
  const {
    currentSavings,
    totalWishlistCost,
    gap,
    affordabilityPercent,
    currency,
    needCost,
    wantCost,
    luxuryCost,
  } = useSavings();

  const activeWishes = useMemo(
    () => wishes.filter((w) => !w.isPurchased),
    [wishes]
  );

  const tagData = useMemo(() => {
    return [
      { name: "Need", value: needCost, color: "var(--muted)" },
      { name: "Want", value: wantCost, color: "var(--foreground)" },
      { name: "Luxury", value: luxuryCost, color: "var(--primary)" },
    ].filter((d) => d.value > 0);
  }, [needCost, wantCost, luxuryCost]);

  const affordabilityData = useMemo(() => {
    const savedAmount = Math.min(currentSavings, totalWishlistCost);
    return [
      { name: "Saved", value: savedAmount, color: "var(--accent-green)" },
      { name: "Gap Left", value: gap, color: "var(--surface-hover)" },
    ].filter((d) => d.value > 0);
  }, [currentSavings, totalWishlistCost, gap]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    activeWishes.forEach((w) => {
      const cat = w.category || "General";
      map[cat] = (map[cat] || 0) + (w.estimatedPrice || 0);
    });

    return Object.entries(map)
      .map(([category, cost]) => ({ category, cost }))
      .sort((a, b) => b.cost - a.cost);
  }, [activeWishes]);

  const top5Expensive = useMemo(() => {
    return [...activeWishes]
      .sort((a, b) => b.estimatedPrice - a.estimatedPrice)
      .slice(0, 5)
      .map((w) => ({
        name: w.title.length > 25 ? w.title.substring(0, 25) + "..." : w.title,
        price: w.estimatedPrice,
        tag: w.tag,
      }));
  }, [activeWishes]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customTooltip = useCallback(({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[var(--surface-raised)] p-3 rounded-xl text-xs">
          <p className="text-[var(--muted)] font-medium">
            {data.payload?.category || data.name}
          </p>
          <p className="font-bold tabular-nums text-[var(--foreground)] mt-0.5">
            {currency}{(Number(data.value) || 0).toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  }, [currency]);

  return (
    <div className="space-y-4 select-none">
      {/* Seamless Editorial Charts Grid (No decorative box borders, no round dots) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donut 1: Need vs Want vs Luxury */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <span className="text-xs text-[var(--muted)] block">
              Cost Breakdown
            </span>
            <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] mt-0.5">
              Need, Want &amp; Luxury
            </h3>
          </div>

          <div className="h-56 w-full my-4">
            {tagData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--muted)]">
                No items in wishlist to display
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={customTooltip} />
                  <Pie
                    data={tagData}
                    innerRadius={60}
                    outerRadius={84}
                    paddingAngle={3}
                    stroke="none"
                    dataKey="value"
                  >
                    {tagData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Typographic Legend with Architectural Bar Swatches (Zero Round Dots) */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="space-y-1.5">
              <div className="h-[2px] w-5 bg-[var(--muted)]" />
              <span className="text-[11px] text-[var(--muted)] block">Need</span>
              <span className="font-semibold tabular-nums text-[var(--foreground)] block">
                {currency}{needCost.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-[2px] w-5 bg-[var(--foreground)]" />
              <span className="text-[11px] text-[var(--muted)] block">Want</span>
              <span className="font-semibold tabular-nums text-[var(--foreground)] block">
                {currency}{wantCost.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-[2px] w-5 bg-[var(--primary)]" />
              <span className="text-[11px] text-[var(--muted)] block">Luxury</span>
              <span className="font-semibold tabular-nums text-[var(--primary)] block">
                {currency}{luxuryCost.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Donut 2: Savings vs Wishlist Gap */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] flex flex-col justify-between">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[var(--muted)] block">
                Affordability
              </span>
              <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] mt-0.5">
                Savings vs Remaining Gap
              </h3>
            </div>
            <span className="text-xs tabular-nums font-semibold text-[var(--primary)]">
              {affordabilityPercent}%
            </span>
          </div>

          <div className="h-56 w-full my-4">
            {affordabilityData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--muted)]">
                No items in wishlist
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={customTooltip} />
                  <Pie
                    data={affordabilityData}
                    innerRadius={60}
                    outerRadius={84}
                    paddingAngle={3}
                    stroke="none"
                    dataKey="value"
                  >
                    {affordabilityData.map((entry, index) => (
                      <Cell key={`cell-afford-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Typographic Legend with Architectural Bar Swatches */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <div className="h-[2px] w-5 bg-[var(--accent-green)]" />
              <span className="text-[11px] text-[var(--muted)] block">Saved</span>
              <span className="font-semibold tabular-nums text-[var(--accent-green)] block">
                {currency}{currentSavings.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-[2px] w-5 bg-[var(--surface-hover)]" />
              <span className="text-[11px] text-[var(--muted)] block">Gap Left</span>
              <span className="font-semibold tabular-nums text-[var(--foreground)] block">
                {currency}{gap.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart: Categories */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] flex flex-col justify-between md:col-span-2">
          <div className="mb-4">
            <span className="text-xs text-[var(--muted)] block">
              Categories
            </span>
            <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] mt-0.5">
              Cost per Category
            </h3>
          </div>

          <div
            className="w-full"
            style={{
              height:
                categoryData.length === 0
                  ? 220
                  : Math.max(220, categoryData.length * 46),
            }}
          >
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--muted)]">
                No category data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 6, right: 16, left: 4, bottom: 6 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-subtle)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="var(--muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v === 0
                        ? `${currency}0`
                        : v >= 1000
                        ? `${currency}${Math.round(v / 1000)}k`
                        : `${currency}${v}`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="var(--muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={136}
                    tickFormatter={(val: string) =>
                      val.length > 18 ? `${val.slice(0, 17)}…` : val
                    }
                  />
                  <Tooltip
                    content={customTooltip}
                    cursor={{ fill: "var(--background)", opacity: 0.6 }}
                  />
                  <Bar
                    dataKey="cost"
                    fill="var(--primary)"
                    fillOpacity={0.9}
                    barSize={22}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top 5 Most Expensive Items */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--surface)] md:col-span-2">
          <span className="text-xs text-[var(--muted)] block">
            Highest Target Cost
          </span>
          <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] mt-0.5 mb-5">
            Top 5 Wishes
          </h3>

          {top5Expensive.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">No active wishes in your list.</p>
          ) : (
            <div className="space-y-1">
              {top5Expensive.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl text-xs hover:bg-[var(--background)]/75 transition"
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="text-[11px] font-semibold tabular-nums text-[var(--muted)] w-5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="font-semibold text-sm text-[var(--foreground)] truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] capitalize shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-[var(--foreground)] shrink-0 ml-4">
                    {currency}{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AnalyticsDashboard.displayName = "AnalyticsDashboard";
