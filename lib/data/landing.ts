export interface WishlistChapter {
  number: string;
  title: string;
  description: string;
}

export const WISHLIST_CHAPTERS: WishlistChapter[] = [
  {
    number: "01",
    title: "Need, Want, or Luxury.",
    description:
      "Every item you add asks for honesty. Separate tools you rely on from comforts you enjoy and indulgences worth saving toward.",
  },
  {
    number: "02",
    title: "Your savings sit beside every price.",
    description:
      "Update your savings balance with one tap. Almost immediately shows what you can afford today and the exact gap remaining for everything else.",
  },
  {
    number: "03",
    title: "Pool funds with friends.",
    description:
      "Turn any wish into a shared goal with a private invite code. Track each person's contribution toward group trips, gear, or gifts in real time.",
  },
  {
    number: "04",
    title: "Every store link in one quiet place.",
    description:
      "Save product URLs, price ranges, and personal wait conditions on each wish so you only buy when the timing and price are right.",
  },
];
