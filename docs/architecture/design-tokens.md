# Design tokens

The entire palette lives in CSS custom properties. Style through tokens, never
a hard-coded hex in a rule.

## Palette tokens (per theme file)

| Token | Purpose |
|---|---|
| `--g900` to `--g500` | Primary brand ramp, darkest to lightest |
| `--gold`, `--gold-l`, `--gold-d`, `--gold-soft` | Accent ramp |
| `--ink`, `--muted`, `--faint` | Text, in decreasing emphasis |
| `--line`, `--line-2` | Borders, strong and hairline |
| `--bg`, `--paper`, `--cream` | Page, card and tinted surfaces |
| `--danger`, `--ok`, `--warn`, `--info` | Semantic status colours |
| `--sh-1`, `--sh-2`, `--sh-3` | Elevation shadows |
| `--emblem-ink` | Ink colour of the drawn emblem, read by `cssv()` |

## Structural tokens (in the app stylesheet)

`--r` and `--r-sm` for corner radii, `--serif` and `--sans` for the two font
stacks. These do not change between themes, so they are not duplicated in the
theme files.

## The four themes

| File | Theme | Used by |
|---|---|---|
| `theme-army.css` | Deep bottle green and regimental gold | `maark/index.html` |
| `theme-neutral.css` | Graphite and warm bronze | `maark/neutral.html` |
| `theme-indigo.css` | Deep navy and gold | `maark/indigo.html` |
| `theme-hrv.css` | Deep petrol teal and copper | `cut-hrv/index.html` |

## Runtime palette switching

Separately from the file-level theme, the running app can swap palettes from
the profile menu. `PALETTES` in the app script maps a name to a token set,
`setPalTokens()` writes them inline on `documentElement`, and the choice is
stored in `ui_palette`. The default entry is `null`, which removes the inline
properties and falls back to whatever the theme file set. `--emblem-ink` is not
part of `PALETTES`, so the emblem always follows the file-level theme.

## Modes

Dark mode is `body.dark`, which redefines the tokens and adds a set of
overrides. Compact table rows are `body.compact`. Both persist in
`localStorage` as `ui_theme` and `ui_density`, and both are shared across every
prototype because the keys are not prefixed per app.

## Charts

Every chart is SVG generated in JavaScript. Chart colours come from
`cssv('--token')`, so they follow the palette and dark mode with no extra work.
There is no charting library.
