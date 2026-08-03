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
            {
              autoAlpha: 0,
              y: (index) => -62 - index * 18,
              rotate: (index) => (index - 1) * 4,
              scale: 0.94,
            },
            {
              autoAlpha: 1,
              y: 0,
              rotate: 0,
              scale: 1,
              duration: 0.88,
              stagger: 0.12,
              ease: "back.out(1.35)",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: group,
                start: "top 82%",
                once: true,
              },
            },
          );
        });

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
