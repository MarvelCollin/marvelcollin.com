import type { RefObject } from 'react';
import { animate } from 'animejs';
import { flipFrom, takeFlipOrigin } from '../../../lib/flip';
import { useLayoutMotion } from '../../../hooks/use-motion';

export function useFlipIn(boxRef: RefObject<HTMLDivElement | null>, key: string | null) {
  useLayoutMotion(
    boxRef,
    (box) => {
      if (!key) return;
      const hero = box.querySelector<HTMLElement>('[data-hero]');
      const origin = takeFlipOrigin();

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

      box.querySelectorAll<HTMLElement>('[data-copy]').forEach((el, i) => {
        el.style.animationDelay = `${(origin ? 220 : 60) + i * 70}ms`;
      });
    },
    key,
  );
}
