'use strict';
/* HOPE STARTS SMALL — Chapter 1: SEEDS
   A tiny Pokémon-style tending game. Vanilla JS, no dependencies.
   All art is drawn in code from pixel maps. No image assets. */

// The book's Audible page — the game's one funnel target.
const AUDIBLE_URL = 'https://www.audible.com/pd/Hope-Starts-Small-Audiobook/B0DZPCHT4M';
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
const TILES = {};
TILES.grass = tileCanvas(c => {
  c.fillStyle = GRASS; c.fillRect(0, 0, 16, 16); c.fillStyle = GRASS_D;
  c.fillRect(2, 3, 1, 2); c.fillRect(3, 4, 1, 1); c.fillRect(11, 2, 1, 2); c.fillRect(12, 3, 1, 1);
  c.fillRect(6, 10, 1, 2); c.fillRect(7, 11, 1, 1); c.fillRect(13, 12, 1, 2); c.fillRect(14, 13, 1, 1);
});
TILES.grass2 = tileCanvas(c => {
  c.fillStyle = GRASS; c.fillRect(0, 0, 16, 16); c.fillStyle = GRASS_L;
  c.fillRect(4, 6, 1, 2); c.fillRect(5, 7, 1, 1); c.fillRect(10, 11, 1, 2); c.fillRect(9, 12, 1, 1);
  c.fillStyle = GRASS_D; c.fillRect(13, 4, 2, 1); c.fillRect(1, 13, 2, 1);
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
  c.fillStyle = '#4cab36'; c.fillRect(0, 13, 16, 3); // ground shadow under the fence
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
  c.fillStyle = '#4cab36'; c.fillRect(10, 0, 6, 16); // ground shadow
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
TILES.roof = tileCanvas(c => { // shingled: lit top edge, shadowed lip, offset joints per band
  c.fillStyle = '#3f7fd8'; c.fillRect(0, 0, 16, 16);
  for (let b = 0; b < 4; b++) {
    const y = b * 4;
    c.fillStyle = '#5b9bf0'; c.fillRect(0, y, 16, 1);
    c.fillStyle = '#2a5aa8'; c.fillRect(0, y + 3, 16, 1);
    const off = (b % 2) * 4;
    for (let x = off; x < 16; x += 8) c.fillRect(x, y, 1, 3);
  }
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
    c.fillStyle = '#6ea3dd'; c.fillRect(0, y + 3, 16, 1);
  }
  c.fillStyle = '#7fb2e8'; c.fillRect(7, 1, 1, 2); c.fillRect(12, 5, 1, 2); c.fillRect(3, 9, 1, 2); c.fillRect(9, 13, 1, 2);
});
TILES.window = tileCanvas(c => { // framed window: white frame, muntins, sill, warm glass
  c.drawImage(TILES.wall, 0, 0);
  c.fillStyle = '#f4f4f0'; c.fillRect(2, 2, 12, 11);
  c.fillStyle = '#ffe9a8'; c.fillRect(4, 4, 8, 7);
  c.fillStyle = '#fff6cf'; c.fillRect(5, 5, 3, 3);
  c.fillStyle = '#f4f4f0'; c.fillRect(7, 4, 2, 7); c.fillRect(4, 7, 8, 1);
  c.fillStyle = FK; c.fillRect(2, 2, 12, 1); c.fillRect(2, 12, 12, 1); c.fillRect(2, 2, 1, 11); c.fillRect(13, 2, 1, 11);
  c.fillStyle = '#e0e4ea'; c.fillRect(1, 13, 14, 2);
  c.fillStyle = '#6ea3dd'; c.fillRect(1, 15, 14, 1);
});
TILES.door = tileCanvas(c => { // paneled door under a little green porch awning
  c.drawImage(TILES.wall, 0, 0);
  c.fillStyle = '#37b24d'; c.fillRect(0, 0, 16, 2);
  c.fillStyle = '#2b8a3e'; c.fillRect(0, 2, 16, 1); c.fillRect(2, 3, 2, 1); c.fillRect(7, 3, 2, 1); c.fillRect(12, 3, 2, 1);
  c.fillStyle = '#f4f4f0'; c.fillRect(3, 3, 10, 13);
  c.fillStyle = '#a5662c'; c.fillRect(4, 4, 8, 12);
  c.fillStyle = '#ffe9a8'; c.fillRect(5, 5, 6, 3);
  c.fillStyle = '#8a4f1f'; c.fillRect(5, 9, 6, 2); c.fillRect(5, 12, 6, 3);
  c.fillStyle = '#ffd94a'; c.fillRect(10, 10, 2, 2);
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
const FRANK_PAL = { k: '#20242a', s: SKIN, S: '#d99e5f', h: HAIR, H: '#54381d', e: EYE, c: '#2e8b3a', C: '#1f6b2a', b: '#2f6fd0', B: '#245aa8', p: '#6b4f35', o: '#33261a' };
const FRANK_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccccck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....kssssssk....',
'....ksessesk....',
'....kssssSsk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbbbbbBks...',
'...skbbbbbBks...',
'....kkppppkk....',
'....kppkkppk....',
'....kppkkppk....',
'....koookooo....',
], FRANK_PAL);
const FRANK_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccccck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....kssssssk....',
'....ksessesk....',
'....kssssSsk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbbbbbBks...',
'...skbbbbbBks...',
'....kkppppkk....',
'.....kppkppk....',
'.....kppkppk....',
'.....kookook....',
], FRANK_PAL);
const FRANK_UP = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccccck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....khhhhhhk....',
'....khhhhhhk....',
'....khhhhHHk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbbbbbBks...',
'...skbbbbbBks...',
'....kkppppkk....',
'....kppkkppk....',
'....kppkkppk....',
'....koookooo....',
], FRANK_PAL);
const FRANK_UP2 = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccccck....',
'...kcccccccck...',
'...kCCCCCCCCk...',
'....khhhhhhk....',
'....khhhhhhk....',
'....khhhhHHk....',
'.....kkkkkk.....',
'...kkbbbbbbkk...',
'...skbbbbbBks...',
'...skbbbbbBks...',
'....kkppppkk....',
'.....kppkppk....',
'.....kppkppk....',
'.....kookook....',
], FRANK_PAL);
const FRANK_SIDE = makeSprite([
'................',
'.....kkkkkk.....',
'....kcccccck....',
'....kccccccck...',
'....khhhhhhk....',
'....kssssssk....',
'....kssssesk....',
'....kssssSsk....',
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
'....kcccccck....',
'....kccccccck...',
'....khhhhhhk....',
'....kssssssk....',
'....kssssesk....',
'....kssssSsk....',
'.....kkkkk......',
'....kkbbbbb.....',
'....kbbbbBks....',
'....kbbbbBk.....',
'....kkppppk.....',
'.....kpppk......',
'.....kpppk......',
'.....koook......',
], FRANK_PAL);
const FRANK_SET = { down: [FRANK_DOWN, FRANK_DOWN2], up: [FRANK_UP, FRANK_UP2], side: [FRANK_SIDE, FRANK_SIDE2] };
const CONSTANCE_PAL = { k: '#20242a', s: SKIN, S: '#d99e5f', h: '#8a5a2e', H: '#6f4520', e: EYE, d: '#2a9d8f', D: '#1f7a6e', o: '#3a2c1c' };
const CONSTANCE_DOWN = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khsssshk....',
'....khsesesk....',
'....khsssShk....',
'....kssssssk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skdddddDks...',
'...skdddddDks...',
'...kdddddddDk...',
'...kdddddddDk...',
'....kdddkddk....',
'....kookkook....',
], CONSTANCE_PAL);
const CONSTANCE_DOWN2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khsssshk....',
'....khsesesk....',
'....khsssShk....',
'....kssssssk....',
'.....kkkkkk.....',
'...kkddddddkk...',
'...skdddddDks...',
'...skdddddDks...',
'..kdddddddDk....',
'..kdddddddDk....',
'....kdddkddk....',
'.....ookook.....',
], CONSTANCE_PAL);
const CONSTANCE_SIDE = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....khhhhssk....',
'.....kkkkk......',
'....kkddddd.....',
'....kddddDks....',
'....kddddDk.....',
'...kddddddDk....',
'...kddddddDk....',
'...kssk.kssk....',
'...kook.kook....',
], CONSTANCE_PAL);
const CONSTANCE_SIDE2 = makeSprite([
'................',
'.....kkkkkk.....',
'....khhhhhhk....',
'....khhhhhhk....',
'....khhhhssk....',
'....khhhhsek....',
'....khhhhssk....',
'....khhhhssk....',
'.....kkkkk......',
'....kkddddd.....',
'....kddddDks....',
'....kddddDk.....',
'...kddddddDk....',
'...kddddddDk....',
'....ksskssk.....',
'....kookook.....',
], CONSTANCE_PAL);
const CONSTANCE_SET = { down: [CONSTANCE_DOWN, CONSTANCE_DOWN2], up: [CONSTANCE_DOWN, CONSTANCE_DOWN2], side: [CONSTANCE_SIDE, CONSTANCE_SIDE2] };
/* Alvin: tan short coat, floppy darker ears, green collar with a tag.
   Side sprite faces right (charSprite flips it for left); the two frames
   wag his tail and stride his legs. */
const ALVIN_PAL = { k: '#20242a', t: '#d9a05a', T: '#b57f3d', d: '#8a5a2e', m: '#ecd3a0', n: '#20242a', g: '#37b24d', y: '#ffd94a', e: '#20242a' };
const ALVIN_DOWN = makeSprite([
'................',
'................',
'....kkkkkkkk....',
'..kkkttttttkkk..',
'..kddkttttkddk..',
'..kddkettekddk..',
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
'..kddkettekddk..',
'..kddkttttkddk..',
'...kkkttttkkk...',
'....ktmmmmtk....',
'....kmmnnmmk....',
'.....mmmmmm.....',
'....kggggggk....',
'....kttgyttk....',
'...Tkttttttk....',
'....ktkttktk....',
'....kkk.kkk.....',
], ALVIN_PAL);
const ALVIN_SIDE = makeSprite([
'................',
'.tt.............',
'.tTt....kkkk....',
'..tT...kddddk...',
'...tT.kddttttk..',
'....ktttttttek..',
'..kktttttttttk..',
'..ktttttmmmmnk..',
'..kttttmmmmmmk..',
'..kttttttggggk..',
'..ktttttttggyk..',
'..kTTTTTTTTTTk..',
'...ktk..ktk.....',
'...ktk..ktk.....',
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
'..ktk...ktk.....',
'..ktk...ktk.....',
'..kkk...kkk.....',
'................',
], ALVIN_PAL);
const ALVIN_SET = { down: [ALVIN_DOWN, ALVIN_DOWN2], up: [ALVIN_DOWN, ALVIN_DOWN2], side: [ALVIN_SIDE, ALVIN_SIDE2] };
/* small deer for the yard */
const DEER_SMALL = makeSprite([
'..a..........a..',
'..aa........aa..',
'...a........a...',
'...hhhhhhhhhh...',
'..ehhhhhhhhhhh..',
'...hhhhhhhhhhh..',
'....bbbbbbbbbb..',
'....bbbbbbbbbbt.',
'....b.b..b.b....',
'....b.b..b.b....',
'....b.b..b.b....',
'....l.l..l.l....',
'....l.l..l.l....',
'................',
'................',
'................',
], { a: '#8a5a2e', h: '#b07a45', e: '#20242a', b: '#b07a45', t: '#8a5a2e', l: '#8a5a2e' });

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
/* wild deer, side profile facing left, drawn at 2x on the trial screen */
const DEER_BIG = makeSprite([
'aa........aa............',
'.aa......aa.............',
'.aaa....aaa.............',
'..aa....aa..............',
'..hhhhhhhh..............',
'..hehhhhhh..............',
'..hhhhhhhh..............',
'...hhhhhh...............',
'....hhhh................',
'.....hh.................',
'....bbbbbbbbbbbbbbbbbbt.',
'...bbwbbbbbbwbbbbbbbbbb.',
'...bbbbbbbbbbbbbbbbbbbb.',
'....BBBBBBBBBBBBBBBB....',
'....bb...bb....bb...bb..',
'....bb...bb....bb...bb..',
'....bb...bb....bb...bb..',
'....bb...bb....bb...bb..',
'....bb...bb....bb...bb..',
'....bb...bb....bb...bb..',
'...lll...lll...lll..lll.',
], { a: '#8a5a2e', h: '#caa06a', e: '#20242a', b: '#b07a45', B: '#8a5a2e', w: '#e8dcc0', t: '#8a5a2e', l: '#8a5a2e' });
/* ============================== MAP: DEERBROOK BACKYARD (24x18) ============================== */
/* l lawn(neighbour) f fenceV H fenceH G gate T tree R roof c chimney W wall i window D door
   g grass u grass2 o flower p path P porch B bench C compost */
const MAP = [
'nnnnnnnnnnnnnnnnnnnnnnnn',
'nfRRRRcRRRRRRRRRRRRRRRfn',
'nfWWiWWWWWWWWWWiWWWWWWfn',
'nfWWWWWWWWWDWWWWWWWWWWfn',
'nfoouogoouoPouoogouooufn',
'nfugoguggggpgugogugggofn',
'nfggTggugggpggguggggggfn',
'nfgugggggoopggggugggTgfn',
'nfoogugggggpggggguggogfn',
'nfoggggugggpgugggggggufn',
'nfgogggggBBBBBBggggoggfn',
'nfgguggggggggggggggCggfn',
'nfggTggoogggggugggggggfn',
'nfguggggggggggggggTgggfn',
'nfggggooggggggggggooggfn',
'nfuggugggggggggggugggufn',
'nfggggoggggggoggggggggfn',
'nfHHHHHHHHHGGHHHHHHHHHfn',
];
const MAP_W = 24, MAP_H = 18;
const TILEMAP = { n: 'lawn', f: 'fenceV', H: 'fenceH', G: 'gate', R: 'roof', c: 'chimney', W: 'wall', i: 'window', D: 'door', g: 'grass', u: 'grass2', o: 'flower', p: 'path', P: 'porch', B: 'bench', C: 'compost', T: 'grass' };
const SOLID = new Set(['n', 'f', 'H', 'G', 'R', 'c', 'W', 'i', 'D', 'B', 'C', 'T']);
function mapChar(x, y) { if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return 'f'; return MAP[y][x]; }
function isSolid(x, y) { return SOLID.has(mapChar(x, y)); }

/* ============================== STATE ============================== */
const STAGE_NAMES = ['EMPTY', 'SEED', 'SPROUT', 'SEEDLING'];
const MAX_VIGOR = [0, 0, 22, 28];
let G = null; // game state (serializable part in G.save)
function newSave() {
  return {
    v: 1, day: 1, seedsLeft: 6, tea: 3, teaBrewedDay: 0,
    pots: Array.from({ length: 6 }, () => ({ stage: 0, waterDays: 0, watered: false, vigor: 0 })),
    dex: { blueberry: [] },
    deerBeaten: false, deerPresent: false, chapterDone: false,
    tutorial: 0, // 0 intro dialogue, 1 plant, 2 water, 3 done
    player: { x: 10, y: 6, dir: 'down' },
    constanceLine: 0,
  };
}
function saveGame() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.save)); } catch (e) {} }
function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.v === 1 && Array.isArray(s.pots)) return s; } catch (e) {}
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
const settings = { stick: 'auto' }; // auto | always | off
try {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  if (s && ['auto', 'always', 'off'].includes(s.stick)) settings.stick = s.stick;
} catch (e) {}
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {} }

/* ============================== INPUT ============================== */
const keys = {};
let btnA = false, btnB = false, padA = false, padB = false, padStart = false;
let touchDir = { x: 0, y: 0 }, touchA = false, touchB = false;
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
    let fromTouch = false;
    if (x === 0 && y === 0 && (touchDir.x || touchDir.y)) { x = touchDir.x; y = touchDir.y; fromTouch = true; }
    // keyboard/gamepad diagonals collapse to one axis; the touch stick is
    // genuinely 8-way and keeps both axes (the overworld staircases them)
    if (x !== 0 && y !== 0 && !fromTouch) { if (this.dir.x !== 0 && this.dir.y === 0) y = 0; else x = 0; }
    this.dir.x = Math.sign(x); this.dir.y = Math.sign(y);
    const aNow = btnA || padA || touchA, bNow = btnB || padB || touchB;
    const sNow = padStart || !!keys['p'];
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
/* Touch controls: a FIXED virtual joystick + A/B buttons in the page deck
   below the screen (never over the canvas, so they can't cover dialogue).
   Visibility follows settings.stick: always | off | auto (touch devices). */
const deckEl = document.getElementById('deck');
const stickPad = document.getElementById('stickPad'), stickKnob = document.getElementById('stickKnob');
const coarsePointer = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
let touchSeen = false;
function stickShouldShow() {
  return settings.stick === 'always' || (settings.stick === 'auto' && (touchSeen || coarsePointer));
}
function applyStickPref() { deckEl.hidden = !stickShouldShow(); }
window.addEventListener('touchstart', () => { if (!touchSeen) { touchSeen = true; applyStickPref(); } }, { passive: true });
(function () {
  let pid = null;
  const DIRS8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  function moveStick(e) {
    const r = stickPad.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy), max = 30;
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    stickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    if (len < 9) { touchDir = { x: 0, y: 0 }; return; }
    const sector = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) & 7;
    touchDir = { x: DIRS8[sector][0], y: DIRS8[sector][1] };
  }
  stickPad.addEventListener('pointerdown', e => {
    e.preventDefault(); pid = e.pointerId;
    try { stickPad.setPointerCapture(pid); } catch (err) {}
    moveStick(e);
  });
  stickPad.addEventListener('pointermove', e => { if (e.pointerId === pid) moveStick(e); });
  function endStick(e) {
    if (e.pointerId !== pid) return;
    pid = null; touchDir = { x: 0, y: 0 };
    stickKnob.style.transform = 'translate(-50%,-50%)';
  }
  stickPad.addEventListener('pointerup', endStick); stickPad.addEventListener('pointercancel', endStick);
  const bind = (id, set) => {
    const el = document.getElementById(id);
    el.addEventListener('pointerdown', e => { e.preventDefault(); set(true); });
    el.addEventListener('pointerup', () => set(false));
    el.addEventListener('pointerleave', () => set(false));
    el.addEventListener('pointercancel', () => set(false));
  };
  bind('btnA', v => touchA = v); bind('btnB', v => touchB = v);
  applyStickPref();
})();

/* ============================== RUNTIME / UI STATE ============================== */
let mode = 'title'; // title | chapters | overworld | dialogue | trial | card | dex | menu | controls
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
let dlg = null; // {lines, idx, chars, timer, cb, choice}
function say(lines, cb, choice) {
  dlg = { lines: Array.isArray(lines) ? lines : [lines], idx: 0, chars: 0, timer: 0, cb: cb || null, choice: choice || null };
  mode = 'dialogue';
}
function dlgUpdate(dt) {
  if (!dlg) return;
  const line = dlg.lines[dlg.idx];
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
}
function drawDlg() {
  drawBox(102, 40);
  const line = dlg.lines[dlg.idx];
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
  'MORNING. WATER FIRST, THEN EVERYTHING ELSE.',
  'THE YARD IS QUIET. SOMEWHERE, A SEED IS MAKING UP ITS MIND.',
  'ALVIN DID HIS ROUNDS BEFORE YOU WERE EVEN AWAKE.',
];
const MORNING_FORE = [
  'ALVIN STARED AT THE FENCE A LONG TIME THIS MORNING.',
  'FRESH TRACKS BY THE FENCE. SMALL, POINTED, UNINVITED.',
  'ALVIN STARED AT THE FENCE A LONG TIME THIS MORNING.',
];
const CONSTANCE_LINES = [
  'CONSTANCE: SIX POTS AND NO FIELD. WE HAVE DONE MORE WITH LESS, LOVE.',
  'CONSTANCE: THE FRIDGE SEEDS ARE NAPPING. FRANK TUCKED THEM IN. TUCKED. THEM. IN.',
  'CONSTANCE: HE TALKS TO THE POTS EVERY MORNING. THE POTS, TO THEIR CREDIT, LISTEN BEAUTIFULLY.',
  'CONSTANCE: ONE DAY THIS YARD WILL BE TOO SMALL FOR HIS DREAMS. I GIVE IT A YEAR, TOPS.',
];
function objective() {
  const s = G.save;
  if (s.tutorial === 1) return 'THE GRAND PLAN: A SEED IN EVERY POT (A)';
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
let alvinTarget = null;
let diagX = true; // diagonal stick input alternates axes per step (staircase)
function overworldUpdate(dt) {
  if (fade > 0) { fade -= dt * 2; if (fade < 0) fade = 0; }
  const dx0 = Input.dir.x, dy0 = Input.dir.y;
  let dx = dx0, dy = dy0;
  if (dx && dy) { if (diagX) dy = 0; else dx = 0; } // tile grid is 4-way: one axis per step
  const wasMoving = player.moving;
  let stepped = stepEntity(player, dx, dy, dt);
  if (!stepped && !player.moving && dx0 && dy0) {
    stepped = stepEntity(player, dx0 - dx, dy0 - dy, dt); // preferred axis blocked: try the other
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
  camX = Math.max(0, Math.min(MAP_W * TILE - VW, player.px + 8 - VW / 2));
  camY = Math.max(0, Math.min(MAP_H * TILE - VH, player.py + 8 - VH / 2));
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
  if (f.x === constance.tx && f.y === constance.ty) {
    const line = CONSTANCE_LINES[s.constanceLine % CONSTANCE_LINES.length]; s.constanceLine++;
    return say(line);
  }
  if (s.deerPresent && !s.deerBeaten && f.x === DEER_POS.x && f.y === DEER_POS.y) {
    if (strongestPot() < 0) return say('THE DEER EYES THE POTS. NO SPROUT IS READY TO FACE IT. YET.');
    return say('WILD DEER APPEARED!', () => startTrial());
  }
  const ch = mapChar(f.x, f.y);
  if (ch === 'C') {
    if (s.teaBrewedDay !== s.day && s.tea < 3) { s.tea++; s.teaBrewedDay = s.day; saveGame(); return say('YOU BREW A QUICK COMPOST TEA. (+1 TEA, NOW ' + s.tea + ')'); }
    return say('THE COMPOST PILE. YESTERDAY\'S SCRAPS, TOMORROW\'S GARDEN.');
  }
  if (ch === 'G') return say('THE GATE STICKS. BEYOND IT: MOWED LAWNS AND ORDINARY LIFE.');
  if (ch === 'T') return say('TOO MUCH SHADE HERE. THE BOOK OF TREES WAS WRITTEN BY BIRDS.');
}
function potInteract(pi) {
  const s = G.save, p = s.pots[pi];
  if (p.stage === 0) {
    if (s.seedsLeft <= 0) return say('NO SEEDS LEFT IN THE PACKET.');
    p.stage = 1; s.seedsLeft--; dexAdd('SEED'); saveGame();
    if (s.tutorial === 1 && s.pots.every(q => q.stage >= 1)) { s.tutorial = 2; saveGame(); return say(['PLANTED! SIX LITTLE PROMISES IN PEAT.', 'A DRINK FOR EACH NEW FRIEND: PRESS A AT A POT TO WATER IT.']); }
    return say('YOU PLANT A BLUEBERRY SEED. SMALL AS A SECRET.');
  }
  if (!p.watered) {
    p.watered = true; saveGame();
    if (s.tutorial === 2 && s.pots.every(q => q.watered)) {
      s.tutorial = 3; saveGame();
      return say(['CONSTANCE: NOW WE WAIT. FRANK HAS ALREADY NAMED ALL SIX. IT IS DAY ONE.', 'REST AT THE HOUSE DOOR TO PASS THE DAY. WATER AGAIN TOMORROW.']);
    }
    return say(p.stage === 1 ? 'YOU WATER THE SEED. DREAM BIG, LITTLE ONE.' : 'YOU WATER THE ' + STAGE_NAMES[p.stage] + '. STEADY DOES IT.');
  }
  return say('ALREADY WATERED TODAY. EVEN PLANTS NEED A PACE.');
}
function restDay() {
  fading = 'dawn'; fade = 1;
  setTimeout(() => { dawn(); }, 350);
}
function dawn() {
  const s = G.save; s.day++;
  let sprouted = false, seedled = false;
  for (const p of s.pots) {
    if (p.watered) { p.waterDays++; p.watered = false; }
    if (p.stage === 1 && p.waterDays >= 2) { p.stage = 2; p.waterDays = 0; sprouted = true; dexAdd('SPROUT'); }
    else if (p.stage === 2 && p.waterDays >= 3) { p.stage = 3; p.waterDays = 0; seedled = true; dexAdd('SEEDLING'); }
    p.vigor = MAX_VIGOR[p.stage] || 0;
  }
  if (sprouted && !s.deerBeaten && !s.deerPresent) s.deerPresent = true;
  saveGame();
  fading = null;
  if (checkChapter()) return;
  let line;
  if (sprouted && s.deerPresent && !s.deerBeaten) line = 'SOMETHING SPROUTED! BUT ALVIN IS BARKING AT THE FENCE... A DEER IS IN THE YARD!';
  else if (sprouted) line = 'SOMETHING SPROUTED IN THE NIGHT! GO LOOK!';
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

/* intro: original dialogue only */
function startIntro() {
  player.tx = 11; player.ty = 6; player.dir = 'left'; syncPixels(player);
  alvin.tx = 10; alvin.ty = 7; syncPixels(alvin);
  constance.tx = 12; constance.ty = 6; constance.dir = 'left';
  say([
    'CONSTANCE: YOUR SEEDS CAME, FRANK. REAL BLUEBERRY SEEDS. THE MAILMAN LOOKS WORRIED.',
    'FRANK: LET HIM. SOME OF THESE GO IN THE FRIDGE, TO CHILL AND DREAM OF SPRING.',
    'CONSTANCE: SEEDS THAT NEED A NAP BEFORE THEY GROW. THEY WILL FIT RIGHT IN HERE.',
    'FRANK: AND THESE SIX START TODAY! PEAT POTS, SUNSHINE, AND A LITTLE SPEECH I PREPARED.',
    'CONSTANCE: HE REHEARSED THE SPEECH, ALVIN. TWICE. I COUNTED.',
    'FRANK: WE HAVE NO FIELD YET, LOVE. SO THEY WILL GROW WHERE THEY ARE PLANTED. LIKE THE REST OF US.',
    'ALVIN WAGS HIS WHOLE BACK HALF. HE HAS APPOINTED HIMSELF SUPERVISOR.',
    'WALK WITH THE ARROWS. PRESS A AT A PEAT POT TO PLANT A SEED.',
  ], () => { G.save.tutorial = 1; saveGame(); });
}

/* ============================== TRIAL: WILD DEER ============================== */
let trial = null;
const MOVES = ['GROW', 'WATER', 'MULCH', 'BARK'];
function startTrial() {
  const pi = strongestPot();
  if (pi < 0) return;
  const p = G.save.pots[pi];
  p.vigor = MAX_VIGOR[p.stage];
  trial = {
    pot: pi, pressure: 30, phase: 'intro', msg: 'WILD DEER APPEARED!', timer: 0,
    menu: 0, moveSel: 0, shield: false, armor: false, over: false, result: null,
  };
  mode = 'trial';
}
function trialSetMsg(m, phase) { trial.msg = m; trial.phase = phase || 'wait'; trial.timer = 0; }
function trialUpdate(dt) {
  const t = trial, p = G.save.pots[t.pot];
  t.timer += dt;
  if (t.phase === 'intro' && t.timer > 1.1) { t.phase = 'menu'; t.menu = 0; t.sel = 0; }
  else if (t.phase === 'wait' && t.timer > 1.15) {
    if (t.over) return endTrial();
    if (t.foeTurn) { t.foeTurn = false; deerAct(); }
    else { t.phase = 'menu'; t.menu = 0; t.sel = 0; }
  }
  if (t.phase === 'menu' || t.phase === 'moves' || t.phase === 'plants' || t.phase === 'bag') {
    if (Input.bHit && t.phase !== 'menu') { t.phase = 'menu'; t.sel = 0; return; }
    const n = t.phase === 'menu' ? 4 : t.phase === 'moves' ? 4 : t.phase === 'plants' ? G.save.pots.filter(q => q.stage >= 2).length : 1;
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
  const t = trial, s = G.save, p = s.pots[t.pot];
  if (t.phase === 'menu') {
    if (t.sel === 0) { t.phase = 'moves'; t.sel = 0; }
    else if (t.sel === 1) { t.phase = 'plants'; t.sel = 0; }
    else if (t.sel === 2) { t.phase = 'bag'; t.sel = 0; }
    else { trialSetMsg('YOU BACK AWAY SLOWLY. THE DEER WINS THIS ROUND OF STARING.'); t.over = true; t.result = 'flee'; }
    return;
  }
  if (t.phase === 'plants') {
    const fighters = s.pots.map((q, i) => [q, i]).filter(([q]) => q.stage >= 2);
    const pick = fighters[t.sel][1];
    if (pick !== t.pot) { t.pot = pick; trialSetMsg('GO, ' + STAGE_NAMES[s.pots[pick].stage] + '!'); t.foeTurn = true; }
    else { t.phase = 'menu'; t.sel = 0; }
    return;
  }
  if (t.phase === 'bag') {
    if (s.tea > 0) {
      s.tea--; p.vigor = Math.min(MAX_VIGOR[p.stage], p.vigor + 10);
      trialSetMsg('USED COMPOST TEA! VIGOR RESTORED.'); t.foeTurn = true;
    } else trialSetMsg('NO TEA LEFT! (BREW MORE AT THE COMPOST.)');
    return;
  }
  // moves
  const mv = MOVES[t.sel];
  if (mv === 'GROW') { p.vigor = Math.min(MAX_VIGOR[p.stage], p.vigor + 6); trialSetMsg(STAGE_NAMES[p.stage] + ' USED GROW! IT LOOKS HEALTHIER.'); }
  else if (mv === 'WATER') { t.shield = true; trialSetMsg(STAGE_NAMES[p.stage] + ' USED WATER! A COOLING SHIELD OF MIST.'); }
  else if (mv === 'MULCH') { t.armor = true; trialSetMsg(STAGE_NAMES[p.stage] + ' USED MULCH! ARMOR UP.'); }
  else if (mv === 'BARK') {
    t.pressure = Math.max(0, t.pressure - 8);
    if (t.pressure <= 0) { trialSetMsg('ALVIN BARKS HIS BRAVE HEART OUT! THE DEER BOUNDED AWAY!'); t.over = true; t.result = 'win'; saveGame(); return; }
    if (Math.random() < 0.3) { trialSetMsg('ALVIN USED BARK! THE DEER FLINCHED!'); saveGame(); return; } // foe loses turn
    trialSetMsg('ALVIN USED BARK! THE DEER STAMPS, UNIMPRESSED BUT RATTLED.');
  }
  t.foeTurn = true;
}
function deerAct() {
  const t = trial, p = G.save.pots[t.pot];
  const r = Math.random();
  let dmg, name;
  if (r < 0.5) { dmg = 7; name = 'NIBBLE'; }
  else if (r < 0.8) { dmg = 4; name = 'STOMP'; }
  else { dmg = 2; name = 'STARE'; }
  if (t.armor) dmg = Math.max(1, dmg - 2);
  if (t.shield) { dmg = Math.floor(dmg / 2); t.shield = false; }
  p.vigor = Math.max(0, p.vigor - dmg);
  if (name === 'STARE') trialSetMsg('DEER USED STARE. IT IS NOT EVEN AFRAID OF YOU. (-' + dmg + ')');
  else trialSetMsg('DEER USED ' + name + '! (-' + dmg + ' VIGOR)');
  if (p.vigor <= 0) { t.over = true; t.result = 'lose'; }
  t.foeTurn = false;
}
function endTrial() {
  const t = trial, s = G.save; trial = null; mode = 'overworld';
  if (t.result === 'win') {
    s.deerBeaten = true; s.deerPresent = false; saveGame();
    say('THE YARD IS SAFE. THE SPROUTS STAND TALL. WELL. TALL-ISH.', () => { checkChapter(); });
  } else if (t.result === 'lose') {
    const p = s.pots[t.pot];
    if (p.stage > 1) p.stage--; p.waterDays = 0; p.vigor = MAX_VIGOR[p.stage] || 0;
    saveGame();
    say('THE ' + 'SPROUT WAS NIBBLED BACK. IT WILL TRY AGAIN. SO WILL YOU.', () => { fading = 'dawn'; fade = 1; setTimeout(dawn, 350); });
  }
}
function trialSnapshot() {
  if (!trial) return null;
  const p = G.save.pots[trial.pot];
  return { pressure: trial.pressure, vigor: p.vigor, maxVigor: MAX_VIGOR[p.stage], pot: trial.pot, stage: p.stage, phase: trial.phase, over: trial.over, result: trial.result, msg: trial.msg };
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
  // sun
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(138, y0 + 4, 13, 13);
  ctx.fillStyle = '#ffec9e'; ctx.fillRect(141, y0 + 7, 7, 7);
  // the little blue house, left
  ctx.fillStyle = '#2f56b8'; ctx.fillRect(4, y0 + 12, 40, 4); ctx.fillRect(8, y0 + 8, 32, 4); ctx.fillRect(14, y0 + 4, 20, 4);
  ctx.fillStyle = '#7fb2e8'; ctx.fillRect(7, y0 + 16, 34, 22);
  ctx.fillStyle = '#5b93d6'; ctx.fillRect(7, y0 + 21, 34, 1); ctx.fillRect(7, y0 + 27, 34, 1); ctx.fillRect(7, y0 + 33, 34, 1);
  ctx.fillStyle = '#f4f4f0'; ctx.fillRect(11, y0 + 20, 7, 7); ctx.fillRect(30, y0 + 20, 7, 7);
  ctx.fillStyle = '#ffe9a8'; ctx.fillRect(12, y0 + 21, 5, 5); ctx.fillRect(31, y0 + 21, 5, 5);
  ctx.fillStyle = '#8a5a2e'; ctx.fillRect(20, y0 + 26, 8, 12);
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(26, y0 + 31, 1, 1);
  // a tree, right
  ctx.fillStyle = '#7a4a21'; ctx.fillRect(130, y0 + 26, 4, 12);
  ctx.fillStyle = '#2f9e44'; ctx.fillRect(122, y0 + 12, 20, 13); ctx.fillRect(126, y0 + 8, 12, 5);
  ctx.fillStyle = '#54c95e'; ctx.fillRect(125, y0 + 14, 8, 5); ctx.fillRect(133, y0 + 18, 6, 4);
  // ground + picket fence line
  ctx.fillStyle = '#58b93e'; ctx.fillRect(0, y0 + 38, VW, 26);
  ctx.fillStyle = '#3f9433'; ctx.fillRect(0, y0 + 56, VW, 8);
  ctx.fillStyle = '#f4f4f0';
  for (let x = 2; x < VW; x += 12) { ctx.fillRect(x, y0 + 34, 3, 6); }
  ctx.fillRect(0, y0 + 36, VW, 1);
  for (let i = 0; i < 3; i++) ctx.drawImage(seedling ? POT_SEEDLING : POT_SPROUT, 34 + i * 36, y0 + 42);
  ctx.drawImage(ALVIN_DOWN, 122, y0 + 44);
}
function renderTitle() {
  ctx.fillStyle = '#274e13'; ctx.fillRect(0, 0, VW, VH);
  drawSceneBanner(0, false);
  ctx.fillStyle = 'rgba(20,40,20,0.85)'; ctx.fillRect(14, 64, 132, 34);
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
  drawBox(66, 30); drawText('2 · SPROUTS', 10, 72, '#8a919c', 1);
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
  const img = anim ? frames[Math.floor(perfNow * (e.moving ? 7 : 3)) % frames.length] : frames[0];
  drawSprite(img, Math.round(e.px - camX), Math.round(e.py - camY), e.dir === 'left');
}
function renderOverworld() {
  camX = Math.max(0, Math.min(MAP_W * TILE - VW, player.px + 8 - VW / 2));
  camY = Math.max(0, Math.min(MAP_H * TILE - VH, player.py + 8 - VH / 2));
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
  const x0 = Math.floor(camX / TILE), y0 = Math.floor(camY / TILE);
  for (let ty = y0; ty <= y0 + 9; ty++) for (let tx = x0; tx <= x0 + 10; tx++) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;
    const ch = mapChar(tx, ty), sx = tx * TILE - camX, sy = ty * TILE - camY;
    let base = TILES.grass; // plain grass tiles get a hashed variety so the lawn isn't flat
    if (ch === 'g') { const h = (tx * 31 + ty * 17) % 9; base = h === 0 ? TILES.tuft : h === 4 ? TILES.grass3 : TILES.grass; }
    ctx.drawImage(base, sx, sy);
    const t = TILES[TILEMAP[ch]]; if (t && TILEMAP[ch] !== 'grass') ctx.drawImage(t, sx, sy);
    if (ch === 'T') ctx.drawImage(TREE, sx, sy);
  }
  // pots on the bench
  G.save.pots.forEach((p, i) => {
    const sx = (9 + i) * TILE - camX, sy = 10 * TILE - camY;
    ctx.drawImage(POT_SPRITES[p.stage], sx, sy - 2);
    if (p.watered) { ctx.fillStyle = '#3b6fe0'; ctx.fillRect(sx + 12, sy - 6 + (Math.floor(perfNow * 2) % 2), 2, 3); }
  });
  // entities sorted by y
  const ents = [];
  ents.push({ y: constance.py, draw: () => charSprite({ px: constance.tx * TILE, py: constance.ty * TILE, dir: constance.dir, moving: false }, CONSTANCE_SET) });
  if (G.save.deerPresent && !G.save.deerBeaten) ents.push({ y: DEER_POS.y * TILE, draw: () => { const bob = Math.floor(perfNow * 1.5) % 2; ctx.drawImage(DEER_SMALL, DEER_POS.x * TILE - camX, DEER_POS.y * TILE - camY + bob); } });
  ents.push({ y: alvin.py, draw: () => charSprite(alvin, ALVIN_SET) });
  ents.push({ y: player.py, draw: () => charSprite(player, FRANK_SET) });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  // HUD (no persistent objective banner: it overlapped the bench/pots at the
  // bottom of the frame. The objective lives in the pause menu, and the
  // tutorial steps are taught through dialogue.)
  ctx.fillStyle = 'rgba(20,26,20,0.8)'; ctx.fillRect(2, 2, 34, 9);
  drawText('DAY ' + G.save.day, 4, 4, '#ffffff', 1);
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
  const t = trial, p = G.save.pots[t.pot];
  ctx.fillStyle = '#7ec8f7'; ctx.fillRect(0, 0, VW, 62);
  ctx.fillStyle = '#a8dcff'; ctx.fillRect(0, 56, VW, 6);
  ctx.fillStyle = '#58b93e'; ctx.fillRect(0, 62, VW, 82);
  ctx.fillStyle = '#4cab36'; for (let i = 0; i < 40; i++) ctx.fillRect((i * 37) % 160, 66 + (i * 23) % 34, 2, 2);
  // clouds and a low hill line on the horizon
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(14, 8, 20, 4); ctx.fillRect(18, 5, 11, 3); ctx.fillRect(120, 14, 16, 3); ctx.fillRect(123, 11, 9, 3);
  ctx.fillStyle = '#dfe9f5'; ctx.fillRect(14, 12, 20, 1); ctx.fillRect(120, 17, 16, 1);
  ctx.fillStyle = '#8fd07a';
  ctx.fillRect(0, 50, 66, 12); ctx.fillRect(8, 46, 50, 4); ctx.fillRect(18, 42, 30, 4);
  ctx.fillRect(102, 52, 58, 10); ctx.fillRect(110, 48, 42, 4); ctx.fillRect(120, 44, 24, 4);
  drawPatch(118, 52, 64); drawPatch(34, 96, 56);
  // ground shadows under the deer, the pot, and Alvin
  ctx.fillStyle = '#357a2a';
  ctx.fillRect(102, 55, 40, 3); ctx.fillRect(106, 54, 32, 1);
  ctx.fillRect(16, 99, 36, 3); ctx.fillRect(20, 98, 28, 1);
  ctx.fillRect(56, 100, 16, 2);
  const hop = (t.phase === 'wait' && t.foeTurn === false && t.timer < 0.3) ? -2 : 0;
  ctx.drawImage(DEER_BIG, 94, 12 + hop, 48, 42);
  ctx.drawImage(POT_SPRITES[p.stage], 14, 58, 44, 44);
  ctx.drawImage(ALVIN_DOWN, 54, 82, 20, 20);
  // status boxes
  ctx.fillStyle = '#20242a'; ctx.fillRect(3, 5, 76, 25); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(5, 7, 72, 21);
  drawText('DEER', 8, 9, '#20242a', 1);
  drawText('PRESSURE', 8, 17, '#5a6270', 1);
  drawBar(8, 23, 62, t.pressure / 30, t.pressure > 10 ? '#37b24d' : '#e0483e');
  ctx.fillStyle = '#20242a'; ctx.fillRect(81, 66, 76, 27); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(83, 68, 72, 23);
  drawText('BLUEBERRY', 86, 70, '#20242a', 1);
  drawText(STAGE_NAMES[p.stage], 86, 78, '#5a6270', 1);
  drawBar(86, 85, 46, p.vigor / MAX_VIGOR[p.stage], p.vigor > 8 ? '#37b24d' : '#e0483e');
  drawText(p.vigor + '/' + MAX_VIGOR[p.stage], 134, 84, '#20242a', 1);
  if (t.shield) drawText('MIST', 134, 70, '#3b6fe0', 1);
  if (t.armor) drawText('MULCH', 134, 77, '#8a5a2e', 1);
  // text box / menus
  drawBox(102, 40);
  if (t.phase === 'menu' || t.phase === 'moves') {
    const lines = wrapText(t.phase === 'menu' ? 'WHAT WILL BLUEBERRY DO?' : 'CHOOSE A MOVE:', 20);
    lines.slice(0, 3).forEach((l, i) => drawText(l, 7, 108 + i * 8, '#20242a', 1));
    const items = t.phase === 'menu' ? ['TEND', 'PLANTS', 'BAG', 'FLEE'] : MOVES;
    items.forEach((m, i) => {
      const x = 96 + (i % 2) * 32, y = 110 + Math.floor(i / 2) * 12;
      if (i === (t.sel || 0)) drawText('▶', x - 6, y, '#b03030', 1);
      drawText(m, x, y, '#20242a', 1);
    });
    if (t.phase === 'moves') drawText('BARK = ALVIN', 7, 132, '#5a6270', 1);
  } else if (t.phase === 'plants' || t.phase === 'bag') {
    drawText(t.phase === 'plants' ? 'CHOOSE A PLANT:' : 'BAG:', 7, 108, '#20242a', 1);
    if (t.phase === 'plants') {
      G.save.pots.map((q, i) => [q, i]).filter(([q]) => q.stage >= 2).forEach(([q, i], k) => {
        if (k === (t.sel || 0)) drawText('▶', 7, 118 + k * 8, '#b03030', 1);
        drawText('POT ' + (i + 1) + ' ' + STAGE_NAMES[q.stage] + ' ' + q.vigor + '/' + MAX_VIGOR[q.stage], 13, 118 + k * 8, '#20242a', 1);
      });
    } else {
      if ((t.sel || 0) === 0) drawText('▶', 7, 118, '#b03030', 1);
      drawText('COMPOST TEA ×' + G.save.tea + ' (+10 VIGOR)', 13, 118, '#20242a', 1);
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
  drawSceneBanner(6, true);
  drawText('CHAPTER COMPLETE', 80 - textW('CHAPTER COMPLETE', 1) / 2, 78, '#cfe8cf', 1);
  drawText('SEEDS', 80 - textW('SEEDS', 2) / 2, 87, '#ffd94a', 2);
  const teaser = wrapText('SIX POTS. NO LAND. ONE VERY PATIENT BEGINNING.', 34);
  teaser.forEach((l, i) => drawText(l, 80 - textW(l, 1) / 2, 99 + i * 8, '#ffffff', 1));
  const l = 'KEEP TENDING (A)';
  ctx.fillStyle = '#ffd94a'; ctx.fillRect(Math.round(80 - textW(l, 1) / 2 - 4), 114, textW(l, 1) + 8, 9);
  drawText(l, 80 - textW(l, 1) / 2, 116, '#20242a', 1);
  drawText('HEAR CHAPTER 1:', 80 - textW('HEAR CHAPTER 1:', 1) / 2, 127, '#cfe8cf', 1);
}
function menuUpdate() {
  if (Input.bHit || Input.startHit) { mode = 'overworld'; return; }
  if (menuNavHit('up')) menuSel = (menuSel + 2) % 3;
  if (menuNavHit('down')) menuSel = (menuSel + 1) % 3;
  if (Input.aHit) {
    if (menuSel === 0) mode = 'dex';
    else if (menuSel === 1) openControls('menu');
    else mode = 'overworld';
  }
}
function renderMenu() {
  renderOverworld();
  ctx.fillStyle = 'rgba(10,16,10,0.55)'; ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = '#20242a'; ctx.fillRect(24, 18, 112, 108); ctx.fillStyle = '#f8f8f8'; ctx.fillRect(26, 20, 108, 104);
  drawText('DAY ' + G.save.day, 32, 26, '#20242a', 1);
  wrapText(objective(), 24).slice(0, 4).forEach((l, i) => drawText(l, 32, 37 + i * 7, '#5a6270', 1));
  ['BERRYDEX', 'CONTROLS', 'RESUME'].forEach((l, i) => {
    const y = 72 + i * 12;
    if (i === menuSel) drawText('▶', 32, y, '#b03030', 1);
    drawText(l, 40, y, '#20242a', 1);
  });
  drawText('TEA ×' + G.save.tea, 32, 112, '#5a6270', 1);
}

/* ============================== CONTROLS SCREEN ============================== */
let controlsFrom = 'title', controlsSel = 0; // row 0: joystick setting, row 1: back
const STICK_MODES = ['AUTO', 'ALWAYS', 'OFF'];
function openControls(from) { controlsFrom = from; controlsSel = 0; mode = 'controls'; }
function cycleStick(d) {
  const cur = STICK_MODES.indexOf(settings.stick.toUpperCase());
  settings.stick = STICK_MODES[(cur + d + STICK_MODES.length) % STICK_MODES.length].toLowerCase();
  saveSettings(); applyStickPref();
}
function controlsUpdate() {
  if (Input.bHit) { mode = controlsFrom; return; }
  if (controlsFrom === 'menu' && Input.startHit) { mode = 'menu'; return; }
  if (menuNavHit('up') || menuNavHit('down')) controlsSel = 1 - controlsSel;
  if (controlsSel === 0) {
    if (menuNavHit('left')) cycleStick(-1);
    if (menuNavHit('right')) cycleStick(1);
    if (Input.aHit) cycleStick(1);
  } else if (Input.aHit) mode = controlsFrom;
}
function renderControls() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = '#20242a'; ctx.fillRect(4, 4, 152, 136);
  ctx.fillStyle = '#f8f8f8'; ctx.fillRect(6, 6, 148, 132);
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
  row('JOYSTICK: MOVE · A/B: BUTTONS', 103);
  ctx.fillStyle = '#c9ced4'; ctx.fillRect(12, 112, 136, 1);
  if (controlsSel === 0) drawText('▶', 12, 118, '#b03030', 1);
  drawText('SHOW STICK: < ' + settings.stick.toUpperCase() + ' >', 20, 118, '#20242a', 1);
  if (controlsSel === 1) drawText('▶', 12, 128, '#b03030', 1);
  drawText('BACK', 20, 128, '#20242a', 1);
}
function dexUpdate() { if (Input.bHit || Input.aHit) mode = 'menu'; }
function renderDex() {
  ctx.fillStyle = '#1d3a26'; ctx.fillRect(0, 0, VW, VH);
  drawText('BERRYDEX', 80 - textW('BERRYDEX', 2) / 2, 8, '#ffffff', 2);
  const seen = G.save.dex.blueberry;
  const rows = [
    ['BLUEBERRY · SEED', seen.includes('SEED')], ['BLUEBERRY · SPROUT', seen.includes('SPROUT')],
    ['BLUEBERRY · SEEDLING', seen.includes('SEEDLING')], ['BLUEBERRY · BUSH', false],
    ['BLUEBERRY · BLOSSOM', false], ['BLUEBERRY · FRUITING', false],
    ['FORSYTHIA', false], ['STRAWBERRY', false], ['RASPBERRY', false],
  ];
  rows.forEach(([name, got], i) => {
    const y = 30 + i * 11;
    ctx.fillStyle = got ? '#f8f8f8' : 'rgba(248,248,248,0.35)'; ctx.fillRect(14, y - 2, 132, 10);
    drawText(got ? name : (i < 3 ? name : '??? · NO DATA YET'), 18, y, got ? '#20242a' : '#5a6270', 1);
    if (got) drawText('SEEN', 128, y, '#2e8b3a', 1);
  });
  drawText('B: BACK', 8, 134, '#9fc79f', 1);
}

/* ============================== MAIN LOOP ============================== */
let perfNow = 0, lastT = 0;
const audibleBtn = document.getElementById('audibleBtn');
audibleBtn.href = AUDIBLE_URL;
function update(dt) {
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
    case 'dex': dexUpdate(); break;
    case 'controls': controlsUpdate(); break;
  }
  audibleBtn.hidden = !(mode === 'title' || mode === 'card');
}
function render() {
  switch (mode) {
    case 'title': renderTitle(); break;
    case 'chapters': renderChapters(); break;
    case 'overworld': case 'dialogue': renderOverworld(); if (mode === 'dialogue' && dlg) drawDlg(); break;
    case 'trial': renderTrial(); break;
    case 'card': renderCard(); break;
    case 'menu': renderMenu(); break;
    case 'dex': renderDex(); break;
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
      pots: G.save.pots.map(p => ({ stage: p.stage, waterDays: p.waterDays, watered: p.watered, vigor: p.vigor })),
      dex: JSON.parse(JSON.stringify(G.save.dex)), deerBeaten: G.save.deerBeaten, deerPresent: G.save.deerPresent,
      chapterDone: G.save.chapterDone, player: { x: player.tx, y: player.ty, dir: player.dir },
      alvin: { x: alvin.tx, y: alvin.ty }, trial: trialSnapshot(),
      settings: { stick: settings.stick }, stickVisible: !deckEl.hidden,
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
    G.save.pots.forEach(p => { if (p.stage === 0 && G.save.seedsLeft > 0) { p.stage = 1; G.save.seedsLeft--; dexAdd('SEED'); } });
    if (G.save.tutorial === 1) G.save.tutorial = 2;
    saveGame();
  },
  skipIntro() { dlg = null; if (G.save.tutorial === 0) G.save.tutorial = 1; if (mode === 'dialogue') mode = 'overworld'; saveGame(); },
  startTrial() { if (G.save.deerPresent && !G.save.deerBeaten && strongestPot() >= 0) startTrial(); },
  warp(x, y) { player.tx = x; player.ty = y; syncPixels(player); alvin.tx = x; alvin.ty = y + 1; syncPixels(alvin); },
};
