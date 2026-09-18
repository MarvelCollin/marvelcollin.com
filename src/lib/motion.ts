export const MEDIA = {
  reduceMotion: '(prefers-reduced-motion: reduce)',
  isSmall: '(max-width: 900px)',
};

export const EASE_OUT = 'out(3)';

export const ENTER = { target: 'top', container: 'bottom-=60' };

const GRACE = 700;

export function failOpen(watch: Element, probe: Element, reveal: () => void): () => void {
  let timer = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          clearTimeout(timer);
          timer = 0;
          continue;
        }
        if (timer) continue;
        timer = window.setTimeout(() => {
          if (getComputedStyle(probe).opacity !== '1') reveal();
          observer.disconnect();
        }, GRACE);
      }
    },
    { threshold: 0.15 },
  );

  observer.observe(watch);

  return () => {
    clearTimeout(timer);
    observer.disconnect();
  };
}
