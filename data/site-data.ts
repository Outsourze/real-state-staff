export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationLinks: readonly NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "Our Roles", href: "#roles" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export type RoleIcon =
  | "clipboard"
  | "user"
  | "target"
  | "building"
  | "house"
  | "megaphone"
  | "calculator"
  | "chart";

export type StaffingRole = {
  id: string;
  title: string;
  description: string;
  icon: RoleIcon;
  responsibilities: readonly string[];
};

export const roles: readonly StaffingRole[] = [
  {
    id: "operations-assistant",
    title: "Real Estate Operations Assistant",
    description: "Keep your business organised and moving.",
    icon: "clipboard",
    responsibilities: [
      "Maintain your CRM and agency records",
      "Coordinate calendars and everyday administration",
      "Prepare documents and track operational tasks",
    ],
  },
  {
    id: "executive-assistant",
    title: "Executive Assistant",
    description: "Senior support for principals, directors and agents.",
    icon: "user",
    responsibilities: [
      "Manage diaries, inboxes and meeting preparation",
      "Coordinate travel and follow-up tasks",
      "Support director and agent priorities",
    ],
  },
  {
    id: "lead-generation",
    title: "Lead Generation Specialist",
    description: "Build pipelines, qualify prospects and book appointments.",
    icon: "target",
    responsibilities: [
      "Research and qualify prospective clients",
      "Maintain lead pipelines and follow-up records",
      "Coordinate appointments for your sales team",
    ],
  },
  {
    id: "listing-coordinator",
    title: "Listing & Transaction Coordinator",
    description: "Keep listings, contracts and deadlines moving.",
    icon: "building",
    responsibilities: [
      "Coordinate listing information and documentation",
      "Track transaction milestones and important dates",
      "Keep agents and stakeholders up to date",
    ],
  },
  {
    id: "property-management",
    title: "Property Management Assistant",
    description: "Support tenants, landlords and property managers.",
    icon: "house",
    responsibilities: [
      "Coordinate maintenance requests and inspections",
      "Maintain tenancy and property records",
      "Assist with routine tenant and landlord communication",
    ],
  },
  {
    id: "marketing-coordinator",
    title: "Marketing Coordinator",
    description: "Turn listings and campaigns into consistent marketing.",
    icon: "megaphone",
    responsibilities: [
      "Prepare listing collateral and campaign assets",
      "Schedule social content and email campaigns",
      "Track campaign activity and reporting",
    ],
  },
  {
    id: "accounts-bookkeeping",
    title: "Accounts & Bookkeeping Assistant",
    description: "Keep invoices, reconciliations and reporting under control.",
    icon: "calculator",
    responsibilities: [
      "Prepare and organise invoices and expenses",
      "Support reconciliations within your approved processes",
      "Maintain records and assist with regular reporting",
    ],
  },
  {
    id: "research-analyst",
    title: "Research & Data Analyst",
    description: "Turn market data into useful insights.",
    icon: "chart",
    responsibilities: [
      "Research property and local market information",
      "Maintain accurate datasets and reports",
      "Prepare useful insights for your agency team",
    ],
  },
];

export const benefits: readonly string[] = [
  "Dedicated, experienced professionals",
  "Recruitment & candidate selection",
  "Onboarding & training",
  "Payroll & employment administration",
  "Equipment & IT support",
  "Ongoing account management",
  "Replacement support",
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Share your agency's goals, workload and the type of support you want to fill.",
  },
  {
    number: "02",
    title: "We find the right person",
    description:
      "We recruit and assess candidates, against your business needs.",
  },
  {
    number: "03",
    title: "Meet your candidates",
    description:
      "Preview short-listed professionals and choose your team member.",
  },
  {
    number: "04",
    title: "Build your team",
    description:
      "Your new team member onboards and starts working within your systems.",
  },
  {
    number: "05",
    title: "We support the relationship",
    description:
      "We handle the employment and operational support — so you can focus on your business.",
  },
];

export type Advantage = {
  title: string;
  description: string;
  icon: "crown" | "shield" | "heart" | "users";
};

export const advantages: readonly Advantage[] = [
  {
    title: "Real estate experienced",
    description:
      "Our team understands your industry, clients and the pace of your business.",
    icon: "crown",
  },
  {
    title: "Reliable & professional",
    description:
      "We're committed to quality, accountability and long-term partnerships.",
    icon: "shield",
  },
  {
    title: "Flexible & scalable",
    description:
      "Whether you need one person or a full team, we adapt to your needs.",
    icon: "heart",
  },
  {
    title: "Your success is our success",
    description:
      "We're more than a service — we're your extended team, invested in your growth.",
    icon: "users",
  },
];

export type Director = {
  name: string;
  description: string;
};

export const directors: readonly Director[] = [
  {
    name: "Murray Smith",
    description:
      "20+ years in real estate, formerly Ray White. Experienced, results-driven and client focused.",
  },
  {
    name: "Paul Saunders",
    description:
      "10+ years in outsourcing in the Philippines. Business owner, operator and people leader.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

/** Sample copy supplied in the brief. Replace with verified, approved testimonials. */
export const testimonials: readonly Testimonial[] = [
  {
    quote:
      "The support we've received has been incredible. Our EA is organised, proactive and just gets it. It's like having another team member — without the overhead.",
    name: "Sarah T.",
    role: "Real Estate Agency Owner",
  },
  {
    quote:
      "Professional, reliable and easy to work with. They've made a real difference to our business and we wouldn't go back.",
    name: "James L.",
    role: "Sales Director",
  },
  {
    quote:
      "The quality of people and the level of support is outstanding. Highly recommend Real Estate Staff to any agency looking to scale.",
    name: "Emily R.",
    role: "Principal",
  },
];
