# MAARK 2.0

Maintenance Allowance Automated Record Keeping. Digitises maintenance-allowance
case management for soldiers' dependents: registration, verification, approval
and disbursement, with a CMS, analytics and an audit trail.

Files: `prototype/maark/index.html` (army green), `neutral.html`, `indigo.html`.
All three load `assets/css/maark.css` and `assets/js/maark.js`; they differ only
in `<title>` and which theme stylesheet they link.

## Domain constants

`STATES`, `GROUPS` (state to Army Command), `STATE_DISTRICTS`, `STATUS`, `RANKS`.

## Storage keys

| Key | Holds |
|---|---|
| `maark_cases` | The case records |
| `maark_audit` | The audit log |
| `maark_seq` | Case number sequence |
| `maark_settings` | CMS settings |
| `maark_draft` | Autosaved new-case form |
| `maark_seed_v` | Seed version, currently `2` |

`ui_palette`, `ui_theme` and `ui_density` are shared with every other prototype
and are deliberately not prefixed.

**When you change the seed data shape, bump `SEED_V`.** Otherwise returning
users keep stale records and the page looks broken.

## Views

`vDashboard`, `vNewCase`, `vCases`, `vTransfers`, `vReports`, `vAnalytics`,
plus `vCMS` and `vAudit` from `core.js`. `NAV` maps the role (User, Admin,
Super Admin) to sidebar entries, and `go(key)` resolves a key to a view.

## Case lifecycle

Open, Under Review, Approved, Rejected, Transferred.

## Assistant

`KB` is an array of `{t:[trigger phrases], a:()=>answer, n:[follow-ups]}`.
`scoreEntry` picks the best keyword match. To teach the bot a new answer, add a
`KB` entry. Several answers read live counts from `DB`.
