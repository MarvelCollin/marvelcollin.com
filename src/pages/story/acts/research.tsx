import { PAPERS } from '../../../content/papers';
import { useContent } from '../../../content/use-content';
import { img } from '../../../lib/img';
import { paperAnchor, workFor } from '../../../lib/papers';
import { workHref } from '../../../lib/work-link';
import { setFlipOrigin } from '../../../lib/flip';
import { Reveal } from '../../../components/ui/reveal';

export function Research() {
  const { works } = useContent();

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      {PAPERS.map((p, i) => {
        const work = workFor(p, works);
        return (
        <Reveal key={p.slug} delay={i * 80}>
          <article id={paperAnchor(p)} className="group relative rounded-xl border border-line p-8 text-center transition-all duration-200 hover:border-accent/50 hover:bg-bg max-[560px]:p-5">
            <span className="text-[13px] tabular-nums text-muted">{p.year}</span>
            <h3 className="mt-2 text-[20px] font-medium leading-[1.3] transition-colors group-hover:text-fg">
              <a href={p.url ?? p.repo} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-xl">
                {p.title}
              </a>
            </h3>
            <p className="mt-1.5 text-[14px] text-fg-dim">{p.authors.join(', ')}</p>
            <p className="mx-auto mt-3 max-w-[64ch] text-[14px] leading-[1.6] text-fg-dim">{p.summary}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-accent-2/25 bg-accent-2/8 px-3 py-1 text-[11px] tracking-[0.04em] text-accent-2">{t}</span>
              ))}
              <span className="flex w-full items-center justify-center gap-5 pt-2 text-[13px]">
                {p.url && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="relative z-10 text-muted transition-colors hover:text-fg">
                    Code ↗
                  </a>
                )}
                <span className="text-accent-soft transition-colors group-hover:text-fg max-[900px]:hidden">{p.url ? 'Read paper →' : 'View repo →'}</span>
              </span>
            </div>
            {work && (
              <a
                href={workHref(work.slug)}
                onClick={(e) => setFlipOrigin(e.currentTarget)}
                className="group/case relative z-10 mt-6 flex items-center justify-center gap-3.5 border-t border-line pt-5"
              >
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-line bg-bg-2">
                  {work.cover && <img src={img(work.cover, 400)} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="min-w-0 text-left">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-accent-2">Project case</span>
                  <span className="block text-[15px] leading-[1.35] text-fg">{work.name}</span>
                </span>
                <span className="ml-4 shrink-0 text-[13px] text-accent-soft transition-colors group-hover/case:text-fg">
                  Open case <span className="inline-block transition-transform group-hover/case:translate-x-0.5">→</span>
                </span>
              </a>
            )}
          </article>
        </Reveal>
        );
      })}
    </div>
  );
}
