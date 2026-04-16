import type { StoryDefault, Story } from "@ladle/react";
import { Button } from "./Button";

export default { title: "Button" } satisfies StoryDefault;

// ── All hierarchies ──────────────────────────────────────────────────
// Quick reference row — one of each.

export const AllHierarchies: Story = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <Button hierarchy="primary" label="Primary" />
    <Button hierarchy="secondary" label="Secondary" />
    <Button hierarchy="alt" label="Alt" />
    <Button hierarchy="ghost" label="Ghost" />
  </div>
);

// ── Per-hierarchy: all prop combinations ─────────────────────────────
// Each story shows one hierarchy across: default, as link, icon before,
// icon after, icon only, disabled.
// NOTE: No explicit disabled token exists yet — this is a design gap.
// Disabled state currently inherits from the browser default.

const propRows = (hierarchy: "primary" | "secondary" | "alt" | "ghost") => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button hierarchy={hierarchy} label="Default" />
      <Button hierarchy={hierarchy} label="As link" href="/work" />
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button hierarchy={hierarchy} label="Icon before" iconBefore="search" />
      <Button hierarchy={hierarchy} label="Icon after" iconAfter="arrow_forward" />
      <Button hierarchy={hierarchy} iconOnly iconBefore="close" aria-label="Close" />
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button hierarchy={hierarchy} label="Disabled" disabled />
      <Button hierarchy={hierarchy} iconOnly iconBefore="close" aria-label="Close" disabled />
    </div>
  </div>
);

export const Primary: Story = () => propRows("primary");
export const Secondary: Story = () => propRows("secondary");
export const Alt: Story = () => propRows("alt");
export const Ghost: Story = () => propRows("ghost");

// ── Densities ────────────────────────────────────────────────────────
// All hierarchies at each density level.

export const Densities: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {(["compact", "default", "spacious"] as const).map((density) => (
      <div key={density} style={{ display: "flex", alignItems: "center", gap: 8 }} data-density={density}>
        <span style={{ width: 72, fontSize: 11, color: "var(--semantic-color-text-secondary)", fontFamily: "monospace" }}>{density}</span>
        <Button hierarchy="primary" label="Primary" />
        <Button hierarchy="secondary" label="Secondary" />
        <Button hierarchy="alt" label="Alt" />
        <Button hierarchy="ghost" label="Ghost" />
        <Button hierarchy="primary" label="Icon after" iconAfter="arrow_forward" />
      </div>
    ))}
  </div>
);
