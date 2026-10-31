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

const SNAPSHOT = 'content-v1';

function toData(rows: ContentRows): ContentData {
  return {
    works: rows.works.map(rowToWork),
    skills: rows.skills,
    experience: rows.experience.map(rowToExperience),
    recognition: rows.recognition.map(rowToAward),
    education: rows.education,
  };
}

// Last good response, so a repeat visit renders at once while fresh data loads.
export function cachedContent(): ContentData | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT);
    return raw ? toData(JSON.parse(raw) as ContentRows) : null;
  } catch {
    return null;
  }
}

export async function loadContent(): Promise<ContentData> {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
  const text = await res.text();
  const data = toData(JSON.parse(text) as ContentRows);
  try {
    localStorage.setItem(SNAPSHOT, text);
  } catch {
    // storage full or blocked
  }
  return data;
}
