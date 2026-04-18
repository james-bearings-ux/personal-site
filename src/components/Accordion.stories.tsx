import type { StoryDefault, Story } from "@ladle/react";
import { Accordion, AccordionItem } from "./Accordion";

export default { title: "Accordion" } satisfies StoryDefault;

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 11,
  color: "var(--semantic-color-text-secondary)",
  fontFamily: "monospace",
};

const contentStyle = {
  color: "var(--semantic-color-text-primary)",
};

// ── Anatomy ───────────────────────────────────────────────────────────────────
// Two standalone items side by side — closed and open — for static comparison.
// Standalone AccordionItems manage their own state (no Accordion wrapper needed).

export const Anatomy: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
    <div>
      <span style={labelStyle}>closed</span>
      <AccordionItem label="Design Systems">
        <p className="type-body" style={contentStyle}>
          End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.
        </p>
      </AccordionItem>
    </div>
    <div>
      <span style={labelStyle}>open</span>
      <AccordionItem label="Design Systems" defaultOpen>
        <p className="type-body" style={contentStyle}>
          End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.
        </p>
      </AccordionItem>
    </div>
  </div>
);

// ── Interactive ───────────────────────────────────────────────────────────────
// Live Accordion group. Click to expand/collapse. Exclusive by default —
// opening one item closes the others. Third item starts open via defaultOpen.

export const Interactive: Story = () => (
  <div style={{ maxWidth: 480 }}>
    <Accordion>
      <AccordionItem label="Design Systems">
        <p className="type-body" style={contentStyle}>
          End-to-end design systems work — token architecture, component libraries, documentation, and adoption strategy.
        </p>
      </AccordionItem>
      <AccordionItem label="UX Strategy">
        <p className="type-body" style={contentStyle}>
          Framing complex product problems through research synthesis and systems thinking before design work begins.
        </p>
      </AccordionItem>
      <AccordionItem label="Interaction Design" defaultOpen>
        <p className="type-body" style={contentStyle}>
          High-fidelity interaction design with a focus on motion, feedback, and component-level behavior.
        </p>
      </AccordionItem>
    </Accordion>
  </div>
);

// ── Densities ─────────────────────────────────────────────────────────────────
// One group per density. Second item starts open to verify content padding
// and icon size at each density.

export const Densities: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 480 }}>
    {(["compact", "default", "spacious"] as const).map((density) => (
      <div key={density} data-density={density}>
        <span style={labelStyle}>{density}</span>
        <Accordion>
          <AccordionItem label="Design Systems">
            <p className="type-body" style={contentStyle}>Token architecture and component libraries.</p>
          </AccordionItem>
          <AccordionItem label="UX Strategy" defaultOpen>
            <p className="type-body" style={contentStyle}>Research synthesis and systems thinking.</p>
          </AccordionItem>
        </Accordion>
      </div>
    ))}
  </div>
);

// ── AllowMultiple ─────────────────────────────────────────────────────────────
// Two groups side by side. Left: exclusive (default) — opening one closes
// others. Right: allowMultiple — any number can be open simultaneously.

export const AllowMultiple: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
    <div>
      <span style={labelStyle}>exclusive (default)</span>
      <Accordion>
        <AccordionItem label="Design Systems">
          <p className="type-body" style={contentStyle}>Token architecture and component libraries.</p>
        </AccordionItem>
        <AccordionItem label="UX Strategy">
          <p className="type-body" style={contentStyle}>Research synthesis and systems thinking.</p>
        </AccordionItem>
        <AccordionItem label="Interaction Design">
          <p className="type-body" style={contentStyle}>Motion, feedback, and component behavior.</p>
        </AccordionItem>
      </Accordion>
    </div>
    <div>
      <span style={labelStyle}>allow multiple</span>
      <Accordion allowMultiple>
        <AccordionItem label="Design Systems">
          <p className="type-body" style={contentStyle}>Token architecture and component libraries.</p>
        </AccordionItem>
        <AccordionItem label="UX Strategy">
          <p className="type-body" style={contentStyle}>Research synthesis and systems thinking.</p>
        </AccordionItem>
        <AccordionItem label="Interaction Design">
          <p className="type-body" style={contentStyle}>Motion, feedback, and component behavior.</p>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
);

// ── ContentSlot ───────────────────────────────────────────────────────────────
// Demonstrates the content slot and noPadding prop. First item uses default
// padding (good for prose). Second uses noPadding — the slot content controls
// its own layout, useful for tables, images, or custom compositions.

export const ContentSlot: Story = () => (
  <div style={{ maxWidth: 480 }}>
    <Accordion allowMultiple>
      <AccordionItem label="Default padding" defaultOpen>
        <p className="type-body" style={contentStyle}>
          Default bottom padding is applied via the component token. Good for prose and simple content.
        </p>
      </AccordionItem>
      <AccordionItem label="No padding — slot controls spacing" defaultOpen noPadding>
        <div
          style={{
            background: "var(--semantic-color-surface-low)",
            borderTop: "1px solid var(--semantic-color-border-secondary)",
            padding: "16px",
          }}
        >
          <p className="type-body" style={contentStyle}>
            Content manages its own layout and spacing. Use for tables, images, or custom compositions.
          </p>
        </div>
      </AccordionItem>
    </Accordion>
  </div>
);
