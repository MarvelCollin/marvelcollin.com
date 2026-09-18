import type { CSSProperties } from 'react';
import type { Glyph } from '../../../lib/skill-logos';
import { ICON } from './shape';
import type { Shape } from './shape';
import type { Nodes } from './use-physics';

const FALLBACK = '#8a8378';
const LABEL = '#a9b6b8';

function track<T extends HTMLElement>(map: Map<string, T>, key: string) {
  return (el: T | null) => {
    if (el) map.set(key, el);
    else map.delete(key);
  };
}

const short = (name: string) => (name.length > 12 ? name.slice(0, 10) + '..' : name);

function Mark({ name, glyph, shape }: { name: string; glyph?: Glyph; shape: Shape }) {
  const place: CSSProperties = { position: 'absolute', left: shape.w / 2 - shape.cx, top: shape.h / 2 - shape.cy };

  if (glyph && 'src' in glyph) {
    return <img src={glyph.src} alt="" draggable={false} width={ICON} height={ICON} style={{ ...place, objectFit: 'contain' }} />;
  }
  if (glyph) {
    return <glyph.Icon size={ICON} style={{ ...place, color: glyph.color }} />;
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-lg border text-[13px] font-semibold uppercase"
      style={{ borderColor: FALLBACK + '55', backgroundColor: FALLBACK + '14', color: FALLBACK }}
    >
      {name.slice(0, 2)}
    </div>
  );
}

export function Piece({ name, glyph, shape, nodes }: { name: string; glyph?: Glyph; shape: Shape; nodes: Nodes }) {
  return (
    <div ref={track(nodes.piece, name)} className="absolute left-0 top-0" style={{ width: shape.w, height: shape.h, willChange: 'transform' }}>
      <Mark name={name} glyph={glyph} shape={shape} />
      <span
        ref={track(nodes.label, name)}
        className="absolute left-1/2 whitespace-nowrap text-[8px] font-semibold uppercase tracking-wider"
        style={{ color: LABEL, top: shape.h + 4, transform: 'translateX(-50%)' }}
      >
        {short(name)}
      </span>
    </div>
  );
}
