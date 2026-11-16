export type TagType = 'need' | 'want' | 'luxury';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface ShoppingLink {
  id: string;
  storeName: string; // e.g. Amazon, Flipkart, Myntra, Official, etc.
  url: string;
  price?: number;
}

export interface WishItem {
  id: string;
  userId: string;
  title: string;
  description?: string; // "Why I want this"
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
  isPurchased: boolean;
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
