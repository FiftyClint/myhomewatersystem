// Finds the "My Home Water System" pipeline in the HighLevel sub-account, or makes it with the stages in
// src/domain/crm-stages.ts, and prints {"pipelineId", "stageMap"} for the deploy workflow to store as
// Worker secrets. Run only by the production deploy, only when the HIGHLEVEL_TOKEN secret exists.
// Endpoints (HighLevel API docs, version 2021-07-28, read 2026-10-28):
//   GET  /opportunities/pipelines?locationId=...   (list)
//   POST /opportunities/pipelines                  (create; body name, stages, locationId; scope pipelines.create)
// The create response does not document stage IDs, so the stages are read back from the list.
import { CRM_STAGES } from '../src/domain/crm-stages.ts';

const NAME = 'My Home Water System';
const token = process.env.HIGHLEVEL_TOKEN;
const locationId = process.argv[2];
if (!token || !locationId) { console.error('Need HIGHLEVEL_TOKEN and a location ID.'); process.exit(1); }

const base = 'https://services.leadconnectorhq.com';
const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json' };

interface Pipeline { id: string; name: string; stages: { id: string; name: string }[] }

async function list(): Promise<Pipeline[]> {
  const r = await fetch(`${base}/opportunities/pipelines?locationId=${encodeURIComponent(locationId!)}`, { headers });
  if (!r.ok) throw new Error(`list pipelines: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  return ((await r.json()) as { pipelines?: Pipeline[] }).pipelines ?? [];
}

let p = (await list()).find((x) => x.name === NAME);
if (!p) {
  const stages = CRM_STAGES.map((name, position) => ({ name, position, showInFunnel: true, showInPieChart: true }));
  const r = await fetch(`${base}/opportunities/pipelines`, {
    method: 'POST', headers, body: JSON.stringify({ name: NAME, locationId, stages, showInFunnel: true, showInPieChart: true }),
  });
  if (!r.ok) throw new Error(`create pipeline: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  p = (await list()).find((x) => x.name === NAME);
  if (!p) throw new Error('pipeline was created but does not appear in the list');
}
const stageMap: Record<string, string> = {};
for (const name of CRM_STAGES) {
  const s = p.stages.find((x) => x.name === name);
  if (!s) throw new Error(`pipeline "${NAME}" has no stage "${name}"; fix it in HighLevel, then deploy again`);
  stageMap[name] = s.id;
}
console.log(JSON.stringify({ pipelineId: p.id, stageMap }));
