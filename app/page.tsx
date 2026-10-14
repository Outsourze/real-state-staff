import { HeroSection } from "@/components/sections/HeroSection";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  RolesSection,
  BenefitsSection,
  HowItWorksSection,
  PricingSection,
  WhyChooseUsSection,
  AboutSection,
  TestimonialsSection,
  CTASection,
} from "@/components/sections/MarketingSections";

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      <RolesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <PricingSection />
      <WhyChooseUsSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
    </main>
  );
}
