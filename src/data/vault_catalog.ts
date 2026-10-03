export interface VaultAsset {
  id: string;
  title: string;
  description: string;
  categories: {
    slug: 'sfx' | 'luts' | 'contracts' | 'animations' | 'overlays' | 'typography';
    name: string;
    color: string;
  };
  file_format: string;
  file_size: number;
  license: string;
  scheduled_for: string;
  download_count: number;
  compatible_software: string[];
  package_path: string;
  preview_audio?: string;
  stems_count?: number;
  is_live: boolean;
}

// Fixed dates for the current timeline (October 2026)
const OCT_01 = '2026-10-01T14:00:00.000Z';
const OCT_02 = '2026-10-02T14:00:00.000Z';
const OCT_03 = '2026-10-03T14:00:00.000Z'; // TODAY
const OCT_04 = '2026-10-04T14:00:00.000Z';
const OCT_05 = '2026-10-05T14:00:00.000Z';
const OCT_06 = '2026-10-06T14:00:00.000Z';

export const EDITX_VAULT_CATALOG: VaultAsset[] = [
  // 1. LIVE TODAY: Synthetic Sub Bass
  {
    id: 'v-01',
    title: 'Synthetic Sub Bass & Glitch Pack 01',
    description:
      'A collection of procedurally generated sub-bass sweeps and glitch risers. (Note: These are synthetic placeholder assets generated via oscillators for testing).',
    categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' },
    file_format: 'wav',
    file_size: 423_000,
    license: 'MIT',
    scheduled_for: OCT_03,
    download_count: 12,
    compatible_software: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'Reaper'],
    package_path: 'private-vault-packages/sfx/editx-sfx-sub-bass-suite-01.zip',
    preview_audio: 'private-vault-packages/sfx/editx-sub-bass-stem-01.wav',
    stems_count: 2,
    is_live: true,
  },
  // 2. SEALED CANISTER 1: Kodak 5219 (Synthetic)
  {
    id: 'v-02',
    title: 'Synthetic Kodak 5219 500T Cine LUT',
    description:
      'A procedurally generated 3D CUBE film matrix approximating a film s-curve and warm density roll-off. (Procedural test asset).',
    categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' },
    file_format: 'cube',
    file_size: 46_000,
    license: 'CC-0',
    scheduled_for: OCT_04,
    download_count: 0,
    compatible_software: ['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro', 'CapCut'],
    package_path: 'private-vault-packages/luts/editx-kodak-5219-cine-lut.zip',
    is_live: false,
  },
  // 3. SEALED CANISTER 2: Kinetic 3D Typography
  {
    id: 'v-03',
    title: 'Kinetic 3D Typography Rigs v2',
    description:
      'A simple Lottie JSON lower-third animation for testing the kinetic motion pipeline.',
    categories: { slug: 'animations', name: '3D KINETICS', color: '#00FF41' },
    file_format: 'json',
    file_size: 24_000,
    license: 'MIT',
    scheduled_for: OCT_05,
    download_count: 0,
    compatible_software: ['After Effects', 'Premiere Pro', 'Web Lottie', 'LottieFiles'],
    package_path: 'private-vault-packages/motion/editx-kinetic-typography-lottie-pack.zip',
    is_live: false,
  },
  // 4. PAST DROP: Commercial Video Retainer
  {
    id: 'v-04',
    title: 'Commercial Production Retainer Spec',
    description:
      'A markdown template for a basic freelance agreement specifying kickoff deposits, revision limits, and project file ownership.',
    categories: { slug: 'contracts', name: 'CONTRACT SPEC', color: '#FFB000' },
    file_format: 'md',
    file_size: 1_850,
    license: 'MIT',
    scheduled_for: OCT_02,
    download_count: 45,
    compatible_software: ['Google Docs', 'Microsoft Word', 'Pages', 'Markdown'],
    package_path: 'private-vault-packages/contracts/editx-commercial-video-contract-kit.zip',
    is_live: true,
  },
  // 5. PAST DROP: 16mm Film Grain (Instructions only)
  {
    id: 'v-05',
    title: '16mm Grain Deployment Instructions',
    description:
      'A text guide on how to apply grain overlays in various NLEs. (Does not contain actual 4K video files).',
    categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' },
    file_format: 'txt',
    file_size: 4_500,
    license: 'MIT',
    scheduled_for: OCT_01,
    download_count: 88,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro'],
    package_path: 'private-vault-packages/grain/editx-16mm-film-grain-4k-pack.zip',
    is_live: true,
  }
];
