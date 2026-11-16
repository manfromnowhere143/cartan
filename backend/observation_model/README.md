# Conditional observation model

This offline Python 3.11+ module calculates a terminal-voltage enclosure and a
separate source-connectivity result. It uses the standard library. Read
[ADR 004](../../research/decisions/ADR-004.md) and the
[specification](../../research/block-4/specification.md) before extending it.

The source-derived interface dossier records partial physical relationships and
missing qualification. The numerical fixtures are generic constructed examples;
they are not a calibrated HOTDOCK model. Neither supported result grants physical
authorization, proves retention, or establishes acceptable stored energy.

Run from the research root. Output directories must be new.

```sh
python3 -B -m unittest discover -s backend/observation_model -v
python3 -B backend/observation_model/run_study.py --output /private/tmp/cartan-observation-first
python3 -B backend/observation_model/run_study.py --output /private/tmp/cartan-observation-replay
cmp /private/tmp/cartan-observation-first/core.json /private/tmp/cartan-observation-replay/core.json
```

Compare the input hashes as well as core bytes. Each run retains attempted inputs,
expected rejections, exact bounds, topology witnesses, independent references,
resource observations and output hashes. It refuses an existing output directory.
A five-CPU-second cap is set; the requested memory cap's actual support is logged.

The interval comparison and graph reference are conventional methods with the
same information. Agreement checks implementation; it is not a new algorithmic
advantage. The new analysis format has no UI adapter and does not modify frozen v1.
