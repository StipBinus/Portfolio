# Portfolio Project - AI Agent Instructions

## Architecture Overview
This is a Next.js 14 portfolio website with TypeScript and Tailwind CSS v4. The app follows a page-based routing structure with a timed intro animation that transitions to the main Hero component.

**Key Components:**
- `IntroAnimation.tsx` - Manages 5.5s intro sequence with fade transitions
- `Hero.tsx` - Main portfolio landing with geometric SVG decorations and inline styles
- Page structure: `pages/index.tsx` → `IntroAnimation` → `Hero`

## Styling Patterns
**Mixed Approach:** Combines Tailwind utilities with extensive inline styles for precise control.

**Typography:**
- Font stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Weights: Light (300) for headings, normal for body
- Responsive sizing: `clamp(48px, 10vw, 96px)` for headings, `clamp(16px, 2vw, 20px)` for body
- Letter spacing: `0.1em` for headings, `0.05em` for subheadings

**Color Scheme:**
- Primary: `#000000` (black text)
- Secondary: `#333333`, `#555555` (gray text)
- Background: `#ffffff` (white), `#f9fafb` (light gray)
- Accents: `#d0d0d0`, `#c0c0c0`, `#e0e0e0` (geometric decorations)

**Layout:**
- Full viewport: `minHeight: '100vh'`, `width: '100vw'`
- Absolute positioning for decorative elements (SVGs, dots, shapes)
- Grid layouts for dot patterns: `gridTemplateColumns: 'repeat(10, 1fr)'`
- Responsive spacing: `clamp(30px, 5vw, 60px)`

## Component Patterns
**State Management:** Use React hooks for animation timing in `IntroAnimation.tsx`
```tsx
const [hiVisible, setHiVisible] = useState(true)
const [hiFadingOut, setHiFadingOut] = useState(false)
// ... coordinated with setTimeout chains
```

**Animation:** CSS keyframes for fade effects, not Framer Motion
```css
@keyframes fadeIn {
  '0%': { opacity: 0, transform: 'translateY(12px)' },
  '60%': { opacity: 0.98, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
}
```

**Geometric Decorations:** Inline SVG paths and positioned divs
- S-curves: `<path d="M -20 0 Q 80 175 -20 350 Q -120 525 -20 700"/>`
- Zigzags: `<polyline points="0,30 25,10 50,30 75,10 100,30"/>`
- Diamonds: `transform: 'rotate(45deg)'`

## Development Workflow
**Scripts:** Standard Next.js commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint checking

**File Structure:**
- Components in `/components/` with `.tsx` extension
- Pages in `/pages/` following Next.js App Router conventions
- Styles in `/styles/globals.css` with Tailwind imports
- Static assets in `/public/`

## Code Conventions
- **TypeScript:** Strict mode enabled, React.FC for component types
- **Imports:** Relative paths for components (`../components/Hero`)
- **Styling:** Mix Tailwind classes with inline style objects for complex layouts
- **Naming:** PascalCase for components, camelCase for variables
- **State:** Multiple boolean states for animation phases (visible/fading/showing)

## Key Files to Reference
- `components/Hero.tsx` - Exemplifies inline styling patterns and geometric layouts
- `components/IntroAnimation.tsx` - Shows animation state management
- `tailwind.config.cjs` - Custom animations and font family extensions
- `styles/globals.css` - Tailwind setup and base styles

When adding new sections, maintain the geometric decoration style and responsive clamp() typography patterns established in `Hero.tsx`.</content>
<parameter name="filePath">c:\Users\TisGJRRR\My Projects\Portfolio\Portfolio\.github\copilot-instructions.md