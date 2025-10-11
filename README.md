# zKMem

## Unified LLM Memory — Your Blockchain Identity

**Tagline:**
Merge your digital mind with your decentralized self.

**Description:**
Experience a new layer of digital continuity — where your LLM memory becomes your blockchain identity. Every interaction, learning, and insight is cryptographically secured, portable across apps, and owned entirely by you.

No central servers. No forgotten context. Just one evolving, intelligent identity — powered by you.

**CTA:**
👉 Claim Your Decentralized Memory

## Frontend

The frontend is a Next.js app located in the `frontend/` folder. The homepage has been refactored into modular React components under `frontend/app/components/`:

- `Header.js` — top navigation and hero header
- `Hero.js` — stats section
- `HowItWorks.js` — explanation and image
- `Pricing.js` — pricing cards
- `Testimonials.js` — user testimonials
- `FAQ.js` — frequently asked questions

To run the frontend locally:

1. cd into the frontend folder
2. Install dependencies with your preferred package manager (npm or pnpm)
3. Run the dev server:

	npm run dev

Or with pnpm:

	pnpm dev

The root route (`/`) now composes the modular components to render the landing page.

