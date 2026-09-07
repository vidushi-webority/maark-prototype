# CUT-HRV 2.0

Case Update Tool for Human Rights Violation. Registers, investigates and
adjudicates human-rights-violation complaints, carrying Operation, Victim,
Accused and Allegation records.

File: `prototype/cut-hrv/index.html`. Loads `assets/css/theme-hrv.css`,
`assets/css/cut-hrv.css`, `assets/js/core.js` and `assets/js/cut-hrv.js`.

## Relationship to MAARK

Same skeleton, same helper functions, different domain. The 102 shared
functions live in `core.js`; see [shared-core.md](shared-core.md). The
stylesheets are separate on purpose: CUT-HRV carries a deliberate visual
differentiation block (squarer cards, a top KPI strip, a different hero shape,
different gradient angles) so the two apps do not look like one product.

Structural fixes usually belong in both apps, but the data model and the status
vocabulary differ, so check before copying a change across.

## Storage keys

`cuthrv_cases`, `cuthrv_audit`, `cuthrv_seq`, `cuthrv_settings`,
`cuthrv_draft`, `cuthrv_seed_v` (currently `2`). Bump `SEED_V` whenever the
seed data shape changes.

## Views

`vDashboard`, `vNewCase`, `vCases`, `vReports`, `vAnalytics`, plus `vCMS` and
`vAudit` from `core.js`.

## Case lifecycle

Registered, Investigation, Findings, Closed.
