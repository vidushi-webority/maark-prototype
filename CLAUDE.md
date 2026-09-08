# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static HTML prototypes for **MAARK 2.0** and **CUT-HRV 2.0**, built by Webority
Technologies as concept demos for RFP A/60463 (ADG Human Rights, IHQ of MoD, Army).
Dummy data only, not a live system. Full background: `docs/project/context.md`.

There is **no build, no package manager, no tests, no dependencies**. Nothing is
fetched from a network (deliberate: the RFP requires an air-gapped app), so never
introduce a CDN link, an external font, or an npm package.

## Running

```bash
python -m http.server 8000     # then open http://localhost:8000/
```

Or open `index.html` from disk. Reload to see edits, there is nothing to rebuild.

- Portal (`MAARK_2.0.Web.App`): sign in with any email, then any password. No role picker,
  the session is always Super Admin.
- MAARK and CUT-HRV demos: pick a role, then any 6-digit code as the 2FA token.

## Layout

```
index.html                     Landing page linking to every prototype
MAARK_2.0.Web.App/             The portal build (the main deliverable)
MAARK_2.0.Web.Prototype/       index.html (army), neutral.html, indigo.html
CutHrv/                        CUT-HRV build
docs/                          Architecture and project reference
*.html at root                 Redirect stubs for the old pre-restructure URLs
```

Each app folder is self-contained: `assets/css/`, `assets/js/`, and thin page shells
(head, asset links, body markup, script tags). All weight is in `assets/`.

## The three codebases

They look alike but are wired differently. Check which one you are in before editing.

| | Scripts loaded | Icons | Seed store |
|---|---|---|---|
| `MAARK_2.0.Web.App` | `maark-portal.js` only | own `ICONS` map + `ICONS_BULK` (bulk variant is for the active sidebar item) | `const KEY="maark_portal_vN"` |
| `MAARK_2.0.Web.Prototype` | `icons.js`, `core.js`, `maark.js` | `icons.js` (Iconsax Linear, inlined) | `SEED_V` + `maark_cases` |
| `CutHrv` | `core.js`, `cut-hrv.js` | own `ICONS` map inside `cut-hrv.js` | `SEED_V` + `cuthrv_cases` |

- **The portal shares nothing.** It has no `core.js`. A change there lands only there.
- **`core.js` now exists as two identical copies** (`MAARK_2.0.Web.Prototype/` and
  `CutHrv/`). A fix meant for both must be applied to both files; `diff` them to check.
  A change meant for one app goes in that app's own script, not in either `core.js`.
- **The three MAARK builds share one stylesheet and one script.** A MAARK change is made
  once. Verify the shells stay thin with
  `diff MAARK_2.0.Web.Prototype/index.html MAARK_2.0.Web.Prototype/indigo.html`, which
  should show only the `<title>` and the theme `<link>`.
- **Two `ICONS` maps must never both load** on one page (`const ICONS` would be redeclared).

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

Note: `docs/` and `README.md` still describe the old `prototype/maark-portal/` tree from
before the restructure. Trust the folders above, and fix a stale path when you are already
editing that document.

## Rules that bite

- **Bump the seed version whenever the seed record shape changes**, or returning users keep
  stale records and the page looks broken. Portal: `KEY` (`maark_portal_v6` today, bump to
  `v7`). MAARK and CUT-HRV: `SEED_V`.
- **Classic scripts only**, never `type="module"`, because every inline `onclick` calls a
  global. Do not wrap anything in a module or IIFE.
- **Relative asset paths only**, so the tree works from `file://`, a local server and
  GitHub Pages alike.
- **Style through tokens**, never a hard-coded hex in a rule.
- **Icons come from the app's own map.** Use `ic('key',size)` (portal, CUT-HRV) or
  `svgIco('key',size)` / `icon(k)` / a `data-ico` slot (MAARK). Confirm the key exists in
  that app's map first. No emoji, no icon font, no SVG pasted at the call site.
- **No em dash, en dash, curly quote, prose arrow, mid-sentence emoji or marketing
  adjective in any user-visible string, comment or doc.** The empty-value glyph is a plain
  `-`. Full rule and the two grep checks: `docs/project/conventions.md` (Writing). The grep
  paths in that file still say `prototype`, so point them at the three app folders.
- Terse, dense house style. Match it, do not reformat existing code.
- Currency INR via `toLocaleString('en-IN')`, dates `en-IN`, IST.
- Keep the prototype and dummy-data disclaimers intact, and keep the emblem neutral: no
  national symbol, no tricolour, no state motto. These were deliberately removed.

## Editing the portal script

`MAARK_2.0.Web.App/assets/js/maark-portal.js` is one long file of string-concatenation
render functions. Useful landmarks:

- `seed()` builds the demo records, `DB` wraps localStorage, `STATE` holds them.
- `NAV` maps role to side-nav items, `VIEWS` maps a route key to its render function,
  `go(route,arg)` is the router.
- `vCaseDetail` renders the case shell, `cdTab` selects the body (`cdBody`), and the
  sub-judice tab (`cdSubJudice`) keeps a proceedings trail of hearings, court transfers
  and the final judgement in `x.court.events`.
- `modal()` + `closeModal()`, `dd()` for dropdowns, `kv()`/`cdSection()` for detail grids,
  `addAudit(code,detail)` for the audit log (add unknown codes to `AUD_META`).

Bash heredocs mangle the escaped quotes in this file. Edit it with the Edit tool, or write
a Python script to a scratchpad file and run that, rather than piping a patch through `sh`.
Verify with `node --check assets/js/maark-portal.js` after any splice.
