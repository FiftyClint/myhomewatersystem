import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { NotionCrm } from '../src/adapters/crm-notion.ts';
import { chooseCrm } from '../src/env.ts';
import prodPolicy from '../config/policies/production.json';
import stagingPolicy from '../config/policies/staging.json';

const DB = 'eacec3dbd9a84c02b50df41271adb04a';

// A small stand-in for the Notion API: pages keyed by id, with the properties as sent.
function fakeNotion() {
  const pages = new Map<string, { properties: Record<string, any>; children: any[]; created: number }>();
  const calls: string[] = [];
  let seq = 0;
  let dropNextCreateReply = false;
  const asRead = (props: Record<string, any>) => Object.fromEntries(Object.entries(props).map(([k, v]) => {
    if (v.title) return [k, { type: 'title', title: v.title.map((t: any) => ({ plain_text: t.text.content })) }];
    if (v.rich_text) return [k, { type: 'rich_text', rich_text: v.rich_text.map((t: any) => ({ plain_text: t.text.content })) }];
    if ('email' in v) return [k, { type: 'email', email: v.email }];
    if ('phone_number' in v) return [k, { type: 'phone_number', phone_number: v.phone_number }];
    if ('select' in v) return [k, { type: 'select', select: v.select }];
    if ('checkbox' in v) return [k, { type: 'checkbox', checkbox: v.checkbox }];
    return [k, v];
  }));
  const fetchImpl = (async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    calls.push(`${init.method} ${path}`);
    expect((init.headers as Record<string, string>)['Notion-Version']).toBe('2022-06-28');
    const ok = (j: unknown) => new Response(JSON.stringify(j), { status: 200 });
    if (init.method === 'POST' && path === `/v1/databases/${DB}/query`) {
      const f = body.filter;
      const hits = [...pages.entries()].filter(([, p]) =>
        (f.email && p.properties.Email?.email === f.email.equals) || (f.phone_number && p.properties.Phone?.phone_number === f.phone_number.equals))
        .sort((a, b) => b[1].created - a[1].created);
      return ok({ results: hits.slice(0, 1).map(([id]) => ({ id })) });
    }
    if (init.method === 'POST' && path === '/v1/pages') {
      expect(body.parent.database_id).toBe(DB);
      const id = `page-${++seq}`;
      pages.set(id, { properties: body.properties, children: [], created: seq });
      if (dropNextCreateReply) { dropNextCreateReply = false; throw new Error('timeout'); }
      return ok({ id });
    }
    const m = path.match(/^\/v1\/(pages|blocks)\/([^/]+)(\/children)?$/);
    const page = m ? pages.get(decodeURIComponent(m[2]!)) : undefined;
    if (!page) return new Response('{"message":"not found"}', { status: 404 });
    if (init.method === 'GET') return ok({ id: m![2], properties: asRead(page.properties) });
    if (m![1] === 'pages') { Object.assign(page.properties, body.properties); return ok({ id: m![2] }); }
    page.children.push(...body.children);
    return ok({ results: body.children.map((_: unknown, i: number) => ({ id: `block-${page.children.length}-${i}` })) });
  }) as unknown as typeof fetch;
  return { pages, calls, fetchImpl, dropNextReply: () => { dropNextCreateReply = true; } };
}

const contact = {
  firstName: 'Pat', lastName: 'Lee', email: 'pat@example.com', phone: '+15555550100', postalCode: '64111',
  timezone: 'America/Chicago', source: 'myhomewatersystem.com',
  tags: ['mhws', 'mhws-market-kansas-city', 'mhws-mode-dealer_partner', 'mhws-concern-hard_water', 'mhws-no-sms', 'mhws-state-received'],
};

describe('Notion lead database (Clint, 2026-10-28)', () => {
  it('a request becomes one named row with its stage, and a dealer task lands on that row', async () => {
    const n = fakeNotion();
    const crm = new NotionCrm({ token: 't', databaseId: DB }, n.fetchImpl);
    const c = await crm.upsertContact(contact);
    expect(c.status).toBe('ok');
    const id = (c as any).value.crmContactId;
    const o = await crm.createOpportunity({ crmContactId: id, name: 'Pat Lee - hard_water - 64111', stage: 'New Inquiry' });
    expect(o).toEqual({ status: 'ok', value: { crmOpportunityId: id } });
    expect(n.pages.size).toBe(1);
    const p = n.pages.get(id)!.properties;
    expect(p.Name.title[0].text.content).toBe('Pat Lee - hard_water - 64111');
    expect(p.Stage.select.name).toBe('New Inquiry');
    expect(p.Market.select.name).toBe('kansas-city');
    expect(p.Concern.rich_text[0].text.content).toBe('hard_water');
    expect(p['Texts OK'].checkbox).toBe(false);
    expect((await crm.updateOpportunityStage({ crmOpportunityId: id, stage: 'Assigned', status: 'open' })).status).toBe('ok');
    expect(n.pages.get(id)!.properties.Stage.select.name).toBe('Assigned');
    const t = await crm.createTask({ crmContactId: id, title: 'Send new lead to Hague', body: 'link', dueAt: '2026-10-29T15:00:00Z' });
    expect(t.status).toBe('ok');
    expect(n.pages.get(id)!.properties['Next step'].rich_text[0].text.content).toBe('Send new lead to Hague');
    expect(n.pages.get(id)!.children.map((b) => b.type)).toEqual(['to_do', 'paragraph']);
  });

  it('a retry after a timed-out create finds the row it already made', async () => {
    const n = fakeNotion();
    const crm = new NotionCrm({ token: 't', databaseId: DB }, n.fetchImpl);
    n.dropNextReply();
    expect((await crm.upsertContact(contact)).status).toBe('retryable');
    const again = await crm.upsertContact(contact);
    expect(again).toEqual({ status: 'ok', value: { crmContactId: 'page-1' } });
    const name = 'Pat Lee - hard_water - 64111';
    await crm.createOpportunity({ crmContactId: 'page-1', name, stage: 'New Inquiry' });
    // The opportunity call retried after it already landed changes the same row.
    await crm.createOpportunity({ crmContactId: 'page-1', name, stage: 'New Inquiry' });
    expect(n.pages.size).toBe(1);
  });

  it('a second request from the same person gets its own row with the same contact fields', async () => {
    const n = fakeNotion();
    const crm = new NotionCrm({ token: 't', databaseId: DB }, n.fetchImpl);
    const id = ((await crm.upsertContact(contact)) as any).value.crmContactId;
    await crm.createOpportunity({ crmContactId: id, name: 'Pat Lee - hard_water - 64111', stage: 'New Inquiry' });
    const second = await crm.createOpportunity({ crmContactId: id, name: 'Pat Lee - well_water - 64111', stage: 'New Inquiry' });
    expect(second).toEqual({ status: 'ok', value: { crmOpportunityId: 'page-2' } });
    const p = n.pages.get('page-2')!.properties;
    expect(p.Email.email).toBe('pat@example.com');
    expect(p.Market.select.name).toBe('kansas-city');
    expect(n.pages.get(id)!.properties.Name.title[0].text.content).toBe('Pat Lee - hard_water - 64111');
  });

  it('a Notion outage is retried, and a refused token stops for a person', async () => {
    const down = new NotionCrm({ token: 't', databaseId: DB }, (async () => new Response('', { status: 503 })) as any);
    expect((await down.upsertContact(contact)).status).toBe('retryable');
    const refused = new NotionCrm({ token: 'bad', databaseId: DB }, (async () => new Response('{"code":"unauthorized"}', { status: 401 })) as any);
    expect((await refused.upsertContact(contact)).status).toBe('fatal');
  });

  it('production writes to Notion once the token is saved; staging never writes to the production database', () => {
    const base = { CRM_PROVIDER: 'notion' as const, NOTION_TOKEN: 't', NOTION_DATABASE_ID: DB };
    expect(chooseCrm({ ...base, ENVIRONMENT: 'production' }, prodPolicy as any).crm.name).toBe('notion');
    expect(chooseCrm({ ...base, ENVIRONMENT: 'production', NOTION_TOKEN: undefined }, prodPolicy as any).reason).toBe('Notion credentials incomplete');
    expect(chooseCrm({ ...base, ENVIRONMENT: 'production' }, stagingPolicy as any).crm.name).toBe('mock');
    expect(chooseCrm({ ...base, ENVIRONMENT: 'staging', ALLOW_LIVE_CRM_IN_STAGING: 'yes' }, stagingPolicy as any).reason)
      .toBe('staging may not use the production Notion database');
    expect(chooseCrm({ ...base, ENVIRONMENT: 'staging', ALLOW_LIVE_CRM_IN_STAGING: 'yes', NOTION_DATABASE_ID: 'eacec3db-d9a8-4c02-b50d-f41271adb04a' }, stagingPolicy as any).crm.name).toBe('mock');
  });

  it('production config points at the Water Leads database and staging stays on the mock', () => {
    const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
    expect(toml).toMatch(/\[env\.production\][\s\S]*CRM_PROVIDER = "notion", NOTION_DATABASE_ID = "eacec3dbd9a84c02b50df41271adb04a"/);
    expect(toml).toMatch(/\[env\.staging\][\s\S]*CRM_PROVIDER = "mock"/);
  });
});

describe('default fetch on Workers (production bug, 2026-10-28)', () => {
  it('calls the global fetch unbound, as Workers require', async () => {
    const real = globalThis.fetch;
    // Workers reject fetch called with `this` set to another object ("Illegal invocation").
    globalThis.fetch = (function (this: unknown) {
      if (this !== undefined && this !== globalThis) throw new TypeError('Illegal invocation');
      return Promise.resolve(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    }) as unknown as typeof fetch;
    try {
      const crm = new NotionCrm({ token: 't', databaseId: DB });
      const r = await crm.upsertContact({ ...contact, email: undefined, phone: undefined } as any);
      expect(r.status).not.toBe('unknown');
      const q = await new NotionCrm({ token: 't', databaseId: DB }).updateOpportunityStage({ crmOpportunityId: 'x', stage: 'Assigned', status: 'open' });
      expect(q).toEqual({ status: 'ok', value: null });
    } finally {
      globalThis.fetch = real;
    }
  });
});
