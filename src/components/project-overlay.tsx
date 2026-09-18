import { useEffect, useLayoutEffect, useState } from 'react';
import { animate, createScope } from 'animejs';
import { useContent, findWork, workIndex } from '../content/use-content';
import { useModal } from '../hooks/use-modal';
import { useDismiss } from '../hooks/use-dismiss';
import { workHref } from '../utils/work-link';
import { img } from '../lib/img';
import { flipFrom, takeFlipOrigin } from '../lib/flip';
import { MEDIA } from '../lib/motion';
import { Thumbnail } from './thumbnail';
import { SmartImage } from './smart-image';
import { Lightbox } from './lightbox';
import { Clip } from './clip';
import { ClipDefs } from './clip-defs';
import { Skel } from './skeleton';

const JUMP = 'inline-block font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]';

export function ProjectOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { works, loading } = useContent();
  const boxRef = useModal<HTMLDivElement>(onClose);
  const dismiss = useDismiss<HTMLDivElement>(onClose, '[data-sheet]');
  const [heroIndex, setHeroIndex] = useState<number | null>(null);
  const p = findWork(works, slug);

  useEffect(() => {
    setHeroIndex(null);
    boxRef.current?.scrollTo(0, 0);
  }, [slug, boxRef]);

  const openSlug = p?.slug ?? null;

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !openSlug) return;

    const hero = box.querySelector<HTMLElement>('[data-hero]');
    const copy = Array.from(box.querySelectorAll('[data-copy]'));
    const origin = takeFlipOrigin();

    const scope = createScope({ root: boxRef as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;

      if (hero && origin) {
        const from = flipFrom(origin, hero.getBoundingClientRect());
        animate(hero, {
          x: [from.x, 0],
          y: [from.y, 0],
          scale: [from.scale, 1],
          rotate: [from.rotate, 0],
          duration: 820,
          ease: 'out(4)',
        });
      }

      copy.forEach((el, i) => {
        (el as HTMLElement).style.animationDelay = `${(origin ? 220 : 60) + i * 70}ms`;
      });
    });

    return () => scope.revert();
  }, [openSlug, boxRef]);

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
      {...dismiss}
      className="fixed inset-0 z-[90] cursor-zoom-out overflow-y-auto overscroll-contain outline-none"
    >
      <ClipDefs />
      <div aria-hidden="true" className="ov-enter fixed inset-0 bg-[var(--scrim)] backdrop-blur-[7px]" />
      <div data-sheet className="sticky top-0 z-[70] flex cursor-auto items-center justify-between gap-6 px-10 py-5 max-[900px]:px-[22px]">
        <button
          type="button"
          onClick={onClose}
          className="group flex h-11 cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim transition-colors hover:text-fg"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
          Back to the board
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {p ? p.num + ' · ' + p.year : 'Project'}
        </span>
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
          <section className="relative -mt-[76px] flex min-h-[100svh] items-center px-10 pb-16 pt-[96px] max-[900px]:px-[22px] max-[900px]:pb-12">
            <div data-sheet className="mx-auto grid w-full max-w-[1240px] cursor-auto grid-cols-[1.05fr_0.95fr] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-12">
              <div className="relative">
                <div data-hero className="relative mx-auto w-full max-w-[480px] origin-top">
                  <Clip className="absolute left-[24%] top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
                  <Clip className="absolute left-[76%] top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
                  <button
                    type="button"
                    disabled={heroImages.length === 0}
                    onClick={() => setHeroIndex(0)}
                    aria-label={'View ' + p.name + ' image full size'}
                    className="block w-full bg-paper p-[16px] text-left shadow-[0_34px_70px_-24px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out enabled:cursor-zoom-in enabled:hover:-translate-y-1 max-[560px]:p-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-2">
                      <Thumbnail p={p} />
                    </div>
                    <div className="px-1 pt-3 text-center text-[18px] font-medium leading-tight text-paper-ink">{p.name}</div>
                  </button>
                </div>
              </div>

              <div>
                <p data-copy className="mb-5 font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">{p.tag}</p>
                <h2 data-copy className="font-display text-[clamp(44px,5.6vw,84px)] font-bold leading-[0.96] tracking-[-0.015em] text-fg">{p.name}</h2>
                <p data-copy className="mt-6 max-w-[38ch] text-[clamp(18px,1.8vw,22px)] font-light leading-[1.45] text-fg-dim">
                  <b className="font-normal text-fg">{p.brief}</b>
                </p>
                {repo && (
                  <div data-copy className="mt-9 flex flex-wrap gap-3.5">
                    <a
                      className="rounded-lg border border-line bg-bg-2 px-[18px] py-2.5 font-mono text-[13px] tracking-[0.04em] text-fg transition-colors hover:border-accent hover:text-accent"
                      href={repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repository →
                    </a>
                  </div>
                )}

                {galleryImages.length > 0 && (
                  <div data-copy className="mt-10">
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {heroImages.length} frames
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {galleryImages.map((src, j) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setHeroIndex(j + 1)}
                          aria-label={'View frame ' + (j + 2) + ' of ' + p.name}
                          className="h-[62px] w-[82px] shrink-0 cursor-zoom-in overflow-hidden rounded-sm border border-line bg-bg-2 transition-colors hover:border-accent"
                        >
                          <SmartImage src={img(src, 320)} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div data-sheet className="relative cursor-auto rounded-t-xl border-t border-line bg-bg pb-px">
          <section className="px-10 py-10 max-[900px]:px-[22px] max-[900px]:py-8">
            <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-12 gap-y-4 text-[14px] max-[560px]:flex-col max-[560px]:gap-3">
              <div><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Client</span> <span className="text-fg">{p.client}</span></div>
              <div><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Role</span> <span className="text-fg">{p.role}</span></div>
              <div><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Stack</span> <span className="text-fg">{p.stack}</span></div>
              <div><span className="mr-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Year</span> <span className="text-fg">{String(p.year)}</span></div>
            </div>
          </section>

          {p.body[0] && (
            <section className="px-10 py-24 max-[900px]:px-[22px] max-[900px]:py-14">
              <div className="mx-auto max-w-[720px]">
                <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.13em] text-accent-2">Context</p>
                <p className="text-[clamp(18px,2.2vw,26px)] leading-[1.6] text-fg">{p.body[0]}</p>
              </div>
            </section>
          )}


          <section className="border-t border-line px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
            <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
              <div className="group">
                <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.11em] text-accent-2">{prev ? '← Previous' : '← Back'}</span>
                {prev ? (
                  <a className={JUMP} href={workHref(prev.slug)}>{prev.name}</a>
                ) : (
                  <button type="button" className={JUMP + ' cursor-pointer'} onClick={onClose}>All projects</button>
                )}
              </div>
              <div className="group text-right max-[900px]:text-left">
                <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.11em] text-accent-2">{next ? 'Next →' : '→ Back'}</span>
                {next ? (
                  <a className={JUMP} href={workHref(next.slug)}>{next.name}</a>
                ) : (
                  <button type="button" className={JUMP + ' cursor-pointer'} onClick={onClose}>All projects</button>
                )}
              </div>
            </div>
          </section>
          </div>

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
