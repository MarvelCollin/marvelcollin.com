import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Skill } from '../../../types/content';
import { skillIcon } from '../../../lib/icons';
import { ICON, measure } from './shape';
import type { Glyph, Shape } from './shape';
import { usePhysics } from './use-physics';
import { Piece } from './piece';

function useGlyphs(skills: Skill[]) {
  return useMemo(() => {
    const map = new Map<string, Glyph>();
    for (const s of skills) {
      const g = skillIcon(s.name);
      if (g) map.set(s.name, g);
    }
    return map;
  }, [skills]);
}

function useShapes(skills: Skill[], glyphs: Map<string, Glyph>) {
  const host = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<Map<string, Shape>>(new Map());

  useLayoutEffect(() => {
    const el = host.current;
    if (!el || skills.length === 0) return;
    setShapes(new Map(skills.map((s, i) => [s.name, measure(el.children[i]?.querySelector('svg'))])));
  }, [skills, glyphs]);

  return { host, shapes };
}

export function SkillBalls({ skills }: { skills: Skill[] }) {
  const box = useRef<HTMLDivElement>(null);
  const glyphs = useGlyphs(skills);
  const { host, shapes } = useShapes(skills, glyphs);
  const names = useMemo(() => skills.map((s) => s.name), [skills]);
  const { nodes, ready } = usePhysics(box, names, shapes);

  return (
    <div
      ref={box}
      className="relative h-[500px] w-full cursor-grab overflow-hidden rounded-2xl border border-line bg-[var(--band)] max-[560px]:h-[400px]"
      style={{ touchAction: 'none' }}
    >
      <div ref={host} aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 opacity-0">
        {skills.map((s) => {
          const g = glyphs.get(s.name);
          return <span key={s.id || s.name}>{g && <g.Icon size={ICON} />}</span>;
        })}
      </div>

      {ready &&
        skills.map((s) => {
          const shape = shapes.get(s.name);
          return shape && <Piece key={s.id || s.name} name={s.name} glyph={glyphs.get(s.name)} shape={shape} nodes={nodes.current} />;
        })}
      {!ready && skills.length > 0 && <div className="flex h-full items-center justify-center text-[13px] text-muted">Loading…</div>}
    </div>
  );
}
