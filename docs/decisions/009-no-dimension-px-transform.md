# ADR 009: Require $type: "dimension" for component px tokens; no Style Dictionary workaround

## Context

Style Dictionary does not append `px` units to tokens typed as `$type: "number"`. When accordion component tokens were first authored in Figma, they were exported as raw integers with `$type: "number"` (e.g. `"$value": 4`), which caused CSS custom properties to emit bare numbers instead of valid `px` values (`--component-accordion-surface-v-padding: 4` instead of `4px`).

A custom Style Dictionary transform was written to patch this at build time:

```js
StyleDictionary.registerTransform({
  name: 'dimension/px',
  type: 'value',
  filter: (token) =>
    token.$type === 'number' &&
    token.path[0]?.startsWith('component-') &&
    !token.path.includes('duration'),
  transform: (token) => `${token.$value}px`,
});
```

This transform was included in the `css/extended` transform group alongside `motion/duration-ms`.

## Decision

Remove the `dimension/px` transform. Require all component tokens that represent pixel measurements to be authored in Figma with `$type: "dimension"` and explicit `px` values (e.g. `"$value": "4px"`).

## Reasons

- **Source of truth integrity.** The token type in `figma.raw.json` should accurately reflect the token's meaning. A padding value is a dimension, not a number. The workaround allowed an incorrect type to persist in the source.
- **Explicitness over magic.** A silent transform that appends `px` to all component number tokens obscures what's happening. Future authors adding number tokens (e.g. grid column counts, z-index values) could be caught by the transform unintentionally.
- **Figma supports $type: "dimension".** The correct fix is straightforward in Figma — no tooling workaround is needed.

## Consequences

- All component tokens with pixel values must use `$type: "dimension"` in `figma.raw.json`. Raw `$type: "number"` component tokens will produce unitless CSS values and break layouts silently.
- If a future Figma export produces `$type: "number"` for a px token, the error will surface immediately in the browser rather than being masked by the transform.
- The transform code above is preserved here if restoration is ever needed.
