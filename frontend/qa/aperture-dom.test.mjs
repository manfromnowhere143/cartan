import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './interior-dom-fixture.mjs';
const wait=()=>new Promise(r=>setTimeout(r,60));
const open=async f=>{f.click(f.d.querySelector('#open-record'));await wait();return f.d.querySelector('#evidence-aperture');};
test('record is lazy and uses the same verified request as the evidence view',async()=>{
  const f=await fixture();assert.equal(f.d.querySelector('#evidence-aperture'),null);assert.equal(f.requests.length,0);
  f.click(f.d.querySelector('.primary'));const route=f.w.location.href;
  const dialog=await open(f);assert.equal(dialog.open,true);assert.equal(f.d.activeElement.id,'aperture-title');
  assert.equal(f.requests.length,1);assert.equal(dialog.querySelector('.aperture-content').hidden,false);
  assert.equal(dialog.querySelector('[data-ap="timing"]').textContent,'0 s / 1 s');
  f.click(dialog.querySelector('[data-reading="possibilities"]'));assert.equal(dialog.dataset.reading,'possibilities');
  assert.equal(dialog.querySelector('[data-ap="hosts"]').textContent,'partial / locked');
  f.click(dialog.querySelector('[data-reading="source"]'));assert.match(dialog.querySelector('[data-ap="outcomes"]').textContent,/Not measured/);
  f.click(dialog.querySelector('.aperture-close'));assert.equal(dialog.open,false);assert.equal(f.d.activeElement.id,'open-record');assert.equal(f.w.location.href,route);
  f.click(f.d.querySelector('#rail-evidence'));await wait();assert.equal(f.requests.length,1);await f.close();
});
test('Escape closes the receipt without navigating the laboratory',async()=>{
  const f=await fixture({url:'/laboratory/?part=support&camera=profile'}),route=f.w.location.href,dialog=await open(f);
  dialog.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
  assert.equal(dialog.open,false);assert.equal(f.w.location.href,route);assert.equal(f.d.activeElement.id,'open-record');await f.close();
});
test('late verification cannot reopen a dismissed record or expose states',async()=>{
  const f=await fixture({url:'/laboratory/',slow:true}),dialog=await open(f);
  assert.equal(dialog.querySelector('.aperture-content').hidden,true);f.click(dialog.querySelector('.aperture-close'));f.resolveFetch();await wait();
  assert.equal(dialog.open,false);assert.equal(dialog.querySelector('.aperture-content').hidden,true);await f.close();
});
test('a corrupt fixture presents unavailable, with no visible possibilities',async()=>{
  const f=await fixture({url:'/laboratory/',broken:true}),dialog=await open(f);
  assert.equal(dialog.querySelector('.aperture-content').hidden,true);assert.match(dialog.querySelector('.aperture-status').textContent,/could not be verified/);
  f.click(dialog.querySelector('.aperture-close'));assert.equal(dialog.open,false);await f.close();
});
test('rapid reopening owns the latest context and tolerates queued native close',async()=>{
  const f=await fixture({url:'/laboratory/'}),dialog=await open(f);
  f.click(dialog.querySelector('.aperture-close'));f.click(f.d.querySelector('[data-component="support"]'));
  await open(f);dialog.dispatchEvent(new f.w.Event('close'));await wait();
  assert.equal(dialog.open,true);assert.equal(dialog.querySelector('.aperture-content').hidden,false);
  assert.equal(dialog.querySelector('[data-ap="context"]').textContent,f.d.querySelector('#component-title').textContent);await f.close();
});
test('history navigation dismisses the modal instead of stranding an inert page',async()=>{
  const f=await fixture(),dialogPromise=(async()=>{f.click(f.d.querySelector('.primary'));return open(f);})();
  const dialog=await dialogPromise;f.w.history.back();await wait();assert.equal(dialog.open,false);assert.equal(f.d.documentElement.dataset.view,'home');await f.close();
});
test('Tab wraps the visible controls in both directions',async()=>{
  const f=await fixture({url:'/laboratory/'}),dialog=await open(f),first=dialog.querySelector('.aperture-close'),last=dialog.querySelector('[data-reading="source"]');
  last.focus();last.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(f.d.activeElement,first);
  first.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));assert.equal(f.d.activeElement,last);await f.close();
});
test('Escape while the lazy code loads cancels the opening intent',async()=>{
  const f=await fixture({url:'/laboratory/'}),route=f.w.location.href;
  f.click(f.d.querySelector('#open-record'));f.d.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));await wait();
  assert.ok(!f.d.querySelector('#evidence-aperture')?.open);assert.equal(f.w.location.href,route);assert.equal(f.d.querySelector('#record-entry-status').textContent,'');assert.equal(f.requests.length,0);await f.close();
});
