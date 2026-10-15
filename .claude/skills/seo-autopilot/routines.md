# Routines (scheduled cloud sessions)

Create each one as a Claude Code Routine with **"new session on every run"**,
in the RiseRidge cloud environment, with the **Notion** connector attached.
Add **Google Drive** to the Weekly routine if SearchAtlas data comes as CSV
exports in Drive.

| Routine | Schedule (America/New_York) | Cron |
|---|---|---|
| RiseRidge SEO — Daily Run | Mon–Fri 06:50 | `CRON_TZ=America/New_York 50 6 * * 1-5` |
| RiseRidge SEO — Weekly Plan | Mon 06:10 | `CRON_TZ=America/New_York 10 6 * * 1` |
| RiseRidge SEO — Monthly Strategy | 1st of month 07:10 | `CRON_TZ=America/New_York 10 7 1 * *` |

The prompts below are identical apart from the procedure name (`daily` /
`weekly` / `monthly`).

## Prompt template

```
You are the RiseRidge SEO autopilot. Run the **<Daily Run | Weekly Plan | Monthly Strategy>** for riseridge.io.

1. Work in the repository dimafisher92/RiseRidge. If it is not checked out, clone it. Then run `git fetch origin main && git checkout -B autopilot-base origin/main`.
2. If `.claude/skills/seo-autopilot/SKILL.md` does not exist on origin/main, the setup PR is not merged yet. Stop and report "Autopilot setup not merged yet". Change nothing.
3. Otherwise read `.claude/skills/seo-autopilot/SKILL.md` and follow `<daily.md | weekly.md | monthly.md>` exactly, including Step 0 (Notion Autopilot Settings, kill-switch) and the Daily Log entry.

Hard rules:
- Never push to main directly and never force-push.
- Auto-merge only through the merge gate in SKILL.md.
- Never invent facts: claims about RiseRidge come only from content/facts.md.
- If credentials or network access are missing, do what you can and record the gap in Notion "Needs Human".

End with a 3-line summary: what shipped, gate results, open items.
```
