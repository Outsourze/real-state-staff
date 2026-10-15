import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { businessContact } from "@/lib/contact-details";
import styles from "./ContactLinks.module.css";

const contacts = [
  {
    label: "Email",
    value: businessContact.email,
    href: `mailto:${businessContact.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "Phone",
    value: businessContact.phone,
    href: businessContact.phoneHref,
    icon: Phone,
    external: false,
  },
  {
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: businessContact.whatsappHref,
    icon: MessageCircle,
    external: true,
  },
];

export function ContactLinks({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <ul
      className={`${styles.list} ${light ? styles.light : ""} ${compact ? styles.compact : ""}`}
      aria-label="Contact Real Estate Staff"
    >
      {contacts.map(({ label, value, href, icon: Icon, external }) => (
        <li key={label}>
          <a
            className={styles.link}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            <span className={styles.icon}>
              <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span className={styles.copy}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{value}</span>
            </span>
            {external && (
              <>
                <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
