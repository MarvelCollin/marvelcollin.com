import { useEffect, useRef } from 'react';
import { MEDIA } from '../lib/motion';

const FINE = 34;
const COARSE = 170;

export function Backdrop({
  numeral,
  label,
  sheet,
  total,
  progress,
}: {
  numeral: string;
  label: string;
  sheet: number;
  total: number;
  progress: number;
}) {
  const fine = useRef<HTMLDivElement>(null);
  const coarse = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (matchMedia(MEDIA.reduceMotion).matches) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const y = window.scrollY;
      const { x: px, y: py } = pointer.current;
      if (fine.current) {
        fine.current.style.transform = `translate3d(${px * 6}px, ${(-y * 0.05) % FINE + py * 6}px, 0)`;
      }
      if (coarse.current) {
        coarse.current.style.transform = `translate3d(${px * 14}px, ${(-y * 0.14) % COARSE + py * 14}px, 0)`;
      }
      if (numeralRef.current) {
        const reach = document.documentElement.scrollHeight - window.innerHeight;
        const travel = reach <= 0 ? 0 : (window.scrollY / reach - 0.5) * -120;
        numeralRef.current.style.transform = `translate3d(${px * 26}px, ${travel + py * 20}px, 0)`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
      schedule();
    };

    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div className="drafting" aria-hidden="true">
      <div ref={fine} className="drafting-grid drafting-fine" />
      <div ref={coarse} className="drafting-grid drafting-coarse" />
      <span ref={numeralRef} key={numeral} className="drafting-numeral">
        {numeral}
      </span>
      <div className="drafting-vignette" />
      <div className="sheet-marks" />
      <div className="sheet-block">
        <span>marvelcollin.com</span>
        <span className="sheet-rule" />
        <span>
          sheet {String(sheet).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="sheet-rule" />
        <span className="sheet-now">{label}</span>
        <span className="sheet-rule" />
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
