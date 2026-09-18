import { elevation } from './noise';

export type Contours = { minor: Path2D; major: Path2D };

type Edge = 't' | 'r' | 'b' | 'l';

const CELL = 10;
const SCALE = 1 / 380;
const STEP = 0.075;
const MAJOR = 5;
const SEED = 0.37;
const DPR_CAP = 1.5;

const SEGMENTS: Edge[][][] = [
  [],
  [['l', 'b']],
  [['b', 'r']],
  [['l', 'r']],
  [['t', 'r']],
  [['l', 't'], ['b', 'r']],
  [['t', 'b']],
  [['l', 't']],
  [['l', 't']],
  [['t', 'b']],
  [['t', 'r'], ['l', 'b']],
  [['t', 'r']],
  [['l', 'r']],
  [['b', 'r']],
  [['l', 'b']],
  [],
];

function sample(cols: number, rows: number) {
  const field = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) field[j * cols + i] = elevation(i * CELL * SCALE, j * CELL * SCALE, SEED);
  }
  return field;
}

function cellPoint(edge: Edge, x0: number, y0: number, level: number, [a, b, c, d]: number[]): [number, number] {
  switch (edge) {
    case 't':
      return [x0 + CELL * ((level - a) / (b - a)), y0];
    case 'r':
      return [x0 + CELL, y0 + CELL * ((level - b) / (c - b))];
    case 'b':
      return [x0 + CELL * ((level - d) / (c - d)), y0 + CELL];
    case 'l':
      return [x0, y0 + CELL * ((level - a) / (d - a))];
  }
}

export function traceTerrain(width: number, height: number): Contours {
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const field = sample(cols, rows);
  const minor = new Path2D();
  const major = new Path2D();

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const corners = [field[j * cols + i], field[j * cols + i + 1], field[(j + 1) * cols + i + 1], field[(j + 1) * cols + i]];
      const [a, b, c, d] = corners;
      const lo = Math.ceil(Math.min(a, b, c, d) / STEP);
      const hi = Math.floor(Math.max(a, b, c, d) / STEP);

      for (let k = lo; k <= hi; k++) {
        const level = k * STEP;
        const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        const path = k % MAJOR === 0 ? major : minor;
        for (const [from, to] of SEGMENTS[idx]) {
          path.moveTo(...cellPoint(from, i * CELL, j * CELL, level, corners));
          path.lineTo(...cellPoint(to, i * CELL, j * CELL, level, corners));
        }
      }
    }
  }

  return { minor, major };
}

export function strokeTerrain(canvas: HTMLCanvasElement, contours: Contours, width: number, height: number, minor: string, major: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineWidth = 1;
  ctx.strokeStyle = minor;
  ctx.stroke(contours.minor);
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = major;
  ctx.stroke(contours.major);
}
