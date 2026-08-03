"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const orbitAnimation = {
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
              c: { a: 0, k: [0.816, 0.353, 0.208, 1] },
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
              c: { a: 0, k: [0.816, 0.353, 0.208, 1] },
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
              c: { a: 0, k: [0.22, 0.549, 0.486, 1] },
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

export function JourneyOrbit({ className }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(true);
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
      animationData={orbitAnimation}
      autoplay={!reducedMotion}
      loop={!reducedMotion}
      aria-hidden
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
