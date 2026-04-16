import type { Story } from "@ladle/react";
import { Icon, IconName } from "./Icon";

const allIcons: IconName[] = [
  "arrow_forward",
  "check_circle",
  "close",
  "keyboard_arrow_down",
  "keyboard_arrow_up",
  "search",
];

export const AllIcons: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
    {(["small", "medium", "large"] as const).map((size) => (
      <div key={size}>
        <p style={{ color: "var(--semantic-color-text-secondary)", marginBottom: "12px" }}>
          {size}
        </p>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {allIcons.map((name) => (
            <Icon key={name} name={name} size={size} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const ColorInheritance: Story = () => (
  <div style={{ display: "flex", gap: "32px" }}>
    {(
      [
        "--semantic-color-text-primary",
        "--semantic-color-interaction-default",
        "--semantic-color-text-secondary",
        "--semantic-color-icon-primary",
      ] as const
    ).map((token) => (
      <div key={token} style={{ color: `var(${token})` }}>
        <Icon name="search" size="large" />
      </div>
    ))}
  </div>
);
