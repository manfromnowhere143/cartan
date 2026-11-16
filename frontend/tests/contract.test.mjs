import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectV1,formatV1,loadPinnedV1} from '../contract-adapter.mjs';
const bytes=readFileSync(new URL('../vendor/cartan/v1/fixture.json',import.meta.url));
const fixture=JSON.parse(bytes);
const response=data=>({ok:true,arrayBuffer:async()=>new TextEncoder().encode(data).buffer});
test('canonical fixture preserves four series and source IDs',()=>{
  const p=projectV1(fixture);
  assert.equal(p.truth.state.host,'partial'); assert.equal(p.observation.validity,'stale');
  assert.equal(p.command.name,'hold'); assert.deepEqual(p.belief.candidates.map(c=>c.host),['partial','locked']);
  assert.equal(p.bundle.components[1].id,'component-module');
  assert.equal(p.run.outcomes.task_completed.status,'unmeasured');
});
test('canonical absent tags retain units and zero/false',()=>{
  const d={unit:'s',basis:'synthetic',status:'known',value:0};
  assert.equal(formatV1(d),'0 s');
  assert.equal(formatV1({...d,unit:'category',value:false}),'false');
  assert.equal(formatV1({...d,status:'unmeasured',value:null}),'Not measured [s]');
  assert.equal(formatV1({...d,status:'explicit_null',value:null}),'Explicit null [s]');
  assert.throws(()=>formatV1({...d,status:'unknown'}));
});
test('immutable fixture bytes are checked before consumption',async()=>{
  assert.equal((await loadPinnedV1(async()=>response(bytes.toString()))).run.id,'run-ui-fixture-001');
  await assert.rejects(loadPinnedV1(async()=>response(bytes.toString()+' ')),/hash mismatch/);
  await assert.rejects(loadPinnedV1(async()=>({ok:false})),/unavailable/);
});
test('unsupported evidence, missing references and inconsistent belief fail closed',()=>{
  for(const mutation of [
    d=>d.schema_version='2.0.0',
    d=>d.runs[0].mode='physical_test',
    d=>d.runs[0].evidence_scope='model_only',
    d=>d.components[0].geometry_asset_id='absent',
    d=>d.runs[0].belief_series[0].candidates=[],
  ]){const d=structuredClone(fixture);mutation(d);assert.throws(()=>projectV1(d));}
});
