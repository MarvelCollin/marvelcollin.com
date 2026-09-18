import { useEffect, useRef, type ReactNode } from 'react';
import { animate, createScope, onScroll, utils } from 'animejs';
import { EASE_OUT, ENTER, MEDIA, failOpen } from '../lib/motion';

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
    let cancel = () => {};

    const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
      if (self?.matches.reduceMotion) return;
      utils.set(el, { opacity: 0, y: 20 });
      const observer = onScroll({ target: el, enter: ENTER, repeat: false });
      animate(el, {
        opacity: 1,
        y: 0,
        duration: 700,
        delay,
        ease: EASE_OUT,
        autoplay: observer,
      });
      cancel = failOpen(el, el, () => utils.set(el, { opacity: 1, y: 0 }));
    });

    return () => {
      cancel();
      scope.revert();
    };
  }, [delay]);

  return (
    <Tag ref={root as never} id={id} className={className}>
      {children}
    </Tag>
  );
}
