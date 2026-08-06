import { NextResponse } from 'next/server';
import { getSessionContext, type SessionContext } from './session';

export type AdminGuard =
  | { ok: true; ctx: SessionContext }
  | { ok: false; response: NextResponse };

// Guard for admin API route handlers. Verifies the caller's session + admin
// role using the request-scoped (RLS) client BEFORE any service-role work.
export async function requireAdminApi(): Promise<AdminGuard> {
  const ctx = await getSessionContext();
  if (!ctx) {
    return { ok: false, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  }
  if (ctx.profile.role !== 'admin') {
    return { ok: false, response: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  }
  return { ok: true, ctx };
}
