# CARTAN research block 1

16 November 2026. Owner: research, `research/architecture`. Status: exploratory.

The first useful question is whether a recovery decision needs information that
the installed interface cannot provide. A new controller has no automatic
advantage over a well engineered procedure using the same observations. A cheap
independent sensor, a passive interlock, or safe abandonment may be preferable.

This block preserves the long-term goal of robotically maintainable spacecraft.
It establishes a research specification, an interchange contract and a bounded
software verification exercise. It establishes no physical capability, customer,
novelty, accepted safety level or commercial advantage.

Read in this order:

1. [Current state and discrepancies](current-state.md).
2. [Sources, claims and counterevidence](sources.md).
3. [Architecture decision](decisions/ADR-001.md).
4. [Mission assumptions and physical model](specification.md).
5. [Exploratory protocol and baselines](protocol.md).
6. [Results and next decision](results.md), after execution.

The immutable UI handoff is under `contracts/cartan/v1/`; its checkpoint names
the commit and hashes. A synthetic fixture is presentation data, never evidence.
The separately labeled model traces may demonstrate software behavior only.
