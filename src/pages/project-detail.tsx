import { useContent, findWork, workIndex } from '../content/use-content';
import { Thumbnail } from '../components/thumbnail';
import { Gallery } from '../components/gallery';
import { Reveal } from '../components/reveal';
import { Clip } from '../components/clip';
import { ClipDefs } from '../components/clip-defs';

const BACK_CLASS =
  'group fixed left-10 top-[84px] z-[60] font-sans text-[11px] uppercase tracking-[0.12em] text-fg-dim transition-colors hover:text-fg max-[900px]:left-[22px]';
const PAGE_CLASS =
  'mx-auto max-w-[900px] px-10 pt-[140px] pb-20 max-[900px]:px-[22px] max-[900px]:pt-[100px] max-[560px]:pt-[92px]';
const BOARD =
  'bg-[radial-gradient(var(--dot)_1px,transparent_1px)] [background-size:24px_24px]';

export function ProjectDetail({ slug }: { slug: string }) {
  const { works: PROJECTS, loading } = useContent();
  const p = findWork(PROJECTS, slug);
  if (!p) {
    if (loading) {
      return (
        <div data-screen-label="Project">
          <section className={PAGE_CLASS}>
            <p className="text-sm text-fg-dim">Loading…</p>
          </section>
        </div>
      );
    }
    return (
      <div data-screen-label="Project · 404">
        <section className={PAGE_CLASS}>
          <a className={BACK_CLASS} href="/work">
            <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">←</span> All projects
          </a>
          <h1 className="text-[48px] font-medium tracking-[-0.02em]">Not found.</h1>
          <p className="mt-3.5 text-fg-dim">No project matches "{slug}".</p>
        </section>
      </div>
    );
  }

  const idx = workIndex(PROJECTS, slug);
  const prev = idx > 0 ? PROJECTS[idx - 1] : null;
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;
  const sections = [{ label: 'Context', body: p.body[0] }].filter((a) => a.body);
  const repo = p.repo && /^https?:\/\//i.test(p.repo) ? p.repo : null;
  const galleryImages = (p.images ?? []).filter((src) => src && src !== p.cover);
  const galleryCaptions = galleryImages.map((_, i) => p.stills[i] ?? '');

  return (
    <div data-screen-label={'Project · ' + p.name}>
      <ClipDefs />
      <a className={BACK_CLASS} href="/work">
        <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">←</span> All projects
      </a>
      <div className="relative overflow-hidden">
        <section className={'relative px-10 pb-20 pt-[150px] max-[900px]:px-[22px] max-[900px]:pb-12 max-[900px]:pt-[120px] ' + BOARD}>
          <div className="mx-auto grid max-w-[1320px] grid-cols-[1.04fr_0.96fr] items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-12">
            <div className="max-[900px]:order-2">
              <p className="mb-4 text-[13px] uppercase tracking-[0.1em] text-muted">{p.tag}</p>
              <div className="mb-5 font-sans text-[12px] uppercase tracking-[0.14em] text-muted">{p.num} · {p.year}</div>
              <h1 className="font-sans text-[clamp(52px,7.4vw,108px)] font-bold leading-[0.94] tracking-[-0.03em] text-fg">{p.name}</h1>
              <p className="mt-6 max-w-[42ch] text-[clamp(18px,2vw,24px)] font-light leading-[1.4] text-fg-dim">
                <b className="font-normal text-fg">{p.brief}</b>
              </p>
              {repo && (
                <div className="mt-9 flex flex-wrap gap-3.5">
                  <a
                    className="rounded-lg border border-line bg-bg-2 px-[18px] py-2.5 font-sans text-[13px] tracking-[0.04em] text-fg transition-colors hover:border-fg hover:text-fg"
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
              <div className="absolute left-[4%] right-[4%] top-4 z-0 h-px bg-[linear-gradient(90deg,transparent,rgba(220,189,110,0.5)_8%,rgba(220,189,110,0.6)_50%,rgba(220,189,110,0.5)_92%,transparent)] shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />
              <span className="absolute left-[4%] top-4 z-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#231f1a]" />
              <span className="absolute right-[4%] top-4 z-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#231f1a]" />
              <div className="relative mx-auto mt-4 w-full max-w-[480px] origin-top -rotate-2">
                <Clip className="absolute left-[24%] top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
                <Clip className="absolute left-[76%] top-[-16px] z-20 h-[40px] w-[20px] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
                <div className="bg-[#e9e3d6] p-[16px] shadow-[0_34px_70px_-24px_rgba(0,0,0,0.85)] max-[560px]:p-3">
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-2">
                    <Thumbnail p={p} />
                  </div>
                  <div className="px-1 pt-3 text-center text-[18px] font-medium leading-tight text-[#2a2620]">{p.name}</div>
                </div>
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

        {sections.map((section, i) => (
          <Reveal as="section" className="px-10 py-24 max-[900px]:px-[22px] max-[900px]:py-14" key={i}>
            <div className="mx-auto max-w-[720px]">
              <p className="mb-6 text-[11px] uppercase tracking-[0.13em] text-muted">{section.label}</p>
              <p className="text-[clamp(18px,2.2vw,26px)] leading-[1.6] text-fg">{section.body}</p>
            </div>
          </Reveal>
        ))}

        <Gallery images={galleryImages} captions={galleryCaptions} name={p.name} />

        <Reveal as="section" className="bg-bg-2 px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
          <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
            <div className="group">
              <span className="mb-3 block text-[11px] uppercase tracking-[0.11em] text-muted">{prev ? '← Previous' : '← Back'}</span>
              {prev ? (
                <a className="inline-block text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]" href={'/work/' + prev.slug}>{prev.name}</a>
              ) : (
                <a className="inline-block text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]" href="/work">All projects</a>
              )}
            </div>
            <div className="group text-right max-[900px]:text-left">
              <span className="mb-3 block text-[11px] uppercase tracking-[0.11em] text-muted">{next ? 'Next →' : '→ Back'}</span>
              {next ? (
                <a className="inline-block text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]" href={'/work/' + next.slug}>{next.name}</a>
              ) : (
                <a className="inline-block text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-fg transition-colors group-hover:text-accent-soft max-[560px]:text-[22px]" href="/work">All projects</a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
