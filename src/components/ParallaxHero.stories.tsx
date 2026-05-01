import type { StoryDefault, Story } from "@ladle/react";
import { ParallaxHero } from "./ParallaxHero";

export default { title: "ParallaxHero" } satisfies StoryDefault;

export const Demo: Story = () => (
  <>
    <ParallaxHero />
    <div style={{
      height: "50vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      fontSize: 14,
      color: "#888",
    }}>
      Scroll released — page continues normally.
    </div>
  </>
);
