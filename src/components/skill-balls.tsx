import { useEffect, useRef, useState, useMemo } from 'react';
import Matter from 'matter-js';
import { skillIcon } from '../lib/icons';

interface Skill {
  id: string;
  name: string;
  opinion: string;
  sort: number;
}

const R = 26;
const WALL = 60;

export function SkillBalls({ skills }: { skills: Skill[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const nodesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const frameRef = useRef(0);
  const [ready, setReady] = useState(false);

  const icons = useMemo(() => {
    const m = new Map<string, { Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }>();
    skills.forEach(s => {
      const ic = skillIcon(s.name);
      if (ic) m.set(s.name, ic);
    });
    return m;
  }, [skills]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || skills.length === 0) return;

    const w = box.clientWidth;
    const h = box.clientHeight;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.2, scale: 0.001 } });
    engineRef.current = engine;

    const wallOpts = { isStatic: true, restitution: 0.4 } as const;
    const walls = [
      Matter.Bodies.rectangle(w / 2, h + WALL / 2, w * 2, WALL, wallOpts),
      Matter.Bodies.rectangle(-WALL / 2, h / 2, WALL, h * 3, wallOpts),
      Matter.Bodies.rectangle(w + WALL / 2, h / 2, WALL, h * 3, wallOpts),
    ];
    Matter.Composite.add(engine.world, walls);

    const perRow = Math.ceil(Math.sqrt(skills.length));
    const spacing = Math.min((w - 100) / perRow, R * 3);
    const startX = (w - (perRow - 1) * spacing) / 2;

    const balls = skills.map((s, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      return Matter.Bodies.circle(
        startX + col * spacing + (Math.random() - 0.5) * 8,
        -50 - row * (R * 2.8) + (Math.random() - 0.5) * 15,
        R,
        {
          restitution: 0.4,
          friction: 0.05,
          frictionAir: 0.01,
          density: 0.003,
          label: s.name,
        },
      );
    });
    bodiesRef.current = balls;
    Matter.Composite.add(engine.world, balls);

    const mouse = Matter.Mouse.create(box);
    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mc);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    setReady(true);

    const sync = () => {
      balls.forEach(b => {
        const el = nodesRef.current.get(b.label);
        if (!el) return;
        el.style.transform = `translate(${b.position.x - R}px, ${b.position.y - R}px) rotate(${b.angle}rad)`;
      });
      frameRef.current = requestAnimationFrame(sync);
    };
    frameRef.current = requestAnimationFrame(sync);

    const onResize = () => {
      const nw = box.clientWidth;
      const nh = box.clientHeight;
      Matter.Body.setPosition(walls[0], { x: nw / 2, y: nh + WALL / 2 });
      Matter.Body.setVertices(walls[0], Matter.Bodies.rectangle(nw / 2, nh + WALL / 2, nw * 2, WALL).vertices);
      Matter.Body.setPosition(walls[2], { x: nw + WALL / 2, y: nh / 2 });
      Matter.Body.setVertices(walls[2], Matter.Bodies.rectangle(nw + WALL / 2, nh / 2, WALL, nh * 3).vertices);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(box);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(engine.world, false);
    };
  }, [skills]);

  return (
    <div
      ref={boxRef}
      className="relative h-[500px] w-full cursor-grab overflow-hidden rounded-2xl border border-line bg-bg max-[560px]:h-[400px]"
      style={{ touchAction: 'none' }}
    >
      {ready && skills.map(s => {
        const ic = icons.get(s.name);
        const fallbackColor = '#8a8378';
        const color = ic?.color || fallbackColor;
        return (
          <div
            key={s.id || s.name}
            ref={el => { if (el) nodesRef.current.set(s.name, el); else nodesRef.current.delete(s.name); }}
            className="absolute left-0 top-0 flex flex-col items-center justify-center rounded-full border"
            style={{
              width: R * 2,
              height: R * 2,
              borderColor: color + '50',
              backgroundColor: color + '12',
              willChange: 'transform',
            }}
          >
            {ic && <ic.Icon size={R * 0.7} style={{ color }} />}
            <span
              className="absolute whitespace-nowrap text-[7px] font-semibold uppercase tracking-wider"
              style={{ color: color + 'bb', bottom: -14 }}
            >
              {s.name.length > 12 ? s.name.slice(0, 10) + '..' : s.name}
            </span>
          </div>
        );
      })}
      {!ready && skills.length > 0 && (
        <div className="flex h-full items-center justify-center text-[13px] text-muted">Loading…</div>
      )}
    </div>
  );
}
