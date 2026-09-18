import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import { flipFrom, takeFlipOrigin } from '../../../lib/flip';
import { MEDIA } from '../../../lib/motion';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function useFlipIn(boxRef: RefObject<HTMLDivElement | null>, key: string | null) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !key) return;
    const origin = takeFlipOrigin();
    const still = matchMedia(MEDIA.reduceMotion).matches;
    const hero = box.querySelector<HTMLElement>('[data-hero]');

    box.querySelectorAll<HTMLElement>('[data-copy]').forEach((el, i) => {
      el.style.animationDelay = `${(origin ? 220 : 60) + i * 70}ms`;
    });

    if (still || !hero || !origin) return;
    const from = flipFrom(origin, hero.getBoundingClientRect());
    const flight = hero.animate(
      [{ transform: `translate(${from.x}px, ${from.y}px) scale(${from.scale}) rotate(${from.rotate}deg)` }, { transform: 'none' }],
      { duration: 820, easing: EASE },
    );
    return () => flight.cancel();
  }, [boxRef, key]);
}
