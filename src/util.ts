export const uuid = (): string => crypto.randomUUID();

// Request ids for the homeowner form are UUIDv7 (RFC 9562): the first 48 bits are the time the page was
// rendered, in Unix milliseconds. The form posts the id back, so the server can tell how long the form was
// open before it was sent, without another hidden field.
export function formRequestId(nowMs: number = Date.now()): string {
  const r = crypto.getRandomValues(new Uint8Array(10));
  const t = Math.max(0, Math.floor(nowMs)).toString(16).padStart(12, '0').slice(-12);
  const h = [...r].map((b) => b.toString(16).padStart(2, '0')).join('');
  const variant = ((r[2]! & 0x3f) | 0x80).toString(16).padStart(2, '0');
  return `${t.slice(0, 8)}-${t.slice(8, 12)}-7${h.slice(0, 3)}-${variant}${h.slice(6, 8)}-${h.slice(8, 20)}`;
}

// The render time in an id from formRequestId, or null for any other id (for example a random v4 id).
export function requestIdTime(id: string): number | null {
  const m = /^([0-9a-f]{8})-([0-9a-f]{4})-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(id);
  return m ? parseInt(m[1]! + m[2]!, 16) : null;
}

export const nowIso = (d: Date = new Date()): string => d.toISOString();

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// US numbers only for the pilot. Returns E.164 or null.
export function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function base64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return base64url(new Uint8Array(sig));
}
