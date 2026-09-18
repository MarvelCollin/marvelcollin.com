import { useEffect, useRef } from 'react';
import { lockScroll } from '../lib/scroll-lock';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
const layers: object[] = [];

export function useModal<T extends HTMLElement>(onClose?: () => void) {
  const ref = useRef<T>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const layer = {};
    layers.push(layer);
    const opener = document.activeElement as HTMLElement | null;
    const release = lockScroll();
    ref.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (layers[layers.length - 1] !== layer) return;

      if (e.key === 'Escape') {
        if (!close.current) return;
        e.stopPropagation();
        close.current();
        return;
      }

      if (e.key !== 'Tab') return;
      const box = ref.current;
      if (!box) return;
      const items = Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === box)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      layers.splice(layers.indexOf(layer), 1);
      release();
      opener?.focus();
    };
  }, []);

  return ref;
}
