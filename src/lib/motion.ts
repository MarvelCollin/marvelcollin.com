export const MEDIA = {
  reduceMotion: '(prefers-reduced-motion: reduce)',
  isSmall: '(max-width: 900px)',
};

export const EASE_OUT = 'out(3)';

export const ENTER = { target: 'top', container: 'bottom-=60' };

const GRACE = 700;
const MAX_CHECKS = 4;

export function failOpen(watch: Element, probes: Element[], reveal: () => void): () => void {
  let timer = 0;
  let checks = 0;

  const allShown = () => probes.every((p) => getComputedStyle(p).opacity === '1');

  const arm = () => {
    timer = window.setTimeout(() => {
      timer = 0;
      checks += 1;
      if (!allShown()) reveal();
      if (allShown() || checks >= MAX_CHECKS) observer.disconnect();
      else arm();
    }, GRACE);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          clearTimeout(timer);
          timer = 0;
          continue;
        }
        if (!timer) arm();
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
