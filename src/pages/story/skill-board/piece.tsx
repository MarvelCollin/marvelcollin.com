import { ICON } from './shape';
import type { Glyph, Shape } from './shape';
import type { Nodes } from './use-physics';

const FALLBACK = '#8a8378';

function track<T extends HTMLElement>(map: Map<string, T>, key: string) {
  return (el: T | null) => {
    if (el) map.set(key, el);
    else map.delete(key);
  };
}

const short = (name: string) => (name.length > 12 ? name.slice(0, 10) + '..' : name);

export function Piece({ name, glyph, shape, nodes }: { name: string; glyph?: Glyph; shape: Shape; nodes: Nodes }) {
  const color = glyph?.color || FALLBACK;

  return (
    <div
      ref={track(nodes.piece, name)}
      className="absolute left-0 top-0"
      style={{ width: shape.w, height: shape.h, willChange: 'transform' }}
    >
      {glyph ? (
        <glyph.Icon
          size={ICON}
          style={{
            position: 'absolute',
            left: shape.w / 2 - shape.cx,
            top: shape.h / 2 - shape.cy,
            color,
            filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))',
          }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-lg border text-[13px] font-semibold uppercase"
          style={{ borderColor: color + '55', backgroundColor: color + '14', color }}
        >
          {name.slice(0, 2)}
        </div>
      )}
      <span
        ref={track(nodes.label, name)}
        className="absolute left-1/2 whitespace-nowrap text-[8px] font-semibold uppercase tracking-wider"
        style={{ color: color + 'cc', top: shape.h + 4, transform: 'translateX(-50%)' }}
      >
        {short(name)}
      </span>
    </div>
  );
}
