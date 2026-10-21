const PREFIX = '#/work/';
const PAPER_PREFIX = '#/paper/';

export function workHref(slug: string): string {
  return PREFIX + slug;
}

export function slugFromHash(hash: string): string | null {
  if (!hash.startsWith(PREFIX)) return null;
  const slug = hash.slice(PREFIX.length).replace(/\/$/, '');
  return slug || null;
}

export function legacyAnchor(pathname: string): string | null {
  if (pathname.startsWith('/work/')) return PREFIX + pathname.slice(6).replace(/\/$/, '');
  if (pathname === '/work') return '#work';
  if (pathname === '/about') return '#origin';
  if (pathname === '/research') return '#research';
  return null;
}

export function paperHref(slug: string): string {
  return PAPER_PREFIX + slug;
}

export function paperSlugFromHash(hash: string): string | null {
  if (!hash.startsWith(PAPER_PREFIX)) return null;
  const slug = hash.slice(PAPER_PREFIX.length).replace(/\/$/, '');
  return slug || null;
}
