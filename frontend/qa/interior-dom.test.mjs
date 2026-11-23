// Actual application handlers in jsdom. No layout, native touch or AT claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './interior-dom-fixture.mjs';
const wait=()=>new Promise(r=>setTimeout(r,35));
const state=f=>f.d.querySelector('.surface.active').dataset.view;
const click=(f,s)=>f.click(f.d.querySelector(s));
test('complete lab / part / interface / interruption / evidence / return sequence',async()=>{
  const f=await fixture();const scene=f.d.querySelector('#module-scene');
  assert.equal(f.requests.length,0,'no fixture request on hero entry');
  click(f,'.primary');click(f,'[data-component="retention"]');
  assert.equal(f.w.location.search,'?part=retention');assert.equal(f.requests.length,0);
  click(f,'#interface-open');assert.equal(f.d.querySelector('#interface-detail').hidden,false);
  assert.equal(f.d.activeElement.id,'interface-title');
  click(f,'#inspect-transfer');await wait();
  assert.equal(state(f),'interruption');assert.equal(f.requests.length,1);
  assert.equal(f.d.querySelector('#possible-states').hidden,false);
  assert.deepEqual([...f.d.querySelectorAll('.candidate-state h3')].map(n=>n.textContent),['partial','locked']);
  click(f,'#inspect-evidence');assert.equal(state(f),'evidence');
  assert.match(f.w.location.search,/from=interruption/);
  click(f,'#return-transfer');assert.equal(state(f),'interruption');assert.equal(f.d.activeElement.id,'inspect-evidence');
  f.d.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(state(f),'laboratory');assert.equal(f.d.activeElement.id,'inspect-transfer');
  assert.equal(f.d.querySelector('#module-scene'),scene,'same scene node across the entire sequence');
  await f.close();
});
test('Back and Forward restore selection, disclosure and focus',async()=>{
  const f=await fixture({width:1440});click(f,'.primary');click(f,'[data-component="retention"]');
  click(f,'#interface-open');click(f,'#inspect-transfer');await wait();
  f.w.history.back();await wait();
  assert.equal(state(f),'laboratory');assert.equal(f.d.querySelector('#interface-detail').hidden,false);
  assert.equal(f.d.activeElement.id,'inspect-transfer');
  f.w.history.forward();await wait();assert.equal(state(f),'interruption');
  f.w.history.back();await wait();f.w.history.back();await wait();
  assert.equal(f.d.querySelector('#interface-detail').hidden,true);assert.equal(f.d.activeElement.id,'interface-open');
  await f.close();
});
test('rapid object reselection and Escape are synchronous, without stale reveal',async()=>{
  const f=await fixture({url:'/laboratory/?part=retention&detail=interface'});
  for(let i=0;i<25;i++){click(f,'[data-component="isolation"]');click(f,'#interface-open');click(f,'[data-component="support"]');}
  assert.equal(new URLSearchParams(f.w.location.search).get('part'),'support');assert.equal(f.d.querySelector('#interface-detail').hidden,true);
  assert.equal(f.d.querySelector('[data-geometry="support"]').classList.contains('selected'),true);
  assert.equal(f.d.activeElement.id,'part-support');
  f.d.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(f.w.location.pathname,'/laboratory/');assert.equal(new URLSearchParams(f.w.location.search).has('part'),false);
  await f.close();
});
test('direct URLs and legacy aliases reach the same state without creating history',async()=>{
  for(const url of ['/laboratory/?part=isolation&detail=interface','/#interruption','/evidence/?record=physical_test&part=retention&from=interruption']) {
    const f=await fixture({url});await wait();assert.equal(f.w.history.length,1);
    assert.equal(f.d.querySelectorAll('.surface:not([hidden])').length,1);
    if(url.includes('isolation')){assert.equal(f.d.querySelector('#interface-detail').hidden,false);assert.match(f.d.querySelector('#interface-description').textContent,/voltage readback alone/);}
    if(url.includes('physical_test'))assert.match(f.d.querySelector('#evidence-kind').textContent,/NO RECORD/);
    await f.close();
  }
});
test('corrupt or missing fixture never exposes invented candidate states',async()=>{
  const f=await fixture({url:'/interruption/',broken:true});await wait();
  assert.equal(f.d.querySelector('#possible-states').hidden,true);
  assert.equal(f.d.querySelectorAll('.candidate-state').length,0);
  assert.equal(f.d.querySelector('#example-observation').textContent,'Unavailable');
  assert.match(f.d.querySelector('#fixture-banner').textContent,/CONTRACT UNAVAILABLE/);await f.close();
});
test('late fixture arrival cannot change a newer route, part or focused control',async()=>{
  const f=await fixture({url:'/interruption/',slow:true});
  click(f,'[data-component="isolation"]');click(f,'#interface-open');
  f.resolveFetch();await wait();
  assert.equal(state(f),'laboratory');assert.match(f.w.location.search,/part=isolation&detail=interface/);
  assert.equal(f.d.activeElement.id,'interface-title');await f.close();
});
test('reduced motion and data saving preserve the complete sequence without hero source',async()=>{
  for(const prefs of [{reduced:true},{saveData:true}]){
    const f=await fixture(prefs);click(f,'.primary');click(f,'[data-component="retention"]');click(f,'#interface-open');click(f,'#inspect-transfer');await wait();
    assert.equal(f.d.querySelector('#possible-states').hidden,false);assert.equal(f.d.querySelector('#hero-video').hasAttribute('src'),false);await f.close();
  }
});
test('film Escape stays native and does not navigate the underlying workspace',async()=>{
  const f=await fixture();click(f,'.film-open');f.d.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(state(f),'home');assert.equal(f.d.querySelector('#film-dialog').open,true,'jsdom does not implement native Escape; application leaves it alone');
  click(f,'#film-close');assert.equal(f.d.activeElement.className,'film-open');await f.close();
});
test('research, sources, comparisons and vision retain a meaningful exit and object identity',async()=>{
  const f=await fixture({width:1440}),scene=f.d.querySelector('#module-scene');
  click(f,'.site-header nav a[href="/research/"]');assert.equal(state(f),'question');
  click(f,'.question a[href^="/sources/"]');assert.equal(state(f),'sources');
  click(f,'#view-back');assert.equal(state(f),'question');
  click(f,'.question a[href^="/comparison/"]');assert.equal(state(f),'comparison');
  click(f,'#view-back');assert.equal(state(f),'evidence');await wait();
  click(f,'.edition');assert.equal(state(f),'vision');assert.equal(scene.hidden,true);
  click(f,'.vision a[href^="/research/"]');assert.equal(state(f),'question');
  assert.equal(scene.hidden,false);assert.equal(f.d.querySelector('#module-scene'),scene);
  assert.equal(f.d.querySelectorAll('.surface:not([hidden])').length,1);await f.close();
});
