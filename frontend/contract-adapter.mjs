/** Consumer projection of the frozen engineering fixture, not a competing schema. */
export const CONTRACT_COMMIT='2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a';
export const FIXTURE_HASH='b231fa24f057ce647dbf282ed8233fc88d0bbbed579995213306edac30e65d44';
const labels={unknown:'Unknown',missing:'Missing',unmeasured:'Not measured',not_applicable:'Not applicable',explicit_null:'Explicit null'};
export function formatV1(datum) {
  if (!datum || typeof datum.unit!=='string' || typeof datum.basis!=='string') throw new Error('Incomplete engineering datum');
  if (Object.hasOwn(labels,datum.status)) {
    if (datum.value!==null) throw new Error('Absent datum has value');
    return `${labels[datum.status]}${['category','1'].includes(datum.unit)?'':` [${datum.unit}]`}`;
  }
  if (datum.status!=='known' || !['number','boolean','string'].includes(typeof datum.value)) throw new Error('Invalid engineering datum');
  if (typeof datum.value==='number' && !Number.isFinite(datum.value)) throw new Error('Invalid number');
  return `${datum.value}${['category','1'].includes(datum.unit)?'':` ${datum.unit}`}`;
}
export function projectV1(bundle) {
  if (bundle?.schema_version!=='1.0.0') throw new Error('Unsupported engineering schema');
  for (const group of ['sources','components','claims','assets','scenarios','runs']) if (!Array.isArray(bundle[group]) || !bundle[group].length) throw new Error('Incomplete contract');
  if (bundle.runs.length!==1) throw new Error('This viewer is pinned to one synthetic fixture');
  const run=bundle.runs[0];
  if (run.mode!=='synthetic_fixture' || run.evidence_scope!=='none' || run.display_notice!=='SYNTHETIC FIXTURE — NOT EVIDENCE') throw new Error('Evidence mode mismatch');
  if (run.schema_version!=='1.0.0' || !run.truth_series?.length || !run.observation_series?.length || !run.command_series?.length || !run.belief_series?.length) throw new Error('Incomplete trace');
  const belief=run.belief_series.at(-1);
  if (belief.status!=='consistent' || !belief.candidates.length) throw new Error('Cannot present inconsistent belief as progress');
  for (const value of Object.values(run.outcomes)) formatV1(value);
  for (const c of bundle.components) for (const p of c.parameters) formatV1(p.quantity);
  const ids=new Set(bundle.components.map(c=>c.id));
  if (ids.size!==bundle.components.length) throw new Error('Duplicate component');
  for (const c of bundle.components) {
    if (!bundle.assets.some(a=>a.id===c.geometry_asset_id)) throw new Error('Missing asset reference');
    if (c.relationships.some(r=>!ids.has(r.target_id))) throw new Error('Missing component relationship');
  }
  return structuredClone({bundle,run,belief,truth:run.truth_series.at(-1),observation:run.observation_series.at(-1),command:run.command_series.at(-1)});
}
export async function loadPinnedV1(fetcher=fetch) {
  const response=await fetcher('/vendor/cartan/v1/fixture.json');
  if (!response.ok) throw new Error('Engineering fixture unavailable');
  const bytes=await response.arrayBuffer();
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if (digest!==FIXTURE_HASH) throw new Error('Pinned fixture hash mismatch');
  return projectV1(JSON.parse(new TextDecoder().decode(bytes)));
}
