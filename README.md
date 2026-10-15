# Mufraj Ahmed Khan — Portfolio

Personal portfolio for Mufraj Ahmed Khan, Software Engineer Intern building Shopify storefronts for Razab Inc. and 2D puzzle games live on the App Store.

**Live site:** https://mufraj-portfolio.vercel.app

A hand-built static site: plain HTML, CSS and JavaScript, with no framework and no build step. Vercel deploys it straight from this repo.

---

## Run it locally

From the project folder:

```
python -m http.server 8000
```

Then open http://localhost:8000. Press `Ctrl+C` to stop.

(`npx serve .` works too. Opening `index.html` directly mostly works, but the "Download CV" buttons only behave properly through a server.)

---

## What's in the repo

```
index.html        All page content and structure (edit text here)
style.css         Design tokens, layout, light and dark themes
script.js         Interactivity (tile board, filters, menu, theme, etc.)
resume.pdf        The CV behind every "Download CV" button
images/
  mufraj.jpg/.webp        Headshot (hero and About)
  razab-after.jpg/.webp   Razab storefront screenshot
  og-image.png            Link preview image (LinkedIn, WhatsApp, etc.)
  apple-touch-icon.png    Home-screen icon
```

---

## Design

**Idea:** I build grid-based puzzle games, so the site borrows that world. An interactive 5×5 tile board is the signature element, set on a warm, editorial page.

**Colours:** warm paper (`#F4EFE6`) and deep warm ink (`#211E19`), plus four game colours:

| Tomato | Butter | Sky | Mint |
|---|---|---|---|
| `#E5533A` | `#F2C14E` | `#5A8BEA` | `#3DAE84` |

The site opens in **dark mode** (warm charcoal) for everyone. A switch in the header turns on light mode and remembers the choice. On a first visit, a small yellow hint points at the switch once.

**Fonts** (Google Fonts):
- **Syne** (bold 700) for display type: the name, section titles, big numbers, the email and the logo. The extra-wide 800 weight is used once, for the outlined wordmark in the footer.
- **Instrument Serif italic** for accent words ("Selected *work*", "Let's *talk*") and small italic details like dates.
- **Geist** for body text and semi-bold card titles.

Fallback font metrics are tuned so the layout doesn't jump while the fonts load.

---

## What's on the page

1. **Header:** a floating pill with the tile logo, navigation that highlights the section you're in, the light/dark switch and Download CV. On phones the links open in a "Menu" card.
2. **Hero:**
   - The name in large type, an "Open to work" status, highlighted key phrases and three stats that count up on load.
   - A portrait card with colourful tiles fanned out behind it, a rotating "Open to work" badge and two floating chips.
3. **Marquee:** a tilted band of tools that scrolls slowly and pauses on hover.
4. **Right now:** the two current roles.
6. **Selected work,** filterable by All, Web, Games, or Software and AI:
   - **Razab Inc.:** the featured project, with the real storefront screenshot in a browser frame and a "Live on Shopify" sticker.
   - **The Boring Hangers:** in progress, with an illustrated stand-in until a screenshot is added.
   - **Games:** four featured games in tilted phone frames, each with "View on App Store" and "Request APK". Five more sit in a "5 more games" drop-down, plus the personal games.
   - **Software and AI:** six project cards with tech tags. GitHub links where public, "Private project" with "Ask for a walkthrough" where not.
6. **Play my grid (tile board, right after the hero):**
   - Tap a tile to flip it. It lights up in rotating colours and sends a pulse to its neighbours.
   - A counter shows how many tiles are lit, and lighting all 25 reveals a hidden message.
   - Works with mouse, touch and keyboard (arrow keys).
7. **Experience:** a timeline of four role cards, with the current ones marked.
8. **About:** the headshot as a taped polaroid, a bio, "at a glance" cards, a toolbox of six skill cards and three education cards.
9. **Certifications:** nine cards.
10. **Contact:** a dark closing band with a large email link, a "Copy email" button, a green WhatsApp button (+92 336 1185662), LinkedIn, GitHub and the CV.
11. **Footer:**
    - The logo, a short line about you and a live Karachi clock.
    - "Explore" and "Get in touch" columns (email, WhatsApp, LinkedIn, GitHub).
    - A large outlined "Mufraj Khan" wordmark and a "Back to top" button.

**Cards and motion:**
- Projects, games, experience, personal games and certificates are all cards. On hover a card lifts, gets a soft shadow, and a glow in its accent colour follows the cursor.
- The hero animates in on load, and sections rise into view as you scroll.
- All motion switches off for visitors who turn on "reduce motion".

---

## Quality

Checked in headless Chrome at 320, 360, 768, 1280 and 1600px, in light and dark:

- No sideways scrolling on any screen size.
- No JavaScript errors.
- Works with JavaScript turned off (everything stays readable).
- Respects "reduce motion": no flips, pulses or scrolling animations.
- Accessibility:
  - Skip link and visible focus rings.
  - Labelled buttons and 44px tap targets on mobile.
  - Screen-reader text on repeated links and "(opens in new tab)" on external links.
- SEO and sharing: title, description, canonical URL, Open Graph and Twitter preview image, and `Person` structured data.

Lighthouse hasn't been run yet. Run it on the live Vercel URL after deploying.

---

## How to update things

**Text:** edit it directly in `index.html`. All content lives in the HTML.

**The CV:** replace `resume.pdf` and keep the same filename.

**Placeholders still to fill:** search `index.html` for `TODO`.
- `AMAZON_STORE_URL`: The Boring Hangers Amazon link. The button stays hidden until its `href=""` is filled in.
- `CERT_URL_1` to `CERT_URL_9`: certificate links. Each "Verify" link stays hidden until its `href=""` is filled in.

**Screenshots still to add:** drop these into `images/`. Until then, each one shows an illustrated stand-in, never a broken image.

| File | What | Size |
|---|---|---|
| `images/boring-hangers.jpg` | The Boring Hangers site | ~1600×1000 |
| `images/games/chroma-seal.jpg` | Game screenshot | portrait, ~1170×2532 |
| `images/games/pulse-architect.jpg` | Game screenshot | portrait |
| `images/games/guard-the-bubble.jpg` | Game screenshot | portrait |
| `images/games/smart-step-quest.jpg` | Game screenshot | portrait |
| `images/razab-before.jpg` *(optional)* | The old Razab site | same size as `razab-after.jpg` |

Adding `razab-before.jpg` turns on a draggable before/after slider on the Razab screenshot.

---

## Changelog

**October 2026: full rebuild**
- Replaced the old template site (Font Awesome icons, dark "gold" theme) with a hand-built site.
- First pass followed the original brief: a muted green-grey palette with Bricolage Grotesque and Instrument Sans.
- Redesign: warm paper and ink colours with four game colours, the Fraunces and Geist fonts, illustrated browser and phone mockups, a polaroid About photo, certification cards and a dark contact band.
- Added the new professional headshot, used in the hero, About and the link preview.
- Added the real Razab storefront screenshot and made Razab a full-width featured case study.
- Added the rotating "Open to work" badge, the tool marquee and the tile counter.
- Generated a new link preview image and home-screen icon to match.
- Replaced the photo-in-the-name with a portrait card in the hero, and moved the tile board into its own "Take a break" section.
- Turned projects, games, experience and certificates into cards with hover lift and a cursor-following glow.
- Added the hero entrance animation, count-up stats and scroll-reveal for sections.
- Replaced `resume.pdf` with the latest CV and pulled its details into the site: experience bullets, game descriptions, projects, the full skills list and education.
- Hero: new intro line, LinkedIn and GitHub buttons, and four stat cards (15+ games, 9 on the App Store, 4 roles, 3.72 CGPA). On phones the portrait now comes first, so the photo and name share the first screen.
- Moved the tile board ("Play my grid") up to sit right after the hero.
- Rebuilt About: a new bio, "at a glance" cards, a six-card toolbox of skills and three education cards.
- Mobile polish: a swipeable filter row, bigger board tiles on small phones, and tighter hero spacing.
- Gave the CRM and backend work proper weight: the hero now highlights full-stack Shopify, puzzle games and CRM automations, and mentions Java and Node.js backends. The portrait has four skill chips, which float on desktop and sit in a row under the photo on phones.
- Switched to a more premium type pairing: Instrument Serif for display type and Geist for card titles and body.
- Switched again to bold type: Syne for display, Instrument Serif italic for accents and Geist for body.
- The site now opens in dark mode, with a light/dark switch and a one-time hint pointing at it. The header became a floating pill.
- Added WhatsApp (+92 336 1185662) to the hero, contact section, footer and structured data, and built a full footer.
- Added Bitrix24 CRM automation and Versale Laga cards to the work section (now "Software, AI and CRM"), and added Java and Bitrix24 to the toolbox and marquee.

---

© 2026 Mufraj Ahmed Khan. Built by hand, deployed on Vercel.
