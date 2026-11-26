/* Character-pass screenshot rig: dumps sprite sheets (pixel-exact, from the
   live sprite canvases) and in-context facing/trial shots to a target dir.
   Usage: node charshot.js <outdir> */
const fs = require('fs');
const path = require('path');
/* playwright-core: a local install if one is present, else the Survival
   Game test rig's install on this machine — see tests/README.md. */
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch (e) { ({ chromium } = require('/home/hatch/workspace/survival-game/tests/node_modules/playwright-core')); }

const OUT = process.argv[2];
if (!OUT) { console.error('usage: node charshot.js <outdir>'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

function findChromium() {
  const base = '/home/hatch/.cache/ms-playwright';
  for (const d of fs.readdirSync(base)) {
    if (d.startsWith('chromium_headless_shell')) { const p = path.join(base, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell'); if (fs.existsSync(p)) return p; }
  }
  for (const d of fs.readdirSync(base)) {
    if (d.startsWith('chromium')) { const p = path.join(base, d, 'chrome-linux', 'chrome'); if (fs.existsSync(p)) return p; }
  }
  return null;
}

(async () => {

  /* Serve the repo root (this script lives in tests/) on :8907. If a dev
     server already holds the port, it is used instead. */
  const http = require('http');
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/markdown', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const f = path.join(__dirname, '..', req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(f, (err, data) => {
      if (err) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  let ownServer = false;
  await new Promise(r => { server.once('error', () => r()); server.listen(8907, '127.0.0.1', () => { ownServer = true; r(); }); });
  const browser = await chromium.launch({ executablePath: findChromium(), args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 880, height: 800 } });
  page.on('pageerror', e => console.log('PAGEERROR ' + e.message));
  await page.goto('http://127.0.0.1:8907/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);

  // ---- sprite sheet: every character sprite at 6x on grass green ----
  const sheet = await page.evaluate(() => {
    const rows = [
      ['FRANK', [FRANK_DOWN, FRANK_DOWN2, FRANK_UP, FRANK_UP2, FRANK_SIDE, FRANK_SIDE2]],
      ['CONSTANCE', [CONSTANCE_DOWN, CONSTANCE_DOWN2, CONSTANCE_UP, CONSTANCE_UP2, CONSTANCE_SIDE, CONSTANCE_SIDE2]],
      ['ALVIN', [ALVIN_DOWN, ALVIN_DOWN2, ALVIN_UP, ALVIN_UP2, ALVIN_SIDE, ALVIN_SIDE2]],
      ['DEER+EXTRA', [DEER_SMALL, POT_SPROUT, POT_SEEDLING]],
    ];
    if (typeof FRANK_DOWN_BLINK !== 'undefined') rows.push(['BLINK', [FRANK_DOWN_BLINK, FRANK_SIDE_BLINK, CONSTANCE_DOWN_BLINK, CONSTANCE_SIDE_BLINK]]);
    const SC = 6, CELL = 16 * SC + 8, W = 6 * CELL + 8, H = rows.length * (16 * SC + 26) + 8;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    c.fillStyle = '#274e13'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#ffffff'; c.font = 'bold 13px monospace';
    rows.forEach((r, ri) => {
      const y0 = 8 + ri * (16 * SC + 26);
      c.fillStyle = '#ffd94a'; c.fillText(r[0] + '  [down1 down2 up1 up2 side1 side2]', 8, y0 + 10);
      r[1].forEach((img, i) => {
        const x = 8 + i * CELL, y = y0 + 16;
        c.fillStyle = '#58b93e'; c.fillRect(x, y, 16 * SC, 16 * SC);
        c.strokeStyle = '#14251a'; c.strokeRect(x + 0.5, y + 0.5, 16 * SC - 1, 16 * SC - 1);
        c.drawImage(img, x, y, 16 * SC, 16 * SC);
      });
    });
    return cv.toDataURL('image/png');
  });
  fs.writeFileSync(path.join(OUT, 'sheet.png'), Buffer.from(sheet.split(',')[1], 'base64'));

  // ---- big battle sprites at 5x ----
  const big = await page.evaluate(() => {
    const names = [['ALVIN_BIG', ALVIN_BIG], ['ALVIN_BIG_BARK', (typeof ALVIN_BIG_BARK !== 'undefined') ? ALVIN_BIG_BARK : null], ['DEER_BIG', DEER_BIG], ['DEER_BIG2', (typeof DEER_BIG2 !== 'undefined') ? DEER_BIG2 : null]];
    const SC = 5;
    const items = names.filter(n => n[1]);
    const W = Math.max(...items.map(n => n[1].width)) * SC + 24;
    const H = items.reduce((a, n) => a + n[1].height * SC + 30, 12);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    c.fillStyle = '#274e13'; c.fillRect(0, 0, W, H);
    c.font = 'bold 14px monospace';
    let y = 10;
    for (const [nm, img] of items) {
      c.fillStyle = '#ffd94a'; c.fillText(nm, 10, y + 12);
      c.fillStyle = '#58b93e'; c.fillRect(10, y + 18, img.width * SC, img.height * SC);
      c.drawImage(img, 10, y + 18, img.width * SC, img.height * SC);
      y += img.height * SC + 30;
    }
    return cv.toDataURL('image/png');
  });
  fs.writeFileSync(path.join(OUT, 'bigsheet.png'), Buffer.from(big.split(',')[1], 'base64'));

  // ---- in-context facings: new game, skip intro, pose the trio ----
  const tap = async (key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms || 90); await page.keyboard.up(key); await page.waitForTimeout(70); };
  await tap('Enter'); // NEW GAME
  await page.waitForTimeout(300);
  await page.evaluate(() => window.__hss.skipIntro());
  await page.waitForTimeout(200);
  const canvasBox = await page.locator('#game').boundingBox();
  async function sceneShot(name, setup) {
    await page.evaluate(setup);
    await page.waitForTimeout(260);
    await page.screenshot({ path: path.join(OUT, name), clip: { x: canvasBox.x, y: canvasBox.y, width: canvasBox.width, height: canvasBox.height } });
  }
  await sceneShot('face-down.png', () => { player.tx = 11; player.ty = 12; player.dir = 'down'; syncPixels(player); alvin.tx = 12; alvin.ty = 12; alvin.dir = 'down'; syncPixels(alvin); constance.tx = 10; constance.ty = 12; constance.dir = 'down'; });
  await sceneShot('face-up.png', () => { player.dir = 'up'; alvin.dir = 'up'; constance.dir = 'up'; });
  await sceneShot('face-side.png', () => { player.dir = 'right'; alvin.dir = 'right'; constance.dir = 'right'; });
  await sceneShot('face-sideL.png', () => { player.dir = 'left'; alvin.dir = 'left'; constance.dir = 'left'; });

  // ---- trial scene ----
  await page.evaluate(() => { window.__hss.plantAll(); window.__hss.waterAll(); });
  await page.evaluate(() => window.__hss.advanceDay());
  await page.evaluate(() => { window.__hss.waterAll(); });
  await page.evaluate(() => window.__hss.advanceDay());
  await page.evaluate(() => window.__hss.startTrial());
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'trial.png'), clip: { x: canvasBox.x, y: canvasBox.y, width: canvasBox.width, height: canvasBox.height } });

  // ---- register list + card (fresh load, hook opens the journal) ----
  await page.goto('http://127.0.0.1:8907/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);
  await tap('Enter');
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.__hss.skipIntro(); window.__hss.plantAll(); window.__hss.openRegister(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, 'register.png'), clip: { x: canvasBox.x, y: canvasBox.y, width: canvasBox.width, height: canvasBox.height } });
  await tap('Enter');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, 'register-card.png'), clip: { x: canvasBox.x, y: canvasBox.y, width: canvasBox.width, height: canvasBox.height } });

  await browser.close();
  if (ownServer) server.close();
  console.log('charshot done -> ' + OUT);
})().catch(e => { console.error(e); process.exit(1); });
