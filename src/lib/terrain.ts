const PERM = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 1337;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return Uint8Array.from([...p, ...p]);
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);

function grad(h: number, x: number, y: number, z: number) {
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = PERM[X] + Y;
  const AA = PERM[A] + Z;
  const AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y;
  const BA = PERM[B] + Z;
  const BB = PERM[B + 1] + Z;
  return lerp(
    lerp(
      lerp(grad(PERM[AA] & 15, x, y, z), grad(PERM[BA] & 15, x - 1, y, z), u),
      lerp(grad(PERM[AB] & 15, x, y - 1, z), grad(PERM[BB] & 15, x - 1, y - 1, z), u),
      v,
    ),
    lerp(
      lerp(grad(PERM[AA + 1] & 15, x, y, z - 1), grad(PERM[BA + 1] & 15, x - 1, y, z - 1), u),
      lerp(grad(PERM[AB + 1] & 15, x, y - 1, z - 1), grad(PERM[BB + 1] & 15, x - 1, y - 1, z - 1), u),
      v,
    ),
    w,
  );
}

function elevation(x: number, y: number, z: number) {
  return noise(x, y, z) + 0.5 * noise(x * 2.03, y * 2.03, z * 1.7) + 0.22 * noise(x * 4.1, y * 4.1, z * 2.3);
}

export type Contours = { minor: Path2D; major: Path2D };

const CELL = 10;
const SCALE = 1 / 380;
const STEP = 0.075;
const MAJOR = 5;

export function traceTerrain(width: number, height: number): Contours {
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const field = new Float32Array(cols * rows);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      field[j * cols + i] = elevation(i * CELL * SCALE, j * CELL * SCALE, 0.37);
    }
  }

  const minor = new Path2D();
  const major = new Path2D();

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = field[j * cols + i];
      const b = field[j * cols + i + 1];
      const c = field[(j + 1) * cols + i + 1];
      const d = field[(j + 1) * cols + i];
      const lo = Math.ceil(Math.min(a, b, c, d) / STEP);
      const hi = Math.floor(Math.max(a, b, c, d) / STEP);
      if (lo > hi) continue;
      const x0 = i * CELL;
      const y0 = j * CELL;

      for (let k = lo; k <= hi; k++) {
        const level = k * STEP;
        const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const path = k % MAJOR === 0 ? major : minor;

        const top = () => [x0 + CELL * ((level - a) / (b - a)), y0] as const;
        const right = () => [x0 + CELL, y0 + CELL * ((level - b) / (c - b))] as const;
        const bottom = () => [x0 + CELL * ((level - d) / (c - d)), y0 + CELL] as const;
        const left = () => [x0, y0 + CELL * ((level - a) / (d - a))] as const;
        const seg = (p: readonly [number, number], q: readonly [number, number]) => {
          path.moveTo(p[0], p[1]);
          path.lineTo(q[0], q[1]);
        };

        switch (idx) {
          case 1:
          case 14:
            seg(left(), bottom());
            break;
          case 2:
          case 13:
            seg(bottom(), right());
            break;
          case 3:
          case 12:
            seg(left(), right());
            break;
          case 4:
          case 11:
            seg(top(), right());
            break;
          case 5:
            seg(left(), top());
            seg(bottom(), right());
            break;
          case 6:
          case 9:
            seg(top(), bottom());
            break;
          case 7:
          case 8:
            seg(left(), top());
            break;
          case 10:
            seg(top(), right());
            seg(left(), bottom());
            break;
        }
      }
    }
  }

  return { minor, major };
}

export function strokeTerrain(
  canvas: HTMLCanvasElement,
  contours: Contours,
  width: number,
  height: number,
  minor: string,
  major: string,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
