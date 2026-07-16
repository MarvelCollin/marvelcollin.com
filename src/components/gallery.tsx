import { useMemo, useState } from 'react';
import { img } from '../lib/img';
import { Clip } from './clip';
import { Lightbox } from './lightbox';

const PHOTO_W = 140;
const FRAME_W = PHOTO_W + 16;
const PHOTO_H = Math.round((PHOTO_W * 3) / 4) + 16;
const GAP = 38;
const SPACING = FRAME_W + GAP;
const BASE_Y = 30;
const SAG = 26;
const ROT = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-1', 'rotate-1'];

export function Gallery({ images, captions, name }: { images: string[]; captions: string[]; name: string }) {
  const [zoom, setZoom] = useState<number | null>(null);
  const n = images.length;
  const lineW = Math.max((n + 1) * SPACING, 520);
  const boxH = BASE_Y + SAG + PHOTO_H + 40;
  const points = useMemo(
    () =>
      images.map((_, j) => {
        const t = (j + 1) / (n + 1);
        return { x: t * lineW, y: BASE_Y + 4 * SAG * t * (1 - t) };
      }),
    [images, n, lineW],
  );

  if (images.length === 0) return null;

  return (
    <div className="mx-auto max-w-[1320px] px-10 py-[60px] max-[900px]:px-[22px] max-[900px]:py-[30px]">
      <div className="rounded-2xl bg-[radial-gradient(rgba(255,255,255,0.028)_1px,transparent_1px)] [background-size:22px_22px] px-4 py-6 sm:px-8">
        <div className="overflow-x-auto">
          <div className="relative mx-auto" style={{ width: lineW, height: boxH }}>
            <svg className="pointer-events-none absolute inset-0" width={lineW} height={boxH} viewBox={`0 0 ${lineW} ${boxH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={`M0 ${BASE_Y} Q ${lineW / 2} ${BASE_Y + 2 * SAG} ${lineW} ${BASE_Y}`} fill="none" stroke="#6f6450" strokeWidth="2.6" strokeLinecap="round" />
              <path d={`M0 ${BASE_Y} Q ${lineW / 2} ${BASE_Y + 2 * SAG} ${lineW} ${BASE_Y}`} fill="none" stroke="#c5b896" strokeWidth="1" strokeLinecap="round" />
              <circle cx="0" cy={BASE_Y} r="4" fill="#231f1a" />
              <circle cx={lineW} cy={BASE_Y} r="4" fill="#231f1a" />
            </svg>

            {images.map((src, j) => (
              <button
                type="button"
                key={j}
                onClick={() => setZoom(j)}
                aria-label={'Enlarge image ' + (j + 1)}
                className={
                  'group/thumb absolute block origin-top cursor-zoom-in transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:rotate-0 ' +
                  ROT[j % ROT.length]
                }
                style={{ left: points[j].x - FRAME_W / 2, top: points[j].y }}
              >
                <Clip className="absolute left-1/2 top-[-19px] z-20 h-[36px] w-[18px] -translate-x-1/2 drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]" />
                <span
                  className="block bg-[#e9e3d6] p-2 shadow-[0_16px_28px_-14px_rgba(0,0,0,0.78)] transition-shadow duration-300 group-hover/thumb:shadow-[0_28px_48px_-16px_rgba(0,0,0,0.85)]"
                  style={{ width: FRAME_W }}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-bg-2">
                    <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-500" src={img(src, 600)} alt={captions[j] || name} loading="lazy" decoding="async" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {zoom !== null && (
        <Lightbox
          images={images}
          captions={captions}
          name={name}
          index={zoom}
          onClose={() => setZoom(null)}
          onNav={(d) => setZoom((z) => (z === null ? z : (z + d + n) % n))}
        />
      )}
    </div>
  );
}
