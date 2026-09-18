import { useEffect, useState } from 'react';

type Idle = (fn: () => void, options?: { timeout: number }) => number;

export const onIdle: Idle = (fn, options) =>
  window.requestIdleCallback ? window.requestIdleCallback(fn, options) : window.setTimeout(fn, 1);

export function useIdle(immediate = false, timeout = 300) {
  const [ready, setReady] = useState(immediate);

  useEffect(() => {
    if (ready) return;
    const id = onIdle(() => setReady(true), { timeout });
    return () => (window.cancelIdleCallback ?? clearTimeout)(id);
  }, [ready, timeout]);

  return ready;
}
