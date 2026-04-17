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
export const withPageFrame: StoryDecorator = (Story) => (
  <div
    style={{
      backgroundColor: "var(--semantic-color-surface-ground)",
      maxWidth: "var(--grid-max-width)",
      margin: "0 auto",
    }}
  >
    <Story />
  </div>
);
