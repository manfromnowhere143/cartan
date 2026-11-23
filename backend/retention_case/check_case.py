"""RC-independent/1.0.0: check full witnesses and enumerate paired action traces.

Does not import the producer, its transition/guard functions, or the old models.
Independent software logic shares the declared synthetic assumptions, not hardware.
"""
import hashlib
import itertools
import json
from pathlib import Path
import resource
import sys

HERE = Path(__file__).resolve().parent
COST = dict(hold=1, reread=1, restart=1, inspect=1, retry=2, park=2, attest_capture=1)


def require(test, reason):
    if not test:
        raise ValueError(reason)


def paths(initial, horizon, direct, goal):
    """All safe terminal action words, not a belief recurrence."""
    actions = [a for a in COST if direct or a != "inspect"]
    accepted = []
    for length in range(1, horizon+1):
        for word in itertools.product(actions, repeat=length):
            if sum(COST[a] for a in word) > horizon:
                continue
            retained, elapsed, history, decisions, terminal = initial, 0, (), [], None
            for action in word:
                if terminal or (action == "attest_capture" and not retained):
                    break
                decisions.append((history, action))
                elapsed += COST[action]
                if action == "retry":
                    retained, observation = True, "retry_done"
                elif action == "park":
                    terminal, observation = "supported_abort", "parked"
                elif action == "attest_capture":
                    terminal, observation = "captured_supported", "attested"
                elif action == "inspect":
                    observation = str(int(retained))
                else:
                    observation = "ordinary_readback_unchanged"
                history += ((elapsed, action, observation),)
            else:
                if terminal and (goal == "either" or terminal == "captured_supported"):
                    accepted.append(decisions)
    return accepted


def exhaustive(states, horizon, direct=False, goal="either"):
    if not states:
        return [], 0
    per_state = [paths(r, horizon, direct, goal) for r in states]
    winners, examined = set(), 0
    for combination in itertools.product(*per_state):
        examined += 1
        policy, valid = {}, True
        for path in combination:
            for history, action in path:
                if history in policy and policy[history] != action:
                    valid = False
                policy[history] = action
        if valid:
            winners.add(combination[0][0][1])
    return sorted(winners), examined


def verify(data):
    cfg = json.loads((HERE/'fixture.json').read_text())
    require(cfg['actions'] == COST and cfg['horizon_ticks'] == 3, 'Changed action domain')
    require(cfg['due_ticks'] == [2, 3] and cfg['persistent_biases'] == [0, 1], 'Changed latent domain')
    require((cfg['interruption_tick'], cfg['reset_tick'], cfg['query_tick']) == (2, 3, 4), 'Changed causal timing')
    require(data['mode'] == 'synthetic_fixture' and data['physical_authorization'] == 'not_assessed', 'Scope drift')
    require(data['schema_version'] == cfg['schema_version'] and data['scenario_id'] == 'SYN-RC-1', 'Identity drift')
    for name, digest in data['source_hashes'].items():
        require(name in ('fixture.json', 'enumerate_case.py', 'check_case.py'), 'Unexpected source path')
        require(hashlib.sha256((HERE/name).read_bytes()).hexdigest() == digest, 'Source hash mismatch')
    require(set(data['source_hashes']) == {'fixture.json', 'enumerate_case.py', 'check_case.py'}, 'Missing source')
    admitted = []
    for interlock, key in [(False, 'histories'), (True, 'interlocked_histories')]:
        rows = data[key]
        require(len(rows) == 4, 'Trace count')
        require({(r['due'], r['bias']) for r in rows} == {(2, 0), (2, 1), (3, 0), (3, 1)}, 'Incomplete trace domain')
        selected = []
        for row in rows:
            due, bias = row['due'], row['bias']
            require(row['id'] == f'due-{due}-bias-{bias}' and len(row['trace']) == 5, 'Trace identity/length')
            for t, record in enumerate(row['trace']):
                engaged = due == 2 and t >= 2
                q = int(t >= 1) if not interlock else int(engaged)
                epoch = int(t >= 3)
                truth = dict(drive=q, engaged=engaged, retained=engaged, support_secured=True,
                             contact='aligned', controller=['idle','moving','stopped','ready','ready'][t],
                             epoch=epoch, source_isolation='UNKNOWN', measured_voltage='UNMEASURED')
                obs = dict(tick=t, sampled_tick=t, received_tick=t, epoch=epoch, drive=q+bias,
                           proximity='aligned', support_secured=True, controller=truth['controller'],
                           command=['capture_received','drive','interrupt','restart','reread'][t])
                require(record == {'truth':truth, 'observation':obs}, 'Causal/epoch/bias witness invalid')
            target = [0,0,1,1,1] if interlock else [0,1,1,1,1]
            if [s['observation']['drive'] for s in row['trace']] == target:
                selected.append(row)
        admitted.append(selected)
    c = data['controls']
    require(set(c) == {f'C0{i}' for i in range(7)}, 'Missing control')
    require([r['id'] for r in admitted[0]] == c['C00']['admitted_history_ids'], 'Wrong consistency set')
    require(c['C00']['remaining_retention'] == [False,True] and c['C01']['remaining_retention'] == [True], 'Reported retention set drift')
    require([r['trace'][-1]['truth']['retained'] for r in admitted[0]] == [True,False], 'No opposite-retention pair')
    require([x['observation'] for x in admitted[0][0]['trace']] == [x['observation'] for x in admitted[0][1]['trace']], 'No common full history')
    require([r['id'] for r in admitted[1]] == c['C01']['admitted_history_ids'] == ['due-2-bias-0'], 'Interlock did not kill branch')
    require(c['C00']['action_status'] == {a:('unresolved' if a == 'attest_capture' else 'admissible') for a in COST if a != 'inspect'}, 'Wrong guards')
    require(c['C01']['attest_capture'] == 'admissible', 'Interlock classification')
    packet = c['C02']['packet']
    require(packet == dict(acquisition_id='drive-0', sampled_tick=0, received_tick=4, epoch=0, value=0), 'Stale control changed')
    require(all(r['trace'][0]['observation']['drive'] == packet['value'] for r in admitted[0]), 'Old packet is not feasible in both histories')
    require(packet['epoch'] < c['C02']['current_epoch'] == 1 and packet['sampled_tick'] < 3 <= packet['received_tick'], 'Stale epoch control')
    require(c['C02']['remaining_retention'] == [False,True] and c['C02']['disposition'] == 'old_epoch_duplicate_not_new_acquisition', 'Stale delivery fabricated information')
    left, right = {(0,0),(1,1)}, {(0,1),(1,0)}
    require(set(map(tuple,c['C03']['relations']['retained'])) == left and set(map(tuple,c['C03']['relations']['unretained'])) == right, 'Wrong joint relations')
    require(not left & right and c['C03']['common_full_histories'] == [], 'Spurious joint witness')
    require(c['C03']['marginal_intersections'] == [sorted({v[j] for v in left} & {v[j] for v in right}) for j in (0,1)], 'Wrong marginals')
    require(c['C03']['inconsistent_action_status'] == 'inconsistent' and not c['C03']['inconsistent_winning_first_actions'], 'Empty consistency gave permission')
    counts = {}
    for cid, states, horizon, direct, goal, field in [
        ('C00',[False,True],3,False,'either','winning_first_actions'),
        ('C01',[True],1,False,'either','winning_first_actions'),
        ('C04',[False,True],3,False,'capture_only','capture_only_winning_first_actions'),
        ('C05',[False,True],3,True,'either','winning_first_actions'),
        ('C06',[False,True],1,True,'either','winning_first_actions')]:
        expected, count = exhaustive(states,horizon,direct,goal)
        require(c[cid][field] == expected, f'{cid} finite-horizon disagreement')
        n = 7 if direct else 6
        counts[cid] = {'action_words_per_initial_state':sum(n**k for k in range(1,horizon+1)),
                       'safe_terminal_paths_per_initial_state':[len(paths(r,horizon,direct,goal)) for r in states],
                       'paired_terminal_traces':count}
    for name, word, end, ticks in [('supported_park',['park'],'supported_abort',2),('ordinary_retry',['retry','attest_capture'],'captured_supported',3)]:
        require(c['C04'][name] == [dict(initial_retained=r, actions=word, elapsed_ticks=ticks, terminal=end, support_secured=True, release_permitted=False) for r in [False,True]], 'Baseline trace mismatch')
    require(c['C04']['algorithmic_advantage'] == 'none_in_this_fixture', 'Unjustified superiority')
    require(c['C05']['observation_classes'] == {'0':dict(remaining_retention=[False],attest_capture='refuted'), '1':dict(remaining_retention=[True],attest_capture='admissible')}, 'Direct observation control')
    require(c['C06']['deadline_ticks'] == 1 and not c['C06']['winning_first_actions'], 'Deadline control')
    return counts


if __name__ == '__main__':
    resource.setrlimit(resource.RLIMIT_CPU, (5,5))
    require(len(sys.argv) == 2, 'Usage: check_case.py RESULT.json')
    p = Path(sys.argv[1])
    require(p.stat().st_size <= 1024*1024, 'Output cap exceeded')
    data = json.loads(p.read_text())
    counts = verify(data)
    print(json.dumps({'checker_id':'RC-independent/1.0.0', 'controls_passed':7,
                      'paired_terminal_traces_examined':counts, 'physical_validation':False}, sort_keys=True))
