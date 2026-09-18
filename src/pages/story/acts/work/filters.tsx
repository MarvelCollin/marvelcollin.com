import type { Project } from '../../../../types/content';
import { WORK_TAGS } from '../../../../content/tags';

const CHIP = 'cursor-pointer rounded-full border px-4 py-[7px] text-xs tracking-[0.04em] transition-colors ';
const ON = 'border-accent bg-accent text-accent-ink';
const OFF = 'border-line text-fg-dim hover:border-accent hover:text-accent';

export function WorkFilters({ works, value, onChange }: { works: Project[]; value: string; onChange: (key: string) => void }) {
  const chips = [
    { key: 'all', label: 'All', count: works.length },
    ...WORK_TAGS.map((t) => ({ ...t, count: works.filter((p) => p.tag === t.key).length })),
  ];

  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10">
      <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">All projects</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            aria-pressed={value === c.key}
            className={CHIP + (value === c.key ? ON : OFF)}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>
    </div>
  );
}
