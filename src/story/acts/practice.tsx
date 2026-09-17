import { useMemo } from 'react';
import { useContent } from '../../content/use-content';
import { orgLogo } from '../../lib/icons';
import { OrgMark } from '../../components/org-mark';
import { Reveal } from '../../components/reveal';
import { EntrySkeleton } from '../../components/skeleton';

export function Practice() {
  const { experience, loading } = useContent();

  const groups = useMemo(() => {
    const out: { where: string; span: string; items: typeof experience }[] = [];
    for (const j of experience) {
      const last = out[out.length - 1];
      if (last && last.where === j.where) last.items.push(j);
      else out.push({ where: j.where, span: j.yr, items: [j] });
    }
    for (const g of out) {
      if (g.items.length < 2) continue;
      const start = g.items[g.items.length - 1].yr.split(' to ')[0];
      const end = g.items[0].yr.split(' to ')[1] ?? g.items[0].yr;
      g.span = `${start} to ${end}`;
    }
    return out;
  }, [experience]);

  return (
    <div className="max-w-[900px]">
      {loading && experience.length === 0 && <EntrySkeleton count={3} />}
      <div className="space-y-12">
        {groups.map((g, i) => {
          const logo = orgLogo(g.where);
          if (g.items.length === 1) {
            const j = g.items[0];
            return (
              <Reveal key={i} delay={Math.min(i, 4) * 60}>
                <div className="flex items-center gap-4">
                  <OrgMark logo={logo} />
                  <div>
                    <div className="text-[18px] font-medium leading-[1.3]">{j.role}</div>
                    <div className="mt-0.5 text-[14px] text-fg-dim">{j.where} · {j.yr}</div>
                  </div>
                </div>
                {j.note && <p className="mt-3 max-w-[54ch] pl-[60px] text-[15px] leading-[1.6] text-fg-dim max-[900px]:pl-0">{j.note}</p>}
              </Reveal>
            );
          }
          return (
            <Reveal key={i} delay={Math.min(i, 4) * 60}>
              <div className="flex items-center gap-4">
                <OrgMark logo={logo} />
                <div>
                  <div className="text-[18px] font-medium leading-[1.3]">{g.where}</div>
                  <div className="mt-0.5 text-[14px] text-fg-dim">{g.span}</div>
                </div>
              </div>
              <div className="ml-[21px] mt-5 space-y-5 border-l border-line pl-6 max-[900px]:ml-0 max-[900px]:pl-4">
                {g.items.map((j, k) => (
                  <div key={k}>
                    <div className="text-[16px] font-medium leading-[1.3]">{j.role}</div>
                    <div className="mt-0.5 text-[13px] text-muted">{j.yr}</div>
                    {j.note && <p className="mt-2 max-w-[54ch] text-[15px] leading-[1.6] text-fg-dim">{j.note}</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
