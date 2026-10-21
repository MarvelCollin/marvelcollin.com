import { useCallback, useEffect, useRef, useState } from 'react';
import { paperSlugFromHash, slugFromHash } from '../lib/work-link';

function useHashSlug(parse: (hash: string) => string | null) {
  const [slug, setSlug] = useState(() => parse(location.hash));
  const pushed = useRef(false);

  useEffect(() => {
    const onHash = () => {
      const next = parse(location.hash);
      setSlug((current) => {
        if (!current && next) pushed.current = true;
        if (!next) pushed.current = false;
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [parse]);

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

export const useWorkHash = () => useHashSlug(slugFromHash);
export const usePaperHash = () => useHashSlug(paperSlugFromHash);
