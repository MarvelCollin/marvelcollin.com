import Matter from 'matter-js';
import { ICON } from './shape';
import type { Shape } from './shape';

const WALL = 60;

const SOLID = { isStatic: true, restitution: 0.4 };

function walls(w: number, h: number) {
  return {
    floor: Matter.Bodies.rectangle(w / 2, h + WALL / 2, w * 2, WALL, SOLID),
    left: Matter.Bodies.rectangle(-WALL / 2, h / 2, WALL, h * 3, SOLID),
    right: Matter.Bodies.rectangle(w + WALL / 2, h / 2, WALL, h * 3, SOLID),
  };
}

function drop(names: string[], shapes: Map<string, Shape>, w: number) {
  const perRow = Math.ceil(Math.sqrt(names.length));
  const spacing = Math.min((w - 100) / perRow, ICON * 1.7);
  const startX = (w - (perRow - 1) * spacing) / 2;
  const jitter = (n: number) => (Math.random() - 0.5) * n;

  return names.map((name, i) => {
    const s = shapes.get(name)!;
    const row = Math.floor(i / perRow);
    return Matter.Bodies.rectangle(startX + (i % perRow) * spacing + jitter(8), -60 - row * ICON * 1.9 + jitter(15), s.w, s.h, {
      chamfer: { radius: Math.min(s.w, s.h) * 0.14 },
      angle: jitter(0.5),
      restitution: 0.25,
      friction: 0.2,
      frictionAir: 0.012,
      density: 0.003,
      label: name,
    });
  });
}

export function createWorld(box: HTMLElement, names: string[], shapes: Map<string, Shape>) {
  const w = box.clientWidth;
  const h = box.clientHeight;
  const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.2, scale: 0.001 } });
  const edges = walls(w, h);

  const bodies = drop(names, shapes, w);
  const mouse = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(box),
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  Matter.Composite.add(engine.world, [...Object.values(edges), ...bodies, mouse]);

  const resize = () => {
    const next = walls(box.clientWidth, box.clientHeight);
    for (const key of ['floor', 'right'] as const) {
      Matter.Body.setPosition(edges[key], next[key].position);
      Matter.Body.setVertices(edges[key], next[key].vertices);
    }
  };

  const destroy = () => {
    Matter.Engine.clear(engine);
    Matter.Composite.clear(engine.world, false);
  };

  return { engine, bodies, resize, destroy };
}
