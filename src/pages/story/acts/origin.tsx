import { useMemo } from 'react';
import { PAPERS } from '../../../content/papers';
import { PROFILE } from '../../../content/profile';
import { useContent } from '../../../content/use-content';
import { orgLogo } from '../../../lib/org-logo';
import { chronicle } from '../../../lib/tenure';
import { relate, schoolLinks } from '../../../lib/related';
import { workFor } from '../../../lib/papers';
import { OrgMark } from '../../../components/ui/org-mark';
import { AwardChip, LinkedList, PaperChip, RoleChip } from '../../../components/ui/linked';
import { Reveal } from '../../../components/ui/reveal';
import { EntrySkeleton } from '../../../components/ui/skeleton';

const FACTS = [
  { term: 'Based in', detail: `${PROFILE.city}, ${PROFILE.country}` },
  { term: 'Languages', detail: PROFILE.languages.map((l) => l.label).join(', ') },
];

export function Origin() {
  const { education, experience, recognition, works, loading } = useContent();
  const links = useMemo(() => {
    const lanes = chronicle(experience);
    const claimed = new Set([...relate(lanes, recognition, works).values()].flatMap((r) => r.awards.map((a) => a.id)));
    return schoolLinks(education, experience, recognition, PAPERS, claimed);
  }, [education, experience, recognition, works]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-20 max-[1100px]:grid-cols-1 max-[1100px]:gap-14">
      <Reveal>
        <p className="max-w-[46ch] text-[19px] leading-[1.6] text-fg-dim">
          From competition robots to production servers.
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
          {PROFILE.links.map((l) => (
            <a key={l.label} className="text-accent-soft transition-colors hover:text-fg" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={120}>
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
              {links.has(e.id) && (
                <LinkedList className="mt-4 pl-[60px] max-[900px]:pl-0">
                  {links.get(e.id)!.roles.map((r) => (
                    <RoleChip key={r.id} role={r} />
                  ))}
                  {links.get(e.id)!.awards.map((a) => (
                    <AwardChip key={a.id} award={a} />
                  ))}
                  {links.get(e.id)!.papers.map((p) => (
                    <PaperChip key={p.slug} paper={p} work={workFor(p, works)} />
                  ))}
                </LinkedList>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
