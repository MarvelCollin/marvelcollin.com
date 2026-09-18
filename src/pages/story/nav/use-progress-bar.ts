import { useEffect, useRef } from 'react';
import { listen, onFrame, scrollRatio } from '../../../lib/dom';

export function useProgressBar() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const frame = onFrame(() => {
      if (bar.current) bar.current.style.transform = `scaleX(${scrollRatio()})`;
    });
    frame.schedule();
    const offs = [listen(window, 'scroll', frame.schedule, { passive: true }), listen(window, 'resize', frame.schedule)];
    return () => {
      frame.cancel();
      offs.forEach((off) => off());
    };
  }, []);

  return bar;
}
