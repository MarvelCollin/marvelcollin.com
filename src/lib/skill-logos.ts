import type { IconType } from 'react-icons';
import { TbBrain, TbCube3dSphere, TbMicrophone } from 'react-icons/tb';

export type Glyph = { src: string } | { Icon: IconType; color: string };

const FILES = import.meta.glob('../assets/skills/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

const file = (name: string) => FILES[`../assets/skills/${name}.svg`];

const LOGOS: [string, string][] = [
  ['typescript', 'typescript'],
  ['javascript', 'javascript'],
  ['react', 'react'],
  ['angular', 'angular'],
  ['svelte', 'svelte'],
  ['vue', 'vuejs'],
  ['node', 'nodejs'],
  ['tailwind', 'tailwindcss'],
  ['.net', 'dotnetcore'],
  ['c#', 'csharp'],
  ['php', 'php'],
  ['laravel', 'laravel'],
  ['python', 'python'],
  ['java', 'java'],
  ['kotlin', 'kotlin'],
  ['swift', 'swift'],
  ['flutter', 'flutter'],
  ['c++', 'cplusplus'],
  ['ruby', 'ruby'],
  ['rust', 'rust'],
  ['rabbitmq', 'rabbitmq'],
  ['three.js', 'threejs'],
  ['unity', 'unity'],
  ['arduino', 'arduino'],
  ['tensorflow', 'tensorflow'],
  ['mongodb', 'mongodb'],
  ['sqlite', 'sqlite'],
  ['redis', 'redis'],
  ['firebase', 'firebase'],
  ['supabase', 'supabase'],
  ['docker', 'docker'],
  ['kubernetes', 'kubernetes'],
  ['nginx', 'nginx'],
  ['git', 'git'],
  ['github', 'github'],
  ['github actions', 'githubactions'],
  ['figma', 'figma'],
  ['vercel', 'vercel'],
  ['postman', 'postman'],
  ['linux', 'linux'],
  ['postgres', 'postgresql'],
  ['mysql', 'mysql'],
  ['bash', 'bash'],
  ['powershell', 'powershell'],
  ['cloudflare', 'cloudflare'],
  ['cisco', 'cisco'],
  ['pytorch', 'pytorch'],
  ['hugging face', 'huggingface'],
  ['scikit', 'scikitlearn'],
  ['pandas', 'pandas'],
  ['jupyter', 'jupyter'],
  ['mcp', 'mcp'],
  ['tauri', 'tauri'],
  ['electron', 'electron'],
  ['vite', 'vitejs'],
  ['socket', 'socketio'],
  ['cypress', 'cypressio'],
  ['shadcn', 'shadcn'],
  ['android', 'android'],
  ['labview', 'labview'],
  ['bootstrap', 'bootstrap'],
];

const EXACT: Record<string, string> = { c: 'c', r: 'r', go: 'go' };

const GENERIC: [string, IconType, string][] = [
  ['3d printing', TbCube3dSphere, '#ff6b35'],
  ['llm', TbBrain, '#c792ea'],
  ['speech', TbMicrophone, '#7ec8e3'],
];

function longest<T extends [string, ...unknown[]]>(lower: string, entries: T[]): T | null {
  let best: T | null = null;
  for (const entry of entries) {
    if (lower.includes(entry[0]) && (!best || entry[0].length > best[0].length)) best = entry;
  }
  return best;
}

export function skillGlyph(name: string): Glyph | null {
  const lower = name.trim().toLowerCase();
  const exact = EXACT[lower];
  if (exact) return { src: file(exact) };
  const logo = longest(lower, LOGOS);
  if (logo) return { src: file(logo[1]) };
  const generic = longest(lower, GENERIC);
  return generic ? { Icon: generic[1], color: generic[2] } : null;
}
