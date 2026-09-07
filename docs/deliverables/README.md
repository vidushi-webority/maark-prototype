# Client deliverables

Documents sent to the Additional Directorate General of Human Rights for
RFP A/60463. These are outputs, not source. Nothing here is loaded by the
browser and nothing in `../../prototype/` reads them.

| File | Version | Date | What it is |
|---|---|---|---|
| [ADGHR-MAARK-Wireframes-v1.pdf](ADGHR-MAARK-Wireframes-v1.pdf) | v1 | 07-Sep-2026 | The original indicative wireframes. Violet placeholder palette, 10 screens, layout alignment only |
| [ADGHR-MAARK-Screen-Designs-v2.pdf](ADGHR-MAARK-Screen-Designs-v2.pdf) | v2 | 07-Sep-2026 | Screens captured from the working portal, plus a design-notes page recording what changed from v1 and why |

## How v2 was produced

The figures are real captures of `../../prototype/maark-portal/index.html`, not
redrawn mockups. Serve the repo, drive each screen in headless Chrome at 1660px
with a 2x device scale factor, then render an A4 print sheet to PDF:

```
python -m http.server 8000
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 \
       --window-size=1660,<height> --screenshot=<screen>.png <url>
chrome --headless=new --no-pdf-header-footer --print-to-pdf=out.pdf doc.html
```

Page size is A4 through `@page { size: A4; margin: 0 }`, with each page a
210mm by 297mm block. Confirm the output with the MediaBox: it should read
594.96 by 841.92 points.

## Rules

- Regenerate rather than edit. A figure that no longer matches the portal is
  worse than no figure.
- Bump the version and keep the previous file. The client cites page numbers,
  so a replaced v2 breaks their references.
- Keep the emblem neutral and the dummy-data disclaimer intact, the same as the
  prototype itself. See `../project/context.md`.
