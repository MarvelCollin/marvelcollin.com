import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type State = 'load' | 'ok' | 'fail';

export const SmartImage = memo(function SmartImage({
  src,
  alt,
  className = '',
  wrapClassName = '',
  style,
  wrapStyle,
  skelStyle,
  fill = false,
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  wrapClassName?: string;
  style?: CSSProperties;
  wrapStyle?: CSSProperties;
  skelStyle?: CSSProperties;
  fill?: boolean;
  eager?: boolean;
}) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<State>('load');

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.currentSrc) setState(el.naturalWidth > 0 ? 'ok' : 'fail');
    else setState('load');
  }, [src]);

  const done = state === 'ok';

  return (
    <span
      className={'sm-img' + (fill ? ' is-fill' : '') + (wrapClassName ? ' ' + wrapClassName : '')}
      style={{ ...wrapStyle, ...(done ? null : skelStyle) }}
    >
      {src && (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('fail')}
          className={(fill ? 'absolute inset-0 h-full w-full ' : '') + className}
          style={{
            ...style,
            opacity: done ? 1 : 0,
            transform: done ? 'scale(1)' : 'scale(1.015)',
            transition: 'opacity .45s ease, transform .6s ease',
          }}
        />
      )}
      <span className="sm-skel" style={{ opacity: state === 'load' ? 1 : 0 }} aria-hidden="true" />
      {state === 'fail' && (
        <span className="sm-fail" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.4" />
            <path d="M21 15.5 16 11l-6.5 6" />
          </svg>
        </span>
      )}
    </span>
  );
});
