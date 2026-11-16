import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readFixture, formatDatum, evidenceState} from '../adapter.mjs';
const fixture = JSON.parse(readFileSync(new URL('../data/fixture.json', import.meta.url)));
test('fixture survives without evidence promotion', () => {
  const result = readFixture(fixture); assert.notEqual(result, fixture);
  assert.equal(result.mode, 'synthetic_fixture');
  for (const mode of ['simulation','physical_test','illustration']) assert.throws(() => readFixture({...fixture, mode}));
  assert.throws(() => readFixture({...fixture, schema:'cartan/v1'}));
});
test('unknown, absence, null, zero and false remain distinct', () => {
  assert.equal(formatDatum({state:'value',value:0,unit:'s'}),'0 s');
  assert.equal(formatDatum({state:'value',value:false}),'false');
  const states=['unknown','missing','unmeasured','not_applicable','null'];
  assert.equal(new Set(states.map(state=>formatDatum({state}))).size,5);
  assert.throws(()=>formatDatum({state:'unknown',value:0}));
  assert.throws(()=>formatDatum({state:'value',value:null}));
  assert.throws(()=>formatDatum({state:'value',value:Infinity}));
});
test('fabricated outcomes and incomplete provenance are rejected', () => {
  assert.throws(()=>readFixture({...fixture,outcomes:{...fixture.outcomes,completion:{state:'value',value:true}}}));
  assert.throws(()=>readFixture({...fixture,source:''}));
  assert.throws(()=>readFixture({...fixture,limitations:[]}));
});
test('missing and inconclusive views cannot imply success', () => {
  assert.match(evidenceState('simulation')[0],/No simulation/);
  assert.match(evidenceState('physical_test')[0],/No physical/);
  assert.match(evidenceState('inconclusive')[1],/Presentation example only/);
  assert.throws(()=>evidenceState('success'));
});
