"""Boundary tests for the declared logical evaluator, not hardware validation."""
from copy import deepcopy
import unittest

from engine import evaluate, worlds
from run_analysis import expand


def reports(*items):
    return expand(list(items))


class EvidenceBoundaryTests(unittest.TestCase):
    def test_acknowledgements_never_bind_physical_facts(self):
        for profile in ("preliminary_vocabulary", "synthetic_direct"):
            for quantity in ("receipt_ack", "processed_ack"):
                result = evaluate("release_support", reports({"quantity": quantity, "value": True}), profile)
                self.assertEqual(result["status"], "unresolved")
                self.assertEqual(len(result["remaining_worlds"]), 64)
                self.assertEqual(result["reports"][0]["disposition"], "command_report_only")

    def test_raw_telemetry_has_no_unvalidated_mapping(self):
        for quantity, value in (("bus_voltage", 0), ("controller_power", "off"), ("locking_ring_position", 255)):
            result = evaluate("disconnect", reports({"quantity": quantity, "value": value}), "synthetic_direct")
            self.assertEqual(len(result["remaining_worlds"]), 64)
            self.assertEqual({w["source_isolated"] for w in result["remaining_worlds"]}, {True, False})
            self.assertIsNone(result["reports"][0]["constraint"])

    def test_distinct_mechanical_electrical_controller_facts(self):
        result = evaluate("release_support", reports({"quantity": "retained", "value": True}), "synthetic_direct")
        self.assertEqual(result["status"], "admissible")
        self.assertEqual(len(result["remaining_worlds"]), 32)
        self.assertTrue(any(not w["contacts_made"] for w in result["remaining_worlds"]))
        self.assertTrue(any(w["contacts_made"] and not w["controller_on"] for w in result["remaining_worlds"]))
        self.assertEqual(result["physical_authorization"], "not_assessed")
        self.assertTrue(any("fault-free" in a for a in result["assumptions"]))

    def test_witnesses_explain_unresolved_and_empty_domains(self):
        result = evaluate("release_support", [])
        self.assertTrue(result["supporting_witness"]["assignment"]["retained"])
        self.assertFalse(result["contradicting_witness"]["assignment"]["retained"])
        for key in ("supporting_witness", "contradicting_witness"):
            self.assertIn(result[key]["assignment"], result["remaining_worlds"])
        empty = evaluate("release_support", [], domain=[])
        self.assertEqual(empty["status"], "inconsistent")
        self.assertIsNone(empty["supporting_witness"])
        self.assertIsNone(empty["contradicting_witness"])

    def test_freshness_and_epoch_revoke_logical_support(self):
        data = reports({"quantity": "retained", "value": True})
        self.assertEqual(evaluate("release_support", data, "synthetic_direct", now=1)["status"], "admissible")
        for arguments, reason in (({"now": 2}, "stale"), ({"epoch": 1}, "old_or_unknown_epoch")):
            result = evaluate("release_support", data, "synthetic_direct", **arguments)
            self.assertEqual(result["status"], "unresolved")
            self.assertEqual(result["reports"][0]["disposition"], reason)

    def test_duplicate_arrivals_add_no_information(self):
        data = reports({"id": "one", "quantity": "retained", "value": True})
        repeated = data + [dict(data[0], received_at=1)]
        first = evaluate("release_support", data, "synthetic_direct", now=1)
        second = evaluate("release_support", repeated, "synthetic_direct", now=1)
        self.assertEqual(first["remaining_worlds"], second["remaining_worlds"])
        self.assertEqual(second["reports"][1]["disposition"], "duplicate")
        # An invalid future arrival must not suppress a valid copy in this batch.
        repaired = evaluate("release_support", [dict(data[0], received_at=1)] + data, "synthetic_direct", now=0)
        self.assertEqual(repaired["status"], "admissible")

    def test_conflicting_identity_is_inconsistent_even_when_stale(self):
        data = reports({"id": "one", "quantity": "retained", "value": True},
                       {"id": "one", "quantity": "retained", "value": False})
        for now in (0, 2):
            result = evaluate("release_support", data, "synthetic_direct", now=now)
            self.assertEqual(result["status"], "inconsistent")
            self.assertIsNone(result["supporting_witness"])
        missing = [data[0], dict(data[0], status="missing", value=None)]
        self.assertEqual(evaluate("release_support", missing, "synthetic_direct")["status"], "inconsistent")

    def test_zero_false_and_null_are_distinct(self):
        for status in ("unknown", "missing", "unmeasured", "not_applicable", "explicit_null", "invalid"):
            data = reports({"quantity": "retained", "status": status, "value": None})
            result = evaluate("release_support", data, "synthetic_direct")
            self.assertEqual(result["status"], "unresolved")
            self.assertEqual(result["reports"][0]["report"]["status"], status)
        false = reports({"quantity": "retained", "value": False})
        self.assertEqual(evaluate("release_support", false, "synthetic_direct")["status"], "refuted")
        for number in (0, 1):
            with self.assertRaisesRegex(ValueError, "requires a Boolean"):
                evaluate("release_support", reports({"quantity": "retained", "value": number}), "synthetic_direct")
        true = reports({"id": "same", "quantity": "retained", "value": True})
        with self.assertRaisesRegex(ValueError, "requires a Boolean"):
            evaluate("release_support", true + [dict(true[0], value=1)], "synthetic_direct")

    def test_rejects_scope_and_malformed_reports(self):
        base = reports({"quantity": "retained", "value": True})[0]
        for patch in ({"mode": "physical_test"}, {"value": None}, {"value": float("nan")},
                      {"quantity": []}, {"status": []}, {"sampled_at": True}, {"extra": 1}):
            with self.assertRaises(ValueError):
                evaluate("release_support", [dict(base, **patch)])
        with self.assertRaises(ValueError):
            evaluate("release_support", [], "claimed_vendor_driver")

    def test_caps_and_world_validation(self):
        for data in ([None] * 33, {}):
            with self.assertRaises(ValueError):
                evaluate("release_support", data)
        for domain in ([None], [worlds()[0]] * 2, worlds() + [worlds()[0]]):
            with self.assertRaises(ValueError):
                evaluate("release_support", [], domain=domain)
        with self.assertRaises(ValueError):
            evaluate("release_support", [], now=True)

    def test_caller_cannot_mutate_declared_predicate_through_result(self):
        data = reports({"quantity": "retained", "value": True})
        before = deepcopy(data)
        result = evaluate("release_support", data, "synthetic_direct")
        result["requirements"]["retained"] = False
        result["reports"][0]["report"]["value"] = False
        self.assertEqual(data, before)
        self.assertEqual(evaluate("release_support", data, "synthetic_direct")["status"], "admissible")


if __name__ == "__main__":
    unittest.main()
