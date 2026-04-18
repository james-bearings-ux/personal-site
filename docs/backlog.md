# Backlog

Features and improvements outside the current sprint. Not prioritized — items move to the active task list when work begins.

---

## Token Pipeline — Near Term

**Plugin → GitHub API**
Upgrade the plugin to commit `tokens/figma.raw.json` directly to the repo via the GitHub Contents API, eliminating the manual paste-and-commit step. See ADR-006 for context.

**Figma REST API sync (headless)**
When an Enterprise Figma account is available, restore `scripts/fetch-tokens.mjs` into the pipeline. Eliminates the plugin step entirely — fully server-side, no Figma UI required. See ADR-004.

---

## Component System

**Accordion density design**
Density token slots and the Densities story exist, but values haven't been deliberately spec'd in Figma yet. Needs a design pass before the story is meaningful validation.



**Icon as a component**
Formalize the CSS mask-image technique into a shared `<Icon>` component. Accepts an SVG filename (matching `/public/img/*.svg`) and renders a sized, theme-aware `<span>` using `background-color: currentColor` + `mask-image`. Would replace the inline `<Icon>` helper currently local to `Button.tsx` and the ad-hoc span in `FeatureAccordion.tsx`. Consider a token-backed size scale (e.g. `size?: "sm" | "md" | "lg"`) and an icon name union type derived from available SVG filenames.

**Token-driven component density contracts**
Components currently express breakpoint-responsive density intent via a `densityByBreakpoint` prop implemented with `matchMedia`. A future approach: encode this in the breakpoints token collection as component-specific overrides (e.g. `breakpoints-tablet/component/tabbed-slideshow/density = spacious`), with a Style Dictionary formatter outputting them as `@media`-scoped CSS attribute overrides. Eliminates JS matchMedia and makes the intent token-pipeline-visible — but couples the breakpoints and component collections. Evaluate when the component library grows enough to justify the machinery.

---

## Token Structure — Figma

**Space/sizing primitive scale**
A numeric spacing scale (`space/1` through `space/16` or similar) in the Primitives collection. Referenced by semantic layout tokens and component tokens. Currently `8px`, `12px`, `16px`, and `24px` appear as hardcoded values across multiple components with no tokens to reference — this is the root cause of most gaps in the audit below.

---

## Component Token Gap Analysis

Findings from a 2026-03-18 audit of all component CSS modules, updated 2026-03-19. Items grouped by priority.

### Quick fixes — tokens already exist, just need wiring in code

- ~~**`font-family: 'Overpass'`** in StackedImage~~ — resolved: font family is inherited from the type class.
- ~~**StackedImage `line-height`**~~ — resolved: line-height is now in all type styles via ADR 011.
- ~~**StackedImage typography**~~ — resolved: `imageTitle` now uses `type-display` class; duplicate `font-family`, `font-size`, `font-weight`, and `line-height` removed from CSS.
- **`font-weight: 600`** in Button, Tabs — hardcoded in component CSS. Not resolved via type classes (neither component applies one). Should become `--primitives-typography-weight-bold`, or ideally a component token (`--component-button-text-font-weight`) to keep it pipeline-traceable. Low priority — the value is correct.
- **`gap: 16px`** in StackedImage `.container` — one remaining hardcoded spacing value. Replace with `--primitives-space-4x`.

### Needs new tokens in Figma first

- ~~**`24px`, `12px`, `8px`, `16px` spacing**~~ — resolved: spacing primitive scale (ADR 012) introduced `primitives/space/1x`–`20x` and `breakpoints/space/1x`–`20x`. All component CSS migrated off hardcoded values and off the deprecated `layout-helpers` tokens.
- ~~**`component-accordion-icon-size`**~~ — resolved: Accordion component uses `var(--component-accordion-icon-size)` across all densities.
- **Controls bar `padding: 10px`** — odd value in `src/app/tokens/page.module.css`. Standardize to `--primitives-space-2x` (8px) or `--primitives-space-3x` (12px).

### Not actionable in CSS (known limitation)
- **`@media (min-width: 800px)`** hardcoded in FeatureAccordion, SideBySide, OffsetList — CSS media queries cannot use custom properties. The value is correct (matches `breakpoints.tablet`). Acceptable as-is unless a SASS/PostCSS build step is introduced.

---

## Developer Experience

**Ladle: page frame for full-row components**
Full-row section components (CardBand, FeatureAccordion, TabbedSlideshow, OffsetList, SideBySide) render edge-to-edge in Ladle's canvas, which hides breakpoint and grid behavior. Add a reusable story decorator or wrapper that imposes realistic max-width and grid constraints — ideally a single import shared across all affected stories rather than a per-story div.

**Ladle: story cleanup and coverage pass**
Bring all component stories up to the standard established for Button and CardBand: tighter visual presentation, labelled rows, and exhaustive prop iteration. Currently Button and CardBand are the most complete; Input, Tabs, and the section components need a similar treatment.

**axe-core accessibility integration in Ladle**
Integrate `@axe-core/react` (or the `@storybook/addon-a11y` Ladle equivalent) into the Provider in `.ladle/components.tsx` so accessibility violations surface automatically in the Ladle panel for every story. Covers contrast ratios, missing ARIA labels, incorrect heading hierarchy, and keyboard interaction issues without a separate audit step.

**Component token linter**
A script (`npm run lint:tokens`) that scans all `*.module.css` files for:
- Hardcoded color values (hex, `rgb()`, named colors)
- Hardcoded `px` spacing values not on the 4px scale
- `font-family`, `font-size`, `font-weight`, `line-height` declared outside a `.type-*` class
Could run as a pre-commit hook. Pairs with the `/new-component` skill to enforce token discipline as the library scales.

**Ladle: color theme switcher**
Add a light/dark toggle to the Ladle environment that switches `data-theme` on the Provider wrapper and updates the ground background accordingly. Investigate whether this can be tied to Ladle's own built-in color mode toggle — likely not directly, but a custom control via `argTypes` at the global level or a toolbar addon may be feasible.

**Ladle: content stress tests**
For content-rich components (Card, SideBySide, StackedImage), add stories with extreme content — very short headings, very long headings, minimal body copy, and overflow-length body copy. Validates that layout assumptions hold outside of the happy-path content authored for the `/tokens` demo page.

**Component QA with Ladle (or Storybook)**
As the component library grows, the hand-authored `/tokens` page won't catch every prop permutation. A story-based tool generates coverage automatically — every `hierarchy`, `surface`, `iconOnly`, and density combination is explorable without manually adding examples. Suggested trigger: ~8–10 components with intersecting props, or the first time a prop combination is found broken that wasn't in the `/tokens` page.

Prefer **Ladle** over Storybook for this stack — it uses the same `.stories.tsx` format (Storybook-compatible) but is significantly lighter and faster to configure with Next.js. Key setup considerations: CSS custom property injection (token CSS files must be imported in Ladle's setup file), and ensuring `data-theme`/`data-density` attributes are wrappable per-story for theme/density switching.

The `/tokens` page remains the live public demo; Ladle would be a local/CI QA surface, not a replacement.

**Codebase orientation tour**
A guided walkthrough of where key artifacts live: Style Dictionary config, generated token files (CSS + TS), component prop files, centralized style definitions, Figma plugin source, and the docs/decisions structure. Intended for onboarding or after a period away from the project.

---

## Application

**Flash of unstyled theme (FOUT) fix**
The `/tokens` page briefly renders `light/default` before `useEffect` restores saved preferences from `localStorage`. Fix with an inline `<script>` in `<head>` that reads `localStorage` and sets `data-theme`/`data-density` on `<html>` before first paint. Apply when mirroring the toggle to the real site.

**Full homepage design**
Design the homepage in Figma against the live variable system before translating to code. Replaces the current placeholder.

**Actual site content**
Implement the homepage design in Next.js once the Figma design is ready.
