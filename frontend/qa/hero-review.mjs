const $=s=>document.querySelector(s),frame=$('#frame');let reports=await fetch('/qa/revised-hero-browser-results.json').then(r=>r.ok?r.json():{reports:[]}).then(r=>r.reports).catch(()=>[]);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function scale(){const [w,h]=$('#size').value.split('x').map(Number),s=Math.min(1,(innerWidth-28)/w,(innerHeight-200)/h);frame.style.width=w+'px';frame.style.height=h+'px';frame.style.transform=`scale(${s})`;$('#stage').style.width=w*s+'px';$('#stage').style.height=h*s+'px';}
async function save(report){reports.push(structuredClone({...report,capturedAt:new Date().toISOString(),snapshotVersion:2}));reports=reports.slice(-20);$('#log').textContent=JSON.stringify(report,null,2);$('#log').hidden=true;await fetch('/qa/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ua:navigator.userAgent,checked:new Date().toISOString(),reports})});}
async function load(){scale();$('#result').textContent='Loading';void frame.offsetWidth;const loaded=new Promise(r=>frame.onload=r);frame.src=`/qa/frame?mode=${$('#mode').value}&review=${Date.now()}`;await loaded;await sleep(350);$('#result').textContent=`Loaded ${$('#size').value} / ${$('#mode').value}`;}
function capture(){const w=frame.contentWindow,d=w.document,v=d.querySelector('#hero-video'),hero=d.querySelector('.hero'),rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right};};
 const text=[...d.querySelectorAll('.hero-copy h1,.hero-copy p,.hero-copy a,.hero-bottom button:not([hidden]),.site-header a')].filter(n=>n.getBoundingClientRect().width>0).map(n=>({text:n.textContent.trim().replace(/\s+/g,' '),...rect(n),font:w.getComputedStyle(n).fontSize,color:w.getComputedStyle(n).color}));
 return {viewport:[w.innerWidth,w.innerHeight],mode:w.__qa.mode,phase:hero.dataset.playback,hero:rect(hero),overflow:d.documentElement.scrollWidth>w.innerWidth,copyAndControlsWithinHero:text.every(r=>r.x>=0&&r.right<=w.innerWidth+.5&&r.bottom<=hero.getBoundingClientRect().bottom),text,
 poster:d.querySelector('#hero-poster').currentSrc,imageState:{complete:d.querySelector('#hero-poster').complete,naturalWidth:d.querySelector('#hero-poster').naturalWidth,hidden:d.querySelector('#hero-poster').hidden,rect:rect(d.querySelector('#hero-poster')),parent:d.querySelector('#hero-poster').parentElement.outerHTML},visibility:{hidden:d.hidden,state:d.visibilityState,focus:d.hasFocus()},videoDOM:v.outerHTML,videoParent:v.parentElement.className,video:{attached:v.hasAttribute('src'),currentTime:v.currentTime,duration:Number.isFinite(v.duration)?v.duration:null,muted:v.muted,paused:v.paused,loop:v.loop,opacity:w.getComputedStyle(v).opacity,transition:w.getComputedStyle(v).transitionDuration},scrim:w.getComputedStyle(d.querySelector('.hero-picture'),'::after').backgroundImage,
 network:w.performance.getEntriesByType('resource').map(e=>({url:e.name,bytes:e.transferSize})),errors:w.__qa.errors,sourceAttachments:w.__qa.requests,requestContexts:w.__qa.requestContexts,events:w.__qa.events,cls:w.__qa.shifts};}
$('#load').onclick=load;addEventListener('resize',scale);
$('#audit').onclick=async()=>{const r=capture();await save({kind:'layout',...r});$('#result').textContent=`Recorded ${r.viewport.join('x')}: overflow ${r.overflow}; phase ${r.phase}; errors ${r.errors.length}`;};
$('#checks').onclick=async()=>{
 const w=frame.contentWindow,d=w.document,checks=[];const check=(name,ok)=>checks.push({name,pass:Boolean(ok)}),v=d.querySelector('#hero-video'),b=d.querySelector('#motion-toggle');
 if(!b.hidden){if(['playing','loading'].includes(d.querySelector('.hero').dataset.playback))b.click();await sleep(80);check('Pause control pauses media',v.paused);const t=v.currentTime;d.querySelector('a[href="#laboratory"]').click();await sleep(80);d.querySelector('.brand').click();await sleep(80);check('Return does not resume or reset user pause',v.paused&&Math.abs(v.currentTime-t)<.1);}
 for(const route of ['question','laboratory','evidence','vision']){d.querySelector(`a[href="#${route}"]`).click();await sleep(40);check('Route '+route,d.querySelector('.surface.active')?.dataset.view===route&&d.activeElement.matches('h1,h2'));}
 d.querySelector('.brand').click();await sleep(60);d.querySelector('.film-open').click();await sleep(150);check('Film opens paused',d.querySelector('#film-dialog').open&&d.querySelector('#film-video').paused);check('Dialog initial focus',d.activeElement.id==='film-close');check('Disclaimer is HTML',d.querySelector('#film-description').textContent.includes('Not engineering validation.'));d.querySelector('#film-close').click();await sleep(60);check('Film close restores focus',d.activeElement.matches('.film-open'));check('Film close removes source',!d.querySelector('#film-video').hasAttribute('src'));
 await save({kind:'controls-and-routes',viewport:$('#size').value,mode:$('#mode').value,checks,...capture()});$('#result').textContent=`Control assertions: ${checks.filter(c=>c.pass).length}/${checks.length}`;
};
$('#sequence').onclick=async()=>{
 const w=frame.contentWindow,d=w.document,v=d.querySelector('#hero-video'),b=d.querySelector('#motion-toggle');
 if(b.hidden){$('#result').textContent='Static-only viewport: no video requested.';await save({kind:'static-playback',...capture()});return;}
 if(v.paused)b.click();$('#result').textContent='Observing forward playback (up to 23 seconds)…';const samples=[];let start=performance.now();
 while(performance.now()-start<23000){samples.push({time:v.currentTime,phase:d.querySelector('.hero').dataset.playback,paused:v.paused});if(v.ended)break;await sleep(500);}
 await sleep(400);const r=capture();await save({kind:'playback',samples,forwardOnly:samples.every((x,i)=>i===0||x.time>=samples[i-1].time),completed:v.ended&&r.phase==='ended'&&r.video.opacity==='0',...r});$('#result').textContent=`Playback: ${v.currentTime.toFixed(2)}s; ended ${v.ended}; phase ${r.phase}`;
};
$('#phone').onclick=async()=>{$('#size').value='390x844';$('#mode').value='normal';await load();await sleep(500);await $('#audit').onclick();};
$('#matrix').onclick=async()=>{
 for(const [size,mode] of [['1440x900','normal'],['1280x720','normal'],['768x1024','normal'],['390x844','normal'],['1440x900','reduced'],['1440x900','save-data'],['1440x900','denied'],['1440x900','missing']]){
  $('#size').value=size;$('#mode').value=mode;await load();await sleep(700);await save({kind:'matrix-layout',...capture()});
 }
 $('#size').value='1440x900';$('#mode').value='normal';await load();await sleep(500);await $('#checks').onclick();$('#result').textContent+='; eight layout/policy cases recorded';
};
await load();
