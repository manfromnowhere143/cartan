# CARTAN ownership and two-session protocol

Multiple terminal sessions are allowed, including the same lane. The launcher
does not enforce one-session-per-worktree. Coordinate disjoint file ownership or
use separate worktrees for concurrent edits; opening a session is not itself a
write conflict. The canonical launcher can be updated by setup without rewriting
the launcher snapshot inside an active worktree.

The current environment-setup session owns launch configuration until an explicit
handoff. Daniel alone starts the two future sessions. Neither session may launch
the other, attach to it, interrupt it, or edit its checkout.

| Area | Owner | Working location |
|---|---|---|
| Launchers, installation, MCP, security defaults, setup verification | Setup | `~/workspace/cartan`, branch `setup/environment` |
| Research, assumptions, methods, claims, backend/model, evidence, scientific tests | Research session | `~/workspace/cartan-worktrees/research`, branch `research/architecture` |
| UI, content presentation, scenes, interaction, frontend tests and QA | UI session | `~/workspace/cartan-worktrees/ui`, branch `ui/visual-laboratory` |
| `contracts/cartan/v1/` and canonical fixture | Research session | Research branch; publish a commit and hash manifest before consumption |
| Root manifests, root lockfiles, shared routing/configuration | Research session as integration owner after setup handoff | Changes proposed in the owning branch; one writer |

Both lanes begin at the same environment commit. They share Git objects, not
working files. Do not reset, stash, clean, checkout or install dependencies in
another lane. Worktree separation prevents accidental shared-file edits; it is
not a security boundary against a process with broad OS access.

The research session must specify Component, Claim, Scenario, Run and Asset
contracts after reading the sources. Setup deliberately supplies no scientific
schema. UI may use a frontend-local, conspicuously synthetic adapter while v1 is
pending. It must not create a competing authoritative contract. Preserve units,
source references, evidence classes and unknown states.

Contract handoff: research records its source commit and SHA-256 file manifest,
schema version, fixture mode, limitations and validator command in a unique
`memory/checkpoints/research-<UTC>-contract-v1.md`. UI reads the committed files
with `git show <commit>:<path>` or asks the integration owner to merge a reviewed
contract-only commit; it never reads mutable files from the research worktree as
live evidence. Do not silently update a frozen contract; breaking changes need
v2 and an explicit adapter. Stable v1 delivery is a dependency, not a fabricated
completion state.

Before implementation, each lane records its research/architecture decision and
proposed dependency boundary. Prefer `backend/` and `frontend/` independent
manifests if those stacks are justified. No root package manager or lockfile is
selected during setup. UI submits shared-config changes as proposals under its
own `memory/checkpoints/`; research integrates them. Setup configuration changes
remain reserved even after product integration begins.

Shared inputs: exact outside-repository paths and hashes in `config/inputs.json`.
Treat them as read-only; no `--add-dir` write grant is attached. The original
files remain writable by Daniel at the OS level. Hash checking detects drift;
it does not implement ACL protection or prove the source's scientific accuracy.

At the end of a block, append a unique checkpoint with owner, branch, commit,
changed files, tests and outcomes, missing evidence, unresolved dependencies and
next step. Use source-bound notes; do not edit another lane's checkpoint. Git
merges reconcile branch-local memory. No daemon, shared mutable memory database,
cross-project automation or hook-generated scientific summary is needed.
