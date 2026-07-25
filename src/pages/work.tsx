import { useMemo, useState } from 'react';
import { useContent } from '../content/use-content';
import { Thumbnail } from '../components/thumbnail';
import { useColumnCount } from '../hooks/use-column-count';
import type { Project } from '../Interface/IProject';

const ROT = ['-rotate-2', 'rotate-1', 'rotate-3', '-rotate-3', 'rotate-2', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-3'];
const ASPECT = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/6]', 'aspect-[4/3]', 'aspect-[4/5]'];

export function Work() {
  const { works: PROJECTS, loading } = useContent();
  const [filter, setFilter] = useState('all');
  const cols = useColumnCount();
  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.tag === filter)),
    [PROJECTS, filter],
  );
  const filters = [
    { key: 'all', label: `All (${PROJECTS.length})` },
    { key: 'client', label: `Client (${PROJECTS.filter((p) => p.tag === 'client').length})` },
    { key: 'product', label: `Product (${PROJECTS.filter((p) => p.tag === 'product').length})` },
    { key: 'personal', label: `Personal (${PROJECTS.filter((p) => p.tag === 'personal').length})` },
  ];

  const columns = useMemo(() => {
    const out: { p: Project; i: number }[][] = Array.from({ length: cols }, () => []);
    filtered.forEach((p, i) => out[i % cols].push({ p, i }));
    return out;
  }, [filtered, cols]);

  return (
    <div data-screen-label="Work">
      <section className="px-10 pt-[160px] pb-8 max-[900px]:px-[22px] max-[900px]:pt-[100px]">
        <div className="mx-auto max-w-[1320px]">
          <h1 className="font-sans text-[clamp(36px,5vw,64px)] font-semibold leading-[1.06] tracking-[-0.025em]">
            Projects
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-dim">
            {PROJECTS.length} projects from 2021 to 2025.
          </p>
        </div>
      </section>

      <section className="px-10 pb-6 max-[900px]:px-[22px]">
        <div className="mx-auto flex max-w-[1320px] flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                'cursor-pointer rounded-full border px-4 py-[7px] text-xs tracking-[0.04em] transition-colors ' +
                (filter === f.key
                  ? 'border-fg bg-fg text-bg'
                  : 'border-line text-fg-dim hover:border-muted hover:text-fg')
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-bg-2 px-10 py-12 max-[900px]:px-[22px]">
        <div className="mx-auto max-w-[1320px]">
          {loading && PROJECTS.length === 0 ? (
            <p className="text-sm text-fg-dim">Loading projects…</p>
          ) : (
            <div className="rounded-2xl bg-[radial-gradient(var(--dot)_1px,transparent_1px)] [background-size:22px_22px] px-2 py-8 sm:px-6">
              <div className="flex gap-7 sm:gap-9">
                {columns.map((col, ci) => (
                  <div key={ci} className="flex flex-1 flex-col gap-10">
                    {col.map(({ p, i }) => (
                      <a
                        key={p.slug}
                        href={'/work/' + p.slug}
                        className={
                          'group relative block origin-center transition-transform duration-300 ease-out hover:z-20 hover:rotate-0 hover:-translate-y-1 ' +
                          ROT[i % ROT.length]
                        }
                      >
                        <span className="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[rgba(220,189,110,0.32)] shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />
                        <div className="bg-[#e9e3d6] p-[14px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] transition-shadow duration-300 group-hover:shadow-[0_34px_64px_-18px_rgba(0,0,0,0.85)]">
                          <div className={'relative overflow-hidden bg-bg-2 ' + ASPECT[i % ASPECT.length]}>
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
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
