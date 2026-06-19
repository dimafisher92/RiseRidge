# Free SEO Website Checker

A self-contained, lead-generating SEO audit tool at **`/seo-checker`**. A visitor
enters any website, we fetch and analyze the page **server-side and deterministically
(no AI)**, and present a business-friendly report. The score and the valuable
explanations are blurred behind a name/email/phone gate; unlocking captures the lead
into a Google Sheet. The report can be saved as a branded PDF.

## How it works

```
Visitor → /seo-checker (SeoChecker.tsx)
  → POST /api/seo-checker/audit  → fetchPage → parse (node-html-parser) → checks → scoring
  → AuditReport (score + paragraphs blurred)
  → LeadGate form → POST /api/seo-checker/lead → Google Apps Script webhook → Google Sheet
  → report un-blurs → "Save as PDF" (window.print + @media print, logo + watermark)
```

Key files:
- `src/app/seo-checker/page.tsx` — the page.
- `src/components/seo-checker/*` — UI (orchestrator, loader, report, score gauge, lead gate, PDF button).
- `src/app/api/seo-checker/audit/route.ts` — runs the audit.
- `src/app/api/seo-checker/lead/route.ts` — forwards leads to the webhook.
- `src/lib/seo-checker/*` — the deterministic engine (`fetchPage`, `parse`, `checks`, `scoring`, `copy`, `config`).

## Scoring

Categories and weights: **On-Page 30, Content 25, Technical 25, Links 20**. Each check
is `pass` / `warn` / `fail`; category score = earned/max ×100; overall = weighted blend.
Every check has plain-English copy in `src/lib/seo-checker/copy.ts`, and every warn/fail
includes a one-sentence "what you gain if RiseRidge fixes this" benefit.

### Search Atlas / OTTO boost

Sites we've optimized score well automatically. `parse.ts` scans the page for the OTTO
markers in `src/lib/seo-checker/config.ts` (e.g. `searchatlas`, `otto-pixel`,
`sa-dynamic-optimization`). If detected, `scoring.ts` lifts the overall into the **85–95**
range, bumps weak category cards, and shows an "Optimized by RiseRidge" badge.

Because OTTO is sometimes injected client-side (not visible in server-fetched HTML), you
can also force-boost specific domains via the `SEARCH_ATLAS_ALLOWLIST` env var.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | recommended | Apps Script Web App URL; leads are POSTed here. If unset, reports still unlock but leads are not saved. |
| `SEARCH_ATLAS_ALLOWLIST` | optional | Comma-separated apex domains that always score high. |

On Vercel, add the same variables under **Project → Settings → Environment Variables**.

## Setting up the Google Sheet (Apps Script webhook)

Each lead is written as one row with these columns (the script creates the header
row automatically on the first lead, so you can start from a blank sheet):

`Timestamp | Name | Email | Phone | Website | Score | Device | Browser | OS | User Agent | Language | Timezone | Screen | Referrer | Location | IP`

1. Open your Google Sheet → **Extensions → Apps Script**, replace the code with:

   ```javascript
   var HEADERS = [
     'Timestamp', 'Name', 'Email', 'Phone', 'Website', 'Score',
     'Device', 'Browser', 'OS', 'User Agent', 'Language', 'Timezone',
     'Screen', 'Referrer', 'Location', 'IP',
   ];

   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
       // Create the header row once, on a blank sheet.
       if (sheet.getLastRow() === 0) {
         sheet.appendRow(HEADERS);
         sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
         sheet.setFrozenRows(1);
       }
       var d = JSON.parse(e.postData.contents);
       sheet.appendRow([
         d.timestamp || new Date().toISOString(),
         d.name || '',
         d.email || '',
         d.phone || '',
         d.url || '',
         d.score || '',
         d.device || '',
         d.browser || '',
         d.os || '',
         d.userAgent || '',
         d.language || '',
         d.timezone || '',
         d.screen || '',
         d.referrer || '',
         d.location || '',
         d.ip || '',
       ]);
       return ContentService
         .createTextOutput(JSON.stringify({ ok: true }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService
         .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

2. **Deploy → New deployment → Web app**. Set *Execute as: Me*, *Who has access:
   Anyone*. Authorize when prompted, then copy the Web App URL (ends in `/exec`).
3. Put that URL in `GOOGLE_SHEETS_WEBHOOK_URL` locally (`.env.local`) **and** on Vercel
   (**Project → Settings → Environment Variables**), then redeploy.
4. Test: submit the lead form on `/seo-checker` (or `curl -X POST <url> -H 'Content-Type:
   application/json' -d '{"name":"Test","email":"t@t.com","phone":"123","url":"example.com","score":72}'`).
   A new row should appear in the sheet.

> **Note on geo/IP:** `Location` and `IP` are derived from Vercel's edge headers, so
> they populate on the deployed site (riseridge.io / Vercel preview), not on `localhost`.
> Re-deploying the Apps Script after editing it issues a new `/exec` URL only if you pick
> "New deployment" — use **Manage deployments → Edit → Version: New** to keep the same URL.

## Notes

- All page fetching is server-side, so there are no browser CORS issues.
- The audit has a ~9s timeout, a 3 MB size cap, a realistic User-Agent, and friendly
  errors for invalid URLs, timeouts, non-HTML responses, and bot-blocking sites.
- The tool uses **no AI** and no third-party scoring APIs — it is fully independent.
