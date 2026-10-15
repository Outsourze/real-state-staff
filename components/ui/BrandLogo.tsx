import Link from "next/link";
import Image from "next/image";

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
      aria-label="Real Estate Staff — home"
    >
      <Image
        src={light ? "/brand-logo-light.svg" : "/brand-logo.svg"}
        alt=""
        width={353}
        height={80}
        className="brand__image"
        loading="eager"
        draggable={false}
      />
    </Link>
  );
}
