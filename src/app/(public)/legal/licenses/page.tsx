import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Asset License Reference — EditX Vault',
  description:
    'Human-readable breakdown of every license type in the Vault: MIT, Apache 2.0, CC0, CC-BY-4.0, OFL, and EditX Community License. What you can and cannot do.',
};

const licenses = [
  {
    id: 'MIT',
    name: 'MIT License',
    url: 'https://opensource.org/licenses/MIT',
    can: ['Commercial use', 'Modification', 'Distribution', 'Private use', 'Sublicensing'],
    cannot: ['Hold liable', 'Use trademark'],
    must: ['Include copyright notice', 'Include license copy'],
    attribution: true,
    color: '#06B6D4',
  },
  {
    id: 'Apache-2.0',
    name: 'Apache License 2.0',
    url: 'https://www.apache.org/licenses/LICENSE-2.0',
    can: [
      'Commercial use',
      'Modification',
      'Distribution',
      'Private use',
      'Patent grant',
      'Sublicensing',
    ],
    cannot: ['Hold liable', 'Use trademark'],
    must: ['Include copyright notice', 'Include license copy', 'State changes'],
    attribution: true,
    color: '#A78BFA',
  },
  {
    id: 'CC0',
    name: 'Creative Commons Zero (Public Domain)',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    can: [
      'Commercial use',
      'Modification',
      'Distribution',
      'Private use',
      'No attribution required',
    ],
    cannot: ['Hold liable'],
    must: [],
    attribution: false,
    color: '#10B981',
  },
  {
    id: 'CC-BY-4.0',
    name: 'Creative Commons Attribution 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    can: ['Commercial use', 'Modification', 'Distribution', 'Private use', 'ShareAlike not required'],
    cannot: ['Hold liable', 'Imply endorsement'],
    must: ['Give appropriate credit', 'Link to license', 'Indicate changes'],
    attribution: true,
    color: '#F59E0B',
  },
  {
    id: 'OFL',
    name: 'SIL Open Font License 1.1',
    url: 'https://scripts.sil.org/OFL',
    can: ['Commercial use', 'Modification', 'Distribution', 'Private use', 'Bundle with software'],
    cannot: ['Sell font alone', 'Use reserved font names', 'Hold liable'],
    must: ['Include copyright notice', 'Include license copy', 'Rename modified fonts'],
    attribution: true,
    color: '#EC4899',
  },
  {
    id: 'EditX-Community',
    name: 'EditX Community License',
    url: '/legal/terms',
    can: [
      'Personal use',
      'Commercial client work',
      'Modification',
      'Distribution as part of larger project',
    ],
    cannot: [
      'Redistribute as standalone asset pack',
      'Sell or license the asset itself',
      'Use for AI/ML training',
      'Remove attribution from original files',
    ],
    must: ['Retain license file in project records'],
    attribution: true,
    color: '#EF4444',
  },
];

export default function LicensesPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-5 lg:px-8 py-14 space-y-12">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#3F3F46] uppercase block">
          Legal & Intellectual Property
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          Asset License Reference
        </h1>
        <p className="text-sm text-[#71717A] max-w-2xl leading-relaxed">
          Every asset in the Vault carries its original open-source license. This reference explains what each license means in plain language — for video editors, motion designers, and studio commercial work.
        </p>
      </div>

      {/* LICENSES BREAKDOWN CARDS */}
      <div className="space-y-6">
        {licenses.map((lic) => (
          <div
            key={lic.id}
            className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-6 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ backgroundColor: lic.color }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs px-2 py-0.5 border rounded-[2px] uppercase"
                  style={{
                    borderColor: `${lic.color}40`,
                    color: lic.color,
                    backgroundColor: `${lic.color}10`,
                  }}
                >
                  {lic.id}
                </span>
                <h2 className="font-display text-lg text-white font-medium">{lic.name}</h2>
              </div>
              <a
                href={lic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#71717A] hover:text-white transition-colors"
              >
                Full Legal Text ↗
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
              {/* CAN */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                  ✓ You CAN
                </div>
                <ul className="space-y-1.5 text-[#71717A]">
                  {lic.can.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CANNOT */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  ✗ You CANNOT
                </div>
                <ul className="space-y-1.5 text-[#71717A]">
                  {lic.cannot.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MUST */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] text-accent uppercase tracking-wider flex items-center gap-1.5">
                  ⚠ You MUST
                </div>
                <ul className="space-y-1.5 text-[#71717A]">
                  {lic.must.length > 0 ? (
                    lic.must.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-accent font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[#3F3F46]">No mandatory requirements beyond inclusion.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK DECISION GUIDE */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
        <h3 className="font-display text-lg text-white">Quick Workflow Decision Guide</h3>
        <div className="divide-y divide-[#1A1A1A] font-mono text-xs">
          {[
            { need: 'Zero restrictions, public domain', license: 'CC0' },
            { need: 'Simple permissive, keep copyright note', license: 'MIT' },
            { need: 'Patent protection & contributor grant', license: 'Apache 2.0' },
            { need: 'Typography and variable font bundles', license: 'OFL' },
            { need: 'EditX original studio crafted assets', license: 'EditX Community' },
          ].map((row) => (
            <div key={row.need} className="py-2.5 flex justify-between items-center">
              <span className="text-[#71717A]">{row.need}</span>
              <span className="text-accent font-medium">{row.license}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}