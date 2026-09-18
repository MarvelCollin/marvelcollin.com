import { useMemo, useRef } from 'react';
import type { Project } from '../../types/content';
import { useColumnCount } from '../../hooks/use-column-count';
import { CARD_ASPECT } from '../../lib/card-layout';
import { useReveal } from '../../hooks/use-reveal';
import { ProjectCard } from './card';
import { CardSkeleton } from '../ui/skeleton';

const SKELETON_ROWS = 2;
const BOARD_CLASS = 'rounded-sm bg-[radial-gradient(var(--dot)_1px,transparent_1px)] [background-size:22px_22px] px-2 py-8 sm:px-6';
const COLUMN_CLASS = 'flex flex-1 flex-col gap-10';

export function ProjectGrid({ works, loading }: { works: Project[]; loading: boolean }) {
  const cols = useColumnCount();
  const root = useRef<HTMLDivElement>(null);
  const columns = useMemo(() => {
    const out: { p: Project; index: number }[][] = Array.from({ length: cols }, () => []);
    works.forEach((p, index) => out[index % cols].push({ p, index }));
    return out;
  }, [works, cols]);

  const count = works.length;

  useReveal(root, `${count}:${cols}`);

  return (
    <div ref={root} data-group className={BOARD_CLASS}>
      <div className="flex gap-7 sm:gap-9">
        {loading && works.length === 0
          ? Array.from({ length: cols }, (_, ci) => (
              <div key={ci} className={COLUMN_CLASS}>
                {Array.from({ length: SKELETON_ROWS }, (_, ri) => (
                  <CardSkeleton key={ri} aspect={CARD_ASPECT[(ci + ri * cols) % CARD_ASPECT.length]} />
                ))}
              </div>
            ))
          : columns.map((col, ci) => (
              <div key={ci} className={COLUMN_CLASS}>
                {col.map(({ p, index }) => (
                  <ProjectCard key={p.slug} p={p} index={index} />
                ))}
              </div>
            ))}
      </div>
    </div>
  );
}
