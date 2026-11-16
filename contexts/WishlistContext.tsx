"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { WishItem, TagType, PriorityLevel } from "@/types";
import { useAuth } from "./AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SortOption = "date-desc" | "date-asc" | "price-desc" | "price-asc" | "priority-desc";
export type AffordabilityFilter = "all" | "affordable" | "unaffordable";

interface WishlistContextType {
  wishes: WishItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  tagFilter: "all" | TagType;
  setTagFilter: (t: "all" | TagType) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  priorityFilter: "all" | PriorityLevel;
  setPriorityFilter: (p: "all" | PriorityLevel) => void;
  affordabilityFilter: AffordabilityFilter;
  setAffordabilityFilter: (a: AffordabilityFilter) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  categories: string[];
  filteredWishes: WishItem[];
  addWish: (item: Omit<WishItem, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<string>;
  updateWish: (id: string, updates: Partial<WishItem>) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
  togglePurchased: (id: string) => Promise<void>;
}

const LOCAL_STORAGE_KEY = "almost_wishes_backup";

// Firestore rejects 'undefined' values, so we sanitize objects before writing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanUndefined = (obj: Record<string, any>) => {
  const clean: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  
  // Clean initial state matching server SSR (empty array)
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<"all" | TagType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | PriorityLevel>("all");
  const [affordabilityFilter, setAffordabilityFilter] = useState<AffordabilityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Immediate client-side cache hydration (runs after initial mount to prevent SSR hydration mismatch)
  useEffect(() => {
    try {
      const lastUid = localStorage.getItem("almost_last_uid") || "guest";
      const local = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${lastUid}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
          setLoading(false);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Load / Sync wishes
  useEffect(() => {
    // If auth is still resolving in background, do NOT assume guest or mark loading as false
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      // Save last user id for instantaneous hydration on next page reload
      localStorage.setItem("almost_last_uid", user.uid);

      try {
        const q = query(collection(db, "wishes"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const items: WishItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              items.push({
                id: docSnap.id,
                userId: data.userId || user.uid,
                title: data.title || "",
                description: data.description || "",
                imageUrl: data.imageUrl || "",
                storagePath: data.storagePath || "",
                category: data.category || "General",
                tag: data.tag || "want",
                priority: data.priority || "medium",
                estimatedPrice: Number(data.estimatedPrice) || 0,
                minPrice: data.minPrice !== undefined ? Number(data.minPrice) : undefined,
                maxPrice: data.maxPrice !== undefined ? Number(data.maxPrice) : undefined,
                currency: data.currency || "INR",
                links: Array.isArray(data.links) ? data.links : [],
                isPurchased: Boolean(data.isPurchased),
                createdAt: Number(data.createdAt) || Date.now(),
                updatedAt: Number(data.updatedAt) || Date.now(),
              });
            });
            setWishes(items);
            // Backup locally
            try {
              localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(items));
            } catch {
              // ignore storage quotas
            }
            setLoading(false);
          },
          (err) => {
            console.warn("Firestore listener fallback to local backup:", err.message);
            // Fallback to local storage if Firestore rules/network blocked
            const local = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${user.uid}`);
            if (local) {
              try {
                setWishes(JSON.parse(local));
              } catch {
                // ignore
              }
            }
            setLoading(false);
          }
        );
        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up firestore listener:", err);
        setLoading(false);
      }
    } else {
      // Confirmed genuine guest mode (authLoading is false and user is null)
      localStorage.setItem("almost_last_uid", "guest");
      const local = localStorage.getItem(`${LOCAL_STORAGE_KEY}_guest`);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          const realItems = Array.isArray(parsed)
            ? parsed.filter((w: WishItem) => !w.id.startsWith("sample-"))
            : [];
          setWishes(realItems);
        } catch {
          setWishes([]);
        }
      } else {
        setWishes([]);
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  // Save guest changes to local storage
  const saveGuestWishes = (items: WishItem[]) => {
    setWishes(items);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_guest`, JSON.stringify(items));
  };

  const addWish = async (
    itemData: Omit<WishItem, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    const now = Date.now();
    if (user) {
      try {
        const cleanPayload = cleanUndefined({
          ...itemData,
          userId: user.uid,
          createdAt: now,
          updatedAt: now,
        });
        const docRef = await addDoc(collection(db, "wishes"), cleanPayload);
        return docRef.id;
      } catch (err) {
        console.warn("Firestore write failed, falling back to local state:", err);
        const tempId = `wish_${now}`;
        const newWish: WishItem = {
          ...itemData,
          id: tempId,
          userId: user.uid,
          createdAt: now,
          updatedAt: now,
        };
        const updated = [newWish, ...wishes];
        setWishes(updated);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(updated));
        return tempId;
      }
    } else {
      const tempId = `guest_wish_${now}`;
      const newWish: WishItem = {
        ...itemData,
        id: tempId,
        userId: "guest",
        createdAt: now,
        updatedAt: now,
      };
      saveGuestWishes([newWish, ...wishes]);
      return tempId;
    }
  };

  const updateWish = async (id: string, updates: Partial<WishItem>) => {
    const now = Date.now();
    if (user && !id.startsWith("guest_") && !id.startsWith("sample-")) {
      try {
        const docRef = doc(db, "wishes", id);
        await updateDoc(docRef, cleanUndefined({ ...updates, updatedAt: now }));
        return;
      } catch (err) {
        console.warn("Firestore update failed, updating local state:", err);
      }
    }
    const updated = wishes.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: now } : item
    );
    if (user) {
      setWishes(updated);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(updated));
    } else {
      saveGuestWishes(updated);
    }
  };

  const deleteWish = async (id: string) => {
    if (user && !id.startsWith("guest_") && !id.startsWith("sample-")) {
      try {
        await deleteDoc(doc(db, "wishes", id));
        return;
      } catch (err) {
        console.warn("Firestore delete failed, updating local state:", err);
      }
    }
    const updated = wishes.filter((item) => item.id !== id);
    if (user) {
      setWishes(updated);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(updated));
    } else {
      saveGuestWishes(updated);
    }
  };

  const togglePurchased = async (id: string) => {
    const item = wishes.find((w) => w.id === id);
    if (!item) return;
    await updateWish(id, { isPurchased: !item.isPurchased });
  };

  // Derive unique categories from active wishes
  const categories = useMemo(() => {
    const set = new Set<string>();
    wishes.forEach((w) => {
      if (w.category && w.category.trim()) {
        set.add(w.category.trim());
      }
    });
    return Array.from(set);
  }, [wishes]);

  // Filtered & Sorted wishes
  const filteredWishes = useMemo(() => {
    return wishes
      .filter((item) => {
        // Search query (title, description, category, store)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchStore = item.links.some((l) => l.storeName.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchStore) return false;
        }

        // Tag filter
        if (tagFilter !== "all" && item.tag !== tagFilter) return false;

        // Category filter
        if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return b.createdAt - a.createdAt;
        if (sortBy === "date-asc") return a.createdAt - b.createdAt;
        if (sortBy === "price-desc") return b.estimatedPrice - a.estimatedPrice;
        if (sortBy === "price-asc") return a.estimatedPrice - b.estimatedPrice;
        if (sortBy === "priority-desc") {
          const score = { high: 3, medium: 2, low: 1 };
          return (score[b.priority] || 0) - (score[a.priority] || 0);
        }
        return 0;
      });
  }, [wishes, searchQuery, tagFilter, categoryFilter, priorityFilter, sortBy]);

  return (
    <WishlistContext.Provider
      value={{
        wishes,
        loading,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        categoryFilter,
        setCategoryFilter,
        priorityFilter,
        setPriorityFilter,
        affordabilityFilter,
        setAffordabilityFilter,
        sortBy,
        setSortBy,
        categories,
        filteredWishes,
        addWish,
        updateWish,
        deleteWish,
        togglePurchased,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
