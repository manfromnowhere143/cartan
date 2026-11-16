from copy import deepcopy
from fractions import Fraction
from itertools import product
import json
from pathlib import Path
import unittest

from model import number, topology, voltage

CONFIG=json.loads((Path(__file__).parent/'cases.json').read_text())


class ObservationBoundaries(unittest.TestCase):
    def base(self):
        return deepcopy(CONFIG['voltage_cases'][0]['input'])

    def test_zero_is_known_and_has_no_isolation_implication(self):
        result=voltage(self.base())
        self.assertEqual(result['status'],'supported')
        self.assertEqual(result['interval_V'],['-1/10','1/10'])
        self.assertEqual(result['source_isolation'],'not_assessed')
        self.assertEqual(result['stored_energy'],'not_assessed')

    def test_negative_polarity_limit_is_not_missed(self):
        data=self.base()
        data['report']['value_V']=['-2','-2']
        self.assertEqual(voltage(data)['status'],'refuted')

    def test_interval_contains_interior_gain_bias_error_time_values(self):
        data=self.base()
        data['report']['value_V']=['-1','2']
        data['model'].update(gain=['1/2','2'],bias_V=['-1','1'],error_V='1/5',rate_V_per_s='1/2')
        data['query']['time_s']='1'
        lo,hi=map(Fraction,voltage(data)['interval_V'])
        for y,g,b,e,d in product((-1,Fraction(1,2),2),(Fraction(1,2),1,2),(-1,0,1),(-Fraction(1,5),0,Fraction(1,5)),(-Fraction(1,2),0,Fraction(1,2))):
            value=(y-b-e)/g+d
            self.assertLessEqual(lo,value)
            self.assertLessEqual(value,hi)

    def test_clock_uncertainty_uses_oldest_possible_acquisition(self):
        data=self.base()
        data['report'].update(sampled_s=['0','1'],received_s='1')
        data['query']['time_s']='2'
        data['model'].update(rate_V_per_s='1',max_age_s='2')
        result=voltage(data)
        self.assertEqual(result['maximum_age_s'],'2')
        self.assertEqual(result['interval_V'],['-21/10','21/10'])

    def test_unknown_rate_coverage_and_fault_never_become_zero_error(self):
        for patch in ({'rate_V_per_s':None},{'gain':None},{'kind':'coverage'},{'fault':'arbitrary'}):
            data=self.base(); data['model'].update(patch)
            result=voltage(data)
            self.assertEqual(result['status'],'unresolved')
            self.assertIsNone(result['interval_V'])

    def test_missing_statuses_remain_distinct(self):
        for status in ('unknown','missing','unmeasured','explicit_null','invalid'):
            data=self.base(); data['report'].update(status=status,value_V=None)
            result=voltage(data)
            self.assertEqual(result['status'],'unresolved')
            self.assertEqual(result['input']['report']['status'],status)

    def test_bad_numeric_inputs_fail_without_float_tolerance(self):
        for value in (0,True,'nan','1/0','1e9','9'*33):
            with self.assertRaises(ValueError): number(value)
        data=self.base(); data['model']['gain']=['0','1']
        with self.assertRaises(ValueError): voltage(data)

    def test_no_state_aliasing_or_physical_clearance(self):
        data=self.base(); before=deepcopy(data)
        result=voltage(data)
        result['input']['query']['limit_V']='999'
        self.assertEqual(data,before)
        self.assertEqual(result['physical_authorization'],'not_assessed')

    def test_connected_witness_is_an_actual_declared_path(self):
        data=deepcopy(CONFIG['topology_cases'][3]['input'])
        result=topology(data)
        path=result['connected_witness']['source_path']
        self.assertIn(path[0],data['sources'])
        self.assertEqual(path[-1],data['target'])
        active={(e['a'],e['b']) for e in data['edges'] if result['connected_witness']['assignment'][e['id']]}
        for a,b in zip(path,path[1:]):
            self.assertTrue((a,b) in active or (b,a) in active)
        self.assertEqual(result['status'],'refuted')

    def test_incomplete_inventory_and_common_closure_are_preserved(self):
        data=deepcopy(CONFIG['topology_cases'][0]['input'])
        data['inventory_complete']=False
        self.assertEqual(topology(data)['status'],'unresolved')
        common=topology(CONFIG['topology_cases'][5]['input'])
        self.assertEqual(common['status'],'unresolved')
        self.assertEqual(common['connected_witness']['assignment'],{'relay1':True,'relay2':True})

    def test_topology_caps_and_boolean_domains(self):
        with self.assertRaisesRegex(ValueError,'assignment cap'):
            topology(CONFIG['topology_cases'][10]['input'])
        data=deepcopy(CONFIG['topology_cases'][0]['input'])
        data['edges'][0]['closed_states']=[0]
        with self.assertRaises(ValueError): topology(data)


if __name__=='__main__':
    unittest.main()
