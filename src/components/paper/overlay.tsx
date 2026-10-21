import { FaFileLines, FaFolderOpen, FaGithub } from 'react-icons/fa6';
import type { MouseEvent, ReactNode } from 'react';
import { PAPERS } from '../../content/papers';
import { useContent } from '../../content/use-content';
import { useModal } from '../../hooks/use-modal';
import { useDismiss } from '../../hooks/use-dismiss';
import { paperImages, workFor } from '../../lib/papers';
import { workHref } from '../../lib/work-link';
import { setFlipOrigin } from '../../lib/flip';
import { PaperImages } from '../ui/paper-images';

const ACTION =
  'group flex items-center gap-3 rounded-lg border border-line bg-bg-2/60 px-5 py-3 text-[15px] text-fg transition-colors hover:border-accent/50';

function Action({ href, icon, label, onClick }: { href: string; icon: ReactNode; label: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a href={href} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={ACTION}>
      <span className="text-accent-soft transition-colors group-hover:text-fg">{icon}</span>
      {label}
    </a>
  );
}

export function PaperOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { works } = useContent();
  const boxRef = useModal<HTMLDivElement>(onClose);
  const dismiss = useDismiss<HTMLDivElement>(onClose, '[data-sheet]');
  const paper = PAPERS.find((p) => p.slug === slug);
  const work = paper ? workFor(paper, works) : undefined;

  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={paper ? paper.title : 'Research paper'}
      {...dismiss}
      className="fixed inset-0 z-[90] cursor-zoom-out overflow-y-auto overscroll-contain outline-none"
    >
      <div aria-hidden="true" className="ov-enter fixed inset-0 bg-[var(--scrim)]" />
      <div data-sheet className="sticky top-0 z-[70] flex cursor-auto items-center justify-between gap-6 px-10 py-5 max-[900px]:px-[22px]">
        <button
          type="button"
          onClick={onClose}
          className="group flex h-11 cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim transition-colors hover:text-fg"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
          Back
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Research paper{paper && ` · ${paper.year}`}</span>
      </div>
      {!paper && (
        <section data-sheet className="relative mx-auto max-w-[900px] cursor-auto px-10 py-24 max-[900px]:px-[22px]">
          <h2 className="text-[48px] font-medium tracking-[-0.02em]">Not found.</h2>
          <p className="mt-3.5 text-fg-dim">No paper matches "{slug}".</p>
        </section>
      )}
      {paper && (
        <section data-sheet className="ov-enter relative mx-auto max-w-[900px] cursor-auto px-10 pb-24 pt-6 max-[900px]:px-[22px]">
          <PaperImages images={paperImages(paper, work)} sizes="(max-width: 900px) 100vw, 820px" className="mb-10" />
          <h2 className="font-display text-[clamp(26px,2.6vw,38px)] font-bold leading-[1.15] tracking-[-0.015em] text-fg">{paper.title}</h2>
          <p className="mt-4 text-[15px] text-fg-dim">{paper.authors.join(', ')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {work && <Action href={workHref(work.slug)} icon={<FaFolderOpen size={16} aria-hidden="true" />} label="Open case" onClick={(e) => setFlipOrigin(e.currentTarget)} />}
            <Action href={paper.repo} icon={<FaGithub size={16} aria-hidden="true" />} label="Code" />
            {paper.url && <Action href={paper.url} icon={<FaFileLines size={16} aria-hidden="true" />} label="Read paper" />}
          </div>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-[1.65] text-fg-dim">{paper.summary}</p>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {paper.tags.map((t) => (
              <span key={t} className="rounded-full border border-accent-2/25 bg-accent-2/8 px-3 py-1 text-[11px] tracking-[0.04em] text-accent-2">{t}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
