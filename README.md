# MAARK 2.0 and CUT-HRV 2.0: Interactive Prototypes

Concept demonstrations by **Webority Technologies** for the proposed re-development of
two Additional Directorate General of Human Rights web applications to Version 2.0,
prepared for RFP A/60463 (IHQ of MoD, Army).

> ⚠️ **Prototype, demonstration only.** Uses dummy data. This is **not** a live, official,
> or classified Government of India / Ministry of Defence system.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Pick a role, enter any 6-digit code as the 2FA token, and the dashboard loads.

## Layout

```
index.html        Landing page
prototype/        The webapp: assets/css, assets/js, and one folder per build
docs/             Architecture and project reference
```

| Prototype | Path |
|---|---|
| MAARK 2.0 portal | `prototype/maark-portal/index.html` |
| MAARK 2.0, army green | `prototype/maark/index.html` |
| MAARK 2.0, neutral | `prototype/maark/neutral.html` |
| MAARK 2.0, indigo | `prototype/maark/indigo.html` |
| CUT-HRV 2.0 | `prototype/cut-hrv/index.html` |

The three MAARK builds share one stylesheet and one script and differ only in the
theme tokens they link. MAARK and CUT-HRV share `assets/js/core.js`.

100% offline. No build step, no package manager, zero external dependencies.

## Documentation

Start at [docs/README.md](docs/README.md), or go straight to
[the architecture overview](docs/architecture/overview.md).
