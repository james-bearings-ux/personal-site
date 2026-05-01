import type { StoryDefault, Story } from "@ladle/react";
import { useState, useEffect } from "react";
import { StackedImage, type GrainApproach } from "./StackedImage";

export default { title: "StackedImage" } satisfies StoryDefault;

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

// --- POC: film grain comparison ---

const BASE_PROPS = {
  image: "/img/sample-background.jpg",
  imageAlt: "",
  heading: "Wide open spaces",
  body: "Horizon-spanning landscape captured at the edge of the golden hour, where the light flattens distance into layers of tone.",
};

const APPROACH_LABELS: Record<GrainApproach, string> = {
  none:           "Baseline (no grain)",
  "png-tile":     "A — Tiled PNG",
  "svg-overlay":  "B — SVG feTurbulence overlay",
  "css-filter":   "C — CSS filter on <img>",
  "data-uri":     "D — Data URI SVG background",
};

const APPROACH_NOTES: Record<GrainApproach, string> = {
  none:           "No overlay applied.",
  "png-tile":     "64×64 raw noise PNG, tiled. Overlay blend, 75% opacity. 3.7 KB asset.",
  "svg-overlay":  "SVG feTurbulence renders seamlessly at any size. Soft-light blend, 75% opacity. No asset.",
  "css-filter":   "feBlend bakes grain into the image; noise range compressed to 75% of max. Soft-light blend, 25% mix. No asset.",
  "data-uri":     "feTurbulence SVG encoded in CSS background-image, tiled at 200×200. Overlay blend, 75% opacity. ~340 bytes inline.",
};

function GrainMetrics({ approach }: { approach: GrainApproach }) {
  const [pngSize, setPngSize] = useState("...");

  useEffect(() => {
    if (approach !== "png-tile") return;
    fetch("/img/grain-tile.png", { method: "HEAD" })
      .then(r => {
        const len = r.headers.get("content-length");
        setPngSize(len ? `${(parseInt(len) / 1024).toFixed(1)} KB` : "check Network tab");
      })
      .catch(() => setPngSize("n/a"));
  }, [approach]);

  const deliveryMap: Record<GrainApproach, string> = {
    none:           "—",
    "png-tile":     "Image asset",
    "svg-overlay":  "Inline DOM node",
    "css-filter":   "Inline SVG filter",
    "data-uri":     "CSS background-image",
  };

  const sizeMap: Record<GrainApproach, string> = {
    none:           "—",
    "png-tile":     pngSize,
    "svg-overlay":  "~0 bytes",
    "css-filter":   "~0 bytes",
    "data-uri":     "~340 bytes",
  };

  return (
    <div style={{ fontFamily: "monospace", fontSize: 11, color: "#999", marginTop: 10, paddingTop: 10, borderTop: "1px solid #e5e5e5" }}>
      <span style={{ color: "#555", fontWeight: "bold" }}>{APPROACH_LABELS[approach]}</span>
      <br />
      {APPROACH_NOTES[approach]}
      <br />
      Delivery: {deliveryMap[approach]} &nbsp;·&nbsp; Size: {sizeMap[approach]}
    </div>
  );
}

function GrainCell({ approach }: { approach: GrainApproach }) {
  return (
    <div>
      <StackedImage {...BASE_PROPS} grain={approach} />
      <GrainMetrics approach={approach} />
    </div>
  );
}

export const GrainComparison: Story = () => (
  <div>
    <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#888", margin: "0 0 24px" }}>
      POC — A and D use overlay blend; B and C use soft-light. All at 75% opacity. Check the Network tab for load timing.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <GrainCell approach="png-tile" />
      <GrainCell approach="svg-overlay" />
      <GrainCell approach="css-filter" />
      <GrainCell approach="data-uri" />
    </div>
    <div style={{ marginTop: 48, paddingTop: 24, borderTop: "2px solid #e5e5e5" }}>
      <GrainCell approach="none" />
    </div>
  </div>
);
