import { useEffect, useRef, type ReactNode } from 'react';
import { animate, createScope, onScroll } from 'animejs';
import { EASE_OUT, ENTER, FADE_UP, MEDIA } from '../lib/motion';

export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'p' | 'span';
  delay?: number;
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;
      animate(el, {
        ...FADE_UP(20),
        duration: 700,
        delay,
        ease: EASE_OUT,
        autoplay: onScroll({ target: el, enter: ENTER, repeat: false }),
      });
    });

    return () => scope.revert();
  }, [delay]);

  return (
    <Tag ref={root as never} data-reveal id={id} className={className}>
      {children}
    </Tag>
  );
}
