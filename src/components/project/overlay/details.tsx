import type { Project } from '../../../types/content';
import { workHref } from '../../../lib/work-link';
import { useRepoStats } from '../../../hooks/use-repo-stats';
import { percent, shares, stackIcons } from '../../../lib/languages';
import { TechIcon } from '../../ui/tech-icon';

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

function Languages({ p }: { p: Project }) {
  const stats = useRepoStats(p.repo);
  const parts = stats?.languages ? shares(stats.languages) : [];
  const built = parts.length ? [] : stackIcons(p.stack);
  if (!parts.length && !built.length) return null;

  return (
    <section className="px-10 pb-12 max-[900px]:px-[22px] max-[900px]:pb-8">
      <div className="mx-auto max-w-[1240px]">
        <p className={EYEBROW + ' mb-4 tracking-[0.13em]'}>{parts.length ? 'Languages' : 'Built with'}</p>
        {parts.length > 0 && (
          <div
            role="img"
            aria-label={'Languages: ' + parts.map((s) => `${s.name} ${percent(s.share)}`).join(', ')}
            className="flex h-2 max-w-[720px] gap-[2px] overflow-hidden rounded-full"
          >
            {parts.map((s) => (
              <span key={s.name} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${s.share * 100}%`, background: s.color }} />
            ))}
          </div>
        )}
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[14px]">
          {parts.map((s) => (
            <li key={s.name} className="flex items-center gap-2">
              {s.icon ? (
                <TechIcon name={s.icon} size={16} />
              ) : (
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              )}
              <span className="text-fg">{s.name}</span>
              <span className="font-mono text-[12px] tabular-nums text-muted">{percent(s.share)}</span>
            </li>
          ))}
          {built.map((name) => (
            <li key={name} className="flex items-center gap-2">
              <TechIcon name={name} size={16} />
              <span className="text-fg">{name}</span>
            </li>
          ))}
        </ul>
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
      <Languages p={p} />
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
