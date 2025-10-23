
# UI Dev Instructions

This document describes how the assistant (the implementer) should convert the user's visual designs into a working, accessible, and performant portfolio website. The user's designs are the source of truth — the assistant's role is to implement them faithfully, efficiently, and with good engineering practices.

## Primary responsibilities

- Implement the user's visual designs into a real website (static or framework-based) using semantic HTML, modular CSS, and minimal JavaScript.
- Keep the design fidelity: spacing, typography, colors, and layout should reflect the provided assets and design tokens.
- Ensure responsiveness across common device widths and accessibility (WCAG AA goals where practical).
- Produce a runnable repository with clear README, build scripts, and deployment instructions.

## Constraints and priorities

1. The user provides designs, assets, and final visual decisions. Do not change or reinterpret the design unless the user asks.
2. If technical trade-offs are required (performance, accessibility, responsiveness), propose small, concrete alternatives and seek approval.
3. Prefer small, incremental commits and feature branches for each major unit (layout, header, hero, projects grid, contact form, etc.).

## Inputs the assistant expects from the user

- Design files: Figma link (preferred), or exported artboards (PNG, JPG, PDF, or SVG). Provide exact frames/pages for each site screen.
- Assets: SVG icons, PNG/JPG images, fonts (woff2/woff) and font-license info, and any animated assets. Put them in a single zip or a shared link.
- Design tokens (optional but helpful): color hexes, font sizes/line heights, spacing scale, breakpoints.
- Content copy: headings, body text, project descriptions, links. If not provided, use realistic placeholder content and mark where real content should be placed.

When asking for assets, request filenames and a short JSON or plain list describing what each file is (e.g., "hero-bg.jpg — 1920x1080 background for hero section").

Acceptable formats and naming conventions

- Images: .svg for icons and illustrations, .webp or .jpg/.png for photos. Prefer .webp for web delivery.
- Fonts: .woff2 primary, .woff fallback. Include license text if not a standard web font.
- Filenames: kebab-case, descriptive, grouped by area: assets/hero/hero-bg.webp, assets/projects/project-foo.webp, icons/chev-down.svg

## Recommended stacks and default assumption

Ask the user which stack they prefer. If they don't specify, default to a lightweight React + Vite or plain static HTML/CSS project depending on their needs:

- Minimal static site: index.html + CSS (useable when no dynamic needs).
- Component-based: React with Vite or Next.js if the user wants future expandability (routing, CMS, SSR). Use TypeScript if the repo already uses it or the user prefers strong typing.

State the chosen stack explicitly before implementing.

## Implementation process (step-by-step)

1. Project scaffold
	- Create a minimal, runnable repo with build scripts. Add a README describing how to run, build, and deploy.
2. Global styles & tokens
	- Add CSS reset, color tokens, type scale, spacing tokens, and responsive breakpoints.
3. Layout & core components
	- Implement header, footer, container system, and grid utilities.
4. Pages & sections
	- Convert each design frame into a page or section component. Implement layout, spacing, and responsive rules.
5. Images & assets
	- Optimize images and use responsive srcset. Use SVGs for icons and inline where appropriate.
6. Interactions
	- Add only the interactions shown in the design (menu toggles, scroll reveals, simple animations). Keep JS minimal and progressive.
7. Accessibility
	- Ensure semantic markup, keyboard navigation, visible focus states, alt attributes, and ARIA only when necessary.
8. Testing & optimization
	- Run a Lighthouse check, basic accessibility audit (axe or lighthouse), and fix obvious issues.
9. Preview deploy
	- Create a preview build and deploy to a free preview host (Vercel/Netlify) or provide instructions for the user to deploy.

## Deliverables

- A runnable repository containing:
  - Source code for the site (components, styles, assets)
  - README with run/build/deploy instructions and where to replace content/assets
  - Minimal CI (GitHub Actions) that builds and runs lint/tests and provides preview deploys (optional but recommended)
  - A simple PR that contains the implemented feature and a preview link if possible
- A short change log: what was implemented and any deviations or trade-offs made.

## Verification and acceptance criteria

The implementation should meet the following before marking a task done:

- Visual fidelity: Major layout, spacing, and typographic relationships match the provided design (pixel-perfect is not required but should be very close).
- Responsiveness: Pages adapt across these breakpoints: mobile (<=640px), tablet (641–1024px), desktop (>=1025px). Ensure no horizontal scroll and usable tap targets.
- Accessibility: All images have alt text, header navigation is keyboard operable, color contrast meets AA for body text, focus states visible.
- Performance: Lighthouse performance score >= 60 on desktop for initial pass and image optimization in place.
- Code quality: No obvious console errors, semantic HTML, and components are modular and reusable.

Verification steps the assistant should perform locally

1. Run the dev server and visually compare pages with design frames.
2. Run a Lighthouse audit (desktop/mobile) and record scores.
3. Run a quick accessibility check (axe-core or lighthouse accessibility audit) and document major issues.
4. Provide a preview deployment link for the user to review.

## Communication rules

- If assets or clarity are missing, ask concise questions and list exactly what's required (filename, resolution, format).
- When proposing changes (e.g., to improve accessibility or performance), give a short rationale and the minimal code change required.
- Keep the user updated with a preview link and a short summary of what changed in each PR.

## Git workflow and PR checklist

- Work on short-lived feature branches named feature/<short-desc> or fix/<short-desc>.
- Commits should be small and descriptive. Use present-tense imperative style ("Add header component").
- PR checklist for each visual/feature PR:
  - [ ] Runs and builds locally
  - [ ] Lint/typecheck (if applicable) passes
  - [ ] Basic accessibility checks run and issues documented
  - [ ] Preview link attached
  - [ ] Short description of deviations (if any)

## Tests and CI (minimal)

- Add minimal automated checks: a build step, linting (ESLint or stylelint), and a smoke test that verifies the dev server starts or the build completes.
- In CI, run the build and, if possible, publish a preview artifact or deploy preview.

## Small improvements assistant should proactively add (low-risk)

- Image optimization and responsive images (srcset)
- Meta tags for basic SEO (title, description, social preview)
- A11y-friendly skip-link and focus styles
- Light performance tuning: preconnect to font/CDN and inline small critical CSS if appropriate

## Follow-ups and handover

- Provide a short maintenance guide explaining where to change content, how to add new projects, and how to update assets.
- Suggest next improvements the user may want (CMS integration, analytics, more tests, deeper accessibility work).

---

If anything in the above is unclear or you want different defaults (for example: prefer plain HTML over React, or Tailwind vs vanilla CSS), tell me which defaults to change before I start implementing.
