# Hope Starts Small — the game

A tiny Pokémon-style tending game: plant seeds, water them day by day, face the trials a garden attracts, and grow something that started small. Chapter 1: **Seeds**.

## Play

Open the GitHub Pages site, or run it locally (below). Progress saves automatically in your browser's local storage.

## Controls

- **Keyboard:** Arrows / WASD move · Z or Enter = A (confirm) · X or Esc = B (back) · P = menu
- **Gamepad** (standard mapping): D-pad or left stick move · A = confirm · B = back · Start = menu
- **Touch:** analog stick (it commits to one direction at a time — no diagonals), MENU button, and A / B buttons in the control deck below the screen

All three work at the same time. The in-game **CONTROLS** menu (from the title screen or the pause menu) lists every scheme and lets you set when the touch controls show: AUTO (touch devices), ALWAYS, or OFF.

## Music

The title screen carries the game's theme: **"This Is My Father's World"** — the tune TERRA BEATA (Franklin L. Sheppard, 1915; a traditional English melody), public domain, in a gentle chiptune arrangement (melody verified against Hymnary.org's tune record and the 1919 printing). It starts after your first keypress, click, or tap — browsers won't play audio before one — loops while the title is up, and stops when the game starts. The **CONTROLS** menu has a MUSIC: ON/OFF setting. The arrangement's source is [`theme.mid`](theme.mid), a Standard MIDI File in this repo; the game plays data generated from that same arrangement (see `tests/make-theme.js`).

## Run locally

No build step, no dependencies. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

then open <http://localhost:8000>.

## Development

The Playwright smoke suite and the character screenshot rig live in [`tests/`](tests/) — see `tests/README.md` for how to run them.
