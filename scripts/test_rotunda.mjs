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

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    console.log(`[Browser ${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    console.error('[Browser Error]:', err.message);
  });

  const filePath = 'file:///' + path.resolve(__dirname, '../public/rotunda.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Wait 2 seconds for scene initialization and first render frames
  await page.waitForTimeout(2000);

  // Check critical elements in the DOM
  const container = await page.$('#webglContainer canvas');
  console.log('WebGL Canvas exists:', !!container);

  const plaquesCount = await page.$$eval('.spatial-plaque', els => els.length);
  console.log('Spatial plaques count:', plaquesCount);

  // Take screenshot of rotunda initial state
  await page.screenshot({ path: path.resolve(__dirname, '../rotunda_overview.png') });
  console.log('Saved rotunda_overview.png');

  // Click on "01 · Sound Design" timeline pill
  console.log('Clicking Sound Design timeline button...');
  await page.click('button[data-dept-id="sound-design"]');
  await page.waitForTimeout(1000);

  // Check department drawer
  const drawerVisible = await page.$eval('#departmentDrawer', el => {
    return !el.classList.contains('translate-x-[120%]') && !el.classList.contains('opacity-0');
  });
  console.log('Department drawer visible:', drawerVisible);

  const drawerTitle = await page.$eval('#drawerTitle', el => el.textContent.trim());
  console.log('Drawer title:', drawerTitle);

  // Take screenshot with drawer open
  await page.screenshot({ path: path.resolve(__dirname, '../rotunda_drawer.png') });
  console.log('Saved rotunda_drawer.png');

  // Click "Open Tome" button
  console.log('Clicking Open Tome button...');
  await page.click('#openTomeSpreadBtn');
  await page.waitForTimeout(800);

  const modalVisible = await page.$eval('#tomeModalBackdrop', el => !el.classList.contains('hidden'));
  console.log('Tome Modal visible:', modalVisible);

  // Take screenshot of Tome Modal
  await page.screenshot({ path: path.resolve(__dirname, '../rotunda_tome_modal.png') });
  console.log('Saved rotunda_tome_modal.png');

  await browser.close();
  console.log('Done test!');
}

run().catch(err => {
  console.error('Fatal script error:', err);
  process.exit(1);
});
