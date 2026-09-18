import { supabase, TABLES } from '../supabase';
import type { HistoryItem } from '../../types/content';
import type { ExperienceRow } from '../../types/rows';
import { guard, nextSort } from './internal';

export type ExperienceInput = Omit<HistoryItem, 'id' | 'sort'>;

function rowToExperience(r: ExperienceRow): HistoryItem {
  return { id: r.id, yr: r.yr, role: r.role, where: r.place, note: r.note, sort: r.sort };
}

function experienceToRow(e: ExperienceInput) {
  return { yr: e.yr, role: e.role, place: e.where, note: e.note };
}

export async function fetchExperience(): Promise<HistoryItem[]> {
  const { data, error } = await supabase.from(TABLES.experience).select('*').order('sort', { ascending: true });
  return guard(data as ExperienceRow[] | null, error).map(rowToExperience);
}

export async function createExperience(input: ExperienceInput): Promise<void> {
  const sort = await nextSort(TABLES.experience);
  const { error } = await supabase.from(TABLES.experience).insert({ ...experienceToRow(input), sort });
  if (error) throw new Error(error.message);
}

export async function updateExperience(id: string, input: ExperienceInput): Promise<void> {
  const { error } = await supabase.from(TABLES.experience).update(experienceToRow(input)).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from(TABLES.experience).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
