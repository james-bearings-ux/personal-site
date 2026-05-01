import styles from "./StackedImage.module.css";

/** @experimental POC — remove after grain approach is selected */
export type GrainApproach = "none" | "png-tile" | "svg-overlay" | "css-filter" | "data-uri";

interface StackedImageProps {
  image: string;
  imageAlt?: string;
  title?: string;
  heading: string;
  body: string;
  /** @experimental Film grain POC prop. Remove after approach selection. */
  grain?: GrainApproach;
}

function GrainOverlay({ approach }: { approach: GrainApproach }) {
  if (approach === "png-tile") {
    return <div className={styles.grainPng} aria-hidden />;
  }
  if (approach === "svg-overlay") {
    return (
      <svg aria-hidden className={styles.grainSvg} xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-b">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={4} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-b)" />
      </svg>
    );
  }
  if (approach === "data-uri") {
    return <div className={styles.grainDataUri} aria-hidden />;
  }
  return null;
}

export function StackedImage({ image, imageAlt = "", title, heading, body, grain = "none" }: StackedImageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrap}>
        {grain === "css-filter" && (
          <svg aria-hidden style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
            <defs>
              <filter id="grain-c" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={4} result="noise" />
                <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                <feComponentTransfer in="grayNoise" result="rangedNoise">
                  <feFuncR type="linear" slope={0.75} intercept={0} />
                  <feFuncG type="linear" slope={0.75} intercept={0} />
                  <feFuncB type="linear" slope={0.75} intercept={0} />
                </feComponentTransfer>
                <feBlend in="SourceGraphic" in2="rangedNoise" mode="soft-light" result="blended" />
                <feComposite in="blended" in2="SourceGraphic" operator="arithmetic" k1={0} k2={0.25} k3={0.75} k4={0} />
              </filter>
            </defs>
          </svg>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
          className={styles.image}
          {...(grain === "css-filter" ? { style: { filter: "url(#grain-c)" } } : {})}
        />
        {title && <p className={`type-display ${styles.imageTitle}`}>{title}</p>}
        <GrainOverlay approach={grain} />
      </div>
      <div className={styles.caption}>
        <h3 className={`type-heading-2 ${styles.heading}`}>{heading}</h3>
        <p className={`type-body-large ${styles.body}`}>{body}</p>
      </div>
    </div>
  );
}
