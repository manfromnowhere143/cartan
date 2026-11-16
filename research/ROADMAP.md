# CARTAN research priorities after block 2

16 November 2026. Long-term aim: spacecraft and orbital infrastructure that can
be maintained, upgraded and reconfigured robotically. Current status: a research
concept with source reviews, explicit models and reproducible software studies.
The program has no established flight capability, customer, commercial advantage
or accepted physical safety envelope. This roadmap replaces a request for every
advanced technique with a sequence of answerable engineering questions.

| Priority | Concrete deliverable | Evidence needed to move forward | Stop/narrow rule |
|---|---|---|---|
| 1. Physical meaning of observations | One reviewed interface/circuit revision; mapping from telemetry and acquisition provenance to actual retention/isolation predicates | Current ICD, mechanism/load-path explanation, measurement locations and uncertainty, failure/common-cause coverage, restart behavior | Do not substitute motor position or ACK for physical retention. If ordinary evidence already suffices, prefer the existing procedure |
| 2. Fault envelope | Versioned allowed histories, disturbances and source-dependence model, with counterexamples outside it | Real traces, calibration or engineering bounds; not assumed error frequencies | Unknown bounds stay unknown. Do not turn a consistent inference into a safety claim |
| 3. Useful comparative recovery | Competent interlocked B0, operator B1, hardware/procedure B2, explicit C and null arm with matched information and resources | Owner-backed endpoints, allowed diagnostics, hold limits and a frozen protocol | If B0 is equivalent, retain it. If B2 is simpler at acceptable burden, prefer it. Do not disable protections to produce a win |
| 4. Physics fidelity | Validated circuit envelope; constrained contact/retention model only where it changes the decision | Geometry, material/compliance, load, source/backfeed and actuator data; independent reference cases | No active probing or free-body claim from a fixed-host or scalar model |
| 5. Algorithm complexity | A justified planner/estimator plus separate certificate checks, bounded latency and meaningful ablations | A demonstrated decision problem that simpler procedures cannot solve within the same information/resources | Do not add learning, differentiable reachability or belief planning solely because it is recent |
| 6. Contained physical study | Reviewed fixture, independent truth instrumentation, predeclared trial/stop rules and complete results | Qualified safety review, explicit physical authorization, realistic time/cost limits and reproducible measurements | Preserve failed/null trials; a lab success does not qualify space operation |
| 7. Scale and dissemination | Reviewable evidence package and clearly scoped claims | Independent review/replication; separately authorized publication or deployment | No organizational endorsement, mission heritage or universal superiority inferred from local checks |

The [first-study protocol](experiments/first-study.md) remains the physical-study
design. Public preliminary interface material now supports its desk review, but
does not complete the current-hardware or fault-mapping gate. A current operational
revision and credible measurement bounds are the next highest-value inputs.

For Priority 1, make these questions explicit in the eventual interface record:

- What physical predicate does each channel actually measure, and which faults
  can decouple that measurement from the required load path or isolation state?
- Which channels share mechanics, power, wiring, clocks or software? What is a
  fresh independent acquisition, rather than a new delivery of old data?
- What survives a restart, and what evidence must be reacquired?
- Where is residual energy measured, which sources/backfeed remain possible,
  and which limits have an identified engineering authority?
- Can a permitted passive reread/retry or operator procedure resolve the decision
  within the hold limit? If not, what one additional measurement changes it?

These are research obligations, not invented facts about any vendor. Open-source
discovery and analysis can continue without contacting third parties. Procurement,
physical operation, paid compute, deployment and publication remain separate
actions; nothing in this roadmap silently starts them.

Software structure stays small: immutable source/assumption records; independent
plant, observation, inference and scoring boundaries; versioned static artifacts;
bounded reproducibility checks. UI consumes stable reviewed contracts and exposes
unknowns. Setup retains launcher/global/MCP ownership. No whole-repository rewrite,
new model session, recurring mission or fashionable dependency stack is required
to answer the next scientific question.
