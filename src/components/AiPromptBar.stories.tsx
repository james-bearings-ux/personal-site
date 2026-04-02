import type { StoryDefault, Story } from "@ladle/react";
import { AiPromptBar } from "./AiPromptBar";

export default { title: "AiPromptBar" } satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ minHeight: "100vh", position: "relative" }}>
    <AiPromptBar />
  </div>
);
