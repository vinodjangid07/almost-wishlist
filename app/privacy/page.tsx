import React from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and data governance standards for almost.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#111318] dark:bg-[#0a0c10] dark:text-[#f2f4f8] font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Top Legal Header */}
      <header className="border-b border-black/10 dark:border-white/10 py-5 px-6 sm:px-12 select-none">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Almost</span>
          </Link>
          <span className="text-[11px] font-mono uppercase tracking-wider text-black/40 dark:text-white/40">
            Legal Document • Ref: PRIV-2026
          </span>
        </div>
      </header>

      {/* Paper Content Canvas */}
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-12">
        {/* Document Title Header */}
        <div className="space-y-3 pb-8 border-b border-black/10 dark:border-white/10">
          <span className="text-xs font-mono uppercase tracking-widest text-black/50 dark:text-white/50 block">
            almost — Privacy Policy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-black/50 dark:text-white/50 pt-1">
            Last Updated &amp; Effective: January 1, 2026
          </p>
        </div>

        {/* Section 1: Philosophy & Scope */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            1. Overview &amp; Privacy-First Philosophy
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            Almost (&quot;we,&quot; &quot;our,&quot; or &quot;the Service&quot;), created by Vinod Jangid, is designed with a strict quiet luxury and privacy-first ethos. We believe that your desires, financial goals, and personal notes are sensitive personal matters. We do not sell your data, we do not deploy third-party advertising cookies, and we do not profile your behavior across the internet.
          </p>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            This Privacy Policy sets out how personal information is handled across the application, whether you use the Service as a guest or with a registered account.
          </p>
        </section>

        {/* Section 2: Guest Usage vs Authenticated Accounts */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            2. Information We Process
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-black/80 dark:text-white/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-black dark:text-white font-semibold">
              A. Guest Mode (Local Storage)
            </h3>
            <p>
              When using Almost without signing in, all items, categories, price estimations, and savings numbers are stored locally within your device&apos;s browser storage (IndexedDB / LocalStorage). This data is completely private to your physical device and is never transmitted to our remote database servers.
            </p>

            <h3 className="text-xs font-mono uppercase tracking-wider text-black dark:text-white font-semibold pt-2">
              B. Authenticated Accounts (Cloud Synchronization)
            </h3>
            <p>
              When you choose to create an account via Google Sign-In or Email, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-black/75 dark:text-white/75">
              <li>Your basic account identifier (Name, Email address, and Profile avatar URL provided by Google Auth or Firebase Auth).</li>
              <li>Your curated wish items, classifications (Need, Want, Luxury), target costs, and multi-store reference links.</li>
              <li>Your saved current savings balance to calculate real-time wishlist coverage.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Collaborative Wishes */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            3. Collaborative Wishes &amp; Shared Data
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            If you enable the <strong>Collaborative Wish</strong> feature on an item, a unique 6-character invite code is generated. Any user possessing this code can join the collaborative wish.
          </p>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            Participants in a collaborative wish can view the item title, image, target price, pooled savings progress, and the display names and contributed amounts of fellow participants. You maintain full discretion over whom you share your collaborative invite codes with.
          </p>
        </section>

        {/* Section 4: File and Image Storage */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            4. Image Uploads &amp; Media Storage
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            When you upload custom photos for your wish items, image files are securely uploaded via Vercel Blob or secure cloud bucket infrastructure. Uploaded media is used exclusively to display your item preview within the application.
          </p>
        </section>

        {/* Section 5: Data Protection & Third Parties */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            5. Third-Party Infrastructure &amp; Security
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            We utilize Google Firebase (Firestore and Firebase Authentication) and Vercel for database hosting, authentication, and secure delivery. All data in transit is encrypted using industry-standard Transport Layer Security (TLS 1.3). We do not partner with data brokers, ad exchanges, or marketing telemetry services.
          </p>
        </section>

        {/* Section 6: Data Retention & User Rights */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            6. Data Retention &amp; Deletion Rights
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            You retain absolute ownership of your data at all times.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-black/75 dark:text-white/75">
            <li><strong>Individual Deletion:</strong> You can delete any wish item at any time from the dashboard or detail modal.</li>
            <li><strong>Local Purge:</strong> In guest mode, clearing your browser storage permanently clears all local items.</li>
            <li><strong>Account Erasure:</strong> To request complete deletion of your account and associated database records, contact us directly or remove your data via the application settings.</li>
          </ul>
        </section>

        {/* Section 7: Contact */}
        <section className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            7. Contact Information
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            For privacy inquiries, data access requests, or questions regarding our architectural policies:
          </p>
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono space-y-1 bg-black/[0.02] dark:bg-white/[0.02]">
            <p>Almost — Designed &amp; Engineered by Vinod Jangid</p>
            <p>GitHub: https://github.com/vinodjangid07</p>
            <p>Repository: https://github.com/vinodjangid07/almost</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-10 px-6 sm:px-12 text-xs text-black/50 dark:text-white/50 select-none">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 almost. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-black dark:hover:text-white transition">Home</Link>
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition">Terms</Link>
            <Link href="/app" className="hover:text-black dark:hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
