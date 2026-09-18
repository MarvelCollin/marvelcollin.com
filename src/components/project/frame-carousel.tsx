import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Project } from '../../types/content';
import { img } from '../../lib/img';
import { SmartImage } from '../ui/smart-image';
import { Thumbnail } from './thumbnail';

const ARROW =
  'absolute top-1/2 z-[3] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[rgba(10,20,26,0.72)] text-[18px] text-fg opacity-0 transition-opacity duration-200 hover:bg-[rgba(10,20,26,0.9)] focus-visible:opacity-100 group-hover/frame:opacity-100 max-[900px]:opacity-100';

const pad = (n: number) => String(n).padStart(2, '0');

export function FrameCarousel({
  p,
  images,
  slide,
  onSlide,
  onOpen,
}: {
  p: Project;
  images: string[];
  slide: number;
  onSlide: (index: number) => void;
  onOpen: (index: number) => void;
}) {
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const many = images.length > 1;
  const step = (d: number) => onSlide((slide + d + images.length) % images.length);

  const onDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, moved: false };
  };
  const onUp = (e: ReactPointerEvent) => {
    const start = drag.current;
    if (!start || !many) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40) {
      start.moved = true;
      step(dx < 0 ? 1 : -1);
    }
  };
  const onClick = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    if (!moved && images.length > 0) onOpen(slide);
  };

  return (
    <div className="bg-paper p-[16px] shadow-[0_34px_70px_-24px_rgba(0,0,0,0.85)] max-[560px]:p-3">
      <div className="group/frame relative aspect-[4/3] overflow-hidden bg-bg-2">
        {images.length === 0 ? (
          <Thumbnail p={p} />
        ) : (
          <button
            type="button"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onClick={onClick}
            aria-label={'View ' + p.name + ' frame ' + (slide + 1) + ' full size'}
            className="absolute inset-0 block cursor-zoom-in touch-pan-y"
          >
            <div
              className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translate3d(${-slide * 100}%, 0, 0)` }}
            >
              {images.map((src, i) => (
                <div key={src} className="relative h-full w-full shrink-0" aria-hidden={i !== slide}>
                  <SmartImage fill eager={Math.abs(i - slide) <= 1} src={img(src)} alt={i === 0 ? p.name : ''} className="object-cover object-center" />
                </div>
              ))}
            </div>
          </button>
        )}
        {many && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous frame" className={ARROW + ' left-3'}>
              ‹
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next frame" className={ARROW + ' right-3'}>
              ›
            </button>
          </>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-4 px-1 pt-3">
        <span className="text-[18px] font-medium leading-tight text-paper-ink">{p.name}</span>
        {many && (
          <span className="font-mono text-[11px] tabular-nums tracking-[0.12em] text-paper-dim">
            {pad(slide + 1)} / {pad(images.length)}
          </span>
        )}
      </div>
    </div>
  );
}

export function FrameStrip({
  name,
  images,
  slide,
  onSlide,
}: {
  name: string;
  images: string[];
  slide: number;
  onSlide: (index: number) => void;
}) {
  if (images.length < 2) return null;

  return (
    <div className="mx-auto mt-7 w-full max-w-[480px] overflow-x-auto [scrollbar-width:none]">
      <div className="flex w-max min-w-full justify-center gap-3 px-1 pb-3 pt-3">
        {images.map((src, i) => {
          const on = i === slide;
          return (
            <button
              key={src}
              type="button"
              onClick={() => onSlide(i)}
              aria-label={'Show frame ' + (i + 1) + ' of ' + name}
              aria-current={on ? 'true' : undefined}
              className={
                'relative w-[64px] shrink-0 cursor-pointer bg-paper p-[5px] pb-[9px] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.8)] transition-[transform,opacity] duration-300 ease-out max-[560px]:w-[54px] ' +
                (on ? '-translate-y-1.5 opacity-100' : (i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]') + ' opacity-60 hover:-translate-y-1 hover:rotate-0 hover:opacity-100')
              }
            >
              {on && <span className="pointer-events-none absolute -top-2 left-1/2 z-10 h-3 w-10 -translate-x-1/2 -rotate-2 bg-tape" />}
              <span className="relative block aspect-[4/3] overflow-hidden bg-bg-2">
                <SmartImage fill src={img(src, 320)} alt="" className="object-cover" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
