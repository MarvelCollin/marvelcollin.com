import { useMemo, useState } from 'react';
import { useContent } from '../content/use-content';
import { orgLogo } from '../lib/icons';
import { SmartImage } from '../components/smart-image';
import { Reveal } from '../components/reveal';
import { EntrySkeleton } from '../components/skeleton';
import { ProjectGrid } from '../components/project-grid';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa6';

function OrgMark({ logo, dark = false, kind = 'work' }: { logo: string | null; dark?: boolean; kind?: 'work' | 'school' }) {
  const Icon = kind === 'school' ? FaGraduationCap : FaBriefcase;
  return (
    <div className={'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line p-1.5 ' + (dark ? 'bg-bg' : 'bg-bg-2')}>
      {logo ? (
        <SmartImage src={logo} alt="" wrapClassName="h-full w-full rounded" className="h-full w-full object-contain" />
      ) : (
        <Icon size={17} className="text-muted opacity-60" aria-hidden="true" />
      )}
    </div>
  );
}

export function Work() {
  const { works: PROJECTS, loading, experience: HISTORY, education: EDUCATION } = useContent();
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.tag === filter)),
    [PROJECTS, filter],
  );
  const filters = [
    { key: 'all', label: `All (${PROJECTS.length})` },
    { key: 'client', label: `Client (${PROJECTS.filter((p) => p.tag === 'client').length})` },
    { key: 'product', label: `Product (${PROJECTS.filter((p) => p.tag === 'product').length})` },
    { key: 'personal', label: `Personal (${PROJECTS.filter((p) => p.tag === 'personal').length})` },
  ];

  return (
    <div data-screen-label="Work">
      <section className="px-10 pt-[160px] pb-8 max-[900px]:px-[22px] max-[900px]:pt-[100px]">
        <div className="mx-auto max-w-[1320px]">
          <h1 className="font-sans text-[clamp(36px,5vw,64px)] font-semibold leading-[1.06] tracking-[-0.025em]">
            Work
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-dim">
            Experience, studies, and {PROJECTS.length} projects.
          </p>
        </div>
      </section>

      <Reveal as="section" className="px-10 pb-20 max-[900px]:px-[22px] max-[900px]:pb-14">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-10 text-[13px] uppercase tracking-[0.1em] text-muted">Experience</p>
          {loading && HISTORY.length === 0 && <EntrySkeleton count={3} />}
          <div className="space-y-12">
            {HISTORY.map((j, i) => {
              const logo = orgLogo(j.where);
              return (
                <div key={i}>
                  <div className="flex items-center gap-4">
                    <OrgMark logo={logo} />
                    <div>
                      <div className="text-[18px] font-medium leading-[1.3]">{j.role}</div>
                      <div className="mt-0.5 text-[14px] text-fg-dim">{j.where} · {j.yr}</div>
                    </div>
                  </div>
                  {j.note && <p className="mt-3 max-w-[54ch] text-[15px] leading-[1.6] text-fg-dim pl-[60px] max-[900px]:pl-0">{j.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="bg-bg-2 px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-10 text-[13px] uppercase tracking-[0.1em] text-muted">Education</p>
          {loading && EDUCATION.length === 0 && <EntrySkeleton count={2} />}
          <div className="space-y-10">
            {EDUCATION.map((e) => {
              const logo = orgLogo(e.school);
              return (
                <div key={e.id}>
                  <div className="flex items-center gap-4">
                    <OrgMark logo={logo} dark kind="school" />
                    <div>
                      <div className="text-[18px] font-medium leading-[1.3]">{e.degree}</div>
                      <div className="mt-0.5 text-[14px] text-fg-dim">{e.school} · {e.yr}</div>
                    </div>
                  </div>
                  {e.note && <p className="mt-3 max-w-[54ch] text-[15px] leading-[1.6] text-fg-dim pl-[60px] max-[900px]:pl-0">{e.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <section className="px-10 pt-24 pb-8 max-[900px]:px-[22px] max-[900px]:pt-16">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="font-sans text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            Projects
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-dim">
            {PROJECTS.length} projects from 2021 to 2025.
          </p>
        </div>
      </section>

      <section className="px-10 pb-6 max-[900px]:px-[22px]">
        <div className="mx-auto flex max-w-[1320px] flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                'cursor-pointer rounded-full border px-4 py-[7px] text-xs tracking-[0.04em] transition-colors ' +
                (filter === f.key
                  ? 'border-fg bg-fg text-bg'
                  : 'border-line text-fg-dim hover:border-muted hover:text-fg')
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <Reveal as="section" className="bg-bg-2 px-10 py-12 max-[900px]:px-[22px]">
        <div className="mx-auto max-w-[1320px]">
          <ProjectGrid works={filtered} loading={loading} />
        </div>
      </Reveal>
    </div>
  );
}
