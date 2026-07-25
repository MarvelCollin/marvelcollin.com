import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import Matter from 'matter-js';
import { skillIcon } from '../lib/icons';

interface Skill {
  id: string;
  name: string;
  opinion: string;
  sort: number;
}

const S = 68;
const MIN = 26;
const WALL = 60;

interface Dim {
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export function SkillBalls({ skills }: { skills: Skill[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const nodesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const labelsRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const frameRef = useRef(0);
  const [dims, setDims] = useState<Map<string, Dim>>(new Map());
  const [ready, setReady] = useState(false);

  const icons = useMemo(() => {
    const m = new Map<string, { Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }>();
    skills.forEach(s => {
      const ic = skillIcon(s.name);
      if (ic) m.set(s.name, ic);
    });
    return m;
  }, [skills]);

  useLayoutEffect(() => {
    const host = measureRef.current;
    if (!host || skills.length === 0) return;

    const next = new Map<string, Dim>();
    skills.forEach((s, i) => {
      const svg = host.children[i]?.querySelector('svg');
      if (!svg) {
        next.set(s.name, { w: S, h: S, cx: S / 2, cy: S / 2 });
        return;
      }
      const vb = svg.viewBox.baseVal;
      const scale = vb.width && vb.height ? Math.min(S / vb.width, S / vb.height) : 1;
      const b = svg.getBBox();
      const offX = (S - vb.width * scale) / 2 - vb.x * scale;
      const offY = (S - vb.height * scale) / 2 - vb.y * scale;
      next.set(s.name, {
        w: Math.max(MIN, b.width * scale),
        h: Math.max(MIN, b.height * scale),
        cx: (b.x + b.width / 2) * scale + offX,
        cy: (b.y + b.height / 2) * scale + offY,
      });
    });
    setDims(next);
  }, [skills, icons]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || skills.length === 0) return;
    if (!skills.every(s => dims.has(s.name))) return;

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
    const spacing = Math.min((w - 100) / perRow, S * 1.7);
    const startX = (w - (perRow - 1) * spacing) / 2;

    const balls = skills.map((s, i) => {
      const d = dims.get(s.name)!;
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      return Matter.Bodies.rectangle(
        startX + col * spacing + (Math.random() - 0.5) * 8,
        -60 - row * (S * 1.9) + (Math.random() - 0.5) * 15,
        d.w,
        d.h,
        {
          chamfer: { radius: Math.min(d.w, d.h) * 0.14 },
          angle: (Math.random() - 0.5) * 0.5,
          restitution: 0.25,
          friction: 0.2,
          frictionAir: 0.012,
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
        const d = dims.get(b.label)!;
        el.style.transform = `translate(${b.position.x - d.w / 2}px, ${b.position.y - d.h / 2}px) rotate(${b.angle}rad)`;
        const lbl = labelsRef.current.get(b.label);
        if (lbl) lbl.style.transform = `translateX(-50%) rotate(${-b.angle}rad)`;
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
  }, [skills, dims]);

  return (
    <div
      ref={boxRef}
      className="relative h-[500px] w-full cursor-grab overflow-hidden rounded-2xl border border-line bg-bg max-[560px]:h-[400px]"
      style={{ touchAction: 'none' }}
    >
      <div ref={measureRef} aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 opacity-0">
        {skills.map(s => {
          const ic = icons.get(s.name);
          return <span key={s.id || s.name}>{ic && <ic.Icon size={S} />}</span>;
        })}
      </div>

      {ready && skills.map(s => {
        const ic = icons.get(s.name);
        const d = dims.get(s.name);
        if (!d) return null;
        const color = ic?.color || '#8a8378';
        return (
          <div
            key={s.id || s.name}
            ref={el => { if (el) nodesRef.current.set(s.name, el); else nodesRef.current.delete(s.name); }}
            className="absolute left-0 top-0"
            style={{ width: d.w, height: d.h, willChange: 'transform' }}
          >
            {ic ? (
              <ic.Icon
                size={S}
                style={{
                  position: 'absolute',
                  left: d.w / 2 - d.cx,
                  top: d.h / 2 - d.cy,
                  color,
                  filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))',
                }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-lg border text-[13px] font-semibold uppercase"
                style={{ borderColor: color + '55', backgroundColor: color + '14', color }}
              >
                {s.name.slice(0, 2)}
              </div>
            )}
            <span
              ref={el => { if (el) labelsRef.current.set(s.name, el); else labelsRef.current.delete(s.name); }}
              className="absolute left-1/2 whitespace-nowrap text-[8px] font-semibold uppercase tracking-wider"
              style={{ color: color + 'cc', top: d.h + 4, transform: 'translateX(-50%)' }}
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
