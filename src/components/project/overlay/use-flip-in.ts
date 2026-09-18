import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import { animate, createScope } from 'animejs';
import { flipFrom, takeFlipOrigin } from '../../../lib/flip';
import { MEDIA } from '../../../lib/motion';

export function useFlipIn(boxRef: RefObject<HTMLDivElement | null>, key: string | null) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !key) return;

    const hero = box.querySelector<HTMLElement>('[data-hero]');
    const copy = Array.from(box.querySelectorAll<HTMLElement>('[data-copy]'));
    const origin = takeFlipOrigin();

    const scope = createScope({ root: boxRef as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;

      if (hero && origin) {
        const from = flipFrom(origin, hero.getBoundingClientRect());
        animate(hero, {
          x: [from.x, 0],
          y: [from.y, 0],
          scale: [from.scale, 1],
          rotate: [from.rotate, 0],
          duration: 820,
          ease: 'out(4)',
        });
      }

      copy.forEach((el, i) => {
        el.style.animationDelay = `${(origin ? 220 : 60) + i * 70}ms`;
      });
    });

    return () => scope.revert();
  }, [boxRef, key]);
}
