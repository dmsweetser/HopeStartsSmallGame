/* make-theme.js — generates theme.mid (the game's theme song) and prints
   the THEME data literal that game.js carries, from ONE arrangement
   definition, so the MIDI file in the repo root is the true source of
   what the game plays.

   THE TUNE: "This Is My Father's World" — TERRA BEATA, arranged by
   Franklin L. Sheppard (Alleluia, 1915) from a traditional English
   melody. Public domain. Melody only — no words are used anywhere.

   VERIFICATION (done Nov 26, 2026, against public-domain transcriptions):
   - Hymnary.org's TERRA BEATA tune record: key Eb major, incipit
     (scale degrees) 12353 21234 65326. The first 15 melody notes below
     match that incipit exactly — this script asserts it.
   - The 1919 printing as engraved at piano.org: opening notes
     Eb4 F4 G4 Bb4 G4 F4 Eb4 F4 G4 (asserted); a one-beat pickup of two
     eighth notes; the title line's last word held three beats; the
     second half opens a fifth higher (Bb4) and peaks on Eb5; the
     lowest note is Bb3, in the "music of the spheres" bars; the last
     four bars of each half share one tune; the Amen moves Ab -> Eb.
   The arrangement (bass, chords, tempo, voices) is original to this
   game; the melody is Sheppard's.

   Run: node tests/make-theme.js   (writes ../theme.mid, prints the JS) */
const fs = require('fs');
const path = require('path');

/* ---- the arrangement: [note, beats] streams on one shared timeline ----
   MIDI note numbers, Eb major. 0 = rest (bass); [] = rest (chords).
   The melody is continuous: pickup + 16 bars + Amen = 69 beats. */
const BPM = 88;
const MELODY = [
  [63, .5], [65, .5],                                     // pickup: This is
  [67, 1], [70, 1], [67, 1], [65, 1],                     // bar 1: my Father's world-
  [63, 3], [65, .5], [67, .5],                            // bar 2: -world held; And to
  [68, 1], [72, 1], [70, 1], [67, 1],                     // bar 3: my listening ears-
  [65, 3], [72, .5], [70, .5],                            // bar 4: -ears held; All na-
  [67, 1], [67, 1], [65, 1], [63, 1],                     // bar 5: -ture sings, and round
  [67, 2], [65, .5], [63, .5], [58, 1],                   // bar 6: me rings; The (low Bb)
  [63, 1], [65, 1], [67, 1], [70, 1],                     // bar 7: music of the
  [65, 1], [67, 1], [63, 2],                              // bar 8: spheres (close)
  [70, .5],                                               // pickup 2: This (a fifth higher)
  [75, .5], [70, 1], [72, 1], [74, 1],                    // bar 9: is my Father's
  [75, 3], [75, .5], [74, .5],                            // bar 10: world held; I rest
  [72, 1], [68, 1], [67, 1], [70, 1],                     // bar 11: me in the thought-
  [70, 3], [72, .5], [70, .5],                            // bar 12: -thought held; Of rocks
  [67, 1], [67, 1], [65, 1], [63, 1],                     // bar 13: and trees, of skies
  [67, 2], [65, .5], [63, .5], [58, 1],                   // bar 14: and seas; His (low Bb)
  [63, 1], [65, 1], [67, 1], [70, 1],                     // bar 15: hand the wonders
  [65, 1], [67, 1], [63, 2],                              // bar 16: wrought
  [68, 2], [63, 2],                                       // Amen: Ab -> Eb
];
const BASS = [
  [0, 1],
  [39, 2], [46, 2], [39, 2], [46, 2], [44, 2], [51, 2], [44, 2], [48, 2],
  [39, 2], [46, 2], [39, 3], [46, 1], [39, 2], [46, 2], [39, 2], [43, 2],
  [0, .5],
  [39, 2], [46, 1.5], [39, 2], [43, 2], [44, 2], [48, 2], [44, 2], [44, 2],
  [39, 2], [46, 2], [39, 3], [46, 1], [39, 2], [46, 2], [39, 4],
  [44, 2], [39, 2],
];
const EB_PAD = [55, 58, 63], AB_PAD = [56, 60, 63];
const CHORDS = [
  [[], 1],
  [EB_PAD, 4], [EB_PAD, 4], [AB_PAD, 4], [AB_PAD, 4],
  [EB_PAD, 4], [EB_PAD, 4], [EB_PAD, 4], [EB_PAD, 4],
  [[], .5],
  [EB_PAD, 3.5], [EB_PAD, 4], [AB_PAD, 4], [AB_PAD, 4],
  [EB_PAD, 4], [EB_PAD, 4], [EB_PAD, 4], [EB_PAD, 4],
  [AB_PAD, 2], [EB_PAD, 2],
];

/* ---- verification against the sources ---- */
function total(stream) { return stream.reduce((a, e) => a + e[1], 0); }
function notes(stream) { return stream.filter(e => e[0]).map(e => e[0]); }
const mel = notes(MELODY);
const DEG = { 63: 1, 65: 2, 67: 3, 68: 4, 70: 5, 72: 6, 74: 7, 75: 1 };
const incipit = mel.slice(0, 15).map(n => DEG[n]).join('');
if (incipit !== '123532123465326') throw new Error('incipit mismatch: ' + incipit);
if (mel.slice(0, 9).join(',') !== '63,65,67,70,67,65,63,65,67') throw new Error('opening mismatch');
if (Math.min(...mel) !== 58 || Math.max(...mel) !== 75) throw new Error('range mismatch');
const half1Bars58 = mel.slice(16, 31).join(','), half2Bars58 = mel.slice(46, 61).join(',');
if (half1Bars58 !== half2Bars58) throw new Error('bars 5-8 / 13-16 repeat mismatch');
for (const [name, s] of [['melody', MELODY], ['bass', BASS], ['chords', CHORDS]])
  if (total(s) !== 69) throw new Error(name + ' totals ' + total(s) + ' beats, expected 69');
console.log('melody verified: incipit 12353 21234 65326, opening Eb F G Bb G F Eb F G, range Bb3..Eb5, 69 beats @ ' + BPM + ' BPM');

/* ---- write the Standard MIDI File (format 1: conductor + 3 tracks) ---- */
const PPQ = 480;
function vlq(n) { const b = [n & 0x7f]; n >>= 7; while (n) { b.unshift((n & 0x7f) | 0x80); n >>= 7; } return b; }
function track(events) { // events: [absTick, [bytes...]] sorted by tick
  const out = []; let last = 0;
  events.sort((a, b) => a[0] - b[0]);
  for (const [tick, bytes] of events) { out.push(...vlq(tick - last), ...bytes); last = tick; }
  out.push(0x00, 0xff, 0x2f, 0x00);
  return Buffer.concat([Buffer.from('MTrk', 'ascii'), (() => { const l = Buffer.alloc(4); l.writeUInt32BE(out.length); return l; })(), Buffer.from(out)]);
}
function voiceTrack(name, stream, channel, program, velocity, gate) {
  const ev = [[0, [0xff, 0x03, name.length, ...Buffer.from(name, 'ascii')]], [0, [0xc0 | channel, program]]];
  let beat = 0;
  for (const [note, beats] of stream) {
    const start = Math.round(beat * PPQ), dur = Math.max(1, Math.round(beats * PPQ * gate));
    const ns = Array.isArray(note) ? note : (note ? [note] : []);
    for (const n of ns) {
      ev.push([start, [0x90 | channel, n, velocity]]);
      ev.push([start + dur, [0x80 | channel, n, 0]]);
    }
    beat += beats;
  }
  return track(ev);
}
const usecPerQuarter = Math.round(60000000 / BPM);
const conductor = track([
  [0, [0xff, 0x03, 9, ...Buffer.from('Conductor', 'ascii')]],
  [0, [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08]], // 4/4
  [0, [0xff, 0x51, 0x03, (usecPerQuarter >> 16) & 0xff, (usecPerQuarter >> 8) & 0xff, usecPerQuarter & 0xff]],
]);
const header = Buffer.concat([
  Buffer.from('MThd', 'ascii'),
  (() => { const b = Buffer.alloc(10); b.writeUInt32BE(6, 0); b.writeUInt16BE(1, 4); b.writeUInt16BE(4, 6); b.writeUInt16BE(PPQ, 8); return b; })(),
]);
const mid = Buffer.concat([header, conductor,
  voiceTrack('Melody', MELODY, 0, 73, 84, 0.92),   // flute-ish lead
  voiceTrack('Bass', BASS, 1, 32, 70, 0.9),        // acoustic bass
  voiceTrack('Chords', CHORDS, 2, 48, 44, 0.98),   // soft string pad
]);
const outPath = path.join(__dirname, '..', 'theme.mid');
fs.writeFileSync(outPath, mid);
console.log('wrote ' + outPath + ' (' + mid.length + ' bytes)');

/* ---- print the game.js literal (same data, pair-stream form) ---- */
const fmt = s => s.map(e => '[' + (Array.isArray(e[0]) ? '[' + e[0].join(',') + ']' : e[0]) + ',' + e[1] + ']').join(',');
console.log('\n--- paste into game.js ---');
console.log('const THEME = {');
console.log('  bpm: ' + BPM + ', beats: 69,');
console.log('  melody: [' + fmt(MELODY) + '],');
console.log('  bass: [' + fmt(BASS) + '],');
console.log('  chords: [' + fmt(CHORDS) + '],');
console.log('};');
