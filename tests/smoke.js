/* Smoke test for Hope Starts Small — Seeds slice. Logs to smoke.log; screenshots in shots/. */
const fs = require('fs');
const path = require('path');
/* playwright-core: a local install if one is present, else the Survival
   Game test rig's install on this machine — see tests/README.md. */
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch (e) { ({ chromium } = require('/home/hatch/workspace/survival-game/tests/node_modules/playwright-core')); }

const DIR = __dirname;
const LOG = path.join(DIR, 'smoke.log');
const SHOTS = path.join(DIR, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });
fs.writeFileSync(LOG, '');
function log(m) { fs.appendFileSync(LOG, m + '\n'); console.log(m); }
function check(name, ok, extra) { log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' -> ' + extra : '')); return ok; }

function findChromium() {
  const base = '/home/hatch/.cache/ms-playwright';
  for (const d of fs.readdirSync(base)) {
    if (d.startsWith('chromium_headless_shell')) {
      const p = path.join(base, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
      if (fs.existsSync(p)) return p;
    }
  }
  for (const d of fs.readdirSync(base)) {
    if (d.startsWith('chromium')) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (fs.existsSync(p)) return p;
    }
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
  const exe = findChromium();
  log('chromium: ' + exe);
  const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 880, height: 800 } });
  page.on('pageerror', e => log('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') log('CONSOLE-ERROR ' + m.text()); });
  let dialogAnswer = null; // set before triggering the register's rename prompt
  page.on('dialog', async d => { if (dialogAnswer != null) { const v = dialogAnswer; dialogAnswer = null; await d.accept(v); } else await d.dismiss(); });
  const S = () => page.evaluate(() => window.__hss.state());
  const tap = async (key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms || 90); await page.keyboard.up(key); await page.waitForTimeout(70); };
  const dismissDialogue = async (cap) => {
    for (let i = 0; i < (cap || 40); i++) {
      const s = await S();
      if (s.mode !== 'dialogue') return true;
      await tap('z');
    }
    return (await S()).mode !== 'dialogue';
  };

  await page.goto('http://127.0.0.1:8907/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(400);
  let s = await S();
  check('boots to title', s.mode === 'title', s.mode);
  await page.screenshot({ path: path.join(SHOTS, 'title.png') });

  // TITLE FUNNEL LINKS: the Audible listen link and the Amazon buy link
  // sit as a tidy pair on the title menu — the ONLY place book links may
  // appear (Daniel's ruling). The chapter card (checked later) is
  // link-free: text + KEEP TENDING only.
  const urls = await page.evaluate(() => ({ audible: AUDIBLE_URL, book: BOOK_URL }));
  check('AUDIBLE_URL constant unchanged', urls.audible === 'https://www.audible.com/pd/Hope-Starts-Small-Audiobook/B0DZPCHT4M', urls.audible);
  check('BOOK_URL constant is the clean Amazon link', urls.book === 'https://www.amazon.com/dp/B0DXVKQHZ2', urls.book);
  const titleLinks = await page.evaluate(() => {
    const a = document.getElementById('audibleBtn'), b = document.getElementById('bookBtn');
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    return {
      aHref: a.href, aTarget: a.target, aHidden: a.hidden,
      bHref: b.href, bTarget: b.target, bHidden: b.hidden,
      overlap: ra.left < rb.right && rb.left < ra.right && ra.top < rb.bottom && rb.top < ra.bottom,
      aBox: [ra.left, ra.top, ra.right, ra.bottom].map(Math.round), bBox: [rb.left, rb.top, rb.right, rb.bottom].map(Math.round),
    };
  });
  check('title shows the audible link', !titleLinks.aHidden && titleLinks.aHref === urls.audible && titleLinks.aTarget === '_blank', JSON.stringify(titleLinks));
  check('title shows the book buy link beside it', !titleLinks.bHidden && titleLinks.bHref === urls.book && titleLinks.bTarget === '_blank', JSON.stringify(titleLinks));
  check('title link pair does not overlap', titleLinks.overlap === false, JSON.stringify([titleLinks.aBox, titleLinks.bBox]));

  // THEME SONG (pass 8): browsers block audio before a user gesture, so
  // the title sits silent until the player's first interaction — then
  // TERRA BEATA starts, looping, and stops the moment the game starts.
  check('theme silent before first interaction', s.theme && s.theme.playing === false && s.theme.ctx === 'none', JSON.stringify(s.theme));
  check('music setting defaults ON', s.settings && s.settings.music === true, JSON.stringify(s.settings));
  await page.keyboard.press('Shift'); // a neutral key: an interaction that selects nothing
  await page.waitForTimeout(900);
  s = await S();
  check('theme starts after first interaction on title', s.theme.playing === true && s.theme.ctx === 'running', JSON.stringify(s.theme));
  await page.waitForTimeout(3000); // phrase 1 ends on a 3-beat held note; give phrase 2 time to schedule
  s = await S();
  check('theme schedules notes', s.theme.scheduled > 12, 'scheduled=' + s.theme.scheduled);
  await page.screenshot({ path: path.join(SHOTS, 'title-theme.png') });

  // CONTROLS from the title menu (no save yet: NEW GAME / CHAPTERS / CONTROLS)
  await tap('ArrowDown'); await tap('ArrowDown');
  await tap('Enter');
  await page.waitForTimeout(300);
  s = await S();
  check('controls opens from title', s.mode === 'controls', s.mode);
  await page.screenshot({ path: path.join(SHOTS, 'controls.png') });
  await tap('ArrowRight'); // SHOW STICK row is selected: AUTO -> ALWAYS
  await page.waitForTimeout(200);
  s = await S();
  check('stick setting set to ALWAYS', s.settings && s.settings.stick === 'always', s.settings && s.settings.stick);
  const deckVisible = await page.evaluate(() => { const d = document.getElementById('deck'); const sb = document.getElementById('stickBase'); return !!d && !d.hidden && d.offsetHeight > 0 && !!sb; });
  check('deck (stick + buttons) visible when ALWAYS', deckVisible && s.padVisible === true);
  await tap('x'); // B back
  await page.waitForTimeout(200);
  s = await S();
  check('controls B returns to title', s.mode === 'title', s.mode);
  await tap('ArrowUp'); await tap('ArrowUp'); // reselect NEW GAME

  // New Game -> intro
  await tap('Enter');
  await page.waitForTimeout(300);
  s = await S();
  check('intro dialogue starts', s.mode === 'dialogue', s.mode);
  check('intro dismissed by A presses', await dismissDialogue(50));
  s = await S();
  check('tutorial at plant step', s.tutorial === 1, 'tutorial=' + s.tutorial);
  check('theme stops when the game starts', s.theme.playing === false, JSON.stringify(s.theme));

  // The theme's melody, checked note-for-note against the hymnal
  // reference: TERRA BEATA in Eb major (Hymnary.org tune record, incipit
  // 12353 21234 65326; the 1919 printing's opening Eb4 F4 G4 Bb4 G4 F4
  // Eb4 F4 G4; second half opens on Bb4, peaks on Eb5, dips to Bb3).
  // theme.mid in the repo root must carry that same melody.
  const THEME_REF = [63, 65, 67, 70, 67, 65, 63, 65, 67, 68, 72, 70, 67, 65, 72, 70, 67, 67, 65, 63, 67, 65, 63, 58, 63, 65, 67, 70, 65, 67, 63, 70, 75, 70, 72, 74, 75, 75, 74, 72, 68, 67, 70, 70, 72, 70, 67, 67, 65, 63, 67, 65, 63, 58, 63, 65, 67, 70, 65, 67, 63, 68, 63];
  const td = await page.evaluate(() => window.__hss.themeData());
  check('theme melody matches the hymnal reference note-for-note', JSON.stringify(td.melody) === JSON.stringify(THEME_REF), td.melody.length + ' notes, first: ' + td.melody.slice(0, 9).join(','));
  check('theme is 69 beats at 88 BPM', td.beats === 69 && td.bpm === 88, td.bpm + 'bpm / ' + td.beats + ' beats');
  const midPath = [path.join(DIR, '..', 'theme.mid'), '/home/hatch/workspace/hope-starts-small-game/theme.mid'].find(p => fs.existsSync(p));
  const mid = midPath ? fs.readFileSync(midPath) : null;
  check('theme.mid exists with a valid SMF header', !!mid && mid.toString('ascii', 0, 4) === 'MThd' && mid.readUInt16BE(8) === 1 && mid.readUInt16BE(10) === 4, mid ? mid.length + ' bytes' : 'missing');
  const parseMidTracks = (buf) => {
    const tracks = []; let off = 14;
    while (off + 8 <= buf.length && buf.toString('ascii', off, off + 4) === 'MTrk') {
      const end = off + 8 + buf.readUInt32BE(off + 4);
      let i = off + 8, run = 0; const notes = [];
      const vlq = () => { let v = 0, c; do { c = buf[i++]; v = (v << 7) | (c & 0x7f); } while (c & 0x80); return v; };
      while (i < end) {
        vlq();
        let st = buf[i];
        if (st & 0x80) { run = st; i++; } else st = run;
        if (st === 0xff) { i++; const L = vlq(); i += L; }
        else if (st === 0xf0 || st === 0xf7) { const L = vlq(); i += L; }
        else {
          const cmd = st & 0xf0;
          if (cmd === 0x90) { const n = buf[i], vel = buf[i + 1]; i += 2; if (vel > 0) notes.push(n); }
          else if (cmd === 0x80 || cmd === 0xa0 || cmd === 0xb0 || cmd === 0xe0) i += 2;
          else if (cmd === 0xc0 || cmd === 0xd0) i += 1;
          else break;
        }
      }
      tracks.push(notes); off = end;
    }
    return tracks;
  };
  const midTracks = mid ? parseMidTracks(mid) : [];
  check('theme.mid melody track matches the reference', JSON.stringify(midTracks[1]) === JSON.stringify(THEME_REF), (midTracks[1] || []).length + ' notes in track 1 of ' + midTracks.length);

  // The stick (deck set to ALWAYS above): rigorous direction discipline,
  // driven by real synthetic pointer drags on the stick base.
  const stickBox = await page.locator('#stickBase').boundingBox();
  const sc = { x: stickBox.x + stickBox.width / 2, y: stickBox.y + stickBox.height / 2, r: stickBox.width / 2 };
  const stickPt = (deg, frac) => { const a = deg * Math.PI / 180; return { x: sc.x + Math.cos(a) * sc.r * frac, y: sc.y + Math.sin(a) * sc.r * frac }; };
  // deadzone: a small push commits nothing and Frank does not move
  const p0 = (await S()).player;
  let pt = stickPt(90, 0.2);
  await page.mouse.move(sc.x, sc.y); await page.mouse.down(); await page.mouse.move(pt.x, pt.y, { steps: 3 });
  await page.waitForTimeout(600);
  s = await S();
  check('stick deadzone commits nothing', s.stick.dir === null, JSON.stringify(s.stick));
  check('stick deadzone does not move Frank', s.player.x === p0.x && s.player.y === p0.y, JSON.stringify(s.player));
  await page.mouse.up(); await page.waitForTimeout(150);
  // pure cardinal: drag straight down and Frank walks south, never diagonally
  pt = stickPt(90, 0.85);
  await page.mouse.move(sc.x, sc.y); await page.mouse.down(); await page.mouse.move(pt.x, pt.y, { steps: 4 });
  await page.waitForTimeout(250);
  s = await S();
  check('stick drag down commits DOWN', s.stick.dir === 'down', JSON.stringify(s.stick));
  await page.waitForTimeout(800);
  s = await S();
  check('stick drag down moves Frank south', s.player.y > p0.y && s.player.x === p0.x, JSON.stringify(s.player) + ' from ' + JSON.stringify(p0));
  // hysteresis: swing to 40 deg (inside RIGHT's sector, 5 deg past the sector
  // boundary) and jitter around it: the DOWN commitment must never flip
  let flipped = null;
  for (const a of [40, 34, 46, 36, 44, 40]) {
    const q = stickPt(a, 0.85); await page.mouse.move(q.x, q.y, { steps: 2 }); await page.waitForTimeout(120);
    const d = (await S()).stick.dir; if (d !== 'down') { flipped = a + 'deg->' + d; break; }
  }
  check('stick hysteresis: boundary jitter never flips DOWN', flipped === null, flipped || 'held down');
  // a decisive swing to 15 deg (25 deg past the boundary) does switch
  pt = stickPt(15, 0.85); await page.mouse.move(pt.x, pt.y, { steps: 3 }); await page.waitForTimeout(250);
  s = await S();
  check('stick decisive swing switches to RIGHT', s.stick.dir === 'right', JSON.stringify(s.stick));
  // release stops movement at once
  await page.mouse.up(); await page.waitForTimeout(150);
  const pRel = (await S()).player;
  await page.waitForTimeout(600);
  s = await S();
  check('stick release stops Frank', s.stick.dir === null && s.player.x === pRel.x && s.player.y === pRel.y, JSON.stringify(s.player));

  // pause menu via the on-screen MENU button; CONTROLS from there; SAVE & QUIT
  await page.locator('#btnMenu').click();
  await page.waitForTimeout(300);
  s = await S();
  check('menu opens via on-screen MENU button', s.mode === 'menu', s.mode);
  await page.screenshot({ path: path.join(SHOTS, 'menu.png') });
  await tap('ArrowDown'); // CONTROLS (RESUME / CONTROLS / SAVE & QUIT)
  await tap('Enter');
  await page.waitForTimeout(250);
  s = await S();
  check('controls opens from pause', s.mode === 'controls', s.mode);
  await tap('x');
  await page.waitForTimeout(200);
  s = await S();
  check('controls B returns to pause menu', s.mode === 'menu', s.mode);
  const preQuit = await S();
  await tap('ArrowDown'); // sel 1 -> 2: SAVE & QUIT
  s = await S();
  check('save & quit highlighted', s.menuSel === 2, 'sel=' + s.menuSel);
  await tap('Enter');
  await page.waitForTimeout(300);
  s = await S();
  check('save & quit returns to title', s.mode === 'title', s.mode);
  await tap('ArrowDown'); // CONTINUE (a save now exists)
  await tap('Enter');
  await page.waitForTimeout(400);
  s = await S();
  check('continue after save & quit restores day', s.mode === 'overworld' && s.day === preQuit.day, 'mode=' + s.mode + ' day=' + s.day + ' expected ' + preQuit.day);
  check('continue after save & quit restores pots', JSON.stringify(s.pots.map(p => p.stage)) === JSON.stringify(preQuit.pots.map(p => p.stage)), JSON.stringify(s.pots.map(p => p.stage)));
  // keyboard P still opens the pause menu, and B closes it again
  await tap('p');
  await page.waitForTimeout(250);
  s = await S();
  check('pause menu opens with P', s.mode === 'menu', s.mode);
  await tap('x');
  await page.waitForTimeout(200);
  s = await S();
  check('pause menu B returns to overworld', s.mode === 'overworld', s.mode);

  // Frank's journal on the porch opens the Plant Register (the Berrydex, by hand)
  await page.evaluate(() => window.__hss.warp(11, 6));
  await tap('ArrowUp'); // one step north to (11,5), facing the porch
  await page.waitForTimeout(250);
  await tap('z');
  await page.waitForTimeout(250);
  s = await S();
  check('porch journal opens the plant register', s.mode === 'register' && s.register.view === 'list', s.mode + '/' + (s.register && s.register.view));
  check('register lists the six named plants', s.pots.map(p => p.name).join(',') === 'ADMIRAL,CAPTAIN,GENERAL,HOPE,PATIENCE,PROFESSOR', s.pots.map(p => p.name).join(','));
  await page.screenshot({ path: path.join(SHOTS, 'register.png') });
  await tap('z'); // open the first plant's card
  await page.waitForTimeout(250);
  s = await S();
  check('register card opens', s.register.view === 'card', s.register.view);
  await page.screenshot({ path: path.join(SHOTS, 'register-card.png') });
  dialogAnswer = 'TESTNAME';
  await tap('z'); // RENAME (row 0) -> prompt
  await page.waitForTimeout(300);
  s = await S();
  check('rename sticks', s.pots[0].name === 'TESTNAME', s.pots[0].name);
  await tap('ArrowDown'); // BACK row
  await tap('z');
  await page.waitForTimeout(200);
  s = await S();
  check('card back returns to list', s.register.view === 'list', s.register.view);
  await tap('x');
  await page.waitForTimeout(200);
  s = await S();
  check('register B returns to overworld', s.mode === 'overworld', s.mode);

  // plant + water via hooks (tedious walking is covered by design; hooks are the spec'd test seam)
  await page.evaluate(() => window.__hss.plantAll());
  s = await S();
  check('all 6 pots planted', s.pots.every(p => p.stage === 1) && s.seedsLeft === 0, JSON.stringify(s.pots.map(p => p.stage)));
  check('berrydex has SEED', s.dex.blueberry.includes('SEED'));
  await page.evaluate(() => window.__hss.waterAll());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('day advanced to 2', s.day === 2, 'day=' + s.day);
  await page.evaluate(() => window.__hss.waterAll());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('sprout after 2 watered days', s.pots.every(p => p.stage === 2), JSON.stringify(s.pots.map(p => p.stage)));
  check('berrydex has SPROUT', s.dex.blueberry.includes('SPROUT'));
  check('deer present after first sprout', s.deerPresent === true);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, 'yard.png') });
  // extra viewpoints for the cosmetic pass: up by the house, and the south yard
  await page.evaluate(() => window.__hss.warp(11, 5));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, 'yard-north.png') });
  await page.evaluate(() => window.__hss.warp(11, 14));
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, 'yard-south.png') });
  await page.evaluate(() => window.__hss.warp(11, 9));

  // trial: scripted moves, retry after a loss like a player would
  let won = false;
  for (let attempt = 1; attempt <= 4 && !won; attempt++) {
    await page.evaluate(() => window.__hss.startTrial());
    await page.waitForTimeout(1400);
    s = await S();
    if (!check('trial starts (attempt ' + attempt + ')', s.mode === 'trial' && !!s.trial, s.mode)) break;
    if (attempt === 1) {
      await page.screenshot({ path: path.join(SHOTS, 'trial.png') });
      check('trial actor is ALVIN', s.trial.actor === 'ALVIN', s.trial.actor);
      check('trial HP is Alvin at the old vigor 22', s.trial.vigor === 22 && s.trial.maxVigor === 22, s.trial.vigor + '/' + s.trial.maxVigor);
      // PLANTS peek lists the garden by name now, and costs no turn
      for (let i = 0; i < 20 && (await S()).trial.phase !== 'menu'; i++) await page.waitForTimeout(200);
      await tap('ArrowRight'); await tap('z');
      await page.waitForTimeout(250);
      s = await S();
      check('trial plants peek is by name', s.trial.phase === 'plants' && s.trial.plants[0] === 'TESTNAME:2' && s.trial.plants[5] === 'PROFESSOR:2', JSON.stringify(s.trial.plants));
      await page.screenshot({ path: path.join(SHOTS, 'trial-plants.png') });
      await tap('x');
      await page.waitForTimeout(200);
    }
    let dugIn = false;
    for (let turn = 0; turn < 60; turn++) {
      s = await S();
      if (!s.trial) break;
      if (s.mode !== 'trial') break;
      if (s.trial.phase === 'menu') {
        if (dugIn && s.trial.vigor <= 8 && s.tea > 0) { await tap('ArrowDown'); await tap('ArrowDown'); await tap('z'); } // BAG
        else await tap('z'); // DEFEND -> moves
      }
      else if (s.trial.phase === 'moves') {
        if (!dugIn) { await tap('ArrowDown'); await tap('z'); dugIn = true; } // DIG IN (sel 2)
        else { await tap('ArrowDown'); await tap('ArrowRight'); await tap('z'); } // BARK (sel 3)
      }
      else if (s.trial.phase === 'bag') { await tap('z'); } // use the tea
      else if (s.trial.phase === 'plants') { await tap('z'); } // peek, back to menu
      else await page.waitForTimeout(250);
    }
    await page.waitForTimeout(600);
    await dismissDialogue(40);
    s = await S();
    won = s.deerBeaten === true;
    log('attempt ' + attempt + ' result: deerBeaten=' + won + ' mode=' + s.mode);
    if (!won) { // regrow the nibbled sprout like a player would
      await page.evaluate(() => window.__hss.waterAll());
      await page.evaluate(() => window.__hss.advanceDay());
      await page.evaluate(() => window.__hss.waterAll());
      await page.evaluate(() => window.__hss.advanceDay());
      await dismissDialogue(20);
    }
  }
  check('deer trial won', won);

  // grow to seedling -> chapter card
  for (let i = 0; i < 4; i++) {
    s = await S();
    if (s.chapterDone) break;
    await page.evaluate(() => window.__hss.waterAll());
    await page.evaluate(() => window.__hss.advanceDay());
    await dismissDialogue(20);
  }
  s = await S();
  check('seedling reached', s.pots.some(p => p.stage === 3), JSON.stringify(s.pots.map(p => p.stage)));
  check('berrydex has SEEDLING', s.dex.blueberry.includes('SEEDLING'));
  check('chapter complete', s.chapterDone === true);
  check('chapter card showing', s.mode === 'card', s.mode);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, 'card.png') });
  const cardLinks = await page.evaluate(() => ({ audibleHidden: document.getElementById('audibleBtn').hidden, bookHidden: document.getElementById('bookBtn').hidden }));
  check('chapter card shows no book links', cardLinks.audibleHidden === true && cardLinks.bookHidden === true, JSON.stringify(cardLinks));
  const savedDay = s.day, savedStages = JSON.stringify(s.pots.map(p => p.stage));

  // Continue round-trip
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);
  await tap('ArrowDown'); // CONTINUE
  await tap('Enter');
  await page.waitForTimeout(400);
  s = await S();
  check('continue restores overworld', s.mode === 'overworld', s.mode);
  check('continue restores day', s.day === savedDay, 'day=' + s.day + ' expected ' + savedDay);
  check('continue restores pots', JSON.stringify(s.pots.map(p => p.stage)) === savedStages, JSON.stringify(s.pots.map(p => p.stage)));
  await page.screenshot({ path: path.join(SHOTS, 'continue.png') });

  // WEEDS -> COMPOST -> GOOD DIRT (pass 8): the yard's second loop.
  // Spawn rules: a dry dawn adds 2, a dawn after watering adds 3, the
  // living cap is 6, and every tuft sits on a legal grass tile.
  const weedLegality = () => page.evaluate(() => {
    const bad = [], seen = new Set();
    for (const w of G.save.weeds) {
      const ch = mapChar(w.x, w.y), k = w.x + ',' + w.y;
      if (ch !== 'g' && ch !== 'u') bad.push('tile ' + ch + ' at ' + k);
      if (w.y < 5) bad.push('house apron row ' + w.y);
      if (isSolid(w.x, w.y)) bad.push('solid at ' + k);
      if (w.x === player.tx && w.y === player.ty) bad.push('on Frank');
      if (w.x === alvin.tx && w.y === alvin.ty) bad.push('on Alvin');
      if (w.x === constance.tx && w.y === constance.ty) bad.push('on Constance');
      if (G.save.deerPresent && !G.save.deerBeaten && w.x === 18 && w.y === 8) bad.push('on the deer');
      if (seen.has(k)) bad.push('duplicate ' + k);
      seen.add(k);
    }
    return bad;
  });
  await page.evaluate(() => { window.__hss.setWeeds([]); G.save.pots.forEach(p => { p.watered = false; }); saveGame(); });
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('dry dawn spawns 2 weeds', s.weeds.length === 2, JSON.stringify(s.weeds));
  check('spawned weeds sit on legal tiles', (await weedLegality()).length === 0, JSON.stringify(await weedLegality()));
  // (the gardener waters while the days pass — since Sprouts the ladder
  // is real, and an untended week would cost plants, as it should)
  for (let i = 0; i < 4; i++) { await page.evaluate(() => window.__hss.waterAll()); await page.evaluate(() => window.__hss.advanceDay()); }
  s = await S();
  check('weeds never exceed the cap of 6', s.weeds.length === 6, 'count=' + s.weeds.length);
  await page.evaluate(() => window.__hss.setWeeds([]));
  await page.evaluate(() => window.__hss.waterAll());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('dawn after a watering day spawns 3', s.weeds.length === 3, 'count=' + s.weeds.length);
  check('watered-dawn weeds are legal too', (await weedLegality()).length === 0, JSON.stringify(await weedLegality()));

  // Pulling: weeds are non-solid (Frank can stand on one), a faced
  // deep-rooted tuft pays 2, the one under his boots pays 1.
  await page.evaluate(() => window.__hss.setWeeds([{ x: 16, y: 13, deep: false }, { x: 17, y: 13, deep: true }]));
  await page.evaluate(() => window.__hss.warp(16, 14));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(SHOTS, 'weeds.png') });
  const compost0 = (await S()).compost;
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(70); await page.keyboard.up('ArrowUp');
  await page.waitForTimeout(350);
  s = await S();
  check('weeds are non-solid: Frank stands on a tuft', s.player.x === 16 && s.player.y === 13, JSON.stringify(s.player));
  await page.evaluate(() => { player.dir = 'right'; });
  await tap('z'); // pull the deep-rooted weed he faces (first pull: Frank's line runs)
  await page.waitForTimeout(250);
  await dismissDialogue(10);
  s = await S();
  check('pull: deep-rooted weed pays 2 compost and is gone', s.compost === compost0 + 2 && s.weeds.length === 1 && s.weeds[0].deep === false, 'compost=' + s.compost + ' weeds=' + JSON.stringify(s.weeds));
  await page.evaluate(() => { player.dir = 'up'; });
  await tap('z'); // nothing to face up here: the tuft under his boots goes
  await page.waitForTimeout(250);
  s = await S();
  check('pull: tuft underfoot pays 1 compost and is gone', s.compost === compost0 + 3 && s.weeds.length === 0 && s.mode === 'overworld', 'compost=' + s.compost + ' weeds=' + s.weeds.length + ' mode=' + s.mode);

  // The compost corner: below 3 compost it only reports the count; at 3
  // it offers the conversion, and B declines it.
  const faceCorner = async () => {
    await page.evaluate(() => window.__hss.warp(20, 12));
    await page.evaluate(() => { player.dir = 'up'; });
    await page.waitForTimeout(200);
  };
  await page.evaluate(() => { G.save.compost = 2; G.save.goodDirt = 0; saveGame(); });
  await faceCorner();
  await tap('z');
  await page.waitForTimeout(250);
  await dismissDialogue(10);
  s = await S();
  check('corner below 3 compost converts nothing', s.compost === 2 && s.goodDirt === 0, 'compost=' + s.compost + ' dirt=' + s.goodDirt);
  await page.evaluate(() => { G.save.compost = 3; saveGame(); });
  await faceCorner();
  await tap('z'); await page.waitForTimeout(250);
  await dismissDialogue(15); // A on the offer: MAKE IT (+ the confirmation line)
  s = await S();
  check('corner converts 3 compost into 1 good dirt', s.compost === 0 && s.goodDirt === 1, 'compost=' + s.compost + ' dirt=' + s.goodDirt);
  await page.evaluate(() => { G.save.compost = 3; saveGame(); });
  await faceCorner();
  await tap('z'); await page.waitForTimeout(350); // line 1 completes (or advances)
  await tap('z'); await page.waitForTimeout(350); // offer line arrives (or completes line 1)
  await tap('z'); await page.waitForTimeout(350); // offer line completes
  await tap('z'); await page.waitForTimeout(350); // (timing slack: ensure the offer is fully typed)
  await tap('x'); // B: NOT NOW — only declines once the line is fully typed
  await page.waitForTimeout(250);
  s = await S();
  check('corner offer can be declined with B', s.compost === 3 && s.goodDirt === 1 && s.mode === 'overworld', 'compost=' + s.compost + ' dirt=' + s.goodDirt + ' mode=' + s.mode);

  // Good dirt at the bench: a watered pot is fed — vigor +8, the plant
  // is marked, and a growth credit is banked.
  await page.evaluate(() => { G.save.goodDirt = 1; G.save.pots[0].watered = true; saveGame(); });
  const vigor0 = (await S()).pots[0].vigor;
  await page.evaluate(() => window.__hss.warp(9, 11));
  await page.evaluate(() => { player.dir = 'up'; });
  await page.waitForTimeout(200);
  await tap('z');
  await page.waitForTimeout(250);
  await dismissDialogue(15); // A through the offer: FEED IT (+ confirmation)
  s = await S();
  check('good dirt feeds a watered pot: +8 vigor, marked, credit banked',
    s.goodDirt === 0 && s.pots[0].dirt === true && s.pots[0].dirtCredit === 1 && s.pots[0].vigor === vigor0 + 8,
    JSON.stringify({ dirt: s.goodDirt, pot: s.pots[0] }));

  // The credit does its work at dawn: a seed watered once, holding one
  // credit, sprouts a day early — and the credit is spent.
  await page.evaluate(() => { const p = G.save.pots[1]; p.stage = 1; p.wateredDays = 0; p.watered = true; p.dirt = true; p.dirtCredit = 1; saveGame(); });
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('dirt credit sprouts a seed a day early', s.pots[1].stage === 2 && s.pots[1].dirtCredit === 0, JSON.stringify(s.pots[1]));

  // And when the credit causes the FIRST sprout, the deer trial still
  // dawns as usual.
  await page.evaluate(() => {
    G.save.deerBeaten = false; G.save.deerPresent = false; G.save.day = 14; // a spring dawn: winter's half-pace is not what this checks
    const p = G.save.pots[2]; p.stage = 1; p.wateredDays = 0; p.watered = true; p.dirtCredit = 1; saveGame();
  });
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('credit-caused first sprout still brings the deer', s.pots[2].stage === 2 && s.deerPresent === true, 'stage=' + s.pots[2].stage + ' deer=' + s.deerPresent);
  await page.evaluate(() => { G.save.deerBeaten = true; G.save.deerPresent = false; saveGame(); });

  // All the new state survives a save / Continue round-trip.
  const rt = await S();
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);
  await tap('ArrowDown'); // CONTINUE
  await tap('Enter');
  await page.waitForTimeout(400);
  s = await S();
  check('weeds state survives Continue', s.compost === rt.compost && s.goodDirt === rt.goodDirt && JSON.stringify(s.weeds) === JSON.stringify(rt.weeds) && s.pots[0].dirt === true && s.pots[1].dirt === true,
    'compost=' + s.compost + '/' + rt.compost + ' dirt=' + s.goodDirt + '/' + rt.goodDirt + ' weeds=' + s.weeds.length + '/' + rt.weeds.length);
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('hss-save-v1')));
  check('save file carries weeds, compost, dirt and per-plant marks',
    Array.isArray(persisted.weeds) && typeof persisted.compost === 'number' && typeof persisted.goodDirt === 'number' && persisted.plants[0].dirt === true && typeof persisted.plants[1].dirtCredit === 'number',
    JSON.stringify({ compost: persisted.compost, goodDirt: persisted.goodDirt, weeds: (persisted.weeds || []).length }));

  // MUSIC SETTING: on the CONTROLS screen, persisted in the settings
  // key, and OFF means the title stays silent even after interactions.
  await tap('p'); // pause menu
  await page.waitForTimeout(250);
  await tap('ArrowDown'); await tap('ArrowDown'); // SAVE & QUIT
  await tap('Enter');
  await page.waitForTimeout(300);
  s = await S();
  check('back on title for the music setting', s.mode === 'title', s.mode);
  await tap('ArrowDown'); await tap('ArrowDown'); await tap('ArrowDown'); // CONTROLS
  await tap('Enter');
  await page.waitForTimeout(250);
  await tap('ArrowDown'); // MUSIC row
  await tap('ArrowRight'); // ON -> OFF
  await page.waitForTimeout(200);
  s = await S();
  check('music toggles OFF on the controls screen', s.settings.music === false, JSON.stringify(s.settings));
  await page.screenshot({ path: path.join(SHOTS, 'controls-music.png') });
  await tap('x'); // back to title
  await page.waitForTimeout(200);
  await page.keyboard.press('Shift');
  await page.waitForTimeout(700);
  s = await S();
  check('music OFF: title stays silent after interaction', s.theme.playing === false, JSON.stringify(s.theme));
  const savedSettings = await page.evaluate(() => JSON.parse(localStorage.getItem('hss-settings-v1')));
  check('music OFF persists in the settings key', savedSettings && savedSettings.music === false, JSON.stringify(savedSettings));
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);
  s = await S();
  check('music OFF survives a reload', s.settings.music === false, JSON.stringify(s.settings));
  await tap('ArrowDown'); await tap('ArrowDown'); await tap('ArrowDown'); // CONTROLS
  await tap('Enter');
  await page.waitForTimeout(250);
  await tap('ArrowDown'); await tap('ArrowRight'); // MUSIC back ON
  await page.waitForTimeout(200);
  await tap('x');
  await page.waitForTimeout(900);
  s = await S();
  check('music back ON: theme plays again on title', s.settings.music === true && s.theme.playing === true, JSON.stringify(s.theme));
  // Leave the title the way the sections after this one expect: in the yard.
  // (Select CONTINUE directly: the selection sits on CONTROLS after the
  // detour, and NEW GAME would stop at the overwrite-confirm prompt.)
  await page.evaluate(() => { titleSel = titleLabels().indexOf('CONTINUE'); });
  await tap('Enter');
  await page.waitForTimeout(400);
  s = await S();
  check('continue back into the yard after the music detour', s.mode === 'overworld', s.mode);

  // Regression: "weird black lines when I move" (Daniel, Nov 26). Root cause:
  // a fractional camera drew every tile at a fractional offset, and GPU
  // rasterisers blend the tiles' edge columns into the black clear colour —
  // dark seams across the yard, only while moving. The camera is now
  // integer-snapped. This scan samples raw canvas pixels on every animation
  // frame during real key-held movement in all four directions (Alvin
  // trailing) and asserts: (a) it really sampled mid-movement frames,
  // (b) the camera was integer on every one of them, (c) no frame contains
  // an anomalous pure-black column/row (the overworld is fully tile-covered;
  // pure #000 exists only as the clear colour).
  await page.evaluate(() => {
    window.__seam = { on: false, frames: 0, moving: 0, fracCam: 0, seamFrames: 0 };
    const cv = document.getElementById('game');
    const cx = cv.getContext('2d');
    (function scan() {
      const P = window.__seam;
      if (P.on) {
        try {
          const d = cx.getImageData(0, 0, 160, 144).data;
          let seam = false;
          for (let x = 0; x < 160 && !seam; x++) { let n = 0; for (let y = 0; y < 144; y++) { const i = (y * 160 + x) * 4; if (d[i] === 0 && d[i + 1] === 0 && d[i + 2] === 0) n++; } if (n >= 110) seam = true; }
          for (let y = 0; y < 144 && !seam; y++) { let n = 0; for (let x = 0; x < 160; x++) { const i = (y * 160 + x) * 4; if (d[i] === 0 && d[i + 1] === 0 && d[i + 2] === 0) n++; } if (n >= 140) seam = true; }
          P.frames++;
          if (player.moving || alvin.moving) P.moving++;
          if (camX !== Math.round(camX) || camY !== Math.round(camY)) P.fracCam++;
          if (seam) P.seamFrames++;
        } catch (e) { /* mid-frame */ }
      }
      requestAnimationFrame(scan);
    })();
  });
  const seamHold = async (warp, key) => {
    await page.evaluate(w => window.__hss.warp(w[0], w[1]), warp);
    await page.waitForTimeout(250);
    await page.evaluate(() => { const P = window.__seam; P.frames = 0; P.moving = 0; P.fracCam = 0; P.seamFrames = 0; P.on = true; });
    await page.keyboard.down(key);
    await page.waitForTimeout(1500);
    await page.keyboard.up(key);
    await page.waitForTimeout(120);
    return page.evaluate(() => { const P = window.__seam; P.on = false; return { frames: P.frames, moving: P.moving, fracCam: P.fracCam, seamFrames: P.seamFrames }; });
  };
  const seamRuns = [];
  seamRuns.push(await seamHold([4, 15], 'ArrowRight'));
  seamRuns.push(await seamHold([19, 15], 'ArrowLeft'));
  seamRuns.push(await seamHold([11, 14], 'ArrowUp'));
  seamRuns.push(await seamHold([11, 5], 'ArrowDown'));
  const seamTot = seamRuns.reduce((a, r) => ({ frames: a.frames + r.frames, moving: a.moving + r.moving, fracCam: a.fracCam + r.fracCam, seamFrames: a.seamFrames + r.seamFrames }), { frames: 0, moving: 0, fracCam: 0, seamFrames: 0 });
  log('seam scan: ' + JSON.stringify(seamTot) + ' per-run ' + JSON.stringify(seamRuns));
  check('seam scan sampled mid-movement frames', seamTot.moving >= 100, seamTot.moving + ' moving of ' + seamTot.frames);
  check('camera stays integer-snapped while moving', seamTot.fracCam === 0, seamTot.fracCam + ' fractional-cam frames');
  check('no anomalous black rows/columns mid-movement', seamTot.seamFrames === 0, seamTot.seamFrames + ' seam frames');

  // Alvin auto-displace (Daniel, Nov 26): Frank must never be walled by his
  // own dog. Stepping into Alvin's tile makes Alvin hop aside in the same
  // step (a side tile if one is walkable); boxed in, they swap tiles.
  const stagePair = (px, py, ax, ay, cx, cy) => page.evaluate(([px, py, ax, ay, cx, cy]) => {
    player.tx = px; player.ty = py; syncPixels(player);
    alvin.tx = ax; alvin.ty = ay; syncPixels(alvin);
    if (cx !== null) { constance.tx = cx; constance.ty = cy; }
    alvinTarget = null;
  }, [px, py, ax, ay, cx, cy]);
  const stepOnce = async (key) => { await page.keyboard.down(key); await page.waitForTimeout(70); await page.keyboard.up(key); await page.waitForTimeout(320); return S(); };
  const alvinState = () => page.evaluate(() => ({ x: alvin.tx, y: alvin.ty, solid: isSolid(alvin.tx, alvin.ty) }));
  // (a) head-on push in the open: Alvin sidesteps, Frank takes his tile
  await stagePair(11, 13, 11, 12, null, null);
  s = await stepOnce('ArrowUp');
  let av = await alvinState();
  check('push: Frank steps into Alvin\'s tile', s.player.y === 12, JSON.stringify(s.player));
  check('push: Alvin sidestepped to a walkable side tile', !av.solid && av.y >= 12 && av.y <= 13 && (av.x === 10 || av.x === 12 || (av.x === 11 && av.y === 13)) && !(av.x === s.player.x && av.y === s.player.y), JSON.stringify(av));
  s = await stepOnce('ArrowUp');
  check('push: Frank passes through, unblocked', s.player.y === 11, JSON.stringify(s.player));
  // (b) boxed in beside the fence with Constance closing the other side:
  // no side tile is free, so Frank and Alvin swap — and swap back.
  await stagePair(2, 14, 2, 15, 3, 15);
  s = await stepOnce('ArrowDown');
  av = await alvinState();
  check('swap: boxed-in push swaps Frank and Alvin', s.player.y === 15 && av.x === 2 && av.y === 14, 'player=' + JSON.stringify(s.player) + ' alvin=' + JSON.stringify(av));
  await page.evaluate(() => { constance.tx = 3; constance.ty = 14; });
  s = await stepOnce('ArrowUp');
  av = await alvinState();
  check('swap: push back swaps again', s.player.y === 14 && av.x === 2 && av.y === 15, 'player=' + JSON.stringify(s.player) + ' alvin=' + JSON.stringify(av));
  await page.evaluate(() => { constance.tx = 12; constance.ty = 6; });
  s = await stepOnce('ArrowRight');
  check('swap: no soft-lock afterwards', s.player.x === 3, JSON.stringify(s.player));
  // (c) pushed against the fence line: Alvin sidesteps ALONG it, never onto
  // or through the fence row (y=17)
  await stagePair(11, 15, 11, 16, null, null);
  s = await stepOnce('ArrowDown');
  av = await alvinState();
  check('fence: Frank reaches the fence row', s.player.y === 16, JSON.stringify(s.player));
  check('fence: Alvin stayed in the yard, walkable', !av.solid && av.y >= 15 && av.y <= 16 && !(av.x === s.player.x && av.y === s.player.y), JSON.stringify(av));

  // talking frames: the speaker's talk flag follows the typewriter — set
  // while their line is still typing, clear the moment it completes
  await page.evaluate(() => { say(['FRANK: TESTING THE TALKING FRAMES, ONE TWO THREE FOUR FIVE SIX.']); });
  await page.waitForTimeout(180);
  const talkOn = await page.evaluate(() => player.talk === true);
  check('talk: speaker flagged while the line types', talkOn);
  const pressA = async () => { await page.keyboard.down('KeyZ'); await page.waitForTimeout(90); await page.keyboard.up('KeyZ'); };
  await pressA(); // A button: complete the line (held — a tap can fall between input polls)
  await page.waitForTimeout(150);
  const talkOff = await page.evaluate(() => player.talk === false);
  check('talk: flag clears when the line finishes', talkOff);
  await pressA(); // A button: close the box
  await page.waitForTimeout(200);
  s = await S();
  check('talk: dialogue closed cleanly', s.mode === 'overworld', s.mode);

  // Alvin sits when Frank has been still a while and he has settled nearby
  await stagePair(11, 13, 11, 12, null, null);
  await page.evaluate(() => { playerIdleT = 99; });
  await page.waitForTimeout(250);
  const sitOn = await page.evaluate(() => alvin.sit === true);
  check('sit: Alvin sits after Frank stands still', sitOn);
  await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(120); await page.keyboard.up('ArrowLeft');
  await page.waitForTimeout(250);
  const sitOff = await page.evaluate(() => alvin.sit === false);
  check('sit: moving again clears the sit', sitOff);

  // CHAPTER 2 — SPROUTS: save v2, seasons, the house, the sale, the
  // potting-up, the frost trial, and the mortality ladder (spec ch. 2).
  const persisted2 = await page.evaluate(() => JSON.parse(localStorage.getItem('hss-save-v1')));
  check('save file is v2: plants, world, tray, field, wine',
    persisted2.v === 2 && Array.isArray(persisted2.plants) && persisted2.plants.length === 6 && !!persisted2.world && !!persisted2.tray && !!persisted2.field && !!persisted2.wine,
    'v=' + persisted2.v);
  await page.evaluate(() => {
    const sv = JSON.parse(localStorage.getItem('hss-save-v1'));
    sv.plants.forEach(p => { p.stage = 3; p.seedlingDay = 5; p.location = 'BENCH'; });
    sv.deerBeaten = true; sv.deerPresent = false; sv.chapterDone = true;
    sv.world.ch = 2; sv.world.step = 0; sv.day = 7; sv.world.area = 'yard';
    localStorage.setItem('hss-save-v1', JSON.stringify(sv));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);
  await tap('ArrowDown'); await tap('Enter'); // CONTINUE
  await page.waitForTimeout(400);
  s = await S();
  check('chapter 2 state loads', s.world.ch === 2 && s.world.step === 0 && s.mode === 'overworld', 'ch=' + s.world.ch + ' step=' + s.world.step);
  // seasons: 14-day seasons on a 56-day year
  const seasonAt = async d => { await page.evaluate(n => window.__hss.setDay(n), d); return (await S()).season; };
  check('seasons turn on the 56-day year',
    (await seasonAt(1)) === 'SPRING' && (await seasonAt(15)) === 'SUMMER' && (await seasonAt(29)) === 'FALL' && (await seasonAt(43)) === 'WINTER' && (await seasonAt(57)) === 'SPRING',
    'checked 1/15/29/43/57');
  await page.evaluate(() => window.__hss.setDay(7));
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('the summer passes: fall, day 36, step 1', s.day === 36 && s.season === 'FALL' && s.world.step === 1, 'day=' + s.day + ' step=' + s.world.step);
  // the house interior exists and holds the fridge and the shelf
  await page.evaluate(() => window.__hss.gotoArea('house', 10, 11));
  s = await S();
  check('the house interior loads', s.world.area === 'house', s.world.area);
  check('fridge and shelf tiles are in place', await page.evaluate(() => mapChar(12, 1) === 'r' && mapChar(2, 1) === 'a' && mapChar(10, 12) === 'D'), '');
  await page.evaluate(() => window.__hss.gotoArea('yard', 10, 5));
  await page.evaluate(() => window.__hss.fridgeSeeds());
  await page.evaluate(() => { G.save.world.flags.carried = true; saveGame(); });
  await dismissDialogue(6);
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('fridge + the carry -> step 2', s.world.step === 2, 'step=' + s.world.step);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => window.__hss.waterEverything()); await page.evaluate(() => window.__hss.advanceDay()); await dismissDialogue(8); }
  s = await S();
  check('three houses fail, the verdict lands: step 5', s.world.step === 5, 'step=' + s.world.step);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => window.__hss.storageTrip()); await dismissDialogue(6); if (i < 2) { await page.evaluate(() => window.__hss.waterEverything()); await page.evaluate(() => window.__hss.advanceDay()); await dismissDialogue(6); } }
  s = await S();
  check('the great emptying: step 6', s.world.step === 6, 'step=' + s.world.step);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  await dismissDialogue(8);
  s = await S();
  check('the sprout flood: tray ready, 40 strong', s.tray.ready === true && s.tray.n === 40 && s.world.step === 7, JSON.stringify(s.tray));
  await page.evaluate(() => { window.__hss.potUp(); window.__hss.potUp(); window.__hss.potUp(); });
  await dismissDialogue(8);
  s = await S();
  const sproutNames = s.plants.filter(p => !p.firstSix);
  check('potting-up names every sprout', s.plants.length === 9 && sproutNames.length === 3 && new Set(s.plants.map(p => p.name)).size === 9, s.plants.map(p => p.name).join(','));
  check('sprouts live at WINDOW, stage 2, varieties named', sproutNames.every(p => p.location === 'WINDOW' && p.stage === 2) && sproutNames.some(p => p.variety === 'ECHO') && sproutNames.some(p => p.variety === 'CHANDLER'), JSON.stringify(sproutNames.map(p => p.variety)));
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  await dismissDialogue(8);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('the frost trial dawns', s.mode === 'trial' && s.trial && s.trial.foe === 'FROST' && s.trial.maxPressure === 25 && s.trial.maxVigor === 22, JSON.stringify(s.trial && { foe: s.trial.foe, mp: s.trial.maxPressure, mv: s.trial.maxVigor }));
  check('unblanketed sprouts start the night STRESSED', sproutNames.every(nm => { const p = s.plants.find(q => q.name === nm.name); return p && p.health === 1; }), '');
  await page.evaluate(() => { trial.pressure = 3; });
  await page.waitForTimeout(1400);
  await tap('z'); await page.waitForTimeout(250);
  await tap('z'); await page.waitForTimeout(1600);
  await dismissDialogue(6);
  s = await S();
  check('frost trial won: the cold is done', s.world.flags.frostDone === true && s.mode === 'overworld', 'frostDone=' + s.world.flags.frostDone + ' mode=' + s.mode);
  await page.evaluate(() => { while (G.save.tray.n > 0) potUp(); });
  await dismissDialogue(8);
  s = await S();
  check('potting complete: 46 named, germ record, six at the window',
    s.plants.length === 46 && s.germ && s.germ.sown === 96 && s.germ.potted === 40 && s.pots.every(p => p.location === 'WINDOW') && s.world.step === 8,
    'plants=' + s.plants.length + ' step=' + s.world.step);
  await page.evaluate(() => window.__hss.signSale());
  await dismissDialogue(10);
  s = await S();
  check('the sale signs chapter 2 shut', s.mode === 'card' && s.world.ch === 3, 'mode=' + s.mode + ' ch=' + s.world.ch);
  await tap('z'); await page.waitForTimeout(300);
  // mortality (spec 2.8): death only at dawn, only from CRITICAL, never unwarned
  await page.evaluate(() => {
    const sv = __hss.debugSave(); sv.world.ch = 2;
    const cap = sv.plants.find(p => p.name === 'CAPTAIN'); cap.health = 3; cap.warnedDay = sv.day; cap.dryDays = 4; cap.watered = false;
    const hope = sv.plants.find(p => p.name === 'HOPE'); hope.health = 3; hope.warnedDay = sv.day; hope.dryDays = 4; hope.watered = true;
    __hss.setSave(sv);
  });
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('an unrescued CRITICAL plant dies at dawn', s.plants.find(p => p.name === 'CAPTAIN').memorial === true, '');
  check('a watered CRITICAL plant climbs back a step', (() => { const h = s.plants.find(p => p.name === 'HOPE'); return h.memorial === false && h.health === 2; })(), '');
  const compostBefore = s.compost;
  await page.evaluate(() => { const p = G.save.plants.find(q => q.name === 'CAPTAIN'); clearHusk(p); });
  await dismissDialogue(6);
  s = await S();
  check('the husk goes to compost (+2) and the register keeps the name',
    s.compost === compostBefore + 2 && s.plants.find(p => p.name === 'CAPTAIN').location === 'MEMORIAL', 'compost=' + s.compost);
  await page.evaluate(() => window.__hss.openRegister());
  s = await S();
  check('register opens on the list view', s.register.view === 'list', s.register.view);
  await tap('x'); await page.waitForTimeout(200);

  // CHAPTER 3 — LANDING: Berryhill, the viewing, the move, the build,
  // the carry, and the first night in the glass house.
  await page.evaluate(() => {
    const sv = __hss.debugSave();
    sv.world.ch = 3; sv.world.step = 0; sv.world.area = 'yard';
    sv.plants.forEach(p => { p.memorial = false; p.health = 0; p.husk = false; if (p.location === 'MEMORIAL') p.location = 'WINDOW'; });
    __hss.setSave(sv);
  });
  await page.evaluate(() => window.__hss.advanceDay());
  await dismissDialogue(8);
  s = await S();
  check('landing opens: step 1, the road is open', s.world.step === 1 && s.world.ch === 3, 'step=' + s.world.step);
  await page.evaluate(() => window.__hss.gotoArea('barnOut', 2, 1));
  await dismissDialogue(8);
  s = await S();
  check('the viewing: Berryhill loads, step 2', s.world.area === 'barnOut' && s.world.step === 2, 'area=' + s.world.area + ' step=' + s.world.step);
  check('the field is on the map, fenced and waiting', await page.evaluate(() => mapChar(13, 12) === 'G' && mapChar(13, 14) === 's' && mapChar(20, 9) === 's'), '');
  for (let i = 0; i < 2; i++) { await page.evaluate(() => window.__hss.waterEverything()); await page.evaluate(() => window.__hss.advanceDay()); await dismissDialogue(8); }
  s = await S();
  check('the decision: the barn, step 4', s.world.step === 4, 'step=' + s.world.step);
  await page.evaluate(() => window.__hss.chooseLoadOrder('plants'));
  await dismissDialogue(8);
  s = await S();
  check('plants ride first: all in the office', s.plants.every(p => p.memorial || p.location === 'OFFICE') && s.world.step === 5, 'step=' + s.world.step);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  await dismissDialogue(8);
  s = await S();
  check('moving done: step 6, build the glass house', s.world.step === 6, 'step=' + s.world.step);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.__hss.buildGreenhouse());
    await dismissDialogue(8);
    if (i < 2) { await page.evaluate(() => window.__hss.waterEverything()); await page.evaluate(() => window.__hss.advanceDay()); await dismissDialogue(6); }
  }
  s = await S();
  check('greenhouse built in three days', s.field.heater === true && s.world.step === 7, 'heater=' + s.field.heater + ' step=' + s.world.step);
  await page.evaluate(() => { let guard = 0; while (G.save.plants.some(p => p.location === 'OFFICE' && !p.memorial) && guard++ < 12) carryPlants(); });
  await dismissDialogue(8);
  s = await S();
  check('the carry: everyone in the greenhouse', s.plants.every(p => p.memorial || p.location === 'GREENHOUSE') && s.world.step === 8, 'step=' + s.world.step + ' in=' + s.plants.filter(p => p.location === 'GREENHOUSE').length);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('the first night: FROST at the glass, 35/28', s.mode === 'trial' && s.trial && s.trial.foe === 'FROST' && s.trial.maxPressure === 35 && s.trial.maxVigor === 28, JSON.stringify(s.trial && { mp: s.trial.maxPressure, mv: s.trial.maxVigor }));
  await page.evaluate(() => { trial.pressure = 3; });
  await page.waitForTimeout(1400);
  await tap('z'); await page.waitForTimeout(250);
  await tap('z'); await page.waitForTimeout(1600);
  await dismissDialogue(8);
  s = await S();
  check('the glass holds: step 9', s.world.step === 9 && s.mode === 'overworld', 'step=' + s.world.step + ' mode=' + s.mode);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('landing complete: chapter 3 card', s.mode === 'card' && s.world.ch === 4, 'mode=' + s.mode + ' ch=' + s.world.ch);
  await tap('z'); await page.waitForTimeout(300);

  // CHAPTER 4 — PLANS: stakes, irises, scouts, the ordinance, the fence.
  await page.evaluate(() => window.__hss.stakeField());
  await dismissDialogue(8);
  s = await S();
  check('staking day: the square has corners', s.world.flags.staked === true && s.world.step === 1, 'step=' + s.world.step);
  await page.evaluate(() => window.__hss.irisInteract());
  await dismissDialogue(8);
  s = await S();
  check('the irises: three gifts, named on sight, in the garden register', s.plants.filter(p => p.location === 'GARDEN' && p.variety === 'IRIS').length === 3 && s.world.step === 2, 'iris=' + s.plants.filter(p => p.variety === 'IRIS').length);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('first scouts: DEER at the stakes, pressure 30, nothing at risk', s.mode === 'trial' && s.trial && s.trial.foe === 'DEER' && s.trial.maxPressure === 30, JSON.stringify(s.trial && s.trial.maxPressure));
  await page.evaluate(() => { trial.pressure = 3; });
  await page.waitForTimeout(1400);
  await tap('z'); await page.waitForTimeout(250);
  await tap('z'); await page.waitForTimeout(1600);
  await dismissDialogue(8);
  s = await S();
  check('scouts turned back; the herd will hear of it', s.mode === 'overworld' && s.world.flags.scoutsDone === true, 'mode=' + s.mode);
  await page.evaluate(() => window.__hss.gotoArea('barnOut', 22, 5));
  await page.evaluate(() => { player.dir = 'up'; });
  await tap('z'); await page.waitForTimeout(300);
  await dismissDialogue(10);
  s = await S();
  check('the ordinance: four acres short, goats someday', s.world.step === 3, 'step=' + s.world.step);
  await tap('z'); await page.waitForTimeout(300);
  await dismissDialogue(10);
  s = await S();
  check('the fence problem, priced in pencil', s.world.flags.fenceNotes === true, '');
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('plans complete: chapter 4 card', s.mode === 'card' && s.world.ch === 5, 'mode=' + s.mode + ' ch=' + s.world.ch);
  await tap('z'); await page.waitForTimeout(300);
  await dismissDialogue(8);

  // CHAPTER 5 — DOWNSTAIRS: stairs, Oma, the patch, the Promise.
  await page.evaluate(() => window.__hss.gotoArea('barnIn', 14, 6));
  await page.evaluate(() => { player.dir = 'up'; });
  await tap('z'); await page.waitForTimeout(300);
  await dismissDialogue(10);
  s = await S();
  check('the stair project begins', s.world.flags.stairsDay != null, 'stairsDay=' + s.world.flags.stairsDay);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  await dismissDialogue(8);
  s = await S();
  check('the stairs are done at dawn; Oma is coming', s.world.flags.stairsBuilt === true && s.world.step === 1, 'built=' + s.world.flags.stairsBuilt + ' step=' + s.world.step);
  await page.evaluate(() => { const sv = __hss.debugSave(); sv.world.step = 2; __hss.setSave(sv); });
  await page.evaluate(() => { for (let i = 0; i < 12; i++) patchInteract(); });
  await dismissDialogue(12);
  s = await S();
  check('the patch: netting up, two blackberries in real ground', s.field.protoNet === true && s.plants.filter(p => p.variety === 'BLACKBERRY' && p.location === 'GARDEN').length === 2 && s.world.step === 3, 'bb=' + s.plants.filter(p => p.variety === 'BLACKBERRY').length + ' step=' + s.world.step);
  await page.evaluate(() => window.__hss.waterEverything());
  await page.evaluate(() => window.__hss.advanceDay());
  s = await S();
  check('the patch fights back: WEEDS 35/26', s.mode === 'trial' && s.trial && s.trial.foe === 'WEEDS' && s.trial.maxPressure === 35 && s.trial.maxVigor === 26, JSON.stringify(s.trial && { f: s.trial.foe, mp: s.trial.maxPressure, mv: s.trial.maxVigor }));
  await page.evaluate(() => { trial.pressure = 3; });
  await page.waitForTimeout(1400);
  await tap('z'); await page.waitForTimeout(250); // DEFEND
  await page.keyboard.down('ArrowDown'); await page.waitForTimeout(90); await page.keyboard.up('ArrowDown');
  await tap('z'); await page.waitForTimeout(1600); // DIG IN breaks the root armour
  await dismissDialogue(8);
  s = await S();
  check('the patch settles: step 4, visit Oma', s.world.step === 4 && s.mode === 'overworld', 'step=' + s.world.step + ' mode=' + s.mode);
  await page.evaluate(() => window.__hss.gotoArea('oma', 5, 5));
  await page.evaluate(() => { player.dir = 'up'; });
  await tap('z'); await page.waitForTimeout(300);
  await dismissDialogue(12);
  s = await S();
  check("oma's promise is written in the register", s.promise === true && s.mode === 'card' && s.world.ch === 6, 'promise=' + s.promise + ' mode=' + s.mode + ' ch=' + s.world.ch);
  await tap('z'); await page.waitForTimeout(300);
  await dismissDialogue(8);

  // a save written in the oldest formats still loads: pots as a bare stage
  // int and as {stage, waterDays} objects both migrate to named plants
  await page.evaluate(() => {
    const old = { v: 1, day: 3, seedsLeft: 0, tea: 2, teaBrewedDay: 0,
      pots: [2, ...[0, 1, 2, 3, 4].map(() => ({ stage: 2, waterDays: 1, watered: false, vigor: 22 }))],
      dex: { blueberry: ['SEED', 'SPROUT'] }, deerBeaten: false, deerPresent: true,
      chapterDone: false, tutorial: 3, player: { x: 11, y: 8, dir: 'down' }, constanceLine: 1 };
    localStorage.setItem('hss-save-v1', JSON.stringify(old));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__hss, null, { timeout: 8000 });
  await page.waitForTimeout(300);
  await tap('ArrowDown'); // CONTINUE
  await tap('Enter');
  await page.waitForTimeout(400);
  s = await S();
  check('old-format save continues', s.mode === 'overworld' && s.day === 3 && s.pots.every(p => p.stage === 2), 'mode=' + s.mode + ' day=' + s.day);
  check('bare-int pot migrated to a named plant', s.pots[0].name === 'ADMIRAL' && s.pots[0].location === 'BENCH', JSON.stringify(s.pots[0]));
  check('waterDays-era pot migrated with name + days', s.pots[1].name === 'CAPTAIN' && s.pots[1].wateredDays === 1, JSON.stringify(s.pots[1]));

  await browser.close();
  if (ownServer) server.close();
  log('SMOKE DONE');
})().catch(e => { log('SMOKE CRASH ' + e.message); process.exit(1); });
