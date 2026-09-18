import type { Project } from '../../../types/content';
import { Clip } from '../../ui/clip';
import { FrameCarousel } from './carousel';
import { FrameStrip } from './frame-strip';
import type { useFrames } from './use-frames';

const CLIP = 'absolute top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]';

const safeLink = (url?: string) => (url && /^https?:\/\//i.test(url) ? url : null);

function Copy({ p }: { p: Project }) {
  const repo = safeLink(p.repo);

  return (
    <div>
      <p data-copy className="mb-5 font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">
        {p.tag}
      </p>
      <h2 data-copy className="font-display text-[clamp(44px,5.6vw,84px)] font-bold leading-[0.96] tracking-[-0.015em] text-fg">
        {p.name}
      </h2>
      <p data-copy className="mt-6 max-w-[38ch] text-[clamp(18px,1.8vw,22px)] font-light leading-[1.45] text-fg">
        {p.brief}
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
    </div>
  );
}

export function ProjectHero({ p, frames }: { p: Project; frames: ReturnType<typeof useFrames> }) {
  return (
    <section className="relative -mt-[76px] flex min-h-[100svh] items-center px-10 pb-16 pt-[96px] max-[900px]:px-[22px] max-[900px]:pb-12">
      <div
        data-sheet
        className="mx-auto grid w-full max-w-[1240px] cursor-auto grid-cols-[1.05fr_0.95fr] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-12"
      >
        <div className="relative">
          <div data-hero className="relative mx-auto w-full max-w-[480px] origin-top will-change-transform">
            <Clip className={CLIP + ' left-[24%]'} />
            <Clip className={CLIP + ' left-[76%]'} />
            <FrameCarousel p={p} images={frames.images} slide={frames.slide} onStep={frames.step} onOpen={frames.open} />
          </div>
          <div data-copy>
            <FrameStrip name={p.name} images={frames.images} slide={frames.slide} onSlide={frames.setSlide} />
          </div>
        </div>
        <Copy p={p} />
      </div>
    </section>
  );
}
