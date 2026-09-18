import { PAPERS } from '../../../content/papers';
import { Reveal } from '../../../components/ui/reveal';

export function Research() {
  return (
    <div className="max-w-[900px] space-y-6">
      {PAPERS.map((p, i) => (
        <Reveal key={p.slug} delay={i * 80}>
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-line p-8 transition-all duration-200 hover:border-accent/50 hover:bg-bg max-[560px]:p-5"
          >
            <span className="text-[13px] tabular-nums text-muted">{p.year}</span>
            <h3 className="mt-2 text-[20px] font-medium leading-[1.3] transition-colors group-hover:text-fg">{p.title}</h3>
            <p className="mt-1.5 text-[14px] text-fg-dim">{p.authors.join(', ')}</p>
            <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.6] text-fg-dim">{p.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-accent-2/25 bg-accent-2/8 px-3 py-1 text-[11px] tracking-[0.04em] text-accent-2">{t}</span>
              ))}
              <span className="ml-auto text-[13px] text-accent-soft transition-colors group-hover:text-fg max-[900px]:hidden">View repo →</span>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
