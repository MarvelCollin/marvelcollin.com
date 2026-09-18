import { useEffect, useRef } from 'react';
import { MEDIA } from '../../../lib/motion';
import { listen, onFrame, scrollRatio } from '../../../lib/dom';
import { strokeTerrain, traceTerrain } from './terrain';
import type { Contours } from './terrain';

const TRAVEL = 320;
const NUMERAL_TRAVEL = 120;
const RETRACE_DELAY = 180;

const tone = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function useDrafting() {
  const terrain = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLCanvasElement>(null);
  const lit = useRef<HTMLCanvasElement>(null);
  const numeral = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = terrain.current;
    const baseCanvas = base.current;
    const litCanvas = lit.current;
    if (!wrap || !baseCanvas || !litCanvas) return;

    const still = matchMedia(MEDIA.reduceMotion).matches;
    const pointer = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };
    let retrace = 0;

    const draw = (contours: Contours) => {
      const { width, height } = size;
      strokeTerrain(baseCanvas, contours, width, height, tone('--contour'), tone('--contour-index'));
      strokeTerrain(litCanvas, contours, width, height, tone('--contour-crest'), tone('--contour-crest'));
    };

    const trace = () => {
      size.width = window.innerWidth;
      size.height = window.innerHeight + TRAVEL;
      draw(traceTerrain(size.width, size.height));
    };

    const frame = onFrame(() => {
      const ratio = scrollRatio();
      const offset = ratio * TRAVEL;
      wrap.style.transform = `translate3d(0, ${-offset}px, 0)`;
      wrap.style.setProperty('--lx', `${pointer.x}px`);
      wrap.style.setProperty('--ly', `${pointer.y + offset}px`);
      if (numeral.current) numeral.current.style.transform = `translate3d(0, ${(ratio - 0.5) * -NUMERAL_TRAVEL}px, 0)`;
    });

    const onResize = () => {
      clearTimeout(retrace);
      retrace = window.setTimeout(() => {
        if (window.innerWidth !== size.width || window.innerHeight + TRAVEL > size.height) trace();
        frame.schedule();
      }, RETRACE_DELAY);
    };

    const onPointer = (e: Event) => {
      const { pointerType, clientX, clientY } = e as PointerEvent;
      if (pointerType !== 'mouse' || document.body.style.overflow === 'hidden') return;
      pointer.x = clientX;
      pointer.y = clientY;
      wrap.dataset.lamp = 'on';
      frame.schedule();
    };

    trace();
    const offs = [listen(window, 'resize', onResize)];
    if (!still) {
      frame.schedule();
      offs.push(
        listen(window, 'scroll', frame.schedule, { passive: true }),
        listen(window, 'pointermove', onPointer, { passive: true }),
        listen(document.documentElement, 'pointerleave', () => delete wrap.dataset.lamp),
      );
    }

    return () => {
      frame.cancel();
      clearTimeout(retrace);
      offs.forEach((off) => off());
    };
  }, []);

  return { terrain, base, lit, numeral };
}
