import type { StoryDefault, Story } from "@ladle/react";
import type { Surface } from "@/styles/tokens.surface";
import { withPageFrame } from "../../.ladle/PageFrame";
import { FeatureAccordion, AccordionItem } from "./FeatureAccordion";

export default { title: "FeatureAccordion", decorators: [withPageFrame] } satisfies StoryDefault;

const contentStyle = {
  color: "var(--semantic-color-text-primary)",
};

export const Default: Story = () => (
  <FeatureAccordion
    heading="Services"
    body="Design systems strategy and hands-on craft, from token architecture to shipped components."
    surface="low"
  >
    <AccordionItem label="Design Systems">
      <p className="type-body" style={contentStyle}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.</p>
    </AccordionItem>
    <AccordionItem label="UX Strategy">
      <p className="type-body" style={contentStyle}>Framing complex product problems through research synthesis and systems thinking before design work begins.</p>
    </AccordionItem>
    <AccordionItem label="Interaction Design">
      <p className="type-body" style={contentStyle}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.</p>
    </AccordionItem>
  </FeatureAccordion>
);

export const WithCta: Story = () => (
  <FeatureAccordion
    heading="Services"
    body="Design systems strategy and hands-on craft, from token architecture to shipped components."
    surface="low"
    showCta
    label="Get in touch"
    href="/work"
  >
    <AccordionItem label="Design Systems">
      <p className="type-body" style={contentStyle}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.</p>
    </AccordionItem>
    <AccordionItem label="UX Strategy">
      <p className="type-body" style={contentStyle}>Framing complex product problems through research synthesis and systems thinking before design work begins.</p>
    </AccordionItem>
    <AccordionItem label="Interaction Design">
      <p className="type-body" style={contentStyle}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.</p>
    </AccordionItem>
    <AccordionItem label="Design Tooling">
      <p className="type-body" style={contentStyle}>Custom Figma plugins, token pipelines, and developer handoff infrastructure.</p>
    </AccordionItem>
  </FeatureAccordion>
);

export const SurfaceOptions: Story<{ surface: Surface }> = ({ surface }) => (
  <FeatureAccordion
    heading="Services"
    body="Design systems strategy and hands-on craft, from token architecture to shipped components."
    surface={surface}
    showCta
    label="Get in touch"
    href="/work"
  >
    <AccordionItem label="Design Systems">
      <p className="type-body" style={contentStyle}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.</p>
    </AccordionItem>
    <AccordionItem label="UX Strategy">
      <p className="type-body" style={contentStyle}>Framing complex product problems through research synthesis and systems thinking before design work begins.</p>
    </AccordionItem>
    <AccordionItem label="Interaction Design">
      <p className="type-body" style={contentStyle}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.</p>
    </AccordionItem>
    <AccordionItem label="Design Tooling">
      <p className="type-body" style={contentStyle}>Custom Figma plugins, token pipelines, and developer handoff infrastructure.</p>
    </AccordionItem>
  </FeatureAccordion>
);

SurfaceOptions.args = { surface: "low" };
SurfaceOptions.argTypes = {
  surface: {
    control: { type: "radio" },
    options: ["low", "base", "high"],
  },
};
