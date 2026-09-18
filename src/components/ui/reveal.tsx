import { useRef, type ReactNode } from 'react';
import { delay as wait } from '../../lib/motion';
import { useReveal } from '../../hooks/use-reveal';

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
  useReveal(root);

  return (
    <Tag ref={root as never} data-reveal id={id} className={className} style={wait(delay)}>
      {children}
    </Tag>
  );
}
