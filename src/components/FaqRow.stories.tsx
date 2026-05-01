import type { StoryDefault, Story } from "@ladle/react";
import { FaqRow, AccordionItem } from "./FaqRow";

export default { title: "FaqRow" } satisfies StoryDefault;

export const Default: Story = () => (
  <FaqRow heading="Frequently asked questions">
    <AccordionItem label="What does a design systems engagement look like?">
      A typical engagement starts with an audit of your existing UI patterns, followed by a token architecture session to align on the source of truth. From there we build out the component library in parallel with documentation, so design and engineering are never out of sync.
    </AccordionItem>
    <AccordionItem label="Do you work with in-house teams or independently?">
      Both. I embed with in-house teams as often as I work independently. The goal is always to leave the team more capable than I found it — not to create a dependency.
    </AccordionItem>
    <AccordionItem label="What tools do you use?">
      Figma for design and token authoring, with a Style Dictionary pipeline to transform tokens into CSS custom properties and TypeScript constants. Component development is in React, documented in Ladle.
    </AccordionItem>
    <AccordionItem label="How do you handle design–engineering handoff?">
      Tokens are the handoff. When design and code share the same named values, most of the translation work disappears. The remaining handoff is interaction state and motion, which I specify in the token system as well.
    </AccordionItem>
    <AccordionItem label="How long does a project typically take?">
      A focused token architecture and component library for a mid-size product typically takes 8–12 weeks. Larger systems with multiple platforms or existing debt take longer — I scope each engagement individually.
    </AccordionItem>
  </FaqRow>
);

export const ManyItems: Story = () => (
  <FaqRow heading="Frequently asked questions">
    <AccordionItem label="What does a design systems engagement look like?">
      A typical engagement starts with an audit of your existing UI patterns, followed by a token architecture session to align on the source of truth.
    </AccordionItem>
    <AccordionItem label="Do you work with in-house teams or independently?">
      Both. I embed with in-house teams as often as I work independently.
    </AccordionItem>
    <AccordionItem label="What tools do you use?">
      Figma for design and token authoring, with a Style Dictionary pipeline to transform tokens into CSS custom properties and TypeScript constants.
    </AccordionItem>
    <AccordionItem label="How do you handle design–engineering handoff?">
      Tokens are the handoff. When design and code share the same named values, most of the translation work disappears.
    </AccordionItem>
    <AccordionItem label="How long does a project typically take?">
      A focused token architecture and component library for a mid-size product typically takes 8–12 weeks.
    </AccordionItem>
    <AccordionItem label="Do you offer retainer arrangements?">
      Yes. Ongoing retainers work well for teams that need a design systems partner without a full-time hire.
    </AccordionItem>
    <AccordionItem label="Can you work with an existing component library?">
      Yes — I can audit, extend, or refactor an existing library. Sometimes the right move is evolution, not a rewrite.
    </AccordionItem>
    <AccordionItem label="What industries have you worked in?">
      Primarily enterprise software, financial services, and healthcare — domains where information density and accessibility requirements are high.
    </AccordionItem>
    <AccordionItem label="Do you do usability research as well as design?">
      I can facilitate structured usability testing and synthesis, though my primary focus is systems and information architecture rather than generative research.
    </AccordionItem>
  </FaqRow>
);

export const AltSurface: Story = () => (
  <FaqRow heading="Frequently asked questions" surface="low">
    <AccordionItem label="What does a design systems engagement look like?">
      A typical engagement starts with an audit of your existing UI patterns, followed by a token architecture session to align on the source of truth.
    </AccordionItem>
    <AccordionItem label="Do you work with in-house teams or independently?">
      Both. I embed with in-house teams as often as I work independently.
    </AccordionItem>
    <AccordionItem label="What tools do you use?">
      Figma for design and token authoring, with a Style Dictionary pipeline to transform tokens into CSS custom properties and TypeScript constants.
    </AccordionItem>
    <AccordionItem label="How do you handle design–engineering handoff?">
      Tokens are the handoff. When design and code share the same named values, most of the translation work disappears.
    </AccordionItem>
  </FaqRow>
);

export const LongHeading: Story = () => (
  <FaqRow heading="Everything you wanted to know about working with a design systems consultant but were afraid to ask">
    <AccordionItem label="What does a design systems engagement look like?">
      A typical engagement starts with an audit of your existing UI patterns, followed by a token architecture session to align on the source of truth.
    </AccordionItem>
    <AccordionItem label="Do you work with in-house teams or independently?">
      Both. I embed with in-house teams as often as I work independently.
    </AccordionItem>
    <AccordionItem label="How long does a project typically take?">
      A focused token architecture and component library for a mid-size product typically takes 8–12 weeks.
    </AccordionItem>
  </FaqRow>
);
