import { useEffect } from 'react';
import { img } from '../lib/img';
import { SmartImage } from './smart-image';

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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  const caption = captions[index];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 max-[560px]:p-4" role="dialog" aria-modal="true">
      <button className="lb-fade absolute inset-0 cursor-zoom-out bg-[rgba(8,8,7,0.84)]" aria-label="Close" onClick={onClose} />
      {images.length > 1 && (
        <>
          <button
            className="absolute left-5 top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(233,227,214,0.12)] text-[22px] text-fg transition-colors hover:bg-[rgba(233,227,214,0.24)]"
            onClick={() => onNav(-1)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="absolute right-5 top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(233,227,214,0.12)] text-[22px] text-fg transition-colors hover:bg-[rgba(233,227,214,0.24)]"
            onClick={() => onNav(1)}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}
      <div key={index} className="lb-pop relative z-[2]">
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
          className="absolute -right-3 -top-3 z-[3] flex h-9 w-9 items-center justify-center rounded-full bg-[#e9e3d6] text-[20px] leading-none text-[#2a2620] shadow-[0_6px_16px_-4px_rgba(0,0,0,0.6)] transition-transform hover:scale-110"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
