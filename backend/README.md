# Bounded abstract verification

This is an offline research model. It controls no hardware and starts no service.
Read [the decision](../research/decisions/ADR-001.md),
[assumptions](../research/specification.md) and [protocol](../research/protocol.md).
No installation is needed. Python 3.11+ runs the model and unit checks using only
its standard library. Contract validation separately uses the already available
`jsonschema==4.26.0`; this repository does not install it automatically.

From the research root, using a **new** output directory each time:

```sh
python3 backend/run_verification.py --output /private/tmp/cartan-verification-new
python3 contracts/cartan/v1/validate.py /private/tmp/cartan-verification-new/bundle.json --manifest
python3 -m unittest discover -s backend -p 'test_*.py' -v
python3 contracts/cartan/v1/validate.py contracts/cartan/v1/fixture.json --self-test --manifest
```

The runner enforces five CPU seconds and requests 256 MiB address space, logging
OS support. It uses one worker, caps cases/commands and refuses to overwrite output.
It emits full truth, observation, command, candidate-set and outcome records,
input/configuration hashes, attempts, a 27-point toy sensitivity grid, resource
usage and a file manifest. Rejected commands consume no modeled time. Instantaneous
actions and ideal sensing are verification conveniences, not measured performance.

`core.json` and its canonical SHA-256 exclude wall-clock/platform metadata, so a
second identical invocation can be compared reproducibly. All model traces remain
in the core. The two input/configuration hash lists must also match before claiming
a same-version replay. A file hash proves byte identity, not scientific correctness.

`cartan_model.py` separates plant, synthetic sensor adapter and belief guard.
`oracle.py` scores truth without invoking the guard. `run_verification.py` contains
the scripted harness; it is not a B0, B1, B2 or C comparative recovery policy.
The frozen case file includes knowingly unsafe negative controls. Their detected
hazards are expected verification outcomes, never baseline performance claims.
The truth scorer shares the abstract state representation, so its independence is
limited to separate scoring logic; there is no independent physical ground truth.

An empty belief is inconsistent. Missing reports give a broad set, not zeros.
Unknown continuous energy uses extrema only for these monotone guards; candidates
are not exhaustive physical trajectories. Only assumed-trustworthy fresh reports
narrow the set. False-positive reports can invalidate that assumption and cause a
hazard. `host_untrusted=True` demonstrates conservative widening; it is not a
validated diagnosis method or evidence of an algorithmic advantage.
