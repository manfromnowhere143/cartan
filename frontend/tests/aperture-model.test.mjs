import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectV1,FIXTURE_HASH} from '../contract-adapter.mjs';
import {apertureModel} from '../evidence-aperture.mjs';
const projection=()=>projectV1(JSON.parse(readFileSync(new URL('../vendor/cartan/v1/fixture.json',import.meta.url),'utf8')));
test('receipt preserves stale time, epoch, authored alternatives and unmeasured outcomes',()=>{
  const p=projection(),m=apertureModel(p);
  assert.deepEqual([m.sampled,m.received,m.epoch,m.validity],[0,1,0,'stale']);
  assert.deepEqual(m.hosts,['partial','locked']);assert.deepEqual(m.support,['secured','secured']);
  assert.equal(m.hash,FIXTURE_HASH);assert.ok(m.outcomes.every(([,v])=>v.startsWith('Not measured')));
  p.belief.candidates[0].host='changed';assert.equal(m.hosts[0],'partial');assert.ok(Object.isFrozen(m));
});
test('empty, inconsistent and non-synthetic projections cannot become a receipt',()=>{
  for(const change of [p=>{p.belief.candidates=[];},p=>{p.belief.status='inconsistent';},p=>{p.run.mode='physical_test';},p=>{p.run.evidence_scope='physical';},p=>{p.observation.reading.basis='measured';}]){
    const p=projection();change(p);assert.throws(()=>apertureModel(p));
  }
  assert.throws(()=>apertureModel());
});
