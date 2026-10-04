const fs = require('fs');

const colorcheckerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="1200" height="800" fill="#121214"/>
  <text x="60" y="60" fill="#8A8A8E" font-family="sans-serif" font-size="18" font-weight="600" letter-spacing="2">COLORCHECKER CLASSIC 24-PATCH TARGET // FLAT LOG EXPOSURE</text>
  <g transform="translate(60, 100)">
    <rect x="0" y="0" width="160" height="130" fill="#735244"/><rect x="180" y="0" width="160" height="130" fill="#c29682"/>
    <rect x="360" y="0" width="160" height="130" fill="#627a9d"/><rect x="540" y="0" width="160" height="130" fill="#576c43"/>
    <rect x="720" y="0" width="160" height="130" fill="#8580b1"/><rect x="900" y="0" width="160" height="130" fill="#67bdaa"/>
    <rect x="0" y="150" width="160" height="130" fill="#d67e2c"/><rect x="180" y="150" width="160" height="130" fill="#505ba6"/>
    <rect x="360" y="150" width="160" height="130" fill="#c15a63"/><rect x="540" y="150" width="160" height="130" fill="#5e3c6c"/>
    <rect x="720" y="150" width="160" height="130" fill="#9dbc40"/><rect x="900" y="150" width="160" height="130" fill="#e0a32e"/>
    <rect x="0" y="300" width="160" height="130" fill="#383d96"/><rect x="180" y="300" width="160" height="130" fill="#469449"/>
    <rect x="360" y="300" width="160" height="130" fill="#ae363a"/><rect x="540" y="300" width="160" height="130" fill="#e7c71f"/>
    <rect x="720" y="300" width="160" height="130" fill="#a03d7c"/><rect x="900" y="300" width="160" height="130" fill="#0885a1"/>
    <rect x="0" y="450" width="160" height="130" fill="#f2f1ee"/><rect x="180" y="450" width="160" height="130" fill="#c8c7c3"/>
    <rect x="360" y="450" width="160" height="130" fill="#9f9e9a"/><rect x="540" y="450" width="160" height="130" fill="#6b6a67"/>
    <rect x="720" y="450" width="160" height="130" fill="#3b3a38"/><rect x="900" y="450" width="160" height="130" fill="#18181a"/>
  </g>
</svg>`;

const skinToneSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="skinGrad" cx="52%" cy="42%" r="35%">
      <stop offset="0%" stop-color="#cbb19d"/>
      <stop offset="60%" stop-color="#9a7f6f"/>
      <stop offset="100%" stop-color="#52423b"/>
    </radialGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d4247"/>
      <stop offset="100%" stop-color="#1f2226"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bgGrad)"/>
  <circle cx="620" cy="380" r="230" fill="url(#skinGrad)" opacity="0.9"/>
  <path d="M380,750 C 450,560 790,560 860,750 Z" fill="#242629"/>
  <text x="50" y="60" fill="#8A8A8E" font-family="sans-serif" font-size="18" letter-spacing="2">ARRI LOG-C3 // TEST SCENE: STUDIO PORTRAIT &amp; SKIN TONALITY</text>
  <line x1="0" y1="730" x2="1200" y2="730" stroke="#303338" stroke-width="2"/>
</svg>`;

const nightExteriorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="neonSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#12131c"/>
      <stop offset="100%" stop-color="#26202e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#neonSky)"/>
  <rect x="100" y="260" width="140" height="540" fill="#171922"/>
  <rect x="280" y="180" width="210" height="620" fill="#1d202c"/>
  <rect x="530" y="320" width="160" height="480" fill="#14161f"/>
  <rect x="740" y="210" width="240" height="590" fill="#202230"/>
  <circle cx="400" cy="360" r="80" fill="#ff4a1c" opacity="0.35"/>
  <circle cx="850" cy="310" r="100" fill="#0885a1" opacity="0.35"/>
  <text x="50" y="60" fill="#8A8A8E" font-family="sans-serif" font-size="18" letter-spacing="2">SONY S-LOG3 // TEST SCENE: NIGHT EXTERIOR &amp; HIGH DYNAMIC RANGE</text>
</svg>`;

const landscapeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#747c87"/>
      <stop offset="60%" stop-color="#989fa8"/>
      <stop offset="100%" stop-color="#b4b9bf"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <polygon points="80,800 420,380 720,800" fill="#4c524e"/>
  <polygon points="340,800 780,310 1150,800" fill="#3a3f3c"/>
  <polygon points="650,800 950,420 1250,800" fill="#2e3330"/>
  <text x="50" y="60" fill="#44474a" font-family="sans-serif" font-size="18" letter-spacing="2">RED LOG3G10 // TEST SCENE: HIGH CONTRAST DAYLIGHT LANDSCAPE</text>
</svg>`;

fs.writeFileSync('public/samples/colorchecker.svg', colorcheckerSvg);
fs.writeFileSync('public/samples/skin_tone.svg', skinToneSvg);
fs.writeFileSync('public/samples/night_exterior.svg', nightExteriorSvg);
fs.writeFileSync('public/samples/daylight_landscape.svg', landscapeSvg);

console.log('Sample frames generated successfully.');
