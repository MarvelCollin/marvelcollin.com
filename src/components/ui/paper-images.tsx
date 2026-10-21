import type { PaperPhoto } from '../../types/content';
import { responsive } from '../../lib/img';

export function PaperImages({ images, sizes, className = '' }: { images: PaperPhoto[]; sizes: string; className?: string }) {
  if (!images.length) return null;
  const pair = images.length > 1;
  return (
    <div className={'gap-3 ' + (pair ? 'grid grid-cols-[3fr_4fr] items-start max-[560px]:grid-cols-1 ' : 'mx-auto max-w-[560px] ') + className}>
      {images.map((image) => (
        <img key={image.src} {...responsive(image.src, sizes)} alt={image.alt} loading="lazy" className="h-auto w-full rounded-lg border border-line" />
      ))}
    </div>
  );
}
