import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function LearningIntroHero({
  children,
  copy,
  eyebrow,
  icon: Icon,
  title,
  titleId,
}: {
  children?: ReactNode;
  copy: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  titleId: string;
}) {
  return (
    <div
      className="learning-intro-hero relative z-10 mx-auto w-full max-w-5xl text-center"
      data-motion-hero
    >
      <span
        className="learning-intro-icon mx-auto grid place-items-center bg-[color-mix(in_srgb,var(--surface-raised)_62%,transparent)] text-[var(--brand)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_65%,transparent),var(--shadow-sm)] backdrop-blur-xl"
        aria-hidden
      >
        <Icon className="learning-intro-icon-glyph" />
      </span>
      <p className="student-kicker learning-intro-eyebrow text-[var(--brand)]">
        {eyebrow}
      </p>
      <h1 id={titleId} className="student-display learning-intro-title">
        {title}
      </h1>
      <p className="student-lead learning-intro-copy text-[var(--text-secondary)]">
        {copy}
      </p>
      {children}
    </div>
  );
}
