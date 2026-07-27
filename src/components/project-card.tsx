import { memo } from 'react';
import type { Project } from '../Interface/IProject';
import { CARD_ASPECT, CARD_ROT } from '../lib/card-layout';
import { Thumbnail } from './thumbnail';

export const ProjectCard = memo(function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <a
      href={'/work/' + p.slug}
      className={
        'group relative block origin-center transition-transform duration-300 ease-out hover:z-20 hover:rotate-0 hover:-translate-y-1 ' +
        CARD_ROT[index % CARD_ROT.length]
      }
    >
      <span className="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[rgba(220,189,110,0.32)] shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />
      <div className="bg-[#e9e3d6] p-[14px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] transition-shadow duration-300 group-hover:shadow-[0_34px_64px_-18px_rgba(0,0,0,0.85)]">
        <div className={'relative overflow-hidden bg-bg-2 ' + CARD_ASPECT[index % CARD_ASPECT.length]}>
          <Thumbnail p={p} />
          <span className="absolute left-2 top-2 z-[2] font-sans text-[10px] uppercase tracking-[0.12em] text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {p.num}
          </span>
          <span className="absolute right-2 top-2 z-[2] font-sans text-[10px] uppercase tracking-[0.12em] text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {p.tag}
          </span>
        </div>
        <div className="px-1 pt-3 text-center">
          <div className="text-[16px] font-medium leading-tight text-[#2a2620]">{p.name}</div>
          <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[#8a7f6a]">
            {p.stack} · {p.year}
          </div>
        </div>
      </div>
    </a>
  );
});
