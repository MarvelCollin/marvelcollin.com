import { useContent } from '../../../content/use-content';
import { orgLogo } from '../../../lib/icons';
import { OrgMark } from '../../../components/ui/org-mark';
import { Reveal } from '../../../components/ui/reveal';
import { EntrySkeleton } from '../../../components/ui/skeleton';

const FACTS = [
  { term: 'Based in', detail: 'Jakarta, Indonesia' },
  { term: 'Languages', detail: 'English fluent, Indonesian native' },
];

export function Origin() {
  const { education, loading } = useContent();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-20 max-[1100px]:grid-cols-1 max-[1100px]:gap-14">
      <Reveal>
        <p className="max-w-[46ch] text-[19px] leading-[1.6] text-fg-dim">
          Started with Arduino robots on competition tables. Ended up running production servers. The gap between those two is most of what I know.
        </p>
        <dl className="mt-10 space-y-3 text-[15px]">
          {FACTS.map((f) => (
            <div key={f.term} className="flex items-baseline gap-4 border-b border-line pb-3">
              <dt className="w-[92px] shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{f.term}</dt>
              <dd className="text-fg">{f.detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-fg-dim">
          <a className="text-accent-soft transition-colors hover:text-fg" href="https://github.com/MarvelCollin" target="_blank" rel="noreferrer">GitHub</a>
          <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.linkedin.com/in/marvel-collin-0244a21ba/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="text-accent-soft transition-colors hover:text-fg" href="https://www.instagram.com/marvelcolin_/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <p className="mb-8 font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">Education</p>
        {loading && education.length === 0 && <EntrySkeleton count={2} />}
        <div className="space-y-10">
          {education.map((e) => (
            <div key={e.id}>
              <div className="flex items-center gap-4">
                <OrgMark logo={orgLogo(e.school)} dark kind="school" />
                <div>
                  <div className="text-[18px] font-medium leading-[1.3]">{e.degree}</div>
                  <div className="mt-0.5 text-[14px] text-fg-dim">{e.school} · {e.yr}</div>
                </div>
              </div>
              {e.note && <p className="mt-3 max-w-[54ch] pl-[60px] text-[15px] leading-[1.6] text-fg-dim max-[900px]:pl-0">{e.note}</p>}
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
