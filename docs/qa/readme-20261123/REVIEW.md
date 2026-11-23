# README presentation review — 23 November 2026

The update retains the mission, all earlier study findings, the negative
comparisons, source boundaries and reproduction paths. It adds SYN-RC-1, REA-1,
current navigation and the integrated operating guide. It makes no NASA/SpaceX
approval, affiliation, parity or qualification claim.

Four diagrams explain distinct physical propositions, the five offline research
paths and UI boundary, the joint synthetic witness with sufficient ordinary
recovery, and the evidence required for the next step. Solid edges describe
current model/record relationships; dashed edges mark proposed transitions.
Color is reinforced by labels and line styles. Every diagram has `accTitle` and
`accDescr`, adjacent prose and full-size SVG/PNG links.

Current [Mermaid documentation](https://mermaid.js.org/config/accessibility.html)
was checked for accessible titles/descriptions; [GitHub's guidance](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
requires checking host syntax support. The documentation advertises newer layouts,
but this repository adds no dependency or runtime renderer. Actual local rendering
uses the existing Mermaid CLI 11.4.2 / Mermaid 11.6.0 and installed Chrome with a
temporary profile. No security-disabling browser flag or new model session is used.
Portable flowchart syntax, explicit contrast, short labels and consistent hierarchy
are the selected presentation techniques. No newest-version claim is made.

The first renders exposed a font fallback and clipped group titles. Those attempts
are retained under `initial/`. Explicit Arial configuration and shorter headings
corrected the problem. The architecture's presentation boundary uses a solid node
for the implemented visual laboratory; only its unimplemented new-study adapter
is dashed. Local SVG/PNG review checks label fit, connector meaning and title
placement. This is presentation QA, not scientific validation or full assistive-
technology conformance. Native GitHub rendering is checked separately after push.

Sources: [1](diagram-1.mmd), [2](diagram-2.mmd), [3](diagram-3.mmd), [4](diagram-4.mmd).
Figures: [1](diagram-1.png), [2](diagram-2.png), [3](diagram-3.png), [4](diagram-4.png).
The [render receipt](render-receipt.json) records bounded commands and hashes.

Local Markdown previews at 1280×900 and 390×844 have no document-width overflow.
All four SVGs retain their accessible title/description; all four declared text
color pairs exceed 4.5:1 by sRGB calculation. Opening and retention views were
visually inspected at both widths. Full-size links support diagrams that become
small when fitted to a phone column. This preview approximates a Markdown host;
it is not GitHub's renderer, a physical phone test or a screen-reader session.
The [layout receipt](local-layout.json) and
[presentation checks](presentation-checks.json) retain scope and hashes.

## Published-host readback

After publishing `9a4a2ee`, GitHub returned the exact committed README bytes.
All four native Mermaid frames rendered their expected accessible titles without
a reported diagram error: [host receipt](github-render.json). The anonymous
installed-Chrome captures retain the real GitHub UI. Its sticky navigation and
interactive diagram viewport obscure portions of the second/fourth captures;
these are not clean exports or proof of every host zoom state. The adjacent
full-size local SVG/PNG exports remain the complete figures.

The first browser attempt captured toolbar SVGs before diagram layout completed;
those premature captures are retained under `initial/`. The repeat waits for the
actual diagram SVG and title. Opening the host's embedded diagram URLs directly
did not settle within the 30-second wait, so no direct-view acceptance is claimed.
The corrected local phone-opening capture resets scroll before capture.
No Markdown-host screenshot establishes screen-reader or physical-phone acceptance.
