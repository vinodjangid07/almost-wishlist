"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useWishlist } from "./WishlistContext";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SavingsContextType {
  currentSavings: number;
  totalWishlistCost: number;
  needCost: number;
  wantCost: number;
  luxuryCost: number;
  gap: number;
  affordabilityPercent: number;
  currency: string;
  updateSavings: (amount: number) => Promise<void>;
  canAfford: (price: number) => boolean;
}

const LOCAL_STORAGE_SAVINGS_KEY = "almost_current_savings";

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { wishes } = useWishlist();

  // Consistent SSR initial state (0)
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const currency = "₹";

  // Immediate client-side cache hydration (runs after initial mount to prevent SSR hydration mismatch)
  useEffect(() => {
    try {
      const lastUid = localStorage.getItem("almost_last_uid") || "guest";
      const local = localStorage.getItem(`${LOCAL_STORAGE_SAVINGS_KEY}_${lastUid}`);
      if (local) {
        setCurrentSavings(Number(local) || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load savings
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const val = Number(data.currentSavings) || 0;
              setCurrentSavings(val);
              localStorage.setItem(`${LOCAL_STORAGE_SAVINGS_KEY}_${user.uid}`, val.toString());
            } else {
              // Check local backup
              const local = localStorage.getItem(`${LOCAL_STORAGE_SAVINGS_KEY}_${user.uid}`);
              if (local) setCurrentSavings(Number(local) || 0);
            }
          },
          (err) => {
            console.warn("Firestore user savings fallback:", err.message);
            const local = localStorage.getItem(`${LOCAL_STORAGE_SAVINGS_KEY}_${user.uid}`);
            if (local) setCurrentSavings(Number(local) || 0);
          }
        );
        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up user doc listener:", err);
      }
    } else {
      // Confirmed genuine guest mode
      const local = localStorage.getItem(`${LOCAL_STORAGE_SAVINGS_KEY}_guest`);
      if (local) {
        setCurrentSavings(Number(local) || 0);
      } else {
        setCurrentSavings(0);
      }
    }
  }, [user, authLoading]);

  // Direct savings update / alter
  const updateSavings = async (newAmount: number) => {
    const sanitized = Math.max(0, isNaN(newAmount) ? 0 : newAmount);
    setCurrentSavings(sanitized);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { currentSavings: sanitized, updatedAt: Date.now() }, { merge: true });
        localStorage.setItem(`${LOCAL_STORAGE_SAVINGS_KEY}_${user.uid}`, sanitized.toString());
        return;
      } catch (err) {
        console.warn("Firestore setDoc failed, local fallback:", err);
      }
      localStorage.setItem(`${LOCAL_STORAGE_SAVINGS_KEY}_${user.uid}`, sanitized.toString());
    } else {
      localStorage.setItem(`${LOCAL_STORAGE_SAVINGS_KEY}_guest`, sanitized.toString());
    }
  };

  // Wishlist cost breakdowns (unpurchased items)
  const { totalWishlistCost, needCost, wantCost, luxuryCost } = useMemo(() => {
    let total = 0;
    let need = 0;
    let want = 0;
    let luxury = 0;

    wishes.forEach((w) => {
      if (!w.isPurchased) {
        const cost = w.estimatedPrice || 0;
        total += cost;
        if (w.tag === "need") need += cost;
        else if (w.tag === "want") want += cost;
        else if (w.tag === "luxury") luxury += cost;
      }
    });

    return { totalWishlistCost: total, needCost: need, wantCost: want, luxuryCost: luxury };
  }, [wishes]);

  // Gap: "You have ₹X, you need ₹Y, gap is ₹Z"
  const gap = useMemo(() => {
    return Math.max(0, totalWishlistCost - currentSavings);
  }, [totalWishlistCost, currentSavings]);

  // Affordability percentage: 0 to 100%
  const affordabilityPercent = useMemo(() => {
    if (totalWishlistCost <= 0) return 0;
    return Math.min(100, Math.round((currentSavings / totalWishlistCost) * 100));
  }, [currentSavings, totalWishlistCost]);

  const canAfford = (price: number) => {
    return currentSavings >= price;
  };

  return (
    <SavingsContext.Provider
      value={{
        currentSavings,
        totalWishlistCost,
        needCost,
        wantCost,
        luxuryCost,
        gap,
        affordabilityPercent,
        currency,
        updateSavings,
        canAfford,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
};
