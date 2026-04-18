import type { StoryDefault, Story } from "@ladle/react";
import type { Surface } from "@/styles/tokens.surface";
import { withPageFrame } from "../../.ladle/PageFrame";
import { TabbedSlideshow, SlideshowPanel } from "./TabbedSlideshow";
import { SideBySide } from "./SideBySide";
import { StackedImage } from "./StackedImage";

export default { title: "TabbedSlideshow", decorators: [withPageFrame] } satisfies StoryDefault;

export const WithSideBySide: Story = () => (
  <TabbedSlideshow heading="Featured Work" surface="low">
    <SlideshowPanel label="Discovery">
      <SideBySide image="/img/sample-img.jpg" imageAlt="Discovery phase" surface="low" heading="Understanding the problem space" body="Research, stakeholder interviews, and competitive analysis to frame the design challenge." />
    </SlideshowPanel>
    <SlideshowPanel label="Structure">
      <SideBySide image="/img/sample-img-2.jpg" imageAlt="IA work" surface="low" heading="Shaping the information architecture" body="Card sorting, tree testing, and IA diagrams to establish a navigation model users can trust." />
    </SlideshowPanel>
    <SlideshowPanel label="Design">
      <SideBySide image="/img/sample-img-3.jpg" imageAlt="Final design" surface="low" heading="High-fidelity interaction design" body="Component-based layouts built on a token-driven design system." />
    </SlideshowPanel>
  </TabbedSlideshow>
);

export const WithStackedImage: Story = () => (
  <TabbedSlideshow heading="Travel" surface="base">
    <SlideshowPanel label="Sacred Valley">
      <StackedImage image="/img/sample-panorama.jpg" imageAlt="Sacred Valley, Peru" title="Sacred Valley" heading="Sacred Valley, Peru" body="Sweeping views across the Urubamba valley, framed by Andean peaks." />
    </SlideshowPanel>
    <SlideshowPanel label="Valley Approach">
      <StackedImage image="/img/sample-panorama-2.jpeg" imageAlt="Valley landscape" title="Valley Approach" heading="Wide open spaces" body="Horizon-spanning landscape captured at the edge of the golden hour." />
    </SlideshowPanel>
  </TabbedSlideshow>
);

// ── SurfaceOptions ──────────────────────────────────────────────────────
// bandSurface controls the TabbedSlideshow container.
// contentSurface controls the SideBySide panels inside.

export const SurfaceOptions: Story<{ bandSurface: Surface; contentSurface: Surface }> = ({
  bandSurface,
  contentSurface,
}) => (
  <TabbedSlideshow heading="Featured Work" surface={bandSurface}>
    <SlideshowPanel label="Discovery">
      <SideBySide image="/img/sample-img.jpg" imageAlt="Discovery phase" surface={contentSurface} heading="Understanding the problem space" body="Research, stakeholder interviews, and competitive analysis to frame the design challenge." />
    </SlideshowPanel>
    <SlideshowPanel label="Structure">
      <SideBySide image="/img/sample-img-2.jpg" imageAlt="IA work" surface={contentSurface} heading="Shaping the information architecture" body="Card sorting, tree testing, and IA diagrams to establish a navigation model users can trust." />
    </SlideshowPanel>
    <SlideshowPanel label="Design">
      <SideBySide image="/img/sample-img-3.jpg" imageAlt="Final design" surface={contentSurface} heading="High-fidelity interaction design" body="Component-based layouts built on a token-driven design system." />
    </SlideshowPanel>
  </TabbedSlideshow>
);

SurfaceOptions.args = { bandSurface: "low", contentSurface: "low" };
SurfaceOptions.argTypes = {
  bandSurface: {
    control: { type: "radio" },
    options: ["low", "base", "high"],
  },
  contentSurface: {
    control: { type: "radio" },
    options: ["low", "base", "high"],
  },
};
