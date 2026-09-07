# Icons

MAARK 2.0 uses **Iconsax** (Linear variant) throughout. There are no emoji icons
left in the app.

## Where the artwork lives

`prototype/assets/js/icons.js` holds a single `const ICONS` map: 35 entries,
each a string of `<path>` elements. The path data was extracted from
`iconsax-react` 0.0.8 at authoring time and inlined. There is no runtime
dependency, no npm package in the repository and nothing is fetched, so the
air-gap constraint still holds.

The file is loaded before `core.js`:

```html
<script src="../assets/js/icons.js"></script>
<script src="../assets/js/core.js"></script>
<script src="../assets/js/maark.js"></script>
```

## Rendering

| Helper | Use |
|---|---|
| `icon(k)` | Sidebar navigation. Wraps the paths in `.navic`. |
| `svgIco(k, size)` | Everywhere else. Returns a sized inline SVG. |
| `hydrateIcons(scope)` | Fills `[data-ico]` slots in static shell markup. |

`svgIco()` supplies `stroke:currentColor` and `fill:none`, so every icon takes
the colour of its surroundings and follows dark mode and the runtime palette
with no extra work. Never hard-code a colour on an icon.

Static markup in the page shell cannot call `svgIco()`, so those slots carry
`data-ico="key"` and an optional `data-sz`, and `hydrateIcons()` fills them once
at boot. Add a new static icon by adding the attribute, not by pasting SVG.

## Keys are named for the job, not the picture

`approved`, `pending`, `download`, `lock`. Swapping the artwork for a role means
changing one line in `icons.js`, and nothing else in the app moves. The comment
above each entry records which Iconsax icon it came from and where it is used.

## Adding an icon

1. Pick the Iconsax name from the contact sheet or the Iconsax site.
2. Take the **Linear** variant path data.
3. Add an entry to `ICONS` keyed by its role, with the usual comment line.
4. Reference it with `svgIco('key', size)` or `data-ico="key"`.

## CUT-HRV

CUT-HRV keeps its own hand-drawn `ICONS` map in `cut-hrv.js` and does **not**
load `icons.js`, because two `const ICONS` declarations in the same global scope
would collide. It carries Iconsax copies of the four keys that the shared
functions in `core.js` need: `lock`, `tick`, `save` and `refresh`. If CUT-HRV is
ever moved to Iconsax as well, delete its map and add the `icons.js` script tag
to its shell.

## Known exceptions

Two characters in MAARK are typography rather than icons and were left alone:
the rupee sign `&#8377;` in currency labels, and the bullet `&#9679;` before
RESTRICTED in the classification bar.
