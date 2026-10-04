import { Metadata } from 'next';
import { VaultReels } from '@/components/vault/VaultReels';
import { TimelineBar } from '@/components/layout/TimelineBar';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';

export const metadata: Metadata = {
  title: 'Vault Reels Archive — EditX Vault',
  description:
    'Full repository of production assets: color-science LUTs, cinematic SFX stems, 4K film mattes, and motion typography suites.',
};

export default function VaultPage() {
  return (
    <div className="w-full min-h-screen bg-suite text-paper pt-24 pb-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-paper mb-2">
            The Vault Reels
          </h1>
          <p className="text-base text-paper-dim max-w-xl">
            Continuous archive of all published creative packs. Full-width reels with interactive waveforms and LUT calibration strips.
          </p>
        </div>

        <VaultReels initialAssets={EDITX_VAULT_CATALOG} />
      </div>

      <TimelineBar />
    </div>
  );
}
