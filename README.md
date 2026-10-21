# marvelcollin.com

Personal site and portfolio. React 19 and TypeScript on Vite, styled with Tailwind v4, with all content stored in Supabase and served through one edge cached endpoint.

Live at [marvelcollin.com](https://marvelcollin.com).

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Content | Supabase (Postgres + Storage) |
| Physics | matter-js, for the skill balls on the about page |
| Icons | react-icons |
| Hosting | Vercel, SPA rewrites in `vercel.json` |

## Content model

Nothing on the site is hardcoded. Five tables back the public pages, read by `api/content.ts`:

| Table | Feeds |
| --- | --- |
| `portofolio_kolin_works` | Projects, the work grid and each project page |
| `portofolio_kolin_skills` | Skills on the about page |
| `portofolio_kolin_experience` | Experience timeline |
| `portofolio_kolin_recognition` | Awards and recognition |
| `portofolio_kolin_education` | Education timeline |

Images live in the `portofolio-kolin-media` Storage bucket, and screenshots committed under `public/shots/` are served directly.

The browser never talks to Supabase. `api/content.ts` reads the five tables with the anon key and returns them as one JSON document with `s-maxage=3600` and a week of `stale-while-revalidate`, so Supabase is hit about once an hour per region no matter the traffic. A change to the data shows up within the hour, or at once after a redeploy. There is no admin panel. Rows are inserted with the seed script below.

## Running locally

```bash
npm install
npm run dev
```

Create a `.env` with:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Both are readable from Supabase under Project Settings then API. The app throws a descriptive error at startup if either is missing.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck with `tsc -b`, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run works:seed` | Upsert projects from `scripts/works-data.mjs` |
| `npm run db:setup` | Run migrations then seed via `scripts/db.mjs` |
| `npm run db:migrate` | Migrations only |
| `npm run db:seed` | Seed only |

### Seeding projects

`scripts/works-data.mjs` holds the project rows. `scripts/works-seed.mjs` inserts anything whose `slug` is missing and, for rows that already exist, fills only the fields that are currently empty. It never overwrites populated data, so re-running is safe.

Preview without writing:

```bash
node scripts/works-seed.mjs --dry-run
```

Writing needs `SUPABASE_SERVICE_ROLE_KEY` in `.env`. Row level security rejects the anon key on its own.

`scripts/db.mjs` is separate and runs raw SQL from `supabase/migrations/` and `supabase/seed.sql` over a direct connection. It needs `SUPABASE_DB_URL`, the session pooler URI from Project Settings then Database. That directory is gitignored, so a fresh clone cannot run it until those files exist.

## Layout

```
src/
  pages/          the story page and its chapters
  components/     gallery, lightbox, project-card, skill-balls, ...
  content/        content provider and hooks
  lib/
    api/          content loader and row mappers
  Interface/      row and view model types
scripts/          seeding and migration runners
public/shots/     committed project screenshots
```

## Deploying

Vercel builds with `npm run build` and serves `dist/`. Every route rewrites to `index.html` so client side routing works on refresh. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project for both Production and Preview. Only the `api/` functions read them, so they never reach the browser bundle. `vercel.json` sets long lived cache headers on static assets and a Content Security Policy on the page.
