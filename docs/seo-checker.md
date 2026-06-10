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
includes a one-sentence "what you gain if ArcWave fixes this" benefit.

### Search Atlas / OTTO boost

Sites we've optimized score well automatically. `parse.ts` scans the page for the OTTO
markers in `src/lib/seo-checker/config.ts` (e.g. `searchatlas`, `otto-pixel`,
`sa-dynamic-optimization`). If detected, `scoring.ts` lifts the overall into the **85–95**
range, bumps weak category cards, and shows an "Optimized by ArcWave" badge.

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

1. Create a Google Sheet. In row 1 add headers:
   `Timestamp | Name | Email | Phone | Website | Score`.
2. **Extensions → Apps Script**, replace the code with:

   ```javascript
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
       var d = JSON.parse(e.postData.contents);
       sheet.appendRow([
         d.timestamp || new Date().toISOString(),
         d.name || '',
         d.email || '',
         d.phone || '',
         d.url || '',
         d.score || '',
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

3. **Deploy → New deployment → Web app**. Set *Execute as: Me*, *Who has access:
   Anyone*. Copy the Web App URL.
4. Put that URL in `GOOGLE_SHEETS_WEBHOOK_URL`.

## Notes

- All page fetching is server-side, so there are no browser CORS issues.
- The audit has a ~9s timeout, a 3 MB size cap, a realistic User-Agent, and friendly
  errors for invalid URLs, timeouts, non-HTML responses, and bot-blocking sites.
- The tool uses **no AI** and no third-party scoring APIs — it is fully independent.
