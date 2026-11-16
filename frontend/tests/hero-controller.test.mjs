import test from 'node:test';
import assert from 'node:assert/strict';
import {createHeroController,staticReason,heroSourceFor} from '../hero-controller.mjs';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(overrides={}) {
  let p={width:1440,aspect:1.6,reducedMotion:false,saveData:false,visible:true,inView:true,filmOpen:false,...overrides};
  const listeners=new Map();let src=null,last,pending=[];
  const video={autoplay:true,muted:false,defaultMuted:false,loop:true,playbackRate:1,currentTime:0,paused:true,ended:false,loads:0,plays:0,attachments:0,
    hasAttribute:()=>src!==null,removeAttribute:()=>{src=null;},load(){this.loads++;},
    set src(value){src=value;this.attachments++;},get src(){return src;},
    play(){this.plays++;this.paused=false;return new Promise((resolve,reject)=>pending.push({resolve,reject}));},
    pause(){this.paused=true;},
    addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name),
  };
  const controller=createHeroController({video,source:heroSourceFor,policy:()=>p,render:state=>{last=state;}});
  return {video,controller,get state(){return last;},setPolicy:value=>{p={...p,...value};controller.sync();},event:name=>listeners.get(name)?.(),resolve:()=>pending.shift()?.resolve(),reject:()=>pending.shift()?.reject(new Error('denied'))};
}
test('reduced motion, Save-Data and 2G never attach background media',()=>{
  for(const p of [{reducedMotion:true},{saveData:true},{effectiveType:'2g'},{effectiveType:'slow-2g'}]) {
    const f=fixture(p);f.controller.sync();f.controller.toggle();f.controller.sync();
    assert.equal(f.video.attachments,0);assert.equal(f.video.plays,0);assert.equal(f.state.phase,'static');assert.ok(staticReason({...{width:1440,aspect:1.6},...p}));
  }
});
test('mobile, portrait and landscape windows remain eligible for inline playback',()=>{
  for(const p of [{width:390,aspect:.46},{width:768,aspect:.75},{width:3440,aspect:2.5},{width:1280,aspect:1280/720},{width:1440,aspect:1.6},{width:1024,aspect:4/3}]) {
    const f=fixture(p);f.controller.sync();assert.equal(f.video.attachments,1);assert.equal(f.video.plays,1);assert.equal(f.state.phase,'loading');
  }
});
test('poster remains visible until a decoded video frame, with one pending callback',async()=>{
  const f=fixture();let submitted,requests=0;
  f.video.requestVideoFrameCallback=fn=>{submitted=fn;return ++requests;};
  f.controller.sync();f.event('playing');f.resolve();await tick();
  assert.equal(f.state.hasFrame,false);assert.equal(requests,1);
  submitted();assert.equal(f.state.hasFrame,true);assert.equal(f.state.phase,'playing');
});
test('late decoded frames cannot reveal video after pause, route exit or reduced motion',async()=>{
  for(const change of ['pause','route','reduced']) {
    const f=fixture();let submitted,cancelled=0;
    f.video.requestVideoFrameCallback=fn=>{submitted=fn;return 42;};
    f.video.cancelVideoFrameCallback=id=>{assert.equal(id,42);cancelled++;};
    f.controller.sync();f.resolve();await tick();
    if(change==='pause') f.controller.pause();
    else f.setPolicy(change==='route'?{inView:false}:{reducedMotion:true});
    submitted();assert.equal(f.state.hasFrame,false);assert.equal(cancelled,1);
    assert.equal(f.video.paused,true);assert.notEqual(f.state.phase,'playing');
  }
});
test('desktop and mobile loop forward without unloading or flashing the poster',async()=>{
  for(const width of [390,1440]){
    const f=fixture({width});f.controller.sync();f.resolve();await tick();
    assert.equal(f.video.loop,true);assert.equal(f.video.muted,true);assert.equal(f.video.playbackRate,1);
    const src=f.video.src;f.video.currentTime=19;f.video.ended=true;f.event('ended');
    assert.equal(f.video.currentTime,0);assert.equal(f.video.plays,2);assert.equal(f.video.src,src);
    assert.equal(f.state.hasFrame,true);assert.equal(f.video.loads,0);assert.equal(f.video.attachments,1);
    f.video.ended=false;f.resolve();await tick();assert.equal(f.state.phase,'playing');
  }
});
test('rendition selection stays fixed during a cycle and selects small media for 3G',()=>{
  for(const p of [{width:390},{width:1440,effectiveType:'3g'}]){
    const f=fixture(p);f.controller.sync();assert.match(f.video.src,/mobile-540p/);
    f.setPolicy({width:1440,effectiveType:'4g'});assert.equal(f.video.attachments,1);assert.match(f.video.src,/mobile-540p/);
  }
});
test('explicit pause survives visibility, viewport updates and film close without resetting time',async()=>{
  const f=fixture();f.controller.sync();f.resolve();await tick();f.video.currentTime=7.4;f.controller.toggle();
  f.setPolicy({visible:false});f.setPolicy({visible:true});f.setPolicy({filmOpen:true});f.setPolicy({filmOpen:false});f.controller.sync();
  assert.equal(f.state.phase,'paused');assert.equal(f.video.currentTime,7.4);assert.equal(f.video.plays,1);assert.equal(f.video.autoplay,false);
  f.controller.toggle();assert.equal(f.video.currentTime,7.4);assert.equal(f.video.plays,2);
});
test('temporary visibility, view and dialog suspension resumes without losing position',async()=>{
  for(const change of [{visible:false},{inView:false},{filmOpen:true}]) {
    const f=fixture();f.controller.sync();f.resolve();await tick();f.video.currentTime=7.4;f.setPolicy(change);
    assert.equal(f.video.paused,true);assert.equal(f.state.phase,'paused');f.setPolicy({visible:true,inView:true,filmOpen:false});assert.equal(f.video.plays,2);assert.equal(f.video.currentTime,7.4);assert.equal(f.video.attachments,1);
  }
});
test('pending play cannot override Pause or eligibility loss',async()=>{
  const f=fixture();f.controller.sync();f.controller.toggle();f.resolve();await tick();f.event('playing');
  assert.equal(f.video.paused,true);assert.equal(f.state.phase,'paused');assert.equal(f.state.hasFrame,false);
  const g=fixture();g.controller.sync();g.setPolicy({reducedMotion:true});g.resolve();await tick();g.event('playing');
  assert.equal(g.state.phase,'static');assert.equal(g.video.src,null);assert.equal(g.video.paused,true);
});
test('autoplay rejection unloads source, exposes poster and does not retry itself',async()=>{
  const f=fixture();f.controller.sync();f.reject();await tick();assert.equal(f.state.phase,'blocked');assert.equal(f.state.hasFrame,false);assert.equal(f.video.src,null);
  f.controller.sync();assert.equal(f.video.plays,1);
  const known=fixture({autoplayDenied:true});known.controller.sync();assert.equal(known.video.attachments,0);assert.equal(known.state.phase,'blocked');
  known.controller.toggle();assert.equal(known.video.plays,1);
});
test('media failure remains blocked; preference exclusions unload and allow later resumption',async()=>{
  const f=fixture();f.controller.sync();f.resolve();await tick();f.event('error');assert.equal(f.video.src,null);assert.equal(f.state.phase,'blocked');
  const g=fixture();g.controller.sync();g.resolve();await tick();g.video.currentTime=10;g.setPolicy({reducedMotion:true});g.setPolicy({reducedMotion:false});
  assert.equal(g.video.plays,2);assert.equal(g.state.phase,'loading');
});
test('hidden initial route defers video until the hero is entered',()=>{
  const f=fixture({inView:false});f.controller.sync();assert.equal(f.video.attachments,0);f.setPolicy({inView:true});assert.equal(f.video.plays,1);
});

test('queued native pause from suspension cannot cancel a resumed play',async()=>{
  const f=fixture();f.controller.sync();f.resolve();await tick();f.setPolicy({visible:false});f.setPolicy({visible:true});
  f.event('pause');f.resolve();await tick();assert.equal(f.state.phase,'playing');assert.equal(f.video.paused,false);
});
test('manual Pause wins over a pending loop or page suspension',async()=>{
  const f=fixture();f.controller.sync();f.resolve();await tick();f.video.currentTime=19;f.video.ended=true;f.event('ended');
  f.controller.pause();f.resolve();await tick();f.controller.suspend();f.controller.sync();
  assert.equal(f.video.paused,true);assert.equal(f.state.phase,'paused');assert.equal(f.video.plays,2);
});
test('disposal cancels queued frames and prevents any further playback',async()=>{
  const f=fixture();let callback,cancelled=false;
  f.video.requestVideoFrameCallback=fn=>{callback=fn;return 1;};f.video.cancelVideoFrameCallback=()=>{cancelled=true;};
  f.controller.sync();f.resolve();await tick();f.controller.dispose();callback();f.controller.sync();f.controller.toggle();
  assert.equal(cancelled,true);assert.equal(f.video.src,null);assert.equal(f.video.plays,1);assert.equal(f.video.paused,true);
});
