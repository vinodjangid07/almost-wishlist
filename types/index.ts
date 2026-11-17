export type TagType = 'need' | 'want' | 'luxury';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface ShoppingLink {
  id: string;
  storeName: string; // e.g. Amazon, Flipkart, Myntra, Official, Booking, etc.
  url: string;
  price?: number;
}

export interface WishMember {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  savedAmount: number; // what this individual has contributed/saved towards the goal
  role: "owner" | "member";
  joinedAt: number;
}

export interface WishItem {
  id: string;
  userId: string;
  title: string;
  description?: string; // "Why I want this" or notes for friends
  imageUrl?: string;
  storagePath?: string;
  category: string;
  tag: TagType; // 'need' | 'want' | 'luxury'
  priority: PriorityLevel; // 'low' | 'medium' | 'high'
  estimatedPrice: number;
  minPrice?: number;
  maxPrice?: number;
  currency: string;
  links: ShoppingLink[];
  
  // Fulfillment status (replaces bought/purchased for both products & experiences)
  isFulfilled: boolean;
  isPurchased?: boolean; // backwards-compatible alias

  // Collaborative / Shared Wish fields
  isShared?: boolean;
  memberUids?: string[];
  members?: Record<string, WishMember>;
  inviteCode?: string;

  createdAt: number; // Unix timestamp for robust serialization
  updatedAt: number;
}

export interface DepositLog {
  id: string;
  userId: string;
  amount: number;
  note?: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  currentSavings: number;
  currency: string;
  updatedAt: number;
}

export interface WishlistSummary {
  totalItems: number;
  totalCost: number;
  needCost: number;
  wantCost: number;
  luxuryCost: number;
  currentSavings: number;
  gap: number;
  affordabilityPercent: number;
}
