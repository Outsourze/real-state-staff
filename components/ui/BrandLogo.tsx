import Link from "next/link";

export function BrandLogo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand--light" : ""} ${compact ? "brand--compact" : ""}`}
    >
      <svg
        viewBox="0 0 100 120"
        className="brand__mark"
        fill="none"
        aria-hidden="true"
      >
        <path d="M3 51 27 31V115H3Z" fill="currentColor" />
        <path d="M37 22 63 3V115H37Z" fill="currentColor" />
        <path d="m73 33 24 18v64H73Z" fill={light ? "#A5B9AE" : "#78978B"} />
      </svg>
      <span className="brand__type">
        <span className="brand__name">
          REAL ESTATE <strong>STAFF</strong>
        </span>
        <span className="brand__tagline">PEOPLE BEHIND PROPERTY</span>
      </span>
      <span className="sr-only">home</span>
    </Link>
  );
}
