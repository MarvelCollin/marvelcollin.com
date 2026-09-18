import { useRef, type ReactNode } from 'react';
import type { Chapter as ChapterMeta } from '../../types/content';
import { delay } from '../../lib/motion';
import { useReveal } from '../../hooks/use-reveal';

const SHELL = 'relative px-10 max-[900px]:px-[22px]';

export function ChapterMasthead({ meta }: { meta: ChapterMeta }) {
  const root = useRef<HTMLDivElement>(null);

  useReveal(root);

  return (
    <div ref={root} data-group className="mx-auto max-w-[1280px]">
      <div className="flex items-center gap-5 max-[560px]:gap-3">
        <span
          data-part="numeral"
          style={delay(0)}
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-accent/45 font-mono text-[13px] font-medium tabular-nums tracking-[0.06em] text-accent max-[560px]:h-9 max-[560px]:w-9 max-[560px]:text-[11px]"
        >
          {meta.numeral}
        </span>
        <svg className="h-px flex-1 text-line" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
          <line
            data-part="rule"
            style={delay(140)}
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span
          data-part="margin"
          style={delay(300)}
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted max-[560px]:hidden"
        >
          {meta.marginal}
        </span>
      </div>

      <h2
        data-part="heading"
        style={delay(360)}
        className="mt-8 font-display text-[clamp(38px,6vw,76px)] font-semibold leading-[1.02] tracking-[-0.018em] max-[560px]:mt-6"
      >
        {meta.label}
      </h2>
      <p data-part="dek" style={delay(520)} className="mt-5 max-w-[58ch] text-[17px] leading-[1.7] text-fg-dim max-[560px]:text-[16px]">
        {meta.dek}
      </p>
    </div>
  );
}

export function Chapter({ meta, children }: { meta: ChapterMeta; children: ReactNode }) {
  return (
    <section
      id={meta.id}
      data-chapter={meta.id}
      aria-label={meta.label}
      className={SHELL + ' chapter py-28 max-[900px]:py-16 ' + (meta.band ? 'chapter-band' : '')}
    >
      <ChapterMasthead meta={meta} />
      <div className="mx-auto mt-16 max-w-[1280px] max-[900px]:mt-10">{children}</div>
    </section>
  );
}
