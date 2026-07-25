import { useMemo, useState } from 'react';
import { useContent } from '../content/use-content';
import { img } from '../lib/img';
import { orgLogo } from '../lib/icons';
import { Reveal } from '../components/reveal';
import { SkillBalls } from '../components/skill-balls';

const WEB_KEYS = ['typescript', 'javascript', 'react', 'next', 'nuxt', 'vue', 'angular', 'svelte', 'node', 'express', 'nest', 'tailwind', '.net', 'c#', 'php', 'laravel', 'go', 'java', 'kotlin', 'html', 'css', 'graphql', 'rest', 'supabase', 'prisma', 'firebase', 'mongodb', 'sqlite', 'redis', 'sql'];
const AI_KEYS = ['python', 'tensorflow', 'pytorch', 'r language', 'machine learning', 'deep learning', 'nlp', 'data', 'scikit', 'pandas', 'numpy', 'opencv', 'keras'];

function classifySkill(name: string): string {
  const n = name.toLowerCase();
  if (AI_KEYS.some(k => n.includes(k))) return 'ai';
  if (WEB_KEYS.some(k => n.includes(k))) return 'web';
  return 'other';
}

export function About() {
  const { skills: SKILLS, experience: HISTORY, recognition: AWARDS, education: EDUCATION } = useContent();
  const [skillFilter, setSkillFilter] = useState('all');

  const classified = useMemo(() => SKILLS.map(s => ({ ...s, cat: classifySkill(s.name) })), [SKILLS]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: classified.length, web: 0, ai: 0, other: 0 };
    classified.forEach(s => c[s.cat]++);
    return c;
  }, [classified]);

  const filtered = useMemo(
    () => skillFilter === 'all' ? classified : classified.filter(s => s.cat === skillFilter),
    [classified, skillFilter],
  );

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web Dev' },
    { key: 'ai', label: 'AI / ML' },
    { key: 'other', label: 'Other' },
  ].filter(f => f.key === 'all' || counts[f.key] > 0);

  return (
    <div data-screen-label="About">
      <section className="px-10 pt-[160px] pb-24 max-[900px]:px-[22px] max-[900px]:pt-[100px] max-[900px]:pb-16">
        <div className="mx-auto max-w-[900px]">
          <h1 className="font-sans text-[clamp(36px,5vw,64px)] font-semibold leading-[1.06] tracking-[-0.025em]">About</h1>
          <p className="mt-8 max-w-[56ch] text-[19px] leading-[1.65] text-fg-dim">
            Computer Science student at BINUS University and a full-stack engineer. I build web applications and care about the details that make them feel right.
          </p>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.65] text-fg-dim">
            I work across the stack: TypeScript and React on the front, Go, .NET Core, and PHP on the back, with microservices and RabbitMQ in production on the BINUS laboratory platform. On the side I build games with Three.js, ML experiments in Python, and award-winning robotics.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-fg-dim">
            <span>Jakarta, Indonesia</span>
            <span className="text-line">·</span>
            <a className="text-accent-soft transition-colors hover:text-fg" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">GitHub</a>
            <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </section>

      <Reveal as="section" className="bg-bg-2 px-10 py-20 max-[900px]:px-[22px] max-[900px]:py-14">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <p className="text-[13px] uppercase tracking-[0.1em] text-muted">Skills</p>
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setSkillFilter(f.key)}
                  className={
                    'cursor-pointer rounded-full border px-3.5 py-[5px] text-[12px] tracking-[0.04em] transition-colors ' +
                    (skillFilter === f.key
                      ? 'border-fg bg-fg text-bg'
                      : 'border-line text-fg-dim hover:border-muted hover:text-fg')
                  }
                >
                  {f.label} ({counts[f.key]})
                </button>
              ))}
            </div>
          </div>
          <SkillBalls skills={filtered} />
        </div>
      </Reveal>

      <Reveal as="section" className="px-10 py-24 max-[900px]:px-[22px] max-[900px]:py-16">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-10 text-[13px] uppercase tracking-[0.1em] text-muted">Experience</p>
          <div className="space-y-12">
            {HISTORY.map((j, i) => {
              const logo = orgLogo(j.where);
              return (
                <div key={i}>
                  <div className="flex items-center gap-4">
                    {logo && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-bg-2 p-1.5">
                        <img src={logo} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
                      </div>
                    )}
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
          <div className="space-y-10">
            {EDUCATION.map((e) => {
              const logo = orgLogo(e.school);
              return (
                <div key={e.id}>
                  <div className="flex items-center gap-4">
                    {logo && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-bg p-1.5">
                        <img src={logo} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
                      </div>
                    )}
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

      <Reveal as="section" className="px-10 py-24 max-[900px]:px-[22px] max-[900px]:py-16">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-10 text-[13px] uppercase tracking-[0.1em] text-muted">Licenses & Awards</p>
          <div className="space-y-6">
            {AWARDS.map((a) => (
              <div key={a.id}>
                <div className="flex items-baseline gap-4 max-[560px]:flex-col max-[560px]:gap-1">
                  <span className="shrink-0 text-[13px] tabular-nums text-muted">{a.yr}</span>
                  <span className="text-[16px] font-medium">{a.name}</span>
                  <span className="text-[14px] text-fg-dim max-[560px]:hidden">— {a.where}</span>
                  <span className="hidden text-[14px] text-fg-dim max-[560px]:block">{a.where}</span>
                </div>
                {a.image && (
                  <img
                    className="mt-4 max-h-[280px] w-full max-w-[520px] rounded-lg border border-line bg-bg-2 object-contain object-left"
                    src={img(a.image, 1000)}
                    alt={a.name}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
