export interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
  languages?: Record<string, number>;
}

type Stats = Record<string, RepoStats>;

const REPO = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i;
const KEY = 'gh-stats-v2';
const TTL = 24 * 60 * 60 * 1000;

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
let snapshot: Stats = saved.data;
let loading: Promise<void> | null = null;

function publish(next: Stats) {
  const merged = { ...snapshot };
  for (const [slug, stats] of Object.entries(next)) merged[slug] = { ...stats, languages: stats.languages ?? snapshot[slug]?.languages };
  snapshot = merged;
  persist();
  listeners.forEach((l) => l());
}

async function load() {
  try {
    const res = await fetch('/api/github');
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) publish(await res.json());
  } catch {
    loading = null;
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
  loading ??= load();
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
