import { lazy, Suspense, useMemo, useState } from 'react';
import { useContent } from '../../../content/use-content';
import { SKILL_GROUPS, skillGroup } from '../../../content/skill-groups';
import { Chips } from '../../../components/ui/chips';
import { Skel } from '../../../components/ui/skeleton';
import { TechIcon } from '../../../components/ui/tech-icon';
import { useNear } from '../../../hooks/use-near';
import { delay } from '../../../lib/motion';
import { loadBoard } from '../load-board';

const MOST = ['.NET', 'Laravel', 'React', 'Go', 'Docker', 'PostgreSQL', 'Tailwind'];

const SkillBalls = lazy(() => loadBoard().then((m) => ({ default: m.SkillBalls })));

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
      <div>
        <p data-part style={delay(80)} className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">
          What I do most
        </p>
        <ul className="mt-4 flex flex-wrap gap-4">
          {MOST.map((name, i) => (
            <li key={name} data-part style={delay(140 + i * 70)} title={name}>
              <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-line bg-bg/70 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60">
                <TechIcon name={name} size={34} />
              </span>
              <span className="sr-only">{name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 max-[900px]:mt-12">
        <div>
          <p data-part style={delay(120)} className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2">
            What I can do
          </p>
          {grouped.length > 0 && (
            <p data-part style={delay(180)} className="mt-2 text-[16px] leading-[1.55] text-fg-dim">
              {grouped.length} tools across web, AI, mobile, DevOps and hardware.
            </p>
          )}
        </div>
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
