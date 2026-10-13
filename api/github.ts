const WORKS = 'portofolio_kolin_works';
const REPO = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i;
const TIMEOUT = 8000;

interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
}

function slug(url: string | null): string | null {
  const m = url?.trim().match(REPO);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
}

async function repos(): Promise<string[]> {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error('Missing Supabase env');
  const res = await fetch(`${base}/rest/v1/${WORKS}?select=repo&repo=not.is.null`, {
    headers: { apikey: key },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new Error(`works ${res.status}`);
  const rows = (await res.json()) as { repo: string | null }[];
  return [...new Set(rows.map((r) => slug(r.repo)).filter((s): s is string => s !== null))];
}

async function stats(repo: string): Promise<[string, RepoStats] | null> {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'marvelcollin.com',
    'x-github-api-version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(TIMEOUT) });
    if (!res.ok) return null;
    const r = (await res.json()) as { stargazers_count: number; forks_count: number; language: string | null; pushed_at: string };
    return [repo, { stars: r.stargazers_count, forks: r.forks_count, language: r.language, pushedAt: r.pushed_at }];
  } catch {
    return null;
  }
}

export async function GET(): Promise<Response> {
  try {
    const list = await repos();
    const found = (await Promise.all(list.map(stats))).filter((s) => s !== null);
    if (list.length && !found.length) throw new Error('GitHub unavailable');
    const ttl = found.length === list.length ? 3600 : 300;
    return Response.json(Object.fromEntries(found), {
      headers: { 'cache-control': `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=86400` },
    });
  } catch {
    return Response.json({}, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}
