export const SKILL_GROUPS = [
  { key: 'languages', label: 'Languages' },
  { key: 'web', label: 'Web' },
  { key: 'data', label: 'Databases' },
  { key: 'ai', label: 'AI / ML' },
  { key: 'devops', label: 'DevOps' },
  { key: 'apps', label: 'Mobile & Desktop' },
  { key: 'other', label: 'Tools & Hardware' },
] as const;

export type SkillGroup = (typeof SKILL_GROUPS)[number]['key'];

const EXACT: Record<string, SkillGroup> = { c: 'languages', r: 'languages', go: 'languages' };

const KEYWORDS: [string, SkillGroup][] = [
  ['typescript', 'languages'],
  ['javascript', 'languages'],
  ['python', 'languages'],
  ['php', 'languages'],
  ['c++', 'languages'],
  ['c#', 'languages'],
  ['java', 'languages'],
  ['kotlin', 'languages'],
  ['ruby', 'languages'],
  ['rust', 'languages'],
  ['swift', 'languages'],
  ['react', 'web'],
  ['.net', 'web'],
  ['angular', 'web'],
  ['svelte', 'web'],
  ['vue', 'web'],
  ['node', 'web'],
  ['next', 'web'],
  ['express', 'web'],
  ['tailwind', 'web'],
  ['laravel', 'web'],
  ['vite', 'web'],
  ['shadcn', 'web'],
  ['bootstrap', 'web'],
  ['socket', 'web'],
  ['three.js', 'web'],
  ['mongodb', 'data'],
  ['sqlite', 'data'],
  ['redis', 'data'],
  ['firebase', 'data'],
  ['supabase', 'data'],
  ['postgres', 'data'],
  ['mysql', 'data'],
  ['tensorflow', 'ai'],
  ['pytorch', 'ai'],
  ['hugging', 'ai'],
  ['llm', 'ai'],
  ['scikit', 'ai'],
  ['pandas', 'ai'],
  ['jupyter', 'ai'],
  ['speech', 'ai'],
  ['mcp', 'ai'],
  ['docker', 'devops'],
  ['kubernetes', 'devops'],
  ['nginx', 'devops'],
  ['linux', 'devops'],
  ['git', 'devops'],
  ['github', 'devops'],
  ['bash', 'devops'],
  ['powershell', 'devops'],
  ['cloudflare', 'devops'],
  ['vercel', 'devops'],
  ['networking', 'devops'],
  ['rabbitmq', 'devops'],
  ['flutter', 'apps'],
  ['tauri', 'apps'],
  ['electron', 'apps'],
  ['unity', 'apps'],
  ['android', 'apps'],
];

export function skillGroup(name: string): SkillGroup {
  const lower = name.trim().toLowerCase();
  if (EXACT[lower]) return EXACT[lower];
  let best: [string, SkillGroup] | null = null;
  for (const entry of KEYWORDS) {
    if (lower.includes(entry[0]) && (!best || entry[0].length > best[0].length)) best = entry;
  }
  return best?.[1] ?? 'other';
}
