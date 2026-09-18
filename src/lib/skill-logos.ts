export type Glyph = { src: string } | { text: string };

const FILES = import.meta.glob('../assets/skills/*.svg', { query: '?no-inline', import: 'default', eager: true }) as Record<string, string>;

const LOGOS: [string, string][] = [
  ['typescript', 'typescript'],
  ['javascript', 'javascript'],
  ['react', 'react'],
  ['angular', 'angular'],
  ['svelte', 'svelte'],
  ['vue', 'vue'],
  ['node', 'node'],
  ['tailwind', 'tailwind'],
  ['.net', 'dotnet'],
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
  ['vite', 'vite'],
  ['socket', 'socketio'],
  ['cypress', 'cypress'],
  ['shadcn', 'shadcn'],
  ['android', 'android'],
  ['labview', 'labview'],
  ['bootstrap', 'bootstrap'],
];

const EXACT: Record<string, string> = { c: 'c', r: 'r', go: 'go' };

const MONOGRAMS: [string, string][] = [
  ['3d printing', '3D'],
  ['llm', 'LLM'],
  ['speech', 'ASR'],
];

function longest(lower: string, entries: [string, string][]) {
  let best: [string, string] | null = null;
  for (const entry of entries) {
    if (lower.includes(entry[0]) && (!best || entry[0].length > best[0].length)) best = entry;
  }
  return best?.[1] ?? null;
}

const src = (file: string) => FILES[`../assets/skills/${file}.svg`];

export function skillGlyph(name: string): Glyph {
  const lower = name.trim().toLowerCase();
  const file = EXACT[lower] ?? longest(lower, LOGOS);
  if (file && src(file)) return { src: src(file) };
  return { text: longest(lower, MONOGRAMS) ?? name.slice(0, 2).toUpperCase() };
}
