# Conditional evidence checks

Read [ADR 002](../../research/decisions/ADR-002.md), the
[mathematics](../../research/block-2/mathematics.md) and
[frozen protocol](../../research/block-2/protocol.md). This directory does not
change the first exchange kernel or the frozen UI contract. No package installation,
network access, server or model call is needed. Python standard library only.

From the research root, choose a new output directory:

```sh
python3 backend/certificates/run_study.py --output /private/tmp/cartan-certificate-new
python3 backend/certificates/run_study.py --verify /private/tmp/cartan-certificate-new
python3 -c 'import sys, unittest; sys.path.insert(0, "backend/certificates"); from run_study import limits; print(limits()); suite = unittest.defaultTestLoader.discover("backend/certificates", pattern="test_*.py"); result = unittest.TextTestRunner(verbosity=2).run(suite); sys.exit(not result.wasSuccessful())'
```

The output directory is never overwritten. Failure produces retained partial
records. Run limits are applied before enumeration; OS refusal of the memory cap
is recorded. A second invocation can test deterministic `core.json` identity;
the input hashes must match too. Verification checks byte/configuration integrity,
not scientific validity. Do not run Python with `-O`, which disables assertions
used by this research harness.

`CountingB0` and `PossibleStateC` implement the same information model separately.
They share only report admission and labels. The independent truth harness checks
all allowed histories, and unit cases attack the shared admission boundary.
This compares a measurement-verification subproblem, not complete recovery systems.
B2 is an ideal measurement/interlock sensitivity; B1 is not executed. The strongest
claim is conditional behavior within a finite model. A wrong fault budget can
produce a wrong nonempty result; this is explicitly demonstrated.

`bounds.py` stores exact rational interval and voltage bounds. No float tolerance
defines a safety condition. Explanatory fractions and synthetic seconds do not
establish physical uncertainty or safe energy limits. These artifacts use their own
research format and must not be presented as v1 UI runs or actuator authority.
