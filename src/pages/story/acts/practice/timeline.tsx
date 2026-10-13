import { delay } from '../../../../lib/motion';
import { NOW, isLive, label, type Block, type Span } from '../../../../lib/tenure';
import { Pulse } from './post';
import { hoverProps, type Hover } from './hover';
import { ParallelGlyph } from './fork';

const ROW = 'grid grid-cols-[200px_minmax(0,1fr)] items-center gap-x-6 max-[640px]:grid-cols-1 max-[640px]:gap-y-1.5';

export function Timeline({ blocks, hot, onHot }: { blocks: Block[]; hot: string | null; onHot: Hover }) {
  const lanes = blocks.flatMap((b) => (b.kind === 'solo' ? [b.lane] : b.lanes));
  const bands = new Map<string, Span>();
  for (const b of blocks) if (b.kind === 'parallel') for (const l of b.lanes) bands.set(l.key, b.window);

  const known = lanes.flatMap((l) => l.spans).filter((s): s is Span => s !== null);
  if (!known.length) return null;

  const first = Math.floor(Math.min(...known.map((s) => s.from)) / 12) * 12;
  const last = Math.max(NOW, ...known.map((s) => s.to)) + 1;
  const total = last - first;
  const pct = (m: number) => `${((m - first) / total) * 100}%`;
  const size = (s: Span) => `${((s.to - s.from + 1) / total) * 100}%`;
  const years: number[] = [];
  for (let m = first; m < last; m += 12) years.push(m);

  const summary = [
    `Roles from ${first / 12} to now.`,
    ...blocks.flatMap((b) => (b.kind === 'parallel' ? [`${b.lanes.map((l) => l.name).join(' and ')} held in parallel, ${label(b.window)}.`] : [])),
  ].join(' ');

  return (
    <figure className="rounded-xl border border-line bg-bg/40 p-7 max-[560px]:p-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <span className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">Timeline</span>
        <span className="sr-only">{summary}</span>
        <span aria-hidden="true" className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          <span className="flex items-center gap-2">
            <i className="h-1.5 w-5 rounded-full bg-accent-2/70" />
            Past
          </span>
          <span className="flex items-center gap-2">
            <i className="h-1.5 w-5 rounded-full bg-accent" />
            Ongoing
          </span>
          <span className="flex items-center gap-2 text-accent">
            <i className="h-3.5 w-5 border-x border-dashed border-accent/50 bg-accent/12" />
            <ParallelGlyph />
            In parallel
          </span>
        </span>
      </figcaption>

      <div aria-hidden="true" className="mt-7">
        <div className={ROW}>
          <span className="max-[640px]:hidden" />
          <div className="relative h-5 font-mono text-[11px] tabular-nums text-muted">
            {years.map((m) => (
              <span key={m} className="absolute top-0 pl-1.5" style={{ left: pct(m) }}>
                <span className="max-[560px]:hidden">{m / 12}</span>
                <span className="hidden max-[560px]:inline">’{String(m / 12).slice(2)}</span>
              </span>
            ))}
            <span className="absolute right-0 top-0 text-accent">Now</span>
          </div>
        </div>

        {lanes.map((l, i) => {
          const own = l.spans.filter((s): s is Span => s !== null);
          const overlap = bands.get(l.key);
          const band =
            overlap && own.length
              ? { ...overlap, from: Math.max(overlap.from, Math.min(...own.map((s) => s.from))), to: Math.min(overlap.to, Math.max(...own.map((s) => s.to))) }
              : null;
          const lit = hot === l.key;
          return (
            <div
              key={l.key}
              {...hoverProps(l.key, onHot)}
              className={ROW + ' transition-opacity duration-300 max-[640px]:mt-2.5 ' + (hot && !lit ? 'opacity-35' : '')}
            >
              <span className={'truncate text-[13px] transition-colors ' + (lit ? 'text-fg' : 'text-fg-dim')}>{l.name}</span>
              <div className="relative h-9 max-[640px]:h-5">
                {years.map((m) => (
                  <span key={m} className="absolute inset-y-0 w-px bg-line/70" style={{ left: pct(m) }} />
                ))}
                {band && band.from <= band.to && (
                  <span
                    data-grow="pop"
                    style={{ left: pct(band.from), width: size(band), ...delay(900) }}
                    className="absolute inset-y-0 border-x border-dashed border-accent/50 bg-accent/12"
                  />
                )}
                {l.spans.map((s, k) => {
                  if (!s) return null;
                  const live = isLive(l.items[k]);
                  const older = l.spans[k + 1];
                  const bar = older && older.to >= s.from && older.to < s.to ? { ...s, from: older.to + 1 } : s;
                  return (
                    <span key={l.items[k].id}>
                      <span
                        data-grow
                        style={{ left: pct(bar.from), width: `max(4px, calc(${size(bar)} - 3px))`, ...delay(200 + i * 90) }}
                        className={'absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full ' + (live ? 'bg-accent' : 'bg-accent-2/70')}
                      />
                      {live && (
                        <span
                          data-grow="pop"
                          style={{ left: `calc(${pct(s.to + 1)} - 6px)`, ...delay(1000 + i * 90) }}
                          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2"
                        >
                          <Pulse />
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
