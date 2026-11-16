"""Adversarial boundaries and independent numerical cross-checks."""
from dataclasses import replace
from decimal import Decimal, localcontext
from fractions import Fraction
import unittest

from bounds import exp_negative_bounds, intersection, voltage_upper, waiting_certificate
from evidence import CountingB0, PossibleStateC, Report, all_required


class CertificateTests(unittest.TestCase):
    def test_duplicate_is_one_acquisition_for_both_policies(self):
        for cls in (CountingB0, PossibleStateC):
            model = cls(1)
            packet = Report("a", 1, 0, 0)
            self.assertEqual(model.ingest(packet, 0), ("accepted", "unresolved"))
            self.assertEqual(model.ingest(replace(packet, received_at=1), 1), ("duplicate", "unresolved"))
            self.assertEqual(model.candidates, {0, 1})

    def test_conflicting_id_revokes_inference(self):
        for cls in (CountingB0, PossibleStateC):
            model = cls(0)
            model.ingest(Report("a", 1, 0, 0), 0)
            self.assertEqual(model.ingest(Report("a", 0, 0, 0), 0), ("conflicting_acquisition", "inconsistent"))
            model.ingest(Report("b", 1, 1, 1), 1)
            self.assertEqual(model.candidates, set())

    def test_invalid_freshness_missing_identity_and_types_add_no_information(self):
        packets = [Report("old", 1, 0, 0), Report("future", 1, 3, 3),
                   Report("epoch", 1, 2, 2, epoch=1), Report("missing", None, 2, 2, validity="missing"),
                   Report("false-is-not-zero", False, 2, 2), Report("source", 1, 2, 2, source="unknown"),
                   Report("time", 1, 2, 1), Report("", 1, 2, 2)]
        for cls in (CountingB0, PossibleStateC):
            model = cls(0)
            for packet in packets:
                admission, decision = model.ingest(packet, 2)
                self.assertNotEqual(admission, "accepted")
                self.assertEqual(decision, "unresolved")

    def test_restart_revokes_old_certificate_and_requires_new_epoch(self):
        for cls in (CountingB0, PossibleStateC):
            model = cls(0)
            model.ingest(Report("a", 1, 0, 0), 0)
            self.assertEqual(model.candidates, {1})
            model.restart(1)
            self.assertEqual(model.candidates, {0, 1})
            self.assertEqual(model.ingest(Report("b", 1, 1, 1), 1)[0], "old_or_unknown_epoch")
            self.assertEqual(model.ingest(Report("c", 0, 1, 1, epoch=1), 1)[1], "not_locked")
            with self.assertRaises(ValueError):
                model.restart(1)

    def test_inconsistent_history_does_not_become_permission(self):
        for cls in (CountingB0, PossibleStateC):
            model = cls(1)
            for i, bit in enumerate((0, 0, 1, 1)):
                _, decision = model.ingest(Report(str(i), bit, i, i), i)
            self.assertEqual(decision, "inconsistent")

    def test_wrong_fault_bound_can_give_wrong_nonempty_certificate(self):
        model = PossibleStateC(1)
        for i in range(2):
            model.ingest(Report(str(i), 1, i, i), i)
        self.assertEqual(model.candidates, {1})  # Wrong if true bit is 0: two corruptions violate k=1.
        unconstrained = PossibleStateC(None)
        for i in range(8):
            unconstrained.ingest(Report(str(i), 1, i, i), i)
        self.assertEqual(unconstrained.candidates, {0, 1})

    def test_observation_budget_and_parameter_caps(self):
        for cls in (CountingB0, PossibleStateC):
            with self.assertRaises(ValueError):
                cls(True)
            model = cls(None)
            for i in range(32):
                model.ingest(Report(str(i), 1, i, i), i)
            with self.assertRaises(ValueError):
                model.ingest(Report("33", 1, 33, 33), 33)

    def test_closed_endpoint_and_edge_are_not_disjoint(self):
        result = intersection(((0, 1),), ((1, 2),))
        self.assertFalse(result["disjoint"])
        self.assertEqual(result["volume"], 0)
        self.assertEqual(result["witness"], (Fraction(1),))
        result = intersection(((0, 1), (0, 1)), ((1, 2), (0, 1)))
        self.assertFalse(result["disjoint"])
        self.assertEqual(result["volume"], 0)

    def test_tiny_gap_and_invalid_intervals(self):
        self.assertTrue(intersection(((0, 1),), ((Fraction(1) + Fraction(1, 10**50), 2),))["disjoint"])
        for a, b in ((((2, 1),), ((0, 1),)), (((0., 1.),), ((0, 1),)), (((0, 1),), ((0, 1), (0, 1)))):
            with self.assertRaises(ValueError):
                intersection(a, b)

    def test_exponential_bounds_against_separate_high_precision_evaluation(self):
        for value in ("0", "1/10", "1/2", "1", "2", "4", "8", "16", "32"):
            x = Fraction(value)
            lower, upper = exp_negative_bounds(x)
            with localcontext() as context:
                context.prec = 70
                numerical = Fraction((-Decimal(x.numerator)/Decimal(x.denominator)).exp())
            self.assertLessEqual(lower, numerical)
            self.assertLessEqual(numerical, upper)
            self.assertGreaterEqual(lower, 0)
            self.assertLessEqual(upper, 1)
        for x in (-1, 33, .1):
            with self.assertRaises(ValueError):
                exp_negative_bounds(x)

    def test_waiting_uses_worst_tau_and_backfeed(self):
        self.assertEqual(waiting_certificate(2, 0)["wait_s"], 5)
        self.assertEqual(waiting_certificate(4, "1/20")["wait_s"], 12)
        self.assertEqual(waiting_certificate(4, "1/10")["status"], "no_finite_passive_wait_certificate")
        self.assertGreater(voltage_upper(10, 4, "1/20"), voltage_upper(10, 2, 0))
        with self.assertRaises(ValueError):
            waiting_certificate(0, 0)

    def test_certifying_one_fact_is_not_complete_authority(self):
        self.assertFalse(all_required({"retention": True}))
        conditions = dict.fromkeys(("retention", "support", "contact", "load", "circuit", "time"), True)
        self.assertTrue(all_required(conditions))
        conditions["circuit"] = None
        self.assertFalse(all_required(conditions))
        conditions["circuit"] = 1
        self.assertFalse(all_required(conditions))
        # Fault identity can stay ambiguous while the same precondition is known.
        worlds = [(1, "nominal"), (1, "failed-display")]
        self.assertTrue(all(retained == 1 for retained, _ in worlds))
        self.assertEqual(len({fault for _, fault in worlds}), 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)
