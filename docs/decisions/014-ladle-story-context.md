# ADR-014: Ladle Story Context Strategy

## Status
Accepted

## Context
Ladle renders stories against a plain white canvas by default. For a design system built on semantic surface tokens, this has two problems:

1. **Accessibility checks are unreliable.** axe-core (via Ladle's built-in a11y addon) evaluates contrast ratios against whatever background is actually present. A white canvas gives false passes for components designed for `surface-high` or `surface-ground` backgrounds.

2. **Row-level components lose layout context.** Full-row section components (CardBand, FeatureAccordion, TabbedSlideshow, OffsetList, SideBySide, StackedImage) are designed to render edge-to-edge within a max-width page container. On a plain canvas they appear unanchored, hiding breakpoint behavior and surface layering intent.

Atomic components (Button, Input, Icon, Tabs, Card) don't have these issues — they're self-contained and context-agnostic.

## Options Considered

**Option A: Global Provider background only**
Set the Provider canvas to a realistic surface token and leave all stories unstyled. Simple, but treats atomic and row-level components identically — row-level components still lack max-width and grid constraints.

**Option B: Per-story wrapper divs**
Each story manually wraps its content in a styled div. Flexible but inconsistent — each author decides what context to simulate, producing drift over time. Already present as a partial pattern in some Interactive stories before this ADR.

**Option C: Story Decorator + Provider split**
Use Ladle's `decorators` array on the story default to apply a shared `withPageFrame` decorator to row-level components only. Atomic components rely on the Provider canvas alone. Context logic lives in one place per component category.

## Decision
**Option C**, with the following specific choices:

**Provider canvas:** `--semantic-color-surface-high`. This is the realistic background for atomic component rendering — a mid-level surface that exercises contrast requirements without being the ground-level default.

**Row-level components — `withPageFrame` decorator:**
- Outer canvas: `--semantic-color-surface-ground`. Simulates the page background that surrounds content sections in the real site.
- Inner page frame: `--semantic-color-surface-high`, constrained to `--grid-max-width` and centered. Simulates the inner page container that row-level components actually render within.
- Applied via `decorators: [withPageFrame]` in each affected story's `export default` — one line per file, no per-story repetition.

The decorator is implemented as a negative-margin breakout (`margin: -40px`) to override the Provider's padding and fill the full canvas with `surface-ground`. This is an intentional coupling: both files live in `.ladle/` and are maintained together.

## Consequences
- axe-core contrast checks run against realistic surface backgrounds, reducing false passes.
- Row-level components display with correct max-width constraints and surface layering, matching their real-page context.
- Atomic components remain undecorated — the Provider canvas is sufficient for their context.
- Adding a new row-level component requires one import and one `decorators` line in its story file.
- The PageFrame's negative margin is coupled to the Provider's `padding: 40px`. If that padding changes, `PageFrame.tsx` must be updated in the same commit.
