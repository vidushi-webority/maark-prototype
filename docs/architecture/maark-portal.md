# MAARK 2.0 portal

File: `prototype/maark-portal/index.html`, with `assets/css/maark-portal.css`
and `assets/js/maark-portal.js`.

A smaller, separate build. It is the one the landing page opens as the primary
MAARK demo. It does not share `core.js`, because its architecture differs:

- A `VIEWS` map rather than the `NAV` plus `go()` pairing.
- Command-scoped data rather than state-scoped.
- A notings workflow that the main MAARK build does not have.
- One storage key, `maark_portal_v2`, rather than the six prefixed keys.

Do not try to fold it into the shared core. If a fix applies to both, apply it
twice and note it in the commit message.
