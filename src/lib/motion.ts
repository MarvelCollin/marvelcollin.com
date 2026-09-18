import type { CSSProperties } from 'react';

export const MEDIA = {
  reduceMotion: '(prefers-reduced-motion: reduce)',
};

export const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;
