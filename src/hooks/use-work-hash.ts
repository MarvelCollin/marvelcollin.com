import { useCallback, useEffect, useRef, useState } from 'react';
import { slugFromHash } from '../lib/work-link';

export function useWorkHash() {
  const [slug, setSlug] = useState(() => slugFromHash(location.hash));
  const pushed = useRef(false);

  useEffect(() => {
    const onHash = () => {
      const next = slugFromHash(location.hash);
      setSlug((current) => {
        if (!current && next) pushed.current = true;
        if (!next) pushed.current = false;
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      history.back();
      return;
    }
    history.replaceState(null, '', location.pathname + location.search);
    setSlug(null);
  }, []);

  return { slug, close };
}
