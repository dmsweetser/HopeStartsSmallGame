'use strict';
/* HOPE STARTS SMALL — Chapter 1: SEEDS
   A tiny Pokémon-style tending game. Vanilla JS, no dependencies.
   All art is drawn in code from pixel maps. No image assets. */

// The book's Audible page — the game's funnel target.
const AUDIBLE_URL = 'https://www.audible.com/pd/Hope-Starts-Small-Audiobook/B0DZPCHT4M';
// The book's Amazon page — the title menu's second funnel link.
const BOOK_URL = 'https://www.amazon.com/dp/B0DXVKQHZ2';
const SAVE_KEY = 'hss-save-v1';
const TRIAL_OUTCOMES = {}; // trial kind -> {win(t), lose(t, fled)} — chapters register their outcomes here
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
'....ksessesk....',
'....kssooSsk....',
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
'....ksessesk....',
'....kssooSsk....',
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
'...khHHHHhhhk...',
'...khhhHHhHhk...',
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
'...khHHHHhhhk...',
'...khhhHHhHhk...',
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
'....ksSssSsk....',
'....kssooSsk....',
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
'....ksessesk....',
'....ksskkSsk....',
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
const JEREMIAH_PAL = { k: '#20242a', s: SKIN, S: '#d99e5f', h: '#4a2f1d', H: '#38220f', e: EYE, t: '#3b6fe0', T: '#2a4a9f', j: '#2a4a7f', w: '#e8e8e8', o: '#33261a' };
const JEREMIAH_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...sktTttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kwwkkwwk....',
], JEREMIAH_PAL);

const JEREMIAH_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'....kttttttks...',
'..sktttttttks...',
'....kkttttkk....',
'...kjjk..kjjk...',
'...kjjk..kjjk...',
'...kwwk..kwwk...',
], JEREMIAH_PAL);

const JEREMIAH_UP = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhhhhhk....',
'....khhHhhhk....',
'....khhhhhhk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...skttttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kookkook....',
], JEREMIAH_PAL);

const JEREMIAH_UP2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhhhhhk....',
'....khhHhhhk....',
'....khhhhhhk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...skttttttks...',
'....kkttttkk....',
'...kjjk..kjjk...',
'...kjjk..kjjk...',
'...kook..kook...',
], JEREMIAH_PAL);

const JEREMIAH_SIDE = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kjjkjjjk....',
'....kjjkjjjk....',
'....kwwkwwwk....',
], JEREMIAH_PAL);

const JEREMIAH_SIDE2 = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'...kjjk.kjjk....',
'....kjjkjjjk....',
'...kwwk..wwk....',
], JEREMIAH_PAL);

const JEREMIAH_DOWN_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksSssSsk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...sktTttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kwwkkwwk....',
], JEREMIAH_PAL);

const JEREMIAH_DOWN_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....ksskkSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...sktTttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kwwkkwwk....',
], JEREMIAH_PAL);

const JEREMIAH_SIDE_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsSk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kjjkjjjk....',
'....kjjkjjjk....',
'....kwwkwwwk....',
], JEREMIAH_PAL);

const JEREMIAH_SIDE_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhskk....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kjjkjjjk....',
'....kjjkjjjk....',
'....kwwkwwwk....',
], JEREMIAH_PAL);

const JEREMIAH_SET = { down: [JEREMIAH_DOWN, JEREMIAH_DOWN2], up: [JEREMIAH_UP, JEREMIAH_UP2], side: [JEREMIAH_SIDE, JEREMIAH_SIDE2], blinkDown: JEREMIAH_DOWN_BLINK, blinkSide: JEREMIAH_SIDE_BLINK, talkDown: JEREMIAH_DOWN_TALK, talkSide: JEREMIAH_SIDE_TALK };

/* THE PASTOR — an unnamed guest (role only), in for the one evening the
   whole field has been pointing at: the October tasting. A dark suit, and
   the little white tab at his throat that says the rest. */
const PASTOR_PAL = { k: '#20242a', s: SKIN, S: '#d99e5f', h: '#5a5148', H: '#453f36', e: EYE, t: '#33373f', T: '#22252b', j: '#26282e', w: '#f4f1e6', o: '#33261a' };
const PASTOR_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttwwttkk...',
'...skttttttks...',
'...sktTttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kookkook....',
], PASTOR_PAL);

const PASTOR_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttwwttkk...',
'...skttttttks...',
'..sktttttttks...',
'....kkttttkk....',
'...kjjk..kjjk...',
'...kjjk..kjjk...',
'...kook..kook...',
], PASTOR_PAL);

const PASTOR_UP = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhhhhhk....',
'....khhHhhhk....',
'....khhhhhhk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...skttttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kookkook....',
], PASTOR_PAL);

const PASTOR_UP2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhhhhhk....',
'....khhHhhhk....',
'....khhhhhhk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...skttttttks...',
'....kkttttkk....',
'...kjjk..kjjk...',
'...kjjk..kjjk...',
'...kook..kook...',
], PASTOR_PAL);

const PASTOR_SIDE = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kktttwk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kjjkjjjk....',
'....kjjkjjjk....',
'....koookooo....',
], PASTOR_PAL);

const PASTOR_SIDE2 = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kktttwk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'...kjjk.kjjk....',
'....kjjkjjjk....',
'...kook..ook....',
], PASTOR_PAL);

const PASTOR_DOWN_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksSssSsk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttwwttkk...',
'...skttttttks...',
'...sktTttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kookkook....',
], PASTOR_PAL);

const PASTOR_DOWN_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....ksskkSsk....',
'.....kkkkkk.....',
'...kkttwwttkk...',
'...skttttttks...',
'...sktTttttks...',
'....kkttttkk....',
'....kjjkkjjk....',
'....kjjkkjjk....',
'....kookkook....',
], PASTOR_PAL);

const PASTOR_SIDE_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsSk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kktttwk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kjjkjjjk....',
'....kjjkjjjk....',
'....koookooo....',
], PASTOR_PAL);

const PASTOR_SIDE_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'...kkhhhhhhhk...',
'....khhhhhhk....',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhskk....',
'.....kkkkkk.....',
'....kktttwk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kjjkjjjk....',
'....kjjkjjjk....',
'....koookooo....',
], PASTOR_PAL);

const PASTOR_SET = { down: [PASTOR_DOWN, PASTOR_DOWN2], up: [PASTOR_UP, PASTOR_UP2], side: [PASTOR_SIDE, PASTOR_SIDE2], blinkDown: PASTOR_DOWN_BLINK, blinkSide: PASTOR_SIDE_BLINK, talkDown: PASTOR_DOWN_TALK, talkSide: PASTOR_SIDE_TALK };
const ZOEY_PAL = { k: '#20242a', s: '#f0c8a0', S: '#d99e5f', h: '#7a4a21', H: '#5e3717', e: EYE, d: '#e06a9a', D: '#b84a78', l: '#5e4a6e', w: '#f8f8f8', o: '#33261a' };
const ZOEY_DOWN = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhHHhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwddks...',
'...skddddddks...',
'....kddddddk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_DOWN2 = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhHHhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwddks...',
'...skddddddks...',
'...kdddddddk....',
'...kllk..kllk...',
'...kllk..kllk...',
'...kook..kook...',
], ZOEY_PAL);

const ZOEY_UP = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhHhk...',
'....khhHhhhk....',
'....khhhhhHk....',
'....khhhhhhk....',
'...kkddddddkk...',
'...skddddddks...',
'...skddddddks...',
'....kddddddk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_UP2 = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhHhhhk....',
'....khhhhhhk....',
'....khhhhhhk....',
'...kkddddddkk...',
'...skddddddks...',
'...skddddddks...',
'....kddddddk....',
'...kllk..kllk...',
'...kllk..kllk...',
'...kook..kook...',
], ZOEY_PAL);

const ZOEY_SIDE = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhsssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkddddd.....',
'....kddddDks....',
'....kddddddk....',
'...kdddddddk....',
'....kllklllk....',
'....kllklllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_SIDE2 = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhsssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkddddd.....',
'....kddddDks....',
'....kddddddk....',
'...kdddddddk....',
'...kllk.kllk....',
'....kllklllk....',
'...kook..ook....',
], ZOEY_PAL);

const ZOEY_DOWN_BLINK = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....ksSssSsk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwddks...',
'...skddddddks...',
'....kddddddk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_DOWN_TALK = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....ksessesk....',
'....ksskkSsk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skddwwddks...',
'...skddddddks...',
'....kddddddk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_SIDE_BLINK = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhsssk....',
'....khhhhsSk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkddddd.....',
'....kddddDks....',
'....kddddddk....',
'...kdddddddk....',
'....kllklllk....',
'....kllklllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_SIDE_TALK = makeSprite([
'................',
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhsssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhskk....',
'.....kkkkkk.....',
'....kkddddd.....',
'....kddddDks....',
'....kddddddk....',
'...kdddddddk....',
'....kllklllk....',
'....kllklllk....',
'....kookkook....',
], ZOEY_PAL);

const ZOEY_SET = { down: [ZOEY_DOWN, ZOEY_DOWN2], up: [ZOEY_UP, ZOEY_UP2], side: [ZOEY_SIDE, ZOEY_SIDE2], blinkDown: ZOEY_DOWN_BLINK, blinkSide: ZOEY_SIDE_BLINK, talkDown: ZOEY_DOWN_TALK, talkSide: ZOEY_SIDE_TALK };
const OMA_PAL = { k: '#20242a', s: '#e8b98a', S: '#cf9455', h: '#d8d8d8', H: '#a8a8a8', e: EYE, g: '#7f9fb0', t: '#7a5aa0', T: '#5e4480', w: '#f3e9d2', l: '#4a3a5e', o: '#33261a' };
const OMA_DOWN = makeSprite([
'......kkkk......',
'.....kkkkkk.....',
'....khhHHhhk....',
'....khhhhhhk....',
'....khsssshk....',
'....kssssssk....',
'....kgessegk....',
'....kssooSsk....',
'.....kkkkkk.....',
'..kkttttttttkk..',
'..skttwwwwttks..',
'..skttwwwwttks..',
'...kkttttttkk...',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_DOWN2 = makeSprite([
'......kkkk......',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khsssshk....',
'....kssssssk....',
'....kgessegk....',
'....kssooSsk....',
'.....kkkkkk.....',
'..kkttttttttkk..',
'..skttwwwwttks..',
'..skttwwwwttks..',
'...kkttttttkk...',
'...klllllllk....',
'....kllllllk....',
'...kook...kook..',
], OMA_PAL);

const OMA_UP = makeSprite([
'......kkkk......',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khhHhhhk....',
'....kHhhhhhk....',
'....kHhhhhhk....',
'....khhhhhhk....',
'.....kkkkkk.....',
'..kkttttttttkk..',
'..skttttttttks..',
'..skttttttttks..',
'...kkttttttkk...',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_UP2 = makeSprite([
'......kkkk......',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khhHhhhk....',
'....kHhhhhhk....',
'....kHhhhhhk....',
'....khhhhhhk....',
'.....kkkkkk.....',
'..kkttttttttkk..',
'..skttttttttks..',
'..skttttttttks..',
'...kkttttttkk...',
'...klllllllk....',
'....kllllllk....',
'...kook...kook..',
], OMA_PAL);

const OMA_SIDE = makeSprite([
'.....kkkk.......',
'....kkkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....kHhhhssk....',
'....khssgesk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'...kkttttttk....',
'...kttwwwwtks...',
'...kttttttttk...',
'...kkttttttk....',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_SIDE2 = makeSprite([
'.....kkkk.......',
'....kkkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....kHhhhssk....',
'....khssgesk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'...kkttttttk....',
'...kttwwwwtks...',
'...kttttttttk...',
'...kkttttttk....',
'...klllllllk....',
'....kllllllk....',
'...kook...kook..',
], OMA_PAL);

const OMA_DOWN_BLINK = makeSprite([
'......kkkk......',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khsssshk....',
'....kssssssk....',
'....kgssssgk....',
'....kssooSsk....',
'.....kkkkkk.....',
'..kkttttttttkk..',
'..skttwwwwttks..',
'..skttwwwwttks..',
'...kkttttttkk...',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_DOWN_TALK = makeSprite([
'......kkkk......',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khsssshk....',
'....kssssssk....',
'....kgessegk....',
'....ksskkSsk....',
'.....kkkkkk.....',
'..kkttttttttkk..',
'..skttwwwwttks..',
'..skttwwwwttks..',
'...kkttttttkk...',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_SIDE_BLINK = makeSprite([
'.....kkkk.......',
'....kkkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....kHhhhssk....',
'....khssgSsk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'...kkttttttk....',
'...kttwwwwtks...',
'...kttttttttk...',
'...kkttttttk....',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_SIDE_TALK = makeSprite([
'.....kkkk.......',
'....kkkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....kHhhhssk....',
'....khssgesk....',
'....khhhhssk....',
'....kHhhhskk....',
'.....kkkkkk.....',
'...kkttttttk....',
'...kttwwwwtks...',
'...kttttttttk...',
'...kkttttttk....',
'....kllllllk....',
'....kllllllk....',
'....kookkook....',
], OMA_PAL);

const OMA_SET = { down: [OMA_DOWN, OMA_DOWN2], up: [OMA_UP, OMA_UP2], side: [OMA_SIDE, OMA_SIDE2], blinkDown: OMA_DOWN_BLINK, blinkSide: OMA_SIDE_BLINK, talkDown: OMA_DOWN_TALK, talkSide: OMA_SIDE_TALK };
const MOM_PAL = { k: '#20242a', s: '#eec39b', S: '#d9a06b', h: '#9a8a7a', H: '#77685a', e: EYE, t: '#b07f2a', T: '#8a5f1e', w: '#f3e9d2', l: '#5e4a2a', o: '#33261a' };
const MOM_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttwwttks...',
'...skttttttks...',
'....kkttttkk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], MOM_PAL);

const MOM_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttwwttks...',
'...skttttttks...',
'....kkttttkk....',
'...kllk..kllk...',
'...kllk..kllk...',
'...kook..kook...',
], MOM_PAL);

const MOM_UP = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhHhhhk....',
'....kHhhhhhk....',
'...khhhhhhhhk...',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...skttttttks...',
'....kkttttkk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], MOM_PAL);

const MOM_UP2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khhhhhhhhk...',
'....khhHhhhk....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttttttks...',
'...skttttttks...',
'....kkttttkk....',
'...kllk..kllk...',
'...kllk..kllk...',
'...kook..kook...',
], MOM_PAL);

const MOM_SIDE = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kllklllk....',
'....kllklllk....',
'....kookkook....',
], MOM_PAL);

const MOM_SIDE2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'...kllk.kllk....',
'....kllklllk....',
'...kook..ook....',
], MOM_PAL);

const MOM_DOWN_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksSssSsk....',
'....kssooSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttwwttks...',
'...skttttttks...',
'....kkttttkk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], MOM_PAL);

const MOM_DOWN_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'...khsssssshk...',
'....kssssssk....',
'....ksessesk....',
'....ksskkSsk....',
'.....kkkkkk.....',
'...kkttttttkk...',
'...skttwwttks...',
'...skttttttks...',
'....kkttttkk....',
'....kllkkllk....',
'....kllkkllk....',
'....kookkook....',
], MOM_PAL);

const MOM_SIDE_BLINK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'....kHhhhssk....',
'....khhhhsSk....',
'....khhhhssk....',
'....kHhhhsok....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kllklllk....',
'....kllklllk....',
'....kookkook....',
], MOM_PAL);

const MOM_SIDE_TALK = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'...khhhhhhhhk...',
'....kHhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....kHhhhskk....',
'.....kkkkkk.....',
'....kkttttk.....',
'....kttttTks....',
'....kttttttk....',
'....kkttttk.....',
'....kllklllk....',
'....kllklllk....',
'....kookkook....',
], MOM_PAL);

const MOM_SET = { down: [MOM_DOWN, MOM_DOWN2], up: [MOM_UP, MOM_UP2], side: [MOM_SIDE, MOM_SIDE2], blinkDown: MOM_DOWN_BLINK, blinkSide: MOM_SIDE_BLINK, talkDown: MOM_DOWN_TALK, talkSide: MOM_SIDE_TALK };
const LILY_PAL = { k: '#20242a', p: '#e88ca0', P: '#e06a9a', s: '#f0c8a0', e: EYE, t: '#7a8a99', w: '#3a3f4a' };
const LILY_STROLLER = makeSprite([
'................',
'................',
'.....kkkkkkk....',
'...kkpppppppkk..',
'...kpppppppppk..',
'...kPPkkkkkPPk..',
'...kppkssskppk..',
'...kppkesekppk..',
'..kkttttttttkk..',
'..kttttttttttk..',
'..kttttttttttk..',
'...kkttttttkk...',
'.....kk..kk.....',
'....kwwk.kwwk...',
'....kwwk.kwwk...',
'................',
], LILY_PAL);


/* Alvin: tan short coat, floppy darker ears, green collar with a tag.
   Side sprite faces right (charSprite flips it for left); the two frames
   wag his tail and stride his legs. */
const ALVIN_PAL = { k: '#20242a', t: '#d9a05a', T: '#b57f3d', d: '#8a5a2e', m: '#ecd3a0', n: '#20242a', g: '#37b24d', G: '#2b8a3e', y: '#ffd94a', e: '#20242a', r: '#e88ca0' };
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
'.....aaa..aa.a..................',
'......a....a....................',
'....kkkkkkkkk...................',
'...khhhhhhhhhkhk................',
'...khhhhhhhhhkk.................',
'...khhehhhhhhk..................',
'..kmmmhhhhhkhb..................',
'..kmmmkhhhkhbB..................',
'....mmmkhhhbBB..................',
'.........hhbBBbkkkkkkkkkkkkkk...',
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
'.....aaa..aa.a..................',
'......a....a....................',
'....kkkkkkkkk...................',
'...khhhhhhhhhkhh................',
'...khhhhhhhhhkhh..............kt',
'...khhehhhhhhk................kt',
'..kmmmhhhhhkhb................kt',
'..kmmmkhhhkhbB................kt',
'....mmmkhhhbBB................kt',
'.........hhbBBbkkkkkkkkkkkkkk.kt',
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
'....kttttttttttttGGymmk.....',
'....kttttttttttttttytmmk....',
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
'....kttttttttttttGGymmk.....',
'....kttttttttttttttytmmk....',
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
'....ktttttttttttttGymmk.....',
'....kttttttttttttttytmmk....',
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
function snowify(img, alpha) {
  try {
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(232,240,248,' + alpha + ')'; g.fillRect(0, 0, c.width, c.height);
    return c;
  } catch (e) { return null; }
}
const SNOW_TILES = {};
let SNOW_TREE = null;
function buildSnow() {
  for (const k of ['grass', 'grass2', 'grass3', 'grass4', 'tuft', 'tuftB', 'flower', 'flowerB', 'flower2', 'flower3', 'path', 'pathStone', 'soil']) if (TILES[k]) SNOW_TILES[k] = snowify(TILES[k], 0.66);
  SNOW_TREE = snowify(TREE, 0.45);
}
const TILEMAP = { n: 'lawn', f: 'fenceV', v: 'fenceVine', H: 'fenceH', F: 'fenceBloom', G: 'gate', R: 'roof', c: 'chimney', W: 'wall', E: 'wallBase', i: 'window', D: 'door', g: 'grass', u: 'grass2', o: 'flower', O: 'flower2', Q: 'flower3', p: 'path', j: 'pathStone', P: 'porch', B: 'bench', C: 'compost', T: 'grass', s: 'soil', S: 'soilSprout', U: 'bush', b: 'birdbath', M: 'mailbox', K: 'crate', w: 'can', A: 'bedA', Y: 'bedB' };
const SOLID = new Set(['n', 'f', 'v', 'H', 'F', 'G', 'R', 'c', 'W', 'E', 'i', 'D', 'B', 'C', 'T', 'U', 'b', 'M', 'K']);
/* Areas: the yard is the first of several maps. Each area has its own rows,
   dimensions, and (optionally) its own solid set; movement, camera and
   rendering all read the current area, so a new place is data, not surgery. */
let area = 'yard';
const HOUSE_MAP = [
  'HHHHHHHHHHHHHHHHHHHH',
  'HaaaaaaaazzkrrkzzzzH',
  'HzzzzzzzzzzzzzzzzzzH',
  'HzzzzzzzzzzzzzzzzzzH',
  'HzzzZzzzzzzzzzzzzzzH',
  'HzzZZZzzzeeeezzzzzzH',
  'HhzzZZzzzeeeezzzzzzH',
  'HzzZZZzzzzzzzzzzzzzH',
  'HzzzzzzzzzzzzzzzzzzH',
  'HzzzzzzzzzzzzzzzzzzH',
  'HzzzzzzzzzzzzzzzzzxH',
  'HzzzzzzzzzzzzzzzzzzH',
  'HHHHHHHHHHDHHHHHHHHH',
];
const HOUSE_SOLID = new Set(['H', 'a', 'r', 'k', 'h', 'e', 'x', 'f']);
const BARNOUT_MAP = [
  'TTpTTTTTTTTTTTTTTTTTTTTTTT',
  'TpgggggggggggggggggggggggT',
  'TpggggggRRRRRRRRggRRRgRRRT',
  'TpggggggWWiWWWiWggWWWgWWWT',
  'TpggggggEEEEEDEEgEDEgEDEET',
  'TpgggggugggggggggggggggggT',
  'TpgggggggggggggggggggggggT',
  'TpgogggggggggggggggggggggT',
  'TpggggggggggggggggsssssggT',
  'TpggbgggggggggggggsssssggT',
  'TppppppppppppgggggsssssggT',
  'TgggggggggggggggggsssssggT',
  'TffffffffffffGfffffffffffT',
  'TssssssssssssssssssssssssT',
  'TssssssssssssssssssssssssT',
  'TssssssssssssssssssssssssT',
  'TssssssssssssssssssssssssT',
  'TTTTTTTTTTTTTTTTTTTTTTTTTT',
];
const BARNIN_MAP = [
  'HHHHHHHHHHHHHHHH',
  'HaaaaaaazzkkzzzH',
  'HzzzzzzzzzzzzzzH',
  'HzzZZzzzzzzzzzzH',
  'HzzZZzzzeeeezzzH',
  'HzzzzzzzeeeezzxH',
  'HzzzzzzzzzzzzzzH',
  'HzzzzzzzzzzzzzzH',
  'HzzjzzzzzzzzzmzH',
  'HzzzzzzzzzzzzzzH',
  'HHHHHHHHHHHHHHHH',
];
const OMA_MAP = [
  'HHHHHHHHHHHH',
  'HaaaaazzzzkH',
  'HzzzzzzzzzzH',
  'HzzZZzzzzzzH',
  'HzzZZzzzeeeH',
  'HzzzzzzzzzzH',
  'HmmzzzzzzzzH',
  'HHHHHHDHHHHH',
];
const GREEN_MAP = [
  'HHHHHHHHHHHH',
  'HaaaaaaaaaaH',
  'HzzzzzzzzzzH',
  'HzzzzzzzzzhH',
  'HzzzzzzzzzzH',
  'HaaaaaaaaaaH',
  'HzzzzzzzzzzH',
  'HzzzzzzzzzzH',
  'HHHHHHDHHHHH',
];
const IN_SOLID = new Set(['H', 'a', 'r', 'k', 'h', 'e', 'x', 'm', 'f', 'j']);
const AREAS = {
  yard: { rows: MAP, w: MAP_W, h: MAP_H, name: 'DEERBROOK' },
  house: { rows: HOUSE_MAP, w: 20, h: 13, name: 'THE HOUSE', solid: HOUSE_SOLID },
  barnOut: { rows: BARNOUT_MAP, w: 26, h: 18, name: 'BERRYHILL' },
  barnIn: { rows: BARNIN_MAP, w: 16, h: 11, name: 'THE BARN — UPSTAIRS', solid: IN_SOLID },
  oma: { rows: OMA_MAP, w: 12, h: 8, name: 'THE DOWNSTAIRS', solid: IN_SOLID },
  green: { rows: GREEN_MAP, w: 12, h: 9, name: 'THE GREENHOUSE', solid: IN_SOLID },
};
let AW = MAP_W, AH = MAP_H;
let npcList = []; // runtime NPCs in the current area: {id,tx,ty,dir,set,name}
function curArea() { return AREAS[area]; }
function mapChar(x, y) { const a = curArea(); if (x < 0 || y < 0 || x >= a.w || y >= a.h) return 'f'; return a.rows[y][x]; }
function isSolid(x, y) { const a = curArea(); return (a.solid || SOLID).has(mapChar(x, y)); }
function setArea(name, tx, ty) {
  area = name; const a = curArea(); AW = a.w; AH = a.h;
  if (name === 'oma' && G.save && G.save.world.flags.alvinDown) { alvin.tx = 3; alvin.ty = 5; syncPixels(alvin); }
  if (name === 'barnOut') { constance.tx = 11; constance.ty = 6; }
  if (name === 'yard') { constance.tx = 13; constance.ty = 5; }
  G.save.world.area = name;
  player.tx = tx; player.ty = ty; syncPixels(player);
  alvin.tx = tx; alvin.ty = Math.min(AH - 1, ty + 1); syncPixels(alvin);
  alvinTarget = null;
  layoutNPCs();
  saveGame();
  onEnterArea(name);
}
function onEnterArea(name) {
  const s = G.save; if (!s) return;
  const w = s.world;
  if (name === 'barnOut' && w.ch === 3 && w.step === 1 && !w.flags.visited) {
    w.flags.visited = true; w.step = 2; saveGame();
    say(['THE PLACE OUTSIDE BERRYHILL. A BARN THAT BECAME A HOUSE, A HOUSE THAT KEPT THE BARN\'S HONESTY.', 'A GOOD SHED. A LINE OF PINES. AND THE FIELD — SQUARE, OPEN, WAITING — VISIBLE FROM THE DRIVE LIKE IT IS HOLDING ITS BREATH.', 'CONSTANCE, QUIETLY: OH. OH, FRANK.', 'FRANK: I KNOW. I KNOW. DO NOT SAY IT YET. LET IT BE UNSAID AND TRUE A MINUTE LONGER.']);
  }
}
function exitsFor(a) { return EXITS[a] ? EXITS[a]() : []; }
const EXITS = { // area -> () => [{x,y,to,tx,ty}] (state-dependent)
  house: () => [{ x: 10, y: 12, to: 'yard', tx: 10, ty: 5 }],
  barnOut: () => {
    const ex = [{ x: 2, y: 0, to: 'yard', tx: 11, ty: 1 }];
    if (G.save.world.ch >= 3 && (G.save.world.flags.buildStep || 0) >= 3) ex.push({ x: 20, y: 11, to: 'green', tx: 6, ty: 7 });
    return ex;
  },
  barnIn: () => [G.save.world.flags.stairsBuilt ? { x: 14, y: 5, to: 'oma', tx: 10, ty: 5 } : { x: 14, y: 5, to: 'barnOut', tx: 13, ty: 5 }],
  oma: () => {
    const ex = [{ x: 6, y: 7, to: 'barnOut', tx: 18, ty: 5 }];
    if (G.save.world.flags.stairsBuilt) ex.push({ x: 10, y: 6, to: 'barnIn', tx: 14, ty: 6 });
    return ex;
  },
  green: () => [{ x: 6, y: 8, to: 'barnOut', tx: 20, ty: 11 }],
};
/* NPCs: simple folk, placed by chapter and step. Sets are palettes for the
   little figure drawer; Constance uses her real sprite set. */
const NPC_SETS = {
  jeremiah: { skin: '#e8b98a', hair: '#4a2f1d', top: '#3b6fe0', legs: '#2a4a7f', h: 15 },
  zoey: { skin: '#f0c8a0', hair: '#7a4a21', top: '#e06a9a', legs: '#e06a9a', h: 12 },
  oma: { skin: '#eec39b', hair: '#d8d8d8', top: '#7a5aa0', legs: '#4a3a5e', h: 13 },
  friend: { skin: '#d9a06b', hair: '#2a2a2a', top: '#5a7a4a', legs: '#3a3a3a', h: 15 },
  pastor: { skin: '#e8b98a', hair: '#5a5148', top: '#3a3f4a', legs: '#2a2d33', h: 15 },
  pastorwife: { skin: '#f0c8a0', hair: '#8a6a3a', top: '#a03a5e', legs: '#5e2a3f', h: 14 },
  mom: { skin: '#eec39b', hair: '#9a8a7a', top: '#b07f2a', legs: '#5e4a2a', h: 14 },
};
function npcsFor(a) {
  const s = G.save, w = s.world, list = [];
  if (!s || w.ch < 2) return list;
  if (a === 'yard' && w.ch === 2) {
    if (w.step >= 1) list.push({ id: 'jeremiah', tx: 14, ty: 12, dir: 'left', set: 'jeremiah', name: 'JEREMIAH' });
    if (w.step >= 2) {
      list.push({ id: 'zoey', tx: 6, ty: 13, dir: 'down', set: 'zoey', name: 'ZOEY' });
      list.push({ id: 'lily', tx: 12, ty: 6, dir: 'down', set: 'lily', name: 'LILY' });
    }
  }
  if (w.ch === 8 && w.flags.momDay === s.day && a === 'barnOut') list.push({ id: 'mom', tx: 10, ty: 6, dir: 'down', set: 'mom', name: 'MOM' });
  if (w.ch >= 5) {
    if (a === 'oma') list.push({ id: 'oma', tx: 5, ty: 4, dir: 'down', set: 'oma', name: 'OMA' });
    if (a === 'barnOut' && hashDay(s.day) % 3 === 0) list.push({ id: 'oma', tx: 16, ty: 6, dir: 'down', set: 'oma', name: 'OMA' });
    if (a === 'barnIn' && w.ch === 5) list.push({ id: 'constance', tx: 4, ty: 3, dir: 'down', set: 'constance', name: 'CONSTANCE' });
    if (a === 'barnIn' && w.ch === 10 && w.step === 5) { // the tasting: the pastor at the table, Constance beside Frank — as the book has it
      list.push({ id: 'pastor', tx: 7, ty: 4, dir: 'right', set: 'pastor', name: 'PASTOR' });
      list.push({ id: 'constance', tx: 12, ty: 4, dir: 'left', set: 'constance', name: 'CONSTANCE' });
    }
  }
  if (w.ch === 3) {
    if (a === 'barnOut') {
      list.push({ id: 'zoey', tx: 5, ty: 9, dir: 'down', set: 'zoey', name: 'ZOEY' });
      list.push({ id: 'lily', tx: 6, ty: 9, dir: 'down', set: 'lily', name: 'LILY' });
    }
    if (a === 'barnIn') {
      list.push({ id: 'constance', tx: 4, ty: 3, dir: 'down', set: 'constance', name: 'CONSTANCE' });
      if (w.step === 7) list.push({ id: 'jeremiah', tx: 9, ty: 3, dir: 'down', set: 'jeremiah', name: 'JEREMIAH' });
    }
    if (a === 'green' && w.step >= 8) list.push({ id: 'jeremiah', tx: 5, ty: 4, dir: 'down', set: 'jeremiah', name: 'JEREMIAH' });
  }
  if (a === 'house' && w.ch === 2) {
    list.push({ id: 'constance', tx: 5, ty: 4, dir: 'down', set: 'constance', name: 'CONSTANCE' });
    if (w.step === 1) list.push({ id: 'jeremiah', tx: 8, ty: 3, dir: 'down', set: 'jeremiah', name: 'JEREMIAH' });
    if (w.flags.omaVisit) list.push({ id: 'oma', tx: 11, ty: 4, dir: 'down', set: 'oma', name: 'OMA' });
  }
  return list;
}
function drawNPCFigure(n, sx, sy, talking) {
  if (n.set === 'constance') { charSprite({ px: sx + camX, py: sy + camY, dir: n.dir || 'down', moving: false, blinkOff: 1.9, talk: talking }, CONSTANCE_SET); return; }
  if (n.set === 'lily') { // the stroller, with its supervisor aboard
    ctx.fillStyle = 'rgba(20,26,20,0.25)';
    ctx.fillRect(sx + 2, sy + 13, 12, 2); ctx.fillRect(sx + 3, sy + 15, 10, 1);
    ctx.drawImage(LILY_STROLLER, sx, sy);
    return;
  }
  const NPC_SPRITE_SETS = { jeremiah: [JEREMIAH_SET, 0.7], zoey: [ZOEY_SET, 1.3], oma: [OMA_SET, 2.2], mom: [MOM_SET, 0.4], pastor: [PASTOR_SET, 1.6] };
  const npcSet = NPC_SPRITE_SETS[n.set];
  if (npcSet) { charSprite({ px: sx + camX, py: sy + camY, dir: n.dir || 'down', moving: false, blinkOff: npcSet[1], talk: talking }, npcSet[0]); return; }
  const P = NPC_SETS[n.set] || NPC_SETS.jeremiah;
  const bob = 0;
  ctx.fillStyle = P.legs; ctx.fillRect(sx + 5, sy + P.h - 4 + bob, 2, 4); ctx.fillRect(sx + 9, sy + P.h - 4 + bob, 2, 4);
  ctx.fillStyle = P.top; ctx.fillRect(sx + 4, sy + 6 + bob, 8, P.h - 9);
  ctx.fillStyle = P.skin; ctx.fillRect(sx + 5, sy + 1 + bob, 6, 5);
  ctx.fillStyle = P.hair; ctx.fillRect(sx + 5, sy + bob, 6, 2);
  if (n.set === 'oma') { ctx.fillStyle = '#d8d8d8'; ctx.fillRect(sx + 7, sy - 2 + bob, 3, 2); } // the bun
  if (talking && Math.floor(perfNow * 7) % 2 === 0) { ctx.fillStyle = '#7a3b2e'; ctx.fillRect(sx + 7, sy + 4 + bob, 2, 1); }
}

function npcTalk(npc) {
  const s = G.save, w = s.world;
  if (npc.id === 'constance') {
    if (w.ch === 10 && w.step === 5) {
      return say(['CONSTANCE: A PASTOR, A TABLE, AND YOUR WINE, FRANK. NO PRESSURE AT ALL.', 'CONSTANCE: POUR IT LIKE YOU MEAN IT. YOU DO EVERYTHING ELSE THAT WAY.']);
    }
    const lines = [
      'CONSTANCE: THE HOUSE IS MOSTLY BOXES AND OPINIONS NOW. THE PLANTS HAVE THE BEST ROOM. THIS SEEMS FAIR.',
      'CONSTANCE: WATER THE SHELF, FRANK. THE SMALL ONES CANNOT ASK, SO I AM ASKING FOR THEM.',
      'CONSTANCE: LAND FIRST. HOUSE SECOND. GOATS — WE WILL DISCUSS THE GOATS NEVER.',
    ];
    return say(lines[s.day % lines.length]);
  }
  if (npc.id === 'jeremiah') {
    if (w.ch === 2 && w.step === 1 && !w.flags.carried) {
      w.flags.carried = true; saveGame();
      return say(['JEREMIAH: I CAN CARRY THE PEAT PELLETS. I AM BASICALLY A FORKLIFT.', 'HE CARRIES THEM LIKE THEY ARE MADE OF GLASS AND DYNAMITE. NOTHING BREAKS.', 'JEREMIAH: FOR THE RECORD — I STILL DO NOT LIKE BLUEBERRIES.', 'FRANK: NOTED IN THE REGISTER. UNDER "HONEST MEN".']);
    }
    if (w.jeremiahDay !== s.day) {
      const target = s.plants.find(p => !p.memorial && p.stage >= 1 && !p.watered);
      if (target) {
        return say('JEREMIAH IS AROUND. ASK HIM TO WATER SOMETHING?', which => {
          if (which === 0) { w.jeremiahDay = s.day; waterPlant(target); say('JEREMIAH WATERS ' + target.name + '. CAREFULLY. LIKE IT OWES HIM NOTHING AND HE INTENDS TO KEEP IT THAT WAY.'); }
        }, ['ASK HIM', 'NOT NOW']);
      }
    }
    const lines = [
      'JEREMIAH: I HELP WITH THE PLANTS. I DO NOT EAT THE PLANTS. THESE ARE SEPARATE DEPARTMENTS.',
      'JEREMIAH: WHEN THERE IS A FIELD, I WILL HELP DIG. DIGGING IS JUST CARRYING, DOWNWARD.',
      'JEREMIAH: THE SPROUTS HAVE NAMES. THE CAR DOES NOT. PRIORITIES.',
    ];
    return say(lines[s.day % lines.length]);
  }
  if (npc.id === 'zoey') {
    const lines = [
      'ZOEY: I HAVE RANKED THE SPROUTS BY LIKELIHOOD OF GREATNESS. THE RANKINGS ARE CONFIDENTIAL.',
      'ZOEY: IF THE NEW HOUSE DOES NOT HAVE A GOOD WINDOW, WE RIOT. POLITELY. WITH SIGNS.',
      'ZOEY: I WATERED THE ONES ON THE END. THEY LOOKED THIRSTY AND ALSO BRAVE.',
    ];
    return say(lines[s.day % lines.length]);
  }
  if (npc.id === 'lily') {
    const lines = [
      'LILY SUPERVISES FROM THE STROLLER. HER STANDARDS ARE HIGH AND HER NAP IS NON-NEGOTIABLE.',
      'LILY HAS BEEN GIVEN A LEAF TO HOLD. SHE HOLDS IT LIKE A SCEPTRE.',
    ];
    return say(lines[s.day % lines.length]);
  }
  if (npc.id === 'mom') {
    if (w.ch === 8 && w.step === 1 && !w.flags.momDone) {
      const n = (w.flags.sortCount || 0) + 1;
      if (n >= 10) {
        w.flags.momDone = true; w.step = 2; saveGame();
        return say(['THE TENTH PLANT. SHE LOOKS AT IT A LONG TIME — A THISTLE, PROUD AS A FLAG, BY THE FENCE.', 'MOM: THAT ONE STAYS. EVERY GARDEN KEEPS ONE THING IT DID NOT PLANT, TO REMIND IT WHO WAS HERE FIRST. YOU WILL KNOW WHEN IT IS TIME. THEY ALWAYS TELL YOU.', 'SHE LEAVES BEFORE LUNCH, WITH BERRIES, AND THE DRIVEWAY IS A BETTER PLACE THAN SHE FOUND IT. IT USUALLY IS, WHERE SHE HAS BEEN.']);
      }
      w.flags.sortCount = n; saveGame();
      const kinds = ['A VOLUNTEER TOMATO, ALL LEGS AND HOPE.', 'A WEED WITH A FLOWER IT HAS NOT EARNED.', 'A STRAWBERRY RUNNER, FAR FROM HOME.', 'A WEED PRETENDING, POORLY, TO BE A HERB.', 'A GOOD CLUMP OF SOMETHING USEFUL.', 'A WEED WITH SEEDS LIKE SMALL PLANS.', 'A YOUNG IRIS, LOST AND UNBOTHERED.', 'A WEED THAT SMELLS LIKE A LIE.', 'A BERRY CANE, ESCAPED AND PROUD.'];
      return say('PLANT ' + n + ' OF 10: ' + kinds[(n - 1) % kinds.length] + ' — MOM: KEEP OR PULL, FRANK? (SHE WILL FORGIVE EITHER ANSWER. THE PLANTS ARE A LESSON; THE LESSON IS THE POINT.)', which => {
        say(which === 0 ? 'MOM: KEPT. GOOD. HALF OF GARDENING IS DECIDING WHAT GETS TO STAY, AND SAYING IT LIKE YOU MEAN IT.' : 'MOM: PULLED. GOOD. THE OTHER HALF IS PULLING WITHOUT APOLOGIZING TO THE WEED.');
      }, ['KEEP IT', 'PULL IT']);
    }
    return say(['MOM: THE FIELD LOOKS LIKE A FIELD, FRANK. YOUR FATHER WOULD HAVE SAID IT IS TOO TIDY AND THEN QUIETLY FIXED THREE THINGS.', 'MOM: EAT SOMETHING. THAT IS THE WHOLE SERMON. EAT SOMETHING.']);
  }
  if (npc.id === 'oma') {
    if (w.ch === 2) return say(['OMA: I BROUGHT MY OWN TEA. YOURS IS FINE. MINE IS BETTER. THIS IS NOT A COMPETITION, BUT IF IT WERE —', 'OMA: SHOW ME THE SPROUTS AGAIN. SLOWLY. I AM MEMORIZING THEM.']);
    if (w.ch === 5 && w.step === 4 && !s.promise) {
      return say(['OMA: FRANK. SIT. NO — STAND THERE, THE LIGHT IS BETTER AND I WANT TO SEE YOUR FACE FOR THIS.', 'OMA: I AM AN OLD WOMAN, AND I HAVE DECIDED SOMETHING, AND DECIDING IS A YOUNG PERSON\'S GAME SO I AM DOING IT QUICKLY.', 'OMA: I WILL STAY. HERE, IN MY ROOM WITH ITS OWN DOOR, UNTIL I TASTE THE FIRST WINE MADE FROM THIS FIELD\'S FRUIT. THAT IS MY PROMISE. WRITE IT IN YOUR BOOK.', 'FRANK WRITES IT IN THE REGISTER, IN HIS BEST HAND: OMA\'S PROMISE. THE JAR, FOR NOW, IS EMPTY.', 'OMA: NOW GO AND GROW ME A FIELD. I WILL BE HERE. I HAVE DECIDED.'], () => { s.promise = true; saveGame(); completeChapter(5); });
    }
    if (w.ch === 9 && w.step === 0 && !w.flags.forsythiaReady) {
      w.flags.forsythiaReady = true; saveGame();
      return say(['OMA: THE FORSYTHIA, FRANK. IT HAS SAT IN ITS POT BY MY DOOR LONG ENOUGH, PATIENT AS A RELATIVE AT A WEDDING.', 'OMA: CARRY IT PAST MY WINDOW — SLOWLY, I WANT THE FULL PROCESSION — AND PLANT IT WHERE I SHOW YOU. I HAVE NAMED IT ALREADY. YOU WILL FIND OUT WHEN IT IS IN THE GROUND. SOME THINGS A WOMAN KEEPS UNTIL THE HOLE IS DUG.']);
    }
    if (w.ch === 8 && w.step === 4 && !w.flags.butterflyReady) {
      w.flags.butterflyReady = true; saveGame();
      return say(['OMA: THE BUTTERFLY BUSH FROM THE OLD YARD, FRANK. IT SURVIVED THE SALE, THE MOVE, AND A WINTER IN A POT BY MY DOOR, OUT OF SPITE AND GOOD ROOTS.', 'OMA: PLANT IT BY MY PATIO. TODAY. I WILL DIRECT FROM THE DOOR, AND I WILL BE RIGHT ABOUT THE SPOT, AND YOU WILL PRETEND TO DECIDE AND THEN CHOOSE IT.', 'SHE DOES NOT SAY WHY TODAY. THE REGISTER KNOWS: IT IS THE ANNIVERSARY. SOME DATES A HOUSE KEEPS QUIETLY, IN ITS BONES.']);
    }
    // a small request, once a day: water a named plant she has been watching
    if (w.omaReqDay !== s.day) {
      const target = s.plants.find(p => !p.memorial && p.stage >= 1 && !p.watered && p.name === (w.flags.omaReq || ''));
      if (target && target.watered) { /* unreachable guard */ }
      if (w.flags.omaReq) {
        const p = s.plants.find(q => q.name === w.flags.omaReq);
        if (p && p.watered) {
          w.omaReqDay = s.day; w.flags.omaReq = null; s.goodDirt++; saveGame();
          return say(['OMA: YOU WATERED ' + p.name + '. I SAW. AN OLD WOMAN NOTICES WHO TENDS AND WHO TALKS.', 'OMA: HERE — FROM YOUR OPA\'S STASH. GOOD DIRT. HE ALWAYS SAID A GARDEN RUNS ON IT AND ON BEING LOOKED AT. (+1 GOOD DIRT)']);
        }
      }
      const dry = s.plants.filter(p => !p.memorial && p.stage >= 1 && !p.watered);
      if (dry.length && !w.flags.omaReq) {
        const pick = dry[s.day % dry.length];
        w.flags.omaReq = pick.name; saveGame();
        return say(['OMA: ' + pick.name + ' IS THIRSTY, FRANK. I CAN TELL FROM HERE. I CAN ALWAYS TELL FROM HERE.', 'OMA: WATER IT, AND COME BACK AND TELL ME. AN OLD WOMAN LIKES TO BE OBEYED IN SMALL THINGS. IT KEEPS THE WORLD LEVEL.']);
      }
    }
    const stories = [
      ['OMA: YOUR OPA KEPT A GARDEN THE SIZE OF A RUG AND FED A STREET FROM IT. DO NOT ASK ME HOW. HE WOULD NOT SAY, AND NOW IT IS A FAMILY SECRET I AM KEEPING FROM MYSELF.', 'OMA: HE TALKED TO HIS TOMATOES. I TALKED TO HIM. THE HOUSE WAS FULL OF CONVERSATION AND MOST OF IT WAS ONE-WAY.'],
      ['OMA: WHEN THE ADMIRAL SPROUTED, I DREAMED OF YOUR OPA. HE WAS YOUNG AND ANNOYED AT A FENCE. SOME THINGS ABOUT A MAN NEVER CHANGE, EVEN IN DREAMS. ESPECIALLY IN DREAMS.', 'OMA: HE WOULD HAVE LIKED YOUR FIELD, FRANK. HE WOULD HAVE SAID SO ONCE, AND THEN FIXED THINGS ON IT FOR A DECADE TO PROVE IT.'],
      ['OMA: ASK ME ABOUT THE SIX. GO ON. — THE ADMIRAL, THE CAPTAIN, THE GENERAL. HOPE. PATIENCE. THE PROFESSOR.', 'OMA: I KNOW ALL THEIR NAMES. AN OLD WOMAN MEMORIZES WHAT THE HOUSE LOVES. IT IS THE WHOLE JOB, AND I AM GOOD AT IT.'],
    ];
    return say(stories[s.day % stories.length]);
  }
  if (npc.id === 'pastor') {
    return say(['PASTOR: I HAVE HEARD ABOUT THIS WINE AT SOME LENGTH, FRANK. A MAN IN MY POSITION LEARNS TO POUR SLOWLY, AND JUDGE SLOWER.', 'PASTOR: WHENEVER YOU ARE READY — THE TABLE, I THINK. SOME VERDICTS A MAN SHOULD BE SITTING DOWN FOR.']);
  }
  say('...');
}

function areaInteract(f) {
  if (area === 'house') return houseInteract(f);
  if (area === 'barnOut') return barnInteract(f);
  if (area === 'barnIn') return barnInInteract(f);
  if (area === 'oma') return omaInteract(f);
  if (area === 'green') return greenInteract(f);
}
const BERRY_CONSTANCE = [
  'CONSTANCE: THE BARN SMELLS OF HAY AND SECOND CHANCES. I CHECKED: THE SECOND CHANCES ARE STRUCTURAL.',
  'CONSTANCE: A FIELD, FRANK. AN ACTUAL FIELD. I HAVE ALREADY FORGIVEN IT FOR THE WORK IT WILL CAUSE.',
  'CONSTANCE: THE DOWNSTAIRS WILL BE OMA\'S WHEN SHE IS READY. THE DOOR OPENS TO THE YARD — HER OWN DOOR. THAT MATTERS.',
];
function barnInteract(f) {
  const s = G.save, w = s.world, ch = mapChar(f.x, f.y);
  if (f.x === constance.tx && f.y === constance.ty) {
    constance.dir = ({ up: 'down', down: 'up', left: 'right', right: 'left' })[player.dir];
    return say(BERRY_CONSTANCE[s.day % BERRY_CONSTANCE.length]);
  }
  if (f.x === 13 && f.y === 4) { // the barn door
    if (w.ch === 7) {
      return say('THE BARN DOOR. INSIDE: BED. OUTSIDE: EVERYTHING ELSE.', which => {
        if (which === 0) say('WHERE DOES ALVIN WATCH TONIGHT?', watch => {
          w.watchRow = ['NURSERY', 'ROW1', 'ROWS', null][watch];
          saveGame();
          say(watch === 3 ? 'NO WATCH TONIGHT. THE FIELD KEEPS ITS OWN COUNSEL.' : 'ALVIN TAKES THE ' + ['NURSERY', 'ROW 1', 'FIELD ROWS'][watch] + ' WATCH. HIS EARS ARE UP BEFORE FRANK IS DOWN.', () => { fading = 'dawn'; fade = 1; setTimeout(dawn, 350); });
        }, ['THE NURSERY', 'ROW 1', 'THE FIELD ROWS', 'NO WATCH']);
        if (which === 1) { setArea('barnIn', 14, 6); }
      }, ['REST', 'GO INSIDE', 'NOT YET']);
    }
    return say('THE BARN DOOR. HOME, AS OF VERY RECENTLY.', which => {
      if (which === 0) restDay();
      else if (which === 1) setArea('barnIn', 14, 6);
    }, ['REST', 'GO INSIDE', 'NOT YET']);
  }
  if (f.x === 18 && f.y === 4) { // the downstairs door
    return say('THE DOWNSTAIRS DOOR. IT OPENS TO THE YARD, ON ITS OWN — AN APARTMENT WITH ITS OWN FRONT DOOR.', which => { if (which === 0) setArea('oma', 6, 6); }, ['GO IN', 'NOT YET']);
  }
  if (f.x === 22 && f.y === 4) {
    if (w.ch === 4 && w.step === 3 && !w.flags.fenceNotes) {
      w.flags.fenceNotes = true; saveGame();
      return say(['THE FENCE PROBLEM, AS FRANK WRITES IT IN THE REGISTER:', 'EIGHT HUNDRED FEET OF BOUNDARY. POSTS, WIRE, A PARALLEL RUN FOUR FEET INSIDE — DEER JUMP ONE FENCE. THEY DO NOT JUMP A PUZZLE.', 'PRICE: EVERYTHING. EFFORT: ALSO EVERYTHING. TIME: BEFORE THE PLANTS GO IN, OR THE DEER WILL DO THE HARVESTING.', 'CONSTANCE: ONE SEGMENT AT A TIME, FRANK. LIKE EVERYTHING ELSE YOU HAVE EVER FINISHED.']);
    }
    if (w.ch === 4 && w.step === 2) {
      w.step = 3; saveGame();
      return say(['A LETTER FROM THE TOWN, IN A HAND THAT HAS NEVER HELD A SPADE:', 'THE LOT IS FOUR ACRES SHORT FOR GOATS, AND CHICKENS ARE A HARD NO IN INK THAT MEANS IT.', 'FRANK: FOUR ACRES. FOUR. THE FIELD IS RIGHT THERE —', 'CONSTANCE: THE FIELD IS FOR BLUEBERRIES, FRANK. THE CLERK HAS DONE YOU A FAVOUR AND YOU WILL THANK HIM IN ABOUT A YEAR.', '(THE GOATS GO IN THE REGISTER UNDER "SOMEDAY". SOMEDAY IS A REAL PAGE. FRANK CHECKS IT OFTEN.)']);
    }
    return say('THE GOOD SHED. SOUND ROOF, TRUE WALLS. INSIDE: TWINE, STAKES, A TAPE MEASURE, AND A SPADE THAT HAS SEEN THINGS.');
  }
  if (f.x === 13 && f.y === 12) { // the field gate
    if (w.ch >= 4) {
      if (player.ty >= 13) {
        if (w.ch === 6 && w.step === 5) return say('THE PLANTING GATE. THE FIELD, THE REGISTER, AND FRANK ALL CHECK THE SAME LIST.', which => { if (which === 0) doPlanting(); if (which === 1) say(['THE LIST, AS THE FIELD KEEPS IT:', ...(plantingGate().length ? plantingGate().map(m => '— ' + m) : ['— NOTHING. IT IS TIME.'])]); }, ['PLANTING DAY', 'READ THE LIST', 'NOT YET']);
        if (w.ch === 9 && w.step === 2) {
          const rowsWithPlants = [1, 2, 3, 4, 5, 6, 7].filter(rn => s.plants.some(p => !p.memorial && p.row === rn));
          const opts = rowsWithPlants.map(rn => 'WATCH ROW ' + rn);
          return say('THE FROST WATCH. ONE ROW A NIGHT GETS ALVIN. THE REST GET PRAYERS AND WHATEVER THE NIGHT DECIDES. TONIGHT\'S WATCH: ' + (w.flags.watchTonight ? 'ROW ' + w.flags.watchTonight : 'UNSET') + '.', which => {
            if (which < rowsWithPlants.length) { w.flags.watchTonight = rowsWithPlants[which]; saveGame(); say('ROW ' + rowsWithPlants[which] + ' TONIGHT. ALVIN HAS BEEN TOLD. HE HAS OPINIONS ABOUT THE OTHER ROWS, AND IS KEEPING THEM PROFESSIONALLY TO HIMSELF.'); }
          }, [...opts, 'LEAVE IT UNSET']);
        }
        return say('BACK TO THE YARD?', which => { if (which === 0) { player.tx = 13; player.ty = 11; syncPixels(player); alvin.tx = 13; alvin.ty = 12; syncPixels(alvin); } }, ['CLIMB BACK', 'STAY']);
      }
      return say('THE FIELD GATE. IT SWINGS BOTH WAYS NOW, LIKE A DECISION THAT HAS BEEN MADE.', which => { if (which === 0) { player.tx = 13; player.ty = 13; syncPixels(player); alvin.tx = 13; alvin.ty = 12; syncPixels(alvin); if (w.ch === 4 && w.step === 0) stakeField(); } }, ['ENTER THE FIELD', 'NOT YET']);
    }
    return say('THE FIELD GATE. FIRST, A HOUSE TO LIVE IN AND A GLASS HOUSE FOR THE PLANTS. THEN — EVERYTHING.');
  }
  if (w.ch === 5 && w.step >= 2 && !w.flags.patchCleared && f.x >= 23 && f.x <= 24 && f.y >= 6 && f.y <= 7) return patchInteract();
  if (w.ch === 8 && (w.step || 0) >= 2 && !w.flags.proudBurned && f.x === 24 && f.y === 11) return proudWeedInteract();
  if (w.ch >= 8 && f.x === 4 && f.y === 10) return burnPileInteract();
  if (w.ch >= 8 && (w.step || 0) >= 3 && !w.flags.strawDone && ((f.x === 4 || f.x === 5) && f.y === 5)) return strawberryInteract();
  if (w.ch >= 8 && w.flags.butterflyReady && !w.flags.butterflyPlanted && f.x === 19 && f.y === 5) return butterflyPlant();
  if (w.ch === 9 && w.step === 0 && w.flags.forsythiaReady && !w.flags.forsythiaPlanted && f.x === 17 && f.y === 5) return forsythiaPlant();
  if (w.ch === 11 && w.flags.proudShoot && f.x === 24 && f.y === 11) {
    return say('THE PROUD WEED\'S SHOOT, UP AGAIN BY THE FENCE — ONE GREEN WHISKER, EVERY SPRING, FROM ROOTS THAT OUTLASTED FIRE.', which => {
      w.flags.proudShoot = false; w.flags.proudChoice = which === 0 ? 'PULLED' : 'LET STAND'; saveGame();
      say(which === 0 ? 'PULLED, WITH A NOD. THE REGISTER NOTES IT, WRYLY: PULLED AGAIN. SEE YOU NEXT YEAR.' : 'LET STAND, THEN. THE REGISTER NOTES IT, WRYLY: SOME THINGS A FIELD KEEPS ON PURPOSE.');
    }, ['PULL IT', 'LET IT STAND']);
  }
  if (w.ch >= 6 && f.y === 12) return fenceInteract(f);
  if (w.ch >= 6 && f.y >= 13) return fieldInteract(f);
  if (w.ch >= 4 && (f.x === 6 || f.x === 7) && f.y === 5) return irisInteract();
  if (f.x >= 18 && f.x <= 22 && f.y >= 8 && f.y <= 11) { // the greenhouse site
    if (w.ch === 3 && w.step === 6 && (w.flags.buildStep || 0) < 3) {
      if (w.flags.buildDay === s.day) return say('ENOUGH BUILDING FOR ONE DAY. GLASS KEEPS. SO DOES FRANK, BARELY.');
      const stage = ['THE FRAME', 'THE SHELL', 'THE HEATER'][(w.flags.buildStep || 0)];
      return say('THE GREENHOUSE SITE, STAKED WITH STRING. NEXT: ' + stage + '.', which => { if (which === 0) buildGreenhouse(); }, ['BUILD: ' + stage, 'NOT YET']);
    }
    if ((w.flags.buildStep || 0) >= 3) return say('THE GREENHOUSE. GLASS AND PATIENCE. (STEP ONTO ITS DOORSTEP TO GO IN.)');
    return say('A LEVEL PATCH OF GROUND, STAKED WITH STRING. SOMETHING IS PLANNED HERE.');
  }
  if (ch === 'T') return say('THE PINE LINE. THE WIND COMES THROUGH IT LIKE IT IS READING ALOUD.');
  if (ch === 'b') return say('A BIRDBATH, INHERITED WITH THE PROPERTY. THE BIRDS HAVE ALREADY SIGNED THE LEASE.');
  return say('BERRYHILL. THE NAME IS ON THE MAILBOX AND, FRANK INSISTS, ON HIS HEART.');
}
function buildGreenhouse() {
  const s = G.save, w = s.world;
  w.flags.buildDay = s.day;
  w.flags.buildStep = (w.flags.buildStep || 0) + 1;
  saveGame();
  if (w.flags.buildStep === 1) return say(['DAY ONE: THE FRAME. POSTS, BEAMS, AND A LEVEL THAT FRANK CONSULTS LIKE SCRIPTURE.', 'IT STANDS. IT IS SQUARE. CONSTANCE CHECKS THE LEVEL HERSELF AND NODS ONCE, WHICH IS APPLAUSE.']);
  if (w.flags.buildStep === 2) return say(['DAY TWO: THE SHELL. THE WIND PICKS TODAY, OF ALL DAYS, TO HAVE OPINIONS.', 'FRANK HOLDS A PANEL. THE PANEL HOLDS FRANK. CONSTANCE HOLDS THE LADDER, THE SCREWS, AND THE SITUATION.', 'IT IS ON. IT IS SEALED. IT GLEAMS.']);
  s.field.heater = true; w.step = 7; layoutNPCs();
  return say(['DAY THREE: THE HEATER, A LITTLE STOVE WITH A SERIOUS FACE.', 'THE GLASS HOUSE IS A HOUSE NOW. TOMORROW THE PLANTS MOVE IN — CARRIED, A LOAD AT A TIME, FROM THE OFFICE SHELF.']);
}
function barnInInteract(f) {
  const s = G.save, w = s.world, ch = mapChar(f.x, f.y);
  if (ch === 'j') return openRegister(); // the journal lives on the office desk now, as well as the porch
  if (ch === 'a') {
    if (f.x === 1) { // the shelf end: carrying and watering live here
      if (w.ch === 3 && w.step === 7 && s.plants.some(p => p.location === 'OFFICE' && !p.memorial)) {
        return say('THE OFFICE SHELF, FULL OF PLANTS PRACTICING THEIR INDOOR VOICES.', which => {
          if (which === 0) carryPlants();
          else if (which === 1) waterLocation('OFFICE');
        }, ['CARRY A LOAD TO THE GREENHOUSE', 'WATER THEM HERE', 'NOT NOW']);
      }
      return say('THE OFFICE SHELF. THE JOURNAL KEEPS THE DESK BY THE SOUTH WALL, WHEN A NAME NEEDS FINDING.', which => { if (which === 0) waterLocation('OFFICE'); }, ['WATER THE SHELF', 'NOT NOW']);
    }
    if (f.x >= 2 && f.x <= 7) {
      const p = sixPlants().find(q => q.location === 'OFFICE' && q.slot === f.x - 2);
      if (p) return potInteract(p);
      return say('AN EMPTY SPOT ON THE OFFICE SHELF. IT WILL NOT STAY EMPTY. IT NEVER DOES.');
    }
  }
  if (ch === 'x') { // the stairs: down to the yard door, or — once built — to Oma's
    if (w.ch === 5 && w.step === 0 && !w.flags.stairsBuilt) {
      if (w.flags.stairsDay != null && w.flags.stairsDay < s.day) { w.flags.stairsBuilt = true; saveGame(); return say('THE STAIRS ARE DONE — AND HOLD. FRANK TESTS THEM WITH A JUMP THAT CONSTANCE PRETENDS NOT TO SEE.'); }
      if (w.flags.stairsDay === s.day) return say('THE STAIRS ARE HALF-BUILT AND WHOLLY IN THE WAY. TOMORROW THEY ARE STAIRS.');
      return say('THE STAIR PROJECT: A DAY OF WORK TO JOIN THE HOUSE TO ITSELF.', which => { if (which === 0) { w.flags.stairsDay = s.day; saveGame(); say('WORK BEGINS. SAWDUST, LEVELS, AND A PENCIL BEHIND EVERY EAR IN THE HOUSE.'); } }, ['BUILD THE STAIRS', 'NOT YET']);
    }
    return say('THE STAIRS. UP AND DOWN, LIKE A FAMILY.');
  }
  if (ch === 'k' && w.ch === 11 && !s.wine.jar && s.wine.poundsByYear[seasonOf(s.day).year]) {
    return say('THE BARN KITCHEN, IN WINE SEASON. THE YEAR\'S FRUIT IS IN: ' + (s.wine.poundsByYear[seasonOf(s.day).year] || 0).toFixed(1) + ' LBS. SET THE HONEY FOR BATCH ' + (s.wine.batches.length + 1) + '.', which => {
      startBatchTwo([0.3, 0.55, 0.65, 0.8, 1.0][which]);
    }, ['A SPOON — 0.30', 'A MEASURE — 0.55', 'THE LESSON — 0.65', 'A FULL MEASURE — 0.80', 'A GENEROUS CUP — 1.00']);
  }
  if (ch === 'k' && w.ch === 10 && w.step === 0 && !s.wine.jar) {
    return say('THE BARN KITCHEN. A CLEAN JAR, BOUGHT FRUIT, AND A REHEARSAL TO RUN.', which => { if (which === 0) startBatchOne(); }, ['START BATCH ONE', 'NOT YET']);
  }
  if (ch === 'k' && w.ch === 10 && w.step === 3 && !s.wine.jar) {
    const pts = Math.max(10, Math.round((s.wine.poundsByYear[seasonOf(s.day).year] || 0) * 2));
    return say('BATCH TWO. THE FIELD\'S OWN FRUIT: ' + pts + ' PINTS OF IT. THE JOURNAL HOLDS THE LESSON: A DASH (0.10) WAS TART. THE OLD BOOKS SAY HALF TO FOUR-FIFTHS. SET THE HONEY, FRANK.', which => {
      const ratios = [0.1, 0.3, 0.55, 0.65, 0.8, 1.0, 1.35];
      startBatchTwo(ratios[which]);
    }, ['A DASH — 0.10', 'A SPOON — 0.30', 'A MEASURE — 0.55', 'THE LESSON — 0.65', 'A FULL MEASURE — 0.80', 'A GENEROUS CUP — 1.00', 'A FLOOD — 1.35']);
  }
  if (ch === 'k' && s.wine.jar) {
    const j = s.wine.jar;
    if (j.phase === 'done') return say('BATCH ' + j.batch + ', DONE AND WAITING: THE REGISTER\'S FORMULA CALLS IT ' + j.verdict + '.', which => { if (which === 0) bottleJar(); }, ['BOTTLE IT', 'NOT YET']);
    if (j.phase === 'open') return say('THE JAR, OPEN AND BREATHING. DAY ' + (j.days + 1) + ' OF 3. SWISHED TODAY: ' + (j.swishDay === s.day ? j.swishes : 0) + ' OF 3.', which => { if (which === 0) swishJar(); }, ['SWISH IT', 'LEAVE IT']);
    return say('THE JAR, SEALED. DAY ' + (j.days + 1) + ' OF ' + (j.batch === 1 ? 14 : 28) + '. THE SEAL-WATER WAS LAST TOPPED ' + (j.sealCheckDay ? (s.day - j.sealCheckDay) + ' DAY(S) AGO' : 'NEVER') + '.', which => { if (which === 0) sealCheck(); }, ['TOP UP THE SEAL', 'LEAVE IT']);
  }
  if (ch === 'k' && w.ch === 6 && w.flags.pipeFound && !s.field.pipe) {
    return say('AMONG THE BARN\'S PLUMBING: A VALVE, GREEN WITH AGE, THAT FRANK TURNS WITH BOTH HANDS AND A PRAYER.', which => { if (which === 0) turnValve(); }, ['TURN IT', 'NOT YET']);
  }
  if (ch === 'e' && w.ch === 10 && w.step === 5) return tasting();
  if (ch === 'e' && w.ch === 11) return say('THE TABLE. THE YEAR\'S SURPLUS COULD GO DOWN THE ROAD — THE FARM STAND BY THE GATE HAS A SIGN NOW, AND THE SIGN HAS A BORDER.', which => { if (which === 0) shareStand(); }, ['SHARE THE SURPLUS', 'NOT TODAY']);
  if (ch === 'e') return say('THE TABLE. IT MADE THE TRIP. EVERYTHING IMPORTANT IN THIS FAMILY HAS BEEN DECIDED AT THIS TABLE, INCLUDING BREAKFAST.');
  if (ch === 'k') return say('THE COUNTER. THE KETTLE HAS FOUND ITS NEW HOME AND APPROVES OF THE VIEW.');
  if (ch === 'm') return say('THE BED. MOVING HOUSE IS A CONTACT SPORT AND EVERYONE IS BRUISED IN PLACES THEY DID NOT KNOW THEY HAD.');
  return say('UPSTAIRS IN THE BARN. IT SMELLS OF WOOD AND BEGINNINGS.');
}
function waterLocation(loc) {
  let n = 0;
  if (loc === 'GREENHOUSE' && G.save.world.ch === 6 && G.save.world.step <= 3) G.save.world.flags.mitWaterDay = G.save.day;
  for (const p of G.save.plants) if (!p.memorial && p.location === loc && p.stage >= 1 && !p.watered) { waterPlant(p); n++; }
  saveGame();
  say(n ? 'WATERED, ALL OF THEM. ' + n + ' DRINKS POURED.' : 'EVERYONE HERE IS ALREADY WATERED.');
}
function carryPlants() {
  const s = G.save, w = s.world;
  const load = s.plants.filter(p => p.location === 'OFFICE' && !p.memorial).slice(0, 6);
  if (!load.length) return;
  for (const p of load) { p.location = 'GREENHOUSE'; p.slot = null; }
  saveGame();
  const left = s.plants.filter(p => p.location === 'OFFICE' && !p.memorial).length;
  if (!left) {
    w.step = 8; layoutNPCs();
    return say(['THE LAST LOAD GOES OVER. JEREMIAH CARRIES TWO AND SUPERVISES THE REST LIKE A SMALL FOREMAN.', 'THE GREENHOUSE IS FULL OF QUIET GREEN. TONIGHT IS ITS FIRST NIGHT — AND THE RADIO SAYS COLD.', 'LIGHT THE LITTLE STOVE BEFORE DARK, OR TRUST THE GLASS. (THE STOVE IS THE BETTER BET.)']);
  }
  say(['A LOAD GOES OVER: ' + load.map(p => p.name).join(', ') + '. JEREMIAH WALKS THE PATH LIKE IT IS A PARADE ROUTE.', left + ' STILL WAIT ON THE SHELF.']);
}
function greenInteract(f) {
  const s = G.save, w = s.world, ch = mapChar(f.x, f.y);
  if (ch === 'H' && w.ch === 5 && !s.field.protoWire) {
    return say('THE GLASS, AND A ROLL OF CHICKEN WIRE FRANK HAS BEEN MEANING TO TRY AROUND THE VENTS.', which => { if (which === 0) { s.field.protoWire = true; saveGame(); say(['THE WIRE PROTOTYPE: A LITTLE SKIRT OF MESH AROUND THE GLASS HOUSE, TO TELL CLIMBERS AND CRAWLERS THE NEWS.', 'IT WILL NOT STOP A DEER. IT IS NOT FOR DEER. IT IS A FIRST DRAFT OF AN IDEA, AND THE FENCE WILL BE THE SECOND.']); } }, ['FIT THE WIRE', 'NOT YET']);
  }
  if (ch === 'h') {
    if (w.ch >= 6) {
      return say('THE STOVE, AND ABOVE IT THE VENT — A LITTLE ROOF WINDOW ON A ROPE. THE VENT IS ' + (s.field.vent ? 'OPEN.' : 'SHUT.'), which => {
        if (which === 0) { if (!w.flags.heaterLit) { w.flags.heaterLit = true; saveGame(); say('LIT. THE STOVE SETTLES INTO ITS WORK WITH A TICK AND A SIGH.'); } else say('THE STOVE TICKS WITH HEAT. ALL IS WELL.'); }
        if (which === 1) { s.field.vent = !s.field.vent; saveGame(); say(s.field.vent ? 'THE VENT CREAKS OPEN. HOT AIR LEAVES LIKE IT WAS CALLED BY NAME.' : 'THE VENT COMES DOWN. THE GLASS HOUSE HOLDS ITS BREATH AGAIN.'); }
      }, [w.flags.heaterLit ? 'STOVE (LIT)' : 'LIGHT THE STOVE', s.field.vent ? 'CLOSE THE VENT' : 'OPEN THE VENT', 'LEAVE IT']);
    }
    if (w.flags.heaterLit) return say('THE STOVE TICKS WITH HEAT. THE GLASS FOGS, JUST A LITTLE, AT THE EDGES. ALL IS WELL.');
    return say('THE LITTLE STOVE, COLD. THE NIGHT WILL BE WHAT IT WILL BE.', which => { if (which === 0) { w.flags.heaterLit = true; saveGame(); say('LIT. THE STOVE SETTLES INTO ITS WORK WITH A TICK AND A SIGH.'); } }, ['LIGHT THE STOVE', 'LEAVE IT']);
  }
  if (ch === 'a') {
    if (w.ch === 11 && s.tray.ready) {
      return say('THE TRAY, STRATIFIED THROUGH THE WINTER AND READY: ' + s.tray.n + ' SEEDS, WIDE AWAKE.', which => { if (which === 0) potUpLT(); }, ['POT THEM UP', 'NOT YET']);
    }
    if (w.ch === 6 && w.step === 4 && w.flags.repotReady) return repot();
    if (w.ch === 6 && w.step <= 3) {
      return say('THE BENCHES. EVERY LEAF IN THE GLASS HOUSE IS A QUESTION.', which => {
        if (which === 0) waterLocation('GREENHOUSE');
        if (which === 1) {
          const weak = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE').sort((a, b) => b.health - a.health)[0];
          if (!weak) return say('NO ONE HERE TO FEED.');
          if (s.goodDirt <= 0) return say(weak.name + ' IS THE WEAKEST, AND THERE IS NO GOOD DIRT LEFT. THE YARD LOOP STILL PAYS: WEEDS, COMPOST, DIRT.');
          feedDirt(weak); say('GOOD DIRT FOR ' + weak.name + ', THE WEAKEST FIRST. IT IS NOT FAVOURITISM. IT IS TRIAGE, AND TRIAGE IS LOVE WITH A LIST.');
        }
      }, ['WATER THEM ALL', 'FEED THE WEAKEST', 'JUST LOOK']);
    }
    return say('THE BENCHES. EVERY PLANT IN ITS PLACE, EVERY PLACE WITH A PLANT.', which => { if (which === 0) waterLocation('GREENHOUSE'); }, ['WATER THE BENCHES', 'NOT NOW']);
  }
  return say('THE GREENHOUSE. IT SMELLS OF WARM EARTH AND POSSIBILITY.');
}
function omaInteract(f) {
  const s = G.save, w = s.world, ch = mapChar(f.x, f.y);
  if (w.flags.alvinDown && f.x === alvin.tx && f.y === alvin.ty) {
    return say(['ALVIN, DOWNSTAIRS, OCCUPYING THE WARM SPOT BY OMA\'S BED LIKE A SMALL FURNACE WITH OPINIONS.', 'HE RISES, STRETCHES, AND FALLS IN BEHIND FRANK. THE DEFECTION WAS NEVER PERSONAL. THE FEET WERE WARM.'], () => { w.flags.alvinDown = false; saveGame(); });
  }
  if (ch === 'a' && f.x === 2) return say(['THE PHOTOGRAPH ON OMA\'S SHELF: A YOUNGER OMA, AND OPA, SQUINTING INTO A SUN THAT HAS LONG SINCE SET.', 'HE IS NOT HERE. HE IS NOT NOWHERE, EITHER. THE ROOM KEEPS HIM THE WAY THE REGISTER KEEPS A NAME.']);
  if (ch === 'a') return say('OMA\'S SHELF. EVERYTHING ON IT IS EXACTLY WHERE IT BELONGS, INCLUDING THE THINGS THAT LOOK RANDOM.');
  if (ch === 'm') return say('THE BED, MADE WITH HOSPITAL CORNERS AND OPINIONS.');
  if (ch === 'e') return say('A SMALL TABLE FOR ONE, SET — ON PRINCIPLE — FOR TWO.');
  return say('THE DOWNSTAIRS. ITS OWN DOOR, ITS OWN HOURS, ITS OWN EVERYTHING. READY WHEN SHE IS.');
}
function chooseLoadOrder(order) {
  const s = G.save;
  s.world.flags.loadOrder = order; s.world.step = 5;
  if (order === 'plants') {
    for (const p of s.plants) if (!p.memorial && (p.location === 'BENCH' || p.location === 'WINDOW')) p.location = 'OFFICE';
    s.world.flags.plantsMoved = true; saveGame();
    say(['THE PLANTS RIDE FIRST — IN THE CAB, IN BOXES, IN FRANK\'S LAP, IN DESCENDING ORDER OF FRAGILITY AND ASCENDING ORDER OF VOLUME.', 'THE FURNITURE CAN WAIT A DAY. IT HAS WAITED THIS LONG. THE PLANTS MOVE INTO THE BARN OFFICE BY SUPPERTIME.']);
  } else {
    saveGame();
    say(['THE FURNITURE RIDES FIRST. THE PLANTS WILL SPEND ONE NIGHT IN THE EMPTY HOUSE.', 'FRANK: ONE NIGHT. THEY WILL BE FINE. (HE WILL THINK ABOUT IT ALL NIGHT. HE IS THINKING ABOUT IT NOW.)']);
  }
}
function stakeField() {
  const s = G.save, w = s.world;
  w.flags.staked = true; w.step = 1; saveGame();
  say(['STAKING DAY. TWELVE ROWS, SIX FEET APART, IN A SQUARE SEVENTY-FIVE FEET BY — JEREMIAH, HOW MANY PACES?', 'JEREMIAH: FORTY-ONE. OR NINETY. THE PACES WERE ALL DIFFERENT SIZES. SOME OF THEM WERE SKIPS.', 'ZOEY: IT IS EXACTLY ONE HUNDRED OF MY FEET. I COUNTED TWICE AND GOT TWO NUMBERS, BUT THEY WERE BOTH CONFIDENT.', 'THE STAKES GO IN ANYWAY. THE SQUARE HOLDS. SOME DREAMS HAVE CORNERS, AND THE CORNERS ARE NOW MARKED WITH STRING.']);
}
function irisInteract() {
  const s = G.save, w = s.world;
  const irises = s.plants.filter(p => p.location === 'GARDEN' && p.variety === 'IRIS');
  if (!irises.length) {
    const made = [];
    for (let i = 0; i < 3; i++) {
      const p = freshPlant(allocName(s.plants), { variety: 'IRIS', stage: 4, location: 'GARDEN', gardenState: 'NEW', sownDay: 1, history: ['INHERITED WITH THE PLACE'] });
      s.plants.push(p); made.push(p.name);
      if (!s.dex.garden.includes('IRIS')) s.dex.garden.push('IRIS');
    }
    if (w.ch === 4 && w.step === 1) w.step = 2;
    saveGame();
    return say(['IRISES, INHERITED WITH THE PLACE — PURPLE, WHITE, AND A YELLOW LIKE A SMALL SUN.', 'FRANK NAMES THEM ON SIGHT, ONE PER COLOUR, THE WAY YOU GREET NEIGHBOURS YOU INTEND TO KEEP: ' + made.join(', ') + '.', 'THEY GO IN THE REGISTER UNDER GARDEN. THEY WERE HERE FIRST. IT IS THEIR NAME ON THE LAND, REALLY. HIS IS THE NEW ONE.']);
  }
  const dry = irises.filter(p => !p.watered);
  if (dry.length) return say('THE IRISES. A DRINK WOULD NOT GO AMISS.', which => { if (which === 0) { dry.forEach(waterPlant); say('WATERED. THE IRISES STAND A LITTLE STRAIGHTER, LIKE SOMEONE SAID THEIR NAMES.'); } }, ['WATER THEM', 'NOT NOW']);
  return say('THE IRISES, WATERED AND HOLDING COURT BY THE BARN WALL.');
}
function patchInteract() {
  const s = G.save, w = s.world;
  if (!w.flags.patchWeeds) {
    w.flags.patchWeeds = true; w.flags.patchPulls = 0; saveGame();
    return say(['BEHIND THE GOOD SHED: A BLACKBERRY PATCH GONE ENTIRELY TO THORN. SOMEWHERE IN THERE ARE BERRIES WORTH RESCUING.', 'THEN WE PULL. EIGHT BIG WEEDS STAND BETWEEN THE WORLD AND THE BERRIES. GLOVES ON.']);
  }
  if ((w.flags.patchPulls || 0) < 8) {
    w.flags.patchPulls++; saveGame();
    if (w.flags.patchPulls >= 8) return say(['THE LAST WEED COMES UP WITH A SOUND LIKE A CORK. UNDERNEATH: CANES. OLD, THORNLESS, PLANTED BY SOMEONE WHO KNEW — AND WORTH SAVING.', 'NOW A LITTLE NETTING, TO TELL THE BIRDS THE NEWS.']);
    return say('WEED ' + w.flags.patchPulls + ' OF 8. THE PATCH CONCEDES GROUND THE WAY WINTER DOES: SLOWLY, THEN ALL AT ONCE.');
  }
  if (!s.field.protoNet) {
    s.field.protoNet = true; saveGame();
    return say(['THE NETTING PROTOTYPE: A FRAME, A NET, AND FRANK\'S FULL CONFIDENCE.', 'NETTED. THE CANES STAND IN THEIR LITTLE FORTRESS, BLINKING IN THE SUN.', 'AND NOW THEY ARE PLANTED IN EARNEST — IN REAL GROUND, WITH NAMES.']);
  }
  const planted = s.plants.filter(p => p.location === 'GARDEN' && p.variety === 'BLACKBERRY');
  if (planted.length < 2) {
    const p = freshPlant(allocName(s.plants), { variety: 'BLACKBERRY', stage: 3, location: 'GARDEN', gardenState: 'NEW', sownDay: s.day, history: ['RESCUED FROM THE PATCH BEHIND THE GOOD SHED'] });
    s.plants.push(p);
    if (!s.dex.garden.includes('BLACKBERRY')) s.dex.garden.push('BLACKBERRY');
    if (planted.length === 1) { w.step = 3; }
    saveGame();
    return say('PLANTED, IN REAL GROUND: ' + p.name + ', THORNLESS BLACKBERRY. THE FIRST THING IN THIS FIELD WITH ROOTS AND A NAME.' + (planted.length === 1 ? '' : ' ONE MORE CANE WAITS.'));
  }
  return say('THE BLACKBERRIES. NETTED, NAMED, AND HOLDING THEIR CORNER BEHIND THE SHED.');
}
function ch5Dawn(ev) {
  const s = G.save, w = s.world;
  // some mornings, Alvin is simply downstairs
  if (w.ch === 5 && w.step >= 1 && hashDay(s.day) % 3 === 1 && !w.flags.alvinDown) w.flags.alvinDown = true;
  if (w.step === 0 && w.flags.stairsDay != null && w.flags.stairsDay < s.day && !w.flags.stairsBuilt) { w.flags.stairsBuilt = true; saveGame(); }
  if (w.step === 0 && w.flags.stairsBuilt) { w.step = 1; return ['THE STAIRS ARE DONE. THE HOUSE IS ONE HOUSE NOW, TOP TO BOTTOM.', 'OMA COMES THIS WEEK. HER ROOM HAS ITS OWN DOOR AND, AS OF TODAY, STAIRS. SHE WILL PRETEND NOT TO BE PLEASED. SHE WILL FAIL.']; }
  if (w.step === 3 && !w.flags.patchTrialDone) {
    w.flags.patchTrialDone = true;
    const bb = s.plants.filter(p => !p.memorial && p.location === 'GARDEN' && p.variety === 'BLACKBERRY');
    startTrial({ foe: 'WEEDS', kind: 'weedsPatch', pressure: 35, vigor: 26, plantsList: bb.length ? bb : sixPlants(), msg: 'THE PATCH FIGHTS BACK! ROOTS AND RUNNERS, UP IN THE NIGHT, AFTER THE BRAMBLE! ALVIN DIGS IN!' });
    return null;
  }
  if (w.step === 3 && w.flags.patchTrialDone && w.flags.patchWeedsBack) {
    w.flags.patchWeedsBack = false;
    const bb = s.plants.filter(p => !p.memorial && p.location === 'GARDEN' && p.variety === 'BLACKBERRY');
    startTrial({ foe: 'WEEDS', kind: 'weedsPatch', pressure: 35, vigor: 26, plantsList: bb.length ? bb : sixPlants(), msg: 'THE WEEDS RETURN, AS PROMISED BY EVERY WEED SINCE EDEN. ALVIN IS READY.' });
    return null;
  }
  return null;
}
TRIAL_OUTCOMES.weedsPatch = {
  win(t) {
    const w = G.save.world; w.step = 4; saveGame();
    say(['THE PATCH SETTLES. THE CANES STAND IN CLEARED GROUND, NETTED AND NAMED, LIKE THEY WERE ALWAYS THE POINT.', 'OMA HAS HEARD ABOUT THE BLACKBERRIES. SHE HAS QUESTIONS, AND A BOWL. VISIT HER.']);
  },
  lose(t, fled) {
    const s = G.save, w = s.world;
    if (fled) { say('ALVIN BACKS OFF. THE PATCH KEEPS ITS NERVE FOR ANOTHER NIGHT.'); return; }
    for (const p of t.plantsList || []) if (!p.memorial) { p.stage = Math.max(2, p.stage - 1); if (p.health < 3) p.health++; }
    w.flags.patchWeedsBack = true; w.flags.patchTrialDone = false;
    saveGame();
    say(['THE PATCH WINS THE NIGHT. THE CANES ARE SET BACK, SORE AND SMALLER — BUT ROOTED, AND ROOTS ARE A PROMISE.', 'THE WEEDS WILL TRY AGAIN IN TWO DAYS. SO WILL ALVIN. IT IS THAT KIND OF WAR.']);
  },
};
function fenceInteract(f) {
  const s = G.save, w = s.world;
  const seg = Math.min(3, Math.floor((f.x - 1) / 6));
  const built = s.field.fenceSeg.filter(Boolean).length;
  if (player.ty >= 13 && s.field.pipe) {
    return say('THE FENCE LINE, AND THE VALVE POST FRANK PAINTED BLUE SO HE WOULD STOP LOSING IT.', which => {
      if (which === 0) { if (projUse()) { for (const r of s.cropRows) r.watered = true; for (const p of s.plants) if (!p.memorial && p.location.startsWith('ROW')) waterPlant(p); say('THE VALVE TURNS. SOMEWHERE UNDER THE FIELD, WATER REMEMBERS ITS ROAD. EVERY ROW DRINKS.'); } }
      if (which === 1) fenceSegDialogue(seg, built);
    }, ['OPEN THE VALVE (ALL ROWS)', 'THE FENCE ITSELF', 'LEAVE IT']);
  }
  return fenceSegDialogue(seg, built);
}
function fenceSegDialogue(seg, built) {
  const s = G.save, w = s.world;
  if (s.field.fenceSeg[seg]) {
    if (s.field.pipe && !s.field.fenceIrr[seg]) return say('SEGMENT ' + (seg + 1) + ' STANDS. THE IRRIGATION LINE COULD RUN ALONG IT, IF A CERTAIN PIPE EVER GETS FOUND.', which => { if (which === 0 && projUse()) { s.field.fenceIrr[seg] = 1; s.field.irrigation = s.field.fenceIrr.filter(Boolean).length; saveGame(); say('LINE RUN. THE FENCE NOW CARRIES WATER LIKE A SECRET IT IS PROUD OF.'); } }, ['RUN THE LINE', 'NOT YET']);
    return say('SEGMENT ' + (seg + 1) + ' OF THE DOUBLE FENCE STANDS. POSTS TRUE, WIRE TIGHT, A PUZZLE A DEER MUST SOLVE TWICE.');
  }
  const free = built === 0 && s.field.protoNet && s.field.protoWire;
  return say('FENCE SEGMENT ' + (seg + 1) + ' OF 4. ' + (free ? 'THE TWO PROTOTYPES — NET AND WIRE — HAVE ALREADY TAUGHT FRANK\'S HANDS THIS WORK. THIS ONE GOES UP LIKE IT WAS REHEARSED.' : 'POSTS, WIRE, AND A PARALLEL RUN FOUR FEET INSIDE.'), which => { if (which === 0) buildFenceSeg(seg); }, ['BUILD IT', 'NOT YET']);
}
function buildFenceSeg(seg) {
  const s = G.save;
  if (s.field.fenceSeg[seg]) return;
  const built = s.field.fenceSeg.filter(Boolean).length;
  const free = built === 0 && s.field.protoNet && s.field.protoWire;
  if (!free && !projUse()) return;
  s.field.fenceSeg[seg] = 1; s.field.fence = s.field.fenceSeg.filter(Boolean).length; saveGame();
  say('SEGMENT ' + (seg + 1) + ' STANDS. ' + s.field.fence + ' OF 4. THE FIELD IS BEGINNING TO HAVE AN INSIDE AND AN OUTSIDE, WHICH IS ALL A FENCE EVER REALLY SAYS.');
}
function digPipe() {
  const s = G.save, w = s.world;
  if (!projUse()) return;
  w.flags.pipeFound = true; saveGame();
  say(['FOUR FEET DOWN: A PIPE. AN OLD IRRIGATION LINE, LAID BY WHOEVER FARMED HERE BEFORE, CAPPED AND PATIENT.', 'JEREMIAH, HOLDING THE VALVE LIKE A TROPHY: IT STILL TURNS. EVERYTHING STILL TURNS IF YOU ARE POLITE AND USE BOTH HANDS.', 'HE KEEPS THE VALVE. THIS IS NON-NEGOTIABLE AND ALSO CORRECT — NOW THE HOUSE END NEEDS ITS VALVE FOUND, SOMEWHERE IN THE BARN\'S PLUMBING.']);
}
function turnValve() {
  const s = G.save, w = s.world;
  w.flags.valveWrong = (w.flags.valveWrong || 0) + 1;
  if (w.flags.valveWrong < 2) return say('SOMEWHERE, A TAP SINGS OPERA. THE GREENHOUSE STOVE GURGLES A WARNING. WRONG VALVE — THE HOUSE END IS STILL HIDING.');
  s.field.pipe = true; saveGame();
  say(['CONSTANCE, ARRIVING WITH A WRENCH AND THE AIR OF A WOMAN WHO HAS READ THE MANUAL: THAT ONE IS THE HOUSE. THIS ONE — THIS ONE IS THE FIELD.', 'THE VALVE TURNS. UNDER THE BARN, UNDER THE YARD, A PIPE FULL OF YEARS CLEARS ITS THROAT — AND WATER RUNS TO THE FIELD LIKE IT REMEMBERS THE WAY. THE PIPE IS IN.']);
}
function orderMulch() {
  const s = G.save, w = s.world;
  w.flags.mulchComing = s.day + 1; saveGame();
  say('ORDERED. IT WILL ARRIVE BY MORNING, THE WAY MULCH DOES: QUIETLY, AND ALL AT ONCE.');
}
function layTarp(bi) {
  const s = G.save, w = s.world;
  if (!projUse()) return;
  s.field.tarp[bi] = (w.flags.tarpPlaced || 0) >= 4 && !w.flags.tarpTorn ? 4 : 1;
  if (s.field.tarp[bi] === 4) { w.flags.tarpTorn = true; say('THE TARP TEARS ON A HIDDEN STONE — OF COURSE IT DOES, ON THE LAST STRETCH. IT WILL NEED A PATCH BEFORE IT COOKS.'); }
  else say('TARP DOWN. THE DARK BEGINS ITS SLOW ARGUMENT.');
  w.flags.tarpPlaced = (w.flags.tarpPlaced || 0) + 1; s.field.tarpDay[bi] = s.day; saveGame();
}
function patchTarp(bi) {
  const s = G.save;
  if (!projUse()) return;
  s.field.tarp[bi] = 1; s.field.tarpDay[bi] = s.day; saveGame();
  say('PATCHED. THE DARK RESUMES.');
}
function moveTarp(bi) {
  const s = G.save;
  if (!projUse()) return;
  s.field.tarp[bi] = 3; saveGame();
  say('TARP MOVED AND FOLDED. SECTION ' + (bi + 1) + ' IS CLEAR GROUND, READY FOR ROOTS. (' + s.field.tarp.filter(t => t === 3).length + ' OF 5)');
}
function fieldInteract(f) {
  const s = G.save, w = s.world;
  if (w.ch === 6 && w.step < 5) return say('THE FIELD, WAITING ON THE GLASS HOUSE. FIRST THE PLANTS LIVE. THEN THE FIELD.');
  if ((f.x === 23 || f.x === 24) && f.y === 16) { // the bad shed corner: dig here
    if (s.field.pipe) return say('THE OLD BURIED LINE RUNS FROM HERE, QUIET AND FULL OF ITSELF.');
    if (!w.flags.pipeFound) {
      return say('THE BAD SHED\'S CORNER, WHERE THE GROUND DIPS LIKE IT IS KEEPING SOMETHING.', which => { if (which === 0) digPipe(); }, ['DIG', 'NOT YET']);
    }
    return say('THE PIPE IS FOUND. THE HOUSE END STILL HIDES ITS VALVE — SOMEWHERE IN THE BARN, AMONG ITS PLUMBING.');
  }
  if (f.x === 1 && f.y === 13) { // the mulch pile
    if (!w.flags.mulchComing && s.field.mulch < 3) return say('THE MULCH PILE IS A MEMORY. A DELIVERY CAN BE ARRANGED — MULCH FINDS ITS WAY TO FIELDS LIKE NEWS TO A SMALL TOWN.', which => { if (which === 0) orderMulch(); }, ['ARRANGE A DELIVERY', 'NOT YET']);
    return say('THE MULCH PILE: ' + s.field.mulch + ' CARTLOADS OF TOMORROW\'S INSURANCE, SMELLING OF RAIN AND WOOD.');
  }
  const bands = [[1, 5], [6, 10], [11, 15], [16, 19], [20, 24]];
  const bi = bands.findIndex(([a, b]) => f.x >= a && f.x <= b);
  const rn = 1 + (f.y - 13) * 3 + Math.floor((f.x - 2) / 8); // the row this tile belongs to (1..12)
  const row = s.cropRows[rn - 1];
  const inRow = s.plants.filter(p => !p.memorial && p.row === rn);
  const sec = Math.floor((rn - 1) / 2), lv = s.field.weedLv[sec] || 0;
  if (inRow.length) {
    const opts = [];
    if ((w.ch === 10 && w.step === 2) || (w.ch === 11 && seasonOf(s.day).idx === 1)) opts.push('HARVEST THE ROW');
    if (w.ch >= 10 && seasonOf(s.day).idx === 3) opts.push('PRUNE THE ROW');
    if (lv > 0) opts.push('PULL THE WEEDS (LEVEL ' + lv + ')');
    opts.push('WATER THE ROW');
    if (!row.mulched) opts.push('MULCH IT (3 CARTS)');
    else if (s.compost >= 9 && row.yieldRating < 3) opts.push('FEED THE ROW (9 COMPOST)');
    opts.push('LEAVE IT');
    return say('ROW ' + rn + ': ' + inRow.length + ' BUSHES. ' + (row.mulched ? 'MULCHED. ' : 'UNMULCHED. ') + (lv > 0 ? 'WEEDS AT LEVEL ' + lv + ' IN THIS SECTION. ' : 'THE SECTION IS CLEAN. ') + inRow.map(p => p.name).slice(0, 4).join(', ') + (inRow.length > 4 ? '…' : ''), which => {
      const pick = opts[which];
      if (pick === 'HARVEST THE ROW') harvestRow(rn);
      else if (pick === 'PRUNE THE ROW') pruneRow(rn);
      else if (pick && pick.startsWith('PULL')) pullWeeds(sec);
      else if (pick === 'WATER THE ROW') { inRow.forEach(waterPlant); row.watered = true; if (w.ch === 9 && w.step <= 2) { (w.flags.blossomWatered = w.flags.blossomWatered || {})[rn] = true; } saveGame(); say('ROW ' + rn + ' WATERED, BUSH BY BUSH, NAME BY NAME.'); }
      else if (pick === 'MULCH IT (3 CARTS)') mulchRow(rn);
      else if (pick === 'FEED THE ROW (9 COMPOST)') feedRow(rn);
    }, opts);
  }
  const st = s.field.tarp[bi] || 0;
  if (st === 0) return say('TARP SECTION ' + (bi + 1) + ' OF 5. BLACK PLASTIC OVER LIVING GROUND: FOUR DAYS OF DARK, AND THE WEEDS UNDER IT GIVE UP THEIR NAMES.', which => { if (which === 0) layTarp(bi); }, ['LAY THE TARP', 'NOT YET']);
  if (st === 4) return say('THE TORN SECTION. A PATCH, A PRAYER, AND IT COOKS LIKE THE REST.', which => { if (which === 0) patchTarp(bi); }, ['PATCH IT', 'NOT YET']);
  if (st === 1) return say('THE TARP COOKS. DAY ' + Math.min(4, s.day - (s.field.tarpDay[bi] || s.day)) + ' OF 4. UNDERNEATH, A SMALL DARK SUMMER IS ENDING THINGS.');
  if (st === 2) return say('COOKED THROUGH. WHAT LIVES UNDER THERE NOW IS SOIL AND SILENCE.', which => { if (which === 0) moveTarp(bi); }, ['MOVE THE TARP', 'NOT YET']);
  // clear ground: the row work that remains
  if (lv > 0) return say('EMPTY GROUND, ROW ' + rn + ', AND THE WEEDS ARE MOVING IN AT LEVEL ' + lv + '.', which => { if (which === 0) pullWeeds(sec); }, ['PULL THE WEEDS', 'NOT YET']);
  if (w.ch === 11 && !inRow.length) {
    const stock = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE' && p.stage >= 3);
    if (stock.length) return say('EMPTY GROUND, ROW ' + rn + ', AND THE NURSERY SHELF HOLDS ' + stock.length + ' BUSHES READY FOR REAL GROUND.', which => { if (which === 0) plantNurseryRow(rn); }, ['PLANT THE NURSERY STOCK', 'NOT YET']);
  }
  if (row && !row.mulched) return say('CLEAR GROUND, ROW ' + rn + '. IT WANTS MULCH BEFORE IT WANTS PLANTS.', which => { if (which === 0) mulchRow(rn); }, ['MULCH IT (3 CARTS)', 'NOT YET']);
  return say('ROW ' + rn + ', READY. THE PLANTING GATE AT THE FENCE KNOWS WHAT REMAINS.');
}
function mulchRow(rn) {
  const s = G.save;
  if (s.field.mulch < 3) return say('NOT ENOUGH MULCH. THE PILE AT THE FIELD\'S CORNER KEEPS THE COUNT: ' + s.field.mulch + ' CARTS.');
  if (!projUse()) return;
  if (!projUse()) return;
  s.field.mulch -= 3; s.cropRows[rn - 1].mulched = true; saveGame();
  say('ROW ' + rn + ' MULCHED — THREE CARTLOADS DEEP. DRY DAYS WILL HAVE TO GO AROUND.');
}
function plantingGate() {
  const s = G.save, w = s.world, missing = [];
  if (s.day - (w.flags.repotDay || 0) < 5) missing.push('RECOVERY: ' + (s.day - (w.flags.repotDay || 0)) + ' OF 5 FED DAYS SINCE THE REPOTTING');
  const stock = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE' && p.stage >= 3);
  const declining = stock.filter(p => p.health >= 2);
  if (declining.length) missing.push(declining[0].name + (declining.length > 1 ? ' AND ' + (declining.length - 1) + ' MORE ARE' : ' IS') + ' STILL DECLINING — WATER AND DIRT, AND TIME');
  if (s.field.tarp.filter(t => t === 3).length < 4) missing.push('TARP: ' + s.field.tarp.filter(t => t === 3).length + ' OF 4 SECTIONS CLEARED');
  if (s.field.fenceSeg.filter(Boolean).length < 3) missing.push('FENCE: ' + s.field.fenceSeg.filter(Boolean).length + ' OF 4 SEGMENTS (3 WILL DO)');
  const unmulched = [0, 1, 2, 3, 4, 5, 6].filter(i => !s.cropRows[i].mulched);
  if (unmulched.length) missing.push('MULCH: ROWS ' + unmulched.map(i => i + 1).join(', ') + ' STILL BARE');
  return missing;
}
function doPlanting() {
  const s = G.save, w = s.world;
  const missing = plantingGate();
  if (missing.length) return say(['NOT YET. THE FIELD KEEPS ITS OWN CHECKLIST:', ...missing.map(m => '— ' + m)]);
  const stock = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE' && p.stage >= 3);
  const six = stock.filter(p => p.firstSix).sort((a, b) => a.slot - b.slot);
  const general = six.find(p => p.name === 'GENERAL');
  const rowOne = [];
  if (general) { rowOne.push(general); for (const p of six) if (p !== general) rowOne.push(p); }
  else for (const p of six) rowOne.push(p);
  const others = stock.filter(p => !p.firstSix).sort((a, b) => (b.stage - a.stage) || (b.tended - a.tended));
  while (rowOne.length < 6 && others.length) rowOne.push(others.shift());
  const lines = ['PLANTING DAY. THE AUGER SINGS. JEREMIAH WORKS ALONGSIDE, QUIET IN THE WAY OF A BOY WHO KNOWS THIS MATTERS.', 'ZOEY IS ALREADY IN THE HOUSE, HAVING GONE IN EARLY WITHOUT ANY DRAMA AT ALL, TAKING THE SMALL ONES WITH HER LIKE A PARADE.'];
  if (!general && sixPlants().some(p => p.name === 'GENERAL' && p.memorial)) {
    w.flags.markerStone = true;
    lines.push('AT THE HEAD OF ROW 1, FRANK READS THE GENERAL\'S MEMORIAL ALOUD, EVERY WORD, AND SETS A FLAT STONE WHERE THE BOOKEND WOULD HAVE STOOD.', 'CONSTANCE: HE GUARDS THE ROW ANYWAY. FRANK: HE DOES. HE ALWAYS DID LIKE THE END WITH THE VIEW.');
  }
  rowOne.forEach((p, i) => { p.location = 'ROW1'; p.row = 1; p.plantedDay = s.day; p.slot = i; if (!p.history.includes('PLANTED IN ROW 1')) p.history.push('PLANTED IN ROW 1'); });
  w.flags.bookend = rowOne.length ? rowOne[0].name : null;
  if (general) lines.push('THE GENERAL GOES IN FIRST, AT THE HEAD OF ROW 1 — THE BOOKEND, WHERE HE HAS ALWAYS STOOD IN EVERY LINE THIS FAMILY MAKES.');
  const byVar = { ECHO: [], CHANDLER: [], CLIMAX: [] };
  for (const p of others) (byVar[p.variety] || byVar.CHANDLER).push(p);
  const queue = [...byVar.ECHO, ...byVar.CHANDLER, ...byVar.CLIMAX];
  let rn = 2;
  for (const p of queue) { // round-robin over rows 2-7, by variety, strongest first
    let guard = 0;
    while (s.plants.filter(q => q.row === rn && !q.memorial).length >= 12 && guard++ < 6) rn = rn >= 7 ? 2 : rn + 1;
    p.location = 'ROW' + rn; p.row = rn; p.plantedDay = s.day;
    if (!p.history.includes('PLANTED IN ROW ' + rn)) p.history.push('PLANTED IN ROW ' + rn);
    rn = rn >= 7 ? 2 : rn + 1;
  }
  lines.push('THE COMPANY GOES INTO ROWS 2 THROUGH 7, BY VARIETY, IN THE ORDER OF THEIR STRENGTH. EVERY HOLE GETS A NAME SPOKEN OVER IT. EVERY NAME GETS WRITTEN DOWN.');
  lines.push('AND IN THE HEAT OF THE AFTERNOON FRANK NEARLY INSISTS JEREMIAH STAY AND FINISH — AND CATCHES HIMSELF, MID-SENTENCE, LIKE A MAN STEPPING BACK FROM A LEDGE HE BUILT.', 'FRANK: GO IN WHEN YOU ARE READY, SON. THE ROW WILL KEEP. (JEREMIAH STAYS A WHILE ANYWAY — HIS OWN CHOICE, WHICH IS A DIFFERENT AND BETTER THING — AND THEN GOES IN, BLESSED AND UNHURRIED.)');
  w.step = 6; saveGame();
  say(lines);
}
function repot() {
  const s = G.save, w = s.world;
  const lines = ['THE FRIEND AGAIN, ROLLING UP THE DRIVE WITH A TRUCK BED OF DIRT AND THE AIR OF A MAN DELIVERING WEATHER.', 'THE GARDENING FRIEND: YOUR PLANTS ARE NOT DYING OF HEAT, FRANK. THEY ARE DYING OF HUNGER IN A PLASTIC WORLD. PLANTS NEED DIRT. REAL DIRT, ALL THE WAY DOWN.', 'SO THEY REPOT. EVERY PLANT, OUT OF ITS LITTLE WORLD AND INTO A BIGGER ONE, WITH DIRT LIKE A COUNTRY. IT TAKES ALL DAY. IT TAKES ALL OF EVERYONE.'];
  const fed = w.flags.fedNames || [];
  let sixDied = null;
  if (!w.flags.mitAny) {
    const weak = sixPlants().filter(p => !p.memorial).sort((a, b) => (b.health - a.health) || (a.tended - b.tended))[0];
    if (weak) { weak.health = 3; }
  }
  for (const p of s.plants.filter(q => q.location === 'GREENHOUSE')) {
    if (p.memorial) continue;
    if (p.health >= 3) {
      if (fed.includes(p.name)) { p.health = 2; lines.push(p.name + ' WAS FED IN TIME — PULLED BACK IN THE REPOTTING, SORE AND ALIVE.'); }
      else if (p.firstSix && w.flags.mitAny) { p.health = 2; lines.push('CONSTANCE\'S HANDS FIND ' + p.name + ' IN THE FIRST HOUR AND DO NOT LET GO UNTIL IT IS IN DIRT AND DRINKING.'); }
      else { killPlant(p, 'THE HARD SPRING'); if (p.firstSix) sixDied = p; }
    }
  }
  if (sixDied) lines.push('CONSTANCE, QUIETLY, OVER ' + sixDied.name + '\'S HUSK: HE HELD ON LONGER THAN ANY OF THEM. REMEMBER THAT PART TOO, FRANK. (IT IS WRITTEN IN THE REGISTER, IN THE BACK, WHERE THE MEMORIALS LIVE.)');
  const survivors = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE');
  for (const p of survivors) if (!p.history.includes('THE HARD SPRING')) p.history.push('THE HARD SPRING');
  const gift = freshPlant(allocName(s.plants), { variety: 'CHANDLER', stage: 4, location: 'GREENHOUSE', sownDay: s.day, giftName: true, history: ['A GIFT FROM A FRIEND WHO SHOWS UP'] });
  s.plants.push(gift);
  lines.push('AND BEFORE THE FRIEND LEAVES: A BUSH FROM HIS OWN FIELD, IN A BUCKET, WITH ITS NAME ALREADY ON IT — ' + gift.name + '. SOME GIFTS YOU DO NOT ARGUE WITH. YOU WATER THEM.');
  lines.push('THE GLASS HOUSE BREATHES DIFFERENTLY BY EVENING. NOW: FIVE DAYS OF FEEDING AND WATER, WHILE THE FIELD GETS ITS TARP, ITS PIPE, ITS MULCH, ITS FENCE. THEN — PLANTING.');
  w.flags.repotDay = s.day; w.flags.repotReady = false; w.step = 5; saveGame();
  say(lines);
}
function ch6Opening() {
  say(['THE PROMISE IS WRITTEN. SPRING COMES TO BERRYHILL LIKE IT MEANS IT.', 'AND IN THE GLASS HOUSE, UNDER A SUN THAT HAS SUDDENLY REMEMBERED ITS STRENGTH, THE PLANTS BEGIN TO WILT.']);
}
function ch6Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.step <= 2) { // a crisis dawn: the glass house is an oven with a garden in it
    const slipped = [];
    const gh = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE');
    gh.forEach((p, i) => {
      if (s.field.vent) return;
      if ((w.flags.wasWatered || {})[p.name]) return;
      if (hashDay(s.day * 31 + i) % 5 < 2 && p.health < 3) { p.health++; slipped.push(p.name); }
    });
    if (Object.keys(w.flags.wasWatered || {}).length || s.field.vent || w.flags.mitDirtDay === s.day - 1) w.flags.mitAny = true;
    w.step++;
    const hints = ['WATER THEM — THE BENCH IN THE GLASS HOUSE POURS FOR EVERYONE AT ONCE.', 'THE VENT, OVER THE STOVE: OPEN IT AND LET THE HEAT OUT BY NAME.', 'FEED THE WEAKEST GOOD DIRT. TRIAGE IS LOVE WITH A LIST.'];
    return ['THE GLASS HOUSE IS AN OVEN THIS MORNING.' + (slipped.length ? ' ' + slipped.slice(0, 3).join(', ') + (slipped.length > 3 ? ' AND MORE' : '') + ' SLIPPED IN THE NIGHT.' : ' THEY HELD, THIS TIME.'), hints[(w.step - 1) % 3], 'THE CRISIS HAS THREE DAYS IN IT. THIS IS DAY ' + w.step + '.'];
  }
  if (w.step === 3) {
    w.step = 4; w.flags.repotReady = true; saveGame();
    return ['A TRUCK ROLLS UP THE DRIVE: THE GARDENING FRIEND, WITH DIRT, AND OPINIONS, AND BOTH ARE NEEDED.', 'THE GARDENING FRIEND: FRANK. YOUR PLANTS ARE STARVING IN PLASTIC. REPOT THEM — TODAY, ALL OF THEM. I BROUGHT THE DIRT. (THE REPOTTING WAITS AT THE GLASS HOUSE BENCH.)'];
  }
  if (w.step === 6) { // the first night
    const rowOne = s.plants.filter(p => !p.memorial && p.row === 1);
    const complete = s.field.fenceSeg.filter(Boolean).length >= 4;
    const weak = rowOne.slice().sort((a, b) => b.health - a.health)[0];
    startTrial({ foe: 'DEER', kind: 'deerFirstNight', pressure: complete ? 40 : 55, vigor: 30, graze: !complete, plantsList: rowOne.length ? rowOne : sixPlants(), msg: 'THE FIRST NIGHT. THE HERD COMES TO READ THE NEW FIELD — AND ' + (weak ? weak.name + ' IS ' + HEALTH_NAMES[weak.health] + ' TONIGHT, AT THE HEAD OF THE ROW' : 'THE ROW') + '. ALVIN TAKES HIS POST.' });
    return null;
  }
  if (w.step === 7) { completeChapter(6); return null; }
  return null;
}
TRIAL_OUTCOMES.deerFirstNight = {
  win(t) {
    const w = G.save.world; w.step = 7; saveGame();
    say(['THE HERD TURNS AT THE DOUBLE FENCE LIKE WEATHER AT A MOUNTAIN. THE FIELD KEEPS ITS FIRST NIGHT.', 'IN ROW 1, SIXTY HEARTBEATS SLOW DOWN. IN THE BARN, FRANK SLEEPS THE WHOLE NIGHT THROUGH, EVENTUALLY, MOSTLY.']);
  },
  lose(t, fled) {
    const s = G.save, w = s.world;
    const lines = ['THE HERD GETS IN. IT IS A BAD HOUR, AND THEN IT IS OVER.'];
    for (const p of (t.plantsList || [])) {
      if (p.memorial) continue;
      p.dirtCredit = 0;
      if (p.health >= 3) { killPlant(p, 'THE FIRST NIGHT'); lines.push(p.name + ' DID NOT SURVIVE THE NIGHT. IT IS WRITTEN IN THE BACK OF THE REGISTER, WITH THE REST OF THE TRUTH.'); }
      else p.health++;
    }
    if (s.cropRows[1]) s.cropRows[1].mowed = true;
    const seg = s.field.fenceSeg.findIndex(x => x);
    if (seg >= 0) { s.field.fenceSeg[seg] = 0; s.field.fence = s.field.fenceSeg.filter(Boolean).length; w.flags.breach = true; }
    lines.push('A ROW IS MOWED, A FENCE SEGMENT IS DOWN, AND THE FIELD LOOKS LIKE A PLACE WHERE SOMETHING HAPPENED. REPAIR IT. PLANTS HAVE SURVIVED WORSE CHAPTERS THAN THIS ONE.');
    w.step = 7; saveGame();
    say(lines);
  },
};
function smallestNursery() {
  const gh = G.save.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE');
  return gh.sort((a, b) => (a.stage - b.stage) || (a.tended - b.tended))[0] || null;
}
function barberStrike() {
  const p = smallestNursery();
  if (!p) return null;
  if (p.health < 3) p.health++;
  if (!p.history.includes('SHORN IN THE NIGHT')) p.history.push('SHORN IN THE NIGHT');
  saveGame();
  return p;
}
function ch7Opening() {
  say(['THE FIELD SETTLES INTO ITS FIRST SUMMER LIKE IT HAS ALWAYS BEEN THERE.', 'THE GREENHOUSE SHELF HOLDS THE LITTLE ONES NOW — THE NURSERY, FORMALLY, AS OF THIS WEEK. FRANK HAS MADE A SIGN. THE SIGN HAS A BORDER. THE BORDER HAS RULES.']);
}
function ch7Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.step === 0) {
    w.step = 1;
    const gift = s.plants.find(p => p.giftName && !p.memorial);
    const lines = ['FALL IS COMING INTO THE FIELD LIKE A RELATIVE WHO VISITS IN ORDER.'];
    if (gift) { if (!gift.history.includes('FIRST FALL — TURNED FIRST, DARK RED')) gift.history.push('FIRST FALL — TURNED FIRST, DARK RED'); lines.push('THE GIFT BUSH TURNS FIRST — DARK RED, ALL AT ONCE, LIKE IT HEARD SOMETHING. THE REST OF THE FIELD TAKES NOTES.'); }
    const p = barberStrike();
    if (p) lines.push('AND IN THE NURSERY: ' + p.name + ', THE SMALLEST, FOUND SHORN. CUT CLEAN, AT AN ANGLE, IN THE NIGHT. NO TRACKS. NO FUR. NO EXPLANATION.', 'CONSTANCE: WHATEVER IT IS, IT IS SMALL, AND IT IS PRECISE, AND IT HAS STARTED WITH THE SMALLEST. SET A WATCH, FRANK.');
    return lines;
  }
  if (w.step === 1) {
    if (w.watchRow === 'NURSERY') {
      w.flags.watchRight = (w.flags.watchRight || 0) + 1;
      if (w.flags.watchRight >= 2) {
        w.step = 2;
        const gh = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE');
        startTrial({ foe: 'BARBER', kind: 'barber', pressure: 30, vigor: 24, plantsList: gh.length ? gh : sixPlants(), msg: 'TWO QUIET NIGHTS UNDER ALVIN\'S WATCH — AND ON THE THIRD, A SHADOW AT THE SHELF, SMALL AND PRECISE AND CAUGHT. THE BARBER, AT LAST, IN THE OPEN!' });
        return null;
      }
      return ['A QUIET NIGHT IN THE NURSERY. ALVIN\'S EARS TURNED LIKE DISHES ALL NIGHT, AND NOTHING CAME. OR NOTHING DARED.'];
    }
    const p = barberStrike();
    w.flags.strikes = (w.flags.strikes || 0) + 1;
    if ((w.flags.strikes || 0) >= 2) {
      w.step = 2;
      const gh = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE');
      startTrial({ foe: 'BARBER', kind: 'barber', pressure: 40, vigor: 24, plantsList: gh.length ? gh : sixPlants(), msg: 'IT COMES IN DAYLIGHT THIS TIME — BOLD WITH PRACTICE. SMALL. PRECISE. SNIPPING AT THE SHELF LIKE IT OWNS SCISSORS AND A GRUDGE. ALVIN, AT LAST, HAS SOMETHING TO FACE!' });
      return null;
    }
    return [p ? 'SHORN AGAIN: ' + p.name + ', THE SMALLEST LEFT. THE CUTS ARE CLEAN. THE NURSERY IS AFRAID IN A TIDY, ORGANIZED WAY.' : 'A QUIET NIGHT.', 'SET THE WATCH WHERE THE SMALLEST SLEEP. AT THE BARN DOOR, AT REST: THE NURSERY.'];
  }
  if (w.step === 3) { completeChapter(7); return null; }
  return null;
}
TRIAL_OUTCOMES.barber = {
  win(t) {
    const w = G.save.world; w.step = 3; w.flags.barberKnown = true; saveGame();
    say(['IT IS GONE — OVER THE FENCE, UNDER THE GATE, SOMEWHERE SMALL AND PRECISE AND ELSEWHERE. ALVIN NEVER GOT A NAME FOR IT, OR A LOOK WORTH DESCRIBING.', 'IT WILL BE IN THE REGISTER ANYWAY, IN THE BACK: UNKNOWN — SMALL — PRECISE. SOME ENTRIES ARE WARNINGS. SOME ARE JUST TRUE.']);
  },
  lose(t, fled) {
    const s = G.save, w = s.world;
    const p = smallestNursery();
    if (p && !fled) { if (p.health < 3) p.health++; if (!p.history.includes('SHORN IN THE NIGHT')) p.history.push('SHORN IN THE NIGHT'); }
    w.step = 1; w.flags.strikes = 1; saveGame();
    say(['IT SLIPS AWAY BETWEEN ONE SNIP AND THE NEXT' + (p ? ', LEAVING ' + p.name + ' SHORN BEHIND IT' : '') + '.', 'IT WILL COME AGAIN. SO WILL ALVIN. THE NURSERY HOLDS ITS BREATH AND GROWS, QUIETLY, IN THE MEANTIME.']);
  },
};
function pullWeeds(sec) {
  const s = G.save, w = s.world;
  const lv = s.field.weedLv[sec] || 0;
  if (lv <= 0) return say('THIS SECTION IS CLEAN. THE WEEDS ARE ELSEWHERE, BEING SOMEONE ELSE\'S PROBLEM. SPECIFICALLY: FRANK\'S, IN ANOTHER SECTION.');
  if (!projUse()) return;
  const pay = [0, 1, 2, 4][lv];
  s.field.weedLv[sec] = lv - 1; s.compost += pay; saveGame();
  if (w.ch === 8 && !w.flags.taught) {
    w.flags.taught = true; saveGame();
    return say(['CONSTANCE, KNEELING LIKE A WOMAN BORN TO IT: NOT LIKE THAT. YOU ARE HARVESTING TOPS AND LEAVING ROOTS — THAT IS NOT WEEDING, THAT IS HAIRCUTS.', 'CONSTANCE: DOWN. LEVERAGE. THE WHOLE ROOT, WITH ITS LITTLE WHITE BEARD. A WEED PULLED RIGHT IS A WEED RETIRED. (+' + pay + ' COMPOST)']);
  }
  say('PULLED, ROOTS AND ALL. SECTION ' + (sec + 1) + ' DROPS TO LEVEL ' + (lv - 1) + '. (+' + pay + ' COMPOST)');
}
function feedRow(rn) {
  const s = G.save;
  if (s.compost < 9) return say('A ROW FEEDING TAKES 9 COMPOST. THE PILE SAYS ' + s.compost + '.');
  s.compost -= 9;
  const row = s.cropRows[rn - 1];
  row.yieldRating = Math.min(3, row.yieldRating + 1); row.fedStamp = seasonKey(); saveGame();
  say('ROW ' + rn + ' FED — NINE COMPOST WORKED IN AROUND THE ROOTS. THE BUSHES STAND LIKE THEY HAVE HEARD GOOD NEWS. (YIELD RATING ' + row.yieldRating + ' FOR THE SEASON)');
}
function proudWeedInteract() {
  const s = G.save, w = s.world;
  if (w.flags.proudChopped) return say('THE PROUD WEED LIES IN THREE PIECES, STILL PROUD. THE BURN PILE BY THE DRIVE WAITS FOR DUSK WORK.');
  if (w.flags.chopDay !== s.day) { w.flags.chops = 0; w.flags.chopDay = s.day; }
  w.flags.chops = (w.flags.chops || 0) + 1; saveGame();
  if (w.flags.chops >= 3) {
    w.flags.proudChopped = true; saveGame();
    return say(['THREE CHOPS, AND THE PROUD WEED — EIGHT FEET OF POISONOUS CONFIDENCE, SPARED ONCE OUT OF RESPECT — COMES DOWN LIKE A TREE IN A SMALL FOREST.', 'IT GOES TO THE BURN PILE BY THE DRIVE. ROOTS AND ALL, IT BURNS AT DUSK. SOME PLANTS YOU ADMIRE. SOME YOU ANSWER.']);
  }
  return say('CHOP ' + w.flags.chops + ' OF 3. THE PROUD WEED SHUDDERS AND STANDS. IT HAS BEEN SPARED BEFORE. IT EXPECTS IT AGAIN.');
}
function burnPileInteract() {
  const s = G.save, w = s.world;
  if (w.ch === 8 && w.flags.proudChopped && !w.flags.proudBurned) {
    w.flags.proudBurned = true; w.flags.proudRoots = true; w.step = 3; saveGame();
    return say(['THE BURN PILE AT DUSK: THE PROUD WEED GOES IN WITH ITS ROOTS, AND THE FAMILY WATCHES THE WAY YOU WATCH WEATHER LEAVE.', 'THE ROOTS\' PLACE BY THE FENCE IS MARKED IN THE REGISTER. THINGS THAT ARE ANSWERED CAN STILL BE REMEMBERED.', 'CONSTANCE: STRAWBERRIES NEXT, FRANK. SOMETHING SWEET, AFTER ALL THAT.']);
  }
  return say('THE BURN PILE. EVERY FIELD KEEPS ONE: A PLACE WHERE THE YEAR\'S ARGUMENTS GO TO BECOME ASH AND, EVENTUALLY, SOIL.');
}
function strawberryInteract() {
  const s = G.save, w = s.world;
  const have = s.plants.filter(p => p.variety === 'STRAWBERRY');
  if (have.length >= 4) { w.flags.strawDone = true; if (w.step === 3) w.step = 4; saveGame(); return say('THE STRAWBERRY PATCH: FOUR CLUMPS, SETTLED IN, ALREADY PLANNING THEIR RUNNERS.'); }
  const p = freshPlant(allocName(s.plants), { variety: 'STRAWBERRY', stage: 3, location: 'GARDEN', gardenState: 'NEW', sownDay: s.day, runners: true, history: ['A FOUNDING CLUMP OF THE FAMILY GARDEN'] });
  s.plants.push(p);
  if (!s.dex.garden.includes('STRAWBERRY')) s.dex.garden.push('STRAWBERRY');
  if (have.length + 1 >= 4) { w.flags.strawDone = true; w.step = 4; }
  saveGame();
  return say('STRAWBERRY CLUMP ' + (have.length + 1) + ' OF 4 GOES IN BY THE BARN, NAMED ' + p.name + ' ON THE SPOT. STRAWBERRIES DO NOT STAY WHERE YOU PUT THEM. THEY SEND RUNNERS, CLAIM GROUND, AND CALL IT HOME. FRANK RESPECTS THE STRATEGY.');
}
function butterflyPlant() {
  const s = G.save, w = s.world;
  const p = freshPlant('LAMPLIGHT', { variety: 'BUTTERFLY', stage: 4, location: 'GARDEN', gardenState: 'NEW', sownDay: 1, giftName: true, history: ['OPA NAMED IT IN THE OLD GARDEN, BEFORE ANY OF THIS', 'DUG FROM THE OLD YARD AND CARRIED HOME'] });
  s.plants.push(p);
  if (!s.dex.garden.includes('BUTTERFLY')) s.dex.garden.push('BUTTERFLY');
  w.flags.butterflyPlanted = true; w.step = 5; saveGame();
  return say(['THE BUTTERFLY BUSH GOES IN BY OMA\'S PATIO, WHERE SHE DIRECTED, ON THE ANNIVERSARY OF THE DAY THE HOUSE LOST OPA AND KEPT EVERYTHING HE PLANTED.', 'IT CARRIES THE NAME OPA GAVE IT IN THE OLD GARDEN: LAMPLIGHT. FRANK DOES NOT RENAME GIFTS. SOME NAMES ARE NOT HIS TO IMPROVE.', 'OMA, FROM THE DOOR: HE WOULD HAVE PRETENDED NOT TO WATCH IT BLOOM. HE WOULD HAVE WATCHED IT EVERY DAY.']);
}
function ch8Opening() {
  const s = G.save, w = s.world;
  if (s.field.weedLv.every(v => v === 0)) s.field.weedLv = [2, 3, 1, 2, 0, 3];
  say(['THE FIELD IS PLANTED, AND NOW THE FIELD IS CONTESTED. THE WEEDS HAVE READ THE SAME CALENDAR AS EVERYONE ELSE.', 'SIX SECTIONS. LEVELS OF OCCUPATION. CONSTANCE CALLS IT THE LONG WAR, AND SHE DOES NOT SMILE WHEN SHE SAYS IT, WHICH IS HOW FRANK KNOWS TO TAKE IT SERIOUSLY.']);
}
function ch8Dawn(ev) {
  const s = G.save, w = s.world, so = seasonOf(s.day);
  // the clear week is judged on how the field ENDED yesterday, before today's regrowth
  if (w.step === 5) {
    if (s.field.weedLv.every(v => v === 0)) {
      w.flags.clearStreak = (w.flags.clearStreak || 0) + 1;
      if (w.flags.clearStreak >= 7) { completeChapter(8); return null; }
      return ['EVERY SECTION AT ZERO. DAY ' + w.flags.clearStreak + ' OF 7. THE FIELD BREATHES LIKE A HELD NOTE.'];
    }
    w.flags.clearStreak = 0;
  }

  // the war itself: regrowth and pressure, in growing weather
  const seasonName = SEASON_NAMES[so.idx];
  if (seasonName !== 'WINTER') {
    const tick = seasonName === 'FALL' ? s.day % 7 === 0 : s.day % 4 === 0;
    if (tick) for (let i = 0; i < 6; i++) {
      const pinned = s.cropRows[i * 2].mulched && s.cropRows[i * 2 + 1].mulched;
      const cur = s.field.weedLv[i] || 0;
      s.field.weedLv[i] = pinned ? (cur === 0 ? 1 : cur) : Math.min(3, cur + 1); // mulch pins a section at 1: it may sprout, never climb
    }
    w.flags.lv3since = w.flags.lv3since || [null, null, null, null, null, null];
    for (let i = 0; i < 6; i++) {
      if (s.field.weedLv[i] >= 3) {
        if (w.flags.lv3since[i] == null) w.flags.lv3since[i] = s.day;
        else if (s.day - w.flags.lv3since[i] >= 7) {
          const inSec = s.plants.filter(p => !p.memorial && p.row && Math.floor((p.row - 1) / 2) === i).sort((a, b) => b.health - a.health)[0];
          if (inSec && inSec.health < 3) inSec.health++;
          w.flags.lv3since[i] = s.day;
        }
      } else w.flags.lv3since[i] = null;
    }
  }
  if (w.step === 0) { // the long war opens in person
    const worst = s.field.weedLv.indexOf(Math.max(...s.field.weedLv));
    const plantsList = s.plants.filter(p => !p.memorial && p.row && Math.floor((p.row - 1) / 2) === worst);
    startTrial({ foe: 'WEEDS', kind: 'weedsLongWar', pressure: 30, vigor: 34, waves: [30, 25], plantsList: plantsList.length ? plantsList : sixPlants(), msg: 'THE LONG WAR, IN PERSON: THE WEED LINE COMES OVER SECTION ' + (worst + 1) + ' LIKE A GREEN TIDE. ALVIN CHARGES THE FRONT OF IT!' });
    return null;
  }
  if (w.step === 1 && !w.flags.momDone && w.flags.momDay == null) {
    w.flags.momDay = s.day; saveGame();
    return ['A CAR IN THE DRIVE BEFORE THE COFFEE IS: FRANK\'S MOM, WITH A BASKET, A HAT, AND OPINIONS ABOUT THE DRIVEWAY PATCH.', 'SHE WILL SORT PLANTS WITH FRANK TODAY — TEN OF THEM, BY THE DRIVE. SOME LESSONS ONLY ARRIVE IN PERSON, WITH A BASKET.'];
  }
  return null;
}
TRIAL_OUTCOMES.weedsLongWar = {
  win(t) {
    const s = G.save, w = s.world;
    s.field.weedLv = s.field.weedLv.map(v => Math.max(0, v - 1));
    w.step = 1; saveGame();
    say(['THE LINE BREAKS. TWICE IT CAME, AND TWICE ALVIN WAS THE ARGUMENT IT COULD NOT ANSWER.', 'EVERY SECTION DROPS A LEVEL. THE LONG WAR IS NOT OVER — WARS OF WEEDS NEVER ARE — BUT THE FIELD HAS SEEN IT CAN BE WON. NOW: PULL, FEED, MULCH, AND KEEP IT WON.']);
  },
  lose(t, fled) {
    say(['THE TIDE KEEPS THE SECTION TONIGHT. THE WEEDS ARE NOT SORRY, AND THEY WILL BE BACK AT DAWN.', 'SO WILL ALVIN. IT IS, AS CONSTANCE SAYS, A LONG WAR — AND LONG WARS ARE WON BY THE SIDE THAT KEEPS SHOWING UP.']);
  },
};
function forsythiaPlant() {
  const s = G.save, w = s.world;
  const p = freshPlant('VESPER', { variety: 'FORSYTHIA', stage: 4, location: 'GARDEN', gardenState: 'NEW', sownDay: s.day, giftName: true, history: ['OMA NAMED IT. FRANK ONLY DUG.', 'CARRIED PAST HER WINDOW TO THE SPOT SHE CHOSE'] });
  s.plants.push(p);
  if (!s.dex.garden.includes('FORSYTHIA')) s.dex.garden.push('FORSYTHIA');
  w.flags.forsythiaPlanted = true; w.step = 1; saveGame();
  return say(['THE FORSYTHIA GOES IN WHERE OMA DIRECTED — IN SIGHT OF HER WINDOW, ON THE PATH SHE WALKS, WHERE SPRING WILL HAVE TO INTRODUCE ITSELF TO HER FIRST.', 'SHE NAMED IT HERSELF, FROM THE DOOR, WITHOUT BEING ASKED TWICE: VESPER. BECAUSE IT WILL GLOW AT DUSK, SHE SAYS, LIKE A LAMP LIT FOR VESPERS.', 'FRANK DIGS. THE NAMING, FOR ONCE, WAS NOT HIS TO DO, AND THE HOLE IS BETTER FOR IT.']);
}
function ch9Opening() {
  say(['YEAR THREE PUTS ON ITS COAT. THE FIELD HAS SURVIVED A WAR AND A WINTER, AND THE BUSHES ARE ROUND WITH BUDS LIKE HELD BREATH.', 'OMA HAS A REQUEST, AND A SPOT PICKED OUT, AND A NAME READY. VISIT HER.']);
}
function ch9Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.step === 1 && !w.flags.forsythiaBloomed) {
    w.flags.forsythiaBloomed = true;
    const f = s.plants.find(p => p.variety === 'FORSYTHIA');
    if (f) f.stage = 5;
    for (const p of s.plants) if (!p.memorial && p.row && p.stage === 4) { p.stage = 5; if (!p.blossomDay) p.blossomDay = s.day; }
    saveGame();
    return ['FIRST YELLOW.', 'OMA SEES IT FIRST — FROM HER WINDOW, BEFORE ANYONE IS AWAKE TO BE TOLD: THE FORSYTHIA, LIT LIKE A LAMP SOMEONE LEFT ON FOR A TRAVELLER.', 'AND THEN, ROW BY ROW, THE FIELD ANSWERS: CLIMAX FIRST, THEN ECHO, THEN CHANDLER — BLOSSOM, ALL OVER, ALL AT ONCE, LIKE THE WHOLE FIELD EXHALED.', 'BEES ARRIVE FROM NOWHERE IN PARTICULAR AND GET STRAIGHT TO WORK. WATER THE ROWS THIS WEEK. BLOSSOM IS THIRSTY WORK.'];
  }
  if (w.step === 1 && !w.flags.spectacular) {
    const living = s.plants.filter(p => !p.memorial && p.row);
    const all = s.plants.filter(p => p.row);
    const mostAll = all.slice().sort((a, b) => b.tended - a.tended)[0];
    let target = living.slice().sort((a, b) => (b.tended - a.tended) || (a.slot || 0) - (b.slot || 0))[0];
    const hope = living.find(p => p.name === 'HOPE');
    if (hope && living.length && hope.tended >= (target ? target.tended : 0)) target = hope;
    if (!target) { w.step = 2; return null; }
    if (target.stage < 5) { target.stage = 5; if (!target.blossomDay) target.blossomDay = s.day; }
    if (!target.history.includes('COVERED IN BLOSSOM, SPRING YEAR 3')) target.history.push('COVERED IN BLOSSOM, SPRING YEAR 3');
    w.flags.spectacular = target.name; w.step = 2; saveGame();
    const lines = [];
    if (mostAll && mostAll.memorial) lines.push('THE MOST-TENDED OF ALL OF THEM IS A NAME IN THE BACK PAGES NOW. THE MARKER GETS A MOMENT — ONE, GENTLE, BY NAME: ' + mostAll.name + '. THE FIELD REMEMBERS ITS OWN.');
    lines.push('AND THEN: ' + target.name + ', FOUND AT DAWN COVERED IN BLOSSOM — NOT A LEAF SHOWING, A BUSH MADE ENTIRELY OF FLOWER, LIKE IT WAS TRYING TO BE NOTICED BY HEAVEN.');
    if (target.history.includes('THE HARD SPRING')) lines.push('CONSTANCE, QUIETLY: THAT ONE NEARLY DIED IN A PLASTIC POT, FRANK. LOOK AT IT. JUST — LOOK AT IT.');
    lines.push('IT IS WRITTEN IN THE REGISTER IN FRANK\'S BEST HAND: COVERED IN BLOSSOM, SPRING YEAR 3.');
    lines.push('AND ON THE WIND, FROM THE NORTH, A RUMOUR THE RADIO CONFIRMS BY NOON: A LATE FROST IS COMING. THREE NIGHTS OF IT. SET THE WATCH AT THE FIELD GATE — ONE ROW A NIGHT.');
    return lines;
  }
  if (w.step === 2) {
    const night = (w.flags.frostNight || 0) + 1;
    if (night > 3) { // the reckoning: the account first, the card at the next dawn
      if (w.flags.reckoned) { completeChapter(9); return null; }
      w.flags.reckoned = true;
      const lines = ['THE RECKONING OF THE BLOSSOM.'];
      const losses = s.plants.filter(p => p.memorial && p.cause === 'THE LATE FROST');
      if (losses.length) lines.push('FIRST, THE LOSSES, BY NAME: ' + losses.map(p => p.name).join(', ') + '. THEY ARE IN THE BACK PAGES NOW, WITH THE REST OF THE TRUTH.');
      for (let rn = 1; rn <= 7; rn++) {
        const row = s.cropRows[rn - 1];
        const inRow = s.plants.filter(p => !p.memorial && p.row === rn);
        if (!inRow.length) continue;
        const watched = (w.flags.watchedRows || []).includes(rn);
        let fs = watched ? ((w.flags.frostResult || {})[rn] === 'win' ? 90 : 40) : 50;
        if (!watched && night > 3) { const weak = inRow.slice().sort((a, b) => b.health - a.health)[0]; if (weak && weak.health < 3) weak.health++; }
        if ((w.flags.blossomWatered || {})[rn]) fs += 20;
        row.fruitSet = Math.max(10, Math.min(100, fs));
      }
      saveGame();
      lines.push('THE FRUIT-SET IS COUNTED AND WRITTEN DOWN, ROW BY ROW. WHAT THE BLOSSOM PROMISED, THE SUMMER WILL NOW BE ASKED TO KEEP.');
      return lines;
    }
    w.flags.frostNight = night;
    const watch = w.flags.watchTonight;
    w.flags.watchTonight = null;
    if (watch) {
      w.flags.watchedRows = [...(w.flags.watchedRows || []), watch];
      const inRow = s.plants.filter(p => !p.memorial && p.row === watch);
      const weak = inRow.slice().sort((a, b) => b.health - a.health)[0];
      startTrial({ foe: 'FROST', kind: 'frostBlossom', pressure: 45, vigor: 32, snap: true, plantsList: inRow.length ? inRow : sixPlants(), msg: 'THE LATE FROST, NIGHT ' + night + ' OF 3. IT WALKS ROW ' + watch + ' LIKE IT OWNS THE DEED' + (weak ? ' — AND ' + weak.name + ' IS ' + HEALTH_NAMES[weak.health] + ' TONIGHT' : '') + '. ALVIN STANDS IN THE ROW AND DOES NOT BLINK.' });
      return null;
    }
    saveGame();
    return ['NIGHT ' + night + ' OF THE FROST, AND NO WATCH SET. THE COLD WALKS THE ROWS UNCHALLENGED, CHOOSING LIKE A SHOPPER.', 'THE FRUIT-SET WILL REMEMBER IT. SET THE WATCH AT THE GATE TOMORROW — WHAT IS LEFT OF TOMORROW.'];
  }
  return null;
}
TRIAL_OUTCOMES.frostBlossom = {
  win(t) {
    const s = G.save, w = s.world;
    const rn = (t.plantsList && t.plantsList[0] && t.plantsList[0].row) || 1;
    (w.flags.frostResult = w.flags.frostResult || {})[rn] = 'win'; saveGame();
    say(['THE FROST BREAKS ON ROW ' + rn + ' LIKE A WAVE ON A FENCE POST. THE BLOSSOM HOLDS — SINGED AT THE EDGES, HOLDING.', 'ALVIN COMES IN WITH FROST ON HIS WHISKERS AND THE AIR OF A DOG WHO HAS BEEN SOMEWHERE AND DONE SOMETHING.']);
  },
  lose(t, fled) {
    const s = G.save, w = s.world;
    const rn = (t.plantsList && t.plantsList[0] && t.plantsList[0].row) || 1;
    (w.flags.frostResult = w.flags.frostResult || {})[rn] = 'lose';
    const lines = ['THE FROST TAKES ROW ' + rn + ' FOR THE NIGHT.'];
    if (!fled) {
      const weak = (t.plantsList || []).filter(p => !p.memorial).sort((a, b) => b.health - a.health)[0];
      for (const p of (t.plantsList || [])) {
        if (p.memorial) continue;
        p.health++;
        if (p.health >= 4 || (p === weak && p.health >= 3)) { killPlant(p, 'THE LATE FROST'); lines.push(p.name + ' DID NOT SURVIVE THE NIGHT. IT WILL BE NAMED FIRST IN THE RECKONING, AND IN THE BACK PAGES, WITH HONOUR.'); }
      }
    }
    saveGame();
    say(lines);
  },
};
function pruneRow(rn) {
  const s = G.save, year = seasonOf(s.day).year;
  const row = s.cropRows[rn - 1];
  if (row.prunedYear === year) return say('ROW ' + rn + ' IS PRUNED FOR THIS WINTER. THE CANES STAND COUNTED: SEVEN TO TEN, THE CROSSING WOOD GONE.');
  if (!projUse()) return;
  row.prunedYear = year; saveGame();
  say(rn === 1 ? 'ROW 1 PRUNED, ALL SIX TOGETHER, THE WAY THEY DO EVERYTHING. KEEP SEVEN TO TEN CANES; THE CROSSING WOOD GOES FIRST. THE ROW WILL REMEMBER IT IN THE YIELD.' : 'ROW ' + rn + ' PRUNED. KEEP SEVEN TO TEN CANES; THE CROSSING WOOD GOES FIRST. NEXT YEAR\'S YIELD WILL TELL THE STORY.');
}
function plantNurseryRow(rn) {
  const s = G.save;
  const stock = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE' && p.stage >= 3).sort((a, b) => (b.stage - a.stage) || (b.tended - a.tended)).slice(0, 12);
  if (!stock.length) return say('THE NURSERY SHELF HOLDS NO ONE READY FOR REAL GROUND.');
  for (const p of stock) { p.location = 'ROW' + rn; p.row = rn; p.plantedDay = s.day; if (!p.history.includes('PLANTED IN ROW ' + rn)) p.history.push('PLANTED IN ROW ' + rn); }
  saveGame();
  say(stock.length + ' BUSHES GO INTO ROW ' + rn + ', NAMES SPOKEN OVER EVERY HOLE: ' + stock.slice(0, 4).map(p => p.name).join(', ') + (stock.length > 4 ? '…' : '') + '. THE FIELD FILLS THE WAY A FAMILY DOES: ONE NAME AT A TIME.');
}
function sowTrayLT() {
  const s = G.save, w = s.world;
  if (s.tray.n > 0) return say('THE TRAY IS ALREADY SOWN. WINTER WILL DO ITS SLOW WORK.');
  if (seasonOf(s.day).idx !== 3) return say('THE TRAY IS SOWN IN WINTER. THE FRIDGE KEEPS THE SEEDS\' CALENDAR, AND IT IS NOT WINTER.');
  s.tray.n = 40; s.tray.sownDay = s.day; s.tray.stratDays = 0; s.tray.ready = false; saveGame();
  say('FORTY SEEDS INTO THE TRAY, AND THE TRAY INTO THE FRIDGE, TO DREAM OF WINTER FROM INSIDE IT. THE PIPELINE RUNS FOREVER NOW. THAT IS THE POINT OF IT.');
}
function potUpLT() {
  const s = G.save;
  const made = Math.min(12, s.tray.n);
  const vars = ['ECHO', 'CHANDLER', 'CLIMAX'];
  const names = [];
  for (let i = 0; i < made; i++) {
    const p = freshPlant(allocName(s.plants), { variety: vars[(s.tray.pottedTotal + i) % 3], stage: 2, location: 'GREENHOUSE', sownDay: s.tray.sownDay || s.day, history: ['SOWN IN THE LONG TENDING'] });
    s.plants.push(p); names.push(p.name);
  }
  s.tray.n -= made; s.tray.pottedTotal += made;
  if (s.tray.n <= 0) { s.tray.ready = false; s.tray.n = 0; }
  saveGame();
  say(made + ' POTTED UP AND NAMED: ' + names.slice(0, 4).join(', ') + (names.length > 4 ? '…' : '') + '. THE NURSERY SHELF FILLS AGAIN. IT ALWAYS FILLS AGAIN.');
}
function shareStand() {
  const s = G.save, w = s.world, year = seasonOf(s.day).year;
  if (w.flags.standYear === year) return say('THE STAND HAS SHARED THIS YEAR\'S SURPLUS ALREADY. THE ROAD EATS WELL. THE SIGN BY THE GATE SAYS SO, IN FRANK\'S BEST PAINT.');
  const lbs = Math.floor((s.wine.poundsByYear[year] || 0) * 0.25);
  if (lbs <= 0) return say('NO SURPLUS YET THIS YEAR. THE STAND WAITS, SIGN PAINTED, BASKETS READY.');
  s.wine.shared = (s.wine.shared || 0) + lbs; w.flags.standYear = year; saveGame();
  say(lbs + ' LBS GO DOWN THE ROAD IN BASKETS — NEIGHBOURS, THE CHURCH TABLE, ANYONE WHO DRIVES SLOW PAST THE SIGN. THE CELLAR PAGE KEEPS THE COUNT: ' + s.wine.shared + ' LBS SHARED, ALL TOLD.');
}
function ltOpening() {
  const s = G.save, w = s.world;
  w.flags.ltStartYear = seasonOf(s.day).year; saveGame();
  say(['THE STORY IS DONE, AND THE FIELD IS NOT. THAT IS THE BEST KIND OF ENDING: THE KIND YOU GET TO KEEP LIVING IN.', 'THE SEASONS WILL KEEP THEIR ROUNDS — BLOSSOM, FRUIT, WINE, PRUNING, SNOW — AND THE REGISTER KEEPS ITS BACK PAGE OPEN, WITH GOALS WRITTEN IN PENCIL AND STAMPS EARNED IN INK.', 'TEND IT WELL. THERE IS NO LAST PAGE. THERE IS ONLY THE NEXT SEASON.']);
}
function ltDawn(ev) {
  const s = G.save, w = s.world, so = seasonOf(s.day);
  const pre = [];
  if (w.flags.wineNote) { pre.push(w.flags.wineNote); w.flags.wineNote = null; }
  if (s.tray.n > 0 && !s.tray.ready) {
    if (so.idx === 3) s.tray.stratDays = (s.tray.stratDays || 0) + 1;
    if ((s.tray.stratDays || 0) >= 10 && so.idx === 0) { s.tray.ready = true; pre.push('THE TRAY IN THE FRIDGE HAS DONE ITS WINTER AND WANTS POTTING. THE GLASS HOUSE BENCH, WHEN YOU ARE READY.'); }
  }
  if (pre.length && w.flags.seasonChanged == null) { saveGame(); return pre; }
  if (w.flags.seasonChanged != null) {
    const idx = w.flags.seasonChanged; w.flags.seasonChanged = null; saveGame();
    if (idx === 0) { // spring
      for (const p of s.plants) if (!p.memorial && p.row && p.stage === 4) { p.stage = 5; if (!p.blossomDay) p.blossomDay = s.day; p.fruitSetOk = true; }
      for (let rn = 1; rn <= 12; rn++) { const row = s.cropRows[rn - 1]; if (row.prunedYear === so.year - 1) { row.yieldRating = Math.min(3, (row.yieldRating || 1) + 1); row.prunedYear = null; } if (s.plants.some(p => !p.memorial && p.row === rn)) row.fruitSet = 60; }
      const lines = ['SPRING, AGAIN, TRUE AS A DOG. THE FORSYTHIA GOES FIRST, THE FIELD ANSWERS IN BLOSSOM, AND THE BEES FILE THEIR PAPERWORK.'];
      if (w.flags.proudRoots && !w.flags.proudShoot) { w.flags.proudShoot = true; lines.push('BY THE FENCE: ONE GREEN SHOOT, UP FROM THE PROUD WEED\'S ROOTS. EVERY YEAR, ONE. THE FIELD KEEPS ITS APPOINTMENTS.'); }
      if (!w.flags.goats && !w.flags.goatAppeal && so.year >= (w.flags.ltStartYear || so.year) + 1) { w.flags.goatAppeal = 'filed'; lines.push('A LETTER COMES FROM THE TOWN, IN A KINDER HAND THAN LAST TIME: THE ORDINANCE HAS BEEN REVISITED. AN APPEAL MAY BE FILED. FRANK FILES IT BEFORE THE INK ON THE ENVELOPE IS DRY.'); }
      else if (w.flags.goatAppeal === 'filed') { w.flags.goatAppeal = 'heard'; lines.push('THE APPEAL IS HEARD. THERE ARE FORMS. THERE ARE ALWAYS FORMS. THE FORMS, THIS TIME, ARE LOSING.'); }
      else if (w.flags.goatAppeal === 'heard' && !w.flags.goats) { w.flags.goats = true; lines.push('THE APPEAL SUCCEEDS. TWO GOATS ARRIVE BY TRAILER, SURVEY THE PEN BY THE GOOD SHED LIKE SMALL LANDLORDS, AND APPROVE IT. THEY GET A PAGE IN THE REGISTER, UNDER GARDEN, WHERE THE JOY IS KEPT.'); }
      saveGame();
      return [...pre, ...lines];
    }
    if (idx === 1) { // summer
      for (const p of s.plants) if (!p.memorial && p.row && p.stage === 5) { p.stage = 6; if (!p.fruitDay) p.fruitDay = s.day; }
      for (let rn = 1; rn <= 12; rn++) if (s.plants.some(p => !p.memorial && p.row === rn)) s.cropRows[rn - 1].ripeDay = s.day;
      saveGame();
      return ['SUMMER. THE FIELD TURNS BERRY-DARK AND THE BASKET BY THE BARN DOOR EMPTIES ITS SHADOW INTO THE ROWS. HARVEST WHEN READY.'];
    }
    if (idx === 2) { // fall
      const lines = ['FALL. THE GIFT BUSH TURNS FIRST, DARK RED, THE WAY IT ALWAYS DOES NOW — SOME PLANTS BECOME THE CALENDAR.'];
      if (s.wine.batches.some(b => b.year === so.year)) lines.push('THE YEAR\'S WINE IS TASTED AT THE TABLE IN THE EVENING — OMA\'S GLASS, THE PASTOR\'S WORD IF HE PASSES BY, AND THE CELLAR PAGE\'S VERDICT, KEPT.');
      saveGame();
      return lines;
    }
    if (idx === 3) { // winter: the bushes rest back to wood
      for (const p of s.plants) if (!p.memorial && p.row && p.stage === 6) p.stage = 4;
      saveGame();
      return ['WINTER. THE FIELD SLEEPS IN ROWS. PRUNE WHEN YOU ARE READY — SEVEN TO TEN CANES, THE CROSSING WOOD FIRST — AND LET THE TRAY DREAM IN THE FRIDGE.'];
    }
  }
  if (so.idx === 0 && hashDay(s.day) % 7 === 0) { // a spring frost night
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(rn => s.plants.some(p => !p.memorial && p.row === rn));
    if (rows.length) {
      const rn = rows[hashDay(s.day) % rows.length];
      const inRow = s.plants.filter(p => !p.memorial && p.row === rn);
      startTrial({ foe: 'FROST', kind: 'frostBlossom', pressure: 45, vigor: 32, snap: true, plantsList: inRow, msg: 'A LATE FROST, IN THE LONG TENDING, COMES FOR ROW ' + rn + ' LIKE IT PAYS RENT THERE. ALVIN — OLDER, NOT SLOWER — TAKES HIS POST.' });
      return null;
    }
  }
  if (hashDay(s.day) % 11 === 0) { // deer scouts, in the small hours
    const rowOne = s.plants.filter(p => !p.memorial && p.row === 1);
    startTrial({ foe: 'DEER', kind: 'deerScoutsLT', pressure: 15, vigor: 30, plantsList: rowOne.length ? rowOne : sixPlants(), msg: 'SCOUTS AT THE FENCE IN THE SMALL HOURS. ALVIN IS ALREADY THERE, AHEAD OF THE ALARM, AS ALWAYS.' });
    return null;
  }
  if (!w.flags.stamp900 && Object.values(s.wine.poundsByYear).some(v => v >= 900)) {
    w.flags.stamp900 = true; saveGame();
    return ['NINE HUNDRED POUNDS. THE NUMBER FRANK WROTE AT THE FENCE, IN THE YEAR OF THE FIRST HARVEST, IS A NUMBER THE FIELD HAS NOW PRODUCED IN A SINGLE YEAR.', 'IT GOES IN THE REGISTER IN INK, WITH A STAMP: 900. SOME NUMBERS BECOME PLANS. SOME PLANS BECOME YEARS. THIS ONE BECAME BOTH.'];
  }
  return null;
}
TRIAL_OUTCOMES.deerScoutsLT = {
  win(t) { say('THE SCOUTS LEAVE WITH A STORY ABOUT A DOG. THE FIELD KEEPS ITS NIGHT. SOME GUARDS NEVER RETIRE; THEY JUST NAP PROFESSIONALLY.'); },
  lose(t, fled) { say('THE SCOUTS GRAZE THE FENCE LINE AND GO. NO HARM WORTH WRITING DOWN — THE REGISTER LEAVES THE PAGE BLANK, WHICH IS ITS OWN KIND OF ENTRY.'); },
};
function ch4Opening() {
  say(['THE GLASS HOUSE IS SETTLED. THE FAMILY IS SETTLED. WHAT REMAINS IS THE FIELD ITSELF, AND A WINTER TO PLAN IN.', 'STAKES. STRING. A TAPE MEASURE. AND A TOWN CLERK WITH A RULEBOOK — BUT FIRST, THE FIELD. THE GATE SWINGS BOTH WAYS NOW.']);
}
function ch4Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.step === 2 && !w.flags.scoutsDone) {
    w.flags.scoutsDone = true;
    startTrial({ foe: 'DEER', kind: 'deerScouts', pressure: 30, vigor: 22, graze: true, plantsList: sixPlants(), msg: 'SCOUTS! TWO DEER AT THE FIELD GATE, READING THE STAKES LIKE A MENU! ALVIN IS ALREADY THERE!' });
    return null;
  }
  if (w.step === 3) {
    if (w.flags.fenceNotes) { completeChapter(4); return null; }
    return ['THE FENCE WILL NOT PRICE ITSELF. THE GOOD SHED HAS THE NOTES, AND FRANK HAS A PENCIL.'];
  }
  return null;
}
TRIAL_OUTCOMES.deerScouts = {
  win(t) { say(['THE SCOUTS RETREAT TO TELL THE HERD: THIS FIELD HAS A DOG, AND THE DOG HAS OPINIONS.', 'WORD WILL SPREAD. SO WILL THE DEER. BOTH ARE CERTAIN; ONLY THE TIMING IS NEGOTIABLE.']); },
  lose(t, fled) { say(['THE SCOUTS GRAZE A WHILE, UNHURRIED, AND LEAVE BY THE NORTH CORNER LIKE THEY PAY RENT.', 'NOTHING IS LOST BUT A MORNING AND SOME DIGNITY. THE FENCE QUESTION JUST GOT LOUDER.']); },
};
function ch5Opening() {
  say(['WINTER PLANS BECOME SPRING WORK. THE DOWNSTAIRS IS FINISHED EXCEPT THE STAIRS — AN APARTMENT SHOULD BE REACHABLE FROM INSIDE ITS OWN HOUSE.', 'THE STAIRS ARE UPSTAIRS, WHICH IS TO SAY: AT THE TOP OF THE STAIRS. FRANK WILL EXPLAIN THIS UNTIL IT IS TRUE.']);
}

function ch3Opening() {
  say(['THE RENTAL IS SMALL AND THE PLANTS HAVE THE WINDOW AND MOST OF THE TABLE.', 'THE AGENT CALLS: HER FRIEND HAS HEARD OF A PLACE. A BARN, OUTSIDE A TOWN CALLED BERRYHILL. LAND WITH IT. A FIELD, EVEN.', 'CONSTANCE: WE GO AND LOOK. QUIETLY. NO FALLING IN LOVE BEFORE THE ROOF IS INSPECTED.', 'FRANK: AGREED. COMPLETELY. (HE IS ALREADY IN LOVE. THE GATE BY THE ROAD WILL TAKE YOU THERE.)']);
}
function ch3Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.step === 0) { w.step = 1; return ['A BARN. LAND. A FIELD. THE WORDS GO AROUND THE RENTAL LIKE A CAT AROUND A CHAIR.', 'THE GATE BY THE ROAD, WHEN YOU ARE READY. CONSTANCE HAS ALREADY PACKED A TAPE MEASURE AND NO EXPECTATIONS.']; }
  if (w.step === 2) { w.step = 3; return null; } // a day of thinking it over
  if (w.step === 3) {
    w.step = 4;
    return ['ONE MORE HOUSE FAILS — A NICE HOUSE, WITH A YARD THE SIZE OF A RUG AND A NEIGHBOUR WITH A LEAF BLOWER AND A PHILOSOPHY.', 'CONSTANCE: THE BARN, FRANK.', 'FRANK: THE BARN WAS NEVER THE PLAN. THE FIELD WAS.', 'CONSTANCE: THEY COME AS A SET. THEY ALWAYS DID. THIS WEEKEND, THEN. THE TRUCK COMES SATURDAY. THE HOUSE DOOR, BACK IN DEERBROOK, WHEN YOU ARE READY.'];
  }
  if (w.step === 5) {
    if (w.flags.loadOrder === 'furniture' && !w.flags.plantsMoved) {
      w.flags.plantsMoved = true;
      for (const p of s.plants) if (!p.memorial && (p.location === 'BENCH' || p.location === 'WINDOW')) { p.wateredDays = Math.max(0, p.wateredDays - 1); p.location = 'OFFICE'; }
      w.step = 6; saveGame();
      return ['THE PLANTS SPENT THE NIGHT IN THE EMPTY HOUSE, IN THE COLD, AMONG THE ECHOES.', 'THEY ARE ALIVE. THEY ARE FINE. FRANK HAS APOLOGIZED TO EACH OF THEM BY NAME ANYWAY, AND ONE OF THE APOLOGIES HAD A SMALL SPEECH IN IT.', 'CONSTANCE: THEY FORGIVE YOU. PLANTS ARE LIKE THAT. NOW — A GLASS HOUSE FOR THEM, BEFORE ANYTHING ELSE.'];
    }
    if (w.flags.loadOrder === 'plants') { w.step = 6; return ['THE FURNITURE ARRIVES ON THE SECOND LOAD, SLIGHTLY OFFENDED AND ENTIRELY INTACT.', 'THE PLANTS ARE ALREADY ON THE OFFICE SHELF, ACTING LIKE THEY OWN THE BARN. NEXT: THE GREENHOUSE. ITS SITE IS STAKED, BY THE FIELD PATH.']; }
  }
  if (w.step === 8) { startGlassTrial(); return null; }
  if (w.step === 9) {
    completeChapter(3);
    return null;
  }
  return null;
}
function startGlassTrial() {
  const s = G.save;
  const gp = s.plants.filter(p => !p.memorial && p.location === 'GREENHOUSE');
  startTrial({ foe: 'FROST', kind: 'frostGlass', pressure: 35, vigor: 28, snap: true, plantsList: gp.length ? gp : sixPlants(), msg: 'THE FIRST NIGHT IN THE GLASS HOUSE, AND THE COLD COMES TO TEST THE SEAMS! ALVIN STANDS IN THE DOORWAY OF THE GREENHOUSE AND DARES IT!' });
}
TRIAL_OUTCOMES.frostGlass = {
  win(t) {
    G.save.world.step = 9; saveGame();
    say(['THE GLASS HOLDS. THE STOVE TICKS. BY MORNING THERE IS FROST ON THE OUTSIDE OF THE PANES AND NONE — NONE — ON THE INSIDE.', 'THE PLANTS HAVE A HOUSE. THE FAMILY HAS A BARN. THE FIELD HAS A FUTURE. EVERYONE SLEEPS.']);
  },
  lose(t, fled) {
    const s = G.save, w = s.world;
    if (fled) { say('ALVIN BACKS OFF. THE COLD KEEPS THE NIGHT; THE WAR CONTINUES TOMORROW.'); return; }
    w.step = 9;
    for (const p of t.plantsList || []) { if (!p.memorial) { p.wateredDays = 0; p.dirtCredit = 0; if (p.health < 3) p.health++; } }
    saveGame();
    say(['THE COLD FOUND A SEAM. BY MORNING THE GLASS HOUSE CROWD IS A DAY POORER AND A STEP SORER — BUT STANDING.', 'CONSTANCE: A HOUSE, LIKE A PLANT, TELLS YOU WHERE IT HURTS. WE SEAL THE SEAM. WE GO ON. THEY ARE ALL STILL HERE, FRANK.']);
  },
};

function houseInteract(f) {
  const s = G.save, w = s.world, ch = mapChar(f.x, f.y);
  // the moving boxes stand on floor tiles in the corner
  if (w.ch === 2 && w.step === 5 && f.y === 10 && f.x >= 15 && f.x <= 17 && (w.flags.trips || 0) < 3) {
    if (w.flags.tripDay === s.day) return say('ONE TRIP A DAY. THE VAN, AND FRANK, BOTH HAVE LIMITS.');
    return say('BOXES: BOOKS, JARS, AND ONE LABELED "MISC — DO NOT SHAKE (SEEDS?)".', which => { if (which === 0) storageTrip(); }, ['LOAD THE VAN', 'NOT YET']);
  }
  if (ch === 'r' && w.ch === 11 && seasonOf(s.day).idx === 3 && s.tray.n === 0) return sowTrayLT();
  if (ch === 'r') { // the fridge
    if (w.ch === 2 && w.step === 1 && !w.flags.fridgeTray) {
      return say('THE SECOND PACKET. BLUEBERRY SEEDS NEED A WINTER BEFORE THEY NEED A SPRING.', which => { if (which === 0) fridgeSeeds(); }, ['PUT THE SEEDS IN', 'NOT YET']);
    }
    if (w.flags.fridgeTray && !s.tray.ready) return say('THE TRAY SLEEPS IN THE COLD AND DARK. WINTER DAYS BANKED: ' + s.tray.stratDays + ' OF 10.');
    if (s.tray.ready) return say('THE FRIDGE IS JUST A FRIDGE AGAIN. ITS TENANTS MOVED TO THE SHELF.');
    return say('THE FRIDGE HUMS. INSIDE: LEFTOVERS, AND PLANS.');
  }
  if (ch === 'a') { // the window shelf
    if (f.x === 1) { // the tray end
      if (s.tray.ready && s.tray.n > 0) {
        return say('THE TRAY: ' + s.tray.n + ' SPROUTS, ALL UPRIGHT, ALL UNNAMED. THIS WILL NOT STAND.', which => {
          if (which === 0) potUp();
          else if (which === 1) waterShelf();
        }, ['POT UP A SPROUT', 'WATER THE SHELF', 'NOT NOW']);
      }
      if (s.tray.ready) return say('THE TRAY IS EMPTY. THE SHELF IS NOT.', which => { if (which === 0) waterShelf(); }, ['WATER THE SHELF', 'NOT NOW']);
      if (w.flags.fridgeTray) return say('AN EMPTY TRAY, WAITING FOR ITS TENANTS TO WAKE.');
      return say('A TRAY OF PEAT PELLETS, PATIENT AS JANUARY.');
    }
    if (f.x >= 2 && f.x <= 7) { // a member of the six, in window order
      const p = sixPlants().find(q => q.location === 'WINDOW' && q.slot === f.x - 2);
      if (p) return potInteract(p);
      return say('AN EMPTY SPOT ON THE SHELF. THE LIGHT HUMS OVER IT, HOPEFUL.');
    }
    // the grow-light end
    if (w.flags.coldComing && !w.flags.blanket) {
      return say('THE OLD WOOL BLANKET, FOLDED AND READY. TONIGHT WILL BE COLD ENOUGH TO ARGUE ABOUT.', which => {
        if (which === 0) { w.flags.blanket = true; saveGame(); say('TUCKED IN. THE SHELF CROWD SLEEPS UNDER WOOL AND GOOD WISHES.'); }
      }, ['TUCK THE BLANKET IN', 'NOT NOW']);
    }
    return say('THE GROW LIGHT HUMS ITS ONE NOTE, ALL DAY, LIKE IT IS PRACTICING.');
  }
  if (ch === 'e') { // the dining table
    if (w.ch === 2 && w.step === 8) {
      return say('THE SALE PAPERS. EVERYTHING THE HOUSE IS, IN A STACK THE SIZE OF A SANDWICH.', which => { if (which === 0) signSale(); }, ['SIGN THE PAPERS', 'NOT YET']);
    }
    if (w.flags.omaVisit) return say(['OMA, AT THE TABLE, WITH TEA SHE MADE HERSELF AT HOME AND BROUGHT ANYWAY:', 'OMA: YOU SELL THE HOUSE FOR DIRT, FRANK. YOUR OPA WOULD HAVE DONE THE SAME, AND DENIED IT AT SUPPER.', 'OMA: WHEN THE LAND COMES, I COME WITH IT. THERE IS A ROOM WITH MY NAME ON IT SOMEWHERE. THAT IS THE ARRANGEMENT.']);
    return say('THE TABLE WHERE SEEDS WERE COUNTED AND PLANS WERE MADE. IT HAS HEARD EVERYTHING TWICE.');
  }
  if (ch === 'h') return say('THE FIREPLACE. FRANK READS SEED CATALOGUES BY IT AND PRETENDS THEY ARE NOVELS.');
  if (ch === 'k') return say('THE COUNTER. A KETTLE, TWO MUGS, AND A NOTE IN CONSTANCE\'S HAND: "WE ARE NOT BUYING A GOAT."');
  if (ch === 'x') return say('UPSTAIRS: BEDROOMS, BOXES, AND THE GOOD QUIET.');
  return say('THE HOUSE, HOLDING ITS BREATH BETWEEN ONE LIFE AND THE NEXT.');
}
function waterShelf() {
  let n = 0;
  for (const p of G.save.plants) if (!p.memorial && p.location === 'WINDOW' && p.stage >= 1 && !p.watered) { waterPlant(p); n++; }
  saveGame();
  say(n ? 'THE WHOLE SHELF, END TO END. ' + n + ' DRINKS POURED. THE LIGHT APPROVES.' : 'EVERYONE ON THE SHELF IS ALREADY WATERED.');
}
function fridgeSeeds() {
  const s = G.save, w = s.world;
  w.flags.fridgeTray = true; s.tray.sownDay = s.day; saveGame();
  say(['INTO THE FRIDGE THEY GO — NINETY-SIX SEEDS IN A DAMP PAPER TOWEL, IN THE DARK, LIKE WINTER IN A BOX.', 'FRANK: SLEEP WELL, SMALL ONES. DREAM OF APRIL.', 'CONSTANCE: THEY ARE SEEDS, FRANK.', 'FRANK: AND APRIL IS COMING ANYWAY.']);
}
function storageTrip() {
  const s = G.save, w = s.world;
  w.flags.tripDay = s.day; w.flags.trips = (w.flags.trips || 0) + 1; saveGame();
  if (w.flags.trips >= 3) {
    w.step = 6; layoutNPCs();
    return say(['THE LAST LOAD GOES INTO STORAGE. THE HOUSE ECHOES NOW.', 'CONSTANCE TRIES THE ECHO WITH SOMETHING APPROVING. IT COMES BACK APPROVING.', 'NOW: A RENTAL, A WINTER, AND A FRIDGE FULL OF PROMISES.']);
  }
  say(['LOAD ' + w.flags.trips + ' OF 3: THE VAN SWALLOWS BOXES AND ASKS FOR MORE.', 'THE HOUSE GETS EMPTIER AND THE PLAN GETS REALER.']);
}
function potUp() {
  const s = G.save, w = s.world;
  if (!s.tray.ready || s.tray.n <= 0) return;
  const variety = s.tray.pottedTotal % 2 === 0 ? 'ECHO' : 'CHANDLER';
  const name = allocName(s.plants);
  const slot = 6 + s.plants.filter(p => p.location === 'WINDOW' && !p.firstSix).length;
  const p = freshPlant(name, { variety, stage: 2, sownDay: s.tray.sownDay, sproutedDay: s.day, location: 'WINDOW', slot, history: ['GERMINATED IN THE FRIDGE FLOOD'] });
  s.plants.push(p);
  s.tray.n--; s.tray.pottedTotal++;
  dexAdd('SPROUT', variety);
  saveGame();
  if (s.tray.pottedTotal === 1) {
    return say(['POTTING UP: ONE SPROUT, ONE POT, ONE NAME. FRANK DOES THE HONOURS IN A WHISPER, LIKE A CHRISTENING ON A TRAIN.', 'MEET ' + name + ', OF THE ' + variety + ' LINE. THE SHELF MAKES ROOM.', 'THERE ARE ' + s.tray.n + ' MORE IN THE TRAY. THE AFTERNOON IS YOUNG.']);
  }
  if (s.tray.n === 0) return finishPotting();
  toast('POTTED UP: ' + name + ' (' + variety + ') · ' + s.tray.n + ' TO GO');
}
function finishPotting() {
  const s = G.save, w = s.world;
  for (const p of sixPlants()) if (p.location === 'BENCH' && !p.memorial) p.location = 'WINDOW';
  s.germ = { sown: 96, potted: s.tray.pottedTotal, lost: 0 };
  w.step = 8; saveGame(); layoutNPCs();
  say(['THE LAST ONE IS POTTED. THE BENCH COMES IN FROM THE COLD TOO — THE SIX TAKE THE WINDOW IN ORDER, LIKE A ROLL CALL.', 'THE REGISTER RECORDS THE GERMINATION: 96 SOWN, ' + s.tray.pottedTotal + ' POTTED UP, EVERY ONE NAMED.', 'CONSTANCE: NOW THE HOUSE, FRANK. THE PAPERS ARE ON THE TABLE. THE LAND IS WAITING SOMEWHERE.']);
}
function signSale() {
  const s = G.save;
  say(['THE PAPERS ARE SIGNED AT THE TABLE WHERE THE SEEDS WERE COUNTED.', 'THE HOUSE IS SOLD. THE RENTAL IS SMALL AND WARM AND COMES WITH AN AGENT\'S PROMISE: "SUITABLE HOUSING" FOR EVERYONE, BY SPRING.', 'FRANK: SUITABLE HOUSING. FOR FORTY-ODD BLUEBERRY PLANTS.', 'CONSTANCE: THEY WILL FIND US LAND, FRANK. HOUSES FOLLOW LAND. THEY ALWAYS HAVE.'], () => completeChapter(2));
}

function renderArea() {
  ctx.fillStyle = '#17110c'; ctx.fillRect(0, 0, VW, VH);
  camX = Math.round(Math.max(0, Math.min(AW * TILE - VW, player.px + 8 - VW / 2)));
  camY = Math.round(Math.max(0, Math.min(AH * TILE - VH, player.py + 8 - VH / 2)));
  const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
  for (let ty = y0; ty <= y0 + 9; ty++) for (let tx = x0; tx <= x0 + 10; tx++) {
    if (tx < 0 || ty < 0 || tx >= AW || ty >= AH) continue;
    drawAreaTile(mapChar(tx, ty), tx * TILE - camX, ty * TILE - camY, tx, ty);
  }
  const spk = (mode === 'dialogue' && dlg) ? dlg.lines[dlg.idx] : null;
  const spkName = spk && dlg.chars < spk.text.length ? spk.name : null;
  player.talk = spkName === 'FRANK';
  const ents = [];
  for (const n of npcList) ents.push({ y: n.ty * TILE, draw: () => drawNPCFigure(n, n.tx * TILE - camX, n.ty * TILE - camY, spkName === n.name) });
  if (!alvinAway()) ents.push({ y: alvin.py, draw: () => charSprite(alvin, ALVIN_SET) });
  ents.push({ y: player.py, draw: () => charSprite(player, FRANK_SET) });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  drawAreaProps();
  ctx.fillStyle = 'rgba(20,26,20,0.8)'; ctx.fillRect(2, 2, 34, 9);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(2, 10, 34, 1);
  drawText('DAY ' + G.save.day, 4, 4, '#ffffff', 1);
}
function renderBerry() {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  camX = Math.round(Math.max(0, Math.min(AW * TILE - VW, player.px + 8 - VW / 2)));
  camY = Math.round(Math.max(0, Math.min(AH * TILE - VH, player.py + 8 - VH / 2)));
  const winter = seasonOf(G.save.day).idx === 3;
  const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
  for (let ty = y0; ty <= y0 + 9; ty++) for (let tx = x0; tx <= x0 + 10; tx++) {
    if (tx < 0 || ty < 0 || tx >= AW || ty >= AH) continue;
    const ch = mapChar(tx, ty), sx = tx * TILE - camX, sy = ty * TILE - camY;
    const sway = (Math.floor(perfNow * 1.5) + tx + ty) % 2 === 0;
    let base = TILES.grass;
    if (ch === 'g') { const h = (tx * 31 + ty * 17) % 9; base = h === 0 ? (sway ? TILES.tuftB : TILES.tuft) : h === 4 ? TILES.grass3 : h === 6 ? TILES.grass4 : h === 7 ? TILES.grass2 : TILES.grass; }
    if (winter && SNOW_TILES.grass) base = SNOW_TILES[base === TILES.tuft ? 'tuft' : base === TILES.tuftB ? 'tuftB' : base === TILES.grass3 ? 'grass3' : base === TILES.grass4 ? 'grass4' : base === TILES.grass2 ? 'grass2' : 'grass'] || base;
    ctx.drawImage(base, sx, sy);
    let t = TILES[TILEMAP[ch]];
    if (ch === 'o') t = sway ? TILES.flowerB : TILES.flower;
    if (winter && SNOW_TILES[TILEMAP[ch]]) t = SNOW_TILES[TILEMAP[ch]];
    if (t && TILEMAP[ch] !== 'grass') ctx.drawImage(t, sx, sy);
    if (ch === 'T') ctx.drawImage(winter && SNOW_TREE ? SNOW_TREE : TREE, sx, sy);
    if (ch === 's' && ty >= 13) { // the field: combed soil, waiting for stakes
      ctx.fillStyle = 'rgba(90,58,30,0.35)'; ctx.fillRect(sx, sy + 3, TILE, 1); ctx.fillRect(sx, sy + 10, TILE, 1);
    }
  }
  { // chapter 6 field furniture: tarp bands, fence run, mulch pile, the bad shed, planted rows
    const s6 = G.save, w6 = s6.world;
    if (w6.ch >= 6) {
      const bands = [[1, 5], [6, 10], [11, 15], [16, 19], [20, 24]];
      bands.forEach(([x0, x1], bi) => {
        const st = s6.field.tarp[bi] || 0;
        if (st === 1 || st === 4) { ctx.fillStyle = 'rgba(32,36,42,0.55)'; ctx.fillRect(x0 * TILE - camX, 13 * TILE - camY, (x1 - x0 + 1) * TILE, 4 * TILE); }
        if (st === 2) { ctx.fillStyle = 'rgba(32,36,42,0.3)'; ctx.fillRect(x0 * TILE - camX, 13 * TILE - camY, (x1 - x0 + 1) * TILE, 4 * TILE); ctx.fillStyle = '#e8e2d2'; ctx.fillRect(x0 * TILE - camX + 2, 13 * TILE - camY + 2, 6, 2); }
        if (st === 3) { ctx.fillStyle = 'rgba(122,90,160,0.25)'; ctx.fillRect(x0 * TILE - camX, 13 * TILE - camY, (x1 - x0 + 1) * TILE, 4 * TILE); }
      });
      ctx.fillStyle = '#8a6f45'; ctx.fillRect(1 * TILE - camX + 3, 13 * TILE - camY + 14, 10, 8); // the mulch pile
      ctx.fillStyle = '#5d4a30'; ctx.fillRect(1 * TILE - camX + 5, 13 * TILE - camY + 10, 6, 5);
      if (s6.world.flags.goats) { // the goats, in their pen by the good shed
        ctx.fillStyle = '#e8e2d2'; ctx.fillRect(23 * TILE - camX + 3, 5 * TILE - camY + 8, 9, 7); ctx.fillRect(24 * TILE - camX + 6, 6 * TILE - camY + 6, 8, 6);
        ctx.fillStyle = '#20242a'; ctx.fillRect(23 * TILE - camX + 4, 5 * TILE - camY + 9, 1, 1); ctx.fillRect(24 * TILE - camX + 12, 6 * TILE - camY + 7, 1, 1);
      }
      if (s6.world.flags.proudShoot) { ctx.fillStyle = '#3f7a2e'; ctx.fillRect(24 * TILE - camX + 7, 11 * TILE - camY + 16, 2, 8); }
      if (s6.world.ch >= 8) { // the burn pile, and the proud weed while it stands
        ctx.fillStyle = '#38322a'; ctx.fillRect(4 * TILE - camX + 4, 10 * TILE - camY + 16, 10, 6);
        ctx.fillStyle = '#5d4a30'; ctx.fillRect(4 * TILE - camX + 6, 10 * TILE - camY + 12, 6, 5);
        if ((s6.world.step || 0) >= 2 && !s6.world.flags.proudBurned) {
          const pw = 24 * TILE - camX, ph = 11 * TILE - camY;
          ctx.fillStyle = '#2e5a22'; ctx.fillRect(pw + 7, ph + 2, 3, 28);
          ctx.fillStyle = '#3f7a2e'; ctx.fillRect(pw + 2, ph + 6, 13, 4); ctx.fillRect(pw + 3, ph + 14, 11, 4);
          ctx.fillStyle = '#c94a6b'; ctx.fillRect(pw + 6, ph, 5, 5); // one poisonous flower, showing off
        }
      }
      // the tumbledown bad shed at the field's back corner
      ctx.fillStyle = '#4a4238'; ctx.fillRect(23 * TILE - camX, 16 * TILE - camY + 6, 2 * TILE, 10);
      ctx.fillStyle = '#38322a'; ctx.fillRect(23 * TILE - camX - 2, 16 * TILE - camY + 2, 2 * TILE + 4, 5);
      // the fence's second run, segment by segment
      ctx.fillStyle = '#c9c2ae';
      for (let sg = 0; sg < 4; sg++) if (s6.field.fenceSeg[sg]) ctx.fillRect((1 + sg * 6) * TILE - camX, 12 * TILE - camY + 12, 6 * TILE, 2);
      if (s6.world.ch === 9 && (s6.world.step === 1 || s6.world.step === 2)) { // bees, working the blossom
        ctx.fillStyle = '#ffd94a';
        for (let bi2 = 0; bi2 < 4; bi2++) {
          const bx = (3 + bi2 * 6) * TILE - camX + 8 + Math.sin(perfNow / 280 + bi2 * 2.1) * 5, by = 14 * TILE - camY + 6 + Math.cos(perfNow / 340 + bi2) * 3;
          ctx.fillRect(bx, by, 3, 2); ctx.fillStyle = '#e8e2d2'; ctx.fillRect(bx + 1, by - 1, 1, 1); ctx.fillStyle = '#ffd94a';
        }
      }
      // planted rows: little bushes, in their rows
      for (const p of s6.plants) {
        if (p.memorial || !p.location.startsWith('ROW')) continue;
        const rn = p.row || 1, idx = s6.plants.filter(q => q.row === rn && !q.memorial).indexOf(p);
        const px = (2 + (rn - 1) % 3 * 8 + (idx % 6)) * TILE - camX, py = (13 + Math.floor((rn - 1) / 3) + Math.floor(idx / 6) * 0) * TILE - camY;
        ctx.fillStyle = p.health >= 2 ? '#7a8a3a' : '#3f7a2e'; ctx.fillRect(px + 4, py + 6, 8, 6);
        ctx.fillStyle = '#2e5a22'; ctx.fillRect(px + 6, py + 3, 4, 4);
      }
    }
  }
  if (G.save.world.flags.staked) { // corner stakes and string over the field
    ctx.fillStyle = '#e8e2d2';
    for (const [sx2, sy2] of [[1, 13], [24, 13], [1, 16], [24, 16]]) ctx.fillRect(sx2 * TILE - camX + 6, sy2 * TILE - camY + 2, 3, 8);
    ctx.fillStyle = 'rgba(232,226,210,0.5)';
    for (let r2 = 0; r2 < 4; r2++) ctx.fillRect(1 * TILE - camX + 8, (13 + r2) * TILE - camY + 5, 23 * TILE - 8, 1);
  }
  if (G.save.world.ch >= 4) { // the inherited irises by the barn wall
    const ix = 6 * TILE - camX, iy = 5 * TILE - camY;
    ctx.fillStyle = '#3f7a2e'; ctx.fillRect(ix + 2, iy + 8, 12, 6); ctx.fillRect(ix + 18, iy + 8, 12, 6);
    ctx.fillStyle = '#7a5aa0'; ctx.fillRect(ix + 4, iy + 3, 3, 5); ctx.fillStyle = '#e8e2d2'; ctx.fillRect(ix + 20, iy + 3, 3, 5); ctx.fillStyle = '#ffd94a'; ctx.fillRect(ix + 12, iy + 4, 3, 4);
  }
  if (G.save.world.ch === 5 && (G.save.world.step || 0) >= 2 && !G.save.world.flags.patchCleared) { // the bramble patch
    const bx = 23 * TILE - camX, by = 6 * TILE - camY;
    ctx.fillStyle = '#2e4a26'; ctx.fillRect(bx + 1, by + 4, 30, 26);
    ctx.fillStyle = '#3f7a2e'; for (let i = 0; i < 6; i++) ctx.fillRect(bx + 3 + i * 5, by + 2 + (i % 3) * 3, 3, 8);
    ctx.fillStyle = '#20242a'; for (let i = 0; i < 4; i++) ctx.fillRect(bx + 6 + i * 7, by + 20 + (i % 2) * 4, 2, 2); // old berries, watching
  }
  // the greenhouse, in its three acts: site, frame and shell, glass house
  const bs = G.save.world.flags.buildStep || 0;
  if (G.save.world.ch >= 3) {
    const gx = 18 * TILE - camX, gy = 8 * TILE - camY;
    if (bs === 1) { ctx.strokeStyle = '#8a6f45'; ctx.fillStyle = '#8a6f45'; for (let i = 0; i < 5; i++) ctx.fillRect(gx + i * 16 + 2, gy + 2, 3, 44); ctx.fillRect(gx + 2, gy + 2, 78, 3); }
    else if (bs === 2) { ctx.fillStyle = 'rgba(190,220,245,0.5)'; ctx.fillRect(gx + 2, gy + 2, 76, 44); ctx.fillStyle = '#8a6f45'; for (let i = 0; i < 5; i++) ctx.fillRect(gx + i * 16 + 2, gy + 2, 3, 44); ctx.fillRect(gx + 2, gy + 2, 78, 3); ctx.fillRect(gx + 2, gy + 24, 78, 2); }
    else if (bs >= 3) { ctx.fillStyle = 'rgba(190,220,245,0.65)'; ctx.fillRect(gx + 2, gy + 2, 76, 44); ctx.fillStyle = '#e8f4fc'; for (let i = 0; i < 5; i++) ctx.fillRect(gx + i * 16 + 2, gy + 2, 2, 44); ctx.fillRect(gx + 2, gy + 2, 78, 2); ctx.fillStyle = '#5e4c36'; ctx.fillRect(gx + 36, gy + 34, 10, 12); }
  }
  const spk = (mode === 'dialogue' && dlg) ? dlg.lines[dlg.idx] : null;
  const spkName = spk && dlg.chars < spk.text.length ? spk.name : null;
  player.talk = spkName === 'FRANK';
  const ents = [];
  ents.push({ y: constance.py, draw: () => charSprite({ px: constance.tx * TILE, py: constance.ty * TILE, dir: constance.dir, moving: false, blinkOff: 1.9, talk: spkName === 'CONSTANCE' }, CONSTANCE_SET) });
  for (const n of npcList) ents.push({ y: n.ty * TILE, draw: () => drawNPCFigure(n, n.tx * TILE - camX, n.ty * TILE - camY, spkName === n.name) });
  if (!alvinAway()) ents.push({ y: alvin.py, draw: () => charSprite(alvin, ALVIN_SET) });
  ents.push({ y: player.py, draw: () => charSprite(player, FRANK_SET) });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  ctx.fillStyle = 'rgba(20,26,20,0.8)'; ctx.fillRect(2, 2, 34, 9);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(2, 10, 34, 1);
  drawText('DAY ' + G.save.day, 4, 4, '#ffffff', 1);
}
function drawAreaTile(ch, sx, sy, tx, ty) {
  if (area === 'house' || area === 'barnIn' || area === 'oma') return drawHouseTile(ch, sx, sy, tx, ty);
  if (area === 'green') return drawGreenTile(ch, sx, sy, tx, ty);
  ctx.fillStyle = '#2a2f26'; ctx.fillRect(sx, sy, TILE, TILE);
}
function drawGreenTile(ch, sx, sy, tx, ty) {
  ctx.drawImage(TILES.soil, sx, sy); // gravel-and-earth floor
  ctx.fillStyle = 'rgba(120,90,60,0.25)'; ctx.fillRect(sx, sy + 12, TILE, 1);
  if (ch === 'z' || ch === 'D') { if (ch === 'D') { ctx.fillStyle = '#5e7a4a'; ctx.fillRect(sx + 1, sy + 4, 14, 9); } return; }
  if (ch === 'H') { // glass: pale panes in a white frame, sky showing through
    ctx.fillStyle = '#bcd9f2'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#dceefb'; ctx.fillRect(sx + 2, sy + 2, 5, 5);
    ctx.fillStyle = '#f4f8fc'; ctx.fillRect(sx, sy, TILE, 1); ctx.fillRect(sx, sy + 15, TILE, 1); ctx.fillRect(sx, sy, 1, TILE); ctx.fillRect(sx + 15, sy, 1, TILE);
    return;
  }
  if (ch === 'a') { // a bench: slatted wood at working height
    ctx.fillStyle = '#8a6f45'; ctx.fillRect(sx, sy + 6, TILE, 4);
    ctx.fillStyle = '#a8895c'; ctx.fillRect(sx, sy + 6, TILE, 1);
    ctx.fillStyle = '#5e4c36'; ctx.fillRect(sx + 2, sy + 10, 2, 6); ctx.fillRect(sx + 12, sy + 10, 2, 6);
    return;
  }
  if (ch === 'h') { // the little stove
    ctx.fillStyle = '#3a3f4a'; ctx.fillRect(sx + 2, sy + 5, 12, 11);
    ctx.fillStyle = '#2a2d33'; ctx.fillRect(sx + 7, sy - 4, 3, 9);
    const lit = G.save.world.flags.heaterLit;
    ctx.fillStyle = lit ? '#e07b2a' : '#20242a'; ctx.fillRect(sx + 5, sy + 9, 6, 4);
    if (lit) { ctx.fillStyle = '#ffd94a'; ctx.fillRect(sx + 7, sy + 10, 2, 2); }
    return;
  }
}
function drawHouseTile(ch, sx, sy, tx, ty) {
  // warm wood floor everywhere first
  ctx.fillStyle = '#9a6b42'; ctx.fillRect(sx, sy, TILE, TILE);
  ctx.fillStyle = '#8a5f38'; ctx.fillRect(sx, sy + 7, TILE, 1); ctx.fillRect(sx + ((tx * 7 + ty * 3) % 9), sy, 1, 7);
  if (ch === 'z') return;
  if (ch === 'Z') { // the rug: deep red, bordered, worn in the middle
    ctx.fillStyle = '#8e3b34'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#a34a41'; ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = '#8e3b34'; ctx.fillRect(sx + 5, sy + 5, TILE - 10, TILE - 10);
    return;
  }
  if (ch === 'H') { // interior wall: warm cream over wainscot
    ctx.fillStyle = '#6b5136'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#e6d9bd'; ctx.fillRect(sx, sy, TILE, 9);
    ctx.fillStyle = '#cbb894'; ctx.fillRect(sx, sy + 9, TILE, 1);
    return;
  }
  if (ch === 'a') { // the window shelf: pale wood under a bright window
    ctx.fillStyle = '#cfe4f7'; ctx.fillRect(sx, sy, TILE, 9);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(sx + 2, sy + 2, 4, 3);
    ctx.fillStyle = '#a8895c'; ctx.fillRect(sx, sy + 9, TILE, 7);
    ctx.fillStyle = '#8a6f45'; ctx.fillRect(sx, sy + 14, TILE, 2);
    return;
  }
  if (ch === 'r') { // the fridge: tall, white, humming faintly with importance
    ctx.fillStyle = '#eef1f4'; ctx.fillRect(sx + 1, sy - 6, 14, 22);
    ctx.fillStyle = '#c9ced4'; ctx.fillRect(sx + 1, sy + 3, 14, 1);
    ctx.fillStyle = '#8a919c'; ctx.fillRect(sx + 12, sy - 3, 2, 5); ctx.fillRect(sx + 12, sy + 5, 2, 7);
    ctx.fillStyle = '#ffd94a'; ctx.fillRect(sx + 3, sy - 4, 4, 5); // a note, held by a magnet
    ctx.fillStyle = '#b03030'; ctx.fillRect(sx + 4, sy - 5, 2, 2);
    return;
  }
  if (ch === 'k') { // kitchen counter
    ctx.fillStyle = '#7a6248'; ctx.fillRect(sx, sy + 4, TILE, 12);
    ctx.fillStyle = '#d8cfc0'; ctx.fillRect(sx, sy + 2, TILE, 4);
    ctx.fillStyle = '#5e4c36'; ctx.fillRect(sx + 3, sy + 9, 10, 1);
    return;
  }
  if (ch === 'j') { // Frank's desk, and the journal that lives on it now
    ctx.fillStyle = '#7a6248'; ctx.fillRect(sx, sy + 5, TILE, 11);
    ctx.fillStyle = '#8a2f2a'; ctx.fillRect(sx + 3, sy + 1, 9, 5);
    ctx.fillStyle = '#f8f0d8'; ctx.fillRect(sx + 4, sy + 2, 7, 3);
    ctx.fillStyle = '#8a919c'; ctx.fillRect(sx + 5, sy + 3, 5, 1);
    ctx.fillStyle = '#ffd94a'; ctx.fillRect(sx + 13, sy + 4, 3, 1);
    return;
  }
  if (ch === 'h') { // the fireplace
    ctx.fillStyle = '#7a4636'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#5e3427'; ctx.fillRect(sx + 3, sy + 6, 10, 10);
    const fl = Math.floor(perfNow * 6) % 2;
    ctx.fillStyle = '#e07b2a'; ctx.fillRect(sx + 5, sy + 10 - fl, 6, 5 + fl);
    ctx.fillStyle = '#ffd94a'; ctx.fillRect(sx + 7, sy + 11 - fl, 2, 3 + fl);
    return;
  }
  if (ch === 'e') { // the dining table
    ctx.fillStyle = '#8a5f38'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#e8e2d2'; ctx.fillRect(sx + 1, sy + 3, TILE - 2, 9);
    ctx.fillStyle = '#c9bfa8'; ctx.fillRect(sx + 1, sy + 11, TILE - 2, 1);
    return;
  }
  if (ch === 'm') { // a bed, made up neat
    ctx.fillStyle = '#7a4636'; ctx.fillRect(sx, sy + 2, TILE, 12);
    ctx.fillStyle = '#e8e2d2'; ctx.fillRect(sx + 1, sy + 3, TILE - 2, 4);
    ctx.fillStyle = '#8e3b34'; ctx.fillRect(sx + 1, sy + 7, TILE - 2, 6);
    return;
  }
  if (ch === 'x') { // stairs up: bedrooms and boxes
    ctx.fillStyle = '#6b5136'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#8a6f45'; ctx.fillRect(sx, sy + 10, TILE, 3); ctx.fillRect(sx, sy + 5, TILE, 3); ctx.fillRect(sx, sy, TILE, 3);
    return;
  }
  if (ch === 'D') { // the door mat
    ctx.fillStyle = '#5e7a4a'; ctx.fillRect(sx + 1, sy + 4, 14, 9);
    ctx.fillStyle = '#4a6339'; ctx.fillRect(sx + 3, sy + 6, 10, 5);
    return;
  }
}
function drawAreaProps() {
  if (area === 'barnIn' && G.save.wine.jar) { // the jar, breathing on the kitchen counter
    const jx = 9 * TILE - camX, jy = 2 * TILE - camY;
    ctx.fillStyle = '#b8c8ce'; ctx.fillRect(jx + 3, jy + 4, 10, 12);
    ctx.fillStyle = G.save.wine.jar.phase === 'done' ? '#7a2f4a' : '#a03a54'; ctx.fillRect(jx + 4, jy + 8, 8, 7);
    ctx.fillStyle = '#e8e2d2'; ctx.fillRect(jx + 5, jy + 2, 6, 3);
  }
  if (area === 'barnIn') { // Frank's office: the six on the shelf, the company as small pots
    const s2 = G.save;
    for (const p of s2.plants) {
      if (p.location !== 'OFFICE' || p.memorial) continue;
      if (p.slot != null && p.slot < 6) {
        const sx = (2 + p.slot) * TILE - camX, sy = 1 * TILE - camY;
        ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], sx, sy - 3, 14, 14);
        if (p.watered) { ctx.fillStyle = '#3b6fe0'; ctx.fillRect(sx + 11, sy - 6, 2, 3); }
      }
    }
    const comp = s2.plants.filter(p => p.location === 'OFFICE' && !p.memorial && (p.slot == null || p.slot >= 6));
    comp.slice(0, 9).forEach((p, i) => {
      const sx = (11 + (i % 3)) * TILE - camX, sy = (2 + Math.floor(i / 3)) * TILE - camY;
      ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], sx + 3, sy + 3, 10, 10);
    });
    return;
  }
  if (area === 'green') { // the benches, north and south
    const s2 = G.save;
    const gp = s2.plants.filter(p => p.location === 'GREENHOUSE' && !p.memorial);
    gp.slice(0, 20).forEach((p, i) => {
      const north = i < 10;
      const sx = (1 + (i % 10)) * TILE - camX, sy = (north ? 1 : 5) * TILE - camY;
      ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], sx + 1, sy - 4, 13, 13);
      if (p.watered) { ctx.fillStyle = '#3b6fe0'; ctx.fillRect(sx + 11, sy - 7, 2, 3); }
      if (p.health >= 2) { ctx.fillStyle = '#e0483e'; ctx.fillRect(sx + 12, sy + 6, 3, 3); }
    });
    return;
  }
  if (area === 'oma' && G.save.world.flags.stairsBuilt) { // the new stairs, in the corner
    const sx = 10 * TILE - camX, sy = 6 * TILE - camY;
    ctx.fillStyle = '#6b5136'; ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = '#8a6f45'; ctx.fillRect(sx, sy + 10, TILE, 3); ctx.fillRect(sx, sy + 5, TILE, 3); ctx.fillRect(sx, sy, TILE, 3);
  }
  if (area === 'oma') { // the photograph on the shelf, facing the room
    const sx = 2 * TILE - camX, sy = 1 * TILE - camY;
    ctx.fillStyle = '#5e4c36'; ctx.fillRect(sx + 3, sy + 1, 9, 8);
    ctx.fillStyle = '#e8e2d2'; ctx.fillRect(sx + 4, sy + 2, 7, 6);
    ctx.fillStyle = '#8a919c'; ctx.fillRect(sx + 6, sy + 4, 3, 4);
    return;
  }
  if (area !== 'house') return;
  const s = G.save;
  // plants on the window shelf, in their slots; the tray at the west end
  for (const p of s.plants) {
    if (p.location !== 'WINDOW' || p.memorial) continue;
    const sx = (2 + (p.slot || 0)) * TILE - camX, sy = 1 * TILE - camY;
    ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], sx, sy - 3, 14, 14);
    if (p.watered) { ctx.fillStyle = '#3b6fe0'; ctx.fillRect(sx + 11, sy - 6, 2, 3); }
    if (p.husk) { ctx.fillStyle = '#5a5148'; ctx.fillRect(sx + 3, sy, 8, 3); }
  }
  if (s.tray.n > 0 || s.world.flags.fridgeTray) {
    const sx = 1 * TILE - camX, sy = 1 * TILE - camY;
    ctx.fillStyle = '#5e4c36'; ctx.fillRect(sx + 1, sy + 6, 14, 6);
    ctx.fillStyle = s.tray.ready ? '#7ed957' : '#c9b18a';
    for (let i = 0; i < 5; i++) ctx.fillRect(sx + 2 + i * 3, sy + 4, 2, 3);
  }
  // the great emptying: boxes multiply, then vanish, as the trips are made
  const trips = s.world.flags.trips || 0;
  if (s.world.ch === 2 && s.world.step >= 5 && trips < 3) {
    for (let i = 0; i < 3 - trips; i++) {
      const sx = (15 + i) * TILE - camX, sy = 10 * TILE - camY;
      ctx.fillStyle = '#b08d57'; ctx.fillRect(sx + 1, sy + 3, 13, 11);
      ctx.fillStyle = '#8a6f45'; ctx.fillRect(sx + 1, sy + 8, 13, 1); ctx.fillRect(sx + 7, sy + 3, 1, 11);
    }
  }
  if (s.world.ch === 2 && s.world.step >= 8) { // the sale papers wait on the table
    const sx = 10 * TILE - camX, sy = 5 * TILE - camY;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(sx + 3, sy + 5, 10, 7);
    ctx.fillStyle = '#8a919c'; ctx.fillRect(sx + 5, sy + 7, 6, 1); ctx.fillRect(sx + 5, sy + 9, 6, 1);
  }
}

function layoutNPCs() { npcList = npcsFor(area); }

/* ============================== STATE ============================== */
const STAGE_NAMES = ['EMPTY', 'SEED', 'SPROUT', 'SEEDLING', 'BUSH', 'BLOSSOM', 'FRUITING'];
const MAX_VIGOR = [0, 0, 22, 28, 36, 32, 40]; // Blossom dips: a flowering bush is tender
/* Seasons: 56-day years, 14-day seasons (spec 0.1). Everything seasonal —
   growth gates, chill, rain, the yard's snow — reads this one function. */
const SEASON_NAMES = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];
function seasonOf(day) {
  const doy = ((day - 1) % 56) + 1;
  return { year: Math.floor((day - 1) / 56) + 1, idx: Math.floor((doy - 1) / 14), dos: ((doy - 1) % 14) + 1, doy };
}
function hashDay(n) { let x = (n * 374761393 + 668265263) >>> 0; x = Math.imul(x ^ (x >>> 13), 1274126177) >>> 0; return (x ^ (x >>> 16)) >>> 0; }
const SIX_VARIETY = ['ECHO', 'ECHO', 'CHANDLER', 'CHANDLER', 'CHANDLER', 'CHANDLER'];
const HEALTH_NAMES = ['FINE', 'STRESSED', 'DECLINING', 'CRITICAL', 'DEAD'];
const DRY_THRESH = { pot: [2, 3, 4], garden: [4, 6, 8], field: [5, 8, 11] }; // dry days to STRESSED/DECLINING/CRITICAL, by housing
/* Frank's naming pools, in the order he reaches for them: the ranks he has
   not used, the virtues he has not used, then the deep bench of good names.
   A trailing 2 is an honour suffix — ADMIRAL2 is christened ADMIRAL II. */
const NAME_POOLS = [
  ['ENSIGN', 'LIEUTENANT', 'MAJOR', 'COLONEL', 'SERGEANT', 'CORPORAL', 'PRIVATE', 'COMMODORE', 'BRIGADIER', 'SCOUT'],
  ['MERCY', 'GRACE', 'JOY', 'PEACE', 'KINDNESS', 'FAITH', 'CHARITY', 'TEMPERANCE', 'COURAGE', 'HUMILITY'],
  ['BUTTON', 'BISCUIT', 'PICKLE', 'MARBLE', 'ACORN', 'PEBBLE', 'WIDGET', 'SPROCKET', 'MITTEN', 'POCKET', 'LANTERN', 'COMPASS', 'ANCHOR', 'BEACON', 'HARBOUR', 'SUMMIT', 'EMBER', 'CLOVER', 'FERN', 'JUNIPER', 'MAGPIE', 'WREN', 'FINCH', 'OTTER', 'BADGER', 'MARMALADE', 'TOFFEE', 'BRAMBLE', 'HAZEL', 'ROWAN', 'ALDER', 'BIRCH', 'CEDAR', 'MAPLE', 'WILLOW', 'POPLAR', 'THISTLE', 'HEATHER', 'BRIAR', 'TANSY', 'SORREL', 'CHIVE', 'BASIL', 'MINTY', 'PARSLEY', 'DILL', 'FENNEL', 'OKRA', 'QUINCE', 'MEDLAR', 'SLOE', 'HUCKLE', 'BILBERRY', 'DEWBERRY', 'CLOUDBERRY', 'ADMIRAL2', 'CAPTAIN2', 'GENERAL2', 'HOPE2', 'PATIENCE2', 'PROFESSOR2'],
];
function allocName(plants) {
  const used = new Set(plants.filter(p => !p.memorial).map(p => p.name));
  for (const pool of NAME_POOLS) for (const raw of pool) {
    const nm = raw.endsWith('2') ? raw.slice(0, -1) + ' II' : raw;
    if (!used.has(nm)) return nm;
  }
  let n = plants.length + 1;
  while (used.has('PLANT ' + n)) n++;
  return 'PLANT ' + n;
}
/* Every plant is an individual with a name Frank gave it (roll call order —
   Constance noted, correctly, that it is alphabetical). A plant lives on the
   bench; the register is a journal of lives, never a storage box. */
const PLANT_NAMES = ['ADMIRAL', 'CAPTAIN', 'GENERAL', 'HOPE', 'PATIENCE', 'PROFESSOR'];
function freshPlant(name, o) {
  o = o || {};
  return Object.assign({
    name, variety: 'CHANDLER', stage: 0, wateredDays: 0, watered: false, vigor: 0, tended: 0,
    sownDay: null, sproutedDay: null, seedlingDay: null, bushDay: null, blossomDay: null, fruitDay: null,
    location: 'BENCH', slot: null, row: null,
    dirt: false, dirtCredit: 0, // good dirt: a permanent mark + banked growth credit
    health: 0, dryDays: 0, critSince: null, warnedDay: null, lastRescue: null,
    wintered: false, chill: 0, history: [], harvestByYear: {},
    memorial: false, diedDay: null, cause: null, husk: false, firstHarvestDay: null, firstHarvestLbs: null,
    firstSix: false, gardenState: null, giftName: false, fruitSetOk: false,
  }, o);
}
/* Old saves stored pots as bare stage ints, then as {stage, waterDays, ...}
   objects. Bring any of them up to the v2 plant shape, inventing nothing
   the player did: stage days fall back to day 1, names to the roll call. */
function migratePot(p, i) {
  if (typeof p === 'number') p = { stage: p };
  p = p || {};
  const st = p.stage | 0;
  return freshPlant((typeof p.name === 'string' && p.name.trim()) ? p.name : PLANT_NAMES[i], {
    variety: SIX_VARIETY[i], stage: st,
    wateredDays: p.wateredDays != null ? p.wateredDays : (p.waterDays || 0),
    watered: !!p.watered, vigor: p.vigor || 0, tended: p.tended || 0,
    sownDay: p.sownDay != null ? p.sownDay : (st >= 1 ? 1 : null),
    sproutedDay: p.sproutedDay != null ? p.sproutedDay : (st >= 2 ? 1 : null),
    seedlingDay: p.seedlingDay != null ? p.seedlingDay : (st >= 3 ? 1 : null),
    location: 'BENCH', slot: i, firstSix: true,
    dirt: !!p.dirt, dirtCredit: p.dirtCredit || 0,
  });
}
function freshRow() { return { yieldRating: 1, fruitSet: 0, wateredDays: 0, watered: false, poundsByYear: {} }; }
let G = null; // game state (serializable part in G.save)
function newSave() {
  const s = attachPotsAlias({
    v: 2, day: 1, seedsLeft: 6, tea: 3, teaBrewedDay: 0,
    plants: PLANT_NAMES.map((n, i) => freshPlant(n, { variety: SIX_VARIETY[i], location: 'BENCH', slot: i, firstSix: true })),
    tray: { n: 0, watered: false, sownDay: null, stratDays: 0, ready: false, pottedTotal: 0 },
    dex: { blueberry: [], garden: [], cells: [] },
    deerBeaten: false, deerPresent: false, chapterDone: false,
    tutorial: 0, // 0 intro dialogue, 1 plant, 2 water, 3 done
    constanceLine: 0,
    weeds: [], compost: 0, goodDirt: 0, weedLineSeen: false, cornerLineSeen: false,
    world: { ch: 1, step: 0, flags: {}, area: 'yard', proj: 0, projDay: 1, lastSeason: 0, rainToday: false, jeremiahDay: 0, omaReqDay: 0, watchRow: null, alvinDown: false },
    cropRows: [], field: { tarp: [0, 0, 0, 0, 0], tarpDay: [0, 0, 0, 0, 0], fence: 0, protoNet: false, protoWire: false, pipe: false, irrigation: false, mulch: 0, weedLv: [0, 0, 0, 0, 0, 0], vent: false, heater: false },
    wine: { jar: null, batches: [], honey: 6, pounds: 0, poundsByYear: {}, shared: 0 },
    germ: null, promise: false,
    player: { x: 10, y: 6, dir: 'down' },
  });
  for (let i = 0; i < 12; i++) s.cropRows.push(freshRow());
  return s;
}
function ensureV2(s) {
  attachPotsAlias(s);
  if (!s.world) s.world = { ch: 1, step: 0, flags: {}, area: 'yard', proj: 0, projDay: 1, lastSeason: 0, rainToday: false, jeremiahDay: 0, omaReqDay: 0, watchRow: null, alvinDown: false };
  if (!s.world.flags) s.world.flags = {};
  if (!s.field) s.field = { tarp: [0, 0, 0, 0, 0], tarpDay: [0, 0, 0, 0, 0], fence: 0, protoNet: false, protoWire: false, pipe: false, irrigation: false, mulch: 0, weedLv: [0, 0, 0, 0, 0, 0], vent: false, heater: false };
  if (!Array.isArray(s.field.fenceSeg) || s.field.fenceSeg.length !== 4) s.field.fenceSeg = [0, 0, 0, 0];
  if (!Array.isArray(s.field.fenceIrr) || s.field.fenceIrr.length !== 4) s.field.fenceIrr = [0, 0, 0, 0];
  if (typeof s.field.mulch !== 'number') s.field.mulch = 0;
  for (const r of s.cropRows) if (r.mulched === undefined) r.mulched = false;
  if (!s.wine) s.wine = { jar: null, batches: [], honey: 6, pounds: 0, poundsByYear: {}, shared: 0 };
  if (!s.tray) s.tray = { n: 0, watered: false, sownDay: null, stratDays: 0, ready: false, pottedTotal: 0 };
  if (!Array.isArray(s.cropRows) || s.cropRows.length !== 12) { const old = s.cropRows || []; s.cropRows = []; for (let i = 0; i < 12; i++) s.cropRows.push(Object.assign(freshRow(), old[i] || {})); }
  if (!Array.isArray(s.plants) || !s.plants.length) s.plants = PLANT_NAMES.map((n, i) => freshPlant(n, { variety: SIX_VARIETY[i], location: 'BENCH', slot: i, firstSix: true }));
  s.plants = s.plants.map((p, i) => Object.assign(freshPlant(p.name || PLANT_NAMES[i] || 'PLANT', { firstSix: !!p.firstSix }), p));
  if (!s.dex) s.dex = { blueberry: [], garden: [], cells: [] };
  if (!Array.isArray(s.dex.blueberry)) s.dex.blueberry = [];
  if (!Array.isArray(s.dex.garden)) s.dex.garden = [];
  if (!Array.isArray(s.dex.cells)) s.dex.cells = [];
  s.weeds = Array.isArray(s.weeds) ? s.weeds.filter(w => w && Number.isInteger(w.x) && Number.isInteger(w.y)).map(w => ({ x: w.x, y: w.y, deep: !!w.deep })) : [];
  if (typeof s.compost !== 'number') s.compost = 0;
  if (typeof s.goodDirt !== 'number') s.goodDirt = 0;
  if (s.germ === undefined) s.germ = null;
  if (s.promise === undefined) s.promise = false;
  if (!s.player) s.player = { x: 10, y: 6, dir: 'down' };
  return s;
}
function migrateSaveV1(s1) {
  const s = newSave();
  for (const k of ['day', 'seedsLeft', 'tea', 'teaBrewedDay', 'deerBeaten', 'deerPresent', 'chapterDone', 'tutorial', 'constanceLine', 'compost', 'goodDirt', 'weedLineSeen', 'cornerLineSeen']) if (s1[k] !== undefined) s[k] = s1[k];
  if (s1.player) s.player = s1.player;
  s.plants = (s1.pots || []).map((p, i) => migratePot(p, i));
  if (s1.dex && Array.isArray(s1.dex.blueberry)) s.dex.blueberry = s1.dex.blueberry.slice();
  if (Array.isArray(s1.weeds)) s.weeds = s1.weeds;
  if (s.chapterDone) { s.world.ch = 2; s.world.step = 0; }
  return ensureV2(s);
}
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.save)); } catch (e) {} }
function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.v === 2 && Array.isArray(s.plants)) return ensureV2(s);
    if (s && s.v === 1 && Array.isArray(s.pots)) return migrateSaveV1(s);
  } catch (e) {}
  return null;
}
function sixPlants() { return G.save.plants.filter(p => p.firstSix); }
/* Back-compat alias: older tooling (and the shipped smoke suite) pokes
   save.pots for the six. A non-enumerable getter keeps it out of the
   serialized save while always pointing at the living six. */
function attachPotsAlias(s) {
  if (!Object.getOwnPropertyDescriptor(s, 'pots')) {
    Object.defineProperty(s, 'pots', { enumerable: false, configurable: true, get() { return s.plants.filter(p => p.firstSix); } });
  }
  return s;
}
function plantsAt(loc) { return G.save.plants.filter(p => !p.memorial && (loc === 'ROW' ? p.row != null : p.location === loc)); }
function livingPlants() { return G.save.plants.filter(p => !p.memorial); }
function housingOf(p) { return p.row != null ? 'field' : p.location === 'GARDEN' ? 'garden' : 'pot'; }
function dexAdd(stageName, variety) {
  if (!G.save.dex.blueberry.includes(stageName)) G.save.dex.blueberry.push(stageName);
  if (variety) { const cell = variety + ':' + stageName; if (!G.save.dex.cells.includes(cell)) G.save.dex.cells.push(cell); }
}
function anyStageAtLeast(n) { return sixPlants().some(p => p.stage >= n); }
function strongestPot() {
  let best = -1, bi = -1;
  sixPlants().forEach((p, i) => { if (p.stage >= 2 && p.stage > best) { best = p.stage; bi = i; } });
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
const consoleEl = document.getElementById('console');
// Daniel (Nov 26, 2026): the game fills the browser window. The stage
// scales uniformly — the 160:144 aspect never changes — letterboxed on
// the page ground, snapping to a whole-number scale whenever that still
// fills the window well (>= 85% of the fit), so the pixels stay crisp;
// below that (small phones) it takes the exact fractional fit instead.
function fitStage() {
  const deckH = deckEl.hidden ? 0 : deckEl.offsetHeight;
  const availW = window.innerWidth - 8, availH = window.innerHeight - deckH - 8; // 8: the console's borders
  let scale = Math.min(availW / 160, availH / 144);
  const whole = Math.floor(scale);
  if (whole >= 2 && whole / scale >= 0.85) scale = whole;
  consoleEl.style.width = (Math.max(160, Math.floor(160 * scale)) + 8) + 'px'; // +8 so the SCREEN is exactly 160 x scale
}
window.addEventListener('resize', fitStage);
const coarsePointer = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
let touchSeen = false;
const stickDebug = { dir: null, mag: 0 }; // exposed via __hss for the smoke test
function stickShouldShow() {
  return settings.stick === 'always' || (settings.stick === 'auto' && (touchSeen || coarsePointer));
}
function applyStickPref() { deckEl.hidden = !stickShouldShow(); fitStage(); }
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
  // a leading "FRANK:" / "CONSTANCE:" / "PASTOR:" becomes a speaker name tag
  // on the box, so the characterization reads without shouting prefixes
  const parsed = raw.map(l => {
    const m = String(l).match(/^(FRANK|CONSTANCE|PASTOR):\s*/);
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
  const s = G.save, w = s.world;
  if (w.flags.alvinDown) return 'ALVIN IS DOWNSTAIRS, KEEPING OMA\'S FEET WARM.';
  if (w.ch === 2) return ['TEND THE SIX. THE STORY IS IN THE HOUSE.', 'SEEDS IN THE FRIDGE. JEREMIAH CARRIES. HOUSES FAIL.', 'SELL FIRST. PACK LIKE YOU MEAN IT.', 'SELL FIRST. PACK LIKE YOU MEAN IT.', 'SELL FIRST. PACK LIKE YOU MEAN IT.', 'THE GREAT EMPTYING: ONE VAN LOAD A DAY.', 'THE WINTER DEEPENS. THE FRIDGE KEEPS ITS SECRET.', 'POT THEM UP. EVERY ONE GETS A NAME.', 'SIGN THE PAPERS AT THE TABLE.'][w.step] || 'TEND THE SHELF.';
  if (w.ch === 3) return ['GO AND LOOK. QUIETLY.', 'THE GATE BY THE ROAD LEADS TO BERRYHILL.', 'THINK IT OVER. THEN DECIDE LIKE YOU MEAN IT.', 'THE BARN. THE FIELD. THE SET.', 'MOVING WEEKEND: THE TRUCK, AT THE OLD DOOR.', 'ONE MORE LOAD, ONE WAY OR ANOTHER.', 'BUILD THE GREENHOUSE: FRAME, SHELL, HEATER.', 'CARRY THE PLANTS TO THE GLASS HOUSE.', 'THE FIRST NIGHT IN THE GLASS HOUSE.', 'SETTLE IN.'][w.step] || 'SETTLE IN.';
  if (w.ch === 4) return ['STAKE THE FIELD.', 'MEET THE IRISES.', 'THE TOWN HAS OPINIONS.', 'PRICE THE FENCE AT THE GOOD SHED.'][w.step] || 'WALK THE FIELD.';
  if (w.ch === 5) return ['BUILD THE STAIRS DOWN.', 'OMA IS COMING. MAKE READY.', 'CLEAR THE PATCH BEHIND THE GOOD SHED.', 'THE PATCH FIGHTS BACK.', 'VISIT OMA.'][w.step] || 'TEND EVERYONE.';
  if (w.ch === 6) return ['SOMETHING IS WRONG IN THE GLASS HOUSE.', 'WATER. VENT. DIRT. FIGHT FOR THEM.', 'WATER. VENT. DIRT. FIGHT FOR THEM.', 'WATER. VENT. DIRT. FIGHT FOR THEM.', 'REPOT THEM. THE FRIEND IS RIGHT: DIRT.', 'THE LONG PREP: TARP, PIPE, MULCH, FENCE.', 'PLANTING DAY.', 'THE FIRST NIGHT.'][w.step] || 'TEND THE FIELD.';
  if (w.ch === 7) return 'SOMETHING IS CUTTING THE SMALLEST. SET THE WATCH AT REST.';
  if (w.ch === 8) return ['THE LONG WAR: PULL, FEED, MULCH.', 'A VISIT, AND A SORTING LESSON.', 'THE PROUD WEED STANDS BY THE FENCE.', 'STRAWBERRIES FOR THE FAMILY GARDEN.', 'A BUSH FOR OMA\'S PATIO.', 'HOLD EVERY SECTION AT ZERO, A FULL WEEK.'][w.step] || 'THE LONG WAR.';
  if (w.ch === 9) return ['A FORSYTHIA FOR OMA\'S WINDOW.', 'BLOSSOM WEEK. WATER THE ROWS.', 'THE LATE FROST: THREE NIGHTS. SET THE WATCH AT THE GATE.', 'THE RECKONING OF THE BLOSSOM.'][w.step] || 'TEND THE BLOSSOM.';
  if (w.ch === 10) return ['BATCH ONE: A REHEARSAL, AT THE BARN KITCHEN.', 'MIND THE JAR: SWISH IT, WATCH THE SEAL.', 'THE HARVEST. ROW 1 FIRST, BY NAME.', 'BATCH TWO: YOUR RATIO, FROM THE FIELD\'S OWN FRUIT.', 'MIND THE JAR: SWISH IT, WATCH THE SEAL.', 'THE TASTING, AT THE TABLE.'][w.step] || 'MAKE THE WINE.';
  if (w.ch === 11) return 'THE LONG TENDING. EVERY YEAR, THE SAME GOOD WORK.';
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
  if (self !== alvin && x === alvin.tx && y === alvin.ty && !alvinAway()) return true;
  if ((area === 'yard' || area === 'barnOut') && x === constance.tx && y === constance.ty) return true;
  if (area === 'yard' && G.save.deerPresent && !G.save.deerBeaten && x === DEER_POS.x && y === DEER_POS.y) return true;
  if (npcList.some(n => n.tx === x && n.ty === y)) return true;
  return false;
}
function alvinAway() { return !!(G && G.save.world.flags.alvinDown && area !== 'oma'); }
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
  if (area === 'yard') constance.dir = (perfNow % 9 < 6.5) ? 'left' : 'down';
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
    const ex = exitsFor(area).find(e => e.x === player.tx && e.y === player.ty);
    if (ex) { setArea(ex.to, ex.tx, ex.ty); return; }
    player.stepAlt = !player.stepAlt;
    if (dx0 && dy0) diagX = !diagX;
    alvinTarget = { x: player.tx - lastStep.dx, y: player.ty - lastStep.dy }; // tile the player just left
  }
  if (!wasMoving && player.moving) lastStep = { dx: player.mx, dy: player.my };
  // Alvin follows toward the tile the player vacated
  if (!alvin.moving && alvinTarget && !alvinAway()) {
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
  camX = Math.round(Math.max(0, Math.min(AW * TILE - VW, player.px + 8 - VW / 2)));
  camY = Math.round(Math.max(0, Math.min(AH * TILE - VH, player.py + 8 - VH / 2)));
}
let lastStep = { dx: 0, dy: 1 };
let menuSel = 0;

function potIndexAt(x, y) { return (y === 10 && x >= 9 && x <= 14) ? x - 9 : -1; }
function interact() {
  const f = frontTile(player), s = G.save;
  const npc = npcList.find(n => n.tx === f.x && n.ty === f.y);
  if (npc) return npcTalk(npc);
  if (area !== 'yard') return areaInteract(f);
  const pi = potIndexAt(f.x, f.y);
  if (pi >= 0) { const bp = sixPlants().find(p => p.location === 'BENCH' && p.slot === pi); if (bp) return potInteract(bp); return say('THE BENCH IS EMPTY HERE NOW. THE POTS LIVE ON — CHECK THE REGISTER.'); }
  if (f.x === 11 && f.y === 3) { // house door
    if (s.world.ch === 3 && s.world.step === 4) {
      return say('THE DOOR. THE TRUCK IS IN THE DRIVE, HUNGRY FOR BOXES.', which => {
        if (which === 0) restDay();
        else if (which === 1) {
          say('WHAT RIDES FIRST?', sub => chooseLoadOrder(sub === 0 ? 'furniture' : 'plants'), ['FURNITURE FIRST', 'PLANTS FIRST']);
        }
        else if (which === 2) setArea('house', 10, 11);
      }, ['REST', 'LOAD THE TRUCK', 'GO INSIDE', 'NOT YET']);
    }
    if (s.world.ch >= 2) {
      return say('THE DOOR. INSIDE SMELLS OF TEA AND CARDBOARD.', which => {
        if (which === 0) restDay();
        else if (which === 1) setArea('house', 10, 11);
      }, ['REST', 'GO INSIDE', 'NOT YET']);
    }
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
  if (ch === 'G') {
    if (s.world.ch >= 3) return say('THE ROAD TO BERRYHILL. IT IS NOT FAR. IT IS ONLY EVERYTHING.', which => { if (which === 0) setArea('barnOut', 2, 1); }, ['GO TO BERRYHILL', 'NOT YET']);
    return say('THE GATE STICKS. BEYOND IT: MOWED LAWNS AND ORDINARY LIFE.');
  }
  if (ch === 'T') return say('TOO MUCH SHADE HERE. A FIELD NEEDS OPEN SKY, AND TIME.');
  const uw = weedAt(player.tx, player.ty); // or the weed under Frank's own boots
  if (uw) return pullWeed(uw);
}
function potInteract(p) {
  const s = G.save;
  if (p.memorial) return clearHusk(p);
  if (p.stage === 0) {
    if (s.seedsLeft <= 0) return say('NO SEEDS LEFT IN THE PACKET.');
    p.stage = 1; p.sownDay = s.day; s.seedsLeft--; dexAdd('SEED', p.variety); saveGame();
    if (s.tutorial === 1 && sixPlants().every(q => q.stage >= 1)) {
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
    waterPlant(p); saveGame();
    if (s.tutorial === 2 && sixPlants().every(q => q.watered)) {
      s.tutorial = 3; saveGame();
      return say(['CONSTANCE: NOW WE WAIT. FRANK HAS ALREADY NAMED ALL SIX. IT IS DAY ONE.', 'REST AT THE HOUSE DOOR TO PASS THE DAY. WATER AGAIN TOMORROW.']);
    }
    return say(p.stage === 1 ? 'YOU WATER THE SEED. GROW WELL, LITTLE ONE. NO RUSH.' : 'YOU WATER THE ' + STAGE_NAMES[p.stage] + '. STEADY DOES IT.');
  }
  if (s.goodDirt > 0) { // a watered pot can be fed: the good dirt goes in
    return say([p.name + ' IS WATERED AND WAITING.', 'FEED ' + p.name + ' THE GOOD DIRT? (YOU HOLD ' + s.goodDirt + ')'], which => {
      if (which === 0) {
        feedDirt(p);
        say('GOOD DIRT FOR ' + p.name + '. +8 VIGOR, AND THE NEXT STAGE COMES A DAY SOONER.');
      }
    }, ['FEED IT', 'NOT NOW']);
  }
  return say('ALREADY WATERED TODAY. WAITING IS MOST OF THE WORK.');
}

/* Watering a plant: sets its flag, and — if it stands CRITICAL — records
   the rescue the mortality doctrine asks about at dawn (spec 2.8). */
function projUse() {
  const w = G.save.world;
  if (w.proj >= 3) { say('ENOUGH. THE DAY HAS A BOTTOM, AND FRANK HAS FOUND IT. REST, AND LET TOMORROW CARRY THE REST.'); return false; }
  w.proj++;
  if (w.proj === 3) say('ONE MORE THING, THEN. FRANK\'S HANDS ARE SORE AND HIS LIST IS LONGER THAN THE DAY. AFTER THIS: REST.');
  saveGame();
  return true;
}
function waterPlant(p) {
  p.watered = true;
  if (p.health === 3) p.lastRescue = G.save.day;
  saveGame();
}
function feedDirt(p) { // good dirt: +8 Vigor, +1 growth credit, one health step up
  const s = G.save;
  s.goodDirt--; p.dirt = true; p.dirtCredit = (p.dirtCredit || 0) + 1; p.vigor += 8;
  if (s.world.ch === 6 && s.world.step <= 4 && p.location === 'GREENHOUSE') { (s.world.flags.fedNames = s.world.flags.fedNames || []).push(p.name); s.world.flags.mitDirtDay = s.day; }
  if (p.health > 0) p.health--;
  if (p.health === 3) p.lastRescue = s.day;
  saveGame();
}
function killPlant(p, cause) {
  p.health = 4; p.memorial = true; p.diedDay = G.save.day; p.cause = cause || 'IT WAS NOT WATERED IN TIME'; p.husk = true; p.watered = false;
  saveGame();
}
/* Clearing a husk: one interact, and the plant goes to the compost —
   nothing in this yard is wasted (spec 2.8). */
function clearHusk(p) {
  p.husk = false; p.location = 'MEMORIAL'; p.row = null; p.slot = null;
  G.save.compost += 2; saveGame();
  return say(['FRANK CLEARS WHAT IS LEFT OF ' + p.name + '.', 'INTO THE COMPOST IT GOES. NOTHING IN THIS YARD IS WASTED.', '(+2 COMPOST)']);
}
function growthCheck(p, so, ev) {
  const eff = () => p.wateredDays + (p.dirtCredit || 0);
  const spend = need => { const use = Math.max(0, Math.ceil(need - p.wateredDays)); p.dirtCredit = Math.max(0, (p.dirtCredit || 0) - use); p.wateredDays = 0; };
  if (p.stage === 1 && eff() >= 2) { spend(2); p.stage = 2; p.sproutedDay = G.save.day; ev.sprouted = true; dexAdd('SPROUT', p.variety); }
  else if (p.stage === 2 && eff() >= 3) { spend(3); p.stage = 3; p.seedlingDay = G.save.day; ev.seedled = true; dexAdd('SEEDLING', p.variety); }
  else if (p.stage === 3 && eff() >= 8 && p.wintered) { spend(8); p.stage = 4; p.bushDay = G.save.day; dexAdd('BUSH', p.variety); }
  else if (p.stage === 4 && so.idx === 0 && p.chill >= (p.variety === 'CLIMAX' ? 6 : 10) && eff() >= 3) { spend(3); p.stage = 5; p.blossomDay = G.save.day; dexAdd('BLOSSOM', p.variety); }
  else if (p.stage === 5 && p.fruitSetOk && eff() >= 6) { spend(6); p.stage = 6; p.fruitDay = G.save.day; dexAdd('FRUITING', p.variety); }
}
/* One plant's dawn (spec 2.8): water climbs the ladder, neglect descends
   it by housing thresholds, winter banks chill, and death — only from
   CRITICAL, only after a warned dawn spent unrescued — is carried out. */
function plantDawn(p, so, ev) {
  if (p.memorial) return;
  const s = G.save, housing = housingOf(p);
  const winter = so.idx === 3;
  const rowW = p.row != null && s.cropRows[p.row].watered;
  const wasWatered = p.watered || rowW;
  if (p.health === 3 && p.warnedDay != null && p.warnedDay < s.day && !wasWatered) {
    killPlant(p, p.dryDays >= DRY_THRESH[housing][2] ? 'A DRY SPELL, AND NO RESCUE CAME' : (p.cause || 'IT FAILED, AND WAS REMEMBERED'));
    ev.deaths.push(p.name);
    return;
  }
  if (wasWatered) {
    p.dryDays = 0;
    if (p.health > 0) p.health--;
    p.tended++;
    let pace = 1;
    if (winter) pace = housing === 'pot' ? 0.5 : 0;
    if (pace > 0 && p.stage >= 1) { p.wateredDays += pace; growthCheck(p, so, ev); }
  } else if (p.stage >= 1 && s.world.ch >= 2 && (!winter || housing === 'pot')) {
    // the health ladder arrives with Sprouts (spec 2.8, tutorial form);
    // in the Seeds chapter a dry pot simply waits, as it always has
    p.dryDays++;
    const th = DRY_THRESH[housing];
    const implied = (p.dryDays >= th[0] ? 1 : 0) + (p.dryDays >= th[1] ? 1 : 0) + (p.dryDays >= th[2] ? 1 : 0);
    if (implied > p.health) { p.health = implied; if (implied === 3) p.critSince = s.day; }
  }
  if (winter && p.stage >= 3) p.chill++;
  p.watered = false;
  p.vigor = MAX_VIGOR[p.stage] || 0;
}
const SEASON_LINES = [
  'SPRING. THE YEAR TURNS ITS FACE BACK TO THE SUN.',
  'SUMMER. EVERYTHING GROWS LIKE IT MEANS IT.',
  'FALL. THE LIGHT GOES GOLD AND HONEST.',
  'WINTER. THE GARDEN SLEEPS UNDER ITS BREATH.',
];
function restDay() {
  fading = 'dawn'; fade = 1;
  setTimeout(() => { dawn(); }, 350);
}
function dawn() {
  const s = G.save, w = s.world;
  const prev = seasonOf(s.day);
  s.day++;
  const so = seasonOf(s.day);
  w.proj = 0; w.projDay = s.day;
  // Berryhill weather (from ch. 3): a deterministic rain about a day in five
  w.rainToday = w.ch >= 3 && so.idx !== 3 && (hashDay(s.day) % 5 === 0);
  if (w.rainToday) {
    for (const p of s.plants) if (!p.memorial && housingOf(p) !== 'pot') p.watered = true;
    for (const r of s.cropRows) r.watered = true;
  }
  const ev = { sprouted: false, seedled: false, deaths: [], ups: [] };
  const anyWatered = s.plants.some(p => p.watered) || s.cropRows.some(r => r.watered);
  for (const p of s.plants) plantDawn(p, so, ev);
  for (const r of s.cropRows) { if (r.watered) r.wateredDays++; r.watered = false; }
  if (s.tray.n > 0) { if (s.tray.watered) s.tray.stratDays++; s.tray.watered = false; }
  wineDawn();
  const failing = [];
  for (const p of s.plants) if (!p.memorial && p.health === 3) { p.warnedDay = s.day; failing.push(p.name); }
  if (w.ch <= 2) spawnWeeds(anyWatered ? 3 : 2);
  if (sixPlants().some(p => p.stage >= 2) && !s.deerBeaten && !s.deerPresent) s.deerPresent = true;
  let seasonLine = null;
  if (so.idx !== prev.idx) {
    seasonLine = SEASON_LINES[so.idx];
    if (so.idx === 0) for (const p of s.plants) if (p.stage >= 3) p.wintered = true;
    w.lastSeason = so.idx;
  }
  chapterDawnPrep(ev);
  saveGame();
  fading = null;
  if (checkChapter()) return;
  const beat = chapterDawn(ev);
  layoutNPCs();
  if (mode === 'card' || mode === 'trial') return;
  let lines = [];
  if (ev.deaths.length) lines.push('IN THE NIGHT, QUIETLY: ' + ev.deaths.join(', ') + '. THE REGISTER TURNS A PAGE.');
  if (failing.length) lines.push(failing[0] + ' IS FAILING. WATER, OR GOOD DIRT — TODAY.');
  if (seasonLine) lines.push(seasonLine);
  if (w.rainToday) lines.push('RAIN IN THE NIGHT. EVERYTHING OUTDOORS DRANK ITS FILL.');
  if (beat) lines = lines.concat(beat);
  if (!lines.length) {
    let line;
    if (ev.sprouted && s.deerPresent && !s.deerBeaten && w.ch === 1) line = 'SOMETHING SPROUTED! BUT ALVIN IS BARKING AT THE FENCE... A DEER IS IN THE YARD!';
    else if (ev.sprouted) line = 'TWO SMALL LEAVES IN THE NIGHT! COME AND SEE!';
    else if (ev.seedled) line = 'A SPROUT BECAME A SEEDLING OVERNIGHT. LEAVES AND EVERYTHING.';
    else if (w.ch >= 3) line = BERRY_MORNING[Math.floor(hashDay(s.day) % BERRY_MORNING.length)];
    else if (s.day >= 2 && !s.deerBeaten && w.ch === 1) line = MORNING_FORE[Math.floor(Math.random() * MORNING_FORE.length)];
    else line = MORNING_LINES[Math.floor(Math.random() * MORNING_LINES.length)];
    lines = [line];
  }
  const soNow = seasonOf(s.day); // chapter beats may move the calendar (a summer passes)
  lines.unshift('DAY ' + s.day + ' · ' + SEASON_NAMES[soNow.idx] + ', YEAR ' + soNow.year + '.');
  say(lines);
}
const BERRY_MORNING = [
  'THE FIELD IS STILL THERE. IT IS PATIENT THAT WAY.',
  'SOMEWHERE A ROOSTER HAS OPINIONS. NOT OURS. NO CHICKENS. TOWN RULES.',
  'THE BARN SMELLS OF HAY AND SECOND CHANCES.',
  'ALVIN HAS ALREADY INSPECTED EVERYTHING. TWICE.',
  'A GOOD DAY TO TEND SOMETHING SMALL.',
  'THE MOUNTAINS ARE DOING THEIR LONG BLUE STAND AT THE EDGE OF EVERYTHING.',
];
function wineVerdict(j) {
  const careless = (j.careSteps || 0) >= 2;
  if (j.index < 0.5) return 'TART';
  if (j.index > 1.2) return 'SWEET AS CANDY';
  if (j.index <= 0.8) return careless ? 'HONEST' : 'LOVELY';
  return careless ? 'HONEST' : 'SWEET';
}
function wineDawn() {
  const s = G.save, w = s.world, j = s.wine.jar;
  if (!j || j.phase === 'done') return;
  if (j.phase === 'open') {
    if (j.swishDay !== s.day - 1 || (j.swishes || 0) < 1) {
      j.neglect = (j.neglect || 0) + 1;
      if (j.neglect === 3) { j.careSteps = Math.min(2, (j.careSteps || 0) + 1); w.flags.wineNote = 'A MOLD SCARE ON THE JAR — SKIMMED OFF, PRAYED OVER, AND NOT SPOKEN OF AT BREAKFAST. THE CARE SLIPS A GRADE.'; }
    }
    j.swishes = 0;
    j.days++;
    if (j.days >= 3) { j.phase = 'sealed'; j.days = 0; j.sealCheckDay = s.day; w.flags.wineNote = 'THE JAR IS SEALED ON THE THIRD DAY. NOW: PATIENCE, AND THE SEAL-WATER KEPT TOPPED, WEEK BY WEEK.'; }
  } else if (j.phase === 'sealed') {
    j.days++;
    if (s.day - (j.sealCheckDay != null ? j.sealCheckDay : s.day) >= 7) {
      j.sealMiss = (j.sealMiss || 0) + 1; j.sealCheckDay = s.day;
      if (j.sealMiss >= 2) { j.careSteps = Math.min(2, (j.careSteps || 0) + 1); j.sealMiss = 0; w.flags.wineNote = 'THE SEAL RAN DRY TWICE RUNNING. THE JAR FORGIVES, MOSTLY. THE CARE SLIPS A GRADE.'; }
      else w.flags.wineNote = 'THE SEAL-WATER SITS LOW ON THE JAR. IT ASKS, POLITELY, TO BE TOPPED UP AT THE KITCHEN.';
    }
    const need = j.batch === 1 ? 14 : 28;
    if (j.days >= need) { j.phase = 'done'; j.verdict = wineVerdict(j); w.flags.wineNote = 'THE JAR IS DONE. BATCH ' + j.batch + ' WAITS AT THE BARN KITCHEN, FULL OF OPINIONS. BOTTLE IT THERE.'; }
  }
  j.care = 'ABC'[j.careSteps || 0];
  saveGame();
}
function freshJar(batch, index) {
  return { batch, phase: 'open', days: 0, index, careSteps: 0, care: 'A', swishes: 0, swishDay: null, neglect: 0, sealCheckDay: null, sealMiss: 0, verdict: null };
}
function startBatchOne() {
  const s = G.save, w = s.world;
  s.wine.jar = freshJar(1, 0.1); w.flags.batch1 = 'fermenting'; w.step = 1; saveGame();
  say(['BATCH ONE: THE REHEARSAL. BOUGHT FRUIT — GOOD FRUIT, SOMEBODY ELSE\'S FIELD — CRUSHED AT THE BARN KITCHEN, WITH A DASH OF HONEY. A DASH. FRANK MEASURED THE DASH WITH HIS HEART.', 'CONSTANCE: A DASH IS NOT A MEASUREMENT, FRANK. FRANK: IT IS A MEASUREMENT OF ENTHUSIASM. (THE REGISTER RECORDS THE RATIO ANYWAY: 0.1. THE REGISTER HAS NO HEART.)', 'THREE DAYS OPEN — SWISH IT DAILY AT THE KITCHEN — THEN IT SEALS ITSELF, AND THE LONG PATIENCE BEGINS.']);
}
function startBatchTwo(index) {
  const s = G.save, w = s.world;
  const n = s.wine.batches.length + 1;
  s.wine.jar = freshJar(n, index); w.flags.batch2 = 'fermenting'; if (w.ch === 10) w.step = 4; saveGame();
  say(['BATCH ' + n + ': THE FIELD\'S OWN FRUIT, AND FRANK\'S OWN RATIO — ' + index.toFixed(2) + ', HONEY TO FRUIT, SET BY HAND AND WRITTEN IN THE REGISTER BEFORE THE JAR IS SEALED, SO NO ONE CAN LIE ABOUT IT LATER.', 'TWENTY-EIGHT DAYS SEALED, WHEN THE THREE OPEN DAYS ARE DONE. LATE SUMMER INTO FALL. THE JAR WILL KEEP. THE QUESTION IS WHETHER FRANK WILL.']);
}
function swishJar() {
  const s = G.save, j = s.wine.jar;
  if (!j || j.phase !== 'open') return say('THE JAR IS SEALED. SWISHING NOW WOULD BE THEATRE, AND NOT THE KIND THAT HELPS.');
  if (j.swishDay !== s.day) { j.swishDay = s.day; j.swishes = 0; }
  if (j.swishes >= 3) return say('THRICE SWISHED TODAY. THE JAR IS AWAKE, AERATED, AND SLIGHTLY DIZZY. ENOUGH.');
  j.swishes++; saveGame();
  say('SWISH ' + j.swishes + ' OF 3. THE MUST TURNS OVER LIKE A SLEEPER FINDING THE COOL SIDE OF THE PILLOW.');
}
function sealCheck() {
  const s = G.save, j = s.wine.jar;
  if (!j || j.phase !== 'sealed') return say('NO SEAL TO CHECK — THE JAR IS ' + (j ? 'STILL OPEN.' : 'NOT BREWING.'));
  j.sealCheckDay = s.day; j.sealMiss = 0; saveGame();
  say('SEAL-WATER TOPPED, MENISCUS PERFECT, CONSCIENCE CLEAR. THE JAR SETTLES BACK INTO ITS LONG THOUGHT.');
}
function bottleJar() {
  const s = G.save, w = s.world, j = s.wine.jar;
  if (!j || j.phase !== 'done') return say('NOT YET. THE JAR IS STILL THINKING.');
  const entry = { n: j.batch, verdict: j.verdict, index: j.index, care: j.care, year: seasonOf(s.day).year };
  s.wine.batches.push(entry);
  s.wine.jar = null;
  if (w.ch === 10 && j.batch === 1) {
    w.flags.batch1 = 'bottled'; w.step = 2; saveGame();
    return say(['BATCH ONE, BOTTLED AND TASTED IN THE KITCHEN DOORWAY, STANDING UP, LIKE A VERDICT DELIVERED IN A HALLWAY.', 'IT IS — THERE IS NO KINDER WORD, AND CONSTANCE TRIES THREE — TART. TART AS A GREEN APPLE\'S OPINION OF YOU.', 'CONSTANCE, KINDLY, WITH THE GLASS STILL IN HER HAND: IT IS THE HONEY, FRANK. A DASH IS A SEASONING. WINE WANTS A MEASURE — HALF TO FOUR-FIFTHS, HONEY AGAINST FRUIT, THE WAY THE OLD BOOKS SAY. BATCH TWO IS YOURS TO SET. THE FIELD WILL PROVIDE.', 'THE LESSON GOES IN THE JOURNAL, IN INK: A DASH IS NOT A MEASUREMENT. AND NOW — THE HARVEST IS RIPE. ROW 1 FIRST, BY NAME, INTO ITS OWN BOWL.']);
  }
  if (w.ch === 10 && j.batch === 2) {
    w.flags.batch2 = 'bottled'; w.step = 5; saveGame(); layoutNPCs();
    return say(['BATCH TWO, BOTTLED. THE VERDICT, BY THE FORMULA THE REGISTER KEEPS: ' + entry.verdict + '.', 'THE TASTING IS SET FOR A LATE-OCTOBER EVENING: THE PASTOR AT THE TABLE, AND CONSTANCE WHERE SHE HAS STOOD FOR EVERY STEP OF IT — BESIDE FRANK. THE TABLE IN THE BARN WILL HOST IT.']);
  }
  saveGame();
  say('BATCH ' + entry.n + ', BOTTLED: ' + entry.verdict + '. THE CELLAR PAGE TAKES ANOTHER LINE, AND KEEPS IT FOREVER.');
}
function perBushLbs() {
  const yr = seasonOf(G.save.day).year;
  const years = Object.keys(G.save.wine.poundsByYear).filter(y => +y !== yr).length; // fruiting years before this one
  return Math.min(8, 2 + 1.5 * years);
}
function harvestRow(rn) {
  const s = G.save, w = s.world, year = seasonOf(s.day).year;
  const row = s.cropRows[rn - 1];
  if (row.harvestedYear === year) return say('ROW ' + rn + ' IS PICKED CLEAN FOR THIS YEAR. THE BUSHES REST, SMUG AND EMPTY.');
  if (row.fruitFell === year) return say('ROW ' + rn + '\'S FRUIT FELL AND WAS GATHERED BY THE GROUND. IT IS NOTED WITHOUT GUILT. THE BIRDS FILED A THANK-YOU.');
  const ripe = s.plants.filter(p => !p.memorial && p.row === rn && p.stage >= 6);
  if (!ripe.length) return say('ROW ' + rn + ' IS NOT RIPE. THE BERRIES ARE STILL ARGUING ABOUT COLOUR.');
  if (!projUse()) return;
  const base = perBushLbs();
  let total = 0;
  const lines = [];
  for (const p of ripe) {
    const lbs = Math.round(base * (0.6 + 0.2 * (row.yieldRating || 1)) * ((row.fruitSet || 60) / 100) * (0.85 + (hashDay(s.day * 7 + p.name.length * 13) % 30) / 100) * 10) / 10;
    total += lbs;
    p.harvestByYear[year] = Math.round(((p.harvestByYear[year] || 0) + lbs) * 10) / 10;
    if (!p.firstHarvestDay) { p.firstHarvestDay = s.day; p.firstHarvestLbs = lbs; }
    if (rn === 1) lines.push(p.name + ': ' + lbs.toFixed(1) + ' LBS, INTO THE ROW 1 BOWL.');
  }
  total = Math.round(total * 10) / 10;
  s.wine.pounds += total; s.wine.poundsByYear[year] = Math.round(((s.wine.poundsByYear[year] || 0) + total) * 10) / 10;
  row.harvestedYear = year; saveGame();
  if (rn === 1) {
    const gone = s.plants.filter(p => p.memorial && p.firstSix && p.row === 1);
    for (const g of gone) lines.push('THE EMPTY PLACE WHERE ' + g.name + ' STOOD: A QUIET LINE, A MARKER BRUSHED CLEAN, A BOWL WITH ROOM IN IT.');
    lines.push('LILY FERIES THE SMALL BOWL TO THE BARN WITH BOTH HANDS AND TOTAL SERIOUSNESS. NOT ONE BERRY IS LOST. THIS IS CHECKED. THIS IS PRAISED.');
  }
  lines.push('ROW ' + rn + ' HARVESTED: ' + total.toFixed(1) + ' LBS. THE BASKET COUNTER BY THE BARN DOOR READS ' + s.wine.poundsByYear[year].toFixed(1) + ' LBS FOR THE YEAR.');
  if (w.ch === 10 && !w.flags.q900) {
    w.flags.q900 = true; saveGame();
    lines.push('FRANK, AT THE FENCE, DOING ARITHMETIC THE WAY OTHER MEN DO PRAYER: NINE HUNDRED POUNDS. THE BOOK SAYS A WINEMAKER WANTS NINE HUNDRED POUNDS.', 'AT THIS MANY BUSHES, AT THIS WEIGHT APIECE — NOT THIS YEAR. NOT YET. THE FIELD IS YOUNG, THE ROWS ARE NOT ALL PLANTED, AND THE BUSHES ARE STILL BECOMING. BUT THE NUMBER IS WRITTEN DOWN NOW, WHERE NUMBERS BECOME PLANS.');
  }
  say(lines);
}
function tasting() {
  const s = G.save, w = s.world;
  const b = s.wine.batches[s.wine.batches.length - 1];
  const lines = ['A LATE-OCTOBER EVENING. THE TABLE IS SET IN THE BARN: CONSTANCE, AND THE PASTOR — COME AT LAST TO TASTE WHAT THE FIELD HAS MADE, AS FRANK HAS BEEN PROMISING HIM ALL YEAR.'];
  if (b && b.verdict === 'LOVELY') lines.push('THE WINE IS POURED. THE PASTOR HOLDS IT TO THE LIGHT LIKE A MAN WHO HAS BEEN HANDED A LETTER FROM A FRIEND.', 'PASTOR: LOVELY. (ONE WORD. IT IS ENOUGH. IT IS, IN FACT, THE WHOLE REVIEW.)', 'CONSTANCE: YOU CAN TASTE THE FIELD IN IT. ALL THAT WORK, AND IT COMES UP THROUGH THE GLASS LIKE A REPORT. (SHE SAYS IT TO THE PASTOR. SHE LOOKS AT FRANK WHEN SHE SAYS IT.)');
  else if (b && b.verdict === 'SWEET AS CANDY') lines.push('THE WINE IS POURED. IT IS — THERE IS NO OTHER WORD — SWEET AS CANDY. CONSTANCE LAUGHS INTO HER GLASS, DELIGHTED AND BETRAYED IN EQUAL MEASURE.', 'PASTOR: THE CHILDREN AT THE HARVEST SUPPER WILL FIGHT OVER THIS, FRANK. THE ADULTS WILL PRETEND NOT TO.');
  else if (b && b.verdict === 'TART') lines.push('THE WINE IS POURED. IT IS TART — HONESTLY, STRUCTURALLY TART. THE TABLE SURVIVES IT WITH GOOD HUMOUR AND WATER.', 'PASTOR: IT WOULD WAKE A MAN FOR MORNING PRAYER, FRANK. THERE ARE WORSE MINISTRIES.');
  else lines.push('THE WINE IS POURED. IT IS AN HONEST WINE — NOT THE ONE FRANK DREAMED, AND NOT A LIE EITHER. THE TABLE DRINKS IT WITH RESPECT.', 'CONSTANCE: IT TASTES LIKE THE YEAR IT WAS. THAT IS ALL ANY WINE CAN TRULY SAY.');
  lines.push('CONSTANCE RAISES HER GLASS, LAST AND SLOWEST: TO THE FIELD. AND TO THE MAN WHO TALKED ABOUT IT AT THIS TABLE UNTIL THE TABLE BELIEVED HIM. (SHE IS SMILING. SHE HAS BEEN SMILING SINCE THE FIRST POUR.)');
  lines.push('AND AT THE END OF THE TABLE, WITH THE GLASSES LOW AND THE LIGHT GOING, FRANK SAYS THE THING THE WHOLE FIELD HAS BEEN WAITING TO HEAR HIM SAY PLAINLY:', 'FRANK: NEXT YEAR, AND EVERY YEAR: WINE. I AM A WINEMAKER. THE FIELD IS A VINEYARD THAT HAPPENS TO BE BLUEBERRIES. WE ARE GOING TO NEED MORE BUSHES. (CONSTANCE: WE ARE GOING TO NEED MORE EVERYTHING, FRANK. SHE IS SMILING WHEN SHE SAYS IT.)');
  say(lines, () => completeChapter(10));
}
function ch10Opening() {
  say(['SUMMER, AND THE FIELD IS HEAVY WITH ITS FIRST REAL FRUITING — EVERY BUSH A SMALL ARGUMENT THAT THE WHOLE STORY WAS WORTH IT.', 'FIRST, A REHEARSAL: A BATCH FROM BOUGHT FRUIT, AT THE BARN KITCHEN, TO LEARN ON BEFORE THE FIELD\'S OWN BERRIES ARE ASKED TO PERFORM.']);
}
function ch10Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.flags.wineNote) { const note = w.flags.wineNote; w.flags.wineNote = null; saveGame(); return [note]; }
  if (w.step === 2 && !w.flags.ripened) {
    w.flags.ripened = true;
    for (const p of s.plants) if (!p.memorial && p.row && p.stage === 5) { p.stage = 6; if (!p.fruitDay) p.fruitDay = s.day; }
    for (let rn = 1; rn <= 12; rn++) if (s.plants.some(p => !p.memorial && p.row === rn)) s.cropRows[rn - 1].ripeDay = s.day;
    saveGame();
    return ['THE FIELD TURNS BERRY-DARK, ROW BY ROW, LIKE A PAGE BEING READ ALOUD. THE HARVEST IS ON. ROW 1 FIRST — BY NAME, INTO ITS OWN BOWL.'];
  }
  if (w.step === 2) {
    const year = seasonOf(s.day).year, lines = [];
    for (let rn = 1; rn <= 12; rn++) {
      const row = s.cropRows[rn - 1];
      if (row.ripeDay && row.harvestedYear !== year && row.fruitFell !== year && s.day - row.ripeDay > 5) { row.fruitFell = year; lines.push('ROW ' + rn + '\'S FRUIT, UNHARVESTED, LET GO IN THE NIGHT AND FELL. IT IS NOTED WITHOUT GUILT. THE GROUND KEEPS WHAT THE GROUND IS GIVEN.'); }
    }
    const open = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(rn => s.plants.some(p => !p.memorial && p.row === rn) && s.cropRows[rn - 1].harvestedYear !== year && s.cropRows[rn - 1].fruitFell !== year);
    if (!open.length) { w.step = 3; saveGame(); lines.push('THE HARVEST IS IN: ' + (s.wine.poundsByYear[year] || 0).toFixed(1) + ' LBS FOR THE YEAR. NOW — BATCH TWO, FROM THE FIELD\'S OWN FRUIT, AT YOUR OWN RATIO. THE KITCHEN WAITS, AND THE JOURNAL HOLDS THE LESSON.'); }
    if (lines.length) return lines;
  }
  return null;
}
function chapterDawnPrep(ev) { const w = G.save.world; if (w.ch === 2) ch2DawnPrep(ev); if (w.ch >= 3) { G.save.world.flags.heaterLit = false; } if (w.ch >= 6) ch6DawnPrep(); }
function seasonKey() { const so = seasonOf(G.save.day); return so.year * 4 + so.idx; }
function ch6DawnPrep() {
  const s = G.save, w = s.world;
  w.flags.wasWatered = {};
  for (const p of s.plants) if (p.watered && p.location === 'GREENHOUSE') w.flags.wasWatered[p.name] = true;
  for (let i = 0; i < 5; i++) if (s.field.tarp[i] === 1 && s.day - (s.field.tarpDay[i] || 0) >= 4) s.field.tarp[i] = 2;
  if (w.flags.mulchComing && w.flags.mulchComing <= s.day) { s.field.mulch += 8; w.flags.mulchComing = null; }
  if (w.ch >= 8) {
    if (w.flags.seasonKey == null) w.flags.seasonKey = seasonKey();
    if (w.flags.seasonKey !== seasonKey()) {
      w.flags.seasonKey = seasonKey();
      for (const r of s.cropRows) if (r.fedStamp != null && r.fedStamp !== seasonKey()) { r.yieldRating = Math.max(0, r.yieldRating - 1); r.fedStamp = null; }
      w.flags.seasonChanged = seasonOf(s.day).idx;
      for (const p of s.plants) if (!p.memorial && p.location === 'GARDEN') {
        p.gardenSeasons = (p.gardenSeasons || 0) + 1;
        if (p.gardenSeasons >= 4) p.gardenState = 'FLOURISHING'; else if (p.gardenSeasons >= 2) p.gardenState = 'ESTABLISHED';
      }
    }
  }
}
function ch2DawnPrep(ev) {
  const s = G.save, w = s.world;
  // stratification: the fridge tray banks one day per winter day
  if (w.flags.fridgeTray && !s.tray.ready && seasonOf(s.day).idx === 3) s.tray.stratDays++;
}
function ch2Opening() {
  say(['FALL IS COMING ON. THE SIX ARE SEEDLINGS, AND THE SECOND PACKET HAD MORE TO SAY.', 'FRANK: THE REST OF THE SEEDS NEED A WINTER FIRST. COLD, DARK, PATIENT. LIKE A FRIDGE, BUT WITH BEARS.', 'CONSTANCE: THE FRIDGE WILL DO, FRANK. NO BEARS REQUIRED.', 'AND THERE IS THE OTHER THING: THIS YARD IS LOVELY. IT IS ALSO SMALL.', 'CONSTANCE: LAND, THEN. WE START LOOKING. QUIETLY. THE HOUSE, FRANK — INSIDE, WHERE THE FRIDGE IS.']);
}
function ch2Dawn(ev) {
  const s = G.save, w = s.world;
  if (w.step === 0) {
    if (s.day < 36) s.day = 36; // the summer passes, the way summers do
    w.step = 1;
    return ['THE SUMMER PASSES THE WAY SUMMERS DO — ALL AT ONCE, LOOKING BACK.', 'FALL, THEN. THE SECOND PACKET COMES OUT OF THE DRAWER. THE FRIDGE GETS A TENANT.'];
  }
  if (w.step === 1) {
    if (w.flags.fridgeTray && w.flags.carried) { w.step = 2; return null; }
    if (!w.flags.fridgeTray) return ['THE SEEDS WAIT IN THEIR PACKET. THE FRIDGE, FRANK. COLD FIRST.'];
    return null;
  }
  if (w.step === 2) { w.step = 3; return ['THE FIRST HOUSE: A FINE HOUSE. THE LAND WAS A POSTAGE STAMP WITH AMBITIONS.', 'CONSTANCE: NEXT.']; }
  if (w.step === 3) { w.step = 4; return ['THE SECOND HOUSE HAD LAND ENOUGH FOR A GOAT AND STRONG OPINIONS ABOUT BOTH. THE HOUSE ITSELF WAS LEANING. IT HAD A SLOPE AND A SMELL.', 'CONSTANCE: NEXT.']; }
  if (w.step === 4) {
    w.step = 5; w.flags.omaVisit = true; w.flags.trips = 0;
    return ['THE THIRD HOUSE: PERFECT LAND. ALSO A TRAIN, WITH RIGHT OF WAY THROUGH THE MIDDLE OF EVERYTHING.', 'CONSTANCE: WE SELL THIS ONE FIRST. NO MORE FALLING FOR FIELDS WE CANNOT CARRY.', 'FRANK: SELL THE HOUSE TO BUY THE LAND. WE PACK LIKE WE MEAN IT — ONE VAN LOAD A DAY. THE BOXES ARE BY THE STAIRS.'];
  }
  if (w.step === 5) { w.flags.omaVisit = false; return null; }
  if (w.step === 6) {
    // the winter deepens until the tray has had its ten cold days
    if (s.tray.stratDays < 10) { if (s.day < 54) s.day = 54; s.tray.stratDays = 12; }
    s.tray.ready = true; s.tray.n = 40;
    w.step = 7; w.flags.frostIn = 2;
    return ['IN THE NIGHT, IN THE COLD, IN THE DARK OF THE FRIDGE — EVERYTHING GERMATED. ALL OF IT. AT ONCE.', 'FRANK: THEY ALL CAME UP! EVERY LAST ONE! IT IS A SMALL GREEN RIOT!', 'CONSTANCE: THEN WE POT THEM UP, FRANK. ONE AT A TIME. AT THE SHELF, BY THE TRAY.', 'FRANK: WITH NAMES. OBVIOUSLY. WITH NAMES.'];
  }
  if (w.step === 7) {
    if (w.flags.frostIn > 0 && !w.flags.frostDone) {
      w.flags.frostIn--;
      if (w.flags.frostIn === 1) { w.flags.coldComing = true; return ['THE RADIO SAYS A HARD FREEZE TONIGHT. THE SHELF CROWD WILL FEEL IT.', 'A BLANKET OVER THE SHELF — AT THE GROW-LIGHT END OF IT — WOULD KEEP THE COLD OFF. OR ALVIN STANDS GUARD. HE WOULD PREFER TO STAND GUARD.']; }
      if (w.flags.frostIn === 0) { startFrostTrial(); return null; }
    }
    return null;
  }
  return null;
}
function startFrostTrial() {
  const s = G.save, w = s.world;
  const sprouts = s.plants.filter(p => !p.memorial && p.location === 'WINDOW' && !p.firstSix);
  if (!w.flags.blanket) for (const p of sprouts) if (p.health === 0) p.health = 1; // the cold finds them first
  saveGame();
  startTrial({ foe: 'FROST', kind: 'frostTray', pressure: 25, vigor: 22, plantsList: sprouts.length ? sprouts : sixPlants(), msg: 'THE COLD COMES FOR THE SHELF! ALVIN PLANTS HIMSELF IN THE DRAFT AND GROWLS AT THE WEATHER ITSELF!' });
}
TRIAL_OUTCOMES.frostTray = {
  win(t) {
    G.save.world.flags.frostDone = true; G.save.world.flags.coldComing = false; saveGame();
    say(['THE FREEZE BREAKS AGAINST ONE SMALL DOG AND A CLOSED DOOR. THE SHELF CROWD STANDS. EVERY LEAF ACCOUNTED FOR.', 'ALVIN IS FROSTED AT THE TIPS AND PLEASED WITH HIMSELF.']);
  },
  lose(t, fled) {
    const s = G.save, w = s.world;
    if (fled) { w.flags.frostIn = 1; saveGame(); return say('ALVIN BACKS OFF TO REGROUP. THE COLD WILL TRY AGAIN TOMORROW NIGHT. IT ALWAYS DOES.'); }
    w.flags.frostDone = true; w.flags.coldComing = false;
    for (const p of s.plants) {
      if (p.memorial || p.location !== 'WINDOW') continue;
      if (p.health < 3) p.health++;
    }
    for (const p of sixPlants()) { if (!p.memorial) { if (p.health < 3) p.health++; p.wateredDays = Math.max(0, p.wateredDays - 1); } }
    saveGame();
    say(['THE COLD GOT IN. LEAVES CURL, SHOULDERS HUNCH — A STEP BACK FOR THE WHOLE SHELF, AND THE SIX FEEL IT TOO.', 'CONSTANCE: THEY ARE ALIVE, FRANK. SORE, AND ALIVE. WE WATER, WE WAIT, WE LEARN WHERE THE DRAFT LIVES.']);
  },
};

function chapterDawn(ev) { const w = G.save.world; if (w.ch === 2) return ch2Dawn(ev); if (w.ch === 3) return ch3Dawn(ev); if (w.ch === 4) return ch4Dawn(ev); if (w.ch === 5) return ch5Dawn(ev); if (w.ch === 6) return ch6Dawn(ev); if (w.ch === 7) return ch7Dawn(ev); if (w.ch === 8) return ch8Dawn(ev); if (w.ch === 9) return ch9Dawn(ev); if (w.ch === 10) return ch10Dawn(ev); if (w.ch === 11) return ltDawn(ev); return null; }

const CHAPTER_INFO = [
  null,
  { name: 'SEEDS', teaser: 'SIX POTS, SIX PROMISES. NO LAND YET — BUT A START.' },
  { name: 'SPROUTS', teaser: 'A HUNDRED LITTLE PROMISES, AND NOWHERE TO PUT THEM. YET.' },
  { name: 'LANDING', teaser: 'THE BARN WAS NEVER THE PLAN. THE FIELD WAS. THEY CAME AS A SET.' },
  { name: 'PLANS', teaser: 'HE MEASURED IT TWICE. IT WAS SQUARE. SOME DREAMS HAVE CORNERS.' },
  { name: 'DOWNSTAIRS', teaser: 'SHE GOT THE DOWNSTAIRS. THE DOG GOT HER FEET. EVERYONE LANDED SOFTLY.' },
  { name: 'THE FIELD', teaser: 'THEY STARTED IN A FRIDGE AND A PRAYER. NOW THEY HAVE AN ADDRESS: ROW ONE.' },
  { name: 'THE BARBER', teaser: 'SOMETHING OUT THERE GIVES HAIRCUTS. FRANK HAS DECIDED TO LET IT.' },
  { name: 'WEEDS', teaser: "THE WEEDS WILL BE BACK THURSDAY. SO WILL HE. IT ISN'T A WAR, EXACTLY. IT'S A MARRIAGE." },
  { name: 'THE FORSYTHIA', teaser: 'FIRST THE YELLOW BUSH. THEN THE WHOLE FIELD, HOLDING ITS BREATH, IN WHITE.' },
  { name: 'WINE', teaser: 'HE ASKED WHAT HE WOULD DO WITH NINE HUNDRED POUNDS OF BLUEBERRIES. THE ANSWER FIT IN A SMALL GLASS.' },
];
let cardChapter = 1;
function completeChapter(n) {
  const w = G.save.world;
  if (n === 1) G.save.chapterDone = true;
  w.ch = n + 1; w.step = 0; saveGame();
  cardChapter = n; mode = 'card'; cardSel = 0;
}
function checkChapter() {
  const s = G.save;
  if (s.world.ch === 1 && !s.chapterDone && s.deerBeaten && anyStageAtLeast(3)) { completeChapter(1); return true; }
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
/* Trials, generalized (spec 2.5): Alvin's moves never change; the foe,
   the stakes and the outcome do. cfg: {foe, kind, pressure, vigor, pot
   (index into the six, for the snapshot), plantsList, msg, graze, snap,
   row}. With no cfg this is the chapter-1 deer, exactly as shipped. */
// TRIAL_OUTCOMES is declared at the top of the file (chapters register into it)
function startTrial(cfg) {
  cfg = cfg || {};
  const foe = cfg.foe || 'DEER';
  let pot = cfg.pot != null ? cfg.pot : strongestPot();
  if (pot < 0) pot = 0;
  const p = sixPlants()[pot];
  trial = {
    foe, kind: cfg.kind || 'deer',
    pot, pressure: cfg.pressure || 30, maxPressure: cfg.pressure || 30,
    phase: 'intro', msg: cfg.msg || 'ALVIN LEAPS IN FRONT OF THE BENCH, BARKING!', timer: 0,
    menu: 0, moveSel: 0, shield: false, armor: false, over: false, result: null,
    vigor: cfg.vigor || MAX_VIGOR[p.stage], maxVigor: cfg.vigor || MAX_VIGOR[p.stage], anim: null,
    plantsList: cfg.plantsList || null, row: cfg.row != null ? cfg.row : null,
    turn: 0, foeTurns: 0, telly: null, snapUsed: false, snap: !!cfg.snap,
    foeArmor: foe === 'WEEDS', graze: !!cfg.graze, grazeStreak: 0, grazeLands: 0,
    lastMove: null, sameMove: 0, wave: cfg.wave || 1, waves: cfg.waves || null, cfgRef: cfg,
    watch: cfg.watch || null,
  };
  mode = 'trial';
}

function trialSetMsg(m, phase) { trial.msg = m; trial.phase = phase || 'wait'; trial.timer = 0; }
function trialUpdate(dt) {
  const t = trial;
  t.timer += dt;
  if (t.phase === 'wait' && Input.aHit && t.timer > 0.25) t.timer = 2; // a brisk player may tap through the result message
  if (t.phase === 'intro' && t.timer > 1.1) { t.phase = 'menu'; t.menu = 0; t.sel = 0; }
  else if (t.phase === 'wait' && t.timer > 1.15) {
    if (t.over) return endTrial();
    if (t.foeTurn) { t.foeTurn = false; foeAct(); }
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
    else { trialSetMsg(t.foe === 'DEER' ? 'YOU BACK AWAY SLOWLY. THE DEER WINS THIS ROUND OF STARING.' : 'ALVIN BACKS OFF, SLOWLY. THIS IS NOT OVER — ONLY POSTPONED.'); t.over = true; t.result = 'flee'; }
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
  // moves — all Alvin's; the numbers bend a little by foe (spec 2.5)
  const mv = MOVES[t.sel];
  if (mv === t.lastMove) t.sameMove++; else { t.lastMove = mv; t.sameMove = 1; }
  t.turn++;
  const pdmg = base => {
    let d = base;
    if (t.foe === 'BARBER' && mv === 'LUNGE') d = Math.ceil(base / 2);
    if (t.foe === 'WEEDS' && t.foeArmor && (mv === 'LUNGE' || mv === 'BARK')) d = Math.max(1, base - 2);
    if (t.foe === 'WEEDS' && mv === 'BARK') d = 2;
    return d;
  };
  const foeName = t.foe === 'DEER' ? 'THE DEER' : t.foe === 'FROST' ? 'THE COLD' : t.foe === 'WEEDS' ? 'THE WEEDS' : 'THE BARBER';
  if (mv === 'LUNGE') {
    t.anim = 'lunge';
    t.pressure = Math.max(0, t.pressure - pdmg(6));
    if (t.pressure <= 0) { trialSetMsg('ALVIN LUNGES! ' + foeName + ' BREAKS AND RUNS!'); t.over = true; t.result = 'win'; saveGame(); return; }
    trialSetMsg('ALVIN LUNGES! ' + foeName + ' STAGGERS BACK.');
  }
  else if (mv === 'GUARD') { t.shield = true; trialSetMsg('ALVIN PLANTS HIS PAWS. HE WILL TAKE THE NEXT HIT HIMSELF.'); }
  else if (mv === 'DIG IN') {
    t.armor = true;
    if (t.foe === 'WEEDS') {
      if (t.foeArmor) { t.foeArmor = false; t.pressure = Math.max(0, t.pressure - 4); trialSetMsg('ALVIN TEARS AT THE ROOTS! THE MAT GIVES — AND THE WEEDS REEL!'); if (t.pressure <= 0) { t.over = true; t.result = 'win'; saveGame(); return; } }
      else { t.pressure = Math.max(0, t.pressure - 4); trialSetMsg('ALVIN DIGS IN AMONG THE ROOTS. THE WEEDS HATE THIS.'); if (t.pressure <= 0) { t.over = true; t.result = 'win'; saveGame(); return; } }
    } else trialSetMsg('ALVIN DIGS IN. NOTHING PUSHES PAST HIM EASILY.');
  }
  else if (mv === 'BARK') {
    t.anim = 'bark';
    t.pressure = Math.max(0, t.pressure - pdmg(8));
    if (t.pressure <= 0) { trialSetMsg('ALVIN BARKS HIS BRAVE HEART OUT! ' + foeName + ' IS GONE!'); t.over = true; t.result = 'win'; saveGame(); return; }
    const flinchP = t.foe === 'BARBER' ? 0.45 : t.foe === 'WEEDS' ? 0 : 0.3;
    if (Math.random() < flinchP) { trialSetMsg('ALVIN USED BARK! ' + foeName + ' FLINCHED!'); saveGame(); return; } // foe loses turn
    trialSetMsg('ALVIN USED BARK! ' + foeName + ' STAMPS, UNIMPRESSED BUT RATTLED.');
  }
  t.foeTurn = true;
}
function foeAct() {
  const t = trial;
  if (t.foe === 'FROST') return frostAct();
  if (t.foe === 'WEEDS') return weedsAct();
  if (t.foe === 'BARBER') return barberAct();
  return deerAct();
}
function foeHit(dmg, name, flavor) {
  const t = trial;
  if (t.armor) dmg = Math.max(1, dmg - 2);
  if (t.shield) { dmg = Math.floor(dmg / 2); t.shield = false; }
  t.vigor = Math.max(0, t.vigor - dmg);
  trialSetMsg(flavor ? flavor.replace('%D', dmg) : (t.foe + ' USED ' + name + '! IT GETS AT ALVIN. (-' + dmg + ')'));
  if (t.vigor <= 0) { t.over = true; t.result = 'lose'; }
  t.foeTurn = false;
}
function frostAct() {
  const t = trial; t.foeTurns++;
  // SETTLE: the cold exploits a repeated move (spec 2.5)
  if (t.sameMove >= 3) { t.pressure += 5; t.sameMove = 0; trialSetMsg('THE COLD SETTLES INTO THE PATTERN OF IT. (+5 PRESSURE)'); t.foeTurn = false; return; }
  if (t.telly) {
    const kind = t.telly; t.telly = null;
    if (kind === 'SNAP') { t.snapUsed = true; foeHit(t.kind === 'frostBlossom' ? 10 : 9, 'SNAP', 'THE COLD SNAPS SHUT LIKE A TRAP! (-%D)'); }
    else foeHit(6, 'GUST', 'THE GUST HITS LIKE A SLAP OF ICE WATER! (-%D)');
    return;
  }
  if (t.snap && !t.snapUsed && t.foeTurns % 4 === 3) { t.telly = 'SNAP'; foeHit(5, 'CREEP', 'THE COLD CREEPS IN — AND SOMEWHERE, WOOD TICKS. SOMETHING IS COMING. (-%D)'); return; }
  if (t.foeTurns % 3 === 0) { t.telly = 'GUST'; foeHit(4, 'CREEP', 'THE COLD CREEPS IN. THE AIR THICKENS — A GUST IS GATHERING. (-%D)'); return; }
  foeHit(4, 'CREEP');
}
function weedsAct() {
  const t = trial; t.foeTurns++;
  if (Math.random() < 0.45) { t.pressure += 4; trialSetMsg('THE WEEDS CREEP — A ROOT RUNNER FINDS NEW GROUND. (+4 PRESSURE)'); t.foeTurn = false; return; }
  foeHit(t.kind === 'weedsWar' ? 7 : 5, 'CHOKE');
}
function barberAct() {
  const t = trial; t.foeTurns++;
  if (t.foeTurns % 3 === 0) { t.pressure += 5; trialSetMsg('THE BARBER IS GONE. JUST — GONE. AND THE PRESSURE OF NOT KNOWING GROWS. (+5)'); t.foeTurn = false; return; }
  if (t.shield) { t.shield = false; trialSetMsg('A SNIP IN THE DARK — AND ALVIN IS THERE. THE CUT FINDS ONLY FUR AND SPITE. (0)'); t.foeTurn = false; return; }
  foeHit(3, 'SNIP');
}

function deerAct() {
  const t = trial;
  const r = Math.random();
  let dmg, name;
  if (t.graze && r >= 0.85) { // GRAZE: no wound — the deer settles in to eat
    t.grazeStreak++; t.grazeLands++;
    if (t.grazeStreak >= 2) { t.pressure += 3; trialSetMsg('THE DEER SETTLES IN TO GRAZE, PERFECTLY AT HOME. (+3 PRESSURE)'); }
    else trialSetMsg('THE DEER LOWERS ITS HEAD TO GRAZE. IT IS IN NO HURRY AT ALL.');
    t.foeTurn = false;
    return;
  }
  if (r < 0.5) { dmg = 7; name = 'NIBBLE'; }
  else if (r < 0.8) { dmg = 4; name = 'STOMP'; }
  else { dmg = 2; name = 'STARE'; }
  t.grazeStreak = 0;
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
  if (t.kind === 'deer') {
    if (t.result === 'win') {
      s.deerBeaten = true; s.deerPresent = false; saveGame();
      say('THE YARD IS SAFE. ALVIN TAKES A SMALL, PROUD BOW. THE SPROUTS STAND TALL. WELL. TALL-ISH.', () => { checkChapter(); });
    } else if (t.result === 'lose') {
      const p = sixPlants()[t.pot];
      if (p.stage > 1) { p.stage--; if (p.stage < 3) p.seedlingDay = null; if (p.stage < 2) p.sproutedDay = null; }
      p.wateredDays = 0; p.vigor = MAX_VIGOR[p.stage] || 0;
      saveGame();
      say('THE DEER GOT PAST ALVIN AND MOWED THE SPROUT DOWN. IT WILL GROW BACK. SO WILL YOU.', () => { fading = 'dawn'; fade = 1; setTimeout(dawn, 350); });
    }
    return;
  }
  if (t.result === 'win' && t.waves && t.wave < t.waves.length) {
    const cfg = Object.assign({}, t.cfgRef, { wave: t.wave + 1, pressure: t.waves[t.wave], vigor: t.maxVigor, msg: 'THE SECOND WAVE COMES OVER THE FENCE LINE LIKE WEATHER. ALVIN SHAKES HIMSELF AND DIGS IN AGAIN.' });
    startTrial(cfg);
    return;
  }
  const oc = TRIAL_OUTCOMES[t.kind];
  if (oc) {
    if (t.result === 'win') oc.win(t);
    else oc.lose(t, t.result === 'flee');
  }
}

function trialPlantsList() { return trial && trial.plantsList ? trial.plantsList : sixPlants(); }
function trialSnapshot() {
  if (!trial) return null;
  const p = sixPlants()[trial.pot];
  return { actor: 'ALVIN', foe: trial.foe, kind: trial.kind, pressure: trial.pressure, maxPressure: trial.maxPressure, vigor: trial.vigor, maxVigor: trial.maxVigor, pot: trial.pot, stage: p.stage, phase: trial.phase, over: trial.over, result: trial.result, msg: trial.msg, wave: trial.wave, plants: trialPlantsList().map(q => q.name + ':' + q.stage) };
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
  G.save = newSave(); titleSel = 0; area = 'yard'; AW = MAP_W; AH = MAP_H; npcList = [];
  player.tx = 11; player.ty = 6; syncPixels(player);
  alvin.tx = 10; alvin.ty = 7; syncPixels(alvin);
  mode = 'overworld'; startIntro();
}
function continueGame() {
  const s = loadSave(); if (!s) return;
  G.save = s;
  area = AREAS[s.world.area] ? s.world.area : 'yard';
  AW = curArea().w; AH = curArea().h;
  player.tx = s.player.x; player.ty = s.player.y; player.dir = s.player.dir || 'down'; syncPixels(player);
  layoutNPCs();
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
  // sun (top-centre, clear of the tree), with a pale haze behind it
  ctx.fillStyle = '#a8dcff'; ctx.fillRect(73, y0, 18, 18);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(76, y0 + 2, 12, 12);
  ctx.fillStyle = '#ffec9e'; ctx.fillRect(79, y0 + 5, 6, 6);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(81, y0, 2, 2); ctx.fillRect(81, y0 + 14, 2, 2); ctx.fillRect(72, y0 + 7, 2, 2); ctx.fillRect(90, y0 + 7, 2, 2);
  // the little blue house, left — with a chimney and its first smoke
  ctx.fillStyle = '#b0552f'; ctx.fillRect(36, y0 + 2, 5, 7);
  ctx.fillStyle = '#e8edf2'; ctx.fillRect(42, y0 + 1, 3, 2); ctx.fillRect(46, y0 + 2, 2, 2);
  ctx.fillStyle = '#2f56b8'; ctx.fillRect(4, y0 + 12, 40, 4); ctx.fillRect(8, y0 + 8, 32, 4); ctx.fillRect(14, y0 + 4, 20, 4);
  ctx.fillStyle = '#7fb2e8'; ctx.fillRect(14, y0 + 4, 20, 1); // a lit ridge along the roof's top step
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
  ctx.fillStyle = '#6fce52'; ctx.fillRect(0, y0 + 38, VW, 2); // the lit edge where the fence line sits
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
  // the dark lower field carries a whisper of the banner's grass dressing
  // so the plaque and menu don't float on a void
  ctx.fillStyle = '#2c5236';
  for (const tx of [8, 26, 128, 146]) { ctx.fillRect(tx, 112, 1, 2); ctx.fillRect(tx + 2, 113, 1, 2); }
  for (const tx of [16, 138]) { ctx.fillRect(tx, 88, 1, 2); ctx.fillRect(tx + 2, 89, 1, 2); }
  ctx.fillStyle = '#3f6a45'; ctx.fillRect(10, 126, 2, 2); ctx.fillRect(148, 104, 2, 2);
  // the plaque casts a soft shadow, and wears a fine inner frame line
  ctx.fillStyle = 'rgba(10,20,13,0.5)'; ctx.fillRect(17, 67, 132, 34);
  ctx.fillStyle = '#14251a'; ctx.fillRect(14, 64, 132, 34);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(14, 64, 132, 1); ctx.fillRect(14, 97, 132, 1); ctx.fillRect(14, 64, 1, 34); ctx.fillRect(145, 64, 1, 34);
  ctx.fillStyle = '#2c5236'; ctx.fillRect(17, 67, 126, 1); ctx.fillRect(17, 94, 126, 1); ctx.fillRect(17, 67, 1, 28); ctx.fillRect(142, 67, 1, 28);
  drawText('HOPE STARTS', 80 - textW('HOPE STARTS', 2) / 2 + 1, 69, '#14251a', 2);
  drawText('HOPE STARTS', 80 - textW('HOPE STARTS', 2) / 2, 68, '#ffffff', 2);
  drawText('SMALL', 80 - textW('SMALL', 2) / 2 + 1, 83, '#7a4a21', 2);
  drawText('SMALL', 80 - textW('SMALL', 2) / 2, 82, '#ffd94a', 2);
  const chW = textW('CHAPTER 1 · SEEDS', 1);
  drawText('CHAPTER 1 · SEEDS', 80 - chW / 2, 101, '#cfe8cf', 1);
  ctx.fillStyle = '#ffd94a'; // two short gold rules flank the chapter line
  ctx.fillRect(80 - chW / 2 - 11, 103, 6, 1); ctx.fillRect(80 + chW / 2 + 5, 103, 6, 1);
  titleLabels().forEach((l, i) => {
    const y = 107 + i * 8;
    if (i === titleSel) { ctx.fillStyle = 'rgba(10,20,13,0.45)'; ctx.fillRect(38, y - 1, 80, 7); } // the chosen row sits on a soft plate
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
  drawText('THE JOURNAL', 80 - textW('THE JOURNAL', 2) / 2, 8, '#ffffff', 2);
  drawText('WHAT THE FIELD REMEMBERS', 80 - textW('WHAT THE FIELD REMEMBERS', 1) / 2, 21, '#9fc79f', 1);
  const ch = G.save ? G.save.world.ch : 1;
  const rows = [];
  for (let n = 1; n <= 10; n++) rows.push({ n, info: CHAPTER_INFO[n] });
  rows.push({ n: 11, info: { name: 'THE LONG TENDING', teaser: 'NO LAST PAGE. JUST SEASONS, AND A FIELD THAT KNOWS YOUR STEP.' } });
  rows.slice(0, 11).forEach((r, i) => {
    const y = 30 + i * 8;
    const done = r.n < ch || (r.n === 11 && ch === 11);
    const current = r.n === ch;
    const col = done ? '#cfe8cf' : current ? '#ffd94a' : '#5f7263';
    const label = (r.n === 11 ? '∞' : r.n) + ' · ' + r.info.name;
    drawText(label.slice(0, 22), 10, y, col, 1);
    drawText(done ? 'LIVED' : current ? 'NOW' : '—', 132, y, col, 1);
  });
  const cur = rows[Math.min(ch, 11) - 1];
  if (cur && ch <= 11) {
    const t = wrapText(cur.info.teaser, 36).slice(0, 2);
    t.forEach((l, i) => drawText(l, 80 - textW(l, 1) / 2, 121 + i * 7, '#9fc79f', 1));
  }
  drawText('B: BACK', 126, 8, '#9fc79f', 1);
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
  // a soft ground shadow under every character, the same grounding the
  // banner folk and the trial cast already get (translucent, so it reads
  // as shade on path and garden tiles too, not just grass)
  const shx = Math.round(e.px - camX), shy = Math.round(e.py - camY);
  ctx.fillStyle = 'rgba(20,26,20,0.25)';
  ctx.fillRect(shx + 2, shy + 13, 12, 2); ctx.fillRect(shx + 3, shy + 15, 10, 1);
  drawSprite(img, shx, shy, e.dir === 'left');
}
function renderOverworld() {
  if (area === 'barnOut') return renderBerry();
  if (area !== 'yard') return renderArea();
  camX = Math.round(Math.max(0, Math.min(AW * TILE - VW, player.px + 8 - VW / 2)));
  camY = Math.round(Math.max(0, Math.min(AH * TILE - VH, player.py + 8 - VH / 2)));
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
  for (let ty = y0; ty <= y0 + 9; ty++) for (let tx = x0; tx <= x0 + 10; tx++) {
    if (tx < 0 || ty < 0 || tx >= AW || ty >= AH) continue;
    const ch = mapChar(tx, ty), sx = tx * TILE - camX, sy = ty * TILE - camY;
    // ambient sway: flowers and grass tufts lean with a slow two-frame breeze,
    // neighbouring tiles out of phase so the yard shimmers instead of pulsing
    const sway = (Math.floor(perfNow * 1.5) + tx + ty) % 2 === 0;
    const winter = seasonOf(G.save.day).idx === 3;
    let base = TILES.grass; // plain grass tiles get a hashed variety so the lawn isn't flat
    if (ch === 'g') { const h = (tx * 31 + ty * 17) % 9; base = h === 0 ? (sway ? TILES.tuftB : TILES.tuft) : h === 4 ? TILES.grass3 : h === 6 ? TILES.grass4 : h === 7 ? TILES.grass2 : TILES.grass; }
    if (winter && SNOW_TILES.grass) base = SNOW_TILES[base === TILES.tuft ? 'tuft' : base === TILES.tuftB ? 'tuftB' : base === TILES.grass3 ? 'grass3' : base === TILES.grass4 ? 'grass4' : base === TILES.grass2 ? 'grass2' : 'grass'] || base;
    ctx.drawImage(base, sx, sy);
    let t = TILES[TILEMAP[ch]];
    if (ch === 'o') t = sway ? TILES.flowerB : TILES.flower;
    if (winter && SNOW_TILES[TILEMAP[ch]]) t = SNOW_TILES[TILEMAP[ch]];
    if (t && TILEMAP[ch] !== 'grass') ctx.drawImage(t, sx, sy);
    if (ch === 'T') {
      ctx.fillStyle = SHADOW; ctx.fillRect(sx + 2, sy + 13, 12, 2); ctx.fillRect(sx + 3, sy + 15, 10, 1); // the canopy's ground shadow
      ctx.drawImage(winter && SNOW_TREE ? SNOW_TREE : TREE, sx, sy);
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
  // pots on the bench (only plants that still live there)
  sixPlants().forEach(p => {
    if (p.location !== 'BENCH') return;
    const i = p.slot, sx = (9 + i) * TILE - camX, sy = 10 * TILE - camY;
    ctx.fillStyle = '#8a5a30'; ctx.fillRect(sx + 3, sy + 9, 10, 2); // the pot's shadow on the bench slats
    ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], sx, sy - 2);
    if (p.husk) { ctx.fillStyle = '#5a5148'; ctx.fillRect(sx + 4, sy + 2, 8, 3); }
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
  for (const n of npcList) ents.push({ y: n.ty * TILE, draw: () => { contactShadow(n.tx * TILE, n.ty * TILE); drawNPCFigure(n, n.tx * TILE - camX, n.ty * TILE - camY, spkName === n.name); } });
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
  // a fresh hit from Alvin makes the foe flinch for a beat
  const flinch = (t.phase === 'wait' && t.timer < 0.25 && (t.anim === 'lunge' || t.anim === 'bark')) ? (Math.floor(perfNow * 20) % 2 ? 1 : -1) : 0;
  if (t.foe === 'FROST') { // a low bank of glittering cold, breathing frost
    const pu = Math.sin(perfNow * 1.3) * 2;
    ctx.fillStyle = '#dceefb'; ctx.fillRect(92 + flinch, 26 + pu, 52, 22); ctx.fillRect(100 + flinch, 18 + pu, 36, 10);
    ctx.fillStyle = '#bcd9f2'; ctx.fillRect(98 + flinch, 34 + pu, 40, 4); ctx.fillRect(106 + flinch, 22 + pu, 20, 3);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(104 + flinch, 28 + pu, 4, 2); ctx.fillRect(124 + flinch, 38 + pu, 3, 2); ctx.fillRect(134 + flinch, 24 + pu, 2, 2);
    ctx.fillStyle = '#9fc6ea'; for (let i = 0; i < 5; i++) ctx.fillRect(96 + ((i * 13 + Math.floor(perfNow * 9)) % 46) + flinch, 44 + pu + (i % 3), 2, 2);
  } else if (t.foe === 'WEEDS') { // a mat of roots and ambition
    ctx.fillStyle = '#3f7a2e'; ctx.fillRect(90 + flinch, 34, 56, 14);
    ctx.fillStyle = '#4cab36'; for (let i = 0; i < 7; i++) { const wx = 94 + i * 8 + flinch, wh = 10 + (i * 7) % 12; ctx.fillRect(wx, 34 - wh + (i % 2) * 2, 3, wh); }
    ctx.fillStyle = '#6a4a26'; ctx.fillRect(96 + flinch, 44, 44, 2); ctx.fillRect(104 + flinch, 47, 30, 1);
  } else if (t.foe === 'BARBER') { // never quite seen: a neat shadow, and shears
    const sh = Math.floor(perfNow * 0.8) % 3;
    ctx.fillStyle = '#20242a'; ctx.fillRect(108 + flinch + sh, 22, 18, 24); ctx.fillRect(112 + flinch + sh, 14, 10, 9);
    ctx.fillStyle = '#c9ced4'; ctx.fillRect(126 + flinch + sh, 26, 8, 2); ctx.fillRect(126 + flinch + sh, 31, 8, 2);
    ctx.fillStyle = '#20242a'; ctx.fillRect(124 + flinch + sh, 27, 3, 4);
  } else {
    const deerImg = (t.pressure <= 10 || dbob) ? DEER_BIG2 : DEER_BIG;
    ctx.drawImage(deerImg, 86 + flinch, 5 + dbob, 64, 48);
  }
  // what Alvin defends: the garden bench with all six pots, as scenery —
  // the yard's picket fence peeks over the bench, and the bench casts a shadow
  ctx.fillStyle = '#f4f4f0';
  for (let x = 0; x < 94; x += 8) { ctx.fillRect(x, 88, 3, 5); }
  ctx.fillRect(0, 91, 94, 1);
  ctx.fillStyle = SHADOW; ctx.fillRect(0, 106, 52, 3);
  for (let i = 0; i < 3; i++) ctx.drawImage(TILES.bench, 2 + i * 16, 92);
  trialPlantsList().slice(0, 6).forEach((p, i) => ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], 4 + i * 10, 84, 10, 10));
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
  drawText(t.foe, 8, 9, '#20242a', 1);
  drawText('PRESSURE', 8, 17, '#5a6270', 1);
  drawBar(8, 23, 62, t.pressure / t.maxPressure, t.pressure > t.maxPressure / 3 ? '#37b24d' : '#e0483e');
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
      trialPlantsList().forEach((q, i) => {
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
  if (Input.aHit || Input.bHit) { mode = 'overworld'; chapterCardDone(cardChapter); } // KEEP TENDING
}
function chapterCardDone(n) { if (n === 1) ch2Opening(); if (n === 2) ch3Opening(); if (n === 3) ch4Opening(); if (n === 4) ch5Opening(); if (n === 5) ch6Opening(); if (n === 6) ch7Opening(); if (n === 7) ch8Opening(); if (n === 8) ch9Opening(); if (n === 9) ch10Opening(); if (n === 10) ltOpening(); }
function renderCard() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawSceneBanner(2, true);
  drawText('CHAPTER COMPLETE', 80 - textW('CHAPTER COMPLETE', 1) / 2, 70, '#cfe8cf', 1);
  ctx.fillStyle = '#ffd94a'; // two little stars, twinkling in turn
  if (Math.floor(perfNow * 2) % 2 === 0) { ctx.fillRect(24, 71, 1, 3); ctx.fillRect(23, 72, 3, 1); }
  else { ctx.fillRect(133, 71, 1, 3); ctx.fillRect(132, 72, 3, 1); }
  const info = CHAPTER_INFO[cardChapter] || CHAPTER_INFO[1];
  drawText(info.name, 80 - textW(info.name, 2) / 2, 78, '#ffd94a', 2);
  const teaser = wrapText(info.teaser, 34);
  teaser.forEach((l, i) => drawText(l, 80 - textW(l, 1) / 2, 94 + i * 7, '#ffffff', 1));
  if (cardChapter === 1) {
    // the roll call: the six, named, cycling two at a time so it never crowds
    const names = sixPlants().map(p => p.name);
    const pair = Math.floor(perfNow / 2.5) % 3;
    const roll = names[pair * 2] + ' · ' + names[pair * 2 + 1];
    const pre = 'THE SIX: ';
    const rx = 80 - (textW(pre, 1) + textW(roll, 1)) / 2;
    drawText(pre, rx, 110, '#cfe8cf', 1);
    drawText(roll, rx + textW(pre, 1), 110, '#ffd94a', 1);
  } else {
    const liv = livingPlants().length, mem = G.save.plants.length - liv;
    const line = 'THE REGISTER: ' + liv + ' LIVING' + (mem ? ' · ' + mem + ' REMEMBERED' : '');
    drawText(line, 80 - textW(line, 1) / 2, 110, '#cfe8cf', 1);
  }
  const l = 'KEEP TENDING (A)';
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(Math.round(80 - textW(l, 1) / 2 - 4), 118, textW(l, 1) + 8, 9);
  drawText(l, 80 - textW(l, 1) / 2, 120, '#20242a', 1);
  // no book links on the card — Daniel's ruling: links live on the title
  // menu only, so the card is text + KEEP TENDING and nothing else
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
  wrapText('BERRYDEX: ' + (seen.length ? seen.join(' · ') : 'NOTHING SEEN YET'), 24).slice(0, 2).forEach((l, i) => drawText(l, 32, 57 + i * 7, '#5a6270', 1));
  drawText('TEA ×' + G.save.tea + ' · COMPOST ×' + G.save.compost, 32, 71, '#5a6270', 1);
  drawText('GOOD DIRT ×' + G.save.goodDirt, 32, 78, '#5a6270', 1);
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
  // the cast presents the controls, each standing on a soft ground shade
  // in the panel's own paper tones (as on the register card)
  ctx.fillStyle = '#c9ced4'; ctx.fillRect(12, 20, 12, 1); ctx.fillRect(136, 20, 12, 1);
  ctx.fillStyle = '#dfe9f5'; ctx.fillRect(13, 21, 10, 1); ctx.fillRect(137, 21, 10, 1);
  ctx.drawImage(FRANK_DOWN, 10, 7); ctx.drawImage(ALVIN_DOWN, 134, 7);
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
let regLoc = 'BENCH', regPage = 0, regPlant = -1; // regPlant: index into G.save.plants for the open card
const REG_LOCS = ['BENCH', 'WINDOW', 'FRIDGE', 'GREENHOUSE', 'NURSERY', 'OFFICE', 'ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5', 'ROW6', 'ROW7', 'ROW8', 'ROW9', 'ROW10', 'ROW11', 'ROW12', 'GARDEN', 'MEMORIAL'];
const LOC_PRETTY = { BENCH: 'THE BENCH', WINDOW: 'THE WINDOW SHELF', FRIDGE: 'THE FRIDGE', GREENHOUSE: 'THE GREENHOUSE', NURSERY: 'THE NURSERY', OFFICE: "FRANK'S OFFICE", GARDEN: 'THE GARDEN', MEMORIAL: 'THE BACK PAGES' };
function locPretty(loc) { return LOC_PRETTY[loc] || (loc.startsWith('ROW') ? 'FIELD ' + loc.replace('ROW', 'ROW ') : loc); }
function regLocPlants(loc) {
  if (loc.startsWith('AZ:')) return G.save.plants.filter(p => p.name.startsWith(loc.slice(3)));
  if (loc === 'MEMORIAL') return G.save.plants.filter(p => p.memorial);
  if (loc === 'NURSERY') return G.save.plants.filter(p => p.location === 'GREENHOUSE' && !p.memorial);
  if (loc.startsWith('ROW')) { const r = parseInt(loc.slice(3), 10); return G.save.plants.filter(p => p.row === r && !p.memorial); }
  return G.save.plants.filter(p => p.location === loc && !p.memorial);
}
function regLocationsPresent() {
  return REG_LOCS.filter(l => regLocPlants(l).length > 0 || (l === 'MEMORIAL' && G.save.plants.some(p => p.memorial)));
}
function regInspectMark(p) {
  if (G.save.world.ch === 7 && p && !p.memorial && !p.history.includes('FIRST FALL')) { p.history.push('FIRST FALL'); saveGame(); }
}
function openRegister() {
  regView = 'list'; regSel = 0; regPage = 0;
  const six = sixPlants().find(p => !p.memorial);
  regLoc = six ? (six.row != null ? 'ROW' + six.row : six.location) : 'BENCH';
  if (!regLocPlants(regLoc).length) { const ls = regLocationsPresent(); if (ls.length) regLoc = ls[0]; }
  mode = 'register';
}
function renamePlantObj(p) {
  let v = null;
  try { v = window.prompt('A NAME FOR THIS PLANT:', p.name); } catch (e) {}
  if (v == null) return; // blank/cancel keeps the name Frank gave
  v = String(v).trim().toUpperCase().replace(/[^A-Z0-9 .,'&!?-]/g, '').slice(0, 14).trim();
  if (v) { p.name = v; saveGame(); toast('RENAMED: ' + v); }
}
function registerUpdate() {
  const locs = regLocationsPresent();
  if (regView === 'list') {
    const plants = regLocPlants(regLoc);
    const pageCount = Math.max(1, Math.ceil(plants.length / 6));
    if (Input.bHit) { mode = 'overworld'; return; }
    if (regSel < 0) { // the location header is selected
      if (menuNavHit('left') || menuNavHit('right')) {
        const d = menuNavHit('left') ? -1 : 1;
        let i = locs.indexOf(regLoc); i = (i + d + locs.length) % locs.length;
        regLoc = locs[i]; regPage = 0;
      }
      if (menuNavHit('down')) regSel = plants.length ? 0 : -1;
      if (Input.aHit) { regView = 'index'; regSel = 0; }
      return;
    }
    if (menuNavHit('up')) { regSel--; if (regSel < 0) regSel = -1; }
    if (menuNavHit('down')) { const pageItems = plants.slice(regPage * 6, regPage * 6 + 6).length; if (regSel < pageItems - 1) regSel++; else if (regPage < pageCount - 1) { regPage++; regSel = 0; } }
    if (menuNavHit('left')) { regPage = (regPage + pageCount - 1) % pageCount; regSel = 0; }
    if (menuNavHit('right')) { regPage = (regPage + 1) % pageCount; regSel = 0; }
    if (Input.aHit && plants.length) {
      regPlant = G.save.plants.indexOf(plants[regPage * 6 + regSel]);
      regView = 'card'; regCardSel = 0; regInspectMark(G.save.plants[regPlant]);
    }
  } else if (regView === 'index') {
    const entries = regIndexEntries();
    if (Input.bHit) { regView = 'list'; regSel = -1; return; }
    if (menuNavHit('up')) regSel = (regSel + entries.length - 1) % entries.length;
    if (menuNavHit('down')) regSel = (regSel + 1) % entries.length;
    if (Input.aHit) {
      const e = entries[regSel];
      if (e.kind === 'loc') { regLoc = e.loc; regPage = 0; regSel = -1; regView = 'list'; }
      else if (e.kind === 'az') { regView = 'az'; regSel = 0; }
      else if (e.kind === 'back') { regView = 'back'; regSel = 0; }
      else if (e.kind === 'page') { regView = 'page'; regPage = e.page; regSel = 0; }
    }
  } else if (regView === 'az') {
    if (Input.bHit) { regView = 'index'; regSel = 0; return; }
    if (menuNavHit('left')) regSel = (regSel + 25) % 26;
    if (menuNavHit('right')) regSel = (regSel + 1) % 26;
    if (menuNavHit('up')) regSel = (regSel + 20) % 26;
    if (menuNavHit('down')) regSel = (regSel + 6) % 26;
    if (Input.aHit) {
      const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[regSel];
      const found = G.save.plants.filter(p => p.name.startsWith(letter));
      if (found.length) { regLoc = 'AZ:' + letter; regPage = 0; regSel = -1; regView = 'list'; }
    }
  } else if (regView === 'back') {
    if (Input.bHit) { regView = 'index'; regSel = 0; return; }
    const mems = G.save.plants.filter(p => p.memorial);
    if (menuNavHit('up')) regSel = (regSel + Math.max(1, mems.length) - 1) % Math.max(1, mems.length);
    if (menuNavHit('down')) regSel = (regSel + 1) % Math.max(1, mems.length);
    if (Input.aHit && mems.length) { regPlant = G.save.plants.indexOf(mems[regSel]); regView = 'card'; regCardSel = 0; }
  } else if (regView === 'page') {
    if (Input.bHit || Input.aHit) { regView = 'index'; regSel = 0; return; }
  } else { // card
    if (Input.bHit) { regView = regLoc === 'MEMORIAL' || (G.save.plants[regPlant] && G.save.plants[regPlant].memorial) ? 'back' : 'list'; if (regView === 'list') regSel = 0; return; }
    if (menuNavHit('up') || menuNavHit('down')) regCardSel = 1 - regCardSel;
    if (Input.aHit) {
      if (regCardSel === 0) renamePlantObj(G.save.plants[regPlant]);
      else { regView = 'list'; regSel = 0; }
    }
  }
}
function regIndexEntries() {
  const es = regLocationsPresent().map(l => ({ kind: 'loc', loc: l, label: locPretty(l) + ' (' + regLocPlants(l).length + ')' }));
  es.push({ kind: 'az', label: 'A–Z NAME INDEX' });
  es.push({ kind: 'back', label: 'THE BACK PAGES — IN MEMORY' });
  if (G.save.germ) es.push({ kind: 'page', page: 'GERMINATION', label: 'GERMINATION RECORD' });
  if (G.save.promise) es.push({ kind: 'page', page: 'PROMISE', label: "OMA'S PROMISE" });
  if (G.save.wine.batches.length || G.save.wine.jar) es.push({ kind: 'page', page: 'CELLAR', label: 'THE CELLAR' });
  if (G.save.world.flags.barberKnown) es.push({ kind: 'page', page: 'BARBER', label: 'THE BARBER' });
  if (G.save.world.ch >= 11) es.push({ kind: 'page', page: 'TENDING', label: 'THE LONG TENDING' });
  if (G.save.world.flags.goats) es.push({ kind: 'page', page: 'GOATS', label: 'THE GOATS' });
  return es;
}
function dayOr(day, none) { return day != null ? 'DAY ' + day : none; }
function drawPaw(x, y, col) { // Alvin has signed the journal, in his own way
  ctx.fillStyle = col;
  ctx.fillRect(x + 2, y + 4, 5, 3); ctx.fillRect(x + 3, y + 7, 3, 1);
  ctx.fillRect(x, y + 1, 2, 2); ctx.fillRect(x + 3, y, 2, 2); ctx.fillRect(x + 6, y + 1, 2, 2);
}
const HEALTH_COL = ['#2e8b3a', '#b07f2a', '#d2691e', '#e0483e', '#5a5148'];
function healthGlyph(p) { return p.memorial ? '' : ['', '!', '!!', '!!!', ''][p.health] || ''; }
function plantStageLabel(p) {
  if (p.location === 'GARDEN' && p.gardenState) return p.gardenState;
  return STAGE_NAMES[p.stage];
}
function renderRegister() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawPanel(4, 4, 152, 136);
  const s = G.save;
  if (regView === 'list') {
    const az = regLoc.startsWith('AZ:');
    const plants = az ? s.plants.filter(p => p.name.startsWith(regLoc.slice(3))) : regLocPlants(regLoc);
    drawText('PLANT REGISTER', 80 - textW('PLANT REGISTER', 2) / 2, 10, '#20242a', 2);
    const head = az ? 'NAMES: ' + regLoc.slice(3) : '◀ ' + locPretty(regLoc) + ' ▶';
    if (regSel < 0) { ctx.fillStyle = '#ffe9a8'; ctx.fillRect(9, 21, 142, 10); drawText('▶', 11, 23, '#b03030', 1); }
    drawText(head, 80 - textW(head, 1) / 2, 23, '#20242a', 1);
    const pageCount = Math.max(1, Math.ceil(plants.length / 6));
    if (pageCount > 1) drawText('PAGE ' + (regPage + 1) + '/' + pageCount, 128, 23, '#5a6270', 1);
    plants.slice(regPage * 6, regPage * 6 + 6).forEach((p, i) => {
      const y = 38 + i * 14;
      if (i === regSel) { ctx.fillStyle = '#ffe9a8'; ctx.fillRect(9, y - 3, 142, 12); drawText('▶', 11, y, '#b03030', 1); }
      ctx.fillStyle = '#dfe9f5'; ctx.fillRect(12, y + 9, 136, 1);
      ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], 20, y - 4, 12, 12);
      drawText(p.name.slice(0, 14), 36, y, '#20242a', 1);
      drawText(plantStageLabel(p).slice(0, 9), 92, y, '#5a6270', 1);
      const hg = healthGlyph(p);
      if (p.memorial) drawText('RESTS', 128, y, '#5a6270', 1);
      else if (hg) drawText(hg, 128, y, HEALTH_COL[p.health], 1);
      else drawText(p.watered ? 'WET' : '', 128, y, '#3b6fe0', 1);
    });
    if (!plants.length) drawText('NOTHING HERE. YET.', 14, 44, '#5a6270', 1);
    drawText('A: CARD · ◀▶ PAGE · B: CLOSE', 12, 129, '#5a6270', 1);
    drawPaw(142, 124, '#b09a72');
  } else if (regView === 'index') {
    drawText('THE REGISTER', 80 - textW('THE REGISTER', 2) / 2, 10, '#20242a', 2);
    drawText('EVERY PLANT, BY NAME', 80 - textW('EVERY PLANT, BY NAME', 1) / 2, 24, '#2e8b3a', 1);
    regIndexEntries().slice(0, 9).forEach((e, i) => {
      const y = 38 + i * 11;
      if (i === regSel) { ctx.fillStyle = '#ffe9a8'; ctx.fillRect(9, y - 3, 142, 11); drawText('▶', 11, y, '#b03030', 1); }
      drawText(e.label.slice(0, 34), 20, y, '#20242a', 1);
    });
    drawText('B: BACK', 12, 129, '#5a6270', 1);
    drawPaw(142, 124, '#b09a72');
  } else if (regView === 'az') {
    drawText('NAME INDEX', 80 - textW('NAME INDEX', 2) / 2, 10, '#20242a', 2);
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((L, i) => {
      const x = 16 + (i % 6) * 22, y = 34 + Math.floor(i / 6) * 16;
      const has = s.plants.some(p => p.name.startsWith(L));
      if (i === regSel) { ctx.fillStyle = '#ffe9a8'; ctx.fillRect(x - 3, y - 3, 12, 12); }
      drawText(L, x, y, has ? '#20242a' : '#b9c0c9', 1);
    });
    drawText('A: NAMES UNDER THE LETTER · B: BACK', 12, 129, '#5a6270', 1);
  } else if (regView === 'back') {
    drawText('THE BACK PAGES', 80 - textW('THE BACK PAGES', 2) / 2, 10, '#20242a', 2);
    drawText('IN MEMORY', 80 - textW('IN MEMORY', 1) / 2, 24, '#5a6270', 1);
    const mems = s.plants.filter(p => p.memorial);
    mems.slice(0, 5).forEach((p, i) => {
      const y = 38 + i * 11;
      if (i === regSel) { ctx.fillStyle = '#ffe9a8'; ctx.fillRect(9, y - 3, 142, 11); drawText('▶', 11, y, '#b03030', 1); }
      drawText(p.name.slice(0, 16), 20, y, '#20242a', 1);
      drawText('DAY ' + (p.diedDay || '?'), 108, y, '#5a6270', 1);
    });
    if (!mems.length) drawText('NO ONE RESTS HERE. MAY IT STAY SO.', 14, 40, '#5a6270', 1);
    const named = s.plants.length, living = livingPlants().length;
    drawText('ROLL CALL: ' + named + ' NAMED · ' + living + ' LIVING · ' + mems.length + ' REMEMBERED', 12, 100, '#20242a', 1);
    drawText('BERRYDEX: ' + s.dex.cells.length + '/18 CELLS SEEN', 12, 110, '#20242a', 1);
    if (ltGoalsMet()) drawText('WELL TENDED.', 80 - textW('WELL TENDED.', 1) / 2, 124, '#2e8b3a', 1);
    drawText('B: BACK', 12, 129, '#5a6270', 1);
    drawPaw(142, 124, '#b09a72');
  } else if (regView === 'page') {
    const pg = regPageLines();
    drawText(pg.title, 80 - textW(pg.title, 2) / 2, 10, '#20242a', 2);
    pg.lines.slice(0, 12).forEach((l, i) => drawText(l.slice(0, 36), 14, 32 + i * 9, '#20242a', 1));
    drawText('B: BACK', 12, 129, '#5a6270', 1);
    drawPaw(142, 124, '#b09a72');
  } else {
    const p = s.plants[regPlant];
    if (!p) { regView = 'list'; return; }
    drawText(p.name.slice(0, 12), 14, 11, '#20242a', 2);
    ctx.fillStyle = '#dfe9f5'; ctx.fillRect(14, 22, 100, 1);
    ctx.drawImage(POT_SPRITES[Math.min(p.stage, 3)], 122, 8, 30, 30);
    ctx.fillStyle = '#c9ced4'; ctx.fillRect(126, 38, 22, 1);
    ctx.fillStyle = '#dfe9f5'; ctx.fillRect(129, 39, 16, 1);
    if (p.dirt) {
      ctx.fillStyle = '#3d2412'; ctx.fillRect(133, 40, 8, 2); ctx.fillRect(135, 39, 4, 1);
      ctx.fillStyle = '#5a3a1e'; ctx.fillRect(136, 40, 2, 1);
      drawText('GOOD DIRT', 118, 44, '#5a3a1e', 1);
    }
    drawText((p.variety || 'BLUEBERRY') + ' · ' + plantStageLabel(p), 14, 25, '#2e8b3a', 1);
    drawText('LIVES AT: ' + (p.memorial ? 'THE BACK PAGES' : locPretty(p.row != null ? 'ROW' + p.row : p.location)), 14, 34, '#5a6270', 1);
    drawText('HEALTH: ' + HEALTH_NAMES[p.health], 14, 43, HEALTH_COL[p.health], 1);
    const rows = [
      'SOWN: ' + dayOr(p.sownDay, 'NOT YET') + (p.sproutedDay ? ' · SPROUTED: DAY ' + p.sproutedDay : ''),
      'SEEDLING: ' + dayOr(p.seedlingDay, 'NOT YET') + (p.bushDay ? ' · BUSH: DAY ' + p.bushDay : ''),
      'DAYS TENDED: ' + p.tended + ' · TODAY: ' + (p.stage === 0 ? '-' : (p.watered ? 'WATERED' : 'THIRSTY')),
    ];
    if (p.memorial) rows.push('DIED: DAY ' + p.diedDay, 'CAUSE: ' + (p.cause || ''));
    const hy = Object.keys(p.harvestByYear || {});
    if (hy.length) rows.push('HARVEST: ' + hy.map(y => 'Y' + y + ' ' + p.harvestByYear[y] + 'LB').join(' · '));
    (p.history || []).slice(0, 2).forEach(h => rows.push(h));
    rows.slice(0, 5).forEach((r, i) => drawText(r.slice(0, 36), 14, 54 + i * 9, '#20242a', 1));
    ['RENAME', 'BACK'].forEach((l, i) => {
      const y = 114 + i * 11;
      if (i === regCardSel) drawText('▶', 14, y, '#b03030', 1);
      drawText(l, 22, y, '#20242a', 1);
    });
    drawPaw(142, 124, '#b09a72');
  }
}
function regPageLines() {
  const s = G.save;
  if (regPage === 'GERMINATION' && s.germ) return { title: 'GERMINATION', lines: ['SOWN: ' + s.germ.sown + ' SEEDS, LATE FALL.', 'POTTED UP: ' + s.germ.potted + ', EVERY ONE NAMED.', 'LOST ALONG THE WAY: ' + s.germ.lost + '.', 'THE TRAY IS EMPTY NOW. THE SHELF IS NOT.'] };
  if (regPage === 'PROMISE') return { title: "OMA'S PROMISE", lines: ['SHE PROMISED TO STAY', 'UNTIL SHE TASTES THE FIRST WINE', 'MADE FROM THIS FIELD\'S FRUIT.', '', s.wine.batches.some(b => b.verdict) ? 'THE JAR IS FILLED. SHE TASTED IT.' : 'THE JAR WAITS, EMPTY, PATIENT AS SHE IS.'] };
  if (regPage === 'TENDING') { const g = ltGoals(); const mark = b => b ? '* ' : '- '; return { title: 'THE LONG TENDING', lines: [mark(g.dex) + 'BERRYDEX: ' + G.save.dex.cells.length + '/18 CELLS', mark(g.rows) + 'ALL 12 ROWS PLANTED', mark(g.nineHundred) + 'A 900-LB YEAR', mark(g.lovely) + 'A LOVELY BATCH', mark(g.streak) + 'CELLAR STREAK: 3 LOVELY YEARS', mark(g.garden) + 'EVERY GARDEN ENTRY FLOURISHING', mark(g.rowOne) + 'ROW 1 ACCOUNTED FOR', mark(g.rollCall) + 'ROLL CALL: ' + G.save.plants.length + '/100 NAMED', '', ltGoalsMet() ? 'WELL TENDED.' : 'THE FIELD IS YOUNG. TEND IT.'] }; }
  if (regPage === 'GOATS') return { title: 'THE GOATS', lines: ['TWO GOATS, BY APPEAL, IN THE PEN', 'BY THE GOOD SHED. THEY ARE NOT', 'PLANTS. THEY ARE IN THE GARDEN', 'PAGES ANYWAY, BECAUSE JOY IS A', 'CATEGORY HERE, AND THE REGISTER', 'HAS NEVER ONCE APOLOGIZED FOR IT.', '', 'THEY EAT EVERYTHING EXCEPT THE', 'BLUEBERRIES. THIS WAS NEGOTIATED.'] };
  if (regPage === 'BARBER') return { title: 'THE BARBER', lines: ['UNKNOWN — SMALL — PRECISE.', 'IT CUT THE SMALLEST, AT AN ANGLE,', 'IN THE NIGHT, AND WAS NEVER', 'NAMED, NEVER CAUGHT, NEVER', 'SEEN AGAIN AFTER ALVIN FACED IT.', '', 'THE NURSERY REMEMBERS. SO DOES', 'THE DOG. ESPECIALLY THE DOG.'] };
  if (regPage === 'CELLAR') {
    const lines = s.wine.batches.map(b => 'BATCH ' + b.n + ': ' + b.verdict + ' (HONEY ' + b.index.toFixed(2) + ', CARE ' + b.care + ')');
    lines.push('POUNDS SHARED DOWN THE ROAD: ' + (s.wine.shared || 0));
    return { title: 'THE CELLAR', lines: lines.length ? lines : ['NO BATCHES YET.'] };
  }
  return { title: 'THE REGISTER', lines: [] };
}
function ltGoals() {
  const s = G.save;
  const years = [...new Set(s.wine.batches.filter(b => b.verdict === 'LOVELY').map(b => b.year))].sort((a, b) => a - b);
  let streak = false;
  for (const y of years) if (years.includes(y + 1) && years.includes(y + 2)) streak = true;
  const garden = s.plants.filter(p => p.location === 'GARDEN' && !p.memorial);
  return {
    dex: s.dex.cells.length >= 18,
    rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].every(rn => s.plants.some(p => !p.memorial && p.row === rn)),
    nineHundred: Object.values(s.wine.poundsByYear).some(v => v >= 900),
    lovely: s.wine.batches.some(b => b.verdict === 'LOVELY'),
    streak,
    garden: garden.length > 0 && garden.every(p => p.gardenState === 'FLOURISHING'),
    rowOne: s.plants.filter(p => p.firstSix).every(p => p.memorial || p.firstHarvestDay != null),
    rollCall: s.plants.length >= 100,
  };
}
function ltGoalsMet() { const g = ltGoals(); return Object.values(g).every(Boolean); }

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
  // Daniel's ruling (updated Nov 26, 2026): the book links live on the
  // title menu AND the pause menu, as plaques beside the menu — the
  // chapter card and every other screen stay link-free.
  const linksShown = mode === 'title' || mode === 'menu';
  audibleBtn.hidden = !linksShown;
  bookBtn.hidden = !linksShown;
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
buildSnow();
requestAnimationFrame(frame);

/* ============================== TEST HOOK ============================== */
window.__hss = {
  state() {
    const so = seasonOf(G.save.day);
    const ser = p => ({ name: p.name, stage: p.stage, wateredDays: p.wateredDays, watered: p.watered, vigor: p.vigor, tended: p.tended, sownDay: p.sownDay, sproutedDay: p.sproutedDay, seedlingDay: p.seedlingDay, location: p.location, dirt: p.dirt, dirtCredit: p.dirtCredit, variety: p.variety, health: p.health, dryDays: p.dryDays, memorial: p.memorial, row: p.row, slot: p.slot, chill: p.chill, wintered: p.wintered, history: p.history.slice(), firstSix: p.firstSix, giftName: p.giftName, gardenState: p.gardenState, firstHarvestDay: p.firstHarvestDay, harvestByYear: p.harvestByYear });
    return {
      mode, day: G.save.day, season: SEASON_NAMES[so.idx], year: so.year, tutorial: G.save.tutorial, seedsLeft: G.save.seedsLeft, tea: G.save.tea,
      compost: G.save.compost, goodDirt: G.save.goodDirt, weeds: JSON.parse(JSON.stringify(G.save.weeds || [])),
      pots: sixPlants().map(ser),
      plants: G.save.plants.map(ser),
      tray: JSON.parse(JSON.stringify(G.save.tray)),
      world: { ch: G.save.world.ch, step: G.save.world.step, area, flags: JSON.parse(JSON.stringify(G.save.world.flags)), proj: G.save.world.proj, rainToday: G.save.world.rainToday },
      field: JSON.parse(JSON.stringify(G.save.field)),
      rows: G.save.cropRows.map(r => ({ yieldRating: r.yieldRating, fruitSet: r.fruitSet, wateredDays: r.wateredDays, poundsByYear: r.poundsByYear, mulched: r.mulched, watered: r.watered, mowed: !!r.mowed })),
      wine: { jar: G.save.wine.jar ? { phase: G.save.wine.jar.phase, days: G.save.wine.jar.days, index: G.save.wine.jar.index, care: G.save.wine.jar.care, batch: G.save.wine.jar.batch } : null, batches: G.save.wine.batches.map(b => ({ n: b.n, verdict: b.verdict, index: b.index, care: b.care })), honey: G.save.wine.honey, pounds: G.save.wine.pounds, poundsByYear: G.save.wine.poundsByYear, shared: G.save.wine.shared },
      promise: G.save.promise, germ: G.save.germ,
      npcs: npcList.map(n => ({ id: n.id, x: n.tx, y: n.ty })),
      register: { view: regView, sel: regSel, cardSel: regCardSel, loc: regLoc, page: regPage },
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
  waterAll() { sixPlants().forEach(p => { if (p.stage >= 1 && !p.memorial) waterPlant(p); }); saveGame(); },
  waterEverything() { for (const p of G.save.plants) if (p.stage >= 1 && !p.memorial) waterPlant(p); for (const r of G.save.cropRows) r.watered = true; if (G.save.tray.n > 0) G.save.tray.watered = true; saveGame(); },
  plantAll() {
    sixPlants().forEach(p => { if (p.stage === 0 && G.save.seedsLeft > 0) { p.stage = 1; if (p.sownDay == null) p.sownDay = G.save.day; G.save.seedsLeft--; dexAdd('SEED', p.variety); } });
    if (G.save.tutorial === 1) G.save.tutorial = 2;
    saveGame();
  },
  openRegister() { openRegister(); },
  skipIntro() { dlg = null; if (G.save.tutorial === 0) G.save.tutorial = 1; if (mode === 'dialogue') mode = 'overworld'; saveGame(); },
  startTrial() { if (G.save.deerPresent && !G.save.deerBeaten && strongestPot() >= 0) startTrial(); },
  startFoe(cfg) { startTrial(cfg); },
  fridgeSeeds() { fridgeSeeds(); },
  storageTrip() { storageTrip(); },
  potUp() { potUp(); },
  signSale() { if (G.save.world.step === 8) signSale(); },
  buildGreenhouse() { buildGreenhouse(); },
  chooseLoadOrder(o) { chooseLoadOrder(o); },
  stakeField() { stakeField(); },
  irisInteract() { irisInteract(); },
  patchInteract() { patchInteract(); },
  repot() { repot(); },
  doPlanting() { doPlanting(); },
  fieldInteractAt(x, y) { fieldInteract({ x, y }); },
  fenceSeg(seg) { buildFenceSeg(seg); },
  layTarp(bi) { layTarp(bi); },
  patchTarp(bi) { patchTarp(bi); },
  moveTarp(bi) { moveTarp(bi); },
  digPipe() { digPipe(); },
  turnValve() { turnValve(); },
  orderMulch() { orderMulch(); },
  mulchRow(rn) { mulchRow(rn); },
  plantingGate() { return plantingGate(); },
  setWatch(w) { G.save.world.watchRow = w; saveGame(); },
  pullWeeds(sec) { pullWeeds(sec); },
  feedRow(rn) { feedRow(rn); },
  proudWeed() { proudWeedInteract(); },
  burnPile() { burnPileInteract(); },
  strawberry() { strawberryInteract(); },
  butterfly() { butterflyPlant(); },
  forsythia() { forsythiaPlant(); },
  setFrostWatch(rn) { G.save.world.flags.watchTonight = rn; saveGame(); },
  startBatchOne() { startBatchOne(); },
  startBatchTwo(i) { startBatchTwo(i); },
  swishJar() { swishJar(); },
  sealCheck() { sealCheck(); },
  bottleJar() { bottleJar(); },
  harvestRow(rn) { harvestRow(rn); },
  tasting() { tasting(); },
  dlgLines() { return dlg ? dlg.lines.map(l => ({ name: l.name, text: l.text })) : []; },
  ltGoals() { return ltGoals(); },
  plantNurseryRow(rn) { plantNurseryRow(rn); },
  pruneRow(rn) { pruneRow(rn); },
  sowTrayLT() { sowTrayLT(); },
  potUpLT() { potUpLT(); },
  shareStand() { shareStand(); },
  carryPlants() { carryPlants(); },
  warp(x, y) { player.tx = x; player.ty = y; syncPixels(player); alvin.tx = x; alvin.ty = Math.min(AH - 1, y + 1); syncPixels(alvin); },
  gotoArea(a, x, y) { setArea(a, x, y); },
  setDay(n) { G.save.day = n; saveGame(); },
  setChapter(ch, step) { G.save.world.ch = ch; G.save.world.step = step || 0; saveGame(); },
  setHealth(name, h) { const p = G.save.plants.find(q => q.name === name); if (p) { p.health = h; if (h === 3) { p.critSince = G.save.day; p.warnedDay = G.save.day; } saveGame(); } },
  debugSave() { return JSON.parse(JSON.stringify(G.save)); },
  setSave(obj) { G.save = ensureV2(obj); area = AREAS[G.save.world.area] ? G.save.world.area : 'yard'; AW = curArea().w; AH = curArea().h; player.tx = G.save.player.x; player.ty = G.save.player.y; syncPixels(player); layoutNPCs(); saveGame(); },
  trialState() { return trial ? { foe: trial.foe, pressure: trial.pressure, maxPressure: trial.maxPressure, vigor: trial.vigor, phase: trial.phase, wave: trial.wave || 1, over: trial.over, result: trial.result } : null; },
  setWeeds(list) { G.save.weeds = (list || []).map(w => ({ x: w.x, y: w.y, deep: !!w.deep })); saveGame(); },
  giveCompost(n) { G.save.compost += n; saveGame(); },
  giveDirt(n) { G.save.goodDirt += n; saveGame(); },
  themeData() { return { bpm: THEME.bpm, beats: THEME.beats, melody: THEME.melody.map(e => e[0]), bass: THEME.bass.map(e => e[0]), chords: THEME.chords.map(e => e[0]) }; },


};
