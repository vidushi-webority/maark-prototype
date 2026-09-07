# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What this is

Static HTML prototypes for **MAARK 2.0** and **CUT-HRV 2.0**, built by Webority
Technologies as concept demos for RFP A/60463 (ADG Human Rights, IHQ of MoD, Army).
Dummy data only, not a live system. Full background: `docs/project/context.md`.

There is **no build, no package manager, no tests, no dependencies**. Nothing is
fetched from a network (deliberate: the RFP requires an air-gapped app), so never
introduce a CDN link, an external font, or an npm package.

## Running

Open `index.html` in a browser, or `python -m http.server 8000`. Reload to see edits.
Demo flow: open a prototype, pick a role, enter any 6-digit code as the 2FA token.

## Layout

```
index.html                    Landing page linking to every prototype
prototype/assets/css/         theme-{army,neutral,indigo,hrv}.css + per-app stylesheets
prototype/assets/js/          core.js (shared) + maark.js, cut-hrv.js, maark-portal.js
prototype/maark/              index.html (army), neutral.html, indigo.html
prototype/cut-hrv/            index.html
prototype/maark-portal/       index.html
docs/                         Architecture and project reference
*.html at root                Redirect stubs for the old pre-restructure URLs
```

Each page file is a shell: head, asset links, body markup, two script tags. All
weight is in `assets/`.

## Read these before changing code

| Task | Document |
|---|---|
| Anything structural | `docs/architecture/overview.md` |
| Colours, themes, dark mode, charts | `docs/architecture/design-tokens.md` |
| Editing `core.js` | `docs/architecture/shared-core.md` |
| Icons | `docs/architecture/icons.md` |
| MAARK data model and views | `docs/architecture/maark.md` |
| CUT-HRV data model and views | `docs/architecture/cut-hrv.md` |
| The portal build | `docs/architecture/maark-portal.md` |
| Code and content rules | `docs/project/conventions.md` |

## Rules that bite

- **`core.js` is shared by MAARK and CUT-HRV.** A change there lands in both. If
  only one app should get it, move the function out of `core.js` into both app
  scripts first, then change one.
- **The three MAARK builds share one stylesheet and one script.** There is no
  mirroring rule any more. A MAARK change is made once. Verify the shells stay thin
  with `diff prototype/maark/index.html prototype/maark/indigo.html`, which should
  show only the `<title>` and the theme `<link>`.
- **Bump `SEED_V`** in the app script whenever the seed record shape changes, or
  returning users keep stale records and the page looks broken.
- **Classic scripts only**, never `type="module"`, because every inline `onclick`
  calls a global. Do not wrap anything in a module or IIFE.
- **Relative asset paths only**, so the tree works from `file://`, a local server
  and GitHub Pages alike.
- **Style through tokens**, never a hard-coded hex in a rule.
- **Icons come from `icons.js`** (Iconsax Linear, inlined). Use `svgIco('key',size)`,
  `icon(k)` or a `data-ico` slot. No emoji, no icon font, no SVG pasted at the call site.
  `icons.js` is loaded by MAARK only; CUT-HRV keeps its own `ICONS` map, so the two must
  never both be loaded (`const ICONS` would be redeclared).
- **No em dash, en dash, curly quote, prose arrow, mid-sentence emoji or marketing
  adjective in any user-visible string, comment or doc.** The empty-value glyph is a
  plain `-`. Full rule and the two grep checks: `docs/project/conventions.md`
  (Writing).
- Terse, dense house style. Match it, do not reformat existing code.
- Currency INR via `toLocaleString('en-IN')`, dates `en-IN`, IST.
- Keep the prototype and dummy-data disclaimers intact, and keep the emblem neutral:
  no national symbol, no tricolour, no state motto. These were deliberately removed.
