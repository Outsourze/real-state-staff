export type SocialPlatform = "linkedin" | "instagram" | "facebook";

// Add the client's approved profile URLs here when they are available.
// Empty values display the icon without creating a link.
export const socialProfileUrls: Record<SocialPlatform, string> = {
  linkedin: "",
  instagram: "",
  facebook: "",
};

export function getSocialProfileUrl(value: string): string | null {
  if (!value.trim()) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
