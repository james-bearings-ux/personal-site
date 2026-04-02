import type { StoryDefault, Story } from "@ladle/react";
import { Card } from "./Card";

export default { title: "Card" } satisfies StoryDefault;

// ── Image variant ────────────────────────────────────────────────────

export const ImageNone: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="image"
      interactive="none"
      image="/img/sample-img-square.jpg"
      imageAlt="Sample"
      metadata="Category"
      heading="Card heading for image variant"
    />
  </div>
);

export const ImageCardLink: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="image"
      interactive="card-link"
      image="/img/sample-img-square.jpg"
      imageAlt="Sample"
      metadata="Category"
      heading="Card heading for image variant"
      ctaHref="/work"
    />
  </div>
);

export const ImageCta: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="image"
      interactive="cta"
      image="/img/sample-img-square.jpg"
      imageAlt="Sample"
      metadata="Category"
      heading="Card heading for image variant"
      ctaLabel="View project"
      ctaHref="/work"
    />
  </div>
);

// ── Heading variant ──────────────────────────────────────────────────

export const HeadingNone: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="heading"
      interactive="none"
      heading="Heading variant"
      body="Supporting body copy that provides context for the card heading. Two or three sentences is typical."
    />
  </div>
);

export const HeadingCardLink: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="heading"
      interactive="card-link"
      heading="Heading variant"
      body="Supporting body copy that provides context for the card heading."
      ctaHref="/work"
    />
  </div>
);

export const HeadingCta: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="heading"
      interactive="cta"
      heading="Heading variant"
      body="Supporting body copy that provides context for the card heading."
      ctaLabel="Learn more"
      ctaHref="/work"
    />
  </div>
);

// ── Text variant ─────────────────────────────────────────────────────

export const TextNone: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="text"
      interactive="none"
      metadata="Label"
      heading="Text variant heading"
    />
  </div>
);

export const TextCardLink: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="text"
      interactive="card-link"
      metadata="Label"
      heading="Text variant heading"
      ctaHref="/work"
    />
  </div>
);

export const TextCta: Story = () => (
  <div style={{ maxWidth: 320 }}>
    <Card
      variant="text"
      interactive="cta"
      metadata="Label"
      heading="Text variant heading"
      ctaLabel="See resource"
      ctaHref="/work"
    />
  </div>
);
