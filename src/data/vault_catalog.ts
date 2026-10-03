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

const OCT_01 = '2026-10-01T14:00:00.000Z';
const OCT_02 = '2026-10-02T14:00:00.000Z';
const OCT_03 = '2026-10-03T14:00:00.000Z'; // TODAY
const OCT_04 = '2026-10-04T14:00:00.000Z';
const OCT_05 = '2026-10-05T14:00:00.000Z';

export const EDITX_VAULT_CATALOG: VaultAsset[] = [
  // 1. LIVE TODAY: Master Audio Suite
  {
    id: 'v-01',
    title: 'Cinematic Sub-Bass & Trailer Impact Suite 01',
    description:
      'Studio-mastered 48kHz audio stems: 75Hz-to-28Hz exponential sub-drop, low-brass trailer braam hit, and analog tape stop dive. Mastered with true peak limiter.',
    categories: { slug: 'sfx', name: 'ANALOG SFX', color: '#00FF41' },
    file_format: 'wav',
    file_size: 544_358,
    license: 'MIT',
    scheduled_for: OCT_03,
    download_count: 842,
    compatible_software: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'Reaper'],
    package_path: 'private-vault-packages/sfx/editx-sfx-sub-bass-suite-01.zip',
    preview_audio: 'private-vault-packages/sfx/EditX_SubDrop_75Hz_to_28Hz_Cinematic.wav',
    stems_count: 3,
    is_live: true,
  },
  // 2. SEALED CANISTER 1: Kodak Vision3 & Fuji 3D LUT Pack
  {
    id: 'v-02',
    title: 'Kodak Vision3 5219 & Fuji Eterna 33-Point 3D LUT Suite',
    description:
      'Industry-standard 33x33x33 .CUBE LUTs (35,937 points each): Kodak Vision3 5219 film emulation, Fuji Eterna 250D soft contrast, and Hollywood Blockbuster Teal & Orange.',
    categories: { slug: 'luts', name: 'COLOR LUT', color: '#FFB000' },
    file_format: 'cube',
    file_size: 375_000,
    license: 'CC0',
    scheduled_for: OCT_04,
    download_count: 0,
    compatible_software: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Final Cut Pro', 'CapCut Desktop'],
    package_path: 'private-vault-packages/luts/editx-kodak-5219-cine-lut.zip',
    is_live: false,
  },
  // 3. SEALED CANISTER 2: Kinetic Typography Rig
  {
    id: 'v-03',
    title: 'Kinetic 3D Typography Rigs v2',
    description:
      'Production Lottie JSON kinetic lower third reveal animation with cubic bezier easing [0.16, 1, 0.3, 1] and interactive HTML preview tester.',
    categories: { slug: 'animations', name: '3D KINETICS', color: '#00FF41' },
    file_format: 'json',
    file_size: 2_000,
    license: 'MIT',
    scheduled_for: OCT_05,
    download_count: 0,
    compatible_software: ['After Effects', 'Premiere Pro', 'Web Lottie', 'LottieFiles'],
    package_path: 'private-vault-packages/motion/editx-kinetic-typography-lottie-pack.zip',
    is_live: false,
  },
  // 4. PAST DROP: Master Legal Retainer Kit
  {
    id: 'v-04',
    title: 'Master Commercial Video Editing Agreement & Retainer Kit',
    description:
      'Attorney-drafted 15-section master video editing contract: 50/25/25 milestone billing, kill fee protection, late fee riders, and copyright handover releases.',
    categories: { slug: 'contracts', name: 'CONTRACT SPEC', color: '#FFB000' },
    file_format: 'md',
    file_size: 4_700,
    license: 'MIT',
    scheduled_for: OCT_02,
    download_count: 420,
    compatible_software: ['Google Docs', 'Microsoft Word', 'Pages', 'Markdown'],
    package_path: 'private-vault-packages/contracts/editx-commercial-video-contract-kit.zip',
    is_live: true,
  },
  // 5. PAST DROP: 4K Cinema Mattes
  {
    id: 'v-05',
    title: '4K Cinema Aspect Ratio Mattes Pack (3840x2160)',
    description:
      'True 4K UHD transparent alpha letterbox mattes: 2.39:1 Anamorphic Scope, 2.35:1 Cinemascope, 1.85:1 Theatrical Flat, and 4:3 Vintage Pillarbox.',
    categories: { slug: 'overlays', name: 'OVERLAYS', color: '#8A8A8E' },
    file_format: 'png',
    file_size: 3_600,
    license: 'MIT',
    scheduled_for: OCT_01,
    download_count: 940,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro'],
    package_path: 'private-vault-packages/grain/editx-16mm-film-grain-4k-pack.zip',
    is_live: true,
  },
];
