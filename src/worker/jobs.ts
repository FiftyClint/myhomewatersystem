import type { Sql } from '../db/sql.ts';
import { exceptionStmt } from '../domain/repo.ts';
import { nowIso } from '../util.ts';

export interface JobRow {
  id: string; job_type: string; payload_json: string; idempotency_key: string; status: string;
  due_at: string; lease_until: string | null; attempts: number; max_attempts: number; last_error: string | null;
}

export type JobOutcome =
  | { kind: 'done' }
  | { kind: 'retry'; error: string }
  | { kind: 'unknown'; error: string } // may have taken effect; a person reconciles, no automatic resend
  | { kind: 'fatal'; error: string };

export type Handler = (payload: any, job: JobRow) => Promise<JobOutcome>;

const LEASE_MS = 60_000;

// Atomic claim. An expired lease (crashed worker) makes the job claimable again.
export async function claim(db: Sql, now = new Date()): Promise<JobRow | null> {
  const at = nowIso(now);
  return db.prepare(
    `UPDATE jobs SET status = 'running', lease_until = ?, attempts = attempts + 1
     WHERE id = (
       SELECT id FROM jobs
       WHERE (status = 'queued' AND due_at <= ?) OR (status = 'running' AND lease_until < ?)
       ORDER BY due_at LIMIT 1)
     RETURNING *`,
  ).bind(new Date(now.getTime() + LEASE_MS).toISOString(), at, at).first<JobRow>();
}

export function backoffMs(attempt: number, random = Math.random): number {
  const base = Math.min(30_000 * 2 ** (attempt - 1), 3_600_000);
  return base + Math.floor(random() * base * 0.2); // jitter
}

export async function settle(db: Sql, job: JobRow, outcome: JobOutcome, now = new Date()): Promise<void> {
  const at = nowIso(now);
  if (outcome.kind === 'done') {
    await db.prepare(`UPDATE jobs SET status = 'done', lease_until = NULL, last_error = NULL WHERE id = ?`).bind(job.id).run();
    return;
  }
  if (outcome.kind === 'retry' && job.attempts < job.max_attempts) {
    const due = new Date(now.getTime() + backoffMs(job.attempts)).toISOString();
    await db.prepare(`UPDATE jobs SET status = 'queued', lease_until = NULL, due_at = ?, last_error = ? WHERE id = ?`)
      .bind(due, outcome.error, job.id).run();
    return;
  }
  const status = outcome.kind === 'unknown' ? 'unknown_result' : 'dead';
  const severity = outcome.kind === 'unknown' ? 'high' : 'medium';
  await db.batch([
    db.prepare(`UPDATE jobs SET status = ?, lease_until = NULL, last_error = ? WHERE id = ?`).bind(status, outcome.error, job.id),
    exceptionStmt(db, severity, 'job', job.id, `${job.job_type} ${status}: ${outcome.error}`.slice(0, 300), at),
  ]);
}

export async function runJobs(db: Sql, handlers: Record<string, Handler>, opts: { max?: number; now?: () => Date } = {}): Promise<number> {
  const clock = opts.now ?? (() => new Date());
  let ran = 0;
  for (; ran < (opts.max ?? 25); ran++) {
    const job = await claim(db, clock());
    if (!job) break;
    const handler = handlers[job.job_type];
    let outcome: JobOutcome;
    try {
      outcome = handler ? await handler(JSON.parse(job.payload_json), job) : { kind: 'fatal', error: `no handler for ${job.job_type}` };
    } catch (e) {
      outcome = { kind: 'retry', error: String(e).slice(0, 300) };
    }
    await settle(db, job, outcome, clock());
  }
  return ran;
}
