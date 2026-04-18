import type { StoryDefault, Story } from "@ladle/react";
import type { Surface } from "@/styles/tokens.surface";
import { withPageFrame } from "../../.ladle/PageFrame";
import { CardBand } from "./CardBand";
import { Card } from "./Card";

export default { title: "CardBand", decorators: [withPageFrame] } satisfies StoryDefault;

export const HeadingCards4: Story = () => (
  <CardBand heading="Capabilities" surface="base">
    <Card variant="heading" interactive="none" heading="Token pipelines" body="End-to-end infrastructure connecting Figma Variables to production CSS." />
    <Card variant="heading" interactive="none" heading="Component libraries" body="Accessible, density-responsive components built on semantic tokens." />
    <Card variant="heading" interactive="none" heading="Systems strategy" body="Adoption roadmaps and governance models that keep teams aligned." />
    <Card variant="heading" interactive="none" heading="Design tooling" body="Custom Figma plugins and token validators for better handoff." />
  </CardBand>
);

export const ImageCards3: Story = () => (
  <CardBand heading="Destinations" surface="low">
    <Card variant="image" interactive="card-link" image="/img/sample-img-square.jpg" imageAlt="Sample 1" metadata="Iceland" heading="Skógafoss waterfall" ctaHref="/work" />
    <Card variant="image" interactive="card-link" image="/img/sample-img-square-2.jpg" imageAlt="Sample 2" metadata="England" heading="Kew Botanic Gardens" ctaHref="/work" />
    <Card variant="image" interactive="card-link" image="/img/sample-img-square-3.jpg" imageAlt="Sample 3" metadata="Wales" heading="Caernarfon Castle" ctaHref="/work" />
  </CardBand>
);

export const ImageCards2: Story = () => (
  <CardBand heading="Destinations" surface="base">
    <Card
      variant="image"
      interactive="card-link"
      image="/img/sample-img-square.jpg"
      imageAlt="Sample 1"
      metadata="Iceland"
      heading="Skógafoss waterfall near the Eyjafjallajökull glacier"
      ctaHref="/work"
    />
    <Card
      variant="image"
      interactive="card-link"
      image="/img/sample-img-square-2.jpg"
      imageAlt="Sample 2"
      metadata="England"
      heading="Kew Royal Botanic Gardens is a gardener's paradise"
      ctaHref="/work"
    />
  </CardBand>
);

export const TextCardsCta3: Story = () => (
  <CardBand heading="Guides" surface="low">
    <Card variant="text" interactive="cta" metadata="Buyers Guide" heading="How to scope your design system refresh project" ctaLabel="Learn how" />
    <Card variant="text" interactive="cta" metadata="Datasheet" heading="Token-driven component generation using AI" ctaLabel="Download now" />
    <Card variant="text" interactive="cta" metadata="Infographic" heading="Information architecture in the age of AI" ctaLabel="View" />
  </CardBand>
);

export const TextCardsLink3: Story = () => (
  <CardBand heading="Guides" surface="low">
    <Card variant="text" interactive="card-link" metadata="Buyers Guide" heading="How to scope your design system refresh project" ctaHref="/work" />
    <Card variant="text" interactive="card-link" metadata="Datasheet" heading="Token-driven component generation using AI" ctaHref="/work" />
    <Card variant="text" interactive="card-link" metadata="Infographic" heading="Information architecture in the age of AI" ctaHref="/work" />
  </CardBand>
);

export const TextCards3: Story = () => (
  <CardBand heading="Guides" surface="low">
    <Card variant="text" interactive="none" metadata="Buyers Guide" heading="How to scope your design system refresh project" />
    <Card variant="text" interactive="none" metadata="Datasheet" heading="Token-driven component generation using AI" />
    <Card variant="text" interactive="none" metadata="Infographic" heading="Information architecture in the age of AI" />
  </CardBand>
);

export const SurfaceOptions: Story<{ surface: Surface }> = ({ surface }) => (
  <CardBand heading="Destinations" surface={surface}>
    <Card variant="image" interactive="card-link" image="/img/sample-img-square.jpg" imageAlt="Sample 1" metadata="Iceland" heading="Skógafoss waterfall" ctaHref="/work" />
    <Card variant="image" interactive="card-link" image="/img/sample-img-square-2.jpg" imageAlt="Sample 2" metadata="England" heading="Kew Botanic Gardens" ctaHref="/work" />
    <Card variant="image" interactive="card-link" image="/img/sample-img-square-3.jpg" imageAlt="Sample 3" metadata="Wales" heading="Caernarfon Castle" ctaHref="/work" />
  </CardBand>
);

SurfaceOptions.args = { surface: "low" };
SurfaceOptions.argTypes = {
  surface: {
    control: { type: "radio" },
    options: ["low", "base", "high"],
  },
};
