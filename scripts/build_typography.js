const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const typoDir = path.join(process.cwd(), 'private-vault-packages', 'typography');
if (!fs.existsSync(typoDir)) fs.mkdirSync(typoDir, { recursive: true });

console.log('Downloading real editorial display typefaces (OFL)...');
const synePath = path.join(typoDir, 'Syne-VariableFont_wght.ttf');
const spacePath = path.join(typoDir, 'SpaceGrotesk-VariableFont_wght.ttf');

execSync(`curl.exe -L -s -o "${synePath}" "https://github.com/google/fonts/raw/main/ofl/syne/Syne%5Bwght%5D.ttf"`, { stdio: 'inherit' });
execSync(`curl.exe -L -s -o "${spacePath}" "https://github.com/google/fonts/raw/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf"`, { stdio: 'inherit' });

const guide = `# EDITX EDITORIAL & CYBER TYPOGRAPHY SUITE

## INCLUDED COMMERCIAL TYPEFACES:
1. **Syne (Variable Weight 400–800)**: Avant-garde display typeface designed for cinematic title cards, high-tension fashion films, and commercial video branding.
2. **Space Grotesk (Variable Weight 300–700)**: Proportional tech-grotesque display family designed for technical lower thirds, telemetry overlays, and HUD titles.

## COMPATIBILITY:
- Adobe Premiere Pro & After Effects (Instant install into macOS / Windows Font Book)
- DaVinci Resolve
- Final Cut Pro
- Figma / Photoshop / Illustrator

## LICENSE:
- SIL Open Font License 1.1 (100% Royalty-Free for Client Work & Commercial Broadcasts)
`;
fs.writeFileSync(path.join(typoDir, 'README_SPECIMEN.md'), guide);

const lic = `================================================================================
EDITX CREATIVE VAULT // TYPOGRAPHY MASTER CANISTER
Asset: Editorial & Cyber Typography Suite (Syne + Space Grotesk)
License: SIL Open Font License (OFL-1.1)
Permitted: 100% Free for commercial video, client renders, and broadcasts.
================================================================================
`;
fs.writeFileSync(path.join(typoDir, 'EDITX_VAULT_LICENSE.txt'), lic);

const zipPath = path.join(typoDir, 'editx-editorial-typography-pack.zip');
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const filesToZip = [
  path.join(typoDir, 'Syne-VariableFont_wght.ttf'),
  path.join(typoDir, 'SpaceGrotesk-VariableFont_wght.ttf'),
  path.join(typoDir, 'README_SPECIMEN.md'),
  path.join(typoDir, 'EDITX_VAULT_LICENSE.txt'),
].map(f => `'${f}'`).join(',');

execSync(`powershell -Command "Compress-Archive -Path ${filesToZip} -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });

const stat = fs.statSync(zipPath);
console.log(` Typography pack built successfully: ${(stat.size / 1024).toFixed(1)} KB`);
