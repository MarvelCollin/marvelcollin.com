import type { Project } from '../../../../types/content';
import { WORK_TAGS } from '../../../../content/tags';
import { Chips } from '../../../../components/ui/chips';

export function WorkFilters({ works, value, onChange }: { works: Project[]; value: string; onChange: (key: string) => void }) {
  const chips = [
    { key: 'all', label: 'All', count: works.length },
    ...WORK_TAGS.map((t) => ({ ...t, count: works.filter((p) => p.tag === t.key).length })),
  ];

  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10">
      <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">All projects</p>
      <Chips chips={chips} value={value} onChange={onChange} />
    </div>
  );
}
