import type { Project } from '../../../types/content';
import { workHref } from '../../../lib/work-link';

const JUMP =
  'inline-block font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]';

const EYEBROW = 'font-mono text-[11px] uppercase text-accent-2';

function Facts({ p }: { p: Project }) {
  const facts: [string, string][] = [
    ['Client', p.client],
    ['Role', p.role],
    ['Stack', p.stack],
    ['Year', String(p.year)],
  ];

  return (
    <section className="px-10 py-10 max-[900px]:px-[22px] max-[900px]:py-8">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-12 gap-y-4 text-[14px] max-[560px]:flex-col max-[560px]:gap-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{label}</span>
            <span className="text-fg">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Context({ text }: { text: string }) {
  return (
    <section className="px-10 py-24 max-[900px]:px-[22px] max-[900px]:py-14">
      <div className="mx-auto max-w-[720px]">
        <p className={EYEBROW + ' mb-6 tracking-[0.13em]'}>Context</p>
        <p className="text-[clamp(18px,2.2vw,26px)] leading-[1.6] text-fg">{text}</p>
      </div>
    </section>
  );
}

function Jump({ to, label, back, onClose, end }: { to: Project | null; label: string; back: string; onClose: () => void; end?: boolean }) {
  return (
    <div className={'group' + (end ? ' text-right max-[900px]:text-left' : '')}>
      <span className={EYEBROW + ' mb-3 block tracking-[0.11em]'}>{to ? label : back}</span>
      {to ? (
        <a className={JUMP} href={workHref(to.slug)}>
          {to.name}
        </a>
      ) : (
        <button type="button" className={JUMP + ' cursor-pointer'} onClick={onClose}>
          All projects
        </button>
      )}
    </div>
  );
}

export function ProjectDetails({
  p,
  prev,
  next,
  onClose,
}: {
  p: Project;
  prev: Project | null;
  next: Project | null;
  onClose: () => void;
}) {
  return (
    <div data-sheet className="relative cursor-auto rounded-t-xl border-t border-line bg-bg pb-px">
      <Facts p={p} />
      {p.body[0] && <Context text={p.body[0]} />}
      <section className="border-t border-line px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
        <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
          <Jump to={prev} label="← Previous" back="← Back" onClose={onClose} />
          <Jump to={next} label="Next →" back="→ Back" onClose={onClose} end />
        </div>
      </section>
    </div>
  );
}
