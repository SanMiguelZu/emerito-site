# emerito.co

Website for **Emerito** — a behavior-change studio based in Medellín, Colombia.

Built with Astro, Tailwind CSS, MDX, and deployed on Cloudflare Pages.

## Stack

- **Framework:** Astro (latest stable) with built-in i18n
- **Styling:** Tailwind CSS v4
- **Content:** Markdown / MDX in-repo (no CMS)
- **Contact form:** Resend API via Astro server endpoint
- **Hosting:** Cloudflare Pages
- **Domain:** emerito.co

## Languages

- Spanish (default, no URL prefix): `/`, `/metodologia`, `/casos`, etc.
- English (under `/en/`): `/en/`, `/en/methodology`, `/en/case-studies`, etc.

## Getting started

```sh
# Install dependencies
npm install

# Start dev server at localhost:4321
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Environment variables

Copy `.env.example` to `.env` and fill in your values before running the contact form locally.

```sh
RESEND_API_KEY=re_...
CONTACT_EMAIL=hola@emerito.co
```

## Project structure

```
src/
├── components/        # Shared UI (Nav, Footer, CaseCard, etc.)
├── content/
│   ├── blog/          # Insights posts (.md / .mdx)
│   └── cases/         # Case study data (.md / .mdx)
├── layouts/
│   └── BaseLayout.astro
├── pages/             # Spanish routes (default locale)
│   ├── casos/
│   ├── en/            # English routes
│   └── insights/
└── styles/
    └── global.css     # Tailwind + design tokens
public/                # Static assets (images, favicon)
```

## Build status

- Step 1 — Scaffold: complete
- Step 2 — Global layout & design system: pending
- Step 3 — Page content: pending
- Step 4 — Contact form (Resend): pending
- Step 5 — SEO & sitemap: pending
- Step 6 — Cloudflare Pages: pending
