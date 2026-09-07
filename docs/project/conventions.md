# Conventions

## Structure

- The webapp lives in `prototype/`, documentation in `docs/`, and the landing
  page stays at the repository root because GitHub Pages serves it from there.
- Shared CSS and JavaScript live in `prototype/assets/`. A page file is a shell:
  head, asset links, body markup, script tags. Do not put rules or logic back
  inline.
- Asset paths are always relative. Nothing may reference an absolute path or an
  external host.

## Code style

- Terse and dense: single-line functions, template literals building HTML,
  statements separated by semicolons. Match it. Do not reformat existing code.
- Everything a view needs is a global function, because inline `onclick`
  handlers depend on it. No modules, no IIFEs, no `type="module"`.
- Style through design tokens, never a hard-coded hex in a rule. New colours
  become tokens in the theme files.
- Icons come from the Iconsax set in `icons.js`, rendered through `icon()`,
  `svgIco()` or a `data-ico` slot. Never an icon font, never an emoji, never a
  pasted SVG at the call site. See [../architecture/icons.md](../architecture/icons.md).

## Content

- Currency in INR with `toLocaleString('en-IN')`. Dates in `en-IN`, IST.
- Keep the prototype and dummy-data disclaimers intact.
- Keep the emblem neutral. See [context.md](context.md).

## Writing (applies to every word in MAARK 2.0)

This is Government-of-India-facing text. It must read as if an officer wrote it,
not as if it was generated. The rule covers every string a user can see: page
copy, headings, labels, buttons, toasts, chart titles, AI-assistant answers,
validation messages, and the landing page. It also covers code comments and the
documents in `docs/`.

Never write these:

- **Em dash and en dash in prose.** No `—`, no `–`. Rewrite by sense instead: a
  comma for an aside, a period for two sentences, a colon before a list or a
  value, parentheses for a true aside. Never `&mdash;` or `&ndash;` either.
- **Curly quotes.** No `“ ” ‘ ’`. Use `&quot;` in HTML strings, or a plain `'`.
- **Arrows in a sentence.** No `→` or `&rarr;` standing in for a word. Write
  "V1 to V2", "from CMS, then Database Update". Arrows stay only as a UI
  affordance: the back button (`&larr;`), the KPI card chevron, pagination.
- **Emoji inside a sentence.** Emoji are icons only, placed through `icon()` or
  `svgIco()` or as a standalone glyph in a button. Never mid-paragraph, and
  never as decoration in a greeting.
- **Marketing adjectives.** No seamless, robust, comprehensive, cutting-edge,
  state-of-the-art, in-depth, fully interactive, effortless, empower, leverage,
  streamline, unlock, elevate. State what the screen does: "Analytics lets you
  group cases by State" beats "Analytics is fully interactive".

Also:

- **The empty-value glyph is a plain hyphen `-`**, never `—`. That is what
  `x[field]||"-"` is for. One character keeps table columns tight.
- One idea per sentence, roughly 15 to 20 words. Spell an acronym out once.
- Quoted material is exempt: a verbatim RFP line, a log line, a proper noun.

Check before you finish. Both must come back empty:

```
grep -rn -P '[\x{2014}\x{2013}\x{201C}\x{201D}\x{2018}\x{2019}]' prototype index.html docs
grep -rn -E '&(mdash|ndash|ldquo|rdquo|lsquo|rsquo|rarr);' prototype index.html
```

## Before you change shared code

`core.js` is loaded by both apps. A change there lands in MAARK and CUT-HRV at
once. If only one app should get it, move the function out of `core.js` into
both app scripts first. See [../architecture/shared-core.md](../architecture/shared-core.md).

## Seed data

Bump `SEED_V` in the app script whenever the seed record shape changes, or
returning users keep stale records and the page looks broken.
