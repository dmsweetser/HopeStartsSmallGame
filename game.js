'use strict';
/* HOPE STARTS SMALL — Chapter 1: SEEDS
   A tiny Pokémon-style tending game. Vanilla JS, no dependencies.
   All art is drawn in code from pixel maps. No image assets. */

// The book's Audible page — the game's funnel target.
const AUDIBLE_URL = 'https://www.audible.com/pd/Hope-Starts-Small-Audiobook/B0DZPCHT4M';
// The book's Amazon page — the title menu's second funnel link.
const BOOK_URL = 'https://www.amazon.com/dp/B0DXVKQHZ2';
const SAVE_KEY = 'hss-save-v1';
const VW = 160, VH = 144, TILE = 16;

/* ============================== FONT (3x5) ============================== */
const FONT = {
'A':['.#.','#.#','###','#.#','#.#'],'B':['##.','#.#','##.','#.#','##.'],
'C':['.##','#..','#..','#..','.##'],'D':['##.','#.#','#.#','#.#','##.'],
'E':['###','#..','##.','#..','###'],'F':['###','#..','##.','#..','#..'],
'G':['.##','#..','#.#','#.#','.##'],'H':['#.#','#.#','###','#.#','#.#'],
'I':['###','.#.','.#.','.#.','###'],'J':['..#','..#','..#','#.#','.#.'],
'K':['#.#','#.#','##.','#.#','#.#'],'L':['#..','#..','#..','#..','###'],
'M':['#.#','###','###','#.#','#.#'],'N':['#.#','###','#.#','#.#','#.#'],
'O':['.#.','#.#','#.#','#.#','.#.'],'P':['##.','#.#','##.','#..','#..'],
'Q':['.#.','#.#','#.#','##.','..#'],'R':['##.','#.#','##.','#.#','#.#'],
'S':['.##','#..','.#.','..#','##.'],'T':['###','.#.','.#.','.#.','.#.'],
'U':['#.#','#.#','#.#','#.#','###'],'V':['#.#','#.#','#.#','#.#','.#.'],
'W':['#.#','#.#','#.#','###','#.#'],'X':['#.#','#.#','.#.','#.#','#.#'],
'Y':['#.#','#.#','.#.','.#.','.#.'],'Z':['###','..#','.#.','#..','###'],
'0':['###','#.#','#.#','#.#','###'],'1':['.#.','.#.','.#.','.#.','.#.'],
'2':['##.','..#','.#.','#..','###'],'3':['##.','..#','.#.','..#','##.'],
'4':['#.#','#.#','###','..#','..#'],'5':['###','#..','##.','..#','##.'],
'6':['.##','#..','##.','#.#','.#.'],'7':['###','..#','.#.','.#.','.#.'],
'8':['.#.','#.#','.#.','#.#','.#.'],'9':['.#.','#.#','##.','..#','##.'],
'.':['...','...','...','...','.#.'],',':['...','...','...','.#.','#..'],
"'":['.#.','.#.','...','...','...'],'!':['.#.','.#.','.#.','...','.#.'],
'?':['##.','..#','.#.','...','.#.'],':':['...','.#.','...','.#.','...'],
';':['...','.#.','...','.#.','#..'],'-':['...','...','###','...','...'],
'+':['...','.#.','###','.#.','...'],'/':['..#','..#','.#.','#..','#..'],
'(':['..#','.#.','.#.','.#.','..#'],')':['#..','.#.','.#.','.#.','#..'],
'>':['#..','.#.','..#','.#.','#..'],'<':['..#','.#.','#..','.#.','..#'],
'*':['#.#','.#.','#.#','...','...'],'%':['#.#','..#','.#.','#..','#.#'],
'=':['...','###','...','###','...'],'_':['...','...','...','...','###'],
'"':['#.#','#.#','...','...','...'],'&':['.#.','#.#','.#.','#.#','.##'],
'·':['...','...','.#.','...','...'],'—':['...','...','###','...','...'],
'…':['...','...','...','#.#','...'],'×':['...','#.#','.#.','#.#','...'],
'♥':['#.#','###','###','.#.','...'],'♪':['..#','..#','..#','#.#','##.'],
'▶':['#..','##.','###','##.','#..'],'▼':['###','###','.#.','.#.','...'],'←':['...','.#.','###','.#.','...'],
'↑':['.#.','###','.#.','.#.','.#.'],'↓':['.#.','.#.','.#.','###','.#.']
};
const ctx = document.getElementById('game').getContext('2d');
ctx.imageSmoothingEnabled = false;

function textW(s, sc) { return s.length ? s.length * 4 * sc - sc : 0; }
function drawText(s, x, y, color, sc) {
  sc = sc || 1; s = String(s).toUpperCase();
  x = Math.round(x); y = Math.round(y); // fractional coords smear the 1px font into half-cut glyphs
  ctx.fillStyle = color;
  for (let i = 0; i < s.length; i++) {
    const g = FONT[s[i]]; if (!g) continue;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++)
      if (g[r][c] === '#') ctx.fillRect(x + i * 4 * sc + c * sc, y + r * sc, sc, sc);
  }
}
function wrapText(s, maxChars) {
  const words = String(s).split(' '), lines = []; let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ============================== SPRITES ============================== */
function makeSprite(rows, pal) {
  const h = rows.length, w = rows[0].length;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const c = cv.getContext('2d');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const col = pal[rows[y][x]];
    if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); }
  }
  return cv;
}
function tileCanvas(draw) {
  const cv = document.createElement('canvas'); cv.width = 16; cv.height = 16;
  draw(cv.getContext('2d')); return cv;
}
function dither(c, x, y, w, h, colA, colB) { // checkerboard dither fill
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
    c.fillStyle = ((i + j) % 2 === 0) ? colA : colB; c.fillRect(i, j, 1, 1);
  }
}
const GRASS = '#58b93e', GRASS_D = '#3f9433', GRASS_L = '#7ed957';
const SHADOW = '#357a2a'; // the one cast-shadow tone for everything standing on grass
const TILES = {};
TILES.grass = tileCanvas(c => {
  c.fillStyle = GRASS; c.fillRect(0, 0, 16, 16); c.fillStyle = GRASS_D;
  c.fillRect(2, 3, 1, 2); c.fillRect(3, 4, 1, 1); c.fillRect(11, 2, 1, 2); c.fillRect(12, 3, 1, 1);
  c.fillRect(6, 10, 1, 2); c.fillRect(7, 11, 1, 1); c.fillRect(13, 12, 1, 2); c.fillRect(14, 13, 1, 1);
  c.fillStyle = GRASS_L;
  c.fillRect(8, 6, 1, 1); c.fillRect(4, 13, 1, 1); c.fillRect(14, 7, 1, 1); c.fillRect(1, 8, 1, 1);
});
TILES.grass2 = tileCanvas(c => {
  c.fillStyle = GRASS; c.fillRect(0, 0, 16, 16); c.fillStyle = GRASS_L;
  c.fillRect(4, 6, 1, 2); c.fillRect(5, 7, 1, 1); c.fillRect(10, 11, 1, 2); c.fillRect(9, 12, 1, 1);
  c.fillRect(2, 1, 1, 1); c.fillRect(13, 9, 1, 1); c.fillRect(7, 14, 1, 1);
  c.fillStyle = GRASS_D; c.fillRect(13, 4, 2, 1); c.fillRect(1, 13, 2, 1); c.fillRect(8, 3, 1, 1);
});
TILES.grass4 = tileCanvas(c => { // a mowed, dithered patch: checker flecks of light and dark
  c.fillStyle = GRASS; c.fillRect(0, 0, 16, 16);
  for (let y = 0; y < 16; y += 2) for (let x = 0; x < 16; x += 2) {
    c.fillStyle = ((x + y) % 4 === 0) ? GRASS_L : GRASS_D;
    if ((x * 7 + y * 13) % 5 !== 0) c.fillRect(x + (y % 4 === 0 ? 0 : 1), y, 1, 1);
  }
  c.fillStyle = GRASS_D; c.fillRect(5, 9, 1, 2); c.fillRect(12, 4, 1, 2);
});
TILES.flower = tileCanvas(c => {
  c.drawImage(TILES.grass, 0, 0);
  const dots = [[3, 3, '#ff5d8f'], [11, 6, '#ffd94a'], [6, 12, '#ff5d8f'], [13, 13, '#ffffff']];
  for (const [x, y, col] of dots) { c.fillStyle = col; c.fillRect(x, y, 2, 2); c.fillStyle = '#fff6b0'; c.fillRect(x, y, 1, 1); }
});
TILES.lawn = tileCanvas(c => { // neighbours' striped lawn, seen over the fence
  c.fillStyle = '#6fce54'; c.fillRect(0, 0, 16, 16);
  c.fillStyle = '#5cba45'; c.fillRect(0, 0, 4, 16); c.fillRect(8, 0, 4, 16);
});
TILES.path = tileCanvas(c => {
  c.fillStyle = '#ecd28a'; c.fillRect(0, 0, 16, 16);
  c.fillStyle = '#c4a355'; c.fillRect(0, 0, 1, 16); c.fillRect(15, 0, 1, 16); // stone edging
  c.fillStyle = '#a8843f'; c.fillRect(1, 3, 1, 2); c.fillRect(1, 11, 1, 2); c.fillRect(14, 6, 1, 2); c.fillRect(14, 13, 1, 2);
  c.fillStyle = '#d9b96a';
  c.fillRect(3, 2, 2, 1); c.fillRect(9, 5, 3, 1); c.fillRect(4, 9, 2, 1); c.fillRect(11, 12, 2, 1); c.fillRect(6, 14, 3, 1);
  c.fillStyle = '#c4a355'; c.fillRect(12, 2, 1, 1); c.fillRect(2, 12, 1, 1);
});
TILES.grass3 = tileCanvas(c => {
  c.fillStyle = GRASS; c.fillRect(0, 0, 16, 16); c.fillStyle = GRASS_D;
  c.fillRect(1, 1, 1, 2); c.fillRect(2, 2, 1, 1); c.fillRect(8, 5, 1, 2); c.fillRect(9, 6, 1, 1);
  c.fillRect(14, 9, 1, 2); c.fillRect(15, 10, 1, 1); c.fillRect(4, 13, 1, 2); c.fillRect(5, 14, 1, 1);
  c.fillStyle = GRASS_L; c.fillRect(11, 1, 1, 2); c.fillRect(6, 8, 1, 1);
  c.fillStyle = '#9aa38f'; c.fillRect(12, 13, 2, 1); // a pebble
});
TILES.tuft = tileCanvas(c => {
  c.drawImage(TILES.grass, 0, 0); c.fillStyle = GRASS_D;
  c.fillRect(6, 5, 1, 4); c.fillRect(8, 4, 1, 5); c.fillRect(10, 5, 1, 4); c.fillRect(7, 7, 3, 1);
  c.fillStyle = GRASS_L; c.fillRect(8, 4, 1, 1); c.fillRect(6, 5, 1, 1); c.fillRect(10, 5, 1, 1);
});
TILES.soil = tileCanvas(c => {
  c.fillStyle = '#8a5a30'; c.fillRect(0, 0, 16, 16); c.fillStyle = '#6f4520';
  c.fillRect(0, 3, 16, 1); c.fillRect(0, 8, 16, 1); c.fillRect(0, 13, 16, 1);
  c.fillStyle = '#a5713d'; c.fillRect(3, 1, 2, 1); c.fillRect(10, 6, 2, 1); c.fillRect(5, 11, 2, 1);
});

const FW = '#f4f4f0', FS = '#c9ced4', FK = '#20242a';
TILES.fenceH = tileCanvas(c => {
  c.drawImage(TILES.grass, 0, 0);
  c.fillStyle = SHADOW; c.fillRect(0, 13, 16, 3); // ground shadow under the fence
  c.fillStyle = FW; c.fillRect(0, 6, 16, 2); c.fillRect(0, 11, 16, 2); // rails
  c.fillStyle = FS; c.fillRect(0, 7, 16, 1); c.fillRect(0, 12, 16, 1);
  for (const x of [1, 6, 12]) { // pointed pickets with a shaded edge and nails
    c.fillStyle = FW; c.fillRect(x + 1, 2, 1, 1); c.fillRect(x, 3, 3, 12);
    c.fillStyle = FS; c.fillRect(x + 2, 3, 1, 12);
    c.fillStyle = FK; c.fillRect(x + 1, 6, 1, 1); c.fillRect(x + 1, 11, 1, 1);
  }
});
TILES.fenceV = tileCanvas(c => {
  c.drawImage(TILES.grass, 0, 0);
  c.fillStyle = SHADOW; c.fillRect(10, 0, 6, 16); // ground shadow
  c.fillStyle = FW; c.fillRect(4, 2, 2, 12); c.fillRect(11, 2, 2, 12); // side rails
  c.fillStyle = FW; c.fillRect(6, 1, 5, 14);
  c.fillStyle = FS; c.fillRect(9, 1, 2, 14);
  c.fillStyle = FK; c.fillRect(8, 0, 2, 1);
});
TILES.gate = tileCanvas(c => {
  c.fillStyle = '#a5713d'; c.fillRect(1, 2, 14, 13);
  c.fillStyle = '#8a5a30'; c.fillRect(1, 6, 14, 1); c.fillRect(1, 11, 14, 1);
  c.fillStyle = '#6f4520'; c.fillRect(7, 2, 2, 13);
  c.fillStyle = FK; c.fillRect(12, 8, 2, 2);
});
TILES.roof = tileCanvas(c => { // shingles: fine bands, a bright ridge line at
  // the top and a deep eave shadow at the bottom, so the row reads as a roof
  c.fillStyle = '#3f7fd8'; c.fillRect(0, 0, 16, 16);
  c.fillStyle = '#7fb2e8'; c.fillRect(0, 0, 16, 1); // ridge highlight
  for (let b = 0; b < 4; b++) {
    const y = 1 + b * 3;
    c.fillStyle = '#5b9bf0'; c.fillRect(0, y, 16, 1);
    c.fillStyle = '#2a5aa8'; c.fillRect(0, y + 2, 16, 1);
    const off = (b % 2) * 4;
    c.fillStyle = '#2a5aa8';
    for (let x = off; x < 16; x += 8) c.fillRect(x, y, 1, 2);
  }
  c.fillStyle = '#1e4478'; c.fillRect(0, 13, 16, 2); // eave shadow
  c.fillStyle = '#e8edf2'; c.fillRect(0, 15, 16, 1); // gutter line
});
TILES.chimney = tileCanvas(c => {
  c.drawImage(TILES.roof, 0, 0);
  c.fillStyle = '#e8edf2'; c.fillRect(2, 1, 2, 2); c.fillRect(4, 0, 2, 2); // smoke puffs
  c.fillStyle = '#8a8f96'; c.fillRect(5, 3, 7, 2); // concrete cap
  c.fillStyle = '#b0552f'; c.fillRect(6, 5, 5, 11); // brick stack
  c.fillStyle = '#d97b4a'; c.fillRect(6, 5, 1, 11);
  c.fillStyle = '#8a3d20'; c.fillRect(10, 5, 1, 11); c.fillRect(6, 8, 5, 1); c.fillRect(6, 12, 5, 1);
});
TILES.wall = tileCanvas(c => { // horizontal siding: lit top, shadow line under each plank
  c.fillStyle = '#8fc1f0'; c.fillRect(0, 0, 16, 16);
  for (let y = 0; y < 16; y += 4) {
    c.fillStyle = '#a8d0f7'; c.fillRect(0, y, 16, 1);
    c.fillStyle = '#5b93d6'; c.fillRect(0, y + 3, 16, 1);
  }
  c.fillStyle = '#7fb2e8'; c.fillRect(7, 1, 1, 2); c.fillRect(12, 5, 1, 2); c.fillRect(3, 9, 1, 2); c.fillRect(9, 13, 1, 2);
});
TILES.wallBase = tileCanvas(c => { // bottom wall row: siding over a stone foundation
  c.drawImage(TILES.wall, 0, 0);
  c.fillStyle = '#8a8f96'; c.fillRect(0, 10, 16, 6);
  c.fillStyle = '#a8adb5'; c.fillRect(0, 10, 16, 1); c.fillRect(2, 11, 5, 2); c.fillRect(10, 13, 5, 2);
  c.fillStyle = '#6f747c'; c.fillRect(0, 12, 16, 1); c.fillRect(0, 15, 16, 1);
  c.fillRect(7, 10, 1, 2); c.fillRect(3, 13, 1, 2); c.fillRect(12, 10, 1, 2); c.fillRect(8, 13, 1, 2);
  c.fillStyle = SHADOW; c.fillRect(0, 15, 16, 1);
});
TILES.window = tileCanvas(c => { // framed window: curtains, muntins, sill, flower box
  c.drawImage(TILES.wall, 0, 0);
  c.fillStyle = '#f4f4f0'; c.fillRect(2, 2, 12, 11);
  c.fillStyle = '#ffe9a8'; c.fillRect(4, 4, 8, 7);
  c.fillStyle = '#fff6cf'; c.fillRect(6, 5, 2, 3);
  // pink curtains hanging at both sides of the glass, with a shaded fold
  c.fillStyle = '#f2a7bb'; c.fillRect(4, 4, 2, 7); c.fillRect(10, 4, 2, 7);
  c.fillStyle = '#d97b96'; c.fillRect(5, 4, 1, 7); c.fillRect(10, 4, 1, 7);
  c.fillStyle = '#f4f4f0'; c.fillRect(7, 4, 2, 7); c.fillRect(4, 7, 8, 1);
  c.fillStyle = FK; c.fillRect(2, 2, 12, 1); c.fillRect(2, 12, 12, 1); c.fillRect(2, 2, 1, 11); c.fillRect(13, 2, 1, 11);
  c.fillStyle = '#e0e4ea'; c.fillRect(1, 13, 14, 2);
  c.fillStyle = '#6ea3dd'; c.fillRect(1, 15, 14, 1);
  // a flower box on the sill: green tufts and three bright blooms
  c.fillStyle = '#2f9e44'; c.fillRect(3, 12, 10, 1);
  c.fillStyle = '#ff5d8f'; c.fillRect(4, 11, 1, 1); c.fillRect(11, 11, 1, 1);
  c.fillStyle = '#ffd94a'; c.fillRect(7, 11, 2, 1);
  c.fillStyle = '#ffffff'; c.fillRect(9, 12, 1, 1);
});
TILES.door = tileCanvas(c => { // paneled door: awning, porch posts, wreath, hanging basket
  c.drawImage(TILES.wall, 0, 0);
  c.fillStyle = '#37b24d'; c.fillRect(0, 0, 16, 2);
  c.fillStyle = '#2b8a3e'; c.fillRect(0, 2, 16, 1); c.fillRect(2, 3, 2, 1); c.fillRect(7, 3, 2, 1); c.fillRect(12, 3, 2, 1);
  c.fillStyle = '#f4f4f0'; c.fillRect(3, 3, 10, 13);
  c.fillStyle = '#a5662c'; c.fillRect(4, 4, 8, 12);
  c.fillStyle = '#ffe9a8'; c.fillRect(5, 5, 6, 3);
  c.fillStyle = '#8a4f1f'; c.fillRect(5, 9, 6, 2); c.fillRect(5, 12, 6, 3);
  c.fillStyle = '#ffd94a'; c.fillRect(10, 10, 2, 2);
  // a wreath on the door: green ring with red berries
  c.fillStyle = '#2f9e44'; c.fillRect(6, 9, 3, 1); c.fillRect(6, 11, 3, 1); c.fillRect(6, 10, 1, 1); c.fillRect(8, 10, 1, 1);
  c.fillStyle = '#e0483e'; c.fillRect(6, 9, 1, 1); c.fillRect(8, 11, 1, 1);
  // porch posts flanking the door frame
  c.fillStyle = '#f4f4f0'; c.fillRect(0, 4, 1, 12); c.fillRect(15, 4, 1, 12);
  c.fillStyle = '#c9ced4'; c.fillRect(1, 4, 1, 12); c.fillRect(14, 8, 1, 8);
  // hanging flower basket at the top-right, on a little chain
  c.fillStyle = FK; c.fillRect(13, 3, 1, 1);
  c.fillStyle = '#ff5d8f'; c.fillRect(12, 4, 1, 1); c.fillRect(14, 4, 1, 1);
  c.fillStyle = '#2f9e44'; c.fillRect(12, 5, 3, 1);
  c.fillStyle = '#8a5a30'; c.fillRect(12, 6, 3, 2);
});
TILES.porch = tileCanvas(c => { // wooden deck boards in front of the door, with a welcome mat
  c.fillStyle = '#b5854d'; c.fillRect(0, 0, 16, 16);
  for (let y = 0; y < 16; y += 4) {
    c.fillStyle = '#c99a5f'; c.fillRect(0, y, 16, 1);
    c.fillStyle = '#96682f'; c.fillRect(0, y + 3, 16, 1);
  }
  c.fillStyle = '#6f4520'; c.fillRect(2, 1, 1, 1); c.fillRect(13, 5, 1, 1); c.fillRect(2, 9, 1, 1); c.fillRect(13, 13, 1, 1);
  c.fillStyle = '#b03030'; c.fillRect(5, 6, 6, 4);
  c.fillStyle = '#8a2424'; c.fillRect(5, 6, 6, 1);
  c.fillStyle = '#8a5a30'; c.fillRect(0, 15, 16, 1);
});
TILES.bench = tileCanvas(c => {
  // garden bench: two slats, short legs, and a mulched planting bed at its base
  c.fillStyle = '#c08b4d'; c.fillRect(0, 3, 16, 1);
  c.fillStyle = '#a5713d'; c.fillRect(0, 4, 16, 2); c.fillRect(0, 7, 16, 2);
  c.fillStyle = '#8a5a30'; c.fillRect(0, 6, 16, 1); c.fillRect(0, 9, 16, 1);
  c.fillStyle = '#6f4520'; c.fillRect(0, 4, 1, 5); c.fillRect(15, 4, 1, 5); // seams between bench sections
  c.fillStyle = '#6f4520'; c.fillRect(2, 10, 2, 2); c.fillRect(12, 10, 2, 2);
  c.fillStyle = '#6f4520'; c.fillRect(0, 12, 16, 4);
  c.fillStyle = '#8a5a30'; c.fillRect(2, 13, 2, 1); c.fillRect(8, 14, 2, 1); c.fillRect(13, 13, 2, 1);
  c.fillStyle = '#54c95e'; c.fillRect(5, 12, 1, 1); c.fillRect(11, 14, 1, 1);
});
TILES.compost = tileCanvas(c => {
  c.fillStyle = '#6f4520'; c.fillRect(1, 4, 14, 12);
  c.fillStyle = '#8a5a30'; c.fillRect(1, 4, 14, 2); c.fillRect(1, 9, 14, 1); c.fillRect(1, 13, 14, 1);
  c.fillStyle = '#4a7c2f'; c.fillRect(4, 2, 3, 3); c.fillRect(9, 1, 4, 3); c.fillRect(12, 3, 2, 2);
  c.fillStyle = '#5da244'; c.fillRect(5, 1, 2, 2); c.fillRect(10, 0, 2, 2);
});
/* ---- weeds (pass 8): drawn OVER a grass tile, decor layer. The common
   tuft is a yellow-green fan, quite unlike the lawn's own thin tufts; the
   deep-rooted one is taller, darker, and shows its root flare. ---- */
const WEED_TUFT = makeSprite([
'................',
'................',
'.....y....y.....',
'....l.l..l.l....',
'....l..l.l..l...',
'.....l.lll.l....',
'..y...lll...y...',
'...l..lll..l....',
'....l.lllll.....',
'.....llllll.....',
'....dddddddd....',
'...dddddddddd...',
'.......rr.......',
'................',
'................',
'................',
], { y: '#a8b83e', l: '#7a9a2e', d: '#4a7c2f', r: '#6f4520' });
const WEED_DEEP = makeSprite([
'..D.......D.....',
'..D..s...D..s...',
'...D.D..D..D....',
'....D.DDD.D.....',
'..D..DDDD...D...',
'...D.DDDD.D.....',
'....DDDDDD......',
'..D.DDDDDDD.D...',
'...DDDDDDDDD....',
'....ddddddd.....',
'...ddddddddd....',
'..DDDDDDDDDDD...',
'.....R.R.R......',
'......RRR.......',
'................',
'................',
], { D: '#2e5d24', d: '#3f7030', s: '#c9a83e', R: '#5a3a1e' });

/* ---- pass 3 dressing: sway frames, garden plot, props, dressed fences ---- */
TILES.flowerB = tileCanvas(c => { // flower frame B: blooms leaned 1px the other way (sway)
  c.drawImage(TILES.grass, 0, 0);
  const dots = [[4, 3, '#ff5d8f'], [12, 6, '#ffd94a'], [7, 12, '#ff5d8f'], [14, 13, '#ffffff']];
  for (const [x, y, col] of dots) { c.fillStyle = col; c.fillRect(x, y, 2, 2); c.fillStyle = '#fff6b0'; c.fillRect(x, y, 1, 1); }
  c.fillStyle = GRASS_D; c.fillRect(3, 5, 1, 2); c.fillRect(11, 8, 1, 2); c.fillRect(6, 14, 1, 1);
});
TILES.tuftB = tileCanvas(c => {
  c.drawImage(TILES.grass, 0, 0); c.fillStyle = GRASS_D;
  c.fillRect(7, 5, 1, 4); c.fillRect(9, 4, 1, 5); c.fillRect(11, 5, 1, 4); c.fillRect(8, 7, 3, 1);
  c.fillStyle = GRASS_L; c.fillRect(9, 4, 1, 1); c.fillRect(7, 5, 1, 1); c.fillRect(11, 5, 1, 1);
});
TILES.flower2 = tileCanvas(c => { // purple / orange / teal bed
  c.drawImage(TILES.grass, 0, 0);
  const dots = [[2, 4, '#b07fe8'], [9, 2, '#ff9f43'], [5, 10, '#3ec6b8'], [12, 12, '#b07fe8'], [13, 6, '#ff9f43']];
  for (const [x, y, col] of dots) { c.fillStyle = col; c.fillRect(x, y, 2, 2); c.fillStyle = '#fff6b0'; c.fillRect(x, y, 1, 1); }
});
TILES.flower3 = tileCanvas(c => { // blue / white / red bed
  c.drawImage(TILES.grass, 0, 0);
  const dots = [[4, 2, '#5b9bf0'], [11, 5, '#ffffff'], [6, 9, '#e0483e'], [13, 12, '#5b9bf0'], [2, 13, '#ffffff']];
  for (const [x, y, col] of dots) { c.fillStyle = col; c.fillRect(x, y, 2, 2); c.fillStyle = '#fff6b0'; c.fillRect(x, y, 1, 1); }
});
function bedTile(blooms) { // a real flower BED: mulch border, leafy fill, dense blooms
  return tileCanvas(c => {
    c.fillStyle = '#6f4520'; c.fillRect(0, 0, 16, 16);
    c.fillStyle = '#8a5a30'; c.fillRect(1, 1, 14, 14);
    c.fillStyle = '#5f3717'; c.fillRect(3, 4, 2, 1); c.fillRect(11, 9, 2, 1); c.fillRect(6, 13, 2, 1);
    c.fillStyle = '#2f9e44';
    c.fillRect(2, 2, 6, 5); c.fillRect(9, 2, 5, 4); c.fillRect(3, 8, 5, 5); c.fillRect(9, 8, 5, 6); c.fillRect(6, 5, 4, 4);
    c.fillStyle = '#54c95e';
    c.fillRect(3, 3, 3, 2); c.fillRect(10, 3, 2, 2); c.fillRect(4, 9, 3, 2); c.fillRect(11, 10, 2, 2); c.fillRect(7, 6, 2, 1);
    for (const [x, y, col] of blooms) { c.fillStyle = col; c.fillRect(x, y, 2, 2); c.fillStyle = '#fff6b0'; c.fillRect(x, y, 1, 1); }
  });
}
TILES.bedA = bedTile([[3, 3, '#ff5d8f'], [11, 4, '#ffffff'], [6, 9, '#ffd94a'], [12, 11, '#ff5d8f'], [4, 12, '#ffffff'], [8, 5, '#ff5d8f']]);
TILES.bedB = bedTile([[4, 4, '#b07fe8'], [11, 3, '#ff9f43'], [6, 10, '#3ec6b8'], [12, 12, '#b07fe8'], [3, 11, '#ff9f43'], [9, 6, '#b07fe8']]);
TILES.soilSprout = tileCanvas(c => { // tilled row with sproutlets coming up
  c.drawImage(TILES.soil, 0, 0);
  c.fillStyle = '#2f9e44';
  c.fillRect(3, 2, 1, 2); c.fillRect(8, 2, 1, 2); c.fillRect(13, 2, 1, 2);
  c.fillRect(5, 7, 1, 2); c.fillRect(11, 7, 1, 2);
  c.fillRect(3, 12, 1, 2); c.fillRect(9, 12, 1, 2); c.fillRect(14, 12, 1, 2);
  c.fillStyle = '#54c95e';
  c.fillRect(2, 1, 1, 1); c.fillRect(4, 1, 1, 1); c.fillRect(7, 1, 1, 1); c.fillRect(9, 1, 1, 1); c.fillRect(12, 1, 1, 1); c.fillRect(14, 1, 1, 1);
  c.fillRect(4, 6, 1, 1); c.fillRect(6, 6, 1, 1); c.fillRect(10, 6, 1, 1); c.fillRect(12, 6, 1, 1);
  c.fillRect(2, 11, 1, 1); c.fillRect(4, 11, 1, 1); c.fillRect(8, 11, 1, 1); c.fillRect(10, 11, 1, 1); c.fillRect(13, 11, 1, 1); c.fillRect(15, 11, 1, 1);
});
TILES.pathStone = tileCanvas(c => { // path with two big flat stepping stones
  c.drawImage(TILES.path, 0, 0);
  c.fillStyle = '#c9ced4'; c.fillRect(3, 2, 6, 5); c.fillRect(8, 9, 6, 5);
  c.fillStyle = '#e8edf2'; c.fillRect(3, 2, 6, 1); c.fillRect(8, 9, 6, 1);
  c.fillStyle = '#8a8f96'; c.fillRect(3, 6, 6, 1); c.fillRect(8, 13, 6, 1); c.fillRect(5, 3, 1, 2); c.fillRect(11, 10, 1, 2);
});
TILES.bush = tileCanvas(c => { // a leafy bush with berries, on grass
  c.drawImage(TILES.grass, 0, 0);
  c.fillStyle = '#357a2a'; c.fillRect(2, 12, 12, 3);
  c.fillStyle = '#1f6b2a'; c.fillRect(3, 4, 10, 9); c.fillRect(2, 6, 12, 6);
  c.fillStyle = '#2f9e44'; c.fillRect(4, 3, 8, 8); c.fillRect(3, 5, 10, 5);
  c.fillStyle = '#54c95e'; c.fillRect(5, 4, 4, 3); c.fillRect(9, 7, 3, 2);
  c.fillStyle = '#7ed957'; c.fillRect(6, 4, 2, 1); c.fillRect(10, 6, 1, 1);
  c.fillStyle = '#e0483e'; c.fillRect(5, 8, 1, 1); c.fillRect(9, 10, 1, 1); c.fillRect(12, 7, 1, 1); c.fillRect(7, 6, 1, 1);
});
TILES.birdbath = tileCanvas(c => { // stone birdbath on grass; the sparkle is animated at draw time
  c.drawImage(TILES.grass, 0, 0);
  c.fillStyle = SHADOW; c.fillRect(3, 13, 10, 2);
  c.fillStyle = '#8a8f96'; c.fillRect(7, 8, 3, 5); c.fillRect(5, 13, 7, 1); // pedestal and foot
  c.fillStyle = '#6f747c'; c.fillRect(5, 8, 7, 1); // shadow under the basin
  c.fillStyle = '#c9ced4'; c.fillRect(1, 4, 14, 3); c.fillRect(2, 3, 12, 1); // the wide basin
  c.fillStyle = '#5b9bf0'; c.fillRect(3, 4, 10, 1); // water
  c.fillStyle = '#a8dcff'; c.fillRect(4, 4, 4, 1);
  c.fillStyle = '#e8edf2'; c.fillRect(1, 7, 14, 1); // lit rim underside
});
TILES.mailbox = tileCanvas(c => { // fence line with a mailbox by the gate, red flag up
  c.drawImage(TILES.fenceH, 0, 0);
  c.fillStyle = '#6f4520'; c.fillRect(7, 8, 2, 7);
  c.fillStyle = '#3b6fe0'; c.fillRect(4, 3, 9, 5);
  c.fillStyle = '#2f56b8'; c.fillRect(4, 7, 9, 1); c.fillRect(11, 3, 2, 5);
  c.fillStyle = '#a8dcff'; c.fillRect(5, 4, 3, 1);
  c.fillStyle = '#e0483e'; c.fillRect(12, 0, 1, 3); c.fillRect(11, 0, 2, 1);
  c.fillStyle = FK; c.fillRect(5, 5, 1, 1);
});
TILES.crate = tileCanvas(c => { // two stacked crates on the grass
  c.drawImage(TILES.grass, 0, 0);
  c.fillStyle = '#357a2a'; c.fillRect(1, 14, 14, 2);
  c.fillStyle = '#a5713d'; c.fillRect(2, 8, 12, 7); c.fillRect(4, 2, 9, 6);
  c.fillStyle = '#c08b4d'; c.fillRect(2, 8, 12, 1); c.fillRect(4, 2, 9, 1);
  c.fillStyle = '#6f4520';
  c.fillRect(2, 11, 12, 1); c.fillRect(4, 5, 9, 1);
  c.fillRect(3, 9, 1, 5); c.fillRect(12, 9, 1, 5); c.fillRect(5, 3, 1, 4); c.fillRect(11, 3, 1, 4);
  c.fillRect(7, 9, 1, 5); c.fillRect(8, 3, 1, 4);
});
TILES.can = tileCanvas(c => { // a watering can left on the grass by the bench
  c.drawImage(TILES.grass, 0, 0);
  c.fillStyle = '#357a2a'; c.fillRect(4, 13, 9, 2);
  c.fillStyle = '#37b24d'; c.fillRect(5, 8, 7, 5);
  c.fillStyle = '#2b8a3e'; c.fillRect(5, 12, 7, 1); c.fillRect(10, 8, 2, 5);
  c.fillStyle = '#54c95e'; c.fillRect(5, 8, 7, 1);
  c.fillRect(3, 10, 2, 1); c.fillRect(12, 9, 3, 1); // spout and handle
  c.fillStyle = '#2b8a3e'; c.fillRect(2, 9, 1, 2); c.fillRect(14, 8, 1, 2);
  c.fillStyle = '#ffd94a'; c.fillRect(8, 10, 1, 1);
});
TILES.fenceBloom = tileCanvas(c => { // fence with a flower bed at its base
  c.drawImage(TILES.fenceH, 0, 0);
  const dots = [[1, 13, '#ff5d8f'], [6, 14, '#ffd94a'], [11, 13, '#b07fe8'], [14, 14, '#ffffff']];
  for (const [x, y, col] of dots) { c.fillStyle = col; c.fillRect(x, y, 2, 2); }
  c.fillStyle = '#2f9e44'; c.fillRect(3, 14, 1, 2); c.fillRect(9, 13, 1, 2); c.fillRect(13, 15, 1, 1);
});
TILES.fenceVine = tileCanvas(c => { // side fence with a vine climbing it
  c.drawImage(TILES.fenceV, 0, 0);
  c.fillStyle = '#2f9e44'; c.fillRect(5, 10, 3, 2); c.fillRect(6, 7, 3, 2); c.fillRect(5, 4, 2, 2); c.fillRect(7, 12, 2, 2);
  c.fillStyle = '#54c95e'; c.fillRect(6, 9, 1, 1); c.fillRect(7, 6, 1, 1); c.fillRect(6, 3, 1, 1);
  c.fillStyle = '#ff5d8f'; c.fillRect(8, 5, 1, 1);
});

/* tree: 16x32 object sprite, drawn anchored to its tile's bottom */
const TREE = makeSprite([
'.....kkkkkk.....',
'...kkggggggkk...',
'..kggHgggggggk..',
'..gHgGGgggGggg..',
'.kgGGGGgGGGGGgk.',
'.gGGGGGgGGgGGGg.',
'.gGGgGGGGGGGGGg.',
'..kgGGGGgGGGgk..',
'...kkggggggkk...',
'....kkttttkk....',
'......ttTt......',
'......ttTt......',
'......ttTt......',
'.....tttTt......',
'....ttttTTt.....',
'................',
], { k: '#1f6b2a', g: '#2f9e44', G: '#54c95e', H: '#7ed957', t: '#7a4a21', T: '#5f3717' });

/* ============================== CHARACTERS (16x16) ============================== */
const SKIN = '#f2c184', HAIR = '#6b4423', EYE = '#20242a';
/* k = outline, S/H/B = shaded side of skin/hair/shirt */
const FRANK_PAL = { k: '#20242a', s: SKIN, S: '#d99e5f', h: HAIR, H: '#54381d', e: EYE, c: '#2e8b3a', C: '#1f6b2a', b: '#2f6fd0', B: '#245aa8', p: '#33549e', y: '#ffd94a', o: '#33261a' };
const FRANK_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCCck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....kSssssSk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbpbbpBks...',
'...skpyppyBks...',
'....kkppppkk....',
'....kppkkppk....',
'....kppkkppk....',
'....koookooo....',
], FRANK_PAL);
const FRANK_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCCck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....kSssssSk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbpbbpBks...',
'...skpyppyBkk...',
'...skkppppkk....',
'.....kppkppk....',
'.....kppkppk....',
'.....kookook....',
], FRANK_PAL);
const FRANK_UP = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCCck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....khhhhhhk....',
'....khhHHhhk....',
'....khhhhHHk....',
'.....kkkkkk.....',
'...kkbBbbbBkk...',
'...skbBbbbBks...',
'...skbBbbbBks...',
'....kkppppkk....',
'....kppkkppk....',
'....kppkkppk....',
'....koookooo....',
], FRANK_PAL);
const FRANK_UP2 = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCCck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....khhhhhhk....',
'....khhHHhhk....',
'....khhhhHHk....',
'.....kkkkkk.....',
'...kkbBbbbBkk...',
'...skbBbbbBks...',
'...skbBbbbBks...',
'....kkppppkk....',
'.....kppkppk....',
'.....kppkppk....',
'.....kookook....',
], FRANK_PAL);
const FRANK_SIDE = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCcck....',
'....kccccccck...',
'....kHHhhhhk....',
'....ksssssSk....',
'....kSsssessk...',
'....kssssosk....',
'.....kkkkk......',
'....kkbbbbb.....',
'....kbbbbBks....',
'....kbbbbBk.....',
'....kkppppk.....',
'...kppk.kppk....',
'...kppk.kppk....',
'..koook.koook...',
], FRANK_PAL);
const FRANK_SIDE2 = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCcck....',
'....kccccccck...',
'....kHHhhhhk....',
'....ksssssSk....',
'....kSsssessk...',
'....kssssosk....',
'.....kkkkk......',
'....kkbbbbb.....',
'....kbbbbBk.....',
'....kbbbbBks....',
'....kkppppk.....',
'.....kppk.......',
'.....kppk.......',
'.....koook......',
], FRANK_PAL);
/* idle blink frames: the standing front/side views with eyes closed */
const FRANK_DOWN_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCCck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....kSssssSk....',
'....ksSssSsk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbpbbpBks...',
'...skpyppyBks...',
'....kkppppkk....',
'....kppkkppk....',
'....kppkkppk....',
'....koookooo....',
], FRANK_PAL);
const FRANK_DOWN_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCCck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....kSssssSk....',
'....ksessesk....',
'....ksskkSsk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbpbbpBks...',
'...skpyppyBks...',
'....kkppppkk....',
'....kppkkppk....',
'....kppkkppk....',
'....koookooo....',
], FRANK_PAL);
const FRANK_SIDE_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCcck....',
'....kccccccck...',
'....kHHhhhhk....',
'....ksssssSk....',
'....ksssssssk...',
'....kssssosk....',
'.....kkkkk......',
'....kkbbbbb.....',
'....kbbbbBks....',
'....kbbbbBk.....',
'....kkppppk.....',
'...kppk.kppk....',
'...kppk.kppk....',
'..koook.koook...',
], FRANK_PAL);
const FRANK_SIDE_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccCcck....',
'....kccccccck...',
'....kHHhhhhk....',
'....ksssssSk....',
'....kSsssessk...',
'....kssssksk....',
'.....kkkkk......',
'....kkbbbbb.....',
'....kbbbbBks....',
'....kbbbbBk.....',
'....kkppppk.....',
'...kppk.kppk....',
'...kppk.kppk....',
'..koook.koook...',
], FRANK_PAL);
const FRANK_SET = { down: [FRANK_DOWN, FRANK_DOWN2], up: [FRANK_UP, FRANK_UP2], side: [FRANK_SIDE, FRANK_SIDE2], blinkDown: FRANK_DOWN_BLINK, blinkSide: FRANK_SIDE_BLINK, talkDown: FRANK_DOWN_TALK, talkSide: FRANK_SIDE_TALK };
const CONSTANCE_PAL = { k: '#20242a', s: SKIN, S: '#d99e5f', h: '#8a5a2e', H: '#6f4520', e: EYE, d: '#2a9d8f', D: '#1f7a6e', w: '#f8f8f8', o: '#3a2c1c' };
const CONSTANCE_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....khHHhhhk....',
'....khhhhHhk....',
'....khsssshk....',
'....khsesesk....',
'....khsooShk....',
'....kssssssk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwdDks...',
'...skddwwdDks...',
'...kddwwDwdDk...',
'...kddwwwDDDk...',
'....kdddkddk....',
'....kookkook....',
], CONSTANCE_PAL);
const CONSTANCE_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khHHhhhk....',
'....khhhhHhk....',
'....khsssshk....',
'....khsesesk....',
'....khsooShk....',
'....kssssssk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwdDks...',
'...skddwwdDks...',
'..kddwwDwdDk....',
'..kddwwwddDk....',
'....kdddkddk....',
'.....ookook.....',
], CONSTANCE_PAL);
const CONSTANCE_SIDE = makeSprite([
'................',
'....kkkkkk......',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHHhhsok....',
'.....kkkkk......',
'....kkddddd.....',
'....kddddDks....',
'....kddddDk.....',
'...kdddddwdDk...',
'...kdddddwdDk...',
'...kssk.kssk....',
'...kook.kook....',
], CONSTANCE_PAL);
const CONSTANCE_SIDE2 = makeSprite([
'................',
'....kkkkkk......',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHHhhsok....',
'.....kkkkk......',
'....kkddddd.....',
'....kddddDk.....',
'....kddddDks....',
'....kddddwdDk...',
'....kddddwdDk...',
'....ksskssk.....',
'....kookook.....',
], CONSTANCE_PAL);
const CONSTANCE_UP = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhHhhhhhk...',
'...khhhhhhhhk...',
'...khhHHHhhhk...',
'...khhhHHhhhk...',
'....khhhhhk.....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwddks...',
'...skddwwddks...',
'...kdddwwddDk...',
'...kdddddddDk...',
'....kdddkddk....',
'....kookkook....',
], CONSTANCE_PAL);
const CONSTANCE_UP2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhHhhhhhk...',
'...khhhhhhhhk...',
'...khhHHHhhhk...',
'...khhhHHhhhk...',
'....khhhhhk.....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwddks...',
'...skddwwddks...',
'...kdddwwddDk...',
'...kdddddddDk...',
'.....kddkddk....',
'.....ookook.....',
], CONSTANCE_PAL);
const CONSTANCE_DOWN_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....khHHhhhk....',
'....khhhhHhk....',
'....khsssshk....',
'....khsSsSsk....',
'....khsooShk....',
'....kssssssk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwdDks...',
'...skddwwdDks...',
'...kddwwwwdDk...',
'...kddwwwDDDk...',
'....kdddkddk....',
'....kookkook....',
], CONSTANCE_PAL);
const CONSTANCE_DOWN_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....khHHhhhk....',
'....khhhhHhk....',
'....khsssshk....',
'....khsesesk....',
'....khskkShk....',
'....kssssssk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwdDks...',
'...skddwwdDks...',
'...kddwwwwdDk...',
'...kddwwwDDDk...',
'....kdddkddk....',
'....kookkook....',
], CONSTANCE_PAL);
const CONSTANCE_SIDE_BLINK = makeSprite([
'................',
'....kkkkkk......',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhssk....',
'....khhhhssk....',
'....kHHhhsok....',
'.....kkkkk......',
'....kkddddd.....',
'....kddddDks....',
'....kddddDk.....',
'...kdddddwdDk...',
'...kdddddwdDk...',
'...kssk.kssk....',
'...kook.kook....',
], CONSTANCE_PAL);
const CONSTANCE_SIDE_TALK = makeSprite([
'................',
'....kkkkkk......',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHHhhskk....',
'.....kkkkk......',
'....kkddddd.....',
'....kddddDks....',
'....kddddDk.....',
'...kdddddwdDk...',
'...kdddddwdDk...',
'...kssk.kssk....',
'...kook.kook....',
], CONSTANCE_PAL);
const CONSTANCE_SET = { down: [CONSTANCE_DOWN, CONSTANCE_DOWN2], up: [CONSTANCE_UP, CONSTANCE_UP2], side: [CONSTANCE_SIDE, CONSTANCE_SIDE2], blinkDown: CONSTANCE_DOWN_BLINK, blinkSide: CONSTANCE_SIDE_BLINK, talkDown: CONSTANCE_DOWN_TALK, talkSide: CONSTANCE_SIDE_TALK };
/* Alvin: tan short coat, floppy darker ears, green collar with a tag.
   Side sprite faces right (charSprite flips it for left); the two frames
   wag his tail and stride his legs. */
const ALVIN_PAL = { k: '#20242a', t: '#d9a05a', T: '#b57f3d', d: '#8a5a2e', m: '#ecd3a0', n: '#20242a', g: '#37b24d', y: '#ffd94a', e: '#20242a', r: '#e88ca0' };
const ALVIN_DOWN = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kdTkettekTdk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....ktmmmmtk....',
'....kmmnnmmk....',
'.....mmmmmm.....',
'....kggggggk....',
'....kttgyttk....',
'....kttttttkT...',
'....ktkttktk....',
'....kkk.kkk.....',
], ALVIN_PAL);
const ALVIN_DOWN2 = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kdTkettekTdk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....ktmmmmtk....',
'....kmmnnmmk....',
'.....mmrrmm.....',
'....kggggggk....',
'....kttgyttk....',
'...Tkttttttk....',
'...ktkttktk.....',
'...kkk..kkk.....',
], ALVIN_PAL);
const ALVIN_UP = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kddkttttkddk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....kggggggk....',
'....kttttttk....',
'....ktTttTtk....',
'....kttTtttk....',
'....ktkttktk....',
'....kkkTTkkk....',
'........tt......',
'................',
], ALVIN_PAL);
const ALVIN_UP2 = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kddkttttkddk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....kggggggk....',
'....kttttttk....',
'....ktTttTtk....',
'....kttTtttk....',
'...ktkttktk.....',
'...kkkTTkkk.....',
'.....tt.........',
'................',
], ALVIN_PAL);
const ALVIN_SIDE = makeSprite([
'................',
'.tt.............',
'.tTt....kkkk....',
'..ttT..kddddk...',
'...tT.kddttttk..',
'....ktttttttek..',
'..kktttttttttk..',
'..ktttttmmmmnk..',
'..kttttmmmmmmk..',
'..kttttttggggk..',
'..ktttttttggyk..',
'..kTTTTTTTTTTk..',
'...ktk..kTk.....',
'...ktk..kTk.....',
'...kkk..kkk.....',
'................',
], ALVIN_PAL);
const ALVIN_SIDE2 = makeSprite([
'................',
'................',
'........kkkk....',
'..t....kddddk...',
'..tT..kddttttk..',
'..tTktttttttek..',
'..kktttttttttk..',
'..ktttttmmmmnk..',
'..kttttmmmmmmk..',
'..kttttttggggk..',
'..ktttttttggyk..',
'..kTTTTTTTTTTk..',
'..ktk.....kTk...',
'..ktk.....kTk...',
'..kkk.....kkk...',
'................',
], ALVIN_PAL);
const ALVIN_SIT_DOWN = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kdTkettekTdk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....ktmmmmtk....',
'....kmmnnmmk....',
'.....mmmmmm.....',
'....kggggggk....',
'...kttttttttk...',
'..kttttttttttk..',
'..kTk.kttk.kTk..',
'..kkk.kkkk.kkk..',
], ALVIN_PAL);
const ALVIN_SIT_UP = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kddkttttkddk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....kggggggk....',
'....kttttttk....',
'...kttttttttk...',
'..kttttttttttk..',
'..kTTttttttTTk..',
'..kkk.kttk.kkk..',
'......tttt......',
'................',
], ALVIN_PAL);
const ALVIN_SIT_SIDE = makeSprite([
'................',
'.tt.............',
'.tTt....kkkk....',
'..ttT..kddddk...',
'...tT.kddttttk..',
'....ktttttttek..',
'..kktttttttttk..',
'..ktttttmmmmnk..',
'..kttttmmmmmmk..',
'..kttttttggggk..',
'..ktttttttggyk..',
'..kTTTTTTTTTTk..',
'..kTTTk...kTk...',
'..kTTTTk..kTk...',
'..kkkkkk..kkk...',
'................',
], ALVIN_PAL);
const ALVIN_SET = { down: [ALVIN_DOWN, ALVIN_DOWN2], up: [ALVIN_UP, ALVIN_UP2], side: [ALVIN_SIDE, ALVIN_SIDE2], sitDown: ALVIN_SIT_DOWN, sitUp: ALVIN_SIT_UP, sitSide: ALVIN_SIT_SIDE };
/* small deer for the yard */
const DEER_SMALL = makeSprite([
'...a..a.........',
'..a.a.a.a.......',
'..kkkkkk........',
'.khhhhhhk.......',
'.khhehhkhk......',
'.kmmmhhhk.......',
'..kmmkbbbbk.....',
'....kbbbbbbbk...',
'....kbbbbwbbkt..',
'....kbbbbbbbk...',
'....kkkkkkkkk...',
'.....bb....bb...',
'.....bb....bb...',
'.....kk....kk...',
'................',
'................',
], { a: '#8a5a2e', h: '#caa06a', e: '#20242a', b: '#b07a45', t: '#e8dcc0', k: '#20242a', m: '#e8dcc0', w: '#e8dcc0' });

/* ============================== POTS (16x16, sit on the bench) ============================== */
const POT_PAL = { p: '#b5651d', P: '#8a4a16', s: '#5a3a1e', g: '#2f9e44', G: '#54c95e', b: '#3b6fe0', B: '#2f56b8' };
function potSprite(extra) {
  return makeSprite([
'................',
'................',
'................',
'................',
'................',
'................',
'................',
'................',
extra[0], extra[1],
'....pppppppp....',
'...pppppppppp...',
'...ppppsspppp...',
'....pppppppp....',
'.....PPPPPP.....',
'......PPPP......',
], POT_PAL);
}
const POT_EMPTY = potSprite(['................', '................']);
const POT_SEED = potSprite(['......s..s......', '....s...s.......']);
const POT_SPROUT = makeSprite([
'................',
'................',
'................',
'.......gg.......',
'......gGGg......',
'.......gg.......',
'......gGg.......',
'.......gg.......',
'.......gg.......',
'.......gg.......',
'....pppppppp....',
'...pppppppppp...',
'...ppppsspppp...',
'....pppppppp....',
'.....PPPPPP.....',
'......PPPP......',
], POT_PAL);
const POT_SEEDLING = makeSprite([
'.......bb.......',
'......bBBb......',
'.......gg.......',
'.....ggGGgg.....',
'....gGGGGGGg....',
'.....gGGgGg.....',
'.......gg.......',
'.......gg.......',
'................',
'................',
'....pppppppp....',
'...pppppppppp...',
'...ppppsspppp...',
'....pppppppp....',
'.....PPPPPP.....',
'......PPPP......',
], POT_PAL);
const POT_SPRITES = [POT_EMPTY, POT_SEED, POT_SPROUT, POT_SEEDLING];

/* ============================== BATTLE SPRITES ============================== */
/* wild deer, side profile facing left, drawn at 2x on the trial screen:
   wedge neck in body colour with a light throat stripe, arched back,
   two-segment legs, far side shaded. 32x24. */
const DEER_BIG = makeSprite([
'......a....a....................',
'.....a.a..a..a..................',
'......a....a....................',
'....kkkkkkkkk...................',
'...khhhhhhhhhkhk................',
'...khhhhhhhhhkk.................',
'...khhehhhhhhk..................',
'..kmmmhhhhhkhb..................',
'..kmmmkhhhkhbB..................',
'....mmmk..hbBB..................',
'..........hbBBbkkkkkkkkkkkkkk...',
'..........hbbbbbbbbbbbbbbbbbbbk.',
'...........bbbbbbbbbwbbbwbbbbbbt',
'...........bbbbbbbbbbbwbbbbbbbbt',
'...........bbbbbbbbbbbbbbbbbbbk.',
'...........kBBBBBBBBBBBBBBBBk...',
'............bbbbBBBBBBBBbbbb....',
'.............bb..BB......bbBB...',
'.............bb..BB......bbBB...',
'..............bb.BB.....bb.BB...',
'..............bB.BB.....bB.BB...',
'..............bB.BB.....bB.BB...',
'..............bB.BB.....bB.BB...',
'.............kkk.kkk...kkk.kkk..',
], { a: '#8a5a2e', h: '#caa06a', e: '#20242a', b: '#b07a45', B: '#8a5a2e', w: '#e8dcc0', t: '#e8dcc0', k: '#20242a', m: '#e8dcc0' });
/* alarmed variant: ear flattened back, white tail flagged high —
   shown once the deer's Pressure runs low (and as an idle ear-flicker) */
const DEER_BIG2 = makeSprite([
'......a....a....................',
'.....a.a..a..a..................',
'......a....a....................',
'....kkkkkkkkk...................',
'...khhhhhhhhhkhh................',
'...khhhhhhhhhkhh..............kt',
'...khhehhhhhhk................kt',
'..kmmmhhhhhkhb................kt',
'..kmmmkhhhkhbB................kt',
'....mmmk..hbBB................kt',
'..........hbBBbkkkkkkkkkkkkkk.kt',
'..........hbbbbbbbbbbbbbbbbbbbkt',
'...........bbbbbbbbbwbbbwbbbbbbk',
'...........bbbbbbbbbbbwbbbbbbbbk',
'...........bbbbbbbbbbbbbbbbbbbk.',
'...........kBBBBBBBBBBBBBBBBk...',
'............bbbbBBBBBBBBbbbb....',
'.............bb..BB......bbBB...',
'.............bb..BB......bbBB...',
'..............bb.BB.....bb.BB...',
'..............bB.BB.....bB.BB...',
'..............bB.BB.....bB.BB...',
'..............bB.BB.....bB.BB...',
'.............kkk.kkk...kkk.kkk..',
], { a: '#8a5a2e', h: '#caa06a', e: '#20242a', b: '#b07a45', B: '#8a5a2e', w: '#e8dcc0', t: '#e8dcc0', k: '#20242a', m: '#e8dcc0' });
/* Alvin, big side profile for the trial screen (28x20, drawn at 2x):
   sturdy pit-type build, deep chest, floppy ear, green collar with tag,
   tail up and curved. He faces right, toward the deer. */
const ALVIN_BIG = makeSprite([
'............................',
'......................kkkk..',
'..kt................dktttttk',
'..kttt.............kddttettt',
'...kttt............kddtttttk',
'....ktttkkkkkkkkkkkkddtmmmmn',
'.....ktttttttttttttddtmmmk..',
'....ktttttttttttttttdkt.....',
'....kttttttttttttgggktk.....',
'....kttttttttttttggymmk.....',
'....kttttttttttttttttmmk....',
'.....kttttTTTTTTTTttmmk.....',
'.....kTTTTTTTTTTTTTTmk......',
'......kttkTTkkkkkkkkttTT....',
'.......tt.TT........ttTT....',
'.......tT.TT........tTTT....',
'.......tt.TT........ttTT....',
'.......tt.TT........ttTT....',
'.......tt.TT........ttTT....',
'.......tttTTT.......tttTTT..',
], ALVIN_PAL);
/* bark frame: head raised, mouth wide open, tongue out */
const ALVIN_BIG_BARK = makeSprite([
'......................kkkk..',
'....................dktttttk',
'..kt...............kddttettk',
'..kttt.............kddtmmmmn',
'...kttt............kddtnnnk.',
'....ktttkkkkkkkkkkkkddtnrnk.',
'.....kttttttttttttttddkttk..',
'....ktttttttttttttttdkt.....',
'....kttttttttttttgggktk.....',
'....kttttttttttttggymmk.....',
'....kttttttttttttttttmmk....',
'.....kttttTTTTTTTTttmmk.....',
'.....kTTTTTTTTTTTTTTmk......',
'......kttkTTkkkkkkkkttTT....',
'.......tt.TT........ttTT....',
'.......tT.TT........tTTT....',
'.......tt.TT........ttTT....',
'.......tt.TT........ttTT....',
'.......tt.TT........ttTT....',
'.......tttTTT.......tttTTT..',
], ALVIN_PAL);
/* lunge frame: body stretched low and forward, front legs reaching,
   hind legs driving, tail streaming behind */
const ALVIN_BIG_LUNGE = makeSprite([
'............................',
'............................',
'............................',
'.......................kkkk.',
'ttttt...............kddttetk',
'.ttttt..............ttttmmmn',
'..ktttkkkkkkkkkkkkkkttttmmk.',
'....kttttttttttttttddtt.....',
'....ktttttttttttttgggtk.....',
'....ktttttttttttttgymmk.....',
'....kttttttttttttttttmmk....',
'.....kttttTTTTTTTTttmmk.....',
'.....kTTTTTTTTTTTTTTmk......',
'......kttkTTkkkkkkkkttTT....',
'.....tt.TT...........ttTT...',
'....tt.TT.............ttTT..',
'...tt.TT...............ttTT.',
'...t..T.................tttT',
'...t..T..................TTT',
'..tttTTT....................',
], ALVIN_PAL);
/* butterflies that wander the yard (ambient, never saved) */
const BUTTERFLY_A = makeSprite([
'w......w',
'ww....ww',
'wwwbbwww',
'..bbbb..',
'........',
], { w: '#ffb347', b: '#20242a' });
const BUTTERFLY_B = makeSprite([
'........',
'...bb...',
'..bbbb..',
'wwwbbwww',
'ww....ww',
], { w: '#ffb347', b: '#20242a' });
const BUTTERFLY2_A = makeSprite([
'w......w',
'ww....ww',
'wwwbbwww',
'..bbbb..',
'........',
], { w: '#b07fe8', b: '#20242a' });
const BUTTERFLY2_B = makeSprite([
'........',
'...bb...',
'..bbbb..',
'wwwbbwww',
'ww....ww',
], { w: '#b07fe8', b: '#20242a' });
/* ============================== MAP: DEERBROOK BACKYARD (24x18) ============================== */
/* l lawn(neighbour) f fenceV v fenceVine H fenceH F fenceBloom G gate T tree U bush
   R roof c chimney W wall i window D door g grass u grass2 o/O/Q flower beds p path
   j stepping stone P porch B bench C compost s/S tilled plot b birdbath M mailbox
   K crates w watering can. Gameplay geometry (house, door, porch, path column,
   bench row, compost, gate, deer tile, spawn clearing) is unchanged from the
   first slice; pass 3 only redressed tiles and added solid yard props (bush,
   birdbath, mailbox, crates) on spots that were already obstacles or corners. */
const MAP = [
'nnnnnnnnnnnnnnnnnnnnnnnn',
'nfRRRRcRRRRRRRRRRRRRRRfn',
'nfWWiWWWWWWWWWWiWWWWWWfn',
'nfEEEEEEEEEDEEEEEEEEEEfn',
'nfOoQgogouoPoouoQgouoofn',
'nfAAogugQggpgugoguYYgofn',
'nfAATggugggpggguggYYogfn',
'nfgugggAAoopgggYYgggTgfn',
'nfoogugggggjgQggguggogfn',
'nvogggougggpgugggggOgufn',
'nfQogggggBBBBBBggggoggfn',
'nfoguYYggggpgggwggggCgfn',
'nfggUggooggpggggAAgggKfn',
'nfgsSsSggggpggugggUgggfn',
'nfgSsSsgoogpggggggooggvn',
'nfuggugggggjggggggguggfn',
'nfbogggggggpggggggggogfn',
'nfFFFFHHHHMGGHHHHHHHHFfn',
];
const MAP_W = 24, MAP_H = 18;
const TILEMAP = { n: 'lawn', f: 'fenceV', v: 'fenceVine', H: 'fenceH', F: 'fenceBloom', G: 'gate', R: 'roof', c: 'chimney', W: 'wall', E: 'wallBase', i: 'window', D: 'door', g: 'grass', u: 'grass2', o: 'flower', O: 'flower2', Q: 'flower3', p: 'path', j: 'pathStone', P: 'porch', B: 'bench', C: 'compost', T: 'grass', s: 'soil', S: 'soilSprout', U: 'bush', b: 'birdbath', M: 'mailbox', K: 'crate', w: 'can', A: 'bedA', Y: 'bedB' };
const SOLID = new Set(['n', 'f', 'v', 'H', 'F', 'G', 'R', 'c', 'W', 'E', 'i', 'D', 'B', 'C', 'T', 'U', 'b', 'M', 'K']);
function mapChar(x, y) { if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return 'f'; return MAP[y][x]; }
function isSolid(x, y) { return SOLID.has(mapChar(x, y)); }

/* ============================== STATE ============================== */
const STAGE_NAMES = ['EMPTY', 'SEED', 'SPROUT', 'SEEDLING'];
const MAX_VIGOR = [0, 0, 22, 28];
/* Every plant is an individual with a name Frank gave it (roll call order —
   Constance noted, correctly, that it is alphabetical). A plant lives on the
   bench; the register is a journal of lives, never a storage box. */
const PLANT_NAMES = ['ADMIRAL', 'CAPTAIN', 'GENERAL', 'HOPE', 'PATIENCE', 'PROFESSOR'];
function freshPot(i) {
  return {
    name: PLANT_NAMES[i], stage: 0, wateredDays: 0, watered: false, vigor: 0, tended: 0,
    sownDay: null, sproutedDay: null, seedlingDay: null, location: 'BENCH',
    dirt: false, dirtCredit: 0, // good dirt: a permanent mark + banked growth credit
  };
}
/* Old saves stored pots as bare stage ints, then as {stage, waterDays, ...}
   objects. Bring any of them up to the named-plant shape, inventing nothing
   the player did: stage days fall back to day 1, names to the roll call. */
function migratePot(p, i) {
  if (typeof p === 'number') p = { stage: p };
  p = p || {};
  const st = p.stage | 0;
  return {
    name: (typeof p.name === 'string' && p.name.trim()) ? p.name : PLANT_NAMES[i],
    stage: st,
    wateredDays: p.wateredDays != null ? p.wateredDays : (p.waterDays || 0),
    watered: !!p.watered, vigor: p.vigor || 0, tended: p.tended || 0,
    sownDay: p.sownDay != null ? p.sownDay : (st >= 1 ? 1 : null),
    sproutedDay: p.sproutedDay != null ? p.sproutedDay : (st >= 2 ? 1 : null),
    seedlingDay: p.seedlingDay != null ? p.seedlingDay : (st >= 3 ? 1 : null),
    location: 'BENCH',
    dirt: !!p.dirt, dirtCredit: p.dirtCredit || 0,
  };
}
function migrateSave(s) {
  s.pots = s.pots.map((p, i) => migratePot(p, i));
  // pass 8 fields (the weeds loop): saves from before it have none of
  // this — weeds start absent, purses empty, the two lines unheard.
  s.weeds = Array.isArray(s.weeds)
    ? s.weeds.filter(w => w && Number.isInteger(w.x) && Number.isInteger(w.y)).map(w => ({ x: w.x, y: w.y, deep: !!w.deep }))
    : [];
  if (typeof s.compost !== 'number') s.compost = 0;
  if (typeof s.goodDirt !== 'number') s.goodDirt = 0;
  s.weedLineSeen = !!s.weedLineSeen;
  s.cornerLineSeen = !!s.cornerLineSeen;
  return s;
}
let G = null; // game state (serializable part in G.save)
function newSave() {
  return {
    v: 1, day: 1, seedsLeft: 6, tea: 3, teaBrewedDay: 0,
    pots: PLANT_NAMES.map((n, i) => freshPot(i)),
    dex: { blueberry: [] },
    deerBeaten: false, deerPresent: false, chapterDone: false,
    tutorial: 0, // 0 intro dialogue, 1 plant, 2 water, 3 done
    player: { x: 10, y: 6, dir: 'down' },
    constanceLine: 0,
    weeds: [], compost: 0, goodDirt: 0, weedLineSeen: false, cornerLineSeen: false,
  };
}
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.save)); } catch (e) {} }
function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.v === 1 && Array.isArray(s.pots)) return migrateSave(s); } catch (e) {}
  return null;
}
function dexAdd(stageName) {
  if (!G.save.dex.blueberry.includes(stageName)) G.save.dex.blueberry.push(stageName);
}
function anyStageAtLeast(n) { return G.save.pots.some(p => p.stage >= n); }
function strongestPot() {
  let best = -1, bi = -1;
  G.save.pots.forEach((p, i) => { if (p.stage >= 2 && p.stage > best) { best = p.stage; bi = i; } });
  return bi;
}

/* ============================== SETTINGS ============================== */
/* Persisted separately from the game save, so starting a New Game (which
   overwrites the save) never resets the player's control preferences. */
const SETTINGS_KEY = 'hss-settings-v1';
const settings = { stick: 'auto', music: true }; // stick: auto | always | off; music: theme on/off
try {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  const v = s && (s.stick || s.pad); // 'pad' was the D-pad-era field name; migrate it forward
  if (['auto', 'always', 'off'].includes(v)) settings.stick = v;
  if (s && s.music === false) settings.music = false;
} catch (e) {}
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ stick: settings.stick, music: settings.music })); } catch (e) {} }

/* ============================== THEME SONG ============================== */
/* "This Is My Father's World" — the tune TERRA BEATA (Franklin L.
   Sheppard, Alleluia, 1915; traditional English melody). Public domain;
   tune only, no words anywhere in the game. The arrangement below is
   the game's own (soft lead, simple bass, gentle chord pads), and it is
   generated from theme.mid — the Standard MIDI File in the repo root is
   the source of truth (see tests/make-theme.js, which writes both).
   Melody verified note-for-note Nov 26, 2026 against Hymnary.org's
   TERRA BEATA tune record (Eb major; incipit 12353 21234 65326) and the
   1919 printing as engraved at piano.org (opening Eb4 F4 G4 Bb4 G4 F4
   Eb4 F4 G4; second half opens on Bb4 and peaks on Eb5; lowest note
   Bb3; the Amen moves Ab -> Eb). Playback data is [note, beats] pairs
   on one shared 69-beat timeline; 0 / [] is a rest. */
const THEME = {
  bpm: 88, beats: 69,
  melody: [[63,0.5],[65,0.5],[67,1],[70,1],[67,1],[65,1],[63,3],[65,0.5],[67,0.5],[68,1],[72,1],[70,1],[67,1],[65,3],[72,0.5],[70,0.5],[67,1],[67,1],[65,1],[63,1],[67,2],[65,0.5],[63,0.5],[58,1],[63,1],[65,1],[67,1],[70,1],[65,1],[67,1],[63,2],[70,0.5],[75,0.5],[70,1],[72,1],[74,1],[75,3],[75,0.5],[74,0.5],[72,1],[68,1],[67,1],[70,1],[70,3],[72,0.5],[70,0.5],[67,1],[67,1],[65,1],[63,1],[67,2],[65,0.5],[63,0.5],[58,1],[63,1],[65,1],[67,1],[70,1],[65,1],[67,1],[63,2],[68,2],[63,2]],
  bass: [[0,1],[39,2],[46,2],[39,2],[46,2],[44,2],[51,2],[44,2],[48,2],[39,2],[46,2],[39,3],[46,1],[39,2],[46,2],[39,2],[43,2],[0,0.5],[39,2],[46,1.5],[39,2],[43,2],[44,2],[48,2],[44,2],[44,2],[39,2],[46,2],[39,3],[46,1],[39,2],[46,2],[39,4],[44,2],[39,2]],
  chords: [[[],1],[[55,58,63],4],[[55,58,63],4],[[56,60,63],4],[[56,60,63],4],[[55,58,63],4],[[55,58,63],4],[[55,58,63],4],[[55,58,63],4],[[],0.5],[[55,58,63],3.5],[[55,58,63],4],[[56,60,63],4],[[56,60,63],4],[[55,58,63],4],[[55,58,63],4],[[55,58,63],4],[[55,58,63],4],[[56,60,63],2],[[55,58,63],2]],
};
/* The three voices merged into one beat-sorted event list, once. */
const THEME_SEQ = (() => {
  const ev = [];
  const add = (stream, kind) => {
    let b = 0;
    for (const [n, d] of stream) {
      if (Array.isArray(n)) { for (const nn of n) if (nn) ev.push({ beat: b, kind, note: nn, dur: d }); }
      else if (n) ev.push({ beat: b, kind, note: n, dur: d });
      b += d;
    }
  };
  add(THEME.melody, 'melody'); add(THEME.bass, 'bass'); add(THEME.chords, 'chord');
  ev.sort((a, b) => a.beat - b.beat);
  return ev;
})();
/* WebAudio chiptune playback, title screen only. Browsers refuse audio
   before a user gesture, so nothing is created until the player's first
   key/touch/click anywhere; themeSync() (called every frame) then starts
   and stops the loop as the mode and the MUSIC setting demand. */
let themeCtx = null, themeMaster = null, themeTimer = null, themePlaying = false;
let themeIdx = 0, themeLoopStart = 0, userGestured = false;
const themeDbg = { scheduled: 0 }; // notes scheduled since boot (read via __hss)
for (const evName of ['pointerdown', 'keydown', 'touchstart']) {
  window.addEventListener(evName, () => {
    userGestured = true;
    if (themeCtx && themeCtx.state === 'suspended') themeCtx.resume();
  }, { passive: true });
}
function themePlayNote(t, e) {
  const spb = 60 / THEME.bpm;
  const osc = themeCtx.createOscillator(), g = themeCtx.createGain();
  const conf = e.kind === 'melody' ? { type: 'triangle', peak: 0.5, atk: 0.012 }
    : e.kind === 'bass' ? { type: 'triangle', peak: 0.36, atk: 0.012 }
    : { type: 'square', peak: 0.11, atk: 0.09 }; // chord pads breathe in slowly
  osc.type = conf.type;
  osc.frequency.value = 440 * Math.pow(2, (e.note - 69) / 12);
  const dur = Math.max(0.06, e.dur * spb * (e.kind === 'chord' ? 1 : 0.92));
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(conf.peak, t + conf.atk);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(g); g.connect(themeMaster);
  osc.start(t); osc.stop(t + dur + 0.05);
}
function themeTick() {
  if (!themeCtx) return;
  const spb = 60 / THEME.bpm, ahead = themeCtx.currentTime + 0.18;
  while (themePlaying) {
    const e = THEME_SEQ[themeIdx], t = themeLoopStart + e.beat * spb;
    if (t > ahead) break;
    if (t >= themeCtx.currentTime - 0.05) { themePlayNote(t, e); themeDbg.scheduled++; }
    themeIdx++;
    if (themeIdx >= THEME_SEQ.length) { themeIdx = 0; themeLoopStart += THEME.beats * spb; }
  }
}
function themeStart() {
  if (themePlaying || !userGestured) return;
  if (!themeCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    themeCtx = new AC();
    themeMaster = themeCtx.createGain(); themeMaster.gain.value = 0.4; // quiet under everything
    themeMaster.connect(themeCtx.destination);
  }
  if (themeCtx.state === 'suspended') themeCtx.resume();
  themeMaster.gain.setTargetAtTime(0.4, themeCtx.currentTime, 0.05);
  themeIdx = 0; themeLoopStart = themeCtx.currentTime + 0.06;
  themeTimer = setInterval(themeTick, 40);
  themePlaying = true;
}
function themeStop() {
  if (themeTimer) { clearInterval(themeTimer); themeTimer = null; }
  if (themeMaster && themeCtx) themeMaster.gain.setTargetAtTime(0.0001, themeCtx.currentTime, 0.03);
  themePlaying = false;
}
function themeSync() {
  const want = mode === 'title' && settings.music;
  if (want && !themePlaying) themeStart();
  else if (!want && themePlaying) themeStop();
}

/* ============================== INPUT ============================== */
const keys = {};
let btnA = false, btnB = false, padA = false, padB = false, padStart = false;
let padDir = { x: 0, y: 0 }, touchA = false, touchB = false, menuBtnHit = false;
let prevA = false, prevB = false, prevStart = false;
const Input = {
  dir: { x: 0, y: 0 }, aHit: false, bHit: false, startHit: false,
  poll() {
    let x = 0, y = 0;
    if (keys['arrowleft'] || keys['a']) x -= 1;
    if (keys['arrowright'] || keys['d']) x += 1;
    if (keys['arrowup'] || keys['w']) y -= 1;
    if (keys['arrowdown'] || keys['s']) y += 1;
    // gamepad
    let gp = null;
    try { const pads = navigator.getGamepads ? navigator.getGamepads() : []; for (const p of pads) if (p) { gp = p; break; } } catch (e) {}
    padA = padB = padStart = false;
    if (gp) {
      const b = i => !!(gp.buttons[i] && gp.buttons[i].pressed);
      if (b(14)) x -= 1; if (b(15)) x += 1; if (b(12)) y -= 1; if (b(13)) y += 1;
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      if (ax < -0.4) x -= 1; if (ax > 0.4) x += 1; if (ay < -0.4) y -= 1; if (ay > 0.4) y += 1;
      padA = b(0); padB = b(1); padStart = b(9);
    }
    // the on-screen stick commits to a single cardinal: it feeds the same axes
    if (x === 0 && y === 0 && (padDir.x || padDir.y)) { x = padDir.x; y = padDir.y; }
    // diagonals from any source collapse to one axis (tile movement is 4-way)
    if (x !== 0 && y !== 0) { if (this.dir.x !== 0 && this.dir.y === 0) y = 0; else x = 0; }
    this.dir.x = Math.sign(x); this.dir.y = Math.sign(y);
    const aNow = btnA || padA || touchA, bNow = btnB || padB || touchB;
    const sNow = padStart || !!keys['p'] || menuBtnHit;
    menuBtnHit = false; // consumed: one press of the deck MENU button = one Start edge
    this.aHit = aNow && !prevA; this.bHit = bNow && !prevB; this.startHit = sNow && !prevStart;
    prevA = aNow; prevB = bNow; prevStart = sNow;
  }
};
window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
  keys[k] = true;
  if (k === 'z' || k === 'enter') btnA = true;
  if (k === 'x' || k === 'escape') btnB = true;
});
window.addEventListener('keyup', e => {
  const k = e.key.toLowerCase(); keys[k] = false;
  if (k === 'z' || k === 'enter') btnA = false;
  if (k === 'x' || k === 'escape') btnB = false;
});
let padToastShown = false;
window.addEventListener('gamepadconnected', () => { if (!padToastShown) { padToastShown = true; toast('GAMEPAD CONNECTED'); } });
/* Touch controls: an ANALOG STICK + a MENU button + A/B buttons in the page
   deck below the screen (never over the canvas, so they can't cover
   dialogue). Visibility follows settings.stick: always | off | auto.
   The stick is rigorous about direction: it reads a continuous vector, but
   movement only ever commits to ONE cardinal —
     · magnitude < 0.35 (deadzone): no movement, commitment cleared;
     · magnitude >= 0.5: commit to the nearest cardinal (90° sectors);
     · hysteresis: a commitment holds until the angle moves at least 15°
       past the sector boundary (60° from the committed sector's centre),
       so jitter near a boundary never flickers the direction;
     · diagonals never reach the game; release stops movement at once. */
const deckEl = document.getElementById('deck');
const coarsePointer = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
let touchSeen = false;
const stickDebug = { dir: null, mag: 0 }; // exposed via __hss for the smoke test
function stickShouldShow() {
  return settings.stick === 'always' || (settings.stick === 'auto' && (touchSeen || coarsePointer));
}
function applyStickPref() { deckEl.hidden = !stickShouldShow(); }
window.addEventListener('touchstart', () => { if (!touchSeen) { touchSeen = true; applyStickPref(); } }, { passive: true });
(function () {
  const base = document.getElementById('stickBase');
  const knob = document.getElementById('stickKnob');
  const ticks = {
    up: base.querySelector('.tick.up'), right: base.querySelector('.tick.right'),
    down: base.querySelector('.tick.down'), left: base.querySelector('.tick.left'),
  };
  const DEAD = 0.35, COMMIT = 0.5, HYST = (45 + 15) * Math.PI / 180; // 15° past the boundary
  const SECTORS = ['right', 'down', 'left', 'up']; // index = round(angle / 90°), screen coords (y down)
  const CENTER = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
  const UNIT = { right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, up: { x: 0, y: -1 } };
  let active = false, committed = null;
  function sectorOf(a) { let i = Math.round(a / (Math.PI / 2)) % 4; if (i < 0) i += 4; return SECTORS[i]; }
  function angDist(a, b) { const d = Math.abs(a - b) % (Math.PI * 2); return d > Math.PI ? Math.PI * 2 - d : d; }
  function showTicks() { for (const k in ticks) ticks[k].classList.toggle('on', k === committed); }
  function setKnob(x, y) { knob.style.transform = 'translate(-50%,-50%) translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)'; }
  function updateStick(cx, cy) {
    const r = base.getBoundingClientRect(), rad = r.width / 2;
    const dx = cx - (r.left + rad), dy = cy - (r.top + rad);
    const dist = Math.hypot(dx, dy), mag = Math.min(1, dist / rad), ang = Math.atan2(dy, dx);
    if (mag < DEAD) committed = null;
    else if (mag >= COMMIT) {
      const cand = sectorOf(ang);
      if (!committed) committed = cand;
      else if (cand !== committed && angDist(ang, CENTER[committed]) > HYST) committed = cand;
    }
    // 0.35..0.5 is the grey band: an existing commitment holds, none is created
    padDir = committed ? UNIT[committed] : { x: 0, y: 0 };
    stickDebug.dir = committed; stickDebug.mag = Math.round(mag * 100) / 100;
    // the knob follows the thumb, clamped to the base; once a direction is
    // committed its offset snaps toward that cardinal (cross-axis damped)
    const travel = Math.max(4, rad - 25);
    let kx = dx, ky = dy;
    if (dist > travel) { kx = dx / dist * travel; ky = dy / dist * travel; }
    if (committed) {
      const u = UNIT[committed];
      const par = kx * u.x + ky * u.y;        // along the committed axis
      const per = kx * -u.y + ky * u.x;       // across it
      kx = u.x * par + -u.y * per * 0.3;
      ky = u.y * par + u.x * per * 0.3;
    }
    setKnob(kx, ky); showTicks();
  }
  function endStick() {
    active = false; committed = null; padDir = { x: 0, y: 0 };
    stickDebug.dir = null; stickDebug.mag = 0;
    setKnob(0, 0); showTicks();
  }
  base.addEventListener('pointerdown', e => {
    e.preventDefault(); active = true;
    try { base.setPointerCapture(e.pointerId); } catch (err) {}
    updateStick(e.clientX, e.clientY);
  });
  base.addEventListener('pointermove', e => { if (active) updateStick(e.clientX, e.clientY); });
  base.addEventListener('pointerup', endStick);
  base.addEventListener('pointercancel', endStick);
  base.addEventListener('lostpointercapture', endStick);
  const bind = (id, set) => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', e => { e.preventDefault(); set(true); });
    el.addEventListener('pointerup', () => set(false));
    el.addEventListener('pointerleave', () => set(false));
    el.addEventListener('pointercancel', () => set(false));
  };
  bind('btnA', v => touchA = v); bind('btnB', v => touchB = v);
  // the deck's MENU button is a Start press: P and gamepad Start still work
  document.getElementById('btnMenu').addEventListener('pointerdown', e => { e.preventDefault(); menuBtnHit = true; });
  applyStickPref();
})();

/* ============================== RUNTIME / UI STATE ============================== */
let mode = 'title'; // title | chapters | overworld | dialogue | trial | card | register | menu | controls
let titleSel = 0, chapterSel = 0, fade = 0, fading = null;
let toastMsg = '', toastT = 0;
function toast(m) { toastMsg = m; toastT = 2.2; }
const player = { tx: 10, ty: 6, px: 160, py: 96, dir: 'down', moving: false, mx: 0, my: 0, mt: 0, stepAlt: false };
const alvin = { tx: 9, ty: 7, px: 144, py: 112, dir: 'down', moving: false, mx: 0, my: 0, mt: 0, wag: true };
const constance = { tx: 12, ty: 6, dir: 'left' };
const STEP_T = 0.13;
let camX = 0, camY = 0;
function syncPixels(e) { e.px = e.tx * TILE; e.py = e.ty * TILE; }
function faceName(dx, dy) { return dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down'; }

/* ============================== DIALOGUE ============================== */
let dlg = null; // {lines:[{name,text}], idx, chars, timer, cb, choice}
function say(lines, cb, choice) {
  const raw = Array.isArray(lines) ? lines : [lines];
  // a leading "FRANK:" / "CONSTANCE:" becomes a speaker name tag on the box,
  // so the characterization reads without shouting prefixes in the text
  const parsed = raw.map(l => {
    const m = String(l).match(/^(FRANK|CONSTANCE):\s*/);
    return m ? { name: m[1], text: String(l).slice(m[0].length) } : { name: null, text: String(l) };
  });
  dlg = { lines: parsed, idx: 0, chars: 0, timer: 0, cb: cb || null, choice: choice || null };
  mode = 'dialogue';
}
function dlgUpdate(dt) {
  if (!dlg) return;
  const line = dlg.lines[dlg.idx].text;
  dlg.timer += dt;
  const total = line.length;
  if (dlg.chars < total) { dlg.chars = Math.min(total, Math.floor(dlg.timer * 45)); }
  if (Input.aHit) {
    if (dlg.chars < total) { dlg.chars = total; dlg.timer = total / 45; }
    else if (dlg.choice && dlg.idx === dlg.lines.length - 1) { endDlg(0); }
    else if (dlg.idx < dlg.lines.length - 1) { dlg.idx++; dlg.chars = 0; dlg.timer = 0; }
    else endDlg(0);
  } else if (Input.bHit && dlg.choice && dlg.idx === dlg.lines.length - 1 && dlg.chars >= total) {
    endDlg(1);
  }
}
function endDlg(which) {
  const cb = dlg.cb; dlg = null; if (mode === 'dialogue') mode = 'overworld';
  if (cb) cb(which);
}
function drawBox(y, h) {
  ctx.fillStyle = '#20242a'; ctx.fillRect(2, y, VW - 4, h);
  ctx.fillStyle = '#f8f8f8'; ctx.fillRect(4, y + 2, VW - 8, h - 4);
  ctx.fillStyle = '#dfe9f5'; ctx.fillRect(4, y + 2, VW - 8, 1); // a breath of shadow under the top edge
  ctx.fillStyle = '#20242a'; // corner rivets
  ctx.fillRect(6, y + 4, 1, 1); ctx.fillRect(VW - 7, y + 4, 1, 1);
  ctx.fillRect(6, y + h - 5, 1, 1); ctx.fillRect(VW - 7, y + h - 5, 1, 1);
}
function drawPanel(x, y, w, h) { // the house panel: dark frame, gold trim, paper face
  ctx.fillStyle = '#20242a'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = '#f8f8f8'; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
}
function drawDlg() {
  drawBox(102, 40);
  const cur = dlg.lines[dlg.idx];
  const line = cur.text;
  if (cur.name) { // speaker name tag straddling the box's top edge, in their colour
    const w = textW(cur.name, 1) + 6;
    ctx.fillStyle = '#20242a'; ctx.fillRect(8, 97, w, 10);
    ctx.fillStyle = cur.name === 'CONSTANCE' ? '#7fd1c8' : '#ffd94a'; ctx.fillRect(9, 98, w - 2, 8);
    drawText(cur.name, 11, 100, '#20242a', 1);
  }
  const wrapped = wrapText(line.slice(0, dlg.chars), 36);
  wrapped.slice(0, 4).forEach((l, i) => drawText(l, 8, 107 + i * 8, '#20242a', 1));
  if (dlg.chars >= line.length) {
    if (dlg.choice && dlg.idx === dlg.lines.length - 1) drawText('A:' + dlg.choice[0] + '  B:' + dlg.choice[1], 8, 135, '#b03030', 1);
    else if (Math.floor(perfNow * 2) % 2 === 0) drawText('▼', 148, 133, '#20242a', 1);
  }
}

/* ============================== OVERWORLD ============================== */
const DEER_POS = { x: 18, y: 8 };
const MORNING_LINES = [
  'A NEW DAY. THE POTS ARE RIGHT WHERE YOU LEFT THEM. THAT IS THE DEAL.',
  'FRANK WAS UP BEFORE THE SUN. THE POTS HAVE ALREADY HEARD THE SPEECH.',
  'THE YARD IS QUIET. SOMEWHERE, A SEED IS MAKING UP ITS MIND.',
  'ALVIN DID HIS ROUNDS BEFORE YOU WERE EVEN AWAKE.',
];
const MORNING_FORE = [
  'ALVIN STARED AT THE FENCE A LONG TIME THIS MORNING.',
  'TRACKS BY THE FENCE AGAIN. THE NEIGHBORHOOD DEER FEAR NOTHING AND NO ONE.',
  'ALVIN STARED AT THE FENCE A LONG TIME THIS MORNING.',
];
const CONSTANCE_LINES = [
  'CONSTANCE: SIX POTS AND NO FIELD. WE HAVE DONE MORE WITH LESS, LOVE.',
  'CONSTANCE: THE FRIDGE SEEDS ARE NAPPING. FRANK TUCKED THEM IN. TUCKED. THEM. IN.',
  'CONSTANCE: HE TALKS TO THE POTS EVERY MORNING. THE POTS, TO THEIR CREDIT, LISTEN BEAUTIFULLY.',
  'CONSTANCE: THERE ARE WHOLE BOOKS ON GROWING THESE, FRANK. HE PREFERS TO LEARN WITH HIS HANDS.',
  'CONSTANCE: A GARDEN IS A GLORIOUS THING, AND IT IS WORK. I KEEP TELLING HIM. HE KEEPS SMILING.',
];
function objective() {
  const s = G.save;
  if (s.tutorial === 1) return 'THE GRAND PLAN: SIX POTS, SIX PROMISES (A)';
  if (s.tutorial === 2) return 'A DRINK FOR EACH POT: A AT A POT';
  if (s.chapterDone) return 'FREE TENDING. BERRYHILL COMES LATER.';
  if (s.deerPresent && !s.deerBeaten) return 'A DEER IS IN THE YARD! FACE IT, PRESS A';
  if (!anyStageAtLeast(3)) return 'WATER THE POTS DAILY. REST AT THE DOOR.';
  if (!s.deerBeaten) return 'FACE THE DEER TO FINISH THE CHAPTER';
  return 'WATER THE POTS DAILY. REST AT THE DOOR.';
}
function frontTile(e) {
  const d = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[e.dir];
  return { x: e.tx + d[0], y: e.ty + d[1] };
}
function entityBlocked(x, y, self) {
  if (isSolid(x, y)) return true;
  if (self !== player && x === player.tx && y === player.ty) return true;
  if (self !== alvin && x === alvin.tx && y === alvin.ty) return true;
  if (x === constance.tx && y === constance.ty) return true;
  if (G.save.deerPresent && !G.save.deerBeaten && x === DEER_POS.x && y === DEER_POS.y) return true;
  return false;
}
function stepEntity(e, dx, dy, dt) {
  if (!e.moving) {
    if ((dx || dy) && !entityBlocked(e.tx + dx, e.ty + dy, e)) {
      e.moving = true; e.mx = dx; e.my = dy; e.mt = 0; e.dir = faceName(dx, dy);
    } else if (dx || dy) e.dir = faceName(dx, dy);
  }
  if (e.moving) {
    e.mt += dt / STEP_T;
    const t = Math.min(1, e.mt);
    e.px = (e.tx + e.mx * t) * TILE; e.py = (e.ty + e.my * t) * TILE;
    if (t >= 1) { e.tx += e.mx; e.ty += e.my; e.moving = false; e.px = e.tx * TILE; e.py = e.ty * TILE; return true; }
  }
  return false;
}
/* Daniel (Nov 26): "let the user displace Alvin automatically so he doesn't
   block." When Frank steps into the tile Alvin is standing on, Alvin hops
   aside in the same instant: to a side tile when one is walkable (never the
   tile ahead of Frank — he'd only be pushed again), and if he is boxed in,
   as in a 1-wide column, he and Frank simply swap tiles. He can only land
   where he could legally walk — the same solidity test as movement — and
   never on Constance or the deer. No input, no pause: Frank's step proceeds. */
function displaceAlvin(fdx, fdy) {
  const ox = alvin.tx, oy = alvin.ty;
  const sides = [[ox - fdy, oy - fdx], [ox + fdy, oy + fdx]];
  for (const [x, y] of sides) {
    if (isSolid(x, y)) continue;
    if (x === constance.tx && y === constance.ty) continue;
    if (G.save.deerPresent && !G.save.deerBeaten && x === DEER_POS.x && y === DEER_POS.y) continue;
    alvin.tx = x; alvin.ty = y; alvin.dir = faceName(x - ox, y - oy);
    syncPixels(alvin);
    return;
  }
  // boxed in: swap with Frank — he is leaving that tile this very step
  alvin.tx = player.tx; alvin.ty = player.ty; alvin.dir = faceName(-fdx, -fdy);
  syncPixels(alvin);
}
function stepPlayer(dx, dy, dt) {
  if (!player.moving && !alvin.moving && (dx || dy) &&
      player.tx + dx === alvin.tx && player.ty + dy === alvin.ty) {
    displaceAlvin(dx, dy);
  }
  return stepEntity(player, dx, dy, dt);
}
let alvinTarget = null;
let playerIdleT = 0; // how long Frank has stood still (drives Alvin's sit)
let diagX = true; // diagonal stick input alternates axes per step (staircase)
function overworldUpdate(dt) {
  if (fade > 0) { fade -= dt * 2; if (fade < 0) fade = 0; }
  // Constance idles between watching the yard and checking on the pots
  constance.dir = (perfNow % 9 < 6.5) ? 'left' : 'down';
  const dx0 = Input.dir.x, dy0 = Input.dir.y;
  playerIdleT = (!player.moving && !dx0 && !dy0) ? playerIdleT + dt : 0;
  alvin.sit = playerIdleT > 3.5 && !alvin.moving &&
    Math.abs(alvin.tx - player.tx) + Math.abs(alvin.ty - player.ty) <= 3;
  let dx = dx0, dy = dy0;
  if (dx && dy) { if (diagX) dy = 0; else dx = 0; } // tile grid is 4-way: one axis per step
  const wasMoving = player.moving;
  let stepped = stepPlayer(dx, dy, dt);
  if (!stepped && !player.moving && dx0 && dy0) {
    stepped = stepPlayer(dx0 - dx, dy0 - dy, dt); // preferred axis blocked: try the other
  }
  if (stepped) {
    player.stepAlt = !player.stepAlt;
    if (dx0 && dy0) diagX = !diagX;
    alvinTarget = { x: player.tx - lastStep.dx, y: player.ty - lastStep.dy }; // tile the player just left
  }
  if (!wasMoving && player.moving) lastStep = { dx: player.mx, dy: player.my };
  // Alvin follows toward the tile the player vacated
  if (!alvin.moving && alvinTarget) {
    const ddx = alvinTarget.x - alvin.tx, ddy = alvinTarget.y - alvin.ty;
    if (ddx || ddy) {
      let mx = 0, my = 0;
      if (Math.abs(ddx) >= Math.abs(ddy) && ddx) mx = Math.sign(ddx); else if (ddy) my = Math.sign(ddy);
      if ((mx || my) && entityBlocked(alvin.tx + mx, alvin.ty + my, alvin)) {
        if (mx && ddy) { mx = 0; my = Math.sign(ddy); } else if (my && ddx) { my = 0; mx = Math.sign(ddx); } else { mx = 0; my = 0; }
      }
      if ((mx || my) && !entityBlocked(alvin.tx + mx, alvin.ty + my, alvin)) {
        alvin.moving = true; alvin.mx = mx; alvin.my = my; alvin.mt = 0; alvin.dir = faceName(mx, my);
      } else if (Math.abs(player.tx - alvin.tx) + Math.abs(player.ty - alvin.ty) > 6) {
        alvin.tx = player.tx; alvin.ty = player.ty + 1;
        if (entityBlocked(alvin.tx, alvin.ty, alvin)) { alvin.tx = player.tx; alvin.ty = player.ty; }
        syncPixels(alvin);
      }
    }
  }
  if (alvin.moving) {
    alvin.mt += dt / STEP_T; const t = Math.min(1, alvin.mt);
    alvin.px = (alvin.tx + alvin.mx * t) * TILE; alvin.py = (alvin.ty + alvin.my * t) * TILE;
    if (t >= 1) { alvin.tx += alvin.mx; alvin.ty += alvin.my; alvin.moving = false; syncPixels(alvin); }
  }
  if (Input.aHit && !player.moving) interact();
  if (Input.startHit) { mode = 'menu'; menuSel = 0; }
  // DRAWING DISCIPLINE: the camera is INTEGER-SNAPPED, always. A fractional
  // camera draws every tile at a fractional offset, and GPU rasterisers
  // blend the tiles' edge columns into the black clear colour — dark seams
  // across the yard that appear only while moving (Daniel's "weird black
  // lines", Nov 26). With an integer camera every tile, prop and shadow
  // lands on whole pixels and no seam can form on any rasteriser.
  camX = Math.round(Math.max(0, Math.min(MAP_W * TILE - VW, player.px + 8 - VW / 2)));
  camY = Math.round(Math.max(0, Math.min(MAP_H * TILE - VH, player.py + 8 - VH / 2)));
}
let lastStep = { dx: 0, dy: 1 };
let menuSel = 0;

function potIndexAt(x, y) { return (y === 10 && x >= 9 && x <= 14) ? x - 9 : -1; }
function interact() {
  const f = frontTile(player), s = G.save;
  const pi = potIndexAt(f.x, f.y);
  if (pi >= 0) return potInteract(pi);
  if (f.x === 11 && f.y === 3) { // house door
    return say('REST UNTIL MORNING?', which => { if (which === 0) restDay(); }, ['REST', 'NOT YET']);
  }
  if (f.x === 11 && f.y === 4) { // Frank's garden journal sits on the porch
    return openRegister();
  }
  if (f.x === constance.tx && f.y === constance.ty) {
    constance.dir = ({ up: 'down', down: 'up', left: 'right', right: 'left' })[player.dir];
    const line = CONSTANCE_LINES[s.constanceLine % CONSTANCE_LINES.length]; s.constanceLine++;
    return say(line);
  }
  if (s.deerPresent && !s.deerBeaten && f.x === DEER_POS.x && f.y === DEER_POS.y) {
    if (strongestPot() < 0) return say('ALVIN IS READY TO DEFEND THE GARDEN. BUT THERE IS NO SPROUT TO DEFEND. YET.');
    return say('WILD DEER APPEARED!', () => startTrial());
  }
  const fw = weedAt(f.x, f.y); // a weed in front of Frank: pull it
  if (fw) return pullWeed(fw);
  const ch = mapChar(f.x, f.y);
  if (ch === 'C') { // the compost corner: tea still brews here, and now compost becomes GOOD DIRT
    const cornerFirst = !s.cornerLineSeen;
    if (cornerFirst) s.cornerLineSeen = true;
    const conLine = 'CONSTANCE: HE CURSES THE WEEDS ON MONDAY AND FEEDS THEM TO THE POTS ON FRIDAY. THE GARDEN KEEPS ITS OWN BOOKS.';
    if (s.compost >= 3) {
      const lines = ['THE COMPOST CORNER. COMPOST: ' + s.compost + '.', 'MAKE GOOD DIRT FOR A POT? IT TAKES 3.'];
      if (cornerFirst) lines.push(conLine);
      saveGame();
      return say(lines, which => {
        if (which === 0) {
          s.compost -= 3; s.goodDirt++; saveGame();
          say('GOOD DIRT, RICH AND DARK. (+1 GOOD DIRT, NOW ' + s.goodDirt + ') FEED IT TO A WATERED POT AT THE BENCH.');
        }
      }, ['MAKE IT', 'NOT NOW']);
    }
    const lines = [];
    if (s.teaBrewedDay !== s.day && s.tea < 3) { s.tea++; s.teaBrewedDay = s.day; lines.push('YOU BREW A QUICK COMPOST TEA. (+1 TEA, NOW ' + s.tea + ')'); }
    lines.push('COMPOST: ' + s.compost + ' — 3 MAKES GOOD DIRT FOR A POT. PULL WEEDS TO GATHER MORE.');
    if (cornerFirst) lines.push(conLine);
    saveGame();
    return say(lines);
  }
  if (ch === 'G') return say('THE GATE STICKS. BEYOND IT: MOWED LAWNS AND ORDINARY LIFE.');
  if (ch === 'T') return say('TOO MUCH SHADE HERE. A FIELD NEEDS OPEN SKY, AND TIME.');
  const uw = weedAt(player.tx, player.ty); // or the weed under Frank's own boots
  if (uw) return pullWeed(uw);
}
function potInteract(pi) {
  const s = G.save, p = s.pots[pi];
  if (p.stage === 0) {
    if (s.seedsLeft <= 0) return say('NO SEEDS LEFT IN THE PACKET.');
    p.stage = 1; p.sownDay = s.day; s.seedsLeft--; dexAdd('SEED'); saveGame();
    if (s.tutorial === 1 && s.pots.every(q => q.stage >= 1)) {
      s.tutorial = 2; saveGame();
      return say([
        'PLANTED! SIX LITTLE PROMISES IN PEAT.',
        'FRANK: A FIELD NEEDS A ROLL, AND EVERY PROMISE NEEDS A NAME. I HAVE GIVEN THIS SOME THOUGHT.',
        'FRANK: ADMIRAL! CAPTAIN! GENERAL! HOPE! PATIENCE! PROFESSOR! ROLL CALL COMPLETE.',
        'CONSTANCE: HE NAMED THE SEEDS, ALVIN. ALPHABETICALLY. THERE WAS A ROSTER.',
        'NOW, A DRINK FOR EACH NEW FRIEND. PRESS A AT A POT TO WATER.',
      ]);
    }
    return say('ANOTHER SEED TUCKED INTO PEAT. SMALL AS A SECRET.');
  }
  if (!p.watered) {
    p.watered = true; saveGame();
    if (s.tutorial === 2 && s.pots.every(q => q.watered)) {
      s.tutorial = 3; saveGame();
      return say(['CONSTANCE: NOW WE WAIT. FRANK HAS ALREADY NAMED ALL SIX. IT IS DAY ONE.', 'REST AT THE HOUSE DOOR TO PASS THE DAY. WATER AGAIN TOMORROW.']);
    }
    return say(p.stage === 1 ? 'YOU WATER THE SEED. GROW WELL, LITTLE ONE. NO RUSH.' : 'YOU WATER THE ' + STAGE_NAMES[p.stage] + '. STEADY DOES IT.');
  }
  if (s.goodDirt > 0) { // a watered pot can be fed: the good dirt goes in
    return say([p.name + ' IS WATERED AND WAITING.', 'FEED ' + p.name + ' THE GOOD DIRT? (YOU HOLD ' + s.goodDirt + ')'], which => {
      if (which === 0) {
        s.goodDirt--; p.dirt = true; p.dirtCredit = (p.dirtCredit || 0) + 1; p.vigor += 8; saveGame();
        say('GOOD DIRT FOR ' + p.name + '. +8 VIGOR, AND THE NEXT STAGE COMES A DAY SOONER.');
      }
    }, ['FEED IT', 'NOT NOW']);
  }
  return say('ALREADY WATERED TODAY. WAITING IS MOST OF THE WORK.');
}
function restDay() {
  fading = 'dawn'; fade = 1;
  setTimeout(() => { dawn(); }, 350);
}
function dawn() {
  const s = G.save; s.day++;
  const wateredYesterday = s.pots.some(p => p.watered); // weeds love a watered yard
  let sprouted = false, seedled = false;
  for (const p of s.pots) {
    if (p.watered) { p.wateredDays++; p.tended++; p.watered = false; }
    // good dirt banks growth credit: each credit counts as one extra
    // watered day toward the next stage, and only the credits the stage
    // change actually needs are spent — the rest stay banked.
    const credit = p.dirtCredit || 0;
    if (p.stage === 1 && p.wateredDays + credit >= 2) { p.dirtCredit = Math.max(0, credit - (2 - p.wateredDays)); p.stage = 2; p.wateredDays = 0; p.sproutedDay = s.day; sprouted = true; dexAdd('SPROUT'); }
    else if (p.stage === 2 && p.wateredDays + credit >= 3) { p.dirtCredit = Math.max(0, credit - (3 - p.wateredDays)); p.stage = 3; p.wateredDays = 0; p.seedlingDay = s.day; seedled = true; dexAdd('SEEDLING'); }
    p.vigor = MAX_VIGOR[p.stage] || 0;
  }
  spawnWeeds(wateredYesterday ? 3 : 2);
  if (sprouted && !s.deerBeaten && !s.deerPresent) s.deerPresent = true;
  saveGame();
  fading = null;
  if (checkChapter()) return;
  let line;
  if (sprouted && s.deerPresent && !s.deerBeaten) line = 'SOMETHING SPROUTED! BUT ALVIN IS BARKING AT THE FENCE... A DEER IS IN THE YARD!';
  else if (sprouted) line = 'TWO SMALL LEAVES IN THE NIGHT! COME AND SEE!';
  else if (seedled) line = 'A SPROUT BECAME A SEEDLING OVERNIGHT. LEAVES AND EVERYTHING.';
  else if (s.day >= 2 && !s.deerBeaten) line = MORNING_FORE[Math.floor(Math.random() * MORNING_FORE.length)];
  else line = MORNING_LINES[Math.floor(Math.random() * MORNING_LINES.length)];
  say(['DAY ' + s.day + '.', line]);
}
function checkChapter() {
  const s = G.save;
  if (!s.chapterDone && s.deerBeaten && anyStageAtLeast(3)) {
    s.chapterDone = true; saveGame(); mode = 'card'; cardSel = 0; return true;
  }
  return false;
}
let cardSel = 0;

/* ============================== WEEDS -> COMPOST -> GOOD DIRT ============================== */
/* The yard's second loop (Daniel, Nov 26): weeds creep in at dawn, Frank
   pulls them for compost, and three compost makes one GOOD DIRT for a
   chosen pot. Weeds are pure opportunity — decor layer, non-solid,
   never harmful: they cannot block a step or hurt a plant. */
const WEED_CAP = 6;
const WEED_TILES = new Set(['g', 'u']); // open grass only — never paths, the bench, the garden plot, flower beds, or the house apron (rows above 5)
function weedAt(x, y) { return (G.save.weeds || []).find(w => w.x === x && w.y === y) || null; }
function spawnWeeds(count) {
  const s = G.save;
  if (!Array.isArray(s.weeds)) s.weeds = [];
  const taken = new Set(s.weeds.map(w => w.x + ',' + w.y));
  const blocked = new Set([player.tx + ',' + player.ty, alvin.tx + ',' + alvin.ty, constance.tx + ',' + constance.ty]);
  if (s.deerPresent && !s.deerBeaten) blocked.add(DEER_POS.x + ',' + DEER_POS.y);
  const spots = [];
  for (let y = 5; y < MAP_H; y++) for (let x = 1; x < MAP_W - 1; x++) {
    if (!WEED_TILES.has(mapChar(x, y))) continue;
    const k = x + ',' + y;
    if (taken.has(k) || blocked.has(k)) continue;
    spots.push({ x, y });
  }
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = spots[i]; spots[i] = spots[j]; spots[j] = t; }
  while (count > 0 && s.weeds.length < WEED_CAP && spots.length) {
    const sp = spots.pop();
    s.weeds.push({ x: sp.x, y: sp.y, deep: Math.random() < 0.2 }); // about 1 in 5 is deep-rooted
    count--;
  }
}
/* Pull feedback: the tuft arcs away and a "+N COMPOST" note floats up.
   Both are timed off perfNow at draw time, so they need no update loop. */
let floaters = []; // {x, y, text, t0} in world pixels
let tosses = [];   // {x, y, deep, t0} in tiles
function pullWeed(w) {
  const s = G.save;
  s.weeds = s.weeds.filter(q => q !== w);
  const gain = w.deep ? 2 : 1;
  s.compost += gain;
  floaters.push({ x: w.x * TILE + 8, y: w.y * TILE + 4, text: '+' + gain + ' COMPOST', t0: perfNow });
  tosses.push({ x: w.x, y: w.y, deep: w.deep, t0: perfNow });
  saveGame();
  if (!s.weedLineSeen) {
    s.weedLineSeen = true; saveGame();
    say('FRANK: AH, A WEED! THE GARDEN\'S LITTLE TAX. INTO THE COMPOST WITH YOU — NOTHING IN THIS YARD IS WASTED.');
  }
}

/* intro: original dialogue only */
function startIntro() {
  player.tx = 11; player.ty = 6; player.dir = 'left'; syncPixels(player);
  alvin.tx = 10; alvin.ty = 7; syncPixels(alvin);
  constance.tx = 12; constance.ty = 6; constance.dir = 'left';
  say([
    'CONSTANCE: YOUR SEEDS CAME, FRANK. SMALLER THAN I EXPECTED. SMALLER THAN SESAME SEEDS.',
    'FRANK: SMALLER THAN A SNEEZE, LOVE. ONE GOOD SNEEZE AND THE WHOLE FIELD IS GONE.',
    'FRANK: HALF OF THEM GO IN THE FRIDGE, TO SLEEP THROUGH A LITTLE WINTER AND WAKE UP READY.',
    'CONSTANCE: AND THE OTHER HALF?',
    'FRANK: PEAT POTS. TODAY. THE PACKET AND I HAVE OUR DIFFERENCES, SO WE HEDGE OUR BETS.',
    'CONSTANCE: SIX POTS, THEN. I WILL PRETEND THIS IS A NORMAL SIZE FOR A DREAM.',
    'FRANK: IT IS NOT THE SIZE OF THE START, LOVE. IT IS THAT WE START. THE FIELD WILL FIND US.',
    'ALVIN WAGS HIS WHOLE BACK HALF. HE HAS APPOINTED HIMSELF SUPERVISOR.',
    'WALK WITH THE ARROWS. PRESS A AT A PEAT POT TO PLANT A SEED.',
  ], () => { G.save.tutorial = 1; saveGame(); });
}

/* ============================== TRIAL: WILD DEER ============================== */
/* Alvin is the only actor on the player's side: his HP is the defended
   garden's old Vigor value, and the moves map 1:1 from the old plant slots
   (LUNGE = the GROW slot's 6, as Pressure damage; GUARD = WATER's shield;
   DIG IN = MULCH's armor; BARK unchanged). The pots are scenery he defends:
   lose, and the deer gets past him and nibbles the strongest sprout back. */
let trial = null;
const MOVES = ['LUNGE', 'GUARD', 'DIG IN', 'BARK'];
function startTrial() {
  const pi = strongestPot();
  if (pi < 0) return;
  const p = G.save.pots[pi];
  trial = {
    pot: pi, pressure: 30, phase: 'intro', msg: 'ALVIN LEAPS IN FRONT OF THE BENCH, BARKING!', timer: 0,
    menu: 0, moveSel: 0, shield: false, armor: false, over: false, result: null,
    vigor: MAX_VIGOR[p.stage], maxVigor: MAX_VIGOR[p.stage], anim: null,
  };
  mode = 'trial';
}
function trialSetMsg(m, phase) { trial.msg = m; trial.phase = phase || 'wait'; trial.timer = 0; }
function trialUpdate(dt) {
  const t = trial;
  t.timer += dt;
  if (t.phase === 'intro' && t.timer > 1.1) { t.phase = 'menu'; t.menu = 0; t.sel = 0; }
  else if (t.phase === 'wait' && t.timer > 1.15) {
    if (t.over) return endTrial();
    if (t.foeTurn) { t.foeTurn = false; deerAct(); }
    else { t.phase = 'menu'; t.menu = 0; t.sel = 0; t.anim = null; }
  }
  if (t.phase === 'menu' || t.phase === 'moves' || t.phase === 'plants' || t.phase === 'bag') {
    if (Input.bHit && t.phase !== 'menu') { t.phase = 'menu'; t.sel = 0; return; }
    const n = (t.phase === 'menu' || t.phase === 'moves') ? 4 : 1; // PLANTS is a peek, BAG has one item
    if (Input.dir.y < 0 || Input.dir.x < 0) { /* handled on hit below */ }
    if (menuNavHit('up')) t.sel = (t.sel || 0) - (t.phase === 'menu' || t.phase === 'moves' ? 2 : 1);
    if (menuNavHit('down')) t.sel = (t.sel || 0) + (t.phase === 'menu' || t.phase === 'moves' ? 2 : 1);
    if (menuNavHit('left')) t.sel = (t.sel || 0) - 1;
    if (menuNavHit('right')) t.sel = (t.sel || 0) + 1;
    if (t.sel === undefined) t.sel = 0;
    t.sel = ((t.sel % n) + n) % n;
    if (Input.aHit) trialChoose();
  }
}
let navPrev = { x: 0, y: 0 };
function menuNavHit(which) {
  const d = Input.dir; let hit = false;
  if (which === 'up') hit = d.y < 0 && navPrev.y >= 0;
  if (which === 'down') hit = d.y > 0 && navPrev.y <= 0;
  if (which === 'left') hit = d.x < 0 && navPrev.x >= 0;
  if (which === 'right') hit = d.x > 0 && navPrev.x <= 0;
  return hit;
}
function trialChoose() {
  const t = trial, s = G.save;
  if (t.phase === 'menu') {
    if (t.sel === 0) { t.phase = 'moves'; t.sel = 0; }
    else if (t.sel === 1) { t.phase = 'plants'; t.sel = 0; }
    else if (t.sel === 2) { t.phase = 'bag'; t.sel = 0; }
    else { trialSetMsg('YOU BACK AWAY SLOWLY. THE DEER WINS THIS ROUND OF STARING.'); t.over = true; t.result = 'flee'; }
    return;
  }
  if (t.phase === 'plants') { t.phase = 'menu'; t.sel = 0; return; } // a peek costs no turn
  if (t.phase === 'bag') {
    if (s.tea > 0) {
      s.tea--; t.vigor = Math.min(t.maxVigor, t.vigor + 10);
      trialSetMsg('USED COMPOST TEA! ALVIN LAPS IT UP, RESTORED.'); t.foeTurn = true;
    } else trialSetMsg('NO TEA LEFT! (BREW MORE AT THE COMPOST.)');
    return;
  }
  // moves — all Alvin's, numbers mapped 1:1 from the old plant slots
  const mv = MOVES[t.sel];
  if (mv === 'LUNGE') {
    t.anim = 'lunge';
    t.pressure = Math.max(0, t.pressure - 6);
    if (t.pressure <= 0) { trialSetMsg('ALVIN LUNGES! THE DEER BOLTS OVER THE FENCE!'); t.over = true; t.result = 'win'; saveGame(); return; }
    trialSetMsg('ALVIN LUNGES! THE DEER STAGGERS BACK.');
  }
  else if (mv === 'GUARD') { t.shield = true; trialSetMsg('ALVIN PLANTS HIS PAWS. HE WILL TAKE THE NEXT HIT HIMSELF.'); }
  else if (mv === 'DIG IN') { t.armor = true; trialSetMsg('ALVIN DIGS IN. NO DEER PUSHES PAST HIM EASILY.'); }
  else if (mv === 'BARK') {
    t.anim = 'bark';
    t.pressure = Math.max(0, t.pressure - 8);
    if (t.pressure <= 0) { trialSetMsg('ALVIN BARKS HIS BRAVE HEART OUT! THE DEER BOUNDED AWAY!'); t.over = true; t.result = 'win'; saveGame(); return; }
    if (Math.random() < 0.3) { trialSetMsg('ALVIN USED BARK! THE DEER FLINCHED!'); saveGame(); return; } // foe loses turn
    trialSetMsg('ALVIN USED BARK! THE DEER STAMPS, UNIMPRESSED BUT RATTLED.');
  }
  t.foeTurn = true;
}
function deerAct() {
  const t = trial;
  const r = Math.random();
  let dmg, name;
  if (r < 0.5) { dmg = 7; name = 'NIBBLE'; }
  else if (r < 0.8) { dmg = 4; name = 'STOMP'; }
  else { dmg = 2; name = 'STARE'; }
  if (t.armor) dmg = Math.max(1, dmg - 2);
  if (t.shield) { dmg = Math.floor(dmg / 2); t.shield = false; }
  t.vigor = Math.max(0, t.vigor - dmg);
  if (name === 'STARE') trialSetMsg('DEER USED STARE. IT IS NOT AFRAID OF YOU. IT IS NOT AFRAID OF ANYONE. (-' + dmg + ')');
  else trialSetMsg('DEER USED ' + name + '! IT GETS AT ALVIN. (-' + dmg + ')');
  if (t.vigor <= 0) { t.over = true; t.result = 'lose'; }
  t.foeTurn = false;
}
function endTrial() {
  const t = trial, s = G.save; trial = null; mode = 'overworld';
  if (t.result === 'win') {
    s.deerBeaten = true; s.deerPresent = false; saveGame();
    say('THE YARD IS SAFE. ALVIN TAKES A SMALL, PROUD BOW. THE SPROUTS STAND TALL. WELL. TALL-ISH.', () => { checkChapter(); });
  } else if (t.result === 'lose') {
    const p = s.pots[t.pot];
    if (p.stage > 1) { p.stage--; if (p.stage < 3) p.seedlingDay = null; if (p.stage < 2) p.sproutedDay = null; }
    p.wateredDays = 0; p.vigor = MAX_VIGOR[p.stage] || 0;
    saveGame();
    say('THE DEER GOT PAST ALVIN AND MOWED THE SPROUT DOWN. IT WILL GROW BACK. SO WILL YOU.', () => { fading = 'dawn'; fade = 1; setTimeout(dawn, 350); });
  }
}
function trialSnapshot() {
  if (!trial) return null;
  const p = G.save.pots[trial.pot];
  return { actor: 'ALVIN', pressure: trial.pressure, vigor: trial.vigor, maxVigor: trial.maxVigor, pot: trial.pot, stage: p.stage, phase: trial.phase, over: trial.over, result: trial.result, msg: trial.msg, plants: G.save.pots.map(q => q.name + ':' + q.stage) };
}

/* ============================== RENDER: TITLE / CHAPTERS ============================== */
let titleConfirm = false;
function hasSaveFile() { return !!loadSave(); }
function titleLabels() { return hasSaveFile() ? ['NEW GAME', 'CONTINUE', 'CHAPTERS', 'CONTROLS'] : ['NEW GAME', 'CHAPTERS', 'CONTROLS']; }
function titleUpdate() {
  const items = titleLabels().length;
  if (titleConfirm) {
    if (Input.aHit) { titleConfirm = false; startNewGame(); }
    if (Input.bHit) titleConfirm = false;
    return;
  }
  if (menuNavHit('up')) titleSel = (titleSel + items - 1) % items;
  if (menuNavHit('down')) titleSel = (titleSel + 1) % items;
  if (Input.aHit) {
    const pick = titleLabels()[titleSel];
    if (pick === 'NEW GAME') { if (hasSaveFile()) titleConfirm = true; else startNewGame(); }
    else if (pick === 'CONTINUE') continueGame();
    else if (pick === 'CHAPTERS') { mode = 'chapters'; }
    else if (pick === 'CONTROLS') openControls('title');
  }
}
function startNewGame() {
  G.save = newSave(); titleSel = 0;
  player.tx = 11; player.ty = 6; syncPixels(player);
  alvin.tx = 10; alvin.ty = 7; syncPixels(alvin);
  mode = 'overworld'; startIntro();
}
function continueGame() {
  const s = loadSave(); if (!s) return;
  G.save = s;
  player.tx = s.player.x; player.ty = s.player.y; player.dir = s.player.dir || 'down'; syncPixels(player);
  alvin.tx = s.player.x; alvin.ty = Math.min(MAP_H - 1, s.player.y + 1); syncPixels(alvin);
  constance.tx = 13; constance.ty = 5;
  mode = 'overworld';
  toast('WELCOME BACK. DAY ' + s.day);
}
function drawSceneBanner(y0, seedling) {
  ctx.fillStyle = '#7ec8f7'; ctx.fillRect(0, y0, VW, 30);
  ctx.fillStyle = '#a8dcff'; ctx.fillRect(0, y0 + 30, VW, 8);
  // clouds
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(52, y0 + 5, 20, 4); ctx.fillRect(56, y0 + 3, 11, 2); ctx.fillRect(104, y0 + 10, 15, 3);
  ctx.fillStyle = '#dfe9f5'; ctx.fillRect(52, y0 + 9, 20, 1); ctx.fillRect(104, y0 + 13, 15, 1);
  // sun (top-centre, clear of the tree)
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(76, y0 + 2, 12, 12);
  ctx.fillStyle = '#ffec9e'; ctx.fillRect(79, y0 + 5, 6, 6);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(81, y0, 2, 2); ctx.fillRect(81, y0 + 14, 2, 2); ctx.fillRect(72, y0 + 7, 2, 2); ctx.fillRect(90, y0 + 7, 2, 2);
  // the little blue house, left — with a chimney and its first smoke
  ctx.fillStyle = '#b0552f'; ctx.fillRect(36, y0 + 2, 5, 7);
  ctx.fillStyle = '#e8edf2'; ctx.fillRect(42, y0 + 1, 3, 2); ctx.fillRect(46, y0 + 2, 2, 2);
  ctx.fillStyle = '#2f56b8'; ctx.fillRect(4, y0 + 12, 40, 4); ctx.fillRect(8, y0 + 8, 32, 4); ctx.fillRect(14, y0 + 4, 20, 4);
  ctx.fillStyle = '#7fb2e8'; ctx.fillRect(7, y0 + 16, 34, 22);
  ctx.fillStyle = '#5b93d6'; ctx.fillRect(7, y0 + 21, 34, 1); ctx.fillRect(7, y0 + 27, 34, 1); ctx.fillRect(7, y0 + 33, 34, 1);
  ctx.fillStyle = '#f4f4f0'; ctx.fillRect(11, y0 + 20, 7, 7); ctx.fillRect(30, y0 + 20, 7, 7);
  ctx.fillStyle = '#ffe9a8'; ctx.fillRect(12, y0 + 21, 5, 5); ctx.fillRect(31, y0 + 21, 5, 5);
  ctx.fillStyle = '#8a5a2e'; ctx.fillRect(20, y0 + 26, 8, 12);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(26, y0 + 31, 1, 1);
  // a tree, right — a rounder, two-blob canopy with lit patches
  ctx.fillStyle = '#7a4a21'; ctx.fillRect(130, y0 + 26, 4, 12);
  ctx.fillStyle = '#2f9e44'; ctx.fillRect(120, y0 + 13, 24, 12); ctx.fillRect(124, y0 + 8, 16, 6); ctx.fillRect(117, y0 + 17, 5, 6); ctx.fillRect(142, y0 + 17, 5, 6);
  ctx.fillStyle = '#54c95e'; ctx.fillRect(124, y0 + 11, 7, 4); ctx.fillRect(133, y0 + 16, 7, 5); ctx.fillRect(121, y0 + 19, 5, 3);
  ctx.fillStyle = '#7ed957'; ctx.fillRect(126, y0 + 10, 3, 2); ctx.fillRect(136, y0 + 15, 3, 2);
  // ground + picket fence line
  ctx.fillStyle = '#58b93e'; ctx.fillRect(0, y0 + 38, VW, 26);
  ctx.fillStyle = '#3f9433'; ctx.fillRect(0, y0 + 56, VW, 8);
  // the house and tree throw soft shadows onto the grass, like everything else
  ctx.fillStyle = '#2f7a24';
  ctx.fillRect(5, y0 + 38, 40, 2); ctx.fillRect(8, y0 + 40, 34, 1);
  ctx.fillRect(123, y0 + 38, 24, 2); ctx.fillRect(127, y0 + 40, 16, 1);
  // a scatter of little flowers and tufts in the banner grass
  for (const [fx, fc] of [[8, '#ff5d8f'], [52, '#ffd94a'], [66, '#ffffff'], [104, '#ff5d8f'], [148, '#ffd94a']]) {
    ctx.fillStyle = fc; ctx.fillRect(fx, y0 + 51, 2, 2);
  }
  ctx.fillStyle = '#3f9433';
  for (const tx of [22, 44, 88, 118, 138]) { ctx.fillRect(tx, y0 + 46, 1, 2); ctx.fillRect(tx + 2, y0 + 47, 1, 2); }
  ctx.fillStyle = '#f4f4f0';
  for (let x = 2; x < VW; x += 12) { ctx.fillRect(x, y0 + 34, 3, 6); }
  ctx.fillRect(0, y0 + 36, VW, 1);
  // the family out in the yard: Frank among his pots, Constance by the
  // tree with Alvin at her heel — each on a little ground shadow
  const folkShadow = (x) => { ctx.fillStyle = '#2f7a24'; ctx.fillRect(x + 2, y0 + 58, 12, 2); };
  folkShadow(47); ctx.drawImage((perfNow % 3.7) < 0.13 ? FRANK_DOWN_BLINK : FRANK_DOWN, 47, y0 + 43);
  folkShadow(118); ctx.drawImage(((perfNow + 1.9) % 3.7) < 0.13 ? CONSTANCE_DOWN_BLINK : CONSTANCE_DOWN, 118, y0 + 43);
  for (let i = 0; i < 6; i++) ctx.drawImage(seedling ? POT_SEEDLING : POT_SPROUT, 14 + i * 17, y0 + 44, 13, 13);
  folkShadow(138); ctx.drawImage(Math.floor(perfNow * 3) % 2 ? ALVIN_DOWN2 : ALVIN_DOWN, 138, y0 + 44);
}
function renderTitle() {
  ctx.fillStyle = '#274e13'; ctx.fillRect(0, 0, VW, VH);
  drawSceneBanner(0, false);
  ctx.fillStyle = '#14251a'; ctx.fillRect(14, 64, 132, 34);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(14, 64, 132, 1); ctx.fillRect(14, 97, 132, 1); ctx.fillRect(14, 64, 1, 34); ctx.fillRect(145, 64, 1, 34);
  drawText('HOPE STARTS', 80 - textW('HOPE STARTS', 2) / 2 + 1, 69, '#14251a', 2);
  drawText('HOPE STARTS', 80 - textW('HOPE STARTS', 2) / 2, 68, '#ffffff', 2);
  drawText('SMALL', 80 - textW('SMALL', 2) / 2 + 1, 83, '#7a4a21', 2);
  drawText('SMALL', 80 - textW('SMALL', 2) / 2, 82, '#ffd94a', 2);
  drawText('CHAPTER 1 · SEEDS', 80 - textW('CHAPTER 1 · SEEDS', 1) / 2, 101, '#cfe8cf', 1);
  titleLabels().forEach((l, i) => {
    const y = 107 + i * 8;
    if (i === titleSel) drawText('▶', 42, y, '#ffd94a', 1);
    drawText(l, 50, y, i === titleSel ? '#ffffff' : '#9fc79f', 1);
  });
  // a thin gold frame around the whole scene
  ctx.fillStyle = '#ffd94a';
  ctx.fillRect(0, 0, VW, 1); ctx.fillRect(0, VH - 1, VW, 1); ctx.fillRect(0, 0, 1, VH); ctx.fillRect(VW - 1, 0, 1, VH);
  // the theme song's one visible trace: a small note in the corner — dim
  // and breathing until the first touch wakes the audio, gold while it
  // plays, absent entirely when MUSIC is off
  if (settings.music) {
    const col = themePlaying ? '#ffd94a' : (Math.floor(perfNow * 1.5) % 2 ? '#8fce8f' : '#5d8a5d');
    drawText('♪', 150, 134, col, 1);
  }
  if (titleConfirm) {
    drawBox(48, 34);
    drawText('ERASE YOUR SAVE AND', 80 - textW('ERASE YOUR SAVE AND', 1) / 2, 54, '#20242a', 1);
    drawText('START OVER?', 80 - textW('START OVER?', 1) / 2, 63, '#20242a', 1);
    drawText('A: YES   B: NO', 80 - textW('A: YES   B: NO', 1) / 2, 74, '#b03030', 1);
  }
}
function renderChapters() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawText('CHAPTERS', 80 - textW('CHAPTERS', 2) / 2, 12, '#ffffff', 2);
  drawBox(30, 30); drawText('1 · SEEDS', 10, 36, '#20242a', 1);
  drawText(G.save.chapterDone ? 'COMPLETE' : (hasSaveFile() ? 'IN PROGRESS' : 'NEW'), 96, 36, '#2e8b3a', 1);
  drawText('SIX POTS. NO LAND. YET.', 10, 47, '#5a6270', 1);
  ctx.drawImage(POT_SEEDLING, 140, 36, 13, 13);
  drawBox(66, 30); drawText('2 · SPROUTS', 10, 72, '#8a919c', 1);
  ctx.globalAlpha = 0.45; ctx.drawImage(POT_SEED, 140, 72, 13, 13); ctx.globalAlpha = 1;
  drawText('COMING SOON', 96, 72, '#8a919c', 1);
  drawText('THE FIELD IS OUT THERE,', 10, 83, '#8a919c', 1);
  drawText('WAITING FOR ITS DAY.', 10, 91, '#8a919c', 1);
  drawText('B: BACK', 8, 132, '#9fc79f', 1);
}
function chaptersUpdate() { if (Input.bHit || Input.aHit) mode = 'title'; }

/* ============================== RENDER: OVERWORLD ============================== */
function drawSprite(img, x, y, flip) {
  if (flip) { ctx.save(); ctx.translate(x + img.width, y); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0); ctx.restore(); }
  else ctx.drawImage(img, x, y);
}
function charSprite(e, set) {
  const frames = e.dir === 'down' ? set.down : e.dir === 'up' ? set.up : set.side;
  // two-frame walk cycle while moving; Alvin (e.wag) also wags slowly at rest
  const anim = e.moving || e.wag;
  const rate = set === ALVIN_SET ? (e.moving ? 9 : 3) : (e.moving ? 7 : 3); // Alvin trots
  let img = anim ? frames[Math.floor(perfNow * rate) % frames.length] : frames[0];
  // idle blink: standing still, front- or side-facing, the eyes close for a
  // beat every few seconds — each character on their own phase (blinkOff)
  if (!e.moving && !e.wag) {
    const blinkImg = e.dir === 'down' ? set.blinkDown : (e.dir === 'left' || e.dir === 'right') ? set.blinkSide : null;
    if (blinkImg && (perfNow + (e.blinkOff || 0)) % 3.7 < 0.13) img = blinkImg;
  }
  // talking: while this character's dialogue line is still typing out, the
  // mouth opens and closes — the open-mouth frame swaps in on a ~7 Hz beat
  if (e.talk && !e.moving) {
    const talkImg = e.dir === 'down' ? set.talkDown : (e.dir === 'left' || e.dir === 'right') ? set.talkSide : null;
    if (talkImg && Math.floor(perfNow * 7) % 2 === 0) img = talkImg;
  }
  // Alvin sits when Frank has been standing still a while and he has
  // settled nearby — a dog waiting on his person
  if (e.sit && !e.moving && set.sitDown) {
    img = e.dir === 'down' ? set.sitDown : e.dir === 'up' ? set.sitUp : set.sitSide;
  }
  drawSprite(img, Math.round(e.px - camX), Math.round(e.py - camY), e.dir === 'left');
}
function renderOverworld() {
  camX = Math.round(Math.max(0, Math.min(MAP_W * TILE - VW, player.px + 8 - VW / 2)));
  camY = Math.round(Math.max(0, Math.min(MAP_H * TILE - VH, player.py + 8 - VH / 2)));
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
  for (let ty = y0; ty <= y0 + 9; ty++) for (let tx = x0; tx <= x0 + 10; tx++) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;
    const ch = mapChar(tx, ty), sx = tx * TILE - camX, sy = ty * TILE - camY;
    // ambient sway: flowers and grass tufts lean with a slow two-frame breeze,
    // neighbouring tiles out of phase so the yard shimmers instead of pulsing
    const sway = (Math.floor(perfNow * 1.5) + tx + ty) % 2 === 0;
    let base = TILES.grass; // plain grass tiles get a hashed variety so the lawn isn't flat
    if (ch === 'g') { const h = (tx * 31 + ty * 17) % 9; base = h === 0 ? (sway ? TILES.tuftB : TILES.tuft) : h === 4 ? TILES.grass3 : h === 6 ? TILES.grass4 : h === 7 ? TILES.grass2 : TILES.grass; }
    ctx.drawImage(base, sx, sy);
    let t = TILES[TILEMAP[ch]];
    if (ch === 'o') t = sway ? TILES.flowerB : TILES.flower;
    if (t && TILEMAP[ch] !== 'grass') ctx.drawImage(t, sx, sy);
    if (ch === 'T') {
      ctx.fillStyle = SHADOW; ctx.fillRect(sx + 2, sy + 13, 12, 2); ctx.fillRect(sx + 3, sy + 15, 10, 1); // the canopy's ground shadow
      ctx.drawImage(TREE, sx, sy);
      // now and then a leaf lets go and spirals down the canopy
      const lt = (perfNow * 0.22 + tx * 0.37 + ty * 0.11) % 1;
      if (lt < 0.7) {
        const lx = Math.round(sx + 8 + Math.sin(lt * 9 + tx) * 4), ly = Math.round(sy + 5 + lt * 10);
        ctx.fillStyle = lt < 0.35 ? '#54c95e' : '#7ed957';
        ctx.fillRect(lx, ly, 2, 1); ctx.fillRect(lx, ly + 1, 1, 1);
      }
    }
    if (ch === 'c') { // chimney smoke: three puffs rising, growing, drifting off
      for (let i = 0; i < 3; i++) {
        const ph = (perfNow * 0.45 + i / 3) % 1;
        const px = Math.round(sx + 8 + Math.sin(ph * 5 + i * 2) * 1.5 + ph * 3);
        const py = Math.round(sy - 2 - ph * 15);
        const sz = 2 + Math.floor(ph * 3);
        ctx.fillStyle = ph < 0.5 ? '#e8edf2' : '#c9ced4';
        ctx.fillRect(px, py, sz, sz);
      }
    }
    if (ch === 'b') { // birdbath: a sparkle, then a ripple, then still water
      const ph = (Math.floor(perfNow * 2) + tx * 3 + ty) % 3;
      if (ph === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx + 7, sy + 3, 1, 3); ctx.fillRect(sx + 6, sy + 4, 3, 1);
      } else if (ph === 1) {
        ctx.fillStyle = '#a8dcff';
        ctx.fillRect(sx + 5, sy + 5, 6, 1); ctx.fillRect(sx + 6, sy + 4, 4, 1);
      }
    }
  }
  // Frank's garden journal, lying open on the porch boards by the door —
  // small and flat, tucked to the side of the walkway, pencil beside it
  {
    const jx = 11 * TILE - camX + 1, jy = 4 * TILE - camY + 9;
    ctx.fillStyle = '#96682f'; ctx.fillRect(jx, jy + 4, 10, 2); // porch-board shadow under the book
    ctx.fillStyle = '#8a2f2a'; ctx.fillRect(jx, jy, 9, 5); // red-cloth cover
    ctx.fillStyle = '#f8f0d8'; ctx.fillRect(jx + 1, jy + 1, 7, 3); // the open pages
    ctx.fillStyle = '#8a919c'; ctx.fillRect(jx + 2, jy + 2, 5, 1); // a line of his handwriting
    ctx.fillStyle = '#ffd94a'; ctx.fillRect(jx + 10, jy + 3, 3, 1); ctx.fillRect(jx + 13, jy + 3, 1, 1); // the pencil
  }
  // weeds: a decor layer over the grass, under everything that walks
  for (const w of (G.save.weeds || [])) {
    const sx = w.x * TILE - camX, sy = w.y * TILE - camY;
    if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue;
    ctx.drawImage(w.deep ? WEED_DEEP : WEED_TUFT, sx, sy);
  }
  // a pulled weed arcs up and away, gone in half a second
  tosses = tosses.filter(t => perfNow - t.t0 < 0.45);
  for (const t of tosses) {
    const k = (perfNow - t.t0) / 0.45;
    const sx = t.x * TILE - camX + Math.round(k * 9), sy = t.y * TILE - camY - Math.round(Math.sin(k * Math.PI) * 9);
    if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue;
    ctx.drawImage(t.deep ? WEED_DEEP : WEED_TUFT, sx, sy);
  }
  // the bench throws a soft shadow onto the grass below it
  ctx.fillStyle = SHADOW; ctx.fillRect(9 * TILE - camX, 11 * TILE - camY, 6 * TILE, 2);
  // pots on the bench
  G.save.pots.forEach((p, i) => {
    const sx = (9 + i) * TILE - camX, sy = 10 * TILE - camY;
    ctx.fillStyle = '#8a5a30'; ctx.fillRect(sx + 3, sy + 9, 10, 2); // the pot's shadow on the bench slats
    ctx.drawImage(POT_SPRITES[p.stage], sx, sy - 2);
    if (p.dirt) { // good dirt reads as a dark, rich cap of soil in the pot
      ctx.fillStyle = '#3d2412'; ctx.fillRect(sx + 4, sy + 7, 8, 2);
      ctx.fillStyle = '#5a3a1e'; ctx.fillRect(sx + 5, sy + 7, 2, 1); ctx.fillRect(sx + 9, sy + 8, 2, 1);
    }
    if (p.watered) { // a fat droplet, still beaded on the soil, with a glint
      const bob = Math.floor(perfNow * 2) % 2;
      ctx.fillStyle = '#3b6fe0';
      ctx.fillRect(sx + 12, sy - 5 + bob, 2, 3); ctx.fillRect(sx + 13, sy - 7 + bob, 1, 2);
      ctx.fillStyle = '#a8dcff'; ctx.fillRect(sx + 12, sy - 4 + bob, 1, 1);
    }
  });
  // entities sorted by y — each stands on a soft contact shadow
  const contactShadow = (px, py) => {
    ctx.fillStyle = SHADOW;
    ctx.fillRect(Math.round(px - camX) + 5, Math.round(py - camY) + 13, 10, 2);
    ctx.fillRect(Math.round(px - camX) + 4, Math.round(py - camY) + 14, 12, 1);
  };
  // dialogue: whoever is speaking gets the talking mouth while their line types
  const spk = (mode === 'dialogue' && dlg) ? dlg.lines[dlg.idx] : null;
  const spkName = spk && dlg.chars < spk.text.length ? spk.name : null;
  player.talk = spkName === 'FRANK';
  const ents = [];
  ents.push({ y: constance.py, draw: () => { contactShadow(constance.tx * TILE, constance.ty * TILE); charSprite({ px: constance.tx * TILE, py: constance.ty * TILE, dir: constance.dir, moving: false, blinkOff: 1.9, talk: spkName === 'CONSTANCE' }, CONSTANCE_SET); } });
  if (G.save.deerPresent && !G.save.deerBeaten) ents.push({ y: DEER_POS.y * TILE, draw: () => { contactShadow(DEER_POS.x * TILE, DEER_POS.y * TILE); const bob = Math.floor(perfNow * 1.5) % 2; ctx.drawImage(DEER_SMALL, DEER_POS.x * TILE - camX, DEER_POS.y * TILE - camY + bob); } });
  ents.push({ y: alvin.py, draw: () => { contactShadow(alvin.px, alvin.py); charSprite(alvin, ALVIN_SET); } });
  ents.push({ y: player.py, draw: () => { contactShadow(player.px, player.py); charSprite(player, FRANK_SET); } });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  // two butterflies wander the flower beds (pure ambience), each with the
  // little shadow that gives its flutter height
  for (const bf of [
    { cx: 7.5, cy: 13.5, s1: 0.33, s2: 0.47, ph: 0, A: BUTTERFLY_A, B: BUTTERFLY_B },
    { cx: 17.5, cy: 12.0, s1: 0.27, s2: 0.39, ph: 2.4, A: BUTTERFLY2_A, B: BUTTERFLY2_B },
  ]) {
    const bx = Math.round((bf.cx + Math.sin(perfNow * bf.s1 + bf.ph) * 3.2) * TILE - camX);
    const by = Math.round((bf.cy + Math.cos(perfNow * bf.s2 + bf.ph) * 1.4) * TILE - camY - 8 + Math.sin(perfNow * 2.2 + bf.ph) * 2);
    if (bx > -10 && by > -10 && bx < VW && by < VH) {
      ctx.fillStyle = '#4cab36'; ctx.fillRect(bx + 1, by + 12, 5, 1);
      ctx.drawImage(Math.floor(perfNow * 6 + bf.ph) % 2 ? bf.A : bf.B, bx, by);
    }
  }
  // HUD (no persistent objective banner: it overlapped the bench/pots at the
  // bottom of the frame. The objective lives in the pause menu, and the
  // tutorial steps are taught through dialogue.)
  ctx.fillStyle = 'rgba(20,26,20,0.8)'; ctx.fillRect(2, 2, 34, 9);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(2, 10, 34, 1); // gold trim, matching the panels
  drawText('DAY ' + G.save.day, 4, 4, '#ffffff', 1);
  // compost floaters from pulled weeds: rise, hold, fade inside a second
  floaters = floaters.filter(f => perfNow - f.t0 < 1.1);
  for (const f of floaters) {
    const age = perfNow - f.t0;
    ctx.globalAlpha = age < 0.7 ? 1 : Math.max(0, 1 - (age - 0.7) / 0.4);
    drawText(f.text, f.x - camX - textW(f.text, 1) / 2, f.y - camY - Math.round(age * 9), '#ffffff', 1);
    ctx.globalAlpha = 1;
  }
}

/* ============================== RENDER: TRIAL ============================== */
function drawPatch(cx, cy, w) {
  ctx.fillStyle = '#3f9433';
  ctx.fillRect(cx - w / 2 + 4, cy, w - 8, 5); ctx.fillRect(cx - w / 2, cy + 2, w, 5); ctx.fillRect(cx - w / 2 + 6, cy + 6, w - 12, 3);
  ctx.fillStyle = '#58b93e'; ctx.fillRect(cx - w / 2 + 8, cy + 2, w - 16, 2);
}
function drawBar(x, y, w, frac, col) {
  ctx.fillStyle = '#20242a'; ctx.fillRect(x - 1, y - 1, w + 2, 5);
  ctx.fillStyle = '#f8f8f8'; ctx.fillRect(x, y, w, 3);
  ctx.fillStyle = col; ctx.fillRect(x, y, Math.max(0, Math.round(w * frac)), 3);
}
function renderTrial() {
  const t = trial;
  ctx.fillStyle = '#7ec8f7'; ctx.fillRect(0, 0, VW, 62);
  ctx.fillStyle = '#a8dcff'; ctx.fillRect(0, 56, VW, 6);
  ctx.fillStyle = '#58b93e'; ctx.fillRect(0, 62, VW, 82);
  // soft two-tone patches so the ground reads as turf, not a flat fill
  ctx.fillStyle = '#54b04a';
  for (const [px, py, pw] of [[8, 70, 26], [58, 88, 34], [118, 68, 30], [30, 96, 22], [96, 94, 26], [140, 86, 18]]) {
    ctx.fillRect(px, py, pw, 4); ctx.fillRect(px + 3, py - 2, pw - 6, 2); ctx.fillRect(px + 3, py + 4, pw - 6, 2);
  }
  ctx.fillStyle = '#4cab36'; for (let i = 0; i < 40; i++) ctx.fillRect((i * 37) % 160, 66 + (i * 23) % 34, 2, 2);
  // clouds and a low hill line on the horizon
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(14, 8, 20, 4); ctx.fillRect(18, 5, 11, 3); ctx.fillRect(120, 14, 16, 3); ctx.fillRect(123, 11, 9, 3);
  ctx.fillStyle = '#dfe9f5'; ctx.fillRect(14, 12, 20, 1); ctx.fillRect(120, 17, 16, 1);
  ctx.fillStyle = '#8fd07a';
  ctx.fillRect(0, 50, 66, 12); ctx.fillRect(8, 46, 50, 4); ctx.fillRect(18, 42, 30, 4);
  ctx.fillRect(102, 52, 58, 10); ctx.fillRect(110, 48, 42, 4); ctx.fillRect(120, 44, 24, 4);
  drawPatch(118, 52, 64);
  // ground shadows: under the deer, and under Alvin in front of the bench
  ctx.fillStyle = '#357a2a';
  ctx.fillRect(100, 55, 46, 3); ctx.fillRect(104, 54, 38, 1);
  ctx.fillRect(26, 97, 44, 3); ctx.fillRect(30, 96, 36, 1);
  // the deer idles with a slow bob, ear twitching between two frames;
  // once its Pressure runs low the white tail stays flagged (alarmed)
  const dbob = Math.floor(perfNow * 1.5) % 2;
  const deerImg = (t.pressure <= 10 || dbob) ? DEER_BIG2 : DEER_BIG;
  // a fresh hit from Alvin makes the deer flinch for a beat
  const flinch = (t.phase === 'wait' && t.timer < 0.25 && (t.anim === 'lunge' || t.anim === 'bark')) ? (Math.floor(perfNow * 20) % 2 ? 1 : -1) : 0;
  ctx.drawImage(deerImg, 86 + flinch, 5 + dbob, 64, 48);
  // what Alvin defends: the garden bench with all six pots, as scenery —
  // the yard's picket fence peeks over the bench, and the bench casts a shadow
  ctx.fillStyle = '#f4f4f0';
  for (let x = 0; x < 94; x += 8) { ctx.fillRect(x, 88, 3, 5); }
  ctx.fillRect(0, 91, 94, 1);
  ctx.fillStyle = SHADOW; ctx.fillRect(0, 106, 52, 3);
  for (let i = 0; i < 3; i++) ctx.drawImage(TILES.bench, 2 + i * 16, 92);
  G.save.pots.forEach((p, i) => ctx.drawImage(POT_SPRITES[p.stage], 4 + i * 10, 84, 10, 10));
  // Alvin, the only actor on this side — he hops forward on LUNGE, pops up on BARK
  let ax = 20, ay = 56;
  if (t.anim && t.phase === 'wait') {
    const s = Math.sin(Math.min(1, t.timer / 0.45) * Math.PI);
    if (t.anim === 'lunge') ax += Math.round(5 * s);
    else if (t.anim === 'bark') ay -= Math.round(3 * s);
  }
  const alvinImg = (t.phase === 'wait' && t.anim === 'bark') ? ALVIN_BIG_BARK
    : (t.phase === 'wait' && t.anim === 'lunge') ? ALVIN_BIG_LUNGE : ALVIN_BIG;
  ctx.drawImage(alvinImg, ax, ay, 56, 40);
  if (t.anim === 'lunge' && t.phase === 'wait' && t.timer < 0.3) { // dust kicked up at his hind paws
    ctx.fillStyle = '#c9b18a';
    ctx.fillRect(ax + 1, ay + 37, 2, 1); ctx.fillRect(ax + 5, ay + 35, 1, 1); ctx.fillRect(ax - 1, ay + 34, 1, 1);
  }
  if (alvinImg === ALVIN_BIG_BARK) { // two bark arcs off his muzzle, toward the deer
    ctx.fillStyle = '#20242a';
    ctx.fillRect(ax + 56, ay + 4, 2, 1); ctx.fillRect(ax + 57, ay + 6, 2, 1); ctx.fillRect(ax + 56, ay + 8, 2, 1);
    ctx.fillRect(ax + 60, ay + 2, 2, 1); ctx.fillRect(ax + 62, ay + 6, 2, 1); ctx.fillRect(ax + 60, ay + 9, 2, 1);
  }
  // status boxes: DEER pressure above, ALVIN's HP below — one box per side
  ctx.fillStyle = '#20242a'; ctx.fillRect(3, 5, 76, 25); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(5, 7, 72, 21);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(5, 27, 72, 1); // gold trim, as on the panels
  drawText('DEER', 8, 9, '#20242a', 1);
  drawText('PRESSURE', 8, 17, '#5a6270', 1);
  drawBar(8, 23, 62, t.pressure / 30, t.pressure > 10 ? '#37b24d' : '#e0483e');
  ctx.fillStyle = '#20242a'; ctx.fillRect(81, 66, 76, 27); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(83, 68, 72, 23);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(83, 90, 72, 1);
  drawText('ALVIN', 86, 70, '#20242a', 1);
  drawText('HP', 86, 79, '#5a6270', 1);
  drawBar(94, 80, 38, t.vigor / t.maxVigor, t.vigor > 8 ? '#37b24d' : '#e0483e');
  drawText(t.vigor + '/' + t.maxVigor, 134, 79, '#20242a', 1);
  if (t.shield) drawText('GUARD', 130, 70, '#3b6fe0', 1);
  if (t.armor) drawText('DUG IN', 126, 88, '#8a5a2e', 1);
  // text box / menus
  drawBox(102, 40);
  if (t.phase === 'menu' || t.phase === 'moves') {
    const lines = wrapText(t.phase === 'menu' ? 'WHAT WILL ALVIN DO?' : 'CHOOSE A MOVE:', 20);
    lines.slice(0, 3).forEach((l, i) => drawText(l, 7, 108 + i * 8, '#20242a', 1));
    const items = t.phase === 'menu' ? ['DEFEND', 'PLANTS', 'BAG', 'FLEE'] : MOVES;
    items.forEach((m, i) => {
      const x = 96 + (i % 2) * 32, y = 110 + Math.floor(i / 2) * 12;
      if (i === (t.sel || 0)) drawText('▶', x - 6, y, '#b03030', 1);
      drawText(m, x, y, '#20242a', 1);
    });
  } else if (t.phase === 'plants' || t.phase === 'bag') {
    if (t.phase === 'plants') {
      drawText('THE GARDEN ALVIN GUARDS:', 7, 107, '#20242a', 1);
      G.save.pots.forEach((q, i) => {
        const x = 7 + (i % 2) * 78, y = 117 + Math.floor(i / 2) * 8;
        drawText((q.name || '').slice(0, 9) + ' ' + STAGE_NAMES[q.stage], x, y, '#20242a', 1);
      });
      drawText('A/B: BACK', 10, 133, '#5a6270', 1);
    } else {
      drawText('BAG:', 7, 108, '#20242a', 1);
      if ((t.sel || 0) === 0) drawText('▶', 7, 118, '#b03030', 1);
      drawText('COMPOST TEA ×' + G.save.tea + ' (+10 HP)', 13, 118, '#20242a', 1);
      drawText('B: BACK', 13, 128, '#5a6270', 1);
    }
  } else {
    wrapText(t.msg, 36).slice(0, 4).forEach((l, i) => drawText(l, 8, 107 + i * 8, '#20242a', 1));
  }
}

/* ============================== CARD / DEX / MENU ============================== */
function cardUpdate() {
  if (Input.aHit || Input.bHit) mode = 'overworld'; // KEEP TENDING; the Audible button is the page link
}
function renderCard() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawSceneBanner(2, true);
  drawText('CHAPTER COMPLETE', 80 - textW('CHAPTER COMPLETE', 1) / 2, 70, '#cfe8cf', 1);
  ctx.fillStyle = '#ffd94a'; // two little stars, twinkling in turn
  if (Math.floor(perfNow * 2) % 2 === 0) { ctx.fillRect(24, 71, 1, 3); ctx.fillRect(23, 72, 3, 1); }
  else { ctx.fillRect(133, 71, 1, 3); ctx.fillRect(132, 72, 3, 1); }
  drawText('SEEDS', 80 - textW('SEEDS', 2) / 2, 78, '#ffd94a', 2);
  const teaser = wrapText('SIX POTS, SIX PROMISES. NO LAND YET — BUT A START.', 34);
  teaser.forEach((l, i) => drawText(l, 80 - textW(l, 1) / 2, 91 + i * 7, '#ffffff', 1));
  // the roll call: the six, named, cycling two at a time so it never crowds
  const names = G.save.pots.map(p => p.name);
  const pair = Math.floor(perfNow / 2.5) % 3;
  const roll = names[pair * 2] + ' · ' + names[pair * 2 + 1];
  const pre = 'THE SIX: ';
  const rx = 80 - (textW(pre, 1) + textW(roll, 1)) / 2;
  drawText(pre, rx, 106, '#cfe8cf', 1);
  drawText(roll, rx + textW(pre, 1), 106, '#ffd94a', 1);
  const l = 'KEEP TENDING (A)';
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(Math.round(80 - textW(l, 1) / 2 - 4), 113, textW(l, 1) + 8, 9);
  drawText(l, 80 - textW(l, 1) / 2, 115, '#20242a', 1);
  drawText('HEAR CHAPTER 1:', 80 - textW('HEAR CHAPTER 1:', 1) / 2, 126, '#cfe8cf', 1);
}
const MENU_ITEMS = ['RESUME', 'CONTROLS', 'SAVE & QUIT'];
function menuUpdate() {
  if (Input.bHit || Input.startHit) { mode = 'overworld'; return; }
  if (menuNavHit('up')) menuSel = (menuSel + MENU_ITEMS.length - 1) % MENU_ITEMS.length;
  if (menuNavHit('down')) menuSel = (menuSel + 1) % MENU_ITEMS.length;
  if (Input.aHit) {
    if (menuSel === 0) mode = 'overworld';
    else if (menuSel === 1) openControls('menu');
    else { // SAVE & QUIT: write the save out, then back to the title screen
      saveGame();
      titleSel = 0; titleConfirm = false;
      mode = 'title';
    }
  }
}
function renderMenu() {
  renderOverworld();
  ctx.fillStyle = 'rgba(10,16,10,0.55)'; ctx.fillRect(0, 0, VW, VH);
  drawPanel(24, 18, 112, 108);
  // display-only info: day, objective, Berrydex summary, tea
  drawText('DAY ' + G.save.day, 32, 26, '#20242a', 1);
  wrapText(objective(), 24).slice(0, 3).forEach((l, i) => drawText(l, 32, 36 + i * 7, '#5a6270', 1));
  const seen = G.save.dex.blueberry;
  wrapText('BERRYDEX: ' + (seen.length ? seen.join(' · ') : 'NOTHING SEEN YET'), 24).slice(0, 2).forEach((l, i) => drawText(l, 32, 59 + i * 7, '#5a6270', 1));
  drawText('TEA ×' + G.save.tea, 32, 75, '#5a6270', 1);
  MENU_ITEMS.forEach((l, i) => {
    const y = 86 + i * 12;
    if (i === menuSel) drawText('▶', 32, y, '#b03030', 1);
    drawText(l, 40, y, '#20242a', 1);
  });
}

/* ============================== CONTROLS SCREEN ============================== */
let controlsFrom = 'title', controlsSel = 0; // row 0: stick setting, row 1: music, row 2: back
const PAD_MODES = ['AUTO', 'ALWAYS', 'OFF'];
function openControls(from) { controlsFrom = from; controlsSel = 0; mode = 'controls'; }
function cycleStick(d) {
  const cur = PAD_MODES.indexOf(settings.stick.toUpperCase());
  settings.stick = PAD_MODES[(cur + d + PAD_MODES.length) % PAD_MODES.length].toLowerCase();
  saveSettings(); applyStickPref();
}
function cycleMusic() { settings.music = !settings.music; saveSettings(); }
function controlsUpdate() {
  if (Input.bHit) { mode = controlsFrom; return; }
  if (controlsFrom === 'menu' && Input.startHit) { mode = 'menu'; return; }
  if (menuNavHit('up')) controlsSel = (controlsSel + 2) % 3;
  if (menuNavHit('down')) controlsSel = (controlsSel + 1) % 3;
  if (controlsSel === 0) {
    if (menuNavHit('left')) cycleStick(-1);
    if (menuNavHit('right')) cycleStick(1);
    if (Input.aHit) cycleStick(1);
  } else if (controlsSel === 1) {
    if (menuNavHit('left') || menuNavHit('right') || Input.aHit) cycleMusic();
  } else if (Input.aHit) mode = controlsFrom;
}
function renderControls() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawPanel(4, 4, 152, 136);
  ctx.drawImage(FRANK_DOWN, 10, 7); ctx.drawImage(ALVIN_DOWN, 134, 7); // the cast presents the controls
  drawText('CONTROLS', 80 - textW('CONTROLS', 2) / 2, 10, '#20242a', 2);
  const head = (t, y) => drawText(t, 12, y, '#2e8b3a', 1);
  const row = (t, y) => drawText(t, 12, y, '#20242a', 1);
  head('KEYBOARD', 28);
  row('ARROWS OR WASD: MOVE', 37);
  row('Z OR ENTER: A · X OR ESC: B', 45);
  row('P: MENU', 53);
  head('GAMEPAD', 65);
  row('STICK OR D-PAD: MOVE', 74);
  row('A: OK · B: BACK · START: MENU', 82);
  head('TOUCH', 94);
  row('STICK MOVE · ON-SCREEN A/B', 103);
  ctx.fillStyle = '#c9ced4'; ctx.fillRect(12, 108, 136, 1);
  if (controlsSel === 0) drawText('▶', 12, 114, '#b03030', 1);
  drawText('SHOW STICK: < ' + settings.stick.toUpperCase() + ' >', 20, 114, '#20242a', 1);
  if (controlsSel === 1) drawText('▶', 12, 122, '#b03030', 1);
  drawText('MUSIC: < ' + (settings.music ? 'ON' : 'OFF') + ' >', 20, 122, '#20242a', 1);
  if (controlsSel === 2) drawText('▶', 12, 130, '#b03030', 1);
  drawText('BACK', 20, 130, '#20242a', 1);
}
/* ============================== PLANT REGISTER ============================== */
/* Frank's garden journal lives on the porch. It is a JOURNAL, not storage:
   every plant is an individual who lives on the bench, and the register
   simply remembers their lives — the Berrydex, kept by hand. Progress is
   the stages witnessed across the six lives (G.save.dex). */
let regView = 'list', regSel = 0, regCardSel = 0;
function openRegister() { regView = 'list'; regSel = 0; mode = 'register'; }
function renamePlant(i) {
  const p = G.save.pots[i];
  let v = null;
  try { v = window.prompt('A NAME FOR THIS PLANT:', p.name); } catch (e) {}
  if (v == null) return; // blank/cancel keeps the name Frank gave
  v = String(v).trim().toUpperCase().replace(/[^A-Z0-9 .,'&!?-]/g, '').slice(0, 10).trim();
  if (v) { p.name = v; saveGame(); toast('RENAMED: ' + v); }
}
function registerUpdate() {
  if (regView === 'list') {
    if (Input.bHit) { mode = 'overworld'; return; }
    if (menuNavHit('up')) regSel = (regSel + 5) % 6;
    if (menuNavHit('down')) regSel = (regSel + 1) % 6;
    if (Input.aHit) { regView = 'card'; regCardSel = 0; }
  } else {
    if (Input.bHit) { regView = 'list'; return; }
    if (menuNavHit('up') || menuNavHit('down')) regCardSel = 1 - regCardSel;
    if (Input.aHit) {
      if (regCardSel === 0) renamePlant(regSel);
      else regView = 'list';
    }
  }
}
function dayOr(day, none) { return day != null ? 'DAY ' + day : none; }
function drawPaw(x, y, col) { // Alvin has signed the journal, in his own way
  ctx.fillStyle = col;
  ctx.fillRect(x + 2, y + 4, 5, 3); ctx.fillRect(x + 3, y + 7, 3, 1);
  ctx.fillRect(x, y + 1, 2, 2); ctx.fillRect(x + 3, y, 2, 2); ctx.fillRect(x + 6, y + 1, 2, 2);
}
function renderRegister() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawPanel(4, 4, 152, 136);
  const s = G.save;
  if (regView === 'list') {
    drawText('PLANT REGISTER', 80 - textW('PLANT REGISTER', 2) / 2, 10, '#20242a', 2);
    drawText('THE BERRYDEX · KEPT BY HAND', 80 - textW('THE BERRYDEX · KEPT BY HAND', 1) / 2, 24, '#2e8b3a', 1);
    s.pots.forEach((p, i) => {
      const y = 36 + i * 15;
      if (i === regSel) { ctx.fillStyle = '#ffe9a8'; ctx.fillRect(9, y - 3, 142, 12); drawText('▶', 11, y, '#b03030', 1); }
      ctx.fillStyle = '#dfe9f5'; ctx.fillRect(12, y + 9, 136, 1); // a ruled line under each journal entry
      ctx.drawImage(POT_SPRITES[p.stage], 20, y - 4, 12, 12);
      drawText(p.name, 36, y, '#20242a', 1);
      drawText(STAGE_NAMES[p.stage], 82, y, '#5a6270', 1);
      const st = p.stage === 0 ? '-' : (p.watered ? 'WET' : 'DRY');
      drawText(st, 128, y, p.watered ? '#3b6fe0' : '#b07f2a', 1);
    });
    const seen = s.dex.blueberry;
    drawText('STAGES SEEN: ' + (seen.length ? seen.join(' · ') : 'NONE YET'), 12, 129, '#5a6270', 1);
    drawPaw(142, 124, '#b09a72');
  } else {
    const p = s.pots[regSel];
    drawText(p.name, 14, 11, '#20242a', 2);
    ctx.fillStyle = '#dfe9f5'; ctx.fillRect(14, 22, 100, 1); // ruled line under the name, as in the list
    ctx.drawImage(POT_SPRITES[p.stage], 122, 8, 30, 30);
    if (p.dirt) { // the good-dirt mark: a little mound of dark soil under the portrait, noted in the journal
      ctx.fillStyle = '#3d2412'; ctx.fillRect(133, 40, 8, 2); ctx.fillRect(135, 39, 4, 1);
      ctx.fillStyle = '#5a3a1e'; ctx.fillRect(136, 40, 2, 1);
      drawText('GOOD DIRT', 118, 44, '#5a3a1e', 1);
    }
    drawText('BLUEBERRY · ' + STAGE_NAMES[p.stage], 14, 25, '#2e8b3a', 1);
    drawText('LIVES AT: THE BENCH', 14, 34, '#5a6270', 1);
    const rows = [
      'SOWN: ' + dayOr(p.sownDay, 'NOT YET'),
      'SPROUTED: ' + dayOr(p.sproutedDay, 'NOT YET'),
      'SEEDLING: ' + dayOr(p.seedlingDay, 'NOT YET'),
      'DAYS TENDED: ' + p.tended,
      'TODAY: ' + (p.stage === 0 ? '-' : (p.watered ? 'WATERED' : 'THIRSTY')),
    ];
    rows.forEach((r, i) => drawText(r, 14, 48 + i * 9, '#20242a', 1));
    const seen = s.dex.blueberry;
    wrapText('BERRYDEX: ' + (seen.length ? seen.join(' · ') + ' SEEN' : 'NOTHING SEEN YET'), 34)
      .slice(0, 2).forEach((l, i) => drawText(l, 14, 96 + i * 8, '#5a6270', 1));
    ['RENAME', 'BACK'].forEach((l, i) => {
      const y = 114 + i * 11;
      if (i === regCardSel) drawText('▶', 14, y, '#b03030', 1);
      drawText(l, 22, y, '#20242a', 1);
    });
    drawPaw(142, 124, '#b09a72');
  }
}

/* ============================== MAIN LOOP ============================== */
let perfNow = 0, lastT = 0;
const audibleBtn = document.getElementById('audibleBtn');
audibleBtn.href = AUDIBLE_URL;
const bookBtn = document.getElementById('bookBtn');
bookBtn.href = BOOK_URL;
function update(dt) {
  themeSync(); // the theme song lives on the title screen, and only there
  if (toastT > 0) toastT -= dt;
  if (fade > 0 && mode !== 'overworld') fade = Math.max(0, fade - dt * 2);
  switch (mode) {
    case 'title': titleUpdate(); break;
    case 'chapters': chaptersUpdate(); break;
    case 'overworld': overworldUpdate(dt); break;
    case 'dialogue': dlgUpdate(dt); break;
    case 'trial': trialUpdate(dt); break;
    case 'card': cardUpdate(); break;
    case 'menu': menuUpdate(); break;
    case 'register': registerUpdate(); break;
    case 'controls': controlsUpdate(); break;
  }
  audibleBtn.hidden = !(mode === 'title' || mode === 'card');
  bookBtn.hidden = mode !== 'title'; // the buy link lives on the title menu only — the card stays Audible-only
}
function render() {
  switch (mode) {
    case 'title': renderTitle(); break;
    case 'chapters': renderChapters(); break;
    case 'overworld': case 'dialogue': renderOverworld(); if (mode === 'dialogue' && dlg) drawDlg(); break;
    case 'trial': renderTrial(); break;
    case 'card': renderCard(); break;
    case 'menu': renderMenu(); break;
    case 'register': renderRegister(); break;
    case 'controls': renderControls(); break;
  }
  if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; ctx.fillRect(0, 0, VW, VH); }
  if (toastT > 0) {
    ctx.fillStyle = 'rgba(20,26,20,0.9)'; const w = textW(toastMsg, 1) + 10;
    ctx.fillRect(Math.round(80 - w / 2), 4, w, 11);
    drawText(toastMsg, 80 - textW(toastMsg, 1) / 2, 7, '#ffffff', 1);
  }
}
function frame(ts) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, lastT ? (ts - lastT) / 1000 : 0.016); lastT = ts; perfNow = ts / 1000;
  Input.poll(); update(dt); render();
  navPrev = { x: Input.dir.x, y: Input.dir.y };
}
/* keep the saved player position fresh whenever we persist */
const _saveGame = saveGame;
saveGame = function () { if (G && G.save) { G.save.player = { x: player.tx, y: player.ty, dir: player.dir }; } _saveGame(); };

G = { save: newSave() };
requestAnimationFrame(frame);

/* ============================== TEST HOOK ============================== */
window.__hss = {
  state() {
    return {
      mode, day: G.save.day, tutorial: G.save.tutorial, seedsLeft: G.save.seedsLeft, tea: G.save.tea,
      compost: G.save.compost, goodDirt: G.save.goodDirt, weeds: JSON.parse(JSON.stringify(G.save.weeds || [])),
      pots: G.save.pots.map(p => ({ name: p.name, stage: p.stage, wateredDays: p.wateredDays, watered: p.watered, vigor: p.vigor, tended: p.tended, sownDay: p.sownDay, sproutedDay: p.sproutedDay, seedlingDay: p.seedlingDay, location: p.location, dirt: p.dirt, dirtCredit: p.dirtCredit })),
      register: { view: regView, sel: regSel, cardSel: regCardSel },
      dex: JSON.parse(JSON.stringify(G.save.dex)), deerBeaten: G.save.deerBeaten, deerPresent: G.save.deerPresent,
      chapterDone: G.save.chapterDone, player: { x: player.tx, y: player.ty, dir: player.dir },
      alvin: { x: alvin.tx, y: alvin.ty }, trial: trialSnapshot(),
      settings: { stick: settings.stick, music: settings.music }, padVisible: !deckEl.hidden, menuSel,
      theme: { playing: themePlaying, scheduled: themeDbg.scheduled, ctx: themeCtx ? themeCtx.state : 'none' },
      stick: { dir: stickDebug.dir, mag: stickDebug.mag },
    };
  },
  advanceDay() {
    if (trial) return;
    dlg = null; if (mode === 'dialogue') mode = 'overworld';
    dawn();
    if (mode === 'dialogue') { dlg = null; mode = 'overworld'; }
  },
  waterAll() { G.save.pots.forEach(p => { if (p.stage >= 1) p.watered = true; }); saveGame(); },
  plantAll() {
    G.save.pots.forEach(p => { if (p.stage === 0 && G.save.seedsLeft > 0) { p.stage = 1; if (p.sownDay == null) p.sownDay = G.save.day; G.save.seedsLeft--; dexAdd('SEED'); } });
    if (G.save.tutorial === 1) G.save.tutorial = 2;
    saveGame();
  },
  openRegister() { openRegister(); },
  skipIntro() { dlg = null; if (G.save.tutorial === 0) G.save.tutorial = 1; if (mode === 'dialogue') mode = 'overworld'; saveGame(); },
  startTrial() { if (G.save.deerPresent && !G.save.deerBeaten && strongestPot() >= 0) startTrial(); },
  warp(x, y) { player.tx = x; player.ty = y; syncPixels(player); alvin.tx = x; alvin.ty = y + 1; syncPixels(alvin); },
  setWeeds(list) { G.save.weeds = (list || []).map(w => ({ x: w.x, y: w.y, deep: !!w.deep })); saveGame(); },
  giveCompost(n) { G.save.compost += n; saveGame(); },
  giveDirt(n) { G.save.goodDirt += n; saveGame(); },
  themeData() { return { bpm: THEME.bpm, beats: THEME.beats, melody: THEME.melody.map(e => e[0]), bass: THEME.bass.map(e => e[0]), chords: THEME.chords.map(e => e[0]) }; },
};
