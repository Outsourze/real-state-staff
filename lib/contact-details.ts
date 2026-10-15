export type SocialPlatform = "linkedin" | "instagram" | "facebook";

// Client-approved public contact details. Email delivery settings remain server-only.
export const businessContact = {
  email: "hello@realestatestaff.nz",
  phone: "+64 22 646 6569",
  phoneHref: "tel:+64226466569",
  whatsappHref: "https://wa.me/64226466569",
} as const;

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
