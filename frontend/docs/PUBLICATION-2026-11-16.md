# CARTAN public release — 16 November 2026

## Live-status correction

The canonical origin **https://cartan.danielwahnich.dev/** is live. Daniel added
the CNAME; exact alias assignment and certificate issuance succeeded. At
2026-11-16T13:18:46Z, 201 unauthenticated HTTP/TLS checks passed against the
original publication manifest, including all page/file hashes and media ranges.
See `qa/publication-2026-11-16/public-http-initial.json` and
`vercel-domain-live.json`. The DNS-blocked state below is historical, superseded
by this readback. Google Search Console authorization remains pending.

The subsequent stability/design refinement is recorded in
`../qa/REVIEW-STABILITY-2026-11-16.md`; the refinement is also live, with 212 fresh unauthenticated checks passing.
Consult that report for the current release and remaining browser-check limit.

## Historical pre-DNS snapshot


Status: Vercel deployment READY and qualified through authenticated HTTP. The
custom origin https://cartan.danielwahnich.dev/ is **not yet live**. GoDaddy has no
`cartan` CNAME, and custom-domain alias/certificate issuance failed while that
record was missing. A successful production promotion did not assign an alias;
the deployment API returned an empty alias list. Do not confuse promotion with
public DNS/TLS readiness.

## Implementation and authority

Daniel explicitly requested CARTAN's public subdomain and current SEO, superseding
the earlier local-only publication restriction. The original film, posters, brand,
working destinations and evidence labels are preserved. Hero playback remains
forward once, with static mobile/reduced-motion/Save-Data fallbacks. No soundtrack,
backend, generated media, analytics, private research publication or global
configuration changes were introduced.

Eight existing views now have real, prerendered paths: `/`, `/research/`,
`/laboratory/`, `/interruption/`, `/evidence/`, `/comparison/`, `/sources/`, `/vision/`.
Browser navigation retains the same document, updates metadata and preserves
Back and legacy hash links. Each path has unique title, description, canonical,
sharing metadata and truthful WebSite/WebPage/Person JSON-LD. Added robots,
sitemap, manifest, SVG favicon, an optional factual `llms.txt` reading guide,
real 404s and explicit response headers. No fabricated freshness, rich results,
rankings, institutional affiliations, hardware qualification or measured advantage.

The allowlisted package contains 28 files, 25,058,750 bytes. It excludes QA,
private notes, credentials, validators and historical films. All four supplied
media files, original logo and pinned synthetic fixture match their source bytes.
The full 19.48MB film remains opt-in; the hero is 4.04MB. No runtime dependencies.
The fixture is still v1 from `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`,
with unmeasured outcomes. Subsequent research is not silently imported.

## Hosting and DNS

- Existing Vercel team: `daniels-projects-ca65133a`.
- Independent project: `cartan`, `prj_yxSRyqClUe89HnLu7H2oQ39TPV5I`.
- Deployment: `dpl_Dr1MumBzm5f5nZZDtrTctgBM5uRP`.
- Deployment URL: https://cartan-kqu8pmbgq-daniels-projects-ca65133a.vercel.app/.
- This deployment hostname requires existing Vercel authentication; it is not a
  public deliverable URL. Alternate hosts carry noindex.
- Required GoDaddy CNAME: `cartan` → `272ba31a057624de.vercel-dns-016.com`.
- Existing nameservers: `ns07.domaincontrol.com`, `ns08.domaincontrol.com`.
- Domain attached to CARTAN and ownership verified; DNS remains misconfigured.
  No other project, DNS record, nameserver or mail setting was changed.

The original Nisayon release record and archived 19 September session confirm
Daniel added its CNAME after the session supplied the exact value. That record
does not provide a GoDaddy login/account-switching procedure. Current browser
inventory reports “browser access host is unavailable”; repeated native Chrome
and Safari selection times out. GoDaddy was previously observed at sign-in.
No credentials were extracted, no login terms accepted and no DNS edit claimed.

## Checks actually run

- 19 Node tests pass: adapters, immutable contract, media state machine and URL
  mapping/legacy links. JavaScript syntax check passes.
- 301 package assertions pass: unique metadata, visible static content and
  semantic headings, exact sitemap/allowlist, original bytes, structured-data
  CSP hashes, no private artifacts and bounded total bytes.
- 143 authenticated deployed HTTP checks pass: all eight pages, all 27 non-404
  public files match local hashes, module MIME, CSP/nosniff/noindex, canonical
  redirects, genuine 404 for unknown/private/QA paths and video byte-range support.
  An additional video range request returned 206 and exactly matched the first
  1,024 source bytes. These checks do not prove unauthenticated custom-domain access.
- Earlier hero review at `de81efb` includes Safari playback to 19s, keyboard/focus,
  reduced-motion fixtures, 4 viewport sizes and conservative contrast bounds.
  Its exact scope and remaining device/accessibility/performance limits remain in
  `qa/REVIEW-REVISED-HERO-2026-11-16.md`.
- Fresh browser checks of real-path navigation, CSP execution, desktop/mobile
  rendering and metadata transitions are **not completed**: browser connection
  failure. No fresh Core Web Vitals or screen-reader conformance claim.

Google Search Console's existing ADC refresh returned HTTP 400 `invalid_rapt`.
The separate existing Google CLI session could authenticate but Search Console
returned HTTP 403 for insufficient scopes. No OAuth permissions were expanded,
no property or sitemap was submitted, and indexing was not claimed. The retained
`release/search_console.py` requires canonical public HTML and verified domain
owner access before submission. Renew the existing authorized Search Console
connection through the normal user authentication flow; never store credentials
in the repository or release artifact.

## Next action

Restore browser control and add only the CNAME above in the correct GoDaddy
account. Verify authoritative DNS, retry the exact CARTAN alias assignment,
verify public TLS plus all canonical URLs and bytes without authentication, then
submit the sitemap once through the renewed existing Google owner connection.
Re-run the pending visible-browser route/accessibility checks. This is a bounded
manual release, not recurring deployment or a new model session.

Build and check instructions are in `frontend/README.md`. Retained receipts are
under `frontend/qa/publication-2026-11-16/`. Architecture and current primary-source
references are in `ADR-UI-003-publication-seo.md`.
