import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — EditX Vault',
  description:
    'Privacy Policy for EditX Vault — GDPR and CCPA compliant. Minimal Discord OAuth data only. No tracking. No data sales.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 lg:px-8 py-14 space-y-10">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#3F3F46] uppercase block">
          Data Governance
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs text-[#71717A]" suppressHydrationWarning>
          Effective Date: October 2026
        </p>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="space-y-8 text-sm text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">1. Data We Collect</h2>
          <p>
            EditX Vault collects minimal profile information solely provided through Discord OAuth 2.0 when you choose to connect your account:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-xs text-[#71717A]">
            <li>Discord User ID (unique immutable account identifier)</li>
            <li>Discord Username and avatar hash</li>
            <li>Email address (only if granted during authentication)</li>
          </ul>
          <p>
            We do NOT collect browsing histories, hardware fingerprints, behavioral trackers, or third-party marketing identifiers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">2. How We Use Data</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Authenticate user sessions securely via JWT and NextAuth.</li>
            <li>Maintain your personal download history for convenient re-downloading.</li>
            <li>Attribute approved community asset contributions to your creator username.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">3. Data Security & Storage</h2>
          <p>
            All user records and download logs are stored in PostgreSQL managed with Supabase using AES-256 encryption at rest and TLS 1.3 encryption in transit. Administrative dashboard access is strictly protected by role-based guards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">4. Zero Data Selling Policy</h2>
          <p>
            We never sell, rent, monetize, or broker personal creator data to advertisers, data brokers, or third parties. We are funded by community support and creator tools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">5. Cookies & Local Storage</h2>
          <p>
            We utilize only essential first-party session cookies required for authentication and CSRF token verification. We do not load third-party tracking cookies or ad pixels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">6. GDPR & CCPA Rights</h2>
          <p>
            Under GDPR and CCPA regulations, you hold the right to request access to your stored personal records, request immediate data correction, or request permanent deletion of your account and associated download logs.
          </p>
          <p>
            To initiate an account deletion or data portability export request, email <span className="text-white font-mono">privacy@editx.gg</span>.
          </p>
        </section>
      </div>
    </div>
  );
}