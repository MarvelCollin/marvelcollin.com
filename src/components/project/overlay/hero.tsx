import { FaCodeFork, FaStar } from 'react-icons/fa6';
import type { Project } from '../../../types/content';
import { useRepoStats } from '../../../hooks/use-repo-stats';
import { ago, compact, type RepoStats } from '../../../lib/api/github';
import { jumpTo, paperAnchor, paperFor } from '../../../lib/papers';
import { clientOf } from '../../../lib/client';
import { Clip } from '../../ui/clip';
import { FrameCarousel } from './carousel';
import { FrameStrip } from './frame-strip';
import type { useFrames } from './use-frames';

const CLIP = 'absolute top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]';

const safeLink = (url?: string) => (url && /^https?:\/\//i.test(url) ? url : null);

function RepoMeta({ stats }: { stats: RepoStats }) {
  const updated = ago(stats.pushedAt);
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] tabular-nums tracking-[0.04em] text-fg-dim">
      <li className="flex items-center gap-1.5">
        <FaStar size={12} className="text-accent" aria-hidden="true" />
        <span className="text-fg">{compact(stats.stars)}</span> {stats.stars === 1 ? 'star' : 'stars'}
      </li>
      {stats.forks > 0 && (
        <li className="flex items-center gap-1.5">
          <FaCodeFork size={11} className="text-accent-2" aria-hidden="true" />
          <span className="text-fg">{compact(stats.forks)}</span> {stats.forks === 1 ? 'fork' : 'forks'}
        </li>
      )}
      {updated && <li>Updated {updated}</li>}
    </ul>
  );
}

function Copy({ p }: { p: Project }) {
  const repo = safeLink(p.repo);
  const live = safeLink(p.live);
  const stats = useRepoStats(repo);
  const paper = paperFor(p);
  const client = clientOf(p);

  return (
    <div>
      <p data-copy className="mb-5 font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">
        {p.tag}
        {client && <span className="text-fg-dim"> · {client}</span>}
      </p>
      <h2 data-copy className="font-display text-[clamp(44px,5.6vw,84px)] font-bold leading-[0.96] tracking-[-0.015em] text-fg">
        {p.name}
      </h2>
      <p data-copy className="mt-6 max-w-[38ch] text-[clamp(18px,1.8vw,22px)] font-light leading-[1.45] text-fg">
        {p.brief}
      </p>
      {(repo || live) && (
        <div data-copy className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex flex-wrap gap-3">
            {live && (
              <a
                className="rounded-lg border border-accent/60 bg-accent/10 px-[18px] py-2.5 font-mono text-[13px] tracking-[0.04em] text-accent-soft transition-colors hover:bg-accent hover:text-accent-ink"
                href={live}
                target="_blank"
                rel="noreferrer"
              >
                Live site ↗
              </a>
            )}
            {repo && (
              <a
                className="rounded-lg border border-line bg-bg-2 px-[18px] py-2.5 font-mono text-[13px] tracking-[0.04em] text-fg transition-colors hover:border-accent hover:text-accent"
                href={repo}
                target="_blank"
                rel="noreferrer"
              >
                Repository →
              </a>
            )}
          </div>
          {stats && <RepoMeta stats={stats} />}
        </div>
      )}
      {paper && (
        <a
          data-copy
          href={'#' + paperAnchor(paper)}
          onClick={(e) => {
            e.preventDefault();
            jumpTo(paperAnchor(paper));
          }}
          className="group mt-8 block max-w-[52ch] rounded-lg border border-line bg-bg-2/60 p-5 transition-colors hover:border-accent/50"
        >
          <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-accent-2">Research paper · {paper.year}</span>
          <span className="mt-2 block text-[15px] leading-[1.5] text-fg">{paper.title}</span>
          <span className="mt-3 block text-[13px] text-accent-soft transition-colors group-hover:text-fg">
            Read it in Research <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </a>
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
