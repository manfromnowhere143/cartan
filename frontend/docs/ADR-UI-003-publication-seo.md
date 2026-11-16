# ADR UI 003 — public origin and crawlable cinematic interface

16 November 2026, recorded before implementation. Daniel explicitly requests
publication at the CARTAN subdomain and current SEO, superseding earlier local-only
scope. Same-repository UI ownership remains; setup configuration and sibling sites
remain untouched. Existing provider evidence: Nisayon/Reiyah use Vercel projects,
Sentinel/Telos/Inbar use the portfolio's Vercel project; GoDaddy owns DNS and Google
Search Console owns search reporting. Choose an independent CARTAN Vercel static
project in the existing team, one CNAME for cartan.danielwahnich.dev, managed TLS,
and the existing Google domain owner's URL-prefix property. No new Google runtime,
billing account, purchase, agent, repository remote or recurring job.

Keep the cinematic one-document navigation in the browser. Replace hash-only
routes with eight real paths; generate initial HTML for each active view with its
own canonical, title, description, sharing tags and factual JSON-LD. Legacy hashes
continue to resolve. Static initial HTML and real anchors make every view usable
without executing JavaScript. No crawler-specific content or keyword stuffing.
Alternatives: a single indexable root leaves useful research undiscoverable;
adding a framework/server introduces unjustified operational work. A small
standard-library packaging step is enough.

Publish an allowlisted artifact only: eight pages, true 404, robots, sitemap,
manifest/icons/sharing image derived from the existing identity, runtime modules,
current concept images/films and the exact pinned v1 synthetic fixture. Exclude QA,
source contracts/validators, notes, local paths, raw source packets and old films.
No research results are promoted by SEO. Structured data is WebSite/WebPage/Person
and truthful research subject descriptions, without ratings, product offers,
flight validation, institutional affiliations or invented publication dates.

Security/performance: managed HTTPS, no-store/revalidation for HTML and mutable
runtime, bounded caching for exact supplied media, CSP with JSON-LD hashes, real
404, noindex on noncanonical deployment hosts, canonical links to the custom origin, no trackers.
Media remains forward-only once with exclusions. Retain source hashes and public
readback checks. Resource ceiling: dependency-free static build, one local preview
if needed, one Vercel release candidate, no cloud compute workers. No claim of SEO
superiority, indexing, ranking, Core Web Vitals or universal accessibility without
measurement. Current Google guidance says ordinary SEO also applies to AI Search.

Reject publication for broken destinations, noncanonical/inconsistent metadata,
missing static view content, exposed private artifacts, incorrect concept/evidence
claims, video-policy regressions or failed asset readback. DNS/SSL propagation and
Google indexing are external states to observe honestly, never infer from submit.


Primary guidance checked on 16 November 2026:

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): useful content, descriptive titles and crawlable links; no ranking promises.
- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): initial HTML, meaningful URLs and accessible resources.
- [Google AI Search features](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO applies; no special AI file or schema requirement. `llms.txt` is only an optional reading guide.
- [Google structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) and [site names](https://developers.google.com/search/docs/appearance/site-names): accurate visible content and stable site identity, without eligibility or rich-result guarantees.
- [Google sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical URLs; omit dates rather than invent freshness.
- [Vercel Build Output API configuration](https://vercel.com/docs/build-output-api/configuration): explicit routes, status codes and headers for a dependency-free static artifact.
