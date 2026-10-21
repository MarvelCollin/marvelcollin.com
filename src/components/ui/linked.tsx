import type { ReactNode } from 'react';
import { FaAward, FaBriefcase, FaFileLines, FaFolderOpen } from 'react-icons/fa6';
import type { Award, HistoryItem, Paper, Project } from '../../types/content';
import { employment } from '../../lib/employment';
import { img } from '../../lib/img';
import { orgLogo } from '../../lib/org-logo';
import { jumpTo, paperImages } from '../../lib/papers';
import { paperHref } from '../../lib/work-link';
import { workHref } from '../../lib/work-link';
import { setFlipOrigin } from '../../lib/flip';
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

export function RoleChip({ role }: { role: HistoryItem }) {
  const { title, kind } = employment(role.role);
  const logo = orgLogo(role.where);
  const id = 'role-' + role.id;
  return (
    <li>
      <a
        href={'#' + id}
        onClick={(e) => {
          e.preventDefault();
          jumpTo(id);
        }}
        className={CHIP}
      >
        {logo ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1">
            <img src={logo} alt="" className="h-full w-full object-contain" />
          </span>
        ) : (
          <Thumb fallback={<FaBriefcase size={14} className="text-accent-soft" aria-hidden="true" />} />
        )}
        <span className="min-w-0">
          <span className={EYEBROW + ' text-accent-soft'}>Role{kind && ` · ${kind}`}</span>
          <span className="block text-[14px] leading-[1.35] text-fg">
            {title}
            <span aria-hidden="true" className="ml-1.5 inline-block text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-soft">
              →
            </span>
          </span>
          <span className="mt-0.5 block font-mono text-[11px] tabular-nums tracking-[0.04em] text-muted">{role.yr}</span>
        </span>
      </a>
    </li>
  );
}

export function PaperChip({ paper, work }: { paper: Paper; work?: Project }) {
  return (
    <li className="min-w-0 max-w-full">
      <a href={paperHref(paper.slug)} className={CHIP}>
        <Thumb src={paperImages(paper, work)[0]?.src} fallback={<FaFileLines size={14} className="text-accent-2" aria-hidden="true" />} />
        <span className="min-w-0">
          <span className={EYEBROW + ' text-accent-2'}>Research paper · {paper.year}</span>
          <span className="line-clamp-2 max-w-[42ch] text-[14px] leading-[1.35] text-fg">{paper.title}</span>
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
        </span>
      </a>
    </li>
  );
}
