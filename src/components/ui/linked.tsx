import type { ReactNode } from 'react';
import { FaAward, FaFolderOpen } from 'react-icons/fa6';
import type { Award, Project } from '../../types/content';
import { img } from '../../lib/img';
import { workHref } from '../../lib/work-link';
import { setFlipOrigin } from '../../lib/flip';
import { shortPeriod } from '../../lib/period';
import { WORK_TYPES } from '../../content/work-types';

const CHIP = 'group flex items-center gap-3 rounded-lg border border-line bg-bg/70 py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:border-accent/50';
const EYEBROW = 'block font-mono text-[10px] uppercase tracking-[0.12em]';

function Thumb({ src, fallback }: { src?: string; fallback: ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-bg-2">
      {src ? <img src={img(src, 400)} alt="" loading="lazy" className="h-full w-full object-cover" /> : fallback}
    </span>
  );
}

export function LinkedList({ children, className = 'mt-4' }: { children: ReactNode; className?: string }) {
  return <ul className={'flex flex-wrap gap-2.5 ' + className}>{children}</ul>;
}

export function AwardChip({ award }: { award: Award }) {
  return (
    <li>
      <a href="#recognition" className={CHIP}>
        <Thumb src={award.image} fallback={<FaAward size={15} className="text-accent" aria-hidden="true" />} />
        <span className="min-w-0">
          <span className={EYEBROW + ' text-accent'}>Award · {award.yr}</span>
          <span className="block text-[14px] leading-[1.35] text-fg">{award.name}</span>
        </span>
      </a>
    </li>
  );
}

export function WorkChip({ work, context, logo }: { work: Project; context?: string; logo?: string | null }) {
  return (
    <li>
      <a href={workHref(work.slug)} onClick={(e) => setFlipOrigin(e.currentTarget)} className={CHIP}>
        {logo ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1">
            <img src={logo} alt="" className="h-full w-full object-contain" />
          </span>
        ) : (
          <Thumb src={work.cover} fallback={<FaFolderOpen size={14} className="text-accent-2" aria-hidden="true" />} />
        )}
        <span className="min-w-0">
          <span className={EYEBROW + ' text-accent-2'}>{context || 'Project'}</span>
          <span className="block text-[14px] leading-[1.35] text-fg">
            {work.name}
            <span aria-hidden="true" className="ml-1.5 inline-block text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-soft">
              →
            </span>
          </span>
          {WORK_TYPES[work.slug] && <span className="mt-0.5 block text-[12px] leading-[1.35] text-fg-dim">{WORK_TYPES[work.slug]}</span>}
          <span className="mt-0.5 block font-mono text-[11px] tabular-nums tracking-[0.04em] text-muted">{shortPeriod(work.year)}</span>
        </span>
      </a>
    </li>
  );
}
