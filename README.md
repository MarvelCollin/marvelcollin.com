# marvelcollin.com

Personal site and portfolio. React 19 and TypeScript on Vite, styled with Tailwind v4, with all content served from Supabase and edited through a built in admin panel.

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

Nothing on the site is hardcoded. Five tables back the public pages, mapped in `src/lib/supabase.ts`:

| Table | Feeds |
| --- | --- |
| `portofolio_kolin_works` | Projects, the work grid and each project page |
| `portofolio_kolin_skills` | Skills on the about page |
| `portofolio_kolin_experience` | Experience timeline |
| `portofolio_kolin_recognition` | Awards and recognition |
| `portofolio_kolin_education` | Education timeline |

Images live in the `portofolio-kolin-media` Storage bucket. `src/lib/storage.ts` handles upload and public URL resolution; screenshots committed under `public/shots/` are served directly instead.

Reads go through the anon key and are safe to expose. Writes are gated by row level security, so the admin panel signs in first and the seed script needs a service role key.

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

Writing needs `SUPABASE_SERVICE_ROLE_KEY` in `.env`, or `ADMIN_PASSWORD` alongside the anon key so the script can sign in as the admin user. Row level security rejects the anon key on its own.

`scripts/db.mjs` is separate and runs raw SQL from `supabase/migrations/` and `supabase/seed.sql` over a direct connection. It needs `SUPABASE_DB_URL`, the session pooler URI from Project Settings then Database. That directory is gitignored, so a fresh clone cannot run it until those files exist.

## Layout

```
src/
  pages/          home, work, about, research, project-detail, admin/
  components/     gallery, lightbox, project-card, skill-balls, ...
  content/        content provider and hooks over the Supabase tables
  lib/
    api/          per table read and write helpers
    supabase.ts   client and table name map
    storage.ts    image upload to the media bucket
    auth.ts       admin session handling
  Interface/      row and view model types
scripts/          seeding and migration runners
public/shots/     committed project screenshots
```

## Deploying

Vercel builds with `npm run build` and serves `dist/`. Every route rewrites to `index.html` so client side routing works on refresh. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project for both Production and Preview, then redeploy so the build picks them up.
