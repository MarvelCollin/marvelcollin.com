export const MEDIA = {
  reduceMotion: '(prefers-reduced-motion: reduce)',
  isSmall: '(max-width: 900px)',
};

export const EASE_OUT = 'out(3)';

export const ENTER = { target: 'top', container: 'bottom-=60' };

export const FADE_UP = (distance = 20) => ({
  opacity: [0, 1] as [number, number],
  y: [distance, 0] as [number, number],
});
