import React from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service and legal standards for almost.",
};

export default function TermsPage() {
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
            Legal Document • Ref: TERMS-2026
          </span>
        </div>
      </header>

      {/* Paper Content Canvas */}
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-12">
        {/* Document Title Header */}
        <div className="space-y-3 pb-8 border-b border-black/10 dark:border-white/10">
          <span className="text-xs font-mono uppercase tracking-widest text-black/50 dark:text-white/50 block">
            almost — Terms of Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-black/50 dark:text-white/50 pt-1">
            Last Updated &amp; Effective: January 1, 2026
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            By accessing or using Almost (&quot;the Service&quot;), hosted at almost or operated by Vinod Jangid, you agree to be bound by these Terms of Service. If you do not agree to all provisions contained herein, you should not access or use the application.
          </p>
        </section>

        {/* Section 2: Service Description */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            2. Description of the Service
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            Almost is an intentional wishlist manager and patient ownership planning application. It allows users to document personal desired items, classify them into Need, Want, or Luxury categories, calculate their personal savings gap, compare store options, and pool simulated savings with friends or family for shared milestones.
          </p>
        </section>

        {/* Section 3: Financial Disclaimer */}
        <section className="space-y-4 p-5 rounded-2xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02]">
          <h2 className="text-base font-bold tracking-tight text-black dark:text-white">
            3. Important Financial Disclaimer
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            <strong>Almost is not a bank, escrow service, or financial institution.</strong> The &quot;Savings,&quot; &quot;Gap,&quot; and &quot;Pooled Funds&quot; metrics displayed within the application are purely informational calculation figures entered by you and your collaborators.
          </p>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            The Service does not hold, transfer, process, or custody actual monetary deposits. All real-world financial transactions, purchases, and payments take place independently between you, your collaborators, and third-party merchants (such as Apple, Amazon, Leica, or independent retailers).
          </p>
        </section>

        {/* Section 4: Collaborative Use & Invite Codes */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            4. Collaborative Wish Responsibility
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            When you create or participate in a Collaborative Wish, you acknowledge that anyone who holds the 6-character invite code may join the fund pool, view participant names, and record contributions. You are solely responsible for maintaining control of invite codes and ensuring you only share them with trusted parties.
          </p>
        </section>

        {/* Section 5: Acceptable Use */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            5. Acceptable Use Policy
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            You agree to use Almost strictly for lawful personal or small-group purposes. You agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-black/75 dark:text-white/75">
            <li>Upload unlawful, defamatory, infringing, or malicious content or imagery.</li>
            <li>Attempt to reverse-engineer, disrupt, or exploit the API routes or cloud database infrastructure.</li>
            <li>Misrepresent identity or participate fraudulently in collaborative pools.</li>
          </ul>
        </section>

        {/* Section 6: Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            6. Intellectual Property
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            The design, code, interface layouts, and branding of Almost are the intellectual property of Vinod Jangid. You retain all ownership rights to the specific text, notes, and photos you upload to your personal wishlist.
          </p>
        </section>

        {/* Section 7: Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            7. Limitation of Liability
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Under no circumstances shall the creators or maintainers of Almost be liable for any direct, indirect, incidental, or consequential damages resulting from price fluctuations at external stores, merchant availability, or data loss.
          </p>
        </section>

        {/* Section 8: Changes & Governing Law */}
        <section className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
          <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
            8. Governing Law &amp; Updates
          </h2>
          <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
            These Terms shall be interpreted in accordance with applicable laws. We reserve the right to modify these terms as the application expands. Continued use following any update constitutes acceptance of the amended terms.
          </p>
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono space-y-1 bg-black/[0.02] dark:bg-white/[0.02]">
            <p>Almost — Engineered by Vinod Jangid</p>
            <p>GitHub: https://github.com/vinodjangid07/almost</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-10 px-6 sm:px-12 text-xs text-black/50 dark:text-white/50 select-none">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 almost. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-black dark:hover:text-white transition">Home</Link>
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition">Privacy</Link>
            <Link href="/app" className="hover:text-black dark:hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
