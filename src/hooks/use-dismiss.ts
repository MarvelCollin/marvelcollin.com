import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

export function useDismiss<T extends HTMLElement>(onClose: () => void, keep: string) {
  const armed = useRef(false);

  const outside = (target: EventTarget | null) => {
    const el = target as Element | null;
    return !el?.closest ? true : !el.closest(keep);
  };

  return {
    onPointerDown: (e: ReactPointerEvent<T>) => {
      armed.current = e.button === 0 && outside(e.target);
    },
    onPointerUp: (e: ReactPointerEvent<T>) => {
      const leave = armed.current && e.button === 0 && outside(e.target);
      armed.current = false;
      if (leave) onClose();
    },
    onPointerCancel: () => {
      armed.current = false;
    },
  };
}
