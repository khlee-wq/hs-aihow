"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  useGSAP(
    () => {
      if (!motionReady) return;

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
            { autoAlpha: 0, y: 30, rotate: 1.5 },
            {
              autoAlpha: 1,
              y: 0,
              rotate: 0,
              duration: 1,
              delay: 0.16,
              ease: "power4.out",
              clearProps: "opacity,visibility,rotate",
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

        Array.from(
          root.current?.querySelectorAll<HTMLElement>("[data-motion-reveal]") ??
            [],
        ).forEach((section) => {
          const items = section.querySelectorAll("[data-motion-item]");
          gsap.fromTo(
            items.length ? items : section,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: section, start: "top 84%", once: true },
            },
          );
        });

        return () =>
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
      return () => media.revert();
    },
    {
      scope: root,
      dependencies: [motionReady, pathname],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={root} className="min-h-[100svh]">
      {children}
    </div>
  );
}
