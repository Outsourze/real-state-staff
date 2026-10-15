import Image from "next/image";
import {
  UsersRound,
  Check,
  UserSearch,
  GraduationCap,
  Wallet,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const includedServices = [
  {
    title: "Recruitment",
    description: "The right people for your agency.",
    icon: UserSearch,
  },
  {
    title: "Training",
    description: "Ready for your systems and workflow.",
    icon: GraduationCap,
  },
  {
    title: "Payroll",
    description: "Payroll and employment admin.",
    icon: Wallet,
  },
  {
    title: "Ongoing support",
    description: "Support as your team grows.",
    icon: Headset,
  },
];

export function HeroSection() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="hero-section">
      <div className="site-container">
        <div className="hero-layout">
          <div className="hero-content">
            <p className="eyebrow">People behind property</p>
            <h1 id="hero-heading">
              <span>The people behind</span>{" "}
              <span>your real estate</span>{" "}
              <span>business.</span>
            </h1>
            <p className="hero-description">
              Experienced real estate professionals, working as an extension of
              your team.
            </p>
            <div className="hero-actions">
              <Button href="/contact">Build your team</Button>
              <Button href="#roles" variant="secondary">
                Explore our roles
              </Button>
            </div>
            <p className="hero-reassurance">
              <Check size={20} aria-hidden="true" />
              Your own dedicated team. One simple monthly fee.
            </p>
          </div>
          <div className="hero-visual">
            <div className="hero-photo">
              <Image
                src="/images/hero-office.webp"
                alt="An open, light-filled workspace overlooking the coast"
                fill
                priority
                sizes="(max-width: 767px) 100vw, (max-width: 1296px) 46vw, 557px"
              />
            </div>
            <div className="hero-visual__note">
              <p>
                A stronger team. A clearer horizon.
                <span>Real support for your real estate business.</span>
              </p>
              <div className="hero-visual__icon">
                <UsersRound size={24} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <ul
          className="hero-services"
          aria-label="Support included with your team"
        >
          {includedServices.map(({ title, description, icon: Icon }) => (
            <li key={title}>
              <span className="hero-service__icon">
                <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
