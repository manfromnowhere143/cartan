import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {workspaceFromURL,workspaceURL,parentState,inspectionFacts,PARTS,RECORDS} from '../workspace-state.mjs';
import {projectV1} from '../contract-adapter.mjs';
const parse=s=>workspaceFromURL(new URL(s,'https://cartan.danielwahnich.dev'));
test('every selection round-trips without hidden state, including evidence context',()=>{
  for(const part of PARTS)for(const record of RECORDS) {
    for(const path of ['/laboratory/?detail=interface','/interruption/','/evidence/?from=interruption','/comparison/?from=interruption','/sources/']) {
      const u=new URL(path,'https://cartan.danielwahnich.dev');u.searchParams.set('part',part);u.searchParams.set('record',record);
      const state=parse(u.href),canonical=parse(workspaceURL(state));
      assert.equal(canonical.view,state.view);assert.equal(canonical.part,state.part);
      assert.equal(canonical.detail,state.detail);assert.equal(canonical.from,state.from);
      if(state.view==='evidence')assert.equal(canonical.record,record);
    }
  }
});
test('unknown query states cannot become a selected part or evidence category',()=>{
  assert.deepEqual(parse('/laboratory/?part=thruster&detail=release&record=success&from=control'),{view:'laboratory',part:'module',detail:null,record:'planned',from:null});
  assert.equal(parse('/#interruption').part,'retention');
});
test('Escape follows interface, part and containing view while preserving the object',()=>{
  let s=parse('/evidence/?part=support&from=interruption');
  for(const expected of ['interruption','laboratory','laboratory','laboratory','home']){s=parentState(s);assert.equal(s.view,expected);}
  assert.equal(s.part,'module');
});
test('comparison is exactly the pinned candidates, without derived geometry or probability',()=>{
  const projection=projectV1(JSON.parse(readFileSync(new URL('../vendor/cartan/v1/fixture.json',import.meta.url))));
  const facts=inspectionFacts(projection);
  assert.equal(facts.value,'received');assert.equal(facts.validity,'stale');assert.equal(facts.source,'src-model-proposal');
  assert.deepEqual(facts.candidates.map(c=>c.host),['partial','locked']);assert.equal(facts.assignedHost,'partial');
  assert.deepEqual(Object.keys(facts.candidates[0]),['host','support','connector','source']);
  projection.run.mode='physical_test';assert.throws(()=>inspectionFacts(projection));
});
test('camera, orbit, diagram layout and reading surface round-trip without changing research selection',()=>{
  const s=parse('/laboratory/?part=isolation&detail=interface&camera=profile&az=-175&el=65&layout=separated&render=drawing&notes=closed');
  assert.deepEqual(parse(workspaceURL(s)),s);
  assert.equal(parentState(s).camera,'profile');assert.equal(parentState(s).detail,null);
  for(const query of ['az=176&el=-16','az=NaN&el=2.5','az=Infinity&el=999','az=1e2&el=']){
    const invalid=parse('/laboratory/?'+query);assert.equal(invalid.az,undefined);assert.equal(invalid.el,undefined);
  }
  assert.equal(workspaceURL({...s,view:'home'}),'/');
  assert.equal(parse('/vision/?notes=closed').notes,undefined);
});
