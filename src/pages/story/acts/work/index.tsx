import { useMemo, useState } from 'react';
import type { Project } from '../../../../types/content';
import { useContent, findWork } from '../../../../content/use-content';
import { ProjectGrid } from '../../../../components/project/grid';
import { FeaturedWork } from './featured';
import { WorkFilters } from './filters';

const FEATURED = 'tetrimosuv';

function groupByYear(works: Project[]): [string, Project[]][] {
  const map = new Map<string, Project[]>();
  for (const p of works) map.set(p.year, [...(map.get(p.year) ?? []), p]);
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function YearGroup({ year, items }: { year: string; items: Project[] }) {
  return (
    <div>
      <div className="mb-6 flex items-baseline gap-4 border-b border-line pb-3">
        <h3 className="font-display text-[26px] font-semibold tabular-nums tracking-[-0.01em] max-[560px]:text-[22px]">{year}</h3>
        <span className="text-[13px] text-muted">
          {items.length} {items.length === 1 ? 'project' : 'projects'}
        </span>
      </div>
      <ProjectGrid works={items} loading={false} />
    </div>
  );
}

export function Work() {
  const { works, loading } = useContent();
  const [filter, setFilter] = useState('all');
  const feature = findWork(works, FEATURED);

  const groups = useMemo(
    () => groupByYear(filter === 'all' ? works : works.filter((p) => p.tag === filter)),
    [works, filter],
  );

  return (
    <div>
      {feature && <FeaturedWork p={feature} />}
      <WorkFilters works={works} value={filter} onChange={setFilter} />
      <div className="space-y-16">
        {loading && works.length === 0 && <ProjectGrid works={[]} loading />}
        {groups.map(([year, items]) => (
          <YearGroup key={year} year={year} items={items} />
        ))}
      </div>
    </div>
  );
}
