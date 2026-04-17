# ADR-006: Figma Plugin Export Method

## Status
Accepted (Phase 2 — complete)

## Context
The Figma plugin (see ADR-004) reads variables and needs to get them out of Figma and into the repo. Figma's plugin sandbox restricts what a plugin can do: the main plugin thread has no network access, but the UI iframe can make HTTP requests. This creates options with different complexity/automation trade-offs.

## Options Considered

**Option A: Copy to clipboard**
- Plugin formats JSON and writes it to the clipboard
- Designer pastes into `tokens/figma.raw.json` in their editor and commits
- Zero infrastructure, works immediately, completely transparent
- Manual step: paste + commit

**Option B: Download as file**
- Plugin triggers a file download via the UI iframe
- Designer drags the downloaded file into the project and commits
- Slightly more cumbersome than clipboard; same manual commit requirement

**Option C: Plugin → GitHub API (direct commit)**
- Plugin UI iframe calls the GitHub Contents API to write `tokens/figma.raw.json` directly to the repo
- Fully automated from Figma: save variables → run plugin → repo updated → Vercel redeploys
- Requires storing a GitHub token in the plugin (can be done securely via plugin storage)
- This is architecturally what Tokens Studio does under the hood
- Higher complexity; appropriate once the clipboard approach is proven

## Decision
**Phase 1:** Option A (clipboard). Kept the plugin simple while the pipeline was being validated. The manual paste-and-commit step was acceptable for a personal site and a learning context.

**Phase 2:** Option C (GitHub API). Implemented once the clipboard approach was proven. The plugin UI iframe calls the GitHub Contents API directly: GET to retrieve the current file SHA, then PUT the new content. The GitHub token is stored securely via `figma.clientStorage`, which is per-user and per-plugin. The token requires Contents read+write on the repo; a fine-grained PAT scoped to this repo only is the recommended setup.

## Consequences
- Phase 2 workflow: run plugin → click Commit → done. Vercel deploys automatically on the resulting commit.
- The GitHub token is a one-time setup step; it persists across plugin sessions.
- Nothing downstream changed — Style Dictionary, GitHub Actions, and Vercel are unaware of how the file was committed.
