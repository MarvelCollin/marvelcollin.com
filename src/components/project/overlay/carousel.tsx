import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Project } from '../../../types/content';
import { img } from '../../../lib/img';
import { SmartImage } from '../../ui/smart-image';
import { Thumbnail } from '../thumbnail';

const ARROW =
  'absolute top-1/2 z-[3] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[rgba(10,20,26,0.72)] text-[18px] text-fg opacity-0 transition-opacity duration-200 hover:bg-[rgba(10,20,26,0.9)] focus-visible:opacity-100 group-hover/frame:opacity-100 max-[900px]:opacity-100';

const SWIPE = 40;

const pad = (n: number) => String(n).padStart(2, '0');

function useSwipe(onSwipe: (direction: 1 | -1) => void, onTap: () => void) {
  const start = useRef<{ x: number; moved: boolean } | null>(null);

  return {
    onPointerDown: (e: ReactPointerEvent) => {
      start.current = { x: e.clientX, moved: false };
    },
    onPointerUp: (e: ReactPointerEvent) => {
      const s = start.current;
      if (!s) return;
      const dx = e.clientX - s.x;
      if (Math.abs(dx) <= SWIPE) return;
      s.moved = true;
      onSwipe(dx < 0 ? 1 : -1);
    },
    onClick: () => {
      const moved = start.current?.moved;
      start.current = null;
      if (!moved) onTap();
    },
  };
}

function Track({ p, images, slide }: { p: Project; images: string[]; slide: number }) {
  return (
    <div
      className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: `translate3d(${-slide * 100}%, 0, 0)` }}
    >
      {images.map((src, i) => (
        <div key={src} className="relative h-full w-full shrink-0" aria-hidden={i !== slide}>
          <SmartImage
            fill
            eager={Math.abs(i - slide) <= 1}
            src={img(src)}
            alt={i === 0 ? p.name : ''}
            className="object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

export function FrameCarousel({
  p,
  images,
  slide,
  onStep,
  onOpen,
}: {
  p: Project;
  images: string[];
  slide: number;
  onStep: (direction: 1 | -1) => void;
  onOpen: (index: number) => void;
}) {
  const many = images.length > 1;
  const swipe = useSwipe((d) => many && onStep(d), () => onOpen(slide));

  return (
    <div className="bg-paper p-[16px] shadow-[0_34px_70px_-24px_rgba(0,0,0,0.85)] max-[560px]:p-3">
      <div className="group/frame relative aspect-[4/3] overflow-hidden bg-bg-2">
        {images.length === 0 ? (
          <Thumbnail p={p} />
        ) : (
          <button
            type="button"
            {...swipe}
            aria-label={'View ' + p.name + ' frame ' + (slide + 1) + ' full size'}
            className="absolute inset-0 block cursor-zoom-in touch-pan-y"
          >
            <Track p={p} images={images} slide={slide} />
          </button>
        )}
        {many && (
          <>
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous frame" className={ARROW + ' left-3'}>
              ‹
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="Next frame" className={ARROW + ' right-3'}>
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
