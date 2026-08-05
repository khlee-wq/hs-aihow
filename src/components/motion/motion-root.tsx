"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const enableMotion = () => {
      timer = window.setTimeout(() => setMotionReady(true), 150);
    };

    if (document.readyState === "complete") enableMotion();
    else window.addEventListener("load", enableMotion, { once: true });

    return () => {
      window.removeEventListener("load", enableMotion);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!motionReady || !root.current) return;

    const motionSelector =
      ".float-in, [data-motion-hero], [data-motion-hero-waterfall], [data-motion-waterfall-art], [data-motion-float], [data-motion-drop-group], [data-motion-product-stage], [data-motion-parallax], [data-motion-reveal]";
    if (!root.current.querySelector(motionSelector)) return;

    let cancelled = false;
    let disposeMotion: (() => void) | undefined;

    const loadMotion = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const pageEntry = Array.from(
            root.current?.querySelectorAll<HTMLElement>(".float-in") ?? [],
          );
          if (pageEntry.length)
            gsap.fromTo(
              pageEntry,
              { autoAlpha: 0, y: 14 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.62,
                stagger: 0.06,
                ease: "power3.out",
                clearProps: "transform,opacity,visibility",
              },
            );

          const heroItems = Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-hero] > *",
            ) ?? [],
          );
          if (heroItems.length)
            gsap.fromTo(
              heroItems,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.82,
                stagger: 0.09,
                ease: "power4.out",
                clearProps: "transform,opacity,visibility",
              },
            );

          const heroWaterfallItems = Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-hero-waterfall] > *",
            ) ?? [],
          );
          if (heroWaterfallItems.length)
            gsap.fromTo(
              heroWaterfallItems,
              {
                autoAlpha: 0,
                y: (index) => -58 - index * 13,
                filter: "blur(8px)",
              },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.02,
                stagger: 0.1,
                ease: "power4.out",
                clearProps: "transform,opacity,visibility,filter",
              },
            );
          const floatingItems = Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-float]",
            ) ?? [],
          );
          if (floatingItems.length) {
            gsap.fromTo(
              floatingItems,
              { autoAlpha: 0, y: -72, rotate: -3, scale: 0.96 },
              {
                autoAlpha: 1,
                y: 0,
                rotate: 0,
                scale: 1,
                duration: 1.08,
                delay: 0.16,
                ease: "back.out(1.35)",
                clearProps: "opacity,visibility,rotate,scale",
              },
            );
            gsap.to(floatingItems, {
              y: -8,
              duration: 3.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }

          const waterfallArt = Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-waterfall-art]",
            ) ?? [],
          );
          if (waterfallArt.length) {
            gsap.fromTo(
              waterfallArt,
              {
                autoAlpha: 0,
                y: (index) => -118 - index * 24,
                rotate: (index) => [-3.5, 2.5, -2][index] ?? 0,
                scale: 0.94,
              },
              {
                autoAlpha: 1,
                y: 0,
                rotate: 0,
                scale: 1,
                duration: 1.05,
                delay: 0.12,
                stagger: 0.16,
                ease: "back.out(1.22)",
                clearProps: "transform,opacity,visibility",
              },
            );
          }

          Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-drop-group]",
            ) ?? [],
          ).forEach((group) => {
            const cards = Array.from(
              group.querySelectorAll<HTMLElement>("[data-motion-drop]"),
            );
            if (!cards.length) return;
            gsap.fromTo(
              cards,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.62,
                stagger: 0.08,
                ease: "power3.out",
                clearProps: "transform,opacity,visibility",
                scrollTrigger: {
                  trigger: group,
                  start: "top 82%",
                  once: true,
                },
              },
            );
          });

          // 한 메시지를 고정하고 준비 단계만 교체합니다. 겹친 카드 대신
          // 이전 장면이 정리된 뒤 다음 장면이 들어와 제품의 흐름으로 읽힙니다.
          media.add("(min-width: 1024px)", () => {
            const sequences: gsap.core.Timeline[] = [];
            const animatedCards: HTMLElement[] = [];
            Array.from(
              root.current?.querySelectorAll<HTMLElement>(
                "[data-motion-product-stage]",
              ) ?? [],
            ).forEach((stage) => {
              const cards = Array.from(
                stage.querySelectorAll<HTMLElement>(
                  "[data-motion-product-card]",
                ),
              );
              if (!cards.length) return;
              animatedCards.push(...cards);
              gsap.set(cards, {
                xPercent: (index) => (index === 0 ? 0 : 7),
                autoAlpha: (index) => (index === 0 ? 1 : 0),
                pointerEvents: (index) => (index === 0 ? "auto" : "none"),
              });
              const sequence = gsap.timeline({
                scrollTrigger: {
                  trigger: stage,
                  start: "top 16%",
                  end: () => `+=${Math.max(920, cards.length * 420)}`,
                  scrub: 0.72,
                  pin: true,
                  pinSpacing: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              sequences.push(sequence);
              cards.slice(0, -1).forEach((card, index) => {
                sequence
                  .to(card, {
                    xPercent: -7,
                    autoAlpha: 0,
                    pointerEvents: "none",
                    duration: 0.45,
                    ease: "power2.in",
                  })
                  .to(cards[index + 1], {
                    xPercent: 0,
                    autoAlpha: 1,
                    pointerEvents: "auto",
                    duration: 0.55,
                    ease: "power2.out",
                  });
              });
            });

            return () => {
              sequences.forEach((sequence) => {
                sequence.scrollTrigger?.kill();
                sequence.kill();
              });
              gsap.set(animatedCards, {
                clearProps: "transform,opacity,visibility,pointer-events",
              });
            };
          });

          media.add("(max-width: 639px)", () => {
            const trackTweens: gsap.core.Tween[] = [];
            const animatedTracks: HTMLElement[] = [];
            Array.from(
              root.current?.querySelectorAll<HTMLElement>(
                "[data-motion-product-stage]",
              ) ?? [],
            ).forEach((stage) => {
              const track = stage.querySelector<HTMLElement>(
                "[data-motion-product-track]",
              );
              if (!track) return;
              animatedTracks.push(track);
              const tween = gsap.to(track, {
                x: () => Math.min(0, stage.clientWidth - track.scrollWidth),
                ease: "none",
                scrollTrigger: {
                  trigger: stage,
                  start: "top 17%",
                  end: () => `+=${Math.max(680, track.scrollWidth * 1.05)}`,
                  scrub: 0.7,
                  pin: true,
                  pinSpacing: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              trackTweens.push(tween);
            });

            return () => {
              trackTweens.forEach((tween) => {
                tween.scrollTrigger?.kill();
                tween.kill();
              });
              gsap.set(animatedTracks, { clearProps: "transform" });
            };
          });

          media.add("(min-width: 1024px)", () => {
            Array.from(
              root.current?.querySelectorAll<HTMLElement>(
                "[data-motion-parallax]",
              ) ?? [],
            ).forEach((item) => {
              gsap.fromTo(
                item,
                { y: 34 },
                {
                  y: -28,
                  ease: "none",
                  scrollTrigger: {
                    trigger: item,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                },
              );
            });

            Array.from(
              root.current?.querySelectorAll<HTMLElement>(
                "[data-motion-journey]",
              ) ?? [],
            ).forEach((journey) => {
              const steps = Array.from(
                journey.querySelectorAll<HTMLElement>("[data-motion-item]"),
              );
              if (!steps.length) return;
              gsap.fromTo(
                steps,
                { autoAlpha: 0.45, y: 20 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.09,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: journey,
                    start: "top 76%",
                    once: true,
                  },
                },
              );
            });
          });

          Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-reveal]",
            ) ?? [],
          ).forEach((section) => {
            const items = section.querySelectorAll("[data-motion-item]");
            gsap.fromTo(
              items.length ? items : section,
              { y: 18 },
              {
                y: 0,
                duration: 0.62,
                stagger: 0.08,
                ease: "power3.out",
                clearProps: "transform",
                scrollTrigger: {
                  trigger: section,
                  start: "top 84%",
                  once: true,
                },
              },
            );
          });
        });
        return () => media.revert();
      }, root);
      disposeMotion = () => context.revert();
    };

    const start = () => void loadMotion();
    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback?.(start, { timeout: 900 });
    const timeoutId =
      idleId === undefined ? window.setTimeout(start, 180) : undefined;

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      disposeMotion?.();
    };
  }, [motionReady, pathname]);

  return (
    <div
      ref={root}
      className={`min-h-[100svh]${motionReady ? " motion-ready" : ""}`}
    >
      {children}
    </div>
  );
}
