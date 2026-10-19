import { memo } from 'react';
import { FaBriefcase, FaLink, FaRegCalendar, FaStar } from 'react-icons/fa6';
import type { Project } from '../../types/content';
import { CARD_ASPECT, CARD_ROT, cardSizes } from '../../lib/card-layout';
import { workHref } from '../../lib/work-link';
import { setFlipOrigin } from '../../lib/flip';
import { delay } from '../../lib/motion';
import { useRepoStats } from '../../hooks/use-repo-stats';
import { compact } from '../../lib/api/github';
import { techIcons } from '../../lib/languages';
import { TechIcon } from '../ui/tech-icon';
import { clientOf } from '../../lib/client';
import { workPeriod } from '../../lib/period';
import { orgLogo } from '../../lib/org-logo';
import { employment } from '../../lib/employment';
import { WORK_TAGS } from '../../content/tags';
import { useRoleOf } from '../../hooks/use-role-of';
import { Thumbnail } from './thumbnail';

const CHIP = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[5px] font-mono text-[10px] uppercase leading-none tracking-[0.08em] ';

const TYPE: Record<string, string> = {
  freelance: 'bg-paper-ink text-paper',
  internship: 'bg-accent-2-deep text-white',
  product: 'bg-accent text-accent-ink',
  personal: 'bg-paper-ink/[0.08] text-paper-ink ring-1 ring-paper-ink/25',
};

function relationOf(built: { role: string; org: string }): string {
  const { title, kind } = employment(built.role);
  const lead = kind === 'Internship' || kind === 'Freelance' ? kind : title;
  return lead === built.org ? lead : `${lead} · ${built.org}`;
}

export const ProjectCard = memo(function ProjectCard({ p, index }: { p: Project; index: number }) {
  const stats = useRepoStats(p.repo);
  const icons = techIcons(p.stack, stats?.languages, 5);
  const client = clientOf(p);
  const built = useRoleOf(p.slug);
  const relation = built ? relationOf(built) : null;
  const type = WORK_TAGS.find((t) => t.key === p.tag)?.label ?? p.tag;

  return (
    <a
      data-card
      style={delay(Math.min(index, 8) * 60)}
      onClick={(e) => setFlipOrigin(e.currentTarget)}
      href={workHref(p.slug)}
      className={
        'group relative block origin-center transition-transform duration-300 ease-out hover:z-20 hover:rotate-0 hover:-translate-y-1 ' +
        CARD_ROT[index % CARD_ROT.length]
      }
    >
      <span className="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-2 bg-tape shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />
      <div className="relative bg-paper p-[14px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] after:pointer-events-none after:absolute after:inset-0 after:opacity-0 after:shadow-[0_34px_64px_-18px_rgba(0,0,0,0.85)] after:transition-opacity after:duration-300 group-hover:after:opacity-100">
        <div className={'relative overflow-hidden bg-bg-2 ' + CARD_ASPECT[index % CARD_ASPECT.length]}>
          <Thumbnail p={p} sizes={cardSizes(index)} />
          <span className="absolute left-2 top-2 z-[2] font-mono text-[10px] uppercase tracking-[0.12em] text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {p.num}
          </span>
          {!!stats?.stars && (
            <span className="absolute bottom-2 right-2 z-[2] flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[10px] tabular-nums tracking-[0.06em] text-white/90 backdrop-blur-sm">
              <FaStar size={9} className="text-accent" aria-hidden="true" />
              {compact(stats.stars)}
              <span className="sr-only"> GitHub stars</span>
            </span>
          )}
        </div>
        <div className="px-1 pt-3 text-center">
          <div className="text-[16px] font-medium leading-tight text-paper-ink">{p.name}</div>
          {client && (
            <div className="mt-1 flex items-center justify-center gap-1.5 text-[12px] leading-tight text-paper-dim">
              {orgLogo(client) ? (
                <img src={orgLogo(client)!} alt="" className="h-4 w-4 shrink-0 object-contain" />
              ) : (
                <FaBriefcase size={10} aria-hidden="true" className="shrink-0 opacity-70" />
              )}
              <span className="truncate">{client}</span>
            </div>
          )}
          <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
            <li className={CHIP + TYPE[p.tag]}>{type}</li>
            <li className={CHIP + ' bg-paper-ink/[0.08] text-paper-ink'}>
              <FaRegCalendar size={9} aria-hidden="true" />
              {workPeriod(p.year, p.tag, true)}
            </li>
            {relation && (
              <li className={CHIP + ' min-w-0 max-w-full bg-paper-ink/[0.08] text-paper-ink'} title={relation}>
                <FaLink size={9} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{relation}</span>
              </li>
            )}
          </ul>
          {icons.length > 0 && (
            <div aria-hidden="true" className="mt-3 flex items-center justify-center gap-2">
              {icons.map((name) => (
                <span key={name} title={name} className="flex h-6 w-6 items-center justify-center rounded-md bg-white/55 ring-1 ring-black/5">
                  <TechIcon name={name} size={14} surface="light" />
                </span>
              ))}
            </div>
          )}
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
            {p.stack}
          </div>
        </div>
      </div>
    </a>
  );
});
