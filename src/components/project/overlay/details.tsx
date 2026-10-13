import type { ReactNode } from 'react';
import { FaBriefcase } from 'react-icons/fa6';
import type { Project } from '../../../types/content';
import { WORK_TAGS } from '../../../content/tags';
import { workHref } from '../../../lib/work-link';
import { clientOf } from '../../../lib/client';
import { orgLogo } from '../../../lib/org-logo';
import { useRepoStats } from '../../../hooks/use-repo-stats';
import { percent, shares } from '../../../lib/languages';
import { skillGlyph } from '../../../lib/skill-logos';
import { TechIcon } from '../../ui/tech-icon';

const JUMP =
  'inline-block font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]';

const EYEBROW = 'font-mono text-[11px] uppercase text-accent-2';
const LABEL = 'font-mono text-[11px] uppercase tracking-[0.12em] text-muted';

const safeLink = (url?: string) => (url && /^https?:\/\//i.test(url) ? url : null);

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0">
      <dt className={LABEL}>{label}</dt>
      <dd className="mt-2.5 text-[15px] leading-[1.5] text-fg">{children}</dd>
    </div>
  );
}

function Languages({ bytes }: { bytes: Record<string, number> }) {
  const parts = shares(bytes);
  if (!parts.length) return null;
  return (
    <>
      <div
        role="img"
        aria-label={'Languages: ' + parts.map((s) => `${s.name} ${percent(s.share)}`).join(', ')}
        className="flex h-2 gap-[2px] overflow-hidden rounded-full"
      >
        {parts.map((s) => (
          <span key={s.name} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${s.share * 100}%`, background: s.color }} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[14px]">
        {parts.map((s) => (
          <li key={s.name} className="flex min-w-0 items-center gap-2">
            {s.icon ? (
              <TechIcon name={s.icon} size={16} />
            ) : (
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            )}
            <span className="truncate">{s.name}</span>
            <span className="ml-auto font-mono text-[12px] tabular-nums text-muted">{percent(s.share)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Sheet({ p }: { p: Project }) {
  const stats = useRepoStats(p.repo);
  const client = clientOf(p);
  const logo = client ? orgLogo(client) : null;
  const tools = p.stack.split(/\s*·\s*/).filter(Boolean);
  const type = WORK_TAGS.find((t) => t.key === p.tag)?.label ?? p.tag;
  const live = safeLink(p.live);
  const repo = safeLink(p.repo);

  return (
    <aside className="self-start rounded-xl border border-line bg-bg-2/50 p-7 min-[1001px]:sticky min-[1001px]:top-[92px] max-[560px]:p-5">
      <p className={EYEBROW + ' mb-6 tracking-[0.13em]'}>Project details</p>
      <dl>
        <Row label="Client">
          <span className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-1.5">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-contain" />
              ) : (
                <FaBriefcase size={18} className="text-paper-dim" aria-hidden="true" />
              )}
            </span>
            <span>{client ?? 'Personal project'}</span>
          </span>
        </Row>
        <Row label="When">{p.year}</Row>
        <Row label="Role">{p.role}</Row>
        <Row label="Type">{type}</Row>
        <Row label="Built with">
          <ul className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-md border border-line bg-bg/60 px-2.5 py-1.5 text-[13px]">
                {'src' in skillGlyph(t) && <TechIcon name={t} size={15} />}
                {t}
              </li>
            ))}
          </ul>
        </Row>
        {stats?.languages && Object.keys(stats.languages).length > 0 && (
          <Row label="Languages">
            <Languages bytes={stats.languages} />
          </Row>
        )}
        {p.result && (
          <Row label="Outcome">
            <span className="text-accent-soft">{p.result}</span>
          </Row>
        )}
        {(live || repo) && (
          <Row label="Links">
            <span className="flex flex-wrap gap-x-5 gap-y-2">
              {live && (
                <a href={live} target="_blank" rel="noreferrer" className="text-accent-soft transition-colors hover:text-fg">
                  Live site ↗
                </a>
              )}
              {repo && (
                <a href={repo} target="_blank" rel="noreferrer" className="text-accent-soft transition-colors hover:text-fg">
                  Repository ↗
                </a>
              )}
            </span>
          </Row>
        )}
      </dl>
    </aside>
  );
}

function About({ p }: { p: Project }) {
  if (!p.body.length) return <div />;
  return (
    <article className="min-w-0">
      <p className={EYEBROW + ' mb-6 tracking-[0.13em]'}>About the project</p>
      {p.body.map((text, i) => (
        <p
          key={i}
          className={
            i === 0
              ? 'max-w-[62ch] text-[clamp(18px,2vw,23px)] leading-[1.6] text-fg'
              : 'mt-6 max-w-[68ch] text-[16px] leading-[1.75] text-fg-dim'
          }
        >
          {text}
        </p>
      ))}
    </article>
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
      <section className="px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-12">
        <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(300px,390px)] gap-16 max-[1000px]:grid-cols-1 max-[1000px]:gap-10">
          <About p={p} />
          <Sheet p={p} />
        </div>
      </section>
      <section className="border-t border-line px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
        <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
          <Jump to={prev} label="← Previous" back="← Back" onClose={onClose} />
          <Jump to={next} label="Next →" back="→ Back" onClose={onClose} end />
        </div>
      </section>
    </div>
  );
}
