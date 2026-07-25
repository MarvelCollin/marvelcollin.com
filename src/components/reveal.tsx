import { useEffect, useRef, useState, type ReactNode } from 'react';

const REDUCED =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(REDUCED);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
