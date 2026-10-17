# MINSO.AI home page redesign: prompt for Antigravity

How to use this:
1. Open your MINSO repo in Antigravity. Put these files inside the repo in a `design/` folder: `minso-home-standalone.html` (opens in any browser and looks exactly like the design), `minso-home-design.html` (the original design source), `icon.svg`, and the `screenshots/` folder.
2. Start a new task in Planning mode and paste the prompt below. Let it write its plan first, read the plan, then approve it.
3. When it finishes, review the diff and run the site locally before you merge.

---

## Prompt (copy everything below)

You are redoing the **home page only** of my Next.js app (MINSO.AI, mining-law AI agents, deployed on Vercel). A finished visual design is in `design/`, and the new logo/favicon is `design/icon.svg`. Your job is to rebuild the design faithfully in my real codebase, with the same colours, fonts, layout and animations.

### The visual reference (open this first)
- `design/minso-home-standalone.html` is a fully working, plain-HTML version of the design. Open it in your browser and look at it. It is the source of truth for how the page must look. Its colours, fonts, spacing and SVG scenes are all written out in the file. The two demo buttons in the chat window work.
- `design/screenshots/desktop-1440-full.png`, `mobile-390-part1.png` and `mobile-390-part2.png` (top and bottom halves of the mobile page) and `demo-outside-docs.png` show the expected result at 1440px and 390px. The screenshots were taken with animation paused, so the two mine scenes show one still frame.
- When you finish, open your running Next.js page next to `minso-home-standalone.html` at the same widths and fix any difference in colour, spacing, font or layout.

### Step 0: understand the repo first (do not skip)
- Inspect the project: Next.js version, App Router or Pages, how styling is done (Tailwind, CSS modules, globals.css), existing fonts, existing components, and the current home page.
- Write a short plan listing the files you will create or change, then wait for my approval before editing.
- Create a new git branch (`redesign/home`) and work there.

### Scope
- Change ONLY the home page (`/`), its components and global styling it needs, plus the favicon.
- Do NOT touch `/agents/*`, `/admin`, API routes, data fetching, auth or any backend logic.
- Keep all existing links working: the Rajasthan agent card links to `/agents/rajasthan-mining-law`, and the footer "System console" links to `/admin`.

### How to read the design files
- Work from `minso-home-standalone.html`. It is plain HTML, CSS and a few lines of JavaScript, so you can copy the markup, the SVG scenes and the CSS animations straight out of it.
- `minso-home-design.html` is the original design-tool export. It will not preview correctly in a browser (it has `{{ }}` placeholders, `<sc-if>`, `<sc-for>`). Use it only to see the three theme defaults at the bottom, if you need them.
- The theme tokens are: accent `#FF7A3D`, accent-2 `#FF3D81`, background `#07080B`. In the standalone file they appear as `--a`, `--b` and `--bg` on the page's outer wrapper. Turn them into CSS variables (`--accent`, `--accent-2`, `--bg`) so I can retheme in one place.
- Copy every inline style value into real classes or CSS (Tailwind or CSS modules, whichever the repo already uses). Do not leave huge inline style blobs.

### Page structure (in this order)
1. Floating glass nav: miner-head logo (from `icon.svg`, inline) + "MINSO.AI" wordmark, links Documents / Agents / Why MINSO, and a "Choose an agent" button.
2. Hero: a dark animated 3D open-pit mine (SVG: stepped benches, haul roads, trucks moving along them, excavator, dust, blast flash, floodlights, slow camera drift) behind a square grid, then the headline "Ask the mining paperwork." with the live "Now reading…" rotating pill, the two buttons, and the interactive demo window below.
3. Demo window (client component): two selectable inquiries. One shows the cited answer about Section 21 of the MMDR Act (use the real text already in the design). The other is an "outside the documents" question that shows "I couldn't find this in the loaded documents, so I won't guess." Keep it as a small `'use client'` component only; everything else stays a server component.
4. "Acts, rules and circulars, ready for you." paper-trail section: three tilted paper cards with VERIFIED stamps that lift on hover, plus the four floating line-art icons (scales, hard hat, haul truck, pickaxe-style icon as in the design).
5. Agents section: the Rajasthan Mining Legal Assistant as the featured "Available" card, then Mining Safety, Mining Operations and Mining Documentation as "Coming soon" cards.
6. "Why industrial teams rely on MINSO.AI" bento grid with four cards (zero-hallucination, page-accurate grounding, isolated agent sandboxes, sub-second lookup).
7. Closing call to action on a night haul-road scene (SVG: dump truck driving along a road, shaft headframe with a moving cage, crusher, conveyor, stockpile).
8. Footer.

Removed on purpose, do NOT add them back: the document-name marquee, the "The rule" statement, the "Explore the mine" section, and the ingest/chunking pipeline section.

### Requirements
- Fonts via `next/font/google`: Bricolage Grotesque (headings), Instrument Serif italic (accent words), Hanken Grotesk (body), JetBrains Mono (labels). No `<link>` tags to Google Fonts.
- All animation in CSS and SVG (no animation libraries). Wrap motion in `@media (prefers-reduced-motion: reduce)` so it switches off.
- Responsive: must look right at 390px, 768px and 1440px, no horizontal scroll, touch targets 44px or larger.
- Accessibility: real `<button>` and `<a>` elements, decorative SVGs `aria-hidden="true"`, text contrast 4.5:1 or better, visible focus rings.
- Performance: no new heavy dependencies. Keep the scenes as inline SVG components (`HeroPit`, `HaulRoadScene`) in their own files.
- Keep the page copy exactly as in the design.

### Favicon and logo
- Place `design/icon.svg` at `app/icon.svg` (Next.js App Router picks it up automatically). If there is an existing `app/favicon.ico` or a `favicon` set in `metadata.icons`, remove it so the miner-head SVG is what shows in the browser tab.
- Use the same miner head inline as the nav logo. Also set `metadata.title` to "MINSO.AI – Mining Agents" and keep the existing meta description.

### Done means
- `npm run build` and `npm run lint` pass with no new warnings.
- You ran the dev server and compared the home page against `design/minso-home-standalone.html` at 390, 768 and 1440 widths, and the browser tab shows the miner-head icon.
- Give me a short summary of files changed, and anything you could not match from the design.
