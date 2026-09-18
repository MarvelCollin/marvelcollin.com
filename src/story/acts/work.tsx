import { useMemo, useState } from 'react';
import { useContent, findWork } from '../../content/use-content';
import { Thumbnail } from '../../components/thumbnail';
import { Reveal } from '../../components/reveal';
import { ProjectGrid } from '../../components/project-grid';
import { workHref } from '../../utils/work-link';
import { setFlipOrigin } from '../../lib/flip';

export function Work() {
  const { works, loading } = useContent();
  const [filter, setFilter] = useState('all');
  const feature = findWork(works, 'tetrimosuv');

  const filtered = useMemo(
    () => (filter === 'all' ? works : works.filter((p) => p.tag === filter)),
    [works, filter],
  );

  const byYear = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const p of filtered) {
      const list = map.get(p.year);
      if (list) list.push(p);
      else map.set(p.year, [p]);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const filters = [
    { key: 'all', label: `All (${works.length})` },
    { key: 'client', label: `Client (${works.filter((p) => p.tag === 'client').length})` },
    { key: 'product', label: `Product (${works.filter((p) => p.tag === 'product').length})` },
    { key: 'personal', label: `Personal (${works.filter((p) => p.tag === 'personal').length})` },
  ];

  return (
    <div>
      {feature && (
        <Reveal className="mb-24 max-[900px]:mb-16">
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div>
              <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">Featured</p>
              <h3 className="mt-4 font-display text-[clamp(28px,3.6vw,46px)] font-semibold leading-[1.08] tracking-[-0.012em]">{feature.name}</h3>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.6] text-fg-dim">{feature.body[0]}</p>
              <a
                href={workHref(feature.slug)}
                className="group mt-8 inline-flex items-center gap-3 text-[14px] text-accent-soft transition-colors hover:text-fg"
              >
                Open case
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            <a
              className="group relative block origin-center -rotate-1 transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.015]"
              onClick={(e) => setFlipOrigin(e.currentTarget)}
              href={workHref(feature.slug)}
            >
              <span className="pointer-events-none absolute -top-4 left-1/2 z-10 h-8 w-36 -translate-x-1/2 -rotate-2 bg-tape shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />
              <div className="bg-paper p-[18px] shadow-[0_24px_56px_-18px_rgba(0,0,0,0.75)] transition-shadow duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-bg-2 after:absolute after:inset-0 after:z-[1] after:content-[''] after:bg-[linear-gradient(to_top,rgba(20,18,14,0.45),transparent_40%),linear-gradient(to_bottom,rgba(20,18,14,0.3),transparent_28%)]">
                  <Thumbnail p={feature} />
                  <span className="absolute left-6 top-5 z-[2] font-mono text-[11px] uppercase tracking-[0.11em] text-[rgba(247,244,234,0.85)] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
                    {feature.name} · {feature.year}
                  </span>
                </div>
                <div className="px-1 pt-4 text-center">
                  <div className="text-[20px] font-medium leading-tight text-paper-ink">{feature.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
                    {feature.stack} · {feature.year}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </Reveal>
      )}

      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">All projects</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={
                'cursor-pointer rounded-full border px-4 py-[7px] text-xs tracking-[0.04em] transition-colors ' +
                (filter === f.key
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line text-fg-dim hover:border-accent hover:text-accent')
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16">
        {loading && works.length === 0 && <ProjectGrid works={[]} loading />}
        {byYear.map(([year, items]) => (
          <div key={year}>
            <div className="mb-6 flex items-baseline gap-4 border-b border-line pb-3">
              <h3 className="font-display text-[26px] font-semibold tabular-nums tracking-[-0.01em] max-[560px]:text-[22px]">{year}</h3>
              <span className="text-[13px] text-muted">
                {items.length} {items.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <ProjectGrid works={items} loading={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
