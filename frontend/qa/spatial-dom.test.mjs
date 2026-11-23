// Application DOM and renderer lifecycle checks. No layout, GPU, native touch or AT claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mountSpatialScene} from '../spatial-scene.mjs';
import {fixture} from './interior-dom-fixture.mjs';
const {JSDOM}=createRequire(import.meta.url)(process.env.CARTAN_JSDOM_MODULE);
const wait=()=>new Promise(r=>setTimeout(r,35));
const click=(f,s)=>f.click(f.d.querySelector(s));
const base={view:'laboratory',part:'module'};
function rig({reduced=false,forced=false,saveData=false,gpu=true,late=false,unavailable=false}={}){
  const dom=new JSDOM('<aside><div id="spatial-viewport" tabindex="0"><svg class="module-drawing"></svg></div></aside>',{pretendToBeVisual:true});
  const w=dom.window,root=w.document.querySelector('aside'),viewport=root.firstElementChild,queries=new Map(),frames=new Map(),commits=[],draws=[];
  let time=0,seq=0,imports=0,allocations=0,disposed=0,resolveImport;
  w.performance.now=()=>time;w.requestAnimationFrame=fn=>{frames.set(++seq,fn);return seq;};w.cancelAnimationFrame=id=>frames.delete(id);
  w.matchMedia=q=>{if(!queries.has(q))queries.set(q,Object.assign(new w.EventTarget(),{matches:q.includes('reduced')?reduced:forced}));return queries.get(q);};
  Object.defineProperty(w.navigator,'connection',{value:Object.assign(new w.EventTarget(),{saveData})});
  if(gpu)w.WebGL2RenderingContext=function(){};
  const renderer={draw:(mesh,camera,part)=>{draws.push({mesh,camera,part});return true;},dispose:()=>{disposed++;}};
  const module={createGLScene:()=>{allocations++;return unavailable?null:renderer;}};
  const scene=mountSpatialScene({root,window:w,commit:(patch,options)=>commits.push({patch,options}),loadRenderer:()=>{imports++;return late?new Promise(r=>{resolveImport=r;}):Promise.resolve(module);}});
  return {w,root,viewport,scene,frames,commits,draws,queries,
    metrics:()=>({imports,allocations,disposed}),resolve:()=>resolveImport(module),
    tick:(ms=16)=>{time+=ms;const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(time));},
    event:(type,x=0,y=0)=>{const e=new w.MouseEvent(type,{button:0,clientX:x,clientY:y,bubbles:true,cancelable:true});Object.defineProperty(e,'pointerId',{value:1});viewport.dispatchEvent(e);},
    close:()=>{scene.dispose();w.close();}};
}
test('hero loads no scene module; first interior import mounts one persistent fallback',async()=>{
  const f=await fixture();assert.deepEqual(f.imports,[]);
  click(f,'.primary');await wait();
  assert.deepEqual(f.imports,['./spatial-scene.mjs']);assert.equal(f.d.querySelectorAll('.spatial-canvas').length,1);
  assert.equal(f.d.querySelector('#module-scene').dataset.renderer,'drawing');
  click(f,'[data-component="retention"]');click(f,'#interface-open');await wait();
  assert.match(f.w.location.search,/camera=interface&layout=separated/);
  assert.equal(f.d.querySelector('#diagram-layout').getAttribute('aria-pressed'),'true');
  assert.equal(f.d.querySelectorAll('.spatial-canvas').length,1);await f.close();
});
test('notes, camera and fallback preferences survive deep links, Back and object-context reading',async()=>{
  const f=await fixture({url:'/laboratory/?part=isolation&camera=profile&layout=separated&render=drawing'});
  click(f,'#inspector-toggle');assert.equal(f.d.querySelector('.surface.active').hidden,true);assert.equal(f.d.activeElement.id,'inspector-toggle');
  click(f,'#inspector-toggle');assert.equal(f.d.querySelector('.surface.active').hidden,false);
  click(f,'[data-camera="interface"]');assert.equal(new URLSearchParams(f.w.location.search).get('camera'),'interface');
  f.w.history.back();await wait();assert.equal(new URLSearchParams(f.w.location.search).get('camera'),'profile');
  click(f,'.site-header nav a[href^="/research/"]');
  for(const [key,value]of [['part','isolation'],['camera','profile'],['layout','separated'],['render','drawing']])assert.equal(new URLSearchParams(f.w.location.search).get(key),value);
  assert.equal(f.d.querySelector('[data-component="isolation"]').getAttribute('aria-pressed'),'true');await f.close();
});
test('missing optional scene module leaves static geometry, native selection and verified evidence',async()=>{
  const f=await fixture({url:'/laboratory/',sceneFailure:true});
  assert.equal(f.d.querySelector('#module-scene').dataset.renderer,'static');
  assert.equal(f.d.querySelector('#spatial-viewport').tabIndex,-1);
  assert.ok([...f.d.querySelectorAll('.camera-controls button')].every(b=>b.disabled));
  click(f,'[data-component="retention"]');click(f,'#interface-open');click(f,'#inspect-transfer');await wait();
  assert.equal(f.d.querySelector('#possible-states').hidden,false);await f.close();
});
test('GPU enhancement does no idle work and only the newest camera can finish',async()=>{
  const r=rig();r.scene.update(base);await wait();
  assert.equal(r.root.dataset.renderer,'spatial');assert.equal(r.root.querySelector('svg').hasAttribute('hidden'),true);
  assert.equal(r.frames.size,0);
  r.scene.update({...base,az:0},{animate:true});r.tick();assert.equal(r.frames.size,1);
  r.scene.update({...base,az:15,part:'support'},{animate:true});r.tick(320);
  assert.equal(r.frames.size,0);assert.equal(r.draws.at(-1).camera.yaw,15);assert.equal(r.draws.at(-1).part,'support');
  const count=r.draws.length;r.tick(1000);assert.equal(r.draws.length,count);
  r.scene.update({...base,az:30},{animate:true});r.scene.suspend();assert.equal(r.frames.size,0);r.tick(1000);assert.equal(r.draws.length,count);
  r.scene.update({...base,camera:'interface'},{animate:true});assert.equal(r.frames.size,0);assert.equal(r.draws.at(-1).camera.yaw,145,'large viewing changes are composed cuts');
  r.close();assert.equal(r.metrics().disposed,1);
});
test('late renderer import cannot allocate after route exit or disposal',async()=>{
  for(const exit of ['home','dispose']){
    const r=rig({late:true});r.scene.update(base);
    if(exit==='home')r.scene.update({...base,view:'home'});else r.scene.dispose();
    r.resolve();await wait();assert.equal(r.metrics().allocations,0);assert.equal(r.frames.size,0);r.close();
  }
});
test('reduced motion retains spatial selection with zero animation frames',async()=>{
  const r=rig({reduced:true});r.scene.update(base);await wait();
  r.scene.update({...base,camera:'interface',layout:'separated'},{animate:true});
  assert.equal(r.frames.size,0);assert.equal(r.draws.at(-1).camera.yaw,145);assert.equal(r.root.dataset.renderer,'spatial');r.close();
});
test('data-saving, forced colors, missing graphics and explicit drawing use the same mesh without loading GPU code',async()=>{
  for(const prefs of [{saveData:true},{forced:true},{gpu:false},{drawing:true}]){
    const r=rig(prefs);r.scene.update({...base,...(prefs.drawing?{render:'drawing'}:{})});await wait();
    assert.equal(r.metrics().imports,0);assert.equal(r.root.dataset.renderer,'drawing');
    assert.equal(r.root.querySelector('svg').hasAttribute('hidden'),false);assert.ok(r.root.querySelectorAll('polygon').length>100);assert.equal(r.frames.size,0);r.close();
  }
});
test('context loss falls back immediately and only context restoration can request a new renderer',async()=>{
  const r=rig();r.scene.update(base);await wait();r.scene.update({...base,az:0},{animate:true});
  const canvas=r.root.querySelector('canvas');canvas.dispatchEvent(new r.w.Event('webglcontextlost',{cancelable:true}));
  assert.equal(r.frames.size,0);assert.equal(r.root.dataset.renderer,'drawing');assert.equal(canvas.hidden,true);
  r.scene.update({...base,camera:'profile'});await wait();assert.equal(r.metrics().allocations,1);
  canvas.dispatchEvent(new r.w.Event('webglcontextrestored'));await wait();assert.equal(r.metrics().allocations,2);assert.equal(r.root.dataset.renderer,'spatial');r.close();
});
test('pointer orbit commits only viewing angles; vertical intent and cancelled input cannot select a part',()=>{
  const r=rig({gpu:false});r.scene.update(base);
  r.event('pointerdown',100,100);r.event('pointermove',101,130);r.event('pointerup',101,130);assert.equal(r.commits.length,0);
  r.event('pointerdown',100,100);r.event('pointermove',150,108);r.event('pointerup',150,108);
  assert.deepEqual(Object.keys(r.commits[0].patch),['az','el']);assert.equal(r.commits[0].options.replace,true);
  r.event('pointerdown',100,100);r.event('pointermove',150,108);r.event('pointercancel');r.event('pointerup',150,108);assert.equal(r.commits.length,1);
  r.viewport.dispatchEvent(new r.w.KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true}));
  assert.equal(r.commits.at(-1).patch.camera,'overview');r.close();
});
test('preference changes cancel a reveal and restore a complete readable drawing',async()=>{
  const r=rig();r.scene.update(base);await wait();r.scene.update({...base,az:0},{animate:true});
  const forced=r.queries.get('(forced-colors: active)');forced.matches=true;forced.dispatchEvent(new r.w.Event('change'));
  assert.equal(r.frames.size,0);assert.equal(r.root.dataset.renderer,'drawing');
  r.scene.update({...base,camera:'profile'},{animate:true});assert.equal(r.frames.size,0);r.close();
});
test('preferences, visibility and context restoration cannot revive a suspended scene',async()=>{
  const r=rig();r.scene.update(base);await wait();r.scene.suspend();
  const draws=r.draws.length,allocations=r.metrics().allocations;
  for(const query of r.queries.values())query.dispatchEvent(new r.w.Event('change'));
  r.w.navigator.connection.dispatchEvent(new r.w.Event('change'));
  r.w.document.dispatchEvent(new r.w.Event('visibilitychange'));
  r.root.querySelector('canvas').dispatchEvent(new r.w.Event('webglcontextrestored'));
  await wait();assert.equal(r.draws.length,draws);assert.equal(r.metrics().allocations,allocations);
  assert.equal(r.frames.size,0);assert.equal(r.scene.diagnostics().active,false);
  r.scene.update(base);assert.equal(r.scene.diagnostics().active,true);r.close();
});
test('unavailable graphics are attempted once, not reallocated on every selection',async()=>{
  const r=rig({unavailable:true});r.scene.update(base);await wait();
  for(const part of ['module','retention','isolation','support']){r.scene.update({...base,part});await wait();}
  assert.equal(r.metrics().allocations,1);assert.equal(r.metrics().imports,1);
  assert.equal(r.root.dataset.renderer,'drawing');assert.equal(r.scene.diagnostics().pendingFrame,false);r.close();
});
