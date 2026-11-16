# CARTAN setup comparison and capability acceptance

**Subsequent operator correction:** Daniel explicitly required full-access/YOLO
launches. The launcher now uses the same approval/sandbox/hook-trust bypass flags
and live search as the inspected Sentinel/Nisayon Codex paths; Claude uses
permission bypass and disables its sandbox. See current `SESSION_HANDOFF.md`.
Statements below about retained approvals, shell sandbox network denial and
cached-search configuration describe the earlier comparison and are superseded.
Actual scientific retrieval, browser operation and inference remain separate
runtime observations; full permissions do not prove those outcomes.

Reviewed 16 November 2026 by the existing setup session, against the actual local
launchers described in `ENVIRONMENT-AUDIT.md` and the two retained CARTAN prompts.

**Verdict:** CARTAN improves launch consistency, input provenance, separation of
the two worktrees, and control of inherited services. It does not yet exceed
Nisayon in automated continuity, and it has not demonstrated a complete live
research-to-UI workflow. It is a tested environment foundation for the next
sessions, not a certified autonomous system or a validated scientific product.
No comparative productivity, recovery-rate or research-quality benchmark has
been run. “State of the art” is an ambition, not a measured result of this audit.

## Comparison with the established environments

| Dimension | Inspected prior practice | CARTAN evidence and assessment |
|---|---|---|
| Actual command routing | Sentinel's richer shell preflight is not on its actual launch path; portfolio singular/plural commands select different permission modes | Four names resolve to one canonical launcher with the same semantics. Checked from a fresh login shell outside the repository. Improvement in consistency |
| Project identity | Nisayon validates marker/common Git identity; Etzio validates root/origin/instructions; Reiyah preflight can initialize a repository | Exact canonical root, common Git directory, lane branch, remote policy and required files checked without bootstrap. Comparable strong identity with explicit lane ownership |
| Input provenance | Existing projects retain context/handoffs but use different entry conventions | Twelve original packet inputs are hash-bound, external, and checked on every launch; source accuracy and missing originals remain research work. Stronger setup reproducibility, not proof of scientific validity |
| Concurrent sessions | Established commands normally allow multiple terminals | The unsolicited CARTAN lane lock was a regression and is removed. Harmless-process tests pass while an old lock is held. Independent research/UI worktrees reduce shared-file collisions; same-lane terminals remain allowed |
| Resume and recovery | Etzio has a resume path; native clients offer session history; Nisayon has richer checkpoint discovery | Added `cartancodes [ui] resume` and Claude equivalent. Installed parsers accept the constructed commands; no actual session was resumed. Recovery instructions and a checkpoint template are available |
| Memory and compaction | Nisayon provides memory search/start tools and mechanical SessionStart/PreCompact/Stop/SessionEnd snapshots | CARTAN has source-bound branch-local notes and explicit checkpoints, plus native conversation history. No custom automatic checkpoints or memory MCP. Behind Nisayon in automation; no claim of lossless recovery |
| Service scope and credentials | Several launchers inherit broad services, bypass flags and sometimes sibling directories | CARTAN filters inherited key/injection variables, leaves credentials in existing stores, disables unrelated configured services and preserves lifecycle hooks. Read access and browser/account capabilities can still exceed task authority |
| Research access | Sentinel/Nisayon explicitly request live search; some sibling bridges reach project/cloud services | CARTAN configures OpenAI docs and retains Codex runtime adapters. It does not explicitly enable live search. With current workspace settings, documented default is cached search; effective live tool access must be observed. This is a capability gap for current source retrieval, not something the docs MCP fills |
| Reproducibility and maintenance | Nisayon pins its environment with `uv`; other launchers depend on shell functions or bootstrap | CARTAN uses Python standard library and audited client versions with drift checks. Absolute Mac paths, inherited model/effort and plugin versions remain machine dependencies. It is not a fully pinned portable environment |
| Continuous operation | Some siblings suppress approvals; Nisayon has richer task/memory machinery | CARTAN preserves approvals and has no scheduler, retry daemon or automatic paid work. Native clients can continue authorized tasks within a session. Unattended operation across crashes, quota limits and context loss is not established |

## Changes made during this evaluation

- Added native resume pickers to all four installed command names. Start remains
  the default, including when another terminal is open. Resume supplies the same
  launch policy, does not select an arbitrary latest conversation, and does not
  inject the new-session research prompt into an existing conversation.
- New sessions now receive absolute paths to canonical current setup notes and
  the operating guide. Active lanes can keep their older setup snapshot without
  being silently rewritten. Existing conversations must read the current notes;
  this update does not change their loaded instructions automatically.
- Corrected the plan report: Claude declares only the documentation MCP, whereas
  Codex retains documentation plus Node/CUA adapters. The previous shared report
  overstated Claude's configured tool set.
- Added recovery, meaningful-checkpoint, source-provenance and upgrade procedures
  in `SESSION-OPERATIONS.md`. These are documented working practices, not claims
  that a new hook, scientific validator or automation service was installed.
- Expanded the regression suite to 30 passing tests. No security policy, hook,
  network configuration, model selection, active worktree or sibling project was
  changed. No model session or paid job was started.

## What the next sessions can actually use

| Need | Available or configured | Verified boundary / remaining work |
|---|---|---|
| Local reasoning and project edits | Installed Codex 0.169.0, stored ChatGPT login; separate worktrees and assigned prompts | Offline preflight and local dispatch tested. Remote inference, entitlement/quota and interactive trust flows not tested by setup |
| Claude alternative | Installed Claude 2.1.302; strict project docs MCP and manual/sandbox settings | Local authentication absent. Settings/flags parse; live sandbox and MCP discovery require the user's authenticated session |
| Public OpenAI documentation | `openaiDeveloperDocs`, no credential supplied | Direct HTTP initialization and `tools/list` from this Mac returned 200 with five tools. An earlier existing-session read-only tool call succeeded. This does not prove the future CLI's tool discovery |
| Scientific source discovery | Existing client web capabilities when offered/authorized; original audited packet locally available | No spacecraft-literature MCP attached. Source search, full text, versions and page-level methods must be checked in the actual session. Restricted sources and complete historical archive remain missing |
| PDF intake | Installed text/rendering utilities, original PDFs and verified hashes | Text extraction performed earlier. No broad visual/figure interpretation or full-paper recovery claimed |
| UI browser work | Codex `node_repl` and plugin-provided `cua_repl` retained with cleanup dependencies | Offline native MCP registry contains them. Live bridge, browser permission, screenshots and owned-page interaction untested. Claude has no CARTAN browser MCP configured |
| Build, simulation and UI QA | No implementation stack selected during setup | Research must choose/pin justified dependencies and falsification tests; UI must select/measure its rendering and accessibility tests. No build, simulation, browser-performance or physical-device pass exists yet |
| Durable continuity | Git worktrees, native resume, source-bound Markdown notes and checkpoint procedure | Native resume argument parsing tested, actual restoration untested. Checkpoints are agent-written; no automatic crash/compaction capture, shared-memory index or scheduled continuation |

### Research retrieval design

Use primary provider interfaces and retained source artifacts before considering
another MCP package. NASA documents a public NTRS OpenAPI for its technical
records; Crossref offers a public metadata API without sign-up. Metadata is a
discovery aid and does not substitute for reading methods or obtaining full-text
rights. arXiv API use also has provider terms and rate limits. Documentation was
checked for this review; no collector, new account or new connector was installed.
These endpoints have not been exercised from a CARTAN model session.

Sources checked 16 November 2026:

- [NASA STI public retrieval guidance](https://www.sti.nasa.gov/harvesting-data-from-ntrs/)
  and [NTRS API schema](https://ntrs.nasa.gov/api/openapi/).
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/).
- [arXiv API terms](https://info.arxiv.org/help/api/tou.html).
- [Codex security and web-search controls](https://learn.chatgpt.com/docs/agent-approvals-security).
  The same-day official manual describes cached search as the normal default for
  this sandbox mode. Shell network denial, hosted search and MCP transport are
  separate controls. Installed CLI help was checked for supported launch/resume
  flags; no live-search setting was silently enabled.

For each retained paper, the research lane should capture exact identifier and
version, canonical URL, access date, artifact hash, relevant methods/pages,
licence/access limitation and claim/counterevidence links. Repeated retrieval
should reuse those retained artifacts. A future research adapter is justified
only by a measured retrieval gap and an explicit read-only tool/credential scope.
More attached servers alone do not establish better coverage or more rigor.

## Remaining acceptance work and owners

1. **First actual Codex session — Daniel and the owning lane:** inspect live cwd,
   instructions, status and tool discovery; perform one relevant read-only docs
   and source retrieval. This is the missing runtime observation, not a reason to
   stop independent local analysis. Setup will not start the session for Daniel.
2. **Claude — Daniel, if he chooses this client:** complete ordinary login, repeat
   preflight, then inspect native MCP, permission and sandbox status. No credential
   should be pasted into a project file or handed to the other client.
3. **Research access — research identifies the exact need; setup owns any change:**
   establish whether native tools can retrieve current primary sources. If not,
   propose the narrow missing web/API access. No network or approval control is
   changed by this review. Institutional affiliation, paid access and cloud budgets
   are not inferred from a connection.
4. **Continuity — each lane:** make and actually recover one meaningful checkpoint
   in normal work. If automatic metadata snapshots are needed, specify their
   contents, trigger, collision behavior, retention and recovery test before adding
   a hook. Never copy Nisayon's product memory implementation into CARTAN.
5. **UI runtime — UI lane:** demonstrate browser bridge operation on its own page,
   then perform accessibility, context-loss, repeated-entry and bounded performance
   checks against the selected implementation and actual devices. A tool listing
   cannot prove any of those outcomes.
6. **Research/product architecture — research, with UI consuming v1:** finish source
   recovery, scientific alternatives and decision record, versioned contract,
   competent baselines and a bounded reproducible protocol before implementation
   claims. No runtime framework was selected as a substitute for that work.
7. **Repository/compute policy — Daniel with setup:** remote/visibility and paid
   resource budgets remain undecided. Normal permitted project work can proceed
   without inventing those decisions or installing cloud machinery.

The relevant success measure is a recoverable, reproducible research result and
an honestly tested UI using its evidence contract. Until those observations exist,
the strongest defensible claim is a materially improved local foundation with
explicitly recorded gaps.
