# Client logo and hero copy

Updated on 15 October 2026 from the client's supplied logo and hero screenshots,
including the later 517 × 133 close-up of the logo.

The approved hero wording is:

> The people behind your real estate business.

> Experienced real estate professionals, working as an extension of your team.

The headline uses three balanced lines on desktop, with natural wrapping on
small screens and when text is enlarged. Existing readable font sizes, calls
to action and the responsive hero photograph remain in place.

## Logo files

| File | Purpose |
| --- | --- |
| `public/brand-logo.svg` | Larger, stronger lettering for the website header |
| `public/brand-logo-light.svg` | Matching readable light version used in the footer |
| `public/brand-logo-4k.png` | Transparent 3840 × 870 PNG of the readable website logo |
| `public/brand-logo-reference.svg` | Preserved close-reference reconstruction |
| `public/brand-logo-light-reference.svg` | Preserved light reference reconstruction |
| `public/brand-logo-reference-4k.png` | Transparent 3840 × 892 PNG of the reference version |
| `public/brand-mark.svg` | Standalone three-column symbol |
| `public/favicon.svg` | Matching symbol on an ivory app-icon background |

The full logo follows the reference's three architectural columns, slim
vertical divider, stacked REAL ESTATE / STAFF lettering, and widely spaced
PEOPLE BEHIND PROPERTY tagline. The original screenshot has a small canvas;
this is a vector reconstruction, not the client's original vector artwork.
The exact original typeface and source colors were not supplied, so a
pixel-identical match cannot be guaranteed. An original SVG, AI or vector PDF
can replace the reconstruction later if available.

The preserved close-up reconstruction uses a tightly cropped 353 × 82 viewBox. Compared
with the first small reference, the columns are wider, the divider is darker
and farther from the mark, the main lettering is taller, and the tagline is
lighter and narrower relative to the headline. Visible bounds were matched
for each text line rather than relying on font size alone.

Its lettering is outlined Manrope, with weights 550 (REAL ESTATE), 400 (STAFF)
and 400 (tagline), carefully spaced to the reference. The SVG needs no external
font and renders consistently in browsers and design tools. The font source
is the [official Google Fonts Manrope directory](https://github.com/google/fonts/tree/main/ofl/manrope),
licensed under the SIL Open Font License. The generated logo contains paths,
not a redistributed font file. The refined logo uses forest `#003D31` and sage
`#7D9886`; the divider uses forest with a 1.8-unit stroke. The main website
palette remains unchanged.

## Website readability adjustment

The owner subsequently clarified that the small lettering beside the building
icon looked soft and had too much space below it. The website assets deliberately
use larger visible letter heights: 23/18/12 units for REAL ESTATE, STAFF and the
tagline, with weights 600/500/500. Line gaps are tighter, secondary text is
darkened to `#476855` on the light logo, and the bottom canvas is trimmed to
80 units. The building shapes and mark color remain as in the reference.

The desktop logo is 336px wide (previously 288px), making the tagline's visible
letter height approximately 11.4px instead of 6.5px. Header padding is 10px
above/below. Mobile sizing stays flexible beside the menu button. Desktop
navigation collapses at 1180px to give the larger logo enough room, and its
dialog resize behavior uses the same threshold. The full reference artwork
is preserved in the separately named files above for client comparison.

The reusable `BrandLogo` component uses the full assets throughout the site,
with one accessible home-link label and intrinsic dimensions to reserve space.
Logo text is artwork; normal site content and controls keep their existing
readable sizes. Footer columns can shrink to accommodate the logo at 200%
text size without horizontal scrolling.

Previously generated `public/client-logo-4k.png` and
`public/client-logo-4k.trans.png` are preserved as earlier symbol-only assets.
