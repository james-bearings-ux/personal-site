import type { StoryDefault, Story } from "@ladle/react";
import { withPageFrame } from "../../.ladle/PageFrame";
import { SideBySide } from "./SideBySide";

export default { title: "SideBySide", decorators: [withPageFrame] } satisfies StoryDefault;

export const SurfaceLow: Story = () => (
  <SideBySide
    image="/img/sample-img.jpg"
    imageAlt="Discovery phase work"
    surface="low"
    heading="Understanding the problem space"
    body="Research, stakeholder interviews, and competitive analysis to frame the design challenge before touching a single wireframe."
  />
);

export const SurfaceBase: Story = () => (
  <SideBySide
    image="/img/sample-img-2.jpg"
    imageAlt="Information architecture work"
    surface="base"
    heading="Shaping the information architecture"
    body="Card sorting, tree testing, and IA diagrams to establish a navigation model users can predict and trust."
  />
);

export const SurfaceHigh: Story = () => (
  <SideBySide
    image="/img/sample-img-3.jpg"
    imageAlt="Final design work"
    surface="high"
    heading="High-fidelity interaction design"
    body="Component-based layouts built on a token-driven design system, validated through usability testing before handoff."
  />
);
