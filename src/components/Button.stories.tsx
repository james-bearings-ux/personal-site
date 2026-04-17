import type { StoryDefault, Story } from "@ladle/react";
import { Button } from "./Button";

export default { title: "Button" } satisfies StoryDefault;

const hierarchies = ["primary", "secondary", "alt", "ghost"] as const;
const densities = ["compact", "default", "spacious"] as const;

const labelStyle = {
  width: 72,
  fontSize: 11,
  color: "var(--semantic-color-text-secondary)",
  fontFamily: "monospace",
  flexShrink: 0,
};

// ── Hierarchies ───────────────────────────────────────────────────────
// All four hierarchies across the full prop set: default, link, icon
// variants, and icon-only. Density is held at default.

export const Hierarchies: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {hierarchies.map((h) => (
      <div key={h} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={labelStyle}>{h}</span>
        <Button hierarchy={h} label="Default" />
        <Button hierarchy={h} label="As link" href="/work" />
        <Button hierarchy={h} label="Icon before" iconBefore="search" />
        <Button hierarchy={h} label="Icon after" iconAfter="arrow_forward" />
        <Button hierarchy={h} iconOnly iconBefore="close" aria-label="Close" />
      </div>
    ))}
  </div>
);

// ── Densities ─────────────────────────────────────────────────────────
// One label+icon and one icon-only example per hierarchy at each density.
// Two examples are sufficient to verify height, padding, and gap tokens.

export const Densities: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {densities.map((density) => (
      <div key={density} data-density={density} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={labelStyle}>{density}</span>
        {hierarchies.map((h) => (
          <div key={h} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Button hierarchy={h} label="Label" iconAfter="arrow_forward" />
            <Button hierarchy={h} iconOnly iconBefore="close" aria-label="Close" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ── States ────────────────────────────────────────────────────────────
// Pseudo-classes spoofed via className so all states are visible
// simultaneously without interaction. hover/pressed/focus use
// .pseudo-* classes that mirror the real CSS pseudo-selectors.
// disabled uses the native prop so :disabled CSS is exercised directly.

const states = [
  { label: "default",  props: {} },
  { label: "hover",    props: { className: "pseudo-hover" } },
  { label: "pressed",  props: { className: "pseudo-pressed" } },
  { label: "focus",    props: { className: "pseudo-focus" } },
  { label: "disabled", props: { disabled: true } },
] as const;

export const States: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {/* Header row */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={labelStyle} />
      {states.map(({ label }) => (
        <span key={label} style={{ ...labelStyle, width: 96 }}>{label}</span>
      ))}
    </div>
    {/* One row per hierarchy */}
    {hierarchies.map((h) => (
      <div key={h} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={labelStyle}>{h}</span>
        {states.map(({ label, props }) => (
          <div key={label} style={{ width: 96 }}>
            <Button hierarchy={h} label="Label" iconAfter="arrow_forward" {...props} />
          </div>
        ))}
      </div>
    ))}
  </div>
);
