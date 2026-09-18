import { useEffect } from 'react';
import type { RefObject } from 'react';
import { MEDIA } from '../lib/motion';

let observer: IntersectionObserver | null = null;

function shared() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-in', '');
        observer?.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -60px 0px' },
  );
  return observer;
}

export function useReveal(ref: RefObject<Element | null>, key: unknown = null) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia(MEDIA.reduceMotion).matches) {
      el.setAttribute('data-in', '');
      return;
    }
    el.removeAttribute('data-in');
    shared().observe(el);
    return () => shared().unobserve(el);
  }, [ref, key]);
}
