import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Project, Skill, HistoryItem, Award, Education } from '../types/content';
import { fetchWorks } from '../lib/api/works';
import { fetchSkills } from '../lib/api/skills';
import { fetchExperience } from '../lib/api/experience';
import { fetchRecognition } from '../lib/api/recognition';
import { fetchEducation } from '../lib/api/education';
import { ContentContext } from './context';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [works, setWorks] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<HistoryItem[]>([]);
  const [recognition, setRecognition] = useState<Award[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [w, s, e, r, ed] = await Promise.all([
        fetchWorks(),
        fetchSkills(),
        fetchExperience(),
        fetchRecognition(),
        fetchEducation(),
      ]);
      setWorks(w);
      setSkills(s);
      setExperience(e);
      setRecognition(r);
      setEducation(ed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ works, skills, experience, recognition, education, loading, error, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}
