import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — EditX Vault',
  description:
    'Terms of Service for EditX Vault — the daily creative asset platform for video editors and motion designers.',
};

export default function TermsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 lg:px-8 py-14 space-y-10">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#3F3F46] uppercase block">
          Legal Agreement
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="font-mono text-xs text-[#71717A]" suppressHydrationWarning>
          Effective Date: October 2026
        </p>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="space-y-8 text-sm text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">1. Acceptance of Terms</h2>
          <p>
            By accessing or using EditX Vault (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">2. Platform Access & Downloads</h2>
          <p>
            EditX Vault provides free daily creative asset downloads for video editors, animators, and motion graphic designers. Assets are available freely for public preview and download.
          </p>
          <p>
            The Platform is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee uninterrupted availability, specific file formats, or fitness for any specialized purpose.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">3. Asset Usage & Commercial Rights</h2>
          <p>
            All creative assets released through the Vault are distributed under their respective open-source or permissive licenses (MIT, Apache 2.0, CC0, CC-BY-4.0, OFL, or EditX Community License).
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You may freely use downloaded assets in personal, commercial, and client video projects.</li>
            <li>You may NOT repackage, resell, or distribute Vault assets as standalone asset packs or retail products.</li>
            <li>You may NOT scrape, mass-automate, or train AI models without explicit creator permission.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">4. Discord Integration & Data</h2>
          <p>
            When authenticating via Discord OAuth 2.0, we collect only necessary public profile data (Discord User ID, username, and avatar). This data is stored securely in encrypted databases and is never sold or traded.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">5. Community Submissions</h2>
          <p>
            Assets submitted via the community submission portal are curated by the EditX team. Submission grants EditX a non-exclusive license to host and distribute the asset with author attribution. You warrant that you own or possess valid licensing rights for any submitted work.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">6. DMCA & Copyright Infringement</h2>
          <p>
            We respect intellectual property rights. If you believe any material in the Vault infringes upon your copyright, please follow our DMCA Takedown Policy. Valid takedown notices are investigated within 48 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">7. Termination & Fair Use</h2>
          <p>
            We reserve the right to suspend or terminate access for automated scraping, denial-of-service attempts, license violations, or fraudulent submissions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">8. Disclaimer of Warranties</h2>
          <p className="uppercase text-xs font-mono text-[#3F3F46]">
            THE PLATFORM AND ASSETS ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">9. Limitation of Liability</h2>
          <p className="uppercase text-xs font-mono text-[#3F3F46]">
            IN NO EVENT SHALL EDITX VAULT, ITS OPERATORS, OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE DOWNLOADED ASSETS.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">10. Contact & Inquiries</h2>
          <p>
            For legal inquiries, partnership requests, or questions regarding these Terms, contact our legal team at <span className="text-white font-mono">legal@editx.gg</span>.
          </p>
        </section>
      </div>
    </div>
  );
}