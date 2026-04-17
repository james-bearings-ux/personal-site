import type { StoryDecorator } from "@ladle/react";

/**
 * Story decorator for full-row section components (CardBand, FeatureAccordion,
 * TabbedSlideshow, OffsetList, SideBySide, StackedImage).
 *
 * Simulates the inner page context: surface-ground background constrained to
 * the responsive grid max-width, centered within the surface-high canvas.
 *
 * Usage:
 *   export default { title: "MyComponent", decorators: [withPageFrame] } satisfies StoryDefault;
 */
// Provider applies 40px padding. The outer div uses negative margin to break
// out of that padding so surface-ground fills the full canvas — coupling is
// intentional; both files live in .ladle/ and change together.
export const withPageFrame: StoryDecorator = (Story) => (
  <div
    style={{
      backgroundColor: "var(--semantic-color-surface-ground)",
      margin: "-40px",
      padding: "40px 0",
    }}
  >
    <div
      style={{
        backgroundColor: "var(--semantic-color-surface-high)",
        maxWidth: "var(--grid-max-width)",
        margin: "0 auto",
      }}
    >
      <Story />
    </div>
  </div>
);
