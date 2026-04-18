import type { StoryDefault, Story } from "@ladle/react";
import type { Surface } from "@/styles/tokens.surface";
import { withPageFrame } from "../../.ladle/PageFrame";
import { FeatureAccordion, AccordionPanel } from "./FeatureAccordion";

export default { title: "FeatureAccordion", decorators: [withPageFrame] } satisfies StoryDefault;

const bodyStyle = {
  padding: "8px 0 16px 16px",
  color: "var(--semantic-color-text-primary)",
};

export const Default: Story = () => (
  <FeatureAccordion
    heading="Services"
    body="Design systems strategy and hands-on craft, from token architecture to shipped components."
    surface="low"
  >
    <AccordionPanel label="Design Systems">
      <p className="type-body" style={bodyStyle}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.</p>
    </AccordionPanel>
    <AccordionPanel label="UX Strategy">
      <p className="type-body" style={bodyStyle}>Framing complex product problems through research synthesis and systems thinking before design work begins.</p>
    </AccordionPanel>
    <AccordionPanel label="Interaction Design">
      <p className="type-body" style={bodyStyle}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.</p>
    </AccordionPanel>
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
    <AccordionPanel label="Design Systems">
      <p className="type-body" style={bodyStyle}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.</p>
    </AccordionPanel>
    <AccordionPanel label="UX Strategy">
      <p className="type-body" style={bodyStyle}>Framing complex product problems through research synthesis and systems thinking before design work begins.</p>
    </AccordionPanel>
    <AccordionPanel label="Interaction Design">
      <p className="type-body" style={bodyStyle}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.</p>
    </AccordionPanel>
    <AccordionPanel label="Design Tooling">
      <p className="type-body" style={bodyStyle}>Custom Figma plugins, token pipelines, and developer handoff infrastructure.</p>
    </AccordionPanel>
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
      <AccordionPanel label="Design Systems">
        <p className="type-body" style={bodyStyle}>End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.</p>
      </AccordionPanel>
      <AccordionPanel label="UX Strategy">
        <p className="type-body" style={bodyStyle}>Framing complex product problems through research synthesis and systems thinking before design work begins.</p>
      </AccordionPanel>
      <AccordionPanel label="Interaction Design">
        <p className="type-body" style={bodyStyle}>High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.</p>
      </AccordionPanel>
      <AccordionPanel label="Design Tooling">
        <p className="type-body" style={bodyStyle}>Custom Figma plugins, token pipelines, and developer handoff infrastructure.</p>
      </AccordionPanel>
    </FeatureAccordion>
);

SurfaceOptions.args = { surface: "low" };
SurfaceOptions.argTypes = {
  surface: {
    control: { type: "radio" },
    options: ["low", "base", "high"],
  },
};
