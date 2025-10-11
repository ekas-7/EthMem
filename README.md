# zKMem

## Unified LLM Memory — Your Blockchain Identity

Tagline: Merge your digital mind with your decentralized self.

Description: zKMem unlocks a new layer of digital continuity by turning a user's LLM memory into a portable, cryptographically-secured identity. Interactions, learned context, and personal insights can be carried across apps while remaining owned by the user.

Key principles:
- Private-by-design: no central servers required for identity storage
- Portable: memory can be used across compatible apps
- Verifiable: cryptographic proofs bind memory to a user identity

Call to action: Claim your decentralized memory and never lose context again.

## Frontend

The frontend is a Next.js application located in the `frontend/` folder. The landing page is composed from modular React components found at `frontend/app/components/`.

Primary components (actual filenames in the repo):
- `Connect.jsx` — wallet / identity connection UI
- `FAQ.jsx` — frequently asked questions
- `Header.jsx` — top navigation and hero header
- `HowItWorks.jsx` — explanation and illustration
- `Pricing.jsx` — pricing cards
- `Testimonials.jsx` — user testimonials

There is also a small dashboard under `frontend/app/dashboard/` with reusable components such as `Sidebar.jsx`, `DashboardHeader.jsx`, and various stat/visualization components.

## Run locally

Prerequisites: Node.js 18+ (recommended) and npm or pnpm.

1. Change into the frontend folder:

	cd frontend

2. Install dependencies:

	npm install

   or with pnpm:

	pnpm install

3. Start the development server:

	npm run dev

   or with pnpm:

	pnpm dev

4. Build for production:

	npm run build

   Serve the production build:

	npm start

Notes:
- The root route (`/`) composes the modular components above to render the landing page.
- If you see any runtime or build errors, ensure your Node.js version meets the prerequisite and that dependencies installed without errors.

## Contributing

Small contributions (typos, docs, UI tweaks) are welcome. Open a PR with a short description of the change.

## File map / useful paths

- `frontend/app/` — Next.js app directory
- `frontend/app/components/` — landing page components
- `frontend/app/dashboard/` — dashboard pages and components

---

If you'd like, I can also:
- add a short CONTRIBUTING.md
- add a project-level `package.json` script to run the frontend from the repo root
- add a brief development checklist for contributors

Updated README: corrected truncated text, fixed component filenames to `.jsx`, and added clearer run/build instructions.

