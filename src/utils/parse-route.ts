export type ParsedRoute =
  | { kind: 'home' }
  | { kind: 'work' }
  | { kind: 'about' }
  | { kind: 'contact' }
  | { kind: 'research' }
  | { kind: 'admin' }
  | { kind: 'project'; slug: string };

export function parseRoute(r: string): ParsedRoute {
  if (r.startsWith('/work/')) return { kind: 'project', slug: r.slice(6).replace(/\/$/, '') };
  if (r === '/work') return { kind: 'work' };
  if (r === '/about') return { kind: 'about' };
  if (r === '/contact') return { kind: 'contact' };
  if (r === '/research') return { kind: 'research' };
  if (r === '/admin') return { kind: 'admin' };
  return { kind: 'home' };
}
