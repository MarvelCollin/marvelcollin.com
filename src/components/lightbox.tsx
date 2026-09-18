import { useEffect } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { img } from '../lib/img';
import { useModal } from '../hooks/use-modal';
import { useDismiss } from '../hooks/use-dismiss';
import { SmartImage } from './smart-image';

const ARROW = 'absolute top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(233,227,214,0.12)] text-[22px] text-fg transition-colors hover:bg-[rgba(233,227,214,0.24)]';

export function Lightbox({
  images,
  captions,
  name,
  index,
  onClose,
  onNav,
}: {
  images: string[];
  captions: string[];
  name: string;
  index: number;
  onClose: () => void;
  onNav: (d: number) => void;
}) {
  const boxRef = useModal<HTMLDivElement>(onClose);
  const dismiss = useDismiss<HTMLDivElement>(onClose, '[data-frame]');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNav]);

  const hold = (e: ReactPointerEvent<HTMLDivElement>) => e.stopPropagation();

  const caption = captions[index];
  return (
    <div
      ref={boxRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center p-6 outline-none max-[560px]:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={caption || name}
      onPointerDown={(e) => {
        hold(e);
        dismiss.onPointerDown(e);
      }}
      onPointerUp={(e) => {
        hold(e);
        dismiss.onPointerUp(e);
      }}
      onPointerCancel={dismiss.onPointerCancel}
      onClick={(e) => e.stopPropagation()}
    >
      <div aria-hidden="true" className="lb-fade absolute inset-0 bg-[rgba(8,8,7,0.84)]" />
      {images.length > 1 && (
        <>
          <button
            type="button"
            data-frame
            className={ARROW + ' left-5 cursor-pointer max-[560px]:left-2'}
            onClick={() => onNav(-1)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            data-frame
            className={ARROW + ' right-5 cursor-pointer max-[560px]:right-2'}
            onClick={() => onNav(1)}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}
      <div key={index} data-frame className="lb-pop relative z-[2] cursor-auto">
        <div className="bg-[#e9e3d6] p-[18px] shadow-[0_40px_90px_-24px_rgba(0,0,0,0.9)] max-[560px]:p-3">
          <div className="relative overflow-hidden bg-bg-2">
            <SmartImage
              eager
              src={img(images[index], 1600)}
              alt={caption || name}
              className="block max-h-[78vh] max-w-[86vw] object-contain"
              skelStyle={{ width: 'min(70vw, 720px)', height: 'min(52vh, 480px)' }}
            />
          </div>
          <div className="px-1 pt-3 text-center text-[16px] font-medium leading-tight text-[#2a2620]">{caption || name}</div>
        </div>
        <button
          type="button"
          className="absolute -right-3 -top-3 z-[3] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#e9e3d6] text-[20px] leading-none text-[#2a2620] shadow-[0_6px_16px_-4px_rgba(0,0,0,0.6)] transition-transform hover:scale-110"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
