import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import Matter from 'matter-js';
import { createWorld } from './world';
import { TILE } from './shape';

function place(el: HTMLDivElement, b: Matter.Body) {
  el.style.transform = `translate(${b.position.x - TILE.w / 2}px, ${b.position.y - TILE.h / 2}px) rotate(${b.angle}rad)`;
}

function paint(bodies: Matter.Body[], nodes: Map<string, HTMLDivElement>, all: boolean) {
  for (const b of bodies) {
    if (b.isSleeping && !all) continue;
    const el = nodes.get(b.label);
    if (el) place(el, b);
  }
}

export function usePhysics(box: RefObject<HTMLDivElement | null>, names: string[]) {
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const bodies = useRef(new Map<string, Matter.Body>());
  const [ready, setReady] = useState(false);

  const mount = useCallback(
    (name: string) => (el: HTMLDivElement | null) => {
      if (!el) {
        nodes.current.delete(name);
        return;
      }
      nodes.current.set(name, el);
      const b = bodies.current.get(name);
      if (b) place(el, b);
    },
    [],
  );

  useEffect(() => {
    const el = box.current;
    if (!el || names.length === 0) return;

    const world = createWorld(el, names);
    bodies.current = new Map(world.bodies.map((b) => [b.label, b]));
    const runner = Matter.Runner.create();
    let running = false;
    let visible = true;
    let frame = 0;

    const sync = () => {
      paint(world.bodies, nodes.current, false);
      if (world.settled()) stop();
      else if (running) frame = requestAnimationFrame(sync);
    };

    const start = () => {
      if (running) return;
      running = true;
      paint(world.bodies, nodes.current, true);
      Matter.Runner.run(runner, world.engine);
      frame = requestAnimationFrame(sync);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      Matter.Runner.stop(runner);
      cancelAnimationFrame(frame);
    };

    const wake = () => visible && start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    const ro = new ResizeObserver(() => {
      world.resize();
      wake();
    });
    io.observe(el);
    ro.observe(el);
    el.addEventListener('pointerdown', wake);
    start();
    setReady(true);

    return () => {
      stop();
      el.removeEventListener('pointerdown', wake);
      io.disconnect();
      ro.disconnect();
      world.destroy();
      bodies.current = new Map();
    };
  }, [box, names]);

  return { mount, ready };
}
