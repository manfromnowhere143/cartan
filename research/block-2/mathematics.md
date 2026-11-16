# Conditional recovery evidence: specification and proofs

Version `recovery-evidence/0.1.0`, exploratory, 16 November 2026. These are elementary
derivations for a declared model, not novelty, a machine-checked proof, or physical
safety guarantees. [Prior methods and limits](sources.md) motivate the questions.

## 1. Evidence is a set of possible histories

Let `b ∈ {0,1}` be a constant retention fact during one observation episode: 1
means the reviewed retention predicate holds; 0 means it does not. It is **not**
the motor command, processed ACK or encoder position. Mapping a real measurement
to this predicate is an unresolved physical obligation.

Each accepted acquisition has a unique ID, source, epoch and sampling/arrival
times. In the toy fault model, at most `k` accepted reports in the episode disagree
with `b`. Errors can be correlated; no independence or probabilities are assumed.
The bound, constancy of `b`, sample provenance and fresh timestamps are assumptions.
Missing reports add no evidence. A replayed packet is not a new acquisition.
Restart clears the inference history and revokes its fact. A deadline without
enough valid observations can end unresolved.

For reports `y₁…yₙ`, define

\[
E_n(b)=\sum_{i=1}^n \mathbf 1[y_i\ne b],\qquad
B_n=\{b:E_n(b)\le k\}.
\]

The set observer carries `(b,E_n(b))`, predicts no change in `b`, adds one on a
mismatch and removes counts above `k`. A singleton reports its fact; two candidates
mean unresolved; none means inconsistent with the declared model. With no finite
error bound, both facts remain possible under arbitrary reports.

**Soundness, conditional on the model.** Initially truth is in `B₀`. If the true
fact has produced at most `k` errors in every prefix, its update count never
exceeds `k`; therefore it is never removed. Induction gives `b_true ∈ B_n`.
A singleton is correct under these assumptions. This does not detect every model
violation: more than `k` wrong readings may produce a consistent but wrong singleton.

**Competent B0 equivalence.** A simple counter of zeros and ones gives exactly
the same set: 0 is possible iff the ones count is at most `k`; 1 is possible iff
the zeros count is at most `k`. Thus B0 and C must give the same fact after every
accepted prefix. C has no information advantage and no faster guaranteed decision
in this model. Extra state machinery alone is not a scientific improvement.

**Worst-case valid-acquisition bound.** `2k+1` binary reports force at least one
symbol to occur `k+1` times. The opposite truth would require too many errors,
so a fact is known. Conversely, a word of length `2k` with `k` zeros and `k` ones
is allowed under either truth. No method, including a trained human with no extra
information, can always distinguish those two histories at that prefix. The lower
bound concerns worst-case classification, not every prefix or actual operator speed.
An unknown/unbounded number of erasures removes any fixed wall-clock guarantee.

## 2. Measurement changes and common causes

One genuinely correct additional measurement identifies `b` in one acquisition;
this is a different observation model, not a C-versus-B0 algorithm gain. If both
channels can share an undetected stuck-high cause, repeated `(1,1)` is compatible
with `b=0` and `b=1` indefinitely. Treat the joint channel relation as
`O(0)=O(1)={(0,0),(1,1)}` for that illustrative common-cause envelope. Counting
packets or channel names cannot make those observation sets disjoint.

A sound passive interlock could forbid support release when `b=0` without
identifying a fault mode. It changes physical admissible actions and has its own
fault model/cost. This block includes a logical interlock truth table only.
No mechanism is built or credited with real reliability.

Full fault identification is not necessary for every action. For a nonempty
possible-world set `W`, a fact/action precondition `P` is established if
`∀w∈W, P(w)`. Multiple different fault labels can remain while all agree on `P`.
For release, **all** reviewed preconditions are required; a retention fact alone
is insufficient. Unknown and inconsistent preconditions cannot be treated as true.

## 3. Zero overlap volume is not separation

For closed boxes `A=∏[aᵢ,bᵢ]` and `B=∏[cᵢ,dᵢ]`, an intersection exists exactly
when `max(aᵢ,cᵢ) ≤ min(bᵢ,dᵢ)` for every coordinate. Strict `>` in at least one
coordinate proves disjointness. If it exists, the coordinate-wise maxima give
an exact witness in both boxes.

Example: `[0,1]` and `[1,2]` overlap at `1` despite zero overlap length. The boxes
`[0,1]²` and `[1,2]×[0,1]` share an edge with zero area. A volume objective may guide
search but is not a deterministic exclusion certificate. Rational arithmetic
preserves endpoints and tiny gaps; no epsilon-based deletion is used here.
This illustrates a distinction already acknowledged in S19, not a replication
failure or a claim that all its conclusions are false.

## 4. Residual voltage with bounded discharge and possible backfeed

This is a new scalar electrical envelope, **not** block 1's stored-energy fraction
and not a HOTDOCK circuit model. For a constant equivalent RC discharge path and
constant source floor `u`, let normalized voltage satisfy

\[
\dot v=-(v-u)/\tau,\qquad
v(t)=u+(v_0-u)e^{-t/\tau}.
\]

Assume `0≤u≤u_max≤v₀≤v_max≤1`, `0<τ≤τ_max`, constant parameters and no unmodeled
source, switching transient or dielectric recovery. These strong assumptions need
circuit validation. Monotonicity in `v₀`, `u`, and `τ` for this domain gives

\[
v(t)\le U(t)=u_{max}+(v_{max}-u_{max})e^{-t/\tau_{max}}.
\]

For `u_max < v_limit < v_max`, a sufficient waiting time is
`t ≥ τ_max ln((v_max-u_max)/(v_limit-u_max))`. If `u_max≥v_limit` and
`v_max>u_max`, the allowed worst-case trajectory remains above the limit for every
finite time. Passive waiting cannot certify this condition. It does not establish
that the actual circuit is energized; it establishes an unresolved allowed case.

We bound `exp(-x)` using exact rational arithmetic. Reduce `x` to `r=x/2^m≤1`.
For the alternating Taylor series, an odd partial sum is a lower bound and the
preceding even partial sum is an upper bound. Terms decrease for `0≤r≤1`.
Repeated squaring of nonnegative endpoints preserves the bound. The checker uses
orders 13/12, then compares the resulting rational upper voltage to the rational
limit. Decimal displays are explanatory; stored rational fractions decide.

Positive capacitance would make energy proportional to `v²` only for that fixed
capacitance/reference voltage. Neither is known here; no joule, volt, current,
arcing or hardware safety margin is claimed. Every time/limit in this study is
synthetic. Interval arithmetic cannot compensate for a missing physical mode.

## Block-1 interpretation clarification

The preserved block-1 oracle also requires clear contact for a modeled safe abort.
Its short specification omitted that conjunct; the code, predeclared case and
results use it. This additive note makes the interpretation explicit without
rewriting frozen inputs or retroactively changing a result.
