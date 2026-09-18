import { img } from '../../../lib/img';
import { SmartImage } from '../../ui/smart-image';

const PRINT =
  'relative w-[64px] shrink-0 cursor-pointer bg-paper p-[5px] pb-[9px] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.8)] transition-[transform,opacity] duration-300 ease-out max-[560px]:w-[54px]';

function printState(on: boolean, i: number) {
  if (on) return '-translate-y-1.5 opacity-100';
  const tilt = i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]';
  return tilt + ' opacity-60 hover:-translate-y-1 hover:rotate-0 hover:opacity-100';
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
              className={PRINT + ' ' + printState(on, i)}
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
