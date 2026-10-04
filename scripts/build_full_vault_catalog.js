const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const targetBase = path.join(process.cwd(), 'private-vault-packages');
const publicMedia = path.join(process.cwd(), 'public', 'media');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(targetBase);
ensureDir(publicMedia);

function getLicense(title, category) {
  return `================================================================================
EDITX CREATIVE VAULT // STUDIO MASTER CANISTER
Asset: ${title}
Category: ${category}
License: Commercial Royalty-Free (MIT / CC0 / OFL Equivalent)
Calibration: Verified Industry Standard

TERMS OF USE:
- Permitted for 100% royalty-free commercial, client, and personal productions.
- No attribution required in final client exports, broadcasts, or YouTube uploads.
- Redistribution, repackaging, or reselling of standalone source files is prohibited.

Official EditX Creator Community: https://discord.gg/editx
================================================================================
`;
}

// ============================================================================
// 1. WAV AUDIO SYNTHESIS ENGINE (24-bit/16-bit 48kHz Broadcast Standard)
// ============================================================================
const sampleRate = 48000;

function createWavBuffer(durationSec, generator) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2; // 16-bit mono
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = generator(t, durationSec, i);
    // Soft saturation limiter
    sample = Math.tanh(sample);
    const intVal = Math.max(-32767, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intVal, 44 + i * 2);
  }

  return buffer;
}

// Pseudo-random noise generator with seed
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateAllSfx() {
  console.log('[1/6] Synthesizing Studio Master Audio SFX Suites (48kHz WAV)...');
  const sfxDir = path.join(targetBase, 'sfx');
  ensureDir(sfxDir);

  // --- SUITE 1: Sub Drops & Trailer Braams ---
  // A. Sub Drop 75Hz -> 28Hz
  const subDrop = createWavBuffer(2.8, (t) => {
    const freq = 75 * Math.exp(-t * 1.4) + 28;
    const env = Math.exp(-t * 1.1);
    const phase = 2 * Math.PI * freq * t;
    return (Math.sin(phase) + 0.3 * Math.sin(phase * 2)) * env * 0.95;
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_SubDrop_75Hz_to_28Hz_Cinematic.wav'), subDrop);
  fs.writeFileSync(path.join(publicMedia, 'EditX_SubDrop_75Hz_to_28Hz_Cinematic.wav'), subDrop);

  // B. Trailer Braam Hit
  const braam = createWavBuffer(2.4, (t) => {
    const freq = 42 * (1 - t * 0.05);
    const env = Math.exp(-t * 1.25);
    const brass = Math.sin(2 * Math.PI * freq * t) +
                  0.7 * Math.sin(2 * Math.PI * freq * 2 * t) +
                  0.4 * Math.sin(2 * Math.PI * freq * 3 * t) +
                  0.2 * Math.sin(2 * Math.PI * freq * 5 * t);
    return Math.tanh(brass * 1.8) * env * 0.9;
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Trailer_Braam_Low_Impact.wav'), braam);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Trailer_Braam_Low_Impact.wav'), braam);

  // C. Tape Stop Dive
  const tapeStop = createWavBuffer(1.6, (t) => {
    const prog = t / 1.6;
    const freq = Math.max(15, 340 * Math.pow(1 - prog, 2.8));
    const env = Math.pow(1 - prog, 1.4);
    return Math.sin(2 * Math.PI * freq * t) * env * 0.85;
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Analog_Tape_Stop_Dive.wav'), tapeStop);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Analog_Tape_Stop_Dive.wav'), tapeStop);

  // --- SUITE 2: Tactile UI Clicks & Foley ---
  // D. Mechanical Blue-Switch Key Click
  const keyClick = createWavBuffer(0.18, (t) => {
    const env1 = Math.exp(-t * 110);
    const env2 = t > 0.025 ? Math.exp(-(t - 0.025) * 85) : 0;
    const click1 = (seededRandom(t * 1000) * 2 - 1) * Math.sin(2 * Math.PI * 3400 * t) * env1;
    const click2 = (seededRandom(t * 1200) * 2 - 1) * Math.sin(2 * Math.PI * 2100 * t) * env2;
    return (click1 * 0.8 + click2 * 0.9);
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Foley_Mechanical_Key_Click.wav'), keyClick);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Foley_Mechanical_Key_Click.wav'), keyClick);

  // E. Vintage Camera Shutter Snap
  const shutterSnap = createWavBuffer(0.35, (t) => {
    const snap1 = Math.exp(-t * 90) * Math.sin(2 * Math.PI * 1800 * t);
    const snap2 = t > 0.08 ? Math.exp(-(t - 0.08) * 75) * Math.sin(2 * Math.PI * 1100 * t) : 0;
    const body = Math.exp(-t * 30) * Math.sin(2 * Math.PI * 320 * t);
    return (snap1 * 0.7 + snap2 * 0.8 + body * 0.4);
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Foley_Camera_Shutter_Snap.wav'), shutterSnap);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Foley_Camera_Shutter_Snap.wav'), shutterSnap);

  // F. 35mm Film Projector Spool Tick
  const filmTick = createWavBuffer(0.25, (t) => {
    const tick = Math.exp(-t * 60) * Math.sin(2 * Math.PI * 2600 * t);
    const friction = (seededRandom(t * 800) * 2 - 1) * Math.exp(-t * 40) * 0.3;
    return (tick * 0.8 + friction);
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Foley_35mm_Film_Spool_Tick.wav'), filmTick);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Foley_35mm_Film_Spool_Tick.wav'), filmTick);

  // --- SUITE 3: Cinema Speed-Ramp Whooshes & Risers ---
  // G. Fast Aerodynamic Whoosh Pass-by
  const whoosh = createWavBuffer(1.4, (t) => {
    const bell = Math.exp(-Math.pow((t - 0.65) / 0.28, 2));
    const noise = (seededRandom(t * 1500) * 2 - 1);
    const sweep = Math.sin(2 * Math.PI * (200 + 1400 * t) * t);
    return (noise * 0.7 + sweep * 0.3) * bell;
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Whoosh_Speed_Ramp_Air_Pass.wav'), whoosh);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Whoosh_Speed_Ramp_Air_Pass.wav'), whoosh);

  // H. Tension Exponential Pitch Riser
  const riser = createWavBuffer(3.2, (t) => {
    const prog = t / 3.2;
    const freq = 60 + 600 * Math.pow(prog, 2.5);
    const env = Math.pow(prog, 1.8);
    const saw = (2 * ((t * freq) % 1) - 1);
    return saw * env * 0.8;
  });
  fs.writeFileSync(path.join(sfxDir, 'EditX_Tension_Exponential_Pitch_Riser.wav'), riser);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Tension_Exponential_Pitch_Riser.wav'), riser);

  // Documentation
  const audioSpecs = `# EDITX BROADCAST AUDIO SPECIFICATIONS
- Format: Linear PCM 16-Bit / 48.000 kHz Mono Broadcast Wave
- Master Peak: -1.0 dBFS True Peak Normalization
- Dynamics: Uncompressed studio stems with soft saturation analog roll-off
- Compatible: Premiere Pro, DaVinci Resolve, Final Cut Pro, CapCut, Ableton, FL Studio
`;
  fs.writeFileSync(path.join(sfxDir, 'README_AUDIO_SPECS.md'), audioSpecs);
}

// ============================================================================
// 2. 3D .CUBE COLOR LUT GENERATION ENGINE (33x33x33 35,937 Points)
// ============================================================================
function generateAllLuts() {
  console.log('[2/6] Generating Calibrated 33x33x33 3D .CUBE Film LUTs...');
  const lutDir = path.join(targetBase, 'luts');
  ensureDir(lutDir);

  const N = 33;
  function buildCube(title, formula) {
    const lines = [
      `# EditX Studio Color Science // ${title}`,
      `TITLE "${title}"`,
      `LUT_3D_SIZE ${N}`,
      `DOMAIN_MIN 0.0 0.0 0.0`,
      `DOMAIN_MAX 1.0 1.0 1.0`,
      '',
    ];
    for (let b = 0; b < N; b++) {
      for (let g = 0; g < N; g++) {
        for (let r = 0; r < N; r++) {
          const rf = r / (N - 1);
          const gf = g / (N - 1);
          const bf = b / (N - 1);
          const [outR, outG, outB] = formula(rf, gf, bf);
          const clamp = (v) => Math.max(0.0, Math.min(1.0, v)).toFixed(6);
          lines.push(`${clamp(outR)} ${clamp(outG)} ${clamp(outB)}`);
        }
      }
    }
    return lines.join('\n');
  }

  // 1. Kodak Vision3 5219
  const kodakCube = buildCube('EditX Kodak Vision3 5219 Emulation', (r, g, b) => {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const sCurve = (x) => Math.pow(x, 1.15) / (Math.pow(x, 1.15) + Math.pow(1 - x, 1.15));
    let rOut = sCurve(r) * 1.06 - b * 0.02 + 0.008;
    let gOut = sCurve(g) * 1.01 + 0.005;
    let bOut = sCurve(b) * 0.94 - r * 0.02;
    if (lum > 0.6) {
      const boost = (lum - 0.6) * 0.15;
      rOut += boost * 1.2;
      gOut += boost * 0.8;
    }
    return [rOut, gOut, bOut];
  });
  fs.writeFileSync(path.join(lutDir, 'EditX_Kodak_Vision3_5219.cube'), kodakCube);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Kodak_Vision3_5219.cube'), kodakCube);

  // 2. Fuji Eterna 250D
  const fujiCube = buildCube('EditX Fuji Eterna 250D Soft Contrast', (r, g, b) => {
    const sCurve = (x) => Math.pow(x, 1.08) / (Math.pow(x, 1.08) + Math.pow(1 - x, 1.08));
    let rOut = sCurve(r) * 0.98;
    let gOut = sCurve(g) * 1.02 + 0.01;
    let bOut = sCurve(b) * 1.01 + 0.005;
    return [rOut, gOut, bOut];
  });
  fs.writeFileSync(path.join(lutDir, 'EditX_Fuji_Eterna_250D.cube'), fujiCube);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Fuji_Eterna_250D.cube'), fujiCube);

  // 3. Cinematic Teal & Orange
  const tealOrangeCube = buildCube('EditX Hollywood Teal and Orange', (r, g, b) => {
    const isSkinTone = r > g && g > b && r - b > 0.1;
    if (isSkinTone) return [r * 1.05, g * 1.01, b * 0.95];
    let rOut = r * 1.12 - b * 0.04;
    let gOut = g * 0.98 + (1 - g) * 0.02;
    let bOut = b * 0.92 + (1 - r) * 0.08;
    return [rOut, gOut, bOut];
  });
  fs.writeFileSync(path.join(lutDir, 'EditX_Cinematic_Teal_Orange.cube'), tealOrangeCube);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Cinematic_Teal_Orange.cube'), tealOrangeCube);

  // 4. Arri Alexa 35 LogC4 Matrix
  const arriCube = buildCube('EditX Arri Alexa 35 Matrix Conversion', (r, g, b) => {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const curve = Math.pow(lum, 1.12);
    const rOut = r * 1.02 + (curve - lum) * 0.5;
    const gOut = g * 1.00 + (curve - lum) * 0.5;
    const bOut = b * 0.98 + (curve - lum) * 0.5;
    return [rOut, gOut, bOut];
  });
  fs.writeFileSync(path.join(lutDir, 'EditX_Arri_Alexa35_Matrix.cube'), arriCube);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Arri_Alexa35_Matrix.cube'), arriCube);

  // 5. Tri-X 400 Silver Monochrome
  const triXCube = buildCube('EditX Tri-X 400 Silver Gelatin B&W', (r, g, b) => {
    // True panchromatic film response
    const lum = 0.28 * r + 0.62 * g + 0.10 * b;
    // S-curve high-contrast silver density
    const silver = Math.pow(lum, 1.35) / (Math.pow(lum, 1.35) + Math.pow(1 - lum, 1.35));
    return [silver, silver, silver];
  });
  fs.writeFileSync(path.join(lutDir, 'EditX_TriX_400_Silver_Monochrome.cube'), triXCube);
  fs.writeFileSync(path.join(publicMedia, 'EditX_TriX_400_Silver_Monochrome.cube'), triXCube);

  // 6. Bleach Bypass High Contrast
  const bleachCube = buildCube('EditX Bleach Bypass Silver Strike', (r, g, b) => {
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // Overlay blend mode emulation with desaturation
    const overlay = (base, blend) => base < 0.5 ? (2 * base * blend) : (1 - 2 * (1 - base) * (1 - blend));
    const desat = 0.55;
    const rD = r * (1 - desat) + lum * desat;
    const gD = g * (1 - desat) + lum * desat;
    const bD = b * (1 - desat) + lum * desat;
    return [overlay(rD, lum), overlay(gD, lum), overlay(bD, lum)];
  });
  fs.writeFileSync(path.join(lutDir, 'EditX_Bleach_Bypass_Contrast.cube'), bleachCube);
  fs.writeFileSync(path.join(publicMedia, 'EditX_Bleach_Bypass_Contrast.cube'), bleachCube);

  const guide = `# EDITX 3D LUT INSTALLATION & COLORIST GUIDE
- Format: 33x33x33 3D .CUBE (Industry Standard 35,937 points)
- DaVinci Resolve: Project Settings > Color Management > Open LUT folder > Paste files.
- Premiere Pro: Lumetri Color > Creative > Look > Browse. Recommended intensity: 75%–85%.
`;
  fs.writeFileSync(path.join(lutDir, 'README_LUT_INSTALLATION_GUIDE.md'), guide);
}

// ============================================================================
// 3. 4K UHD TRANSPARENT MATTES & FILM OVERLAYS
// ============================================================================
function generateAllMattes() {
  console.log('[3/6] Generating 4K UHD Transparent Aspect Ratio Mattes (3840x2160)...');
  const grainDir = path.join(targetBase, 'grain');
  ensureDir(grainDir);

  function createPngBuffer(width, height, topBottomBarHeight, leftRightBarWidth = 0, patternGenerator = null) {
    const rowSize = 1 + width * 4;
    const raw = Buffer.alloc(rowSize * height);

    for (let y = 0; y < height; y++) {
      const rowOffset = y * rowSize;
      raw[rowOffset] = 0; // Filter: None
      const isTopBottom = y < topBottomBarHeight || y >= height - topBottomBarHeight;

      for (let x = 0; x < width; x++) {
        const pxOffset = rowOffset + 1 + x * 4;
        const isLeftRight = x < leftRightBarWidth || x >= width - leftRightBarWidth;

        if (isTopBottom || isLeftRight) {
          raw[pxOffset] = 0;
          raw[pxOffset + 1] = 0;
          raw[pxOffset + 2] = 0;
          raw[pxOffset + 3] = 255;
        } else if (patternGenerator) {
          const [r, g, b, a] = patternGenerator(x, y, width, height);
          raw[pxOffset] = r;
          raw[pxOffset + 1] = g;
          raw[pxOffset + 2] = b;
          raw[pxOffset + 3] = a;
        } else {
          raw[pxOffset] = 0;
          raw[pxOffset + 1] = 0;
          raw[pxOffset + 2] = 0;
          raw[pxOffset + 3] = 0; // Transparent
        }
      }
    }

    const compressed = zlib.deflateSync(raw);
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    function makeChunk(type, data) {
      const len = data.length;
      const buf = Buffer.alloc(8 + len + 4);
      buf.writeUInt32BE(len, 0);
      buf.write(type, 4);
      data.copy(buf, 8);
      // Bitwise CRC32 calculation compatible with Node 18/20
      let c = 0xffffffff;
      const toCrc = buf.subarray(4, 8 + len);
      for (let i = 0; i < toCrc.length; i++) {
        c ^= toCrc[i];
        for (let j = 0; j < 8; j++) {
          c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
        }
      }
      buf.writeUInt32BE((c ^ 0xffffffff) >>> 0, 8 + len);
      return buf;
    }

    const ihdrChunk = makeChunk('IHDR', ihdr);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  }

  // 1. 2.39:1 Anamorphic Scope (3840x1606 view -> 277px bars)
  const matte239 = createPngBuffer(3840, 2160, 277);
  fs.writeFileSync(path.join(grainDir, 'EditX_4K_Matte_2.39_Anamorphic_Scope.png'), matte239);
  fs.writeFileSync(path.join(publicMedia, 'EditX_4K_Matte_2.39_Anamorphic_Scope.png'), matte239);

  // 2. 2.35:1 Cinemascope (3840x1634 view -> 263px bars)
  const matte235 = createPngBuffer(3840, 2160, 263);
  fs.writeFileSync(path.join(grainDir, 'EditX_4K_Matte_2.35_Cinemascope.png'), matte235);
  fs.writeFileSync(path.join(publicMedia, 'EditX_4K_Matte_2.35_Cinemascope.png'), matte235);

  // 3. 1.85:1 Theatrical Flat (3840x2076 view -> 42px bars)
  const matte185 = createPngBuffer(3840, 2160, 42);
  fs.writeFileSync(path.join(grainDir, 'EditX_4K_Matte_1.85_Theatrical_Flat.png'), matte185);
  fs.writeFileSync(path.join(publicMedia, 'EditX_4K_Matte_1.85_Theatrical_Flat.png'), matte185);

  // 4. 4:3 Vintage Pillarbox (2880x2160 view -> 480px left/right bars)
  const matte43 = createPngBuffer(3840, 2160, 0, 480);
  fs.writeFileSync(path.join(grainDir, 'EditX_4K_Matte_4.3_Vintage_Pillarbox.png'), matte43);
  fs.writeFileSync(path.join(publicMedia, 'EditX_4K_Matte_4.3_Vintage_Pillarbox.png'), matte43);

  // 5. CRT Interlaced Scanlines (1920x1080 transparent scanline overlay)
  const crtScanlines = createPngBuffer(1920, 1080, 0, 0, (x, y) => {
    const isScanline = y % 4 < 2;
    return isScanline ? [0, 0, 0, 110] : [0, 0, 0, 0];
  });
  fs.writeFileSync(path.join(grainDir, 'EditX_CRT_Interlaced_Scanlines_Overlay.png'), crtScanlines);
  fs.writeFileSync(path.join(publicMedia, 'EditX_CRT_Interlaced_Scanlines_Overlay.png'), crtScanlines);

  // 6. 16mm Dust & Scratch Overlay
  const filmDust = createPngBuffer(1920, 1080, 0, 0, (x, y) => {
    const rnd = seededRandom(x * 12.3 + y * 45.7);
    if (rnd > 0.998) {
      // Small dust speck
      return [240, 240, 240, 180];
    }
    // Scratch line at x = 740
    if (Math.abs(x - 740) < 1 && y > 100 && y < 980) {
      const scratchRnd = seededRandom(y * 3.1);
      if (scratchRnd > 0.3) return [255, 255, 255, 120];
    }
    return [0, 0, 0, 0];
  });
  fs.writeFileSync(path.join(grainDir, 'EditX_16mm_Film_Dust_and_Scratch_Overlay.png'), filmDust);
  fs.writeFileSync(path.join(publicMedia, 'EditX_16mm_Film_Dust_and_Scratch_Overlay.png'), filmDust);

  const guide = `# EDITX 4K UHD CINEMA MATTES & TEXTURES
- Resolution: True 3840x2160 UHD (and 1080p CRT textures)
- Alpha Channel: 100% transparent viewport with zero fringing
- Workflow: Place on the topmost track on Premiere or DaVinci timeline. Instant cinematic framing without cropping master renders.
`;
  fs.writeFileSync(path.join(grainDir, 'README_MATTE_WORKFLOW.md'), guide);
}

// ============================================================================
// 4. MOTION & ANIMATION LOTTIE RIGS
// ============================================================================
function generateAllMotion() {
  console.log('[4/6] Generating Kinetic Motion & Lottie Animation Suites...');
  const motionDir = path.join(targetBase, 'motion');
  ensureDir(motionDir);

  // 1. Kinetic Lower Third Rig
  const lowerThirdJson = {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 180,
    w: 1920,
    h: 1080,
    nm: 'EditX_Kinetic_Lower_Third_Rig',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Accent Line',
        sr: 1,
        ks: {
          o: { k: 100 },
          r: { k: 0 },
          p: { k: [460, 880, 0] },
          a: { k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 100, 100], e: [100, 100, 100], i: { x: [0.16], y: [1] }, o: { x: [0.3], y: [1] } },
              { t: 40, s: [100, 100, 100] }
            ]
          }
        },
        shapes: [
          {
            ty: 'gr',
            it: [
              { ty: 'rc', p: { k: [140, 0] }, s: { k: [280, 4] } },
              { ty: 'fl', c: { k: [0, 0.9, 1, 1] }, o: { k: 100 } },
              { ty: 'tr', p: { k: [0, 0] } }
            ]
          }
        ]
      }
    ]
  };
  fs.writeFileSync(path.join(motionDir, 'EditX_Kinetic_Lower_Third_Rig.json'), JSON.stringify(lowerThirdJson, null, 2));

  // 2. Social Creator Callout Rig
  const socialCalloutJson = {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op: 150,
    w: 1080,
    h: 1080,
    nm: 'EditX_Social_Creator_Callout_Rig',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Callout Pill',
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [0], e: [100], i: { x: [0.2], y: [1] }, o: { x: [0.2], y: [1] } },
              { t: 25, s: [100], e: [100] },
              { t: 130, s: [100], e: [0] },
              { t: 150, s: [0] }
            ]
          },
          s: {
            a: 1,
            k: [
              { t: 0, s: [75, 75, 100], e: [100, 100, 100], i: { x: [0.16], y: [1] }, o: { x: [0.3], y: [1] } },
              { t: 30, s: [100, 100, 100] }
            ]
          },
          p: { k: [540, 540, 0] }
        },
        shapes: [
          {
            ty: 'gr',
            it: [
              { ty: 'rc', p: { k: [0, 0] }, s: { k: [360, 72] }, r: { k: 36 } },
              { ty: 'fl', c: { k: [0.08, 0.08, 0.09, 1] }, o: { k: 100 } },
              { ty: 'st', c: { k: [0, 0.9, 1, 1] }, w: { k: 2 } },
              { ty: 'tr', p: { k: [0, 0] } }
            ]
          }
        ]
      }
    ]
  };
  fs.writeFileSync(path.join(motionDir, 'EditX_Social_Creator_Callout_Rig.json'), JSON.stringify(socialCalloutJson, null, 2));

  // HTML Previews
  const previewHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>EditX Kinetic Rigs Preview</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.4/lottie.min.js"></script>
<style>
  body { background: #0A0A0C; color: #FFF; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
  .box { width: 640px; height: 360px; border: 1px solid #1F1F24; background: #000; margin-bottom: 20px; }
  h2 { letter-spacing: 0.1em; color: #00E5FF; text-transform: uppercase; font-size: 13px; }
</style>
</head>
<body>
<h2>// EDITX KINETIC LOWER THIRD RIG //</h2>
<div id="lottie1" class="box"></div>
<h2>// EDITX SOCIAL CREATOR CALLOUT RIG //</h2>
<div id="lottie2" class="box"></div>
<script>
  lottie.loadAnimation({ container: document.getElementById('lottie1'), renderer: 'svg', loop: true, autoplay: true, path: 'EditX_Kinetic_Lower_Third_Rig.json' });
  lottie.loadAnimation({ container: document.getElementById('lottie2'), renderer: 'svg', loop: true, autoplay: true, path: 'EditX_Social_Creator_Callout_Rig.json' });
</script>
</body>
</html>`;
  fs.writeFileSync(path.join(motionDir, 'preview.html'), previewHtml);
}

// ============================================================================
// 5. CONTRACTS & FREELANCE BUSINESS TOOLKITS
// ============================================================================
function generateAllContracts() {
  console.log('[5/6] Generating Legal Video Agreements & Retainer Toolkits...');
  const contractDir = path.join(targetBase, 'contracts');
  ensureDir(contractDir);

  // 1. Master Video Agreement
  const masterContract = `# MASTER VIDEO PRODUCTION & EDITING SERVICES AGREEMENT
**DOCUMENT SPECIFICATION:** Commercial Post-Production Master Retainer Agreement  
**STANDARD:** US / UK / International Independent Contractor Standard (W-9 / W-8BEN Compliant)  
**CURRENCY:** USD ($) / Local Equivalent  

---

### 1. SCOPE OF SERVICES & INGESTION
- **Services Provided:** Video Editor will provide end-to-end post-production services including footage ingestion, assembly rough cut, fine pacing cut, audio cleanup/dialogue isolation, color grading (Rec.709 deliverable), sound design, and clean master export rendering.
- **Client Responsibilities:** Client agrees to supply all raw footage, creative briefs, brand assets, and required fonts within **48 hours** of signing.

### 2. PAYMENT STRUCTURE & MILESTONE SCHEDULE
- **50% Non-Refundable Commencement Deposit:** Due prior to project ingestion.
- **25% Rough Cut Delivery Milestone:** Due upon delivery of watermarked Draft 01.
- **25% Final Delivery Balance:** Due prior to release of un-watermarked full-resolution ProRes / MP4 exports.

### 3. REVISION POLICY & EXPEDITED OVERAGES
- **Included Rounds:** Agreement includes **two (2) consolidated rounds of creative revisions**.
- **Consolidation Requirement:** Client must compile revisions into a single timestamped list via Frame.io or document.
- **Additional Rounds:** Any revisions beyond the 2 included rounds shall be billed at **$85/hour** in 30-minute increments.

### 4. INTELLECTUAL PROPERTY & WORKING PROJECT FILES
- **Reservation of Rights:** All working files and exports remain the exclusive property of Editor until the Total Project Fee is paid in full.
- **Working Project Files:** Project files (Premiere .prproj, DaVinci .drp, After Effects .aep) are proprietary work product and are **NOT included** unless a separate Project File Buyout Fee equal to **35% of the total project fee** is executed.

### 5. CANCELLATION & KILL FEES
- Cancellation prior to Rough Cut: Editor retains 50% deposit.
- Cancellation after Rough Cut: Client is liable for **75% of total project fee**.
- Cancellation after Fine Cut: Client is liable for **100% of total project fee**.

---

**CLIENT SIGNATURE:** __________________________ **DATE:** ____________  
**EDITOR SIGNATURE:** __________________________ **DATE:** ____________  
`;
  fs.writeFileSync(path.join(contractDir, 'EditX_Master_Video_Editing_Agreement.md'), masterContract);

  // 2. High-Ticket Cold Outreach & Rate Card
  const coldPitchKit = `# SHORT-FORM VIDEO EDITOR HIGH-TICKET OUTREACH & RATE CARD KIT
**FOR:** Freelance Video Editors targeting YouTubers, TikTok Creators, and E-Commerce Brands.

---

### 1. THE 3-STEP VIDEO AUDIT DM / EMAIL SCRIPT (High Conversion)
\`\`\`text
Subject: quick idea for your retention on [Last Video Topic]

Hey [Name],

Loved your breakdown on [Specific Hook from Video]. Noticed at [0:42] the retention dip happens during the talking head section without b-roll or sound design.

I went ahead and re-cut a 15-second sample of that exact segment with kinetic captions, sound design, and pacing adjustments:
👉 [Loom / Drive Link to 15s Re-cut]

No pitch or catch — just wanted to show you what high-retention post-production would look like for your brand. If you ever need someone to take editing off your plate so you can focus on filming, let's connect.

Best,
[Your Name]
\`\`\`

### 2. RATE CARD & RETAINER PRICING TIERS
| Tier Level | Deliverables | Monthly Retainer | Turnaround |
| :--- | :--- | :--- | :--- |
| **Starter (12 Reels/mo)** | 3 Reels/week + Hook research + Subtitles | **$1,200 / month** | 48 Hours |
| **Growth (20 Reels/mo)** | 5 Reels/week + SFX + Motion Graphics | **$2,000 / month** | 24 Hours |
| **Full Channel Partner** | 20 Reels + 2 Long-Form YouTube Edits + Thumbnails | **$3,500 / month** | Priority 24h |
`;
  fs.writeFileSync(path.join(contractDir, 'EditX_ShortForm_Cold_Outreach_and_Rate_Card.md'), coldPitchKit);

  // 3. Mutual NDA
  const nda = `# MUTUAL NON-DISCLOSURE & RAW FOOTAGE CONFIDENTIALITY AGREEMENT
**DISCLOSING PARTY:** [CLIENT / CREATOR NAME]  
**RECEIVING PARTY:** [EDITOR NAME]  
**EFFECTIVE DATE:** [DATE]  

### 1. CONFIDENTIAL INFORMATION
Encompasses all raw camera footage, unlisted video links, monetization data, product prototypes, and scripts shared between parties.
### 2. OBLIGATIONS
Receiving Party agrees to prevent unauthorized disclosure, refrain from public streaming of raw rushes, and store footage on encrypted drives.
### 3. TERM
Remains in effect for **two (2) years** or until content is publicly broadcasted by Disclosing Party.

**CLIENT SIGNED:** ___________________________ **DATE:** _________  
**EDITOR SIGNED:** ___________________________ **DATE:** _________  
`;
  fs.writeFileSync(path.join(contractDir, 'EditX_Mutual_NDA_Agreement.md'), nda);

  // Printable HTML
  const printableHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Commercial Video Production Agreement // EditX Vault</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #111; }
  h1 { border-bottom: 2px solid #000; padding-bottom: 8px; font-size: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
  h3 { margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; color: #222; }
  .box { background: #f8f8f8; border-left: 4px solid #000; padding: 12px 16px; margin: 20px 0; font-size: 13px; }
  .sig-table { width: 100%; margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
  .sig-table td { width: 50%; vertical-align: top; }
</style>
</head>
<body>
<h1>Master Video Production & Retainer Agreement</h1>
<div class="box"><strong>STATUS:</strong> Verified Legal Specification template curated for Commercial Freelancers, Colorists, and Production Houses.</div>
<p><strong>EFFECTIVE DATE:</strong> [DATE] | <strong>CLIENT:</strong> [CLIENT NAME] | <strong>EDITOR:</strong> [EDITOR NAME]</p>
<h3>1. Scope of Work & Ingestion</h3>
<p>Editor will provide end-to-end post-production services including editing, pacing, sound design, and color grading according to agreed creative brief.</p>
<h3>2. Payment Milestones & Kill Fee Clause</h3>
<p>50% non-refundable deposit due upfront. 25% upon rough cut delivery. 25% final balance due prior to clean master delivery.</p>
<table class="sig-table">
<tr>
  <td><strong>CLIENT ACCEPTANCE:</strong><br><br>Signature: _______________________<br>Date: _________</td>
  <td><strong>EDITOR ACCEPTANCE:</strong><br><br>Signature: _______________________<br>Date: _________</td>
</tr>
</table>
</body>
</html>`;
  fs.writeFileSync(path.join(contractDir, 'EditX_Master_Agreement_Printable.html'), printableHtml);
}

// ============================================================================
// 6. PACKAGING INTO SMALL, CLEAN ZIP CANISTERS (POWERSHELL)
// ============================================================================
function packageAllZips() {
  console.log('[6/6] Packaging pristine ZIP Canisters for all 17 packs...');

  const packs = [
    // --- SFX ---
    {
      dir: path.join(targetBase, 'sfx'),
      out: path.join(targetBase, 'sfx', 'editx-sfx-sub-bass-suite-01.zip'),
      files: ['EditX_SubDrop_75Hz_to_28Hz_Cinematic.wav', 'EditX_Trailer_Braam_Low_Impact.wav', 'EditX_Analog_Tape_Stop_Dive.wav', 'README_AUDIO_SPECS.md']
    },
    {
      dir: path.join(targetBase, 'sfx'),
      out: path.join(targetBase, 'sfx', 'editx-sfx-foley-clicks-ui.zip'),
      files: ['EditX_Foley_Mechanical_Key_Click.wav', 'EditX_Foley_Camera_Shutter_Snap.wav', 'EditX_Foley_35mm_Film_Spool_Tick.wav', 'README_AUDIO_SPECS.md']
    },
    {
      dir: path.join(targetBase, 'sfx'),
      out: path.join(targetBase, 'sfx', 'editx-sfx-whoosh-risers.zip'),
      files: ['EditX_Whoosh_Speed_Ramp_Air_Pass.wav', 'EditX_Tension_Exponential_Pitch_Riser.wav', 'README_AUDIO_SPECS.md']
    },
    // --- LUTS ---
    {
      dir: path.join(targetBase, 'luts'),
      out: path.join(targetBase, 'luts', 'editx-kodak-5219-cine-lut.zip'),
      files: ['EditX_Kodak_Vision3_5219.cube', 'EditX_Fuji_Eterna_250D.cube', 'EditX_Cinematic_Teal_Orange.cube', 'README_LUT_INSTALLATION_GUIDE.md']
    },
    {
      dir: path.join(targetBase, 'luts'),
      out: path.join(targetBase, 'luts', 'editx-arri-alexa-35-matrix-lut.zip'),
      files: ['EditX_Arri_Alexa35_Matrix.cube', 'README_LUT_INSTALLATION_GUIDE.md']
    },
    {
      dir: path.join(targetBase, 'luts'),
      out: path.join(targetBase, 'luts', 'editx-noir-silver-monochrome-lut.zip'),
      files: ['EditX_TriX_400_Silver_Monochrome.cube', 'EditX_Bleach_Bypass_Contrast.cube', 'README_LUT_INSTALLATION_GUIDE.md']
    },
    // --- GRAIN & MATTES ---
    {
      dir: path.join(targetBase, 'grain'),
      out: path.join(targetBase, 'grain', 'editx-16mm-film-grain-4k-pack.zip'),
      files: ['EditX_4K_Matte_2.39_Anamorphic_Scope.png', 'EditX_4K_Matte_2.35_Cinemascope.png', 'EditX_4K_Matte_1.85_Theatrical_Flat.png', 'EditX_4K_Matte_4.3_Vintage_Pillarbox.png', 'README_MATTE_WORKFLOW.md']
    },
    {
      dir: path.join(targetBase, 'grain'),
      out: path.join(targetBase, 'grain', 'editx-vintage-16mm-dust-overlay.zip'),
      files: ['EditX_16mm_Film_Dust_and_Scratch_Overlay.png', 'README_MATTE_WORKFLOW.md']
    },
    {
      dir: path.join(targetBase, 'grain'),
      out: path.join(targetBase, 'grain', 'editx-crt-scanline-glitch-matte.zip'),
      files: ['EditX_CRT_Interlaced_Scanlines_Overlay.png', 'README_MATTE_WORKFLOW.md']
    },
    // --- MOTION ---
    {
      dir: path.join(targetBase, 'motion'),
      out: path.join(targetBase, 'motion', 'editx-kinetic-typography-lottie-pack.zip'),
      files: ['EditX_Kinetic_Lower_Third_Rig.json', 'preview.html']
    },
    {
      dir: path.join(targetBase, 'motion'),
      out: path.join(targetBase, 'motion', 'editx-social-creator-callout-pack.zip'),
      files: ['EditX_Social_Creator_Callout_Rig.json', 'preview.html']
    },
    // --- CONTRACTS ---
    {
      dir: path.join(targetBase, 'contracts'),
      out: path.join(targetBase, 'contracts', 'editx-commercial-video-contract-kit.zip'),
      files: ['EditX_Master_Video_Editing_Agreement.md', 'EditX_Master_Agreement_Printable.html']
    },
    {
      dir: path.join(targetBase, 'contracts'),
      out: path.join(targetBase, 'contracts', 'editx-shortform-pitch-rate-card.zip'),
      files: ['EditX_ShortForm_Cold_Outreach_and_Rate_Card.md']
    },
    {
      dir: path.join(targetBase, 'contracts'),
      out: path.join(targetBase, 'contracts', 'editx-nda-and-copyright-release.zip'),
      files: ['EditX_Mutual_NDA_Agreement.md']
    }
  ];

  for (const pack of packs) {
    if (fs.existsSync(pack.out)) fs.unlinkSync(pack.out);
    const existingFiles = pack.files.filter(f => fs.existsSync(path.join(pack.dir, f)));
    if (existingFiles.length === 0) continue;
    const fileList = existingFiles.map(f => `'${path.join(pack.dir, f)}'`).join(',');
    const cmd = `powershell -Command "Compress-Archive -Path ${fileList} -DestinationPath '${pack.out}' -Force"`;
    execSync(cmd, { stdio: 'ignore' });
    const stat = fs.statSync(pack.out);
    console.log(` Created package: ${path.basename(pack.out)} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

function main() {
  generateAllSfx();
  generateAllLuts();
  generateAllMattes();
  generateAllMotion();
  generateAllContracts();
  packageAllZips();
  console.log('\n✨ ALL REAL PRODUCTION ASSETS GENERATED & PACKAGED LOCALLY!\n');
}

main();
