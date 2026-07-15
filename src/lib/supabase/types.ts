// Domain + database types for the client portal.
//
// These mirror the SQL in supabase/migrations. If you later run
// `supabase gen types typescript`, you can replace `Database` with the
// generated version — the hand-written shape below keeps queries typed today.

export type Role = 'client' | 'admin';
export type ClientStatus = 'active' | 'paused';
export type ReportStatus = 'draft' | 'published';
export type MetricUnit = 'number' | 'currency' | 'percent' | 'duration_s';
export type NotificationKind = 'new_report' | 'trend_alert';

// NOTE: these are `type` aliases (not `interface`) on purpose — postgrest-js
// constrains each table Row to `Record<string, unknown>`, which object-literal
// type aliases satisfy but interfaces do not (interfaces are open to
// augmentation and lack an implicit index signature). Using `interface` here
// silently collapses all query result types to `never`.

export type Client = {
  id: string;
  name: string;
  slug: string;
  slack_channel_url: string | null;
  status: ClientStatus;
  notify_opt_out: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  role: Role;
  client_id: string | null;
  full_name: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  client_id: string;
  title: string;
  summary: string | null;
  period_start: string;
  period_end: string;
  compare_start: string | null;
  compare_end: string | null;
  status: ReportStatus;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
};

export type ReportMetric = {
  id: string;
  report_id: string;
  key: string;
  label: string;
  current_value: number;
  prior_value: number | null;
  unit: MetricUnit;
  higher_is_better: boolean;
  decimals: number;
  sort_order: number;
  created_at: string;
};

export type ReportScreenshot = {
  id: string;
  report_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type NotificationLog = {
  id: string;
  client_id: string;
  kind: NotificationKind;
  report_id: string | null;
  metric_key: string | null;
  dedupe_key: string;
  sent_at: string;
};

// Minimal generic shape so `createClient<Database>()` gives typed tables.
// Empty schema sections use `{ [_ in never]: never }` (the canonical Supabase
// form) rather than `Record<string, never>`, which would break table inference.
type Table<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      clients: Table<Client>;
      profiles: Table<Profile>;
      reports: Table<Report>;
      report_metrics: Table<ReportMetric>;
      report_screenshots: Table<ReportScreenshot>;
      notifications_log: Table<NotificationLog>;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

export const STORAGE_BUCKET = 'report-assets';
