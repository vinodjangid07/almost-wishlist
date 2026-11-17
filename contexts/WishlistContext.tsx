"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { WishItem, TagType, PriorityLevel, WishMember } from "@/types";
import { useAuth } from "./AuthContext";
import {
  collection,
  query,
  where,
  or,
  limit,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
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
  toggleFulfilled: (id: string) => Promise<void>;
  togglePurchased: (id: string) => Promise<void>; // Alias for backward compatibility
  joinSharedWish: (inviteCodeOrUrl: string) => Promise<{ success: boolean; message: string; wishId?: string }>;
  updateMemberContribution: (wishId: string, amount: number) => Promise<void>;
  leaveSharedWish: (wishId: string) => Promise<void>;
}

const LOCAL_STORAGE_KEY = "almost_wishes_backup";

const generateInviteCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

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

  // Load / Sync wishes in real-time
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      localStorage.setItem("almost_last_uid", user.uid);

      try {
        // Query wishes where user is either the creator (userId) or an invited collaborator (memberUids)
        const q = query(
          collection(db, "wishes"),
          or(
            where("userId", "==", user.uid),
            where("memberUids", "array-contains", user.uid)
          )
        );

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const items: WishItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              const fulfilled = Boolean(data.isFulfilled ?? data.isPurchased);
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
                isFulfilled: fulfilled,
                isPurchased: fulfilled, // backward compatibility
                isShared: Boolean(data.isShared),
                memberUids: Array.isArray(data.memberUids) ? data.memberUids : [data.userId || user.uid],
                members: data.members || undefined,
                inviteCode: data.inviteCode || undefined,
                createdAt: Number(data.createdAt) || Date.now(),
                updatedAt: Number(data.updatedAt) || Date.now(),
              });
            });

            // Sort newest first by default in memory
            items.sort((a, b) => b.createdAt - a.createdAt);

            setWishes(items);
            try {
              localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(items));
            } catch {
              // ignore storage quotas
            }
            setLoading(false);
          },
          (err) => {
            console.warn("Firestore listener fallback to local backup:", err.message);
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

  const addWish = useCallback(
    async (
      itemData: Omit<WishItem, "id" | "userId" | "createdAt" | "updatedAt">
    ): Promise<string> => {
      const now = Date.now();
      const isShared = Boolean(itemData.isShared);
      const inviteCode = isShared ? (itemData.inviteCode || generateInviteCode()) : undefined;

      const ownerMember: WishMember | undefined = user
        ? {
            uid: user.uid,
            displayName: user.displayName || "Creator",
            email: user.email || "",
            photoURL: user.photoURL || "",
            savedAmount: 0,
            role: "owner",
            joinedAt: now,
          }
        : undefined;

      const memberUids = user ? [user.uid] : ["guest"];
      const members: Record<string, WishMember> = user && ownerMember ? { [user.uid]: ownerMember } : {};

      const fulfilled = Boolean(itemData.isFulfilled ?? itemData.isPurchased);

      if (user) {
        try {
          const cleanPayload = cleanUndefined({
            ...itemData,
            userId: user.uid,
            isFulfilled: fulfilled,
            isPurchased: fulfilled,
            isShared,
            memberUids,
            members: isShared ? members : undefined,
            inviteCode,
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
            isFulfilled: fulfilled,
            isPurchased: fulfilled,
            isShared,
            memberUids,
            members: isShared ? members : undefined,
            inviteCode,
            createdAt: now,
            updatedAt: now,
          };
          setWishes((prev) => {
            const updated = [newWish, ...prev];
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(updated));
            return updated;
          });
          return tempId;
        }
      } else {
        const tempId = `guest_wish_${now}`;
        const newWish: WishItem = {
          ...itemData,
          id: tempId,
          userId: "guest",
          isFulfilled: fulfilled,
          isPurchased: fulfilled,
          isShared,
          memberUids,
          members: isShared ? { guest: { uid: "guest", displayName: "You", savedAmount: 0, role: "owner", joinedAt: now } } : undefined,
          inviteCode,
          createdAt: now,
          updatedAt: now,
        };
        setWishes((prev) => {
          const updated = [newWish, ...prev];
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_guest`, JSON.stringify(updated));
          return updated;
        });
        return tempId;
      }
    },
    [user]
  );

  const updateWish = useCallback(
    async (id: string, updates: Partial<WishItem>) => {
      const now = Date.now();
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.isFulfilled !== undefined) {
        sanitizedUpdates.isPurchased = sanitizedUpdates.isFulfilled;
      } else if (sanitizedUpdates.isPurchased !== undefined) {
        sanitizedUpdates.isFulfilled = sanitizedUpdates.isPurchased;
      }

      // Optimistic update: instantly reflect changes in state and local storage
      setWishes((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, ...sanitizedUpdates, updatedAt: now } : item
        );
        if (user) {
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(updated));
          } catch {
            // ignore
          }
        } else {
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_guest`, JSON.stringify(updated));
        }
        return updated;
      });

      // Persist changes to Firestore
      if (user && !id.startsWith("guest_") && !id.startsWith("sample-")) {
        try {
          const docRef = doc(db, "wishes", id);
          await updateDoc(docRef, cleanUndefined({ ...sanitizedUpdates, updatedAt: now }));
        } catch (err) {
          console.warn("Firestore update failed:", err);
        }
      }
    },
    [user]
  );

  const deleteWish = useCallback(
    async (id: string) => {
      if (user && !id.startsWith("guest_") && !id.startsWith("sample-")) {
        try {
          await deleteDoc(doc(db, "wishes", id));
          return;
        } catch (err) {
          console.warn("Firestore delete failed, updating local state:", err);
        }
      }
      setWishes((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        if (user) {
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(updated));
        } else {
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_guest`, JSON.stringify(updated));
        }
        return updated;
      });
    },
    [user]
  );

  const toggleFulfilled = useCallback(
    async (id: string) => {
      const item = wishes.find((w) => w.id === id);
      if (!item) return;
      const nextStatus = !Boolean(item.isFulfilled ?? item.isPurchased);
      await updateWish(id, { isFulfilled: nextStatus, isPurchased: nextStatus });
    },
    [wishes, updateWish]
  );

  // Update an individual member's contribution to a shared wish
  const updateMemberContribution = useCallback(
    async (wishId: string, amount: number) => {
      if (!user) return;
      const targetWish = wishes.find((w) => w.id === wishId);
      if (!targetWish) return;

      const existingMembers = targetWish.members || {};
      const currentMember = existingMembers[user.uid] || {
        uid: user.uid,
        displayName: user.displayName || "Member",
        email: user.email || "",
        photoURL: user.photoURL || "",
        savedAmount: 0,
        role: targetWish.userId === user.uid ? "owner" : "member",
        joinedAt: Date.now(),
      };

      const updatedMembers = {
        ...existingMembers,
        [user.uid]: {
          ...currentMember,
          savedAmount: Math.max(0, amount),
        },
      };

      await updateWish(wishId, { members: updatedMembers });
    },
    [user, wishes, updateWish]
  );

  // Join a shared wish using an invite code (or direct link with code)
  const joinSharedWish = useCallback(
    async (
      codeOrInput: string
    ): Promise<{ success: boolean; message: string; wishId?: string }> => {
      if (!user) {
        return { success: false, message: "Please sign in to join shared wishes." };
      }

      // Extract code if user pasted a full URL
      let code = codeOrInput.trim().toUpperCase();
      if (code.includes("/")) {
        const parts = code.split("/");
        code = parts[parts.length - 1].trim().toUpperCase();
      }

      if (!code || code.length < 4) {
        return { success: false, message: "Please enter a valid invite code." };
      }

      try {
        const q = query(
          collection(db, "wishes"),
          where("inviteCode", "==", code),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          return { success: false, message: "No wish found with this invite code. Check and try again." };
        }

        const docSnap = snapshot.docs[0];
        const wishData = docSnap.data();

        // Check if user is already a member
        const currentMembers = (wishData.memberUids as string[]) || [];
        if (currentMembers.includes(user.uid)) {
          return {
            success: true,
            message: `You are already part of "${wishData.title}"!`,
            wishId: docSnap.id,
          };
        }

        const newMember: WishMember = {
          uid: user.uid,
          displayName: user.displayName || "Friend",
          email: user.email || "",
          photoURL: user.photoURL || "",
          savedAmount: 0,
          role: "member",
          joinedAt: Date.now(),
        };

        const wishDocRef = doc(db, "wishes", docSnap.id);
        await updateDoc(wishDocRef, {
          memberUids: arrayUnion(user.uid),
          [`members.${user.uid}`]: newMember,
          updatedAt: Date.now(),
        });

        return {
          success: true,
          message: `Joined "${wishData.title}" successfully!`,
          wishId: docSnap.id,
        };
      } catch (err: unknown) {
        console.error("Error joining shared wish:", err);
        return {
          success: false,
          message: err instanceof Error ? err.message : "Failed to join shared wish.",
        };
      }
    },
    [user]
  );

  // Leave a shared wish
  const leaveSharedWish = useCallback(
    async (wishId: string) => {
      if (!user) return;
      const targetWish = wishes.find((w) => w.id === wishId);
      if (!targetWish) return;

      if (targetWish.userId === user.uid) {
        throw new Error("As the creator, you cannot leave this wish. You can delete it instead.");
      }

      try {
        const wishDocRef = doc(db, "wishes", wishId);
        // Remove from memberUids
        await updateDoc(wishDocRef, {
          memberUids: arrayRemove(user.uid),
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error("Error leaving shared wish:", err);
      }
    },
    [user, wishes]
  );

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
    const q = searchQuery.trim().toLowerCase();
    return wishes
      .filter((item) => {
        // Search query (title, description, category, store)
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q) || false;
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

  const contextValue = useMemo(
    () => ({
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
      toggleFulfilled,
      togglePurchased: toggleFulfilled, // alias for backward compatibility
      joinSharedWish,
      updateMemberContribution,
      leaveSharedWish,
    }),
    [
      wishes,
      loading,
      searchQuery,
      tagFilter,
      categoryFilter,
      priorityFilter,
      affordabilityFilter,
      sortBy,
      categories,
      filteredWishes,
      addWish,
      updateWish,
      deleteWish,
      toggleFulfilled,
      joinSharedWish,
      updateMemberContribution,
      leaveSharedWish,
    ]
  );

  return (
    <WishlistContext.Provider value={contextValue}>
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
