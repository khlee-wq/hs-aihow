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
      ".float-in, [data-motion-hero], [data-motion-float], [data-motion-satellite], [data-motion-drop-group], [data-motion-product-stage], [data-motion-parallax], [data-motion-reveal]";
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
        const floatingItems = Array.from(
          root.current?.querySelectorAll<HTMLElement>("[data-motion-float]") ??
            [],
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

        const satellites = Array.from(
          root.current?.querySelectorAll<HTMLElement>(
            "[data-motion-satellite]",
          ) ?? [],
        );
        if (satellites.length) {
          gsap.fromTo(
            satellites,
            {
              autoAlpha: 0,
              y: (index) => -110 - index * 18,
              rotate: (index) => (index % 2 ? 8 : -8),
              scale: 0.82,
            },
            {
              autoAlpha: 1,
              y: 0,
              rotate: (index) => (index - 1) * 2.5,
              scale: 1,
              duration: 0.92,
              delay: 0.42,
              stagger: 0.13,
              ease: "back.out(1.7)",
            },
          );
          satellites.forEach((satellite, index) => {
            gsap.to(satellite, {
              y: index % 2 ? 7 : -7,
              rotate: index % 2 ? "+=1.4" : "-=1.4",
              duration: 2.6 + index * 0.35,
              delay: 1.25 + index * 0.12,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
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

        // 세로 스크롤 안에서 카드 덱 자체가 옆으로 한 장씩 넘어갑니다.
        // 이전·다음 카드를 일부 남겨, 슬라이드 쇼가 아닌 실제 카드의 이동으로 읽힙니다.
        if (window.matchMedia("(min-width: 1024px)").matches) {
          Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-product-stage]",
            ) ?? [],
          ).forEach((stage) => {
            const cards = Array.from(
              stage.querySelectorAll<HTMLElement>("[data-motion-product-card]"),
            );
            if (!cards.length) return;
            gsap.set(cards, {
              xPercent: (index) => -50 + index * 108,
              y: (index) => index * 26,
              rotate: (index) => index * 5,
              autoAlpha: (index) => (index === 0 ? 1 : 0.6),
            });
            const sequence = gsap.timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top 16%",
                end: () => `+=${Math.max(980, cards.length * 480)}`,
                scrub: 0.72,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
            cards.slice(0, -1).forEach((card, index) => {
              cards.forEach((item, itemIndex) => {
                const distance = itemIndex - (index + 1);
                sequence.to(
                  item,
                  {
                    xPercent: -50 + distance * 108,
                    y: Math.abs(distance) * 26,
                    rotate: distance * 5,
                    autoAlpha: distance === 0 ? 1 : distance < -1 ? 0.28 : 0.6,
                    duration: 1,
                    ease: "none",
                  },
                  itemIndex === 0 ? undefined : "<",
                );
              });
            });
          });
        }

        if (window.matchMedia("(max-width: 639px)").matches) {
          Array.from(
            root.current?.querySelectorAll<HTMLElement>(
              "[data-motion-product-stage]",
            ) ?? [],
          ).forEach((stage) => {
            const track = stage.querySelector<HTMLElement>(
              "[data-motion-product-track]",
            );
            if (!track) return;
            gsap.to(track, {
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
          });
        }

        if (window.matchMedia("(min-width: 1024px)").matches) {
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
        }

        Array.from(
          root.current?.querySelectorAll<HTMLElement>("[data-motion-reveal]") ??
            [],
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
              scrollTrigger: { trigger: section, start: "top 84%", once: true },
            },
          );
        });

        return () =>
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
    const timeoutId = idleId === undefined ? window.setTimeout(start, 180) : undefined;

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      disposeMotion?.();
    };
  }, [motionReady, pathname]);

  return (
    <div ref={root} className={`min-h-[100svh]${motionReady ? " motion-ready" : ""}`}>
      {children}
    </div>
  );
}
