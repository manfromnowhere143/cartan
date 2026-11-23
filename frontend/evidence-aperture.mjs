import {CONTRACT_COMMIT,FIXTURE_HASH,formatV1} from './contract-adapter.mjs';

/** A read-only projection of the verified v1 illustration. No new inference. */
export function apertureModel({run,observation,belief}={}){
  if(run?.mode!=='synthetic_fixture'||run.evidence_scope!=='none'||belief?.status!=='consistent'||!belief.candidates?.length)throw new Error('No admitted illustration');
  if(observation?.reading?.basis!=='synthetic')throw new Error('Unexpected observation authority');
  return Object.freeze({run:run.id,notice:run.display_notice,variable:observation.variable,
    reading:formatV1(observation.reading),validity:observation.validity,source:observation.source_id,
    sampled:observation.sampled_at_s,received:observation.received_at_s,epoch:observation.epoch,
    hosts:Object.freeze(belief.candidates.map(c=>c.host)),support:Object.freeze(belief.candidates.map(c=>c.support)),
    schema:run.schema_version,model:run.model_version,controller:run.controller_version,
    outcomes:Object.freeze(Object.entries(run.outcomes).map(([key,value])=>Object.freeze([key,formatV1(value)]))),
    hash:FIXTURE_HASH,commit:CONTRACT_COMMIT});
}

const markup=`
<div class="aperture-shell">
 <header class="aperture-header"><span class="aperture-wordmark">CARTAN</span><p>THE EVIDENCE APERTURE <span>/ 01</span></p><button type="button" class="aperture-close" aria-label="Close record">Close <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></header>
 <div class="aperture-intro"><div><p class="aperture-kicker">INTERRUPTED EXCHANGE / SYNTHETIC STUDY</p><h2 id="aperture-title" tabindex="-1">Between a report<br>and reality.</h2></div><p class="aperture-context">Return context<br><span data-ap="context">Mechanical retention</span></p></div>
 <p class="aperture-status" role="status">Checking the exact fixture bytes…</p>
 <div class="aperture-content" hidden>
  <div class="aperture-composition">
   <figure class="aperture-field" aria-label="One report and its two authored possibilities; a diagram of information, not physical geometry.">
    <svg class="aperture-construction" viewBox="0 0 800 480" aria-hidden="true" focusable="false">
     <g class="aperture-guide"><path d="M40 240h720M400 28v424"/><path d="M40 228v24m720-24v24M388 28h24M388 452h24"/></g>
     <g class="aperture-lines"><path d="M400 240 178 140M400 240l222 100"/><circle cx="400" cy="240" r="7"/><circle cx="178" cy="140" r="4"/><circle cx="622" cy="340" r="4"/></g>
     <g class="aperture-planes" fill="none"><path class="aperture-plane plane-left" d="m130 130 190-76 230 178-190 76Z"/><path class="aperture-plane plane-center" d="m190 158 190-76 230 178-190 76Z"/><path class="aperture-plane plane-right" d="m250 186 190-76 230 178-190 76Z"/></g>
    </svg>
    <div class="aperture-signal"><span>THE SHARED REPORT</span><strong data-ap="reading"></strong><code data-ap="variable"></code></div>
    <div class="aperture-possibility possibility-a"><span>AUTHORED POSSIBILITY / 01</span><strong data-ap="host-a"></strong><small>Host attachment</small></div>
    <div class="aperture-possibility possibility-b"><span>AUTHORED POSSIBILITY / 02</span><strong data-ap="host-b"></strong><small>Host attachment</small></div>
    <div class="aperture-fingerprint"><span>SHA-256 / EXACT FILE IDENTITY</span><code data-ap="fingerprint"></code></div>
    <figcaption>Same report. Physical retention remains unestablished.</figcaption>
   </figure>
   <div class="aperture-reading">
    <section data-reading-panel="report"><p class="aperture-kicker">01 / WHAT ARRIVED</p><h3>Acknowledged.<br>Not established.</h3><p>The fixture contains a stale acknowledgement. It is a report from the drive chain, not an independent measurement of retention.</p><dl class="aperture-facts"><div><dt>Reported value</dt><dd data-ap="value"></dd></div><div><dt>Validity</dt><dd data-ap="validity"></dd></div><div><dt>Sampled / received</dt><dd data-ap="timing"></dd></div><div><dt>Reset epoch</dt><dd data-ap="epoch"></dd></div></dl><p class="aperture-footnote">Times and states in this record are synthetic.</p></section>
    <section data-reading-panel="possibilities" hidden><p class="aperture-kicker">02 / WHAT REMAINS OPEN</p><h3>One observation.<br>Two authored states.</h3><p>The illustration leaves both host states in its candidate set. Selecting a view does not select which state is true.</p><dl class="aperture-facts"><div><dt>Host candidates</dt><dd data-ap="hosts"></dd></div><div><dt>External support</dt><dd data-ap="support"></dd></div><div><dt>Independent retention</dt><dd>No physical record</dd></div></dl><p class="aperture-footnote">These possibilities are authored, not a physical feasibility result. Retention alone would not authorize disconnection.</p></section>
    <section data-reading-panel="source" hidden><p class="aperture-kicker">03 / WHAT IS VERIFIED</p><h3>The bytes match.<br>The evidence is absent.</h3><p>The browser checked this fixture against its pinned SHA-256. That binds the illustration to a file; it does not validate a mechanism.</p><dl class="aperture-facts"><div><dt>Run</dt><dd data-ap="run"></dd></div><div><dt>Source</dt><dd data-ap="source"></dd></div><div><dt>Schema / model</dt><dd data-ap="versions"></dd></div></dl><details class="aperture-details"><summary>Full identity and outcomes</summary><p>Contract revision</p><code data-ap="commit"></code><p>Fixture SHA-256</p><code data-ap="hash"></code><dl data-ap="outcomes"></dl><a href="/vendor/cartan/v1/fixture.json" target="_blank" rel="noopener">Read the exact fixture file</a></details></section>
   </div>
  </div>
  <nav class="aperture-navigation" aria-label="Read the record"><button type="button" data-reading="report" aria-pressed="true"><span>01</span> The report</button><button type="button" data-reading="possibilities" aria-pressed="false"><span>02</span> The possibilities</button><button type="button" data-reading="source" aria-pressed="false"><span>03</span> The source</button><p>SYNTHETIC FIXTURE / NOT EVIDENCE</p></nav>
 </div>
 <footer class="aperture-footer"><span data-ap="run-label">CONTRACT V1</span><span>READ ONLY / NO PHYSICAL CONTROL</span></footer>
</div>`;

export function createEvidenceAperture({document:d=document,window:w=window,load,onActive=()=>{}}){
  const dialog=d.createElement('dialog');dialog.className='evidence-aperture';dialog.id='evidence-aperture';dialog.setAttribute('aria-labelledby','aperture-title');dialog.innerHTML=markup;d.body.append(dialog);
  const q=s=>dialog.querySelector(s),put=(key,value)=>{q(`[data-ap="${key}"]`).textContent=String(value);};
  const reduced=w.matchMedia('(prefers-reduced-motion: reduce)'),forced=w.matchMedia('(forced-colors: active)');
  let token=0,origin=null,effects=[],disposed=false,reading='report';const off=[];
  const on=(el,event,handler)=>{el.addEventListener(event,handler);off.push(()=>el.removeEventListener(event,handler));};
  const settle=()=>{for(const a of effects)a.cancel();effects=[];};
  function reveal(){
    settle();if(reduced.matches||forced.matches||d.hidden)return;
    const nodes=[q('.plane-left'),q('.plane-right')];
    for(const [i,node]of nodes.entries()){
      if(typeof node.animate!=='function')continue;
      try{const a=node.animate([{transform:`translate(${i?'-60':'60'}px,${i?'-28':'28'}px)`},{transform:'translate(0,0)'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});effects.push(a);a.finished.then(()=>{effects=effects.filter(v=>v!==a);},()=>{});}catch{/* Final composition is already readable. */}
    }
  }
  function select(next,animate=true){
    reading=next;dialog.dataset.reading=next;
    for(const p of dialog.querySelectorAll('[data-reading-panel]'))p.hidden=p.dataset.readingPanel!==next;
    for(const b of dialog.querySelectorAll('[data-reading]'))b.setAttribute('aria-pressed',String(b.dataset.reading===next));
    if(animate)reveal();
  }
  function close(restore=true){
    token++;settle();if(dialog.open)dialog.close();onActive(false);
    if(restore&&origin?.isConnected&&!origin.closest('[hidden],[inert]'))origin.focus({preventScroll:true});
  }
  on(q('.aperture-close'),'click',()=>close());
  on(dialog,'cancel',e=>{e.preventDefault();close();});
  on(dialog,'keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key==='Tab'){
      const controls=[...dialog.querySelectorAll('button,a[href],summary')].filter(n=>!n.closest('[hidden]')&&(!n.closest('details')||n.tagName==='SUMMARY'||n.closest('details').open));
      const first=controls[0],last=controls.at(-1),active=d.activeElement;
      if(e.shiftKey&&(active===first||active===q('#aperture-title'))){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&active===last){e.preventDefault();first.focus();}
    }
  });
  on(dialog,'close',()=>{if(!dialog.open){token++;settle();onActive(false);}});
  for(const b of dialog.querySelectorAll('[data-reading]'))on(b,'click',()=>select(b.dataset.reading));
  on(reduced,'change',settle);on(forced,'change',settle);on(w,'resize',settle);
  on(d,'visibilitychange',()=>{if(d.hidden)settle();});on(w,'pagehide',()=>close(false));
  return {
    async open(trigger,context='Mechanical retention'){
      if(disposed)return;token++;const request=token;origin=trigger;settle();select('report',false);
      put('context',context);q('.aperture-content').hidden=true;q('.aperture-status').hidden=false;q('.aperture-status').textContent='Checking the exact fixture bytes…';
      if(!dialog.open)dialog.showModal();q('#aperture-title').focus({preventScroll:true});dialog.scrollTop=0;onActive(true);
      try{
        const model=apertureModel(await load());if(request!==token||!dialog.open||disposed)return;
        if(model.hosts.length!==2)throw new Error('This composition requires the pinned pair');
        for(const [key,value]of Object.entries({reading:model.reading,variable:model.variable,value:model.reading,validity:model.validity,timing:`${model.sampled} s / ${model.received} s`,epoch:model.epoch,'host-a':model.hosts[0],'host-b':model.hosts[1],hosts:model.hosts.join(' / '),support:[...new Set(model.support)].join(' / ')+' (authored)',fingerprint:model.hash.match(/.{16}/g).join('\n'),run:model.run,source:model.source,versions:`${model.schema} / ${model.model}`,commit:model.commit,hash:model.hash,'run-label':model.run}))put(key,value);
        const outcomes=q('[data-ap="outcomes"]');outcomes.replaceChildren();
        for(const [name,value]of model.outcomes){const row=d.createElement('div'),dt=d.createElement('dt'),dd=d.createElement('dd');dt.textContent=name;dd.textContent=value;row.append(dt,dd);outcomes.append(row);}
        q('.aperture-status').hidden=true;q('.aperture-content').hidden=false;reveal();
      }catch{
        if(request!==token||!dialog.open||disposed)return;
        q('.aperture-content').hidden=true;q('.aperture-status').hidden=false;q('.aperture-status').textContent='Record unavailable. The pinned fixture could not be verified. No candidate state or outcome is shown.';
      }
    },close,dialog,diagnostics:()=>({open:dialog.open,reading,activeEffects:effects.length}),
    dispose(){close(false);disposed=true;off.forEach(f=>f());dialog.remove();}
  };
}
