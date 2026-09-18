export const ICON = 68;
const MIN = 26;
const RES = ICON * 2;
const ALPHA = 24;

export interface Shape {
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export const SQUARE: Shape = { w: ICON, h: ICON, cx: ICON / 2, cy: ICON / 2 };

function fromBox(x0: number, y0: number, x1: number, y1: number): Shape {
  return {
    w: Math.max(MIN, x1 - x0),
    h: Math.max(MIN, y1 - y0),
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2,
  };
}

export function measureSvg(svg: SVGSVGElement | null | undefined): Shape {
  if (!svg) return SQUARE;
  const vb = svg.viewBox.baseVal;
  const scale = vb.width && vb.height ? Math.min(ICON / vb.width, ICON / vb.height) : 1;
  const b = svg.getBBox();
  const offX = (ICON - vb.width * scale) / 2 - vb.x * scale;
  const offY = (ICON - vb.height * scale) / 2 - vb.y * scale;
  const x0 = b.x * scale + offX;
  const y0 = b.y * scale + offY;
  return fromBox(x0, y0, x0 + b.width * scale, y0 + b.height * scale);
}

function opaqueBounds(data: Uint8ClampedArray) {
  let x0 = RES;
  let y0 = RES;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < RES; y++) {
    for (let x = 0; x < RES; x++) {
      if (data[(y * RES + x) * 4 + 3] < ALPHA) continue;
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  }
  return x1 < x0 ? null : [x0, y0, x1 + 1, y1 + 1];
}

export function measureImage(src: string): Promise<Shape> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(SQUARE);
    img.onload = () => {
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve(SQUARE);
      ctx.canvas.width = ctx.canvas.height = RES;
      const ratio = img.naturalWidth / img.naturalHeight || 1;
      const w = ratio >= 1 ? RES : RES * ratio;
      const h = ratio >= 1 ? RES / ratio : RES;
      ctx.drawImage(img, (RES - w) / 2, (RES - h) / 2, w, h);
      const box = opaqueBounds(ctx.getImageData(0, 0, RES, RES).data);
      if (!box) return resolve(SQUARE);
      const [x0, y0, x1, y1] = box.map((v) => (v * ICON) / RES);
      resolve(fromBox(x0, y0, x1, y1));
    };
    img.src = src;
  });
}
