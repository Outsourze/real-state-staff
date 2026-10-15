# CODEX PROMPT — Build a Premium Real Estate Staffing Website

## 1. Project Overview

You are a senior frontend engineer, UI/UX designer, and Next.js specialist.

Your task is to build a **fully responsive, production-quality real estate staffing agency website** based on the reference screenshot I have provided.

The website brand is **Real Estate Staff**, with the tagline:

**"People Behind Property"**

The goal is to recreate the reference design as closely as possible, including its visual hierarchy, colors, typography, image composition, spacing, sections, buttons, cards, and overall premium aesthetic.

The final website must look like a polished, professionally designed agency website — not a generic template.

**Important:** The uploaded screenshot is the primary visual reference. Analyze it carefully before implementing anything. Follow the design faithfully rather than inventing a different layout.

---

## 2. Technology Stack

Use the following technologies:

- **Framework:** Next.js (App Router, latest stable version)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Fonts:** Google Fonts using `next/font/google`
- **Animations:** Framer Motion / Motion for React
- **Image Optimization:** Next.js `Image` component
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel-ready
- **Package Manager:** npm

Do not use Bootstrap, Material UI, or heavy UI frameworks.

Use clean, maintainable, reusable components with strict TypeScript typing.

Use server components by default and client components only when interactivity is required.

---

## 3. Visual Design Direction

The design must feel:

- Premium and sophisticated
- Modern and minimal
- Corporate but approachable
- Professional and trustworthy
- Clean, elegant, and spacious
- Inspired by luxury real estate brands
- Editorial, with strong typography and architectural photography

The website uses a combination of **deep forest green, warm ivory, muted sage, and white**.

Avoid bright colors, unnecessary gradients, excessive shadows, overly rounded components, and flashy animations.

The design should have a restrained luxury aesthetic.

### Color Palette

Use the following approximate colors extracted visually from the reference screenshot.

| Color | Hex | Usage |
|---|---|---|
| Primary Forest Green | `#003F32` | Main brand, buttons, dark sections |
| Deep Emerald | `#00382D` | Footer and dark backgrounds |
| Dark Green | `#004B3C` | Headings and icons |
| Sage Green | `#78978B` | Secondary accents |
| Muted Green | `#A5B9AE` | Borders and subtle details |
| Warm Ivory | `#F7F8F3` | Main page background |
| Soft Off-White | `#F1F3EE` | Cards and alternate sections |
| Pure White | `#FFFFFF` | Text on dark sections |
| Body Text | `#405F57` | Paragraphs and descriptions |
| Light Border | `#DCE4DD` | Dividers and card borders |

Use these colors consistently throughout the site.

Create reusable CSS variables:

```css
:root {
  --color-primary: #003F32;
  --color-primary-dark: #00382D;
  --color-heading: #004B3C;
  --color-sage: #78978B;
  --color-muted-green: #A5B9AE;
  --color-background: #F7F8F3;
  --color-surface: #F1F3EE;
  --color-white: #FFFFFF;
  --color-text: #405F57;
  --color-border: #DCE4DD;
}
```

The background should feel slightly warm, not stark white.

Dark green sections should be rich and elegant.

---

## 4. Typography

Typography is extremely important.

Use **Manrope** as the primary font, loaded through `next/font/google`.

The reference uses a clean geometric sans-serif with modern proportions, rounded shapes, and excellent readability.

If needed, use **DM Sans** for body text, but prefer a consistent Manrope-based design.

### Typography Specifications

**Hero Heading**
- Desktop: 52–60px
- Tablet: 42–48px
- Mobile: 34–40px
- Font weight: 500–600
- Line height: 1.12
- Letter spacing: -0.035em
- Color: Dark forest green

**Section Headings**
- Desktop: 34–42px
- Mobile: 28–32px
- Font weight: 500–600
- Line height: 1.2
- Letter spacing: -0.025em

**Body Text**
- Desktop: 15–17px
- Mobile: 14–16px
- Line height: 1.6–1.75
- Weight: 400

**Small Eyebrow Labels**
- 10–12px
- Uppercase
- Font weight: 600
- Letter spacing: 0.14em–0.2em

**Navigation**
- 11–12px
- Uppercase
- Font weight: 600
- Letter spacing: 0.08em

**Buttons**
- 11–13px
- Uppercase
- Font weight: 600–700
- Letter spacing: 0.07em

Do not make everything bold. The reference uses elegant medium-weight headings.

---

## 5. Layout and Spacing

Use a centered content container with:

- Maximum width: 1280px
- Desktop horizontal padding: 48–64px
- Tablet padding: 32px
- Mobile padding: 20–24px

Recommended spacing:

- Large section padding: 90–110px
- Medium section padding: 65–85px
- Mobile section padding: 50–65px
- Card gaps: 12–18px
- Heading-to-description gap: 16–24px

The screenshot is a long single-page marketing website with approximately 10 major sections.

Recreate the same order and general proportions.

Use full-width image sections where appropriate.

Do not constrain every section to the same boxed layout.

---

# 6. Website Sections

## Section 1 — Header / Navigation

Create a premium, minimal navigation bar.

### Desktop Layout

Left:
- Custom Real Estate Staff logo
- Stylized geometric building icon
- Brand name in uppercase
- Small tagline underneath: "PEOPLE BEHIND PROPERTY"

Center:
- Home
- Our Roles
- How It Works
- Pricing
- About

Right:
- Dark green "GET STARTED" button
- Arrow-right icon

### Logo Design

Create a custom logo using SVG.

The logo should resemble three or four ascending architectural building shapes.

Use forest green.

The wordmark should be uppercase with generous letter spacing.

Avoid using an emoji or generic house icon.

### Navigation Styling

- Background: warm ivory
- Height: approximately 88–96px
- Active link: thin green underline
- Navigation links evenly spaced
- CTA button: dark forest green
- Button radius: 3–4px
- No heavy shadows

### Mobile Navigation

Create a hamburger menu.

When clicked:
- Open a clean mobile navigation panel
- Display all links vertically
- Include the Get Started CTA
- Close on navigation or Escape
- Prevent background scrolling when open

Use accessible buttons and appropriate ARIA attributes.

---

## Section 2 — Hero

This is the most important visual section.

The reference uses a **split-layout hero with a diagonal image boundary**.

### Desktop Layout

Left side: approximately 50%.

Right side: approximately 50–55%.

Left content:

**Heading:**
"The people behind your real estate business."

Break the heading into three visually balanced lines.

**Description:**
"Experienced real estate professionals, working as an extension of your team."

**Small Service Labels:**
RECRUITMENT | TRAINING | PAYROLL | ONGOING SUPPORT

**Buttons:**
1. BUILD YOUR TEAM → (filled green)
2. EXPLORE OUR ROLES → (outlined green)

### Hero Image

Use a premium photograph showing:
- Modern real estate office
- Laptop on a wooden desk
- Coffee cup
- Notebook or stationery
- Large windows
- Waterfront, mountain, or luxury city view
- Soft natural daylight

The image should have a high-end architectural photography style.

Use `object-fit: cover`.

### Diagonal Image Treatment

The image must not be a simple rectangle.

Use CSS `clip-path` or a polygon mask to create the diagonal left edge seen in the reference.

Example:

```css
clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
```

Adjust the polygon and positioning to match the screenshot.

The left text panel should visually overlap the image area through the diagonal composition.

### Image Overlay Text

In the upper-right area of the image, display:

QUALITY PEOPLE.  
REAL SUPPORT.  
LASTING PARTNERSHIPS.

Use:
- White text
- Uppercase
- Small font
- Wide letter spacing

### Hero Height

Desktop: approximately 530–620px.

Mobile:
- Stack text above image
- Remove or simplify diagonal clipping
- Preserve the visual hierarchy
- Ensure all buttons are usable

---

## Section 3 — Real Estate Staffing Roles

Background: warm ivory.

### Section Eyebrow

Add a short horizontal green line followed by:

"REAL ESTATE SUPPORT, TAILORED TO YOU"

### Section Heading

"The right person for every part of your business."

### Supporting Paragraph

"From day-to-day operations to specialist support, our real estate professionals bring the skills, experience and focus to help your business grow."

Place the heading on the left and description on the right on desktop.

### Roles Grid

Create eight role cards in a 4-column, 2-row grid.

Cards:

**1. Real Estate Operations Assistant**
- Icon: clipboard/calendar
- Description: "Keep your business organised and moving."

**2. Executive Assistant**
- Icon: user-round
- Description: "Senior support for principals, directors and agents."

**3. Lead Generation Specialist**
- Icon: target
- Description: "Build pipelines, qualify prospects and book appointments."

**4. Listing & Transaction Coordinator**
- Icon: building/document
- Description: "Keep listings, contracts and deadlines moving."

**5. Property Management Assistant**
- Icon: house
- Description: "Support tenants, landlords and property managers."

**6. Marketing Coordinator**
- Icon: megaphone
- Description: "Turn listings and campaigns into consistent marketing."

**7. Accounts & Bookkeeping Assistant**
- Icon: calculator
- Description: "Keep invoices, reconciliations and reporting under control."

**8. Research & Data Analyst**
- Icon: chart-no-axes-combined
- Description: "Turn market data into useful insights."

### Card Styling

- Background: very light sage/off-white
- Border: subtle or none
- Border radius: 0–4px
- Padding: 24–28px
- Minimum height: approximately 170–190px
- Icon color: forest green
- Icon size: 25–30px
- Title: dark green
- Description: muted green
- No exaggerated shadows

### Hover Effect

On hover:
- Slight background change
- Subtle upward translation (2–4px)
- Smooth transition of 200–300ms

Do not make the cards look like floating SaaS dashboard widgets.

### Bottom Link

Centered:

"VIEW ALL ROLES →"

Underlined text link with arrow.

---

## Section 4 — A Smarter Way to Build Your Team

Create a full-width dark forest green section.

Use a three-part composition:

1. Left: Heading and description
2. Center: Benefits checklist
3. Right: Large luxury office image

### Left Content

Eyebrow:

"MORE CAPABILITY, LESS OVERHEAD."

Heading:

"A smarter way to build your real estate team."

Description:

"Skip the recruitment, HR and admin. Get dedicated professionals with real estate experience — for one simple monthly fee."

Button:

"HOW IT WORKS →"

Outlined white button.

### Center Checklist

Use Lucide `circle-check` icons.

Items:
- Dedicated, experienced professionals
- Recruitment & candidate selection
- Onboarding & training
- Payroll & employment administration
- Equipment & IT support
- Ongoing account management
- Replacement support

Use white text and thin icons.

Add a subtle vertical divider between left and center.

### Right Image

Use a luxury office or meeting room image with:
- Floor-to-ceiling windows
- Modern furniture
- Waterfront or mountain view
- Natural lighting

Use a diagonal polygon boundary between the dark green area and image.

The image should occupy approximately 30–35% of the section.

On mobile:
- Stack content vertically
- Display the image underneath
- Remove complex clipping if necessary

---

## Section 5 — How It Works

Background: warm ivory.

Eyebrow:

"SIMPLE. FLEXIBLE. BUILT AROUND YOU."

Heading:

"How it works"

Create a five-step horizontal timeline.

### Steps

**01 — Tell us what you need**

"Share your agency's goals, workload and the type of support you want to fill."

**02 — We find the right person**

"We recruit and assess candidates, against your business needs."

**03 — Meet your candidates**

"Preview short-listed professionals and choose your team member."

**04 — Build your team**

"Your new team member onboards and starts working within your systems."

**05 — We support the relationship**

"We handle the employment and operational support — so you can focus on your business."

### Timeline Design

- Five equally spaced columns
- Thin horizontal line connecting all steps
- Dark green numbered circles
- White numbers
- Circle size: approximately 36–40px
- Small bold titles
- Muted body text

The connecting line should run behind the numbered circles.

On mobile:
- Convert to a vertical timeline
- Put circles on the left
- Use a vertical connecting line
- Content on the right

---

## Section 6 — Pricing Banner

Create a horizontal full-width promotional section.

### Left

Luxury residential property image:
- Modern architectural home
- Swimming pool or landscaped terrace
- Mountains, lake, or scenic landscape
- Warm natural lighting

### Right

Dark forest green panel.

Heading:

"Dedicated real estate staff from $1,295/month"

Supporting text:

"Great people. Simple pricing. No hidden costs."

Button:

"GET A CUSTOM QUOTE →"

### Layout

Use a diagonal transition between the image and green panel.

Desktop:
- Image approximately 50%
- Text panel approximately 50%

Section height: 300–360px.

On mobile:
- Stack image and green content
- Ensure pricing heading is prominent

Do not create a separate pricing table unless necessary.

---

## Section 7 — Why Work With Us?

Background: warm ivory.

Eyebrow:

"THE REAL ESTATE STAFF ADVANTAGE"

Heading:

"Why work with us?"

Create four evenly spaced benefit columns.

### Benefits

**Real estate experienced**
- Icon: crown
- Description: "Our team understands your industry, clients and the pace of your business."

**Reliable & professional**
- Icon: shield
- Description: "We're committed to quality, accountability and long-term partnerships."

**Flexible & scalable**
- Icon: heart
- Description: "Whether you need one person or a full team, we adapt to your needs."

**Your success is our success**
- Icon: users
- Description: "We're more than a service — we're your extended team, invested in your growth."

### Styling

- Thin vertical separators between columns
- Forest green outline icons
- Small bold headings
- Muted body descriptions
- Spacious layout
- No card backgrounds

On mobile:
- Use a 2-column grid where space allows
- Stack vertically on small screens
- Replace vertical separators with subtle horizontal dividers if needed

---

## Section 8 — About the Founders

Create a split section.

### Left

Large image of two professional male founders in business attire.

Photography direction:
- Professional corporate portrait
- Modern office setting
- Natural lighting
- Authentic, approachable appearance
- Neutral tones
- High-end editorial style

Use the actual reference image if an appropriate licensed asset is available. Otherwise, use a suitable replacement image.

Do not imply that substitute people are the actual founders.

### Right

Eyebrow:

"ABOUT US"

Heading:

"Two industry professionals. One shared vision."

Description:

"Real Estate Staff is co-founded by Murray Smith and Paul Saunders, combining decades of real estate and outsourcing experience to help agencies build high-performing, reliable teams."

### Founder Details

**Murray Smith**

"20+ years in real estate, formerly Ray White. Experienced, results-driven and client focused."

**Paul Saunders**

"10+ years in outsourcing in the Philippines. Business owner, operator and people leader."

Arrange founder details in two columns with a vertical divider.

Button:

"MEET THE DIRECTORS →"

Use an outlined green button.

### Layout

- Image takes approximately 44%
- Text takes approximately 56%
- Full-height visual alignment
- Background: light ivory/off-white

On mobile:
- Image first
- Text underneath
- Founder details stack if necessary

---

## Section 9 — Testimonials

Background: warm ivory.

Eyebrow:

"WHAT OUR CLIENTS SAY"

Heading:

"Trusted by real estate professionals"

Create three testimonial cards in one row.

### Testimonials

**Testimonial 1**

"The support we've received has been incredible. Our EA is organised, proactive and just gets it. It's like having another team member — without the overhead."

— Sarah T., Real Estate Agency Owner

**Testimonial 2**

"Professional, reliable and easy to work with. They've made a real difference to our business and we wouldn't go back."

— James L., Sales Director

**Testimonial 3**

"The quality of people and the level of support is outstanding. Highly recommend Real Estate Staff to any agency looking to scale."

— Emily R., Principal

### Card Styling

- Light off-white background
- Thin subtle border
- Minimal border radius
- Padding: 26–32px
- Large decorative quote icon
- Quote text: muted green
- Attribution at bottom
- Equal card heights

Do not use star ratings unless provided.

The testimonial text is placeholder content from the reference. Keep it easy to replace with approved client testimonials before publishing.

---

## Section 10 — Final Call to Action

Create a full-width CTA banner using a scenic landscape image.

Image direction:
- Calm lake or waterfront
- Mountains
- Soft sunset or golden-hour lighting
- Premium real estate lifestyle atmosphere

Apply a subtle dark overlay for readability.

### Content

Left:

"Ready to build your real estate team?"

Supporting text:

"Let's talk about how Real Estate Staff can help your business grow."

Right:

Two buttons:
1. GET STARTED →
2. TALK TO US →

### Styling

- White heading
- White supporting text
- Primary dark green button
- Secondary outlined white button
- Balanced horizontal layout
- Background image covers full width

Mobile:
- Stack heading and buttons
- Maintain sufficient contrast
- Buttons must remain fully visible

---

## Section 11 — Footer

Background: deep emerald green `#00382D`.

### Layout

Left:
- White version of the custom logo
- Brand name
- Tagline

Center:
- Home
- Our Roles
- How It Works
- Pricing
- About

Right:
- LinkedIn icon
- Instagram icon

### Footer Bottom

Centered copyright:

"© 2026 Real Estate Staff. All rights reserved."

Right:
- Privacy Policy
- Terms & Conditions

Use small white text with reduced opacity.

Keep footer minimal and premium.

---

# 7. Image Requirements

Photography is a major part of this design.

The website must not use random unrelated images.

Use high-quality, relevant real estate and architectural photography.

Required images:

1. Hero — premium office desk with laptop and city/waterfront view
2. Benefits — modern luxury meeting room overlooking water
3. Pricing — luxury modern home with scenic landscape
4. About — professional portrait of two male business founders
5. Final CTA — scenic lake and mountain landscape

### Image Guidelines

- Prefer real photography over illustrations
- Use realistic architectural imagery
- Maintain consistent lighting and color grading
- Avoid overly saturated images
- Avoid obvious AI-generated artifacts
- Use optimized WebP/AVIF where appropriate
- Preserve image quality on retina screens
- Use descriptive alt text
- Prevent layout shifts with proper image sizing

Store downloaded, appropriately licensed images in:

`/public/images/`

Use descriptive filenames:

- `hero-office.webp`
- `luxury-meeting-room.webp`
- `modern-property.webp`
- `founders.webp`
- `landscape-cta.webp`

If exact imagery is unavailable, use carefully selected high-quality replacements from Unsplash or Pexels, subject to their licensing terms.

Do not use broken image links.

Do not use the entire reference screenshot as a background image. Recreate the website using real HTML, CSS, components, and individual images.

---

# 8. Buttons and Interactive Elements

Create a reusable Button component.

Variants:

### Primary Button
- Forest green background
- White text
- Small border radius
- Uppercase label
- Arrow-right icon
- Subtle hover darkening

### Secondary Button
- Transparent background
- Forest green border
- Forest green text
- Arrow-right icon

### Light Outline Button
- Transparent background
- White border
- White text
- Used on dark sections

### Button Behavior

On hover:
- Smooth color transition
- Arrow translates 3px to the right
- Transition duration: 200ms

On focus:
- Visible accessible focus ring

All buttons must have meaningful destinations or actions.

Avoid dead buttons and placeholder `href="#"` links.

---

# 9. Animations

Use subtle, professional animations.

Recommended:

**Scroll Reveal**
- Fade in from opacity 0 to 1
- Translate Y from 20px to 0
- Duration: 0.5–0.7 seconds

**Card Hover**
- Translate Y by -3px
- Slight background color transition

**Image Reveal**
- Gentle fade-in
- No dramatic zooming

**Timeline**
- Stagger step entrance slightly

**Navigation**
- Smooth underline animation

**Buttons**
- Arrow-right movement

Do not overanimate.

Respect `prefers-reduced-motion`.

Animations must not cause layout shifts.

---

# 10. Responsive Design

The website must be fully responsive.

### Desktop — 1280px and Above

- Full navigation
- Split hero
- Four-column role cards
- Horizontal five-step timeline
- Three-column testimonials
- Diagonal image compositions

### Laptop — 1024px to 1279px

- Reduce spacing slightly
- Preserve desktop composition
- Adjust heading sizes
- Ensure no overflow

### Tablet — 768px to 1023px

- Roles grid becomes two columns
- Benefits section may stack
- Navigation can collapse
- Timeline adapts as needed
- Split sections remain balanced or stack

### Mobile — Below 768px

- Hamburger navigation
- Hero text and image stack
- Role cards in one or two columns depending on width
- Timeline becomes vertical
- Pricing image and content stack
- About image and text stack
- Testimonials become a single column
- CTA buttons wrap or stack
- Footer becomes vertically arranged

### Critical Requirements

- No horizontal scrolling
- No text clipping
- No overlapping content
- No tiny unreadable text
- No oversized empty spaces
- No broken diagonal masks
- All images crop correctly
- All touch targets are accessible

Test at widths of 375px, 390px, 768px, 1024px, 1440px, and 1920px.

---

# 11. Component Architecture

Organize the project with reusable components.

Suggested structure:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── RolesSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── WhyChooseUsSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CTASection.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── SectionHeading.tsx
│       ├── RoleCard.tsx
│       ├── BenefitItem.tsx
│       ├── TimelineStep.tsx
│       ├── TestimonialCard.tsx
│       └── BrandLogo.tsx
│
├── data/
│   ├── roles.ts
│   ├── benefits.ts
│   ├── testimonials.ts
│   └── navigation.ts
│
├── lib/
│   └── utils.ts
│
└── types/
    └── index.ts

public/
├── images/
└── favicon.svg
```

Use typed data arrays for repeatable content.

Avoid hardcoding large data structures directly inside JSX.

---

# 12. Functional Requirements

The website must not only look good; it must also work.

Implement the following:

### Navigation
- Working section anchor links
- Smooth scrolling
- Active navigation indication
- Mobile navigation toggle
- Sticky header if visually appropriate

### CTA Buttons
- Build Your Team
- Get Started
- Get a Custom Quote
- Talk to Us

These should lead to a working contact/lead form or appropriate contact section.

### Contact Form

Create a polished, accessible contact form, preferably in a modal or dedicated contact section.

Fields:
- Full Name
- Email Address
- Company / Agency
- Phone Number (optional)
- Role Needed
- Message

Use React Hook Form and Zod.

Include:
- Client-side validation
- Loading state
- Success state
- Error state
- Accessible labels

Do not pretend to send emails if no backend is configured.

If no email service credentials exist, implement a clearly documented server-side integration point and a truthful development-mode fallback.

### Footer
- Functional links
- Social links only when real URLs are available
- Privacy and Terms routes with clearly marked draft content if actual legal copy is unavailable

---

# 13. SEO and Performance

Implement proper SEO using Next.js Metadata API.

Suggested metadata:

**Title:**
"Real Estate Staff | The People Behind Your Real Estate Business"

**Description:**
"Build your real estate team with experienced professionals. Recruitment, training, payroll and ongoing support — all in one simple solution."

Include:
- Open Graph metadata
- Twitter card metadata
- Favicon
- Semantic HTML
- Proper heading hierarchy
- Descriptive image alt text
- Sitemap
- Robots configuration

### Performance Targets

Aim for:
- Lighthouse Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Use:
- Optimized images
- Lazy loading for below-the-fold images
- Priority loading for hero imagery
- Font optimization
- Minimal client-side JavaScript
- No unnecessary dependencies

---

# 14. Accessibility

Follow WCAG 2.2 AA best practices.

Requirements:
- Semantic HTML
- Correct heading hierarchy
- Keyboard-accessible navigation
- Accessible mobile menu
- Visible focus states
- Appropriate ARIA attributes
- Sufficient color contrast
- Descriptive alt text
- Proper form labels
- Reduced-motion support

Do not sacrifice accessibility for visual fidelity.

---

# 15. Pixel-Accurate Reference Matching

The uploaded screenshot is the visual source of truth.

Pay special attention to:

1. The precise proportions of the hero section.
2. The diagonal clipping between image and content.
3. The restrained forest-green color scheme.
4. The typography weight and line breaks.
5. The spacing between major sections.
6. The compact role cards.
7. The full-width dark green benefit section.
8. The five-step horizontal timeline.
9. The diagonal luxury-property pricing banner.
10. The founders' split-image section.
11. The minimal testimonial cards.
12. The scenic final CTA.
13. The dark green footer.

The website should feel visually very close to the reference screenshot.

Avoid common generic-template mistakes:
- Excessive rounded corners
- Oversized shadows
- Giant typography everywhere
- Random gradients
- Excessive animation
- Generic blue SaaS colors
- Too much whitespace
- Inconsistent card heights
- Poor image cropping
- Unnecessary decorative shapes
- Emojis instead of professional icons

Use the reference's overall density, spacing, and visual rhythm.

---

# 16. Implementation Process

Follow this development workflow.

### Phase 1 — Project Setup

1. Inspect the existing repository.
2. Identify whether Next.js is already configured.
3. Preserve existing dependencies and configurations where reasonable.
4. Install missing required dependencies.
5. Configure Tailwind CSS.
6. Configure Google Fonts.
7. Create design tokens and global styles.

### Phase 2 — Assets

1. Inspect the provided reference image.
2. Identify all required photography.
3. Source appropriate licensed images.
4. Optimize and save assets locally.
5. Create the custom SVG logo.
6. Configure image rendering.

### Phase 3 — Layout

1. Build the header.
2. Build the hero.
3. Implement all sections in screenshot order.
4. Build the footer.
5. Match desktop spacing and proportions.

### Phase 4 — Responsive Design

1. Optimize tablet layout.
2. Optimize mobile layout.
3. Implement mobile navigation.
4. Adapt diagonal image compositions.
5. Fix overflow and typography issues.

### Phase 5 — Interactions

1. Implement navigation links.
2. Implement CTA functionality.
3. Implement contact form.
4. Add subtle animations.
5. Add hover and focus states.

### Phase 6 — Quality Assurance

1. Run TypeScript checks.
2. Run ESLint.
3. Run production build.
4. Fix all errors.
5. Check responsive layouts.
6. Test navigation and form interactions.
7. Review accessibility.
8. Review performance.

If browser automation or screenshot comparison tools are available, render the implementation at the same viewport width as the reference and compare the visual layout.

Iterate until the page closely matches the reference.

---

# 17. Code Quality Rules

Follow these rules strictly:

- Use TypeScript for all components.
- Avoid `any` types.
- Use functional React components.
- Prefer server components.
- Keep components focused and reusable.
- Avoid duplicated markup.
- Use semantic HTML.
- Use Tailwind utilities for most styling.
- Use custom CSS for diagonal masks and specialized effects.
- Use consistent naming conventions.
- Keep content data separate from presentation.
- Do not introduce unnecessary packages.
- Do not leave unused imports.
- Do not leave console errors.
- Do not use placeholder buttons that do nothing.
- Do not use broken external assets.
- Do not create fake functionality.

Use clean, readable, production-quality code.

---

# 18. Final Acceptance Criteria

The project is complete only when:

- [ ] The homepage closely matches the uploaded reference.
- [ ] Every major section is implemented in the correct order.
- [ ] The forest-green and ivory palette is consistent.
- [ ] Typography closely resembles the reference.
- [ ] All major photographic assets are present.
- [ ] Diagonal image sections are correctly implemented.
- [ ] Header and footer match the design.
- [ ] Desktop layout is polished.
- [ ] Tablet layout is responsive.
- [ ] Mobile layout is fully usable.
- [ ] Navigation works correctly.
- [ ] CTA buttons have meaningful actions.
- [ ] Contact form has proper validation.
- [ ] Images are optimized.
- [ ] Accessibility requirements are addressed.
- [ ] No TypeScript errors remain.
- [ ] No build errors remain.
- [ ] No horizontal overflow exists.
- [ ] No broken images or dead links exist.

---

# 19. Final Instructions

**Build the actual working website, not just a design mockup.**

Do not stop after creating a scaffold or writing a plan.

Implement all components, styling, responsive behavior, and interactions.

Use the uploaded screenshot as the primary design reference and aim for high visual fidelity.

Where the screenshot does not clearly specify a detail, make a tasteful design decision consistent with its established visual language.

Do not unnecessarily redesign the page.

Do not replace the original layout with a generic landing page.

Do not omit sections.

Do not use the screenshot itself as the rendered webpage.

Prioritize in this order:

1. Visual accuracy to the screenshot
2. Responsive layout quality
3. Functional completeness
4. Accessibility
5. Performance
6. Code maintainability

Once implementation is complete, run the appropriate checks and fix any issues.

Provide a concise final summary of:
- What was implemented
- Which assets were used
- Which features are functional
- Which commands were successfully run
- Any remaining configuration requirements

**The expected result is a premium, elegant, fully functional Next.js + TypeScript real estate staffing website that looks as close as possible to the provided reference screenshot.**