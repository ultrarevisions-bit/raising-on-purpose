# Raising On Purpose

Honest motherhood. Purposeful parenting. No highlight reel.

A Pinterest-style blog built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Designed for fast static pages, clean SEO, and Pinterest-referral traffic.

## Quick start

```bash
git clone <your-repo-url> && cd raising-on-purpose
npm install
npm run dev
```

Open http://localhost:3000.

## Tech stack

- **Next.js 15** (App Router, static generation)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 3.4** (custom terracotta/cream theme)
- **MDX** content in `/content/posts`
- **Vercel Analytics** (opt-in via env)
- **Google Fonts**: Cormorant Garamond (headings), DM Sans (body)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Generate search index + production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | Next.js lint |
| `npm run assets:pdfs` | Regenerate printable PDFs |
| `npm run assets:images` | Regenerate cover images (Windows only, uses System.Drawing) |

## Project structure

```
raising-on-purpose/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (fonts, nav, footer)
│   ├── page.tsx              # Home page
│   ├── blog/page.tsx         # Blog index
│   ├── [category]/page.tsx   # Category pages
│   ├── [category]/[slug]/    # Individual posts
│   ├── about/                # About page
│   ├── contact/              # Contact form
│   ├── privacy-policy/
│   ├── cookie-policy/
│   ├── disclosure/
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # Auto-generated robots.txt
│   └── rss.xml/route.ts      # RSS feed
├── components/               # Shared React components
├── content/posts/            # MDX blog posts
├── lib/                      # Utilities, types, data helpers
├── public/                   # Static assets (images, PDFs)
├── scripts/                  # Asset generation scripts
└── tailwind.config.ts        # Theme & design tokens
```

## Adding a new post

1. Create a new `.mdx` file in `content/posts/`:

```yaml
---
title: "Your Post Title Here"
description: "17-20 word meta description with your focus keyword."
featuredImage: "/images/posts/your-image.png"
category: "intentional-parenting"  # or real-talk, toddler, family-routines, printables
date: "2026-09-15"
excerpt: "Short excerpt shown on cards."
keywords: ["keyword one", "keyword two"]
---
```

2. Write your content below the frontmatter.
3. Add a matching cover image to `public/images/posts/`.
4. Commit and push. Vercel builds automatically.

### Post frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title (also used as Pinterest pin headline) |
| `description` | Yes | Meta description, 17-20 words, include focus keyword |
| `featuredImage` | Yes | Path to cover image in `/public` |
| `category` | Yes | One of: `intentional-parenting`, `real-talk`, `toddler`, `family-routines`, `printables` |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `excerpt` | Yes | 1-2 sentence summary for cards and search |
| `stage` | No | Age tag: `toddler`, `preschool`, or `elementary` |
| `updated` | No | Last-updated date (shown to readers) |
| `keywords` | No | Array of focus keywords |
| `download` | No | Path to downloadable PDF in `/public` |
| `downloadTitle` | No | Label shown on the download card |
| `featured` | No | `true` to feature on homepage hero |

### Available MDX components

Use these in any post:

```mdx
<Callout>Important note goes here.</Callout>

<DownloadCta title="Free printable chart" href="/downloads/chart.pdf" />
```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Go to vercel.com > Import Git Repository.
3. Select the repo. Framework: Next.js is auto-detected.
4. Add environment variable `SITE_URL` = `https://your-domain.vercel.app`
5. Deploy. Every push to `main` triggers auto-deploy.

### Custom domain

After deployment on Vercel, go to Settings > Domains and add your custom domain. Update `SITE_URL` in your `.env.local` and Vercel environment variables.

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_URL` | Yes | Production URL (used in sitemap, OG tags, canonical URLs) |
| `MAILERLITE_FORM_ACTION` | No | MailerLite embedded form action URL for newsletter |
| `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` | No | Set to `true` to enable Vercel Analytics |

## SEO features

- Auto-generated `sitemap.xml` with all pages and posts
- Auto-generated `robots.txt`
- Schema.org `BlogPosting` JSON-LD on every post
- Schema.org `BreadcrumbList` structured data
- Open Graph + Twitter Card meta tags from post frontmatter
- Canonical URLs on every page
- RSS feed at `/rss.xml`
- Static HTML (no client-side-only rendering) for all content
- Clean semantic HTML with skip-to-content link
- Mobile-first responsive design
- Next.js Image optimization (WebP, lazy-loaded)

## Pinterest features

- 2:3 ratio cover images (1200x1800) for every post
- Pinterest save overlay on hover over post cards
- Pin buttons on every post with pre-filled pin data
- Strong visual hierarchy with hero images
- OG image tags sized for Pinterest sharing

## Newsletter

The newsletter component (`components/newsletter-signup.tsx`) is wired and ready:

1. Create a MailerLite account and get your embedded form action URL.
2. Set `MAILERLITE_FORM_ACTION` in `.env.local`.
3. The form POSTs directly to MailerLite. Until configured, it shows a friendly success state.

## Monetization hooks (activate later)

- **Ad slots**: `AdSlot` components placed in post layout, ready for Mediavine/AdThrive/AdSense embeds
- **Affiliate links**: `AffiliateDisclosure` component renders a disclosure note
- **Printables**: Download cards ready for future premium bundles
- **Product pages**: Route template ready to extend with a `/shop` section

## License

Content copyright Raising On Purpose. Code is provided for the purpose of running this blog.
