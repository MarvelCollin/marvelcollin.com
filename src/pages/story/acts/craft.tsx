import { lazy, Suspense, useMemo, useState } from 'react';
import { useContent } from '../../../content/use-content';
import { SKILL_GROUPS, skillGroup } from '../../../content/skill-groups';
import { Chips } from '../../../components/ui/chips';
import { Skel } from '../../../components/ui/skeleton';
import { useNear } from '../../../hooks/use-near';

const SkillBalls = lazy(() => import('../skill-board').then((m) => ({ default: m.SkillBalls })));

export function Craft() {
  const { skills } = useContent();
  const [group, setGroup] = useState('all');
  const board = useNear<HTMLDivElement>();

  const grouped = useMemo(() => skills.map((s) => ({ ...s, group: skillGroup(s.name) })), [skills]);

  const chips = useMemo(
    () => [
      { key: 'all', label: 'All', count: grouped.length },
      ...SKILL_GROUPS.map((g) => ({ ...g, count: grouped.filter((s) => s.group === g.key).length })).filter((c) => c.count > 0),
    ],
    [grouped],
  );

  const shown = useMemo(() => (group === 'all' ? grouped : grouped.filter((s) => s.group === group)), [grouped, group]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-accent-2">{grouped.length} tools</p>
        <Chips chips={chips} value={group} onChange={setGroup} />
      </div>
      <div ref={board.ref}>
        {board.near ? (
          <Suspense fallback={<Skel className="block h-[520px] w-full rounded-2xl" />}>
            <SkillBalls skills={shown} />
          </Suspense>
        ) : (
          <Skel className="block h-[520px] w-full rounded-2xl max-[560px]:h-[440px]" />
        )}
      </div>
    </div>
  );
}
