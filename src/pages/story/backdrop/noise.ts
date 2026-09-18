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

function perlin(x: number, y: number, z: number) {
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
  const g = (i: number, dx: number, dy: number, dz: number) => grad(PERM[i] & 15, x - dx, y - dy, z - dz);
  return lerp(
    lerp(lerp(g(AA, 0, 0, 0), g(BA, 1, 0, 0), u), lerp(g(AB, 0, 1, 0), g(BB, 1, 1, 0), u), v),
    lerp(lerp(g(AA + 1, 0, 0, 1), g(BA + 1, 1, 0, 1), u), lerp(g(AB + 1, 0, 1, 1), g(BB + 1, 1, 1, 1), u), v),
    w,
  );
}

export function elevation(x: number, y: number, z: number) {
  return perlin(x, y, z) + 0.5 * perlin(x * 2.03, y * 2.03, z * 1.7) + 0.22 * perlin(x * 4.1, y * 4.1, z * 2.3);
}
