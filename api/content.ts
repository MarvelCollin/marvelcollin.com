const TABLES = {
  works: ['portofolio_kolin_works', 'num'],
  skills: ['portofolio_kolin_skills', 'sort'],
  experience: ['portofolio_kolin_experience', 'sort'],
  recognition: ['portofolio_kolin_recognition', 'sort'],
  education: ['portofolio_kolin_education', 'sort'],
} as const;

const TIMEOUT = 8000;
const HOUR = 3600;
const DAY = 86400;

async function rows(base: string, key: string, table: string, order: string): Promise<unknown[]> {
  const res = await fetch(`${base}/rest/v1/${table}?select=*&order=${order}.asc`, {
    headers: { apikey: key, accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new Error(`${table} ${res.status}`);
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error(`${table} malformed`);
  return data;
}

export async function GET(): Promise<Response> {
  try {
    const base = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!base || !key) throw new Error('Missing Supabase env');
    const entries = await Promise.all(
      Object.entries(TABLES).map(async ([name, [table, order]]) => [name, await rows(base, key, table, order)] as const),
    );
    return Response.json(Object.fromEntries(entries), {
      headers: {
        'cache-control': `public, max-age=300, s-maxage=${HOUR}, stale-while-revalidate=${DAY * 7}`,
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return Response.json({ error: 'Content unavailable' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}
