# Architecture overview

## Repository layout

```
index.html                      Landing page. Links to every prototype.
prototype/                      The webapp codebase.
  assets/
    css/
      theme-army.css            MAARK palette, deep bottle green and gold
      theme-neutral.css         MAARK palette, graphite and bronze
      theme-indigo.css          MAARK palette, navy and gold
      theme-hrv.css             CUT-HRV palette, petrol teal and copper
      maark.css                 MAARK design system, shared by all three themes
      cut-hrv.css               CUT-HRV design system
      maark-portal.css          Portal design system
    js/
      core.js                   102 functions identical to both apps
      maark.js                  MAARK domain, data and views
      cut-hrv.js                CUT-HRV domain, data and views
      maark-portal.js           Portal, separate architecture
  maark/index.html              MAARK 2.0, army green
  maark/neutral.html            MAARK 2.0, neutral
  maark/indigo.html             MAARK 2.0, indigo
  cut-hrv/index.html            CUT-HRV 2.0
  maark-portal/index.html       MAARK 2.0 portal
docs/                           This folder. Reference only.
MAARK.html, CUT-HRV.html, ...   Redirect stubs at the old root paths.
```

Each page in `prototype/` is a thin shell: a head, two or three asset links,
the body markup, and two script tags. All the weight sits in `assets/`.

## No build step

There is no package manager, no bundler and no test runner. Open a file in a
browser and it runs. Nothing is fetched from a network, which the RFP requires,
so never introduce a CDN link, a web font or an npm package. Asset paths are
relative (`../assets/...`) so the tree works from `file://`, from a local
server and from GitHub Pages without change.

To serve locally:

```
python -m http.server 8000
```

## Load order

Order matters and is fixed:

1. `theme-*.css` defines the palette tokens on `:root`.
2. The app stylesheet defines structural tokens and every rule.
3. `core.js` defines the shared functions.
4. The app script defines domain constants, data and views, then runs
   `applyPrefs()` at the end.

`core.js` contains function declarations only, no top-level statements, so it
cannot depend on load order. Both scripts are classic scripts, never
`type="module"`, because every inline `onclick` in the markup calls a global.

## How a page boots

1. `seed(force)` writes fake records into `localStorage` on first visit.
2. The login screen collects a role, then any six-digit code as the 2FA token.
3. `verifyOtp()` builds `SESSION`, calls `buildNav()` and routes to the dashboard.
4. `go(key)` looks the key up in a view map, renders a skeleton, then calls the
   matching `v*` function into `#mainArea` after about 150ms.
5. Views build HTML strings and assign `innerHTML`. Interactivity is inline
   `onclick` handlers calling global functions.

## Adding a theme

Copy an existing `theme-*.css`, change the values, then copy a MAARK shell and
point its first `<link>` at the new file. No JavaScript changes are needed. The
emblem colour is the `--emblem-ink` token, read at runtime by `cssv()`.
