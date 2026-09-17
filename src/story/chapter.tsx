import type { ReactNode } from 'react';
import type { Chapter as ChapterMeta } from '../Interface/IChapter';
import { REDUCED, useInView } from '../hooks/use-in-view';

const SHELL = 'relative px-10 max-[900px]:px-[22px]';

export function ChapterMasthead({ meta }: { meta: ChapterMeta }) {
  const { ref, visible } = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="mx-auto max-w-[1280px]">
      <div className="flex items-center gap-5 max-[560px]:gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-accent/45 font-sans text-[13px] font-medium tabular-nums tracking-[0.06em] text-accent max-[560px]:h-9 max-[560px]:w-9 max-[560px]:text-[11px]">
          {meta.numeral}
        </span>
        <span
          className="h-px flex-1 origin-left bg-line"
          style={REDUCED ? undefined : { transform: `scaleX(${visible ? 1 : 0})`, transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1) 120ms' }}
        />
        <span className="shrink-0 font-sans text-[11px] uppercase tracking-[0.16em] text-muted max-[560px]:hidden">
          {meta.marginal}
        </span>
      </div>

      <h2 className="mt-8 font-sans text-[clamp(38px,6vw,76px)] font-semibold leading-[1.02] tracking-[-0.035em] max-[560px]:mt-6">
        {meta.label}
      </h2>
      <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.7] text-fg-dim max-[560px]:text-[16px]">{meta.dek}</p>
    </div>
  );
}

export function Chapter({ meta, children }: { meta: ChapterMeta; children: ReactNode }) {
  return (
    <section
      id={meta.id}
      data-chapter={meta.id}
      aria-label={meta.label}
      className={SHELL + ' py-28 max-[900px]:py-16 ' + (meta.band ? 'bg-bg-2' : '')}
    >
      <ChapterMasthead meta={meta} />
      <div className="mx-auto mt-16 max-w-[1280px] max-[900px]:mt-10">{children}</div>
    </section>
  );
}
