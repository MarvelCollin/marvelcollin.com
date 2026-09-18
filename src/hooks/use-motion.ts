import { useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { createScope } from 'animejs';
import { MEDIA } from '../lib/motion';

type Setup<T> = (el: T) => void;

function run<T extends HTMLElement>(root: RefObject<T | null>, setup: Setup<T>) {
  const el = root.current;
  if (!el) return;
  const scope = createScope({ root: root as never, mediaQueries: MEDIA }).add((self) => {
    if (!self?.matches.reduceMotion) setup(el);
  });
  return () => scope.revert();
}

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function useMotion<T extends HTMLElement>(root: RefObject<T | null>, setup: Setup<T>, key: unknown = null) {
  const latest = useLatest(setup);
  useEffect(() => run(root, (el) => latest.current(el)), [root, latest, key]);
}

export function useLayoutMotion<T extends HTMLElement>(root: RefObject<T | null>, setup: Setup<T>, key: unknown = null) {
  const latest = useLatest(setup);
  useLayoutEffect(() => run(root, (el) => latest.current(el)), [root, latest, key]);
}
