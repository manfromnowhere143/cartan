import {pathFor,viewFromURL} from './routes.mjs';

export const PARTS=['module','retention','isolation','support'];
export const RECORDS=['planned','simulation','physical_test','inconclusive'];
const member=(value,values,fallback)=>values.includes(value)?value:fallback;

// The URL is the only persistent selection state. Unknown values are never data.
export function workspaceFromURL(url) {
  const view=viewFromURL(url),p=new URLSearchParams(url.search);
  const state={view,part:member(p.get('part'),PARTS,view==='interruption'?'retention':'module'),
    detail:view==='laboratory'&&p.get('detail')==='interface'?'interface':null,
    record:member(p.get('record'),RECORDS,'planned'),
    from:p.get('from')==='interruption'&&['evidence','comparison','sources'].includes(view)?'interruption':null};
  if(['interface','profile'].includes(p.get('camera')))state.camera=p.get('camera');
  for(const [key,min,max]of [['az',-175,175],['el',-15,65]]){
    const value=p.get(key);if(value!==null&&/^-?\d{1,3}$/.test(value)&&Number(value)>=min&&Number(value)<=max)state[key]=Number(value);
  }
  if(p.get('layout')==='separated')state.layout='separated';
  if(p.get('render')==='drawing')state.render='drawing';
  if(p.get('notes')==='closed'&&!['home','vision'].includes(view))state.notes='closed';
  return state;
}
export function workspaceURL(state) {
  const p=new URLSearchParams();
  if(state.view!=='home'&&PARTS.includes(state.part)&&(state.part!=='module'||state.view==='interruption'))p.set('part',state.part);
  if(state.view==='laboratory'&&state.detail==='interface')p.set('detail','interface');
  if(state.view==='evidence'&&RECORDS.includes(state.record)&&state.record!=='planned')p.set('record',state.record);
  if(['evidence','comparison','sources'].includes(state.view)&&state.from==='interruption')p.set('from','interruption');
  if(state.view!=='home'){
    if(['interface','profile'].includes(state.camera))p.set('camera',state.camera);
    for(const [key,min,max]of [['az',-175,175],['el',-15,65]])if(Number.isInteger(state[key])&&state[key]>=min&&state[key]<=max)p.set(key,state[key]);
    if(state.layout==='separated')p.set('layout','separated');
    if(state.render==='drawing')p.set('render','drawing');
    if(state.notes==='closed'&&state.view!=='vision')p.set('notes','closed');
  }
  return pathFor(state.view)+(p.size?'?'+p:'');
}
export function parentState(state) {
  if(state.view==='laboratory'&&state.detail)return {...state,detail:null};
  if(state.view==='laboratory'&&state.part!=='module')return {...state,part:'module'};
  const parent={home:'home',question:'home',laboratory:'home',interruption:'laboratory',
    evidence:state.from==='interruption'?'interruption':'home',comparison:'evidence',sources:'question',vision:'home'};
  return {...state,view:parent[state.view]??'home',detail:state.view==='interruption'?'interface':null};
}

/** A text-only projection. It does not derive physical geometry or probabilities. */
export function inspectionFacts({run,observation,belief,truth}) {
  if(run.mode!=='synthetic_fixture'||run.evidence_scope!=='none')throw new Error('Unsupported inspection mode');
  return {notice:run.display_notice,variable:observation.variable,value:String(observation.reading.value),
    validity:observation.validity,source:observation.source_id,sampled:observation.sampled_at_s,
    received:observation.received_at_s,epoch:observation.epoch,
    candidates:belief.candidates.map(c=>({host:c.host,support:c.support,connector:c.connector,source:c.source})),
    assignedHost:truth.state.host};
}
