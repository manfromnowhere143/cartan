# Interface evidence evaluator

Python 3.11+; standard library only. No server, dependency installation, hardware
driver or actuator. Read [ADR 003](../../research/decisions/ADR-003.md) and the
[logical specification](../../research/block-3/protocol.md) before changing it.

The evaluator preserves six distinct propositions and checks a declared action
over all remaining logical worlds. Reports retain identity, source, units, time,
epoch, tagged status and value. Acknowledgements do not establish physical facts.
Default vocabulary interpretation performs no physical inference. Direct Boolean
bindings exist only under an explicit, assumed fault-free synthetic profile.
`admissible` is a logical classification; physical authorization is always
`not_assessed`. Model coverage and complete physical preconditions are unvalidated.

From the repository root, use a new output directory for each execution:

```sh
python3 -B -m unittest discover -s backend/interface_evidence -p 'test_*.py' -v
python3 -B backend/interface_evidence/run_analysis.py --output /private/tmp/cartan-interface-first
python3 -B backend/interface_evidence/run_analysis.py --output /private/tmp/cartan-interface-replay
cmp /private/tmp/cartan-interface-first/core.json /private/tmp/cartan-interface-replay/core.json
```

The runner refuses an existing directory. It applies a five-CPU-second limit,
requests a 256 MiB address-space limit, records unsupported enforcement, and keeps
attempted inputs and failures. Each output retains progress, complete cases and
witnesses, all 256 reference checks, input/output hashes and resource measurements.
The output format is `cartan-interface-analysis/1.0.0`; it is not the frozen v1 UI
contract. No UI adapter or physical comparison is implemented here.

One deterministic replay checks repeatability, not independent scientific
replication. Case expectations are disclosed software checks, not held-out data.
