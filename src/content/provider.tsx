import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ContentState } from '../types/content';
import { works } from '../lib/api/works';
import { skills } from '../lib/api/skills';
import { experience } from '../lib/api/experience';
import { recognition } from '../lib/api/recognition';
import { education } from '../lib/api/education';
import { ContentContext } from './context';

type Data = Pick<ContentState, 'works' | 'skills' | 'experience' | 'recognition' | 'education'>;

const EMPTY: Data = { works: [], skills: [], experience: [], recognition: [], education: [] };

async function loadAll(): Promise<Data> {
  const [w, s, e, r, ed] = await Promise.all([
    works.list(),
    skills.list(),
    experience.list(),
    recognition.list(),
    education.list(),
  ]);
  return { works: w, skills: s, experience: e, recognition: r, education: ed };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loadAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ ...data, loading, error, refresh }), [data, loading, error, refresh]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
