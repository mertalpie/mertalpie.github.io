# NEURAVOX — The Cognitive Interface

Futuristic animated Next.js demo for a fictional AI system:
**“Where Human Thought Meets Synthetic Intelligence.”**

## Component breakdown

- `app/page.tsx`
  - Cinematic hero with animated AI core orb, neural particle field, and premium glass layer styling
  - Interactive AI demo (terminal-style input, processing wave, typewriter response, animated charts)
  - Capabilities cards (hover glow, sweep, depth motion)
  - Data visualization panel (animated network graph, Three.js wireframe sphere, realtime data feed)
  - Minimal animated footer pulse/grid
- `components/Navbar.tsx`
  - Sticky navigation and section jump controls
- `app/globals.css`
  - Futuristic palette, neural grid/noise textures, custom animation keyframes

## Folder structure

- `app/` — App Router entry (`layout.tsx`, `page.tsx`, global styles)
- `components/` — shared UI and reusable interface components
- `lib/` — constants, utility helpers, and types

## Deploy

1. Install dependencies:
   - `npm ci --legacy-peer-deps`
2. Run locally:
   - `npm run dev`
3. Build production bundle:
   - `npm run build`
4. Deploy to Vercel (recommended):
   - import repository and use default Next.js build settings.
