const PREFIX = '#/work/';

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
