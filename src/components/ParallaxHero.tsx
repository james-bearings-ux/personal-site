"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie from "lottie-web";
import styles from "./ParallaxHero.module.css";

// Timeline is divided into 4 equal phases, each representing one screen of scroll:
//   0 → 1  Transition: slide 2 enters left col; Lottie sits static at frame 0
//   1 → 2  Pause:      scroll scrubs through Lottie frames
//   2 → 3  Transition: slide 2 + Lottie exit upward (Lottie fades); slide 3 + square B enter
//   3 → 4  Pause:      square B spins 360°; scroll releases

export function ParallaxHero() {
  const containerRef = useRef<HTMLElement>(null);
  const slide1Ref    = useRef<HTMLDivElement>(null);
  const slide2Ref    = useRef<HTMLDivElement>(null);
  const slide3Ref    = useRef<HTMLDivElement>(null);
  const lottieRef    = useRef<HTMLDivElement>(null);
  const squareBRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const setHeight = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    setHeight();

    const anim = lottie.loadAnimation({
      container: lottieRef.current!,
      renderer:  "svg",
      loop:      false,
      autoplay:  false,
      path:      "/img/Yummy-Toast.json",
    });

    let ctx: ReturnType<typeof gsap.context> | null = null;

    anim.addEventListener("DOMLoaded", () => {
      anim.goToAndStop(0, true);
      const totalFrames = anim.totalFrames;
      const proxy = { frame: 0 };

      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // Phase 1: transition — left col text swaps; Lottie holds at frame 0
        tl.to(slide1Ref.current,    { yPercent: -100, duration: 1, ease: "none" }, 0)
          .fromTo(slide2Ref.current, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "none" }, 0)

        // Phase 2: pause — scroll scrubs through Lottie frames
          .to(proxy, {
            frame:    totalFrames - 1,
            duration: 1,
            ease:     "none",
            onUpdate: () => anim.goToAndStop(proxy.frame, true),
          }, 1)

        // Beat: Lottie holds on last frame before exiting (0.25 units ≈ 50vh at current scroll budget)

        // Phase 3: transition — slide 2 + Lottie exit up; slide 3 + square B enter
          .to(slide2Ref.current,    { yPercent: -100, duration: 1, ease: "none" }, 2.25)
          .to(lottieRef.current,    { y: "-100vh", opacity: 0, duration: 1, ease: "none" }, 2.25)
          .fromTo(slide3Ref.current,  { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "none" }, 2.25)
          .fromTo(squareBRef.current, { y: "100vh" },    { y: 0, duration: 1, ease: "none" }, 2.25)

        // Phase 4: pause — square B spins one full rotation
          .to(squareBRef.current,   { rotation: 360, duration: 1, ease: "none" }, 3.25);

        ScrollTrigger.create({
          trigger:   containerRef.current,
          start:     "top top",
          end:       "+=850vh",
          pin:       true,
          scrub:     1,
          animation: tl,
        });
      }, containerRef);
    });

    const onResize = () => {
      setHeight();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx?.revert();
      anim.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.leftCol}>
        <div ref={slide1Ref} className={styles.slide}>
          <h2 className={`type-heading-2 ${styles.heading}`}>Slide one</h2>
          <p className={`type-body-large ${styles.body}`}>
            The animation stays frozen as slide two moves in. Imagine a product
            rotating to reveal its back panel or interior.
          </p>
        </div>
        <div ref={slide2Ref} className={styles.slide}>
          <h2 className={`type-heading-2 ${styles.heading}`}>Slide two</h2>
          <p className={`type-body-large ${styles.body}`}>
            Scroll slowly to play the animation. Each frame is driven directly
            by scroll position — no timers, no autoplay.
          </p>
        </div>
        <div ref={slide3Ref} className={styles.slide}>
          <h2 className={`type-heading-2 ${styles.heading}`}>Slide three</h2>
          <p className={`type-body-large ${styles.body}`}>
            A new object enters with this slide. Scroll to spin it, then keep
            going — the page continues normally below.
          </p>
        </div>
      </div>
      <div className={styles.rightCol}>
        <div ref={lottieRef} className={styles.lottie} />
        <div ref={squareBRef} className={`${styles.square} ${styles.squareB}`} />
      </div>
    </section>
  );
}
