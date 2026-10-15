import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Calculator,
  ChartNoAxesCombined,
  CircleCheck,
  ClipboardList,
  Crown,
  Heart,
  House,
  Megaphone,
  Quote,
  ShieldCheck,
  Target,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  advantages,
  benefits,
  directors,
  processSteps,
  roles,
  testimonials,
  type Advantage,
  type RoleIcon,
} from "@/data/site-data";
import styles from "./MarketingSections.module.css";

const roleIcons: Record<RoleIcon, LucideIcon> = {
  clipboard: ClipboardList,
  user: UserRound,
  target: Target,
  building: Building2,
  house: House,
  megaphone: Megaphone,
  calculator: Calculator,
  chart: ChartNoAxesCombined,
};

const advantageIcons: Record<Advantage["icon"], LucideIcon> = {
  crown: Crown,
  shield: ShieldCheck,
  heart: Heart,
  users: UsersRound,
};

export function RolesSection() {
  return (
    <section
      id="roles"
      className="section-space"
      aria-labelledby="roles-heading"
    >
      <div className="site-container">
        <Reveal className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow">Real estate support, tailored to you</p>
            <h2 id="roles-heading" className="section-heading max-w-140">
              The right person for every part of your business.
            </h2>
          </div>
          <p className="max-w-110 pb-1 text-[1rem] leading-[1.8] lg:justify-self-end">
            From day-to-day operations to specialist support, our real estate
            professionals bring the skills, experience and focus to help your
            business grow.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.rolesGrid}>
            {roles.map((role, index) => {
              const Icon = roleIcons[role.icon];
              return (
                <article key={role.id} className={styles.roleCard}>
                  <div className={styles.roleCardTop}>
                    <span className={styles.roleIcon}>
                      <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className={styles.roleIndex} aria-hidden="true">
                      0{index + 1}
                    </span>
                  </div>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <a
                    href="#contact"
                    className={styles.roleCardLink}
                    aria-label={`Find your person: ${role.title}`}
                  >
                    Find your person <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </Reveal>

        <details className={styles.roleGuide}>
          <summary className={styles.roleGuideSummary}>
            Explore responsibilities for every role{" "}
            <ArrowRight size={15} strokeWidth={1.7} aria-hidden="true" />
          </summary>
          <div className="mt-9 grid gap-x-12 gap-y-8 border-t border-(--color-border) pt-9 md:grid-cols-2">
            {roles.map((role) => (
              <article key={role.id}>
                <h3 className="text-[1.125rem] leading-[1.5] font-semibold text-(--color-heading)">
                  {role.title}
                </h3>
                <ul className="mt-4 space-y-3 text-[1rem] leading-[1.75]">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CircleCheck
                        size={15}
                        className="mt-1.5 shrink-0 text-(--color-primary)"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={styles.roleContact}
                  aria-label={`Discuss this role: ${role.title}`}
                >
                  Discuss this role <ArrowRight size={14} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className={styles.benefits} aria-labelledby="benefits-heading">
      <div className="site-container">
        <div className={styles.benefitsContent}>
          <Reveal>
            <p className="eyebrow text-white/80 before:bg-white/60">
              More capability, less overhead.
            </p>
            <h2 id="benefits-heading" className="section-heading text-white">
              A smarter way to build your real estate team.
            </h2>
            <p className="mt-6 max-w-100 text-[1rem] leading-[1.8] text-white/85">
              Skip the recruitment, HR and admin. Get dedicated professionals
              with real estate experience — for one simple monthly fee.
            </p>
            <Button href="#how-it-works" variant="light" className="mt-7">
              How it works
            </Button>
          </Reveal>
          <Reveal className={styles.benefitsChecklist} delay={0.1}>
            <ul className="space-y-5">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-[1rem] leading-[1.65] text-white/90"
                >
                  <CircleCheck
                    size={19}
                    strokeWidth={1.25}
                    className="mt-0.5 shrink-0 text-[#A5B9AE]"
                    aria-hidden="true"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
      <div className={styles.benefitsVisual}>
        <Image
          src="/images/luxury-meeting-room.webp"
          alt="Sunlit contemporary meeting room with floor-to-ceiling windows"
          fill
          sizes="(max-width: 1100px) 100vw, 35vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-space"
      aria-labelledby="process-heading"
    >
      <div className="site-container">
        <Reveal>
          <p className="eyebrow">Simple. Flexible. Built around you.</p>
          <h2 id="process-heading" className="section-heading">
            How it works
          </h2>
        </Reveal>
        <ol className={styles.timeline}>
          {processSteps.map((step, index) => (
            <li key={step.number} className={styles.timelineItem}>
              <Reveal className={styles.timelineStep} delay={index * 0.06}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {step.number}
                </span>
                <div className={styles.stepCopy}>
                  <h3 className="text-[1.125rem] leading-[1.5] font-semibold text-(--color-heading)">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[1rem] leading-[1.8]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className={styles.pricing}
      aria-labelledby="pricing-heading"
    >
      <div className={styles.pricingVisual}>
        <Image
          src="/images/modern-property.webp"
          alt="Modern architectural home opening onto a landscaped terrace"
          fill
          sizes="(max-width: 900px) 100vw, 53vw"
          className="object-cover"
        />
      </div>
      <div className="site-container">
        <Reveal className={styles.pricingCopy}>
          <h2
            id="pricing-heading"
            className="text-[2.25rem] leading-[1.25] font-medium tracking-[-0.035em] text-white lg:text-[2.5rem]"
          >
            Dedicated real estate staff from{" "}
            <span className="mt-4 block text-[3rem] lg:text-[3.5rem]">
              $1,295
              <span className="text-[1.5rem] tracking-[-0.02em]">/month</span>
            </span>
          </h2>
          <p className="mt-5 text-[1rem] leading-[1.8] text-white/85">
            Great people. Simple pricing. No hidden costs.
          </p>
          <Button href="/contact" variant="light" className="mt-6">
            Get a custom quote
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="section-space" aria-labelledby="advantages-heading">
      <div className="site-container">
        <Reveal>
          <p className="eyebrow">The Real Estate Staff advantage</p>
          <h2 id="advantages-heading" className="section-heading">
            Why work with us?
          </h2>
        </Reveal>
        <Reveal className={styles.advantagesGrid}>
          {advantages.map((advantage) => {
            const Icon = advantageIcons[advantage.icon];
            return (
              <article key={advantage.title} className={styles.advantage}>
                <Icon
                  size={29}
                  strokeWidth={1.3}
                  className="text-(--color-primary)"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-[1.125rem] leading-[1.5] font-semibold text-(--color-heading)">
                  {advantage.title}
                </h3>
                <p className="mt-3 text-[1rem] leading-[1.8]">
                  {advantage.description}
                </p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      className={styles.about}
      aria-labelledby="about-heading"
    >
      <div className="site-container">
        <div className={styles.aboutGrid}>
          <div className={styles.aboutVisual}>
            <Image
              src="/images/founders.webp"
              alt="A welcoming contemporary workspace with warm, natural light"
              fill
              sizes="(max-width: 1100px) 100vw, (max-width: 1280px) 44vw, 500px"
              className="object-cover"
            />
            <span className={styles.imageCaption}>
              A considered space. A people-first approach.
            </span>
          </div>
          <Reveal className={styles.aboutCopy}>
            <p className="eyebrow">About us</p>
            <h2 id="about-heading" className="section-heading">
              Two industry professionals. One shared vision.
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.8]">
              Real Estate Staff is co-founded by Murray Smith and Paul Saunders,
              combining decades of real estate and outsourcing experience to
              help agencies build high-performing, reliable teams.
            </p>
            <div id="directors" className={styles.directors}>
              {directors.map((director) => (
                <article key={director.name}>
                  <h3 className="text-[1.125rem] font-semibold text-(--color-heading)">
                    {director.name}
                  </h3>
                  <p className="mt-3 text-[1rem] leading-[1.8]">
                    {director.description}
                  </p>
                </article>
              ))}
            </div>
            <Button href="#directors" variant="secondary" className="mt-7">
              Meet the directors
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section
      className="section-space"
      aria-labelledby="testimonials-heading"
      aria-describedby="testimonials-note"
    >
      <div className="site-container">
        <Reveal>
          <p className="eyebrow">What our clients say</p>
          <h2 id="testimonials-heading" className="section-heading">
            Trusted by real estate professionals
          </h2>
          <p
            id="testimonials-note"
            className="mt-4 text-[1rem] leading-[1.7] text-(--color-text)"
          >
            Sample testimonials — awaiting client approval
          </p>
        </Reveal>
        <Reveal className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className={styles.testimonial}>
              <Quote
                size={28}
                strokeWidth={1.2}
                className="text-(--color-sage)"
                aria-hidden="true"
              />
              <blockquote className="mt-5 flex-1 text-[1rem] leading-[1.8]">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-7 border-t border-(--color-border) pt-5 text-[1rem] leading-[1.8]">
                <span className="block font-semibold text-(--color-heading)">
                  {testimonial.name}
                </span>
                <span>{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className={styles.cta} aria-labelledby="cta-heading">
      <Image
        src="/images/landscape-cta.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className={styles.ctaOverlay} />
      <div className="site-container relative z-1">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-145">
            <h2 id="cta-heading" className="section-heading text-white">
              Ready to build your real estate team?
            </h2>
            <p className="mt-5 max-w-120 text-[1rem] leading-[1.8] text-white/90">
              Let&apos;s talk about how Real Estate Staff can help your business
              grow.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/contact" variant="primary">
              Get started
            </Button>
            <Button href="/contact" variant="light">
              Talk to us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
