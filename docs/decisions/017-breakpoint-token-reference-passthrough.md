# ADR-017: Breakpoint Token Reference Passthrough

## Status
Accepted.

## Context

The token pipeline builds five CSS files from `tokens/figma.raw.json`. One of them — `tokens.breakpoints.css` — outputs breakpoint-scoped values as CSS custom properties inside mobile-first `@media` blocks:

```css
:root         { --grid-edge: 8px; }
@media (min-width: 768px)  { :root { --grid-edge: 16px; } }
@media (min-width: 1440px) { :root { --grid-edge: 24px; } }
```

The question arose when `content-band` and `block-quote` component tokens were added in Figma with their values set as references to breakpoint variables (e.g. `grid / edge`, `space / 8x`). Style Dictionary's default behavior resolves all references to their final values at build time, so a component token referencing `breakpoint-mobile / grid / edge` would output `8px` — flat, not responsive.

A second problem appeared alongside this: Figma's plugin API uses internal mode IDs (e.g. "mode-1") rather than display names ("mobile") when writing variable reference strings for component tokens. The raw JSON contained `{breakpoint-mode-1.grid.edge}` instead of `{breakpoint-mobile.grid.edge}`, causing Style Dictionary to throw a reference resolution error.

## Options Considered

### A — Resolve to flat values (default Style Dictionary behavior)
Component tokens always hold a single resolved value. If a component needs responsive spacing, the component's own CSS handles it explicitly by reading the breakpoint CSS variables directly.

- **Pro:** Simple pipeline, no special logic.
- **Con:** Breaks the authoring intent — a designer who wires a component token to a breakpoint variable expects responsive behavior. The connection expressed in Figma is silently discarded. Also requires authors to know to bypass component tokens and reach for breakpoint vars directly in component CSS.

### B — Pass breakpoint references through as CSS `var()` (chosen)
When a component token's original value is a reference to a breakpoint collection token, output `var(--grid-edge)` instead of the resolved value. The breakpoint CSS variables already respond to viewport width via media queries; the component token inherits this for free through the CSS cascade.

- **Pro:** Authoring intent is preserved end-to-end. A component token referencing a breakpoint variable becomes inherently responsive with no extra work in component CSS. The Figma → CSS relationship is explicit and readable in the generated file.
- **Con:** Requires a custom value resolver in the component format and a preprocessor to normalize mode names. Slightly more pipeline complexity.

## Decision

Option B. Component tokens that alias breakpoint variables should remain aliases in the CSS output — the cascade handles responsiveness automatically.

Two pipeline additions implement this:

**1. Preprocessor — normalize Figma mode IDs:**

Figma's plugin API writes internal mode IDs ("mode-1", "mode-2", "mode-3") in variable reference strings for component tokens. These map positionally to the named breakpoint modes by ascending min-width: mode-1 = mobile, mode-2 = tablet, mode-3 = desktop. A preprocessor rewrites these before Style Dictionary resolves references:

```js
obj[key] = val.replace(
  /\{(breakpoint)-(mode-\d+)\./g,
  (_, collection, mode) => `{${collection}-${BREAKPOINT_MODE_MAP[mode] ?? mode}.`,
);
```

**2. `tokenValue()` helper in the component format:**

After reference resolution, checks `token.original.$value` for breakpoint reference strings and outputs `var(--{path})` instead of the resolved value:

```js
function tokenValue(token) {
  const orig = token.original?.$value;
  if (typeof orig === 'string' && orig.startsWith('{') && orig.endsWith('}')) {
    const segments = orig.slice(1, -1).split('.');
    if (segments[0].startsWith('breakpoint-')) {
      return `var(--${segments.slice(1).join('-')})`;
    }
  }
  return token.$value;
}
```

The result for a component token referencing `breakpoint-mobile / grid / edge`:

```css
--component-content-band-h-padding: var(--grid-edge);
```

## Consequences

- Component tokens can now be authored in Figma as breakpoint variable references without any pipeline workaround. The responsive behavior is implicit.
- The mode-name normalization is positional (mode-1 = mobile). If the breakpoint collection gains modes or its order changes in Figma, `BREAKPOINT_MODE_MAP` in `style-dictionary.config.mjs` must be updated to match.
- The passthrough applies only to breakpoint references. Tokens referencing semantic or primitive collections continue to resolve to flat values, which is correct — those collections are not responsive.
- Component authors do not need to read breakpoint CSS variables directly in component CSS for spacing or layout values that should track the breakpoint grid. The component token is the right level of abstraction.
