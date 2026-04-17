/**
 * Style Dictionary configuration.
 * Reads tokens/figma.raw.json and outputs:
 *   src/styles/tokens.css              — primitive tokens as CSS custom properties on :root
 *   src/styles/tokens.semantic.css     — [data-theme="light"] and [data-theme="dark"] blocks
 *   src/styles/tokens.component.css    — :root block (modeless component tokens) +
 *                                        [data-density="compact/default/spacious"] blocks (density tokens)
 *                                        Both collections emit --component-* CSS variable names.
 *   src/styles/tokens.breakpoints.css  — mobile-first @media query blocks for grid/layout tokens
 *   src/styles/tokens.typography.css   — typography composite tokens as .type-* utility classes
 *
 * Figma collections → CSS prefixes:
 *   primitive              → --primitive-*         (tokens.css, :root)
 *   semantic-light/dark    → --semantic-*          (tokens.semantic.css, [data-theme])
 *   semantic-motion        → --semantic-motion-*   (tokens.semantic.css, :root)
 *   density-[mode]/component → --component-*       (tokens.component.css, [data-density] / :root)
 *   breakpoint-*         → --grid-* / --layout-* (tokens.breakpoints.css, @media)
 *
 * Tokens with any path segment prefixed with "_" are Figma-only and skipped in all outputs.
 *
 * Intentional exceptions to the primitive-alias convention:
 *   density / button / surface / height       (32/36/50px) — optically derived target heights,
 *   density / input  / surface / height       (26/34/50px)   not multiples of the space scale
 *   density / button / icon / surface / h-padding (6/5/12px) — optical icon centering compensation
 * These are hardcoded in Figma by design. There is no primitive they should alias to.
 *
 * Run via: npm run build-tokens
 */

import StyleDictionary from 'style-dictionary';

// ---------------------------------------------------------------------------
// Custom transform: motion duration → ms
//
// Duration tokens use $type: "number" (raw integer milliseconds) because
// Figma has no native duration type. The css transformGroup does not add
// units to number tokens, so we append "ms" here.
//
// Scoped to tokens whose path includes "duration" so other number tokens
// (e.g. grid columns) are unaffected.
// ---------------------------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'motion/duration-ms',
  type: 'value',
  filter: (token) => token.$type === 'number' && token.path.includes('duration'),
  transform: (token) => `${token.$value}ms`,
});

// Figma has no native border-width type; tokens are stored as $type: "number"
// (raw integer px) and need a "px" suffix added here.
StyleDictionary.registerTransform({
  name: 'border/width-px',
  type: 'value',
  filter: (token) => token.$type === 'number' && token.path.includes('width') && token.path.includes('border'),
  transform: (token) => `${token.$value}px`,
});

StyleDictionary.registerTransformGroup({
  name: 'css/extended',
  transforms: [
    ...(StyleDictionary.hooks.transformGroups['css'] ?? []),
    'motion/duration-ms',
    'border/width-px',
  ],
});

// ---------------------------------------------------------------------------
// Custom format: semantic CSS variables
//
// Outputs two kinds of blocks into tokens.semantic.css:
//
//   1. :root — modeless semantic collections (e.g. semantic-motion).
//      No theme variation; defined once.
//      path ["semantic-motion","interactive","duration"] → --semantic-motion-interactive-duration
//
//   2. [data-theme="light/dark"] — modal semantic-color collections.
//      Variable names strip the mode suffix so the same var name works
//      across themes: "semantic-light/color/text/primary" → --semantic-color-text-primary
//      in both [data-theme="light"] and [data-theme="dark"].
//
// The modal/modeless distinction: modal collections contain a known theme
// mode as their last hyphen-separated segment (light, dark).
// ---------------------------------------------------------------------------

const THEME_MODES = new Set(['light', 'dark']);

StyleDictionary.registerFormat({
  name: 'css/semantic-variables',
  format: ({ dictionary }) => {
    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    // 1. Modeless semantic tokens → :root
    const modeless = dictionary.allTokens.filter((t) => {
      const segments = t.path[0].split('-');
      return !THEME_MODES.has(segments[segments.length - 1]);
    });
    if (modeless.length > 0) {
      lines.push(':root {');
      for (const token of modeless) {
        const varName = `--${token.path.join('-')}`;
        lines.push(`  ${varName}: ${token.$value};`);
      }
      lines.push('}');
      lines.push('');
    }

    // 2. Modal semantic tokens → [data-theme] blocks
    const groups = new Map();
    for (const token of dictionary.allTokens) {
      const segments = token.path[0].split('-');
      if (!THEME_MODES.has(segments[segments.length - 1])) continue;
      const key = token.path[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(token);
    }

    for (const [key, tokens] of groups) {
      const segments = key.split('-');
      const themeName = segments.pop();
      const collectionBase = segments.join('-');
      lines.push(`[data-theme="${themeName}"] {`);
      for (const token of tokens) {
        const varName = `--${collectionBase}-${token.path.slice(1).join('-')}`;
        lines.push(`  ${varName}: ${token.$value};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: themed CSS blocks (used for density/component)
//
// Groups tokens by their first path segment (e.g. "semantic-light",
// "component-default") and outputs one [data-*] scoped block per mode.
//
// Variable names strip the mode suffix so the same var name works across
// themes: "semantic-light/color/text/primary" → "--semantic-color-text-primary"
// in both [data-theme="light"] and [data-theme="dark"].
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/themed-variables',
  format: ({ dictionary, options }) => {
    const { attribute = 'data-theme' } = options ?? {};

    // Group tokens by first path segment.
    const groups = new Map();
    for (const token of dictionary.allTokens) {
      const key = token.path[0]; // e.g. "semantic-light"
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(token);
    }

    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    for (const [key, tokens] of groups) {
      // "semantic-light" → theme = "light", base = "semantic"
      // "component-compact" → theme = "compact", base = "component"
      const segments = key.split('-');
      const themeName = segments.pop();          // last segment = mode name
      const collectionBase = segments.join('-'); // everything before it

      lines.push(`[${attribute}="${themeName}"] {`);
      for (const token of tokens) {
        // Rebuild var name as "--{collectionBase}-{rest of path}"
        // e.g. path ["semantic-light","color","text","primary"] → "--semantic-color-text-primary"
        const varName = `--${collectionBase}-${token.path.slice(1).join('-')}`;
        lines.push(`  ${varName}: ${token.$value};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: component + density CSS variables
//
// Outputs two kinds of blocks into tokens.component.css:
//
//   1. :root — modeless "component" collection (fixed attributes like border-radius,
//      font-weight). No density variation; defined once.
//      path ["component","button","border-radius"] → --component-button-border-radius
//
//   2. [data-density="compact/default/spacious"] — "density" collection (attributes
//      that vary across density modes: padding, height, font-size, gap, etc.).
//      path ["density-compact","button","padding"] → --component-button-padding
//
// Both collections normalize to the --component-* CSS prefix. The two-collection
// split is a Figma authoring concern; CSS consumers see one unified namespace.
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/component-variables',
  format: ({ dictionary }) => {
    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    // 1. Modeless component tokens → :root
    const modeless = dictionary.allTokens.filter((t) => t.path[0] === 'component');
    if (modeless.length > 0) {
      lines.push(':root {');
      for (const token of modeless) {
        // path: ['component','button','border-radius'] → '--component-button-border-radius'
        const varName = `--${token.path.join('-')}`;
        lines.push(`  ${varName}: ${token.$value};`);
      }
      lines.push('}');
      lines.push('');
    }

    // 2. Density-modal tokens → [data-density="..."] blocks
    const groups = new Map();
    for (const token of dictionary.allTokens) {
      if (!token.path[0].startsWith('density-')) continue;
      const key = token.path[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(token);
    }

    const order = ['density-compact', 'density-default', 'density-spacious'];
    for (const key of order) {
      if (!groups.has(key)) continue;
      const densityName = key.replace('density-', '');
      lines.push(`[data-density="${densityName}"] {`);
      for (const token of groups.get(key)) {
        // path: ['density-compact','button','padding'] → '--component-button-padding'
        const varName = `--component-${token.path.slice(1).join('-')}`;
        lines.push(`  ${varName}: ${token.$value};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: breakpoint-scoped CSS variables
//
// Groups tokens by breakpoint collection (breakpoint-mobile, -tablet,
// -desktop), reads the "min-width" token to construct the @media condition,
// then outputs all other non-skipped tokens as CSS custom properties with the
// collection prefix stripped: "breakpoint-desktop/grid/edge" → "--grid-edge".
//
// Mobile (min-width: 0) is output as :root defaults with no @media wrapper,
// following the mobile-first convention.
//
// Tokens are skipped when any path segment after path[0] starts with "_"
// (Figma-only tokens) or equals "min-width" (used for the query, not a var).
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/media-query-variables',
  format: ({ dictionary }) => {
    // Group tokens by first path segment and sort by min-width ascending.
    const groups = new Map();
    for (const token of dictionary.allTokens) {
      const key = token.path[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(token);
    }

    // Resolve min-width for each group so we can sort mobile-first.
    const sorted = [...groups.entries()].sort((a, b) => {
      const minWidth = (tokens) =>
        parseInt(tokens.find((t) => t.path[1] === 'min-width')?.$value ?? '0', 10);
      return minWidth(a[1]) - minWidth(b[1]);
    });

    const SKIP = (token) =>
      token.path.slice(1).some((seg) => seg.startsWith('_')) ||
      token.path[1] === 'min-width';

    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    for (const [key, tokens] of sorted) {
      const minWidthToken = tokens.find((t) => t.path[1] === 'min-width');
      const minWidthValue = minWidthToken?.$value ?? '0px';
      const isMobileDefault = parseInt(minWidthValue, 10) === 0;

      const outputTokens = tokens.filter((t) => !SKIP(t));
      if (outputTokens.length === 0) continue;

      // Variable names strip path[0] (the breakpoint collection name).
      // "breakpoints-desktop/grid/edge" → "--grid-edge"
      const vars = outputTokens.map(
        (t) => `  --${t.path.slice(1).join('-')}: ${t.$value};`
      );

      if (isMobileDefault) {
        lines.push(':root {');
        lines.push(...vars);
        lines.push('}');
      } else {
        lines.push(`@media (min-width: ${minWidthValue}) {`);
        lines.push('  :root {');
        lines.push(...vars.map((v) => `  ${v}`));
        lines.push('  }');
        lines.push('}');
      }
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: typography utility classes
//
// Reads $type: "typography" composite tokens and outputs .type-[name] CSS
// classes with individual font properties. Uses token.original.$value to
// access the composite object before Style Dictionary applies its font
// shorthand transform to token.value.
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/typography-classes',
  format: ({ dictionary }) => {
    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
    ];

    for (const token of dictionary.allTokens) {
      const val = token.original.$value;
      // Strip the top-level "typography" path segment for the class name.
      // typography.heading-1 → .type-heading-1
      const className = token.path.slice(1).join('-');

      // Quote font family names that contain spaces.
      const fontFamily = val.fontFamily.includes(' ')
        ? `'${val.fontFamily}'`
        : val.fontFamily;

      lines.push(`.type-${className} {`);
      lines.push(`  font-family: ${fontFamily};`);
      lines.push(`  font-size: ${val.fontSize};`);
      lines.push(`  font-weight: ${val.fontWeight};`);
      lines.push(`  line-height: ${typeof val.lineHeight === 'number' ? parseFloat(val.lineHeight.toFixed(2)) : val.lineHeight};`);
      if (val.letterSpacing && val.letterSpacing !== '0') {
        lines.push(`  letter-spacing: ${val.letterSpacing};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Custom format: breakpoint constants (TypeScript)
//
// Outputs breakpoint min-width values as a typed TypeScript const object
// for use in JS/TS contexts (e.g. matchMedia, window.innerWidth comparisons).
// Values are output as plain numbers (px stripped) to avoid string coercion
// at the call site.
//
// Output: export const breakpoints = { mobile: 0, tablet: 800, ... } as const;
// ---------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'typescript/breakpoint-constants',
  format: ({ dictionary }) => {
    const tokens = [...dictionary.allTokens].sort(
      (a, b) => parseInt(a.$value, 10) - parseInt(b.$value, 10)
    );

    const lines = [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
      '/** Breakpoint min-width values in px — for use with matchMedia / window.innerWidth. */',
      'export const breakpoints = {',
    ];

    for (const token of tokens) {
      // "breakpoint-tablet" → "tablet"
      const name = token.path[0].replace('breakpoint-', '');
      const value = parseInt(token.$value, 10);
      lines.push(`  ${name}: ${value},`);
    }

    lines.push('} as const;');
    lines.push('');
    lines.push('export type Breakpoint = keyof typeof breakpoints;');
    lines.push('');
    return lines.join('\n');
  },
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const sd = new StyleDictionary({
  source: ['tokens/figma.raw.json'],
  platforms: {
    css: {
      transformGroup: 'css/extended',
      buildPath: 'src/styles/',
      files: [
        {
          // Primitive tokens only → CSS custom properties on :root
          destination: 'tokens.css',
          format: 'css/variables',
          filter: (token) => token.path[0] === 'primitive',
          options: {
            selector: ':root',
            outputReferences: false,
          },
        },
        {
          // Semantic tokens → :root (modeless) + [data-theme="light/dark"] (modal) blocks
          // Both semantic-motion (modeless) and semantic-light/dark (modal) normalize
          // to --semantic-* CSS variable names.
          destination: 'tokens.semantic.css',
          format: 'css/semantic-variables',
          filter: (token) => token.path[0].startsWith('semantic-'),
        },
        {
          // Component tokens → :root (modeless) + [data-density="..."] (density-modal) blocks
          // Both density-* and component collections normalize to --component-* CSS prefix.
          destination: 'tokens.component.css',
          format: 'css/component-variables',
          filter: (token) =>
            token.path[0] === 'component' || token.path[0].startsWith('density-'),
        },
        {
          // Breakpoint tokens → mobile-first @media query blocks
          destination: 'tokens.breakpoints.css',
          format: 'css/media-query-variables',
          filter: (token) => token.path[0].startsWith('breakpoint-'),
        },
        {
          // Typography composite tokens → .type-* utility classes
          destination: 'tokens.typography.css',
          format: 'css/typography-classes',
          filter: (token) => token.original?.$type === 'typography',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [
        {
          // Breakpoint min-widths → TypeScript const object
          destination: 'tokens.breakpoints.ts',
          format: 'typescript/breakpoint-constants',
          filter: (token) =>
            token.path[0].startsWith('breakpoint-') && token.path[1] === 'min-width',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ Token files written to src/styles/');
