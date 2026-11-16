"""Reproduce conditional observation checks with independent calculations."""
import argparse
from datetime import datetime, timezone
from fractions import Fraction
import hashlib
from itertools import product
import json
from pathlib import Path
import platform
import resource
import sys
import time

from model import VERSION, require, topology, voltage

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def limits():
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    result = {"workers": 1, "cpu_limit_s": 5, "address_space_requested_bytes": 268435456}
    try:
        resource.setrlimit(resource.RLIMIT_AS, (268435456, 268435456))
        result.update(address_space_limit_set=True, note="Enforcement not stress tested")
    except (ValueError, OSError) as error:
        result.update(address_space_limit_set=False, note=str(error))
    return result


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, data):
    path.write_text(json.dumps(data, indent=2, allow_nan=False)+"\n")


def conventional_voltage(data):
    """Independent corner substitution; no call to the observer's interval code."""
    r, m, q = data["report"], data["model"], data["query"]
    age = Fraction(q["time_s"])-Fraction(r["sampled_s"][0])
    drift = Fraction(m["rate_V_per_s"])*age
    error = Fraction(m["error_V"])
    values = []
    for y, g, b, e, d in product(map(Fraction,r["value_V"]), map(Fraction,m["gain"]),
                               map(Fraction,m["bias_V"]), (-error,error), (-drift,drift)):
        values.append((y-b-e)/g+d)
    lo, hi, limit = min(values), max(values), Fraction(q["limit_V"])
    if max(abs(lo),abs(hi)) <= limit:
        status = "supported"
    elif (lo > limit) or (hi < -limit):
        status = "refuted"
    else:
        status = "unresolved"
    return {"interval_V":[str(lo),str(hi)], "status":status,
            "corner_substitution_values_V":[str(v) for v in values]}


def closure_reference(data, assignment):
    """Boolean transitive closure, independent of breadth-first witness search."""
    nodes = data["nodes"]
    index = {n:i for i,n in enumerate(nodes)}
    reachable = [[i==j for j in range(len(nodes))] for i in range(len(nodes))]
    for edge in data["edges"]:
        if assignment[edge["id"]]:
            a,b = index[edge["a"]],index[edge["b"]]
            reachable[a][b] = reachable[b][a] = True
    for k in range(len(nodes)):
        for i in range(len(nodes)):
            for j in range(len(nodes)):
                reachable[i][j] |= reachable[i][k] and reachable[k][j]
    return not any(reachable[index[s]][index[data["target"]]] for s in data["sources"])


def run(output):
    cap = limits()
    output.mkdir(parents=True, exist_ok=False)
    start, wall, cpu = datetime.now(timezone.utc).isoformat(), time.monotonic(), time.process_time()
    core = {"schema_version":"cartan-observation-analysis/1.0.0", "model_version":VERSION,
            "scope":"constructed_verification_not_calibration", "physical_authorization":"not_assessed",
            "cases":[], "exclusions":[]}
    try:
        config = json.loads((HERE/'cases.json').read_text())
        require(config['model_version']==VERSION and config['schema_version']==core['schema_version'], 'Configuration version mismatch')
        cases = [("voltage", c) for c in config['voltage_cases']] + [("topology", c) for c in config['topology_cases']]
        require(len(cases)<100 and len({c['id'] for _,c in cases})==len(cases), 'Invalid case count or identity')
        for kind, case in cases:
            row = {'id':case['id'], 'kind':kind, 'input':case['input'], 'execution':'started'}
            core['cases'].append(row)
            write(output/'progress.json', core)
            try:
                result = (voltage if kind=='voltage' else topology)(case['input'])
            except ValueError as error:
                row.update(execution='rejected', error=str(error))
                require(case.get('expected_error','UNEXPECTED ERROR') in str(error), 'Unexpected rejection')
            else:
                row.update(execution='evaluated', result=result)
                require('expected_error' not in case and result['status']==case['expected'], 'Unexpected classification')
                require(result['physical_authorization']=='not_assessed', 'Physical scope changed')
                if kind=='voltage' and result['interval_V'] is not None:
                    reference = conventional_voltage(case['input'])
                    row['conventional_reference'] = reference
                    require(result['interval_V']==reference['interval_V'] and result['status']==reference['status'], 'Conventional voltage comparator disagreement')
                if kind=='topology':
                    for world in result['worlds']:
                        world['reference_isolated'] = closure_reference(case['input'],world['assignment'])
                        require(world['isolated']==world['reference_isolated'], 'Connectivity reference disagreement')
    except Exception as error:
        write(output/'progress.json',core)
        write(output/'failure.json',{'status':'failed_retained','error':str(error)})
        raise
    write(output/'progress.json',core)
    write(output/'core.json',core)
    used=resource.getrusage(resource.RUSAGE_SELF)
    inputs=['research/decisions/ADR-004.md','research/block-4/specification.md','research/block-4/sources.md']
    inputs += [f'backend/observation_model/{name}' for name in ('model.py','run_study.py','test_model.py','cases.json','interface-profile.json')]
    summary={'checks_passed':True,'case_count':len(cases),'input_rejections':sum(r['execution']=='rejected' for r in core['cases']),
             'voltage_comparisons':sum('conventional_reference' in r for r in core['cases']),
             'topology_reference_checks':sum(len(r.get('result',{}).get('worlds',[])) for r in core['cases']),
             'assessment_counts':{s:sum(r.get('result',{}).get('status')==s for r in core['cases']) for s in ('supported','refuted','unresolved')},
             'core_file_sha256':digest(output/'core.json'),'input_hashes':[{'path':p,'sha256':digest(ROOT/p)} for p in inputs],
             'limits':cap,'started_at':start,'ended_at':datetime.now(timezone.utc).isoformat(),
             'evaluation_cpu_s':time.process_time()-cpu,'evaluation_wall_s':time.monotonic()-wall,
             'rss_high_water_bytes_at_sample':used.ru_maxrss if sys.platform=='darwin' else used.ru_maxrss*1024,
             'measurement_scope':'Imports and final summary/manifest export excluded; RSS sampled after core export',
             'python':platform.python_version(),'platform':platform.platform()}
    write(output/'summary.json',summary)
    require(sum(p.stat().st_size for p in output.iterdir())<10*1024*1024,'Output cap exceeded; records retained')
    write(output/'SHA256SUMS.json',{p.name:digest(p) for p in sorted(output.iterdir())})
    print(json.dumps({k:v for k,v in summary.items() if k!='input_hashes'},indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,required=True)
    run(parser.parse_args().output)
