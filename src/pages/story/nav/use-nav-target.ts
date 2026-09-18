import { useEffect, useState } from 'react';

const GIVE_UP = 2000;

export function useNavTarget(settled: string) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const arrived = pinned !== null && pinned === settled;

  useEffect(() => {
    if (!pinned) return;
    if (arrived) return setPinned(null);
    const timer = window.setTimeout(() => setPinned(null), GIVE_UP);
    return () => clearTimeout(timer);
  }, [pinned, arrived]);

  return {
    current: hover ?? pinned ?? settled,
    enter: (id: string) => setHover(id),
    leave: () => setHover(null),
    pin: (id: string) => setPinned(id),
  };
}
