const WORKS = 'portofolio_kolin_works';
const REPO = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i;
const TIMEOUT = 8000;
const DAY = 86400;

interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
}

interface GitHubRepo {
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
}

type Stats = Record<string, RepoStats>;

const HEADERS: Record<string, string> = {
  accept: 'application/vnd.github+json',
  'user-agent': 'marvelcollin.com',
  'x-github-api-version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

function slug(url: string | null): string | null {
  const m = url?.trim().match(REPO);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
}

function entry(r: GitHubRepo): [string, RepoStats] {
  return [r.full_name.toLowerCase(), { stars: r.stargazers_count, forks: r.forks_count, language: r.language, pushedAt: r.pushed_at }];
}

async function github<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${path}`, { headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
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

async function collect(list: string[]): Promise<Stats> {
  const q = [...list.map((r) => `repo:${r}`), 'fork:true'].join(' ');
  const found = await github<{ items?: GitHubRepo[] }>(`/search/repositories?per_page=100&q=${encodeURIComponent(q)}`);
  const stats: Stats = Object.fromEntries((found?.items ?? []).map(entry));
  const missing = list.filter((r) => !stats[r]);
  const rest = await Promise.all(missing.map((r) => github<GitHubRepo>(`/repos/${r}`)));
  return Object.assign(stats, Object.fromEntries(rest.filter((r) => r !== null).map(entry)));
}

export async function GET(): Promise<Response> {
  try {
    const list = await repos();
    const stats = await collect(list);
    const got = Object.keys(stats).length;
    if (list.length && !got) throw new Error('GitHub unavailable');
    const ttl = got >= list.length ? DAY : DAY / 24;
    return Response.json(stats, {
      headers: { 'cache-control': `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=${DAY * 7}` },
    });
  } catch {
    return Response.json({}, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}
