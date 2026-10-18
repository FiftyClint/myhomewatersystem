import { hmac, timingSafeEqual } from '../util.ts';

// A signed, expiring link scoped to exactly one assignment. Knowing one link reveals nothing about others.
export async function makeLink(secret: string, assignmentId: string, expiresAt: Date): Promise<string> {
  const exp = Math.floor(expiresAt.getTime() / 1000);
  const body = `${assignmentId}.${exp}`;
  return `${body}.${await hmac(secret, body)}`;
}

export async function readLink(secret: string, token: string, now = new Date()): Promise<{ assignmentId: string } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts as [string, string, string];
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^\d+$/.test(exp)) return null;
  if (!timingSafeEqual(sig, await hmac(secret, `${id}.${exp}`))) return null;
  if (Number(exp) * 1000 < now.getTime()) return null;
  return { assignmentId: id };
}
