"""Boundary and adversarial verification; not validation against a real mechanism."""
from copy import deepcopy
from dataclasses import replace
import math
import unittest

from cartan_model import State, guard, observe, possible_states, transition
from oracle import hazards_before_after, outcomes
from run_verification import replay


class ModelVerification(unittest.TestCase):
    def test_isolation_preserves_residual_energy_and_known_decay(self):
        isolated = transition(State(), "isolate")
        self.assertEqual(isolated.energy_fraction, 1)
        self.assertAlmostEqual(transition(isolated, "wait", dt=10).energy_fraction,
                               .006737946999085467, places=15)
        # Splitting an interval must not change its physical flow.
        split = transition(transition(isolated, "wait", dt=4), "wait", dt=6)
        self.assertAlmostEqual(split.energy_fraction, .006737946999085467, places=15)

    def test_rejects_impossible_separation_without_mutation(self):
        x = State()
        with self.assertRaises(ValueError):
            transition(x, "separate")
        self.assertEqual(x, State())

    def test_invalid_states_and_unbounded_time_rejected(self):
        for args in ({"energy_fraction": float("nan")}, {"energy_fraction": True},
                     {"connector": "separated"}, {"energy_fraction": .1}):
            with self.assertRaises(ValueError):
                State(**args)
        for dt in (-1, 31, float("inf"), True):
            with self.assertRaises(ValueError):
                transition(State(), "wait", dt=dt)

    def test_partial_latch_does_not_earn_retention_credit(self):
        x = State(host="open", support="secured", source="isolated", energy_fraction=0)
        partial = transition(x, "lock", partial=True)
        self.assertFalse(guard("release_support", [partial]))
        lost = transition(partial, "release_support")
        self.assertTrue(hazards_before_after(partial, lost, "release_support", True, .05)["retention_loss"])

    def test_threshold_boundary_and_monotonic_direction(self):
        x = State(host="open", support="secured", source="isolated", energy_fraction=.05)
        self.assertTrue(guard("separate", [x], .05))
        self.assertFalse(guard("separate", [replace(x, energy_fraction=math.nextafter(.05, 1))], .05))
        slow = transition(replace(x, energy_fraction=1), "wait", dt=5, tau=4)
        fast = transition(replace(x, energy_fraction=1), "wait", dt=5, tau=1)
        self.assertGreater(slow.energy_fraction, fast.energy_fraction)

    def test_guard_requires_all_candidates_and_nonempty_belief(self):
        locked = State(support="secured", source="isolated", energy_fraction=0)
        partial = replace(locked, host="partial")
        self.assertTrue(guard("release_support", [locked]))
        self.assertFalse(guard("release_support", [locked, partial]))
        self.assertFalse(guard("release_support", []))
        # Unknown observations permit a modeled hold/isolation, not exchange motion.
        unknown = possible_states([], 0, 0)
        self.assertFalse(guard("release_support", unknown))
        self.assertTrue(guard("isolate", unknown))

    def test_restart_stale_future_and_missing_evidence_never_establish_lock(self):
        x = State(support="secured", source="isolated", energy_fraction=0)
        fresh = observe(x, 10, 0)
        self.assertTrue(guard("release_support", possible_states(fresh, 10, 0)))
        future = deepcopy(fresh)
        for item in future:
            item["sampled_at_s"] = 11
        cases = [(fresh, 10, 1), (fresh, 12, 0), (future, 10, 0),
                 (observe(x, 10, 0, missing=True), 10, 0), (observe(x, 10, 0, stale=True), 10, 0)]
        for reports, now, epoch in cases:
            self.assertFalse(guard("release_support", possible_states(reports, now, epoch)))
        self.assertEqual(x.host, "locked")

    def test_false_positive_breaks_assumed_coverage_not_truth(self):
        x = State(host="partial", support="secured", source="isolated", energy_fraction=0)
        reports = observe(x, 0, 0, false_host="locked")
        assumed = possible_states(reports, 0, 0)
        self.assertNotIn(x, assumed)
        self.assertTrue(guard("release_support", assumed))
        self.assertEqual(x.host, "partial")
        after = transition(x, "release_support")
        self.assertTrue(hazards_before_after(x, after, "release_support", True, .05)["retention_loss"])
        # Widening the host assumption blocks this action, at a possible availability cost.
        self.assertFalse(guard("release_support", possible_states(reports, 0, 0, host_untrusted=True)))

    def test_command_ack_is_not_latch_measurement(self):
        ack = observe(State(), 0, 0)[0]
        ack.update(variable="lock_ack")
        ack["reading"]["value"] = "received"
        candidates = possible_states([ack], 0, 0)
        self.assertEqual({s.host for s in candidates}, {"open", "partial", "locked"})
        self.assertFalse(guard("release_support", candidates))

    def test_oracle_checks_connector_event_before_discharge(self):
        before = State(host="open", support="secured", source="isolated")
        after = transition(before, "separate", dt=10)
        self.assertLess(after.energy_fraction, .05)
        self.assertTrue(hazards_before_after(before, after, "separate", True, .05)["unsafe_connector_transition"])

    def test_unsafe_completion_cannot_be_laundered(self):
        separated = State(host="open", support="secured", connector="separated", source="isolated", energy_fraction=0)
        out = outcomes([separated, State()], {"retention_loss": True,
                       "unsafe_energization": False, "unsafe_connector_transition": False}, 10, False, .05)
        self.assertTrue(out["task_completed"]["value"])
        self.assertFalse(out["acceptable_completion"]["value"])
        self.assertEqual(out["exceeded_load_limits"]["status"], "unmeasured")
        self.assertEqual(out["unrecoverable"]["status"], "unknown")

    def test_rejected_step_and_restart_preserve_state(self):
        case = {"initial": {"support": "secured", "source": "isolated", "energy_fraction": 0},
                "steps": [{"action": "hold"}, {"action": "release_support", "restart": True, "old_epoch": True}]}
        record = replay(case)
        self.assertEqual(record["truth_series"][0]["state"], record["truth_series"][-1]["state"])
        self.assertFalse(record["command_series"][-1]["accepted"])
        with self.assertRaises(ValueError):
            replay({"initial": {}, "steps": [{"action": "hold"}] * 33})


if __name__ == "__main__":
    unittest.main(verbosity=2)
