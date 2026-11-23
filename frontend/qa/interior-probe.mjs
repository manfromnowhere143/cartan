const $=s=>document.querySelector(s),frame=$('#frame');let result=null,profile=await(await fetch('/qa/profile')).json();
const nextFrame=w=>new Promise(r=>w.requestAnimationFrame(r));
$('#load').onclick=()=>{
  const [width,height]=$('#size').value.split('x').map(Number);frame.width=width;frame.height=height;
  frame.src=$('#route').value;result=null;$('#result').textContent='';$('#status').textContent='Loading exact release view…';
};
frame.onload=()=>{$('#status').textContent='View loaded. Inspect it before measuring. No automated screenshot or device claim.';};
$('#measure').onclick=async()=>{
  const w=frame.contentWindow,d=w.document,p=w.performance;
  const longTasks=[],frameIntervals=[],delays=[];let observer;
  try{observer=new w.PerformanceObserver(list=>longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));observer.observe({type:'longtask',buffered:true});}catch{}
  const resources=p.getEntriesByType('resource').map(e=>({name:e.name,transferBytes:e.transferSize,encodedBytes:e.encodedBodySize,duration:e.duration}));
  const navigation=p.getEntriesByType('navigation')[0]?.toJSON();
  const cold={navigation,resources,totalTransferBytes:resources.reduce((n,e)=>n+e.transferBytes,0)+(navigation?.transferSize??0)};
  d.querySelector('.primary')?.click();await nextFrame(w);
  // Give optional imports time to settle; this is not a readiness/performance claim.
  await new Promise(r=>w.setTimeout(r,500));
  const rendererBefore=d.querySelector('#module-scene')?.dataset.renderer??'baseline-no-renderer';
  const buttons=[...d.querySelectorAll('[data-component]')];let previous=await nextFrame(w);
  for(let i=0;i<32;i++) {
    const start=p.now();buttons[i%buttons.length]?.click();const now=await nextFrame(w);
    delays.push(p.now()-start);frameIntervals.push(now-previous);previous=now;
  }
  observer?.disconnect();
  const interior={width:w.innerWidth,height:w.innerHeight,scrollWidth:d.documentElement.scrollWidth,clientWidth:d.documentElement.clientWidth};
  const sorted=[...delays].sort((a,b)=>a-b);
  result={at:new Date().toISOString(),profile,userAgent:w.navigator.userAgent,viewport:interior,
    limitations:['Local browser with CSS-sized iframe; not device/field performance.','Programmatic clicks measure click-to-next-rAF, not INP or physical input latency.','rAF gaps are not GPU dropped-frame counts.','ResourceTiming bytes can be zero for cached resources. Server uses no-store.','Long-task observer begins at measurement; buffered entries only where implemented.'],
    features:{documentViewTransition:'startViewTransition' in d,elementViewTransition:'startViewTransition' in w.Element.prototype,backdrop:w.CSS.supports('backdrop-filter','blur(2px)'),inert:'inert' in w.HTMLElement.prototype,dialog:'showModal' in w.HTMLDialogElement.prototype,reducedMotion:w.matchMedia('(prefers-reduced-motion: reduce)').matches,forcedColors:w.matchMedia('(forced-colors: active)').matches},
    cold,repeatedSelection:{samples:delays,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],longTasks,frameIntervals},
    spatial:{rendererBefore,rendererAfter:d.querySelector('#module-scene')?.dataset.renderer??'baseline-no-renderer',drawCount:d.querySelector('#module-scene')?.dataset.draws??null,webgl2API:'WebGL2RenderingContext' in w,limitations:'Capability detection and scene-reported draw calls are not shader/GPU timing or frame presentation measurements.'},
    allResourcesAfterSelection:p.getEntriesByType('resource').map(e=>({name:e.name,transferBytes:e.transferSize,encodedBytes:e.encodedBodySize,duration:e.duration})),
    activeView:d.querySelector('.surface.active')?.dataset.view};
  $('#result').textContent=JSON.stringify(result,null,2);$('#status').textContent='Measured locally. These readings require interpretation; no automatic pass.';
};
$('#save').onclick=async()=>{if(!result)return;const response=await fetch('/qa/interior-report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(result)});$('#status').textContent=response.ok?'Result retained in frontend/qa/'+(profile.reportDirectory??'interior-2026-11-23')+'/.':'Result could not be retained.';};
$('#load').click();
