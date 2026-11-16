/**
 * Standalone Seed Script for "almost" wishlist.
 *
 * This script seeds 6 curated luxury products into Firestore for a given user UID.
 * 
 * Usage:
 *   node scripts/seed-wishes.mjs <USER_UID>
 * 
 * Or run from browser console on http://localhost:3000/app:
 *   window.__seedShowcaseWishes()
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtc5nfONk4OiZfD0SGZ25nSecai_eaXrI",
  authDomain: "almost-wishlist-e98ea.firebaseapp.com",
  projectId: "almost-wishlist-e98ea",
  storageBucket: "almost-wishlist-e98ea.firebasestorage.app",
  messagingSenderId: "262760842008",
  appId: "1:262760842008:web:0dd750793e14bb0c3b146d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PRODUCTS = [
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling headphones with dual processors and 8 microphones for deep work focus.",
    category: "Tech & Electronics",
    tag: "want",
    priority: "high",
    estimatedPrice: 26990,
    minPrice: 24990,
    maxPrice: 29990,
    currency: "₹",
    isPurchased: false,
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    links: [
      { id: "link-sony-1", storeName: "Amazon", url: "https://www.amazon.in/dp/B09XS7JWHH", price: 26990 },
      { id: "link-sony-2", storeName: "Sony", url: "https://shopatsc.com/products/wh-1000xm5", price: 29990 },
    ],
  },
  {
    title: "Apple MacBook Pro 14\" M3 Space Black",
    description: "Primary engineering and creative machine with 18GB unified memory and liquid retina XDR display.",
    category: "Tech & Electronics",
    tag: "need",
    priority: "high",
    estimatedPrice: 169900,
    minPrice: 159900,
    maxPrice: 179900,
    currency: "₹",
    isPurchased: false,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    links: [
      { id: "link-mac-1", storeName: "Apple", url: "https://www.apple.com/in/macbook-pro/", price: 169900 },
      { id: "link-mac-2", storeName: "Amazon", url: "https://www.amazon.in/dp/B0CM59NV87", price: 164900 },
    ],
  },
  {
    title: "Herman Miller Aeron Ergonomic Chair",
    description: "Graphite frame with PostureFit SL lumbar support and pellicle suspension for all-day posture health.",
    category: "Home & Living",
    tag: "need",
    priority: "medium",
    estimatedPrice: 115000,
    currency: "₹",
    isPurchased: false,
    imageUrl: "https://images.unsplash.com/photo-1580481077197-09f182c1143c?auto=format&fit=crop&w=1200&q=80",
    links: [
      { id: "link-hm-1", storeName: "Herman Miller", url: "https://www.hermanmiller.com/products/seating/office-chairs/aeron-chairs/", price: 115000 },
    ],
  },
  {
    title: "Leica Q3 Full-Frame Compact Camera",
    description: "60MP BSI sensor with fixed Summilux 28mm f/1.7 ASPH lens for documentary and street photography.",
    category: "Tech & Electronics",
    tag: "luxury",
    priority: "low",
    estimatedPrice: 545000,
    currency: "₹",
    isPurchased: false,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    links: [
      { id: "link-leica-1", storeName: "Other", url: "https://leica-camera.com/en-IN/photography/cameras/q/q3", price: 545000 },
    ],
  },
  {
    title: "Rimowa Classic Cabin Suitcase",
    description: "High-end anodized aluminum grooved alloy with riveted high-gloss corners and smooth TSA ball-bearing wheels.",
    category: "Travel & Outings",
    tag: "luxury",
    priority: "medium",
    estimatedPrice: 128000,
    currency: "₹",
    isPurchased: false,
    imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=1200&q=80",
    links: [
      { id: "link-rimowa-1", storeName: "Other", url: "https://www.rimowa.com/in/en/luggage/colour/silver/cabin/97353004.html", price: 128000 },
    ],
  },
  {
    title: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    description: "Full CNC machined 75% aluminum body with double-gasket design, screw-in stabs, and wireless QMK/VIA.",
    category: "Tech & Electronics",
    tag: "want",
    priority: "medium",
    estimatedPrice: 18500,
    minPrice: 16999,
    maxPrice: 19999,
    currency: "₹",
    isPurchased: false,
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
    links: [
      { id: "link-kb-1", storeName: "Other", url: "https://keychron.in/product/keychron-q1-pro-qmk-via-wireless-custom-mechanical-keyboard/", price: 18500 },
      { id: "link-kb-2", storeName: "Amazon", url: "https://www.amazon.in/dp/B0BWMG4L9J", price: 19200 },
    ],
  },
];

async function seed(targetUid) {
  if (!targetUid) {
    console.error("Please provide your user UID: node scripts/seed-wishes.mjs <USER_UID>");
    console.log("Tip: You can also open http://localhost:3000/app in browser and run window.__seedShowcaseWishes()");
    process.exit(1);
  }

  console.log(`Seeding 6 showcase products for user ${targetUid}...`);
  for (const prod of PRODUCTS) {
    try {
      const docRef = await addDoc(collection(db, "wishes"), {
        ...prod,
        userId: targetUid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log(`✓ Added "${prod.title}" (${docRef.id})`);
    } catch (err) {
      console.error(`✕ Failed to add "${prod.title}":`, err.message);
    }
  }

  // Set savings
  try {
    await setDoc(doc(db, "savings", targetUid), {
      currentSavings: 350000,
      updatedAt: Date.now(),
    });
    console.log("✓ Updated savings to ₹3,50,000");
  } catch (err) {
    console.warn("Could not update savings:", err.message);
  }

  console.log("\nDone! Open http://localhost:3000/app to see the populated dashboard.");
  process.exit(0);
}

const targetUid = process.argv[2];
seed(targetUid);
