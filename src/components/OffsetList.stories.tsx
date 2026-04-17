import type { StoryDefault, Story } from "@ladle/react";
import type { Surface } from "@/styles/tokens.surface";
import { withPageFrame } from "../../.ladle/PageFrame";
import { OffsetList } from "./OffsetList";

export default { title: "OffsetList", decorators: [withPageFrame] } satisfies StoryDefault;

const clients = [
  "Amgen", "Autodesk", "Cisco", "Collibra", "Cvent", "Discovery",
  "Faire", "IMF", "JDRF", "JLL", "Kelly Services", "Key Bank",
  "Lockheed Martin", "Macys", "Marriott", "NetApp", "Qurate",
  "Rally Health", "Riot Games", "Salesforce", "Wells Fargo",
];

export const Default: Story = () => (
  <OffsetList heading="Clients" items={clients} surface="low" />
);

export const ShortList: Story = () => (
  <OffsetList
    heading="Technologies"
    items={["React", "TypeScript", "Next.js", "Figma", "Style Dictionary"]}
    surface="low"
  />
);

export const Interactive: Story<{ surface: Surface }> = ({ surface }) => (
  <OffsetList heading="Clients" items={clients} surface={surface} />
);

Interactive.args = { surface: "low" };
Interactive.argTypes = {
  surface: {
    control: { type: "radio" },
    options: ["low", "base", "high"],
  },
};
