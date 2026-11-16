# Research verification checkpoint

Owner: research. Branch: `research/architecture`. Recorded 16 November 2026,
10:15 UTC. Status: first research/architecture/software-verification block complete;
physical and comparative questions remain open. Memory is a discovery aid, not
independent evidence.

## Stable artifacts

- `191b4be103734cd71441623214df8c21f51c5b77`: current-state audit, primary-source
  and claim ledger, ADR 001, mission assumptions, state/guard specification and
  pre-execution protocol.
- `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`: frozen contract-only v1 and conspicuous
  synthetic UI fixture. See the separate contract checkpoint for the manifest.
- `aee96ea4781a636da86b6367b541e10acfa55729`: backend model, observation/guard boundary,
  truth scorer, bounded runner, predeclared cases and unit checks. Also records
  the contract handoff checkpoint.
- `e1623514747ccbef9b1179a8277f85e29dbefe9f`: full outcomes, deterministic replay,
  verification receipt, [results](../../research/results.md) and
  [first-study design](../../research/experiments/first-study.md).

The research files explain source revisions, actual reading scope and gaps.
V3 governs the next scientific step. The complete Gemini transcript, restricted
manuals and other unavailable originals were not recovered. Broad novelty and
physical advantage remain unestablished. No remote is configured or publication
attempted. Commit author/committer and full messages through the evidence commit
were inspected: Daniel's configured identity, without model attribution trailers.

## Checks actually executed

15/15 scripted cases met frozen expectations; 27/27 sensitivity points matched
the declared analytic flow/guard; 12 unit tests passed. The fixture validator
rejected 16 negative controls and accepted valid zero/false. The executed model
bundle passed the same frozen v1 schema and semantic checks. One second runner
invocation reproduced byte-identical core records with identical input/config
hashes. Both output manifests were verified. All 12 original packet files still
match byte counts and SHA-256; frozen contract bytes match the handoff manifest.
Local research/backend Markdown links resolved and whitespace checks passed.

These are not 15 safe physical exchanges. Five deliberately hazardous controls
were detected, including a false-positive report plus partial actuation. One
unsafe run completes but remains unacceptable. Six runs end in modeled safe abort.
Unexpected contact blocks motion without earning safe-abort status. All physical
load, mission-risk and cost claims remain unmeasured; unrecoverability is unknown.
The safe-abort code adds a clear-contact condition omitted from the specification's
short outcome description; results retain this discrepancy for a successor version.
No tests failed; no held-out, human, physical or comparator experiment was run.

## Resources and operational limits

One worker, five CPU seconds per runner invocation, capped case/command counts.
Observed runner CPU time <0.009 s, peak RSS <24 MiB; 862,926 bytes for the two initial
output directories. Scratch allocation was 22,176 KiB when inspected. macOS refused
the requested 256 MiB address-space cap; enforcement is not claimed. Earlier
sandbox-limited inspection/Git operations succeeded only through approved retries.
Pillow absence was handled by inspecting individual rendered PDF pages, with no
dependency install. A standards landing-page retrieval failed and yielded no
adopted requirement. No paid/cloud compute, server, hardware action or new model
session was launched. Reproducible commands and exact input hashes are retained
in the backend README and verification receipt.

## Ownership, UI handoff and resumption

Research owns this worktree, scientific contracts and backend. Setup still owns
launchers, global shell/MCP, `scripts/`, `config/`, `.codex/`, `.claude/` and setup
configuration. Root manifest integration ownership has not been handed over. UI
was read-only inspected after execution: clean at `f0d2767`, with no consumption
verified. No UI worktree edits, session attachments or interruptions occurred.

The stable v1 contract and the real **model-only** evidence are available via the
commits above. UI may read them with `git show` from its own worktree; it must keep
the synthetic fixture and model traces distinct and display their limitations.
No live UI notification or integration is claimed. Do not silently modify v1 or
any retained evidence. Future physical endpoints require a reviewed successor.

Recommendation: **narrow and continue inexpensive desk observability work**.
Next highest-value question: can a documented interface produce a reachable,
decision-relevant partial/full retention ambiguity despite ordinary sensing,
interlocks and competent recovery? Select/recover one interface revision and
isolation circuit, then follow Stage 1 of the first-study design. Missing owner
requirements and qualified limits block physical/comparative conclusions, not
bounded desk research. Prefer B0/N or a simpler B2 solution if it meets the actual
need. Stop the extra-controller branch if its supposed gain disappears under
equal information. No hardware procurement or operation follows from this note.
