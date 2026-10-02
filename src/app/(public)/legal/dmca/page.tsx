import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA Takedown Policy — EditX Vault',
  description:
    'DMCA takedown procedure for EditX Vault. How to submit a copyright infringement notice, response timeline, and counter-notice process.',
};

export default function DMCAPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 lg:px-8 py-14 space-y-10">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#3F3F46] uppercase block">
          Copyright Compliance
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          DMCA Takedown Policy
        </h1>
        <p className="font-mono text-xs text-[#71717A]" suppressHydrationWarning>
          Effective Date: October 2026
        </p>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="space-y-8 text-sm text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">1. Designated Copyright Agent</h2>
          <p>
            EditX Vault respects the intellectual property rights of artists, sound designers, and filmmakers. In accordance with the Digital Millennium Copyright Act (17 U.S.C. § 512), notifications of claimed copyright infringement should be sent to our Designated Agent:
          </p>
          <div className="p-4 bg-[#111111] border border-[#1A1A1A] rounded-[2px] font-mono text-xs text-white space-y-1">
            <div>EditX Vault Legal & DMCA Agent</div>
            <div className="text-accent">Email: dmca@editx.gg</div>
            <div className="text-[#71717A]">Subject: DMCA Takedown Notice — [Asset Title]</div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">2. Notice Requirements</h2>
          <p>
            To be effective under 17 U.S.C. § 512(c)(3), your written notice must include:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-xs text-[#71717A]">
            <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material claimed to be infringing (URL, asset title, or Drop ID).</li>
            <li>Sufficient contact details (name, postal address, telephone number, email).</li>
            <li>A statement of good faith belief that the use is not authorized by the copyright owner.</li>
            <li>A statement under penalty of perjury that the information in the notification is accurate.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">3. Response Timeline</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><span className="text-white font-medium">Within 24 hours:</span> Acknowledge receipt of the complaint and initiate review.</li>
            <li><span className="text-white font-medium">Within 48 hours:</span> Disable public access to the contested asset and notify the submitter.</li>
            <li><span className="text-white font-medium">Within 72 hours:</span> Provide formal confirmation to the copyright claimant.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">4. Counter-Notification Procedure</h2>
          <p>
            If you believe your submitted asset was removed as a result of mistake or misidentification, you may file a counter-notification to <span className="text-white font-mono">dmca@editx.gg</span>. Counter-notifications require a statement under penalty of perjury and consent to applicable jurisdiction.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg text-white font-medium">5. Repeat Infringer Policy</h2>
          <p>
            EditX Vault enforces a strict policy of terminating submission privileges and banning Discord accounts of users who are found to be repeat copyright infringers.
          </p>
        </section>
      </div>
    </div>
  );
}