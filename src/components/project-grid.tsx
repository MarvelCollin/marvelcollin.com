import { useEffect, useMemo, useRef } from 'react';
import { createScope, createTimeline, onScroll, stagger } from 'animejs';
import type { Project } from '../Interface/IProject';
import { useColumnCount } from '../hooks/use-column-count';
import { CARD_ASPECT } from '../lib/card-layout';
import { EASE_OUT, ENTER, FADE_UP, MEDIA } from '../lib/motion';
import { ProjectCard } from './project-card';
import { CardSkeleton } from './skeleton';

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

  useEffect(() => {
    const el = root.current;
    if (!el || count === 0) return;

    const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;
      const cards = Array.from(el.querySelectorAll('[data-card]'));
      if (cards.length === 0) return;

      createTimeline({
        autoplay: onScroll({ target: el, enter: ENTER, repeat: false }),
      }).add(cards, {
        ...FADE_UP(26),
        scale: [0.97, 1] as [number, number],
        duration: 760,
        ease: EASE_OUT,
        delay: stagger(60),
      });
    });

    return () => scope.revert();
  }, [count, cols]);

  return (
    <div ref={root} className={BOARD_CLASS}>
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
