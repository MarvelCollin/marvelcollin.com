import { useMemo } from 'react';
import { useContent, findWork } from '../content/use-content';
import { Thumbnail } from '../components/thumbnail';
import { MetaList } from '../components/meta-list';
import { useColumnCount } from '../hooks/use-column-count';
import type { Project } from '../Interface/IProject';

const ROT = ['-rotate-2', 'rotate-1', 'rotate-3', '-rotate-3', 'rotate-2', '-rotate-1'];
const ASPECT = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/6]', 'aspect-[4/3]', 'aspect-[4/5]'];

export function Home() {
  const { works } = useContent();
  const feature = findWork(works, 'tetrimosuv');
  const cols = useColumnCount();
  const selected = useMemo(() => works.slice(0, 6), [works]);
  const columns = useMemo(() => {
    const out: { p: Project; i: number }[][] = Array.from({ length: cols }, () => []);
    selected.forEach((p, i) => out[i % cols].push({ p, i }));
    return out;
  }, [selected, cols]);

  return (
    <div data-screen-label="Home">
      <section className="mx-auto max-w-[1320px] px-10 pt-[140px] pb-20 max-[900px]:px-[22px] max-[900px]:pt-[100px] max-[560px]:pt-[92px]">
        <div className="pb-[120px]">
          <p className="mb-5 text-[13px] uppercase tracking-[0.1em] text-muted">Software Engineer</p>
          <h1 className="max-w-[14ch] font-sans text-[clamp(40px,6.2vw,96px)] font-semibold leading-[1.08] tracking-[-0.025em]">
            Marvel Collin.
          </h1>
          <div className="mt-[100px] grid grid-cols-[1fr_auto] gap-20 border-t border-line pt-9 text-[16px] leading-[1.65] text-fg-dim max-[900px]:grid-cols-1 max-[900px]:gap-6">
            <p>
              I'm a Computer Science student at BINUS University and a full-stack engineer on the lab's R&D team. I build web apps from database to interface in TypeScript, React, Go, and .NET. On the side I make games, ML experiments, and award-winning robotics.
            </p>
            <div className="flex flex-col items-end gap-1.5 whitespace-nowrap pt-1 text-[14px] text-fg-dim max-[900px]:items-start max-[900px]:whitespace-normal">
              <p>Jakarta, Indonesia</p>
              <a className="mt-2 border-b border-line pb-px text-fg-dim transition-colors hover:text-fg" href="mailto:marvelcollin7@gmail.com">marvelcollin7@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="pt-[120px]">
          <div className="mb-[22px] flex items-end justify-between gap-4">
            <p className="text-[13px] uppercase tracking-[0.1em] text-muted">
              Selected work · {String(Math.min(works.length, 6)).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
            </p>
          </div>

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

          <div className="mt-6 text-sm text-fg-dim">
            <a href="/work" className="border-b border-line pb-px text-fg-dim transition-colors hover:text-fg">All {works.length} projects →</a>
          </div>
        </div>

        {feature && (
          <div className="pt-[140px]">
            <div className="mb-12 grid grid-cols-2 items-end gap-[60px] max-[900px]:grid-cols-1 max-[900px]:gap-[30px]">
              <h2 className="font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-[1.06] tracking-[-0.025em]">{feature.name}</h2>
              <p className="max-w-[46ch] text-[18px] leading-[1.5] text-fg-dim">
                <b className="font-medium text-fg">{feature.name}</b> {feature.body[0]}
              </p>
            </div>
            <a
              className="group relative mx-auto block max-w-[940px] origin-center -rotate-1 transition-transform duration-300 ease-out hover:rotate-0 hover:scale-[1.015]"
              href={'/work/' + feature.slug}
            >
              <span className="pointer-events-none absolute -top-4 left-1/2 z-10 h-8 w-36 -translate-x-1/2 -rotate-2 bg-[rgba(220,189,110,0.32)] shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />
              <div className="bg-[#e9e3d6] p-[18px] shadow-[0_24px_56px_-18px_rgba(0,0,0,0.75)] transition-shadow duration-300 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]">
                <div className="relative aspect-[16/9] overflow-hidden bg-bg-2 after:absolute after:inset-0 after:z-[1] after:content-[''] after:bg-[linear-gradient(to_top,rgba(20,18,14,0.45),transparent_40%),linear-gradient(to_bottom,rgba(20,18,14,0.3),transparent_28%)]">
                  <Thumbnail p={feature} />
                  <span className="absolute left-6 top-5 z-[2] font-sans text-[11px] uppercase tracking-[0.11em] text-[rgba(247,244,234,0.85)] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
                    {feature.name} · {feature.year}
                  </span>
                  <span className="absolute bottom-6 right-7 z-[2] font-sans text-[14px] tracking-[0.04em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                    View project →
                  </span>
                </div>
                <div className="px-1 pt-4 text-center">
                  <div className="text-[20px] font-medium leading-tight text-[#2a2620]">{feature.name}</div>
                  <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[#8a7f6a]">
                    {feature.stack} · {feature.year}
                  </div>
                </div>
              </div>
            </a>
            <div className="mt-8">
              <MetaList
                items={[
                  { label: 'Type', value: feature.tag },
                  { label: 'Role', value: feature.role },
                  { label: 'Stack', value: feature.stack },
                  { label: 'Result', value: feature.result },
                ]}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
