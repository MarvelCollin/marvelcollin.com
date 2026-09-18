import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import Matter from 'matter-js';
import { createWorld } from './world';
import type { Shape } from './shape';

export interface Nodes {
  piece: Map<string, HTMLDivElement>;
  label: Map<string, HTMLSpanElement>;
}

function paint(bodies: Matter.Body[], shapes: Map<string, Shape>, nodes: Nodes) {
  for (const b of bodies) {
    const el = nodes.piece.get(b.label);
    const s = shapes.get(b.label);
    if (!el || !s) continue;
    el.style.transform = `translate(${b.position.x - s.w / 2}px, ${b.position.y - s.h / 2}px) rotate(${b.angle}rad)`;
    const label = nodes.label.get(b.label);
    if (label) label.style.transform = `translateX(-50%) rotate(${-b.angle}rad)`;
  }
}

export function usePhysics(box: RefObject<HTMLDivElement | null>, names: string[], shapes: Map<string, Shape>) {
  const nodes = useRef<Nodes>({ piece: new Map(), label: new Map() });
  const [ready, setReady] = useState(false);
  const measured = names.length > 0 && names.every((n) => shapes.has(n));

  useEffect(() => {
    const el = box.current;
    if (!el || !measured) return;

    const world = createWorld(el, names, shapes);
    const runner = Matter.Runner.create();
    let running = false;
    let frame = 0;

    const sync = () => {
      paint(world.bodies, shapes, nodes.current);
      if (running) frame = requestAnimationFrame(sync);
    };

    const start = () => {
      if (running) return;
      running = true;
      Matter.Runner.run(runner, world.engine);
      frame = requestAnimationFrame(sync);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      Matter.Runner.stop(runner);
      cancelAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    const ro = new ResizeObserver(world.resize);
    io.observe(el);
    ro.observe(el);
    setReady(true);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      world.destroy();
    };
  }, [box, names, shapes, measured]);

  return { nodes, ready };
}
