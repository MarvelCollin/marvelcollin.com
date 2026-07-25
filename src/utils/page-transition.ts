import type { Dir, Variant } from '../Interface/IVariant';

const EASE = 'cubic-bezier(0.45, 0, 0.15, 1)';
const IRIS_EASE = 'cubic-bezier(0.40, 0, 0.15, 1)';

const FILL = '#0c0b09';
const EDGE = '#2a2720';

const HOLD = 100;

const VARIANTS: Variant[] = [
  { type: 'wipe', dir: 'right' },
  { type: 'wipe', dir: 'left' },
  { type: 'wipe', dir: 'up' },
  { type: 'wipe', dir: 'down' },
  { type: 'iris' },
  { type: 'split' },
];

const WIPE: Record<Dir, [string, string, string]> = {
  right: ['translateX(-100%)', 'translateX(0%)', 'translateX(100%)'],
  left: ['translateX(100%)', 'translateX(0%)', 'translateX(-100%)'],
  down: ['translateY(-100%)', 'translateY(0%)', 'translateY(100%)'],
  up: ['translateY(100%)', 'translateY(0%)', 'translateY(-100%)'],
};

const C0 = 'circle(0vmax at 50% 50%)';
const C1 = 'circle(150vmax at 50% 50%)';

let last = -1;
function pick(): Variant {
  let i = Math.floor(Math.random() * VARIANTS.length);
  if (i === last) i = (i + 1) % VARIANTS.length;
  last = i;
  return VARIANTS[i];
}

function panel(parent: HTMLElement, css: string): HTMLElement {
  const p = document.createElement('div');
  p.style.cssText = 'position:absolute;inset:0;will-change:transform,clip-path;' + css;
  parent.appendChild(p);
  return p;
}

function buildWipe(o: HTMLElement, v: Variant, onCovered: () => void): () => Promise<unknown> {
  const [from, mid, to] = WIPE[v.dir as Dir];
  const axis = v.dir === 'left' || v.dir === 'right' ? 'to right' : 'to bottom';
  const grad = `linear-gradient(${axis}, ${EDGE} 0%, ${FILL} 7%, ${FILL} 93%, ${EDGE} 100%)`;
  const p = panel(o, `background:${grad};transform:${from};`);
  p.animate([{ transform: from }, { transform: mid }], { duration: 620, easing: EASE, fill: 'forwards' }).finished.then(onCovered);
  return () => p.animate([{ transform: mid }, { transform: to }], { duration: 680, easing: EASE, fill: 'forwards' }).finished;
}

function buildIris(o: HTMLElement, onCovered: () => void): () => Promise<unknown> {
  const gold = panel(o, `background:${EDGE};clip-path:${C0};`);
  const dark = panel(o, `background:${FILL};clip-path:${C0};`);
  gold.animate([{ clipPath: C0 }, { clipPath: C1 }], { duration: 700, easing: IRIS_EASE, fill: 'forwards' });
  dark.animate([{ clipPath: C0 }, { clipPath: C1 }], { duration: 700, delay: 40, easing: IRIS_EASE, fill: 'forwards' }).finished.then(onCovered);
  return () =>
    Promise.all([
      dark.animate([{ clipPath: C1 }, { clipPath: C0 }], { duration: 700, easing: IRIS_EASE, fill: 'forwards' }).finished,
      gold.animate([{ clipPath: C1 }, { clipPath: C0 }], { duration: 700, delay: 40, easing: IRIS_EASE, fill: 'forwards' }).finished,
    ]);
}

function buildSplit(o: HTMLElement, onCovered: () => void): () => Promise<unknown> {
  const top = panel(o, `bottom:auto;height:50%;background:linear-gradient(to bottom, ${FILL} 0%, ${FILL} 86%, ${EDGE} 100%);transform:translateY(-100%);`);
  const bot = panel(o, `top:auto;height:50%;background:linear-gradient(to top, ${FILL} 0%, ${FILL} 86%, ${EDGE} 100%);transform:translateY(100%);`);
  const a = top.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0%)' }], { duration: 620, easing: EASE, fill: 'forwards' });
  const b = bot.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0%)' }], { duration: 620, easing: EASE, fill: 'forwards' });
  Promise.all([a.finished, b.finished]).then(onCovered);
  return () =>
    Promise.all([
      top.animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(-100%)' }], { duration: 660, easing: EASE, fill: 'forwards' }).finished,
      bot.animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(100%)' }], { duration: 660, easing: EASE, fill: 'forwards' }).finished,
    ]);
}

export function runTransition(): Promise<void> {
  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return new Promise(resolve => {
    const o = document.createElement('div');
    o.className = 'pt-overlay';
    o.style.background = 'transparent';
    document.body.appendChild(o);

    if (reduce) {
      const p = panel(o, `background:${FILL};opacity:0;`);
      p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease', fill: 'forwards' }).finished.then(() => {
        resolve();
        p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease', fill: 'forwards' }).finished.then(() => o.remove());
      });
      return;
    }

    const v = pick();
    let reveal: () => Promise<unknown> = () => Promise.resolve();
    const onCovered = () => {
      resolve();
      setTimeout(() => reveal().then(() => o.remove()), HOLD);
    };
    reveal = v.type === 'iris' ? buildIris(o, onCovered) : v.type === 'split' ? buildSplit(o, onCovered) : buildWipe(o, v, onCovered);
  });
}
