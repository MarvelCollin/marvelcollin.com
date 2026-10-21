import type { ContentState } from '../../types/content';
import type { ExperienceRow, RecognitionRow, WorkRow } from '../../types/rows';
import type { Education, Skill } from '../../types/content';
import { rowToAward } from './recognition';
import { rowToExperience } from './experience';
import { rowToWork } from './works';

export type ContentData = Pick<ContentState, 'works' | 'skills' | 'experience' | 'recognition' | 'education'>;

interface ContentRows {
  works: WorkRow[];
  skills: Skill[];
  experience: ExperienceRow[];
  recognition: RecognitionRow[];
  education: Education[];
}

export async function loadContent(): Promise<ContentData> {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
  const rows = (await res.json()) as ContentRows;
  return {
    works: rows.works.map(rowToWork),
    skills: rows.skills,
    experience: rows.experience.map(rowToExperience),
    recognition: rows.recognition.map(rowToAward),
    education: rows.education,
  };
}
