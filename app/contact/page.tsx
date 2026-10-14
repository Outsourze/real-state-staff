import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ClipboardList,
  House,
  MessagesSquare,
  Plus,
  Target,
  UsersRound,
} from "lucide-react";
import { ContactSection } from "@/components/sections/ContactSection";
import { SocialLinks } from "@/components/ui/SocialLinks";
import styles from "./ContactPage.module.css";

const title = "Contact our team";
const description =
  "Tell Real Estate Staff about your agency, the roles you need and your staffing questions. Let’s find the right support for your real estate business.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${title} | Real Estate Staff`,
    description,
    url: "/contact",
    images: [
      {
        url: "/images/luxury-meeting-room.webp",
        alt: "A welcoming workspace for your next conversation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Real Estate Staff`,
    description,
    images: ["/images/luxury-meeting-room.webp"],
  },
};

const nextSteps = [
  {
    title: "Understand your business",
    description:
      "We start with your workload, your goals and the responsibilities you’d like to hand over.",
    icon: MessagesSquare,
  },
  {
    title: "Shape the right support",
    description:
      "Together, we define the role, the skills you need and a monthly arrangement that fits your agency.",
    icon: ClipboardList,
  },
  {
    title: "Find your person",
    description:
      "We recruit and assess candidates, help you choose your team member and support their onboarding.",
    icon: UsersRound,
  },
];

const supportAreas = [
  {
    title: "Keep the everyday moving.",
    category: "Operations & admin",
    description: "Give your team more time for the work that needs them most.",
    tasks: [
      "CRM, calendars and agency administration",
      "Accounts, reporting and executive support",
    ],
    icon: ClipboardList,
  },
  {
    title: "Make room for your next sale.",
    category: "Sales & marketing",
    description:
      "Put consistent support behind your pipeline and your listings.",
    tasks: [
      "Lead research and appointment coordination",
      "Listing campaigns and transaction milestones",
    ],
    icon: Target,
  },
  {
    title: "Stay on top of every property.",
    category: "Property management",
    description:
      "Bring more structure to a busy property management portfolio.",
    tasks: [
      "Maintenance and inspection coordination",
      "Property records and routine communication",
    ],
    icon: House,
  },
];

const questions = [
  {
    question: "I know we need help. Where do we start?",
    answer:
      "Start with the tasks that take up the most time in your week. Choose the closest role in the form and use your message to tell us what is on your plate. We can discuss the role and responsibilities together; you do not need a finished job description.",
  },
  {
    question: "Which roles can you help us fill?",
    answer:
      "Our roles cover real estate operations, executive assistance, lead generation, listing and transaction coordination, property management, marketing, accounts and bookkeeping, and research and data analysis.",
  },
  {
    question: "What should we include for a monthly quote?",
    answer:
      "Tell us about the responsibilities you need covered, the size of your team and your preferred working arrangements. That gives us a starting point to discuss the right role and monthly scope for your agency.",
  },
  {
    question: "Do you help with recruitment and onboarding?",
    answer:
      "Yes. We recruit and assess candidates, introduce a shortlist and help you onboard your chosen team member into your systems. Payroll, employment administration and ongoing account management are part of our support.",
  },
  {
    question: "Can we start with one person?",
    answer:
      "Yes. Whether you are looking for one dedicated professional or building a wider team, we can discuss support around the work you need done and how your agency plans to grow.",
  },
];

function ContactIntroduction() {
  return (
    <div className={styles.introduction}>
      <p className="eyebrow">Let’s talk about your team</p>
      <h1 id="contact-heading" className={styles.pageTitle}>
        Good people.
        <br />
        Your next <span>chapter.</span>
      </h1>
      <p className={styles.lead}>
        A little more support can open up a lot more possibility. Tell us where
        you need a hand, and let’s find the right people for your real estate
        business.
      </p>
      <Link
        href="#staffing-enquiry"
        className={`button button--primary ${styles.enquiryJump}`}
      >
        <span>Write an enquiry</span>
        <ArrowDown size={18} aria-hidden="true" />
      </Link>
      <figure className={styles.workspace}>
        <div className={styles.workspacePhoto}>
          <Image
            src="/images/luxury-meeting-room.webp"
            alt="A contemporary meeting room with a long table and views through full-height windows"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, (max-width: 1296px) 43vw, 534px"
          />
        </div>
        <figcaption>
          <MessagesSquare size={24} aria-hidden="true" />
          <span>A conversation. A clearer way forward.</span>
        </figcaption>
      </figure>
      <ul className={styles.assurances}>
        {[
          "Dedicated people with real estate experience",
          "Recruitment, onboarding and ongoing support",
          "One person or a growing team",
        ].map((item) => (
          <li key={item}>
            <Check size={20} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <a href="#contact-process" className={styles.textLink}>
        What happens next <ArrowDown size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main id="main-content" className={styles.page}>
      <ContactSection
        variant="page"
        className={styles.enquiry}
        introduction={<ContactIntroduction />}
      />

      <section
        id="contact-process"
        className={styles.process}
        aria-labelledby="contact-process-heading"
      >
        <div className="site-container">
          <div className={styles.sectionIntro}>
            <div>
              <p className="eyebrow">A clear path forward</p>
              <h2 id="contact-process-heading" className={styles.lightTitle}>
                A conversation first.
                <br />A stronger team next.
              </h2>
            </div>
            <p>
              Once your enquiry is received, we work with you to turn your
              day-to-day challenges into a clear staffing plan.
            </p>
          </div>
          <ol className={styles.steps}>
            {nextSteps.map(({ title, description, icon: Icon }, index) => (
              <li key={title}>
                <div className={styles.stepTop}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="section-space"
        aria-labelledby="contact-support-heading"
      >
        <div className="site-container">
          <div className={styles.sectionIntro}>
            <div>
              <p className="eyebrow">Support that fits your day</p>
              <h2 id="contact-support-heading" className="section-heading">
                What would you like
                <br className={styles.desktopBreak} /> to take off your plate?
              </h2>
            </div>
            <div>
              <p>
                From the first lead to the final paperwork, there’s a person who
                can help your business move forward.
              </p>
              <Link href="/#roles" className={styles.textLink}>
                Explore all eight roles{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className={styles.supportGrid}>
            {supportAreas.map(
              ({ title, category, description, tasks, icon: Icon }) => (
                <article key={category} className={styles.supportCard}>
                  <div className={styles.supportTop}>
                    <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                    <p>{category}</p>
                  </div>
                  <h3>{title}</h3>
                  <p className={styles.supportDescription}>{description}</p>
                  <ul>
                    {tasks.map((task) => (
                      <li key={task}>
                        <Check size={18} aria-hidden="true" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className={styles.questions}
        aria-labelledby="contact-questions-heading"
      >
        <div className={`site-container ${styles.questionsLayout}`}>
          <div>
            <p className="eyebrow">A little more clarity</p>
            <h2 id="contact-questions-heading" className="section-heading">
              Before we talk.
            </h2>
            <p className={styles.questionsLead}>
              A few answers to help you plan your next move.
            </p>
            <div className={styles.socialPanel}>
              <h3>Stay connected.</h3>
              <p>Find Real Estate Staff on your favourite platform.</p>
              <SocialLinks tone="light" />
            </div>
          </div>
          <div className={styles.accordion}>
            {questions.map(({ question, answer }, index) => (
              <details key={question}>
                <summary>
                  <span className={styles.questionNumber} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>{question}</span>
                  <Plus size={22} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
            <a href="#staffing-enquiry" className={styles.textLink}>
              Have another question? Tell us about it{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
