# The shared core

`prototype/assets/js/core.js` holds the 102 functions that were byte-identical
in MAARK and CUT-HRV. It is loaded by both apps before their own script.

## What is in it

| Group | Functions |
|---|---|
| Charts | `lineChart`, `barChartAxis`, `donut`, `donutDash`, `arc`, `sparkSVG`, `niceCeil`, `kfmt`, `wrapLabel`, `resolveColor`, `cssv` |
| Auth simulation | `doLogin`, `backToLogin`, `verifyOtp`, `logout`, `rndIp`, `sessionTimeout`, `resetIdle` |
| Chrome | `modal`, `closeModal`, `toast`, `head`, `skeletonView`, `emptyState`, `icon`, `svgIco` |
| Tables | `th`, `setSort`, `drawPager`, `gotoPage`, `pageSlice`, `toggleSel`, `toggleAll`, `clearSel`, `syncChkAll` |
| Forms | `fieldHtml`, `renderForm`, `validateField`, `fieldMeta`, `collectAll`, `saveDraft`, `clearDraft`, `updateRail`, `scrollSec` |
| Searchable select | `searchSelectHtml`, `sselRender`, `sselOpen`, `sselPick`, `sselCloseSoon`, `sselReconcile` |
| Preferences | `applyPrefs`, `applyTheme`, `setPalTokens`, `currentPal`, `toggleTheme`, `toggleDensity`, `countUp`, `runCounts` |
| Assistant | `initChat`, `sendChat`, `botAnswer` helpers, `bot`, `me`, `quick`, `refreshSug`, `normalize`, `scoreEntry` |
| Views | `vCMS`, `vAudit` |

## Rules for changing it

- **Declarations only.** No top-level `const`, `let` or executable statements.
  Load order then cannot break anything.
- **Never app-specific.** A function belongs here only while it is correct for
  both apps. If MAARK needs a change that CUT-HRV must not get, move the
  function out of `core.js` into both app scripts first, then change one.
- **Globals stay global.** Do not wrap the file in a module or an IIFE. Inline
  `onclick` handlers in the markup depend on globals.
- Functions here freely reference globals defined in the app script, such as
  `DB`, `SESSION`, `WIZ` and `PALETTES`. That is fine, because they are only
  called after the app script has loaded.

`maark-portal.js` does not use `core.js`. The portal has a different structure
and a different data model, and sharing was not attempted.
