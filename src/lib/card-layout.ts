export const CARD_ASPECT = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/6]', 'aspect-[4/3]', 'aspect-[4/5]'];

export const CARD_ROT = ['-rotate-2', 'rotate-1', 'rotate-3', '-rotate-3', 'rotate-2', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-3'];

const CARD_RATIO = [4 / 5, 1, 3 / 4, 5 / 6, 4 / 3, 4 / 5];
const SHOT_RATIO = 16 / 10;

export function cardSizes(index: number): string {
  const zoom = Math.max(1, SHOT_RATIO / CARD_RATIO[index % CARD_RATIO.length]);
  return `(max-width: 640px) ${Math.round(92 * zoom)}vw, (max-width: 1024px) ${Math.round(46 * zoom)}vw, ${Math.round(380 * zoom)}px`;
}
