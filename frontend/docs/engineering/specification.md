# Mission assumptions and physical state specification

Version `abstract-exchange/0.1.0`, exploratory, 16 November 2026. Owner: research.
This is an executable abstraction and a proposed physical experiment, not a
mechanical design or qualified operating procedure.

## Candidate requirement and unresolved engineering facts

R1 (proposed): an operator of a prepared persistent space asset needs to recover
or safely abandon an interrupted external electronics-cartridge exchange without
losing retention or making/breaking a hazardous electrical connection. Service
time, intervention and integration burden must meet that owner's limits. No
specific operator has supplied or accepted R1. NASA FFR's ORU task is a public
analogue ([S09](../../../research/sources.md)), not a customer commitment or chosen flight envelope.

| Assumption | Current status | Needed evidence / owner |
|---|---|---|
| A01 Fixed host plate and one retained dummy cartridge; remove and return | Chosen software simplification; no hardware | Research verifies sequence; mission owner must specify actual exchange |
| A02 Locked host or secured transfer support bears the module | Provisional abstraction; partial latch earns no retention credit | Mechanical reviewer: load paths, hold time, redundancy, latch tolerances |
| A03 Source disconnection does not instantly remove stored energy | Qualitative physical assumption; circuit unspecified | Electrical reviewer: schematic, capacitance, discharge path, measurement uncertainty |
| A04 No independent battery/backfeed in the cartridge | Model boundary, not an established spacecraft fact | Circuit review must enumerate all sources; breach invalidates model |
| A05 Mating and demating require isolation and sufficiently low energy | Conservative proposed invariant | Qualified reviewer must define voltage/current/energy and connector sequence |
| A06 Reliable sample includes acquisition time, arrival time and epoch | Proposed interface contract | Sensor/command implementation and timing audit; freshness does not prove correctness |
| A07 A stale lock ACK can occur with either completed or partial capture | Plausible proposed history; not a recovered incident | Mechanism/controller traces must show reachable partial and full states |
| A08 Transfer support remains secured through restart and bounded wait | Strong assumption | Independent support instrumentation, fail-safe behavior and hold-energy review |
| A09 No thermal, vacuum, arcing, free-body or flexible-body dynamics | Explicit exclusion | Separate validation gates; do not extrapolate |
| A10 Additional latch measurement is independent | Unverified candidate for B2 | Fault tree/common power/wiring/software and calibration analysis |
| A11 Mission loads, geometry, mass, inertia, delay, cost and thresholds | Unknown / unmeasured | Owner and reviewers; no copied competitor or invented flight numbers |

## State, observations and commands

The plant state is `x=(h,g,c,p,e,k,t)`: host latch `h ∈ {open,partial,locked}`;
transfer support `g ∈ {secured,released}`; connector `c ∈ {mated,separated}`;
source `p ∈ {connected,isolated}`; stored energy fraction `e ∈ [0,1]`;
contact `k ∈ {clear,unexpected}`; elapsed time `t ≥ 0` in synthetic seconds.
`e` is dimensionless, normalized to a hypothetical reference energy. No joule or
voltage claim follows. While isolated, `e(t+dt)=e(t) exp(-dt/tau)`; while connected,
`e=1`. `tau` and the low-energy threshold are exploratory inputs, not measured
constants. Nominal cartridge geometry is not supplied. Loads remain unmeasured.

`y` is a report with source, variable, value, acquisition/arrival times, validity
and restart epoch. Fault adapters can emit a false but apparently valid report.
The truth series is never edited to agree with it. `u` is a requested command;
the command event records acceptance/rejection separately. `b` is a finite set
of candidate states supplied by a declared uncertainty model. It is not a
probability or confidence score. The kernel does not claim to infer a complete
belief from a single report or to model all possible faults.

An ACK reports command receipt only. A prior-epoch, future-dated, missing or stale
report cannot establish a current fact. Restart invalidates controller evidence,
not plant state. An unknown measurement never becomes zero. Empty candidate sets
mean inconsistent evidence, not vacuous permission to act.

## Guarded transitions

Structural preconditions below describe the abstract mechanism. Safety guards
are evaluated over every candidate in `b` before a guarded command is sent.
The plant can execute physically possible unsafe commands in negative-control
tests; the independent oracle must report their consequences. There is no truth
lookup in the controller's guard.

| Command | Structural precondition and effect | Proposed safety guard |
|---|---|---|
| `isolate` | Set source isolated; preserve residual energy | Always permitted as a modeled de-energizing request; no claim all real circuits permit it |
| `wait(dt)` | Advance time; discharge only when isolated | Nonnegative bounded dt; no claim indefinite holding is safe |
| `secure` | Mated cartridge; set transfer support secured | No unexpected contact |
| `unlock` | Mated; host becomes open (fault may stop at partial) | Transfer support secured, source isolated, energy below threshold, clear contact |
| `separate` | Host open, connector mated; connector becomes separated | Same retention/isolation/energy/contact guards |
| `mate` | Connector separated; connector becomes mated | Support secured, host open, source isolated, energy below threshold, clear contact |
| `lock` | Mated; host becomes locked (fault may stop at partial) | Support secured, source isolated, energy below threshold, clear contact |
| `release_support` | Set support released | Host locked and clear contact |
| `energize` | Source connected, energy set to one | Host locked, connector mated, clear contact |
| `hold` | No state change | A request to hold is not proof of a safe state |

Nominal order: isolate → wait → secure → unlock → separate → mate → lock →
release support → energize. Reinserted cartridge is the same dummy; actual
replacement, alignment control and functional checkout are not modeled.

Oracle outcomes are separate: retention loss (`h != locked` and `g != secured`);
unsafe energization (connected source without locked/mated assembly);
unsafe connector transition (mate/separate when source connected or energy above
threshold); exceeded load limits (unmeasured in this kernel); completion (cycle
includes separation then return to locked, mated, powered, support released);
safe abort (halted, isolated, low-energy and retained); intervention (recorded
request, not human performance); and elapsed time. An unsafe event is sticky:
later completion cannot erase it. Unrecoverable is unknown without a reachability
proof over an accepted full action/mechanism model.

## First physical experiment proposal

Use one contained fixed plate, prepared dummy electronics cartridge, independently
instrumented retention/support and an electrically reviewed isolation circuit.
Interrupt after a capture request and before verified completion; retain support.
Measure full capture and a mechanically reachable partial capture that can produce
the same ordinary telemetry. Independently measure source disconnection and
residual energy. Include no-fault control and ordinary reread/retry/abort recovery.

First establish whether the ambiguity survives competent installed sensing and
interlocks at all. If it does, compare one additional independent non-actuating
measurement with a better procedure and set-based reasoning using the same data.
Mechanical probing is deferred until its force, displacement and energy limits
are independently reviewed. The fixture must retain all failed attempts and
separate truth instrumentation from policy telemetry. Qualified review and
explicit physical authorization precede procurement, assembly and operation.
