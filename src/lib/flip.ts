export interface FlipOrigin {
  rect: DOMRect;
  rotate: number;
}

let origin: FlipOrigin | null = null;

function readRotation(el: Element): number {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none') return 0;
  const matrix = new DOMMatrixReadOnly(transform);
  return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
}

export function setFlipOrigin(el: Element | null): void {
  origin = el ? { rect: el.getBoundingClientRect(), rotate: readRotation(el) } : null;
}

export function takeFlipOrigin(): FlipOrigin | null {
  const captured = origin;
  origin = null;
  return captured;
}

export function flipFrom(from: FlipOrigin, target: DOMRect) {
  const scale = target.width ? from.rect.width / target.width : 1;
  return {
    x: from.rect.left + from.rect.width / 2 - (target.left + target.width / 2),
    y: from.rect.top + from.rect.height / 2 - (target.top + target.height / 2),
    scale,
    rotate: from.rotate,
  };
}
