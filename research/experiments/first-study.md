# First discriminating study: does a useful ambiguity survive?

Proposed 16 November 2026, following the source review and ADR 001. This is the
next-study design, not an executed physical protocol or permission to build.
The completed software checks are in [results](../results.md). The broader
baseline and cost rules remain in [protocol](../protocol.md).

The question is narrow: after an interrupted capture request, can a prepared
interface report the same ordinary telemetry when the module is fully retained
and when it is only partially captured? If so, can ordinary rereading, retry,
operator recovery, or one inexpensive independent measurement resolve the decision
before the reviewed hold limit? An interface whose interlocks already prevent
the ambiguity from affecting a decision is a useful negative result.

## Stage 1: establish the mechanism and information gap

Select one documented interface revision and isolation circuit, with permission to
inspect its recovery procedures. The interface may be a reviewed laboratory dummy;
do not label it representative of a vendor or mission without evidence. The module
has no unmodeled power source, and independent containment prevents a dropped
module. Qualified reviewers must specify load paths, hold energy/time, low-voltage
limits, residual energy, sensor uncertainty and stop conditions before procurement
or actuation. No live hazardous disconnection is needed to establish the gap.

Prepare a no-fault case and one interrupted capture case. Establish full and
partial capture physically using independent instrumentation and a causal account
of how interruption reaches each state. Do not simply assign two simulator labels.
Keep source connection and stored energy distinct. First use ordinary sensing and
installed interlocks with their real procedures. If they expose a reliable
difference or make release physically impossible, record that and narrow/stop the
extra inference work. Do not disable a competent interlock to manufacture a win.

Record the complete ordinary history seen by a controller: command receipts,
sensor values, uncertainty, sample/arrival times, restart epoch, diagnostic actions
and allowed video. Record independent truth instrumentation on a separate channel.
Ask whether indistinguishability persists at the actual resolution and timing
uncertainty, not merely at a chosen coarse display resolution. Independence needs
a common-cause review: shared mechanics, supply, wiring, calibration and software.

The falsifying result for the proposed gap is that no physically reachable,
decision-relevant ambiguity survives the ordinary mechanism, information and
competent recovery procedure within the agreed envelope. This does not prove no
other interface has such a gap. Missing vendor documentation is an access gap,
not evidence that the vendor lacks the capability.

## Stage 2: compare recovery only if Stage 1 warrants it

Freeze the interface, permissible actions and mission-backed limits before scoring.
Develop procedures on disclosed single-fault cases. Reserve new interruption
phases and separately justified common-cause faults for holdout, with manifests
sealed before comparator development ends. Do not tune on the held-out records.

| Arm | Concrete behavior required before evaluation |
|---|---|
| B0 | Engineered interlocked state machine: validate fresh state; bounded reread and allowed retry; verify success independently of ACK; recover or hold/abort after restart. Give it the same diagnostics and history as C. |
| B1 | Trained operator applies the reviewed procedure and allowed diagnostics from the same telemetry/video under the stated link delay and availability. Record operator training, workload and response time; a scripted proxy cannot supply these results. |
| B2 | B0 plus one reviewed independent latch/energy measurement or passive change. Compare it as a different system with full lifecycle burden. Give C the same new measurement in a separate matched-information arm if attributing gains to reasoning. |
| C | Explicit possible-state recovery with no truth access. Publish the uncertainty model and diagnostic selection rule. It must remain conservative when sensor faults are included. If it encodes the same policy as B0, report equivalence. |
| N | Retain support and reviewed isolation; hold or abandon within resource limits. Count downtime and failure to complete the service task. |

Replay identical records for purely computational comparisons where actions do
not alter subsequent information. For active diagnostics, use matched initial
conditions and independently instrument each resulting trajectory; do not replay
one arm's observations as though another action produced them. Randomize and
balance physical trial order across arms and operators after qualified review,
and log reset/calibration checks to expose learning, wear and order effects.

No experimental arm is required to undergo an unsafe event. Independent monitoring
can stop before the reviewed boundary. Report a prevented unsafe request, a guard
rejection, an interlock intervention and an actual measured limit crossing as
different events. The current v1 run contract cannot by itself express all these
physical endpoints; add a reviewed successor contract before such a study. Do not
reinterpret an abstract hazard boolean as a measured near miss.

## Endpoints, analysis and decision

For every attempted trial, retain assignment, configuration, truth and ordinary
telemetry, commands, stop reason, and all exclusions. Count retention loss,
unsafe source energization, energized make/break, load-limit crossing, unresolved
state, completion, safe abort and interventions separately. Distinguish an
unresolved trial at the time budget from a proof of unrecoverability. Independent
scoring should be unaware of the arm where practical.

Measure time from the agreed interruption trigger to verified recovery or terminal
abort. Report both terminal-state time and completion-specific time; an aborted
trial must not disappear from the completion denominator or be counted as a fast
recovery. Record observation latency and computation separately. For B1, distinguish
human response, communication wait and physical action. Count integration and
operator burden even if all arms remain safe.

The owner and reviewers must preregister acceptable safety criteria, minimum
useful time/intervention change, uncertainty calculation and repetition count
based on the pilot variability and target use. Those values are currently unknown.
Without them, results are exploratory distributions and paired differences, not
a superiority or safety certification. Stop for any breached reviewed limit,
instrumentation failure, violated model assumption or inability to maintain
containment; preserve the attempt and investigate before resumption.

Record kg, W, volume, parts cost, engineering/calibration/qualification hours,
maintenance and downtime for each architecture. No price range or risk-weighted
business case is invented here. Prefer B0/N if they meet the requirement, B2 if
it resolves the problem more cheaply, and C only if it adds demonstrated value
under equal information and acceptable safety. If no owner-backed use or reachable
gap is found, stop product development while retaining the evidence and method.

Research merit would be an honest resolution of this question, including a null
result. Long-term robotic maintenance of spacecraft remains the destination;
this study would address one prepared-interface decision, not that whole system.
