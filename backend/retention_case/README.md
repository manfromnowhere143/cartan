# Synthetic interrupted-retention case

SYN-RC-1 is a fixed, CPU-only finite fixture. It is not calibrated to HOTDOCK or
another installed unit. External support remains secured. Isolation is UNKNOWN;
voltage is UNMEASURED. There is no actuation, release or network consumer.

Read the [decision memo](../../research/decisions/RETENTION-2026-11-23.md) for the
causal model, source revisions, assumptions, bounds and original verification.
The result is **BASELINE SUFFICIENT**: two feasible histories have opposite
retention and identical ordinary history, but the same retry completes capture
and the same supported park completes abort within the declared horizons.

- `fixture.json` freezes the scenario and control IDs.
- `enumerate_case.py` constructs histories and checks finite-horizon reach–avoid.
- `check_case.py` independently enumerates action words and checks policy
  consistency across equal observed prefixes. It imports no producer logic.

From the repository root, using Python 3.11+ and no installation:

```sh
run_dir=$(mktemp -d /private/tmp/cartan-retention-XXXXXX)
python3 -B backend/retention_case/enumerate_case.py > "$run_dir/result.json"
python3 -B backend/retention_case/check_case.py "$run_dir/result.json"
python3 -B backend/retention_case/enumerate_case.py > "$run_dir/replay.json"
cmp "$run_dir/result.json" "$run_dir/replay.json"
```

Each invocation enforces five CPU seconds. The finite domain has four source
histories, at most two consistent branches, horizon three and seven actions.
The checker caps accepted result files at 1 MiB. No memory cap is claimed.

C00 is the joint witness. C01–C06 cover interlock exclusion, stale reset delivery,
marginals without a joint witness, common baseline recovery, useful independent
observation and a deadline with no certified continuation. The memo retains the
seven passing controls, eight rejected output corruptions and exact source hashes.

Do not broaden this fixture or silently remove its retry/park assumptions.
[REA-1](../../research/experiments/retention-evidence-admission.md) identifies the
physical evidence required before a separate successor model is justified.
