"use client";

import Lottie from "lottie-react";
import { useEffect, useMemo, useState } from "react";
import { useBrandPalette } from "@/components/brand/brand-palette";

function createOrbitAnimation(orbitColor: number[], coreColor: number[]) {
  return {
    v: "5.12.2",
    fr: 60,
    ip: 0,
    op: 180,
    w: 120,
    h: 120,
    nm: "AIHOW journey orbit",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Outer orbit",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: {
            a: 1,
            k: [
              { t: 0, s: [0] },
              { t: 180, s: [360] },
            ],
          },
          p: { a: 0, k: [60, 60, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [82, 82] },
                p: { a: 0, k: [0, 0] },
                nm: "Ring",
              },
              {
                ty: "st",
                c: { a: 0, k: orbitColor },
                o: { a: 0, k: 42 },
                w: { a: 0, k: 4 },
                lc: 2,
                lj: 2,
                nm: "Ring stroke",
              },
              {
                ty: "el",
                d: 1,
                s: { a: 0, k: [13, 13] },
                p: { a: 0, k: [41, 0] },
                nm: "Dot",
              },
              {
                ty: "fl",
                c: { a: 0, k: orbitColor },
                o: { a: 0, k: 100 },
                nm: "Dot fill",
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
            nm: "Orbit group",
          },
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Core",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [60, 60, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [88, 88, 100] },
              { t: 90, s: [108, 108, 100] },
              { t: 180, s: [88, 88, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [36, 36] },
                p: { a: 0, k: [0, 0] },
                nm: "Core circle",
              },
              {
                ty: "fl",
                c: { a: 0, k: coreColor },
                o: { a: 0, k: 100 },
                nm: "Core fill",
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
            nm: "Core group",
          },
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0,
      },
    ],
  };
}

export function JourneyOrbit({ className }: { className?: string }) {
  const { palette } = useBrandPalette();
  const [reducedMotion, setReducedMotion] = useState(true);
  const animationData = useMemo(
    () =>
      palette === "iris"
        ? createOrbitAnimation(
            [0.396, 0.345, 0.851, 1],
            [0.208, 0.725, 0.584, 1],
          )
        : createOrbitAnimation(
            [0.094, 0.482, 0.447, 1],
            [0.51, 0.659, 0.29, 1],
          ),
    [palette],
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <Lottie
      className={className}
      animationData={animationData}
      autoplay={!reducedMotion}
      loop={!reducedMotion}
      aria-hidden
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
