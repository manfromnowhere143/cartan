# Observation model and verification protocol

Version `physical-observation/0.1.0`, 16 November 2026. This is a conditional
engineering model and a software verification protocol. It has no independent
review, calibration data or physical execution result.

## Physical interpretation

The interface state includes cam angle, ring and connector displacement,
engagement at each load-bearing feature, support condition, capacity under the
demanded wrench, circuit connectivity, terminal potentials and stored energy.
These quantities are not interchangeable with command state or telemetry labels.

Represent a measurement as y = h(x, θ, f, t) with its sensing location, reference,
calibration parameters θ, admissible fault state f and acquisition time t. An
observation constrains x only within the validity domain of that relationship.
The source-derived dossier names what is documented and what remains unknown.
Its six proposition mappings remain incomplete physical authorization conditions.

For retention, a cam observation constrains a cam coordinate when its calibration
is valid. Relating that coordinate to engagement needs the actual cam profile,
backlash/compliance bounds, assembly state and fault coverage. Engagement then
needs a qualified capacity relationship under the proposed load and environment.
The model does not invent these mappings. Two constructed possibilities with the
same encoder indication and different downstream engagement illustrate an omitted
coupling assumption; they do not demonstrate a reachable HOTDOCK failure. A direct
engagement sensor may remove that ambiguity but does not qualify load capacity.

## Voltage inference

The numerical slice uses volts and seconds. A declared sensor at terminal pair p
has indication interval Y and relation y = g V_p + b + e. The gain interval G is
strictly positive; bias B and residual error magnitude ε are finite declared
bounds. Exact rational arithmetic computes the inverse interval from the endpoint
ratios of N/G, where N = [Y.low − B.high − ε, Y.high − B.low + ε]. The extreme
ratios occur at interval endpoints when G excludes zero. This is an enclosure,
not a distribution or a claim that every interior combination is physically likely.

If acquisition time lies in [t_low,t_high] and the query time is T, require
0 ≤ t_low ≤ t_high ≤ received ≤ T. The maximum age is T − t_low. With an assumed
rate bound L on the absolute voltage change, widen the interval by L times that
age. This bound covers sensor-to-query delay only within its validity domain;
an unmodeled switching transient invalidates it. Unknown rate does not imply zero.

For a nonnegative declared limit v_limit, return supported only if the entire
interval lies within [−v_limit,v_limit]. Return refuted only if it lies wholly
outside that band. Otherwise return unresolved. This handles either polarity.
Equality is included because this fixture predicate is non-strict; a physical
requirement must specify its own comparison rule and accepted margin.

Known zero and missing are different. Mismatched point/unit/epoch, stale data,
missing bounds, probabilistic coverage or an allowed arbitrary sensor-fault mode
return unresolved with the input retained. Malformed intervals, impossible time
ordering, nonpositive gain and unsupported modes reject the input. Numeric values
are bounded-length rational strings, never implicit floating-point tolerances.
No supplied number is a measured HOTDOCK parameter. Physical inputs are not
admitted by this verification slice.

This voltage predicate says nothing about a remote node, source disconnection,
current, arcing, dielectric recovery or stored-energy acceptability. A source can
be connected at zero voltage; an isolated capacitor can remain charged. No energy
certificate is produced without capacitance and the full relevant circuit.

## Connectivity inference

A finite undirected graph declares nodes, energy-source nodes, a target and
conductive edges. Each edge has a physical-state set drawn from open/closed,
distinct from its command. Enumerate at most eight uncertain edges, preserving
the assignment and a source-to-target path when one exists. Undirected edges are
an explicit bidirectional-conduction abstraction, not a semiconductor model.

Isolation is supported if no allowed graph assignment has a source-to-target
path; refuted if all assignments have one; otherwise unresolved. An incomplete
source/path inventory overrides apparent isolation to unresolved. An empty source
list does not establish isolation. Open means no conductive path in this model;
leakage, parasitic coupling, dielectric breakdown and transient behavior remain
outside it. Unknown paths must enter the graph or prevent a certificate.

Enumerating independent edge alternatives may retain impossible combinations,
which can make the result conservative. It does not establish that the real
topology is covered. A shared control fault that closes multiple paths must not
be excluded by an unjustified single-fault assumption. This slice supplies no
fault frequency, independent-sensor assumption or hardware reliability estimate.

## Frozen checks and comparator

The voltage cases cover nominal low indication, a threshold-crossing interval,
reverse-polarity exceedance, uncertain gain/bias, acquisition-time uncertainty,
unknown rate, stale data, wrong epoch, wrong node, missing value, coverage instead
of bounds, possible arbitrary fault and invalid gain/time/mode. Exact endpoint
and interior rational substitutions independently check interval enclosure.

Topology cases cover a verified open cut, an uncertain relay, a conductive path,
backfeed around an open relay, two open barriers, a common possible closure, an
empty source list and incomplete inventory. Breadth-first paths are cross-checked
against a separately implemented transitive-closure reference for every assignment.
A conventional interval comparator and the explicit observer receive identical
data; record equivalence, not novelty. No B1 human trial or physical B2 test runs.

Freeze code and JSON cases before execution, retain attempted inputs and errors,
run meaningful boundary tests, and perform one identical-input replay. Store full
records, assumptions, witnesses, source/configuration hashes, timing scope and
resource-limit support. A reference disagreement or accidental physical clearance
stops the run. No exclusions or held-out generalization claims are permitted.

## Physical validation plan

Before measurement, identify one unit, mechanical and circuit revision, firmware,
terminal pair and reference potential. Obtain a justified load envelope and
electrical criteria from the responsible engineering owner. Reconstruct every
source and return path, including the mating module, auxiliary supplies and
possible backfeed. Record what changes during reset and power loss.

Calibrate each sensing path against independently characterized references over
the proposed operating domain. Keep calibration points separate from validation
points; include both approach directions, repeatability, drift, environmental
effects, saturation and acquisition/arrival timing. Preserve correlation from
shared supplies, references, mechanics and software. A fit and its residuals do
not establish a deterministic fault envelope without a defensible bound argument.

Establish engagement and load capacity with independent instrumentation and a
qualified contained fixture. Review downstream mechanical faults and common
causes rather than assigning simulator labels. Ordinary procedures, sensing and
interlocks remain in place. If they already establish the decision, prefer them.
No purchase, actuation, hazardous disconnection or fault injection is executed by
this protocol. Hardware study limits and qualified review remain outstanding.
