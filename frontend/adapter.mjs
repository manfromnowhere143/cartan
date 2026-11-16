/** Frontend-local presentation adapter. This is not the engineering v1 schema. */
export const FIXTURE_SCHEMA = 'cartan-ui-fixture/0.1';
const absent = new Map([
  ['unknown', 'Unknown'], ['missing', 'Missing'], ['unmeasured', 'Not measured'],
  ['not_applicable', 'Not applicable'], ['null', 'Explicit null'],
]);
export function formatDatum(datum) {
  if (!datum || typeof datum !== 'object' || Array.isArray(datum)) throw new Error('Tagged datum required');
  if (absent.has(datum.state)) {
    if ('value' in datum) throw new Error('Absent state cannot carry a value');
    return absent.get(datum.state);
  }
  if (datum.state !== 'value' || !['string', 'number', 'boolean'].includes(typeof datum.value)) throw new Error('Invalid datum');
  if (typeof datum.value === 'number' && !Number.isFinite(datum.value)) throw new Error('Non-finite value');
  return `${datum.value}${datum.unit ? ` ${datum.unit}` : ''}`;
}
export function readFixture(input) {
  if (!input || input.schema !== FIXTURE_SCHEMA || input.mode !== 'synthetic_fixture') throw new Error('Unsupported fixture contract or evidence mode');
  for (const key of ['id', 'label', 'source', 'command', 'observation', 'belief']) {
    if (typeof input[key] !== 'string' || !input[key].trim()) throw new Error(`Missing ${key}`);
  }
  for (const key of ['physical_state', 'model_version', 'controller_version', 'run_timestamp', 'seed']) formatDatum(input[key]);
  if (!Array.isArray(input.limitations) || !input.limitations.length || input.limitations.some(x => typeof x !== 'string')) throw new Error('Limitations required');
  for (const key of ['retention_loss', 'unsafe_energization', 'exceeded_limits', 'completion', 'elapsed_time']) {
    if (!input.outcomes || input.outcomes[key]?.state !== 'unmeasured') throw new Error('UI example must not invent outcomes');
    formatDatum(input.outcomes[key]);
  }
  return structuredClone(input);
}
export function evidenceState(mode) {
  const states = {
    planned: ['Experiment planned', 'The proposed study compares interrupted exchange with competent recovery, operator assistance and simpler sensing or interlocks. Mission limits and acceptance criteria remain unresolved.'],
    simulation: ['No simulation replay loaded', 'A replay needs a versioned model, configuration hashes, separated truth and observations, outcomes and limitations. A generated film cannot stand in for those records.'],
    physical_test: ['No physical-test record loaded', 'No measured hardware results are supplied to this experience. A future contained fixture requires reviewed limits and independent instrumentation.'],
    inconclusive: ['How an inconclusive result would appear', 'Presentation example only. An inconclusive result would remain inconclusive; it would not be displayed as success or replaced with zero. No such CARTAN result is being reported here.'],
  };
  if (!Object.hasOwn(states, mode)) throw new Error('Unknown evidence view');
  return states[mode];
}
export function mayPlayHero({available, reducedMotion, visible, inView, filmOpen, requested}) {
  return Boolean(available && requested && !reducedMotion && visible && inView && !filmOpen);
}
