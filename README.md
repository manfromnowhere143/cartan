# CARTAN

CARTAN is a research program for robotic spacecraft maintenance. Its first
investigation asks what a servicing system can establish about a prepared module
after an exchange is interrupted, and what evidence is needed before it moves again.

The long-term aim is spacecraft and orbital infrastructure that can be repaired,
upgraded and reconfigured. The research begins with interrupted exchange of a prepared module. The current
case isolates mechanical retention with external support present. Electrical
isolation remains a separate research question; neither retention nor an
acknowledgement authorizes disconnection.

This repository contains research specifications, executable models and retained
software studies. It does not yet establish physical recovery performance or
flight capability. The current results support a careful observation model and
show where simpler methods already give the same answer.

[Research record](research/README.md) ·
[Latest decision](research/decisions/RETENTION-2026-11-23.md) ·
[Evidence admission](research/experiments/retention-evidence-admission.md) ·
[Continue the work](docs/SESSION_HANDOFF.md)

## Current position — 23 November 2026

The newest offline case constructs two feasible histories with the same ordinary
observations and opposite retention states. An independent checker confirms the
pair. It also confirms that ordinary retry completes capture in both branches;
a supported park completes abort. **The baseline is sufficient in this synthetic
case.** Ambiguity alone does not establish a useful role for a new observer.

Physical decision relevance remains unresolved. The next milestone is one
revision-specific archival record with independent retention evidence, complete
operator history, applicable restart/interlock behavior and owner-backed limits.
The [REA-1 protocol](research/experiments/retention-evidence-admission.md) defines
what that record must establish and how ordinary recovery can refute the proposed
gap. The existing models are independently checkable software studies, not a
physical prototype or flight-qualified control system.

## The interrupted exchange

A capture request is acknowledged. The operation stops before completion is
independently established. The module might be retained, partially captured, or
supported only by the servicing device. Repeating a command may help, change the
state, or leave the same uncertainty. Releasing support and separating electrical
contacts require evidence about different physical conditions.

The controller's report is one part of that evidence. A drivetrain position needs
a justified relationship to engagement; engagement needs a qualified relationship
to load capacity. A voltage reading refers to a particular terminal pair and time.
It cannot by itself establish that every source is disconnected.

The model therefore keeps six propositions distinct.

```mermaid
---
config:
  theme: base
  look: classic
  fontFamily: Arial
  themeVariables:
    fontFamily: Arial
    fontSize: 16px
    primaryColor: "#eef3f7"
    primaryTextColor: "#172b3a"
    primaryBorderColor: "#607787"
    lineColor: "#607787"
    clusterBkg: "#f8fafc"
    clusterBorder: "#c6d1da"
    edgeLabelBackground: "#ffffff"
  flowchart:
    curve: linear
    nodeSpacing: 26
    rankSpacing: 34
    padding: 12
    htmlLabels: true
---
flowchart TB
    accTitle: Evidence separates six physical propositions
    accDescr: Mechanical retention and support, contact and controller state, isolation and voltage remain distinct. Reports constrain possible states only through justified observation mappings. Action assessment is separate from bounded recovery.
    subgraph FACTS["Physical propositions"]
      M["Retention · support"]
      C["Contact · controller"]
      E["Isolation · voltage"]
    end
    M --> B["Possible states<br/>under declared assumptions"]
    C --> B
    E --> B
    R["Reports and commands<br/>Identity · acquisition time · reset epoch"] --> I["Justified observation mapping<br/>ACK alone binds no physical fact"]
    I --> B
    B --> A["Action assessment<br/>Admissible · refuted · unresolved"]
    B --> X["Empty consistency<br/>Inconsistent; no permission"]
    classDef model fill:#eef3f7,stroke:#607787,color:#172b3a,stroke-width:1.4px;
    classDef evidence fill:#e9f4ef,stroke:#417563,color:#183e32,stroke-width:1.6px;
    classDef open fill:#fff4e5,stroke:#a67532,color:#5f3d13,stroke-width:1.4px;
    classDef future fill:#f6f8fa,stroke:#788894,color:#334b5b,stroke-dasharray:5 4;
    class M,C,E,I model;
    class R,B,A evidence;
    class X open;
```

[Full-size diagram](docs/qa/readme-20261123/diagram-1.svg) · [PNG](docs/qa/readme-20261123/diagram-1.png)

The central hypothesis is that explicit uncertainty can improve recovery when
ordinary sensing, interlocks and competent procedures leave a consequential
ambiguity. The first obligation is to establish that such an ambiguity exists.
An inexpensive sensor, a passive interlock, an operator procedure or a conventional
state machine may resolve it more effectively.

## Architecture

Physical truth, observations, commands and inferred belief have separate roles.
Missing, unknown, unmeasured and null values remain distinct from known zero or
false. Each study records its assumptions and keeps the attempted cases, including
contradictions and failures.

Five offline research paths currently address separate questions. The abstract exchange model
exercises guarded transitions and separate truth scoring. The certificate module
examines bounded report errors, set intersections and a scalar electrical envelope.
The interface evaluator checks declared actions over possible logical worlds.
The observation module calculates conditional voltage bounds and source
connectivity. The retention fixture constructs complete histories and checks
bounded recovery with a distinct enumerator. They remain separate studies; there
is no combined runtime recovery controller or actuator connection.

```mermaid
---
config:
  theme: base
  look: classic
  fontFamily: Arial
  themeVariables:
    fontFamily: Arial
    fontSize: 16px
    primaryColor: "#eef3f7"
    primaryTextColor: "#172b3a"
    primaryBorderColor: "#607787"
    lineColor: "#607787"
    clusterBkg: "#f8fafc"
    clusterBorder: "#c6d1da"
    edgeLabelBackground: "#ffffff"
  flowchart:
    curve: linear
    nodeSpacing: 26
    rankSpacing: 34
    padding: 12
    htmlLabels: true
---
flowchart TB
    accTitle: Five offline research paths and a separate presentation contract
    accDescr: Sources and frozen assumptions feed separate exchange, certificate, interface, observation and retention studies. Independent checks support scoped results. The visual laboratory consumes only frozen synthetic contract v1; newer study adapters are not implemented.
    A["Sources · assumptions · frozen inputs"]
    A --> B["Exchange / certificates / interface<br/>Guarded state · report errors · logical worlds"]
    A --> O["Observation model<br/>Voltage inversion · source connectivity"]
    A --> R["Retention case / SYN-RC-1<br/>Complete histories · bounded recovery"]
    B --> E["Scoped results and retained records<br/>Truth scoring · conventional references · hashes"]
    O --> E
    R --> K["Distinct checker<br/>Independent trace enumeration"]
    K --> E
    E --> D["Research decision<br/>Claim · limitation · next evidence"]
    V["Presentation / frozen v1<br/>Synthetic fixture and hashes pinned"] --> U["Visual laboratory<br/>Concept illustration; no physical evidence"]
    D -. "New-study adapter remains proposed" .-> U
    classDef model fill:#eef3f7,stroke:#607787,color:#172b3a,stroke-width:1.4px;
    classDef evidence fill:#e9f4ef,stroke:#417563,color:#183e32,stroke-width:1.6px;
    classDef open fill:#fff4e5,stroke:#a67532,color:#5f3d13,stroke-width:1.4px;
    classDef future fill:#f6f8fa,stroke:#788894,color:#334b5b,stroke-dasharray:5 4;
    class A,B,O,R,V model;
    class K,E,D evidence;
    class U model;
```

[Full-size diagram](docs/qa/readme-20261123/diagram-2.svg) · [PNG](docs/qa/readme-20261123/diagram-2.png)

The interface evaluator returns admissible when every remaining world satisfies
an action's declared predicate, refuted when none does, and unresolved when both
possibilities remain. An empty set is inconsistent. Mixed results include a witness
for each possibility, so a reader can inspect why the decision remains open.

A decision can be justified within a model without identifying every variable.
A consistent belief can also be wrong if its assumptions exclude reality.
The current models always retain physical authorization as not assessed.

The observation module now identifies the quantity, sensing point, acquisition
time and assumed uncertainty behind a reading. Its voltage calculation includes
gain, bias, residual error and change between acquisition and decision. A separate
graph calculation checks alternate source paths. It preserves missing calibration
and incomplete source inventories as unresolved conditions.

The [interface dossier](backend/observation_model/interface-profile.json) uses
public design information to identify the remaining physical obligations. The
[latest source review](research/block-4/sources.md) distinguishes documented
relationships from unverified calibration, fault coverage and current hardware
applicability. No numerical cam profile or qualified retention limit is supplied
by the software.

## Findings

The first four studies were completed on 16 November 2026 and rechecked on
23 November. The retention case and evidence-admission review followed on
23 November. These are disclosed software checks, not physical trials or
reliability samples.

The [abstract exchange study](research/results.md) retained 15 scenarios and 27
toy sensitivity points. Its separate scorer detected five deliberately hazardous
cases. Completing the task did not erase an earlier hazard.

The [equal-information study](research/block-2/results.md) compared simple counting
with an explicit observer over 42 histories and 186 prefixes. They agreed throughout.
The proposed observer had no algorithmic advantage in that bounded-error binary
problem. That result shifted the priority toward the meaning and sufficiency of
observations before increasing planner complexity.

The [conditional certificate study](research/block-2/mathematics.md) checked six
interval cases and nine normalized electrical envelopes. Zero overlap volume did
not imply disjoint sets. Under an allowed backfeed floor, waiting alone could not
produce a finite voltage-limit certificate. Those bounds were assumed model
parameters, not measured circuit values or operational waiting instructions.

The [interface study](research/block-3/results.md) retained 21 cases, 256 complete
world/action comparisons and 11 boundary tests. It preserved separate interface
facts, acquisition identity, stale-data exclusions and unresolved or inconsistent
outcomes. Its simplified predicates still omit physical conditions needed for
real action.

The [observation study](research/block-4/results.md) retained 34 cases and passed
11 boundary tests. Eight numerical voltage cases matched a conventional exact
calculation; 269 topology assignments matched an independent reference. Possible
backfeed and incomplete source inventories prevented unwarranted isolation
conclusions. These are constructed checks of the model, not observed vendor faults.

The [interrupted-retention case](research/decisions/RETENTION-2026-11-23.md),
SYN-RC-1, adds four complete synthetic histories and seven controls. A distinct
checker agrees with the finite-horizon enumeration; eight corrupted outputs
are rejected, and replay bytes match. The controls cover interlocks, stale reset
reads, misleading marginal overlap, common safe actions, useful sensing and a
short deadline with no certified continuation. No physical fault rate, sensor
calibration or operational deadline is inferred.

```mermaid
---
config:
  theme: base
  look: classic
  fontFamily: Arial
  themeVariables:
    fontFamily: Arial
    fontSize: 16px
    primaryColor: "#eef3f7"
    primaryTextColor: "#172b3a"
    primaryBorderColor: "#607787"
    lineColor: "#607787"
    clusterBkg: "#f8fafc"
    clusterBorder: "#c6d1da"
    edgeLabelBackground: "#ffffff"
  flowchart:
    curve: linear
    nodeSpacing: 26
    rankSpacing: 34
    padding: 12
    htmlLabels: true
---
flowchart TB
    accTitle: The synthetic ambiguity survives but ordinary recovery succeeds
    accDescr: After interrupted capture and controller restart, two feasible complete histories share the same operator observations. One retains the payload and one does not. External support remains secured. The same retry completes capture in three modeled ticks including attestation; supported park completes abort in two. Neither permits real disconnection.
    H["Shared ordinary history<br/>Drive [0,1,1,1,1]<br/>Controller epoch 0 → 1"]
    H --> R["History A<br/>Retained"]
    H --> N["History B<br/>Not retained"]
    R --> S["Same information · same action<br/>External support stays secured"]
    N --> S
    S --> C["Ordinary retry + attestation<br/>Captured with support · 3 ticks"]
    S --> P["Supported park<br/>Terminal abort · 2 ticks"]
    C --> B["Baseline sufficient<br/>Synthetic case SYN-RC-1"]
    P --> B
    classDef model fill:#eef3f7,stroke:#607787,color:#172b3a,stroke-width:1.4px;
    classDef evidence fill:#e9f4ef,stroke:#417563,color:#183e32,stroke-width:1.6px;
    classDef open fill:#fff4e5,stroke:#a67532,color:#5f3d13,stroke-width:1.4px;
    classDef future fill:#f6f8fa,stroke:#788894,color:#334b5b,stroke-dasharray:5 4;
    class H,R,N,S model;
    class C,P,B evidence;
```

[Full-size diagram](docs/qa/readme-20261123/diagram-3.svg) · [PNG](docs/qa/readme-20261123/diagram-3.png)

Each study has an identical-core replay with matching input hashes. A replay
establishes repeatability of the recorded computation, not independent scientific
replication. Recovery time, safety benefit, mass, power and economic advantage
remain unmeasured. Hardware and flight validation are separate obligations.

## The next evidence gate

Review an existing archival packet for one identified interface revision against
[REA-1](research/experiments/retention-evidence-admission.md). Establish whether a
reachable, decision-relevant ambiguity survives ordinary sensing, interlocks and
recovery. Acquisition time, reset epoch, persistent bias and causal ordering must
hold jointly across the entire history. Marginal overlap or a shared display label
is insufficient. Missing documentation remains an access gap, not a hardware defect.

A qualified physical study would require independent reference instrumentation,
containment and owner-approved limits. None is authorized by this repository.
A dangerous baseline event is not required. If the existing procedure already
meets the task, retain that result and narrow the added inference work.

A surviving gap would justify the [recovery comparison](research/experiments/first-study.md).
B0 is an engineered interlocked state machine with bounded rereading, retries and
recovery. B1 is a trained operator using the reviewed procedure. B2 adds an
independent measurement or passive change. C is explicit possible-state recovery.
N retains support and holds or abandons the task within the agreed limits.
Algorithm comparisons receive the same information. Hardware changes carry their
full integration and lifecycle burden.

```mermaid
---
config:
  theme: base
  look: classic
  fontFamily: Arial
  themeVariables:
    fontFamily: Arial
    fontSize: 16px
    primaryColor: "#eef3f7"
    primaryTextColor: "#172b3a"
    primaryBorderColor: "#607787"
    lineColor: "#607787"
    clusterBkg: "#f8fafc"
    clusterBorder: "#c6d1da"
    edgeLabelBackground: "#ffffff"
  flowchart:
    curve: linear
    nodeSpacing: 26
    rankSpacing: 34
    padding: 12
    htmlLabels: true
---
flowchart TB
    accTitle: Progress from reproducible software to an admissible physical question
    accDescr: Completed software and source reviews lead to REA-1 evidence admission. Missing unit records currently block physical conclusions. Ordinary recovery is tested before a new model. A baseline-sufficient result is retained. A surviving useful gap could justify a reviewed finite abstraction and later physical validation; mission qualification remains separate.
    S["Completed software studies<br/>Checks and null results"] --> R["REA-1 completed<br/>Admission protocol"]
    R --> E["Missing physical record<br/>Independent reference + history<br/>Revision + procedure + limits"]
    E -. "Record admitted" .-> Q{"Ordinary recovery<br/>meets the task?"}
    Q -->|Yes| N["Retain the negative result<br/>Use the sufficient baseline"]
    Q -->|Useful gap verified| A["Conditional next step<br/>Finite model + fair comparison"]
    A -. "Separate physical authority" .-> P["Later evidence gates<br/>Ground validation → qualification"]
    classDef model fill:#eef3f7,stroke:#607787,color:#172b3a,stroke-width:1.4px;
    classDef evidence fill:#e9f4ef,stroke:#417563,color:#183e32,stroke-width:1.6px;
    classDef open fill:#fff4e5,stroke:#a67532,color:#5f3d13,stroke-width:1.4px;
    classDef future fill:#f6f8fa,stroke:#788894,color:#334b5b,stroke-dasharray:5 4;
    class S,R,N evidence;
    class E,Q open;
    class A,P future;
```

[Full-size diagram](docs/qa/readme-20261123/diagram-4.svg) · [PNG](docs/qa/readme-20261123/diagram-4.png)

Safety outcomes, verified recovery, safe aborts, unresolved cases, interventions,
elapsed time and system burden are measured separately. An abort remains in the
completion denominator. Active diagnostics require their own resulting trajectories;
one controller's observations cannot stand in for another controller's actions.

The [physical validation plan](research/block-4/specification.md) separates
calibration from validation conditions and includes acquisition timing, shared
causes, drift and the measurement's operating domain. Current unit documentation,
qualified physical relationships and owner-backed limits remain missing.
The [recovery source review](research/block-4/source-followup.md) identifies
existing interruption, counterpart-release and interoperability studies. Those
capabilities belong in the baseline; CARTAN has not established a novelty claim.
The [newer-method and archive review](research/experiments/retention-evidence-admission.md)
records relevant belief-space control and observation-aware verification methods,
their assumptions and the limits of the public datasets inspected. The
[roadmap](research/ROADMAP.md) identifies the evidence needed to proceed.

## Reproduction

The backend runs with Python 3.11+ and the standard library, without a service or
package installation. From the research checkout, use a new directory for each run.

```sh
run_dir=$(mktemp -d /private/tmp/cartan-replay-XXXXXX)
python3 -B backend/retention_case/enumerate_case.py > "$run_dir/retention.json"
python3 -B backend/retention_case/check_case.py "$run_dir/retention.json"
python3 -B backend/retention_case/enumerate_case.py > "$run_dir/retention-replay.json"
cmp "$run_dir/retention.json" "$run_dir/retention-replay.json"
python3 -B -m unittest discover -s backend/observation_model -v
```

Compare input hashes as well as core bytes. The summaries record resource use,
measurement scope and whether requested limits were supported. Earlier commands
remain in the [exchange](backend/README.md),
[certificate](backend/certificates/README.md) and
[interface](backend/interface_evidence/README.md) and
[retention](backend/retention_case/README.md) module documentation. The
[observation specification](research/block-4/specification.md) supplies its runner
and conventional-reference checks. Their
source and evidence remain frozen.

## Research record

The [initial audit](research/current-state.md) and [first source ledger](research/sources.md)
record the packet discrepancies. [Block 2](research/block-2/sources.md) and
[block 4](research/block-4/sources.md) recover additional primary material and
correct earlier access gaps. The review is targeted; it is not a claim of
exhaustive coverage or institutional endorsement.

Architecture decisions [001](research/decisions/ADR-001.md),
[002](research/decisions/ADR-002.md), [003](research/decisions/ADR-003.md) and
[004](research/decisions/ADR-004.md) precede their implementation blocks.
[Retained evidence](research/evidence/) includes full cases, witnesses,
input/output hashes and execution receipts. Memory helps locate those records;
it is not independent evidence.

The [visual laboratory](frontend/README.md) consumes the [frozen v1 contract](contracts/cartan/v1/README.md).
Its imagery illustrates a concept and its canonical fixture is synthetic. Newer
analytical studies require a reviewed adapter. The integrated
[spatial instrument](frontend/docs/ADR-UI-007-spatial-instrument.md) keeps the
prepared module, selected relationship and evidence context in one workspace.
Optional WebGL2 and a drawing fallback share the same unverified geometry.
The [evidence aperture](frontend/docs/ADR-UI-010-evidence-aperture.md) opens a
verified synthetic report into its timing, authored possibilities and exact source
identity. The white-default workspace and saved dark appearance retain the same
selection and camera. Its [review](frontend/qa/REVIEW-APERTURE-2026-11-23.md)
records 52 core tests, 49 DOM tests, 485 package assertions and actual Chrome
interaction/rendering checks. The [earlier integration review](docs/qa/integration-20261123/REVIEW.md)
preserves the preceding candidate's results.
Device, accessibility and performance acceptance remain open; repository
integration does not deploy the site. Research and UI use separate
worktrees, and setup owns launch configuration. The [handoff](docs/SESSION_HANDOFF.md)
and [coordination record](docs/COORDINATION.md) identify current ownership and
continuation rules. The [current diagram review](docs/qa/readme-20261123/REVIEW.md) retains
accessible Mermaid sources and rendered copies for readers whose Markdown viewer does not support Mermaid.

## Local operation

The [operating guide](docs/SESSION-OPERATIONS.md) records setup's approved launch,
resume and continuity behavior. Daniel selected full access / YOLO on 16 November
2026. The installed canonical launcher supplies runtime overrides; historical
client snapshots do not describe that effective mode. Setup retains ownership of
launchers, MCP and global configuration.

**Current launch gate:** installed Codex 0.171.0 differs from setup's pinned
0.169.0. The version guard is retained. Setup must review compatibility before
a new Codex launch can be called ready; see the [handoff](docs/SESSION_HANDOFF.md).

```sh
cartancodes --check            # local preflight; starts no model
cartancodes resume --check     # inspect the research resume plan
```

The canonical `cartan-codex` and `cartan-claude` names and compatibility aliases
accept lane, resume and check arguments. See the operating guide for actual
session entry, authentication, version checks and continuity. Integration does
not restart or reconfigure an existing session.

## License

Original CARTAN code, documentation, synthetic fixtures and research output are
available under [Apache-2.0](LICENSE), copyright 2026 Daniel Wahnich. Supplied
concept media, brand assets and third-party works retain separate rights.
[Licensing scope and attribution](LICENSING.md) explains the boundary.
