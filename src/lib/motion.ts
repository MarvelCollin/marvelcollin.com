export const MEDIA = {
  reduceMotion: '(prefers-reduced-motion: reduce)',
  isSmall: '(max-width: 900px)',
};

export const EASE_OUT = 'out(3)';

export const ENTER = { target: 'top', container: 'bottom-=60' };

const ENGINE_GRACE = 1200;

export function failOpen(isLive: () => boolean, reveal: () => void): () => void {
  const id = setTimeout(() => {
    if (!isLive()) reveal();
  }, ENGINE_GRACE);
  return () => clearTimeout(id);
}
