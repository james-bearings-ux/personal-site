import type { StoryDefault, Story } from "@ladle/react";
import { Input } from "./Input";

export default { title: "Input" } satisfies StoryDefault;

// ── States ───────────────────────────────────────────────────────────

export const Default: Story = () => <Input placeholder="Placeholder text" />;
export const WithValue: Story = () => <Input defaultValue="Entered value" />;
export const WithIcon: Story = () => <Input placeholder="Search" icon="search.svg" />;
export const ErrorState: Story = () => <Input defaultValue="Invalid entry" hasError />;
export const Disabled: Story = () => <Input defaultValue="Disabled value" disabled />;
export const DisabledWithIcon: Story = () => <Input defaultValue="Disabled" icon="search.svg" disabled />;
export const ErrorWithIcon: Story = () => <Input defaultValue="Bad value" icon="search.svg" hasError />;

// ── All states ───────────────────────────────────────────────────────

export const AllStates: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
    <Input placeholder="Default" />
    <Input defaultValue="With value" />
    <Input placeholder="With icon" icon="search.svg" />
    <Input defaultValue="Error state" hasError />
    <Input defaultValue="Error with icon" icon="search.svg" hasError />
    <Input defaultValue="Disabled" disabled />
    <Input defaultValue="Disabled with icon" icon="search.svg" disabled />
  </div>
);

// ── Densities ────────────────────────────────────────────────────────

export const Densities: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400 }}>
    {(["compact", "default", "spacious"] as const).map((density) => (
      <div key={density} style={{ display: "flex", alignItems: "center", gap: 12 }} data-density={density}>
        <span style={{ width: 72, fontSize: 11, color: "var(--semantic-color-text-secondary)", fontFamily: "monospace", flexShrink: 0 }}>{density}</span>
        <Input placeholder="Placeholder" icon="search.svg" />
      </div>
    ))}
  </div>
);
