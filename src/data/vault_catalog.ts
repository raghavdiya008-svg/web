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
  preview_image?: string;
  waveform_peaks?: number[];
  stems_count?: number;
  is_live: boolean;
}

const NOW = new Date().toISOString();
const PAST_DROP_1 = '2026-10-01T14:00:00.000Z';
const PAST_DROP_2 = '2026-10-02T14:00:00.000Z';
const PAST_DROP_3 = '2026-10-03T14:00:00.000Z';
const TODAY = '2026-10-04T14:00:00.000Z';

export const EDITX_VAULT_CATALOG: VaultAsset[] = [
  // =========================================================================
  // 1. FEATURED LIVE TODAY: KODAK VISION3 5219 & FUJI ETERNA CINE LUTS
  // =========================================================================
  {
    id: 'v-02',
    title: 'Kodak Vision3 5219 & Fuji Eterna 250D Film Stock Suite',
    description:
      'Industry-standard 33x33x33 .CUBE LUTs (35,937 points each): Kodak Vision3 5219 warm highlight emulation, Fuji Eterna 250D soft pastel contrast, and Hollywood Blockbuster Teal & Orange.',
    categories: { slug: 'luts', name: 'COLOR LUT', color: '#D67E2C' },
    file_format: 'cube',
    file_size: 374_300,
    license: 'CC0',
    scheduled_for: TODAY,
    download_count: 2420,
    compatible_software: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Final Cut Pro', 'CapCut Desktop'],
    package_path: 'private-vault-packages/luts/editx-kodak-5219-cine-lut.zip',
    is_live: true,
  },

  // =========================================================================
  // 2. SFX & AUDIO SUITES (Broadcast 48kHz WAV)
  // =========================================================================
  {
    id: 'v-01',
    title: 'Cinematic Sub-Drops & 808 Braam Impact Suite',
    description:
      'Studio-mastered 48kHz audio stems: 75Hz-to-28Hz exponential sub drop, low-brass trailer braam hit, and analog tape stop dive. Mastered with true peak limiter.',
    categories: { slug: 'sfx', name: 'SOUND', color: '#0885A1' },
    file_format: 'wav',
    file_size: 554_316,
    license: 'CC0',
    scheduled_for: PAST_DROP_3,
    download_count: 1890,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'CapCut Desktop', 'Ableton'],
    package_path: 'private-vault-packages/sfx/editx-sfx-sub-bass-suite-01.zip',
    preview_audio: '/media/EditX_SubDrop_75Hz_to_28Hz_Cinematic.wav',
    waveform_peaks: [79, 77, 74, 71, 68, 65, 62, 60, 56, 54, 51, 48, 45, 43, 41, 39, 37, 34, 32, 31, 29, 27, 25, 24, 22, 21, 20, 19, 18, 16, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
    is_live: true,
  },
  {
    id: 'v-07',
    title: 'Tactile UI Clicks, Mechanical Shutter & Foley Suite',
    description:
      'Crisp tactile Foley transients for high-retention talking heads and explainer edits: mechanical blue-switch click, vintage camera shutter snap, and 35mm projector spool tick.',
    categories: { slug: 'sfx', name: 'SOUND', color: '#0885A1' },
    file_format: 'wav',
    file_size: 45_404,
    license: 'CC0',
    scheduled_for: PAST_DROP_2,
    download_count: 1340,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'CapCut Desktop'],
    package_path: 'private-vault-packages/sfx/editx-sfx-foley-clicks-ui.zip',
    preview_audio: '/media/EditX_Foley_Mechanical_Key_Click.wav',
    waveform_peaks: [61, 40, 31, 19, 14, 14, 64, 64, 50, 36, 28, 19, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
    is_live: true,
  },
  {
    id: 'v-08',
    title: 'Cinema Speed-Ramp Whooshes & Tension Risers',
    description:
      'High-energy transition toolkit: aerodynamic air whoosh pass-by and a 3.2s exponential harmonic pitch tension riser for dynamic build-ups and cut transitions.',
    categories: { slug: 'sfx', name: 'SOUND', color: '#0885A1' },
    file_format: 'wav',
    file_size: 366_114,
    license: 'CC0',
    scheduled_for: PAST_DROP_1,
    download_count: 2110,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro', 'CapCut Desktop'],
    package_path: 'private-vault-packages/sfx/editx-sfx-whoosh-risers.zip',
    preview_audio: '/media/EditX_Whoosh_Speed_Ramp_Air_Pass.wav',
    waveform_peaks: [14, 14, 14, 14, 14, 14, 14, 14, 14, 18, 23, 30, 36, 42, 50, 55, 61, 67, 68, 73, 74, 76, 76, 75, 74, 72, 69, 65, 58, 54, 46, 39, 33, 26, 21, 16, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
    is_live: true,
  },

  // =========================================================================
  // 3. COLOR SCIENCE & 3D LUTS
  // =========================================================================
  {
    id: 'v-09',
    title: 'Arri Alexa 35 LogC4 & Clean Broadcast Rec.709 Matrix',
    description:
      'Pristine technical conversion 3D LUTs: Arri Alexa 35 LogC4 natural skin-tone matrix and clean broadcast Rec.709 neutral conversion for commercial delivery.',
    categories: { slug: 'luts', name: 'COLOR LUT', color: '#D67E2C' },
    file_format: 'cube',
    file_size: 356_650,
    license: 'CC0',
    scheduled_for: PAST_DROP_2,
    download_count: 1670,
    compatible_software: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Final Cut Pro', 'CapCut Desktop'],
    package_path: 'private-vault-packages/luts/editx-arri-alexa-35-matrix-lut.zip',
    is_live: true,
  },
  {
    id: 'v-10',
    title: 'Noir Cinema & Silver Gelatin High-Contrast Monochrome Suite',
    description:
      'Panchromatic Tri-X 400 deep silver emulation and gritty Bleach Bypass silver strike contrast LUTs for music videos, high-fashion promos, and dark aesthetic edits.',
    categories: { slug: 'luts', name: 'COLOR LUT', color: '#D67E2C' },
    file_format: 'cube',
    file_size: 450_600,
    license: 'CC0',
    scheduled_for: PAST_DROP_3,
    download_count: 980,
    compatible_software: ['DaVinci Resolve', 'Adobe Premiere Pro', 'Final Cut Pro', 'CapCut Desktop'],
    package_path: 'private-vault-packages/luts/editx-noir-silver-monochrome-lut.zip',
    is_live: true,
  },

  // =========================================================================
  // 4. OVERLAYS, GRAIN & MATTES
  // =========================================================================
  {
    id: 'v-05',
    title: '4K Cinema Aspect Ratio Mattes Pack (3840x2160)',
    description:
      'True 4K UHD transparent alpha letterbox mattes: 2.39:1 Anamorphic Scope, 2.35:1 Cinemascope, 1.85:1 Theatrical Flat, and 4:3 Vintage Pillarbox.',
    categories: { slug: 'overlays', name: 'GRAIN & MATTES', color: '#A0A0A0' },
    file_format: 'png',
    file_size: 2_880,
    license: 'MIT',
    scheduled_for: PAST_DROP_1,
    download_count: 3120,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro'],
    package_path: 'private-vault-packages/grain/editx-16mm-film-grain-4k-pack.zip',
    preview_image: '/media/EditX_4K_Matte_2.39_Anamorphic_Scope.png',
    is_live: true,
  },
  {
    id: 'v-11',
    title: 'Vintage 16mm Film Dirt, Dust & Scratch Alpha Overlays',
    description:
      'Real transparent 16mm film dirt, dust specks, and vertical negative emulsion scratch overlays. Instant vintage film aesthetic with zero render slowdowns.',
    categories: { slug: 'overlays', name: 'GRAIN & MATTES', color: '#A0A0A0' },
    file_format: 'png',
    file_size: 20_992,
    license: 'MIT',
    scheduled_for: PAST_DROP_2,
    download_count: 1450,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'CapCut Desktop'],
    package_path: 'private-vault-packages/grain/editx-vintage-16mm-dust-overlay.zip',
    preview_image: '/media/EditX_16mm_Film_Dust_and_Scratch_Overlay.png',
    is_live: true,
  },
  {
    id: 'v-12',
    title: 'Analog CRT Scanlines & Retro HUD Glitch Matte Pack',
    description:
      'Interlaced horizontal CRT phosphor scanline transparency overlay. Perfect for tech screens, retro futuristic edits, and cyberpunk aesthetics.',
    categories: { slug: 'overlays', name: 'GRAIN & MATTES', color: '#A0A0A0' },
    file_format: 'png',
    file_size: 840,
    license: 'MIT',
    scheduled_for: PAST_DROP_3,
    download_count: 1820,
    compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'CapCut Desktop'],
    package_path: 'private-vault-packages/grain/editx-crt-scanline-glitch-matte.zip',
    preview_image: '/media/EditX_CRT_Interlaced_Scanlines_Overlay.png',
    is_live: true,
  },

  // =========================================================================
  // 5. MOTION & ANIMATION RIGS
  // =========================================================================
  {
    id: 'v-03',
    title: 'Kinetic 3D Typography Rigs v2',
    description:
      'Production Lottie JSON kinetic lower third reveal animation with cubic bezier easing [0.16, 1, 0.3, 1] and interactive HTML preview tester.',
    categories: { slug: 'animations', name: 'MOTION', color: '#505BA6' },
    file_format: 'json',
    file_size: 1_330,
    license: 'MIT',
    scheduled_for: PAST_DROP_2,
    download_count: 1140,
    compatible_software: ['After Effects', 'Premiere Pro', 'Web Lottie', 'LottieFiles'],
    package_path: 'private-vault-packages/motion/editx-kinetic-typography-lottie-pack.zip',
    is_live: true,
  },
  {
    id: 'v-13',
    title: 'Modern Social Creator Callout & Subscribe Rig',
    description:
      'Clean animated YouTube/Instagram handle callout pill with smooth spring-physics scale pop and dismiss. Complete with interactive browser audition player.',
    categories: { slug: 'animations', name: 'MOTION', color: '#505BA6' },
    file_format: 'json',
    file_size: 1_350,
    license: 'MIT',
    scheduled_for: TODAY,
    download_count: 920,
    compatible_software: ['After Effects', 'Premiere Pro', 'Web Lottie', 'LottieFiles'],
    package_path: 'private-vault-packages/motion/editx-social-creator-callout-pack.zip',
    is_live: true,
  },

  // =========================================================================
  // 6. TYPOGRAPHY & DISPLAY FONTS
  // =========================================================================
  {
    id: 'v-06',
    title: 'Editorial & Cyber Typography Suite (Syne + Space Grotesk)',
    description:
      'Commercial variable font family bundle: Syne (avant-garde fashion & trailer title display) and Space Grotesk (tech lower thirds & HUD captions). Includes all weights (Thin through Black).',
    categories: { slug: 'typography', name: 'TYPOGRAPHY', color: '#E7C71F' },
    file_format: 'zip',
    file_size: 140_492,
    license: 'OFL-1.1',
    scheduled_for: PAST_DROP_3,
    download_count: 2750,
    compatible_software: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro', 'Figma'],
    package_path: 'private-vault-packages/typography/editx-editorial-typography-pack.zip',
    is_live: true,
  },
  {
    id: 'v-15',
    title: 'Swiss Minimalist Monospace & HUD Font Kit (Space Mono)',
    description:
      'Space Mono variable weights (Regular & Bold): engineered for video timecode counters, technical telemetry data, and minimal documentary lower thirds.',
    categories: { slug: 'typography', name: 'TYPOGRAPHY', color: '#E7C71F' },
    file_format: 'zip',
    file_size: 161_800,
    license: 'OFL-1.1',
    scheduled_for: PAST_DROP_2,
    download_count: 1880,
    compatible_software: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro', 'Photoshop'],
    package_path: 'private-vault-packages/typography/editx-swiss-mono-hud-kit.zip',
    is_live: true,
  },

  // =========================================================================
  // 7. CONTRACTS & FREELANCE BUSINESS
  // =========================================================================
  {
    id: 'v-04',
    title: 'Master Commercial Video Editing Agreement & Retainer Kit',
    description:
      'Attorney-drafted 15-section master video editing contract: 50/25/25 milestone billing, kill fee protection, late fee riders, and copyright handover releases.',
    categories: { slug: 'contracts', name: 'CONTRACTS', color: '#576C43' },
    file_format: 'md',
    file_size: 2_450,
    license: 'MIT',
    scheduled_for: PAST_DROP_1,
    download_count: 1980,
    compatible_software: ['Google Docs', 'Microsoft Word', 'Pages', 'Markdown', 'Browser Print'],
    package_path: 'private-vault-packages/contracts/editx-commercial-video-contract-kit.zip',
    is_live: true,
  },
  {
    id: 'v-16',
    title: 'Short-Form Video Editor High-Ticket Pitch & Rate Card Kit',
    description:
      'Battle-tested 3-step video audit DM/email outreach scripts for landing $1,500–$3,500/mo creator retainers, retainer package matrix, and client objection scripts.',
    categories: { slug: 'contracts', name: 'CONTRACTS', color: '#576C43' },
    file_format: 'md',
    file_size: 1_050,
    license: 'MIT',
    scheduled_for: PAST_DROP_2,
    download_count: 1620,
    compatible_software: ['Notion', 'Google Docs', 'Markdown', 'Notes'],
    package_path: 'private-vault-packages/contracts/editx-shortform-pitch-rate-card.zip',
    is_live: true,
  },
  {
    id: 'v-17',
    title: 'Video Production Mutual NDA & Copyright Release Agreement',
    description:
      'Mutual NDA protecting unreleased client raw rushes and final copyright assignment release receipt upon final payment.',
    categories: { slug: 'contracts', name: 'CONTRACTS', color: '#576C43' },
    file_format: 'md',
    file_size: 650,
    license: 'MIT',
    scheduled_for: TODAY,
    download_count: 1210,
    compatible_software: ['Google Docs', 'Microsoft Word', 'Pages', 'Markdown'],
    package_path: 'private-vault-packages/contracts/editx-nda-and-copyright-release.zip',
    is_live: true,
  },
];
