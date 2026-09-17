import type { ReactNode } from 'react';
import { REDUCED, useInView } from '../hooks/use-in-view';

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
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={className}
      style={
        REDUCED
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }
      }
    >
      {children}
    </Tag>
  );
}
