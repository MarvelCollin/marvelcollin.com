import { PAPERS } from '../content/papers';
import { Reveal } from '../components/reveal';

export function Research() {
  return (
    <div data-screen-label="Research">
      <section className="px-10 pt-[160px] pb-12 max-[900px]:px-[22px] max-[900px]:pt-[100px]">
        <div className="mx-auto max-w-[900px]">
          <h1 className="font-sans text-[clamp(36px,5vw,64px)] font-semibold leading-[1.06] tracking-[-0.025em]">Research</h1>
          <p className="mt-4 max-w-[50ch] text-[17px] leading-[1.6] text-fg-dim">
            ML research on model compression and NLP.
          </p>
        </div>
      </section>

      <section className="px-10 pb-24 max-[900px]:px-[22px]">
        <div className="mx-auto max-w-[900px] space-y-6">
          {PAPERS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-line p-8 transition-all duration-200 hover:border-muted hover:bg-bg-2 max-[560px]:p-5"
              >
                <span className="text-[13px] tabular-nums text-muted">{p.year}</span>
                <h3 className="mt-2 text-[20px] font-medium leading-[1.3] transition-colors group-hover:text-fg">{p.title}</h3>
                <p className="mt-1.5 text-[14px] text-fg-dim">{p.authors.join(', ')}</p>
                <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.6] text-fg-dim">{p.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 text-[11px] tracking-[0.04em] text-muted">{t}</span>
                  ))}
                  <span className="ml-auto text-[13px] text-accent-soft transition-colors group-hover:text-fg max-[900px]:hidden">View repo →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
