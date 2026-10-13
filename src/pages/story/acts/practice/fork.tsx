import type { CSSProperties } from 'react';
import { delay } from '../../../../lib/motion';
import { label, type Lane, type Span } from '../../../../lib/tenure';
import type { Related } from '../../../../lib/related';
import { Post } from './post';
import type { Hover } from './hover';

const GAP = 24;

export function ParallelGlyph({ className = '' }: { className?: string }) {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true" className={className}>
      <path d="M3 0v12M7 0v12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Fork({
  lanes,
  window,
  hot,
  onHot,
  related,
}: {
  lanes: Lane[];
  window: Span;
  hot: string | null;
  onHot: Hover;
  related: Map<string, Related>;
}) {
  const cols = Math.min(lanes.length, 2);
  const col = `(100% - ${(cols - 1) * GAP}px) / ${cols}`;
  const center = (i: number) => `calc(${col} * ${i + 0.5} + ${i * GAP}px)`;

  return (
    <div>
      <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent max-[760px]:justify-start">
        <ParallelGlyph />
        <span>In parallel</span>
        <span className="text-muted" aria-hidden="true">·</span>
        <span className="text-fg-dim">{label(window)}</span>
      </p>

      <div aria-hidden="true" className="relative h-9 max-[760px]:hidden">
        <span data-grow="down" style={delay(120)} className="absolute left-1/2 top-0 h-3 w-px bg-accent/55" />
        <span data-grow="mid" style={{ left: center(0), right: center(0), ...delay(280) }} className="absolute top-3 h-px bg-accent/55" />
        {lanes.slice(0, cols).map((l, i) => (
          <span key={l.key} data-grow="down" style={{ left: center(i), ...delay(520) }} className="absolute bottom-0 top-3 w-px bg-accent/55" />
        ))}
      </div>

      <div
        style={{ '--lanes': cols } as CSSProperties}
        className="grid grid-cols-[repeat(var(--lanes),minmax(0,1fr))] gap-6 max-[760px]:mt-4 max-[760px]:grid-cols-1 max-[760px]:border-l-[3px] max-[760px]:border-double max-[760px]:border-accent/55 max-[760px]:pl-4"
      >
        {lanes.map((l) => (
          <Post key={l.key} lane={l} hot={hot === l.key} onHot={onHot} related={related} />
        ))}
      </div>
    </div>
  );
}
