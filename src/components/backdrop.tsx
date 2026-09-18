import { useEffect, useRef } from 'react';
import { MEDIA } from '../lib/motion';
import { strokeTerrain, traceTerrain, type Contours } from '../lib/terrain';

const TRAVEL = 320;

function tone(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function Backdrop({
  numeral,
  label,
  sheet,
  total,
}: {
  numeral: string;
  label: string;
  sheet: number;
  total: number;
}) {
  const terrain = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLCanvasElement>(null);
  const lit = useRef<HTMLCanvasElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = terrain.current;
    if (!wrap || !base.current || !lit.current) return;
    const baseCanvas = base.current;
    const litCanvas = lit.current;
    const still = matchMedia(MEDIA.reduceMotion).matches;
    const pointer = { x: 0, y: 0 };
    let contours: Contours | null = null;
    let width = 0;
    let height = 0;
    let offset = 0;
    let frame = 0;
    let retrace = 0;

    const stroke = () => {
      if (!contours) return;
      strokeTerrain(baseCanvas, contours, width, height, tone('--contour'), tone('--contour-index'));
      strokeTerrain(litCanvas, contours, width, height, tone('--contour-crest'), tone('--contour-crest'));
    };

    const trace = () => {
      width = window.innerWidth;
      height = window.innerHeight + TRAVEL;
      contours = traceTerrain(width, height);
      stroke();
    };

    const paint = () => {
      frame = 0;
      if (still) return;
      const reach = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = reach <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / reach));
      offset = ratio * TRAVEL;
      wrap.style.transform = `translate3d(0, ${-offset}px, 0)`;
      wrap.style.setProperty('--lx', `${pointer.x}px`);
      wrap.style.setProperty('--ly', `${pointer.y + offset}px`);
      if (numeralRef.current) {
        numeralRef.current.style.transform = `translate3d(0, ${(ratio - 0.5) * -120}px, 0)`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onResize = () => {
      clearTimeout(retrace);
      retrace = window.setTimeout(() => {
        if (window.innerWidth !== width || window.innerHeight + TRAVEL > height) trace();
        schedule();
      }, 180);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      wrap.dataset.lamp = 'on';
      schedule();
    };

    const onLeave = () => {
      delete wrap.dataset.lamp;
    };

    const theme = new MutationObserver(stroke);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    trace();
    paint();
    window.addEventListener('resize', onResize);
    if (!still) {
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(retrace);
      theme.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="drafting" aria-hidden="true">
      <div ref={terrain} className="drafting-terrain">
        <canvas ref={base} />
        <canvas ref={lit} className="drafting-lamp" />
      </div>
      <span ref={numeralRef} key={numeral} className="drafting-numeral">
        {numeral}
      </span>
      <div className="drafting-vignette" />
      <div className="sheet-marks" />
      <div className="sheet-block">
        <span>
          sheet {String(sheet).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="sheet-rule" />
        <span className="sheet-now">{label}</span>
      </div>
    </div>
  );
}
