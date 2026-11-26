import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://almost.vinodjangid.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "almost • Intentional Wishlist Manager",
    template: "%s | almost",
  },
  description:
    "An intentional wishlist manager designed for quiet luxury and mindful ownership. Classify desires, budget against live savings, and pool contributions for things worth waiting for.",
  keywords: [
    "almost",
    "almost wishlist",
    "wishlist manager",
    "intentional ownership",
    "mindful budgeting",
    "savings tracker",
    "collaborative wishlist",
    "quiet luxury",
  ],
  authors: [{ name: "Vinod Jangid", url: "https://vinodjangid.site" }],
  creator: "Vinod Jangid",
  publisher: "Vinod Jangid",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "almost",
    title: "almost • Intentional Wishlist Manager",
    description:
      "An intentional wishlist manager designed for quiet luxury and mindful ownership. Classify desires, budget against live savings, and pool contributions for things worth waiting for.",
    images: [
      {
        url: "/preview/almost-preview.webp",
        width: 1200,
        height: 630,
        alt: "almost — Intentional Wishlist Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "almost • Intentional Wishlist Manager",
    description:
      "An intentional wishlist manager designed for quiet luxury and mindful ownership. Classify desires, budget against live savings, and pool contributions for things worth waiting for.",
    creator: "@vinodjangid",
    images: ["/preview/almost-preview.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/dark-app-icon.webp",
  },
};

const motionFlagsScript = `document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion');`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlagsScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)] font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
