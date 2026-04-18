import type { StoryDefault, Story } from "@ladle/react";
import { Input } from "./Input";

export default { title: "Input" } satisfies StoryDefault;

const densities = ["compact", "default", "spacious"] as const;

const labelStyle = {
  width: 72,
  fontSize: 11,
  color: "var(--semantic-color-text-secondary)",
  fontFamily: "monospace",
  flexShrink: 0,
};

// ── States ────────────────────────────────────────────────────────────
// Two rows (without icon, with icon) × five states.
// focus uses .pseudo-focus on the wrapper; disabled uses the native prop.

const states = [
  { label: "default",  wrapClass: undefined,       disabled: false },
  { label: "focus",    wrapClass: "pseudo-focus",  disabled: false },
  { label: "error",    wrapClass: undefined,       disabled: false, hasError: true },
  { label: "disabled", wrapClass: undefined,       disabled: true },
] as const;

const rows = [
  { label: "no icon",   icon: undefined },
  { label: "with icon", icon: "search" as const },
] as const;

export const States: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
    {/* Header row */}
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={labelStyle} />
      {states.map(({ label }) => (
        <span key={label} style={{ ...labelStyle, width: 112 }}>{label}</span>
      ))}
    </div>
    {/* One row per icon variant */}
    {rows.map(({ label, icon }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={labelStyle}>{label}</span>
        {states.map(({ label: stateLabel, wrapClass, disabled, ...stateProps }) => (
          <div key={stateLabel} style={{ width: 112 }}>
            <Input
              placeholder="Placeholder"
              icon={icon}
              wrapClassName={wrapClass}
              disabled={disabled}
              {...stateProps}
            />
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ── Densities ─────────────────────────────────────────────────────────
// One example per density at default state and with icon to verify
// height and padding tokens.

export const Densities: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400 }}>
    {densities.map((density) => (
      <div key={density} style={{ display: "flex", alignItems: "center", gap: 12 }} data-density={density}>
        <span style={labelStyle}>{density}</span>
        <Input placeholder="Placeholder" icon="search" />
      </div>
    ))}
  </div>
);
