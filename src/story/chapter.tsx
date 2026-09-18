import { useEffect, useRef, type ReactNode } from 'react';
import { createScope, createTimeline, onScroll, svg, utils } from 'animejs';
import type { Chapter as ChapterMeta } from '../Interface/IChapter';
import { EASE_OUT, ENTER, MEDIA, failOpen } from '../lib/motion';

const SHELL = 'relative px-10 max-[900px]:px-[22px]';

export function ChapterMasthead({ meta }: { meta: ChapterMeta }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancel = () => {};

    const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
      const numeral = el.querySelector('[data-part="numeral"]');
      const rule = el.querySelector('[data-part="rule"]');
      const margin = el.querySelector('[data-part="margin"]');
      const heading = el.querySelector('[data-part="heading"]');
      const dek = el.querySelector('[data-part="dek"]');
      if (!numeral || !rule || !heading || !dek) return;

      const parts = [numeral, margin, heading, dek].filter(Boolean) as Element[];
      const [drawable] = svg.createDrawable(rule as SVGLineElement);
      const show = () => {
        utils.set(parts, { opacity: 1, y: 0 });
        utils.set(drawable, { draw: '0 1' });
      };

      if (self?.matches.reduceMotion) {
        show();
        return;
      }

      utils.set(parts, { opacity: 0, y: 14 });
      utils.set(drawable, { draw: '0 0' });

      const observer = onScroll({ target: el, enter: ENTER, repeat: false });

      createTimeline({ defaults: { ease: EASE_OUT, duration: 640 }, autoplay: observer })
        .add(numeral, { opacity: 1, y: 0, duration: 520 })
        .add(drawable, { draw: '0 1', duration: 900, ease: 'inOutQuad' }, '-=380')
        .add(margin ?? [], { opacity: 1, y: 0, duration: 420 }, '-=500')
        .add(heading, { opacity: 1, y: 0, duration: 720 }, '-=700')
        .add(dek, { opacity: 1, y: 0 }, '-=560');

      cancel = failOpen(el, heading, show);
    });

    return () => {
      cancel();
      scope.revert();
    };
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
      className={SHELL + ' py-28 max-[900px]:py-16 ' + (meta.band ? 'bg-bg-2' : '')}
    >
      <ChapterMasthead meta={meta} />
      <div className="mx-auto mt-16 max-w-[1280px] max-[900px]:mt-10">{children}</div>
    </section>
  );
}
