import type { StoryDefault, Story } from "@ladle/react";
import { withPageFrame } from "../../.ladle/PageFrame";
import { StackedImage } from "./StackedImage";

export default { title: "StackedImage", decorators: [withPageFrame] } satisfies StoryDefault;

export const WithTitle: Story = () => (
  <StackedImage
    image="/img/sample-panorama.jpg"
    imageAlt="Sacred Valley, Peru"
    title="Sacred Valley"
    heading="Sacred Valley, Peru"
    body="Sweeping views across the Urubamba valley, framed by Andean peaks and the terraced hillsides of the Inca heartland."
  />
);

export const WithoutTitle: Story = () => (
  <StackedImage
    image="/img/sample-panorama-2.jpeg"
    imageAlt="Valley landscape"
    heading="Wide open spaces"
    body="Horizon-spanning landscape captured at the edge of the golden hour, where the light flattens distance into layers of tone."
  />
);
