# GitHub publication

16 November 2026. Daniel instructed research to choose the license and complete
publication. That instruction resolves the pending choices in
[release preparation](RELEASE-PREPARATION.md) and [ADR 005](../research/decisions/ADR-005.md).
The selected destination is the public repository `manfromnowhere143/cartan`.
Apache-2.0 covers original CARTAN code and research material; supplied media and
third-party works retain separate rights under [LICENSING.md](../LICENSING.md).

The candidate preserves the integrated research and UI histories. It does not
publish the setup or UI branch tips separately or alter their worktrees. The
public branch is `main`, pushed from the reviewed research commit
without rewriting history. The local research branch remains `research/architecture`.
Only this repository's remote configuration changes; global Git, shell, MCP and
launch configuration remain owned by setup.

The research and UI implementation already passed the checks recorded in
[integration QA](qa/integration-20261116/REVIEW.md). This publication adds licensing
and documentation. It leaves model code, frozen inputs, contracts, evidence and
frontend files unchanged. The additional checks cover license provenance, local
links, unchanged diagram sources, file preservation, reachable history and commit
identity. No paid job, new model session, dependency installation or physical action
is required. External actions are bounded to repository creation, a normal push,
repository metadata and read-only verification.

## Verified publication

[CARTAN on GitHub](https://github.com/manfromnowhere143/cartan) is public.
The first published commit is
[`c69b677cb120f2173e6b1a6af60e4f67b68783fe`](https://github.com/manfromnowhere143/cartan/commit/c69b677cb120f2173e6b1a6af60e4f67b68783fe).
The default branch is `main`. GitHub reports Apache-2.0; the downloaded license
and README match the reviewed local bytes. The
[API receipt](qa/publication-20261116/initial-remote-readback.json) records those
checks. A later documentation commit retains the receipts and continuation record.

An anonymous request returned HTTP 200. The served README contains the expected
eight headings, license links and all three unchanged Mermaid source blocks.
The [HTTP receipt](qa/publication-20261116/anonymous-http-readback.json) records
that check. Browser-host access was unavailable and the native-browser attempt
timed out, so no live visual rendering claim is made. The diagrams retain their
prior local render and visual checks.

The [history review](qa/publication-20261116/release-history-audit.json) covers the
exact first publication head: 224 UTF-8 blobs scanned among 239 reachable blobs,
with no declared credential-pattern or commit-metadata finding. Binary assets
remain outside text scanning. The [preservation check](qa/publication-20261116/prepublication-checks.json)
confirms 140 implementation, evidence and setup-owned files remained identical
through licensing. Original source papers remain outside Git.

Publication does not change the evidence level. Physical recovery, comparative
advantage and flight validation remain unproven. The next scientific priority is
one identified interface's calibrated observation chain and reviewed limits.
