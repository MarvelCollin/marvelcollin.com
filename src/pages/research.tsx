import { PAPERS } from '../content/papers';

export function Research() {
  return (
    <div data-screen-label="Research">
      <section className="mx-auto max-w-[1320px] px-10 pt-[140px] pb-20 max-[900px]:px-[22px] max-[900px]:pt-[100px] max-[560px]:pt-[92px]">
        <div className="pb-16">
          <span className="mb-6 inline-block -rotate-2 font-hand text-[clamp(32px,4vw,54px)] leading-none text-accent-soft">research</span>
          <h1 className="max-w-[18ch] font-sans text-[clamp(40px,5.6vw,80px)] font-semibold leading-[1.04] tracking-[-0.025em]">
            Papers & Experiments
          </h1>
          <p className="mt-4 max-w-[50ch] text-[17px] leading-[1.6] text-fg-dim">
            ML research on model compression and NLP.
          </p>
        </div>

        <div className="mt-2">
          {PAPERS.map((p) => (
            <a
              key={p.slug}
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[80px_1fr_auto] items-baseline gap-6 border-b border-line py-7 transition-colors max-[900px]:grid-cols-1 max-[900px]:gap-2"
            >
              <div className="text-[13px] font-sans text-muted">{p.year}</div>
              <div>
                <h3 className="text-[20px] font-medium leading-[1.3] group-hover:text-accent transition-colors">{p.title}</h3>
                <p className="mt-1 text-[14px] text-fg-dim">{p.authors.join(', ')}</p>
                <p className="mt-2 max-w-[54ch] text-[14px] leading-[1.5] text-fg-dim">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="border border-line px-2.5 py-1 text-[11px] tracking-[0.04em] text-muted">{t}</span>
                  ))}
                </div>
              </div>
              <span className="text-[13px] text-fg-dim transition-colors group-hover:text-accent max-[900px]:hidden">View repo →</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
