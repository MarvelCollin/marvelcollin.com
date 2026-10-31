import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cachedContent, loadContent, type ContentData } from '../lib/api/content';
import { ContentContext } from './context';

type Data = ContentData;

const EMPTY: Data = { works: [], skills: [], experience: [], recognition: [], education: [] };

const cached = cachedContent();
const initial = loadContent();
initial.catch(() => undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(cached ?? EMPTY);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (pending: Promise<Data>, quiet = false) => {
    if (!quiet) setLoading(true);
    setError(null);
    try {
      setData(await pending);
    } catch (err) {
      if (!quiet) setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => run(loadContent()), [run]);

  useEffect(() => {
    run(initial, cached !== null);
  }, [run]);

  const value = useMemo(() => ({ ...data, loading, error, refresh }), [data, loading, error, refresh]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
