import type { IconType } from 'react-icons';

export const ICON = 68;
const MIN = 26;

export interface Shape {
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface Glyph {
  Icon: IconType;
  color: string;
}

export const SQUARE: Shape = { w: ICON, h: ICON, cx: ICON / 2, cy: ICON / 2 };

export function measure(svg: SVGSVGElement | null | undefined): Shape {
  if (!svg) return SQUARE;
  const vb = svg.viewBox.baseVal;
  const scale = vb.width && vb.height ? Math.min(ICON / vb.width, ICON / vb.height) : 1;
  const b = svg.getBBox();
  const offX = (ICON - vb.width * scale) / 2 - vb.x * scale;
  const offY = (ICON - vb.height * scale) / 2 - vb.y * scale;
  return {
    w: Math.max(MIN, b.width * scale),
    h: Math.max(MIN, b.height * scale),
    cx: (b.x + b.width / 2) * scale + offX,
    cy: (b.y + b.height / 2) * scale + offY,
  };
}
