import { useEffect } from 'react';
import type { Project } from '../../../types/content';
import { useContent, findWork, workIndex } from '../../../content/use-content';
import { useModal } from '../../../hooks/use-modal';
import { useDismiss } from '../../../hooks/use-dismiss';
import { Lightbox } from '../../ui/lightbox';
import { ClipDefs } from '../../ui/clip-defs';
import { Skel } from '../../ui/skeleton';
import { ProjectHero } from './hero';
import { ProjectDetails } from './details';
import { useFrames } from './use-frames';
import { useFlipIn } from './use-flip-in';

function TopBar({ p, onClose }: { p?: Project; onClose: () => void }) {
  return (
    <div data-sheet className="sticky top-0 z-[70] flex cursor-auto items-center justify-between gap-6 px-10 py-5 max-[900px]:px-[22px]">
      <button
        type="button"
        onClick={onClose}
        className="group flex h-11 cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim transition-colors hover:text-fg"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
        Back to the board
      </button>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{p ? p.num + ' · ' + p.year : 'Project'}</span>
    </div>
  );
}

function Missing({ slug, loading }: { slug: string; loading: boolean }) {
  return (
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
  );
}

export function ProjectOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { works, loading } = useContent();
  const boxRef = useModal<HTMLDivElement>(onClose);
  const dismiss = useDismiss<HTMLDivElement>(onClose, '[data-sheet]');
  const p = findWork(works, slug);
  const frames = useFrames(p, slug);
  const idx = p ? workIndex(works, slug) : -1;

  useEffect(() => {
    boxRef.current?.scrollTo(0, 0);
  }, [slug, boxRef]);

  useFlipIn(boxRef, p?.slug ?? null);

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
      <div aria-hidden="true" className="ov-enter fixed inset-0 bg-[var(--scrim)]" />
      <TopBar p={p} onClose={onClose} />
      {!p && <Missing slug={slug} loading={loading} />}
      {p && (
        <>
          <ProjectHero p={p} frames={frames} />
          <ProjectDetails p={p} prev={works[idx - 1] ?? null} next={works[idx + 1] ?? null} onClose={onClose} />
          {frames.viewing !== null && frames.images.length > 0 && (
            <Lightbox
              images={frames.images}
              captions={frames.captions}
              name={p.name}
              index={frames.viewing}
              onClose={frames.close}
              onNav={frames.nav}
            />
          )}
        </>
      )}
    </div>
  );
}
