import type { StoryDefault, Story } from "@ladle/react";
import { Tabs, Tab } from "./Tabs";

export default { title: "Tabs" } satisfies StoryDefault;

// ── Configurations ───────────────────────────────────────────────────

export const ThreeTabs: Story = () => (
  <Tabs defaultValue="one">
    <Tab value="one">One</Tab>
    <Tab value="two">Two</Tab>
    <Tab value="three">Three</Tab>
  </Tabs>
);

export const ManyTabs: Story = () => (
  <Tabs defaultValue="a">
    <Tab value="a">Alpha</Tab>
    <Tab value="b">Beta</Tab>
    <Tab value="c">Gamma</Tab>
    <Tab value="d">Delta</Tab>
    <Tab value="e">Epsilon</Tab>
  </Tabs>
);

// ── Densities ────────────────────────────────────────────────────────

export const Densities: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {(["compact", "default", "spacious"] as const).map((density) => (
      <div key={density} style={{ display: "flex", alignItems: "center", gap: 16 }} data-density={density}>
        <span style={{ width: 72, fontSize: 11, color: "var(--semantic-color-text-secondary)", fontFamily: "monospace" }}>{density}</span>
        <Tabs defaultValue="one">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </Tabs>
      </div>
    ))}
  </div>
);
