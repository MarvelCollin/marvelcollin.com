import { useLayoutEffect, useRef } from 'react';
import { listen } from '../../../lib/dom';

const PAD_X = 8;
const PAD_Y = 6;

function place(box: HTMLElement, mark: HTMLElement, target: string) {
  const link = box.querySelector<HTMLElement>(`a[data-id="${target}"]`);
  if (!link || link.offsetParent === null) {
    mark.style.opacity = '0';
    return;
  }
  const outer = box.getBoundingClientRect();
  const r = link.getBoundingClientRect();
  mark.style.setProperty('--x', `${r.left - outer.left - PAD_X}px`);
  mark.style.setProperty('--w', `${r.width + PAD_X * 2}px`);
  mark.style.setProperty('--y', `${r.top - outer.top - PAD_Y}px`);
  mark.style.setProperty('--h', `${r.height + PAD_Y * 2}px`);
  mark.style.opacity = '1';
  if (!mark.dataset.ready) requestAnimationFrame(() => (mark.dataset.ready = 'true'));
}

export function useNavMark(target: string) {
  const wrap = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = wrap.current;
    const el = mark.current;
    if (!box || !el) return;
    const update = () => place(box, el, target);
    update();
    document.fonts?.ready.then(update);
    return listen(window, 'resize', update);
  }, [target]);

  return { wrap, mark };
}
