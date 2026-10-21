import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log(`[Browser ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.error('[Browser Error]:', err.message));

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  await page.waitForTimeout(3000);

  const title = await page.title();
  console.log('Page Title:', title);

  const container = await page.$('#webglContainer canvas');
  console.log('WebGL Canvas on localhost:', !!container);

  await page.screenshot({ path: path.resolve(__dirname, '../localhost_home.png') });
  console.log('Saved localhost_home.png');

  await browser.close();
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
