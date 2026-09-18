import { useEffect, useRef, type ReactNode } from 'react';
import { createScope, createTimeline, onScroll, svg, utils } from 'animejs';
import type { Chapter as ChapterMeta } from '../Interface/IChapter';
import { EASE_OUT, ENTER, FADE_UP, MEDIA } from '../lib/motion';

const SHELL = 'relative px-10 max-[900px]:px-[22px]';

export function ChapterMasthead({ meta }: { meta: ChapterMeta }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;

      const numeral = el.querySelector('[data-part="numeral"]');
      const rule = el.querySelector('[data-part="rule"]');
      const margin = el.querySelector('[data-part="margin"]');
      const heading = el.querySelector('[data-part="heading"]');
      const dek = el.querySelector('[data-part="dek"]');
      if (!numeral || !rule || !heading || !dek) return;

      const [drawable] = svg.createDrawable(rule as SVGLineElement);
      const rise = FADE_UP(14);
      utils.set(drawable, { draw: '0 0' });

      createTimeline({
        defaults: { ease: EASE_OUT, duration: 640 },
        autoplay: onScroll({ target: el, enter: ENTER, repeat: false }),
      })
        .add(numeral, { ...rise, duration: 520 }, 0)
        .add(rule, { opacity: 1, duration: 1 }, 140)
        .add(drawable, { draw: '0 1', duration: 900, ease: 'inOutQuad' }, 140)
        .add(margin ?? [], { ...rise, duration: 420 }, 300)
        .add(heading, { ...rise, duration: 720 }, 360)
        .add(dek, { ...rise, duration: 640 }, 520);
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={root} className="mx-auto max-w-[1280px]">
      <div className="flex items-center gap-5 max-[560px]:gap-3">
        <span
          data-part="numeral"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-accent/45 font-mono text-[13px] font-medium tabular-nums tracking-[0.06em] text-accent max-[560px]:h-9 max-[560px]:w-9 max-[560px]:text-[11px]"
        >
          {meta.numeral}
        </span>
        <svg className="h-px flex-1 text-line" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
          <line
            data-part="rule"
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
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted max-[560px]:hidden"
        >
          {meta.marginal}
        </span>
      </div>

      <h2
        data-part="heading"
        className="mt-8 font-display text-[clamp(38px,6vw,76px)] font-semibold leading-[1.02] tracking-[-0.018em] max-[560px]:mt-6"
      >
        {meta.label}
      </h2>
      <p data-part="dek" className="mt-5 max-w-[58ch] text-[17px] leading-[1.7] text-fg-dim max-[560px]:text-[16px]">
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
      className={SHELL + ' py-28 max-[900px]:py-16 ' + (meta.band ? 'chapter-band' : '')}
    >
      <ChapterMasthead meta={meta} />
      <div className="mx-auto mt-16 max-w-[1280px] max-[900px]:mt-10">{children}</div>
    </section>
  );
}
