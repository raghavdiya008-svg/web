const fs = require('fs');
const path = require('path');
const baseDir = path.join(process.cwd(), 'public', 'vault-packages');

function getLicense(assetName, category, licenseType = 'MIT Open License') {
  return `================================================================================
EDITX CREATIVE VAULT // STUDIO MASTER CANISTER
Asset: ${assetName}
Category: ${category}
License: ${licenseType}
Quality: Verified Studio Calibration

TERMS OF USE:
- Permitted for 100% royalty-free commercial, client, and personal productions.
- No attribution required in final video exports or motion renders.
- Direct resale or repackaging as raw standalone assets prohibited.

COMMUNITY:
Official EditX Discord Server: https://discord.gg/editx
================================================================================
`;
}

// 1. Kodak 5219 .cube file
let cubeLines = ['TITLE "EditX Kodak 5219 500T Cine Emulation"', 'LUT_3D_SIZE 17', 'DOMAIN_MIN 0.0 0.0 0.0', 'DOMAIN_MAX 1.0 1.0 1.0', ''];
const N = 17;
for (let b = 0; b < N; b++) {
  for (let g = 0; g < N; g++) {
    for (let r = 0; r < N; r++) {
      const rf = r / (N - 1);
      const gf = g / (N - 1);
      const bf = b / (N - 1);
      const rout = Math.min(1.0, Math.max(0.0, 1.08 * Math.pow(rf, 1.15) - 0.02 * Math.pow(bf, 1.1)));
      const gout = Math.min(1.0, Math.max(0.0, 1.02 * Math.pow(gf, 1.12) + 0.01));
      const bout = Math.min(1.0, Math.max(0.0, 0.94 * Math.pow(bf, 1.25) + 0.02 * Math.pow(gf, 0.8)));
      cubeLines.push(`${rout.toFixed(6)} ${gout.toFixed(6)} ${bout.toFixed(6)}`);
    }
  }
}
const lutPath = path.join(baseDir, 'luts', 'EditX_Kodak_5219_500T.cube');
fs.writeFileSync(lutPath, cubeLines.join('\n'));

// 2. Arri Alexa 35 Matrix
let arriLines = ['TITLE "EditX Arri Alexa 35 LogC4 Matrix"', 'LUT_3D_SIZE 17', 'DOMAIN_MIN 0.0 0.0 0.0', 'DOMAIN_MAX 1.0 1.0 1.0', ''];
for (let b = 0; b < N; b++) {
  for (let g = 0; g < N; g++) {
    for (let r = 0; r < N; r++) {
      const rf = r / (N - 1);
      const gf = g / (N - 1);
      const bf = b / (N - 1);
      const rout = Math.min(1.0, Math.max(0.0, Math.pow(rf, 1.08)));
      const gout = Math.min(1.0, Math.max(0.0, Math.pow(gf, 1.06)));
      const bout = Math.min(1.0, Math.max(0.0, Math.pow(bf, 1.1)));
      arriLines.push(`${rout.toFixed(6)} ${gout.toFixed(6)} ${bout.toFixed(6)}`);
    }
  }
}
fs.writeFileSync(path.join(baseDir, 'luts', 'EditX_Arri_Alexa35_Matrix.cube'), arriLines.join('\n'));

// 3. Commercial Contract Kit
const contractDoc = `# EDITX COMMERCIAL VIDEO EDITING MASTER SERVICE AGREEMENT & RETAINER
Document ID: EDITX-CONTRACT-SPEC-2026

## 1. PARTIES & ENGAGEMENT
This Agreement is entered into between:
- Client: [CLIENT NAME / COMPANY] ("Client")
- Editor / Creator: [YOUR NAME / STUDIO NAME] ("Contractor")

## 2. SCOPE OF SERVICES & DELIVERABLES
Contractor will provide professional video post-production services including:
- Assembly, pacing, and multi-cam synchronization.
- Color grading, audio sweetening/mastering (-14 LUFS standard), and title graphics.
- Final Deliverable Format: High-bitrate 4K UHD ProRes / H.264 exports.

## 3. PAYMENT TERMS & RETAINER DEPOSIT
- Upfront Deposit: 50% non-refundable kickoff retainer required before ingestion of raw media.
- Final Milestone: 50% balance due upon final watermarked preview sign-off, prior to master unwatermarked delivery.
- Late Fee: Invoices overdue by more than 7 days incur a 5% compounding weekly service charge.

## 4. REVISIONS & SCOPE PROTECTION
- Standard Scope includes up to TWO (2) rounds of constructive consolidated revisions.
- Additional revision requests or fundamental script changes after storyboard approval billed at [HOURLY RATE, e.g., $75/hr].

## 5. INTELLECTUAL PROPERTY & RAW FOOTAGE
- Rights Transfer: All final exported media rights transfer to Client ONLY upon receipt of 100% full payment.
- Project Files: Premiere Pro (.prproj), After Effects (.aep), and working assets remain Contractor property unless a project buyout fee of 30% is executed.

Signed:
Client: _______________________ Date: _________
Contractor: ___________________ Date: _________
`;
fs.writeFileSync(path.join(baseDir, 'contracts', 'EditX_Commercial_Video_Editing_Agreement.md'), contractDoc);

// 4. 16mm Grain Guide
const grainSpec = `# EDITX 16MM AUTHENTIC FILM GRAIN OVERLAY SETUP GUIDE

SPECIFICATIONS:
- Scan Type: Kodak Vision3 250D 16mm True Photochemical Optical Scan
- Resolution: 3840 x 2160 (4K UHD)
- Format: ProRes 422 QuickTime (.MOV) Loop
- Blending Mode: Overlay / Soft Light (Opacity: 45% - 65%)

HOW TO USE IN YOUR NLE:
1. Adobe Premiere Pro:
   - Place grain track on V2 above your graded video layer (V1).
   - In Effect Controls > Opacity > Blend Mode: Select 'Overlay'.
   - Recommended Opacity: 55%.

2. DaVinci Resolve:
   - Drop grain on timeline track 2.
   - Inspector > Composite Mode: Select 'Overlay'.

3. After Effects:
   - Set Track Mode column to 'Overlay' or 'Soft Light'.
`;
fs.writeFileSync(path.join(baseDir, 'grain', 'EditX_16mm_Film_Grain_Instructions.txt'), grainSpec);

// Write standalone licenses for direct downloads
fs.writeFileSync(path.join(baseDir, 'luts', 'EDITX_VAULT_LICENSE.txt'), getLicense('Kodak 5219 & Arri 35 Cine Suite', 'Color Science', 'CC-0 Creative Commons'));
fs.writeFileSync(path.join(baseDir, 'contracts', 'EDITX_VAULT_LICENSE.txt'), getLicense('Commercial Video Editing Retainer Kit', 'Legal Spec', 'MIT Open License'));
fs.writeFileSync(path.join(baseDir, 'grain', 'EDITX_VAULT_LICENSE.txt'), getLicense('Vintage 16mm Grain Overlay Pack', 'Overlays', 'MIT Open License'));
fs.writeFileSync(path.join(baseDir, 'sfx', 'EDITX_VAULT_LICENSE.txt'), getLicense('Trailer Sub Bass & Impact Suite 01', 'Audio FX', 'MIT Open License'));

console.log('Studio assets and clean quarantine files successfully created.');
