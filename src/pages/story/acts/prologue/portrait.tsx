import { responsive } from '../../../../lib/img';
import { delay } from '../../../../lib/motion';

const PHOTO = '/me/portrait.webp';

export function Portrait() {
  return (
    <figure
      data-part="portrait"
      style={delay(200)}
      className="relative w-[250px] shrink-0 rotate-[2.5deg] transition-transform duration-500 ease-out hover:rotate-0 max-[900px]:w-[170px] max-[560px]:w-[118px]"
    >
      <span className="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 bg-tape shadow-[0_1px_5px_rgba(0,0,0,0.35)] max-[560px]:h-4 max-[560px]:w-14" />
      <div className="bg-paper p-3 pb-2 shadow-[0_30px_60px_-22px_rgba(0,0,0,0.85)] max-[560px]:p-1.5 max-[560px]:pb-1">
        <img
          {...responsive(PHOTO, '(max-width: 560px) 118px, (max-width: 900px) 170px, 250px', 400)}
          alt="Marvel Collin"
          width={640}
          height={800}
          fetchPriority="high"
          className="block aspect-[4/5] w-full object-cover"
        />
        <figcaption className="flex justify-between pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim max-[560px]:hidden">
          <span>Marvel Collin</span>
          <span>Jakarta</span>
        </figcaption>
      </div>
    </figure>
  );
}
