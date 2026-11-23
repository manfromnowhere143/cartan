// Real application modules in an isolated DOM, not a browser/device rendering test.
// Uses existing local jsdom via CARTAN_JSDOM_MODULE; no production dependency.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const require=createRequire(import.meta.url);
assert.ok(process.env.CARTAN_JSDOM_MODULE,'Set CARTAN_JSDOM_MODULE to an existing jsdom installation');
const {JSDOM}=require(process.env.CARTAN_JSDOM_MODULE);
const root=new URL('../',import.meta.url);
async function fixture({width=390,reduced=false,saveData=false}={}){
  const dom=new JSDOM(await readFile(new URL('index.html',root),'utf8'),{url:'https://cartan.danielwahnich.dev/',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,d=w.document,states=new WeakMap();
  w.eval(d.querySelector('#theme-init').textContent);
  Object.defineProperty(w,'innerWidth',{value:width,writable:true});
  Object.defineProperty(w.navigator,'connection',{value:Object.assign(new w.EventTarget(),{saveData,effectiveType:'4g'})});
  w.matchMedia=q=>Object.assign(new w.EventTarget(),{matches:q.includes('prefers-reduced-motion')&&reduced,media:q});
  w.scrollTo=()=>{};d.getAnimations=()=>[];
  w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  w.structuredClone=structuredClone;
  Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});
  w.fetch=async()=>new Response(await readFile(new URL('vendor/cartan/v1/fixture.json',root)));
  Object.defineProperty(w.HTMLMediaElement.prototype,'paused',{get(){return states.get(this)?.paused??true;}});
  w.HTMLMediaElement.prototype.play=function(){states.set(this,{paused:false});return Promise.resolve();};
  w.HTMLMediaElement.prototype.pause=function(){states.set(this,{paused:true});};
  w.HTMLMediaElement.prototype.load=function(){};
  // jsdom lacks native dialog focus. Model that browser step, then run CARTAN's
  // actual listeners and explicit focus restoration without copying their code.
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');this.querySelector('button').focus();};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
  const context=dom.getInternalVMContext(),cache=new Map();
  async function module(url){
    if(cache.has(url.href))return cache.get(url.href);
    assert.ok(url.href.startsWith(root.href));
    const m=new vm.SourceTextModule(await readFile(url,'utf8'),{context,identifier:url.href,
      importModuleDynamically:async(specifier,ref)=>{
        const imported=await module(new URL(specifier,ref.identifier));
        if(imported.status==='linked')await imported.evaluate();return imported;
      }});cache.set(url.href,m);
    await m.link((specifier,ref)=>module(new URL(specifier,ref.identifier)));return m;
  }
  await (await module(new URL('app.mjs',root))).evaluate();
  await new Promise(r=>setTimeout(r,25));
  const click=(node,{pointer=true,detail=1,touch=false}={})=>{
    if(pointer){const down=new w.Event('pointerdown',{bubbles:true});node.dispatchEvent(down);node.closest('button,a,summary')?.focus();node.dispatchEvent(new w.Event('pointerup',{bubbles:true}));}
    const event=new w.MouseEvent('click',{bubbles:true,cancelable:true,detail});
    if(touch)Object.defineProperty(event,'pointerType',{value:'touch'});
    node.dispatchEvent(event);
  };
  return {w,d,click,close:()=>w.close()};
}
test('touch-open and touch-close preserve focus without pointer-outline eligibility',async()=>{
  const f=await fixture(),{d,click}=f,open=d.querySelector('.film-open'),close=d.querySelector('#film-close');
  click(open,{touch:true});assert.equal(d.activeElement,close);assert.equal(close.dataset.pointerFocus,'true');
  assert.equal(d.querySelector('#film-dialog').open,true);assert.equal(d.querySelector('#film-video').paused,true);
  click(close,{touch:true});assert.equal(d.activeElement,open);assert.equal(open.dataset.pointerFocus,'true');assert.equal(d.querySelector('#film-dialog').open,false);
  f.close();
});
test('a typed zero-count touch click does not become keyboard focus',async()=>{
  const f=await fixture();f.click(f.d.querySelector('.film-open'),{touch:true,detail:0});
  assert.equal(f.d.activeElement.id,'film-close');assert.equal(f.d.activeElement.dataset.pointerFocus,'true');f.close();
});
test('a webview zero-count MouseEvent after a completed touch stays pointer-originated',async()=>{
  const f=await fixture();f.click(f.d.querySelector('.film-open'),{detail:0});
  assert.equal(f.d.activeElement.id,'film-close');assert.equal(f.d.activeElement.dataset.pointerFocus,'true');
  f.click(f.d.querySelector('#film-close'),{detail:0});assert.equal(f.d.activeElement.dataset.pointerFocus,'true');
  // The prior gesture has been consumed: this subsequent AT click is distinct.
  f.click(f.d.querySelector('.film-open'),{pointer:false,detail:0});assert.equal(f.d.activeElement.dataset.pointerFocus,undefined);f.close();
});
test('cancelled gestures do not mask a later assistive activation',async()=>{
  const f=await fixture(),{w,d,click}=f,open=d.querySelector('.film-open');
  open.dispatchEvent(new w.Event('pointerdown',{bubbles:true}));open.dispatchEvent(new w.Event('pointercancel',{bubbles:true}));
  click(open,{pointer:false,detail:0});assert.equal(d.activeElement.dataset.pointerFocus,undefined);f.close();
});
test('keyboard and assistive opening retain visible-focus eligibility',async()=>{
  for(const assistive of [false,true]){
    const f=await fixture(),{w,d,click}=f,open=d.querySelector('.film-open');
    open.dispatchEvent(new w.Event('pointerdown',{bubbles:true}));open.focus();
    if(!assistive)open.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    click(open,{pointer:false,detail:0});assert.equal(d.activeElement.id,'film-close');assert.equal(d.activeElement.dataset.pointerFocus,undefined);
    assert.equal(d.querySelectorAll('[data-pointer-focus]').length,0);f.close();
  }
});
test('Safari Option+Tab restores keyboard indication synchronously',async()=>{
  const f=await fixture(),{w,d,click}=f;click(d.querySelector('.film-open'));const close=d.activeElement;
  close.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Alt',bubbles:true}));assert.equal(close.dataset.pointerFocus,'true');
  close.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',altKey:true,bubbles:true}));assert.equal(close.dataset.pointerFocus,undefined);assert.equal(d.activeElement,close);f.close();
});
test('pointer presentation covers routes, component/evidence controls and restored focus',async()=>{
  const f=await fixture(),{w,d,click}=f;
  click(d.querySelector('.primary'));assert.equal(d.querySelector('.surface.active').dataset.view,'laboratory');assert.equal(d.activeElement.id,'lab-title');assert.equal(d.activeElement.dataset.pointerFocus,'true');
  for(const b of d.querySelectorAll('[data-component]')){click(b);assert.equal(d.activeElement,b);assert.equal(b.dataset.pointerFocus,'true');assert.equal(b.getAttribute('aria-pressed'),'true');}
  click(d.querySelector('nav a[href^="/evidence/"]'));
  for(const b of d.querySelectorAll('[data-evidence]')){click(b);assert.equal(d.activeElement,b);assert.equal(b.dataset.pointerFocus,'true');}
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true}));assert.equal(d.querySelectorAll('[data-pointer-focus]').length,0);
  // Evidence now loads on entry; let its verified read settle before DOM teardown.
  await new Promise(r=>setTimeout(r,25));f.close();
});
test('native media controls and text inputs are not subject to pointer-outline suppression',async()=>{
  const f=await fixture(),{w,d}=f;
  const input=d.createElement('input');d.body.append(input);
  for(const node of [input,d.querySelector('#film-video')]){node.dispatchEvent(new w.Event('pointerdown',{bubbles:true}));node.focus();assert.equal(node.dataset.pointerFocus,undefined);}
  f.close();
});
test('real app selects mobile looping media and resumes temporary navigation suspension',async()=>{
  const f=await fixture(),{d,click}=f,v=d.querySelector('#hero-video');
  assert.match(v.src,/mobile-540p/);assert.equal(v.loop,true);assert.equal(v.muted,true);assert.equal(v.paused,false);
  v.currentTime=7;click(d.querySelector('.primary'));assert.equal(v.paused,true);
  click(d.querySelector('.brand'));await Promise.resolve();assert.equal(v.paused,false);assert.equal(v.currentTime,7);
  click(d.querySelector('#motion-toggle'));assert.equal(v.paused,true);
  click(d.querySelector('.primary'));click(d.querySelector('.brand'));await Promise.resolve();assert.equal(v.paused,true);f.close();
});
test('real app respects reduced motion and Save-Data without attaching a source',async()=>{
  for(const policy of [{reduced:true},{saveData:true}]){
    const f=await fixture(policy),v=f.d.querySelector('#hero-video');assert.equal(v.hasAttribute('src'),false);assert.equal(v.paused,true);assert.equal(f.d.querySelector('#motion-toggle').hidden,true);f.close();
  }
});
