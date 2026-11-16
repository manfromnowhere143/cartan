import test from 'node:test';
import assert from 'node:assert/strict';
import {createHeroController,staticReason} from '../hero-controller.mjs';
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
  const controller=createHeroController({video,source:'/assets/cartan/cartan-hero-desktop-720p.mp4',policy:()=>p,render:state=>{last=state;}});
  return {video,controller,get state(){return last;},setPolicy:value=>{p={...p,...value};controller.sync();},event:name=>listeners.get(name)?.(),resolve:()=>pending.shift()?.resolve(),reject:()=>pending.shift()?.reject(new Error('denied'))};
}
test('mobile, reduced motion, Save-Data and portrait framing never attach media',()=>{
  for(const p of [{width:390},{reducedMotion:true},{saveData:true},{width:768,aspect:.75},{aspect:2.5}]) {
    const f=fixture(p);f.controller.sync();f.controller.toggle();f.controller.sync();
    assert.equal(f.video.attachments,0);assert.equal(f.video.plays,0);assert.equal(f.state.phase,'static');assert.ok(staticReason({...{width:1440,aspect:1.6},...p}));
  }
});
test('eligible desktop starts muted once; ended stays at the end until explicit Replay',async()=>{
  const f=fixture();f.controller.sync();assert.equal(f.video.plays,1);assert.equal(f.video.muted,true);assert.equal(f.video.loop,false);assert.equal(f.video.playbackRate,1);
  f.resolve();await tick();assert.equal(f.state.phase,'playing');f.video.currentTime=19;f.video.ended=true;f.event('ended');
  assert.equal(f.state.phase,'ended');assert.equal(f.state.hasFrame,false);assert.equal(f.video.currentTime,19);
  f.controller.sync();f.setPolicy({inView:false});f.setPolicy({inView:true});assert.equal(f.video.plays,1);
  f.video.ended=false;f.controller.toggle();assert.equal(f.video.currentTime,0);assert.equal(f.video.plays,2);f.resolve();await tick();assert.equal(f.state.phase,'playing');
});
test('explicit pause survives visibility, viewport updates and film close without resetting time',async()=>{
  const f=fixture();f.controller.sync();f.resolve();await tick();f.video.currentTime=7.4;f.controller.toggle();
  f.setPolicy({visible:false});f.setPolicy({visible:true});f.setPolicy({filmOpen:true});f.setPolicy({filmOpen:false});f.controller.sync();
  assert.equal(f.state.phase,'paused');assert.equal(f.video.currentTime,7.4);assert.equal(f.video.plays,1);assert.equal(f.video.autoplay,false);
  f.controller.toggle();assert.equal(f.video.currentTime,7.4);assert.equal(f.video.plays,2);
});
test('tab hiding and leaving hero pause without automatic resumption',async()=>{
  for(const change of [{visible:false},{inView:false},{filmOpen:true}]) {
    const f=fixture();f.controller.sync();f.resolve();await tick();f.setPolicy(change);
    assert.equal(f.video.paused,true);assert.equal(f.state.phase,'paused');f.setPolicy({visible:true,inView:true,filmOpen:false});assert.equal(f.video.plays,1);
  }
});
test('pending play cannot override Pause or eligibility loss',async()=>{
  const f=fixture();f.controller.sync();f.controller.toggle();f.resolve();await tick();f.event('playing');
  assert.equal(f.video.paused,true);assert.equal(f.state.phase,'paused');assert.equal(f.state.hasFrame,false);
  const g=fixture();g.controller.sync();g.setPolicy({width:390});g.resolve();await tick();g.event('playing');
  assert.equal(g.state.phase,'static');assert.equal(g.video.src,null);assert.equal(g.video.paused,true);
});
test('autoplay rejection unloads source, exposes poster and does not retry itself',async()=>{
  const f=fixture();f.controller.sync();f.reject();await tick();assert.equal(f.state.phase,'blocked');assert.equal(f.state.hasFrame,false);assert.equal(f.video.src,null);
  f.controller.sync();assert.equal(f.video.plays,1);
  const known=fixture({autoplayDenied:true});known.controller.sync();assert.equal(known.video.attachments,0);assert.equal(known.state.phase,'blocked');
  known.controller.toggle();assert.equal(known.video.plays,1);
});
test('media failure unloads and eligibility changes never force a mid-action restart',async()=>{
  const f=fixture();f.controller.sync();f.resolve();await tick();f.event('error');assert.equal(f.video.src,null);assert.equal(f.state.phase,'blocked');
  const g=fixture();g.controller.sync();g.resolve();await tick();g.video.currentTime=10;g.setPolicy({reducedMotion:true});g.setPolicy({reducedMotion:false});
  assert.equal(g.video.plays,1);assert.equal(g.video.src,null);assert.equal(g.state.phase,'poster');
});
test('hidden initial route defers video until the hero is entered',()=>{
  const f=fixture({inView:false});f.controller.sync();assert.equal(f.video.attachments,0);f.setPolicy({inView:true});assert.equal(f.video.plays,1);
});
