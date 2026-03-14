# Backlog

Features and improvements outside the current sprint. Not prioritized — items move to the active task list when work begins.

---

## Token Pipeline — Near Term

**Plugin → GitHub API**
Upgrade the plugin to commit `tokens/figma.raw.json` directly to the repo via the GitHub Contents API, eliminating the manual paste-and-commit step. See ADR-006 for context.

**Figma REST API sync (headless)**
When an Enterprise Figma account is available, restore `scripts/fetch-tokens.mjs` into the pipeline. Eliminates the plugin step entirely — fully server-side, no Figma UI required. See ADR-004.

**GitHub Actions automated sync**
GitHub Actions workflow that runs `npm run sync-tokens` on schedule or manual trigger, commits changed token files, and triggers Vercel redeploy.

---

## Token Structure — Figma

**Space/sizing primitive scale**
A numeric spacing scale (`space/1` through `space/16` or similar) in the Primitives collection. Referenced by semantic layout tokens and component tokens.

---

## Application

**Flash of unstyled theme (FOUT) fix**
The `/tokens` page briefly renders `light/default` before `useEffect` restores saved preferences from `localStorage`. Fix with an inline `<script>` in `<head>` that reads `localStorage` and sets `data-theme`/`data-density` on `<html>` before first paint. Apply when mirroring the toggle to the real site.

**Full homepage design**
Design the homepage in Figma against the live variable system before translating to code. Replaces the current placeholder.

**Actual site content**
Implement the homepage design in Next.js once the Figma design is ready.
