import {
  getSocialProfileUrl,
  socialProfileUrls,
  type SocialPlatform,
} from "@/lib/contact-details";

const profiles: { platform: SocialPlatform; label: string; path: string }[] = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    path: "M5.4 7.8H2V22h3.4V7.8ZM3.7 2A2 2 0 1 0 3.7 6a2 2 0 0 0 0-4ZM22 13.8c0-4.3-2.3-6.3-5.4-6.3a4.6 4.6 0 0 0-4.1 2.2V7.8H9V22h3.5v-7.9c0-2.1.4-4.1 3-4.1 2.5 0 2.6 2.4 2.6 4.2V22H22v-8.2Z",
  },
  {
    platform: "instagram",
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
  },
  {
    platform: "facebook",
    label: "Facebook",
    path: "M14 22v-9h3l.5-4H14V6.5c0-1.2.4-2 2-2h2V1.2A25 25 0 0 0 15.1 1C12.2 1 10 2.8 10 6v3H7v4h3v9h4Z",
  },
];

export function SocialLinks({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const allUnavailable = profiles.every(
    ({ platform }) => !getSocialProfileUrl(socialProfileUrls[platform]),
  );
  const iconClass = `flex size-12 shrink-0 items-center justify-center rounded-[4px] border ${
    tone === "light"
      ? "border-white/50 text-white"
      : "border-[#6f897d] text-[var(--color-primary)]"
  }`;

  return (
    <div className={className}>
      <ul aria-label="Social profiles" className="flex flex-wrap gap-3">
        {profiles.map(({ platform, label, path }) => {
          const href = getSocialProfileUrl(socialProfileUrls[platform]);
          const icon = (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d={path} />
            </svg>
          );

          return (
            <li key={platform}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Real Estate Staff on ${label} (opens in a new tab)`}
                  className={`${iconClass} transition-colors ${tone === "light" ? "hover:bg-white/15" : "hover:bg-[#e5ece4]"}`}
                >
                  {icon}
                </a>
              ) : (
                <span
                  role="img"
                  aria-label={`${label} profile coming soon`}
                  title={`${label} profile coming soon`}
                  className={iconClass}
                >
                  {icon}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {allUnavailable && (
        <p
          className={`mt-3 text-base leading-relaxed ${tone === "light" ? "text-white/85" : "text-[var(--color-text)]"}`}
        >
          Social profiles coming soon.
        </p>
      )}
    </div>
  );
}
