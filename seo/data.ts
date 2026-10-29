import { GET } from '../api/content';
import { PAPERS } from '../src/content/papers';
import { rowToExperience } from '../src/lib/api/experience';
import { rowToAward } from '../src/lib/api/recognition';
import { rowToWork } from '../src/lib/api/works';
import type { Award, Education, HistoryItem, Paper, Project, Skill } from '../src/types/content';
import type { ExperienceRow, RecognitionRow, WorkRow } from '../src/types/rows';

export interface SiteData {
  works: Project[];
  skills: Skill[];
  experience: HistoryItem[];
  recognition: Award[];
  education: Education[];
  papers: Paper[];
}

interface Rows {
  works: WorkRow[];
  skills: Skill[];
  experience: ExperienceRow[];
  recognition: RecognitionRow[];
  education: Education[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function loadSiteData(): Promise<SiteData> {
  const res = await GET();
  if (!res.ok) {
    throw new Error(`SEO prerender could not load content (${res.status}). Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.`);
  }
  const rows = (await res.json()) as Rows;
  const data: SiteData = {
    works: rows.works.map(rowToWork),
    skills: rows.skills,
    experience: rows.experience.map(rowToExperience),
    recognition: rows.recognition.map(rowToAward),
    education: rows.education,
    papers: PAPERS,
  };
  const bad = [...data.works, ...data.papers].map((x) => x.slug).filter((s) => !SLUG.test(s));
  if (bad.length) throw new Error(`SEO prerender found unsafe slugs: ${bad.join(', ')}`);
  return data;
}
