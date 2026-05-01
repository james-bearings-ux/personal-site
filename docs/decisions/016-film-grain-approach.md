# ADR-016: Film Grain Implementation Approach

## Status
In evaluation — POC complete, approach not yet selected.

## Context

Images on this site are produced crisp and highly compressed. A film grain effect applied at the component level (rather than baked into the asset) keeps source images clean while adding a consistent aesthetic layer. The effect needs to be reproducible in Figma for design previews, which favors approaches with clear blend-mode and opacity analogs.

Four implementation approaches were prototyped and compared head-to-head in Ladle (`StackedImage / Grain Comparison`).

## Options Evaluated

### A — Tiled PNG
A 64×64 grayscale noise PNG (`public/img/grain-tile.png`) applied as a repeated `background-image` on an absolutely positioned overlay div inside `.imageWrap`.

- **Blend:** `mix-blend-mode: overlay`
- **Asset size:** 3.7 KB
- **Tradeoff:** Crisp, pixel-level grain at 64×64. Tiling repetition may be visible at large sizes or on close inspection. Asset cost is real but modest. Easiest to swap the texture independently of code.

### B — SVG feTurbulence Overlay
An inline `<svg>` element with a `<feTurbulence>` filter rendered as a `<rect>` covering the full image, positioned absolutely inside `.imageWrap`.

- **Blend:** `mix-blend-mode: soft-light`
- **Asset size:** ~0 bytes (DOM node, no file)
- **Tradeoff:** Seamless at any resolution — no tiling boundary. Effect is more visible on bright image areas than dark when using overlay; soft-light produces more uniform coverage. Grain pattern is fixed (deterministic seed), so it looks identical on every image.

### C — CSS Filter on `<img>`
An SVG filter definition (`<feTurbulence>` → `<feColorMatrix>` → `<feComponentTransfer>` → `<feBlend>` → `<feComposite>`) applied directly to the `<img>` element via `filter: url(#grain-c)`.

- **Blend:** `feBlend mode="soft-light"` with noise range compressed to 75% of max via `feComponentTransfer`
- **Asset size:** ~0 bytes (inline filter definition)
- **Tradeoff:** Grain is baked into the image rather than layered over it — a meaningfully different visual result. Parameters live in the SVG filter chain (TSX), not CSS, making inspector-level tweaking harder. The most technically distinct approach but the hardest to tune.

### D — Data URI SVG Background
The feTurbulence SVG encoded as a URL-encoded data URI directly in the CSS `background-image` property, tiled at 200×200.

- **Blend:** `mix-blend-mode: overlay`
- **Asset size:** ~340 bytes inline in CSS
- **Tradeoff:** Zero network requests; no DOM node beyond the overlay div. Tiled at 200×200, so the repeat boundary is visible under close inspection. Blend mode and opacity are clean CSS properties — direct analogs to Figma's layer blend modes, which makes design handoff and Figma preview fidelity straightforward.

## Observations

- The 256×256 blurred PNG originally generated was ~51 KB and produced muddy, low-resolution-looking grain. Dropping to 64×64 raw (unblurred) noise resolved this — file size fell to 3.7 KB and grain became crisp.
- `overlay` blend mode is most visible on bright image tones; `soft-light` distributes more evenly across tones. B and C were switched to `soft-light` for a fairer comparison.
- Option D's correspondence to Figma's blend mode and opacity model is a practical advantage: designers can preview the effect accurately without custom plugin work.
- Option C is the most technically isolated (grain is part of the image, not an overlay) and the hardest to tune interactively.

## Decision

Pending. POC remains in `StackedImage` behind the `grain` prop. Each approach has its own labelled CSS rule for independent tuning before a winner is selected.

## Consequences

- Once an approach is selected, the `grain` prop and all non-winning CSS rules are removed.
- The winning approach moves into the component as a first-class feature, likely behind a boolean prop or a design token controlling opacity.
- If D is selected, the data URI SVG should be extracted to a shared constant or CSS custom property to avoid duplication if the effect is applied to multiple components.
