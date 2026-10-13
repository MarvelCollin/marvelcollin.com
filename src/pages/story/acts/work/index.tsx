import { useMemo, useState } from 'react';
import type { Project } from '../../../../types/content';
import { useContent, findWork } from '../../../../content/use-content';
import { ProjectGrid } from '../../../../components/project/grid';
import { span } from '../../../../lib/tenure';
import { FeaturedWork } from './featured';
import { WorkFilters } from './filters';

const FEATURED = 'tetrimosuv';

const latest = (p: Project) =>
  (/[a-z]{3}/i.test(p.year) ? span(p.year)?.to : undefined) ?? Number(p.year.match(/\d{4}/)?.[0] ?? 0) * 12 + 5;

function newestFirst(works: Project[]): Project[] {
  return [...works].sort((a, b) => latest(b) - latest(a) || Number(b.num) - Number(a.num));
}

export function Work() {
  const { works, loading } = useContent();
  const [filter, setFilter] = useState('all');
  const feature = findWork(works, FEATURED);

  const shown = useMemo(() => newestFirst(filter === 'all' ? works : works.filter((p) => p.tag === filter)), [works, filter]);

  return (
    <div>
      {feature && <FeaturedWork p={feature} />}
      <WorkFilters works={works} value={filter} onChange={setFilter} />
      <ProjectGrid works={shown} loading={loading && works.length === 0} />
    </div>
  );
}
