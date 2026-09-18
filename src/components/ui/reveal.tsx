import { useRef, type ReactNode } from 'react';
import { animate, onScroll } from 'animejs';
import { EASE_OUT, ENTER, FADE_UP } from '../../lib/motion';
import { useMotion } from '../../hooks/use-motion';

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

  useMotion(
    root,
    (el) => {
      animate(el, {
        ...FADE_UP(20),
        duration: 700,
        delay,
        ease: EASE_OUT,
        autoplay: onScroll({ target: el, enter: ENTER, repeat: false }),
      });
    },
    delay,
  );

  return (
    <Tag ref={root as never} data-reveal id={id} className={className}>
      {children}
    </Tag>
  );
}
