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
export async function fixture({width=390,reduced=false,forced=false,saveData=false,url="/",broken=false,slow=false,sceneFailure=false,storedTheme=null,storageBlocked=false}={}){
  const dom=new JSDOM(await readFile(new URL('index.html',root),'utf8'),{url:new URL(url,'https://cartan.danielwahnich.dev').href,runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,d=w.document,states=new WeakMap();
  if(storedTheme!==null)w.localStorage.setItem('cartan.appearance',storedTheme);
  if(storageBlocked)Object.defineProperty(w,'localStorage',{get(){throw new w.DOMException('Storage blocked','SecurityError');}});
  w.eval(d.querySelector('#theme-init').textContent);
  Object.defineProperty(w,'innerWidth',{value:width,writable:true});
  Object.defineProperty(w.navigator,'connection',{value:Object.assign(new w.EventTarget(),{saveData,effectiveType:'4g'})});
  w.matchMedia=q=>Object.assign(new w.EventTarget(),{matches:q.includes('prefers-reduced-motion')&&reduced||q.includes('forced-colors')&&forced,media:q});
  w.scrollTo=()=>{};d.getAnimations=()=>[];
  w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  w.structuredClone=structuredClone;
  Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});
  const requests=[];let resolveFetch;
  w.fetch=async(path)=>{requests.push(path);if(slow)await new Promise(r=>{resolveFetch=r;});return new Response(broken?'{}':await readFile(new URL('vendor/cartan/v1/fixture.json',root)));};
  Object.defineProperty(w.HTMLMediaElement.prototype,'paused',{get(){return states.get(this)?.paused??true;}});
  w.HTMLMediaElement.prototype.play=function(){states.set(this,{paused:false});return Promise.resolve();};
  w.HTMLMediaElement.prototype.pause=function(){states.set(this,{paused:true});};
  w.HTMLMediaElement.prototype.load=function(){};
  // jsdom lacks native dialog focus. Model that browser step, then run CARTAN's
  // actual listeners and explicit focus restoration without copying their code.
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');this.querySelector('button').focus();};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
  const context=dom.getInternalVMContext(),cache=new Map(),imports=[];
  async function module(url){
    if(cache.has(url.href))return cache.get(url.href);
    assert.ok(url.href.startsWith(root.href));
    const m=new vm.SourceTextModule(await readFile(url,'utf8'),{context,identifier:url.href,
      importModuleDynamically:async(specifier,ref)=>{
        imports.push(specifier);
        if(sceneFailure&&specifier==='./spatial-scene.mjs')throw new Error('Simulated missing optional module');
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
  return {w,d,click,requests,imports,resolveFetch:()=>resolveFetch?.(),close:async()=>{await new Promise(r=>setTimeout(r,25));w.close();}};
}
