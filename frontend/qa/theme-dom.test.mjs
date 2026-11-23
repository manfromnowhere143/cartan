// Application DOM behavior. Not native browser paint, keyboard, layout or AT.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './interior-dom-fixture.mjs';
const wait=()=>new Promise(r=>setTimeout(r,35));
const button=f=>f.d.querySelector('#theme-toggle');
const theme=f=>f.d.documentElement.dataset.theme;
test('default light exposes one native switch without starting scene or evidence loading',async()=>{
  const f=await fixture();assert.equal(theme(f),'light');assert.equal(button(f).hidden,false);
  assert.equal(button(f).tagName,'BUTTON');assert.equal(button(f).getAttribute('role'),'switch');
  assert.equal(button(f).getAttribute('aria-label'),'Dark appearance');assert.equal(button(f).getAttribute('aria-checked'),'false');
  assert.equal(f.requests.length,0);assert.deepEqual(f.imports,[]);await f.close();
});
test('saved dark is present across all eight direct URLs',async()=>{
  for(const url of ['/','/research/','/laboratory/','/interruption/','/evidence/','/comparison/','/sources/','/vision/']){
    const f=await fixture({url,storedTheme:'dark'});assert.equal(theme(f),'dark');
    assert.equal(button(f).getAttribute('aria-checked'),'true');assert.equal(f.d.querySelector('meta[name="color-scheme"]').content,'dark');await f.close();
  }
});
test('repeated toggling preserves selection, history, focus, reading position and scene identity',async()=>{
  const f=await fixture({url:'/research/?part=isolation&camera=interface&layout=separated'}),scene=f.d.querySelector('#module-scene'),svg=scene.querySelector('svg'),panel=f.d.querySelector('.surface.active');
  const href=f.w.location.href,length=f.w.history.length;panel.scrollTop=120;
  assert.equal(scene.querySelector('#spatial-viewport').getAttribute('aria-describedby'),'scene-function');
  assert.equal(f.d.querySelector('#scene-function').hasAttribute('aria-hidden'),false);
  const points=()=>[...svg.querySelectorAll('polygon')].map(p=>p.getAttribute('points'));
  const before=points(),colors=[...svg.querySelectorAll('polygon')].map(p=>p.getAttribute('fill'));
  f.click(button(f));assert.equal(theme(f),'dark');assert.equal(f.w.localStorage.getItem('cartan.appearance'),'dark');
  assert.deepEqual(points(),before);assert.notDeepEqual([...svg.querySelectorAll('polygon')].map(p=>p.getAttribute('fill')),colors);
  for(let i=0;i<12;i++)f.click(button(f));
  assert.equal(f.w.location.href,href);assert.equal(f.w.history.length,length);assert.equal(f.d.activeElement,button(f));assert.equal(panel.scrollTop,120);
  assert.equal(f.d.querySelector('#module-scene'),scene);assert.equal(f.d.querySelectorAll('.spatial-canvas').length,1);
  assert.equal(button(f).getAttribute('aria-label'),'Dark appearance');await f.close();
});
test('appearance stays independent of route navigation and native Back state',async()=>{
  const f=await fixture({url:'/laboratory/?part=retention'});f.click(button(f));
  f.click(f.d.querySelector('#interface-open'));f.w.history.back();await wait();
  assert.equal(theme(f),'dark');assert.equal(f.d.querySelector('#interface-detail').hidden,true);assert.equal(f.d.activeElement.id,'interface-open');await f.close();
});
test('theme changes preserve the approved media source, time and user pause',async()=>{
  const f=await fixture(),video=f.d.querySelector('#hero-video');
  const src=video.src;video.currentTime=9;f.click(f.d.querySelector('#motion-toggle'));assert.equal(video.paused,true);
  f.click(button(f));f.click(button(f));assert.equal(video.src,src);assert.equal(video.currentTime,9);assert.equal(video.paused,true);
  assert.deepEqual(f.imports,[]);await f.close();
});
test('blocked storage preserves a working session choice and navigation',async()=>{
  const f=await fixture({storageBlocked:true});assert.equal(theme(f),'light');f.click(button(f));assert.equal(theme(f),'dark');
  f.w.dispatchEvent(new f.w.Event('pageshow'));assert.equal(theme(f),'dark');f.click(f.d.querySelector('.primary'));await wait();
  assert.equal(f.d.querySelector('.surface.active').dataset.view,'laboratory');assert.equal(theme(f),'dark');await f.close();
});
test('write-only storage failure cannot undo the current choice on page restoration',async()=>{
  const f=await fixture({storedTheme:'dark'});
  f.w.Storage.prototype.setItem=()=>{throw new f.w.DOMException('Quota exceeded','QuotaExceededError');};
  f.click(button(f));assert.equal(theme(f),'light');assert.equal(f.w.localStorage.getItem('cartan.appearance'),'dark');
  f.w.dispatchEvent(new f.w.Event('pageshow'));assert.equal(theme(f),'light');await f.close();
});
test('cross-tab storage sync accepts only the appearance key and explicit dark state',async()=>{
  const f=await fixture({url:'/laboratory/'});
  const event=(key,value,area=f.w.localStorage)=>f.w.dispatchEvent(new f.w.StorageEvent('storage',{key,newValue:value,storageArea:area}));
  event('other','dark');assert.equal(theme(f),'light');event('cartan.appearance','dark',f.w.sessionStorage);assert.equal(theme(f),'light');
  event('cartan.appearance','dark');assert.equal(theme(f),'dark');event('cartan.appearance','invalid');assert.equal(theme(f),'light');
  event('cartan.appearance','dark');event(null,null);assert.equal(theme(f),'light');await f.close();
});
test('non-pointer activation retains focus eligibility and stable switch semantics',async()=>{
  const f=await fixture({reduced:true});button(f).focus();f.click(button(f),{pointer:false,detail:0});
  assert.equal(f.d.activeElement,button(f));assert.equal(button(f).dataset.pointerFocus,undefined);
  assert.equal(button(f).getAttribute('aria-checked'),'true');assert.equal(button(f).getAttribute('aria-label'),'Dark appearance');await f.close();
});
test('theme changes cannot revive a scene after returning to the opening',async()=>{
  const f=await fixture({url:'/laboratory/'}),scene=f.d.querySelector('#module-scene');
  f.click(f.d.querySelector('.brand'));const draws=scene.dataset.draws;
  f.click(button(f));await wait();assert.equal(scene.dataset.draws,draws);assert.equal(scene.hidden,true);
  f.click(f.d.querySelector('.primary'));await wait();assert.equal(scene.hidden,false);assert.equal(theme(f),'dark');await f.close();
});
