import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function check() {
  console.log("Checking wishes collection...");
  try {
    const snap = await getDocs(collection(db, "wishes"));
    console.log(`Found ${snap.size} wishes in Firestore:`);
    const userIds = new Set();
    snap.forEach((doc) => {
      const data = doc.data();
      console.log(`- Doc ${doc.id}: title="${data.title}", userId="${data.userId}"`);
      if (data.userId) userIds.add(data.userId);
    });
    console.log("Unique userIds:", Array.from(userIds));

    console.log("Checking savings collection...");
    const savingsSnap = await getDocs(collection(db, "savings"));
    console.log(`Found ${savingsSnap.size} savings docs:`);
    savingsSnap.forEach((doc) => {
      console.log(`- Savings doc ${doc.id}:`, doc.data());
    });
  } catch (err) {
    console.error("Error reading Firestore:", err);
  }
  process.exit(0);
}

check();
