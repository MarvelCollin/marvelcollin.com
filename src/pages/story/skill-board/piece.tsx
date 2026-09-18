import type { Glyph, Tone } from '../../../lib/skill-logos';
import { TILE_H, TILE_W } from './shape';

const LOGO = 44;

const TONE: Record<Tone, string> = {
  invert: 'invert(1)',
  halo: 'drop-shadow(0 0 1px rgba(236, 236, 236, 0.55))',
};

const short = (name: string) => (name.length > 12 ? name.slice(0, 11) + '…' : name);

export function Piece({ name, glyph, onMount }: { name: string; glyph: Glyph; onMount: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={onMount}
      title={name}
      className="absolute left-0 top-0 flex flex-col items-center justify-between"
      style={{ width: TILE_W, height: TILE_H, willChange: 'transform' }}
    >
      <div className="flex flex-1 items-center justify-center">
        {'src' in glyph ? (
          <img
            src={glyph.src}
            alt=""
            draggable={false}
            className="pointer-events-none select-none object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
            style={{ width: LOGO, height: LOGO, filter: glyph.tone && TONE[glyph.tone] }}
          />
        ) : (
          <span className="font-mono text-[17px] font-semibold tracking-[0.04em] text-fg">{glyph.text}</span>
        )}
      </div>
      <span className="w-full truncate text-center font-mono text-[8px] uppercase leading-none tracking-[0.06em] text-fg-dim">{short(name)}</span>
    </div>
  );
}
