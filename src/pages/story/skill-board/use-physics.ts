import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import Matter from 'matter-js';
import { createWorld } from './world';
import { TILE } from './shape';

function paint(bodies: Matter.Body[], nodes: Map<string, HTMLDivElement>) {
  for (const b of bodies) {
    const el = nodes.get(b.label);
    if (el) el.style.transform = `translate(${b.position.x - TILE.w / 2}px, ${b.position.y - TILE.h / 2}px) rotate(${b.angle}rad)`;
  }
}

export function usePhysics(box: RefObject<HTMLDivElement | null>, names: string[]) {
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const [ready, setReady] = useState(false);

  const mount = useCallback(
    (name: string) => (el: HTMLDivElement | null) => {
      if (el) nodes.current.set(name, el);
      else nodes.current.delete(name);
    },
    [],
  );

  useEffect(() => {
    const el = box.current;
    if (!el || names.length === 0) return;

    const world = createWorld(el, names);
    const runner = Matter.Runner.create();
    let running = false;
    let frame = 0;

    const sync = () => {
      paint(world.bodies, nodes.current);
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
  }, [box, names]);

  return { mount, ready };
}
