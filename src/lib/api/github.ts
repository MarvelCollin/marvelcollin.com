export interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
}

type Stats = Record<string, RepoStats>;

const REPO = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i;
const KEY = 'gh-stats';
const TTL = 60 * 60 * 1000;

function restore(): { at: number; data: Stats } {
  const empty = { at: 0, data: {} };
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return typeof v?.at === 'number' && v.data && typeof v.data === 'object' ? v : empty;
  } catch {
    return empty;
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data: snapshot }));
    return true;
  } catch {
    return false;
  }
}

const saved = restore();
const fresh = Date.now() - saved.at < TTL;
const listeners = new Set<() => void>();
const direct = new Set<string>();
let snapshot: Stats = saved.data;
let fromApi: Promise<boolean> | null = null;

function publish(next: Stats) {
  snapshot = { ...snapshot, ...next };
  persist();
  listeners.forEach((l) => l());
}

async function loadApi(): Promise<boolean> {
  try {
    const res = await fetch('/api/github');
    if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return false;
    publish(await res.json());
    return true;
  } catch {
    return false;
  }
}

async function loadDirect(slug: string) {
  if (direct.has(slug)) return;
  direct.add(slug);
  try {
    const res = await fetch(`https://api.github.com/repos/${slug}`, { headers: { accept: 'application/vnd.github+json' } });
    if (!res.ok) return;
    const r = await res.json();
    publish({ [slug]: { stars: r.stargazers_count, forks: r.forks_count, language: r.language, pushedAt: r.pushed_at } });
  } catch {
    direct.delete(slug);
  }
}

export function repoSlug(url?: string | null): string | null {
  const m = url?.trim().match(REPO);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
}

export function readRepoStats(): Stats {
  return snapshot;
}

export function subscribeRepoStats(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function requestRepoStats(slug: string) {
  if (fresh && snapshot[slug]) return;
  fromApi ??= loadApi();
  fromApi.then((ok) => {
    if (!ok || !snapshot[slug]) loadDirect(slug);
  });
}

const COMPACT = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 86400],
  ['month', 30 * 86400],
  ['week', 7 * 86400],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

export function compact(n: number): string {
  return COMPACT.format(n);
}

export function ago(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  if (!Number.isFinite(seconds)) return '';
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return RELATIVE.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}
