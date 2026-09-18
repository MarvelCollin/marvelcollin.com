import { useMemo, useState } from 'react';
import { useContent } from '../../../content/use-content';
import { img } from '../../../lib/img';
import { Reveal } from '../../../components/ui/reveal';
import { SmartImage } from '../../../components/ui/smart-image';
import { Lightbox } from '../../../components/project/lightbox';

export function Recognition() {
  const { recognition } = useContent();
  const [zoom, setZoom] = useState<number | null>(null);

  const shots = useMemo(() => recognition.filter((a) => a.image), [recognition]);
  const images = useMemo(() => shots.map((a) => a.image as string), [shots]);
  const captions = useMemo(() => shots.map((a) => `${a.name} · ${a.where}`), [shots]);

  return (
    <div className="max-w-[900px] space-y-8">
      {recognition.map((a, i) => {
        const shotIndex = a.image ? shots.findIndex((s) => s.id === a.id) : -1;
        return (
          <Reveal key={a.id} delay={Math.min(i, 5) * 60}>
            <div className="flex items-baseline gap-4 max-[560px]:flex-col max-[560px]:gap-1">
              <span className="shrink-0 text-[13px] tabular-nums text-muted">{a.yr}</span>
              <span className="text-[16px] font-medium">{a.name}</span>
              <span className="text-[14px] text-fg-dim max-[560px]:hidden">· {a.where}</span>
              <span className="hidden text-[14px] text-fg-dim max-[560px]:block">{a.where}</span>
            </div>
            {a.image && (
              <button
                type="button"
                onClick={() => setZoom(shotIndex)}
                aria-label={'View ' + a.name + ' full size'}
                className="mt-4 block w-fit max-w-[520px] cursor-zoom-in overflow-hidden rounded-lg border border-line bg-bg-2 transition-colors hover:border-accent"
              >
                <SmartImage
                  src={img(a.image, 1000)}
                  alt={a.name}
                  className="h-auto max-h-[340px] w-auto max-w-full object-contain"
                  skelStyle={{ width: 'min(320px, 100%)', aspectRatio: '4 / 3' }}
                />
              </button>
            )}
          </Reveal>
        );
      })}

      {zoom !== null && images.length > 0 && (
        <Lightbox
          images={images}
          captions={captions}
          name="Recognition"
          index={zoom}
          onClose={() => setZoom(null)}
          onNav={(d) => setZoom((z) => (z === null ? z : (z + d + images.length) % images.length))}
        />
      )}
    </div>
  );
}
