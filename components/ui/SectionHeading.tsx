import type { ReactNode } from "react";
type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
  light?: boolean;
};
export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`section-intro ${light ? "section-intro--light" : ""} ${className}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <div className="section-intro__row">
        <h2 className="section-heading">{title}</h2>
        {description && (
          <p className="section-intro__description">{description}</p>
        )}
      </div>
    </div>
  );
}
