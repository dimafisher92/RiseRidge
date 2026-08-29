import { createClient } from '@/lib/supabase/server';
import { STORAGE_BUCKET, type ReportScreenshot } from '@/lib/supabase/types';

// All reads below go through the request-scoped server client, so RLS applies:
// a client only ever sees their own published reports; admins see everything.

export async function getLatestPublishedReport(clientId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('reports')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'published')
    .order('period_end', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

export async function listPublishedReports(clientId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('reports')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'published')
    .order('period_end', { ascending: false });
  return data ?? [];
}

export async function getReportById(reportId: string) {
  const supabase = createClient();
  const { data } = await supabase.from('reports').select('*').eq('id', reportId).maybeSingle();
  return data ?? null;
}

export async function getReportMetrics(reportId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('report_metrics')
    .select('*')
    .eq('report_id', reportId)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

// Batched metric fetch for a set of reports (avoids N+1 on the history list).
export async function getMetricsForReports(reportIds: string[]) {
  if (reportIds.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('report_metrics')
    .select('*')
    .in('report_id', reportIds)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getReportHighlights(reportId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('report_highlights')
    .select('*')
    .eq('report_id', reportId)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

// Batched highlights for a set of reports (history list teasers).
export async function getHighlightsForReports(reportIds: string[]) {
  if (reportIds.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('report_highlights')
    .select('*')
    .in('report_id', reportIds)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getReportScreenshots(reportId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('report_screenshots')
    .select('*')
    .eq('report_id', reportId)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export type SignedScreenshot = ReportScreenshot & { signedUrl: string | null };

// Turn screenshot rows into short-lived signed download URLs (1h). The Storage
// RLS policy still guards access; this is the client-facing read path.
export async function signScreenshots(
  screenshots: ReportScreenshot[],
): Promise<SignedScreenshot[]> {
  if (screenshots.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrls(
      screenshots.map((s) => s.storage_path),
      60 * 60,
    );
  const byPath = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return screenshots.map((s) => ({ ...s, signedUrl: byPath.get(s.storage_path) ?? null }));
}
