import type { PointerEvent } from 'react';

export type Hover = (key: string | null) => void;

export function hoverProps(key: string, onHot: Hover) {
  const mouse = (e: PointerEvent) => e.pointerType === 'mouse';
  return {
    onPointerEnter: (e: PointerEvent) => mouse(e) && onHot(key),
    onPointerLeave: (e: PointerEvent) => mouse(e) && onHot(null),
  };
}
