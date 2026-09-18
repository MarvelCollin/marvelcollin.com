import { useMemo, useRef } from 'react';
import type { Skill } from '../../../types/content';
import { skillGlyph } from '../../../lib/skill-logos';
import { usePhysics } from './use-physics';
import { Piece } from './piece';

export function SkillBalls({ skills }: { skills: Skill[] }) {
  const box = useRef<HTMLDivElement>(null);
  const names = useMemo(() => skills.map((s) => s.name), [skills]);
  const { mount, ready } = usePhysics(box, names);

  return (
    <div
      ref={box}
      className="relative h-[520px] w-full cursor-grab overflow-hidden rounded-2xl border border-line bg-[var(--band)] max-[560px]:h-[440px]"
      style={{ touchAction: 'none' }}
    >
      {ready && skills.map((s) => <Piece key={s.id || s.name} name={s.name} glyph={skillGlyph(s.name)} onMount={mount(s.name)} />)}
      {!ready && skills.length > 0 && <div className="flex h-full items-center justify-center text-[13px] text-muted">Loading…</div>}
    </div>
  );
}
