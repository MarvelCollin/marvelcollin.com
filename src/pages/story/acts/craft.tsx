import { lazy, Suspense, useMemo, useState } from 'react';
import { useContent } from '../../../content/use-content';
import { Skel } from '../../../components/ui/skeleton';

const SkillBalls = lazy(() => import('../skill-board').then((m) => ({ default: m.SkillBalls })));

const WEB_KEYS = ['typescript', 'javascript', 'react', 'next', 'nuxt', 'vue', 'angular', 'svelte', 'node', 'express', 'nest', 'tailwind', '.net', 'c#', 'php', 'laravel', 'go', 'java', 'kotlin', 'html', 'css', 'graphql', 'rest', 'supabase', 'prisma', 'firebase', 'mongodb', 'sqlite', 'redis', 'sql'];
const AI_KEYS = ['python', 'tensorflow', 'pytorch', 'r language', 'machine learning', 'deep learning', 'nlp', 'data', 'scikit', 'pandas', 'numpy', 'opencv', 'keras'];

function classifySkill(name: string): string {
  const n = name.toLowerCase();
  if (AI_KEYS.some((k) => n.includes(k))) return 'ai';
  if (WEB_KEYS.some((k) => n.includes(k))) return 'web';
  return 'other';
}

export function Craft() {
  const { skills } = useContent();
  const [skillFilter, setSkillFilter] = useState('all');

  const classified = useMemo(() => skills.map((s) => ({ ...s, cat: classifySkill(s.name) })), [skills]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: classified.length, web: 0, ai: 0, other: 0 };
    classified.forEach((s) => c[s.cat]++);
    return c;
  }, [classified]);

  const filtered = useMemo(
    () => (skillFilter === 'all' ? classified : classified.filter((s) => s.cat === skillFilter)),
    [classified, skillFilter],
  );

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web Dev' },
    { key: 'ai', label: 'AI / ML' },
    { key: 'other', label: 'Other' },
  ].filter((f) => f.key === 'all' || counts[f.key] > 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">{counts.all} tools</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setSkillFilter(f.key)}
              aria-pressed={skillFilter === f.key}
              className={
                'cursor-pointer rounded-full border px-3.5 py-[7px] text-[12px] tracking-[0.04em] transition-colors ' +
                (skillFilter === f.key
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line text-fg-dim hover:border-accent hover:text-accent')
              }
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>
      </div>
      <Suspense fallback={<Skel className="block h-[420px] w-full rounded-lg" />}>
        <SkillBalls skills={filtered} />
      </Suspense>
    </div>
  );
}
