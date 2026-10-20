import { useEffect } from 'react';
import type { RefObject } from 'react';

let observer: IntersectionObserver | null = null;

function shared() {
  observer ??= new IntersectionObserver((entries) => {
    for (const e of entries) e.target.toggleAttribute('data-off', !e.isIntersecting);
  });
  return observer;
}

export function useOffscreenPause(ref: RefObject<Element | null>, active = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    shared().observe(el);
    return () => {
      shared().unobserve(el);
      el.removeAttribute('data-off');
    };
  }, [ref, active]);
}
