import { skillGlyph } from './skill-logos';

export interface Share {
  name: string;
  share: number;
  color: string;
  icon: string | null;
}

const ALIAS: Record<string, string> = {
  Shell: 'bash',
  'Jupyter Notebook': 'jupyter',
  Dockerfile: 'docker',
  Blade: 'laravel',
  SCSS: 'sass',
};

const COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  'Jupyter Notebook': '#da5b0b',
  PHP: '#4f5d95',
  Blade: '#f7523f',
  Go: '#00add8',
  HTML: '#e34c26',
  CSS: '#663399',
  SCSS: '#c6538c',
  Shell: '#89e051',
  PowerShell: '#5391fe',
  Rust: '#dea584',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#8a8a8a',
  Java: '#b07219',
  Kotlin: '#a97bff',
  Swift: '#f05138',
  Dart: '#00b4ab',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dockerfile: '#4a90a4',
};

const OTHER = '#56676d';

export function iconKey(name: string): string | null {
  const key = ALIAS[name] ?? name;
  return 'src' in skillGlyph(key) ? key : null;
}

export function shares(bytes: Record<string, number>, limit = 5): Share[] {
  const entries = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((n, [, b]) => n + b, 0);
  if (!total) return [];
  const top = entries.slice(0, limit).filter(([, b]) => b / total >= 0.01);
  const out: Share[] = top.map(([name, b]) => ({ name, share: b / total, color: COLORS[name] ?? OTHER, icon: iconKey(name) }));
  const rest = 1 - out.reduce((n, s) => n + s.share, 0);
  if (rest >= 0.005) out.push({ name: 'Other', share: rest, color: OTHER, icon: null });
  return out;
}

export function stackIcons(stack: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of stack.split(/\s*[·,/]\s*/)) {
    const glyph = skillGlyph(token);
    if (!token || !('src' in glyph) || seen.has(glyph.src)) continue;
    seen.add(glyph.src);
    out.push(token);
  }
  return out;
}

export function techIcons(stack: string, bytes?: Record<string, number>, limit = 5): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const langs = bytes ? shares(bytes).flatMap((s) => (s.icon ? [s.icon] : [])) : [];
  for (const name of [...langs, ...stackIcons(stack)]) {
    const glyph = skillGlyph(name);
    if (!('src' in glyph) || seen.has(glyph.src)) continue;
    seen.add(glyph.src);
    out.push(name);
  }
  return out.slice(0, limit);
}

export function percent(share: number): string {
  return share >= 0.1 ? `${Math.round(share * 100)}%` : `${(share * 100).toFixed(1)}%`;
}
