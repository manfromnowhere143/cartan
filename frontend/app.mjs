import {evidenceState, mayPlayHero} from './adapter.mjs';
import {loadPinnedV1, formatV1, CONTRACT_COMMIT} from './contract-adapter.mjs';

const $ = selector => document.querySelector(selector);
const components = {
  module: ['A replaceable unit', 'A prepared power or electronics cartridge is the candidate study object. Its function is provisional; its geometry is not an engineering specification.', 'Prepared removable cartridge', 'Mass and dimensions not established'],
  retention: ['A load-bearing attachment', 'A latch report and actual retention are different things. The study must define what constitutes a secure hold and how an independent reference can observe it.', 'Host retention, including partial capture', 'Load limits and reference sensing not established'],
  isolation: ['More than a power command', 'Source isolation, connection integrity and stored energy need separate definitions. An acknowledgement does not establish that a circuit is electrically safe.', 'Source isolation and residual energy', 'Voltage, current and energy limits not established'],
  support: ['An independent holding path', 'A transfer support is distinct from the host latch. A later physical fixture needs reviewed containment and independent observation of the holding state.', 'Module held during exchange', 'Support capacity and grasp geometry not established'],
};
for (const button of document.querySelectorAll('[data-component]')) {
  button.addEventListener('click', () => {
    const id = button.dataset.component, [title,description,definition,measurement] = components[id];
    for (const other of document.querySelectorAll('[data-component]')) other.setAttribute('aria-pressed', String(other === button));
    $('#component-id').textContent = `UI CONCEPT / ${id.toUpperCase()}`;
    $('#component-title').textContent = title;
    $('#component-description').textContent = description;
    $('#component-definition').textContent = definition;
    $('#component-measurement').textContent = measurement;
    if (!motionPreference.matches && !document.hidden && document.hasFocus()) $('#component-title').animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:240});
  });
}
for (const button of document.querySelectorAll('[data-evidence]')) {
  button.addEventListener('click', () => {
    const mode = button.dataset.evidence, [title,description] = evidenceState(mode);
    for (const other of document.querySelectorAll('[data-evidence]')) other.setAttribute('aria-pressed', String(other === button));
    $('#evidence-kind').textContent = mode === 'inconclusive' ? 'PRESENTATION EXAMPLE / NOT A RESULT' : mode === 'planned' ? 'PLAN / NO OUTCOME CLAIM' : 'NO RECORD LOADED';
    $('#evidence-state').textContent = title; $('#evidence-description').textContent = description;
  });
}

async function loadFixture() {
  try {
    const {bundle,run,truth,observation,command,belief}=await loadPinnedV1();
    $('#fixture-state').textContent = run.display_notice;
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
  } catch {
    $('#fixture-state').textContent = 'Engineering fixture unavailable, incompatible or changed. The static explanation remains a UI illustration; no record was loaded.';
    $('#fixture-banner').textContent='UI ILLUSTRATION / CONTRACT UNAVAILABLE';
  }
}
void loadFixture();

const hero = $('#hero-video'), dialog = $('#film-dialog'), film = $('#film-video');
const motionButton = $('#motion-toggle'), motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let requested=false, inView=true, filmTrigger=null, heroFailed=false, playEpoch=0;
motionButton.hidden=false;
for (const button of document.querySelectorAll('.film-open')) button.hidden=false;

function buttonLabel() {
  motionButton.disabled=motionPreference.matches;
  motionButton.textContent = motionPreference.matches ? 'Reduced motion · still' : requested ? 'Pause motion Ⅱ' : heroFailed ? 'Retry motion ▷' : 'Play motion ▷';
  motionButton.setAttribute('aria-label',motionPreference.matches ? 'Hero stays still with reduced motion enabled' : requested ? 'Pause background motion' : 'Play background motion');
}
function stopHero({release=false}={}) {
  playEpoch++; requested=false; hero.pause();
  if (release) {hero.classList.remove('playing'); hero.removeAttribute('src'); hero.load();}
  buttonLabel();
}
async function startHero() {
  requested=true; heroFailed=false; buttonLabel();
  if (!mayPlayHero({available:true,reducedMotion:motionPreference.matches,visible:!document.hidden,inView,filmOpen:dialog.open,requested})) {stopHero();return;}
  const epoch=++playEpoch;
  hero.muted=true;
  if (!hero.hasAttribute('src')) hero.src='assets/hero-loop.mp4';
  try {await hero.play(); if (epoch !== playEpoch) return; hero.classList.add('playing');}
  catch {if (epoch !== playEpoch) return; heroFailed=true; stopHero({release:true}); $('#hero-caption').firstChild.textContent='Motion unavailable · concept still ';}
}
hero.addEventListener('error', () => {
  if (!hero.hasAttribute('src')) return;
  heroFailed=true; stopHero({release:true}); $('#hero-caption').firstChild.textContent='Motion unavailable · concept still ';
});
motionButton.addEventListener('click', () => requested ? stopHero() : void startHero());
motionPreference.addEventListener('change', () => {if (motionPreference.matches) {stopHero({release:true}); document.getAnimations().forEach(animation=>animation.cancel());} buttonLabel();});
buttonLabel();

if ('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries => {
    inView=entries.some(entry => entry.isIntersecting);
    if (!inView) stopHero({release:true});
  },{threshold:0.05});
  observer.observe($('.hero'));
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {stopHero({release:true}); film.pause();}
});
window.addEventListener('pagehide', () => {stopHero({release:true}); film.pause(); film.removeAttribute('src'); film.load();});

async function openFilm(button) {
  filmTrigger=button; stopHero({release:true});
  if (typeof dialog.showModal !== 'function') {location.href='assets/film-review.mp4';return;}
  dialog.showModal(); $('#film-close').focus();
  film.muted=true; film.src='assets/film-review.mp4'; $('#film-status').textContent='';
  if (!motionPreference.matches) {
    try {await film.play();} catch {$('#film-status').textContent='Press play to watch the silent concept review.';}
  } else {$('#film-status').textContent='Reduced motion is enabled. The film is paused; use its controls if you choose to watch.';}
}
for (const button of document.querySelectorAll('.film-open')) button.addEventListener('click',()=>void openFilm(button));
$('#film-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{film.pause();film.removeAttribute('src');film.load();filmTrigger?.focus();});
film.addEventListener('error',()=>{if (film.hasAttribute('src')) $('#film-status').textContent='Film unavailable. The poster and visual description remain available.';});
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

// One document, one active surface. Native links remain meaningful without JS.
const surfaces = new Map([...document.querySelectorAll('.surface')].map(node=>[node.dataset.view,node]));
const routes = {
  home:{label:'SPACE SYSTEMS RESEARCH',parent:'home',section:null},
  question:{label:'RESEARCH / THE QUESTION',parent:'home',section:'question'},
  laboratory:{label:'LABORATORY / COMPONENTS',parent:'home',section:'laboratory'},
  interruption:{label:'LABORATORY / STATE INSPECTION',parent:'laboratory',section:'laboratory'},
  evidence:{label:'RESEARCH / EVIDENCE',parent:'home',section:'evidence'},
  comparison:{label:'RESEARCH / COMPARISON',parent:'evidence',section:'evidence'},
  sources:{label:'RESEARCH / PRIMARY SOURCES',parent:'question',section:'question'},
  vision:{label:'LONG-TERM CONCEPT',parent:'home',section:null},
};
let currentView='home', currentTransition=null;
const hashFor = view=>view==='home' ? '#top' : `#${view}`;
const viewFromHash = hash=>hash==='#top'||!hash ? 'home' : hash.slice(1);

function transform(update) {
  currentTransition?.cancel();
  update();
  const surface=surfaces.get(currentView);
  if (!motionPreference.matches && !document.hidden && document.hasFocus() && typeof surface.animate==='function') {
    currentTransition=surface.animate([
      {opacity:0,transform:'translateY(12px)'},
      {opacity:1,transform:'translateY(0)'},
    ],{duration:340,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
}

function showView(view,{focus=true,animate=true}={}) {
  if (!routes[view]) view='home';
  // Stop decoding before the outgoing view is hidden, not after animation.
  if (view!=='home') stopHero({release:true});
  inView=view==='home';
  const update=()=>{
    currentView=view;
    document.documentElement.dataset.view=view;
    for (const [name,node] of surfaces) {
      const active=name===view;
      node.classList.toggle('active',active);
      node.hidden=!active;
      node.inert=!active;
    }
    for (const link of document.querySelectorAll('.site-header nav a')) {
      if (link.hash===`#${routes[view].section}`) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
    const back=$('#view-back');
    back.hidden=view==='home';
    back.href=hashFor(routes[view].parent);
    back.textContent=routes[view].parent==='home' ? '← Overview' : routes[view].parent==='laboratory' ? '← Laboratory' : routes[view].parent==='question' ? '← Research' : '← Evidence';
    $('#view-context').textContent=routes[view].label;
    const heading=surfaces.get(view).querySelector('h1,h2');
    document.title=view==='home' ? 'CARTAN — Spacecraft that can change' : `CARTAN — ${heading.innerText.replace(/\s+/g,' ')}`;
    window.scrollTo({top:0,left:0,behavior:'instant'});
    if (focus) {heading.tabIndex=-1;heading.focus({preventScroll:true});}
  };
  if (animate && view!==currentView) transform(update); else update();
}
function navigate(view) {
  if (!routes[view]) return;
  if (view!==currentView) history.pushState({cartanView:view},'',hashFor(view));
  showView(view);
}
document.addEventListener('click',event=>{
  if (event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
  const link=event.target.closest('a[href^="#"]');
  if (!link) return;
  const view=viewFromHash(link.hash);
  if (!routes[view]) return;
  event.preventDefault();
  navigate(view);
});
window.addEventListener('popstate',()=>showView(viewFromHash(location.hash)));
window.addEventListener('hashchange',()=>{
  const view=viewFromHash(location.hash);
  if (view!==currentView) showView(view);
});
document.addEventListener('keydown',event=>{
  if (event.key!=='Escape'||dialog.open||currentView==='home') return;
  event.preventDefault();navigate(routes[currentView].parent);
});
document.documentElement.classList.add('has-router');
showView(viewFromHash(location.hash),{focus:Boolean(location.hash&&location.hash!=='#top'),animate:false});
