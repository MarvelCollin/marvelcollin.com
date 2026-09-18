import type { Glyph } from '../../../lib/skill-logos';
import { TILE_H, TILE_W } from './shape';

const LOGO = 34;

const short = (name: string) => (name.length > 11 ? name.slice(0, 10) + '…' : name);

export function Piece({ name, glyph, onMount }: { name: string; glyph: Glyph; onMount: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={onMount}
      title={name}
      className="absolute left-0 top-0 flex flex-col items-center justify-between rounded-[10px] bg-paper px-1 pb-1.5 pt-2.5 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.75)]"
      style={{ width: TILE_W, height: TILE_H, willChange: 'transform' }}
    >
      <div className="flex flex-1 items-center justify-center">
        {'src' in glyph ? (
          <img src={glyph.src} alt="" draggable={false} className="pointer-events-none select-none object-contain" style={{ width: LOGO, height: LOGO }} />
        ) : (
          <span className="font-mono text-[15px] font-semibold tracking-[0.04em] text-paper-ink">{glyph.text}</span>
        )}
      </div>
      <span className="w-full truncate text-center font-mono text-[8px] uppercase leading-none tracking-[0.06em] text-paper-dim">{short(name)}</span>
    </div>
  );
}
