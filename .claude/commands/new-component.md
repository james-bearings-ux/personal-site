# New Component

Create a new React component named $ARGUMENTS.

## Conventions

Use `src/components/FeatureAccordion.tsx` and `src/components/FeatureAccordion.module.css` as the reference for coding style, naming conventions, and token usage patterns.

## Token reference

All token values come from `src/styles/`. Use tokens for every attribute where one exists — no hardcoded colors, spacing, motion, or typography values.

| File | Use for |
|---|---|
| `tokens.css` | Primitives: space (`--primitives-space-Nx`), border-radius, motion duration/easing/distance, typography weight/size |
| `tokens.semantic.css` | Colors: `--semantic-color-text-*`, `--semantic-color-surface-*`, `--semantic-color-border-*`, `--semantic-color-interaction-*` |
| `tokens.component.css` | Density-responsive component tokens (`--component-*`) |
| `tokens.breakpoints.css` | Responsive space and grid tokens (`--space-Nx`, `--grid-*`) |
| `src/styles/tokens.surface.ts` | Surface prop pattern — import `surfaceTokens` and `Surface` for any component that accepts a `surface` prop |

Use `--primitives-space-Nx` for fixed internal component spacing. Use `--space-Nx` for layout-level spacing that should respond to breakpoints.

## Typography

Always use `.type-*` utility classes for text styling. Never write `font-family`, `font-size`, `font-weight`, or `line-height` in component CSS. Heading elements (`h1`–`h6`) must use the matching semantic HTML element — do not apply heading type classes to `<div>` or `<p>` except for `type-display` / `type-display-l`, which may be used on `<p>` for decorative or overlay text only.

## Files to create

### 1. `src/components/$ARGUMENTS.tsx`

- TypeScript, functional component
- Props interface defined above the component function
- Compound child components (if needed) defined in the same file, following the `AccordionPanel` pattern in FeatureAccordion
- `"use client"` directive only if the component uses React hooks or browser APIs
- Import surface tokens from `@/styles/tokens.surface` if the component accepts a `surface` prop

### 2. `src/components/$ARGUMENTS.module.css`

- CSS Modules
- Token-only values — no hardcoded colors, spacing, or motion values
- Section comments using the `/* ── Section name ──── */` style from FeatureAccordion
- Density-responsive rules via `:global([data-density="compact"]) .className` if needed

### 3. `src/components/$ARGUMENTS.stories.tsx`

- Ladle story file
- Default export: `{ title: "$ARGUMENTS" } satisfies StoryDefault`
- Cover all prop combinations relevant to visual QA
- Include a `Densities` story showing the component at compact / default / spacious in a labelled column
- If the component accepts a `surface` prop, include an `Interactive` story with a `surface` radio control and a `var(--semantic-color-surface-ground)` background wrapper
- Reference existing stories (Button.stories.tsx, CardBand.stories.tsx) for presentation patterns

## After creating files

Append a short gap analysis entry to `docs/backlog.md` under **Component Token Gap Analysis** noting:
- Any attributes that currently use hardcoded values because a token doesn't exist yet
- Any density or surface variants not yet designed
- Any interactive states (hover, focus, disabled) that lack explicit token coverage
