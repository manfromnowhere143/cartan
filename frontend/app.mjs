import {SITE,pathFor,viewFromURL,linkedView,updateMetadata} from './routes.mjs';
import {workspaceFromURL,workspaceURL,parentState,inspectionFacts} from './workspace-state.mjs';
import {evidenceState} from './adapter.mjs';
import {loadPinnedV1, formatV1, CONTRACT_COMMIT} from './contract-adapter.mjs';

import {createHeroController,heroSourceFor} from './hero-controller.mjs';
import {installFocusPresentation} from './focus-presentation.mjs';

// Capture actual input before native dialog autofocus or application focus moves.
installFocusPresentation(document);

const $ = selector => document.querySelector(selector);
const components = {
  module: ['A replaceable unit', 'A prepared power or electronics cartridge is the candidate study object. Its function is provisional; its geometry is not an engineering specification.', 'Prepared removable cartridge', 'Mass and dimensions not established'],
  retention: ['A load-bearing attachment', 'A latch report and actual retention are different things. The study must define what constitutes a secure hold and how an independent reference can observe it.', 'Host retention, including partial capture', 'Load limits and reference sensing not established'],
  isolation: ['More than a power command', 'Source isolation, connection integrity and stored energy need separate definitions. An acknowledgement does not establish that a circuit is electrically safe.', 'Source isolation and residual energy', 'Voltage, current and energy limits not established'],
  support: ['An independent holding path', 'A transfer support is distinct from the host latch. A later physical fixture needs reviewed containment and independent observation of the holding state.', 'Module held during exchange', 'Support capacity and grasp geometry not established'],
};
function renderSelection(state) {
  const [title,description,definition,measurement]=components[state.part];
  for(const button of document.querySelectorAll('[data-component]')) {
    button.id='part-'+button.dataset.component;
    button.setAttribute('aria-pressed',String(button.dataset.component===state.part));
  }
  for(const group of document.querySelectorAll('[data-geometry]')) group.classList.toggle('selected',group.dataset.geometry===state.part);
  $('#component-id').textContent='EXPLANATORY SCHEMATIC / '+state.part.toUpperCase();
  $('#component-title').textContent=title;$('#component-description').textContent=description;
  $('#component-definition').textContent=definition;$('#component-measurement').textContent=measurement;
  $('#interface-detail').hidden=state.detail!=='interface';
  $('#interface-open').hidden=state.detail==='interface';
  $('#interface-description').textContent=state.part==='isolation'
    ? 'This relationship diagram does not specify a circuit. Source isolation, connector state and residual energy need separate evidence. A voltage readback alone is not proof of isolation.'
    : state.part==='support'
    ? 'The independent transfer support and the host are distinct holding relationships. Neither its capacity nor the way it grasps the module is established by this diagram.'
    : 'A report of capture does not establish a load-bearing attachment. Latch geometry, engagement depth and retention limits remain unknown.';
  for(const [id,next] of [
    ['interface-open',{...state,view:'laboratory',detail:'interface',layout:'separated',camera:'interface',az:undefined,el:undefined}],
    ['interface-close',{...state,view:'laboratory',detail:null}],
    ['inspect-transfer',{...state,view:'interruption',detail:null}],
    ['inspect-evidence',{...state,view:'evidence',from:'interruption'}],
    ['return-transfer',{...state,view:'interruption'}],
  ])$('#'+id).href=workspaceURL(next);
  for(const [id,view]of [['rail-object','laboratory'],['rail-state','interruption'],['rail-evidence','evidence']]){
    const link=$('#'+id);link.href=workspaceURL({...state,view,detail:null,notes:undefined,from:view==='evidence'?'interruption':null});
    if(state.view===view)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');
  }
  // Reading another research view retains the selected object and camera. The
  // explicit sequence/return links above carry their own complete target state.
  const contextual=new Set(['interface-open','interface-close','inspect-transfer','inspect-evidence','return-transfer']);
  for(const link of document.querySelectorAll('.site-header nav a,.interior-shell .surface a[href],.edition')){
    if(contextual.has(link.id))continue;
    const url=new URL(link.href);if(url.origin!==location.origin||url.hash)continue;
    const view=linkedView(url);if(!view||view==='home')continue;
    link.href=workspaceURL({...state,view,detail:null,notes:undefined,
      from:['evidence','comparison','sources'].includes(view)&&(state.view==='interruption'||state.from==='interruption')?'interruption':null});
  }
  for(const button of document.querySelectorAll('[data-camera]'))button.setAttribute('aria-pressed',String(state.az===undefined&&state.el===undefined&&button.dataset.camera===(state.camera??'overview')));
  $('#diagram-layout').setAttribute('aria-pressed',String(state.layout==='separated'));
  $('#diagram-layout').textContent='Separate relationships';
  $('#drawing-mode').setAttribute('aria-pressed',String(state.render==='drawing'));
  $('#drawing-mode').textContent='Drawing view';
  $('#inspector-toggle').setAttribute('aria-expanded',String(state.notes!=='closed'));
  $('#inspector-toggle').setAttribute('aria-controls',document.querySelector(`.surface[data-view="${state.view}"]`).id);
  $('#inspector-toggle').textContent=state.notes==='closed'?'Show notes':'Hide notes';
  $('.interior-shell').dataset.notes=state.notes??'open';
  $('#scene-function').textContent={module:'01 / MODULE ENVELOPE',retention:'02 / HOST RETENTION',isolation:'03 / ELECTRICAL BOUNDARY',support:'04 / TRANSFER SUPPORT'}[state.part];
  $('.scene-caption span').textContent=state.layout==='separated'?'Diagram separation, not a physical operation. Geometry unverified.':'Not to scale. Geometry and physical reachability unverified.';
  const [recordTitle,recordDescription]=evidenceState(state.record);
  for(const button of document.querySelectorAll('[data-evidence]')) {
    button.id='record-'+button.dataset.evidence;
    button.setAttribute('aria-pressed',String(button.dataset.evidence===state.record));
  }
  $('#evidence-kind').textContent=state.record==='inconclusive'?'PRESENTATION EXAMPLE / NOT A RESULT':state.record==='planned'?'PLAN / NO OUTCOME CLAIM':'NO RECORD LOADED';
  $('#evidence-state').textContent=recordTitle;$('#evidence-description').textContent=recordDescription;
}
for(const button of document.querySelectorAll('[data-component]'))button.addEventListener('click',()=>{
  const part=button.dataset.component;
  navigate({...currentState,view:'laboratory',part,detail:null,
    camera:part==='isolation'?'interface':part==='support'?'profile':'overview',az:undefined,el:undefined},{focus:false});
});
for(const button of document.querySelectorAll('[data-evidence]'))button.addEventListener('click',()=>{
  navigate({...currentState,record:button.dataset.evidence},{focus:false});
});
for(const button of document.querySelectorAll('[data-camera]'))button.addEventListener('click',()=>navigate({...currentState,camera:button.dataset.camera,az:undefined,el:undefined},{focus:false}));
$('#diagram-layout').addEventListener('click',()=>navigate({...currentState,layout:currentState.layout==='separated'?undefined:'separated'},{focus:false}));
$('#drawing-mode').addEventListener('click',()=>navigate({...currentState,render:currentState.render==='drawing'?undefined:'drawing'},{focus:false}));
$('#inspector-toggle').addEventListener('click',()=>navigate({...currentState,notes:currentState.notes==='closed'?undefined:'closed'},{focus:false}));

let fixtureRequest;
function ensureFixture(){return fixtureRequest??=loadFixture();}
async function loadFixture() {
  try {
    const projection=await loadPinnedV1();
    const {bundle,run,truth,observation,command,belief}=projection;
    const facts=inspectionFacts(projection);
    $('#observation-source').textContent=`Source: ${facts.source} / run ${run.id}. Sampled ${facts.sampled} s; received ${facts.received} s; epoch ${facts.epoch}. All times synthetic.`;
    $('#candidate-list').replaceChildren(...facts.candidates.map((candidate,index)=>{
      const item=document.createElement('div');item.className='candidate-state';
      const label=document.createElement('p');label.className='eyebrow';label.textContent='POSSIBILITY '+(index+1);
      const title=document.createElement('h3');title.textContent=candidate.host;
      const note=document.createElement('p');note.textContent='Host retention in the authored fixture';
      item.append(label,title,note);return item;
    }));
    $('#possible-states').hidden=false;
    $('#fixture-state').textContent = run.display_notice;
    $('#receipt-verification').textContent='Exact fixture bytes verified in this browser. Synthetic fixture — not evidence.';
    $('#example-command').textContent = `${command.name} · illustrative, not executed`;
    $('#example-observation').textContent = `${observation.variable}: ${formatV1(observation.reading)} · ${observation.validity}`;
    $('#example-truth').textContent = `Host: ${truth.state.host} · author-assigned fixture truth`;
    $('#example-belief').textContent = `Possible host states: ${belief.candidates.map(c=>c.host).join(' or ')}. ${belief.status} within the fixture.`;
    $('#truth-description').textContent='Authored fixture state, not measured';
    $('#fixture-banner').textContent=run.display_notice;
    for (const [name,value] of [
      ['Run ID',run.id],['Schema',run.schema_version],['Source commit',CONTRACT_COMMIT],
      ['Model',run.model_version],['Controller',run.controller_version],['Scenario',run.scenario_id],
      ['Mode / evidence',`${run.mode} / ${run.evidence_scope}`],['Synthetic start',run.started_at],
      ['Synthetic end',run.ended_at],['Seed',formatV1(run.seed)],
      ['Units',JSON.stringify(run.units)],['Observation time',`sampled ${observation.sampled_at_s} s; received ${observation.received_at_s} s; epoch ${observation.epoch}`],
      ...run.input_hashes.map(h=>['Input SHA-256',`${h.path}: ${h.sha256}`]),
      ...run.configuration_hashes.map(h=>['Configuration SHA-256',`${h.path}: ${h.sha256}`]),
      ...Object.entries(run.outcomes).map(([key,value])=>[key,formatV1(value)]),
      ...run.provenance.map(p=>['Source reference',`${p.source_id}: ${p.location}`]),
      ...run.limitations.map(value=>['Limitation',value]),
      ...bundle.assets.map(a=>['Geometry asset',`${a.id}: ${a.availability}; rights ${a.rights.status}; approval ${a.approval}`]),
      ...bundle.claims.map(c=>['Claim',`${c.id} / ${c.status}: ${c.assertion} ${c.limitations.join(' ')}`]),
      ...bundle.components.map(c=>['Component',`${c.id}: ${c.name}; ${c.function}; ${c.state_status}. ${c.parameters.map(p=>p.name+': '+formatV1(p.quantity)).join('; ')}`]),
    ]) {
      const row=document.createElement('div'), term=document.createElement('dt'), detail=document.createElement('dd');
      term.textContent=name; detail.textContent=value; row.append(term,detail); $('#fixture-details').append(row);
    }
    return projection;
  } catch {
    $('#fixture-state').textContent = 'Engineering fixture unavailable, incompatible or changed. The static explanation remains a UI illustration; no record was loaded.';
    $('#fixture-banner').textContent='MISSING EVIDENCE / CONTRACT UNAVAILABLE';
    $('#possible-states').hidden=true;
    $('#example-observation').textContent='Unavailable';
    $('#observation-source').textContent='Pinned bytes could not be verified. No candidate states are shown.';
    $('#receipt-verification').textContent='Fixture unavailable or changed. Browser verification failed; no result is loaded.';
  }
}
// The fixture is requested only when an inspection/evidence view is entered.

const hero = $('#hero-video'), dialog = $('#film-dialog'), film = $('#film-video');
const motionButton=$('#motion-toggle'), motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const connection=navigator.connection;
const heroSection=$('.hero'), heroStatus=$('#hero-status');
let inView=false, activeHero=viewFromURL(location)==='home', filmTrigger=null;
const heroMedia=createHeroController({
  video:hero,
  source:heroSourceFor,
  policy:()=>({
    width:innerWidth,effectiveType:connection?.effectiveType,
    reducedMotion:motionPreference.matches,saveData:Boolean(connection?.saveData),
    visible:!document.hidden,inView:inView&&activeHero,filmOpen:dialog.open,
    autoplayDenied:typeof navigator.getAutoplayPolicy==='function'&&navigator.getAutoplayPolicy(hero)==='disallowed',
  }),
  render:({phase,reason,hasFrame})=>{
    heroSection.dataset.playback=phase;
    hero.classList.toggle('playing',hasFrame);
    const staticView=phase==='static';
    motionButton.hidden=staticView;
    const playing=phase==='playing'||phase==='loading';
    const label=playing ? 'Pause background motion' : phase==='ended' ? 'Replay background motion' : 'Play background motion';
    motionButton.querySelector('.control-label').textContent=playing ? 'Pause motion' : phase==='ended' ? 'Replay motion' : 'Play motion';
    motionButton.querySelector('path').setAttribute('d',playing ? 'M8 5v14M16 5v14' : phase==='ended' ? 'M5 9a8 8 0 1 1-1 7M5 3v6h6' : 'm8 5 11 7-11 7Z');
    motionButton.setAttribute('aria-label',label);
    heroStatus.textContent=staticView ? 'Static concept image.' : phase==='ended' ? 'Background motion paused at the end.' : phase==='blocked' ? 'Background motion unavailable. Concept still shown.' : phase==='paused' ? 'Background motion paused.' : '';
    if(reason==='reduced-motion') document.getAnimations().forEach(animation=>animation.cancel());
  },
});
motionButton.addEventListener('click',()=>heroMedia.toggle());
motionPreference.addEventListener('change',()=>heroMedia.sync());
connection?.addEventListener?.('change',()=>heroMedia.sync());
window.addEventListener('resize',()=>heroMedia.sync());
if('ResizeObserver' in window) new ResizeObserver(()=>heroMedia.sync()).observe(heroSection);
if('IntersectionObserver' in window) {
  new IntersectionObserver(entries=>{
    inView=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>0.1);
    heroMedia.sync();
  },{threshold:[0,0.1]}).observe($('.hero-picture'));
} else {inView=true;}
document.addEventListener('visibilitychange',()=>{
  heroMedia.sync();
  if(document.hidden) film.pause();
});
window.addEventListener('pagehide',()=>{heroMedia.suspend();film.pause();});
window.addEventListener('pageshow',()=>heroMedia.sync());

const filmSource='/assets/cartan/CARTAN-Built-to-Change-Revised-Silent-21s-1080p.mp4';
for(const button of document.querySelectorAll('.film-open')) {
  button.hidden=false;
  button.addEventListener('click',()=>{
    filmTrigger=button;
    if(typeof dialog.showModal!=='function') {location.href=filmSource;return;}
    dialog.showModal();heroMedia.sync();$('#film-close').focus({preventScroll:true});
    film.muted=true;film.autoplay=false;film.src=filmSource;
    $('#film-status').textContent='Paused. Use Play to watch the silent concept film.';
  });
}
$('#film-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{film.pause();film.removeAttribute('src');film.load();filmTrigger?.focus({preventScroll:true});heroMedia.sync();});
film.addEventListener('play',()=>{$('#film-status').textContent='';});
film.addEventListener('error',()=>{if(film.hasAttribute('src')) $('#film-status').textContent='Film unavailable. The poster and visual description remain available.';});
for (const img of document.images) {
  const handle=()=>{
    img.hidden=true;
    if (img.id==='hero-poster') $('#hero-caption').firstChild.textContent='Concept artwork pending · static composition ';
    else if (img.closest('.brand')) $('.brand-fallback').hidden=false;
    else if (img.closest('.study-art')) $('.study-art p').textContent='Concept artwork unavailable. The component descriptions remain available.';
  };
  img.addEventListener('error',handle);
  if (img.complete && img.naturalWidth===0) handle();
}

// One document, one persistent scene, one URL-derived selection.
const surfaces = new Map([...document.querySelectorAll('.surface')].map(node=>[node.dataset.view,node]));
const routes = {
  home:{label:'SPACE SYSTEMS RESEARCH',section:null},
  question:{label:'RESEARCH / THE QUESTION',section:'question'},
  laboratory:{label:'LABORATORY / COMPONENTS',section:'laboratory'},
  interruption:{label:'LABORATORY / STATE INSPECTION',section:'laboratory'},
  evidence:{label:'RESEARCH / EVIDENCE',section:'evidence'},
  comparison:{label:'RESEARCH / COMPARISON',section:'evidence'},
  sources:{label:'RESEARCH / PRIMARY SOURCES',section:'question'},
  vision:{label:'LONG-TERM CONCEPT',section:null},
};
let currentState=workspaceFromURL(new URL(location.href));
let spatialScene=null,spatialLoad=null;
function updateSpatial(animate=false){
  if(['home','vision'].includes(currentState.view)){spatialScene?.suspend();return;}
  if(spatialScene){spatialScene.update(currentState,{animate});return;}
  const root=$('#module-scene');
  if(!spatialLoad)spatialLoad=import('./spatial-scene.mjs').then(({mountSpatialScene})=>{
    if(!root.isConnected)return;
    spatialScene=mountSpatialScene({root,commit:(patch,options={})=>navigate({...currentState,...patch},{focus:false,...options})});
    spatialScene.update(currentState);
  }).catch(()=>{
    root.dataset.renderer='static';
    for(const button of root.querySelectorAll('.camera-controls button'))button.disabled=true;
    root.querySelector('#spatial-viewport').tabIndex=-1;
    root.querySelector('#spatial-status').textContent='Static schematic. Spatial controls are unavailable; function selection and evidence remain available.';
  });
}
window.addEventListener('pagehide',()=>spatialScene?.suspend());
window.addEventListener('pageshow',()=>updateSpatial());
// A temporary verified record inspection; URL/camera state remains owned here.
let aperture=null,apertureLoad=null,apertureIntent=0,aperturePending=false;
function cancelAperture(){apertureIntent++;aperturePending=false;$('#open-record').removeAttribute('aria-busy');aperture?.close(false);}
$('#open-record').addEventListener('click',async event=>{
  const trigger=event.currentTarget,request=++apertureIntent;aperturePending=true;trigger.setAttribute('aria-busy','true');
  $('#record-entry-status').textContent='Opening the record';
  try{
    apertureLoad??=import('./evidence-aperture.mjs').then(({createEvidenceAperture})=>{
      aperture=createEvidenceAperture({load:ensureFixture,onActive:active=>{if(active)spatialScene?.suspend();else if(!document.hidden)updateSpatial();}});return aperture;
    });
    const reader=await apertureLoad;
    if(request!==apertureIntent||document.hidden||['home','vision'].includes(currentState.view))return;
    aperturePending=false;trigger.removeAttribute('aria-busy');$('#record-entry-status').textContent='';
    void reader.open(trigger,components[currentState.part][0]);
  }catch{
    if(request!==apertureIntent)return;aperturePending=false;trigger.removeAttribute('aria-busy');apertureLoad=null;
    $('#record-entry-status').textContent='The record inspector is unavailable. The Evidence view remains available.';
  }
});
window.addEventListener('pagehide',cancelAperture);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&aperturePending)cancelAperture();});

// Stable ids let history restore the actual control rather than a guessed heading.
for(const [index,node] of [...document.querySelectorAll('a,button,summary')].entries())if(!node.id)node.id='control-'+index;

function rememberEntry() {
  history.replaceState({...history.state,cartanFocus:document.activeElement?.id,cartanScroll:window.scrollY,cartanReading:surfaces.get(currentState.view)?.scrollTop??0},'',location.href);
}
function showState(state,{focus=true,focusTarget=null,restore=null}={}) {
  cancelAperture();
  const previous=currentState;
  currentState=state;
  const view=state.view;
  activeHero=view==='home';
  if(!activeHero)heroMedia.sync();
  document.documentElement.dataset.view=view;
  for(const [name,node] of surfaces) {
    const active=name===view;
    node.classList.toggle('active',active);node.hidden=!active||(state.notes==='closed'&&!['home','vision'].includes(view));node.inert=node.hidden;
  }
  $('.interior-shell').hidden=view==='home';
  $('#module-scene').hidden=view==='home'||view==='vision';
  renderSelection(state);
  updateSpatial(previous.camera!==state.camera||previous.az!==state.az||previous.el!==state.el);
  heroMedia.sync();
  if(view==='interruption'||view==='evidence')void ensureFixture();
  for(const link of document.querySelectorAll('.site-header nav a')) {
    if(routes[view].section&&linkedView(new URL(link.href))===routes[view].section)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  const parent=parentState(state),back=$('#view-back');
  back.hidden=view==='home';back.href=workspaceURL(parent);
  back.querySelector('.control-label').textContent=parent.view==='home'?'Overview':parent.view==='laboratory'?'Laboratory':parent.view==='interruption'?'Paused transfer':parent.view==='question'?'Research':'Evidence';
  $('#view-context').textContent=routes[view].label;
  updateMetadata(view);
  const heading=state.notes==='closed'?$('#inspector-toggle'):state.detail==='interface'?$('#interface-title'):surfaces.get(view).querySelector('h1,h2');
  const restoreNode=restore?.cartanFocus?document.getElementById(restore.cartanFocus):null;
  const requested=focusTarget?document.getElementById(focusTarget):null;
  const eligible=node=>node&&!node.closest('[hidden],[inert]');
  if(focus) {
    const target=eligible(restoreNode)?restoreNode:eligible(requested)?requested:heading;
    if(/^H[1-6]$/.test(target.tagName))target.tabIndex=-1;
    target.focus({preventScroll:true});
  }
  if(restore)window.scrollTo({top:restore.cartanScroll??0,left:0,behavior:'instant'});
  else if(previous.view!==view)window.scrollTo({top:0,left:0,behavior:'instant'});
  if(restore)surfaces.get(view).scrollTop=restore.cartanReading??0;
  else if(previous.view!==view)surfaces.get(view).scrollTop=0;
  if(focus&&innerWidth>860&&state.detail==='interface'&&!restore)$('#interface-title').scrollIntoView?.({block:'nearest',behavior:'instant'});
  // On narrow layouts the reading surface follows the object. Reveal its focused
  // heading only when it is outside the viewport; no scroll animation or snapping.
  if(focus&&!restore&&innerWidth<=700&&view!=='home'&&view!=='vision') {
    const target=document.activeElement,rect=target.getBoundingClientRect();
    if(rect.bottom>innerHeight-70||rect.top<90)target.scrollIntoView?.({block:'center',behavior:'instant'});
  }
}
function navigate(next,options={}) {
  if(!routes[next.view])return;
  const url=workspaceURL(next);
  if(url!==location.pathname+location.search||location.hash) {
    rememberEntry();if(options.replace)history.replaceState(history.state,'',url);else history.pushState({},'',url);
  }
  showState(workspaceFromURL(new URL(location.href)),options);
}
document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href]');
  if(!link||link.target||link.hasAttribute('download'))return;
  const url=new URL(link.href);if(url.origin!==location.origin)return;
  const view=linkedView(url);if(!routes[view])return;
  event.preventDefault();
  const next=workspaceFromURL(url);
  if(['comparison','sources'].includes(view)&&currentState.from==='interruption') {
    next.from=currentState.from;next.part=currentState.part;
  }
  const returnTarget=link.id==='return-transfer'?'inspect-evidence':link.id==='interface-close'?'interface-open':null;
  navigate(next,{focusTarget:returnTarget});
});
window.addEventListener('popstate',()=>showState(workspaceFromURL(new URL(location.href)),{restore:history.state??{}}));
window.addEventListener('hashchange',()=>{
  if(location.hash!=='#top'&&!Object.hasOwn(SITE.pages,location.hash.slice(1)))return;
  const state=workspaceFromURL(new URL(location.href));
  history.replaceState({},'',workspaceURL(state));showState(state);
});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.key!=='Escape')return;
  if(aperturePending){event.preventDefault();cancelAperture();return;}
  if(document.querySelector('dialog[open]')||currentState.view==='home')return;
  if(event.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  event.preventDefault();
  const targets={interruption:'inspect-transfer',evidence:'inspect-evidence',comparison:'evidence-title',sources:'question-title'};
  const focusTarget=currentState.detail?'interface-open':targets[currentState.view]??null;
  navigate(parentState(currentState),{focusTarget});
});
document.documentElement.classList.add('has-router');
document.documentElement.classList.add('has-interaction');
if(location.hash==='#top'||Object.hasOwn(SITE.pages,location.hash.slice(1)))history.replaceState({},'',workspaceURL(currentState));
showState(currentState,{focus:false});
