"use client";

import React, { useMemo } from "react";
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

export const AnalyticsDashboard: React.FC = () => {
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
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[var(--surface-raised)] p-2.5 rounded-xl text-xs ring-1 ring-[var(--surface-hover)]">
          <p className="text-[var(--muted)] font-medium">{data.name || data.payload.category}</p>
          <p className="font-bold tabular-nums text-[var(--foreground)] mt-0.5">
            {currency}{(Number(data.value) || 0).toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 select-none">
      {/* Bento Charts Grid (Duplicated KPI stat cards removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Donut 1: Need vs Want vs Luxury */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-[var(--muted)] block">
              Cost Breakdown
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] block mt-0.5">
              Need vs Want vs Luxury
            </span>
          </div>

          <div className="h-52 w-full my-2">
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
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
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

          <div className="flex justify-center gap-4 text-xs pt-1 text-[var(--muted)]">
            <span>Need: {currency}{needCost.toLocaleString("en-IN")}</span>
            <span>Want: {currency}{wantCost.toLocaleString("en-IN")}</span>
            <span className="text-[var(--primary)] font-medium">Luxury: {currency}{luxuryCost.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Donut 2: Savings vs Wishlist Gap */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-[var(--muted)] block">
              Affordability
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] block mt-0.5">
              Savings vs Remaining Gap
            </span>
          </div>

          <div className="h-52 w-full my-2">
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
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
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

          <div className="flex justify-center gap-6 text-xs pt-1">
            <span className="text-[var(--accent-green)] font-medium">Saved: {currency}{currentSavings.toLocaleString("en-IN")}</span>
            <span className="text-[var(--muted)]">Gap: {currency}{gap.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Bar Chart: Categories */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] flex flex-col justify-between md:col-span-2">
          <div>
            <span className="text-xs font-medium text-[var(--muted)] block">
              Categories
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] block mt-0.5">
              Cost per Category
            </span>
          </div>

          <div className="h-56 w-full my-2">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--muted)]">
                No category data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-raised)" opacity={0.6} />
                  <XAxis
                    dataKey="category"
                    stroke="var(--muted)"
                    fontSize={11}
                    interval={0}
                    textAnchor="end"
                  />
                  <YAxis stroke="var(--muted)" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="cost" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top 5 Most Expensive Items */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] md:col-span-2">
          <span className="text-xs font-medium text-[var(--muted)] block">
            Most Expensive Items
          </span>
          <h4 className="text-sm font-semibold text-[var(--foreground)] mt-0.5 mb-3">
            Top 5 Highest Priced Wishes
          </h4>

          {top5Expensive.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">No active wishes in your list.</p>
          ) : (
            <div className="space-y-2">
              {top5Expensive.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-raised)] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--surface-hover)] flex items-center justify-center font-bold text-[11px] text-[var(--primary)]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[var(--foreground)]">{item.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)]">
                      {item.tag}
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-[var(--foreground)]">
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
};
