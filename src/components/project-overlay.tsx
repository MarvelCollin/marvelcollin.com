import { useEffect, useState } from 'react';
import { useContent, findWork, workIndex } from '../content/use-content';
import { useModal } from '../hooks/use-modal';
import { workHref } from '../utils/work-link';
import { Thumbnail } from './thumbnail';
import { Gallery } from './gallery';
import { Lightbox } from './lightbox';
import { Clip } from './clip';
import { ClipDefs } from './clip-defs';
import { Skel } from './skeleton';

const BOARD = 'bg-[radial-gradient(var(--dot)_1px,transparent_1px)] [background-size:24px_24px]';
const JUMP = 'inline-block text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]';

export function ProjectOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { works, loading } = useContent();
  const boxRef = useModal<HTMLDivElement>();
  const [heroIndex, setHeroIndex] = useState<number | null>(null);
  const p = findWork(works, slug);

  useEffect(() => {
    setHeroIndex(null);
    boxRef.current?.scrollTo(0, 0);
  }, [slug, boxRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && heroIndex === null) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, heroIndex]);

  const idx = p ? workIndex(works, slug) : -1;
  const prev = idx > 0 ? works[idx - 1] : null;
  const next = idx >= 0 && idx < works.length - 1 ? works[idx + 1] : null;
  const galleryImages = p ? (p.images ?? []).filter((src) => src && src !== p.cover) : [];
  const galleryCaptions = p ? galleryImages.map((_, i) => p.stills[i] ?? '') : [];
  const heroImages = p ? ([p.cover, ...galleryImages].filter(Boolean) as string[]) : [];
  const heroCaptions = p ? [p.name, ...galleryCaptions] : [];
  const repo = p && p.repo && /^https?:\/\//i.test(p.repo) ? p.repo : null;

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={p ? p.name : 'Project'}
      className="ov-enter fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-bg outline-none"
    >
      <ClipDefs />
      <div className="sticky top-0 z-[70] flex items-center justify-between gap-6 border-b border-line bg-[var(--nav-bg)] px-10 py-4 backdrop-blur-[12px] max-[900px]:px-[22px]">
        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted">
          {p ? p.num + ' · ' + p.year : 'Project'}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="group flex h-11 cursor-pointer items-center gap-3 font-sans text-[11px] uppercase tracking-[0.12em] text-fg-dim transition-colors hover:text-fg"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
          Back to the story
        </button>
      </div>

      {!p && (
        <section className="mx-auto max-w-[900px] px-10 py-24 max-[900px]:px-[22px]">
          {loading ? (
            <div className="space-y-5">
              <Skel className="h-[13px] w-[120px] rounded" />
              <Skel className="h-[64px] w-[min(560px,90%)] rounded-lg" />
              <Skel className="h-[20px] w-[min(420px,75%)] rounded" />
              <Skel className="mt-6 block aspect-[4/3] w-full max-w-[520px] rounded-lg" />
            </div>
          ) : (
            <>
              <h2 className="text-[48px] font-medium tracking-[-0.02em]">Not found.</h2>
              <p className="mt-3.5 text-fg-dim">No project matches "{slug}".</p>
            </>
          )}
        </section>
      )}

      {p && (
        <>
          <section className={'relative px-10 pb-20 pt-16 max-[900px]:px-[22px] max-[900px]:pb-12 ' + BOARD}>
            <div className="mx-auto grid max-w-[1320px] grid-cols-[1.04fr_0.96fr] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-12">
              <div className="max-[900px]:order-2">
                <p className="mb-5 text-[13px] uppercase tracking-[0.1em] text-accent-2">{p.tag}</p>
                <h2 className="font-sans text-[clamp(52px,7.4vw,108px)] font-bold leading-[0.94] tracking-[-0.03em] text-fg">{p.name}</h2>
                <p className="mt-6 max-w-[42ch] text-[clamp(18px,2vw,24px)] font-light leading-[1.4] text-fg-dim">
                  <b className="font-normal text-fg">{p.brief}</b>
                </p>
                {repo && (
                  <div className="mt-9 flex flex-wrap gap-3.5">
                    <a
                      className="rounded-lg border border-line bg-bg-2 px-[18px] py-2.5 font-sans text-[13px] tracking-[0.04em] text-fg transition-colors hover:border-accent hover:text-accent"
                      href={repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repository →
                    </a>
                  </div>
                )}
              </div>

              <div className="relative pt-2 max-[900px]:order-1">
                <div className="absolute left-[4%] right-[4%] top-4 z-0 h-px bg-[linear-gradient(90deg,transparent,var(--tape)_8%,var(--accent)_50%,var(--tape)_92%,transparent)] shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />
                <span className="absolute left-[4%] top-4 z-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#231f1a]" />
                <span className="absolute right-[4%] top-4 z-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#231f1a]" />
                <div className="relative mx-auto mt-4 w-full max-w-[480px] origin-top -rotate-2">
                  <Clip className="absolute left-[24%] top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
                  <Clip className="absolute left-[76%] top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
                  <button
                    type="button"
                    disabled={heroImages.length === 0}
                    onClick={() => setHeroIndex(0)}
                    aria-label={'View ' + p.name + ' image full size'}
                    className="block w-full bg-[#e9e3d6] p-[16px] text-left shadow-[0_34px_70px_-24px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out enabled:cursor-zoom-in enabled:hover:-translate-y-1 max-[560px]:p-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-2">
                      <Thumbnail p={p} />
                    </div>
                    <div className="px-1 pt-3 text-center text-[18px] font-medium leading-tight text-[#2a2620]">{p.name}</div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-bg-2 px-10 py-10 max-[900px]:px-[22px] max-[900px]:py-8">
            <div className="mx-auto flex max-w-[1320px] flex-wrap gap-x-12 gap-y-4 text-[14px] max-[560px]:flex-col max-[560px]:gap-3">
              <div><span className="mr-2 text-[11px] uppercase tracking-[0.06em] text-muted">Client</span> <span className="text-fg">{p.client}</span></div>
              <div><span className="mr-2 text-[11px] uppercase tracking-[0.06em] text-muted">Role</span> <span className="text-fg">{p.role}</span></div>
              <div><span className="mr-2 text-[11px] uppercase tracking-[0.06em] text-muted">Stack</span> <span className="text-fg">{p.stack}</span></div>
              <div><span className="mr-2 text-[11px] uppercase tracking-[0.06em] text-muted">Year</span> <span className="text-fg">{String(p.year)}</span></div>
            </div>
          </section>

          {p.body[0] && (
            <section className="px-10 py-24 max-[900px]:px-[22px] max-[900px]:py-14">
              <div className="mx-auto max-w-[720px]">
                <p className="mb-6 text-[11px] uppercase tracking-[0.13em] text-accent-2">Context</p>
                <p className="text-[clamp(18px,2.2vw,26px)] leading-[1.6] text-fg">{p.body[0]}</p>
              </div>
            </section>
          )}

          <Gallery images={galleryImages} captions={galleryCaptions} name={p.name} />

          <section className="bg-bg-2 px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
            <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
              <div className="group">
                <span className="mb-3 block text-[11px] uppercase tracking-[0.11em] text-accent-2">{prev ? '← Previous' : '← Back'}</span>
                {prev ? (
                  <a className={JUMP} href={workHref(prev.slug)}>{prev.name}</a>
                ) : (
                  <button type="button" className={JUMP + ' cursor-pointer'} onClick={onClose}>All projects</button>
                )}
              </div>
              <div className="group text-right max-[900px]:text-left">
                <span className="mb-3 block text-[11px] uppercase tracking-[0.11em] text-accent-2">{next ? 'Next →' : '→ Back'}</span>
                {next ? (
                  <a className={JUMP} href={workHref(next.slug)}>{next.name}</a>
                ) : (
                  <button type="button" className={JUMP + ' cursor-pointer'} onClick={onClose}>All projects</button>
                )}
              </div>
            </div>
          </section>

          {heroIndex !== null && heroImages.length > 0 && (
            <Lightbox
              images={heroImages}
              captions={heroCaptions}
              name={p.name}
              index={heroIndex}
              onClose={() => setHeroIndex(null)}
              onNav={(d) => setHeroIndex((i) => ((i ?? 0) + d + heroImages.length) % heroImages.length)}
            />
          )}
        </>
      )}
    </div>
  );
}
